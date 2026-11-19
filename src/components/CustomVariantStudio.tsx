import React, { useState, useEffect, useRef } from 'react';
import {
  PieceType,
  PieceColor,
  CustomVariantConfig,
  CustomBoardSquare
} from '../types/chess';
import {
  ALL_CUSTOM_PIECE_DEFS,
  DEFAULT_CUSTOM_PRESETS,
  CustomGameState,
  CustomMove,
  createCustomGameState,
  chooseSmartDuckPos,
  getAllLegalMoves,
  executeCustomMove,
  getCustomAIMove,
  coordsToSquare,
  evaluateCustomBoard,
  collectPiecesUsed,
  variantToCustomConfig,
  findKingPosition,
  isKingInCheck
} from '../engine/customVariantEngine';
import { engineGetCustomAIMove } from '../engine/engineClient';
import { CHESS_VARIANTS } from '../engine/variants';
import { ChessPieceIcon } from './ChessPieces';
import { useAppTheme } from '../context/ThemeContext';
import {
  Sliders,
  Play,
  RotateCcw,
  Save,
  Trash2,
  Sparkles,
  Swords,
  Plus,
  Check,
  FlipVertical2,
  Grid,
  Trophy,
  Eraser,
  ArrowUpRight
} from 'lucide-react';

interface CustomVariantStudioProps {
  initialVariantConfig?: CustomVariantConfig | null;
  onBackToVariants?: () => void;
  onPlayInMainArena?: (config: CustomVariantConfig) => void;
}

export const CustomVariantStudio: React.FC<CustomVariantStudioProps> = ({
  initialVariantConfig = null,
  onPlayInMainArena
}) => {
  const { theme, boardTheme, pieceSet } = useAppTheme();

  const [savedVariants, setSavedVariants] = useState<CustomVariantConfig[]>(() => {
    try {
      const saved = localStorage.getItem('gm_chess_custom_variants');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CUSTOM_PRESETS;
  });

  const [currentVariant, setCurrentVariant] = useState<CustomVariantConfig>(() =>
    initialVariantConfig || DEFAULT_CUSTOM_PRESETS[0]
  );
  const [activeTab, setActiveTab] = useState<'editor' | 'play' | 'library'>('editor');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [paletteColor, setPaletteColor] = useState<PieceColor>('w');
  const [selectedPieceType, setSelectedPieceType] = useState<PieceType | 'eraser'>('e');

  // Test Play state
  const [playState, setPlayState] = useState<CustomGameState | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [playLegalMoves, setPlayLegalMoves] = useState<CustomMove[]>([]);
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);
  const [aiEnabled, setAiEnabled] = useState<boolean>(true);
  const [isPlacingDuck, setIsPlacingDuck] = useState<boolean>(false);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const studioGenRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialVariantConfig) {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      studioGenRef.current += 1;
      setIsAIThinking(false);
      setCurrentVariant(initialVariantConfig);
      setActiveTab('editor');
    }
  }, [initialVariantConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('gm_chess_custom_variants', JSON.stringify(savedVariants));
    } catch {
      // ignore
    }
  }, [savedVariants]);

  const handleResizeGrid = (newWidth: number, newHeight: number) => {
    newWidth = Math.max(5, Math.min(10, newWidth));
    newHeight = Math.max(5, Math.min(10, newHeight));

    const nextGrid: (CustomBoardSquare | null)[][] = [];
    for (let r = 0; r < newHeight; r++) {
      const row: (CustomBoardSquare | null)[] = [];
      for (let c = 0; c < newWidth; c++) {
        if (currentVariant.grid[r] && currentVariant.grid[r][c]) {
          row.push(currentVariant.grid[r][c]);
        } else {
          row.push(null);
        }
      }
      nextGrid.push(row);
    }

    setCurrentVariant(prev => ({
      ...prev,
      boardWidth: newWidth,
      boardHeight: newHeight,
      grid: nextGrid,
      customPiecesUsed: collectPiecesUsed(nextGrid)
    }));
  };

  const handleEditorSquareClick = (r: number, c: number) => {
    const nextGrid = currentVariant.grid.map(row => [...row]);
    if (selectedPieceType === 'eraser') {
      nextGrid[r][c] = null;
    } else {
      nextGrid[r][c] = {
        type: selectedPieceType,
        color: paletteColor
      };
    }

    setCurrentVariant(prev => ({
      ...prev,
      grid: nextGrid,
      customPiecesUsed: collectPiecesUsed(nextGrid)
    }));
  };

  const handleClearBoard = () => {
    const emptyGrid = Array.from({ length: currentVariant.boardHeight }, () =>
      Array.from({ length: currentVariant.boardWidth }, () => null)
    );
    setCurrentVariant(prev => ({
      ...prev,
      grid: emptyGrid,
      customPiecesUsed: []
    }));
  };

  const handleCreateBlankFromScratch = () => {
    const w = currentVariant.boardWidth;
    const h = currentVariant.boardHeight;
    const blankGrid: (CustomBoardSquare | null)[][] = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => null)
    );
    const kingCol = Math.floor(w / 2);
    blankGrid[0][kingCol] = { type: 'k', color: 'b' };
    blankGrid[h - 1][kingCol] = { type: 'k', color: 'w' };

    setCurrentVariant({
      id: `custom_${Date.now()}`,
      name: 'Scratch Variant',
      tagline: `${w}x${h} custom board`,
      description: 'Built from scratch with custom piece army and rules.',
      boardWidth: w,
      boardHeight: h,
      grid: blankGrid,
      rules: {
        pawnDoubleStep: true,
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
      customPiecesUsed: ['k'],
      createdAt: new Date().toISOString().split('T')[0]
    });
  };

  // Mirror bottom half (White) onto top half (Black) for symmetric variant building
  const handleMirrorWhiteToBlack = () => {
    const h = currentVariant.boardHeight;
    const w = currentVariant.boardWidth;
    const nextGrid = currentVariant.grid.map(row => [...row]);
    const half = Math.floor(h / 2);
    for (let r = h - 1; r >= half; r--) {
      const mirrorR = h - 1 - r;
      if (mirrorR === r) continue;
      for (let c = 0; c < w; c++) {
        const cell = nextGrid[r][c];
        if (cell && cell.color === 'w') {
          nextGrid[mirrorR][c] = { type: cell.type, color: 'b' };
        }
      }
    }
    setCurrentVariant(prev => ({
      ...prev,
      grid: nextGrid,
      customPiecesUsed: collectPiecesUsed(nextGrid)
    }));
  };

  const handleLoadBaseVariant = (sourceId: string) => {
    if (sourceId.startsWith('preset_')) {
      const found = DEFAULT_CUSTOM_PRESETS.find(p => p.id === sourceId);
      if (found) {
        setCurrentVariant({
          ...found,
          grid: found.grid.map(r => r.map(c => (c ? { ...c } : null)))
        });
      }
      return;
    }
    const vId = sourceId as (typeof CHESS_VARIANTS)[number]['id'];
    setCurrentVariant(variantToCustomConfig(vId));
  };

  const handleSaveVariant = () => {
    const existingIdx = savedVariants.findIndex(v => v.id === currentVariant.id);
    let updated: CustomVariantConfig[];
    if (existingIdx >= 0) {
      updated = [...savedVariants];
      updated[existingIdx] = currentVariant;
    } else {
      const newV = {
        ...currentVariant,
        id: `custom_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      updated = [newV, ...savedVariants];
      setCurrentVariant(newV);
    }
    setSavedVariants(updated);
    setSaveSuccessMsg(`Saved "${currentVariant.name}" to your Variant Library.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedVariants(prev => prev.filter(v => v.id !== id));
  };

  const handleStartPlay = () => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    studioGenRef.current += 1;
    setIsAIThinking(false);
    setPlayState(createCustomGameState(currentVariant));
    setSelectedSquare(null);
    setPlayLegalMoves([]);
    setIsPlacingDuck(false);
    setActiveTab('play');
  };

  const handlePlaySquareClick = (r: number, c: number) => {
    if (!playState || playState.winner || isAIThinking) return;

    if (isPlacingDuck) {
      if (!playState.grid[r][c]) {
        const afterDuck: CustomGameState = { ...playState, duckPos: { row: r, col: c } };
        setPlayState(afterDuck);
        setIsPlacingDuck(false);

        if (aiEnabled && !afterDuck.winner && afterDuck.turn === 'b') {
          runAIForState(afterDuck);
        }
      }
      return;
    }

    if (selectedSquare) {
      const match = playLegalMoves.find(m => m.toRow === r && m.toCol === c);
      if (match) {
        const nextState = executeCustomMove(playState, match);
        setPlayState(nextState);
        setSelectedSquare(null);
        setPlayLegalMoves([]);

        if (nextState.config.rules.allowDuckPlacement && !nextState.winner) {
          setIsPlacingDuck(true);
          return;
        }

        if (aiEnabled && !nextState.winner && nextState.turn === 'b') {
          runAIForState(nextState);
        }
        return;
      }
    }

    const piece = playState.grid[r][c];
    if (piece && piece.color === playState.turn && piece.type !== 'd') {
      setSelectedSquare({ row: r, col: c });
      const all = getAllLegalMoves(playState);
      const pieceMoves = all.filter(m => m.fromRow === r && m.fromCol === c);
      setPlayLegalMoves(pieceMoves);
    } else {
      setSelectedSquare(null);
      setPlayLegalMoves([]);
    }
  };

  const runAIForState = (stateSnapshot: CustomGameState) => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    const gen = studioGenRef.current;
    setIsAIThinking(true);
    // Search in the engine worker in parallel with the short think delay
    const aiMoveRequest = engineGetCustomAIMove(stateSnapshot).catch(() => getCustomAIMove(stateSnapshot));
    aiTimeoutRef.current = setTimeout(() => {
      aiMoveRequest.then(aiMove => {
        if (gen !== studioGenRef.current) return;
        if (aiMove) {
          let afterAI = executeCustomMove(stateSnapshot, aiMove);
          if (afterAI.config.rules.allowDuckPlacement && !afterAI.winner) {
            const smartDuck = chooseSmartDuckPos(afterAI);
            if (smartDuck) {
              afterAI = { ...afterAI, duckPos: smartDuck };
            }
          }
          setPlayState(afterAI);
        }
        setIsAIThinking(false);
      });
    }, 320);
  };

  const currentEval = playState ? evaluateCustomBoard(playState.grid) : 0;
  const playCheckSq =
    playState && isKingInCheck(playState.grid, playState.turn, playState.config.rules, playState.duckPos)
      ? findKingPosition(playState.grid, playState.turn)
      : null;

  return (
    <div className="flex flex-col gap-5" style={{ color: theme.textPrimary }}>
      {/* Studio Sub-Navigation Strip */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border"
        style={{
          backgroundColor: theme.cardHex,
          borderColor: theme.cardBorderHex
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Load Template / Variant */}
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs" style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}>
            <span className="font-semibold" style={{ color: theme.textMutedHex }}>Template:</span>
            <select
              aria-label="Load variant template"
              value=""
              onChange={e => {
                if (e.target.value) handleLoadBaseVariant(e.target.value);
              }}
              className="bg-transparent font-bold focus:outline-none cursor-pointer"
              style={{ color: theme.accentHex }}
            >
              <option value="" style={{ backgroundColor: theme.cardHex, color: theme.textPrimary }}>
                Load Variant Rules...
              </option>
              <optgroup label="Custom Presets" style={{ backgroundColor: theme.cardHex, color: theme.textPrimary }}>
                {DEFAULT_CUSTOM_PRESETS.map(p => (
                  <option key={p.id} value={p.id} style={{ backgroundColor: theme.cardHex, color: theme.textPrimary }}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label={`All ${CHESS_VARIANTS.length} Variants`} style={{ backgroundColor: theme.cardHex, color: theme.textPrimary }}>
                {CHESS_VARIANTS.map(v => (
                  <option key={v.id} value={v.id} style={{ backgroundColor: theme.cardHex, color: theme.textPrimary }}>
                    {v.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>

          <button
            type="button"
            onClick={handleCreateBlankFromScratch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition hover:opacity-80"
            style={{
              backgroundColor: theme.cardSecondaryHex,
              borderColor: theme.cardBorderHex,
              color: theme.textPrimary
            }}
          >
            <Plus className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
            <span>New From Scratch</span>
          </button>
        </div>

        {/* Mode Tabs */}
        <div
          className="flex items-center p-1 rounded-lg border"
          style={{
            backgroundColor: theme.cardSecondaryHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
              studioGenRef.current += 1;
              setIsAIThinking(false);
              setActiveTab('editor');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition"
            style={{
              backgroundColor: activeTab === 'editor' ? theme.accentHex : 'transparent',
              color: activeTab === 'editor' ? theme.accentTextHex : theme.textSecondary
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Board & Rules Editor</span>
          </button>

          <button
            type="button"
            onClick={handleStartPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition"
            style={{
              backgroundColor: activeTab === 'play' ? theme.accentHex : 'transparent',
              color: activeTab === 'play' ? theme.accentTextHex : theme.textSecondary
            }}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Play / Test vs AI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
              studioGenRef.current += 1;
              setIsAIThinking(false);
              setActiveTab('library');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition"
            style={{
              backgroundColor: activeTab === 'library' ? theme.accentHex : 'transparent',
              color: activeTab === 'library' ? theme.accentTextHex : theme.textSecondary
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saved ({savedVariants.length})</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div
          className="px-4 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold"
          style={{
            backgroundColor: `${theme.accentHex}15`,
            borderColor: theme.accentHex,
            color: theme.accentHex
          }}
        >
          <Check className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* TAB 1: STUDIO EDITOR */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Board Grid Canvas & Sizing */}
          <div
            className="lg:col-span-7 flex flex-col gap-4 p-5 rounded-xl border"
            style={{
              backgroundColor: theme.cardHex,
              borderColor: theme.cardBorderHex
            }}
          >
            {/* Dimension Steppers + Quick Size Chips */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: theme.cardBorderHex }}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
                    Width
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleResizeGrid(currentVariant.boardWidth - 1, currentVariant.boardHeight)}
                      disabled={currentVariant.boardWidth <= 5}
                      className="w-7 h-7 rounded-lg border text-sm font-bold flex items-center justify-center disabled:opacity-30"
                      style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-mono font-bold text-sm tabular-nums">
                      {currentVariant.boardWidth}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleResizeGrid(currentVariant.boardWidth + 1, currentVariant.boardHeight)}
                      disabled={currentVariant.boardWidth >= 10}
                      className="w-7 h-7 rounded-lg border text-sm font-bold flex items-center justify-center disabled:opacity-30"
                      style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
                    Height
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleResizeGrid(currentVariant.boardWidth, currentVariant.boardHeight - 1)}
                      disabled={currentVariant.boardHeight <= 5}
                      className="w-7 h-7 rounded-lg border text-sm font-bold flex items-center justify-center disabled:opacity-30"
                      style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-mono font-bold text-sm tabular-nums">
                      {currentVariant.boardHeight}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleResizeGrid(currentVariant.boardWidth, currentVariant.boardHeight + 1)}
                      disabled={currentVariant.boardHeight >= 10}
                      className="w-7 h-7 rounded-lg border text-sm font-bold flex items-center justify-center disabled:opacity-30"
                      style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Dimension Presets */}
                <div className="flex items-center gap-1">
                  <Grid className="w-3.5 h-3.5 mr-0.5" style={{ color: theme.textMutedHex }} />
                  {[
                    [5, 5],
                    [6, 6],
                    [8, 8],
                    [10, 8],
                    [10, 10]
                  ].map(([gw, gh]) => {
                    const active = currentVariant.boardWidth === gw && currentVariant.boardHeight === gh;
                    return (
                      <button
                        key={`${gw}x${gh}`}
                        type="button"
                        onClick={() => handleResizeGrid(gw, gh)}
                        className="px-2 py-1 rounded text-[11px] font-mono font-bold transition"
                        style={{
                          backgroundColor: active ? theme.accentHex : theme.cardSecondaryHex,
                          color: active ? theme.accentTextHex : theme.textSecondary
                        }}
                      >
                        {gw}×{gh}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Board Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMirrorWhiteToBlack}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold hover:opacity-80 transition"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
                  title="Mirror White pieces onto Black side"
                >
                  <FlipVertical2 className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                  <span>Mirror W→B</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearBoard}
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold hover:opacity-80 transition"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textSecondary }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleStartPlay}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-90"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Board</span>
                </button>
              </div>
            </div>

            {/* Interactive Grid Canvas */}
            <div className="flex justify-center p-1">
              <div
                className="relative rounded-xl overflow-hidden shadow-2xl border-2 select-none"
                style={{
                  borderColor: theme.cardBorderHex,
                  width: '100%',
                  maxWidth: '520px',
                  aspectRatio: `${currentVariant.boardWidth} / ${currentVariant.boardHeight}`
                }}
              >
                <div
                  className="grid w-full h-full"
                  style={{
                    gridTemplateColumns: `repeat(${currentVariant.boardWidth}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${currentVariant.boardHeight}, minmax(0, 1fr))`
                  }}
                >
                  {currentVariant.grid.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      const isDark = (rIdx + cIdx) % 2 === 1;
                      const squareColor = isDark ? boardTheme.darkHex : boardTheme.lightHex;
                      const sqLabel = coordsToSquare(rIdx, cIdx, currentVariant.boardHeight);

                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          type="button"
                          onClick={() => handleEditorSquareClick(rIdx, cIdx)}
                          style={{ backgroundColor: squareColor }}
                          className="relative flex items-center justify-center p-1 cursor-pointer transition hover:brightness-110 active:scale-95"
                          aria-label={`Square ${sqLabel}${cell ? `, ${cell.color === 'w' ? 'White' : 'Black'} ${cell.type}` : ', empty'}`}
                          title={`Square ${sqLabel}`}
                        >
                          {cIdx === 0 && (
                            <span
                              style={{ color: isDark ? boardTheme.coordDark : boardTheme.coordLight }}
                              className="absolute top-0.5 left-1 text-[8px] font-mono font-bold pointer-events-none opacity-80"
                            >
                              {currentVariant.boardHeight - rIdx}
                            </span>
                          )}
                          {rIdx === currentVariant.boardHeight - 1 && (
                            <span
                              style={{ color: isDark ? boardTheme.coordDark : boardTheme.coordLight }}
                              className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold pointer-events-none opacity-80"
                            >
                              {String.fromCharCode(97 + cIdx)}
                            </span>
                          )}

                          {cell && (
                            <div className="w-full h-full flex items-center justify-center z-10 pointer-events-none">
                              <ChessPieceIcon
                                type={cell.type}
                                color={cell.color}
                                set={pieceSet}
                              />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-center" style={{ color: theme.textMutedHex }}>
              Click any square to place the active piece ({ALL_CUSTOM_PIECE_DEFS.find(p => p.type === selectedPieceType)?.name || 'Eraser'}).
            </p>
          </div>

          {/* Right Column: Piece Palette & Rules Editor */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Piece Palette */}
            <div
              className="p-5 rounded-xl border flex flex-col gap-3.5"
              style={{
                backgroundColor: theme.cardHex,
                borderColor: theme.cardBorderHex
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-bold tracking-tight" style={{ color: theme.textPrimary }}>
                    Piece Palette
                  </h3>
                  <span className="text-[11px]" style={{ color: theme.textSecondary }}>
                    Classic & Fairy Variant Pieces
                  </span>
                </div>

                {/* Color Switcher */}
                <div
                  className="flex items-center p-1 rounded-lg border text-xs"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                >
                  <button
                    type="button"
                    onClick={() => setPaletteColor('w')}
                    className="px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1.5"
                    style={{
                      backgroundColor: paletteColor === 'w' ? '#ffffff' : 'transparent',
                      color: paletteColor === 'w' ? '#0f172a' : theme.textSecondary
                    }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-black/30" />
                    <span>White</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteColor('b')}
                    className="px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1.5"
                    style={{
                      backgroundColor: paletteColor === 'b' ? '#111827' : 'transparent',
                      color: paletteColor === 'b' ? '#ffffff' : theme.textSecondary
                    }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-black border border-white/30" />
                    <span>Black</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {ALL_CUSTOM_PIECE_DEFS.map(piece => {
                  const isSelected = selectedPieceType === piece.type;
                  const shortLabel = piece.name.split('(')[0].split('/')[0].trim();
                  return (
                    <button
                      key={piece.type}
                      type="button"
                      onClick={() => setSelectedPieceType(piece.type)}
                      className="relative flex flex-col items-center justify-center p-2 rounded-lg border transition hover:opacity-90 cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? `${theme.accentHex}18` : theme.cardSecondaryHex,
                        borderColor: isSelected ? theme.accentHex : theme.cardBorderHex,
                        boxShadow: isSelected ? `0 0 0 1px ${theme.accentHex}` : undefined
                      }}
                      title={`${piece.name} — ${piece.tagline}`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center mb-1">
                        <ChessPieceIcon
                          type={piece.type}
                          color={paletteColor}
                          set={pieceSet}
                        />
                      </div>
                      <span className="text-[10px] font-bold truncate max-w-full" style={{ color: theme.textPrimary }}>
                        {shortLabel}
                      </span>
                      {piece.isFairy && (
                        <span
                          className="text-[9px] font-semibold"
                          style={{ color: theme.accentHex }}
                        >
                          Variant
                        </span>
                      )}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setSelectedPieceType('eraser')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${
                    selectedPieceType === 'eraser' ? 'ring-2 ring-rose-500' : 'hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: selectedPieceType === 'eraser' ? 'rgba(244, 63, 94, 0.16)' : theme.cardSecondaryHex,
                    borderColor: selectedPieceType === 'eraser' ? '#f43f5e' : theme.cardBorderHex
                  }}
                  title="Eraser (Clear Square)"
                >
                  <Eraser className="w-6 h-6 text-rose-500 mb-1" />
                  <span className="text-[10px] font-bold text-rose-500">Eraser</span>
                </button>
              </div>
            </div>

            {/* Rules & Abilities Configuration */}
            <div
              className="p-5 rounded-xl border flex flex-col gap-3.5"
              style={{
                backgroundColor: theme.cardHex,
                borderColor: theme.cardBorderHex
              }}
            >
              <h3 className="font-display text-sm font-bold tracking-tight" style={{ color: theme.textPrimary }}>
                Rules & Special Abilities
              </h3>

              <div className="grid grid-cols-1 gap-2 text-xs">
                {[
                  {
                    label: 'Pawn Initial Double-Step',
                    sub: 'Disabled in historical Chaturanga',
                    checked: currentVariant.rules.pawnDoubleStep,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, pawnDoubleStep: v } }))
                  },
                  {
                    label: 'Castling (O-O / O-O-O)',
                    sub: 'Allow standard or Chess960 castling rights',
                    checked: currentVariant.rules.castling,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, castling: v } }))
                  },
                  {
                    label: 'En Passant Captures',
                    sub: 'Allow diagonal en passant pawn capture after double-step',
                    checked: currentVariant.rules.enPassant,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, enPassant: v } }))
                  },
                  {
                    label: 'Reverse Pawns',
                    sub: 'White and Black start inverted and march toward opposite ends',
                    checked: Boolean(currentVariant.rules.reversePawns),
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, reversePawns: v } }))
                  },
                  {
                    label: 'Checkmate Victory',
                    sub: 'Protect the King from check and checkmate',
                    checked: currentVariant.rules.winConditions.checkmate,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({
                        ...prev,
                        rules: { ...prev.rules, winConditions: { ...prev.rules.winConditions, checkmate: v } }
                      }))
                  },
                  {
                    label: 'Bare King Victory (Chaturanga Rule)',
                    sub: 'Win immediately when opponent has only King left',
                    checked: currentVariant.rules.winConditions.bareKing,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({
                        ...prev,
                        rules: { ...prev.rules, winConditions: { ...prev.rules.winConditions, bareKing: v } }
                      }))
                  },
                  {
                    label: 'Extinction Victory',
                    sub: 'Capture all of an enemy piece type (Q, R, B, N, or P) to win',
                    checked: Boolean(currentVariant.rules.winConditions.extinction),
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({
                        ...prev,
                        rules: { ...prev.rules, winConditions: { ...prev.rules.winConditions, extinction: v } }
                      }))
                  },
                  {
                    label: 'Center Hill Conquest',
                    sub: 'King reaching center squares wins',
                    checked: currentVariant.rules.winConditions.centerHill,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({
                        ...prev,
                        rules: { ...prev.rules, winConditions: { ...prev.rules.winConditions, centerHill: v } }
                      }))
                  },
                  {
                    label: 'Racing Kings Finish Rank',
                    sub: 'King reaching opposite back rank wins',
                    checked: currentVariant.rules.winConditions.racingKings,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({
                        ...prev,
                        rules: { ...prev.rules, winConditions: { ...prev.rules.winConditions, racingKings: v } }
                      }))
                  },
                  {
                    label: 'Three-Check Victory',
                    sub: 'Deliver 3 checks to win immediately',
                    checked: currentVariant.rules.winConditions.threeCheck,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({
                        ...prev,
                        rules: { ...prev.rules, winConditions: { ...prev.rules.winConditions, threeCheck: v } }
                      }))
                  },
                  {
                    label: 'Atomic Explosions on Capture',
                    sub: 'Captures explode surrounding non-pawn pieces',
                    checked: currentVariant.rules.atomicExplosions,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, atomicExplosions: v } }))
                  },
                  {
                    label: 'Mandatory Captures (Antichess)',
                    sub: 'Force captures & win by losing all pieces',
                    checked: currentVariant.rules.mandatoryCaptures,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, mandatoryCaptures: v } }))
                  },
                  {
                    label: 'Duck Blocker Placement',
                    sub: 'Place neutral blocker after each move',
                    checked: currentVariant.rules.allowDuckPlacement,
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, allowDuckPlacement: v } }))
                  },
                  {
                    label: 'Checkless Chess',
                    sub: 'Giving non-checkmating check is illegal',
                    checked: Boolean(currentVariant.rules.checkless),
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, checkless: v } }))
                  },
                  {
                    label: 'Capture Absorption',
                    sub: 'Capturing piece absorbs victim movement powers',
                    checked: Boolean(currentVariant.rules.absorption),
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, absorption: v } }))
                  },
                  {
                    label: 'Knightmare Mode',
                    sub: 'All non-King pieces gain extra Knight leaps',
                    checked: Boolean(currentVariant.rules.knightmare),
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, knightmare: v } }))
                  },
                  {
                    label: 'Anti-Queen Protection',
                    sub: 'Queens cannot capture Kings or deliver check',
                    checked: Boolean(currentVariant.rules.antiQueen),
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, antiQueen: v } }))
                  },
                  {
                    label: 'Gladiator Shield',
                    sub: 'Capturing piece gains one-turn capture immunity',
                    checked: Boolean(currentVariant.rules.gladiator),
                    onChange: (v: boolean) =>
                      setCurrentVariant(prev => ({ ...prev, rules: { ...prev.rules, gladiator: v } }))
                  }
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border cursor-pointer"
                    style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                  >
                    <div className="pr-2">
                      <div className="font-bold" style={{ color: theme.textPrimary }}>{item.label}</div>
                      <div className="text-[10px]" style={{ color: theme.textMutedHex }}>{item.sub}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={e => item.onChange(e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer shrink-0"
                      style={{ accentColor: theme.accentHex }}
                    />
                  </label>
                ))}

                {/* Promotion Piece Target */}
                <div
                  className="flex items-center justify-between p-2.5 rounded-lg border"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                >
                  <div>
                    <div className="font-bold" style={{ color: theme.textPrimary }}>Pawn Promotion Piece</div>
                    <div className="text-[10px]" style={{ color: theme.textMutedHex }}>Mantri in Chaturanga, Queen in Standard</div>
                  </div>
                  <select
                    aria-label="Pawn promotion piece"
                    value={currentVariant.rules.promotionPiece || 'q'}
                    onChange={e =>
                      setCurrentVariant(prev => ({
                        ...prev,
                        rules: { ...prev.rules, promotionPiece: e.target.value as PieceType }
                      }))
                    }
                    className="px-2.5 py-1 rounded border text-xs font-bold focus:outline-none"
                    style={{
                      backgroundColor: theme.cardHex,
                      borderColor: theme.cardBorderHex,
                      color: theme.textPrimary
                    }}
                  >
                    <option value="q">Queen</option>
                    <option value="f">Mantri / Ferz</option>
                    <option value="c">Chancellor</option>
                    <option value="a">Archbishop</option>
                    <option value="z">Amazon</option>
                    <option value="r">Rook</option>
                    <option value="n">Knight</option>
                  </select>
                </div>
              </div>

              {/* Variant Name & Tagline */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t" style={{ borderColor: theme.cardBorderHex }}>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: theme.textMutedHex }}>
                    Variant Name
                  </label>
                  <input
                    type="text"
                    value={currentVariant.name}
                    onChange={e => setCurrentVariant(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none"
                    style={{
                      backgroundColor: theme.cardSecondaryHex,
                      borderColor: theme.cardBorderHex,
                      color: theme.textPrimary
                    }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: theme.textMutedHex }}>
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={currentVariant.tagline}
                    onChange={e => setCurrentVariant(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none"
                    style={{
                      backgroundColor: theme.cardSecondaryHex,
                      borderColor: theme.cardBorderHex,
                      color: theme.textPrimary
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveVariant}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition hover:opacity-90"
                  style={{
                    backgroundColor: theme.accentHex,
                    color: theme.accentTextHex
                  }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Variant</span>
                </button>
                {onPlayInMainArena && (
                  <button
                    type="button"
                    onClick={() => onPlayInMainArena(currentVariant)}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border text-xs font-bold transition hover:opacity-80"
                    style={{
                      backgroundColor: theme.cardSecondaryHex,
                      borderColor: theme.cardBorderHex,
                      color: theme.textPrimary
                    }}
                    title="Launch this custom variant inside the full timed Play Arena"
                  >
                    <ArrowUpRight className="w-4 h-4" style={{ color: theme.accentHex }} />
                    <span>Main Arena</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLAY / TEST VS AI */}
      {activeTab === 'play' && playState && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div
            className="lg:col-span-8 flex flex-col gap-4 p-5 rounded-xl border"
            style={{
              backgroundColor: theme.cardHex,
              borderColor: theme.cardBorderHex
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: theme.cardBorderHex }}>
              <div>
                <h2 className="font-display font-bold text-base" style={{ color: theme.textPrimary }}>
                  {playState.config.name} · {playState.config.boardWidth}×{playState.config.boardHeight}
                </h2>
                <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                  <span>
                    Turn:{' '}
                    <strong style={{ color: theme.accentHex }}>
                      {isPlacingDuck ? 'Place Rubber Duck' : playState.turn === 'w' ? 'White' : 'Black (AI)'}
                    </strong>
                  </span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">Move {playState.moveNumber}</span>
                  {playState.config.rules.winConditions.threeCheck && (
                    <>
                      <span>·</span>
                      <span className="font-mono">
                        Checks W:{playState.whiteChecks}/3 B:{playState.blackChecks}/3
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5"
                  style={{
                    backgroundColor: aiEnabled ? `${theme.accentHex}18` : theme.cardSecondaryHex,
                    borderColor: aiEnabled ? theme.accentHex : theme.cardBorderHex,
                    color: aiEnabled ? theme.accentHex : theme.textSecondary
                  }}
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>AI: {aiEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartPlay}
                  className="p-2 rounded-lg border hover:opacity-80 transition"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
                  title="Restart Match"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {playState.winner && (
              <div
                className="p-4 rounded-xl border flex items-center justify-between gap-3"
                style={{
                  backgroundColor: `${theme.accentHex}18`,
                  borderColor: theme.accentHex,
                  color: theme.textPrimary
                }}
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6" style={{ color: theme.accentHex }} />
                  <div>
                    <h3 className="font-display font-bold text-sm uppercase">Game Over</h3>
                    <p className="text-xs">{playState.winReason || `Winner: ${playState.winner === 'w' ? 'White' : 'Black'}`}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleStartPlay}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  Play Again
                </button>
              </div>
            )}

            <div className="flex justify-center p-1">
              <div
                className="relative rounded-xl overflow-hidden shadow-2xl border-2 select-none"
                style={{
                  borderColor: theme.cardBorderHex,
                  width: '100%',
                  maxWidth: '520px',
                  aspectRatio: `${playState.config.boardWidth} / ${playState.config.boardHeight}`
                }}
              >
                <div
                  className="grid w-full h-full"
                  style={{
                    gridTemplateColumns: `repeat(${playState.config.boardWidth}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${playState.config.boardHeight}, minmax(0, 1fr))`
                  }}
                >
                  {playState.grid.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      const isDark = (rIdx + cIdx) % 2 === 1;
                      const squareColor = isDark ? boardTheme.darkHex : boardTheme.lightHex;
                      const isSelected = selectedSquare?.row === rIdx && selectedSquare?.col === cIdx;
                      const isLegalTarget = playLegalMoves.some(m => m.toRow === rIdx && m.toCol === cIdx);
                      const isCheck = playCheckSq?.row === rIdx && playCheckSq?.col === cIdx;
                      const isShielded = Boolean(
                        playState.shieldedPos && playState.shieldedPos.row === rIdx && playState.shieldedPos.col === cIdx
                      );
                      const hasDuck = (playState.duckPos?.row === rIdx && playState.duckPos?.col === cIdx) || cell?.type === 'd';
                      const sqLabel = coordsToSquare(rIdx, cIdx, playState.config.boardHeight);

                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          type="button"
                          onClick={() => handlePlaySquareClick(rIdx, cIdx)}
                          aria-label={`Play Square ${sqLabel}${cell ? `, ${cell.color === 'w' ? 'White' : 'Black'} ${cell.type}` : ', empty'}`}
                          style={{
                            backgroundColor: isSelected
                              ? boardTheme.selectedHex
                              : squareColor
                          }}
                          className={`relative flex items-center justify-center p-1 cursor-pointer transition hover:brightness-110 active:scale-95 ${
                            isCheck ? 'ring-3 ring-inset ring-rose-500' : isShielded ? 'ring-2 ring-inset ring-amber-400' : ''
                          }`}
                        >
                          {isLegalTarget && !cell && !hasDuck && (
                            <div className="w-3.5 h-3.5 rounded-full bg-black/25 ring-1 ring-white/30 z-20 pointer-events-none" />
                          )}
                          {isLegalTarget && cell && !hasDuck && (
                            <div className="absolute inset-1 rounded-full border-[3px] border-black/35 z-20 pointer-events-none" />
                          )}

                          {isShielded && (
                            <span className="absolute top-0.5 left-0.5 px-1 rounded bg-amber-500/90 text-slate-950 font-mono font-bold text-[8px] leading-tight z-30 pointer-events-none">
                              SHD
                            </span>
                          )}
                          {cell?.absorbed && cell.absorbed.length > 0 && (
                            <span className="absolute bottom-0.5 left-0.5 px-1 rounded bg-emerald-500/90 text-slate-950 font-mono font-bold text-[8px] leading-tight z-30 pointer-events-none">
                              +{cell.absorbed.length}
                            </span>
                          )}

                          {hasDuck && (
                            <div className="w-full h-full flex items-center justify-center z-20 pointer-events-none">
                              <ChessPieceIcon type="d" color="w" set={pieceSet} />
                            </div>
                          )}

                          {cell && !hasDuck && (
                            <div className="w-full h-full flex items-center justify-center z-10 pointer-events-none">
                              <ChessPieceIcon
                                type={cell.type}
                                color={cell.color}
                                set={pieceSet}
                              />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {isAIThinking && (
              <div className="text-center text-xs font-semibold" style={{ color: theme.accentHex }}>
                Engine evaluating candidate lines...
              </div>
            )}
          </div>

          <div
            className="lg:col-span-4 flex flex-col gap-4 p-5 rounded-xl border"
            style={{
              backgroundColor: theme.cardHex,
              borderColor: theme.cardBorderHex
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.cardBorderHex }}>
              <h3 className="font-display text-sm font-bold tracking-tight" style={{ color: theme.textPrimary }}>
                Move History & Eval
              </h3>
              <span
                className="text-xs font-mono font-bold tabular-nums"
                style={{
                  color: currentEval >= 0 ? theme.accentHex : '#ef4444'
                }}
              >
                {currentEval > 0 ? `+${(currentEval / 100).toFixed(1)}` : (currentEval / 100).toFixed(1)}
              </span>
            </div>

            <div
              className="max-h-64 overflow-y-auto flex flex-col gap-1 p-2 rounded-lg border font-mono text-xs tabular-nums"
              style={{
                backgroundColor: theme.cardSecondaryHex,
                borderColor: theme.cardBorderHex
              }}
            >
              {playState.history.length === 0 ? (
                <div className="p-4 text-center" style={{ color: theme.textMutedHex }}>
                  Select a piece to make the opening move.
                </div>
              ) : (
                playState.history.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2 py-1 rounded"
                    style={{ backgroundColor: idx % 2 === 1 ? theme.surfaceHoverHex : 'transparent' }}
                  >
                    <span style={{ color: theme.textMutedHex }}>
                      {Math.floor(idx / 2) + 1}.{idx % 2 === 0 ? '' : '..'}
                    </span>
                    <span className="font-bold" style={{ color: m.piece.color === 'w' ? theme.textPrimary : theme.accentHex }}>
                      {m.san}
                    </span>
                    <span className="text-[10px]" style={{ color: theme.textMutedHex }}>
                      {coordsToSquare(m.fromRow, m.fromCol, playState.config.boardHeight)} → {coordsToSquare(m.toRow, m.toCol, playState.config.boardHeight)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className="w-full py-2 rounded-lg border text-xs font-bold transition hover:opacity-80"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                Back to Board & Rules Editor
              </button>
              {onPlayInMainArena && (
                <button
                  type="button"
                  onClick={() => onPlayInMainArena(currentVariant)}
                  className="w-full py-2 rounded-lg text-xs font-bold transition hover:opacity-90"
                  style={{
                    backgroundColor: theme.accentHex,
                    color: theme.accentTextHex
                  }}
                >
                  Open in Main Timed Arena
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAVED PRESET LIBRARY */}
      {activeTab === 'library' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedVariants.map(variant => (
            <div
              key={variant.id}
              className="p-5 rounded-xl border flex flex-col justify-between gap-4"
              style={{
                backgroundColor: theme.cardHex,
                borderColor: theme.cardBorderHex
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-display font-bold text-base" style={{ color: theme.textPrimary }}>
                      {variant.name}
                    </h3>
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: theme.accentHex }}>
                      {variant.boardWidth}×{variant.boardHeight} Grid
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSaved(variant.id)}
                    aria-label={`Delete ${variant.name}`}
                    className="p-1.5 rounded-lg hover:opacity-80 text-rose-500"
                    title="Delete saved variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: theme.textSecondary }}>
                  {variant.description}
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                  {variant.customPiecesUsed.map(pt => (
                    <div
                      key={pt}
                      className="w-6 h-6 p-0.5 rounded border"
                      style={{
                        backgroundColor: theme.cardSecondaryHex,
                        borderColor: theme.cardBorderHex
                      }}
                      title={ALL_CUSTOM_PIECE_DEFS.find(p => p.type === pt)?.name || pt}
                    >
                      <ChessPieceIcon type={pt} color="w" set={pieceSet} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: theme.cardBorderHex }}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentVariant(variant);
                    handleStartPlay();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Play</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentVariant(variant);
                    setActiveTab('editor');
                  }}
                  className="px-3.5 py-2 rounded-lg border text-xs font-semibold transition hover:opacity-80"
                  style={{
                    backgroundColor: theme.cardSecondaryHex,
                    borderColor: theme.cardBorderHex,
                    color: theme.textPrimary
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
