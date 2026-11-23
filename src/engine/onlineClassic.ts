import { Chess, Square } from 'chess.js';
import { PieceColor } from '../types/chess';

export type OnlineTimeControlType = 'bullet' | 'blitz' | 'rapid' | 'classical' | 'unlimited' | 'custom';
export type OnlineMatchStatus = 'waiting' | 'active' | 'finished' | 'cancelled';
export type OnlineMatchReason =
  | 'none'
  | 'checkmate'
  | 'resignation'
  | 'timeout'
  | 'stalemate'
  | 'draw_agreement'
  | 'repetition'
  | 'insufficient'
  | 'cancelled';

export interface OnlineTimeControlSpec {
  id: string;
  label: string;
  type: OnlineTimeControlType;
  baseSeconds: number;
  incrementSeconds: number;
  isUnlimited: boolean;
}

export interface OnlinePlayerPublic {
  uid: string;
  username: string;
  title: string;
  avatarSeed: string;
  bulletElo: number;
  blitzElo: number;
  rapidElo: number;
  classicalElo: number;
  onlineGames: number;
  onlineWins: number;
  onlineDraws: number;
  onlineLosses: number;
}

export interface OnlineMatchDoc {
  matchId: string;
  inviteCode: string;
  variant: 'standard';
  isPublicSeek: boolean;
  rated: boolean;
  status: OnlineMatchStatus;
  creatorId: string;
  creatorColorPref: 'w' | 'b' | 'random';
  whiteUid: string;
  blackUid: string;
  whiteName: string;
  blackName: string;
  whiteElo: number;
  blackElo: number;
  timeControlType: OnlineTimeControlType;
  timeControlLabel: string;
  baseSeconds: number;
  incrementSeconds: number;
  isUnlimited: boolean;
  fen: string;
  pgn: string;
  lastMoveUci: string;
  lastMoveSan: string;
  movesCount: number;
  turn: PieceColor;
  whiteTimeMs: number;
  blackTimeMs: number;
  drawOfferBy: '' | PieceColor;
  takebackOfferBy: '' | PieceColor;
  winner: '' | PieceColor | 'draw';
  result: '*' | '1-0' | '0-1' | '1/2-1/2';
  reason: OnlineMatchReason;
  rematchMatchId: string;
  createdAtMs: number;
  lastMoveAtMs: number;
  updatedAtMs: number;
}

export interface OnlineChatMessageDoc {
  messageId: string;
  matchId: string;
  senderUid: string;
  senderName: string;
  whiteUid: string;
  blackUid: string;
  text: string;
  createdAtMs: number;
}

export const ONLINE_TIME_CONTROL_PRESETS: OnlineTimeControlSpec[] = [
  { id: 'bullet_1_0', label: '1+0 Bullet', type: 'bullet', baseSeconds: 60, incrementSeconds: 0, isUnlimited: false },
  { id: 'bullet_2_1', label: '2+1 Bullet', type: 'bullet', baseSeconds: 120, incrementSeconds: 1, isUnlimited: false },
  { id: 'blitz_3_0', label: '3+0 Blitz', type: 'blitz', baseSeconds: 180, incrementSeconds: 0, isUnlimited: false },
  { id: 'blitz_3_2', label: '3+2 Blitz', type: 'blitz', baseSeconds: 180, incrementSeconds: 2, isUnlimited: false },
  { id: 'blitz_5_0', label: '5+0 Blitz', type: 'blitz', baseSeconds: 300, incrementSeconds: 0, isUnlimited: false },
  { id: 'blitz_5_3', label: '5+3 Blitz', type: 'blitz', baseSeconds: 300, incrementSeconds: 3, isUnlimited: false },
  { id: 'rapid_10_0', label: '10+0 Rapid', type: 'rapid', baseSeconds: 600, incrementSeconds: 0, isUnlimited: false },
  { id: 'rapid_10_5', label: '10+5 Rapid', type: 'rapid', baseSeconds: 600, incrementSeconds: 5, isUnlimited: false },
  { id: 'rapid_15_10', label: '15+10 Rapid', type: 'rapid', baseSeconds: 900, incrementSeconds: 10, isUnlimited: false },
  { id: 'classical_30_0', label: '30+0 Classical', type: 'classical', baseSeconds: 1800, incrementSeconds: 0, isUnlimited: false },
  { id: 'classical_30_20', label: '30+20 Classical', type: 'classical', baseSeconds: 1800, incrementSeconds: 20, isUnlimited: false },
  { id: 'unlimited', label: 'Unlimited (Untimed)', type: 'unlimited', baseSeconds: 0, incrementSeconds: 0, isUnlimited: true }
];

export const SPORTSMANSHIP_QUICK_CHATS: string[] = [
  'Good luck, have fun!',
  'Nice move!',
  'Thanks for the game!',
  'Good game! Rematch?'
];

/**
 * Classifies ANY user-chosen timestamp / base+increment (including sub-minute bullets,
 * multi-hour classicals, or Unlimited) into the proper rating bucket and display label.
 */
export function buildAnyOnlineTimeControl(
  minutesInput: number,
  incrementSecondsInput: number,
  isUnlimited = false
): OnlineTimeControlSpec {
  if (isUnlimited || (minutesInput <= 0 && incrementSecondsInput <= 0)) {
    return {
      id: 'unlimited',
      label: 'Unlimited (Untimed)',
      type: 'unlimited',
      baseSeconds: 0,
      incrementSeconds: 0,
      isUnlimited: true
    };
  }

  const clampedMinutes = Math.max(0.25, Math.min(180, Number.isFinite(minutesInput) ? minutesInput : 10));
  const baseSeconds = Math.max(15, Math.min(10800, Math.round(clampedMinutes * 60)));
  const incrementSeconds = Math.max(0, Math.min(180, Math.round(Number.isFinite(incrementSecondsInput) ? incrementSecondsInput : 0)));
  const estimatedTotal = baseSeconds + incrementSeconds * 40;

  let type: OnlineTimeControlType = 'custom';
  if (estimatedTotal < 180) type = 'bullet';
  else if (estimatedTotal < 600) type = 'blitz';
  else if (estimatedTotal < 1800) type = 'rapid';
  else type = 'classical';

  const baseLabel =
    baseSeconds < 60
      ? `${baseSeconds}s`
      : Number.isInteger(baseSeconds / 60)
      ? `${baseSeconds / 60}`
      : `${(baseSeconds / 60).toFixed(1)}`;
  const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
  return {
    id: `tc_${baseSeconds}_${incrementSeconds}`,
    label: `${baseLabel}+${incrementSeconds} ${typeTitle}`.slice(0, 40),
    type,
    baseSeconds,
    incrementSeconds,
    isUnlimited: false
  };
}

export function getEloBucketForTimeControl(type: OnlineTimeControlType): keyof Pick<
  OnlinePlayerPublic,
  'bulletElo' | 'blitzElo' | 'rapidElo' | 'classicalElo'
> {
  if (type === 'bullet') return 'bulletElo';
  if (type === 'blitz') return 'blitzElo';
  if (type === 'classical' || type === 'unlimited') return 'classicalElo';
  return 'rapidElo';
}

export function sanitizeOnlineUsername(raw: string, fallback = 'GMPlayer'): string {
  const cleaned = String(raw || '')
    .replace(/[^a-zA-Z0-9_ .-]/g, '')
    .trim()
    .slice(0, 32);
  return cleaned.length >= 2 ? cleaned : fallback;
}

export function createInviteCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/**
 * Computes real-time remaining clock milliseconds on both sides using server-anchored lastMoveAtMs.
 * Clocks begin counting down after the first ply or immediately when game starts if movesCount >= 1.
 */
export function computeLiveClockMs(match: OnlineMatchDoc, nowMs: number = Date.now()): {
  whiteMs: number;
  blackMs: number;
  activeFlagged: PieceColor | null;
} {
  if (match.isUnlimited || match.status !== 'active') {
    return {
      whiteMs: match.whiteTimeMs,
      blackMs: match.blackTimeMs,
      activeFlagged: null
    };
  }

  // Standard chess server etiquette: clocks tick down only once each side has started moving (ply >= 1),
  // or fallback to lastMoveAtMs cleanly so opening move isn't unfairly lost during initial load.
  const elapsed = match.movesCount > 0 ? Math.max(0, nowMs - match.lastMoveAtMs) : 0;
  const whiteMs = match.turn === 'w' ? Math.max(0, match.whiteTimeMs - elapsed) : match.whiteTimeMs;
  const blackMs = match.turn === 'b' ? Math.max(0, match.blackTimeMs - elapsed) : match.blackTimeMs;
  const activeFlagged: PieceColor | null =
    match.movesCount > 0 && (match.turn === 'w' ? whiteMs <= 0 : blackMs <= 0) ? match.turn : null;

  return { whiteMs, blackMs, activeFlagged };
}

export function formatOnlineClock(ms: number, isUnlimited: boolean): string {
  if (isUnlimited) return '∞';
  const clamped = Math.max(0, ms);
  const totalSec = Math.ceil(clamped / 1000);
  if (clamped > 0 && clamped < 10_000) {
    const tenths = Math.floor((clamped % 1000) / 100);
    return `0:0${Math.floor(clamped / 1000)}.${tenths}`;
  }
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export interface ClassicMoveTransition {
  fen: string;
  pgn: string;
  lastMoveUci: string;
  lastMoveSan: string;
  movesCount: number;
  turn: PieceColor;
  whiteTimeMs: number;
  blackTimeMs: number;
  status: OnlineMatchStatus;
  winner: '' | PieceColor | 'draw';
  result: '*' | '1-0' | '0-1' | '1/2-1/2';
  reason: OnlineMatchReason;
}

/**
 * Validates and computes the exact next state for a Classic ('standard') online move.
 * Rejects illegal moves, wrong turn, or non-active matches cleanly.
 */
export function computeClassicOnlineMove(
  match: OnlineMatchDoc,
  moverColor: PieceColor,
  from: Square,
  to: Square,
  promotion: 'q' | 'r' | 'b' | 'n' = 'q',
  nowMs: number = Date.now()
): ClassicMoveTransition | null {
  if (match.variant !== 'standard' || match.status !== 'active' || match.turn !== moverColor) {
    return null;
  }

  const chess = new Chess();
  if (match.pgn.trim().length > 0) {
    try {
      chess.loadPgn(match.pgn);
    } catch {
      try {
        chess.load(match.fen);
      } catch {
        return null;
      }
    }
  } else if (match.fen) {
    try {
      chess.load(match.fen);
    } catch {
      return null;
    }
  }

  if (chess.turn() !== moverColor) return null;

  const clocks = computeLiveClockMs(match, nowMs);
  if (!match.isUnlimited && clocks.activeFlagged === moverColor) {
    return null;
  }

  let moveResult;
  try {
    moveResult = chess.move({ from, to, promotion });
  } catch {
    return null;
  }
  if (!moveResult) return null;

  const incMs = match.isUnlimited ? 0 : match.incrementSeconds * 1000;
  const nextWhiteMs =
    match.isUnlimited
      ? match.whiteTimeMs
      : moverColor === 'w'
      ? Math.min(10800000, clocks.whiteMs + incMs)
      : clocks.whiteMs;
  const nextBlackMs =
    match.isUnlimited
      ? match.blackTimeMs
      : moverColor === 'b'
      ? Math.min(10800000, clocks.blackMs + incMs)
      : clocks.blackMs;

  let status: OnlineMatchStatus = 'active';
  let winner: '' | PieceColor | 'draw' = '';
  let result: '*' | '1-0' | '0-1' | '1/2-1/2' = '*';
  let reason: OnlineMatchReason = 'none';

  if (chess.isCheckmate()) {
    status = 'finished';
    winner = moverColor;
    result = moverColor === 'w' ? '1-0' : '0-1';
    reason = 'checkmate';
  } else if (chess.isStalemate()) {
    status = 'finished';
    winner = 'draw';
    result = '1/2-1/2';
    reason = 'stalemate';
  } else if (chess.isInsufficientMaterial()) {
    status = 'finished';
    winner = 'draw';
    result = '1/2-1/2';
    reason = 'insufficient';
  } else if (chess.isThreefoldRepetition() || chess.isDraw()) {
    status = 'finished';
    winner = 'draw';
    result = '1/2-1/2';
    reason = 'repetition';
  }

  return {
    fen: chess.fen(),
    pgn: chess.pgn(),
    lastMoveUci: `${from}${to}${moveResult.promotion || ''}`,
    lastMoveSan: moveResult.san,
    movesCount: match.movesCount + 1,
    turn: chess.turn(),
    whiteTimeMs: nextWhiteMs,
    blackTimeMs: nextBlackMs,
    status,
    winner,
    result,
    reason
  };
}

/**
 * Standard Elo update calculation (K = 24) for rated Classic Online Chess matches.
 */
export function computeOnlineEloDelta(playerElo: number, opponentElo: number, score: 1 | 0.5 | 0): number {
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  return Math.round(24 * (score - expected));
}
