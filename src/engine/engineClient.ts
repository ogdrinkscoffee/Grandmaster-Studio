import { Chess } from 'chess.js';
import { MoveAnalysis } from '../types/chess';
import { BotProfile, EngineLine, formatEvaluation, scoreMoveStyleBias } from './chessEngine';
import { CustomGameState, CustomMove } from './customVariantEngine';
import {
  AnalyzeMoveResult,
  EngineRequest,
  MoveInput,
  PlainMove,
  SearchResult,
  runEngineRequest,
  snapshotPosition,
  toPlainMove
} from './engineOps';
import { UciLine, UciSearchResult, UciStrength, stockfish } from './stockfishClient';

/**
 * Engine entry point for the whole app.
 *
 * Standard-rules positions go to Stockfish 19 (WASM, its own worker). Everything else — rule-changing
 * variants, unusual positions, or any Stockfish failure — falls back to the built-in engine, which runs
 * in two worker lanes so a bot search never waits behind move grading:
 *  - 'search':   bot moves, hints, candidate lines
 *  - 'analysis': per-move grading, full-game review, and plain-English move explanations
 */

// ---------------------------------------------------------------------------
// Built-in engine workers
// ---------------------------------------------------------------------------

type Lane = 'search' | 'analysis';

interface PendingRequest {
  req: EngineRequest;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}

interface LaneState {
  worker: Worker | null;
  pending: Map<number, PendingRequest>;
}

const lanes: Record<Lane, LaneState> = {
  search: { worker: null, pending: new Map() },
  analysis: { worker: null, pending: new Map() }
};

let nextId = 1;
let workersUnsupported = typeof Worker === 'undefined';

function runOnMainThread(p: PendingRequest) {
  // Yield first so the caller's render/paint isn't blocked by the fallback either
  setTimeout(() => {
    try {
      p.resolve(runEngineRequest(p.req));
    } catch (err) {
      p.reject(err);
    }
  }, 0);
}

function getWorker(lane: Lane): Worker | null {
  if (workersUnsupported) return null;
  const state = lanes[lane];
  if (state.worker) return state.worker;
  try {
    const worker = new Worker(new URL('./engine.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<{ id: number; result?: unknown; error?: string }>) => {
      const { id, result, error } = event.data;
      const p = state.pending.get(id);
      if (!p) return;
      state.pending.delete(id);
      if (error !== undefined) runOnMainThread(p);
      else p.resolve(result);
    };
    worker.onerror = () => {
      // Worker failed to load or crashed: finish outstanding work on the main thread
      worker.terminate();
      state.worker = null;
      workersUnsupported = true;
      const outstanding = [...state.pending.values()];
      state.pending.clear();
      outstanding.forEach(runOnMainThread);
    };
    state.worker = worker;
    return worker;
  } catch {
    workersUnsupported = true;
    return null;
  }
}

function request<T>(lane: Lane, req: EngineRequest): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const p: PendingRequest = { req, resolve: resolve as (v: unknown) => void, reject };
    const worker = getWorker(lane);
    if (!worker) {
      runOnMainThread(p);
      return;
    }
    const id = nextId++;
    lanes[lane].pending.set(id, p);
    worker.postMessage({ id, req });
  });
}

// ---------------------------------------------------------------------------
// Stockfish helpers
// ---------------------------------------------------------------------------

export interface EngineOptions {
  /** False for rule-changing variants: always use the built-in engine. Default true. */
  allowStockfish?: boolean;
}

const MATE_CP = 20000;
const LIVE_GRADE_MS = 150;
const REVIEW_GRADE_MS = 90;

/** Begin loading Stockfish in the background so the first real request is instant. */
export function warmUpEngine() {
  stockfish.warmUp();
}

/** Stockfish only knows standard chess: one king each, ≤16 men and ≤8 pawns per side, no back-rank pawns. */
export function isStockfishSafe(board: Chess): boolean {
  const counts = { w: { all: 0, k: 0, p: 0 }, b: { all: 0, k: 0, p: 0 } };
  const rows = board.board();
  for (let r = 0; r < 8; r++) {
    for (const sq of rows[r]) {
      if (!sq) continue;
      const c = counts[sq.color];
      c.all++;
      if (sq.type === 'k') c.k++;
      if (sq.type === 'p') {
        c.p++;
        if (r === 0 || r === 7) return false;
      }
    }
  }
  return (['w', 'b'] as const).every(color => counts[color].k === 1 && counts[color].all <= 16 && counts[color].p <= 8);
}

function canUseStockfish(board: Chess, opts?: EngineOptions): boolean {
  return opts?.allowStockfish !== false && !stockfish.isUnavailable && isStockfishSafe(board);
}

/** Drop castling rights whose king/rook aren't on their standard squares (e.g. Chess960 starts). */
function sanitizeFen(fen: string): string {
  const parts = fen.split(' ');
  if (parts.length < 4 || parts[2] === '-') return fen;
  let board: Chess;
  try {
    board = new Chess(fen, { skipValidation: true });
  } catch {
    return fen;
  }
  const at = (sq: string, type: string, color: 'w' | 'b') => {
    const p = board.get(sq as never);
    return Boolean(p && p.type === type && p.color === color);
  };
  const rights = parts[2]
    .split('')
    .filter(ch => {
      if (ch === 'K') return at('e1', 'k', 'w') && at('h1', 'r', 'w');
      if (ch === 'Q') return at('e1', 'k', 'w') && at('a1', 'r', 'w');
      if (ch === 'k') return at('e8', 'k', 'b') && at('h8', 'r', 'b');
      if (ch === 'q') return at('e8', 'k', 'b') && at('a8', 'r', 'b');
      return false;
    })
    .join('');
  parts[2] = rights || '-';
  return parts.join(' ');
}

function parseUci(uci: string): MoveInput {
  return { from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.length > 4 ? uci[4] : undefined };
}

function toUci(m: MoveInput): string {
  return `${m.from}${m.to}${m.promotion ?? ''}`;
}

/** UCI score (side to move) → White-perspective centipawns, mates mapped to ±(20000 − 2n). */
function whiteCp(line: UciLine | undefined, sideToMove: 'w' | 'b'): number {
  if (!line) return 0;
  let cp: number;
  if (line.mate !== undefined) cp = line.mate > 0 ? MATE_CP - 2 * line.mate : -MATE_CP - 2 * line.mate;
  else cp = line.cp ?? 0;
  return sideToMove === 'w' ? cp : -cp;
}

/** Play a UCI PV on a copy of the board and return SAN moves (stops at the first illegal move). */
function pvToSan(fen: string, pv: string[], maxPlies: number): string[] {
  const board = new Chess(fen);
  const out: string[] = [];
  for (const uci of pv.slice(0, maxPlies)) {
    try {
      out.push(board.move(parseUci(uci)).san);
    } catch {
      break;
    }
  }
  return out;
}

// Each position only needs evaluating once: the score after move N is the score before move N+1.
const evalCache = new Map<string, Promise<UciSearchResult>>();
const EVAL_CACHE_LIMIT = 400;

function evaluatePosition(fen: string, movetime: number): Promise<UciSearchResult> {
  const cached = evalCache.get(fen);
  if (cached) return cached;
  const pending = stockfish.search({ fen: sanitizeFen(fen), movetime, multipv: 2 });
  evalCache.set(fen, pending);
  pending.catch(() => evalCache.delete(fen));
  if (evalCache.size > EVAL_CACHE_LIMIT) {
    const oldest = evalCache.keys().next().value;
    if (oldest !== undefined) evalCache.delete(oldest);
  }
  return pending;
}

/** Grade one move with Stockfish scores, reusing the built-in classifier/commentary (in the analysis worker). */
async function stockfishGradeMove(fenBefore: string, move: MoveInput, plyIndex: number, movetime: number): Promise<AnalyzeMoveResult> {
  const before = new Chess(fenBefore);
  const legalMoveCount = before.moves().length;
  const mover = before.turn();
  const played = new Chess(fenBefore).move(move);
  const after = new Chess(fenBefore);
  after.move(move);

  const beforeEval = await evaluatePosition(fenBefore, movetime);
  if (!beforeEval.bestmove) throw new Error('no best move');
  const bestScore = whiteCp(beforeEval.lines[0], mover);
  const secondBestScore = beforeEval.lines[1] ? whiteCp(beforeEval.lines[1], mover) : bestScore;
  const best = parseUci(beforeEval.bestmove);
  const isBest = best.from === played.from && best.to === played.to && (best.promotion ?? undefined) === (played.promotion ?? undefined);

  let evalAfter: number;
  if (after.isCheckmate()) evalAfter = mover === 'w' ? MATE_CP : -MATE_CP;
  else if (after.isDraw()) evalAfter = 0;
  else if (isBest) evalAfter = bestScore;
  else {
    const afterEval = await evaluatePosition(after.fen(), movetime);
    evalAfter = whiteCp(afterEval.lines[0], after.turn());
  }

  return request<AnalyzeMoveResult>('analysis', {
    op: 'gradeFromScores',
    fenBefore,
    move: { from: played.from, to: played.to, promotion: played.promotion },
    best,
    bestScore,
    secondBestScore,
    evalAfter,
    pvSan: pvToSan(fenBefore, beforeEval.lines[0]?.pv ?? [beforeEval.bestmove], 3),
    legalMoveCount,
    plyIndex
  });
}

/** Map a bot rating onto Stockfish's strength controls. */
function botStrength(bot: BotProfile): { strength: UciStrength; movetime: number; depth?: number } {
  if (bot.elo >= 3190) return { strength: { kind: 'full' }, movetime: bot.timeLimitMs ?? 1000 };
  if (bot.elo >= 1320) {
    return { strength: { kind: 'elo', elo: bot.elo }, movetime: Math.round(300 + Math.min(600, (bot.elo - 1320) / 3)) };
  }
  // Below Stockfish's Elo floor: lowest skill levels plus a shallow depth cap
  if (bot.elo < 500) return { strength: { kind: 'skill', level: 0 }, movetime: 150, depth: 1 };
  if (bot.elo < 900) return { strength: { kind: 'skill', level: 1 }, movetime: 150, depth: 3 };
  return { strength: { kind: 'skill', level: 3 }, movetime: 200, depth: 5 };
}

function stockfishPosition(chess: Chess): { fen: string; moves: string[] } {
  const snap = snapshotPosition(chess);
  if (snap.startFen && snap.moves) return { fen: sanitizeFen(snap.startFen), moves: snap.moves.map(toUci) };
  return { fen: sanitizeFen(snap.fen), moves: [] };
}

function legalPlainMove(fen: string, uci: string | null): PlainMove {
  if (!uci) throw new Error('no move');
  return toPlainMove(new Chess(fen).move(parseUci(uci)));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function engineGetAIMove(chess: Chess, bot: BotProfile, opts?: EngineOptions): Promise<PlainMove | null> {
  const fen = chess.fen();
  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) return null;
  if (canUseStockfish(chess, opts)) {
    try {
      // Weak & adaptive-mercy bots keep calibrated human inaccuracies from the built-in engine
      if (bot.blunderRate > 0 && Math.random() < bot.blunderRate) {
        return await request<PlainMove | null>('search', {
          op: 'aiMove',
          position: snapshotPosition(chess),
          bot: { ...bot, blunderRate: 1 }
        });
      }
      const { strength, movetime, depth } = botStrength(bot);
      const style = bot.playStyle || 'balanced';
      const useStyledMultiPv =
        style !== 'balanced' && style !== 'adaptive' && bot.elo < 3100 && legalMoves.length > 1;
      const result = await stockfish.search(
        {
          ...stockfishPosition(chess),
          movetime,
          depth,
          strength,
          multipv: useStyledMultiPv ? Math.min(3, legalMoves.length) : 1
        },
        'bot'
      );

      if (useStyledMultiPv && result.lines.length > 1 && result.lines[0].mate === undefined) {
        const turn = chess.turn();
        const bestLineScore = whiteCp(result.lines[0], turn);
        const toleranceCp = bot.elo < 1000 ? 95 : bot.elo < 1650 ? 60 : bot.elo < 2200 ? 38 : 22;
        let bestPickedUci = result.bestmove;
        let bestCombined = -Infinity;

        for (const line of result.lines) {
          const uci = line.pv?.[0];
          if (!uci || line.mate !== undefined) continue;
          const lineScore = whiteCp(line, turn);
          const lossCp = turn === 'w' ? bestLineScore - lineScore : lineScore - bestLineScore;
          if (lossCp > toleranceCp) continue;

          const parsed = parseUci(uci);
          const moveObj = legalMoves.find(
            m => m.from === parsed.from && m.to === parsed.to && (m.promotion ?? undefined) === parsed.promotion
          );
          if (!moveObj) continue;

          const directionalCp = turn === 'w' ? lineScore : -lineScore;
          const combined = directionalCp + scoreMoveStyleBias(chess, moveObj, style);
          if (combined > bestCombined) {
            bestCombined = combined;
            bestPickedUci = uci;
          }
        }
        if (bestPickedUci) return legalPlainMove(fen, bestPickedUci);
      }

      return legalPlainMove(fen, result.bestmove);
    } catch {
      // fall through to the built-in engine
    }
  }
  return request('search', { op: 'aiMove', position: snapshotPosition(chess), bot });
}

export async function engineSearch(
  chess: Chess,
  maxDepth: number,
  timeLimitMs: number,
  options: { quiescenceDepth?: number; withReasons?: boolean } & EngineOptions = {}
): Promise<SearchResult> {
  const fen = chess.fen();
  if (canUseStockfish(chess, options) && chess.moves().length > 0) {
    try {
      const result = await stockfish.search({ ...stockfishPosition(chess), movetime: timeLimitMs }, 'hint');
      const bestMove = legalPlainMove(fen, result.bestmove);
      const score = whiteCp(result.lines[0], chess.turn());
      const reasons = options.withReasons
        ? (await request<string[][]>('analysis', { op: 'reasons', items: [{ fen, move: bestMove, score }] }))[0] ?? []
        : [];
      return { score, bestMove, reasons };
    } catch {
      // fall through
    }
  }
  return request('search', {
    op: 'search',
    position: snapshotPosition(chess),
    maxDepth,
    timeLimitMs,
    quiescenceDepth: options.quiescenceDepth,
    withReasons: options.withReasons
  });
}

export async function engineTopLines(
  fen: string,
  depth: number,
  count: number,
  timeLimitMs: number,
  opts?: EngineOptions
): Promise<EngineLine[]> {
  const board = new Chess(fen);
  if (board.moves().length === 0) return [];
  if (canUseStockfish(board, opts)) {
    try {
      const result = await stockfish.search(
        { fen: sanitizeFen(fen), movetime: timeLimitMs, multipv: Math.min(count, board.moves().length) },
        'topLines'
      );
      const turn = board.turn();
      const raw = result.lines
        .filter(l => l.pv.length > 0)
        .map(l => {
          const first = parseUci(l.pv[0]);
          const scoreCp = whiteCp(l, turn);
          return { first, scoreCp, pvSan: pvToSan(fen, l.pv, 4) };
        })
        .filter(l => l.pvSan.length > 0);
      if (raw.length === 0) throw new Error('no lines');
      const reasons = await request<string[][]>('analysis', {
        op: 'reasons',
        items: raw.map(l => ({ fen, move: l.first, score: l.scoreCp }))
      });
      return raw.map((l, i) => ({
        san: l.pvSan[0],
        from: l.first.from as EngineLine['from'],
        to: l.first.to as EngineLine['to'],
        promotion: l.first.promotion,
        pvSan: l.pvSan,
        scoreCp: l.scoreCp,
        formattedEval: formatEvaluation(l.scoreCp),
        reasons: reasons[i] ?? []
      }));
    } catch {
      // fall through
    }
  }
  return request('search', { op: 'topLines', fen, depth, count, timeLimitMs });
}

export async function engineAnalyzeMove(
  fenBefore: string,
  move: MoveInput,
  budgetMs: number,
  plyIndex: number,
  opts?: EngineOptions
): Promise<AnalyzeMoveResult> {
  if (canUseStockfish(new Chess(fenBefore), opts)) {
    try {
      return await stockfishGradeMove(fenBefore, move, plyIndex, LIVE_GRADE_MS);
    } catch {
      // fall through
    }
  }
  return request('analysis', { op: 'analyzeMove', fenBefore, move, budgetMs, plyIndex });
}

/** Full-game review. Each position is evaluated once by Stockfish; already-graded moves are kept as-is. */
export async function engineAnalyzeCompletedGame(moves: MoveAnalysis[], startFen?: string): Promise<MoveAnalysis[]> {
  let board: Chess;
  if (startFen) {
    try {
      board = new Chess(startFen);
    } catch {
      board = new Chess(startFen, { skipValidation: true });
    }
  } else {
    board = new Chess();
  }
  if (canUseStockfish(board)) {
    try {
      const enriched: MoveAnalysis[] = [];
      for (let i = 0; i < moves.length; i++) {
        const item = moves[i];
        const fenBefore = board.fen();
        let played;
        try {
          played = board.move(item.san);
        } catch {
          played = board.move({ from: item.from, to: item.to, promotion: item.promotion });
        }
        const alreadyRich =
          typeof item.moveAccuracy === 'number' && Boolean(item.bestMoveSan) && Boolean(item.commentary) && (item.pvSan?.length ?? 0) > 0;
        if (alreadyRich) {
          enriched.push(item);
          continue;
        }
        const q = await stockfishGradeMove(fenBefore, { from: played.from, to: played.to, promotion: played.promotion }, i, REVIEW_GRADE_MS);
        const keepBook = item.classification === 'book' && i < 8;
        enriched.push({
          ...item,
          classification: keepBook ? 'book' : q.classification,
          evalBefore: q.evalBefore,
          evalAfter: q.evalAfter,
          moveAccuracy: keepBook ? 100 : q.moveAccuracy,
          bestMoveSan: q.bestMoveSan,
          bestMoveFrom: q.bestMoveFrom,
          bestMoveTo: q.bestMoveTo,
          pvSan: q.pvSan,
          commentary: q.commentary
        });
      }
      return enriched;
    } catch {
      // fall through to the built-in engine for the whole game
    }
  }
  return request('analysis', { op: 'completedGame', moves, startFen });
}

export function engineGetCustomAIMove(
  state: CustomGameState,
  bot?: { elo: number; blunderRate: number }
): Promise<CustomMove | null> {
  return request('search', { op: 'customAIMove', state, bot: bot ? { elo: bot.elo, blunderRate: bot.blunderRate } : undefined });
}
