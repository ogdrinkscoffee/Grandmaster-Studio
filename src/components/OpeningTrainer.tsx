import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { BookOpen, Check, ChevronRight, Eye, GraduationCap, RotateCcw, Star, X } from 'lucide-react';
import { ChessBoard, getBoardMaxWidthPx } from './ChessBoard';
import { useAppTheme } from '../context/ThemeContext';
import { sounds } from '../utils/sound';
import {
  MASTERY_TARGET,
  OPENING_REPERTOIRE,
  OpeningProgress,
  RepertoireLine,
  loadOpeningProgress,
  saveOpeningProgress
} from '../engine/openingRepertoire';

type TrainerMode = 'learn' | 'drill';
type Feedback = { tone: 'good' | 'warn' | 'info'; text: string } | null;

const BOT_REPLY_DELAY_MS = 450;

function replay(moves: string[]): Chess {
  const board = new Chess();
  for (const san of moves) board.move(san);
  return board;
}

/** from/to squares of a SAN move in a position (for hint arrows). */
function squaresOf(board: Chess, san: string): { from: Square; to: Square } | null {
  try {
    const probe = new Chess(board.fen());
    const m = probe.move(san);
    return { from: m.from, to: m.to };
  } catch {
    return null;
  }
}

function playMoveSound(san: string) {
  if (san.includes('#') || san.includes('+')) sounds.playCheck();
  else if (san.startsWith('O-O')) sounds.playCastle();
  else if (san.includes('x')) sounds.playCapture();
  else sounds.playMove();
}

export const OpeningTrainer: React.FC = () => {
  const { theme, settings } = useAppTheme();
  const [lineId, setLineId] = useState<string>(OPENING_REPERTOIRE[0].id);
  const [mode, setMode] = useState<TrainerMode>('learn');
  const [ply, setPly] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrongTries, setWrongTries] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState<Record<string, OpeningProgress>>(() => loadOpeningProgress());
  const botTimerRef = useRef<number | null>(null);
  // Bumped on every restart so the opponent-move effect re-arms even when ply was already 0
  const [runId, setRunId] = useState(0);

  const line: RepertoireLine = OPENING_REPERTOIRE.find(l => l.id === lineId) ?? OPENING_REPERTOIRE[0];
  const board = useMemo(() => replay(line.moves.slice(0, ply)), [line, ply]);
  const isUserTurn = !isComplete && ply < line.moves.length && board.turn() === line.side;
  const userMovesTotal = line.moves.filter((_, i) => (i % 2 === 0 ? 'w' : 'b') === line.side).length;
  const userMovesDone = line.moves.slice(0, ply).filter((_, i) => (i % 2 === 0 ? 'w' : 'b') === line.side).length;

  const resetLine = () => {
    if (botTimerRef.current) window.clearTimeout(botTimerRef.current);
    setPly(0);
    setMistakes(0);
    setWrongTries(0);
    setIsComplete(false);
    setRunId(r => r + 1);
    setFeedback({
      tone: 'info',
      text: line.side === 'w' ? 'You have White. Play the first move of the line.' : 'You have Black. Watch White’s move, then reply.'
    });
  };

  // Restart whenever the line or mode changes
  useEffect(() => {
    resetLine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId, mode]);

  useEffect(() => () => {
    if (botTimerRef.current) window.clearTimeout(botTimerRef.current);
  }, []);

  const completeLine = (finalMistakes: number) => {
    setIsComplete(true);
    const perfect = mode === 'drill' && finalMistakes === 0;
    setProgress(prev => {
      const current = prev[line.id] ?? { attempts: 0, perfectDrills: 0 };
      const next = {
        ...prev,
        [line.id]: {
          attempts: current.attempts + 1,
          perfectDrills: current.perfectDrills + (perfect ? 1 : 0),
          lastPracticed: new Date().toISOString().split('T')[0]
        }
      };
      saveOpeningProgress(next);
      return next;
    });
    setFeedback(
      perfect
        ? { tone: 'good', text: 'Perfect drill — the whole line from memory. ★ earned.' }
        : mode === 'learn'
        ? { tone: 'good', text: 'Line complete. Switch to Drill to play it from memory and earn a star.' }
        : { tone: 'info', text: `Line complete with ${finalMistakes} mistake${finalMistakes === 1 ? '' : 's'}. Drill it again for a clean run.` }
    );
    sounds.playPuzzleSuccess();
  };

  // Trainer plays the opponent's book replies
  useEffect(() => {
    if (isComplete) return;
    if (ply >= line.moves.length) {
      completeLine(mistakes);
      return;
    }
    if (board.turn() === line.side) return;
    botTimerRef.current = window.setTimeout(() => {
      botTimerRef.current = null;
      const san = line.moves[ply];
      playMoveSound(san);
      setPly(p => p + 1);
      setFeedback(prev =>
        !prev || prev.tone === 'info'
          ? { tone: 'info', text: `${line.side === 'w' ? 'Black' : 'White'} played ${san}. Your move.` }
          : prev
      );
    }, BOT_REPLY_DELAY_MS);
    return () => {
      if (botTimerRef.current) window.clearTimeout(botTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ply, line, isComplete, runId]);

  const expected = isUserTurn ? line.moves[ply] : null;
  const showHint = isUserTurn && (mode === 'learn' || wrongTries >= 2);
  const hintArrow = showHint && expected ? squaresOf(board, expected) : null;

  const handleMove = ({ from, to, promotion = 'q' }: { from: Square; to: Square; promotion?: string }) => {
    if (!isUserTurn || !expected) return false;
    let san: string;
    try {
      san = new Chess(board.fen()).move({ from, to, promotion }).san;
    } catch {
      return false; // illegal — the board just snaps back
    }

    if (san === expected) {
      playMoveSound(san);
      setWrongTries(0);
      setFeedback({ tone: 'good', text: `${san} — book move.` });
      setPly(p => p + 1);
      return true;
    }

    // Legal but not the repertoire move
    sounds.playBlunder();
    if (wrongTries === 0) setMistakes(m => m + 1);
    const tries = wrongTries + 1;
    setWrongTries(tries);
    setFeedback({
      tone: 'warn',
      text:
        tries >= 2 || mode === 'learn'
          ? `${san} isn’t the line. Follow the arrow: ${expected}.`
          : `${san} isn’t the book move here. Try again.`
    });
    return false;
  };

  const goToNextLine = () => {
    const idx = OPENING_REPERTOIRE.findIndex(l => l.id === line.id);
    setLineId(OPENING_REPERTOIRE[(idx + 1) % OPENING_REPERTOIRE.length].id);
  };

  const plateMaxWidth = `${getBoardMaxWidthPx(settings.boardSize)}px`;
  const feedbackColor = feedback?.tone === 'good' ? '#10b981' : feedback?.tone === 'warn' ? '#f59e0b' : theme.textSecondary;

  const renderStars = (count: number, size = 'w-3 h-3') => (
    <span className="inline-flex items-center gap-0.5" aria-label={`${Math.min(count, MASTERY_TARGET)} of ${MASTERY_TARGET} stars`}>
      {Array.from({ length: MASTERY_TARGET }, (_, i) => (
        <Star
          key={i}
          className={size}
          style={{ color: i < count ? '#f59e0b' : theme.textMutedHex }}
          fill={i < count ? '#f59e0b' : 'none'}
        />
      ))}
    </span>
  );

  const renderLineGroup = (side: 'w' | 'b', label: string) => (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] font-bold uppercase tracking-wider px-1 pt-1" style={{ color: theme.textMutedHex }}>
        {label}
      </div>
      {OPENING_REPERTOIRE.filter(l => l.side === side).map(l => {
        const selected = l.id === line.id;
        const p = progress[l.id];
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => setLineId(l.id)}
            className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition"
            style={{
              backgroundColor: selected ? `${theme.accentHex}1f` : 'transparent',
              border: `1px solid ${selected ? `${theme.accentHex}66` : 'transparent'}`
            }}
          >
            <span className="min-w-0">
              <span className="block text-xs font-bold truncate" style={{ color: selected ? theme.accentHex : theme.textPrimary }}>
                {l.name}
              </span>
              <span className="block text-[10px] font-mono" style={{ color: theme.textMutedHex }}>
                {l.eco} · {l.moves.length} plies
              </span>
            </span>
            {renderStars(p?.perfectDrills ?? 0)}
          </button>
        );
      })}
    </div>
  );

  // Move list: played moves, then "?" for the user's pending move
  const movePairs: { num: number; white?: string; black?: string }[] = [];
  for (let i = 0; i < ply; i++) {
    const num = Math.floor(i / 2) + 1;
    if (i % 2 === 0) movePairs.push({ num, white: line.moves[i] });
    else movePairs[movePairs.length - 1].black = line.moves[i];
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Board */}
      <div className="lg:col-span-7 flex flex-col items-center gap-2.5">
        <div
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs font-semibold"
          style={{ maxWidth: plateMaxWidth, backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
        >
          <span style={{ color: theme.textPrimary }}>
            {isComplete ? 'Line complete' : isUserTurn ? 'Your move' : 'Opponent is replying…'}
          </span>
          <span className="font-mono tabular-nums" style={{ color: theme.accentHex }}>
            {userMovesDone}/{userMovesTotal} moves
          </span>
        </div>
        <ChessBoard
          chess={board}
          isFlipped={line.side === 'b'}
          playerColor={line.side}
          premoveMode="off"
          bestMoveArrow={hintArrow}
          onMakeMove={handleMove}
          disabled={!isUserTurn}
        />
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ maxWidth: plateMaxWidth, backgroundColor: theme.cardSecondaryHex }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(ply / line.moves.length) * 100}%`,
              backgroundImage: `linear-gradient(90deg, ${theme.accentHex}, ${theme.accent2Hex})`
            }}
          />
        </div>
      </div>

      {/* Panel */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="rounded-xl p-4 flex flex-col gap-3" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-bold" style={{ color: theme.accentHex }}>
                {line.eco} · YOU PLAY {line.side === 'w' ? 'WHITE' : 'BLACK'}
              </div>
              <h2 className="font-display text-base font-bold leading-tight mt-0.5" style={{ color: theme.textPrimary }}>
                {line.name}
              </h2>
            </div>
            {renderStars(progress[line.id]?.perfectDrills ?? 0, 'w-4 h-4')}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
            {line.summary}
          </p>
          <ul className="flex flex-col gap-1">
            {line.ideas.map(idea => (
              <li key={idea} className="text-[11px] flex gap-1.5" style={{ color: theme.textMutedHex }}>
                <span style={{ color: theme.accentHex }}>•</span>
                {idea}
              </li>
            ))}
          </ul>

          {/* Mode */}
          <div
            role="radiogroup"
            aria-label="Training mode"
            className="grid grid-cols-2 p-0.5 rounded-lg"
            style={{ backgroundColor: theme.cardSecondaryHex, border: `1px solid ${theme.cardBorderHex}` }}
          >
            {([
              { id: 'learn', label: 'Learn', hint: 'Arrows show each move', icon: <Eye className="w-3.5 h-3.5" /> },
              { id: 'drill', label: 'Drill', hint: 'From memory · earns ★', icon: <GraduationCap className="w-3.5 h-3.5" /> }
            ] as const).map(opt => {
              const active = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(opt.id)}
                  className="flex flex-col items-center py-1.5 rounded-md transition"
                  style={active ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : { color: theme.textSecondary }}
                >
                  <span className="flex items-center gap-1.5 text-xs font-bold">
                    {opt.icon}
                    {opt.label}
                  </span>
                  <span className="text-[10px] opacity-80">{opt.hint}</span>
                </button>
              );
            })}
          </div>

          {/* Moves so far */}
          <div
            className="rounded-lg px-3 py-2 font-mono text-xs min-h-[3rem] flex flex-wrap gap-x-3 gap-y-1"
            style={{ backgroundColor: theme.cardSecondaryHex, color: theme.textPrimary }}
          >
            {movePairs.length === 0 && !isUserTurn && <span style={{ color: theme.textMutedHex }}>Waiting for the first move…</span>}
            {movePairs.map(p => (
              <span key={p.num}>
                <span style={{ color: theme.textMutedHex }}>{p.num}.</span> {p.white} {p.black ?? ''}
              </span>
            ))}
            {isUserTurn && (
              <span className="font-bold" style={{ color: theme.accentHex }}>
                {line.side === 'w' ? `${Math.floor(ply / 2) + 1}. ?` : '…?'}
              </span>
            )}
          </div>

          {feedback && (
            <div className="flex items-start gap-1.5 text-xs font-semibold" style={{ color: feedbackColor }} role="status">
              {feedback.tone === 'good' ? <Check className="w-4 h-4 shrink-0" /> : feedback.tone === 'warn' ? <X className="w-4 h-4 shrink-0" /> : <BookOpen className="w-4 h-4 shrink-0" />}
              <span>{feedback.text}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 text-[11px] font-mono" style={{ color: theme.textMutedHex }}>
            <span>Mistakes this run: {mistakes}</span>
            <span>Attempts: {progress[line.id]?.attempts ?? 0}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetLine}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition hover:opacity-80"
              style={{ borderColor: theme.cardBorderHex, color: theme.textPrimary }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restart line
            </button>
            {isComplete && (
              <button
                type="button"
                onClick={goToNextLine}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition hover:opacity-90"
                style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
              >
                Next opening
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Repertoire */}
        <div className="rounded-xl p-2 flex flex-col gap-2 max-h-[26rem] overflow-y-auto" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
          {renderLineGroup('w', 'Play as White')}
          {renderLineGroup('b', 'Play as Black')}
        </div>
      </div>
    </div>
  );
};
