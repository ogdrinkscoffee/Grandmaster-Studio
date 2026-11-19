import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { Crosshair, Flame, Play, RotateCcw, Timer, Trophy } from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { resolveBoardTheme } from '../theme/themes';
import { ChessPieceIcon } from './ChessPieces';
import { VISION_BEST_STORAGE_KEY } from '../engine/dailyPuzzleStreak';
import { PROGRESS_EVENT } from '../engine/progressEvents';
import { sounds } from '../utils/sound';

type VisionMode = 'timed' | 'practice';
type VisionOrientation = 'white' | 'black' | 'random';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;
const ALL_SQUARES: Square[] = RANKS.flatMap(r => FILES.map(f => `${f}${r}` as Square));

function randomSquare(exclude?: Square | null): Square {
  const pool = exclude ? ALL_SQUARES.filter(s => s !== exclude) : ALL_SQUARES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function loadVisionBestScore(): number {
  try {
    const raw = localStorage.getItem(VISION_BEST_STORAGE_KEY);
    return raw ? Math.max(0, Number(raw) || 0) : 0;
  } catch {
    return 0;
  }
}

export const VisionTrainer: React.FC = () => {
  const { theme, pieceSet, settings } = useAppTheme();
  const boardTheme = resolveBoardTheme(settings);

  const [mode, setMode] = useState<VisionMode>('timed');
  const [orientation, setOrientation] = useState<VisionOrientation>('white');
  const [showStartingPieces, setShowStartingPieces] = useState<boolean>(true);
  const [activeFlipped, setActiveFlipped] = useState<boolean>(false);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);

  const [targetSquare, setTargetSquare] = useState<Square>(() => randomSquare());
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => loadVisionBestScore());
  const [feedback, setFeedback] = useState<{
    clicked: Square;
    correct: boolean;
    expected: Square;
  } | null>(null);

  const [avgMs, setAvgMs] = useState<number | null>(null);
  const targetShownAtRef = useRef<number>(Date.now());
  const reactionSumRef = useRef<number>(0);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startingPieces = useMemo(() => {
    const map = new Map<Square, { type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k'; color: 'w' | 'b' }>();
    if (!showStartingPieces) return map;
    const chess = new Chess();
    for (const row of chess.board()) {
      for (const piece of row) {
        if (piece) {
          map.set(piece.square, { type: piece.type, color: piece.color });
        }
      }
    }
    return map;
  }, [showStartingPieces]);

  useEffect(() => {
    if (orientation === 'white') setActiveFlipped(false);
    else if (orientation === 'black') setActiveFlipped(true);
  }, [orientation]);

  useEffect(() => {
    if (!isRunning || mode !== 'timed') return;
    const timer = window.setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning, mode]);

  useEffect(() => {
    if (mode === 'timed' && score > bestScore) {
      setBestScore(score);
      try {
        localStorage.setItem(VISION_BEST_STORAGE_KEY, String(score));
        window.dispatchEvent(new Event(PROGRESS_EVENT));
      } catch {
        // ignore storage errors
      }
    }
  }, [score, bestScore, mode]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const startSession = (nextMode: VisionMode = mode) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setMode(nextMode);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setAvgMs(null);
    reactionSumRef.current = 0;
    setSecondsLeft(30);
    setFinished(false);
    setFeedback(null);
    setTargetSquare(randomSquare());
    targetShownAtRef.current = Date.now();
    if (orientation === 'random') {
      setActiveFlipped(Math.random() < 0.5);
    }
    setIsRunning(true);
  };

  const handleSquareClick = (sq: Square) => {
    if (finished) return;
    if (!isRunning) {
      // Allow clicking straight into action to begin immediately
      setIsRunning(true);
      targetShownAtRef.current = Date.now();
    }

    const now = Date.now();
    const reaction = Math.max(80, Math.min(8000, now - targetShownAtRef.current));
    const isCorrect = sq === targetSquare;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (isCorrect) {
      sounds.playMove();
      const nextScore = score + 1;
      setScore(nextScore);
      setStreak(prev => prev + 1);
      reactionSumRef.current += reaction;
      setAvgMs(Math.round(reactionSumRef.current / nextScore));
      setFeedback({ clicked: sq, correct: true, expected: targetSquare });
      const nextTarget = randomSquare(targetSquare);
      setTargetSquare(nextTarget);
      targetShownAtRef.current = now;
      if (orientation === 'random' && nextScore % 3 === 0) {
        setActiveFlipped(f => !f);
      }
    } else {
      sounds.playBlunder();
      setStreak(0);
      setFeedback({ clicked: sq, correct: false, expected: targetSquare });
    }

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
    }, 420);
  };

  const displayRanks = activeFlipped ? [...RANKS].reverse() : RANKS;
  const displayFiles = activeFlipped ? [...FILES].reverse() : FILES;
  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Interactive Coordinate Board */}
      <div className="lg:col-span-7 flex flex-col items-center gap-3">
        <div
          className="w-full max-w-[520px] rounded-xl px-4 py-3 border flex items-center justify-between gap-3"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
              {finished ? 'Sprint Complete' : 'Find Square'}
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: theme.accentHex }}>
              {finished ? `${score} Squares` : targetSquare}
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs font-bold tabular-nums">
            {mode === 'timed' && (
              <div className="flex items-center gap-1.5">
                <Timer
                  className="w-4 h-4"
                  style={{ color: secondsLeft <= 8 && isRunning ? '#f43f5e' : theme.accentHex }}
                />
                <span style={{ color: secondsLeft <= 8 && isRunning ? '#f43f5e' : theme.textPrimary }}>
                  0:{String(secondsLeft).padStart(2, '0')}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{streak}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Best {bestScore}</span>
            </div>
          </div>
        </div>

        {/* 8x8 Coordinate Board (Coordinates intentionally omitted to train pure vision) */}
        <div
          className="relative w-full max-w-[520px] aspect-square rounded-xl overflow-hidden shadow-2xl border select-none grid grid-cols-8 grid-rows-8"
          style={{ borderColor: theme.cardBorderHex }}
          aria-label="Coordinate Vision Training Board"
        >
          {displayRanks.map((rank, rIdx) =>
            displayFiles.map((file, fIdx) => {
              const sq = `${file}${rank}` as Square;
              const origFileIdx = FILES.indexOf(file);
              const origRankIdx = RANKS.indexOf(rank);
              const isLight = (origFileIdx + origRankIdx) % 2 === 0;
              const piece = startingPieces.get(sq);

              const isClickedFeedback = feedback?.clicked === sq;
              const isExpectedHint = feedback && !feedback.correct && feedback.expected === sq;

              return (
                <button
                  key={sq}
                  type="button"
                  onClick={() => handleSquareClick(sq)}
                  aria-label={`Square ${sq}`}
                  className={`chess-square-btn ${
                    isClickedFeedback || isExpectedHint
                      ? ''
                      : isLight
                      ? 'chess-sq-light'
                      : 'chess-sq-dark'
                  } relative w-full h-full flex items-center justify-center focus:outline-none`}
                  style={
                    isClickedFeedback || isExpectedHint
                      ? {
                          backgroundColor: isClickedFeedback
                            ? feedback.correct
                              ? '#10b981'
                              : '#f43f5e'
                            : `${theme.accentHex}88`
                        }
                      : undefined
                  }
                >
                  {piece && (
                    <span className="w-[74%] h-[74%] opacity-85 pointer-events-none">
                      <ChessPieceIcon type={piece.type} color={piece.color} set={pieceSet} />
                    </span>
                  )}
                  {isClickedFeedback && (
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-extrabold text-white drop-shadow">
                      {sq}
                    </span>
                  )}
                </button>
              );
            })
          )}

          {/* Center target watermark while playing */}
          {!finished && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <span
                className="font-mono text-4xl sm:text-5xl font-black tracking-tight px-4 py-1.5 rounded-xl opacity-30"
                style={{
                  color: theme.textPrimary,
                  backgroundColor: `${theme.cardHex}85`
                }}
              >
                {targetSquare}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Vision Controls & Live Telemetry */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div
          className="rounded-xl p-5 border flex flex-col gap-4"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold flex items-center gap-2" style={{ color: theme.textPrimary }}>
                <Crosshair className="w-5 h-5" style={{ color: theme.accentHex }} />
                Coordinate Vision Trainer
              </h2>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.textSecondary }}>
                Spot target squares instantaneously without rank or file labels—essential for fast calculation and reading lines.
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
              Drill Format
            </span>
            <div
              className="grid grid-cols-2 gap-1.5 p-1 rounded-lg border"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
            >
              <button
                type="button"
                onClick={() => startSession('timed')}
                className="py-2 px-3 rounded-md text-xs font-bold transition"
                style={
                  mode === 'timed'
                    ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                    : { color: theme.textSecondary }
                }
              >
                30s Speed Sprint
              </button>
              <button
                type="button"
                onClick={() => startSession('practice')}
                className="py-2 px-3 rounded-md text-xs font-bold transition"
                style={
                  mode === 'practice'
                    ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                    : { color: theme.textSecondary }
                }
              >
                Endless Practice
              </button>
            </div>
          </div>

          {/* Perspective Toggle */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
              Board Perspective
            </span>
            <div
              className="grid grid-cols-3 gap-1.5 p-1 rounded-lg border"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
            >
              {([
                { id: 'white', label: 'White' },
                { id: 'black', label: 'Black' },
                { id: 'random', label: 'Auto-Flip' }
              ] as const).map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOrientation(opt.id)}
                  className="py-1.5 px-2.5 rounded-md text-xs font-bold transition"
                  style={
                    orientation === opt.id
                      ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                      : { color: theme.textSecondary }
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between text-xs py-1 cursor-pointer">
            <span className="font-semibold" style={{ color: theme.textSecondary }}>
              Show Starting Chess Pieces
            </span>
            <input
              type="checkbox"
              checked={showStartingPieces}
              onChange={e => setShowStartingPieces(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: theme.accentHex }}
            />
          </label>

          {/* Session Metrics */}
          <div
            className="grid grid-cols-3 gap-2 pt-3 border-t text-center"
            style={{ borderColor: theme.cardBorderHex }}
          >
            <div>
              <div className="text-[11px]" style={{ color: theme.textMutedHex }}>Score</div>
              <div className="font-mono text-lg font-extrabold tabular-nums" style={{ color: theme.accentHex }}>
                {score}
              </div>
            </div>
            <div>
              <div className="text-[11px]" style={{ color: theme.textMutedHex }}>Accuracy</div>
              <div className="font-mono text-lg font-extrabold tabular-nums" style={{ color: theme.textPrimary }}>
                {accuracy}%
              </div>
            </div>
            <div>
              <div className="text-[11px]" style={{ color: theme.textMutedHex }}>Avg Speed</div>
              <div className="font-mono text-lg font-extrabold tabular-nums" style={{ color: theme.textPrimary }}>
                {avgMs !== null ? `${(avgMs / 1000).toFixed(2)}s` : '—'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => startSession(mode)}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition hover:opacity-90"
            style={{
              backgroundColor: theme.accentHex,
              color: theme.accentTextHex
            }}
          >
            {isRunning || finished ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{finished ? 'Play Again' : isRunning ? 'Restart Sprint' : 'Start 30s Challenge'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
