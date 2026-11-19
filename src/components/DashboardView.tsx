import React, { useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'motion/react';
import { Chess, Square } from 'chess.js';
import { UserProfile, GameHistoryItem } from '../types/chess';
import {
  Trophy,
  TrendingUp,
  History,
  Sparkles,
  Swords,
  Zap,
  Clock,
  ChevronRight,
  FileUp,
  Flame,
  Calendar,
  Check,
  Crosshair,
  Target
} from 'lucide-react';
import { ImportPgnModal } from './ImportPgnModal';
import { AchievementsPanel } from './Achievements';
import { AchievementStatus } from '../engine/achievements';
import { useAppTheme } from '../context/ThemeContext';
import { ChessPieceIcon } from './ChessPieces';
import { resolveBoardTheme } from '../theme/themes';
import { getVariantDisplayName } from '../engine/variants';
import { computeDailyPuzzleStreak, loadDailyPuzzleStreakState } from '../engine/dailyPuzzleStreak';
import { getCachedDailyPuzzle, fetchDailyLichessPuzzle } from '../engine/puzzles';
import { PROGRESS_EVENT } from '../engine/progressEvents';
import { loadVisionBestScore } from './VisionTrainer';

export const DASHBOARD_SEEN_RATINGS_KEY = 'gm_dashboard_seen_ratings_v1';

export interface SeenRatingsSnapshot {
  bullet: number;
  blitz: number;
  rapid: number;
  puzzles: number;
  variants: number;
  highestRating: number;
}

function readSeenRatings(): Partial<SeenRatingsSnapshot> | null {
  try {
    const raw = localStorage.getItem(DASHBOARD_SEEN_RATINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function writeSeenRatings(snapshot: SeenRatingsSnapshot): void {
  try {
    localStorage.setItem(DASHBOARD_SEEN_RATINGS_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore storage errors
  }
}

interface AnimatedRatingNumberProps {
  value: number;
  baselineValue: number;
  skipAnimation?: boolean;
  showDelta?: boolean;
}

const AnimatedRatingNumber: React.FC<AnimatedRatingNumberProps> = ({
  value,
  baselineValue,
  skipAnimation = false,
  showDelta = true
}) => {
  const prefersReducedMotion =
    skipAnimation ||
    (typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const initialDiff = value - baselineValue;
  const [displayValue, setDisplayValue] = useState<number>(() =>
    prefersReducedMotion ? value : baselineValue
  );
  const [delta, setDelta] = useState<number | null>(() =>
    !prefersReducedMotion && initialDiff !== 0 ? initialDiff : null
  );
  const currentShownRef = useRef<number>(prefersReducedMotion ? value : baselineValue);
  const hasMountedRef = useRef<boolean>(false);

  useEffect(() => {
    const startFrom = hasMountedRef.current ? currentShownRef.current : baselineValue;
    hasMountedRef.current = true;

    if (prefersReducedMotion || startFrom === value) {
      currentShownRef.current = value;
      setDisplayValue(value);
      return;
    }

    const diff = value - startFrom;
    setDelta(diff);

    const controls = animate(startFrom, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: latest => {
        const rounded = Math.round(latest);
        currentShownRef.current = rounded;
        setDisplayValue(rounded);
      },
      onComplete: () => {
        currentShownRef.current = value;
        setDisplayValue(value);
      }
    });

    const clearDeltaTimer = window.setTimeout(() => {
      setDelta(null);
    }, 2800);

    return () => {
      controls.stop();
      window.clearTimeout(clearDeltaTimer);
    };
  }, [value, baselineValue, prefersReducedMotion]);

  return (
    <span className="inline-flex items-baseline gap-1.5 tabular-nums">
      <span>{displayValue}</span>
      {showDelta && delta !== null && delta !== 0 && (
        <span
          className="text-xs font-mono font-bold tabular-nums transition-opacity duration-300"
          style={{ color: delta > 0 ? '#10b981' : '#f43f5e' }}
        >
          {delta > 0 ? `+${delta}` : `${delta}`}
        </span>
      )}
    </span>
  );
};

interface DashboardViewProps {
  profile: UserProfile;
  matches: GameHistoryItem[];
  onReviewGame: (game: GameHistoryItem) => void;
  onPlayNewGame: () => void;
  onImportGame: (game: GameHistoryItem) => void;
  onOpenPuzzles: () => void;
  onOpenDailyPuzzle: () => void;
  onOpenVisionTrainer: () => void;
  achievements: AchievementStatus[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  matches,
  onReviewGame,
  onPlayNewGame,
  onImportGame,
  onOpenPuzzles,
  onOpenDailyPuzzle,
  onOpenVisionTrainer,
  achievements
}) => {
  const { theme: currentTheme, pieceSet, settings } = useAppTheme();
  const boardTheme = resolveBoardTheme(settings);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [statsTick, setStatsTick] = useState(0);
  const [dailyPuzzle, setDailyPuzzle] = useState(() => getCachedDailyPuzzle());

  // Capture pre-visit baseline synchronously once so StrictMode double-mount preserves delta
  const initialBaselineRef = useRef<SeenRatingsSnapshot | null>(null);
  if (initialBaselineRef.current === null) {
    const saved = readSeenRatings();
    initialBaselineRef.current = {
      bullet: typeof saved?.bullet === 'number' ? saved.bullet : profile.ratings.bullet,
      blitz: typeof saved?.blitz === 'number' ? saved.blitz : profile.ratings.blitz,
      rapid: typeof saved?.rapid === 'number' ? saved.rapid : profile.ratings.rapid,
      puzzles: typeof saved?.puzzles === 'number' ? saved.puzzles : profile.ratings.puzzles,
      variants: typeof saved?.variants === 'number' ? saved.variants : profile.ratings.variants,
      highestRating:
        typeof saved?.highestRating === 'number' ? saved.highestRating : profile.stats.highestRating
    };
  }

  useEffect(() => {
    const commitTimer = window.setTimeout(() => {
      writeSeenRatings({
        bullet: profile.ratings.bullet,
        blitz: profile.ratings.blitz,
        rapid: profile.ratings.rapid,
        puzzles: profile.ratings.puzzles,
        variants: profile.ratings.variants,
        highestRating: profile.stats.highestRating
      });
    }, 400);
    return () => window.clearTimeout(commitTimer);
  }, [
    profile.ratings.bullet,
    profile.ratings.blitz,
    profile.ratings.rapid,
    profile.ratings.puzzles,
    profile.ratings.variants,
    profile.stats.highestRating
  ]);

  useEffect(() => {
    const onProgress = () => setStatsTick(t => t + 1);
    window.addEventListener(PROGRESS_EVENT, onProgress);
    return () => window.removeEventListener(PROGRESS_EVENT, onProgress);
  }, []);

  useEffect(() => {
    let active = true;
    fetchDailyLichessPuzzle()
      .then(p => {
        if (active) setDailyPuzzle(p);
      })
      .catch(() => {
        // local daily puzzle already loaded
      });
    return () => {
      active = false;
    };
  }, []);

  const dailySummary = useMemo(
    () => computeDailyPuzzleStreak(loadDailyPuzzleStreakState()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statsTick]
  );

  const rushBest = useMemo(() => {
    try {
      return Number(localStorage.getItem('chess_puzzle_rush_best_v1') || '0') || 0;
    } catch {
      return 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statsTick]);

  const visionBest = useMemo(() => loadVisionBestScore(), [statsTick]);

  const dailyPreviewSquares = useMemo(() => {
    try {
      const board = new Chess(dailyPuzzle.fen);
      const ranks = dailyPuzzle.playerColor === 'b' ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1'];
      const files = dailyPuzzle.playerColor === 'b' ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      return ranks.flatMap(r =>
        files.map(f => {
          const sq = `${f}${r}` as Square;
          const piece = board.get(sq);
          const fileIdx = f.charCodeAt(0) - 97;
          const rankIdx = Number(r) - 1;
          const darkSquare = (fileIdx + rankIdx) % 2 === 0;
          return {
            sq,
            isLight: !darkSquare,
            piece
          };
        })
      );
    } catch {
      return [];
    }
  }, [dailyPuzzle]);

  const puzzleAccuracy =
    profile.stats.puzzlesAttempted > 0
      ? Math.round((profile.stats.puzzlesSolved / profile.stats.puzzlesAttempted) * 100)
      : 0;
  const totalGames = Math.max(1, profile.stats.gamesPlayed || matches.length || 1);
  const hasPlayed = (profile.stats.gamesPlayed || matches.length) > 0;
  const wins = profile.stats.wins || 0;
  const draws = profile.stats.draws || 0;
  const losses = profile.stats.losses || 0;

  const winRate = hasPlayed ? Math.round((wins / totalGames) * 100) : 0;
  const drawRate = hasPlayed ? Math.round((draws / totalGames) * 100) : 0;
  const lossRate = hasPlayed ? Math.round((losses / totalGames) * 100) : 0;

  const renderTrendChart = (history: { date: string; elo: number }[]) => {
    if (!history || history.length < 2) {
      return (
        <div
          className="h-32 flex items-center justify-center text-xs italic rounded-xl"
          style={{
            color: currentTheme.textMutedHex,
            backgroundColor: currentTheme.cardSecondaryHex,
            border: `1px dashed ${currentTheme.cardBorderHex}`
          }}
        >
          Complete additional matches to plot live Elo progression
        </div>
      );
    }

    const minElo = Math.min(...history.map(h => h.elo)) - 40;
    const maxElo = Math.max(...history.map(h => h.elo)) + 40;
    const range = Math.max(20, maxElo - minElo);

    const points = history
      .map((h, idx) => {
        const x = (idx / (history.length - 1)) * 300;
        const y = 88 - ((h.elo - minElo) / range) * 76;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="relative w-full h-32 pt-2">
        <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gmChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentTheme.accentHex} stopOpacity="0.32" />
              <stop offset="100%" stopColor={currentTheme.accentHex} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Reference mid-grid lines */}
          <line x1="0" y1="25" x2="300" y2="25" stroke={currentTheme.cardBorderHex} strokeDasharray="3 3" strokeWidth="0.7" />
          <line x1="0" y1="55" x2="300" y2="55" stroke={currentTheme.cardBorderHex} strokeDasharray="3 3" strokeWidth="0.7" />
          <line x1="0" y1="85" x2="300" y2="85" stroke={currentTheme.cardBorderHex} strokeDasharray="3 3" strokeWidth="0.7" />

          <polygon points={`0,100 ${points} 300,100`} fill="url(#gmChartGradient)" />
          <polyline
            fill="none"
            stroke={currentTheme.accentHex}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          {history.map((h, idx) => {
            const x = (idx / (history.length - 1)) * 300;
            const y = 88 - ((h.elo - minElo) / range) * 76;
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="3.2"
                fill={currentTheme.cardHex}
                stroke={currentTheme.accentHex}
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto p-3 sm:p-5" style={{ color: currentTheme.textPrimary }}>
      {/* Profile Hero Strip */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl p-5"
        style={{
          backgroundColor: currentTheme.cardHex,
          border: `1px solid ${currentTheme.cardBorderHex}`
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center p-2 shrink-0"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              border: `1px solid ${currentTheme.cardBorderHex}`
            }}
          >
            <ChessPieceIcon type="n" color="w" set={pieceSet} />
          </div>
          <div>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight" style={{ color: currentTheme.textPrimary }}>
                {profile.username}
              </h1>
              <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.accentHex }}>
                {profile.title || 'NM'}
              </span>
            </div>
            <p className="text-xs mt-0.5 tabular-nums" style={{ color: currentTheme.textMutedHex }}>
              {profile.stats.gamesPlayed} Games Logged · Peak Rating{' '}
              <AnimatedRatingNumber
                value={profile.stats.highestRating}
                baselineValue={initialBaselineRef.current.highestRating}
                skipAnimation={settings.batterySaver}
                showDelta={false}
              />
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlayNewGame}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition whitespace-nowrap active:scale-[0.98] cursor-pointer"
          style={{
            backgroundColor: currentTheme.accentHex,
            color: currentTheme.accentTextHex
          }}
        >
          <Swords className="w-4 h-4" />
          Play Match
        </button>
      </div>

      {/* Ratings Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          {
            label: 'Bullet',
            elo: profile.ratings.bullet,
            baseline: initialBaselineRef.current.bullet,
            icon: <Zap className="w-4 h-4" style={{ color: '#D97706' }} />,
            highlight: false
          },
          {
            label: 'Blitz',
            elo: profile.ratings.blitz,
            baseline: initialBaselineRef.current.blitz,
            icon: <Clock className="w-4 h-4" style={{ color: '#EA580C' }} />,
            highlight: false
          },
          {
            label: 'Rapid',
            elo: profile.ratings.rapid,
            baseline: initialBaselineRef.current.rapid,
            icon: <TrendingUp className="w-4 h-4" style={{ color: currentTheme.accentHex }} />,
            highlight: true
          },
          {
            label: 'Puzzles',
            elo: profile.ratings.puzzles,
            baseline: initialBaselineRef.current.puzzles,
            icon: <Trophy className="w-4 h-4" style={{ color: '#2563EB' }} />,
            highlight: false
          },
          {
            label: 'Variants',
            elo: profile.ratings.variants,
            baseline: initialBaselineRef.current.variants,
            icon: <Sparkles className="w-4 h-4" style={{ color: '#7C3AED' }} />,
            highlight: false
          }
        ].map(item => (
          <div
            key={item.label}
            className="rounded-xl p-4"
            style={{
              backgroundColor: currentTheme.cardHex,
              border: `1px solid ${item.highlight ? currentTheme.accentHex + '60' : currentTheme.cardBorderHex}`
            }}
          >
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold" style={{ color: currentTheme.textMutedHex }}>
              <span>{item.label}</span>
              {item.icon}
            </div>
            <div
              className="text-2xl font-bold font-mono tabular-nums tracking-tight"
              style={{ color: item.highlight ? currentTheme.accentHex : currentTheme.textPrimary }}
            >
              <AnimatedRatingNumber
                value={item.elo}
                baselineValue={item.baseline}
                skipAnimation={settings.batterySaver}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Daily Puzzle Streak & Today's Daily Challenge Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Daily Puzzle Streak Statistics Area */}
        <section
          aria-label="Daily Puzzle Streak"
          className="lg:col-span-7 rounded-xl p-5 flex flex-col justify-between gap-4"
          style={{
            backgroundColor: currentTheme.cardHex,
            border: `1px solid ${dailySummary.solvedToday ? currentTheme.accentHex + '65' : currentTheme.cardBorderHex}`
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: dailySummary.currentStreak > 0 ? '#f9731618' : currentTheme.cardSecondaryHex,
                  border: `1px solid ${dailySummary.currentStreak > 0 ? '#f9731655' : currentTheme.cardBorderHex}`
                }}
              >
                <Flame
                  className="w-6 h-6"
                  style={{ color: dailySummary.currentStreak > 0 ? '#f97316' : currentTheme.textMutedHex }}
                />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.textMutedHex }}>
                  Daily Puzzle Streak
                </div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span
                    className="font-display text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight"
                    style={{ color: dailySummary.currentStreak > 0 ? '#f97316' : currentTheme.textPrimary }}
                  >
                    {dailySummary.currentStreak} {dailySummary.currentStreak === 1 ? 'Day' : 'Days'}
                  </span>
                  <span className="text-xs font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>
                    Best {dailySummary.bestStreak}d · {dailySummary.totalActiveDays} active days
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className="text-xs font-bold flex items-center gap-1.5 justify-end"
                style={{
                  color: dailySummary.solvedToday
                    ? '#10b981'
                    : dailySummary.atRisk
                    ? '#f59e0b'
                    : currentTheme.textSecondary
                }}
              >
                {dailySummary.solvedToday && <Check className="w-3.5 h-3.5" />}
                <span>
                  {dailySummary.solvedToday
                    ? 'Solved Today · Streak Active'
                    : dailySummary.atRisk
                    ? 'Solve 1 puzzle today to keep streak'
                    : 'Solve a puzzle today to start'}
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Activity Tracker */}
          <div className="grid grid-cols-7 gap-2">
            {dailySummary.last7Days.map(day => (
              <div
                key={day.dateKey}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition"
                style={{
                  backgroundColor: day.solved ? `${currentTheme.accentHex}18` : currentTheme.cardSecondaryHex,
                  borderColor: day.isToday
                    ? currentTheme.accentHex
                    : day.solved
                    ? `${currentTheme.accentHex}55`
                    : currentTheme.cardBorderHex
                }}
                title={`${day.dateKey}: ${day.solved ? 'Puzzle solved' : 'No puzzle solved yet'}`}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: day.isToday ? currentTheme.accentHex : currentTheme.textMutedHex }}
                >
                  {day.label}
                </span>
                <div className="mt-1.5 w-6 h-6 rounded-md flex items-center justify-center">
                  {day.solved ? (
                    <Check className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
                  ) : (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: currentTheme.cardBorderHex }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tactical & Training Quick Telemetry */}
          <div
            className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs"
            style={{ borderTop: `1px solid ${currentTheme.cardBorderHex}` }}
          >
            <div className="flex flex-wrap items-center gap-3 font-mono tabular-nums" style={{ color: currentTheme.textSecondary }}>
              <span>
                Accuracy <strong style={{ color: currentTheme.textPrimary }}>{puzzleAccuracy}%</strong>
              </span>
              <span style={{ color: currentTheme.cardBorderHex }}>·</span>
              <span>
                Rush Best <strong style={{ color: currentTheme.accentHex }}>{rushBest}</strong>
              </span>
              <span style={{ color: currentTheme.cardBorderHex }}>·</span>
              <span>
                Vision Best <strong style={{ color: currentTheme.accentHex }}>{visionBest}/30s</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenVisionTrainer}
                className="inline-flex items-center gap-1 text-xs font-bold hover:underline cursor-pointer"
                style={{ color: currentTheme.textSecondary }}
              >
                <Crosshair className="w-3.5 h-3.5" style={{ color: currentTheme.accentHex }} />
                <span>Vision Drill</span>
              </button>
              <button
                type="button"
                onClick={onOpenPuzzles}
                className="inline-flex items-center gap-1 text-xs font-bold hover:underline cursor-pointer"
                style={{ color: currentTheme.accentHex }}
              >
                <Target className="w-3.5 h-3.5" />
                <span>All Puzzles</span>
              </button>
            </div>
          </div>
        </section>

        {/* Today's Daily Puzzle Spotlight */}
        <section
          aria-label="Today's Daily Puzzle"
          className="lg:col-span-5 rounded-xl p-5 flex items-center gap-4"
          style={{
            backgroundColor: currentTheme.cardHex,
            border: `1px solid ${currentTheme.cardBorderHex}`
          }}
        >
          {/* Mini Tactical Preview Board */}
          <button
            type="button"
            onClick={onOpenDailyPuzzle}
            aria-label="Open Today's Daily Puzzle"
            className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden border grid grid-cols-8 grid-rows-8 hover:scale-[1.02] transition cursor-pointer"
            style={{ borderColor: currentTheme.cardBorderHex }}
          >
            {dailyPreviewSquares.map(cell => (
              <div
                key={cell.sq}
                className="flex items-center justify-center"
                style={{
                  backgroundColor: cell.isLight ? boardTheme.lightHex : boardTheme.darkHex
                }}
              >
                {cell.piece && (
                  <div className="w-[82%] h-[82%]">
                    <ChessPieceIcon type={cell.piece.type} color={cell.piece.color} set={pieceSet} />
                  </div>
                )}
              </div>
            ))}
          </button>

          <div className="min-w-0 flex-1 flex flex-col justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.accentHex }}>
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Daily Puzzle</span>
              </div>
              <h2 className="font-display text-sm sm:text-base font-bold mt-0.5 truncate" style={{ color: currentTheme.textPrimary }}>
                {dailyPuzzle.theme.replace(/^Daily Challenge · /, '')}
              </h2>
              <p className="text-xs font-mono tabular-nums mt-0.5" style={{ color: currentTheme.textMutedHex }}>
                Elo {dailyPuzzle.rating} · {dailyPuzzle.playerColor === 'w' ? 'White to move' : 'Black to move'}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenDailyPuzzle}
              className="w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: dailySummary.dailyChallengeSolvedToday ? currentTheme.cardSecondaryHex : currentTheme.accentHex,
                border: dailySummary.dailyChallengeSolvedToday ? `1px solid ${currentTheme.accentHex}55` : 'none',
                color: dailySummary.dailyChallengeSolvedToday ? currentTheme.accentHex : currentTheme.accentTextHex
              }}
            >
              {dailySummary.dailyChallengeSolvedToday ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Solved Today · Replay</span>
                </>
              ) : (
                <>
                  <span>Solve Daily Puzzle</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </section>
      </div>

      {/* Analytics & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Rating Trend Chart */}
        <div
          className="lg:col-span-8 rounded-xl p-5 flex flex-col justify-between"
          style={{
            backgroundColor: currentTheme.cardHex,
            border: `1px solid ${currentTheme.cardBorderHex}`
          }}
        >
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <div>
              <h2 className="font-display text-sm font-bold flex items-center gap-2" style={{ color: currentTheme.textPrimary }}>
                <TrendingUp className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
                Rapid Rating Trajectory
              </h2>
              <p className="text-xs mt-0.5" style={{ color: currentTheme.textMutedHex }}>
                Elo curve recorded across local & custom engine sessions
              </p>
            </div>
            <div className="text-xs font-mono font-bold tabular-nums shrink-0" style={{ color: currentTheme.accentHex }}>
              Peak{' '}
              <AnimatedRatingNumber
                value={profile.stats.highestRating}
                baselineValue={initialBaselineRef.current.highestRating}
                skipAnimation={settings.batterySaver}
                showDelta={false}
              />
            </div>
          </div>

          {renderTrendChart(profile.ratingHistory.rapid)}
        </div>

        {/* Win/Loss Distribution */}
        <div
          className="lg:col-span-4 rounded-xl p-5 flex flex-col justify-between"
          style={{
            backgroundColor: currentTheme.cardHex,
            border: `1px solid ${currentTheme.cardBorderHex}`
          }}
        >
          <div>
            <h2 className="font-display text-sm font-bold mb-0.5" style={{ color: currentTheme.textPrimary }}>
              Match Distribution
            </h2>
            <p className="text-xs mb-4" style={{ color: currentTheme.textMutedHex }}>
              Cumulative outcome split
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold" style={{ color: currentTheme.accentHex }}>Wins ({wins})</span>
                  <span className="font-mono tabular-nums" style={{ color: currentTheme.textPrimary }}>{winRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.cardSecondaryHex }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${winRate}%`, backgroundColor: currentTheme.accentHex }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold" style={{ color: currentTheme.textMutedHex }}>Draws ({draws})</span>
                  <span className="font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>{drawRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.cardSecondaryHex }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${drawRate}%`, backgroundColor: currentTheme.textMutedHex }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold" style={{ color: '#E11D48' }}>Losses ({losses})</span>
                  <span className="font-mono tabular-nums" style={{ color: '#E11D48' }}>{lossRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.cardSecondaryHex }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${lossRate}%`, backgroundColor: '#E11D48' }} />
                </div>
              </div>
            </div>
          </div>

          <div
            className="pt-3 text-xs flex items-center justify-between font-mono tabular-nums mt-4"
            style={{
              borderTop: `1px solid ${currentTheme.cardBorderHex}`,
              color: currentTheme.textMutedHex
            }}
          >
            <span>Puzzles Solved</span>
            <span className="font-bold" style={{ color: currentTheme.textPrimary }}>{profile.stats.puzzlesSolved}</span>
          </div>
        </div>
      </div>

      <AchievementsPanel statuses={achievements} />

      {/* Historical Matches Archive */}
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: currentTheme.cardHex,
          border: `1px solid ${currentTheme.cardBorderHex}`
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
            <h2 className="font-display text-base font-bold" style={{ color: currentTheme.textPrimary }}>
              Historical Match Archive
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>
              {matches.length} Matches Saved
            </span>
            <button
              type="button"
              onClick={() => setIsImportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-90"
              style={{ backgroundColor: currentTheme.accentHex, color: currentTheme.accentTextHex }}
            >
              <FileUp className="w-3.5 h-3.5" />
              Import PGN
            </button>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-10 text-xs italic" style={{ color: currentTheme.textMutedHex }}>
            No matches recorded yet. Play a match, or import a PGN to review a game from another site.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" style={{ color: currentTheme.textPrimary }}>
              <thead
                className="font-semibold uppercase text-[10px] tracking-wider"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  color: currentTheme.textMutedHex,
                  borderBottom: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Variant</th>
                  <th className="py-2.5 px-3">Opponent</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Result</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="font-medium">
                {matches.map(game => {
                  const isWin =
                    (game.result === '1-0' && game.playerColor === 'w') ||
                    (game.result === '0-1' && game.playerColor === 'b');
                  const isDraw = game.result === '1/2-1/2';
                  const resultColor = isWin ? '#059669' : isDraw ? '#D97706' : '#E11D48';

                  return (
                    <tr
                      key={game.id}
                      className="transition hover:opacity-90"
                      style={{ borderBottom: `1px solid ${currentTheme.cardBorderHex}55` }}
                    >
                      <td className="py-3 px-3 font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>
                        {game.date}
                      </td>
                      <td className="py-3 px-3 font-semibold" style={{ color: currentTheme.textPrimary }}>
                        {getVariantDisplayName(game.variant)}
                      </td>
                      <td className="py-3 px-3 font-semibold tabular-nums" style={{ color: currentTheme.textPrimary }}>
                        {game.opponentName} ({game.opponentElo})
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>
                        {game.timeControl}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold tabular-nums" style={{ color: resultColor }}>
                        {game.result}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold tabular-nums" style={{ color: currentTheme.accentHex }}>
                        {game.playerAccuracy ? `${game.playerAccuracy.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onReviewGame(game)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                          style={{
                            backgroundColor: `${currentTheme.accentHex}18`,
                            color: currentTheme.accentHex,
                            border: `1px solid ${currentTheme.accentHex}35`
                          }}
                        >
                          <span>Analyze</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ImportPgnModal
        isOpen={isImportOpen}
        username={profile.username}
        onClose={() => setIsImportOpen(false)}
        onImported={game => {
          setIsImportOpen(false);
          onImportGame(game);
        }}
      />
    </div>
  );
};
