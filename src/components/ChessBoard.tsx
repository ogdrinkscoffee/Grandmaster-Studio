import React, { useState, useId, useRef, useEffect, useMemo } from 'react';
import { Chess, Square, Move } from 'chess.js';
import {
  BoardThemeId,
  PieceSetId,
  PieceType,
  PieceColor,
  CustomBoardSquare,
  PremoveMode,
  MoveClassification
} from '../types/chess';
import { ChessPieceIcon } from './ChessPieces';
import { MoveClassificationBadge } from './MoveClassificationBadge';
import { resolveBoardTheme } from '../theme/themes';
import { BoardFrame } from './BoardFrame';
import { useBoardRuntime } from '../context/ThemeContext';
import { coordsToSquare } from '../engine/customVariantEngine';

export interface CustomBoardMoveTarget {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

export interface QueuedPremove {
  from: Square;
  to: Square;
  promotion?: string;
}

interface ChessBoardProps {
  chess?: Chess;
  isFlipped: boolean;
  theme?: BoardThemeId;
  pieceSet?: PieceSetId;
  showCoordinates?: 'inside' | 'outside' | 'hidden';
  bestMoveArrow?: { from: Square; to: Square } | null;
  moveClassification?: { square: Square; type: MoveClassification } | null;
  threatenedSquares?: Square[];
  duckSquare?: Square | null;
  isPlacingDuck?: boolean;
  blindfold?: boolean;
  fogVisibleSquares?: ReadonlySet<string>;
  pendingDropTargets?: ReadonlySet<string> | null;
  onDropPiece?: (square: Square) => void;
  onMakeMove?: (move: { from: Square; to: Square; promotion?: string }) => boolean | void;
  onPlaceDuck?: (square: Square) => void;
  disabled?: boolean;
  // Premove props (8x8 mode)
  playerColor?: PieceColor;
  premoveMode?: PremoveMode;
  premoves?: QueuedPremove[];
  onQueuePremove?: (move: QueuedPremove) => void;
  onCancelPremoves?: () => void;
  // Custom / Fairy Variant Engine Mode Props
  customGrid?: (CustomBoardSquare | null)[][];
  customTurn?: PieceColor;
  customLegalMoves?: CustomBoardMoveTarget[];
  customLastMove?: CustomBoardMoveTarget | null;
  customCheckSquare?: { row: number; col: number } | null;
  customDuckPos?: { row: number; col: number } | null;
  customShieldedPos?: { row: number; col: number } | null;
  onCustomMove?: (move: CustomBoardMoveTarget) => void;
  onCustomPlaceDuck?: (pos: { row: number; col: number }) => void;
}

interface ActiveDragState {
  pieceType: PieceType;
  pieceColor: PieceColor;
  fromSquare?: Square;
  fromCustomPos?: { row: number; col: number };
  startX: number;
  startY: number;
  isDragging: boolean;
  pieceWidth: number;
  pieceHeight: number;
  isPremoveDrag?: boolean;
}

interface PendingPromotion {
  from: Square;
  to: Square;
  color: PieceColor;
  isPremove: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

function buildVirtualBoard(
  chess: Chess,
  premoves: QueuedPremove[]
): Record<string, { type: PieceType; color: PieceColor }> {
  const map: Record<string, { type: PieceType; color: PieceColor }> = {};
  const b = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sqPiece = b[r][c];
      if (sqPiece) {
        const sq = `${FILES[c]}${8 - r}`;
        map[sq] = {
          type: sqPiece.type as PieceType,
          color: sqPiece.color as PieceColor
        };
      }
    }
  }

  for (const pm of premoves) {
    const moving = map[pm.from];
    if (!moving) continue;
    delete map[pm.from];

    // Handle simple castling rook translation in virtual preview
    if (moving.type === 'k') {
      const fromFile = pm.from.charCodeAt(0);
      const toFile = pm.to.charCodeAt(0);
      const rank = pm.from[1];
      if (toFile - fromFile === 2 && map[`h${rank}`]?.type === 'r') {
        map[`f${rank}`] = map[`h${rank}`];
        delete map[`h${rank}`];
      } else if (fromFile - toFile === 2 && map[`a${rank}`]?.type === 'r') {
        map[`d${rank}`] = map[`a${rank}`];
        delete map[`a${rank}`];
      }
    }

    const promoType =
      moving.type === 'p' && (pm.to[1] === '8' || pm.to[1] === '1')
        ? ((pm.promotion || 'q') as PieceType)
        : moving.type;

    map[pm.to] = { type: promoType, color: moving.color };
  }

  return map;
}

function getPseudoPremoveTargets(
  virtualBoard: Record<string, { type: PieceType; color: PieceColor }>,
  from: Square,
  color: PieceColor
): Square[] {
  const piece = virtualBoard[from];
  if (!piece || piece.color !== color) return [];

  const fileIdx = FILES.indexOf(from[0] as (typeof FILES)[number]);
  const rankNum = parseInt(from[1], 10);
  if (fileIdx < 0 || Number.isNaN(rankNum)) return [];

  const targets: Square[] = [];
  const pushIfValid = (f: number, r: number): boolean => {
    if (f < 0 || f > 7 || r < 1 || r > 8) return false;
    const sq = `${FILES[f]}${r}` as Square;
    const occ = virtualBoard[sq];
    if (occ && occ.color === color) return false;
    targets.push(sq);
    return true;
  };

  const t = piece.type;
  if (t === 'p') {
    const dir = color === 'w' ? 1 : -1;
    const startRank = color === 'w' ? 2 : 7;
    pushIfValid(fileIdx, rankNum + dir);
    if (rankNum === startRank) {
      const midSq = `${FILES[fileIdx]}${rankNum + dir}` as Square;
      if (!virtualBoard[midSq] || virtualBoard[midSq].color !== color) {
        pushIfValid(fileIdx, rankNum + dir * 2);
      }
    }
    pushIfValid(fileIdx - 1, rankNum + dir);
    pushIfValid(fileIdx + 1, rankNum + dir);
  } else if (t === 'n') {
    const jumps = [
      [1, 2], [2, 1], [-1, 2], [-2, 1],
      [1, -2], [2, -1], [-1, -2], [-2, -1]
    ];
    for (const [df, dr] of jumps) pushIfValid(fileIdx + df, rankNum + dr);
  } else if (t === 'k') {
    for (let df = -1; df <= 1; df++) {
      for (let dr = -1; dr <= 1; dr++) {
        if (df === 0 && dr === 0) continue;
        pushIfValid(fileIdx + df, rankNum + dr);
      }
    }
    // Back-rank castling premove targets
    if ((color === 'w' && from === 'e1') || (color === 'b' && from === 'e8')) {
      pushIfValid(fileIdx + 2, rankNum);
      pushIfValid(fileIdx - 2, rankNum);
    }
  } else {
    const dirs: number[][] = [];
    if (t === 'b' || t === 'q') dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
    if (t === 'r' || t === 'q') dirs.push([1, 0], [-1, 0], [0, 1], [0, -1]);
    for (const [df, dr] of dirs) {
      for (let step = 1; step < 8; step++) {
        const nf = fileIdx + df * step;
        const nr = rankNum + dr * step;
        if (nf < 0 || nf > 7 || nr < 1 || nr > 8) break;
        const sq = `${FILES[nf]}${nr}` as Square;
        const occ = virtualBoard[sq];
        if (occ && occ.color === color) break;
        targets.push(sq);
      }
    }
  }

  return targets;
}

/** Max board width in px for the Board Size setting (60–140% of the standard 540px board). */
export function getBoardMaxWidthPx(boardSize?: number): number {
  const percent = Math.min(140, Math.max(60, boardSize || 100));
  return Math.round(540 * (percent / 100));
}

/**
 * Computes the GPU translate3d(x, y, 0) coordinates relative to the board container
 * so the geometric center of the dragged piece sits directly under the pointer tip.
 */
export function computeDragTransformOffset(
  clientX: number,
  clientY: number,
  boardRect: { left: number; top: number },
  pieceWidth: number,
  pieceHeight: number
): { x: number; y: number } {
  return {
    x: clientX - boardRect.left - pieceWidth / 2,
    y: clientY - boardRect.top - pieceHeight / 2
  };
}

export const ChessBoard: React.FC<ChessBoardProps> = React.memo(({
  chess,
  isFlipped,
  theme,
  pieceSet,
  showCoordinates,
  bestMoveArrow = null,
  moveClassification = null,
  threatenedSquares = [],
  duckSquare = null,
  isPlacingDuck = false,
  blindfold = false,
  fogVisibleSquares,
  pendingDropTargets = null,
  onDropPiece,
  onMakeMove,
  onPlaceDuck,
  disabled = false,
  playerColor,
  premoveMode = 'off',
  premoves = [],
  onQueuePremove,
  onCancelPremoves,
  customGrid,
  customTurn = 'w',
  customLegalMoves = [],
  customLastMove = null,
  customCheckSquare = null,
  customDuckPos = null,
  customShieldedPos = null,
  onCustomMove,
  onCustomPlaceDuck
}) => {
  const runtime = useBoardRuntime();
  const activePieceSet = pieceSet || runtime.pieceSet || 'neo';
  const activeCoordMode = showCoordinates || runtime.showCoordinates || 'inside';
  const activeFinial = runtime.kingFinial || 'crescent';
  const highlightLegal = runtime.highlightLegalMoves !== false;
  const inputMethod = runtime.moveInputMethod || 'both';
  const autoQueen = runtime.autoQueen !== false;
  const reduceMotion = runtime.batterySaver;
  const keyboardControlEnabled = runtime.keyboardControl;
  const boardMaxWidth = `${getBoardMaxWidthPx(runtime.boardSize)}px`;

  const gridHeight = customGrid ? customGrid.length : 8;
  const gridWidth = customGrid ? customGrid[0]?.length || 8 : 8;

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [premoveSelectedSq, setPremoveSelectedSq] = useState<Square | null>(null);
  const [premoveTargets, setPremoveTargets] = useState<Square[]>([]);
  const [selectedCustomPos, setSelectedCustomPos] = useState<{ row: number; col: number } | null>(null);
  const [keyboardCursor, setKeyboardCursor] = useState<{ row: number; col: number } | null>(null);

  const [dragState, setDragState] = useState<ActiveDragState | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);

  // Right-click square annotations & tactical arrow drawing
  const [highlightedSquares, setHighlightedSquares] = useState<Record<string, string>>({});
  const [userArrows, setUserArrows] = useState<Array<{ from: string; to: string; color: string }>>([]);
  const rightDragOriginRef = useRef<string | null>(null);

  const [moveNonce, setMoveNonce] = useState<number>(0);
  const prevLastMoveSigRef = useRef<string>('');
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const boardGridRef = useRef<HTMLDivElement | null>(null);
  const hoverTargetRef = useRef<HTMLDivElement | null>(null);
  const suppressNextClickRef = useRef<boolean>(false);
  const suppressClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justSelectedOnPointerDownRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (suppressClickTimerRef.current) clearTimeout(suppressClickTimerRef.current);
    };
  }, []);

  const arrowMarkerId = useId();
  const boardTheme = useMemo(() => {
    if (!theme && !pieceSet) return runtime.boardTheme;
    const candidate = resolveBoardTheme(
      {
        boardTheme: theme || runtime.boardThemeId,
        matchBoardToPieces: runtime.matchBoardToPieces,
        pieceSet: activePieceSet,
        customBoards: runtime.customBoards
      },
      activePieceSet
    );
    return candidate.id === runtime.boardTheme.id ? runtime.boardTheme : candidate;
  }, [theme, pieceSet, activePieceSet, runtime]);

  const boardCssVars = useMemo<React.CSSProperties | undefined>(() => {
    if (boardTheme === runtime.boardTheme) return undefined;
    return {
      '--square-light': boardTheme.lightHex,
      '--square-dark': boardTheme.darkHex,
      '--square-selected': boardTheme.selectedHex,
      '--square-last-move': boardTheme.lastMoveHex,
      '--coord-light': boardTheme.coordLight,
      '--coord-dark': boardTheme.coordDark,
      '--square-tex-light': boardTheme.squareTexture?.light || 'none',
      '--square-tex-dark': boardTheme.squareTexture?.dark || 'none'
    } as React.CSSProperties;
  }, [boardTheme, runtime.boardTheme]);

  const isFramed = Boolean(boardTheme.frame);

  const fenStr = chess?.fen() || '';
  const history = chess ? chess.history({ verbose: true }) : [];
  const lastMove = history.length > 0 ? history[history.length - 1] : null;
  const lastMoveSignature = customGrid
    ? customLastMove
      ? `c:${customLastMove.fromRow},${customLastMove.fromCol}-${customLastMove.toRow},${customLastMove.toCol}`
      : ''
    : lastMove
    ? `s:${lastMove.from}-${lastMove.to}-${history.length}`
    : fenStr;

  useEffect(() => {
    if (lastMoveSignature && lastMoveSignature !== prevLastMoveSigRef.current) {
      prevLastMoveSigRef.current = lastMoveSignature;
      setMoveNonce(n => n + 1);
    }
  }, [lastMoveSignature]);

  const canPremoveNow = Boolean(
    chess &&
      !customGrid &&
      playerColor &&
      premoveMode !== 'off' &&
      !isPlacingDuck &&
      onQueuePremove &&
      (chess.turn() !== playerColor || premoves.length > 0)
  );

  const virtualBoard = useMemo(() => {
    if (!chess) return {};
    return buildVirtualBoard(chess, premoves);
  }, [chess, fenStr, premoves]);

  const prevTurnRef = useRef<string>(chess?.turn() || 'w');

  // Clear stale selections on position updates, preserving click selection seamlessly if opponent moved mid-click
  useEffect(() => {
    if (!chess) {
      setSelectedSquare(null);
      setLegalMoves([]);
      setPremoveSelectedSq(null);
      setPremoveTargets([]);
      return;
    }

    const currentTurn = chess.turn();
    const prevTurn = prevTurnRef.current;
    prevTurnRef.current = currentTurn;

    if (
      prevTurn !== currentTurn &&
      playerColor &&
      currentTurn === playerColor &&
      premoves.length === 0 &&
      premoveSelectedSq
    ) {
      const pieceOnNewTurn = chess.get(premoveSelectedSq);
      if (pieceOnNewTurn && pieceOnNewTurn.color === playerColor) {
        const moves = chess.moves({ square: premoveSelectedSq, verbose: true });
        setSelectedSquare(premoveSelectedSq);
        setLegalMoves(duckSquare ? moves.filter(m => m.to !== duckSquare) : moves);
        setPremoveSelectedSq(null);
        setPremoveTargets([]);
        return;
      }
    }

    if (
      canPremoveNow &&
      playerColor &&
      chess.turn() !== playerColor &&
      premoveSelectedSq
    ) {
      const stillValidVirtual = virtualBoard[premoveSelectedSq];
      if (stillValidVirtual && stillValidVirtual.color === playerColor) {
        setPremoveTargets(getPseudoPremoveTargets(virtualBoard, premoveSelectedSq, playerColor));
        return;
      }
    }

    if (premoves.length > 0 && premoveSelectedSq) {
      const stillValidVirtual = virtualBoard[premoveSelectedSq];
      if (stillValidVirtual && playerColor && stillValidVirtual.color === playerColor) {
        setPremoveTargets(getPseudoPremoveTargets(virtualBoard, premoveSelectedSq, playerColor));
        return;
      }
    }

    setSelectedSquare(null);
    setLegalMoves([]);
    setPremoveSelectedSq(null);
    setPremoveTargets([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fenStr, customTurn]);

  // Clear stale premove selection immediately if premove capability ends or an invalidated queue is cleared
  useEffect(() => {
    if (!canPremoveNow && premoveSelectedSq) {
      setPremoveSelectedSq(null);
      setPremoveTargets([]);
    } else if (premoveSelectedSq && playerColor) {
      const stillValid = virtualBoard[premoveSelectedSq];
      if (!stillValid || stillValid.color !== playerColor) {
        setPremoveSelectedSq(null);
        setPremoveTargets([]);
      }
    }
  }, [canPremoveNow, premoves.length, premoveSelectedSq, playerColor, virtualBoard]);

  const hitTestGrid = (clientX: number, clientY: number, cachedRect?: DOMRect | null) => {
    const rect = cachedRect ?? boardGridRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return null;
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }

    if (customGrid) {
      const height = customGrid.length;
      const width = customGrid[0]?.length || 8;
      const visCol = Math.min(width - 1, Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * width)));
      const visRow = Math.min(height - 1, Math.max(0, Math.floor(((clientY - rect.top) / rect.height) * height)));
      const row = isFlipped ? height - 1 - visRow : visRow;
      const col = isFlipped ? width - 1 - visCol : visCol;
      return { kind: 'custom' as const, row, col, visRow, visCol, width, height, rect, key: `${row},${col}` };
    } else {
      const visCol = Math.min(7, Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * 8)));
      const visRow = Math.min(7, Math.max(0, Math.floor(((clientY - rect.top) / rect.height) * 8)));
      const ranks = isFlipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
      const files = isFlipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const sq = `${files[visCol]}${ranks[visRow]}` as Square;
      return { kind: 'standard' as const, square: sq, visRow, visCol, width: 8, height: 8, rect, key: sq };
    }
  };

  const commitStandardMoveOrPromo = (
    from: Square,
    to: Square,
    isPremove: boolean
  ) => {
    if (!chess) return;
    const movingPiece = isPremove ? virtualBoard[from] : chess.get(from);
    const isPromotion =
      movingPiece?.type === 'p' && (to[1] === '8' || to[1] === '1');

    if (isPromotion && !autoQueen) {
      setPendingPromotion({
        from,
        to,
        color: (movingPiece?.color || playerColor || chess.turn()) as PieceColor,
        isPremove
      });
      return;
    }

    const promo = isPromotion ? 'q' : undefined;
    if (isPremove) {
      onQueuePremove?.({ from, to, promotion: promo });
    } else {
      onMakeMove?.({ from, to, promotion: promo });
    }
  };

  const isDragActive = Boolean(dragState);
  const dragSessionRef = useRef<ActiveDragState | null>(null);
  const dragContainerRectRef = useRef<DOMRect | null>(null);
  const dragGridRectRef = useRef<DOMRect | null>(null);
  const latestPointerRef = useRef<{ clientX: number; clientY: number }>({
    clientX: 0,
    clientY: 0
  });
  const dragPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const floatingPieceRef = useRef<HTMLDivElement | null>(null);
  const dragRafRef = useRef<number | null>(null);
  const hoverKeyRef = useRef<string | null>(null);

  const dragHandlersRef = useRef<{
    onMove: (e: PointerEvent) => void;
    onUp: (e: PointerEvent) => void;
  }>({
    onMove: () => {},
    onUp: () => {}
  });

  const updateDragVisuals = () => {
    dragRafRef.current = null;
    const session = dragSessionRef.current;
    if (!session || !session.isDragging) return;

    const containerRect =
      dragContainerRectRef.current ?? boardContainerRef.current?.getBoundingClientRect() ?? null;
    const gridRect = dragGridRectRef.current ?? boardGridRef.current?.getBoundingClientRect() ?? null;
    dragContainerRectRef.current = containerRect;
    dragGridRectRef.current = gridRect;

    const { clientX, clientY } = latestPointerRef.current;
    if (containerRect) {
      const nextPoint = computeDragTransformOffset(
        clientX,
        clientY,
        containerRect,
        session.pieceWidth,
        session.pieceHeight
      );
      dragPointRef.current = nextPoint;
      const el = floatingPieceRef.current;
      if (el) {
        el.style.transform = `translate3d(${nextPoint.x}px, ${nextPoint.y}px, 0)`;
      }
    }

    // Update hover square highlight directly on GPU layer with zero React re-renders
    const hoverEl = hoverTargetRef.current;
    if (hoverEl && gridRect) {
      const hit = hitTestGrid(clientX, clientY, gridRect);
      const nextKey = hit ? hit.key : null;
      if (nextKey !== hoverKeyRef.current) {
        hoverKeyRef.current = nextKey;
        if (hit) {
          const cellW = gridRect.width / hit.width;
          const cellH = gridRect.height / hit.height;
          hoverEl.style.width = `${cellW}px`;
          hoverEl.style.height = `${cellH}px`;
          hoverEl.style.transform = `translate3d(${hit.visCol * cellW}px, ${hit.visRow * cellH}px, 0)`;
          hoverEl.style.opacity = '1';
        } else {
          hoverEl.style.opacity = '0';
        }
      }
    }
  };

  useEffect(() => {
    if (isDragActive) return;
    if (dragRafRef.current !== null) {
      cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
    hoverKeyRef.current = null;
    if (hoverTargetRef.current) {
      hoverTargetRef.current.style.opacity = '0';
    }
  }, [isDragActive]);

  dragHandlersRef.current.onMove = (e: PointerEvent) => {
    const session = dragSessionRef.current;
    if (!session) return;

    latestPointerRef.current = { clientX: e.clientX, clientY: e.clientY };

    if (!session.isDragging) {
      const dx = e.clientX - session.startX;
      const dy = e.clientY - session.startY;
      if (Math.hypot(dx, dy) <= 5) return;

      session.isDragging = true;
      const containerRect =
        dragContainerRectRef.current ?? boardContainerRef.current?.getBoundingClientRect() ?? null;
      dragContainerRectRef.current = containerRect;
      if (containerRect) {
        dragPointRef.current = computeDragTransformOffset(
          e.clientX,
          e.clientY,
          containerRect,
          session.pieceWidth,
          session.pieceHeight
        );
      }
      // Single state commit to mount floating piece and dim origin square
      setDragState({ ...session });
    }

    if (dragRafRef.current === null) {
      dragRafRef.current = requestAnimationFrame(updateDragVisuals);
    }
  };

  dragHandlersRef.current.onUp = (e: PointerEvent) => {
    const session = dragSessionRef.current;
    if (!session) return;

    if (dragRafRef.current !== null) {
      cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }

    const hit = hitTestGrid(e.clientX, e.clientY);
    if (session.isDragging) {
      suppressNextClickRef.current = true;
      if (suppressClickTimerRef.current) clearTimeout(suppressClickTimerRef.current);
      suppressClickTimerRef.current = setTimeout(() => {
        suppressNextClickRef.current = false;
        suppressClickTimerRef.current = null;
      }, 150);

      if (hit && hit.kind === 'standard' && session.fromSquare && chess) {
        if (hit.square !== session.fromSquare) {
          if (session.isPremoveDrag && canPremoveNow && playerColor) {
            const pseudo = getPseudoPremoveTargets(virtualBoard, session.fromSquare, playerColor);
            if (pseudo.includes(hit.square)) {
              commitStandardMoveOrPromo(session.fromSquare, hit.square, true);
            }
          } else if (
            !disabled &&
            !isPlacingDuck &&
            (!session.isPremoveDrag || !playerColor || chess.turn() === playerColor)
          ) {
            const moves = chess.moves({ square: session.fromSquare, verbose: true });
            const filtered = duckSquare ? moves.filter(m => m.to !== duckSquare) : moves;
            if (filtered.some(m => m.to === hit.square)) {
              commitStandardMoveOrPromo(session.fromSquare, hit.square, false);
            }
          }
          setSelectedSquare(null);
          setLegalMoves([]);
          setPremoveSelectedSq(null);
          setPremoveTargets([]);
        }
      } else if (!hit) {
        setSelectedSquare(null);
        setLegalMoves([]);
        setPremoveSelectedSq(null);
        setPremoveTargets([]);
      } else if (hit && hit.kind === 'custom' && session.fromCustomPos && !disabled && !isPlacingDuck) {
        const match = customLegalMoves.find(
          m =>
            m.fromRow === session.fromCustomPos!.row &&
            m.fromCol === session.fromCustomPos!.col &&
            m.toRow === hit.row &&
            m.toCol === hit.col
        );
        if (match) {
          onCustomMove?.(match);
        }
        if (hit.row !== session.fromCustomPos.row || hit.col !== session.fromCustomPos.col) {
          setSelectedCustomPos(null);
        }
      }
    }

    dragSessionRef.current = null;
    dragContainerRectRef.current = null;
    dragGridRectRef.current = null;
    hoverKeyRef.current = null;
    if (hoverTargetRef.current) {
      hoverTargetRef.current.style.opacity = '0';
    }
    setDragState(null);
  };

  useEffect(() => {
    if (!isDragActive) return;
    const handlePointerMove = (e: PointerEvent) => dragHandlersRef.current.onMove(e);
    const handlePointerUp = (e: PointerEvent) => dragHandlersRef.current.onUp(e);
    const invalidateCachedRects = () => {
      dragContainerRectRef.current = null;
      dragGridRectRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('scroll', invalidateCachedRects, { capture: true, passive: true });
    window.addEventListener('resize', invalidateCachedRects, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('scroll', invalidateCachedRects, { capture: true });
      window.removeEventListener('resize', invalidateCachedRects);
    };
  }, [isDragActive]);

  const beginDragCandidate = (session: ActiveDragState) => {
    dragSessionRef.current = session;
    dragContainerRectRef.current = boardContainerRef.current?.getBoundingClientRect() ?? null;
    dragGridRectRef.current = boardGridRef.current?.getBoundingClientRect() ?? null;
    latestPointerRef.current = { clientX: session.startX, clientY: session.startY };
    if (dragContainerRectRef.current) {
      dragPointRef.current = computeDragTransformOffset(
        session.startX,
        session.startY,
        dragContainerRectRef.current,
        session.pieceWidth,
        session.pieceHeight
      );
    }
    setDragState(session);
  };

  // Initialize / clear keyboard cursor cleanly when setting or board dimensions change
  useEffect(() => {
    if (!keyboardControlEnabled) {
      setKeyboardCursor(null);
      return;
    }
    setKeyboardCursor(prev => {
      if (prev && prev.row >= 0 && prev.row < gridHeight && prev.col >= 0 && prev.col < gridWidth) {
        return prev;
      }
      return {
        row: isFlipped ? Math.min(gridHeight - 1, 1) : Math.max(0, gridHeight - 2),
        col: Math.min(gridWidth - 1, 4)
      };
    });
  }, [keyboardControlEnabled, gridHeight, gridWidth, isFlipped]);

  const activateGridPosition = (row: number, col: number) => {
    if (customGrid) {
      if (disabled) return;
      if (isPlacingDuck) {
        if (!customGrid[row]?.[col] && !(customDuckPos?.row === row && customDuckPos?.col === col)) {
          onCustomPlaceDuck?.({ row, col });
        }
        return;
      }
      if (selectedCustomPos) {
        if (selectedCustomPos.row === row && selectedCustomPos.col === col) {
          setSelectedCustomPos(null);
          return;
        }
        const match = customLegalMoves.find(
          m =>
            m.fromRow === selectedCustomPos.row &&
            m.fromCol === selectedCustomPos.col &&
            m.toRow === row &&
            m.toCol === col
        );
        if (match) {
          onCustomMove?.(match);
          setSelectedCustomPos(null);
          return;
        }
      }
      const piece = customGrid[row]?.[col];
      if (piece && piece.color === customTurn && piece.type !== 'd') {
        setSelectedCustomPos({ row, col });
      } else {
        setSelectedCustomPos(null);
      }
      return;
    }

    if (!chess) return;
    const sq = `${FILES[col]}${8 - row}` as Square;

    if (isPlacingDuck) {
      if (!chess.get(sq) && sq !== duckSquare) {
        onPlaceDuck?.(sq);
      }
      return;
    }

    if (canPremoveNow && playerColor) {
      if (premoveSelectedSq) {
        if (premoveSelectedSq === sq) {
          setPremoveSelectedSq(null);
          setPremoveTargets([]);
          return;
        }
        if (premoveTargets.includes(sq)) {
          commitStandardMoveOrPromo(premoveSelectedSq, sq, true);
          setPremoveSelectedSq(null);
          setPremoveTargets([]);
          return;
        }
      }
      const vPiece = virtualBoard[sq];
      if (vPiece && vPiece.color === playerColor) {
        setPremoveSelectedSq(sq);
        setPremoveTargets(getPseudoPremoveTargets(virtualBoard, sq, playerColor));
      } else {
        setPremoveSelectedSq(null);
        setPremoveTargets([]);
        if (!premoveSelectedSq && premoves.length > 0) {
          onCancelPremoves?.();
        }
      }
      return;
    }

    if (disabled) return;
    if (selectedSquare) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
      const matchMove = legalMoves.find(m => m.to === sq);
      if (matchMove) {
        commitStandardMoveOrPromo(selectedSquare, sq, false);
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }

    const piece = chess.get(sq);
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(sq);
      const moves = chess.moves({ square: sq, verbose: true });
      const filtered = duckSquare ? moves.filter(m => m.to !== duckSquare) : moves;
      setLegalMoves(filtered);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Escape clears annotations/selection; Keyboard Control handles Arrows/WASD + Space/Enter.
  // Stabilized via ref + empty deps so the global listener isn't torn down and re-attached on every render.
  const keyDownHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  keyDownHandlerRef.current = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setHighlightedSquares({});
      setUserArrows([]);
      setSelectedSquare(null);
      setLegalMoves([]);
      setSelectedCustomPos(null);
      setPremoveSelectedSq(null);
      setPremoveTargets([]);
      setPendingPromotion(null);
      onCancelPremoves?.();
      return;
    }

    if (!keyboardControlEnabled || pendingPromotion) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable)
    ) {
      return;
    }

    const keyLower = e.key.toLowerCase();
    let dRow = 0;
    let dCol = 0;

    if (e.key === 'ArrowUp' || keyLower === 'w') dRow = isFlipped ? 1 : -1;
    else if (e.key === 'ArrowDown' || keyLower === 's') dRow = isFlipped ? -1 : 1;
    else if (e.key === 'ArrowLeft' || keyLower === 'a') dCol = isFlipped ? 1 : -1;
    else if (e.key === 'ArrowRight' || keyLower === 'd') dCol = isFlipped ? -1 : 1;

    if (dRow !== 0 || dCol !== 0) {
      e.preventDefault();
      setKeyboardCursor(prev => {
        const base = prev || {
          row: isFlipped ? Math.min(gridHeight - 1, 1) : Math.max(0, gridHeight - 2),
          col: Math.min(gridWidth - 1, 4)
        };
        return {
          row: Math.max(0, Math.min(gridHeight - 1, base.row + dRow)),
          col: Math.max(0, Math.min(gridWidth - 1, base.col + dCol))
        };
      });
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const activeCursor = keyboardCursor || {
        row: isFlipped ? Math.min(gridHeight - 1, 1) : Math.max(0, gridHeight - 2),
        col: Math.min(gridWidth - 1, 4)
      };
      if (!keyboardCursor) setKeyboardCursor(activeCursor);
      activateGridPosition(activeCursor.row, activeCursor.col);
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => keyDownHandlerRef.current(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const handleRightPointerDown = (squareId: string) => {
    if (premoves.length > 0 && onCancelPremoves) {
      rightDragOriginRef.current = null;
      setPremoveSelectedSq(null);
      setPremoveTargets([]);
      onCancelPremoves();
      return;
    }
    if (premoveSelectedSq || selectedSquare || selectedCustomPos) {
      rightDragOriginRef.current = null;
      setPremoveSelectedSq(null);
      setPremoveTargets([]);
      setSelectedSquare(null);
      setLegalMoves([]);
      setSelectedCustomPos(null);
      return;
    }
    rightDragOriginRef.current = squareId;
  };

  const handleRightPointerUp = (squareId: string, e: React.PointerEvent) => {
    const origin = rightDragOriginRef.current;
    rightDragOriginRef.current = null;
    if (!origin) return;

    if (origin === squareId) {
      if (premoves.length > 0 && onCancelPremoves) {
        onCancelPremoves();
        return;
      }
      const color = e.shiftKey ? '#10b981' : e.altKey ? '#38bdf8' : '#f59e0b';
      setHighlightedSquares(prev => {
        const next = { ...prev };
        if (next[squareId] === color) delete next[squareId];
        else next[squareId] = color;
        return next;
      });
    } else {
      const color = e.shiftKey ? '#10b981' : '#f59e0b';
      setUserArrows(prev => {
        const existsIdx = prev.findIndex(a => a.from === origin && a.to === squareId);
        if (existsIdx >= 0) return prev.filter((_, idx) => idx !== existsIdx);
        return [...prev, { from: origin, to: squareId, color }];
      });
    }
  };

  const isActivelyDragging = Boolean(dragState?.isDragging);

  const renderFloatingDragPiece = () => {
    if (!dragState || !dragState.isDragging || blindfold) return null;
    const { x, y } = dragPointRef.current;
    return (
      <div
        ref={floatingPieceRef}
        className="pointer-events-none absolute left-0 top-0 z-50 m-0 p-0"
        style={{
          width: dragState.pieceWidth,
          height: dragState.pieceHeight,
          transform: `translate3d(${x}px, ${y}px, 0)`,
          willChange: 'transform'
        }}
      >
        <ChessPieceIcon
          type={dragState.pieceType}
          color={dragState.pieceColor}
          set={activePieceSet}
          kingFinial={activeFinial}
          disableShadowFilter
        />
      </div>
    );
  };

  // ========================
  // 1. CUSTOM W x H GRID MODE
  // ========================
  if (customGrid) {
    const height = customGrid.length;
    const width = customGrid[0]?.length || 8;
    const rowIndices = isFlipped
      ? Array.from({ length: height }, (_, i) => height - 1 - i)
      : Array.from({ length: height }, (_, i) => i);
    const colIndices = isFlipped
      ? Array.from({ length: width }, (_, i) => width - 1 - i)
      : Array.from({ length: width }, (_, i) => i);

    const activeCustomTargets = selectedCustomPos
      ? customLegalMoves.filter(
          m => m.fromRow === selectedCustomPos.row && m.fromCol === selectedCustomPos.col
        )
      : [];

    const handleCustomSquareClick = (r: number, c: number) => {
      if (suppressNextClickRef.current) {
        suppressNextClickRef.current = false;
        return;
      }
      if (Object.keys(highlightedSquares).length > 0 || userArrows.length > 0) {
        setHighlightedSquares({});
        setUserArrows([]);
      }
      if (disabled) return;
      if (isPlacingDuck) {
        if (!customGrid[r][c] && !(customDuckPos?.row === r && customDuckPos?.col === c)) {
          onCustomPlaceDuck?.({ row: r, col: c });
        }
        return;
      }

      if (inputMethod === 'drag') return;

      const sqKey = `${r},${c}`;
      if (justSelectedOnPointerDownRef.current === sqKey) {
        justSelectedOnPointerDownRef.current = null;
        return;
      }

      if (selectedCustomPos) {
        if (selectedCustomPos.row === r && selectedCustomPos.col === c) {
          setSelectedCustomPos(null);
          return;
        }
        const match = activeCustomTargets.find(m => m.toRow === r && m.toCol === c);
        if (match) {
          onCustomMove?.(match);
          setSelectedCustomPos(null);
          return;
        }
      }

      const piece = customGrid[r][c];
      if (piece && piece.color === customTurn && piece.type !== 'd') {
        setSelectedCustomPos({ row: r, col: c });
      } else {
        setSelectedCustomPos(null);
      }
    };

    const handleCustomPointerDown = (r: number, c: number, e: React.PointerEvent) => {
      suppressNextClickRef.current = false;
      justSelectedOnPointerDownRef.current = null;
      const sqLabel = coordsToSquare(r, c, height);
      if (e.button === 2) {
        handleRightPointerDown(sqLabel);
        return;
      }
      if (e.button !== 0 || disabled || isPlacingDuck || inputMethod === 'click') return;
      const piece = customGrid[r][c];
      if (!piece || piece.color !== customTurn || piece.type === 'd') return;
      const rect = boardGridRef.current?.getBoundingClientRect();
      const cellW = rect ? rect.width / width : 56;
      const cellH = rect ? rect.height / height : 56;
      const pieceWidth = cellW * 0.92;
      const pieceHeight = cellH * 0.92;

      if (!(selectedCustomPos?.row === r && selectedCustomPos?.col === c)) {
        justSelectedOnPointerDownRef.current = `${r},${c}`;
      }
      setSelectedCustomPos({ row: r, col: c });
      beginDragCandidate({
        pieceType: piece.type,
        pieceColor: piece.color,
        fromCustomPos: { row: r, col: c },
        startX: e.clientX,
        startY: e.clientY,
        isDragging: false,
        pieceWidth,
        pieceHeight
      });
    };

    return (
      <div
        ref={boardContainerRef}
        className={`relative flex flex-col items-center w-full ${isActivelyDragging ? 'chess-board-dragging' : ''}`}
        style={boardCssVars ? { maxWidth: boardMaxWidth, ...boardCssVars } : { maxWidth: boardMaxWidth }}
      >
        {isPlacingDuck && (
          <div
            className="mb-2 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md"
            style={{
              backgroundColor: 'var(--gm-accent)',
              color: 'var(--gm-accent-text)'
            }}
          >
            <span className="w-4 h-4">
              <ChessPieceIcon type="d" color="w" set={activePieceSet} />
            </span>
            <span>Place the Rubber Duck on any empty square</span>
          </div>
        )}

        <BoardFrame frame={boardTheme.frame} still={reduceMotion || isActivelyDragging}>
        <div
          onContextMenu={e => e.preventDefault()}
          className={`chess-board-shell relative w-full overflow-hidden select-none touch-none ${
            isFramed ? 'rounded-[3px]' : isActivelyDragging ? 'rounded-xl' : 'rounded-xl shadow-2xl'
          }`}
          style={{
            border: isFramed ? 'none' : '2px solid var(--gm-border)',
            aspectRatio: `${width} / ${height}`,
            padding: activeCoordMode === 'outside' ? '18px' : '0px'
          }}
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden">
          <div
            ref={boardGridRef}
            className="grid w-full h-full"
            role="grid"
            aria-label="Chess Board"
            style={{
              gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`
            }}
          >
            {rowIndices.map((rIdx, visRowIdx) =>
              colIndices.map((cIdx, visColIdx) => {
                const sqLabel = coordsToSquare(rIdx, cIdx, height);
                const isDark = (rIdx + cIdx) % 2 === 1;
                const piece = customGrid[rIdx][cIdx];

                const isSelected = selectedCustomPos?.row === rIdx && selectedCustomPos?.col === cIdx;
                const isKeyCursor =
                  keyboardControlEnabled && keyboardCursor?.row === rIdx && keyboardCursor?.col === cIdx;
                const isLastMoveSquare =
                  customLastMove &&
                  ((customLastMove.fromRow === rIdx && customLastMove.fromCol === cIdx) ||
                    (customLastMove.toRow === rIdx && customLastMove.toCol === cIdx));
                const isSettling =
                  !reduceMotion &&
                  customLastMove?.toRow === rIdx &&
                  customLastMove?.toCol === cIdx;
                const isBeingDraggedOrigin =
                  dragState?.isDragging &&
                  dragState.fromCustomPos?.row === rIdx &&
                  dragState.fromCustomPos?.col === cIdx;

                const isTargetLegal =
                  highlightLegal && activeCustomTargets.some(m => m.toRow === rIdx && m.toCol === cIdx);
                const isKingInCheck = customCheckSquare?.row === rIdx && customCheckSquare?.col === cIdx;
                const isShielded = customShieldedPos?.row === rIdx && customShieldedPos?.col === cIdx;
                const hasDuck = (customDuckPos?.row === rIdx && customDuckPos?.col === cIdx) || piece?.type === 'd';

                const showRankLabel = activeCoordMode === 'inside' && visColIdx === 0;
                const showFileLabel = activeCoordMode === 'inside' && visRowIdx === height - 1;

                const squareStateClass = isSelected
                  ? 'chess-sq-selected'
                  : isLastMoveSquare
                  ? 'chess-sq-lastmove'
                  : isDark
                  ? 'chess-sq-dark'
                  : 'chess-sq-light';

                const pieceDesc = piece
                  ? `${piece.color === 'w' ? 'White' : 'Black'} ${piece.type.toUpperCase()}`
                  : 'empty';

                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    type="button"
                    data-square={sqLabel}
                    onPointerDown={e => handleCustomPointerDown(rIdx, cIdx, e)}
                    onPointerUp={e => {
                      if (e.button === 2) handleRightPointerUp(sqLabel, e);
                    }}
                    onClick={() => {
                      if (keyboardControlEnabled) setKeyboardCursor({ row: rIdx, col: cIdx });
                      handleCustomSquareClick(rIdx, cIdx);
                    }}
                    aria-label={`Square ${sqLabel}, ${pieceDesc}${isTargetLegal ? ', legal move target' : ''}${isShielded ? ', shielded' : ''}`}
                    className={`chess-square-btn ${squareStateClass} relative flex items-center justify-center p-1 sm:p-1.5 focus:outline-none focus:z-20 ${
                      isSelected ? 'ring-2 ring-inset ring-emerald-300 z-10' : ''
                    } ${isKeyCursor ? 'ring-2 ring-inset ring-sky-400 z-20' : ''} ${
                      isShielded ? 'ring-2 ring-inset ring-sky-400' : ''
                    } ${
                      isKingInCheck ? 'ring-3 ring-inset ring-rose-500' : ''
                    }`}
                  >
                    {highlightedSquares[sqLabel] && (
                      <div
                        className="absolute inset-0 pointer-events-none z-0 opacity-45"
                        style={{ backgroundColor: highlightedSquares[sqLabel] }}
                      />
                    )}
                    {showRankLabel && (
                      <span
                        className={`${isDark ? 'chess-coord-dark' : 'chess-coord-light'} absolute top-0.5 left-1 text-[9px] sm:text-[10px] font-bold select-none pointer-events-none opacity-85 font-mono`}
                      >
                        {height - rIdx}
                      </span>
                    )}
                    {showFileLabel && (
                      <span
                        className={`${isDark ? 'chess-coord-dark' : 'chess-coord-light'} absolute bottom-0.5 right-1 text-[9px] sm:text-[10px] font-bold select-none pointer-events-none opacity-85 font-mono`}
                      >
                        {String.fromCharCode(97 + cIdx)}
                      </span>
                    )}

                    {isShielded && (
                      <span
                        className="absolute top-0.5 right-0.5 z-30 px-1 rounded bg-sky-500/90 text-white text-[8px] font-mono font-bold pointer-events-none shadow"
                        title="Gladiator Shield: protected from capture for 1 turn"
                      >
                        SHD
                      </span>
                    )}

                    {piece && piece.absorbed && piece.absorbed.length > 0 && !isShielded && (
                      <span
                        className="absolute top-0.5 right-0.5 z-30 min-w-[14px] h-[14px] px-0.5 rounded-full bg-violet-600/90 text-white text-[8px] font-mono font-bold flex items-center justify-center pointer-events-none shadow"
                        title={`Absorbed abilities: ${piece.absorbed.map(a => a.toUpperCase()).join(', ')}`}
                      >
                        +{piece.absorbed.length}
                      </span>
                    )}

                    {isTargetLegal && !piece && !hasDuck && (
                      <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-black/25 ring-1 ring-white/30 z-10 pointer-events-none" />
                    )}
                    {isTargetLegal && piece && !hasDuck && (
                      <div className="absolute inset-1 rounded-full border-[3px] border-black/30 z-10 pointer-events-none" />
                    )}

                    {hasDuck && (
                      <div className="w-full h-full flex items-center justify-center z-20 pointer-events-none">
                        <ChessPieceIcon type="d" color="w" set={activePieceSet} />
                      </div>
                    )}

                    {piece && !hasDuck && (
                      <div
                        key={isSettling ? `settle-${moveNonce}` : 'idle'}
                        className={`w-full h-full flex items-center justify-center z-10 transition-opacity duration-100 ${
                          isBeingDraggedOrigin ? 'opacity-20' : ''
                        } ${isSettling ? 'animate-piece-settle' : ''}`}
                      >
                        {blindfold ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-current opacity-30" />
                        ) : (
                          <ChessPieceIcon
                            type={piece.type}
                            color={piece.color}
                            set={activePieceSet}
                            kingFinial={activeFinial}
                          />
                        )}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
          <div
            ref={hoverTargetRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-20 ring-2 ring-inset ring-white/80 opacity-0"
            style={{ willChange: 'transform' }}
          />
          </div>
        </div>
        </BoardFrame>
        {renderFloatingDragPiece()}
        {keyboardControlEnabled && keyboardCursor && (
          <div className="mt-1.5 flex items-center justify-center gap-2 text-[11px] font-mono" style={{ color: 'var(--gm-muted)' }}>
            <span>Key Cursor:</span>
            <span className="font-bold" style={{ color: 'var(--gm-accent)' }}>
              {coordsToSquare(keyboardCursor.row, keyboardCursor.col, height)}
            </span>
            <span>· Arrows / WASD · Space / Enter</span>
          </div>
        )}
      </div>
    );
  }

  // ========================
  // 2. STANDARD 8x8 MODE
  // ========================
  if (!chess) return null;

  const board = chess.board();

  let kingInCheckSquare: Square | null = null;
  if (chess.inCheck()) {
    const turn = chess.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          kingInCheckSquare = (String.fromCharCode(97 + c) + (8 - r)) as Square;
          break;
        }
      }
      if (kingInCheckSquare) break;
    }
  }

  const handleSquareClick = (square: Square) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }
    if (Object.keys(highlightedSquares).length > 0 || userArrows.length > 0) {
      setHighlightedSquares({});
      setUserArrows([]);
    }

    if (isPlacingDuck) {
      if (!chess.get(square) && square !== duckSquare) {
        onPlaceDuck?.(square);
      }
      return;
    }

    if (pendingDropTargets && !disabled) {
      if (pendingDropTargets.has(square)) {
        setSelectedSquare(null);
        setLegalMoves([]);
        onDropPiece?.(square);
        return;
      }
    }

    if (inputMethod === 'drag') return;

    if (justSelectedOnPointerDownRef.current === square) {
      justSelectedOnPointerDownRef.current = null;
      return;
    }
    justSelectedOnPointerDownRef.current = null;

    if (canPremoveNow && playerColor) {
      if (premoveSelectedSq) {
        if (premoveSelectedSq === square) {
          setPremoveSelectedSq(null);
          setPremoveTargets([]);
          return;
        }
        if (premoveTargets.includes(square)) {
          commitStandardMoveOrPromo(premoveSelectedSq, square, true);
          setPremoveSelectedSq(null);
          setPremoveTargets([]);
          return;
        }
      }

      const vPiece = virtualBoard[square];
      if (vPiece && vPiece.color === playerColor) {
        setPremoveSelectedSq(square);
        setPremoveTargets(getPseudoPremoveTargets(virtualBoard, square, playerColor));
      } else {
        const hadSelected = Boolean(premoveSelectedSq);
        setPremoveSelectedSq(null);
        setPremoveTargets([]);
        if (!hadSelected && premoves.length > 0) {
          onCancelPremoves?.();
        }
      }
      return;
    }

    if (disabled) return;

    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      const matchMove = legalMoves.find(m => m.to === square);
      if (matchMove) {
        commitStandardMoveOrPromo(selectedSquare, square, false);
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }

    const piece = chess.get(square);
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      const filtered = duckSquare ? moves.filter(m => m.to !== duckSquare) : moves;
      setLegalMoves(filtered);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleStandardPointerDown = (square: Square, e: React.PointerEvent) => {
    suppressNextClickRef.current = false;
    justSelectedOnPointerDownRef.current = null;

    if (e.button === 2) {
      handleRightPointerDown(square);
      return;
    }
    if (e.button !== 0 || isPlacingDuck || inputMethod === 'click') return;

    const rect = boardGridRef.current?.getBoundingClientRect();
    const cellW = rect ? rect.width / 8 : 58;
    const cellH = rect ? rect.height / 8 : 58;
    const pieceWidth = cellW * 0.92;
    const pieceHeight = cellH * 0.92;

    if (canPremoveNow && playerColor) {
      const vPiece = virtualBoard[square];
      if (!vPiece || vPiece.color !== playerColor) return;
      if (premoveSelectedSq !== square) {
        justSelectedOnPointerDownRef.current = square;
      }
      setPremoveSelectedSq(square);
      setPremoveTargets(getPseudoPremoveTargets(virtualBoard, square, playerColor));
      beginDragCandidate({
        pieceType: vPiece.type,
        pieceColor: vPiece.color,
        fromSquare: square,
        startX: e.clientX,
        startY: e.clientY,
        isDragging: false,
        pieceWidth,
        pieceHeight,
        isPremoveDrag: true
      });
      return;
    }

    if (disabled) return;
    const piece = chess.get(square);
    if (!piece || piece.color !== chess.turn()) return;

    const moves = chess.moves({ square, verbose: true });
    const filtered = duckSquare ? moves.filter(m => m.to !== duckSquare) : moves;
    if (selectedSquare !== square) {
      justSelectedOnPointerDownRef.current = square;
    }
    setSelectedSquare(square);
    setLegalMoves(filtered);

    beginDragCandidate({
      pieceType: piece.type as PieceType,
      pieceColor: piece.color as PieceColor,
      fromSquare: square,
      startX: e.clientX,
      startY: e.clientY,
      isDragging: false,
      pieceWidth,
      pieceHeight,
      isPremoveDrag: false
    });
  };

  const ranks = isFlipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const files = isFlipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const getSquareGridCoords = (sq: string) => {
    const file = sq[0];
    const rank = parseInt(sq[1], 10);
    const colIdx = files.indexOf(file);
    const rowIdx = ranks.indexOf(rank);
    return { x: colIdx * 12.5 + 6.25, y: rowIdx * 12.5 + 6.25 };
  };

  const showVirtualPieces = canPremoveNow && premoves.length > 0;

  return (
    <div
      ref={boardContainerRef}
      className={`relative flex flex-col items-center w-full ${isActivelyDragging ? 'chess-board-dragging' : ''}`}
      style={boardCssVars ? { maxWidth: boardMaxWidth, ...boardCssVars } : { maxWidth: boardMaxWidth }}
    >

      {isPlacingDuck && (
        <div
          className="mb-2 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md"
          style={{
            backgroundColor: 'var(--gm-accent)',
            color: 'var(--gm-accent-text)'
          }}
        >
          <span className="w-4 h-4">
            <ChessPieceIcon type="d" color="w" set={activePieceSet} />
          </span>
          <span>Place the Rubber Duck on any empty square</span>
        </div>
      )}

      <BoardFrame frame={boardTheme.frame} still={reduceMotion || isActivelyDragging}>
      <div
        onContextMenu={e => e.preventDefault()}
        className={`chess-board-shell relative select-none aspect-square w-full overflow-hidden touch-none ${
          isFramed ? 'rounded-[3px]' : isActivelyDragging ? 'rounded-xl' : 'rounded-xl shadow-2xl'
        }`}
        style={{
          border: isFramed ? 'none' : '2px solid var(--gm-border)',
          padding: activeCoordMode === 'outside' ? '18px' : '0px'
        }}
      >
        <div className="relative w-full h-full rounded-lg overflow-hidden">
        <div
          ref={boardGridRef}
          className="grid grid-cols-8 grid-rows-8 w-full h-full"
          role="grid"
          aria-label="Chess Board"
        >
          {ranks.map((rank, rIdx) =>
            files.map((file, fIdx) => {
              const square = `${file}${rank}` as Square;
              const isDark = (rIdx + fIdx) % 2 === 1;
              const isFogged = Boolean(fogVisibleSquares && !fogVisibleSquares.has(square));

              const realPiece = chess.get(square);
              const displayedPiece = isFogged
                ? undefined
                : showVirtualPieces
                ? virtualBoard[square]
                : realPiece;
              const isGhostVirtualPiece =
                !isFogged &&
                showVirtualPieces &&
                displayedPiece &&
                (!realPiece || realPiece.type !== displayedPiece.type || realPiece.color !== displayedPiece.color);

              const premoveStepsForTo = premoves
                .map((p, idx) => (p.to === square ? idx + 1 : -1))
                .filter(n => n > 0);
              const isPremoveFrom = premoves.some(p => p.from === square);
              const isPremoveTo = premoveStepsForTo.length > 0;

              const isSelected = selectedSquare === square || premoveSelectedSq === square;
              const stdRow = 8 - rank;
              const stdCol = FILES.indexOf(file as (typeof FILES)[number]);
              const isKeyCursor =
                keyboardControlEnabled && keyboardCursor?.row === stdRow && keyboardCursor?.col === stdCol;
              const isLastMoveSquare = !isFogged && lastMove && (lastMove.from === square || lastMove.to === square);
              const isSettling = !reduceMotion && !isFogged && lastMove?.to === square;
              const isBeingDraggedOrigin = dragState?.isDragging && dragState.fromSquare === square;

              const isDropTarget = Boolean(!disabled && pendingDropTargets?.has(square));
              const isTargetLegal =
                isDropTarget ||
                (highlightLegal &&
                  (canPremoveNow
                    ? premoveTargets.includes(square)
                    : legalMoves.some(m => m.to === square)));
              const isKingInCheck = !isFogged && kingInCheckSquare === square;
              const isThreatened = !isFogged && !isKingInCheck && threatenedSquares.includes(square);
              const hasDuck = !isFogged && duckSquare === square;

              const showRankLabel = activeCoordMode === 'inside' && fIdx === 0;
              const showFileLabel = activeCoordMode === 'inside' && rIdx === 7;

              const pieceDescription = isFogged
                ? 'hidden by fog of war'
                : displayedPiece
                ? `${displayedPiece.color === 'w' ? 'White' : 'Black'} ${displayedPiece.type.toUpperCase()}`
                : 'empty';

              const squareStateClass = isSelected
                ? 'chess-sq-selected'
                : isPremoveTo || isPremoveFrom
                ? isDark
                  ? 'chess-sq-premove-dark'
                  : 'chess-sq-premove-light'
                : isLastMoveSquare
                ? 'chess-sq-lastmove'
                : isDark
                ? 'chess-sq-dark'
                : 'chess-sq-light';

              return (
                <button
                  key={square}
                  type="button"
                  data-square={square}
                  onPointerDown={e => handleStandardPointerDown(square, e)}
                  onPointerUp={e => {
                    if (e.button === 2) handleRightPointerUp(square, e);
                  }}
                  onClick={() => {
                    if (keyboardControlEnabled) setKeyboardCursor({ row: stdRow, col: stdCol });
                    handleSquareClick(square);
                  }}
                  aria-label={`Square ${square}, ${pieceDescription}${isTargetLegal ? ', legal move target' : ''}${
                    isPremoveTo ? `, premove ${premoveStepsForTo.join(',')}` : ''
                  }${isThreatened ? ', threatened piece' : ''}`}
                  className={`chess-square-btn ${squareStateClass} relative flex items-center justify-center p-1 sm:p-1.5 focus:outline-none focus:z-20 ${
                    isSelected ? 'ring-2 ring-inset ring-emerald-300 z-10' : ''
                  } ${isKeyCursor ? 'ring-2 ring-inset ring-sky-400 z-20' : ''} ${
                    isThreatened ? 'ring-2 ring-inset ring-amber-400/90' : ''
                  } ${
                    isKingInCheck ? 'ring-3 ring-inset ring-rose-500' : ''
                  }`}
                >
                  {highlightedSquares[square] && (
                    <div
                      className="absolute inset-0 pointer-events-none z-0 opacity-45"
                      style={{ backgroundColor: highlightedSquares[square] }}
                    />
                  )}

                  {showRankLabel && (
                    <span
                      className={`${isDark ? 'chess-coord-dark' : 'chess-coord-light'} absolute top-0.5 left-1 text-[9px] sm:text-[10px] font-bold select-none pointer-events-none opacity-85 font-mono z-30`}
                    >
                      {rank}
                    </span>
                  )}
                  {showFileLabel && (
                    <span
                      className={`${isDark ? 'chess-coord-dark' : 'chess-coord-light'} absolute bottom-0.5 right-1 text-[9px] sm:text-[10px] font-bold select-none pointer-events-none opacity-85 font-mono z-30`}
                    >
                      {file}
                    </span>
                  )}

                  {!isFogged && moveClassification && moveClassification.square === square && !isPremoveTo && (
                    <MoveClassificationBadge type={moveClassification.type} variant="board" />
                  )}

                  {isThreatened &&
                    !isPremoveTo &&
                    !(moveClassification && moveClassification.square === square) && (
                    <span
                      className="absolute top-0.5 right-0.5 z-30 w-[14px] h-[14px] rounded-full bg-amber-500 text-slate-950 text-[9px] font-mono font-extrabold flex items-center justify-center shadow pointer-events-none"
                      title="Piece is hanging or under attack"
                    >
                      !
                    </span>
                  )}

                  {isPremoveTo && (
                    <span
                      data-testid={`premove-badge-${square}`}
                      className="absolute top-0.5 right-0.5 z-30 min-w-[14px] h-[14px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow pointer-events-none"
                    >
                      {premoveStepsForTo.join(',')}
                    </span>
                  )}

                  {isTargetLegal && !displayedPiece && (
                    <div
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full z-20 pointer-events-none ${
                        canPremoveNow
                          ? 'bg-rose-400/50 ring-1 ring-rose-200/50'
                          : isFogged
                          ? 'bg-sky-300/60 ring-1 ring-white/50'
                          : 'bg-black/25 ring-1 ring-white/30'
                      }`}
                    />
                  )}
                  {isTargetLegal && displayedPiece && (
                    <div
                      className={`absolute inset-1 rounded-full border-[3px] z-20 pointer-events-none ${
                        canPremoveNow ? 'border-rose-400/70' : 'border-black/30'
                      }`}
                    />
                  )}

                  {hasDuck && (
                    <div
                      className="w-full h-full flex items-center justify-center z-20 pointer-events-none"
                      title="Rubber Duck (Obstruction)"
                    >
                      <ChessPieceIcon type="d" color="w" set={activePieceSet} />
                    </div>
                  )}

                  {displayedPiece && !hasDuck && (
                    <div
                      key={isSettling ? `settle-${moveNonce}` : 'idle'}
                      className={`w-full h-full flex items-center justify-center z-10 transition-opacity duration-100 ${
                        isBeingDraggedOrigin ? 'opacity-20' : isGhostVirtualPiece ? 'opacity-80' : ''
                      } ${isSettling ? 'animate-piece-settle' : ''}`}
                    >
                      {blindfold ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-current opacity-30" />
                      ) : (
                        <ChessPieceIcon
                          type={displayedPiece.type as PieceType}
                          color={displayedPiece.color as PieceColor}
                          set={activePieceSet}
                          kingFinial={activeFinial}
                        />
                      )}
                    </div>
                  )}

                  {isFogged && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background: isDark
                          ? 'radial-gradient(circle at 35% 35%, rgba(30,41,59,0.78), rgba(15,23,42,0.9))'
                          : 'radial-gradient(circle at 35% 35%, rgba(51,65,85,0.72), rgba(15,23,42,0.86))'
                      }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
        <div
          ref={hoverTargetRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 ring-2 ring-inset ring-white/80 opacity-0"
          style={{ willChange: 'transform' }}
        />
        </div>

        {/* Interactive 4-Piece Promotion Picker Modal when Auto-Queen is OFF */}
        {pendingPromotion && (
          <div
            className="absolute inset-0 z-40 bg-black/55 backdrop-blur-[1px] flex items-center justify-center p-4"
            onClick={() => setPendingPromotion(null)}
          >
            <div
              className="rounded-xl p-3 border shadow-2xl flex flex-col items-center gap-2"
              style={{
                backgroundColor: 'var(--gm-card)',
                borderColor: 'var(--gm-border)',
                color: 'var(--gm-text)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--gm-text-2)' }}>
                Promote Pawn ({pendingPromotion.to.toUpperCase()})
              </span>
              <div className="flex items-center gap-2">
                {(['q', 'r', 'b', 'n'] as const).map(promoType => (
                  <button
                    key={promoType}
                    type="button"
                    aria-label={`Promote to ${promoType === 'q' ? 'Queen' : promoType === 'r' ? 'Rook' : promoType === 'b' ? 'Bishop' : 'Knight'}`}
                    onClick={() => {
                      const req = pendingPromotion;
                      setPendingPromotion(null);
                      if (req.isPremove) {
                        onQueuePremove?.({ from: req.from, to: req.to, promotion: promoType });
                      } else {
                        onMakeMove?.({ from: req.from, to: req.to, promotion: promoType });
                      }
                    }}
                    className="w-12 h-12 rounded-lg border p-1.5 transition-transform hover:scale-105"
                    style={{
                      backgroundColor: 'var(--gm-card-2)',
                      borderColor: 'var(--gm-border)'
                    }}
                  >
                    <ChessPieceIcon
                      type={promoType}
                      color={pendingPromotion.color}
                      set={activePieceSet}
                      kingFinial={activeFinial}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Outside Coordinates Overlay Labels */}
        {activeCoordMode === 'outside' && (
          <>
            <div className="absolute left-0.5 top-[18px] bottom-[18px] flex flex-col justify-around pointer-events-none">
              {ranks.map(r => (
                <span key={r} className="text-[9px] font-mono font-bold leading-none opacity-85" style={{ color: 'var(--square-light)' }}>
                  {r}
                </span>
              ))}
            </div>
            <div className="absolute bottom-0.5 left-[18px] right-[18px] flex justify-around pointer-events-none">
              {files.map(f => (
                <span key={f} className="text-[9px] font-mono font-bold leading-none opacity-85" style={{ color: 'var(--square-light)' }}>
                  {f}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Unified SVG Overlay for Hint Arrow, Premove Chain Arrows & Right-Click Tactical Arrows */}
        {(bestMoveArrow || premoves.length > 0 || userArrows.length > 0) && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <marker
                id={`arrowhead-${arrowMarkerId}`}
                markerWidth="4"
                markerHeight="4"
                refX="2.5"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 4 2, 0 4" fill="var(--gm-accent)" />
              </marker>
              <marker
                id={`arrowhead-premove-${arrowMarkerId}`}
                markerWidth="4"
                markerHeight="4"
                refX="2.5"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 4 2, 0 4" fill="#fb7185" />
              </marker>
              <marker
                id={`arrowhead-amber-${arrowMarkerId}`}
                markerWidth="4"
                markerHeight="4"
                refX="2.5"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 4 2, 0 4" fill="#f59e0b" />
              </marker>
              <marker
                id={`arrowhead-emerald-${arrowMarkerId}`}
                markerWidth="4"
                markerHeight="4"
                refX="2.5"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 4 2, 0 4" fill="#10b981" />
              </marker>
            </defs>

            {/* User Right-Click Drawn Arrows */}
            {userArrows.map((arrow, idx) => {
              const start = getSquareGridCoords(arrow.from);
              const end = getSquareGridCoords(arrow.to);
              const isGreen = arrow.color === '#10b981';
              return (
                <line
                  key={`user-${idx}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={arrow.color}
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  opacity="0.82"
                  markerEnd={`url(#${isGreen ? `arrowhead-emerald-${arrowMarkerId}` : `arrowhead-amber-${arrowMarkerId}`})`}
                />
              );
            })}

            {/* Queued Premoves Dashed Chain */}
            {premoves.map((pm, idx) => {
              const start = getSquareGridCoords(pm.from);
              const end = getSquareGridCoords(pm.to);
              return (
                <line
                  key={`pm-${idx}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#fb7185"
                  strokeWidth="1.9"
                  strokeDasharray="2.8 1.8"
                  strokeLinecap="round"
                  opacity="0.9"
                  markerEnd={`url(#arrowhead-premove-${arrowMarkerId})`}
                />
              );
            })}

            {/* Engine Hint Arrow */}
            {bestMoveArrow && (!fogVisibleSquares || (fogVisibleSquares.has(bestMoveArrow.from) && fogVisibleSquares.has(bestMoveArrow.to))) && (() => {
              const start = getSquareGridCoords(bestMoveArrow.from);
              const end = getSquareGridCoords(bestMoveArrow.to);
              return (
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="var(--gm-accent)"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  opacity="0.88"
                  markerEnd={`url(#arrowhead-${arrowMarkerId})`}
                />
              );
            })()}
          </svg>
        )}
      </div>
      </BoardFrame>
      {renderFloatingDragPiece()}
      {keyboardControlEnabled && keyboardCursor && (
        <div className="mt-1.5 flex items-center justify-center gap-2 text-[11px] font-mono" style={{ color: 'var(--gm-muted)' }}>
          <span>Key Cursor:</span>
          <span className="font-bold" style={{ color: 'var(--gm-accent)' }}>
            {`${FILES[keyboardCursor.col]}${8 - keyboardCursor.row}`}
          </span>
          <span>· Arrows / WASD · Space / Enter</span>
        </div>
      )}
    </div>
  );
});
