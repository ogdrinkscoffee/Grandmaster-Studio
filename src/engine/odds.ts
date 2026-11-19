import { Chess, PieceSymbol, Square } from 'chess.js';
import { PieceColor } from '../types/chess';

export type OddsType = 'none' | 'pawn' | 'knight' | 'rook' | 'queen';

export interface OddsPreset {
  id: OddsType;
  label: string;
  description: string;
}

export const ODDS_PRESETS: OddsPreset[] = [
  { id: 'none', label: 'Equal (Standard)', description: 'Full starting armies on both sides' },
  { id: 'pawn', label: 'Pawn Odds (f-pawn)', description: 'Remove one f-pawn for an asymmetric attack' },
  { id: 'knight', label: 'Knight Odds', description: 'Play or give a full queenside Knight advantage' },
  { id: 'rook', label: 'Rook Odds', description: 'Play or give a full queenside Rook advantage' },
  { id: 'queen', label: 'Queen Odds', description: 'Extreme handicap: start without the Queen' }
];

/**
 * Removes a handicap piece from the standard starting position and updates FEN castling rights cleanly.
 */
export function applyOddsToStandardFen(odds: OddsType, giverColor: PieceColor): string {
  const board = new Chess();
  if (odds === 'none') return board.fen();

  const targetSquare: Square =
    odds === 'pawn'
      ? giverColor === 'w'
        ? 'f2'
        : 'f7'
      : odds === 'knight'
      ? giverColor === 'w'
        ? 'b1'
        : 'b8'
      : odds === 'rook'
      ? giverColor === 'w'
        ? 'a1'
        : 'a8'
      : giverColor === 'w'
      ? 'd1'
      : 'd8';

  board.remove(targetSquare);

  // If queenside rook is removed, update FEN castling availability (Q or q) so chess.js and Stockfish agree
  if (odds === 'rook') {
    const parts = board.fen().split(' ');
    const castling = parts[2] || 'KQkq';
    const nextCastling = castling.replace(giverColor === 'w' ? 'Q' : 'q', '') || '-';
    parts[2] = nextCastling;
    return parts.join(' ');
  }

  return board.fen();
}

export function getOddsPieceSymbol(odds: OddsType): PieceSymbol | null {
  switch (odds) {
    case 'pawn':
      return 'p';
    case 'knight':
      return 'n';
    case 'rook':
      return 'r';
    case 'queen':
      return 'q';
    default:
      return null;
  }
}
