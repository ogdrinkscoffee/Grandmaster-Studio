import { Chess, Move } from 'chess.js';
import { MoveAnalysis } from '../types/chess';
import {
  BotProfile,
  EngineLine,
  MoveQualityAnalysis,
  analyzeCompletedGame,
  analyzeMoveInPosition,
  analyzeTopLines,
  buildMoveQuality,
  decodeMoveReasons,
  getAIMove,
  iterativeDeepeningSearch
} from './chessEngine';
import { CustomGameState, CustomMove, getCustomAIMove } from './customVariantEngine';

/**
 * Serializable engine requests. These run inside the engine Web Worker (see engine.worker.ts)
 * so heavy search never blocks rendering; `runEngineRequest` is also the synchronous fallback.
 */

export interface MoveInput {
  from: string;
  to: string;
  promotion?: string;
}

/** Plain-data copy of a chess.js Move (class instances don't survive postMessage). */
export interface PlainMove {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  piece: string;
  color: 'w' | 'b';
  flags: string;
  captured?: string;
}

/** A position plus its move history, so repetition-aware search sees the same game. */
export interface PositionSnapshot {
  fen: string;
  startFen?: string;
  moves?: MoveInput[];
}

export type EngineRequest =
  | { op: 'aiMove'; position: PositionSnapshot; bot: BotProfile }
  | { op: 'analyzeMove'; fenBefore: string; move: MoveInput; budgetMs: number; plyIndex: number }
  | { op: 'search'; position: PositionSnapshot; maxDepth: number; timeLimitMs: number; quiescenceDepth?: number; withReasons?: boolean }
  | { op: 'topLines'; fen: string; depth: number; count: number; timeLimitMs: number }
  | { op: 'completedGame'; moves: MoveAnalysis[]; startFen?: string }
  | { op: 'customAIMove'; state: CustomGameState; bot?: { elo: number; blunderRate: number } }
  /** Grade a move from externally computed (Stockfish) scores. Scores are White-perspective centipawns. */
  | {
      op: 'gradeFromScores';
      fenBefore: string;
      move: MoveInput;
      best: MoveInput;
      bestScore: number;
      secondBestScore: number;
      evalAfter: number;
      pvSan: string[];
      legalMoveCount: number;
      plyIndex: number;
    }
  /** Plain-English reasons for a batch of moves. */
  | { op: 'reasons'; items: { fen: string; move: MoveInput; score: number }[] };

export interface SearchResult {
  score: number;
  bestMove: PlainMove | null;
  reasons: string[];
}

export type AnalyzeMoveResult = MoveQualityAnalysis & { reasons: string[] };

export function toPlainMove(m: Move): PlainMove {
  return {
    from: m.from,
    to: m.to,
    promotion: m.promotion,
    san: m.san,
    piece: m.piece,
    color: m.color,
    flags: m.flags,
    captured: m.captured
  };
}

export function snapshotPosition(chess: Chess): PositionSnapshot {
  const fen = chess.fen();
  try {
    const hist = chess.history({ verbose: true });
    if (hist.length === 0) return { fen };
    return {
      fen,
      startFen: hist[0].before,
      moves: hist.map(m => ({ from: m.from, to: m.to, promotion: m.promotion }))
    };
  } catch {
    return { fen };
  }
}

function loadFen(fen: string): Chess {
  try {
    return new Chess(fen);
  } catch {
    // Variant positions (e.g. atomic explosions) may not pass standard validation
    return new Chess(fen, { skipValidation: true });
  }
}

export function restorePosition(snapshot: PositionSnapshot): Chess {
  if (snapshot.startFen && snapshot.moves) {
    try {
      const replay = loadFen(snapshot.startFen);
      for (const m of snapshot.moves) replay.move(m);
      // Only trust the replay when it lands on the exact same position (variants can edit the board directly)
      if (replay.fen() === snapshot.fen) return replay;
    } catch {
      // fall through to the bare FEN
    }
  }
  return loadFen(snapshot.fen);
}

export function runEngineRequest(req: EngineRequest): unknown {
  switch (req.op) {
    case 'aiMove': {
      const board = restorePosition(req.position);
      const move = getAIMove(board, req.bot);
      return move ? toPlainMove(move) : null;
    }
    case 'analyzeMove': {
      const before = loadFen(req.fenBefore);
      const probe = loadFen(req.fenBefore);
      const executed = probe.move(req.move);
      const quality = analyzeMoveInPosition(before, executed, req.budgetMs, req.plyIndex);
      const reasons = decodeMoveReasons(loadFen(req.fenBefore), executed, quality.evalAfter);
      const result: AnalyzeMoveResult = { ...quality, reasons };
      return result;
    }
    case 'search': {
      const board = restorePosition(req.position);
      const result = iterativeDeepeningSearch(board, req.maxDepth, req.timeLimitMs, req.quiescenceDepth ?? 3);
      const out: SearchResult = {
        score: result.score,
        bestMove: result.bestMove ? toPlainMove(result.bestMove) : null,
        reasons: req.withReasons && result.bestMove ? decodeMoveReasons(board, result.bestMove, result.score) : []
      };
      return out;
    }
    case 'topLines': {
      const lines: EngineLine[] = analyzeTopLines(loadFen(req.fen), req.depth, req.count, req.timeLimitMs);
      return lines;
    }
    case 'completedGame': {
      return analyzeCompletedGame(req.moves, req.startFen);
    }
    case 'gradeFromScores': {
      const executed = loadFen(req.fenBefore).move(req.move);
      const bestMove = loadFen(req.fenBefore).move(req.best);
      const quality = buildMoveQuality(
        loadFen(req.fenBefore),
        executed,
        {
          bestMove,
          bestScore: req.bestScore,
          secondBestScore: req.secondBestScore,
          evalAfter: req.evalAfter,
          legalMoveCount: req.legalMoveCount,
          pvSan: req.pvSan
        },
        req.plyIndex
      );
      const reasons = decodeMoveReasons(loadFen(req.fenBefore), executed, quality.evalAfter);
      const result: AnalyzeMoveResult = { ...quality, reasons };
      return result;
    }
    case 'reasons': {
      return req.items.map(item => {
        try {
          const moved = loadFen(item.fen).move(item.move);
          return decodeMoveReasons(loadFen(item.fen), moved, item.score);
        } catch {
          return [];
        }
      });
    }
    case 'customAIMove': {
      const move: CustomMove | null = getCustomAIMove(req.state, req.bot);
      return move;
    }
  }
}
