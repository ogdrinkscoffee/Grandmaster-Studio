import {
  PieceType,
  PieceColor,
  CustomVariantConfig,
  CustomBoardSquare,
  CustomVariantRules,
  CustomPieceDef,
  VariantId
} from '../types/chess';
import { CHESS_VARIANTS, generateChess960Fen, generateTranscendentalFen } from './variants';

export const CUSTOM_ENGINE_VARIANTS: VariantId[] = [
  'chaturanga',
  'almost_chess',
  'grand_chess',
  'los_alamos',
  'minichess_5x5',
  'shatranj',
  'capablanca_10x8',
  'cannon_siege',
  'amazon_chess',
  'horde',
  'atomic',
  'antichess',
  'giveaway',
  'racing_kings',
  'upside_down',
  'duck_chess',
  'extinction',
  'checkless',
  'anti_queen',
  'gladiator',
  'absorption',
  'knightmare'
];

export const ALL_CUSTOM_PIECE_DEFS: CustomPieceDef[] = [
  {
    type: 'k',
    name: 'King / Raja',
    hindiName: 'Raja',
    tagline: 'Moves 1 step in any direction',
    description: 'The royal piece. Must be defended against checkmate.',
    icon: 'K',
    isFairy: false
  },
  {
    type: 'q',
    name: 'Queen',
    tagline: 'Slides orthogonally & diagonally',
    description: 'Most powerful modern piece combining Rook and Bishop powers.',
    icon: 'Q',
    isFairy: false
  },
  {
    type: 'r',
    name: 'Rook / Ratha',
    hindiName: 'Ratha (Chariot)',
    tagline: 'Slides orthogonally any distance',
    description: 'Ancient chariot; powerful linear flank attacker.',
    icon: 'R',
    isFairy: false
  },
  {
    type: 'b',
    name: 'Bishop',
    tagline: 'Slides diagonally any distance',
    description: 'Long-range diagonal attacker bound to one square color.',
    icon: 'B',
    isFairy: false
  },
  {
    type: 'n',
    name: 'Knight / Ashva',
    hindiName: 'Ashva (Horse)',
    tagline: 'Jumps in a 2x1 L-shape',
    description: 'Hops over any intervening piece on the board.',
    icon: 'N',
    isFairy: false
  },
  {
    type: 'p',
    name: 'Pawn / Padati',
    hindiName: 'Padati (Infantry)',
    tagline: 'Steps forward, captures diagonally',
    description: 'Foot soldier. Promotes upon reaching the far rank.',
    icon: 'P',
    isFairy: false
  },
  // FAIRY & CHATURANGA PIECES
  {
    type: 'e',
    name: 'Elephant / Gaja',
    hindiName: 'Gaja (Elephant)',
    tagline: 'Leaps exactly 2 squares diagonally',
    description: 'Ancestral Chaturanga piece. Jumps over any intervening square/piece.',
    icon: 'E',
    isFairy: true
  },
  {
    type: 'f',
    name: 'Mantri / Ferz',
    hindiName: 'Mantri (Counselor)',
    tagline: 'Moves 1 square diagonally',
    description: 'Ancestral counselor in Chaturanga. Short-range defensive bodyguard.',
    icon: 'F',
    isFairy: true
  },
  {
    type: 'c',
    name: 'Chancellor',
    tagline: 'Compound of Rook + Knight',
    description: 'Moves as either a Rook or a Knight. Tremendous tactical power.',
    icon: 'C',
    isFairy: true
  },
  {
    type: 'a',
    name: 'Archbishop',
    tagline: 'Compound of Bishop + Knight',
    description: 'Moves as either a Bishop or a Knight. Delivers devastating forks.',
    icon: 'A',
    isFairy: true
  },
  {
    type: 'z',
    name: 'Amazon',
    tagline: 'Compound of Queen + Knight',
    description: 'Supreme super-piece combining Queen sliding with Knight hopping.',
    icon: 'Z',
    isFairy: true
  },
  {
    type: 'o',
    name: 'Cannon / Pao',
    tagline: 'Slides like Rook, hops 1 piece to capture',
    description: 'Xiangqi siege weapon. Moves freely orthogonally, needs a screen to strike.',
    icon: 'O',
    isFairy: true
  },
  {
    type: 'm',
    name: 'Guard / Mann',
    tagline: 'Moves 1 step in any direction',
    description: 'Moves like a King, but is non-royal and can be captured.',
    icon: 'M',
    isFairy: true
  },
  {
    type: 'd',
    name: 'Duck Blocker',
    tagline: 'Impassable neutral blocker',
    description: 'Neutral obstacle that blocks movement and captures for both sides.',
    icon: 'D',
    isFairy: true
  }
];

export interface CastlingRights {
  wK: boolean;
  wQ: boolean;
  bK: boolean;
  bQ: boolean;
}

export interface ShieldedPos {
  row: number;
  col: number;
  protectedColor: PieceColor;
  expiresAfterTurn: PieceColor;
}

export interface CustomMove {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  piece: CustomBoardSquare;
  captured?: CustomBoardSquare | null;
  promotion?: PieceType;
  san: string;
  isCastle?: 'k' | 'q';
  isEnPassant?: boolean;
  epCaptureRow?: number;
  epCaptureCol?: number;
}

export interface CustomGameState {
  config: CustomVariantConfig;
  grid: (CustomBoardSquare | null)[][];
  turn: PieceColor;
  moveNumber: number;
  history: CustomMove[];
  duckPos: { row: number; col: number } | null;
  whiteChecks: number;
  blackChecks: number;
  winner: PieceColor | 'draw' | null;
  winReason?: string;
  enPassantTarget?: { row: number; col: number } | null;
  castlingRights?: CastlingRights;
  shieldedPos?: ShieldedPos | null;
  gladiatorUsed?: boolean;
  initialPieceTypes?: Record<PieceColor, PieceType[]>;
  pendingRacingKingsWhiteGoal?: boolean;
}

export function isWithinBoard(row: number, col: number, height: number, width: number): boolean {
  return row >= 0 && row < height && col >= 0 && col < width;
}

export function coordsToSquare(row: number, col: number, height: number): string {
  const file = String.fromCharCode(97 + col);
  const rank = height - row;
  return `${file}${rank}`;
}

export function createEmptyGrid(width: number, height: number): (CustomBoardSquare | null)[][] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null));
}

export function cloneCustomGrid(grid: (CustomBoardSquare | null)[][]): (CustomBoardSquare | null)[][] {
  return grid.map(row => row.map(sq => (sq ? { ...sq, absorbed: sq.absorbed ? [...sq.absorbed] : undefined } : null)));
}

export function computeInitialPieceTypes(
  grid: (CustomBoardSquare | null)[][]
): Record<PieceColor, PieceType[]> {
  const w = new Set<PieceType>();
  const b = new Set<PieceType>();
  for (const row of grid) {
    for (const sq of row) {
      if (!sq || sq.type === 'd') continue;
      if (sq.color === 'w') w.add(sq.type);
      else b.add(sq.type);
    }
  }
  return { w: Array.from(w), b: Array.from(b) };
}

export function inferCastlingRights(
  grid: (CustomBoardSquare | null)[][],
  rules: CustomVariantRules
): CastlingRights {
  if (!rules.castling || !grid.length || grid[0].length !== 8) {
    return { wK: false, wQ: false, bK: false, bQ: false };
  }
  const h = grid.length;
  const wKing = grid[h - 1][4]?.type === 'k' && grid[h - 1][4]?.color === 'w';
  const bKing = grid[0][4]?.type === 'k' && grid[0][4]?.color === 'b';
  return {
    wK: Boolean(wKing && grid[h - 1][7]?.type === 'r' && grid[h - 1][7]?.color === 'w'),
    wQ: Boolean(wKing && grid[h - 1][0]?.type === 'r' && grid[h - 1][0]?.color === 'w'),
    bK: Boolean(bKing && grid[0][7]?.type === 'r' && grid[0][7]?.color === 'b'),
    bQ: Boolean(bKing && grid[0][0]?.type === 'r' && grid[0][0]?.color === 'b')
  };
}

export function createCustomGameState(
  config: CustomVariantConfig,
  turn: PieceColor = 'w'
): CustomGameState {
  const grid = cloneCustomGrid(config.grid);
  return {
    config,
    grid,
    turn,
    moveNumber: 1,
    history: [],
    duckPos: null,
    whiteChecks: 0,
    blackChecks: 0,
    winner: null,
    enPassantTarget: null,
    castlingRights: inferCastlingRights(grid, config.rules),
    shieldedPos: null,
    gladiatorUsed: false,
    initialPieceTypes: computeInitialPieceTypes(grid),
    pendingRacingKingsWhiteGoal: false
  };
}

/**
 * Parse the piece-placement portion of a FEN string into a CustomBoardSquare[][] grid.
 */
export function fenToGrid(fen: string): (CustomBoardSquare | null)[][] {
  const placement = fen.split(' ')[0];
  const rows = placement.split('/');
  const grid: (CustomBoardSquare | null)[][] = [];

  for (const rowStr of rows) {
    const row: (CustomBoardSquare | null)[] = [];
    for (const ch of rowStr) {
      if (ch >= '1' && ch <= '9') {
        const count = parseInt(ch, 10);
        for (let i = 0; i < count; i++) row.push(null);
      } else {
        const isUpper = ch === ch.toUpperCase();
        const lower = ch.toLowerCase() as PieceType;
        row.push({ type: lower, color: isUpper ? 'w' : 'b' });
      }
    }
    grid.push(row);
  }
  return grid;
}

export interface PieceMoveOptions {
  enPassantTarget?: { row: number; col: number } | null;
  castlingRights?: CastlingRights;
  shieldedPos?: ShieldedPos | null;
  attackOnly?: boolean;
}

function isShieldedTarget(
  targetRow: number,
  targetCol: number,
  shieldedPos?: ShieldedPos | null
): boolean {
  return Boolean(shieldedPos && shieldedPos.row === targetRow && shieldedPos.col === targetCol);
}

// Generate pseudo-legal moves for a piece on custom grid
export function getPieceMoves(
  grid: (CustomBoardSquare | null)[][],
  row: number,
  col: number,
  rules: CustomVariantRules,
  duckPos: { row: number; col: number } | null,
  options: PieceMoveOptions = {}
): CustomMove[] {
  const height = grid.length;
  const width = grid[0].length;
  const square = grid[row][col];
  if (!square) return [];

  const moves: CustomMove[] = [];
  const seenKeys = new Set<string>();
  const color = square.color;
  const isWhite = color === 'w';
  const baseType = square.type;
  const promoTarget: PieceType = rules.promotionPiece || 'q';

  const pushMove = (move: CustomMove) => {
    const key = `${move.toRow},${move.toCol},${move.promotion || ''},${move.isCastle || ''}`;
    if (seenKeys.has(key)) return;
    seenKeys.add(key);
    moves.push(move);
  };

  const canCaptureTarget = (target: CustomBoardSquare, targetRow: number, targetCol: number): boolean => {
    if (target.type === 'd') return false;
    if (isShieldedTarget(targetRow, targetCol, options.shieldedPos)) return false;
    if (rules.atomicExplosions && baseType === 'k') return false;
    if (target.color !== color) return true;
    // Anti-Queen: Queen can capture friendly non-king pieces
    if (rules.antiQueen && baseType === 'q' && target.type !== 'k') return true;
    return false;
  };

  const addMoveIfValid = (
    targetRow: number,
    targetCol: number,
    isCaptureOnly = false,
    isStepOnly = false,
    pieceLabel: PieceType = baseType
  ) => {
    if (!isWithinBoard(targetRow, targetCol, height, width)) return false;
    if (duckPos && duckPos.row === targetRow && duckPos.col === targetCol) return false;

    const targetSquare = grid[targetRow][targetCol];
    if (targetSquare?.type === 'd') return false;

    if (!targetSquare) {
      if (!isCaptureOnly) {
        pushMove({
          fromRow: row,
          fromCol: col,
          toRow: targetRow,
          toCol: targetCol,
          piece: square,
          captured: null,
          san: `${pieceLabel.toUpperCase()}${coordsToSquare(targetRow, targetCol, height)}`
        });
        return true;
      }
      return false;
    }

    if (!isStepOnly && canCaptureTarget(targetSquare, targetRow, targetCol)) {
      pushMove({
        fromRow: row,
        fromCol: col,
        toRow: targetRow,
        toCol: targetCol,
        piece: square,
        captured: targetSquare,
        san: `${pieceLabel.toUpperCase()}x${coordsToSquare(targetRow, targetCol, height)}`
      });
    }
    return false;
  };

  const slideRay = (dRow: number, dCol: number, pieceLabel: PieceType = baseType) => {
    let r = row + dRow;
    let c = col + dCol;
    while (isWithinBoard(r, c, height, width)) {
      if (duckPos && duckPos.row === r && duckPos.col === c) break;
      const target = grid[r][c];
      if (!target) {
        pushMove({
          fromRow: row,
          fromCol: col,
          toRow: r,
          toCol: c,
          piece: square,
          captured: null,
          san: `${pieceLabel.toUpperCase()}${coordsToSquare(r, c, height)}`
        });
      } else {
        if (canCaptureTarget(target, r, c)) {
          pushMove({
            fromRow: row,
            fromCol: col,
            toRow: r,
            toCol: c,
            piece: square,
            captured: target,
            san: `${pieceLabel.toUpperCase()}x${coordsToSquare(r, c, height)}`
          });
        }
        break;
      }
      r += dRow;
      c += dCol;
    }
  };

  const generateKnightMoves = (pieceLabel: PieceType) => {
    const jumps = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of jumps) {
      const r1 = row + dr;
      const c1 = col + dc;
      addMoveIfValid(r1, c1, false, false, pieceLabel);

      // Knightmare: super-knights may chain a second L-jump if the intermediate square is completely empty
      if (
        rules.knightmare &&
        isWithinBoard(r1, c1, height, width) &&
        !grid[r1][c1] &&
        !(duckPos && duckPos.row === r1 && duckPos.col === c1)
      ) {
        for (const [dr2, dc2] of jumps) {
          const r2 = r1 + dr2;
          const c2 = c1 + dc2;
          if (r2 === row && c2 === col) continue;
          addMoveIfValid(r2, c2, false, false, pieceLabel);
        }
      }
    }
  };

  const movementProfiles: PieceType[] = [baseType];
  if (rules.absorption && square.absorbed?.length) {
    for (const ab of square.absorbed) {
      if (ab !== baseType && ab !== 'd' && !movementProfiles.includes(ab)) {
        movementProfiles.push(ab);
      }
    }
  }

  for (const activeType of movementProfiles) {
    switch (activeType) {
      case 'p': {
        const forwardDir = rules.reversePawns
          ? (isWhite ? 1 : -1)
          : (isWhite ? -1 : 1);
        const defaultStartRow = rules.reversePawns
          ? (isWhite ? 1 : height - 2)
          : (isWhite ? height - 2 : 1);
        const promoRow = rules.reversePawns
          ? (isWhite ? height - 1 : 0)
          : (isWhite ? 0 : height - 1);
        const canDoubleFromHere =
          rules.pawnDoubleStep &&
          (row === defaultStartRow || (Boolean(rules.horde) && isWhite && row >= height - 2));

        // Only advance moves if NOT attackOnly (pawns only attack diagonally)
        if (!options.attackOnly) {
          const f1Row = row + forwardDir;
          if (
            isWithinBoard(f1Row, col, height, width) &&
            !grid[f1Row][col] &&
            !(duckPos && duckPos.row === f1Row && duckPos.col === col)
          ) {
            const isPromo = f1Row === promoRow && baseType === 'p';
            pushMove({
              fromRow: row,
              fromCol: col,
              toRow: f1Row,
              toCol: col,
              piece: square,
              captured: null,
              promotion: isPromo ? promoTarget : undefined,
              san: isPromo
                ? `${coordsToSquare(f1Row, col, height)}=${promoTarget.toUpperCase()}`
                : coordsToSquare(f1Row, col, height)
            });

            if (canDoubleFromHere) {
              const f2Row = row + forwardDir * 2;
              if (
                isWithinBoard(f2Row, col, height, width) &&
                !grid[f2Row][col] &&
                !(duckPos && duckPos.row === f2Row && duckPos.col === col)
              ) {
                pushMove({
                  fromRow: row,
                  fromCol: col,
                  toRow: f2Row,
                  toCol: col,
                  piece: square,
                  captured: null,
                  san: coordsToSquare(f2Row, col, height)
                });
              }
            }
          }
        }

        for (const dCol of [-1, 1]) {
          const capRow = row + forwardDir;
          const capCol = col + dCol;
          if (!isWithinBoard(capRow, capCol, height, width)) continue;
          if (duckPos && duckPos.row === capRow && duckPos.col === capCol) continue;

          const target = grid[capRow][capCol];
          if (
            target &&
            target.type !== 'd' &&
            target.color !== color &&
            !isShieldedTarget(capRow, capCol, options.shieldedPos)
          ) {
            const isPromo = capRow === promoRow && baseType === 'p';
            pushMove({
              fromRow: row,
              fromCol: col,
              toRow: capRow,
              toCol: capCol,
              piece: square,
              captured: target,
              promotion: isPromo ? promoTarget : undefined,
              san: `${coordsToSquare(row, col, height)[0]}x${coordsToSquare(capRow, capCol, height)}${
                isPromo ? `=${promoTarget.toUpperCase()}` : ''
              }`
            });
          } else if (
            !options.attackOnly &&
            !target &&
            rules.enPassant &&
            options.enPassantTarget &&
            options.enPassantTarget.row === capRow &&
            options.enPassantTarget.col === capCol
          ) {
            const epPawn = grid[row][capCol];
            if (
              epPawn &&
              epPawn.type === 'p' &&
              epPawn.color !== color &&
              !isShieldedTarget(row, capCol, options.shieldedPos)
            ) {
              pushMove({
                fromRow: row,
                fromCol: col,
                toRow: capRow,
                toCol: capCol,
                piece: square,
                captured: epPawn,
                isEnPassant: true,
                epCaptureRow: row,
                epCaptureCol: capCol,
                san: `${coordsToSquare(row, col, height)[0]}x${coordsToSquare(capRow, capCol, height)}`
              });
            }
          }
        }
        break;
      }

      case 'n': {
        generateKnightMoves(baseType);
        break;
      }

      case 'b': {
        slideRay(-1, -1, baseType);
        slideRay(-1, 1, baseType);
        slideRay(1, -1, baseType);
        slideRay(1, 1, baseType);
        break;
      }

      case 'r': {
        slideRay(-1, 0, baseType);
        slideRay(1, 0, baseType);
        slideRay(0, -1, baseType);
        slideRay(0, 1, baseType);
        break;
      }

      case 'q': {
        slideRay(-1, 0, baseType);
        slideRay(1, 0, baseType);
        slideRay(0, -1, baseType);
        slideRay(0, 1, baseType);
        slideRay(-1, -1, baseType);
        slideRay(-1, 1, baseType);
        slideRay(1, -1, baseType);
        slideRay(1, 1, baseType);
        break;
      }

      case 'k': {
        const steps = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ];
        for (const [dr, dc] of steps) {
          addMoveIfValid(row + dr, col + dc, false, false, baseType);
        }

        // Castling (standard back-rank on 8-column boards when permitted)
        if (
          activeType === 'k' &&
          !options.attackOnly &&
          rules.castling &&
          options.castlingRights &&
          width === 8 &&
          col === 4
        ) {
          const homeRow = isWhite ? height - 1 : 0;
          const oppColor: PieceColor = isWhite ? 'b' : 'w';
          const canKingSide = isWhite ? options.castlingRights.wK : options.castlingRights.bK;
          const canQueenSide = isWhite ? options.castlingRights.wQ : options.castlingRights.bQ;

          if (row === homeRow) {
            const duckBlocks = (r: number, c: number) => duckPos && duckPos.row === r && duckPos.col === c;
            const kingAttackedNow = isSquareAttacked(grid, homeRow, 4, oppColor, rules, duckPos);

            if (
              canKingSide &&
              !kingAttackedNow &&
              grid[homeRow][7]?.type === 'r' &&
              grid[homeRow][7]?.color === color &&
              !grid[homeRow][5] &&
              !grid[homeRow][6] &&
              !duckBlocks(homeRow, 5) &&
              !duckBlocks(homeRow, 6) &&
              !isSquareAttacked(grid, homeRow, 5, oppColor, rules, duckPos) &&
              !isSquareAttacked(grid, homeRow, 6, oppColor, rules, duckPos)
            ) {
              pushMove({
                fromRow: row,
                fromCol: col,
                toRow: homeRow,
                toCol: 6,
                piece: square,
                captured: null,
                isCastle: 'k',
                san: 'O-O'
              });
            }

            if (
              canQueenSide &&
              !kingAttackedNow &&
              grid[homeRow][0]?.type === 'r' &&
              grid[homeRow][0]?.color === color &&
              !grid[homeRow][1] &&
              !grid[homeRow][2] &&
              !grid[homeRow][3] &&
              !duckBlocks(homeRow, 1) &&
              !duckBlocks(homeRow, 2) &&
              !duckBlocks(homeRow, 3) &&
              !isSquareAttacked(grid, homeRow, 3, oppColor, rules, duckPos) &&
              !isSquareAttacked(grid, homeRow, 2, oppColor, rules, duckPos)
            ) {
              pushMove({
                fromRow: row,
                fromCol: col,
                toRow: homeRow,
                toCol: 2,
                piece: square,
                captured: null,
                isCastle: 'q',
                san: 'O-O-O'
              });
            }
          }
        }
        break;
      }

      case 'e': { // Elephant / Gaja (Alfil) - Leaps 2 squares diagonally
        const leaps = [
          [-2, -2], [-2, 2],
          [2, -2],  [2, 2]
        ];
        for (const [dr, dc] of leaps) {
          addMoveIfValid(row + dr, col + dc, false, false, baseType);
        }
        break;
      }

      case 'f': { // Ferz / Mantri - 1 square diagonally
        const steps = [
          [-1, -1], [-1, 1],
          [1, -1],  [1, 1]
        ];
        for (const [dr, dc] of steps) {
          addMoveIfValid(row + dr, col + dc, false, false, baseType);
        }
        break;
      }

      case 'c': { // Chancellor (Rook + Knight)
        slideRay(-1, 0, baseType);
        slideRay(1, 0, baseType);
        slideRay(0, -1, baseType);
        slideRay(0, 1, baseType);
        generateKnightMoves(baseType);
        break;
      }

      case 'a': { // Archbishop (Bishop + Knight)
        slideRay(-1, -1, baseType);
        slideRay(-1, 1, baseType);
        slideRay(1, -1, baseType);
        slideRay(1, 1, baseType);
        generateKnightMoves(baseType);
        break;
      }

      case 'z': { // Amazon (Queen + Knight)
        slideRay(-1, 0, baseType);
        slideRay(1, 0, baseType);
        slideRay(0, -1, baseType);
        slideRay(0, 1, baseType);
        slideRay(-1, -1, baseType);
        slideRay(-1, 1, baseType);
        slideRay(1, -1, baseType);
        slideRay(1, 1, baseType);
        generateKnightMoves(baseType);
        break;
      }

      case 'o': { // Cannon (Pao)
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dr, dc] of dirs) {
          let r = row + dr;
          let c = col + dc;
          let hoppedScreen = false;
          while (isWithinBoard(r, c, height, width)) {
            if (duckPos && duckPos.row === r && duckPos.col === c) break;
            const target = grid[r][c];
            if (!hoppedScreen) {
              if (!target) {
                if (!options.attackOnly) {
                  pushMove({
                    fromRow: row,
                    fromCol: col,
                    toRow: r,
                    toCol: c,
                    piece: square,
                    captured: null,
                    san: `${baseType.toUpperCase()}${coordsToSquare(r, c, height)}`
                  });
                }
              } else {
                hoppedScreen = true;
              }
            } else {
              if (target) {
                if (
                  target.type !== 'd' &&
                  target.color !== color &&
                  !isShieldedTarget(r, c, options.shieldedPos)
                ) {
                  pushMove({
                    fromRow: row,
                    fromCol: col,
                    toRow: r,
                    toCol: c,
                    piece: square,
                    captured: target,
                    san: `${baseType.toUpperCase()}x${coordsToSquare(r, c, height)}`
                  });
                }
                break;
              }
            }
            r += dr;
            c += dc;
          }
        }
        break;
      }

      case 'm': { // Guard / Mann
        const steps = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ];
        for (const [dr, dc] of steps) {
          addMoveIfValid(row + dr, col + dc, false, false, baseType);
        }
        break;
      }

      case 'd':
      default:
        break;
    }
  }

  return moves;
}

export function findKingPosition(
  grid: (CustomBoardSquare | null)[][],
  color: PieceColor
): { row: number; col: number } | null {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const p = grid[r][c];
      if (p && p.color === color && p.type === 'k') {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

export function isSquareAttacked(
  grid: (CustomBoardSquare | null)[][],
  targetRow: number,
  targetCol: number,
  byColor: PieceColor,
  rules: CustomVariantRules,
  duckPos: { row: number; col: number } | null
): boolean {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const p = grid[r][c];
      if (p && p.color === byColor && p.type !== 'd') {
        const oppMoves = getPieceMoves(grid, r, c, rules, duckPos, { attackOnly: true });
        if (oppMoves.some(m => m.toRow === targetRow && m.toCol === targetCol)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isKingInCheck(
  grid: (CustomBoardSquare | null)[][],
  color: PieceColor,
  rules: CustomVariantRules,
  duckPos: { row: number; col: number } | null
): boolean {
  const kingPos = findKingPosition(grid, color);
  if (!kingPos) return false;
  const opponent: PieceColor = color === 'w' ? 'b' : 'w';
  return isSquareAttacked(grid, kingPos.row, kingPos.col, opponent, rules, duckPos);
}

function applyRawMove(
  grid: (CustomBoardSquare | null)[][],
  move: CustomMove,
  rules: CustomVariantRules
): (CustomBoardSquare | null)[][] {
  const height = grid.length;
  const width = grid[0].length;
  const nextGrid = cloneCustomGrid(grid);
  const movingPiece: CustomBoardSquare = {
    ...move.piece,
    absorbed: move.piece.absorbed ? [...move.piece.absorbed] : undefined
  };

  if (move.promotion) {
    movingPiece.type = move.promotion;
  }

  // Absorption: absorber permanently learns captured piece's movement profile
  if (rules.absorption && move.captured && !rules.atomicExplosions) {
    const existing = new Set<PieceType>(movingPiece.absorbed || []);
    if (move.captured.type !== movingPiece.type && move.captured.type !== 'd') {
      existing.add(move.captured.type);
    }
    if (move.captured.absorbed) {
      for (const ab of move.captured.absorbed) {
        if (ab !== movingPiece.type && ab !== 'd') existing.add(ab);
      }
    }
    movingPiece.absorbed = Array.from(existing);
  }

  nextGrid[move.fromRow][move.fromCol] = null;
  nextGrid[move.toRow][move.toCol] = movingPiece;

  // En passant capture removal
  if (
    move.isEnPassant &&
    typeof move.epCaptureRow === 'number' &&
    typeof move.epCaptureCol === 'number'
  ) {
    nextGrid[move.epCaptureRow][move.epCaptureCol] = null;
  }

  // Castling rook shift
  if (move.isCastle && width === 8) {
    const homeRow = move.fromRow;
    if (move.isCastle === 'k') {
      const rook = nextGrid[homeRow][7];
      nextGrid[homeRow][7] = null;
      nextGrid[homeRow][5] = rook;
    } else if (move.isCastle === 'q') {
      const rook = nextGrid[homeRow][0];
      nextGrid[homeRow][0] = null;
      nextGrid[homeRow][3] = rook;
    }
  }

  if (rules.atomicExplosions && move.captured) {
    nextGrid[move.toRow][move.toCol] = null;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const ar = move.toRow + dr;
        const ac = move.toCol + dc;
        if (isWithinBoard(ar, ac, height, width)) {
          const adj = nextGrid[ar][ac];
          if (adj && adj.type !== 'p') {
            nextGrid[ar][ac] = null;
          }
        }
      }
    }
  }

  return nextGrid;
}

function getPseudoLegalMovesForColor(
  grid: (CustomBoardSquare | null)[][],
  color: PieceColor,
  rules: CustomVariantRules,
  duckPos: { row: number; col: number } | null,
  options: PieceMoveOptions = {}
): CustomMove[] {
  const allMoves: CustomMove[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const piece = grid[r][c];
      if (piece && piece.color === color && piece.type !== 'd') {
        allMoves.push(...getPieceMoves(grid, r, c, rules, duckPos, options));
      }
    }
  }
  return allMoves;
}

export function getAllLegalMoves(state: CustomGameState): CustomMove[] {
  const { grid, turn, config, duckPos } = state;
  const rules = config.rules;
  const castlingRights = state.castlingRights ?? inferCastlingRights(grid, rules);
  const opponent: PieceColor = turn === 'w' ? 'b' : 'w';

  let filtered = getPseudoLegalMovesForColor(grid, turn, rules, duckPos, {
    enPassantTarget: state.enPassantTarget,
    castlingRights,
    shieldedPos: state.shieldedPos
  });

  // Mandatory captures (Antichess / Giveaway)
  if (rules.mandatoryCaptures) {
    const captureMoves = filtered.filter(m => m.captured !== null && m.captured !== undefined);
    if (captureMoves.length > 0) {
      filtered = captureMoves;
    }
    return filtered;
  }

  // Atomic: cannot make a move that explodes your own King (unless King doesn't exist)
  if (rules.atomicExplosions && findKingPosition(grid, turn)) {
    filtered = filtered.filter(move => {
      const simGrid = applyRawMove(grid, move, rules);
      if (!findKingPosition(simGrid, turn)) return false;
      // If opponent King didn't blow up, don't leave our own King in check
      if (findKingPosition(simGrid, opponent) && isKingInCheck(simGrid, turn, rules, duckPos)) {
        return false;
      }
      return true;
    });
    return filtered;
  }

  // Racing Kings: neither self-check nor delivering check is legal
  if (rules.winConditions.racingKings) {
    filtered = filtered.filter(move => {
      const simGrid = applyRawMove(grid, move, rules);
      if (isKingInCheck(simGrid, turn, rules, duckPos)) return false;
      if (isKingInCheck(simGrid, opponent, rules, duckPos)) return false;
      return true;
    });
    return filtered;
  }

  // Checkless: Kings MAY step into checked squares, EXCEPT delivering check is illegal unless it is immediate checkmate
  if (rules.checkless) {
    filtered = filtered.filter(move => {
      const simGrid = applyRawMove(grid, move, rules);
      if (!isKingInCheck(simGrid, opponent, rules, duckPos)) return true;
      // Opponent is in check: allow ONLY if opponent has zero moves escaping check (i.e. immediate checkmate)
      const oppReplies = getPseudoLegalMovesForColor(simGrid, opponent, rules, duckPos);
      const hasEscape = oppReplies.some(reply => {
        const afterReply = applyRawMove(simGrid, reply, rules);
        return !isKingInCheck(afterReply, opponent, rules, duckPos);
      });
      return !hasEscape;
    });
    return filtered;
  }

  // Standard self-check prevention when checkmate applies and side has a royal King (not Extinction)
  const hasKing = !!findKingPosition(grid, turn);
  if (rules.winConditions.checkmate && !rules.winConditions.extinction && hasKing) {
    filtered = filtered.filter(move => {
      const simGrid = applyRawMove(grid, move, rules);
      return !isKingInCheck(simGrid, turn, rules, duckPos);
    });
  }

  return filtered;
}

function updateCastlingRightsForMove(
  prev: CastlingRights,
  move: CustomMove,
  height: number
): CastlingRights {
  const next = { ...prev };
  if (move.piece.type === 'k') {
    if (move.piece.color === 'w') {
      next.wK = false;
      next.wQ = false;
    } else {
      next.bK = false;
      next.bQ = false;
    }
  }
  const bottom = height - 1;
  if ((move.fromRow === bottom && move.fromCol === 7) || (move.toRow === bottom && move.toCol === 7)) next.wK = false;
  if ((move.fromRow === bottom && move.fromCol === 0) || (move.toRow === bottom && move.toCol === 0)) next.wQ = false;
  if ((move.fromRow === 0 && move.fromCol === 7) || (move.toRow === 0 && move.toCol === 7)) next.bK = false;
  if ((move.fromRow === 0 && move.fromCol === 0) || (move.toRow === 0 && move.toCol === 0)) next.bQ = false;
  return next;
}

const PIECE_DISPLAY_NAMES: Record<PieceType, string> = {
  p: 'Pawns',
  n: 'Knights',
  b: 'Bishops',
  r: 'Rooks',
  q: 'Queens',
  k: 'Kings',
  e: 'Elephants',
  f: 'Ferzes',
  c: 'Chancellors',
  a: 'Archbishops',
  z: 'Amazons',
  o: 'Cannons',
  m: 'Guards',
  d: 'Ducks'
};

export function executeCustomMove(state: CustomGameState, move: CustomMove): CustomGameState {
  const height = state.grid.length;
  const width = state.grid[0].length;
  const rules = state.config.rules;
  const nextGrid = applyRawMove(state.grid, move, rules);

  const nextTurn: PieceColor = state.turn === 'w' ? 'b' : 'w';
  const nextHistory = [...state.history, move];

  // Track En Passant opportunity for pawn double steps
  const nextEnPassantTarget =
    rules.enPassant && move.piece.type === 'p' && Math.abs(move.toRow - move.fromRow) === 2
      ? {
          row: Math.round((move.fromRow + move.toRow) / 2),
          col: move.toCol
        }
      : null;

  const currentCastling = state.castlingRights ?? inferCastlingRights(state.grid, rules);
  const nextCastling = updateCastlingRightsForMove(currentCastling, move, height);

  // Track Gladiator first-blood 1-turn shield
  let nextGladiatorUsed = Boolean(state.gladiatorUsed);
  let nextShieldedPos: ShieldedPos | null = state.shieldedPos ?? null;
  if (nextShieldedPos && nextShieldedPos.expiresAfterTurn === state.turn) {
    nextShieldedPos = null;
  }
  if (rules.gladiator && !nextGladiatorUsed && move.captured && !rules.atomicExplosions) {
    nextGladiatorUsed = true;
    nextShieldedPos = {
      row: move.toRow,
      col: move.toCol,
      protectedColor: state.turn,
      expiresAfterTurn: nextTurn
    };
  }

  let whiteChecks = state.whiteChecks;
  let blackChecks = state.blackChecks;
  let winner: PieceColor | 'draw' | null = null;
  let winReason: string | undefined = undefined;
  let pendingRacingKingsWhiteGoal = state.pendingRacingKingsWhiteGoal || false;

  const opponentInCheck = isKingInCheck(nextGrid, nextTurn, rules, state.duckPos);
  if (opponentInCheck) {
    if (state.turn === 'w') whiteChecks += 1;
    else blackChecks += 1;
  }

  // 1. Center Hill
  if (rules.winConditions.centerHill) {
    const midR1 = Math.floor((height - 1) / 2);
    const midR2 = Math.floor(height / 2);
    const midC1 = Math.floor((width - 1) / 2);
    const midC2 = Math.floor(width / 2);
    if (
      (move.toRow === midR1 || move.toRow === midR2) &&
      (move.toCol === midC1 || move.toCol === midC2) &&
      move.piece.type === 'k'
    ) {
      winner = state.turn;
      winReason = `${state.turn === 'w' ? 'White' : 'Black'} King conquered the center hill!`;
    }
  }

  // 2. Racing Kings (both White & Black start on bottom ranks and race to row 0)
  if (!winner && rules.winConditions.racingKings) {
    const reachedFinish = move.piece.type === 'k' && move.toRow === 0;
    if (pendingRacingKingsWhiteGoal) {
      if (reachedFinish && state.turn === 'b') {
        winner = 'draw';
        winReason = 'Racing Kings Draw — Black matched White to the 8th rank!';
      } else {
        winner = 'w';
        winReason = 'White King reached the finish rank first!';
      }
      pendingRacingKingsWhiteGoal = false;
    } else if (reachedFinish) {
      if (state.turn === 'w') {
        // Check whether Black has any legal reply reaching row 0 immediately
        const probeState: CustomGameState = {
          ...state,
          grid: nextGrid,
          turn: 'b',
          enPassantTarget: nextEnPassantTarget,
          castlingRights: nextCastling
        };
        const blackReplies = getAllLegalMoves(probeState);
        const blackCanMatch = blackReplies.some(r => r.piece.type === 'k' && r.toRow === 0);
        if (blackCanMatch) {
          pendingRacingKingsWhiteGoal = true;
        } else {
          winner = 'w';
          winReason = 'White King reached the finish rank!';
        }
      } else {
        winner = 'b';
        winReason = 'Black King reached the finish rank!';
      }
    }
  }

  // 3. Three-Check
  if (!winner && rules.winConditions.threeCheck) {
    if (whiteChecks >= 3) {
      winner = 'w';
      winReason = 'White delivered 3 checks!';
    } else if (blackChecks >= 3) {
      winner = 'b';
      winReason = 'Black delivered 3 checks!';
    }
  }

  // 4. Bare King Victory (Chaturanga / Shatranj)
  if (!winner && rules.winConditions.bareKing) {
    let opponentNonKingCount = 0;
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const p = nextGrid[r][c];
        if (p && p.color === nextTurn && p.type !== 'k' && p.type !== 'd') {
          opponentNonKingCount++;
        }
      }
    }
    if (opponentNonKingCount === 0) {
      winner = state.turn;
      winReason = `${state.turn === 'w' ? 'White' : 'Black'} bared the opponent King!`;
    }
  }

  // 5. Horde Victory (Black wins if White has 0 pieces remaining)
  if (!winner && rules.horde) {
    let whiteCount = 0;
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const p = nextGrid[r][c];
        if (p && p.color === 'w' && p.type !== 'd') whiteCount++;
      }
    }
    if (whiteCount === 0) {
      winner = 'b';
      winReason = 'Black captured every White piece in the Horde!';
    }
  }

  // 6. Extinction Victory (wipe out all enemy pieces of any starting species)
  const initialTypes = state.initialPieceTypes ?? computeInitialPieceTypes(state.config.grid);
  if (!winner && rules.winConditions.extinction) {
    const oppRemaining = new Set<PieceType>();
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const p = nextGrid[r][c];
        if (p && p.color === nextTurn && p.type !== 'd') {
          oppRemaining.add(p.type);
        }
      }
    }
    const extinctType = initialTypes[nextTurn].find(t => !oppRemaining.has(t));
    if (extinctType) {
      winner = state.turn;
      winReason = `Extinction! ${state.turn === 'w' ? 'White' : 'Black'} eliminated all enemy ${PIECE_DISPLAY_NAMES[extinctType] || extinctType}!`;
    }
  }

  // 7. King elimination (Atomic explosions or capture of non-checkmate royal king)
  if (!winner && !rules.mandatoryCaptures && !rules.winConditions.extinction) {
    let whiteKing = false;
    let blackKing = false;
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const p = nextGrid[r][c];
        if (p?.type === 'k') {
          if (p.color === 'w') whiteKing = true;
          if (p.color === 'b') blackKing = true;
        }
      }
    }
    if (!whiteKing && blackKing && !rules.horde) {
      winner = 'b';
      winReason = 'White King was eliminated!';
    } else if (!blackKing && whiteKing) {
      winner = 'w';
      winReason = 'Black King was eliminated!';
    }
  }

  // 8. Antichess / Giveaway all-pieces-lost victory
  if (!winner && rules.mandatoryCaptures) {
    let moverPieces = 0;
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const p = nextGrid[r][c];
        if (p && p.color === state.turn && p.type !== 'd') moverPieces++;
      }
    }
    if (moverPieces === 0) {
      winner = state.turn;
      winReason = `${state.turn === 'w' ? 'White' : 'Black'} cleared all pieces (Antichess victory)!`;
    }
  }

  const nextState: CustomGameState = {
    ...state,
    grid: nextGrid,
    turn: nextTurn,
    moveNumber: state.turn === 'b' ? state.moveNumber + 1 : state.moveNumber,
    history: nextHistory,
    whiteChecks,
    blackChecks,
    winner,
    winReason,
    enPassantTarget: nextEnPassantTarget,
    castlingRights: nextCastling,
    shieldedPos: nextShieldedPos,
    gladiatorUsed: nextGladiatorUsed,
    initialPieceTypes: initialTypes,
    pendingRacingKingsWhiteGoal
  };

  // 9. Checkmate or Stalemate check
  if (!winner) {
    const nextLegal = getAllLegalMoves(nextState);
    if (nextLegal.length === 0) {
      if (rules.mandatoryCaptures) {
        // In Antichess/Giveaway, having zero legal moves wins immediately
        nextState.winner = nextTurn;
        nextState.winReason = `${nextTurn === 'w' ? 'White' : 'Black'} has no legal moves left and wins!`;
      } else if (rules.winConditions.checkmate) {
        const hasOpponentKing = !!findKingPosition(nextGrid, nextTurn);
        if (hasOpponentKing && opponentInCheck) {
          nextState.winner = state.turn;
          nextState.winReason = `Checkmate! ${state.turn === 'w' ? 'White' : 'Black'} wins.`;
        } else if (rules.stalemateWins) {
          nextState.winner = state.turn;
          nextState.winReason = `Stalemate Victory! ${state.turn === 'w' ? 'White' : 'Black'} wins by stalemating the opponent.`;
        } else {
          nextState.winner = 'draw';
          nextState.winReason = 'Stalemate — no legal moves available.';
        }
      }
    }
  }

  return nextState;
}

export function evaluateCustomBoard(
  grid: (CustomBoardSquare | null)[][],
  rules?: CustomVariantRules
): number {
  const values: Record<PieceType, number> = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: rules?.mandatoryCaptures ? 150 : 20000,
    e: 250,
    f: 200,
    c: 800,
    a: 700,
    z: 1200,
    o: 450,
    m: 350,
    d: 0
  };

  let score = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const piece = grid[r][c];
      if (!piece) continue;
      let val = values[piece.type] || 100;
      if (piece.absorbed?.length) {
        val += piece.absorbed.length * 140;
      }
      if (rules?.winConditions.racingKings && piece.type === 'k') {
        val += (grid.length - 1 - r) * 90;
      }
      score += piece.color === 'w' ? val : -val;
    }
  }
  // In Antichess/Giveaway, fewer material points is BETTER
  return rules?.mandatoryCaptures ? -score : score;
}

export function chooseSmartDuckPos(state: CustomGameState): { row: number; col: number } | null {
  const height = state.grid.length;
  const width = state.grid[0].length;
  const enemyColor: PieceColor = state.turn; // Duck is placed after mover finishes, turn already switched to next player
  const enemyKing = findKingPosition(state.grid, enemyColor);
  const candidates: { row: number; col: number; score: number }[] = [];

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (state.grid[r][c]) continue;
      if (state.duckPos && state.duckPos.row === r && state.duckPos.col === c) continue;
      let s = 0;
      // Central control preference
      const centerDist = Math.abs(r - (height - 1) / 2) + Math.abs(c - (width - 1) / 2);
      s += Math.max(0, 6 - centerDist);
      // Prefer blocking squares directly adjacent to the opponent king or high-value enemy sliders
      if (enemyKing) {
        const kingDist = Math.max(Math.abs(r - enemyKing.row), Math.abs(c - enemyKing.col));
        if (kingDist === 1) s += 14;
        else if (kingDist === 2) s += 6;
      }
      // Bonus for sitting along rank/file/diagonal near high-value opponent piece
      for (let rr = 0; rr < height; rr++) {
        for (let cc = 0; cc < width; cc++) {
          const p = state.grid[rr][cc];
          if (p && p.color === enemyColor && (p.type === 'q' || p.type === 'r' || p.type === 'b')) {
            if (Math.abs(rr - r) <= 1 && Math.abs(cc - c) <= 1) s += 5;
          }
        }
      }
      candidates.push({ row: r, col: c, score: s + Math.random() * 1.5 });
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return { row: candidates[0].row, col: candidates[0].col };
}

export function getCustomAIMove(
  state: CustomGameState,
  bot?: { elo: number; blunderRate: number }
): CustomMove | null {
  const legalMoves = getAllLegalMoves(state);
  if (legalMoves.length === 0) return null;

  if (bot && bot.blunderRate > 0 && Math.random() < bot.blunderRate && legalMoves.length > 1) {
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  const isWhite = state.turn === 'w';
  const rules = state.config.rules;
  let bestScore = isWhite ? -Infinity : Infinity;
  let bestMove = legalMoves[0];

  const ordered = [...legalMoves]
    .sort((a, b) => {
      const scoreA = (a.captured ? 100 : 0) + (a.promotion ? 80 : 0) + (a.isCastle ? 40 : 0);
      const scoreB = (b.captured ? 100 : 0) + (b.promotion ? 80 : 0) + (b.isCastle ? 40 : 0);
      return scoreB - scoreA;
    })
    .slice(0, 48);

  for (const move of ordered) {
    const nextState = executeCustomMove(state, move);
    if (nextState.winner === state.turn) return move;

    const replies = getAllLegalMoves(nextState).slice(0, 32);
    let replyScore = isWhite ? Infinity : -Infinity;

    if (replies.length === 0) {
      replyScore = evaluateCustomBoard(nextState.grid, rules);
    } else {
      for (const r of replies) {
        const afterReply = executeCustomMove(nextState, r);
        if (afterReply.winner === nextState.turn) {
          replyScore = isWhite ? -19000 : 19000;
          break;
        }
        const evalScore = evaluateCustomBoard(afterReply.grid, rules);
        if (isWhite) {
          replyScore = Math.min(replyScore, evalScore);
        } else {
          replyScore = Math.max(replyScore, evalScore);
        }
      }
    }

    if (isWhite) {
      if (replyScore > bestScore) {
        bestScore = replyScore;
        bestMove = move;
      }
    } else {
      if (replyScore < bestScore) {
        bestScore = replyScore;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

export function collectPiecesUsed(grid: (CustomBoardSquare | null)[][]): PieceType[] {
  const set = new Set<PieceType>();
  for (const row of grid) {
    for (const sq of row) {
      if (sq) set.add(sq.type);
    }
  }
  return Array.from(set);
}

/**
 * Convert ANY of the 36 catalog variants into an editable/playable CustomVariantConfig.
 */
export function variantToCustomConfig(variantId: VariantId): CustomVariantConfig {
  if (variantId === 'chaturanga') {
    return {
      ...DEFAULT_CUSTOM_PRESETS[0],
      grid: cloneCustomGrid(DEFAULT_CUSTOM_PRESETS[0].grid)
    };
  }

  const def = CHESS_VARIANTS.find(v => v.id === variantId) || CHESS_VARIANTS[0];
  let startFen = def.startFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  if (variantId === 'chess960') {
    startFen = generateChess960Fen();
  } else if (variantId === 'transcendental') {
    startFen = generateTranscendentalFen();
  } else if (variantId === 'grand_chess' || variantId === 'capablanca_10x8') {
    const capablanca = variantId === 'capablanca_10x8';
    return {
      ...DEFAULT_CUSTOM_PRESETS[1],
      id: `variant_${variantId}`,
      name: def.name,
      tagline: def.tagline,
      description: def.description,
      grid: capablanca
        ? [
            [
              { type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'a', color: 'b' }, { type: 'b', color: 'b' },
              { type: 'q', color: 'b' }, { type: 'k', color: 'b' }, { type: 'b', color: 'b' }, { type: 'c', color: 'b' },
              { type: 'n', color: 'b' }, { type: 'r', color: 'b' }
            ],
            Array.from({ length: 10 }, () => ({ type: 'p' as PieceType, color: 'b' as PieceColor })),
            Array.from({ length: 10 }, () => null),
            Array.from({ length: 10 }, () => null),
            Array.from({ length: 10 }, () => null),
            Array.from({ length: 10 }, () => null),
            Array.from({ length: 10 }, () => ({ type: 'p' as PieceType, color: 'w' as PieceColor })),
            [
              { type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'a', color: 'w' }, { type: 'b', color: 'w' },
              { type: 'q', color: 'w' }, { type: 'k', color: 'w' }, { type: 'b', color: 'w' }, { type: 'c', color: 'w' },
              { type: 'n', color: 'w' }, { type: 'r', color: 'w' }
            ]
          ]
        : cloneCustomGrid(DEFAULT_CUSTOM_PRESETS[1].grid)
    };
  } else if (variantId === 'los_alamos') {
    return {
      ...DEFAULT_CUSTOM_PRESETS[2],
      id: `variant_${variantId}`,
      name: def.name,
      tagline: def.tagline,
      description: def.description,
      grid: cloneCustomGrid(DEFAULT_CUSTOM_PRESETS[2].grid)
    };
  } else if (variantId === 'minichess_5x5') {
    return {
      ...DEFAULT_CUSTOM_PRESETS[4],
      id: `variant_${variantId}`,
      name: def.name,
      tagline: def.tagline,
      description: def.description,
      grid: cloneCustomGrid(DEFAULT_CUSTOM_PRESETS[4].grid)
    };
  } else if (variantId === 'cannon_siege') {
    return {
      ...DEFAULT_CUSTOM_PRESETS[3],
      id: `variant_${variantId}`,
      name: def.name,
      tagline: def.tagline,
      description: def.description,
      grid: cloneCustomGrid(DEFAULT_CUSTOM_PRESETS[3].grid)
    };
  } else if (variantId === 'shatranj') {
    startFen = 'rnefkner/pppppppp/8/8/8/8/PPPPPPPP/RNEFKNER w - - 0 1';
    const grid = fenToGrid(startFen);
    return {
      id: `variant_${variantId}`,
      name: def.name,
      tagline: def.tagline,
      description: def.description,
      boardWidth: 8,
      boardHeight: 8,
      grid,
      rules: {
        pawnDoubleStep: false,
        enPassant: false,
        castling: false,
        mandatoryCaptures: false,
        atomicExplosions: false,
        allowDuckPlacement: false,
        stalemateWins: true,
        promotionPiece: 'f',
        winConditions: {
          checkmate: true,
          centerHill: false,
          racingKings: false,
          bareKing: true,
          threeCheck: false
        }
      },
      customPiecesUsed: collectPiecesUsed(grid),
      createdAt: new Date().toISOString().split('T')[0]
    };
  } else if (variantId === 'amazon_chess') {
    startFen = 'rnbzkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBZKBNR w KQkq - 0 1';
  }

  const grid = fenToGrid(startFen);
  const boardHeight = grid.length;
  const boardWidth = grid[0]?.length || 8;
  const isAntichess = variantId === 'antichess' || variantId === 'giveaway';
  const isHorde = variantId === 'horde';
  const isUpsideDown = variantId === 'upside_down';
  const isExtinction = variantId === 'extinction';
  const isRacingKings = variantId === 'racing_kings';

  return {
    id: `variant_${variantId}`,
    name: def.name,
    tagline: def.tagline,
    description: def.description,
    boardWidth,
    boardHeight,
    grid,
    rules: {
      pawnDoubleStep: true,
      enPassant: !isUpsideDown,
      castling: !isRacingKings && !isHorde && !isUpsideDown && !isAntichess && !isExtinction,
      mandatoryCaptures: isAntichess,
      atomicExplosions: variantId === 'atomic',
      allowDuckPlacement: variantId === 'duck_chess',
      reversePawns: isUpsideDown,
      horde: isHorde,
      checkless: variantId === 'checkless',
      antiQueen: variantId === 'anti_queen',
      gladiator: variantId === 'gladiator',
      absorption: variantId === 'absorption',
      knightmare: variantId === 'knightmare',
      promotionPiece: variantId === 'amazon_chess' ? 'z' : 'q',
      winConditions: {
        checkmate: !isAntichess && !isExtinction && !isRacingKings,
        centerHill: variantId === 'king_of_the_hill',
        racingKings: isRacingKings,
        bareKing: false,
        threeCheck: variantId === 'three_check',
        extinction: isExtinction
      }
    },
    customPiecesUsed: collectPiecesUsed(grid),
    createdAt: new Date().toISOString().split('T')[0]
  };
}

// BUILT-IN PRESETS
export const DEFAULT_CUSTOM_PRESETS: CustomVariantConfig[] = [
  {
    id: 'preset_chaturanga',
    name: 'Ancient Chaturanga',
    tagline: '8x8 Ashtapada with Gaja (Elephant) & Mantri (Counselor)',
    description: 'The ancient 6th-century Indian ancestor of chess. Padati advance 1 step and promote to Mantri; Gaja leaps 2 squares diagonally; victory by checkmate or baring the enemy Raja.',
    boardWidth: 8,
    boardHeight: 8,
    rules: {
      pawnDoubleStep: false,
      enPassant: false,
      castling: false,
      mandatoryCaptures: false,
      atomicExplosions: false,
      allowDuckPlacement: false,
      promotionPiece: 'f',
      winConditions: {
        checkmate: true,
        centerHill: false,
        racingKings: false,
        bareKing: true,
        threeCheck: false
      }
    },
    customPiecesUsed: ['r', 'n', 'e', 'k', 'f', 'p'],
    createdAt: '2026-11-11',
    grid: [
      [{ type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'e', color: 'b' }, { type: 'k', color: 'b' }, { type: 'f', color: 'b' }, { type: 'e', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }],
      [{ type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [{ type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }],
      [{ type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'e', color: 'w' }, { type: 'k', color: 'w' }, { type: 'f', color: 'w' }, { type: 'e', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w' }]
    ]
  },
  {
    id: 'preset_grand_fairy',
    name: 'Grand Fairy Arena (10x8)',
    tagline: 'Empress Chancellor & Princess Archbishop',
    description: 'Expanded 10x8 battlefield with Chancellor (Rook+Knight) and Archbishop (Bishop+Knight).',
    boardWidth: 10,
    boardHeight: 8,
    rules: {
      pawnDoubleStep: true,
      enPassant: true,
      castling: false,
      mandatoryCaptures: false,
      atomicExplosions: false,
      allowDuckPlacement: false,
      promotionPiece: 'q',
      winConditions: {
        checkmate: true,
        centerHill: false,
        racingKings: false,
        bareKing: false,
        threeCheck: false
      }
    },
    customPiecesUsed: ['r', 'n', 'b', 'c', 'q', 'k', 'a', 'p'],
    createdAt: '2026-11-11',
    grid: [
      [{ type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'b', color: 'b' }, { type: 'c', color: 'b' }, { type: 'q', color: 'b' }, { type: 'k', color: 'b' }, { type: 'a', color: 'b' }, { type: 'b', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }],
      [{ type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [{ type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }],
      [{ type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'b', color: 'w' }, { type: 'c', color: 'w' }, { type: 'q', color: 'w' }, { type: 'k', color: 'w' }, { type: 'a', color: 'w' }, { type: 'b', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w' }]
    ]
  },
  {
    id: 'preset_mini_6x6',
    name: 'Los Alamos Mini (6x6)',
    tagline: 'Fast tactical skirmish on 6x6',
    description: 'Famous 6x6 miniature variant without bishops. Intense close-quarters battle that forces rapid endgame mastery.',
    boardWidth: 6,
    boardHeight: 6,
    rules: {
      pawnDoubleStep: false,
      enPassant: false,
      castling: false,
      mandatoryCaptures: false,
      atomicExplosions: false,
      allowDuckPlacement: false,
      promotionPiece: 'q',
      winConditions: {
        checkmate: true,
        centerHill: true,
        racingKings: false,
        bareKing: false,
        threeCheck: false
      }
    },
    customPiecesUsed: ['r', 'n', 'q', 'k', 'p'],
    createdAt: '2026-11-11',
    grid: [
      [{ type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'q', color: 'b' }, { type: 'k', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }],
      [{ type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [{ type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }],
      [{ type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'q', color: 'w' }, { type: 'k', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w' }]
    ]
  },
  {
    id: 'preset_cannon_siege',
    name: 'Cannon & Guard Siege (8x8)',
    tagline: 'Xiangqi Cannons & Imperial Guards',
    description: 'Classic 8x8 battlefield upgraded with Cannons (hop over pieces to strike) and Armored Guards.',
    boardWidth: 8,
    boardHeight: 8,
    rules: {
      pawnDoubleStep: true,
      enPassant: true,
      castling: false,
      mandatoryCaptures: false,
      atomicExplosions: false,
      allowDuckPlacement: false,
      promotionPiece: 'q',
      winConditions: {
        checkmate: true,
        centerHill: false,
        racingKings: false,
        bareKing: false,
        threeCheck: false
      }
    },
    customPiecesUsed: ['r', 'n', 'm', 'q', 'k', 'p', 'o'],
    createdAt: '2026-11-11',
    grid: [
      [{ type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'm', color: 'b' }, { type: 'q', color: 'b' }, { type: 'k', color: 'b' }, { type: 'm', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }],
      [{ type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }],
      [null, { type: 'o', color: 'b' }, null, null, null, null, { type: 'o', color: 'b' }, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, { type: 'o', color: 'w' }, null, null, null, null, { type: 'o', color: 'w' }, null],
      [{ type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }],
      [{ type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'm', color: 'w' }, { type: 'q', color: 'w' }, { type: 'k', color: 'w' }, { type: 'm', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w' }]
    ]
  },
  {
    id: 'preset_gardner_5x5',
    name: "Gardner's Minichess (5×5)",
    tagline: 'Compact 5×5 tactical sprint',
    description: 'Martin Gardner’s famous 5×5 chess board with all standard piece classes facing off within inches.',
    boardWidth: 5,
    boardHeight: 5,
    rules: {
      pawnDoubleStep: false,
      enPassant: false,
      castling: false,
      mandatoryCaptures: false,
      atomicExplosions: false,
      allowDuckPlacement: false,
      promotionPiece: 'q',
      winConditions: {
        checkmate: true,
        centerHill: false,
        racingKings: false,
        bareKing: false,
        threeCheck: false
      }
    },
    customPiecesUsed: ['r', 'n', 'b', 'q', 'k', 'p'],
    createdAt: '2026-11-13',
    grid: [
      [{ type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'b', color: 'b' }, { type: 'q', color: 'b' }, { type: 'k', color: 'b' }],
      [{ type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }],
      [null, null, null, null, null],
      [{ type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }],
      [{ type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'b', color: 'w' }, { type: 'q', color: 'w' }, { type: 'k', color: 'w' }]
    ]
  }
];
