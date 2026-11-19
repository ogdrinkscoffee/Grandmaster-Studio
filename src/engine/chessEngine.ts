import { Chess, Square, PieceSymbol, Color, Move } from 'chess.js';
import { MoveClassification, MoveAnalysis } from '../types/chess';

export const MIN_AI_ELO = 100;
export const MAX_AI_ELO = 3600;

// Piece values in centipawns
export const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king'
};

// Piece Square Tables (From White's perspective, index 0 is a8, 63 is h1)
const PAWN_TABLE = [
   0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
 -50,-40,-30,-30,-30,-30,-40,-50,
 -40,-20,  0,  0,  0,  0,-20,-40,
 -30,  0, 10, 15, 15, 10,  0,-30,
 -30,  5, 15, 20, 20, 15,  5,-30,
 -30,  0, 15, 20, 20, 15,  0,-30,
 -30,  5, 10, 15, 15, 10,  5,-30,
 -40,-20,  0,  5,  5,  0,-20,-40,
 -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
 -20,-10,-10,-10,-10,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5, 10, 10,  5,  0,-10,
 -10,  5,  5, 10, 10,  5,  5,-10,
 -10,  0, 10, 10, 10, 10,  0,-10,
 -10, 10, 10, 10, 10, 10, 10,-10,
 -10,  5,  0,  0,  0,  0,  5,-10,
 -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
   0,  0,  0,  0,  0,  0,  0,  0,
   5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
   0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
 -20,-10,-10, -5, -5,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
   0,  0,  5,  5,  5,  5,  0, -5,
 -10,  5,  5,  5,  5,  5,  0,-10,
 -10,  0,  5,  0,  0,  0,  0,-10,
 -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_MIDGAME_TABLE = [
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -20,-30,-30,-40,-40,-30,-30,-20,
 -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

const KING_ENDGAME_TABLE = [
 -50,-40,-30,-20,-20,-30,-40,-50,
 -30,-20,-10,  0,  0,-10,-20,-30,
 -30,-10, 20, 30, 30, 20,-10,-30,
 -30,-10, 30, 40, 40, 30,-10,-30,
 -30,-10, 30, 40, 40, 30,-10,-30,
 -30,-10, 20, 30, 30, 20,-10,-30,
 -30,-30,  0,  0,  0,  0,-30,-30,
 -50,-30,-30,-30,-30,-30,-30,-50
];

function getSquareIndex(square: Square, color: Color): number {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = parseInt(square[1], 10) - 1; // 1=0, 8=7
  if (color === 'w') {
    return (7 - rank) * 8 + file;
  } else {
    return rank * 8 + file;
  }
}

/**
 * Static positional evaluation of a position from White's perspective in centipawns.
 * Incorporates material, PSTs, bishop pair, pawn structure (doubled, isolated, passed),
 * and rook open/semi-open file activity.
 */
export function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -20000 : 20000;
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
    return 0;
  }

  let whiteMaterial = 0;
  let blackMaterial = 0;
  let whitePst = 0;
  let blackPst = 0;
  let whiteBishops = 0;
  let blackBishops = 0;

  const whitePawnsPerFile = [0, 0, 0, 0, 0, 0, 0, 0];
  const blackPawnsPerFile = [0, 0, 0, 0, 0, 0, 0, 0];
  const whitePawnRanks: { r: number; c: number }[] = [];
  const blackPawnRanks: { r: number; c: number }[] = [];
  const whiteRooks: number[] = [];
  const blackRooks: number[] = [];

  const board = chess.board();

  let totalNonPawns = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type !== 'p' && p.type !== 'k') {
        totalNonPawns++;
      }
    }
  }
  const isEndgame = totalNonPawns <= 4;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type];
      const sq = (String.fromCharCode(97 + c) + (8 - r)) as Square;
      const idx = getSquareIndex(sq, piece.color);

      let pstBonus = 0;
      switch (piece.type) {
        case 'p':
          pstBonus = PAWN_TABLE[idx];
          if (piece.color === 'w') {
            whitePawnsPerFile[c]++;
            whitePawnRanks.push({ r, c });
          } else {
            blackPawnsPerFile[c]++;
            blackPawnRanks.push({ r, c });
          }
          break;
        case 'n':
          pstBonus = KNIGHT_TABLE[idx];
          break;
        case 'b':
          pstBonus = BISHOP_TABLE[idx];
          if (piece.color === 'w') whiteBishops++;
          else blackBishops++;
          break;
        case 'r':
          pstBonus = ROOK_TABLE[idx];
          if (piece.color === 'w') whiteRooks.push(c);
          else blackRooks.push(c);
          break;
        case 'q':
          pstBonus = QUEEN_TABLE[idx];
          break;
        case 'k':
          pstBonus = isEndgame ? KING_ENDGAME_TABLE[idx] : KING_MIDGAME_TABLE[idx];
          break;
      }

      if (piece.color === 'w') {
        whiteMaterial += val;
        whitePst += pstBonus;
      } else {
        blackMaterial += val;
        blackPst += pstBonus;
      }
    }
  }

  let positionalScore = 0;

  // Bishop pair advantage
  if (whiteBishops >= 2) positionalScore += 35;
  if (blackBishops >= 2) positionalScore -= 35;

  // Doubled & isolated pawn structure penalties
  for (let f = 0; f < 8; f++) {
    if (whitePawnsPerFile[f] > 1) positionalScore -= 14 * (whitePawnsPerFile[f] - 1);
    if (blackPawnsPerFile[f] > 1) positionalScore += 14 * (blackPawnsPerFile[f] - 1);

    if (whitePawnsPerFile[f] > 0) {
      const hasLeft = f > 0 && whitePawnsPerFile[f - 1] > 0;
      const hasRight = f < 7 && whitePawnsPerFile[f + 1] > 0;
      if (!hasLeft && !hasRight) positionalScore -= 12 * whitePawnsPerFile[f];
    }
    if (blackPawnsPerFile[f] > 0) {
      const hasLeft = f > 0 && blackPawnsPerFile[f - 1] > 0;
      const hasRight = f < 7 && blackPawnsPerFile[f + 1] > 0;
      if (!hasLeft && !hasRight) positionalScore += 12 * blackPawnsPerFile[f];
    }
  }

  // Passed pawn bonus (row 0 = rank 8, row 7 = rank 1)
  const passedBonusByAdvancement = [0, 12, 18, 28, 44, 68, 95, 0];
  for (const wp of whitePawnRanks) {
    let isPassed = true;
    for (const bp of blackPawnRanks) {
      if (Math.abs(bp.c - wp.c) <= 1 && bp.r < wp.r) {
        isPassed = false;
        break;
      }
    }
    if (isPassed) {
      const advancement = 7 - wp.r;
      positionalScore += passedBonusByAdvancement[advancement] || 20;
    }
  }
  for (const bp of blackPawnRanks) {
    let isPassed = true;
    for (const wp of whitePawnRanks) {
      if (Math.abs(wp.c - bp.c) <= 1 && wp.r > bp.r) {
        isPassed = false;
        break;
      }
    }
    if (isPassed) {
      const advancement = bp.r;
      positionalScore -= passedBonusByAdvancement[advancement] || 20;
    }
  }

  // Rooks on open / semi-open files
  for (const file of whiteRooks) {
    if (whitePawnsPerFile[file] === 0) {
      positionalScore += blackPawnsPerFile[file] === 0 ? 22 : 12;
    }
  }
  for (const file of blackRooks) {
    if (blackPawnsPerFile[file] === 0) {
      positionalScore -= whitePawnsPerFile[file] === 0 ? 22 : 12;
    }
  }

  // Mobility bonus (mild, normalized by turn)
  const currentTurn = chess.turn();
  const legalMoves = chess.moves().length;
  const tempo = currentTurn === 'w' ? 10 : -10;
  const mobility = (legalMoves - 20) * 1.5 * (currentTurn === 'w' ? 1 : -1);

  return (whiteMaterial - blackMaterial) + (whitePst - blackPst) + positionalScore + tempo + mobility;
}

/**
 * Quiescence search to avoid horizon effect on sharp tactical captures (Negamax perspective)
 */
function quiescence(chess: Chess, alpha: number, beta: number, depthLeft: number): number {
  if (chess.isCheckmate()) return -19000;
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
    return 0;
  }

  const standPat = chess.turn() === 'w' ? evaluateBoard(chess) : -evaluateBoard(chess);

  if (depthLeft <= 0) return standPat;
  if (standPat >= beta) return beta;
  if (alpha < standPat) alpha = standPat;

  const captureMoves = chess.moves({ verbose: true }).filter(m => m.captured);
  captureMoves.sort((a, b) => {
    const valA = (a.captured ? PIECE_VALUES[a.captured] : 0) * 10 - PIECE_VALUES[a.piece];
    const valB = (b.captured ? PIECE_VALUES[b.captured] : 0) * 10 - PIECE_VALUES[b.piece];
    return valB - valA;
  });

  for (const move of captureMoves) {
    chess.move(move);
    const score = -quiescence(chess, -beta, -alpha, depthLeft - 1);
    chess.undo();

    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

function orderMoves(moves: Move[], preferredMoveSan?: string): Move[] {
  return [...moves].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (preferredMoveSan) {
      if (a.san === preferredMoveSan) scoreA += 50000;
      if (b.san === preferredMoveSan) scoreB += 50000;
    }
    if (a.captured) scoreA += 1000 + PIECE_VALUES[a.captured] * 10 - PIECE_VALUES[a.piece];
    if (b.captured) scoreB += 1000 + PIECE_VALUES[b.captured] * 10 - PIECE_VALUES[b.piece];
    if (a.promotion) scoreA += 850 + PIECE_VALUES[a.promotion];
    if (b.promotion) scoreB += 850 + PIECE_VALUES[b.promotion];
    if (a.san.includes('+')) scoreA += 300;
    if (b.san.includes('+')) scoreB += 300;
    if (a.flags.includes('k') || a.flags.includes('q')) scoreA += 90;
    if (b.flags.includes('k') || b.flags.includes('q')) scoreB += 90;
    return scoreB - scoreA;
  });
}

/**
 * Minimax with Alpha-Beta pruning and optional search deadline
 */
export function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingTurn: boolean,
  nodesCount = { count: 0 },
  deadlineMs?: number,
  quiescenceDepth = 3,
  preferredRootSan?: string
): { score: number; bestMove?: Move; timedOut?: boolean } {
  nodesCount.count++;

  if (deadlineMs && nodesCount.count % 128 === 0 && Date.now() >= deadlineMs) {
    const evalNow = evaluateBoard(chess);
    return { score: evalNow, timedOut: true };
  }

  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      return { score: isMaximizingTurn ? -19000 - depth : 19000 + depth };
    }
    return { score: 0 };
  }

  if (depth <= 0) {
    if (isMaximizingTurn) {
      return { score: quiescence(chess, alpha, beta, quiescenceDepth) };
    }
    return { score: -quiescence(chess, -beta, -alpha, quiescenceDepth) };
  }

  const rawMoves = chess.moves({ verbose: true });
  if (rawMoves.length === 0) return { score: 0 };

  const moves = orderMoves(rawMoves, preferredRootSan);
  let bestMove: Move = moves[0];

  if (isMaximizingTurn) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const child = minimax(chess, depth - 1, alpha, beta, false, nodesCount, deadlineMs, quiescenceDepth);
      chess.undo();

      if (child.timedOut) {
        return { score: maxEval === -Infinity ? evaluateBoard(chess) : maxEval, bestMove, timedOut: true };
      }

      if (child.score > maxEval) {
        maxEval = child.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, child.score);
      if (beta <= alpha) break;
    }
    return { score: maxEval, bestMove };
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const child = minimax(chess, depth - 1, alpha, beta, true, nodesCount, deadlineMs, quiescenceDepth);
      chess.undo();

      if (child.timedOut) {
        return { score: minEval === Infinity ? evaluateBoard(chess) : minEval, bestMove, timedOut: true };
      }

      if (child.score < minEval) {
        minEval = child.score;
        bestMove = move;
      }
      beta = Math.min(beta, child.score);
      if (beta <= alpha) break;
    }
    return { score: minEval, bestMove };
  }
}

/**
 * Time-bounded Iterative Deepening search for maximum local strength without locking UI.
 */
export function iterativeDeepeningSearch(
  chess: Chess,
  maxDepth: number,
  timeLimitMs = 700,
  quiescenceDepth = 4
): { score: number; bestMove?: Move; completedDepth: number; nodes: number } {
  const isMaximizing = chess.turn() === 'w';
  const deadlineMs = Date.now() + timeLimitMs;
  const nodesCount = { count: 0 };

  let completedDepth = 0;
  let bestResult: { score: number; bestMove?: Move } = minimax(
    chess,
    1,
    -Infinity,
    Infinity,
    isMaximizing,
    nodesCount,
    undefined,
    quiescenceDepth
  );
  completedDepth = 1;

  for (let d = 2; d <= maxDepth; d++) {
    if (Date.now() >= deadlineMs) break;
    const candidate = minimax(
      chess,
      d,
      -Infinity,
      Infinity,
      isMaximizing,
      nodesCount,
      deadlineMs,
      quiescenceDepth,
      bestResult.bestMove?.san
    );
    if (!candidate.timedOut && candidate.bestMove) {
      bestResult = candidate;
      completedDepth = d;
    } else {
      break;
    }
  }

  return {
    score: bestResult.score,
    bestMove: bestResult.bestMove,
    completedDepth,
    nodes: nodesCount.count
  };
}

/**
 * Calculate win chance (0 to 100) from White's perspective given centipawns score
 */
export function winChanceFromCp(cp: number): number {
  if (cp >= 15000) return 100;
  if (cp <= -15000) return 0;
  return Math.round(50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1));
}

/**
 * Format evaluation centipawn for display (e.g. +1.4, -0.8, +M2, -M3)
 */
export function formatEvaluation(cp: number): string {
  if (cp >= 15000) {
    const mateMoves = Math.ceil((20000 - cp) / 2);
    return `+M${Math.max(1, mateMoves)}`;
  }
  if (cp <= -15000) {
    const mateMoves = Math.ceil((20000 + cp) / 2);
    return `-M${Math.max(1, mateMoves)}`;
  }
  const pawns = cp / 100;
  return pawns > 0 ? `+${pawns.toFixed(1)}` : pawns.toFixed(1);
}

/**
 * Move Classification logic for post-game and real-time game review
 */
export function classifyMove(
  evalBefore: number,
  evalAfter: number,
  turn: Color,
  isBestMove: boolean,
  isCaptureSacrifice: boolean
): MoveClassification {
  const delta = turn === 'w' ? (evalAfter - evalBefore) : (evalBefore - evalAfter);

  if (isBestMove) {
    if (isCaptureSacrifice && delta >= -30) {
      return 'brilliant';
    }
    return 'best';
  }

  if (isCaptureSacrifice && delta >= -40) {
    return 'brilliant';
  }

  if (delta >= -15) return 'great';
  if (delta >= -40) return 'excellent';
  if (delta >= -90) return 'good';
  if (delta >= -180) return 'inaccuracy';
  if (delta >= -320) return 'mistake';

  const wasDecisive = turn === 'w' ? evalBefore > 300 : evalBefore < -300;
  const isLostOrDrawn = turn === 'w' ? evalAfter < 100 : evalAfter > -100;
  if (wasDecisive && isLostOrDrawn) {
    return 'missed_win';
  }

  return 'blunder';
}

export function calculateSingleMoveAccuracy(
  evalBefore: number,
  evalAfter: number,
  turn: Color,
  isBestMove: boolean,
  classification: MoveClassification
): number {
  if (classification === 'brilliant' || classification === 'book') return 100.0;
  if (classification === 'best' || isBestMove) return 98.5;

  const winBefore = turn === 'w' ? winChanceFromCp(evalBefore) : 100 - winChanceFromCp(evalBefore);
  const winAfter = turn === 'w' ? winChanceFromCp(evalAfter) : 100 - winChanceFromCp(evalAfter);
  const winDrop = Math.max(0, winBefore - winAfter);

  // Chess.com-inspired exponential decay from win-probability loss
  const raw = 103.1668 * Math.exp(-0.04354 * winDrop) - 3.1668;
  const clamped = Math.max(0, Math.min(100, raw));

  if (classification === 'great') return Math.max(94.0, Math.round(clamped * 10) / 10);
  if (classification === 'excellent') return Math.max(87.0, Math.round(clamped * 10) / 10);
  if (classification === 'good') return Math.max(72.0, Math.min(91.0, Math.round(clamped * 10) / 10));
  if (classification === 'inaccuracy') return Math.min(72.0, Math.max(48.0, Math.round(clamped * 10) / 10));
  if (classification === 'mistake') return Math.min(48.0, Math.max(22.0, Math.round(clamped * 10) / 10));
  if (classification === 'missed_win') return Math.min(42.0, Math.max(18.0, Math.round(clamped * 10) / 10));
  return Math.min(22.0, Math.max(2.0, Math.round(clamped * 10) / 10));
}

/**
 * Calculate real accuracy (0-100%) from analyzed moves for White or Black
 */
export function calculateAccuracyFromMoves(moves: MoveAnalysis[], color: Color): number {
  const weights: Record<MoveClassification, number> = {
    brilliant: 100,
    great: 97,
    best: 98.5,
    excellent: 92,
    book: 98,
    good: 83,
    inaccuracy: 64,
    mistake: 40,
    missed_win: 34,
    blunder: 12
  };

  const playerMoves = moves.filter((_, idx) => (color === 'w' ? idx % 2 === 0 : idx % 2 === 1));
  if (playerMoves.length === 0) return 90.0;

  const total = playerMoves.reduce(
    (sum, m) => sum + (typeof m.moveAccuracy === 'number' ? m.moveAccuracy : weights[m.classification] ?? 80),
    0
  );
  return Math.round((total / playerMoves.length) * 10) / 10;
}

export type BotCategory = 'beginner' | 'casual' | 'intermediate' | 'advanced' | 'master' | 'special';

export type BotPlayStyle =
  | 'balanced'
  | 'aggressive'
  | 'positional'
  | 'tactical'
  | 'defensive'
  | 'endgame'
  | 'chaotic'
  | 'adaptive';

export interface BotProfile {
  id: string;
  name: string;
  title?: string;
  accentHex?: string;
  avatar: string;
  elo: number;
  depth: number;
  blunderRate: number;
  timeLimitMs?: number;
  quiescenceDepth?: number;
  isCustom?: boolean;
  isAdaptive?: boolean;
  adaptivePosture?: 'auto' | 'easy' | 'hard';
  category?: BotCategory;
  playStyle?: BotPlayStyle;
  styleLabel?: string;
  quote?: string;
  openingPreference?: string;
  description: string;
}

export const AI_BOT_PROFILES: BotProfile[] = [
  // ---- Special Adaptive Coach ----
  {
    id: 'bot_adaptive_coach',
    name: 'Mikhail · Adaptive',
    title: 'Coach Adaptive AI',
    accentHex: '#10b981',
    avatar: 'MK',
    elo: 1450,
    depth: 3,
    blunderRate: 0.1,
    category: 'special',
    playStyle: 'adaptive',
    styleLabel: 'Adaptive Mirror',
    isAdaptive: true,
    adaptivePosture: 'auto',
    openingPreference: 'Mirrors your opening repertoire & form',
    quote: 'Play boldly—I ease off when you stumble and sharpen up when you shine.',
    description:
      'Special Coach opponent that dynamically lowers or raises strength in real time based on your recent games and live move accuracy.'
  },

  // ---- Beginner Tier (250 - 550 Elo) ----
  {
    id: 'bot_milo',
    name: 'Milo',
    title: 'Curious Pawn',
    accentHex: '#10b981',
    avatar: 'MI',
    elo: 250,
    depth: 1,
    blunderRate: 0.65,
    category: 'beginner',
    playStyle: 'balanced',
    styleLabel: 'All-Round Novice',
    openingPreference: 'Random pawn advances',
    quote: 'Wait, can knights really jump over my own pawns?',
    description: 'Cheerful beginner who loves pushing pawns and often misses hanging pieces.'
  },
  {
    id: 'bot_sunny',
    name: 'Sunny',
    title: 'Wild Sprinter',
    accentHex: '#fb923c',
    avatar: 'SN',
    elo: 400,
    depth: 1,
    blunderRate: 0.54,
    category: 'beginner',
    playStyle: 'chaotic',
    styleLabel: 'Early Queen & Flank Raids',
    openingPreference: 'Early Queen sorties & wing pawns',
    quote: 'Defense is boring—let us race straight at the king!',
    description: 'Fearless beginner who launches early queen attacks and wild flank pushes.'
  },
  {
    id: 'bot_bram',
    name: 'Bram',
    title: 'Cautious Builder',
    accentHex: '#60a5fa',
    avatar: 'BR',
    elo: 400,
    depth: 1,
    blunderRate: 0.52,
    category: 'beginner',
    playStyle: 'defensive',
    styleLabel: 'Defensive Shell',
    openingPreference: 'Compact pawn chains & early castling',
    quote: 'Keep the king tucked away and nothing can go wrong.',
    description: 'Same 400 Elo as Sunny, but plays patiently behind solid pawn shields and early castling.'
  },
  {
    id: 'bot_pip',
    name: 'Pip',
    title: 'Café Tactician',
    accentHex: '#38bdf8',
    avatar: 'PI',
    elo: 550,
    depth: 1,
    blunderRate: 0.42,
    category: 'beginner',
    playStyle: 'tactical',
    styleLabel: 'Fork Hunter',
    openingPreference: 'Open center & quick knight hops',
    quote: 'Espresso first, sneaky knight forks second.',
    description: 'Casual street-café player who hunts checks and forks with occasional tactical slips.'
  },

  // ---- Casual & Club Tier (850 - 1250 Elo) ----
  {
    id: 'bot_aria',
    name: 'Aria',
    title: 'Scholastic Ace',
    accentHex: '#f59e0b',
    avatar: 'AR',
    elo: 850,
    depth: 2,
    blunderRate: 0.25,
    category: 'casual',
    playStyle: 'tactical',
    styleLabel: 'Tactical Trickster',
    openingPreference: 'Italian Game & Fried Liver ideas',
    quote: 'Did you remember to guard your back rank?',
    description: 'Sharp club junior who spots simple forks, pins, and scholar traps.'
  },
  {
    id: 'bot_felix',
    name: 'Felix',
    title: 'Gambit Spark',
    accentHex: '#f97316',
    avatar: 'FX',
    elo: 850,
    depth: 2,
    blunderRate: 0.27,
    category: 'casual',
    playStyle: 'aggressive',
    styleLabel: 'All-Out Aggressor',
    openingPreference: 'Danish & King’s Gambit rushes',
    quote: 'Who cares about one pawn when all my files are open?',
    description: 'Same 850 Elo as Aria, but throws pawns forward relentlessly for open attacking lines.'
  },
  {
    id: 'bot_claire',
    name: 'Claire',
    title: 'Quiet Wall',
    accentHex: '#94a3b8',
    avatar: 'CL',
    elo: 1050,
    depth: 2,
    blunderRate: 0.19,
    category: 'casual',
    playStyle: 'defensive',
    styleLabel: 'Solid Fortress',
    openingPreference: 'London System & Caro-Kann',
    quote: 'Take your time—try breaking through my dark-square wall.',
    description: 'Calm defensive club regular who trades off threats and shuts down cheap attacks.'
  },
  {
    id: 'bot_viktor',
    name: 'Viktor',
    title: 'Club Maestro',
    accentHex: '#f43f5e',
    avatar: 'VK',
    elo: 1250,
    depth: 3,
    blunderRate: 0.14,
    category: 'casual',
    playStyle: 'positional',
    styleLabel: 'Positional Classical',
    openingPreference: 'Ruy Lopez & Queen’s Gambit',
    quote: 'Control the center, develop every piece, then strike.',
    description: 'Disciplined classical regular who fights for central squares and punishes loose pieces.'
  },
  {
    id: 'bot_rocco',
    name: 'Rocco',
    title: 'Kingside Brawler',
    accentHex: '#ef4444',
    avatar: 'RC',
    elo: 1250,
    depth: 3,
    blunderRate: 0.14,
    category: 'casual',
    playStyle: 'aggressive',
    styleLabel: 'Aggressive Attacker',
    openingPreference: 'Sicilian Dragon & opposite-side storms',
    quote: 'Castle kingside—I already have my rook-lift planned.',
    description: 'Same 1250 Elo as Viktor, tuned for pawn storms, aggressive checks, and sharp kingside pressure.'
  },
  {
    id: 'bot_lyra',
    name: 'Lyra',
    title: 'Trap Weaver',
    accentHex: '#a855f7',
    avatar: 'LY',
    elo: 1250,
    depth: 3,
    blunderRate: 0.14,
    category: 'casual',
    playStyle: 'tactical',
    styleLabel: 'Pin & Double-Attack',
    openingPreference: 'Scotch Gambit & tactical traps',
    quote: 'Look twice before taking that seemingly free pawn.',
    description: 'Same 1250 Elo as Viktor & Rocco, specializing in pins, skewers, and double attacks.'
  },

  // ---- Intermediate Tier (1600 Elo Trio) ----
  {
    id: 'bot_nadia',
    name: 'Nadia',
    title: 'Quiet Strategist',
    accentHex: '#14b8a6',
    avatar: 'ND',
    elo: 1600,
    depth: 3,
    blunderRate: 0.07,
    category: 'intermediate',
    playStyle: 'positional',
    styleLabel: 'Outpost Strategist',
    openingPreference: 'Catalan & Queen’s Indian setups',
    quote: 'One weak square in your camp is all I need.',
    description: 'Patient positional specialist focused on knight outposts, minor-piece harmony, and clean structures.'
  },
  {
    id: 'bot_dante',
    name: 'Dante',
    title: 'Tal Disciple',
    accentHex: '#ec4899',
    avatar: 'DN',
    elo: 1600,
    depth: 3,
    blunderRate: 0.08,
    category: 'intermediate',
    playStyle: 'chaotic',
    styleLabel: 'Chaotic Tactician',
    openingPreference: 'King’s Indian Attack & sharp gambits',
    quote: 'Every complication favors the player who loves chaos.',
    description: 'Same 1600 Elo as Nadia, steering games into messy tactics, piece tension, and daring checks.'
  },
  {
    id: 'bot_hugo',
    name: 'Hugo',
    title: 'Endgame Grinder',
    accentHex: '#eab308',
    avatar: 'HG',
    elo: 1600,
    depth: 3,
    blunderRate: 0.07,
    category: 'intermediate',
    playStyle: 'endgame',
    styleLabel: 'Simplification & Endings',
    openingPreference: 'Berlin & Exchange structures',
    quote: 'Queens off the board—now the real chess begins.',
    description: 'Same 1600 Elo as Nadia & Dante, eagerly trading queens to grind technical endgames.'
  },

  // ---- Advanced Tier (1950 - 2150 Elo) ----
  {
    id: 'bot_kael',
    name: 'Kael',
    title: 'Gambit Knight',
    accentHex: '#818cf8',
    avatar: 'KL',
    elo: 1950,
    depth: 4,
    blunderRate: 0.03,
    category: 'advanced',
    playStyle: 'aggressive',
    styleLabel: 'Sacrificial Attacker',
    openingPreference: 'Sicilian Najdorf & Marshall attacks',
    quote: 'Your king will never find shelter in the middlegame.',
    description: 'Aggressive attacker hunting open files, kingside storms, and tactical sacrifices.'
  },
  {
    id: 'bot_selene',
    name: 'Selene',
    title: 'Iron Fortress',
    accentHex: '#64748b',
    avatar: 'SL',
    elo: 1950,
    depth: 4,
    blunderRate: 0.03,
    category: 'advanced',
    playStyle: 'defensive',
    styleLabel: 'Prophylactic Defender',
    openingPreference: 'Petroff & Nimzo-Indian',
    quote: 'Attack all you want. Every square in my camp is covered.',
    description: 'Same 1950 Elo as Kael, neutralizing initiative with iron prophylaxis and accurate counter-pins.'
  },
  {
    id: 'bot_arthur',
    name: 'Arthur',
    title: 'Classical Technician',
    accentHex: '#0ea5e9',
    avatar: 'AT',
    elo: 2150,
    depth: 4,
    blunderRate: 0.01,
    timeLimitMs: 320,
    category: 'advanced',
    playStyle: 'endgame',
    styleLabel: 'Minor-Piece Technique',
    openingPreference: 'Queen’s Gambit Declined & Ruy Lopez',
    quote: 'An extra tempo on move 12 decides the rook ending on move 45.',
    description: 'Clinical expert converting bishop-pair edges, passed pawns, and technical endings.'
  },

  // ---- Master & Apex Tier (2350 - 3600 Elo) ----
  {
    id: 'bot_magnus',
    name: 'Magnus',
    title: 'Grandmaster Sovereign',
    accentHex: '#eab308',
    avatar: 'MG',
    elo: 2350,
    depth: 5,
    blunderRate: 0.0,
    timeLimitMs: 420,
    quiescenceDepth: 4,
    category: 'master',
    playStyle: 'positional',
    styleLabel: 'Universal Squeeze',
    openingPreference: 'Flexible 1.d4 / 1.c4 universal theory',
    quote: 'Tiny positional edges compound into inevitable victory.',
    description: 'Master-level precision across balanced middlegames and relentless endgame squeezes.'
  },
  {
    id: 'bot_tessa',
    name: 'Tessa',
    title: 'Tactical Tempest',
    accentHex: '#f43f5e',
    avatar: 'TS',
    elo: 2350,
    depth: 5,
    blunderRate: 0.0,
    timeLimitMs: 420,
    quiescenceDepth: 4,
    category: 'master',
    playStyle: 'tactical',
    styleLabel: 'Forcing Calculation',
    openingPreference: 'Sharp Sicilian & Grünfeld lines',
    quote: 'Every undefended piece is a tactical target.',
    description: 'Same 2350 GM Elo as Magnus, wired for razor-sharp forcing variations and double attacks.'
  },
  {
    id: 'bot_evelyn',
    name: 'Evelyn',
    title: 'Endgame Empress',
    accentHex: '#c084fc',
    avatar: 'EV',
    elo: 2750,
    depth: 5,
    blunderRate: 0.0,
    timeLimitMs: 560,
    quiescenceDepth: 4,
    category: 'master',
    playStyle: 'endgame',
    styleLabel: 'Clinical Conversion',
    openingPreference: 'Solid classical & Berlin endings',
    quote: 'Survive the opening and you will still have to solve move 60.',
    description: 'Super-GM calculation that simplifies cleanly and squeezes microscopic endgame edges.'
  },
  {
    id: 'bot_aegis',
    name: 'Aegis',
    title: 'Apex Neural Core',
    accentHex: '#22d3ee',
    avatar: 'AG',
    elo: 3600,
    depth: 7,
    blunderRate: 0.0,
    timeLimitMs: 750,
    quiescenceDepth: 4,
    category: 'master',
    playStyle: 'tactical',
    styleLabel: 'Maximum Engine',
    openingPreference: 'Full engine preparation',
    quote: 'Calculation depth optimal. Searching all forcing continuations.',
    description: 'Maximum local engine strength using iterative deepening & full quiescence.'
  }
];

/**
 * Create a calibrated custom AI opponent profile for any rating from 100 to 3600 (Max local strength).
 */
export function createCustomBotProfile(requestedElo: number): BotProfile {
  const elo = Math.max(MIN_AI_ELO, Math.min(MAX_AI_ELO, Math.round(requestedElo)));

  let depth = 1;
  let blunderRate = 0;
  let tierLabel = 'Novice';
  let timeLimitMs: number | undefined;
  let quiescenceDepth = 3;

  if (elo < 250) {
    depth = 1;
    blunderRate = 0.78;
    tierLabel = 'Beginner';
  } else if (elo < 500) {
    depth = 1;
    blunderRate = 0.52;
    tierLabel = 'Novice';
  } else if (elo < 850) {
    depth = 2;
    blunderRate = 0.34;
    tierLabel = 'Casual';
  } else if (elo < 1200) {
    depth = 2;
    blunderRate = 0.20;
    tierLabel = 'Club';
  } else if (elo < 1600) {
    depth = 3;
    blunderRate = 0.10;
    tierLabel = 'Intermediate';
  } else if (elo < 2000) {
    depth = 4;
    blunderRate = 0.04;
    tierLabel = 'Expert';
  } else if (elo < 2500) {
    depth = 4;
    blunderRate = 0;
    timeLimitMs = 350;
    tierLabel = 'Master';
  } else if (elo < 3100) {
    depth = 5;
    blunderRate = 0;
    timeLimitMs = 520;
    quiescenceDepth = 4;
    tierLabel = 'Grandmaster';
  } else {
    depth = 7;
    blunderRate = 0;
    timeLimitMs = 750;
    quiescenceDepth = 4;
    tierLabel = 'Apex Core';
  }

  return {
    id: 'custom_elo',
    name: `Custom · ${tierLabel}`,
    title: 'Custom Challenger',
    accentHex: '#10b981',
    avatar: 'AI',
    elo,
    depth,
    blunderRate,
    timeLimitMs,
    quiescenceDepth,
    isCustom: true,
    category: 'special',
    playStyle: 'balanced',
    styleLabel: 'Calibrated Balanced',
    quote: `Dialed to ${elo} Elo — ready whenever you are.`,
    description:
      elo >= 3200
        ? 'Peak local engine using iterative deepening up to depth 7 and extended quiescence search.'
        : elo <= 300
        ? 'Entry-level trainer calibrated to simulate 100–300 Elo tactical oversights.'
        : `Calibrated ${elo} Elo opponent balancing search depth ${depth} and natural precision.`
  };
}

/**
 * Compute a small playstyle tie-breaker bonus (in centipawns) so bots sharing
 * the same Elo rating exhibit genuinely distinct playing personalities without
 * throwing away material unnecessarily.
 */
export function scoreMoveStyleBias(
  chessBefore: Chess,
  move: Move,
  playStyle: BotPlayStyle = 'balanced'
): number {
  if (playStyle === 'balanced' || playStyle === 'adaptive') return 0;

  const sim = new Chess(chessBefore.fen());
  const executed = sim.move({ from: move.from, to: move.to, promotion: move.promotion });
  if (!executed) return 0;

  const isCheck = sim.inCheck();
  const isCapture = Boolean(executed.captured);
  const isQueenTrade = executed.piece === 'q' && executed.captured === 'q';
  const isCastle = executed.flags.includes('k') || executed.flags.includes('q');
  const toRank = Number(executed.to[1]);
  const fromRank = Number(executed.from[1]);
  const forwardAdvance = executed.color === 'w' ? toRank - fromRank : fromRank - toRank;
  const inCenter = CENTER_SQUARES.has(executed.to);
  const inExtCenter = EXTENDED_CENTER.has(executed.to);
  const attackedTargets = sim.moves({ verbose: true }).filter(m => m.from === executed.to && m.captured).length;

  switch (playStyle) {
    case 'aggressive': {
      let bias = 0;
      if (isCheck) bias += 26;
      if (isCapture) bias += 18;
      if (forwardAdvance > 0) bias += forwardAdvance * 6;
      if (executed.piece === 'p' && (executed.to[0] === 'f' || executed.to[0] === 'g' || executed.to[0] === 'h')) {
        bias += 12;
      }
      if (isQueenTrade) bias -= 22;
      return bias;
    }
    case 'positional': {
      let bias = 0;
      if (inCenter) bias += 24;
      else if (inExtCenter && (executed.piece === 'n' || executed.piece === 'b')) bias += 18;
      if (isCastle) bias += 28;
      if (executed.piece === 'r' && (executed.to[0] === 'd' || executed.to[0] === 'e' || executed.to[0] === 'c')) {
        bias += 14;
      }
      if (isCheck && !isCapture) bias -= 6;
      return bias;
    }
    case 'tactical': {
      let bias = 0;
      if (isCheck) bias += 24;
      if (attackedTargets >= 2) bias += 28;
      if (isCapture) bias += 16;
      if (executed.promotion) bias += 25;
      return bias;
    }
    case 'defensive': {
      let bias = 0;
      if (isCastle) bias += 34;
      if (isCapture && (PIECE_VALUES[executed.captured!] >= PIECE_VALUES[executed.piece] || isQueenTrade)) {
        bias += 20;
      }
      if (executed.piece === 'p' && forwardAdvance === 1 && !isCapture) bias += 8;
      if (forwardAdvance >= 3 && !isCapture) bias -= 12;
      return bias;
    }
    case 'endgame': {
      let bias = 0;
      if (isQueenTrade) bias += 42;
      else if (isCapture && PIECE_VALUES[executed.captured!] >= 300) bias += 18;
      if (executed.piece === 'p' && ((executed.color === 'w' && toRank >= 5) || (executed.color === 'b' && toRank <= 4))) {
        bias += 16;
      }
      if (executed.piece === 'k' && !isCastle && inExtCenter) bias += 12;
      return bias;
    }
    case 'chaotic': {
      let bias = 0;
      if (isCheck) bias += 30;
      if (isCapture) bias += 24;
      if (executed.piece === 'q' && forwardAdvance >= 2) bias += 14;
      if (executed.piece === 'p' && (executed.to[0] === 'a' || executed.to[0] === 'b' || executed.to[0] === 'g' || executed.to[0] === 'h')) {
        bias += 14;
      }
      if (isCastle) bias -= 10;
      return bias;
    }
  }
}

/**
 * Compute the best AI move for the given bot profile
 */
export function getAIMove(chess: Chess, bot: BotProfile): Move | null {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Immediate checkmate in 1 is always taken for >= 600 Elo bots
  if (bot.elo >= 600) {
    for (const m of moves) {
      chess.move(m);
      const mated = chess.isCheckmate();
      chess.undo();
      if (mated) return m;
    }
  }

  // Calibrated error simulation for sub-master bots
  if (bot.blunderRate > 0 && Math.random() < bot.blunderRate && moves.length > 1) {
    // At very low Elo (<300), pick heavily suboptimal or random moves; around 800-1400 pick from top half
    const isVeryWeak = bot.elo < 350;
    if (isVeryWeak) {
      const randomIdx = Math.floor(Math.random() * moves.length);
      return moves[randomIdx];
    }
    const isMax = chess.turn() === 'w';
    const style = bot.playStyle || 'balanced';
    const scored = moves.map(m => {
      chess.move(m);
      const val = evaluateBoard(chess);
      chess.undo();
      const bias = scoreMoveStyleBias(chess, m, style);
      return { move: m, val: val + (isMax ? bias : -bias) };
    });
    scored.sort((a, b) => (isMax ? b.val - a.val : a.val - b.val));
    const poolEnd = Math.min(scored.length, Math.max(2, Math.ceil(scored.length * 0.45)));
    const pickIdx = Math.floor(Math.random() * poolEnd);
    return scored[pickIdx].move;
  }

  const style = bot.playStyle || 'balanced';
  const useStyleVariety = style !== 'balanced' && style !== 'adaptive' && moves.length > 1 && bot.elo < 3100;

  if (useStyleVariety) {
    const isMax = chess.turn() === 'w';
    const budgetMs =
      bot.timeLimitMs ??
      (bot.depth === 1 ? 45 : bot.depth === 2 ? 150 : bot.depth === 3 ? 240 : bot.depth === 4 ? 340 : 600);
    const ordered = orderMoves(moves).slice(0, Math.min(8, moves.length));
    const deadline = Date.now() + budgetMs;
    const subDepth = Math.max(0, bot.depth - 1);
    const evals = ordered.map(m => {
      const sim = new Chess(chess.fen());
      sim.move(m);
      if (sim.isCheckmate()) {
        return { move: m, score: isMax ? 20000 : -20000 };
      }
      if (sim.isDraw()) {
        return { move: m, score: 0 };
      }
      const res = minimax(sim, subDepth, -Infinity, Infinity, !isMax, { count: 0 }, deadline, bot.quiescenceDepth || 2);
      return { move: m, score: res.score };
    });

    evals.sort((a, b) => (isMax ? b.score - a.score : a.score - b.score));
    const bestScore = evals[0].score;
    const toleranceCp = bot.elo < 900 ? 85 : bot.elo < 1500 ? 55 : bot.elo < 2100 ? 38 : 22;

    const nearTop = evals.filter(e =>
      isMax ? bestScore - e.score <= toleranceCp : e.score - bestScore <= toleranceCp
    );
    if (nearTop.length > 1) {
      let chosen = nearTop[0].move;
      let bestCombined = -Infinity;
      for (const item of nearTop) {
        const directionalEval = isMax ? item.score : -item.score;
        const combined = directionalEval + scoreMoveStyleBias(chess, item.move, style);
        if (combined > bestCombined) {
          bestCombined = combined;
          chosen = item.move;
        }
      }
      return chosen;
    }
    return evals[0].move;
  }

  // Bounded iterative deepening for all depth >= 2 bots so search stays responsive and never stalls premoves
  if (bot.depth >= 2 || bot.timeLimitMs) {
    const budgetMs =
      bot.timeLimitMs ??
      (bot.depth === 2 ? 150 : bot.depth === 3 ? 240 : bot.depth === 4 ? 340 : 600);
    const result = iterativeDeepeningSearch(
      chess,
      bot.depth,
      budgetMs,
      bot.quiescenceDepth || 3
    );
    return result.bestMove || moves[0];
  }

  const isMaximizing = chess.turn() === 'w';
  const result = minimax(chess, bot.depth, -Infinity, Infinity, isMaximizing);
  return result.bestMove || moves[0];
}

/**
 * Estimate a realistic human-like think duration (in ms) for an AI move based on
 * time control, remaining bot clock scramble, game phase, forcingness, and position complexity.
 */
export function computeHumanThinkDelayMs(
  chess: Chess,
  bot: BotProfile,
  initialTimeSec = 600,
  botRemainingSec = 600,
  jitterSample = Math.random()
): number {
  const moves = chess.moves({ verbose: true });
  const clampedJitter = Math.max(0, Math.min(1, jitterSample));
  if (moves.length <= 1) {
    return Math.round(240 + clampedJitter * 160);
  }

  const isBullet = initialTimeSec <= 120;
  const isBlitz = !isBullet && initialTimeSec <= 300;
  const scrambleThreshold = isBullet ? 12 : 20;

  if (botRemainingSec <= scrambleThreshold) {
    const scrambleRatio = Math.max(0.2, botRemainingSec / scrambleThreshold);
    return Math.round(
      Math.max(220, Math.min(720, (240 + scrambleRatio * 360) * (0.85 + clampedJitter * 0.35)))
    );
  }

  let baseMs = isBullet ? 580 : isBlitz ? 1150 : 1650;
  const maxMs = isBullet ? 1350 : isBlitz ? 2500 : 4200;

  const history = chess.history({ verbose: true });
  if (history.length <= 6) {
    baseMs *= 0.58;
  }

  const lastMove = history.length > 0 ? history[history.length - 1] : null;
  if (lastMove?.captured && moves.some(m => m.to === lastMove.to && m.captured)) {
    baseMs *= 0.65;
  }

  if (moves.length <= 4) {
    baseMs *= 0.55;
  } else if (chess.inCheck()) {
    baseMs *= 1.18;
  } else if (moves.length >= 30) {
    baseMs *= 1.28;
  }

  const eloPace = bot.elo < 700 ? 0.8 : bot.elo >= 1800 ? 1.12 : 1.0;
  baseMs *= eloPace;

  const jittered = baseMs * (0.78 + clampedJitter * 0.46);
  return Math.round(Math.max(240, Math.min(maxMs, jittered)));
}

export interface EngineLine {
  san: string;
  from: Square;
  to: Square;
  promotion?: string;
  pvSan: string[];
  scoreCp: number;
  formattedEval: string;
  reasons: string[];
}

const CENTER_SQUARES = new Set<string>(['d4', 'e4', 'd5', 'e5']);
const EXTENDED_CENTER = new Set<string>(['c3', 'c4', 'c5', 'c6', 'd3', 'd6', 'e3', 'e6', 'f3', 'f4', 'f5', 'f6']);

/**
 * DecodeChess-style plain-English tactical & positional explanation for a move.
 */
export function decodeMoveReasons(chessBefore: Chess, move: Move, scoreCp?: number): string[] {
  const reasons: string[] = [];
  const sim = new Chess(chessBefore.fen());
  const executed = sim.move(move);
  if (!executed) return ['Improves piece coordination and board presence.'];

  if (sim.isCheckmate()) {
    reasons.push('Delivers immediate checkmate against the enemy king.');
    return reasons;
  }

  if (sim.inCheck()) {
    reasons.push('Delivers check, forcing the opponent into a defensive response.');
  }

  if (executed.flags.includes('k') || executed.flags.includes('q')) {
    reasons.push('Castles to safeguard the king and activate the corner rook.');
  }

  if (executed.promotion) {
    reasons.push(`Promotes a pawn into a ${PIECE_NAMES[executed.promotion as PieceSymbol] || 'queen'} for decisive material gain.`);
  }

  if (executed.captured) {
    const capturedName = PIECE_NAMES[executed.captured];
    const moverName = PIECE_NAMES[executed.piece];
    const valDiff = PIECE_VALUES[executed.captured] - PIECE_VALUES[executed.piece];
    if (valDiff > 50) {
      reasons.push(`Wins a higher-value ${capturedName} (+${(valDiff / 100).toFixed(1)} net material trade).`);
    } else if (valDiff === 0) {
      reasons.push(`Initiates a balanced ${moverName}-for-${capturedName} exchange to simplify.`);
    } else {
      reasons.push(`Removes an active ${capturedName} defending key lines.`);
    }
  }

  if (CENTER_SQUARES.has(executed.to)) {
    reasons.push(`Seizes direct control over central square ${executed.to}.`);
  } else if (EXTENDED_CENTER.has(executed.to) && (executed.piece === 'n' || executed.piece === 'b')) {
    reasons.push(`Develops ${PIECE_NAMES[executed.piece]} toward an active central outpost on ${executed.to}.`);
  }

  // Passed pawn advancement check
  if (executed.piece === 'p') {
    const rank = parseInt(executed.to[1], 10);
    if ((executed.color === 'w' && rank >= 6) || (executed.color === 'b' && rank <= 3)) {
      reasons.push(`Advances pawn deep to ${executed.to}, creating dangerous promotion threats.`);
    }
  }

  // Check if the moved piece attacks high-value enemy pieces
  const attackers = sim.moves({ verbose: true }).filter(m => m.from === executed.to && m.captured);
  if (attackers.length >= 2) {
    reasons.push('Creates simultaneous pressure against multiple enemy targets.');
  }

  if (reasons.length === 0) {
    if (typeof scoreCp === 'number') {
      const sideWinning = executed.color === 'w' ? scoreCp > 120 : scoreCp < -120;
      reasons.push(
        sideWinning
          ? 'Consolidates an existing advantage and restricts enemy counterplay.'
          : 'Improves piece harmony and prepares future pawn breaks.'
      );
    } else {
      reasons.push('Improves piece harmony and maintains structural flexibility.');
    }
  }

  return reasons.slice(0, 3);
}

/**
 * Compute top N candidate lines with PV continuation & plain-English move decoding.
 */
export function analyzeTopLines(
  chess: Chess,
  depth = 3,
  count = 3,
  timeLimitMs = 600
): EngineLine[] {
  const legalMoves = orderMoves(chess.moves({ verbose: true }));
  if (legalMoves.length === 0) return [];

  const isMaximizing = chess.turn() === 'w';
  const deadline = Date.now() + timeLimitMs;

  // Stage 1: Fast static + capture screening over ALL legal moves (~8ms total)
  const quickScreened = legalMoves.map(move => {
    const sim = new Chess(chess.fen());
    sim.move(move);
    if (sim.isCheckmate()) {
      return { move, scoreCp: isMaximizing ? 20000 : -20000, isMate: true };
    }
    const res = minimax(sim, 0, -Infinity, Infinity, !isMaximizing, { count: 0 }, undefined, 1);
    return { move, scoreCp: res.score, isMate: false };
  });

  quickScreened.sort((a, b) => (isMaximizing ? b.scoreCp - a.scoreCp : a.scoreCp - b.scoreCp));

  // Stage 2: Deepen top candidates within time budget
  const candidateSlice = quickScreened.slice(0, Math.min(8, quickScreened.length));
  const deepResults: { move: Move; scoreCp: number }[] = [];

  for (let i = 0; i < candidateSlice.length; i++) {
    const item = candidateSlice[i];
    if (item.isMate) {
      deepResults.push({ move: item.move, scoreCp: item.scoreCp });
      continue;
    }

    if (i >= count && Date.now() >= deadline) {
      deepResults.push({ move: item.move, scoreCp: item.scoreCp });
      continue;
    }

    const sim = new Chess(chess.fen());
    sim.move(item.move);
    const searchDepth = Math.max(1, depth - 1);
    const res = minimax(sim, searchDepth, -Infinity, Infinity, !isMaximizing, { count: 0 }, deadline, 3);
    deepResults.push({
      move: item.move,
      scoreCp: res.timedOut ? item.scoreCp : res.score
    });
  }

  deepResults.sort((a, b) => (isMaximizing ? b.scoreCp - a.scoreCp : a.scoreCp - b.scoreCp));

  return deepResults.slice(0, count).map(entry => {
    const pvSan: string[] = [entry.move.san];
    const pvBoard = new Chess(chess.fen());
    pvBoard.move(entry.move);
    for (let ply = 0; ply < 2; ply++) {
      if (pvBoard.isGameOver()) break;
      const follow = minimax(pvBoard, 2, -Infinity, Infinity, pvBoard.turn() === 'w', { count: 0 }, Date.now() + 100, 2);
      if (!follow.bestMove) break;
      pvSan.push(follow.bestMove.san);
      pvBoard.move(follow.bestMove);
    }

    return {
      san: entry.move.san,
      from: entry.move.from,
      to: entry.move.to,
      promotion: entry.move.promotion,
      pvSan,
      scoreCp: entry.scoreCp,
      formattedEval: formatEvaluation(entry.scoreCp),
      reasons: decodeMoveReasons(chess, entry.move, entry.scoreCp)
    };
  });
}

/**
 * Detect undefended or under-defended non-king pieces currently threatened by the opponent.
 */
export function getThreatenedSquares(chess: Chess, targetColor: Color = chess.turn()): Square[] {
  const oppColor: Color = targetColor === 'w' ? 'b' : 'w';
  const board = chess.board();
  const threatened: Square[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== targetColor || piece.type === 'k') continue;
      const sq = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
      const enemyAttackers = chess.attackers(sq, oppColor);
      if (enemyAttackers.length === 0) continue;

      const defenders = chess.attackers(sq, targetColor);
      if (defenders.length === 0) {
        threatened.push(sq);
        continue;
      }

      const lowestAttackerVal = Math.min(
        ...enemyAttackers.map(atkSq => {
          const atkPiece = chess.get(atkSq);
          return atkPiece ? PIECE_VALUES[atkPiece.type] : 9999;
        })
      );
      if (lowestAttackerVal < PIECE_VALUES[piece.type]) {
        threatened.push(sq);
      }
    }
  }

  return threatened;
}

export interface MoveQualityAnalysis {
  classification: MoveClassification;
  evalBefore: number;
  evalAfter: number;
  moveAccuracy: number;
  bestMoveSan: string;
  bestMoveFrom: Square;
  bestMoveTo: Square;
  pvSan: string[];
  commentary: string;
  isSacrifice: boolean;
}

/**
 * Evaluate the quality of a specific move played from `chessBefore` with fast bounded search.
 * Catches tactical blunders (hanging pieces, mate threats), best/great/brilliant finds,
 * and produces a best-move refutation + PV line + plain-English explanation.
 */
export function analyzeMoveInPosition(
  chessBefore: Chess,
  executedMove: Move,
  budgetMs = 45,
  plyIndex = 99
): MoveQualityAnalysis {
  const turn = executedMove.color;
  const isMax = turn === 'w';
  const deadline = Date.now() + budgetMs;

  // 1. Evaluate position BEFORE move using bounded depth-2 search for best baseline & second-best comparison
  const legalBefore = orderMoves(chessBefore.moves({ verbose: true }));
  let bestMoveObj = executedMove;
  let bestScore = isMax ? -Infinity : Infinity;
  let secondBestScore = isMax ? -Infinity : Infinity;

  if (legalBefore.length > 0) {
    const topSlice = legalBefore.slice(0, Math.min(10, legalBefore.length));
    // Ensure executedMove is included in evaluation slice
    if (!topSlice.some(m => m.from === executedMove.from && m.to === executedMove.to && m.promotion === executedMove.promotion)) {
      topSlice.push(executedMove);
    }

    const candidateScores: { move: Move; score: number }[] = [];
    for (let i = 0; i < topSlice.length; i++) {
      const m = topSlice[i];
      const sim = new Chess(chessBefore.fen());
      sim.move(m);
      let s: number;
      if (sim.isCheckmate()) {
        s = isMax ? 20000 : -20000;
      } else if (sim.isDraw()) {
        s = 0;
      } else {
        const useDepth = i < 5 && Date.now() < deadline ? 1 : 0;
        const res = minimax(sim, useDepth, -Infinity, Infinity, !isMax, { count: 0 }, deadline, 2);
        s = res.score;
      }
      candidateScores.push({ move: m, score: s });
    }

    candidateScores.sort((a, b) => (isMax ? b.score - a.score : a.score - b.score));
    bestMoveObj = candidateScores[0].move;
    bestScore = candidateScores[0].score;
    secondBestScore = candidateScores.length > 1 ? candidateScores[1].score : bestScore;
  } else {
    bestScore = evaluateBoard(chessBefore);
    secondBestScore = bestScore;
  }

  // 2. Evaluate resulting position AFTER executedMove (depth 1 + quiescence 2 catches hanging pieces & mates)
  const chessAfter = new Chess(chessBefore.fen());
  chessAfter.move({
    from: executedMove.from,
    to: executedMove.to,
    promotion: executedMove.promotion
  });

  let evalAfter: number;
  if (chessAfter.isCheckmate()) {
    evalAfter = isMax ? 20000 : -20000;
  } else if (chessAfter.isDraw() || chessAfter.isStalemate()) {
    evalAfter = 0;
  } else {
    const afterRes = minimax(
      chessAfter,
      1,
      -Infinity,
      Infinity,
      !isMax,
      { count: 0 },
      Date.now() + Math.max(20, Math.floor(budgetMs * 0.6)),
      2
    );
    evalAfter = afterRes.score;
  }

  return buildMoveQuality(
    chessBefore,
    executedMove,
    {
      bestMove: bestMoveObj,
      bestScore: Number.isFinite(bestScore) ? bestScore : evaluateBoard(chessBefore),
      secondBestScore: Number.isFinite(secondBestScore) ? secondBestScore : bestScore,
      evalAfter,
      legalMoveCount: legalBefore.length
    },
    plyIndex
  );
}

/** Engine scores for a played move, from any search (built-in minimax or Stockfish). Scores are White-perspective centipawns. */
export interface MoveQualityInputs {
  bestMove: Move;
  bestScore: number;
  secondBestScore: number;
  evalAfter: number;
  legalMoveCount: number;
  /** Principal variation starting with the best move; computed with a quick search when omitted. */
  pvSan?: string[];
}

/**
 * Turn engine scores into a graded move: classification, accuracy, best-move PV and commentary.
 */
export function buildMoveQuality(
  chessBefore: Chess,
  executedMove: Move,
  inputs: MoveQualityInputs,
  plyIndex = 99
): MoveQualityAnalysis {
  const turn = executedMove.color;
  const isMax = turn === 'w';
  const { bestMove: bestMoveObj, bestScore, secondBestScore, evalAfter, legalMoveCount } = inputs;
  const chessAfter = new Chess(chessBefore.fen());
  chessAfter.move({
    from: executedMove.from,
    to: executedMove.to,
    promotion: executedMove.promotion
  });

  const evalBefore = bestScore;
  const delta = isMax ? evalAfter - evalBefore : evalBefore - evalAfter;

  const isBestMove =
    executedMove.from === bestMoveObj.from &&
    executedMove.to === bestMoveObj.to &&
    (executedMove.promotion || undefined) === (bestMoveObj.promotion || undefined);

  // Detect real tactical sacrifice (captures lower-value piece OR lands on square attacked by enemy with value > pawn)
  const oppColor: Color = turn === 'w' ? 'b' : 'w';
  const movedValue = PIECE_VALUES[executedMove.piece];
  const capturedValue = executedMove.captured ? PIECE_VALUES[executedMove.captured] : 0;
  const isRiskyLanding =
    movedValue >= 320 &&
    chessAfter.attackers(executedMove.to, oppColor).length > chessAfter.attackers(executedMove.to, turn).length;
  const isCaptureSacrifice =
    (Boolean(executedMove.captured) && movedValue > capturedValue + 100) || isRiskyLanding;

  const alreadyCrushing = isMax ? evalBefore > 700 : evalBefore < -700;
  const onlyGoodMoveGap = isMax ? bestScore - secondBestScore : secondBestScore - bestScore;

  let classification: MoveClassification;
  if (plyIndex < 6 && delta >= -30 && !isCaptureSacrifice) {
    classification = 'book';
  } else if (isCaptureSacrifice && delta >= -45 && !alreadyCrushing) {
    classification = 'brilliant';
  } else if (isBestMove && onlyGoodMoveGap >= 115 && legalMoveCount >= 3) {
    classification = 'great';
  } else if (isBestMove || delta >= -10) {
    classification = 'best';
  } else {
    classification = classifyMove(evalBefore, evalAfter, turn, false, false);
  }

  const moveAccuracy = calculateSingleMoveAccuracy(
    evalBefore,
    evalAfter,
    turn,
    isBestMove,
    classification
  );

  // 3. Build 2-3 ply PV continuation from best move (supplied by the caller's search when available)
  const pvSan: string[] = inputs.pvSan && inputs.pvSan.length > 0 ? inputs.pvSan.slice(0, 3) : [bestMoveObj.san];
  if (!inputs.pvSan || inputs.pvSan.length === 0) {
    const pvCursor = new Chess(chessBefore.fen());
    pvCursor.move(bestMoveObj);
    for (let p = 0; p < 2; p++) {
      if (pvCursor.isGameOver()) break;
      const reply = minimax(pvCursor, 1, -Infinity, Infinity, pvCursor.turn() === 'w', { count: 0 }, Date.now() + 18, 1);
      if (!reply.bestMove) break;
      pvSan.push(reply.bestMove.san);
      pvCursor.move(reply.bestMove);
    }
  }

  // 4. Plain-English commentary explaining played move vs best move
  const playedReasons = decodeMoveReasons(chessBefore, executedMove, evalAfter);
  const bestReasons = isBestMove ? playedReasons : decodeMoveReasons(chessBefore, bestMoveObj, evalBefore);

  let commentary: string;
  if (classification === 'brilliant') {
    commentary = `Brilliant sacrifice! ${executedMove.san} creates decisive pressure. ${playedReasons[0] || ''}`.trim();
  } else if (classification === 'great') {
    commentary = `Great find — ${executedMove.san} was the only move keeping full control. ${playedReasons[0] || ''}`.trim();
  } else if (classification === 'best' || classification === 'book') {
    commentary = `${executedMove.san} is ${classification === 'book' ? 'sound opening theory' : 'the top engine choice'}. ${playedReasons[0] || ''}`.trim();
  } else if (classification === 'excellent' || classification === 'good') {
    commentary = `${executedMove.san} maintains a solid position${!isBestMove ? `, though ${bestMoveObj.san} was slightly sharper` : ''}. ${playedReasons[0] || ''}`.trim();
  } else if (classification === 'inaccuracy') {
    commentary = `Inaccuracy: ${executedMove.san} concedes slight momentum (${formatEvaluation(evalBefore)} → ${formatEvaluation(evalAfter)}). ${bestMoveObj.san} was stronger: ${bestReasons[0] || 'improves piece coordination.'}`;
  } else if (classification === 'missed_win') {
    commentary = `Missed win! ${bestMoveObj.san} converted the decisive advantage (${pvSan.join(' ')}).`;
  } else {
    commentary = `${classification === 'blunder' ? 'Blunder' : 'Mistake'}: ${executedMove.san} drops the evaluation (${formatEvaluation(evalBefore)} → ${formatEvaluation(evalAfter)}). Best was ${bestMoveObj.san}: ${bestReasons[0] || 'defends key squares.'}`;
  }

  return {
    classification,
    evalBefore,
    evalAfter,
    moveAccuracy,
    bestMoveSan: bestMoveObj.san,
    bestMoveFrom: bestMoveObj.from,
    bestMoveTo: bestMoveObj.to,
    pvSan,
    commentary,
    isSacrifice: isCaptureSacrifice
  };
}

/**
 * Enrich or compute full per-move analysis across a completed game's move list.
 */
export function analyzeCompletedGame(
  moves: MoveAnalysis[],
  startFen?: string
): MoveAnalysis[] {
  const board = startFen ? new Chess(startFen) : new Chess();
  const enriched: MoveAnalysis[] = [];

  for (let i = 0; i < moves.length; i++) {
    const item = moves[i];
    const alreadyRich =
      typeof item.moveAccuracy === 'number' &&
      Boolean(item.bestMoveSan) &&
      Boolean(item.commentary) &&
      Array.isArray(item.pvSan) &&
      item.pvSan.length > 0;

    let played: Move | null = null;
    try {
      played = board.move({ from: item.from, to: item.to, promotion: item.promotion || 'q' });
    } catch {
      try {
        played = board.move(item.san);
      } catch {
        played = null;
      }
    }

    if (!played) {
      enriched.push(item);
      continue;
    }

    if (alreadyRich) {
      enriched.push(item);
      continue;
    }

    board.undo();
    const q = analyzeMoveInPosition(board, played, 28, i);
    board.move(played);

    enriched.push({
      ...item,
      classification: item.classification === 'book' && i < 8 ? 'book' : q.classification,
      evalBefore: q.evalBefore,
      evalAfter: q.evalAfter,
      moveAccuracy: item.classification === 'book' && i < 8 ? 100 : q.moveAccuracy,
      bestMoveSan: q.bestMoveSan,
      bestMoveFrom: q.bestMoveFrom,
      bestMoveTo: q.bestMoveTo,
      pvSan: q.pvSan,
      commentary: q.commentary
    });
  }

  return enriched;
}

/**
 * Compute Opening / Middlegame / Endgame phase accuracies for a player.
 */
export function computeGamePhaseAccuracy(
  moves: MoveAnalysis[],
  color: Color
): { opening: number | null; middlegame: number | null; endgame: number | null } {
  const playerPlies = moves
    .map((m, idx) => ({ m, idx }))
    .filter(item => (color === 'w' ? item.idx % 2 === 0 : item.idx % 2 === 1));

  const avg = (list: typeof playerPlies): number | null => {
    if (list.length === 0) return null;
    const sum = list.reduce(
      (acc, { m }) =>
        acc +
        (typeof m.moveAccuracy === 'number'
          ? m.moveAccuracy
          : calculateSingleMoveAccuracy(m.evalBefore, m.evalAfter, color, m.classification === 'best', m.classification)),
      0
    );
    return Math.round((sum / list.length) * 10) / 10;
  };

  return {
    opening: avg(playerPlies.filter(p => p.idx < 16)),
    middlegame: avg(playerPlies.filter(p => p.idx >= 16 && p.idx < 48)),
    endgame: avg(playerPlies.filter(p => p.idx >= 48))
  };
}

/**
 * Chess.com-style single-game Performance Rating ("Game Rating") estimate.
 */
export function estimatePerformanceElo(
  accuracy: number,
  opponentElo: number,
  resultScore: 1 | 0.5 | 0
): number {
  const baseOpp = opponentElo > 0 ? opponentElo : 1200;
  const accDelta = (accuracy - 75) * 18;
  const resultBonus = resultScore === 1 ? 140 : resultScore === 0.5 ? 0 : -110;
  const raw = Math.round((baseOpp + accDelta + resultBonus) / 25) * 25;
  return Math.max(200, Math.min(3400, raw));
}
