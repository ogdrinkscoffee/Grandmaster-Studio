import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { hasOpenModalDialog, isEditableEventTarget } from '../engine/keyboardShortcuts';
import {
  ArrowUpDown,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Cpu,
  FolderInput,
  Loader2,
  RotateCcw,
  SkipBack,
  SkipForward,
  Swords,
  Zap
} from 'lucide-react';
import { ChessBoard, getBoardMaxWidthPx } from './ChessBoard';
import { EvalBar } from './EvalBar';
import { useAppTheme } from '../context/ThemeContext';
import { sounds } from '../utils/sound';
import { EngineLine, formatEvaluation } from '../engine/chessEngine';
import { engineTopLines } from '../engine/engineClient';
import { detectOpening, getOpeningContinuations } from '../engine/openings';

interface PlayedMove {
  from: string;
  to: string;
  promotion?: string;
  san: string;
}

const START_FEN = new Chess().fen();
const ANALYSIS_TIME_MS = 900;

const PRESETS: { label: string; fen: string }[] = [
  { label: 'Start', fen: START_FEN },
  { label: 'Italian', fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4' },
  { label: 'Sicilian', fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2' },
  { label: 'Lucena', fen: '1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1' }
];

function replay(startFen: string, moves: PlayedMove[]): Chess {
  const board = new Chess(startFen);
  for (const m of moves) board.move({ from: m.from, to: m.to, promotion: m.promotion });
  return board;
}

function playSound(san: string) {
  if (san.includes('#') || san.includes('+')) sounds.playCheck();
  else if (san.startsWith('O-O')) sounds.playCastle();
  else if (san.includes('=')) sounds.playPromote();
  else if (san.includes('x')) sounds.playCapture();
  else sounds.playMove();
}

function gameOverText(board: Chess): string | null {
  if (board.isCheckmate()) return `Checkmate — ${board.turn() === 'w' ? 'Black' : 'White'} wins`;
  if (board.isStalemate()) return 'Stalemate';
  if (board.isInsufficientMaterial()) return 'Draw — insufficient material';
  if (board.isThreefoldRepetition()) return 'Draw — threefold repetition';
  if (board.isDraw()) return 'Draw';
  return null;
}

interface AnalysisBoardProps {
  initialFenRequest?: { fen: string; key: number } | null;
  onPlayFromFen?: (fen: string) => void;
}

/** Free analysis board: play both sides, step through moves, explore opening book, and see live engine lines + eval. */
export const AnalysisBoard: React.FC<AnalysisBoardProps> = ({ initialFenRequest = null, onPlayFromFen }) => {
  const { theme, settings } = useAppTheme();
  const [startFen, setStartFen] = useState(START_FEN);
  const [moves, setMoves] = useState<PlayedMove[]>([]);
  const [cursor, setCursor] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [lines, setLines] = useState<EngineLine[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLine, setSelectedLine] = useState(0);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [copied, setCopied] = useState<'fen' | 'pgn' | null>(null);
  const requestRef = useRef(0);

  const board = useMemo(() => replay(startFen, moves.slice(0, cursor)), [startFen, moves, cursor]);
  const fen = board.fen();
  const overText = gameOverText(board);
  const opening = useMemo(
    () => (startFen === START_FEN ? detectOpening(moves.slice(0, cursor).map(m => m.san)) : null),
    [startFen, moves, cursor]
  );
  const openingContinuations = useMemo(
    () => (startFen === START_FEN ? getOpeningContinuations(moves.slice(0, cursor).map(m => m.san)) : []),
    [startFen, moves, cursor]
  );

  useEffect(() => {
    if (!initialFenRequest) return;
    loadPosition(initialFenRequest.fen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFenRequest]);

  // Analyse every new position in the engine worker (debounced so stepping through moves stays snappy)
  useEffect(() => {
    requestRef.current += 1;
    const requestId = requestRef.current;
    setSelectedLine(0);
    if (overText) {
      setLines([]);
      setIsAnalyzing(false);
      return;
    }
    setIsAnalyzing(true);
    const timer = window.setTimeout(() => {
      engineTopLines(fen, 3, 3, ANALYSIS_TIME_MS)
        .then(result => {
          if (requestId === requestRef.current) setLines(result);
        })
        .catch(() => {
          if (requestId === requestRef.current) setLines([]);
        })
        .finally(() => {
          if (requestId === requestRef.current) setIsAnalyzing(false);
        });
    }, 150);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen]);

  // Arrow keys, Home/End, and F (flip board) shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditableEventTarget(e.target) || hasOpenModalDialog()) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'ArrowLeft') setCursor(c => Math.max(0, c - 1));
      else if (e.key === 'ArrowRight') setCursor(c => Math.min(moves.length, c + 1));
      else if (e.key === 'Home') setCursor(0);
      else if (e.key === 'End') setCursor(moves.length);
      else if (e.key.toLowerCase() === 'f') setIsFlipped(f => !f);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moves.length]);

  const applyMove = (move: { from: string; to: string; promotion?: string }) => {
    let played: PlayedMove;
    try {
      const m = new Chess(fen).move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
      played = { from: m.from, to: m.to, promotion: m.promotion, san: m.san };
    } catch {
      return false;
    }
    playSound(played.san);
    // Same as the next move in the list: just step forward and keep the continuation
    const next = moves[cursor];
    if (next && next.from === played.from && next.to === played.to && next.promotion === played.promotion) {
      setCursor(cursor + 1);
      return true;
    }
    setMoves([...moves.slice(0, cursor), played]);
    setCursor(cursor + 1);
    return true;
  };

  const loadPosition = (fenToLoad: string) => {
    setStartFen(fenToLoad);
    setMoves([]);
    setCursor(0);
    setImportError(null);
  };

  const handleImport = () => {
    const text = importText.trim();
    if (!text) return;
    // FEN first
    try {
      const probe = new Chess(text);
      loadPosition(probe.fen());
      setImportText('');
      return;
    } catch {
      // not a FEN — try PGN
    }
    try {
      const game = new Chess();
      game.loadPgn(text);
      const history = game.history({ verbose: true });
      const start = history[0]?.before ?? game.fen();
      setStartFen(start);
      const loaded = history.map(m => ({ from: m.from, to: m.to, promotion: m.promotion, san: m.san }));
      setMoves(loaded);
      setCursor(loaded.length);
      setImportError(null);
      setImportText('');
    } catch {
      setImportError('That isn’t a valid FEN or PGN.');
    }
  };

  const copy = async (kind: 'fen' | 'pgn') => {
    const text =
      kind === 'fen'
        ? fen
        : (() => {
            const g = replay(startFen, moves);
            return g.pgn();
          })();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      setImportText(text);
    }
  };

  const activeLine = lines[selectedLine] ?? lines[0];
  const arrow = activeLine ? { from: activeLine.from as Square, to: activeLine.to as Square } : null;
  const evalCp = lines[0]?.scoreCp ?? 0;
  const plateMaxWidth = `${getBoardMaxWidthPx(settings.boardSize) + 44}px`;

  const navButton = (label: string, icon: React.ReactNode, onClick: () => void, disabled: boolean) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex-1 flex items-center justify-center py-2 rounded-lg border transition hover:opacity-80 disabled:opacity-30"
      style={{ borderColor: theme.cardBorderHex, color: theme.textPrimary }}
    >
      {icon}
    </button>
  );

  // Move list rows
  const firstMoveNumber = new Chess(startFen).moveNumber();
  const blackStarts = new Chess(startFen).turn() === 'b';
  const rows: { num: number; white?: { san: string; ply: number }; black?: { san: string; ply: number } }[] = [];
  moves.forEach((m, i) => {
    const absolute = i + (blackStarts ? 1 : 0);
    const num = firstMoveNumber + Math.floor(absolute / 2);
    const entry = { san: m.san, ply: i + 1 };
    if (absolute % 2 === 0) rows.push({ num, white: entry });
    else if (rows.length === 0 || rows[rows.length - 1].black) rows.push({ num, black: entry });
    else rows[rows.length - 1].black = entry;
  });

  const moveButton = (entry?: { san: string; ply: number }) =>
    entry ? (
      <button
        type="button"
        onClick={() => setCursor(entry.ply)}
        className="text-left px-1.5 py-0.5 rounded font-bold transition"
        style={{
          backgroundColor: cursor === entry.ply ? `${theme.accentHex}25` : 'transparent',
          color: cursor === entry.ply ? theme.accentHex : theme.textPrimary
        }}
      >
        {entry.san}
      </button>
    ) : (
      <span className="px-1.5" style={{ color: theme.textMutedHex }}>
        …
      </span>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Board + eval */}
      <div className="lg:col-span-7 flex flex-col items-center gap-2.5">
        <div
          className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold"
          style={{ maxWidth: plateMaxWidth, backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
        >
          <span className="truncate" style={{ color: theme.textPrimary }}>
            {overText ?? `${board.turn() === 'w' ? 'White' : 'Black'} to move`}
            {opening && (
              <span className="font-normal" style={{ color: theme.textMutedHex }}>
                {' '}· {opening.eco} {opening.name}
              </span>
            )}
          </span>
          <span className="font-mono font-bold tabular-nums shrink-0" style={{ color: theme.accentHex }}>
            {lines.length > 0 ? formatEvaluation(evalCp) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-center gap-3 w-full">
          <EvalBar scoreCp={evalCp} isFlipped={isFlipped} isEvaluating={isAnalyzing} engineDepth={3} />
          <ChessBoard chess={board} isFlipped={isFlipped} premoveMode="off" bestMoveArrow={arrow} onMakeMove={applyMove} />
        </div>
        <div className="w-full flex gap-2" style={{ maxWidth: plateMaxWidth }}>
          {navButton('First move', <SkipBack className="w-4 h-4" />, () => setCursor(0), cursor === 0)}
          {navButton('Previous move (←)', <ChevronLeft className="w-4 h-4" />, () => setCursor(c => Math.max(0, c - 1)), cursor === 0)}
          {navButton('Next move (→)', <ChevronRight className="w-4 h-4" />, () => setCursor(c => Math.min(moves.length, c + 1)), cursor >= moves.length)}
          {navButton('Last move', <SkipForward className="w-4 h-4" />, () => setCursor(moves.length), cursor >= moves.length)}
          {navButton('Flip board', <ArrowUpDown className="w-4 h-4" />, () => setIsFlipped(f => !f), false)}
        </div>
      </div>

      {/* Panel */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Engine lines */}
        <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
              <Cpu className="w-4 h-4" style={{ color: theme.accentHex }} />
              Engine lines
            </span>
            {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin" style={{ color: theme.accentHex }} />}
          </div>

          {overText ? (
            <div className="text-xs py-3" style={{ color: theme.textSecondary }}>
              {overText}.
            </div>
          ) : lines.length === 0 ? (
            <div className="text-xs py-3" style={{ color: theme.textMutedHex }}>
              Analyzing position…
            </div>
          ) : (
            lines.map((line, idx) => {
              const active = idx === selectedLine;
              return (
                <button
                  key={`${line.san}-${idx}`}
                  type="button"
                  onClick={() => setSelectedLine(idx)}
                  className="text-left rounded-lg px-3 py-2 border transition"
                  style={{
                    backgroundColor: active ? `${theme.accentHex}14` : theme.cardSecondaryHex,
                    borderColor: active ? `${theme.accentHex}66` : theme.cardBorderHex,
                    opacity: isAnalyzing ? 0.6 : 1
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] font-bold" style={{ color: theme.textMutedHex }}>
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-sm" style={{ color: theme.textPrimary }}>
                        {line.san}
                      </span>
                      <span className="font-mono text-[11px] truncate" style={{ color: theme.textMutedHex }}>
                        {line.pvSan.slice(1).join(' ')}
                      </span>
                    </span>
                    <span className="font-mono text-xs font-bold shrink-0" style={{ color: theme.accentHex }}>
                      {line.formattedEval}
                    </span>
                  </div>
                  {active && line.reasons[0] && (
                    <div className="text-[11px] mt-1" style={{ color: theme.textSecondary }}>
                      {line.reasons[0]}
                    </div>
                  )}
                </button>
              );
            })
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!activeLine || isAnalyzing}
              onClick={() => activeLine && applyMove({ from: activeLine.from, to: activeLine.to, promotion: activeLine.promotion })}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
              style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
            >
              <Zap className="w-3.5 h-3.5" />
              Play {activeLine ? activeLine.san : 'engine move'}
            </button>
            {onPlayFromFen && (
              <button
                type="button"
                onClick={() => onPlayFromFen(fen)}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-bold transition hover:opacity-85 cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                <Swords className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                <span>Play vs Engine</span>
              </button>
            )}
          </div>
        </div>

        {/* Lichess-style Opening Explorer */}
        {startFen === START_FEN && (
          <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
                <BookOpen className="w-4 h-4" style={{ color: theme.accentHex }} />
                Opening Explorer
              </span>
              {opening && (
                <span className="font-mono text-[11px] font-bold truncate max-w-[180px]" style={{ color: theme.accentHex }}>
                  {opening.eco}
                </span>
              )}
            </div>

            {openingContinuations.length === 0 ? (
              <div className="text-xs py-1.5" style={{ color: theme.textMutedHex }}>
                Out of curated book lines — rely on Stockfish candidate lines above.
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {openingContinuations.map(cont => (
                  <button
                    key={cont.san}
                    type="button"
                    onClick={() => {
                      try {
                        const m = new Chess(fen).move(cont.san);
                        if (m) applyMove({ from: m.from, to: m.to, promotion: m.promotion });
                      } catch {
                        /* ignore */
                      }
                    }}
                    className="flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-lg border text-left transition hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs" style={{ color: theme.textPrimary }}>
                          {cont.san}
                        </span>
                        <span className="text-[11px] truncate" style={{ color: theme.textMutedHex }}>
                          {cont.openingName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[10px] tabular-nums hidden sm:inline" style={{ color: theme.textMutedHex }}>
                        {(cont.sampleGames / 1000).toFixed(1)}k
                      </span>
                      <div
                        className="w-24 h-2.5 rounded-sm overflow-hidden flex text-[8px] font-bold border"
                        style={{ borderColor: theme.cardBorderHex }}
                        title={`White ${cont.whitePct}% · Draw ${cont.drawPct}% · Black ${cont.blackPct}%`}
                      >
                        <div style={{ width: `${cont.whitePct}%`, backgroundColor: '#f8fafc' }} />
                        <div style={{ width: `${cont.drawPct}%`, backgroundColor: '#64748b' }} />
                        <div style={{ width: `${cont.blackPct}%`, backgroundColor: '#0f172a' }} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Moves */}
        <div className="rounded-xl p-4 flex flex-col gap-2" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
              Moves ({moves.length})
            </span>
            <div className="flex items-center gap-1">
              {(['fen', 'pgn'] as const).map(kind => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => copy(kind)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition hover:opacity-80"
                  style={{ color: theme.textSecondary }}
                >
                  {copied === kind ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {kind.toUpperCase()}
                </button>
              ))}
              <button
                type="button"
                onClick={() => loadPosition(START_FEN)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition hover:opacity-80"
                style={{ color: theme.textSecondary }}
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto font-mono text-xs flex flex-col gap-0.5">
            {rows.length === 0 ? (
              <span className="py-2" style={{ color: theme.textMutedHex }}>
                Move pieces for either side to explore.
              </span>
            ) : (
              rows.map(r => (
                <div key={`${r.num}-${r.white?.ply ?? r.black?.ply}`} className="grid grid-cols-[2.5rem_1fr_1fr] items-center">
                  <span style={{ color: theme.textMutedHex }}>{r.num}.</span>
                  {moveButton(r.white)}
                  {moveButton(r.black)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Load */}
        <div className="rounded-xl p-4 flex flex-col gap-2" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
            <FolderInput className="w-4 h-4" style={{ color: theme.accentHex }} />
            Set up a position
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => loadPosition(p.fen)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold border transition hover:opacity-80"
                style={{ borderColor: theme.cardBorderHex, color: theme.textSecondary }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={importText}
              onChange={e => setImportText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleImport();
              }}
              aria-label="FEN or PGN"
              placeholder="Paste a FEN or PGN…"
              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono focus:outline-none"
              style={{
                backgroundColor: theme.cardSecondaryHex,
                borderColor: importError ? '#f43f5e' : theme.cardBorderHex,
                color: theme.textPrimary
              }}
            />
            <button
              type="button"
              onClick={handleImport}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-90"
              style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
            >
              Load
            </button>
          </div>
          {importError && (
            <span className="text-[11px] font-semibold" style={{ color: '#f43f5e' }} role="alert">
              {importError}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
