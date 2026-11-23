import React, { useEffect, useMemo, useState } from 'react';
import { Chess, Square } from 'chess.js';
import {
  Swords,
  Zap,
  Clock,
  Cpu,
  Users,
  Trophy,
  Compass,
  Brain,
  GraduationCap,
  Smartphone,
  ChevronRight,
  Flame,
  Calendar,
  BookOpen,
  Target,
  Crosshair,
  History,
  Check,
  PenTool,
  Microscope,
  Globe
} from 'lucide-react';
import { UserProfile, GameHistoryItem, VariantId } from '../types/chess';
import { AppTab, QuickPlayRequest } from './AppViewProps';
import { useAppTheme } from '../context/ThemeContext';
import { resolveBoardTheme } from '../theme/themes';
import { ChessPieceIcon } from './ChessPieces';
import { getVariantDisplayName } from '../engine/variants';
import {
  getCachedDailyPuzzle,
  fetchDailyLichessPuzzle,
  formatPuzzleThemeLabel
} from '../engine/puzzles';
import { computeDailyPuzzleStreak, loadDailyPuzzleStreakState } from '../engine/dailyPuzzleStreak';
import { TrainSection } from './TrainView';

interface HomeViewProps {
  profile: UserProfile;
  matches: GameHistoryItem[];
  onQuickPlay: (req: Omit<QuickPlayRequest, 'key'>) => void;
  onSelectTab: (tab: AppTab) => void;
  onSelectVariant: (variantId: VariantId) => void;
  onOpenDailyPuzzle: () => void;
  onOpenTrainSection: (section: TrainSection) => void;
  onReviewGame: (game: GameHistoryItem) => void;
  onOpenApkModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  matches,
  onQuickPlay,
  onSelectTab,
  onSelectVariant,
  onOpenDailyPuzzle,
  onOpenTrainSection,
  onReviewGame,
  onOpenApkModal
}) => {
  const { theme, pieceSet, settings } = useAppTheme();
  const boardTheme = resolveBoardTheme(settings);
  const [dailyPuzzle, setDailyPuzzle] = useState(() => getCachedDailyPuzzle());
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [puzzlesImgFailed, setPuzzlesImgFailed] = useState(false);
  const [variantsImgFailed, setVariantsImgFailed] = useState(false);
  const [androidImgFailed, setAndroidImgFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetchDailyLichessPuzzle()
      .then(p => {
        if (active) setDailyPuzzle(p);
      })
      .catch(() => {
        // local cached daily puzzle remains active
      });
    return () => {
      active = false;
    };
  }, []);

  const dailySummary = useMemo(() => computeDailyPuzzleStreak(loadDailyPuzzleStreakState()), []);

  const dailyPreviewSquares = useMemo(() => {
    try {
      const board = new Chess(dailyPuzzle.fen);
      const ranks =
        dailyPuzzle.playerColor === 'b'
          ? ['1', '2', '3', '4', '5', '6', '7', '8']
          : ['8', '7', '6', '5', '4', '3', '2', '1'];
      const files =
        dailyPuzzle.playerColor === 'b'
          ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
          : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
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

  const recentMatches = matches.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-3 sm:px-6 py-5" style={{ color: theme.textPrimary }}>
      {/* Hero Arena Section (Chess.com + Lichess oriented Quick Pairing & Showcase) */}
      <section
        aria-label="Play Chess Hero"
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
      >
        {/* Left: Editorial Hero & Instant Quick-Pairing Controls */}
        <div
          className="lg:col-span-7 rounded-2xl p-5 sm:p-7 border flex flex-col justify-between gap-6"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider" style={{ color: theme.accentHex }}>
              <span>Stockfish 19 WASM</span>
              <span style={{ color: theme.cardBorderHex }}>·</span>
              <span>36 Variants</span>
              <span style={{ color: theme.cardBorderHex }}>·</span>
              <span>Offline Ready</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.08]" style={{ color: theme.textPrimary }}>
              Play Chess.{' '}
              <span style={{ color: theme.accentHex }}>Train Smarter.</span>
            </h1>

            <p className="text-sm sm:text-base max-w-xl leading-relaxed" style={{ color: theme.textSecondary }}>
              Challenge calibrated AI personalities from 100 to 3600 Elo, solve adaptive tactical puzzles, master Chaturanga &amp; 35 other variants, and review every game with zero latency.
            </p>
          </div>

          {/* Quick-Pairing Grid (Chess.com / Lichess inspired) */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => onQuickPlay({ presetId: 'rapid_10_0', mode: 'online', variant: 'standard' })}
                className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl font-bold text-left transition hover:opacity-95 active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: theme.accentHex,
                  color: theme.accentTextHex
                }}
              >
                <div>
                  <div className="font-display text-sm font-extrabold">Play Online</div>
                  <div className="font-mono text-[11px] opacity-85">Classic · Any Clock</div>
                </div>
                <Globe className="w-5 h-5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onQuickPlay({ presetId: 'rapid_10_0', mode: 'ai', variant: 'standard' })}
                className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border font-bold text-left transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                <div>
                  <div className="font-display text-sm font-bold">Rapid 10+0</div>
                  <div className="font-mono text-[11px]" style={{ color: theme.textMutedHex }}>vs Engine AI</div>
                </div>
                <Swords className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
              </button>

              <button
                type="button"
                onClick={() => onQuickPlay({ presetId: 'blitz_3_2', mode: 'ai', variant: 'standard' })}
                className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border font-bold text-left transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                <div>
                  <div className="font-display text-sm font-bold">Blitz 3+2</div>
                  <div className="font-mono text-[11px]" style={{ color: theme.textMutedHex }}>Fast Tactics</div>
                </div>
                <Clock className="w-4 h-4 shrink-0 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => onQuickPlay({ presetId: 'bullet_1_0', mode: 'ai', variant: 'standard' })}
                className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border font-bold text-left transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                <div>
                  <div className="font-display text-sm font-bold">Bullet 1+0</div>
                  <div className="font-mono text-[11px]" style={{ color: theme.textMutedHex }}>Ultra Speed</div>
                </div>
                <Zap className="w-4 h-4 shrink-0 text-orange-400" />
              </button>

              <button
                type="button"
                onClick={() => onQuickPlay({ presetId: 'rapid_10_0', mode: 'coach', variant: 'standard' })}
                className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border font-bold text-left transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                <div>
                  <div className="font-display text-sm font-bold">Coach Game</div>
                  <div className="font-mono text-[11px]" style={{ color: theme.textMutedHex }}>Live Tutor</div>
                </div>
                <GraduationCap className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
              </button>

              <button
                type="button"
                onClick={() => onQuickPlay({ presetId: 'rapid_10_0', mode: 'local_2p', variant: 'standard' })}
                className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border font-bold text-left transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                <div>
                  <div className="font-display text-sm font-bold">Pass &amp; Play</div>
                  <div className="font-mono text-[11px]" style={{ color: theme.textMutedHex }}>2 Players</div>
                </div>
                <Users className="w-4 h-4 shrink-0 text-sky-400" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenApkModal}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border font-bold text-left transition hover:opacity-90 active:scale-[0.99] cursor-pointer"
              style={{
                backgroundColor: `${theme.accentHex}16`,
                borderColor: `${theme.accentHex}55`,
                color: theme.textPrimary
              }}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
                <div>
                  <div className="font-display text-xs sm:text-sm font-bold">Install Android App &amp; WebAPK</div>
                  <div className="font-mono text-[11px]" style={{ color: theme.accentHex }}>
                    Synced Online Classic Multiplayer + Full Offline Studio
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
            </button>
          </div>
        </div>

        {/* Right: Hero Arena Artwork + Daily Challenge Spotlight */}
        <div
          className="lg:col-span-5 rounded-2xl overflow-hidden border relative flex flex-col justify-between min-h-[280px]"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: theme.cardBorderHex
          }}
        >
          {!heroImgFailed ? (
            <img
              src="/src/assets/images/hero_chess_arena_1795459574559.jpg"
              alt="Grandmaster Studio tournament chessboard"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 75% 25%, ${theme.accentHex}30, ${theme.cardSecondaryHex} 75%)`
              }}
            />
          )}

          {/* Contrast Scrim */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(7,11,18,0.72) 0%, rgba(7,11,18,0.28) 38%, rgba(7,11,18,0.95) 100%)'
            }}
          />

          {/* Top Bar on Hero Visual */}
          <div className="relative z-10 p-4 flex items-center justify-between text-xs font-mono font-bold text-slate-100">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
              <span>{profile.username}</span>
              <span style={{ color: theme.accentHex }}>{profile.title || 'NM'}</span>
            </span>
            <span className="tabular-nums" style={{ color: theme.accentHex }}>
              {profile.ratings.rapid} Rapid Elo
            </span>
          </div>

          {/* Bottom Interactive Daily Puzzle Overlay Card */}
          <div className="relative z-10 p-4 sm:p-5 flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenDailyPuzzle}
              aria-label="Open Daily Puzzle"
              className="w-24 h-24 shrink-0 rounded-lg overflow-hidden border grid grid-cols-8 grid-rows-8 hover:scale-[1.03] transition cursor-pointer shadow-xl"
              style={{ borderColor: 'rgba(255,255,255,0.22)' }}
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
                    <div className="w-[84%] h-[84%]">
                      <ChessPieceIcon type={cell.piece.type} color={cell.piece.color} set={pieceSet} />
                    </div>
                  )}
                </div>
              ))}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: theme.accentHex }}>
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Daily Puzzle</span>
                {dailySummary.currentStreak > 0 && (
                  <span className="inline-flex items-center gap-1 text-orange-400">
                    · <Flame className="w-3 h-3" /> {dailySummary.currentStreak}d
                  </span>
                )}
              </div>
              <h2 className="font-display text-base sm:text-lg font-extrabold text-white truncate mt-0.5">
                {formatPuzzleThemeLabel(dailyPuzzle.theme)}
              </h2>
              <p className="text-xs font-mono text-slate-300 tabular-nums mt-0.5">
                Elo {dailyPuzzle.rating} · {dailyPuzzle.playerColor === 'w' ? 'White to move' : 'Black to move'}
              </p>
              <button
                type="button"
                onClick={onOpenDailyPuzzle}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition hover:opacity-90 cursor-pointer"
                style={{
                  backgroundColor: theme.accentHex,
                  color: theme.accentTextHex
                }}
              >
                {dailySummary.dailyChallengeSolvedToday ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Solved · Replay</span>
                  </>
                ) : (
                  <>
                    <span>Solve Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid (Chess.com / Lichess Showcase Cards) */}
      <section aria-label="Studio Pillars" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Tactics & Puzzles */}
        <div
          className="rounded-2xl overflow-hidden border flex flex-col justify-between"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <div className="relative h-40 overflow-hidden" style={{ backgroundColor: theme.cardSecondaryHex }}>
            {!puzzlesImgFailed && (
              <img
                src="/src/assets/images/puzzles_tactics_board_1795460453585.jpg"
                alt="Chess tactics board with glowing arrow paths and digital clock"
                referrerPolicy="no-referrer"
                onError={() => setPuzzlesImgFailed(true)}
                className="w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(7,11,18,0.10) 0%, rgba(7,11,18,0.88) 100%)'
              }}
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span className="font-display font-extrabold text-base text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Puzzles &amp; Rush
              </span>
              <span className="font-mono text-xs font-bold tabular-nums text-amber-300">
                {profile.ratings.puzzles} Elo
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col justify-between flex-1 gap-3">
            <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
              1,030+ curated tactical positions calibrated to your Elo, 3-minute Puzzle Rush survival, and spaced-repetition review.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectTab('puzzles')}
                className="flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition hover:opacity-90 cursor-pointer"
                style={{
                  backgroundColor: theme.accentHex,
                  color: theme.accentTextHex
                }}
              >
                <span>Solve Puzzles</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onOpenTrainSection('vision')}
                className="py-2 px-3 rounded-lg border font-semibold text-xs transition hover:opacity-85 cursor-pointer"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                Vision 30s
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: 36 Variants & Custom Studio */}
        <div
          className="rounded-2xl overflow-hidden border flex flex-col justify-between"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <div className="relative h-40 overflow-hidden" style={{ backgroundColor: theme.cardSecondaryHex }}>
            {!variantsImgFailed && (
              <img
                src="/src/assets/images/variants_studio_grid_1795460453719.jpg"
                alt="Custom geometric rectangular and hexagonal chess variant boards"
                referrerPolicy="no-referrer"
                onError={() => setVariantsImgFailed(true)}
                className="w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(7,11,18,0.10) 0%, rgba(7,11,18,0.88) 100%)'
              }}
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span className="font-display font-extrabold text-base text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-violet-400" />
                36 Variants &amp; Studio
              </span>
              <span className="font-mono text-xs font-bold tabular-nums text-violet-300">
                {profile.ratings.variants} Elo
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col justify-between flex-1 gap-3">
            <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
              Play ancient Chaturanga, Chess960, Atomic, Crazyhouse, Fog of War, Duck Chess, or craft custom fairy boards up to 10×10.
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['chaturanga', 'chess960', 'atomic'] as VariantId[]).map(vId => (
                <button
                  key={vId}
                  type="button"
                  onClick={() => onSelectVariant(vId)}
                  className="px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition hover:opacity-85 cursor-pointer"
                  style={{
                    backgroundColor: theme.cardSecondaryHex,
                    borderColor: theme.cardBorderHex,
                    color: theme.textPrimary
                  }}
                >
                  {getVariantDisplayName(vId)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onSelectTab('variants')}
                className="ml-auto inline-flex items-center gap-1 text-xs font-bold hover:underline cursor-pointer"
                style={{ color: theme.accentHex }}
              >
                <span>All 36</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Android App & APK Download */}
        <div
          className="rounded-2xl overflow-hidden border flex flex-col justify-between"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: `${theme.accentHex}55`
          }}
        >
          <div className="relative h-40 overflow-hidden" style={{ backgroundColor: theme.cardSecondaryHex }}>
            {!androidImgFailed && (
              <img
                src="/src/assets/images/android_mobile_chess_1795461085065.jpg"
                alt="Matte black smartphone displaying dark emerald chessboard UI beside clocks on obsidian desk"
                referrerPolicy="no-referrer"
                onError={() => setAndroidImgFailed(true)}
                className="w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(7,11,18,0.10) 0%, rgba(7,11,18,0.90) 100%)'
              }}
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span className="font-display font-extrabold text-base text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4" style={{ color: theme.accentHex }} />
                Android App &amp; APK
              </span>
              <span className="font-mono text-[11px] font-bold" style={{ color: theme.accentHex }}>
                Chess.com UI
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col justify-between flex-1 gap-3">
            <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
              All features sized cleanly for Android in a familiar Chess.com interface. Install directly as a standalone offline Android WebAPK.
            </p>
            <button
              type="button"
              onClick={onOpenApkModal}
              className="w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: theme.accentHex,
                color: theme.accentTextHex
              }}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install Android APK</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom 2-Column Workspace: Training Suite & Recent Archive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Learn & Improve (Lichess Learn / Chess.com Lessons style) */}
        <section
          aria-label="Learn and Train"
          className="lg:col-span-5 rounded-2xl p-5 border flex flex-col justify-between gap-4"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold" style={{ color: theme.textPrimary }}>
                Learn &amp; Improve
              </h2>
              <p className="text-xs" style={{ color: theme.textMutedHex }}>
                Structured training modules &amp; grandmaster feedback
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('train')}
              className="text-xs font-bold hover:underline cursor-pointer"
              style={{ color: theme.accentHex }}
            >
              Open Hub →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                label: 'Opening Lines',
                sub: 'Repertoire drill',
                icon: <BookOpen className="w-4 h-4" style={{ color: theme.accentHex }} />,
                onClick: () => onOpenTrainSection('openings')
              },
              {
                label: 'Endgame Lab',
                sub: 'Lucena & Philidor',
                icon: <Target className="w-4 h-4 text-amber-400" />,
                onClick: () => onOpenTrainSection('endgames')
              },
              {
                label: 'Coordinate Vision',
                sub: '30s blind sprint',
                icon: <Crosshair className="w-4 h-4 text-sky-400" />,
                onClick: () => onOpenTrainSection('vision')
              },
              {
                label: 'Board Editor',
                sub: 'FEN setup studio',
                icon: <PenTool className="w-4 h-4 text-emerald-400" />,
                onClick: () => onOpenTrainSection('editor')
              },
              {
                label: 'Analysis & Book',
                sub: 'Opening explorer',
                icon: <Microscope className="w-4 h-4 text-cyan-400" />,
                onClick: () => onOpenTrainSection('analysis')
              },
              {
                label: 'AI Strategy Coach',
                sub: 'Position decoder',
                icon: <Brain className="w-4 h-4 text-violet-400" />,
                onClick: () => onSelectTab('coach')
              }
            ].map(tool => (
              <button
                key={tool.label}
                type="button"
                onClick={tool.onClick}
                className="p-3 rounded-xl border text-left transition hover:opacity-90 flex items-start gap-2.5 cursor-pointer"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex
                }}
              >
                <div className="mt-0.5 shrink-0">{tool.icon}</div>
                <div className="min-w-0">
                  <div className="font-bold text-xs truncate" style={{ color: theme.textPrimary }}>
                    {tool.label}
                  </div>
                  <div className="text-[11px] truncate" style={{ color: theme.textMutedHex }}>
                    {tool.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Player Rating Strip */}
          <div
            className="pt-3 border-t grid grid-cols-4 gap-2 text-center font-mono tabular-nums"
            style={{ borderColor: theme.cardBorderHex }}
          >
            {[
              { label: 'Bullet', val: profile.ratings.bullet },
              { label: 'Blitz', val: profile.ratings.blitz },
              { label: 'Rapid', val: profile.ratings.rapid },
              { label: 'Puzzles', val: profile.ratings.puzzles }
            ].map(r => (
              <div key={r.label}>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
                  {r.label}
                </div>
                <div className="text-sm font-extrabold" style={{ color: theme.textPrimary }}>
                  {r.val}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Recent Matches & Instant Game Review */}
        <section
          aria-label="Recent Games"
          className="lg:col-span-7 rounded-2xl p-5 border flex flex-col justify-start gap-4"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" style={{ color: theme.accentHex }} />
              <div>
                <h2 className="font-display text-base font-bold" style={{ color: theme.textPrimary }}>
                  Recent Games
                </h2>
                <p className="text-xs" style={{ color: theme.textMutedHex }}>
                  Jump straight into Stockfish move-by-move accuracy review
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className="text-xs font-bold hover:underline cursor-pointer"
              style={{ color: theme.accentHex }}
            >
              Full Archive ({matches.length}) →
            </button>
          </div>

          {recentMatches.length === 0 ? (
            <div className="py-8 text-center text-xs" style={{ color: theme.textMutedHex }}>
              No games played yet. Launch a Rapid or Blitz match above to record your first game.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: theme.cardBorderHex }}>
              {recentMatches.map(game => {
                const isWin =
                  (game.result === '1-0' && game.playerColor === 'w') ||
                  (game.result === '0-1' && game.playerColor === 'b');
                const isDraw = game.result === '1/2-1/2';
                const resultColor = isWin ? '#10b981' : isDraw ? '#f59e0b' : '#f43f5e';
                return (
                  <div
                    key={game.id}
                    className="py-2.5 flex items-center justify-between gap-3 text-xs"
                    style={{ borderColor: `${theme.cardBorderHex}66` }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold truncate" style={{ color: theme.textPrimary }}>
                          vs {game.opponentName}
                        </span>
                        <span className="font-mono text-[11px]" style={{ color: theme.textMutedHex }}>
                          ({game.opponentElo})
                        </span>
                      </div>
                      <div className="text-[11px] font-mono mt-0.5 truncate" style={{ color: theme.textMutedHex }}>
                        {getVariantDisplayName(game.variant)} · {game.timeControl} · {game.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right font-mono tabular-nums">
                        <div className="font-bold" style={{ color: resultColor }}>
                          {game.result}
                        </div>
                        {typeof game.playerAccuracy === 'number' && (
                          <div className="text-[10px]" style={{ color: theme.accentHex }}>
                            {game.playerAccuracy.toFixed(1)}%
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onReviewGame(game)}
                        className="px-3 py-1.5 rounded-lg border font-semibold text-xs transition hover:opacity-85 cursor-pointer whitespace-nowrap"
                        style={{
                          backgroundColor: theme.cardSecondaryHex,
                          borderColor: theme.cardBorderHex,
                          color: theme.accentHex
                        }}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
