import { Chess } from 'chess.js';

export type EditablePieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type EditablePieceColor = 'w' | 'b';

export interface EditablePiece {
  type: EditablePieceType;
  color: EditablePieceColor;
}

export type EditableBoardGrid = (EditablePiece | null)[][];

export interface CastlingRightsState {
  K: boolean;
  Q: boolean;
  k: boolean;
  q: boolean;
}

export interface EditablePositionState {
  grid: EditableBoardGrid;
  turn: EditablePieceColor;
  castling: CastlingRightsState;
  halfmove: number;
  fullmove: number;
}

export const EMPTY_GRID = (): EditableBoardGrid =>
  Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));

const PIECE_FROM_FEN: Record<string, EditablePiece> = {
  K: { type: 'k', color: 'w' },
  Q: { type: 'q', color: 'w' },
  R: { type: 'r', color: 'w' },
  B: { type: 'b', color: 'w' },
  N: { type: 'n', color: 'w' },
  P: { type: 'p', color: 'w' },
  k: { type: 'k', color: 'b' },
  q: { type: 'q', color: 'b' },
  r: { type: 'r', color: 'b' },
  b: { type: 'b', color: 'b' },
  n: { type: 'n', color: 'b' },
  p: { type: 'p', color: 'b' }
};

function pieceToFenChar(piece: EditablePiece): string {
  return piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
}

export function fenToGridState(fen: string): EditablePositionState {
  const parts = fen.trim().split(/\s+/);
  const placement = parts[0] || '8/8/8/8/8/8/8/8';
  const turn: EditablePieceColor = parts[1] === 'b' ? 'b' : 'w';
  const castlingStr = parts[2] || '-';
  const halfmove = Math.max(0, Number.parseInt(parts[4] || '0', 10) || 0);
  const fullmove = Math.max(1, Number.parseInt(parts[5] || '1', 10) || 1);

  const grid = EMPTY_GRID();
  const rows = placement.split('/');
  for (let r = 0; r < Math.min(8, rows.length); r++) {
    let c = 0;
    for (const ch of rows[r]) {
      if (c >= 8) break;
      if (ch >= '1' && ch <= '8') {
        c += Number(ch);
      } else if (PIECE_FROM_FEN[ch]) {
        grid[r][c] = { ...PIECE_FROM_FEN[ch] };
        c += 1;
      }
    }
  }

  const rawCastling: CastlingRightsState = {
    K: castlingStr.includes('K'),
    Q: castlingStr.includes('Q'),
    k: castlingStr.includes('k'),
    q: castlingStr.includes('q')
  };

  return {
    grid,
    turn,
    castling: sanitizeCastlingForGrid(grid, rawCastling),
    halfmove,
    fullmove
  };
}

export function sanitizeCastlingForGrid(
  grid: EditableBoardGrid,
  castling: CastlingRightsState
): CastlingRightsState {
  const hasPiece = (r: number, c: number, type: EditablePieceType, color: EditablePieceColor) => {
    const p = grid[r]?.[c];
    return Boolean(p && p.type === type && p.color === color);
  };
  const whiteKingHome = hasPiece(7, 4, 'k', 'w');
  const blackKingHome = hasPiece(0, 4, 'k', 'b');
  return {
    K: castling.K && whiteKingHome && hasPiece(7, 7, 'r', 'w'),
    Q: castling.Q && whiteKingHome && hasPiece(7, 0, 'r', 'w'),
    k: castling.k && blackKingHome && hasPiece(0, 7, 'r', 'b'),
    q: castling.q && blackKingHome && hasPiece(0, 0, 'r', 'b')
  };
}

export function setSquarePieceInGrid(
  grid: EditableBoardGrid,
  row: number,
  col: number,
  piece: EditablePiece | null
): EditableBoardGrid {
  const next = grid.map(r => r.map(c => (c ? { ...c } : null)));
  if (row < 0 || row > 7 || col < 0 || col > 7) return next;
  next[row][col] = piece ? { ...piece } : null;
  return next;
}

export function gridStateToFen(state: EditablePositionState): string {
  const rows: string[] = [];
  for (let r = 0; r < 8; r++) {
    let empty = 0;
    let rowStr = '';
    for (let c = 0; c < 8; c++) {
      const p = state.grid[r][c];
      if (!p) {
        empty += 1;
      } else {
        if (empty > 0) {
          rowStr += String(empty);
          empty = 0;
        }
        rowStr += pieceToFenChar(p);
      }
    }
    if (empty > 0) rowStr += String(empty);
    rows.push(rowStr || '8');
  }

  const sanitized = sanitizeCastlingForGrid(state.grid, state.castling);
  const castlingStr =
    [
      sanitized.K ? 'K' : '',
      sanitized.Q ? 'Q' : '',
      sanitized.k ? 'k' : '',
      sanitized.q ? 'q' : ''
    ].join('') || '-';

  return `${rows.join('/')} ${state.turn} ${castlingStr} - ${state.halfmove} ${state.fullmove}`;
}

export function validateEditedPosition(fen: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const state = fenToGridState(fen);

  let whiteKings = 0;
  let blackKings = 0;
  let invalidPawns = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.grid[r][c];
      if (!p) continue;
      if (p.type === 'k') {
        if (p.color === 'w') whiteKings += 1;
        else blackKings += 1;
      }
      if (p.type === 'p' && (r === 0 || r === 7)) {
        invalidPawns += 1;
      }
    }
  }

  if (whiteKings !== 1) errors.push(`White must have exactly 1 King (currently ${whiteKings}).`);
  if (blackKings !== 1) errors.push(`Black must have exactly 1 King (currently ${blackKings}).`);
  if (invalidPawns > 0) errors.push('Pawns cannot be placed on the 1st or 8th rank.');

  if (errors.length === 0) {
    try {
      const probe = new Chess(fen);
      // Side NOT to move cannot already have their king in check
      const inactiveColor = probe.turn() === 'w' ? 'b' : 'w';
      const parts = fen.split(' ');
      parts[1] = inactiveColor;
      const flippedProbe = new Chess(parts.join(' '), { skipValidation: true });
      if (flippedProbe.inCheck()) {
        errors.push(`The ${inactiveColor === 'w' ? 'White' : 'Black'} King is already in check on the opponent’s turn.`);
      }
      if (probe.moves().length === 0 && !probe.isCheckmate() && !probe.isStalemate()) {
        errors.push('Position has no legal continuation.');
      }
    } catch {
      errors.push('Position FEN is not legally playable.');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
