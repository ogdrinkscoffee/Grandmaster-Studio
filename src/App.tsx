import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { animate } from 'motion/react';
import {
  UserProfile,
  GameHistoryItem,
  UserSettings,
  VariantId,
  CustomVariantConfig,
  AppThemeId,
  OpponentMode
} from './types/chess';
import { PlayView } from './components/PlayView';
import { VariantsView } from './components/VariantsView';
import { PuzzlesView } from './components/PuzzlesView';
import { GameReviewView } from './components/GameReviewView';
import { CoachView } from './components/CoachView';
import { TrainView, TrainSection } from './components/TrainView';
import { GlobalSearch } from './components/GlobalSearch';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { SearchActionTarget } from './engine/globalSearch';
import { hasOpenModalDialog, resolveGlobalNavigationShortcut } from './engine/keyboardShortcuts';
import { warmUpEngine } from './engine/engineClient';
import { AchievementToast } from './components/Achievements';
import {
  ACHIEVEMENTS_KEY,
  AchievementDef,
  PROGRESS_EVENT,
  buildAchievementContext,
  evaluateAchievements,
  loadUnlockDates,
  saveUnlockDates
} from './engine/achievements';
import { ENDGAME_PROGRESS_KEY } from './engine/endgameDrills';
import { OPENING_PROGRESS_KEY } from './engine/openingRepertoire';
import { DAILY_STREAK_STORAGE_KEY, VISION_BEST_STORAGE_KEY } from './engine/dailyPuzzleStreak';
import { AdaptivePosture, DEFEATED_BOTS_STORAGE_KEY } from './engine/adaptiveBot';
import { DASHBOARD_SEEN_RATINGS_KEY, DashboardView } from './components/DashboardView';
import { SettingsModal } from './components/SettingsModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { ChessPieceIcon } from './components/ChessPieces';
import { variantToCustomConfig, CUSTOM_ENGINE_VARIANTS } from './engine/customVariantEngine';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import {
  Swords,
  Compass,
  Trophy,
  Brain,
  BarChart3,
  Settings,
  BatteryCharging,
  WifiOff,
  Palette,
  Sun,
  Moon,
  GraduationCap,
  Keyboard
} from 'lucide-react';
import { getAppTheme, APP_THEME_FAMILIES, normalizeThemeSettings } from './theme/themes';
import { ThemeProvider } from './context/ThemeContext';

type AppTab = 'play' | 'variants' | 'puzzles' | 'train' | 'review' | 'coach' | 'dashboard';

const DEFAULT_SETTINGS: UserSettings = {
  appTheme: 'emerald_studio',
  colorMode: 'dark',
  boardTheme: 'emerald',
  matchBoardToPieces: true,
  customBoards: [],
  pieceSet: 'neo',
  kingFinial: 'crescent',
  soundEnabled: true,
  soundVolume: 0.6,
  hapticsEnabled: true,
  batterySaver: false,
  evalBarPosition: 'left',
  boardSize: 100,
  showLiveEval: true,
  showCoordinates: 'inside',
  showBestMoveArrow: true,
  autoQueen: true,
  moveInputMethod: 'both',
  keyboardControl: false,
  notationInput: false,
  autoFlipLocal2P: false,
  premoveMode: 'infinite',
  aiThinkingMode: 'human',
  highlightLegalMoves: true,
  engineMaxDepth: 16,
  syncVaultId: 'gm-vault-8812',
  e2eeEnabled: true,
};

const SEED_PROFILE: UserProfile = {
  id: 'user-gm-1',
  username: 'GrandmasterPilot',
  title: 'NM',
  avatarSeed: 'n',
  ratings: {
    bullet: 1220,
    blitz: 1340,
    rapid: 1450,
    puzzles: 1520,
    variants: 1380
  },
  ratingHistory: {
    bullet: [
      { date: '2026-10-01', elo: 1180 },
      { date: '2026-10-15', elo: 1205 },
      { date: '2026-11-01', elo: 1220 }
    ],
    blitz: [
      { date: '2026-10-01', elo: 1280 },
      { date: '2026-10-18', elo: 1315 },
      { date: '2026-11-05', elo: 1340 }
    ],
    rapid: [
      { date: '2026-10-01', elo: 1380 },
      { date: '2026-10-12', elo: 1410 },
      { date: '2026-10-25', elo: 1435 },
      { date: '2026-11-10', elo: 1450 }
    ],
    puzzles: [
      { date: '2026-10-01', elo: 1420 },
      { date: '2026-10-20', elo: 1480 },
      { date: '2026-11-08', elo: 1520 }
    ],
    variants: [
      { date: '2026-10-05', elo: 1300 },
      { date: '2026-11-02', elo: 1380 }
    ]
  },
  stats: {
    gamesPlayed: 24,
    wins: 16,
    draws: 3,
    losses: 5,
    puzzlesSolved: 48,
    puzzlesAttempted: 52,
    highestRating: 1520,
    currentStreak: 5
  },
  settings: DEFAULT_SETTINGS
};

const SEED_MATCHES: GameHistoryItem[] = [
  {
    id: 'seed-game-1',
    date: '2026-11-10',
    variant: 'standard',
    playerColor: 'w',
    opponentName: 'Viktor (Intermediate)',
    opponentElo: 1400,
    timeControl: 'Rapid 10+0',
    result: '1-0',
    reason: 'checkmate',
    movesCount: 28,
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+ 8. Nbxd2 d5 9. exd5 Nxd5 10. Qb3 Nce7 11. O-O O-O 12. Rfe1 c6 13. Ne4 Nb6 14. Bd3 Ned5 15. Nc5 Rb8 16. a4 Bg4 17. Ne5 Bh5 18. a5 Nc8 19. Ncd7 Nd6 20. Nxb8 Qxb8 21. Nd7 Qd8 22. Nxf8 Qxf8 23. Bc4 Nf6 24. d5 c5 25. Re5 Bg6 26. Rae1 h6 27. Bd3 Bxd3 28. Qxd3 c4',
    accuracyWhite: 91.4,
    accuracyBlack: 79.2,
    playerAccuracy: 91.4,
    blundersCount: 0,
    analyzedMoves: [
      { san: 'e4', from: 'e2', to: 'e4', classification: 'book', evalBefore: 10, evalAfter: 15 },
      { san: 'e5', from: 'e7', to: 'e5', classification: 'book', evalBefore: 15, evalAfter: 12 },
      { san: 'Nf3', from: 'g1', to: 'f3', classification: 'book', evalBefore: 12, evalAfter: 20 },
      { san: 'Nc6', from: 'b8', to: 'c6', classification: 'book', evalBefore: 20, evalAfter: 18 },
      { san: 'Bc4', from: 'f1', to: 'c4', classification: 'book', evalBefore: 18, evalAfter: 22 },
      { san: 'Bc5', from: 'f8', to: 'c5', classification: 'book', evalBefore: 22, evalAfter: 20 },
      { san: 'c3', from: 'c2', to: 'c3', classification: 'best', evalBefore: 20, evalAfter: 35 },
      { san: 'Nf6', from: 'g8', to: 'f6', classification: 'good', evalBefore: 35, evalAfter: 30 },
      { san: 'd4', from: 'd2', to: 'd4', classification: 'best', evalBefore: 30, evalAfter: 45 },
      { san: 'exd4', from: 'e5', to: 'd4', classification: 'good', evalBefore: 45, evalAfter: 40 },
      { san: 'cxd4', from: 'c3', to: 'd4', classification: 'best', evalBefore: 40, evalAfter: 55 },
      { san: 'Bb4+', from: 'c5', to: 'b4', classification: 'inaccuracy', evalBefore: 55, evalAfter: 80, bestMoveSan: 'Bb6', bestMoveFrom: 'c5', bestMoveTo: 'b6' },
      { san: 'Bd2', from: 'c1', to: 'd2', classification: 'great', evalBefore: 80, evalAfter: 95 },
      { san: 'Bxd2+', from: 'b4', to: 'd2', classification: 'good', evalBefore: 95, evalAfter: 90 },
      { san: 'Nbxd2', from: 'b1', to: 'd2', classification: 'best', evalBefore: 90, evalAfter: 110 },
      { san: 'd5', from: 'd7', to: 'd5', classification: 'good', evalBefore: 110, evalAfter: 105 },
      { san: 'exd5', from: 'e4', to: 'd5', classification: 'best', evalBefore: 105, evalAfter: 130 },
      { san: 'Nxd5', from: 'f6', to: 'd5', classification: 'good', evalBefore: 130, evalAfter: 125 },
      { san: 'Qb3', from: 'd1', to: 'b3', classification: 'brilliant', evalBefore: 125, evalAfter: 240, bestMoveSan: 'Qb3' },
      { san: 'Nce7', from: 'c6', to: 'e7', classification: 'mistake', evalBefore: 240, evalAfter: 380, bestMoveSan: 'Ncb4' },
      { san: 'O-O', from: 'e1', to: 'g1', classification: 'best', evalBefore: 380, evalAfter: 420 },
      { san: 'O-O', from: 'e8', to: 'g8', classification: 'good', evalBefore: 420, evalAfter: 410 },
      { san: 'Rfe1', from: 'f1', to: 'e1', classification: 'best', evalBefore: 410, evalAfter: 470 },
      { san: 'c6', from: 'c7', to: 'c6', classification: 'good', evalBefore: 470, evalAfter: 460 },
      { san: 'Ne4', from: 'd2', to: 'e4', classification: 'great', evalBefore: 460, evalAfter: 530 }
    ]
  },
  {
    id: 'seed-game-2',
    date: '2026-11-08',
    variant: 'king_of_the_hill',
    playerColor: 'b',
    opponentName: 'Elena (Club Player)',
    opponentElo: 900,
    timeControl: 'Blitz 5+0',
    result: '0-1',
    reason: 'variant_goal',
    movesCount: 16,
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. d3 Nf6 5. Nc3 d6 6. Bg5 h6 7. Bh4 g5 8. Bg3 Bg4',
    accuracyWhite: 74.0,
    accuracyBlack: 88.0,
    playerAccuracy: 88.0,
    blundersCount: 1
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('play');
  const [activeVariant, setActiveVariant] = useState<VariantId>('standard');
  const [activeCustomVariant, setActiveCustomVariant] = useState<CustomVariantConfig | null>(null);
  const [variantsSubTab, setVariantsSubTab] = useState<'catalog' | 'custom'>('catalog');
  const [studioSeedConfig, setStudioSeedConfig] = useState<CustomVariantConfig | null>(null);
  const [trainSectionRequest, setTrainSectionRequest] = useState<{ section: TrainSection; key: number } | undefined>(undefined);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'customization' | 'gameplay' | 'sync' | undefined>(undefined);
  const [selectedReviewGame, setSelectedReviewGame] = useState<GameHistoryItem | null>(SEED_MATCHES[0]);
  const [recommendedPuzzleTheme, setRecommendedPuzzleTheme] = useState<string | undefined>(undefined);
  const [dailyPuzzleRequestKey, setDailyPuzzleRequestKey] = useState<number>(0);
  const [botChallengeRequest, setBotChallengeRequest] = useState<{
    botId: string;
    posture?: AdaptivePosture;
    mode?: OpponentMode;
    key: number;
  } | null>(null);
  const isOnline = useOnlineStatus();

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('gm_chess_profile');
      if (saved) {
        const parsed = JSON.parse(saved) as UserProfile;
        return {
          ...parsed,
          settings: normalizeThemeSettings({ ...DEFAULT_SETTINGS, ...(parsed.settings || {}) })
        };
      }
    } catch {
      // ignore
    }
    return SEED_PROFILE;
  });

  const [matches, setMatches] = useState<GameHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('gm_chess_matches');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SEED_MATCHES;
  });

  const currentAppTheme = getAppTheme(
    profile.settings.appTheme || 'emerald_studio',
    profile.settings.colorMode || 'dark'
  );
  const isLightMode = currentAppTheme.mode === 'light';

  // Synchronize global CSS variables and document surface with active theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--gm-bg', currentAppTheme.bgHex);
    root.style.setProperty('--gm-header', currentAppTheme.headerHex);
    root.style.setProperty('--gm-card', currentAppTheme.cardHex);
    root.style.setProperty('--gm-card-2', currentAppTheme.cardSecondaryHex);
    root.style.setProperty('--gm-border', currentAppTheme.cardBorderHex);
    root.style.setProperty('--gm-accent', currentAppTheme.accentHex);
    root.style.setProperty('--gm-accent-text', currentAppTheme.accentTextHex);
    root.style.setProperty('--gm-text', currentAppTheme.textPrimary);
    root.style.setProperty('--gm-text-2', currentAppTheme.textSecondary);
    root.style.setProperty('--gm-muted', currentAppTheme.textMutedHex);
    root.style.setProperty('--gm-hover', currentAppTheme.surfaceHoverHex);
    root.style.setProperty('--gm-accent-2', currentAppTheme.accent2Hex);
    root.style.colorScheme = currentAppTheme.mode;

    document.body.style.backgroundColor = currentAppTheme.bgHex;
    document.body.style.color = currentAppTheme.textPrimary;
  }, [currentAppTheme]);

  // Start each tab at the top instead of inheriting the previous tab's scroll position
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [activeTab]);

  // Clear one-shot bot challenge requests once leaving the Play workspace
  useEffect(() => {
    if (activeTab !== 'play' && botChallengeRequest) {
      setBotChallengeRequest(null);
    }
  }, [activeTab, botChallengeRequest]);

  // Seed Dashboard rating animation baseline on first boot so the first earned Elo delta animates on arrival
  useEffect(() => {
    try {
      if (!localStorage.getItem(DASHBOARD_SEEN_RATINGS_KEY)) {
        localStorage.setItem(
          DASHBOARD_SEEN_RATINGS_KEY,
          JSON.stringify({
            bullet: profile.ratings.bullet,
            blitz: profile.ratings.blitz,
            rapid: profile.ratings.rapid,
            puzzles: profile.ratings.puzzles,
            variants: profile.ratings.variants,
            highestRating: profile.stats.highestRating
          })
        );
      }
    } catch {
      // ignore storage errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth count-up/down animation for header Rapid Elo badge
  const [displayHeaderRapidElo, setDisplayHeaderRapidElo] = useState<number>(profile.ratings.rapid);
  const prevHeaderRapidEloRef = useRef<number>(profile.ratings.rapid);
  useEffect(() => {
    const startVal = prevHeaderRapidEloRef.current;
    const endVal = profile.ratings.rapid;
    prevHeaderRapidEloRef.current = endVal;
    const reduced =
      profile.settings.batterySaver ||
      (typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduced || startVal === endVal) {
      setDisplayHeaderRapidElo(endVal);
      return;
    }
    const controls = animate(startVal, endVal, {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: latest => setDisplayHeaderRapidElo(Math.round(latest)),
      onComplete: () => setDisplayHeaderRapidElo(endVal)
    });
    return () => controls.stop();
  }, [profile.ratings.rapid, profile.settings.batterySaver]);

  // Start loading Stockfish in the background so the first engine move is instant
  useEffect(() => {
    const id = window.setTimeout(warmUpEngine, 1500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('gm_chess_profile', JSON.stringify(profile));
      localStorage.setItem('gm_chess_matches', JSON.stringify(matches));
    } catch {
      // ignore storage quota errors
    }
  }, [profile, matches]);

  // Global keyboard shortcuts for navigation, theme toggle, settings, and shortcuts modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const action = resolveGlobalNavigationShortcut(e, {
        modalOpen: isSettingsOpen || isShortcutsOpen || hasOpenModalDialog()
      });
      if (!action) return;

      if (action.type === 'toggle_shortcuts') {
        e.preventDefault();
        setIsSettingsOpen(false);
        setIsShortcutsOpen(prev => !prev);
      } else if (action.type === 'close_modal') {
        if (isShortcutsOpen) {
          e.preventDefault();
          setIsShortcutsOpen(false);
        } else if (isSettingsOpen) {
          e.preventDefault();
          setIsSettingsOpen(false);
        }
      } else if (action.type === 'open_settings') {
        e.preventDefault();
        setSettingsInitialTab(undefined);
        setIsSettingsOpen(true);
      } else if (action.type === 'toggle_color_mode') {
        e.preventDefault();
        setProfile(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            colorMode: prev.settings.colorMode === 'light' ? 'dark' : 'light'
          }
        }));
      } else if (action.type === 'switch_tab') {
        e.preventDefault();
        if (action.tab === 'variants') setVariantsSubTab('catalog');
        setActiveTab(action.tab);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSettingsOpen, isShortcutsOpen]);

  // ---- Achievements: derived from games, stats and training progress ----
  const [progressTick, setProgressTick] = useState(0);
  const [unlockDates, setUnlockDates] = useState<Record<string, string>>(() => loadUnlockDates() ?? {});
  const [toastQueue, setToastQueue] = useState<AchievementDef[]>([]);

  useEffect(() => {
    const onProgress = () => setProgressTick(t => t + 1);
    window.addEventListener(PROGRESS_EVENT, onProgress);
    return () => window.removeEventListener(PROGRESS_EVENT, onProgress);
  }, []);

  const achievementStatuses = useMemo(
    () => evaluateAchievements(buildAchievementContext(profile, matches), unlockDates),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, matches, unlockDates, progressTick]
  );

  // Record unlock dates; toast new unlocks (the very first run records silently so old progress doesn't spam)
  useEffect(() => {
    const stored = loadUnlockDates();
    const isFirstRun = stored === null;
    const dates = { ...(stored ?? {}) };
    const newlyUnlocked = achievementStatuses.filter(s => s.unlocked && !dates[s.def.id]);
    if (newlyUnlocked.length === 0) {
      if (isFirstRun) saveUnlockDates(dates);
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    newlyUnlocked.forEach(s => {
      dates[s.def.id] = today;
    });
    saveUnlockDates(dates);
    setUnlockDates(dates);
    if (!isFirstRun) setToastQueue(q => [...q, ...newlyUnlocked.map(s => s.def)]);
  }, [achievementStatuses]);

  const dismissToast = useCallback(() => setToastQueue(q => q.slice(1)), []);

  const handleSaveGame = (newGame: GameHistoryItem) => {
    setMatches(prev => [newGame, ...prev]);

    setProfile(prev => {
      const isWin =
        (newGame.result === '1-0' && newGame.playerColor === 'w') ||
        (newGame.result === '0-1' && newGame.playerColor === 'b');
      const isDraw = newGame.result === '1/2-1/2';

      const nextStreak = isWin ? prev.stats.currentStreak + 1 : 0;
      const isUnrated =
        newGame.opponentName === 'Pass & Play (Local 2P)' ||
        newGame.opponentName.endsWith('(Coach)');

      if (isUnrated) {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            gamesPlayed: prev.stats.gamesPlayed + 1,
            wins: isWin ? prev.stats.wins + 1 : prev.stats.wins,
            draws: isDraw ? prev.stats.draws + 1 : prev.stats.draws,
            losses: !isWin && !isDraw ? prev.stats.losses + 1 : prev.stats.losses,
            currentStreak: nextStreak
          }
        };
      }

      const bucket: 'bullet' | 'blitz' | 'rapid' | 'variants' =
        newGame.variant !== 'standard'
          ? 'variants'
          : /bullet/i.test(newGame.timeControl)
          ? 'bullet'
          : /blitz/i.test(newGame.timeControl)
          ? 'blitz'
          : 'rapid';

      const ratingGain = isWin ? 16 : isDraw ? 0 : -14;
      const nextBucketElo = Math.max(100, prev.ratings[bucket] + ratingGain);
      const today = new Date().toISOString().split('T')[0];

      return {
        ...prev,
        ratings: {
          ...prev.ratings,
          [bucket]: nextBucketElo,
        },
        ratingHistory: {
          ...prev.ratingHistory,
          [bucket]: [
            ...(prev.ratingHistory[bucket] || []),
            { date: today, elo: nextBucketElo }
          ]
        },
        stats: {
          ...prev.stats,
          gamesPlayed: prev.stats.gamesPlayed + 1,
          wins: isWin ? prev.stats.wins + 1 : prev.stats.wins,
          draws: isDraw ? prev.stats.draws + 1 : prev.stats.draws,
          losses: !isWin && !isDraw ? prev.stats.losses + 1 : prev.stats.losses,
          highestRating: Math.max(prev.stats.highestRating, nextBucketElo),
          currentStreak: nextStreak
        }
      };
    });
  };

  const handleUpdatePuzzleElo = (newElo: number, solved?: boolean) => {
    setProfile(prev => {
      const gained = typeof solved === 'boolean' ? solved : newElo >= prev.ratings.puzzles;
      return {
        ...prev,
        ratings: { ...prev.ratings, puzzles: newElo },
        stats: {
          ...prev.stats,
          puzzlesAttempted: prev.stats.puzzlesAttempted + 1,
          puzzlesSolved: gained ? prev.stats.puzzlesSolved + 1 : prev.stats.puzzlesSolved,
          highestRating: Math.max(prev.stats.highestRating, newElo)
        },
        ratingHistory: {
          ...prev.ratingHistory,
          puzzles: [
            ...prev.ratingHistory.puzzles,
            { date: new Date().toISOString().split('T')[0], elo: newElo }
          ]
        }
      };
    });
  };

  const handleResetLocalData = () => {
    try {
      const keys = [
        'gm_chess_profile',
        'gm_chess_matches',
        'chess_puzzle_review_queue_v1',
        'chess_puzzle_rush_best_v1',
        'gm_chess_custom_variants',
        'gm_studio_show_setup_controls',
        'gm_daily_puzzle_cache_v1',
        DASHBOARD_SEEN_RATINGS_KEY,
        DEFEATED_BOTS_STORAGE_KEY,
        ACHIEVEMENTS_KEY,
        ENDGAME_PROGRESS_KEY,
        OPENING_PROGRESS_KEY,
        DAILY_STREAK_STORAGE_KEY,
        VISION_BEST_STORAGE_KEY,
      ];
      for (const k of keys) localStorage.removeItem(k);
    } catch {
      // ignore storage errors
    }
    setProfile(SEED_PROFILE);
    setMatches(SEED_MATCHES);
    setSelectedReviewGame(SEED_MATCHES[0]);
    setUnlockDates({});
    setToastQueue([]);
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  };

  const handleSelectVariantToPlay = (variantId: VariantId) => {
    setActiveVariant(variantId);
    if (CUSTOM_ENGINE_VARIANTS.includes(variantId)) {
      setActiveCustomVariant(variantToCustomConfig(variantId));
    } else {
      setActiveCustomVariant(null);
    }
    setActiveTab('play');
  };

  const handlePlayCustomInArena = (config: CustomVariantConfig) => {
    setActiveCustomVariant(config);
    setActiveVariant('chaturanga');
    setActiveTab('play');
  };

  const handleEditVariantRules = (config: CustomVariantConfig) => {
    setStudioSeedConfig(config);
    setVariantsSubTab('custom');
    setActiveTab('variants');
  };

  // Imported games join the archive and open in review, without touching ratings or W/L stats
  const handleImportGame = (game: GameHistoryItem) => {
    setMatches(prev => [game, ...prev]);
    setSelectedReviewGame(game);
    setActiveTab('review');
  };

  const handleRunGameReview = (game: GameHistoryItem) => {
    setSelectedReviewGame(game);
    setActiveTab('review');
  };

  const handleGlobalHelpAction = (target: SearchActionTarget) => {
    if (target.type === 'shortcuts') {
      setIsShortcutsOpen(true);
      return;
    }
    if (target.type === 'daily_puzzle') {
      setDailyPuzzleRequestKey(k => k + 1);
      setActiveTab('puzzles');
      return;
    }
    if (target.type === 'settings') {
      setSettingsInitialTab(target.tab);
      setIsSettingsOpen(true);
      return;
    }
    if (target.variantsSubTab) {
      setVariantsSubTab(target.variantsSubTab);
    }
    if (target.trainSection) {
      setTrainSectionRequest(prev => ({ section: target.trainSection!, key: (prev?.key ?? 0) + 1 }));
    }
    setActiveTab(target.tab);
  };

  const navItems: { id: AppTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { id: 'play', label: 'Play', shortLabel: 'Play', icon: <Swords className="w-4 h-4" /> },
    { id: 'variants', label: 'Variants & Studio', shortLabel: 'Variants', icon: <Compass className="w-4 h-4" /> },
    { id: 'puzzles', label: 'Puzzles', shortLabel: 'Puzzles', icon: <Trophy className="w-4 h-4" /> },
    { id: 'train', label: 'Training', shortLabel: 'Train', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'coach', label: 'AI Coach', shortLabel: 'Coach', icon: <Brain className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Archive', shortLabel: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <ThemeProvider settings={profile.settings}>
      <div
        className="relative isolate min-h-screen flex flex-col"
        style={{
          color: 'var(--gm-text)'
        }}
      >
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundColor: 'var(--bg-color)',
            backgroundImage: 'var(--bg-gradient)',
            transform: 'translateZ(0)'
          }}
        />
        {/* 3-Zone Studio Top Navigation Bar */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-md"
          style={{ backgroundColor: 'var(--gm-header)', borderColor: 'var(--gm-border)' }}
        >
          <div
            className="absolute inset-x-0 bottom-[-1px] h-px pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent, var(--gm-accent), var(--gm-accent-2), transparent)',
              opacity: 0.7
            }}
          />
          <div className="max-w-7xl mx-auto h-14 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3">
            {/* Zone 1: Brand Emblem */}
            <button
              type="button"
              onClick={() => setActiveTab('play')}
              className="flex items-center gap-2.5 cursor-pointer group select-none text-left focus:outline-none shrink-0"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center p-1 transition-transform group-hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${currentAppTheme.accentHex}33, ${currentAppTheme.accent2Hex}26)`,
                  backgroundColor: currentAppTheme.cardSecondaryHex,
                  border: `1px solid ${currentAppTheme.accentHex}55`,
                  boxShadow: `0 0 18px -4px ${currentAppTheme.accentHex}66`
                }}
              >
                <ChessPieceIcon type="n" color="w" set={profile.settings.pieceSet} />
              </div>
              <span className="font-display font-extrabold text-sm sm:text-base tracking-tight whitespace-nowrap" style={{ color: currentAppTheme.textPrimary }}>
                Grandmaster Studio
              </span>
            </button>

            {/* Zone 2: Desktop Primary Navigation Tabs */}
            <nav className="hidden md:flex items-center h-full gap-0.5 xl:gap-1 min-w-0" aria-label="Main navigation">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'variants') setVariantsSubTab('catalog');
                      setActiveTab(item.id);
                    }}
                    aria-label={item.label}
                    title={item.label}
                    className="relative h-full flex items-center gap-1.5 px-2 xl:px-3 text-xs font-bold transition whitespace-nowrap"
                    style={{
                      color: isActive ? currentAppTheme.accentHex : currentAppTheme.textSecondary
                    }}
                  >
                    {item.icon}
                    <span className="hidden lg:inline xl:hidden">{item.shortLabel}</span>
                    <span className="hidden xl:inline">{item.label}</span>
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full"
                        style={{
                          backgroundImage: `linear-gradient(90deg, ${currentAppTheme.accentHex}, ${currentAppTheme.accent2Hex})`,
                          boxShadow: `0 0 10px ${currentAppTheme.accentHex}`
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Global Search, Telemetry & Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <GlobalSearch
                matches={matches}
                onSelectGame={handleRunGameReview}
                onSelectVariant={handleSelectVariantToPlay}
                onSelectCustomVariant={handlePlayCustomInArena}
                onExecuteHelpAction={handleGlobalHelpAction}
              />

              <PWAInstallButton variant="compact" />

              {profile.settings.batterySaver && (
                <span
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold"
                  style={{ color: currentAppTheme.accentHex }}
                  title="Battery Saver Mode Active"
                >
                  <BatteryCharging className="w-3.5 h-3.5" />
                  <span>Eco</span>
                </span>
              )}

              {/* Offline indicator only shown when offline */}
              {!isOnline && (
                <span
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-amber-500"
                  title="Offline · Local Encrypted Vault"
                >
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Offline</span>
                </span>
              )}

              {/* Quick 10 App Theme Switcher */}
              <label
                className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs cursor-pointer"
                style={{
                  backgroundColor: currentAppTheme.cardSecondaryHex,
                  borderColor: currentAppTheme.cardBorderHex
                }}
              >
                <Palette className="w-3.5 h-3.5 shrink-0" style={{ color: currentAppTheme.accentHex }} />
                <select
                  value={currentAppTheme.id}
                  aria-label="Select app theme"
                  onChange={e => {
                    const newTheme = e.target.value as AppThemeId;
                    setProfile(prev => ({
                      ...prev,
                      settings: { ...prev.settings, appTheme: newTheme }
                    }));
                  }}
                  className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                  style={{ color: currentAppTheme.textPrimary }}
                >
                  {APP_THEME_FAMILIES.map(t => (
                    <option
                      key={t.id}
                      value={t.id}
                      style={{ backgroundColor: currentAppTheme.cardHex, color: currentAppTheme.textPrimary }}
                    >
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Dark / Light Mode Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={isLightMode}
                aria-label="Light mode"
                title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
                onClick={() =>
                  setProfile(prev => ({
                    ...prev,
                    settings: { ...prev.settings, colorMode: isLightMode ? 'dark' : 'light' }
                  }))
                }
                className="relative h-8 w-[58px] rounded-full border shrink-0"
                style={{
                  backgroundColor: 'var(--gm-card-2)',
                  borderColor: 'var(--gm-border)'
                }}
              >
                <Moon
                  className="absolute left-[9px] top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                  style={{ color: 'var(--gm-muted)' }}
                />
                <Sun
                  className="absolute right-[9px] top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                  style={{ color: 'var(--gm-muted)' }}
                />
                <span
                  className="absolute top-[3px] left-[3px] w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-transform duration-150"
                  style={{
                    transform: isLightMode ? 'translateX(26px)' : 'translateX(0px)',
                    backgroundImage: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-2))',
                    color: 'var(--gm-accent-text)'
                  }}
                >
                  {isLightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </span>
              </button>

              {/* Rapid Rating Metric */}
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="hidden sm:inline-flex text-xs font-mono font-bold tabular-nums hover:opacity-80 transition whitespace-nowrap"
                style={{ color: currentAppTheme.accentHex }}
                title="View Rating Archive & Dashboard"
              >
                {displayHeaderRapidElo} Elo
              </button>

              {/* Keyboard Shortcuts Trigger */}
              <button
                type="button"
                onClick={() => setIsShortcutsOpen(true)}
                aria-label="Keyboard shortcuts"
                className="hidden sm:inline-flex p-2 rounded-lg border transition hover:opacity-80"
                style={{
                  backgroundColor: currentAppTheme.cardSecondaryHex,
                  borderColor: currentAppTheme.cardBorderHex,
                  color: currentAppTheme.textPrimary
                }}
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              {/* Settings Trigger */}
              <button
                type="button"
                onClick={() => {
                  setSettingsInitialTab(undefined);
                  setIsSettingsOpen(true);
                }}
                aria-label="Open settings"
                className="p-2 rounded-lg border transition hover:opacity-80"
                style={{
                  backgroundColor: currentAppTheme.cardSecondaryHex,
                  borderColor: currentAppTheme.cardBorderHex,
                  color: currentAppTheme.textPrimary
                }}
                title="Customization & Settings (,)"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 pb-20 md:pb-8">
          {activeTab === 'play' && (
            <PlayView
              initialVariant={activeVariant}
              customVariantConfig={activeCustomVariant}
              settings={profile.settings}
              playerRapidElo={profile.ratings.rapid}
              recentGames={matches}
              botChallengeRequest={botChallengeRequest}
              onSaveGame={handleSaveGame}
              onRunGameReview={handleRunGameReview}
              onUpdateSettings={(newSettings) =>
                setProfile(prev => ({ ...prev, settings: newSettings }))
              }
              onEditVariantRules={handleEditVariantRules}
            />
          )}

          {activeTab === 'variants' && (
            <VariantsView
              initialSubTab={variantsSubTab}
              initialCustomConfig={studioSeedConfig}
              onSelectVariant={handleSelectVariantToPlay}
              onPlayCustomInArena={handlePlayCustomInArena}
            />
          )}

          {activeTab === 'puzzles' && (
            <PuzzlesView
              userPuzzleElo={profile.ratings.puzzles}
              initialTheme={recommendedPuzzleTheme}
              initialDailyRequestKey={dailyPuzzleRequestKey}
              onRatingChange={handleUpdatePuzzleElo}
            />
          )}

          {activeTab === 'train' && (
            <TrainView
              initialSection={trainSectionRequest?.section}
              sectionRequestKey={trainSectionRequest?.key}
            />
          )}

          {activeTab === 'review' && selectedReviewGame && (
            <GameReviewView
              game={selectedReviewGame}
              playerElo={profile.ratings.rapid}
              onBack={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'coach' && (
            <CoachView
              profile={profile}
              recentGames={matches}
              onStartRecommendedPuzzles={(themeName) => {
                setRecommendedPuzzleTheme(themeName);
                setActiveTab('puzzles');
              }}
              onChallengeAdaptiveBot={(posture, mode) => {
                setActiveVariant('standard');
                setActiveCustomVariant(null);
                setBotChallengeRequest(prev => ({
                  botId: 'bot_adaptive_coach',
                  posture,
                  mode,
                  key: (prev?.key ?? 0) + 1
                }));
                setActiveTab('play');
              }}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              matches={matches}
              onReviewGame={handleRunGameReview}
              onPlayNewGame={() => setActiveTab('play')}
              onImportGame={handleImportGame}
              onOpenPuzzles={() => setActiveTab('puzzles')}
              onOpenDailyPuzzle={() => {
                setDailyPuzzleRequestKey(k => k + 1);
                setActiveTab('puzzles');
              }}
              onOpenVisionTrainer={() => {
                setTrainSectionRequest(prev => ({ section: 'vision', key: (prev?.key ?? 0) + 1 }));
                setActiveTab('train');
              }}
              achievements={achievementStatuses}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 backdrop-blur-lg border-t px-2 flex items-center justify-around"
          style={{
            backgroundColor: 'var(--gm-header)',
            borderColor: 'var(--gm-border)'
          }}
        >
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'variants') setVariantsSubTab('catalog');
                  setActiveTab(item.id);
                }}
                className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold transition"
                style={{
                  color: isActive ? currentAppTheme.accentHex : currentAppTheme.textSecondary
                }}
              >
                {item.icon}
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        <AchievementToast
          achievement={toastQueue[0] ?? null}
          onDismiss={dismissToast}
          onOpen={() => {
            dismissToast();
            setActiveTab('dashboard');
          }}
        />

        {/* Settings & Customization Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          initialTab={settingsInitialTab}
          onClose={() => setIsSettingsOpen(false)}
          settings={profile.settings}
          onSaveSettings={(newSettings) =>
            setProfile(prev => ({ ...prev, settings: newSettings }))
          }
          fullDataPayload={{ profile, matches }}
          onRestoreDataPayload={(payload: unknown) => {
            const p = payload as { profile?: UserProfile; matches?: GameHistoryItem[] } | null;
            if (p?.profile) {
              setProfile({
                ...p.profile,
                settings: normalizeThemeSettings({ ...DEFAULT_SETTINGS, ...(p.profile.settings || {}) })
              });
            }
            if (p?.matches) setMatches(p.matches);
          }}
          profile={{ username: profile.username, title: profile.title }}
          onUpdateProfile={(patch) =>
            setProfile(prev => ({
              ...prev,
              username: patch.username !== undefined ? patch.username : prev.username,
              title: patch.title !== undefined ? patch.title : prev.title,
            }))
          }
          onResetLocalData={handleResetLocalData}
        />

        {/* Keyboard Shortcuts Overlay */}
        <KeyboardShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
          keyboardControl={Boolean(profile.settings.keyboardControl)}
          notationInput={Boolean(profile.settings.notationInput)}
          onToggleSetting={(key, value) =>
            setProfile(prev => ({
              ...prev,
              settings: { ...prev.settings, [key]: value }
            }))
          }
        />
      </div>
    </ThemeProvider>
  );
}
