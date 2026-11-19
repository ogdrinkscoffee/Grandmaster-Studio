import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FileUp, Upload, X, Loader2 } from 'lucide-react';
import { GameHistoryItem, PieceColor } from '../types/chess';
import { useAppTheme } from '../context/ThemeContext';
import { ChessPieceIcon } from './ChessPieces';
import { parsePgn, guessPlayerColor, buildImportedGame } from '../engine/pgnImport';
import { engineAnalyzeCompletedGame } from '../engine/engineClient';
import { calculateAccuracyFromMoves } from '../engine/chessEngine';
import { detectOpening } from '../engine/openings';

interface ImportPgnModalProps {
  isOpen: boolean;
  username: string;
  onClose: () => void;
  onImported: (game: GameHistoryItem) => void;
}

const EXAMPLE_PLACEHOLDER = `[White "You"]
[Black "Opponent"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 ...`;

export const ImportPgnModal: React.FC<ImportPgnModalProps> = ({ isOpen, username, onClose, onImported }) => {
  const { theme, pieceSet } = useAppTheme();
  const [text, setText] = useState('');
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [colorTouched, setColorTouched] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setText('');
    setPlayerColor('w');
    setColorTouched(false);
    setIsAnalyzing(false);
    setAnalyzeError(null);
    const id = window.setTimeout(() => textareaRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  const parsed = useMemo(() => (text.trim() ? parsePgn(text) : null), [text]);
  const game = parsed?.ok ? parsed.game : null;
  const opening = useMemo(() => (game ? detectOpening(game.moves.map(m => m.san)) : null), [game]);

  // Pre-select the user's side when their username appears in the PGN
  useEffect(() => {
    if (game && !colorTouched) setPlayerColor(guessPlayerColor(game, username));
  }, [game, colorTouched, username]);

  if (!isOpen) return null;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setText(await file.text());
  };

  const handleImport = async () => {
    if (!game || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalyzeError(null);
    try {
      const analyzed = await engineAnalyzeCompletedGame(game.moves);
      const imported = buildImportedGame(game, playerColor, analyzed, {
        white: calculateAccuracyFromMoves(analyzed, 'w'),
        black: calculateAccuracyFromMoves(analyzed, 'b')
      });
      onImported(imported);
    } catch {
      setAnalyzeError('The engine couldn’t analyze this game. Try again.');
      setIsAnalyzing(false);
    }
  };

  const sideButton = (color: PieceColor, label: string) => {
    const active = playerColor === color;
    return (
      <button
        type="button"
        role="radio"
        aria-checked={active}
        onClick={() => {
          setPlayerColor(color);
          setColorTouched(true);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition"
        style={active ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : { color: theme.textSecondary }}
      >
        <span className="w-4 h-4">
          <ChessPieceIcon type="k" color={color} set={pieceSet} />
        </span>
        {label}
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onMouseDown={e => {
        if (e.target === e.currentTarget && !isAnalyzing) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-pgn-title"
        className="animate-modal-reveal rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4"
        style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}`, color: theme.textPrimary }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <FileUp className="w-5 h-5" style={{ color: theme.accentHex }} />
            <div>
              <h2 id="import-pgn-title" className="font-display text-lg font-bold tracking-tight">
                Import a game
              </h2>
              <p className="text-xs" style={{ color: theme.textMutedHex }}>
                Paste a PGN from chess.com, lichess or any app to get a full review.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isAnalyzing}
            aria-label="Close import"
            className="p-1.5 rounded-lg transition hover:opacity-80 disabled:opacity-40"
            style={{ color: theme.textSecondary }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isAnalyzing}
          spellCheck={false}
          aria-label="PGN text"
          placeholder={EXAMPLE_PLACEHOLDER}
          className="w-full h-44 rounded-xl px-3 py-2.5 text-xs font-mono resize-y focus:outline-none"
          style={{
            backgroundColor: theme.cardSecondaryHex,
            border: `1px solid ${parsed && !parsed.ok ? '#f43f5e' : theme.cardBorderHex}`,
            color: theme.textPrimary
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition hover:opacity-80"
            style={{ borderColor: theme.cardBorderHex, color: theme.textSecondary }}
          >
            <Upload className="w-3.5 h-3.5" />
            Load .pgn file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pgn,text/plain,application/x-chess-pgn"
            className="hidden"
            onChange={e => {
              handleFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />

          <div className="flex items-center gap-2 text-xs" style={{ color: theme.textSecondary }}>
            <span className="font-semibold">I played</span>
            <div
              role="radiogroup"
              aria-label="Your side"
              className="flex items-center p-0.5 rounded-lg"
              style={{ backgroundColor: theme.cardSecondaryHex, border: `1px solid ${theme.cardBorderHex}` }}
            >
              {sideButton('w', 'White')}
              {sideButton('b', 'Black')}
            </div>
          </div>
        </div>

        {parsed && !parsed.ok && (
          <p className="text-xs font-semibold" style={{ color: '#f43f5e' }} role="alert">
            {parsed.error}
          </p>
        )}

        {game && (
          <div
            className="rounded-xl px-3.5 py-3 text-xs flex flex-col gap-1"
            style={{ backgroundColor: theme.cardSecondaryHex, border: `1px solid ${theme.cardBorderHex}` }}
          >
            <div className="flex items-center justify-between gap-2 font-semibold" style={{ color: theme.textPrimary }}>
              <span className="truncate">
                {game.white}
                {game.whiteElo ? ` (${game.whiteElo})` : ''} vs {game.black}
                {game.blackElo ? ` (${game.blackElo})` : ''}
              </span>
              <span className="font-mono font-bold shrink-0" style={{ color: theme.accentHex }}>
                {game.result}
              </span>
            </div>
            <div className="font-mono tabular-nums" style={{ color: theme.textMutedHex }}>
              {Math.ceil(game.moves.length / 2)} moves · {game.timeControl} · {game.date}
              {opening ? ` · ${opening.eco} ${opening.name}` : ''}
            </div>
          </div>
        )}

        {analyzeError && (
          <p className="text-xs font-semibold" style={{ color: '#f43f5e' }} role="alert">
            {analyzeError}
          </p>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-xl text-xs font-bold transition hover:opacity-80 disabled:opacity-40"
            style={{ color: theme.textSecondary }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!game || isAnalyzing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
          >
            {isAnalyzing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isAnalyzing ? 'Analyzing moves…' : 'Import & review'}
          </button>
        </div>
      </div>
    </div>
  );
};
