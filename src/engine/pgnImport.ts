import { Chess } from 'chess.js';
import { GameHistoryItem, MoveAnalysis, PieceColor } from '../types/chess';

/** A pasted PGN parsed into what the archive and Game Review need (before engine analysis). */
export interface ParsedPgn {
  headers: Record<string, string>;
  white: string;
  black: string;
  whiteElo: number;
  blackElo: number;
  result: GameHistoryItem['result'];
  reason: GameHistoryItem['reason'];
  date: string;
  timeControl: string;
  pgn: string;
  moves: MoveAnalysis[];
}

export type ParsePgnResult = { ok: true; game: ParsedPgn } | { ok: false; error: string };

const RESULTS: GameHistoryItem['result'][] = ['1-0', '0-1', '1/2-1/2', '*'];

/** Keep only the first game when several are pasted (PGN exports often contain many). */
function firstGame(text: string): string {
  const normalized = text.replace(/\r\n?/g, '\n').trim();
  const starts = [...normalized.matchAll(/^\[Event\s/gm)].map(m => m.index ?? 0);
  if (starts.length > 1) return normalized.slice(starts[0], starts[1]).trim();
  return normalized;
}

function formatDate(raw: string | undefined): string {
  const m = raw?.match(/^(\d{4})[.\-/](\d{2})[.\-/](\d{2})$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return new Date().toISOString().split('T')[0];
}

/** "600+5" → "Rapid 10+5"; "-" or missing → "Imported". */
export function formatTimeControl(raw: string | undefined): string {
  const m = raw?.trim().match(/^(\d+)(?:\+(\d+))?$/);
  if (!m) return 'Imported';
  const baseSec = Number(m[1]);
  const incSec = Number(m[2] || 0);
  const expected = baseSec + 40 * incSec;
  const label = expected < 180 ? 'Bullet' : expected < 480 ? 'Blitz' : expected < 1500 ? 'Rapid' : 'Classical';
  const minutes = baseSec % 60 === 0 ? String(baseSec / 60) : (baseSec / 60).toFixed(1).replace(/\.0$/, '');
  return `${label} ${minutes}+${incSec}`;
}

function inferReason(
  termination: string | undefined,
  board: Chess,
  result: GameHistoryItem['result']
): GameHistoryItem['reason'] {
  const t = (termination || '').toLowerCase();
  if (board.isCheckmate() || t.includes('checkmate')) return 'checkmate';
  if (t.includes('time')) return 'timeout';
  if (t.includes('resign')) return 'resignation';
  if (t.includes('abandon')) return 'abandoned';
  if (t.includes('repetition') || board.isThreefoldRepetition()) return 'repetition';
  if (t.includes('stalemate') || board.isStalemate()) return 'stalemate';
  if (result === '1/2-1/2') return board.isDraw() ? 'stalemate' : 'repetition';
  if (result === '*') return 'abandoned';
  return 'resignation';
}

export function parsePgn(text: string): ParsePgnResult {
  const source = firstGame(text);
  if (!source) return { ok: false, error: 'Paste a PGN first.' };

  const board = new Chess();
  try {
    board.loadPgn(source);
  } catch (err) {
    const detail = err instanceof Error ? err.message : '';
    return { ok: false, error: `That PGN couldn't be read${detail ? ` (${detail})` : ''}. Check for illegal or mistyped moves.` };
  }

  const headers = board.getHeaders();
  if (headers.SetUp === '1' || headers.FEN) {
    return { ok: false, error: 'Games from a custom start position (e.g. Chess960) can’t be imported yet — standard chess only.' };
  }
  const variantHeader = (headers.Variant || '').toLowerCase();
  if (variantHeader && variantHeader !== 'standard' && variantHeader !== 'chess') {
    return { ok: false, error: `“${headers.Variant}” games can’t be imported yet — standard chess only.` };
  }

  const history = board.history({ verbose: true });
  if (history.length === 0) return { ok: false, error: 'That PGN has no moves.' };

  let result: GameHistoryItem['result'] = RESULTS.includes(headers.Result as GameHistoryItem['result'])
    ? (headers.Result as GameHistoryItem['result'])
    : '*';
  if (result === '*' && board.isCheckmate()) result = board.turn() === 'w' ? '0-1' : '1-0';
  if (result === '*' && board.isDraw()) result = '1/2-1/2';

  const moves: MoveAnalysis[] = history.map(m => ({
    san: m.san,
    from: m.from,
    to: m.to,
    classification: 'good',
    evalBefore: 0,
    evalAfter: 0
  }));

  return {
    ok: true,
    game: {
      headers,
      white: headers.White && headers.White !== '?' ? headers.White : 'White',
      black: headers.Black && headers.Black !== '?' ? headers.Black : 'Black',
      whiteElo: parseInt(headers.WhiteElo || '', 10) || 0,
      blackElo: parseInt(headers.BlackElo || '', 10) || 0,
      result,
      reason: inferReason(headers.Termination, board, result),
      date: formatDate(headers.UTCDate || headers.Date),
      timeControl: formatTimeControl(headers.TimeControl),
      pgn: board.pgn(),
      moves
    }
  };
}

/** Guess which side the user played from the PGN player names. */
export function guessPlayerColor(game: ParsedPgn, username: string): PieceColor {
  const me = username.trim().toLowerCase();
  if (me && game.black.toLowerCase() === me) return 'b';
  return 'w';
}

export function buildImportedGame(
  game: ParsedPgn,
  playerColor: PieceColor,
  analyzedMoves: MoveAnalysis[],
  accuracy: { white: number; black: number }
): GameHistoryItem {
  const isWhite = playerColor === 'w';
  return {
    id: `import-${Date.now()}`,
    date: game.date,
    variant: 'standard',
    playerColor,
    opponentName: isWhite ? game.black : game.white,
    opponentElo: isWhite ? game.blackElo : game.whiteElo,
    timeControl: game.timeControl,
    result: game.result,
    reason: game.reason,
    movesCount: analyzedMoves.length,
    pgn: game.pgn,
    accuracyWhite: accuracy.white,
    accuracyBlack: accuracy.black,
    playerAccuracy: isWhite ? accuracy.white : accuracy.black,
    blundersCount: analyzedMoves.filter(m => m.classification === 'blunder').length,
    analyzedMoves
  };
}
