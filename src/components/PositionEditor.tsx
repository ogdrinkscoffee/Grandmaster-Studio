import React, { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Check,
  Copy,
  Eraser,
  Microscope,
  RotateCcw,
  Swords,
  Trash2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { resolveBoardTheme } from '../theme/themes';
import { ChessPieceIcon } from './ChessPieces';
import {
  EditablePiece,
  EditablePieceColor,
  EditablePieceType,
  EMPTY_GRID,
  fenToGridState,
  gridStateToFen,
  sanitizeCastlingForGrid,
  setSquarePieceInGrid,
  validateEditedPosition
} from '../engine/fenEditor';

interface PositionEditorProps {
  onAnalyzeFen: (fen: string) => void;
  onPlayFromFen?: (fen: string) => void;
}

const STANDARD_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const KINGS_ONLY_FEN = '4k3/8/8/8/8/8/8/4K3 w - - 0 1';
const LUCENA_FEN = '1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1';
const QUEEN_MATE_FEN = '4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1';

const WHITE_PIECES: { type: EditablePieceType; label: string }[] = [
  { type: 'k', label: 'White King' },
  { type: 'q', label: 'White Queen' },
  { type: 'r', label: 'White Rook' },
  { type: 'b', label: 'White Bishop' },
  { type: 'n', label: 'White Knight' },
  { type: 'p', label: 'White Pawn' }
];

const BLACK_PIECES: { type: EditablePieceType; label: string }[] = [
  { type: 'k', label: 'Black King' },
  { type: 'q', label: 'Black Queen' },
  { type: 'r', label: 'Black Rook' },
  { type: 'b', label: 'Black Bishop' },
  { type: 'n', label: 'Black Knight' },
  { type: 'p', label: 'Black Pawn' }
];

type BrushSelection = EditablePiece | 'erase';

export const PositionEditor: React.FC<PositionEditorProps> = ({ onAnalyzeFen, onPlayFromFen }) => {
  const { theme, pieceSet, settings } = useAppTheme();
  const boardTheme = resolveBoardTheme(settings);

  const [state, setState] = useState(() => fenToGridState(STANDARD_FEN));
  const [brush, setBrush] = useState<BrushSelection>({ type: 'q', color: 'w' });
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedFen, setCopiedFen] = useState(false);
  const [fenDraft, setFenDraft] = useState(STANDARD_FEN);
  const [fenParseError, setFenParseError] = useState<string | null>(null);

  const currentFen = useMemo(() => gridStateToFen(state), [state]);
  const validation = useMemo(() => validateEditedPosition(currentFen), [currentFen]);

  const syncFromState = (nextState: typeof state) => {
    setState(nextState);
    setFenDraft(gridStateToFen(nextState));
    setFenParseError(null);
  };

  const applyPresetFen = (presetFen: string) => {
    const parsed = fenToGridState(presetFen);
    syncFromState(parsed);
  };

  const clearToEmpty = () => {
    const nextState = {
      grid: EMPTY_GRID(),
      turn: 'w' as EditablePieceColor,
      castling: { K: false, Q: false, k: false, q: false },
      halfmove: 0,
      fullmove: 1
    };
    syncFromState(nextState);
  };

  const handleSquareClick = (row: number, col: number) => {
    const existing = state.grid[row][col];
    let nextPiece: EditablePiece | null = null;
    if (brush !== 'erase') {
      const same = existing && existing.type === brush.type && existing.color === brush.color;
      nextPiece = same ? null : brush;
    }
    const nextGrid = setSquarePieceInGrid(state.grid, row, col, nextPiece);
    const nextCastling = sanitizeCastlingForGrid(nextGrid, state.castling);
    syncFromState({ ...state, grid: nextGrid, castling: nextCastling });
  };

  const handleApplyDraftFen = () => {
    const raw = fenDraft.trim();
    if (!raw || raw.split('/').length !== 8) {
      setFenParseError('Enter a valid 8-rank FEN string.');
      return;
    }
    setFenParseError(null);
    syncFromState(fenToGridState(raw));
  };

  const handleCopyFen = async () => {
    try {
      await navigator.clipboard.writeText(currentFen);
      setCopiedFen(true);
      window.setTimeout(() => setCopiedFen(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const rowsOrder = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const colsOrder = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const castlingPossible = sanitizeCastlingForGrid(state.grid, { K: true, Q: true, k: true, q: true });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left: Piece Palette + Interactive 8x8 Setup Board */}
      <div className="lg:col-span-7 flex flex-col items-center gap-3">
        {/* Top White Piece Palette */}
        <div
          className="w-full max-w-[540px] rounded-xl p-2 border flex items-center justify-between gap-1.5 flex-wrap"
          style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
        >
          <span className="text-[11px] font-bold px-2" style={{ color: theme.textMutedHex }}>
            White
          </span>
          <div className="flex items-center gap-1 flex-1 justify-center">
            {WHITE_PIECES.map(p => {
              const selected = brush !== 'erase' && brush.type === p.type && brush.color === 'w';
              return (
                <button
                  key={`w-${p.type}`}
                  type="button"
                  aria-label={p.label}
                  aria-pressed={selected}
                  onClick={() => setBrush({ type: p.type, color: 'w' })}
                  className="w-9 h-9 rounded-lg p-1 border transition cursor-pointer"
                  style={{
                    backgroundColor: selected ? `${theme.accentHex}28` : theme.cardSecondaryHex,
                    borderColor: selected ? theme.accentHex : theme.cardBorderHex
                  }}
                >
                  <ChessPieceIcon type={p.type} color="w" set={pieceSet} />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            aria-label="Erase square"
            aria-pressed={brush === 'erase'}
            onClick={() => setBrush('erase')}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-bold transition cursor-pointer"
            style={{
              backgroundColor: brush === 'erase' ? '#f43f5e24' : theme.cardSecondaryHex,
              borderColor: brush === 'erase' ? '#f43f5e' : theme.cardBorderHex,
              color: brush === 'erase' ? '#fb7185' : theme.textSecondary
            }}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Erase</span>
          </button>
        </div>

        {/* Interactive Board Grid */}
        <div
          className="w-full max-w-[540px] aspect-square rounded-xl overflow-hidden border grid grid-cols-8 grid-rows-8 shadow-xl select-none"
          style={{ borderColor: theme.cardBorderHex }}
          role="grid"
          aria-label="Position Setup Board"
        >
          {rowsOrder.map(r =>
            colsOrder.map(c => {
              const isDark = (r + c) % 2 === 1;
              const piece = state.grid[r][c];
              const sq = `${files[c]}${8 - r}`;
              const pieceLabel = piece ? `${piece.color === 'w' ? 'White' : 'Black'} ${piece.type.toUpperCase()}` : 'Empty';
              const showFileCoord = settings.showCoordinates !== 'hidden' && r === (isFlipped ? 0 : 7);
              const showRankCoord = settings.showCoordinates !== 'hidden' && c === (isFlipped ? 7 : 0);

              return (
                <button
                  key={sq}
                  type="button"
                  data-editor-square={sq}
                  aria-label={`Square ${sq}: ${pieceLabel}`}
                  onClick={() => handleSquareClick(r, c)}
                  className="relative flex items-center justify-center p-1 transition hover:brightness-110 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  style={{ backgroundColor: isDark ? boardTheme.darkHex : boardTheme.lightHex }}
                >
                  {showRankCoord && (
                    <span
                      className="absolute top-0.5 left-1 text-[9px] font-mono font-bold opacity-80 pointer-events-none"
                      style={{ color: isDark ? boardTheme.lightHex : boardTheme.darkHex }}
                    >
                      {8 - r}
                    </span>
                  )}
                  {showFileCoord && (
                    <span
                      className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold opacity-80 pointer-events-none"
                      style={{ color: isDark ? boardTheme.lightHex : boardTheme.darkHex }}
                    >
                      {files[c]}
                    </span>
                  )}
                  {piece && (
                    <div className="w-[84%] h-[84%] pointer-events-none">
                      <ChessPieceIcon type={piece.type} color={piece.color} set={pieceSet} />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Bottom Black Piece Palette */}
        <div
          className="w-full max-w-[540px] rounded-xl p-2 border flex items-center justify-between gap-1.5 flex-wrap"
          style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
        >
          <span className="text-[11px] font-bold px-2" style={{ color: theme.textMutedHex }}>
            Black
          </span>
          <div className="flex items-center gap-1 flex-1 justify-center">
            {BLACK_PIECES.map(p => {
              const selected = brush !== 'erase' && brush.type === p.type && brush.color === 'b';
              return (
                <button
                  key={`b-${p.type}`}
                  type="button"
                  aria-label={p.label}
                  aria-pressed={selected}
                  onClick={() => setBrush({ type: p.type, color: 'b' })}
                  className="w-9 h-9 rounded-lg p-1 border transition cursor-pointer"
                  style={{
                    backgroundColor: selected ? `${theme.accentHex}28` : theme.cardSecondaryHex,
                    borderColor: selected ? theme.accentHex : theme.cardBorderHex
                  }}
                >
                  <ChessPieceIcon type={p.type} color="b" set={pieceSet} />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setIsFlipped(f => !f)}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-bold transition hover:opacity-85 cursor-pointer"
            style={{
              backgroundColor: theme.cardSecondaryHex,
              borderColor: theme.cardBorderHex,
              color: theme.textSecondary
            }}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Flip</span>
          </button>
        </div>
      </div>

      {/* Right: Lichess / Chess.com Setup Controls */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Quick Templates */}
        <div className="rounded-xl p-4 border flex flex-col gap-3" style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
            Board Setup Presets
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => applyPresetFen(STANDARD_FEN)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition hover:opacity-85 cursor-pointer"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
            >
              <RotateCcw className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
              Starting Position
            </button>
            <button
              type="button"
              onClick={clearToEmpty}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition hover:opacity-85 cursor-pointer"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textSecondary }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Board
            </button>
            <button
              type="button"
              onClick={() => applyPresetFen(KINGS_ONLY_FEN)}
              className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition hover:opacity-85 cursor-pointer"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textSecondary }}
            >
              Kings Only
            </button>
            <button
              type="button"
              onClick={() => applyPresetFen(LUCENA_FEN)}
              className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition hover:opacity-85 cursor-pointer"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textSecondary }}
            >
              Lucena Setup
            </button>
            <button
              type="button"
              onClick={() => applyPresetFen(QUEEN_MATE_FEN)}
              className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition hover:opacity-85 cursor-pointer"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textSecondary }}
            >
              K+Q vs K
            </button>
          </div>
        </div>

        {/* Turn & Castling Rights */}
        <div className="rounded-xl p-4 border flex flex-col gap-3.5" style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: theme.textSecondary }}>
              Side to Move
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg" style={{ backgroundColor: theme.cardSecondaryHex }}>
              {([
                { id: 'w' as const, label: 'White to move' },
                { id: 'b' as const, label: 'Black to move' }
              ]).map(t => {
                const active = state.turn === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => syncFromState({ ...state, turn: t.id })}
                    className="py-1.5 px-2.5 rounded-md text-xs font-bold transition cursor-pointer"
                    style={
                      active
                        ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                        : { color: theme.textSecondary }
                    }
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: theme.textSecondary }}>
              Castling Availability
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {([
                { key: 'K' as const, label: 'White O-O (Kingside)' },
                { key: 'Q' as const, label: 'White O-O-O (Queenside)' },
                { key: 'k' as const, label: 'Black O-O (Kingside)' },
                { key: 'q' as const, label: 'Black O-O-O (Queenside)' }
              ]).map(opt => {
                const allowed = castlingPossible[opt.key];
                const checked = allowed && state.castling[opt.key];
                return (
                  <label
                    key={opt.key}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border ${
                      allowed ? 'cursor-pointer' : 'opacity-45 cursor-not-allowed'
                    }`}
                    style={{
                      backgroundColor: theme.cardSecondaryHex,
                      borderColor: theme.cardBorderHex,
                      color: theme.textPrimary
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!allowed}
                      onChange={e =>
                        syncFromState({
                          ...state,
                          castling: { ...state.castling, [opt.key]: e.target.checked }
                        })
                      }
                      className="accent-current w-3.5 h-3.5"
                      style={{ color: theme.accentHex }}
                    />
                    <span className="truncate font-medium">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live FEN & Launch */}
        <div className="rounded-xl p-4 border flex flex-col gap-3" style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
              FEN String
            </span>
            <button
              type="button"
              onClick={handleCopyFen}
              className="inline-flex items-center gap-1 text-[11px] font-bold hover:opacity-80 cursor-pointer"
              style={{ color: theme.accentHex }}
            >
              {copiedFen ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFen ? 'Copied' : 'Copy FEN'}</span>
            </button>
          </div>

          <div className="flex gap-1.5">
            <input
              type="text"
              value={fenDraft}
              onChange={e => setFenDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleApplyDraftFen();
              }}
              aria-label="Editable position FEN"
              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono focus:outline-none"
              style={{
                backgroundColor: theme.cardSecondaryHex,
                borderColor: fenParseError ? '#f43f5e' : theme.cardBorderHex,
                color: theme.textPrimary
              }}
            />
            <button
              type="button"
              onClick={handleApplyDraftFen}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold transition hover:opacity-85 cursor-pointer"
              style={{
                backgroundColor: theme.cardSecondaryHex,
                borderColor: theme.cardBorderHex,
                color: theme.textPrimary
              }}
            >
              Apply
            </button>
          </div>

          {fenParseError && (
            <p className="text-[11px] font-semibold text-rose-400" role="alert">
              {fenParseError}
            </p>
          )}

          {validation.valid ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Legal playable position ready for Stockfish &amp; Play Arena.</span>
            </div>
          ) : (
            <div className="rounded-lg p-2.5 border text-xs flex flex-col gap-1" style={{ backgroundColor: '#f43f5e14', borderColor: '#f43f5e44', color: '#fda4af' }}>
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Position incomplete:</span>
              </div>
              {validation.errors.map(err => (
                <div key={err} className="pl-5 text-[11px]">
                  {err}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              disabled={!validation.valid}
              onClick={() => onAnalyzeFen(currentFen)}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition hover:opacity-90 disabled:opacity-40 cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
            >
              <Microscope className="w-4 h-4 shrink-0" />
              <span>Analyze Position</span>
            </button>

            {onPlayFromFen && (
              <button
                type="button"
                disabled={!validation.valid}
                onClick={() => onPlayFromFen(currentFen)}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border font-bold text-xs transition hover:opacity-85 disabled:opacity-40 cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                <Swords className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
                <span>Play vs Engine</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
