import { Chess } from 'chess.js';
import { PieceColor } from '../types/chess';
import { BotProfile } from './chessEngine';
import { notifyProgressUpdated } from './progressEvents';

/**
 * Classic endgame technique drills. The user plays `side` from `fen` against the engine.
 *  - mate:    deliver checkmate
 *  - promote: promote a pawn
 *  - draw:    reach a draw, or survive `surviveMoves` of your own moves without losing / letting a pawn queen
 */
export type DrillGoal = 'mate' | 'promote' | 'draw';

export interface EndgameDrill {
  id: string;
  name: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  side: PieceColor;
  fen: string;
  goal: DrillGoal;
  /** Your-move budget for 3 stars (mate/promote drills). */
  par?: number;
  /** Your moves to survive for a draw drill. */
  surviveMoves?: number;
  summary: string;
  tips: string[];
}

export const ENDGAME_DRILLS: EndgameDrill[] = [
  {
    id: 'kq-vs-k',
    name: 'Queen Mate',
    difficulty: 'Basic',
    side: 'w',
    fen: '8/8/8/8/3k4/8/8/4K2Q w - - 0 1',
    goal: 'mate',
    par: 10,
    summary: 'Checkmate the lone king with king and queen.',
    tips: ['Use the queen a knight’s move away to shrink the king’s box', 'Bring your king up before mating — and watch for stalemate']
  },
  {
    id: 'kr-vs-k',
    name: 'Rook Mate',
    difficulty: 'Basic',
    side: 'w',
    fen: '8/8/8/4k3/8/8/8/R3K3 w - - 0 1',
    goal: 'mate',
    par: 16,
    summary: 'Checkmate with king and rook using the box method.',
    tips: ['Cut the king off along a rank or file with the rook', 'Use your king to take opposition, then check from the side']
  },
  {
    id: 'two-rooks',
    name: 'Two-Rook Ladder',
    difficulty: 'Basic',
    side: 'w',
    fen: '8/8/3k4/8/8/8/8/R3K2R w - - 0 1',
    goal: 'mate',
    par: 7,
    summary: 'Roll the king to the edge with the two rooks taking turns.',
    tips: ['One rook cuts off a rank, the other checks on the next', 'If the king attacks a rook, swing it to the far side']
  },
  {
    id: 'kp-key-squares',
    name: 'King in Front of the Pawn',
    difficulty: 'Basic',
    side: 'w',
    fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1',
    goal: 'promote',
    par: 6,
    summary: 'Your king on the 6th in front of its pawn always wins. Escort it home.',
    tips: ['Step the king aside to gain the opposition', 'Don’t push the pawn to e7 with check if it lets Black stalemate']
  },
  {
    id: 'square-of-the-pawn',
    name: 'Square of the Pawn',
    difficulty: 'Intermediate',
    side: 'w',
    fen: '7k/8/8/8/1p6/8/8/5K2 w - - 0 1',
    goal: 'draw',
    surviveMoves: 8,
    summary: 'Catch the runaway pawn before it queens.',
    tips: ['Draw the square from the pawn to its queening rank — your king must step inside it', 'Head diagonally: it covers distance on both files and ranks']
  },
  {
    id: 'opposition-defence',
    name: 'Hold with Opposition',
    difficulty: 'Intermediate',
    side: 'b',
    fen: '4k3/8/8/4P3/4K3/8/8/8 b - - 0 1',
    goal: 'draw',
    surviveMoves: 15,
    summary: 'Defend king and pawn vs king: keep the opposition and the draw is yours.',
    tips: ['Stay directly in front of the pawn', 'When the kings face off, the side NOT to move holds the opposition']
  },
  {
    id: 'lucena',
    name: 'Lucena Position',
    difficulty: 'Advanced',
    side: 'w',
    fen: '1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1',
    goal: 'promote',
    par: 10,
    summary: 'The most important winning rook endgame: build a bridge and queen the pawn.',
    tips: ['Cut the black king off with Rd1+ first', 'Lift the rook to the 4th rank so it can block checks — "building a bridge"']
  },
  {
    id: 'philidor',
    name: 'Philidor Defence',
    difficulty: 'Advanced',
    side: 'b',
    fen: '4k3/8/r7/4PK2/8/8/8/1R6 b - - 0 1',
    goal: 'draw',
    surviveMoves: 20,
    summary: 'The fundamental rook-endgame draw: guard your 3rd rank, then check from behind.',
    tips: ['Keep your rook on the 6th rank so the white king can’t advance', 'Once the pawn reaches e6, drop the rook back and check from behind']
  }
];

/** The engine opponent for drills: strong, no deliberate blunders, quick replies. */
export const DRILL_OPPONENT: BotProfile = {
  id: 'drill-engine',
  name: 'Endgame Engine',
  avatar: '♚',
  // ≥3190 = Stockfish at full strength (built-in engine fallback uses depth 5)
  elo: 3600,
  depth: 5,
  blunderRate: 0,
  timeLimitMs: 500,
  quiescenceDepth: 3,
  description: 'Defends and attacks endgames accurately'
};

function countQueens(board: Chess, color: PieceColor): number {
  return board
    .board()
    .flat()
    .filter(sq => sq && sq.type === 'q' && sq.color === color).length;
}

export type DrillOutcome ={ status: 'success' | 'failed'; reason: string } | null;

/**
 * Decide whether a drill has finished after a move.
 * `userMovesMade` counts the user's own moves so far; `promotedBy` is the colour that just promoted (if any).
 */
export function evaluateDrill(
  drill: EndgameDrill,
  board: Chess,
  userMovesMade: number,
  promotedBy: PieceColor | null
): DrillOutcome {
  const me = drill.side;
  const them: PieceColor = me === 'w' ? 'b' : 'w';

  if (board.isCheckmate()) {
    const loser = board.turn();
    if (loser === them) {
      return drill.goal === 'draw'
        ? { status: 'success', reason: 'You even found a checkmate!' }
        : { status: 'success', reason: 'Checkmate!' };
    }
    return { status: 'failed', reason: 'You were checkmated.' };
  }

  if (drill.goal === 'promote' && promotedBy === me) {
    return { status: 'success', reason: 'Pawn promoted — winning technique complete.' };
  }

  if (drill.goal === 'draw') {
    if (board.isDraw() || board.isStalemate()) return { status: 'success', reason: 'Draw secured.' };
    // A pawn that queens only counts once you've had your reply (you may simply capture the new queen)
    if (board.turn() === them && countQueens(board, them) > countQueens(new Chess(drill.fen), them)) {
      return { status: 'failed', reason: 'The pawn queened.' };
    }
    if (drill.surviveMoves && userMovesMade >= drill.surviveMoves) {
      return { status: 'success', reason: `Held for ${drill.surviveMoves} moves — the draw is safe.` };
    }
    return null;
  }

  // mate / promote goals
  if (board.isStalemate()) return { status: 'failed', reason: 'Stalemate — the win slipped away.' };
  if (board.isInsufficientMaterial()) return { status: 'failed', reason: 'Not enough material left to win.' };
  if (board.isDraw()) return { status: 'failed', reason: 'The game was drawn.' };
  return null;
}

/** 3 stars at or under par, 2 within 1.5× par, otherwise 1. Draw drills: 3 stars for a clean hold. */
export function starsFor(drill: EndgameDrill, userMovesMade: number, hintsUsed: number): number {
  let stars = 3;
  if (drill.par) {
    if (userMovesMade > drill.par * 1.5) stars = 1;
    else if (userMovesMade > drill.par) stars = 2;
  }
  return Math.max(1, stars - hintsUsed);
}

export const ENDGAME_PROGRESS_KEY = 'gm_endgame_drill_progress';

export interface DrillProgress {
  bestStars: number;
  completions: number;
}

export function loadDrillProgress(): Record<string, DrillProgress> {
  try {
    const raw = localStorage.getItem(ENDGAME_PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, DrillProgress>) : {};
  } catch {
    return {};
  }
}

export function saveDrillProgress(progress: Record<string, DrillProgress>) {
  try {
    localStorage.setItem(ENDGAME_PROGRESS_KEY, JSON.stringify(progress));
    notifyProgressUpdated();
  } catch {
    // storage unavailable
  }
}
