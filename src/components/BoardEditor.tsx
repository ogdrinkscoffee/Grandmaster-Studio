import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, Pencil, Plus, RotateCcw, Save, Trash2, Wand2 } from 'lucide-react';
import { CustomBoardId, CustomBoardRecipe, PieceColor, PieceType, UserSettings } from '../types/chess';
import {
  ALL_15_BOARD_THEMES,
  ALL_15_PIECE_SETS,
  BoardThemeConfig,
  ORNAMENT_OPTIONS,
  PLATING_PRESETS,
  SIGNATURE_BOARDS,
  TEXTURE_PRESETS,
  buildCustomBoard,
  getBoardTheme,
  recipeFromBoard,
  resolveBoardTheme
} from '../theme/themes';
import { BoardFrame } from './BoardFrame';
import { ChessPieceIcon } from './ChessPieces';
import { useAppTheme } from '../context/ThemeContext';

/* ------------------------------------------------------------------ */
/*  Shared swatch                                                      */
/* ------------------------------------------------------------------ */

/** Mini board preview: frame plating around a 4x2 strip of squares. */
export const BoardSwatch: React.FC<{ board: BoardThemeConfig }> = ({ board }) => {
  const cells = [true, false, true, false, false, true, false, true];
  const framed = Boolean(board.frame);
  return (
    <div
      className="w-full h-9 rounded-lg overflow-hidden shadow-inner"
      style={{
        padding: framed ? 3 : 0,
        background: board.frame?.plating,
        boxShadow: framed ? `inset 0 0 0 1px ${board.frame!.rim}` : undefined
      }}
    >
      <div
        className="w-full h-full grid grid-cols-4 grid-rows-2 rounded-[3px] overflow-hidden"
        style={{ boxShadow: framed ? `0 0 0 1px ${board.frame!.innerLine}` : undefined }}
      >
        {cells.map((dark, i) => (
          <div
            key={i}
            style={{
              backgroundColor: dark ? board.darkHex : board.lightHex,
              backgroundImage: dark ? board.squareTexture?.dark : board.squareTexture?.light
            }}
          />
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Live preview board                                                 */
/* ------------------------------------------------------------------ */

const PREVIEW_POSITION: Array<Array<[PieceType, PieceColor] | null>> = [
  [['r', 'b'], ['n', 'b'], ['b', 'b'], ['q', 'b'], ['k', 'b'], ['b', 'b'], ['n', 'b'], ['r', 'b']],
  [['p', 'b'], ['p', 'b'], ['p', 'b'], ['p', 'b'], null, ['p', 'b'], ['p', 'b'], ['p', 'b']],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, ['p', 'b'], null, null, null],
  [null, null, null, null, ['p', 'w'], null, null, null],
  [null, null, null, null, null, null, null, null],
  [['p', 'w'], ['p', 'w'], ['p', 'w'], ['p', 'w'], null, ['p', 'w'], ['p', 'w'], ['p', 'w']],
  [['r', 'w'], ['n', 'w'], ['b', 'w'], ['q', 'w'], ['k', 'w'], ['b', 'w'], ['n', 'w'], ['r', 'w']]
];

const BoardPreview: React.FC<{ board: BoardThemeConfig; settings: UserSettings }> = ({ board, settings }) => (
  <BoardFrame frame={board.frame} still={settings.batterySaver}>
    <div
      className={`grid grid-cols-8 grid-rows-8 aspect-square w-full overflow-hidden ${board.frame ? 'rounded-[3px]' : 'rounded-lg'}`}
      style={{ backgroundColor: board.darkHex }}
    >
      {PREVIEW_POSITION.map((row, r) =>
        row.map((piece, c) => {
          const isDark = (r + c) % 2 === 1;
          const isLast = (r === 3 && c === 4) || (r === 1 && c === 4);
          const isSelected = r === 7 && c === 6;
          const bg = isSelected ? board.selectedHex : isLast ? board.lastMoveHex : isDark ? board.darkHex : board.lightHex;
          return (
            <div
              key={`${r}-${c}`}
              className="relative flex items-center justify-center p-[6%]"
              style={{
                backgroundColor: bg,
                backgroundImage: isSelected || isLast ? undefined : isDark ? board.squareTexture?.dark : board.squareTexture?.light
              }}
            >
              {c === 0 && (
                <span className="absolute top-0 left-0.5 text-[7px] font-mono font-bold opacity-80" style={{ color: isDark ? board.coordDark : board.coordLight }}>
                  {8 - r}
                </span>
              )}
              {piece && <ChessPieceIcon type={piece[0]} color={piece[1]} set={settings.pieceSet} kingFinial={settings.kingFinial} />}
            </div>
          );
        })
      )}
    </div>
  </BoardFrame>
);

/* ------------------------------------------------------------------ */
/*  Editor                                                             */
/* ------------------------------------------------------------------ */

/* Field helpers live outside the editor so inputs keep focus between renders. */
const ColorField: React.FC<{ label: string; value: string; onChange: (v: string) => void; disabled?: boolean }> = ({
  label,
  value,
  onChange,
  disabled
}) => {
  const { theme } = useAppTheme();
  return (
  <label className="flex items-center gap-2 text-[11px] font-semibold" style={{ color: theme.textSecondary, opacity: disabled ? 0.45 : 1 }}>
    <input
      type="color"
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      className="w-7 h-7 rounded-md cursor-pointer border-0 p-0 bg-transparent shrink-0"
      aria-label={label}
    />
    <span className="flex flex-col leading-tight min-w-0">
      <span className="truncate">{label}</span>
      <span className="font-mono text-[10px]" style={{ color: theme.textMutedHex }}>{value}</span>
    </span>
  </label>
);
};

const Toggle: React.FC<{ label: string; on: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({ label, on, onChange, disabled }) => {
  const { theme } = useAppTheme();
  return (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    disabled={disabled}
    onClick={() => onChange(!on)}
    className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold"
    style={{ backgroundColor: theme.cardSecondaryHex, border: `1px solid ${theme.cardBorderHex}`, color: theme.textSecondary, opacity: disabled ? 0.45 : 1 }}
  >
    <span>{label}</span>
    <span className="relative w-7 h-4 rounded-full shrink-0" style={{ backgroundColor: on ? theme.accentHex : theme.cardBorderHex }}>
      <span className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-150" style={{ transform: on ? 'translateX(12px)' : 'translateX(0px)' }} />
    </span>
  </button>
);
};

const Slider: React.FC<{ label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (v: number) => void; disabled?: boolean }> = ({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
  disabled
}) => {
  const { theme } = useAppTheme();
  return (
  <label className="flex flex-col gap-1 text-[11px] font-semibold" style={{ color: theme.textSecondary, opacity: disabled ? 0.45 : 1 }}>
    <span className="flex justify-between">
      <span>{label}</span>
      <span className="font-mono" style={{ color: theme.textMutedHex }}>{value}{suffix}</span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={e => onChange(Number(e.target.value))}
      style={{ accentColor: theme.accentHex }}
    />
  </label>
);
};

interface BoardEditorProps {
  settings: UserSettings;
  onUpdate: (patch: Partial<UserSettings>) => void;
  onBack: () => void;
}

const newCustomId = (): CustomBoardId => `custom_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const BoardEditor: React.FC<BoardEditorProps> = ({ settings, onUpdate, onBack }) => {
  const { theme } = useAppTheme();
  const customBoards = settings.customBoards || [];
  const activeBoard = resolveBoardTheme(settings);
  const matchBoard = settings.matchBoardToPieces !== false;

  const [draft, setDraft] = useState<CustomBoardRecipe>(() => {
    const existing = customBoards.find(c => c.id === activeBoard.id);
    if (existing) return { ...existing };
    return recipeFromBoard(activeBoard, newCustomId(), `${activeBoard.name} Remix`);
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<CustomBoardId | null>(null);
  const isSaved = customBoards.some(c => c.id === draft.id);
  const previewBoard = useMemo(() => buildCustomBoard(draft), [draft]);
  const hasFrame = draft.plating !== 'none';
  const hasOrnaments = hasFrame && draft.ornament !== 'none';

  const set = <K extends keyof CustomBoardRecipe>(key: K, value: CustomBoardRecipe[K]) =>
    setDraft(prev => ({ ...prev, [key]: value }));

  const loadFrom = (board: BoardThemeConfig) => {
    const recipe = recipeFromBoard(board, draft.id, board.id.startsWith('custom_') ? board.name : `${board.name} Remix`);
    setDraft(isSaved ? { ...recipe, id: newCustomId() } : recipe);
  };

  const applyBoard = (id: UserSettings['boardTheme']) => onUpdate({ boardTheme: id, matchBoardToPieces: false });

  const saveDraft = (asNew: boolean) => {
    const recipe: CustomBoardRecipe = { ...draft, id: asNew ? newCustomId() : draft.id, name: draft.name.trim() || 'Custom board' };
    const exists = customBoards.some(c => c.id === recipe.id);
    const next = exists ? customBoards.map(c => (c.id === recipe.id ? recipe : c)) : [...customBoards, recipe];
    setDraft(recipe);
    onUpdate({ customBoards: next, boardTheme: recipe.id, matchBoardToPieces: false });
  };

  const deleteBoard = (id: CustomBoardId) => {
    const target = customBoards.find(c => c.id === id);
    if (!target) return;
    const next = customBoards.filter(c => c.id !== id);
    const patch: Partial<UserSettings> = { customBoards: next };
    if (settings.boardTheme === id) {
      patch.boardTheme = `sig_${settings.pieceSet}`;
      patch.matchBoardToPieces = true;
    }
    onUpdate(patch);
    if (draft.id === id) setDraft(prev => ({ ...prev, id: newCustomId() }));
    setConfirmDeleteId(null);
  };

  /* --- small styled building blocks --- */
  const sectionLabel = (text: string, right?: React.ReactNode) => (
    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: theme.textMutedHex }}>
      <span>{text}</span>
      {right}
    </div>
  );

  const card = (selected: boolean): React.CSSProperties => ({
    backgroundColor: selected ? `${theme.accentHex}20` : theme.cardSecondaryHex,
    border: `2px solid ${selected ? theme.accentHex : theme.cardBorderHex}`,
    color: theme.textPrimary
  });

  const chip = (selected: boolean, disabled = false): React.CSSProperties => ({
    backgroundColor: selected ? theme.accentHex : theme.cardSecondaryHex,
    color: selected ? theme.accentTextHex : theme.textSecondary,
    border: `1px solid ${selected ? theme.accentHex : theme.cardBorderHex}`,
    opacity: disabled ? 0.45 : 1
  });

  const group = (title: string, children: React.ReactNode, note?: string) => (
    <div className="rounded-xl p-3 space-y-2.5" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: theme.textPrimary }}>{title}</span>
        {note && <span className="text-[10px]" style={{ color: theme.textMutedHex }}>{note}</span>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg transition hover:opacity-80"
          style={{ backgroundColor: theme.cardSecondaryHex, border: `1px solid ${theme.cardBorderHex}`, color: theme.textSecondary }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Signature boards
        </button>
        <span className="font-display font-bold text-sm flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
          <Wand2 className="w-4 h-4" style={{ color: theme.accentHex }} />
          Board Editor
        </span>
      </div>

      {/* Pairing + piece styles */}
      <div>
        <button
          type="button"
          role="switch"
          aria-checked={matchBoard}
          onClick={() => onUpdate({ matchBoardToPieces: !matchBoard })}
          className="w-full mb-3 px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition"
          style={{
            backgroundColor: theme.cardSecondaryHex,
            border: `1px solid ${matchBoard ? theme.accentHex : theme.cardBorderHex}`
          }}
        >
          <span className="flex flex-col">
            <span className="text-xs font-bold" style={{ color: theme.textPrimary }}>
              Match board to piece style
            </span>
            <span className="text-[11px]" style={{ color: theme.textMutedHex }}>
              {matchBoard
                ? 'On: picking a piece style also switches to its signature board'
                : 'Off: pieces and board are chosen independently'}
            </span>
          </span>
          <span
            className="relative w-10 h-6 rounded-full shrink-0"
            style={{ backgroundColor: matchBoard ? theme.accentHex : theme.cardBorderHex }}
          >
            <span
              className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-150"
              style={{ transform: matchBoard ? 'translateX(16px)' : 'translateX(0px)' }}
            />
          </span>
        </button>

        {sectionLabel(
          'Piece styles · 15',
          <span className="normal-case tracking-normal font-semibold" style={{ color: theme.accentHex }}>
            {ALL_15_PIECE_SETS.find(p => p.id === settings.pieceSet)?.name}
          </span>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {ALL_15_PIECE_SETS.map(piece => {
            const isSelected = settings.pieceSet === piece.id;
            const sig = SIGNATURE_BOARDS.find(b => b.pieceSet === piece.id);
            return (
              <button
                key={piece.id}
                type="button"
                title={piece.tagline}
                onClick={() => onUpdate({ pieceSet: piece.id })}
                className="p-2 rounded-xl flex flex-col gap-1.5 text-left transition"
                style={card(isSelected)}
              >
                <div
                  className="w-full h-10 rounded-lg flex items-center justify-around px-1.5"
                  style={{
                    backgroundColor: sig ? sig.lightHex : '#ebecd0',
                    backgroundImage: sig ? `linear-gradient(90deg, transparent 50%, ${sig.darkHex} 50%)` : undefined,
                    border: `1px solid ${theme.cardBorderHex}`
                  }}
                >
                  <div className="w-6 h-6">
                    <ChessPieceIcon type="k" color="w" set={piece.id} kingFinial={settings.kingFinial || 'crescent'} />
                  </div>
                  <div className="w-6 h-6">
                    <ChessPieceIcon type="q" color="b" set={piece.id} kingFinial={settings.kingFinial || 'crescent'} />
                  </div>
                  <div className="w-6 h-6">
                    <ChessPieceIcon type="n" color="w" set={piece.id} kingFinial={settings.kingFinial || 'crescent'} />
                  </div>
                </div>
                <span className="flex items-center justify-between gap-1">
                  <span className="font-bold text-[11px] truncate">{piece.name}</span>
                  {isSelected && <Check className="w-3 h-3 shrink-0" style={{ color: theme.accentHex }} />}
                </span>
                <span className="text-[9px] truncate" style={{ color: theme.textMutedHex }}>{piece.tagline}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Classic boards */}
      <div>
        {sectionLabel('Classic boards · 15')}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {ALL_15_BOARD_THEMES.map(board => {
            const isSelected = activeBoard.id === board.id;
            return (
              <button key={board.id} type="button" onClick={() => applyBoard(board.id)} className="p-2 rounded-xl flex flex-col gap-1.5 text-left transition" style={card(isSelected)}>
                <BoardSwatch board={board} />
                <span className="flex items-center justify-between gap-1">
                  <span className="font-bold text-[11px] truncate">{board.name}</span>
                  {isSelected && <Check className="w-3 h-3 shrink-0" style={{ color: theme.accentHex }} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* My boards */}
      <div>
        {sectionLabel(`My boards · ${customBoards.length}`)}
        {customBoards.length === 0 ? (
          <div className="rounded-xl px-3 py-3 text-xs" style={{ backgroundColor: theme.cardSecondaryHex, border: `1px dashed ${theme.cardBorderHex}`, color: theme.textMutedHex }}>
            No custom boards yet. Build one below and save it.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {customBoards.map(recipe => {
              const board = buildCustomBoard(recipe);
              const isSelected = activeBoard.id === recipe.id;
              const isConfirmingDelete = confirmDeleteId === recipe.id;
              return (
                <div key={recipe.id} className="p-2 rounded-xl flex flex-col gap-1.5" style={card(isSelected)}>
                  <button type="button" onClick={() => applyBoard(recipe.id)} className="flex flex-col gap-1.5 text-left" title="Use this board">
                    <BoardSwatch board={board} />
                    <span className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[11px] truncate">{recipe.name}</span>
                      {isSelected && <Check className="w-3 h-3 shrink-0" style={{ color: theme.accentHex }} />}
                    </span>
                  </button>
                  {isConfirmingDelete ? (
                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => deleteBoard(recipe.id)}
                        className="flex-1 flex items-center justify-center text-[10px] font-bold py-1 rounded-md bg-rose-600 text-white hover:bg-rose-500 transition"
                        aria-label={`Confirm delete ${recipe.name}`}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="flex-1 flex items-center justify-center text-[10px] font-bold py-1 rounded-md"
                        style={chip(false)}
                        aria-label={`Cancel delete ${recipe.name}`}
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDraft({ ...recipe })}
                        className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1 rounded-md"
                        style={chip(draft.id === recipe.id)}
                        aria-label={`Edit ${recipe.name}`}
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(recipe.id)}
                        className="flex items-center justify-center px-1.5 py-1 rounded-md"
                        style={{ ...chip(false), color: '#f43f5e' }}
                        aria-label={`Delete ${recipe.name}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Builder */}
      <div>
        {sectionLabel(
          isSaved ? `Editing · ${draft.name}` : 'Create your own board',
          <button
            type="button"
            onClick={() => setDraft(recipeFromBoard(activeBoard, newCustomId(), `${activeBoard.name} Remix`))}
            className="flex items-center gap-1 normal-case tracking-normal font-semibold hover:opacity-80"
            style={{ color: theme.accentHex }}
          >
            <Plus className="w-3 h-3" /> New from current board
          </button>
        )}

        <div className="grid md:grid-cols-[1fr_250px] gap-3 items-start">
          {/* Controls */}
          <div className="space-y-3 order-2 md:order-1">
            {group(
              'Theme',
              <div className="grid sm:grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 text-[11px] font-semibold" style={{ color: theme.textSecondary }}>
                  Name
                  <input
                    value={draft.name}
                    maxLength={32}
                    onChange={e => set('name', e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold focus:outline-none"
                    style={{ backgroundColor: theme.cardSecondaryHex, border: `1px solid ${theme.cardBorderHex}`, color: theme.textPrimary }}
                  />
                </label>
                <label className="flex flex-col gap-1 text-[11px] font-semibold" style={{ color: theme.textSecondary }}>
                  Start from a theme
                  <select
                    value=""
                    onChange={e => {
                      if (e.target.value) loadFrom(getBoardTheme(e.target.value as UserSettings['boardTheme'], customBoards));
                    }}
                    className="px-2 py-1.5 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
                    style={{ backgroundColor: theme.cardSecondaryHex, border: `1px solid ${theme.cardBorderHex}`, color: theme.textPrimary }}
                  >
                    <option value="">Pick a board to remix…</option>
                    <optgroup label="Signature">
                      {SIGNATURE_BOARDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </optgroup>
                    <optgroup label="Classic">
                      {ALL_15_BOARD_THEMES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </optgroup>
                    {customBoards.length > 0 && (
                      <optgroup label="My boards">
                        {customBoards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </optgroup>
                    )}
                  </select>
                </label>
              </div>
            )}

            {group(
              'Squares',
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <ColorField label="Light" value={draft.lightHex} onChange={v => set('lightHex', v)} />
                  <ColorField label="Dark" value={draft.darkHex} onChange={v => set('darkHex', v)} />
                  <ColorField label="Selected" value={draft.selectedHex} onChange={v => set('selectedHex', v)} />
                  <ColorField label="Last move" value={draft.lastMoveHex} onChange={v => set('lastMoveHex', v)} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TEXTURE_PRESETS.map(t => (
                    <button key={t.id} type="button" onClick={() => set('texture', t.id)} className="px-2 py-1 rounded-md text-[10px] font-bold" style={chip(draft.texture === t.id)}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {group(
              'Plating',
              <>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[
                    { id: 'none', name: 'No frame', plating: 'transparent' },
                    { id: 'custom', name: 'Custom', plating: `linear-gradient(135deg, ${draft.plateA}, ${draft.plateB}, ${draft.plateA})` },
                    ...PLATING_PRESETS
                  ].map(p => {
                    const selected = draft.plating === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        title={p.name}
                        onClick={() => {
                          const preset = PLATING_PRESETS.find(x => x.id === p.id);
                          setDraft(prev => ({
                            ...prev,
                            plating: p.id,
                            ...(preset ? { rim: preset.rim.startsWith('#') ? preset.rim : prev.rim, innerLine: preset.innerLine.startsWith('#') ? preset.innerLine : prev.innerLine } : {})
                          }));
                        }}
                        className="flex flex-col items-center gap-1 p-1 rounded-lg text-[9px] font-bold"
                        style={card(selected)}
                      >
                        <span
                          className="w-full h-5 rounded"
                          style={{
                            background: p.plating,
                            border: p.id === 'none' ? `1px dashed ${theme.cardBorderHex}` : undefined
                          }}
                        />
                        <span className="truncate w-full text-center">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {draft.plating === 'custom' && (
                    <>
                      <ColorField label="Plate A" value={draft.plateA} onChange={v => set('plateA', v)} />
                      <ColorField label="Plate B" value={draft.plateB} onChange={v => set('plateB', v)} />
                    </>
                  )}
                  <ColorField label="Rim" value={draft.rim} onChange={v => set('rim', v)} disabled={!hasFrame} />
                  <ColorField label="Inner line" value={draft.innerLine} onChange={v => set('innerLine', v)} disabled={!hasFrame} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Slider label="Frame width" value={draft.thickness} min={3} max={8} step={0.2} suffix="%" onChange={v => set('thickness', v)} disabled={!hasFrame} />
                  <Slider label="Corner radius" value={draft.radius} min={0} max={24} step={1} suffix="px" onChange={v => set('radius', v)} disabled={!hasFrame} />
                </div>
              </>,
              hasFrame ? undefined : 'Pick a plating to add a frame'
            )}

            {group(
              'Objects',
              <>
                <div className="flex flex-wrap gap-1.5">
                  {ORNAMENT_OPTIONS.map(o => (
                    <button
                      key={o.id}
                      type="button"
                      disabled={!hasFrame}
                      onClick={() => set('ornament', o.id)}
                      className="px-2 py-1 rounded-md text-[10px] font-bold"
                      style={chip(draft.ornament === o.id, !hasFrame)}
                    >
                      {o.name}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <ColorField label="Primary" value={draft.primary} onChange={v => set('primary', v)} disabled={!hasOrnaments} />
                  <ColorField label="Secondary" value={draft.secondary} onChange={v => set('secondary', v)} disabled={!hasOrnaments} />
                  <ColorField label="Accent" value={draft.accent} onChange={v => set('accent', v)} disabled={!hasOrnaments} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <Toggle label="Corners" on={draft.showCorners} onChange={v => set('showCorners', v)} disabled={!hasOrnaments} />
                  <Toggle label="Top & bottom" on={draft.showEdges} onChange={v => set('showEdges', v)} disabled={!hasOrnaments} />
                  <Toggle label="Sides" on={draft.showSides} onChange={v => set('showSides', v)} disabled={!hasOrnaments} />
                  <Toggle label="Studs" on={draft.showStuds} onChange={v => set('showStuds', v)} disabled={!hasOrnaments} />
                </div>
              </>
            )}

            {group(
              'Add-ons',
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 items-center">
                  <Toggle label="Outer glow" on={draft.glow} onChange={v => set('glow', v)} disabled={!hasFrame} />
                  <ColorField label="Glow colour" value={draft.glowColor} onChange={v => set('glowColor', v)} disabled={!hasFrame || !draft.glow} />
                  <Toggle label="Filigree line" on={draft.bandLine} onChange={v => set('bandLine', v)} disabled={!hasFrame} />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold mr-1" style={{ color: theme.textSecondary }}>Animation</span>
                  {(['none', 'pulse', 'twinkle', 'shimmer', 'flicker'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      disabled={!hasFrame}
                      onClick={() => set('motion', m)}
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold capitalize"
                      style={chip(draft.motion === m, !hasFrame)}
                    >
                      {m === 'none' ? 'Still' : m}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Live preview */}
          <div className="order-1 md:order-2 md:sticky md:top-0 space-y-2">
            <div className="rounded-xl p-2.5" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
              <BoardPreview board={previewBoard} settings={settings} />
            </div>
            <button
              type="button"
              onClick={() => saveDraft(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition hover:opacity-90"
              style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? 'Update & use board' : 'Save & use board'}
            </button>
            <div className="flex gap-1.5">
              {isSaved && (
                <button
                  type="button"
                  onClick={() => saveDraft(true)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold"
                  style={chip(false)}
                >
                  <Plus className="w-3 h-3" /> Save as new
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const saved = customBoards.find(c => c.id === draft.id);
                  setDraft(saved ? { ...saved } : recipeFromBoard(activeBoard, draft.id, `${activeBoard.name} Remix`));
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold"
                style={chip(false)}
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
