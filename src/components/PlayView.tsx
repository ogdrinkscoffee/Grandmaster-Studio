import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import {
  VariantId,
  PieceColor,
  MoveAnalysis,
  GameHistoryItem,
  UserSettings,
  CustomVariantConfig,
  OpponentMode,
  PieceType
} from '../types/chess';
import { QuickPlayRequest } from './AppViewProps';
import {
  evaluateBoard,
  AI_BOT_PROFILES,
  BotProfile,
  classifyMove,
  formatEvaluation,
  MIN_AI_ELO,
  MAX_AI_ELO,
  createCustomBotProfile,
  calculateAccuracyFromMoves,
  getThreatenedSquares,
  computeHumanThinkDelayMs
} from '../engine/chessEngine';
import {
  AdaptivePosture,
  loadDefeatedBots,
  recordDefeatedBot,
  resolveAdaptiveBot
} from '../engine/adaptiveBot';
import { PROGRESS_EVENT } from '../engine/progressEvents';
import { hasOpenModalDialog, resolvePlayViewShortcut } from '../engine/keyboardShortcuts';
import { engineAnalyzeMove, engineGetAIMove, engineGetCustomAIMove, engineSearch } from '../engine/engineClient';
import {
  CHESS_VARIANTS,
  checkKingOfTheHillWin,
  checkRacingKingsWin,
  STOCKFISH_VARIANTS,
  generateChess960Fen,
  generateTranscendentalFen
} from '../engine/variants';
import {
  CustomGameState,
  CUSTOM_ENGINE_VARIANTS,
  getAllLegalMoves,
  executeCustomMove,
  getCustomAIMove,
  evaluateCustomBoard,
  findKingPosition,
  isKingInCheck,
  variantToCustomConfig,
  coordsToSquare,
  createCustomGameState,
  chooseSmartDuckPos
} from '../engine/customVariantEngine';
import { ChessBoard, CustomBoardMoveTarget, QueuedPremove, getBoardMaxWidthPx } from './ChessBoard';
import { MoveClassificationBadge, CLASSIFICATION_META } from './MoveClassificationBadge';
import { EvalBar } from './EvalBar';
import { ChessPieceIcon } from './ChessPieces';
import { BotCharacterAvatar } from './BotCharacterAvatar';
import { BotRosterModal } from './BotRosterModal';
import { sounds } from '../utils/sound';
import { useAppTheme } from '../context/ThemeContext';
import { detectOpening } from '../engine/openings';
import {
  RotateCcw,
  Sparkles,
  Flag,
  Handshake,
  ArrowUpDown,
  Clock,
  Trophy,
  Cpu,
  Users,
  Undo2,
  Copy,
  Check,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
  FastForward,
  Terminal,
  Pause,
  Play,
  FlipVertical2,
  CornerDownLeft,
  Eye,
  EyeOff,
  Lightbulb,
  ShieldAlert,
  SlidersHorizontal,
  Bot,
  GraduationCap,
  Maximize2,
  Minimize2,
  Globe
} from 'lucide-react';
import { User } from 'firebase/auth';
import { OnlinePlayerPublic } from '../engine/onlineClassic';
import { OnlinePlayPanel } from './OnlinePlayPanel';

interface TimePreset {
  id: string;
  label: string;
  seconds: number;
  increment: number;
}

const TIME_PRESETS: TimePreset[] = [
  { id: 'bullet_1_0', label: 'Bullet 1+0', seconds: 60, increment: 0 },
  { id: 'bullet_2_1', label: 'Bullet 2+1', seconds: 120, increment: 1 },
  { id: 'blitz_3_0', label: 'Blitz 3+0', seconds: 180, increment: 0 },
  { id: 'blitz_3_2', label: 'Blitz 3+2', seconds: 180, increment: 2 },
  { id: 'blitz_5_0', label: 'Blitz 5+0', seconds: 300, increment: 0 },
  { id: 'rapid_10_0', label: 'Rapid 10+0', seconds: 600, increment: 0 },
  { id: 'rapid_15_10', label: 'Rapid 15+10', seconds: 900, increment: 10 },
];

interface OpeningStarter {
  id: string;
  label: string;
  moves: string[];
}

const OPENING_STARTERS: OpeningStarter[] = [
  { id: 'default', label: 'Standard Start', moves: [] },
  { id: 'italian', label: 'Italian Game (C50)', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'] },
  { id: 'sicilian_najdorf', label: 'Sicilian Najdorf (B90)', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'] },
  { id: 'ruy_lopez', label: 'Ruy Lopez (C70)', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'] },
  { id: 'queens_gambit', label: "Queen's Gambit (D06)", moves: ['d4', 'd5', 'c4', 'e6'] },
  { id: 'london', label: 'London System (D02)', moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3'] },
  { id: 'kings_indian', label: "King's Indian (E60)", moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'] },
  { id: 'french', label: 'French Defense (C11)', moves: ['e4', 'e6', 'd4', 'd5', 'Nc3'] }
];

interface PlayViewProps {
  initialVariant?: VariantId;
  customVariantConfig?: CustomVariantConfig | null;
  settings: UserSettings;
  playerRapidElo?: number;
  recentGames?: GameHistoryItem[];
  botChallengeRequest?: {
    botId: string;
    posture?: AdaptivePosture;
    mode?: OpponentMode;
    key: number;
  } | null;
  quickPlayRequest?: QuickPlayRequest | null;
  initialFenRequest?: { fen: string; key: number } | null;
  onSaveGame: (game: GameHistoryItem) => void;
  onRunGameReview: (game: GameHistoryItem) => void;
  onUpdateSettings?: (newSettings: UserSettings) => void;
  onEditVariantRules?: (config: CustomVariantConfig) => void;
  firebaseUser?: User | null;
  publicProfile?: OnlinePlayerPublic | null;
  pendingChallengeCode?: string | null;
  onConsumeChallengeCode?: () => void;
  onOpenAuthModal?: () => void;
  onOnlineEloUpdated?: (bucket: 'bullet' | 'blitz' | 'rapid', elo: number) => void;
}

export const PlayView: React.FC<PlayViewProps> = ({
  initialVariant = 'standard',
  customVariantConfig = null,
  settings,
  playerRapidElo = 1450,
  recentGames = [],
  botChallengeRequest = null,
  quickPlayRequest = null,
  initialFenRequest = null,
  onSaveGame,
  onRunGameReview,
  onUpdateSettings,
  firebaseUser = null,
  publicProfile = null,
  pendingChallengeCode = null,
  onConsumeChallengeCode,
  onOpenAuthModal,
  onOnlineEloUpdated
}) => {
  const { theme } = useAppTheme();
  const [isCompactViewport, setIsCompactViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsCompactViewport(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const [selectedVariant, setSelectedVariant] = useState<VariantId>(initialVariant);
  const [activeCustomConfig, setActiveCustomConfig] = useState<CustomVariantConfig | null>(() => {
    if (customVariantConfig) return customVariantConfig;
    if (CUSTOM_ENGINE_VARIANTS.includes(initialVariant)) {
      return variantToCustomConfig(initialVariant);
    }
    return null;
  });

  const [opponentMode, setOpponentMode] = useState<OpponentMode>(() =>
    pendingChallengeCode || quickPlayRequest?.mode === 'online' ? 'online' : 'ai'
  );
  const [selectedBot, setSelectedBot] = useState<BotProfile>(
    () => AI_BOT_PROFILES.find(b => b.id === 'bot_viktor') || AI_BOT_PROFILES[0]
  );
  const [adaptivePosture, setAdaptivePosture] = useState<AdaptivePosture>('auto');
  const [defeatedBotIds, setDefeatedBotIds] = useState<string[]>(() => loadDefeatedBots());
  const [showCustomElo, setShowCustomElo] = useState<boolean>(false);
  const [customEloInput, setCustomEloInput] = useState<number>(1250);
  const [sidePreference, setSidePreference] = useState<'w' | 'b' | 'random'>('w');
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Match assists & coach preferences
  type AssistPreset = 'coach' | 'standard' | 'challenge' | 'custom';
  const [assistPreset, setAssistPreset] = useState<AssistPreset>('standard');
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(true);
  const [undosEnabled, setUndosEnabled] = useState<boolean>(true);
  const [liveTipsEnabled, setLiveTipsEnabled] = useState<boolean>(true);
  const [showThreats, setShowThreats] = useState<boolean>(false);
  const [showAssistsMenu, setShowAssistsMenu] = useState<boolean>(false);
  const [showPlayModeMenu, setShowPlayModeMenu] = useState<boolean>(false);
  const [showTimeMenu, setShowTimeMenu] = useState<boolean>(false);
  const [showCharacterModal, setShowCharacterModal] = useState<boolean>(false);
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [liveCoachTip, setLiveCoachTip] = useState<{
    title: string;
    body: string;
    tone: 'good' | 'info' | 'warn';
  } | null>(null);
  interface LiveCoachLesson {
    ply: number;
    san: string;
    mover: 'player' | 'ai';
    classification: MoveAnalysis['classification'];
    moveAccuracy: number;
    bestMoveSan: string;
    bestMoveFrom: Square;
    bestMoveTo: Square;
    pvSan: string[];
    evalLabel: string;
    commentary: string;
    opponentIntent?: string;
    opponentReplyNote?: string;
    threats: string[];
    fenBefore: string;
    evalBeforeCp: number;
    evalAfterCp: number;
    aiDeepNote?: {
      headline: string;
      whyMoveWorkedOrFailed: string;
      bestMoveIdea: string;
      coachTip: string;
      source: 'gemini' | 'local';
    } | null;
  }
  const [coachLesson, setCoachLesson] = useState<LiveCoachLesson | null>(null);
  const [loadingCoachDeep, setLoadingCoachDeep] = useState<boolean>(false);
  const [coachDeepError, setCoachDeepError] = useState<string | null>(null);
  const [loadingCoachOffline, setLoadingCoachOffline] = useState<boolean>(false);
  const [coachHintStep, setCoachHintStep] = useState<number>(0);
  const assistsMenuRef = useRef<HTMLDivElement | null>(null);
  const playModeMenuRef = useRef<HTMLDivElement | null>(null);
  const timeMenuRef = useRef<HTMLDivElement | null>(null);

  // Time controls
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rapid_10_0');
  const [showCustomTime, setShowCustomTime] = useState<boolean>(false);
  const [customMinutesInput, setCustomMinutesInput] = useState<number>(7);
  const [customIncInput, setCustomIncInput] = useState<number>(3);
  const [timeControlName, setTimeControlName] = useState<string>('Rapid 10+0');
  const [initialTimeSec, setInitialTimeSec] = useState<number>(600);
  const [incrementSec, setIncrementSec] = useState<number>(0);

  const [whiteTime, setWhiteTime] = useState<number>(600);
  const [blackTime, setBlackTime] = useState<number>(600);
  const [clockRunning, setClockRunning] = useState<boolean>(false);
  const [clockPaused, setClockPaused] = useState<boolean>(false);

  const variantDef = CHESS_VARIANTS.find(v => v.id === selectedVariant) || CHESS_VARIANTS[0];

  const createInitialChess = (variant: VariantId) => {
    if (variant === 'chess960') {
      try {
        return new Chess(generateChess960Fen());
      } catch {
        return new Chess();
      }
    }
    if (variant === 'transcendental') {
      try {
        return new Chess(generateTranscendentalFen());
      } catch {
        return new Chess();
      }
    }
    const v = CHESS_VARIANTS.find(item => item.id === variant);
    if (v?.startFen) {
      try {
        return new Chess(v.startFen);
      } catch {
        return new Chess();
      }
    }
    return new Chess();
  };

  const [chess, setChess] = useState<Chess>(() => createInitialChess(selectedVariant));
  const [customState, setCustomState] = useState<CustomGameState | null>(() =>
    activeCustomConfig ? createCustomGameState(activeCustomConfig) : null
  );

  const [openingId, setOpeningId] = useState<string>('default');
  const [startFenForReplay, setStartFenForReplay] = useState<string>(() => createInitialChess(selectedVariant).fen());
  const [reviewPly, setReviewPly] = useState<number | null>(null);

  type DropPieceType = 'p' | 'n' | 'b' | 'r' | 'q';
  const [crazyhousePocket, setCrazyhousePocket] = useState<{ w: DropPieceType[]; b: DropPieceType[] }>({ w: [], b: [] });
  const crazyhousePocketRef = useRef<{ w: DropPieceType[]; b: DropPieceType[] }>({ w: [], b: [] });
  const [selectedDropPiece, setSelectedDropPiece] = useState<DropPieceType | null>(null);
  const standardFenStackRef = useRef<string[]>([]);
  const crazyhousePocketStackRef = useRef<{ w: DropPieceType[]; b: DropPieceType[] }[]>([]);
  const customHistoryStackRef = useRef<CustomGameState[]>([]);

  const [premoveQueue, setPremoveQueue] = useState<QueuedPremove[]>([]);
  const premoveQueueRef = useRef<QueuedPremove[]>([]);
  const updatePremoveQueue = (updater: QueuedPremove[] | ((prev: QueuedPremove[]) => QueuedPremove[])) => {
    const next = typeof updater === 'function' ? updater(premoveQueueRef.current) : updater;
    premoveQueueRef.current = next;
    setPremoveQueue(next);
  };

  const [evalScore, setEvalScore] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [hintArrow, setHintArrow] = useState<{ from: Square; to: Square } | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);

  const [checksWhite, setChecksWhite] = useState<number>(0);
  const [checksBlack, setChecksBlack] = useState<number>(0);
  const [duckSquare, setDuckSquare] = useState<Square | null>(null);
  const [isPlacingDuck, setIsPlacingDuck] = useState<boolean>(false);

  const [analyzedMoves, setAnalyzedMoves] = useState<MoveAnalysis[]>([]);
  const [copiedPgn, setCopiedPgn] = useState<boolean>(false);
  const [copiedFen, setCopiedFen] = useState<boolean>(false);
  const [showFenTools, setShowFenTools] = useState<boolean>(false);
  const [fenInput, setFenInput] = useState<string>('');
  const [fenStatus, setFenStatus] = useState<string | null>(null);
  const [notationText, setNotationText] = useState<string>('');
  const [notationError, setNotationError] = useState<string | null>(null);
  const notationInputRef = useRef<HTMLInputElement | null>(null);
  const [gameOverResult, setGameOverResult] = useState<{
    result: '1-0' | '0-1' | '1/2-1/2';
    reason: string;
  } | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const premoveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const matchGenRef = useRef<number>(0);

  const chessRef = useRef<Chess>(chess);
  chessRef.current = chess;
  const playerColorRef = useRef<PieceColor>(playerColor);
  playerColorRef.current = playerColor;
  const opponentModeRef = useRef<OpponentMode>(opponentMode);
  opponentModeRef.current = opponentMode;
  const selectedBotRef = useRef<BotProfile>(selectedBot);
  const evalScoreRef = useRef<number>(evalScore);
  evalScoreRef.current = evalScore;
  const selectedVariantRef = useRef<VariantId>(selectedVariant);
  selectedVariantRef.current = selectedVariant;
  const liveTipsEnabledRef = useRef<boolean>(liveTipsEnabled);
  liveTipsEnabledRef.current = liveTipsEnabled;
  const duckSquareRef = useRef<Square | null>(duckSquare);
  duckSquareRef.current = duckSquare;
  const gameOverRef = useRef(gameOverResult);
  gameOverRef.current = gameOverResult;
  const settingsRef = useRef<UserSettings>(settings);
  settingsRef.current = settings;
  const initialTimeSecRef = useRef<number>(initialTimeSec);
  initialTimeSecRef.current = initialTimeSec;
  const whiteTimeRef = useRef<number>(whiteTime);
  whiteTimeRef.current = whiteTime;
  const blackTimeRef = useRef<number>(blackTime);
  blackTimeRef.current = blackTime;
  const customStateRef = useRef<CustomGameState | null>(customState);
  customStateRef.current = customState;
  const analyzedMovesRef = useRef<MoveAnalysis[]>(analyzedMoves);
  analyzedMovesRef.current = analyzedMoves;

  const adaptiveResolution = useMemo(() => {
    const playerMoves = analyzedMoves.filter((_, idx) =>
      playerColor === 'w' ? idx % 2 === 0 : idx % 2 === 1
    );
    const recentPlayerMoveAccuracies = playerMoves
      .slice(-4)
      .map(m => m.moveAccuracy)
      .filter((v): v is number => typeof v === 'number');
    const playerBlundersInGame = playerMoves.filter(m => m.classification === 'blunder').length;
    return resolveAdaptiveBot({
      playerRapidElo,
      recentGames,
      posture: adaptivePosture,
      inGameEvalCp: evalScore,
      playerColor,
      recentPlayerMoveAccuracies,
      playerBlundersInGame,
      movesPlayed: analyzedMoves.length
    });
  }, [playerRapidElo, recentGames, adaptivePosture, evalScore, playerColor, analyzedMoves]);

  const rawSelectedBotRef = useRef<BotProfile>(selectedBot);
  rawSelectedBotRef.current = selectedBot;
  const adaptivePostureRef = useRef<AdaptivePosture>(adaptivePosture);
  adaptivePostureRef.current = adaptivePosture;

  const effectiveBot: BotProfile = selectedBot.isAdaptive ? adaptiveResolution.bot : selectedBot;
  selectedBotRef.current = effectiveBot;
  const resolveLiveBotForMove = (): BotProfile => {
    const baseBot = rawSelectedBotRef.current;
    if (!baseBot.isAdaptive) return baseBot;
    const movesNow = analyzedMovesRef.current;
    const colorNow = playerColorRef.current;
    const playerMoves = movesNow.filter((_, idx) => (colorNow === 'w' ? idx % 2 === 0 : idx % 2 === 1));
    const recentAcc = playerMoves
      .slice(-4)
      .map(m => m.moveAccuracy)
      .filter((v): v is number => typeof v === 'number');
    const blunders = playerMoves.filter(m => m.classification === 'blunder').length;
    return resolveAdaptiveBot({
      playerRapidElo,
      recentGames,
      posture: adaptivePostureRef.current,
      inGameEvalCp: evalScoreRef.current,
      playerColor: colorNow,
      recentPlayerMoveAccuracies: recentAcc,
      playerBlundersInGame: blunders,
      movesPlayed: movesNow.length
    }).bot;
  };
  // Background (Web Worker) move grading: provisional entry -> final analysis, plus in-flight jobs
  const finalizedAnalysesRef = useRef<WeakMap<MoveAnalysis, MoveAnalysis>>(new WeakMap());
  const pendingAnalysesRef = useRef<Set<Promise<void>>>(new Set());
  // Bumped whenever engine timers are cleared so in-flight bot searches are discarded
  const aiRequestTokenRef = useRef<number>(0);
  const hintRequestTokenRef = useRef<number>(0);

  // Stockfish handles standard-rules variants; rule-changing ones use the built-in engine
  const engineOpts = () => ({ allowStockfish: STOCKFISH_VARIANTS.has(selectedVariantRef.current) });

  const clearEngineTimers = () => {
    aiRequestTokenRef.current += 1;
    hintRequestTokenRef.current += 1;
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    if (premoveTimerRef.current) {
      clearTimeout(premoveTimerRef.current);
      premoveTimerRef.current = null;
    }
    if (duckTimerRef.current) {
      clearTimeout(duckTimerRef.current);
      duckTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearEngineTimers();
    };
  }, []);

  useEffect(() => {
    const syncDefeated = () => setDefeatedBotIds(loadDefeatedBots());
    window.addEventListener(PROGRESS_EVENT, syncDefeated);
    return () => window.removeEventListener(PROGRESS_EVENT, syncDefeated);
  }, []);

  useEffect(() => {
    if (!showAssistsMenu && !showPlayModeMenu && !showTimeMenu) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (showAssistsMenu && assistsMenuRef.current && !assistsMenuRef.current.contains(target)) {
        setShowAssistsMenu(false);
      }
      if (showPlayModeMenu && playModeMenuRef.current && !playModeMenuRef.current.contains(target)) {
        setShowPlayModeMenu(false);
      }
      if (showTimeMenu && timeMenuRef.current && !timeMenuRef.current.contains(target)) {
        setShowTimeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showAssistsMenu, showPlayModeMenu, showTimeMenu]);

  // Sync if parent passes a new initialVariant or customVariantConfig
  useEffect(() => {
    if (customVariantConfig) {
      customHistoryStackRef.current = [];
      const freshCustom = createCustomGameState(customVariantConfig);
      setActiveCustomConfig(customVariantConfig);
      customStateRef.current = freshCustom;
      setCustomState(freshCustom);
      setSelectedVariant(initialVariant);
      resetSharedMatchState(initialTimeSec);
      if (opponentModeRef.current !== 'local_2p' && playerColorRef.current === 'b') {
        triggerCustomAIMove(freshCustom);
      }
    } else if (initialVariant !== selectedVariant || (!activeCustomConfig && CUSTOM_ENGINE_VARIANTS.includes(initialVariant))) {
      startNewGame(initialVariant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialVariant, customVariantConfig]);

  // Launch a specific bot (e.g. Adaptive Coach AI) requested from CoachView
  useEffect(() => {
    if (!botChallengeRequest) return;
    const requested = AI_BOT_PROFILES.find(b => b.id === botChallengeRequest.botId);
    if (!requested) return;
    if (botChallengeRequest.posture) {
      adaptivePostureRef.current = botChallengeRequest.posture;
      setAdaptivePosture(botChallengeRequest.posture);
    }
    const targetMode: OpponentMode = botChallengeRequest.mode || 'coach';
    rawSelectedBotRef.current = requested;
    selectedBotRef.current = requested;
    setSelectedBot(requested);
    setShowCustomElo(false);
    setOpponentMode(targetMode);
    if (targetMode === 'coach') {
      applyAssistPreset('coach');
    }
    const resolvedColor: PieceColor =
      sidePreference === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : sidePreference;
    setPlayerColor(resolvedColor);
    setIsFlipped(resolvedColor === 'b');
    setShowCharacterModal(false);
    startNewGame('standard', null, resolvedColor, 'default', targetMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botChallengeRequest]);

  // Automatically enter Online (Classic Only) arena when opening a ?challenge= URL
  useEffect(() => {
    if (!pendingChallengeCode) return;
    setSelectedVariant('standard');
    selectedVariantRef.current = 'standard';
    setActiveCustomConfig(null);
    customStateRef.current = null;
    setCustomState(null);
    setOpponentMode('online');
    opponentModeRef.current = 'online';
    setZenMode(false);
  }, [pendingChallengeCode]);

  // Launch quick-play pairing requested from HomeView
  useEffect(() => {
    if (!quickPlayRequest) return;
    const targetMode: OpponentMode = quickPlayRequest.mode;
    if (targetMode === 'online') {
      setSelectedVariant('standard');
      selectedVariantRef.current = 'standard';
      setActiveCustomConfig(null);
      customStateRef.current = null;
      setCustomState(null);
      setOpponentMode('online');
      opponentModeRef.current = 'online';
      setZenMode(false);
      return;
    }
    const foundPreset = TIME_PRESETS.find(p => p.id === quickPlayRequest.presetId);
    const resolvedSecs = foundPreset ? foundPreset.seconds : initialTimeSecRef.current;
    if (foundPreset) {
      applyTimePreset(foundPreset.id);
      initialTimeSecRef.current = foundPreset.seconds;
    }
    const targetVariant: VariantId = quickPlayRequest.variant || 'standard';
    setOpponentMode(targetMode);
    if (targetMode === 'local_2p') {
      setShowCustomElo(false);
      setPlayerColor('w');
      setIsFlipped(false);
      startNewGame(targetVariant, null, 'w', 'default', 'local_2p', resolvedSecs);
    } else {
      if (targetMode === 'coach') {
        applyAssistPreset('coach');
      }
      const resolvedColor: PieceColor =
        sidePreference === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : sidePreference;
      setPlayerColor(resolvedColor);
      setIsFlipped(resolvedColor === 'b');
      startNewGame(targetVariant, null, resolvedColor, 'default', targetMode, resolvedSecs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickPlayRequest]);

  // Launch custom position from PositionEditor or AnalysisBoard into Play Arena
  useEffect(() => {
    if (!initialFenRequest) return;
    try {
      const nextChess = new Chess(initialFenRequest.fen);
      selectedVariantRef.current = 'standard';
      setSelectedVariant('standard');
      setActiveCustomConfig(null);
      customStateRef.current = null;
      setCustomState(null);
      resetSharedMatchState(initialTimeSecRef.current);
      setStartFenForReplay(nextChess.fen());
      chessRef.current = nextChess;
      setChess(nextChess);
      setEvalScore(evaluateBoard(nextChess));
      const desiredColor: PieceColor = opponentModeRef.current === 'local_2p' ? 'w' : nextChess.turn();
      playerColorRef.current = desiredColor;
      setPlayerColor(desiredColor);
      setIsFlipped(desiredColor === 'b');
      setFenStatus('Custom position loaded');
    } catch {
      // ignore invalid fen request
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFenRequest]);

  const applyAssistPreset = (preset: 'coach' | 'standard' | 'challenge') => {
    setAssistPreset(preset);
    if (preset === 'coach') {
      setHintsEnabled(true);
      setUndosEnabled(true);
      setLiveTipsEnabled(true);
      setShowThreats(true);
      if (onUpdateSettings) {
        onUpdateSettings({
          ...settings,
          showLiveEval: true,
          evalBarPosition: settings.evalBarPosition === 'hidden' ? 'left' : settings.evalBarPosition,
          highlightLegalMoves: true
        });
      }
    } else if (preset === 'standard') {
      setHintsEnabled(true);
      setUndosEnabled(true);
      setLiveTipsEnabled(true);
      setShowThreats(false);
      if (onUpdateSettings) {
        onUpdateSettings({
          ...settings,
          showLiveEval: true,
          evalBarPosition: settings.evalBarPosition === 'hidden' ? 'left' : settings.evalBarPosition
        });
      }
    } else {
      setHintsEnabled(false);
      setUndosEnabled(false);
      setLiveTipsEnabled(false);
      setShowThreats(false);
      setHintArrow(null);
      setHintText(null);
      setLiveCoachTip(null);
      if (onUpdateSettings) {
        onUpdateSettings({ ...settings, showLiveEval: false, evalBarPosition: 'hidden' });
      }
    }
  };

  const resetSharedMatchState = (timeSec: number) => {
    clearEngineTimers();
    matchGenRef.current += 1;
    setWhiteTime(timeSec);
    setBlackTime(timeSec);
    setClockRunning(false);
    setClockPaused(false);
    analyzedMovesRef.current = [];
    setAnalyzedMoves([]);
    gameOverRef.current = null;
    setGameOverResult(null);
    setHintArrow(null);
    setHintText(null);
    setLiveCoachTip(null);
    setCoachLesson(null);
    setLoadingCoachDeep(false);
    setCoachDeepError(null);
    setLoadingCoachOffline(false);
    setCoachHintStep(0);
    setChecksWhite(0);
    setChecksBlack(0);
    duckSquareRef.current = null;
    setDuckSquare(null);
    setIsPlacingDuck(false);
    evalScoreRef.current = 0;
    setEvalScore(0);
    setIsEvaluating(false);
    setReviewPly(null);
    setNotationText('');
    setNotationError(null);
    setFenStatus(null);
    standardFenStackRef.current = [];
    crazyhousePocketStackRef.current = [];
    customHistoryStackRef.current = [];
    crazyhousePocketRef.current = { w: [], b: [] };
    setCrazyhousePocket({ w: [], b: [] });
    setSelectedDropPiece(null);
    updatePremoveQueue([]);
  };

  const startNewGame = (
    variantId = selectedVariant,
    forcedCustom?: CustomVariantConfig | null,
    forcedColor?: PieceColor,
    forcedOpeningId?: string,
    forcedOpponentMode?: OpponentMode,
    forcedInitialTimeSec?: number
  ) => {
    const nextColor = forcedColor || playerColor;
    const effectiveMode = forcedOpponentMode || opponentMode;
    const customCfg =
      forcedCustom !== undefined
        ? forcedCustom
        : CUSTOM_ENGINE_VARIANTS.includes(variantId)
        ? variantToCustomConfig(variantId)
        : null;

    selectedVariantRef.current = variantId;
    playerColorRef.current = nextColor;
    opponentModeRef.current = effectiveMode;

    setSelectedVariant(variantId);
    setActiveCustomConfig(customCfg);
    resetSharedMatchState(forcedInitialTimeSec ?? initialTimeSec);

    if (customCfg) {
      const freshCustom = createCustomGameState(customCfg);
      customStateRef.current = freshCustom;
      setCustomState(freshCustom);
      if (effectiveMode !== 'local_2p' && nextColor === 'b') {
        triggerCustomAIMove(freshCustom);
      }
    } else {
      customStateRef.current = null;
      setCustomState(null);
      const freshChess = createInitialChess(variantId);
      setStartFenForReplay(freshChess.fen());

      const targetOpeningId =
        forcedOpeningId ?? (variantId === 'standard' ? openingId : 'default');
      const starter = OPENING_STARTERS.find(o => o.id === targetOpeningId);
      const seededMoves: MoveAnalysis[] = [];
      if (variantId === 'standard' && starter && starter.moves.length > 0) {
        for (const san of starter.moves) {
          const prevEval = evaluateBoard(freshChess);
          const m = freshChess.move(san);
          if (!m) break;
          const afterEval = evaluateBoard(freshChess);
          seededMoves.push({
            san: m.san,
            from: m.from,
            to: m.to,
            classification: 'book',
            evalBefore: prevEval,
            evalAfter: afterEval,
            moveAccuracy: 100
          });
        }
        analyzedMovesRef.current = seededMoves;
        setAnalyzedMoves(seededMoves);
        setEvalScore(evaluateBoard(freshChess));
      }

      chessRef.current = freshChess;
      setChess(freshChess);
      if (effectiveMode !== 'local_2p' && !freshChess.isGameOver() && freshChess.turn() !== nextColor) {
        triggerAIMove(freshChess);
      }
    }
  };

  const handleSelectOpeningStarter = (newOpeningId: string) => {
    setOpeningId(newOpeningId);
    startNewGame('standard', null, playerColor, newOpeningId);
  };

  const handleQueuePremove = (pm: QueuedPremove) => {
    const mode = settingsRef.current.premoveMode || 'infinite';
    if (mode === 'off') return;
    if (mode === '2') {
      updatePremoveQueue(prev => {
        if (prev.length < 2) return [...prev, pm];
        // Avoid leaving an orphaned dependent move when shifting at cap 2
        if (prev[1].from === prev[0].to || pm.from === prev[0].to) return [pm];
        return [prev[1], pm];
      });
    } else {
      updatePremoveQueue(prev => [...prev, pm]);
    }
    sounds.playPremove();
  };

  const handleUndoLastPremove = () => {
    if (premoveQueueRef.current.length > 0) {
      updatePremoveQueue(prev => prev.slice(0, -1));
    }
  };

  const handleCancelPremoves = () => {
    if (premoveQueueRef.current.length > 0) {
      updatePremoveQueue([]);
    }
  };

  const isCustomMode = !!customState;
  const activeTurn: PieceColor = customState ? customState.turn : chess.turn();

  // Clock countdown loop (pure tick; timeout side-effect handled below in dedicated effect)
  useEffect(() => {
    if (!clockRunning || clockPaused || gameOverResult) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (activeTurn === 'w') {
        setWhiteTime(prev => Math.max(0, prev - 1));
      } else {
        setBlackTime(prev => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [clockRunning, clockPaused, activeTurn, gameOverResult]);

  const handleTimeout = (loserColor: PieceColor) => {
    setClockRunning(false);
    const result = loserColor === 'w' ? '0-1' : '1-0';
    finishGame(result, 'timeout');
  };

  useEffect(() => {
    if (!clockRunning || clockPaused || gameOverResult) return;
    if (whiteTime === 0) {
      handleTimeout('w');
    } else if (blackTime === 0) {
      handleTimeout('b');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockRunning, clockPaused, whiteTime, blackTime, gameOverResult]);

  const applyTimePreset = (presetId: string) => {
    if (presetId === 'custom') {
      setSelectedPresetId('custom');
      setShowCustomTime(true);
      return;
    }
    const found = TIME_PRESETS.find(p => p.id === presetId);
    if (!found) return;
    setSelectedPresetId(found.id);
    setShowCustomTime(false);
    setInitialTimeSec(found.seconds);
    setIncrementSec(found.increment);
    setTimeControlName(found.label);
    setWhiteTime(found.seconds);
    setBlackTime(found.seconds);
    setClockRunning(false);
  };

  const applyCustomTime = () => {
    const mins = Math.max(1, Math.min(180, customMinutesInput || 5));
    const inc = Math.max(0, Math.min(60, customIncInput || 0));
    const secs = mins * 60;
    setInitialTimeSec(secs);
    setIncrementSec(inc);
    setTimeControlName(`Custom ${mins}+${inc}`);
    setWhiteTime(secs);
    setBlackTime(secs);
    setClockRunning(false);
    setShowCustomTime(false);
  };

  // Handle Custom / Chaturanga Engine Move
  const handleCustomMove = (moveTarget: CustomBoardMoveTarget) => {
    if (!customState || customState.winner || gameOverResult || isPlacingDuck) return;

    const allLegal = getAllLegalMoves(customState);
    const matched = allLegal.find(
      m =>
        m.fromRow === moveTarget.fromRow &&
        m.fromCol === moveTarget.fromCol &&
        m.toRow === moveTarget.toRow &&
        m.toCol === moveTarget.toCol
    );
    if (!matched) return;

    const evalBefore = evaluateCustomBoard(customState.grid);
    customHistoryStackRef.current.push(customState);
    const nextState = executeCustomMove(customState, matched);
    customStateRef.current = nextState;
    setCustomState(nextState);

    if (!clockRunning) setClockRunning(true);
    if (incrementSec > 0) {
      if (customState.turn === 'w') setWhiteTime(t => t + incrementSec);
      else setBlackTime(t => t + incrementSec);
    }

    if (matched.captured) sounds.playCapture();
    else sounds.playMove();

    const evalAfter = evaluateCustomBoard(nextState.grid);
    setEvalScore(evalAfter);

    const analysis: MoveAnalysis = {
      san: matched.san,
      from: `${matched.fromRow},${matched.fromCol}`,
      to: `${matched.toRow},${matched.toCol}`,
      classification: 'good',
      evalBefore,
      evalAfter
    };
    const updatedCustomMoves = [...analyzedMovesRef.current, analysis];
    analyzedMovesRef.current = updatedCustomMoves;
    setAnalyzedMoves(updatedCustomMoves);
    setHintText(null);

    if (nextState.winner) {
      const res = nextState.winner === 'w' ? '1-0' : nextState.winner === 'b' ? '0-1' : '1/2-1/2';
      finishGame(res, nextState.winReason || 'variant_goal');
      return;
    }

    if (nextState.config.rules.allowDuckPlacement && (opponentMode === 'local_2p' || nextState.turn !== playerColor)) {
      setIsPlacingDuck(true);
      return;
    }

    if (opponentMode !== 'local_2p' && nextState.turn !== playerColor) {
      triggerCustomAIMove(nextState);
    }
  };

  const handleCustomPlaceDuck = (pos: { row: number; col: number }) => {
    if (!customState) return;
    const updated: CustomGameState = { ...customState, duckPos: pos };
    setCustomState(updated);
    setIsPlacingDuck(false);
    if (opponentMode !== 'local_2p' && updated.turn !== playerColor && !updated.winner) {
      triggerCustomAIMove(updated);
    }
  };

  const triggerCustomAIMove = (stateSnapshot: CustomGameState) => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    const gen = matchGenRef.current;
    setIsEvaluating(true);
    const thinkMode = settingsRef.current.aiThinkingMode || 'human';
    let delay = settingsRef.current.batterySaver ? 200 : 420;
    if (thinkMode === 'human' && !settingsRef.current.batterySaver) {
      const botRemainingSec = stateSnapshot.turn === 'w' ? whiteTimeRef.current : blackTimeRef.current;
      const initSec = initialTimeSecRef.current;
      if (botRemainingSec <= 15) {
        delay = 280 + Math.round(Math.random() * 240);
      } else {
        const base = initSec <= 120 ? 550 : initSec <= 300 ? 950 : 1350;
        const phaseScale = stateSnapshot.history.length <= 6 ? 0.65 : 1.0;
        delay = Math.round(base * phaseScale * (0.8 + Math.random() * 0.45));
      }
    }
    // Variant bot searches in the engine worker while its think delay elapses
    aiRequestTokenRef.current += 1;
    const requestToken = aiRequestTokenRef.current;
    const liveBot = resolveLiveBotForMove();
    const aiMoveRequest = engineGetCustomAIMove(stateSnapshot, liveBot).catch(() =>
      getCustomAIMove(stateSnapshot, liveBot)
    );
    aiTimerRef.current = setTimeout(() => {
      aiTimerRef.current = null;
      aiMoveRequest.then(aiMove => {
      if (requestToken !== aiRequestTokenRef.current || gen !== matchGenRef.current || gameOverRef.current) {
        setIsEvaluating(false);
        return;
      }
      setIsEvaluating(false);
      if (!aiMove) {
        finishGame('1/2-1/2', 'stalemate');
        return;
      }

      const evalBefore = evaluateCustomBoard(stateSnapshot.grid);
      customHistoryStackRef.current.push(stateSnapshot);
      let nextState = executeCustomMove(stateSnapshot, aiMove);

      if (nextState.config.rules.allowDuckPlacement && !nextState.winner) {
        const smartPos = chooseSmartDuckPos(nextState);
        if (smartPos) {
          nextState = {
            ...nextState,
            duckPos: smartPos
          };
        }
      }

      customStateRef.current = nextState;
      setCustomState(nextState);
      if (aiMove.captured) sounds.playCapture();
      else sounds.playMove();

      const evalAfter = evaluateCustomBoard(nextState.grid);
      setEvalScore(evalAfter);
      const aiAnalysis: MoveAnalysis = {
        san: aiMove.san,
        from: `${aiMove.fromRow},${aiMove.fromCol}`,
        to: `${aiMove.toRow},${aiMove.toCol}`,
        classification: 'good',
        evalBefore,
        evalAfter
      };
      const updatedAiMoves = [...analyzedMovesRef.current, aiAnalysis];
      analyzedMovesRef.current = updatedAiMoves;
      setAnalyzedMoves(updatedAiMoves);

      if (nextState.winner) {
        const res = nextState.winner === 'w' ? '1-0' : nextState.winner === 'b' ? '0-1' : '1/2-1/2';
        finishGame(res, nextState.winReason || 'variant_goal');
      }
      });
    }, delay);
  };

  // Standard chess.js move handler
  const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

  const handleMakeMove = ({
    from,
    to,
    promotion = 'q',
    isPremoveExecution = false
  }: {
    from: Square;
    to: Square;
    promotion?: string;
    isPremoveExecution?: boolean;
  }) => {
    if (gameOverRef.current || isPlacingDuck) return;
    const activeChess = chessRef.current;
    const activePlayerColor = playerColorRef.current;
    const activeMode = opponentModeRef.current;
    const activeVariant = selectedVariantRef.current;
    const plyIdx = analyzedMovesRef.current.length;

    try {
      const fenBefore = activeChess.fen();
      const chessBefore = new Chess(fenBefore);
      const move = activeChess.move({ from, to, promotion });
      if (!move) return;

      standardFenStackRef.current.push(fenBefore);
      crazyhousePocketStackRef.current.push({
        w: [...crazyhousePocketRef.current.w],
        b: [...crazyhousePocketRef.current.b]
      });

      if (activeVariant === 'crazyhouse' && move.captured) {
        const capType = move.captured as DropPieceType;
        const nextPocket = {
          w: [...crazyhousePocketRef.current.w],
          b: [...crazyhousePocketRef.current.b]
        };
        nextPocket[move.color].push(capType);
        crazyhousePocketRef.current = nextPocket;
        setCrazyhousePocket(nextPocket);
      }
      setSelectedDropPiece(null);

      setReviewPly(null);
      setCoachHintStep(0);
      setCoachDeepError(null);

      if (!clockRunning) setClockRunning(true);
      if (incrementSec > 0) {
        if (move.color === 'w') setWhiteTime(t => t + incrementSec);
        else setBlackTime(t => t + incrementSec);
      }

      if (isPremoveExecution) sounds.playPremove();
      else if (activeChess.inCheck()) sounds.playCheck();
      else if (move.promotion) sounds.playPromote();
      else if (move.captured) sounds.playCapture();
      else if (move.flags.includes('k') || move.flags.includes('q')) sounds.playCastle();
      else sounds.playMove();

      // Grade the move in the engine worker so the board never waits on search.
      // A provisional entry keeps the move list, replay and takeback in sync immediately.
      const provisional: MoveAnalysis = {
        san: move.san,
        from: move.from,
        to: move.to,
        promotion: move.promotion,
        classification: 'good',
        evalBefore: evaluateBoard(chessBefore),
        evalAfter: evaluateBoard(activeChess),
        pending: true
      };
      const updatedMoves = [...analyzedMovesRef.current, provisional];
      analyzedMovesRef.current = updatedMoves;
      setAnalyzedMoves(updatedMoves);
      setHintArrow(null);
      setHintText(null);

      const showEvalNow = activeMode !== 'ai' || settingsRef.current.showLiveEval !== false;
      const threatsAfterMove = activeMode === 'coach' ? getThreatenedSquares(activeChess, activePlayerColor) : [];

      const applyAnalysis = (analysis: MoveAnalysis) => {
        finalizedAnalysesRef.current.set(provisional, analysis);
        const idx = analyzedMovesRef.current.indexOf(provisional);
        if (idx === -1) return -1; // new game or taken back
        const patched = [...analyzedMovesRef.current];
        patched[idx] = analysis;
        analyzedMovesRef.current = patched;
        setAnalyzedMoves(patched);
        return idx;
      };

      const analysisJob = engineAnalyzeMove(
        fenBefore,
        { from: move.from, to: move.to, promotion: move.promotion },
        32,
        plyIdx,
        engineOpts()
      )
        .then(quality => {
          const analysis: MoveAnalysis = {
            san: move.san,
            from: move.from,
            to: move.to,
            promotion: move.promotion,
            classification: quality.classification,
            evalBefore: quality.evalBefore,
            evalAfter: quality.evalAfter,
            moveAccuracy: quality.moveAccuracy,
            bestMoveSan: quality.bestMoveSan,
            bestMoveFrom: quality.bestMoveFrom,
            bestMoveTo: quality.bestMoveTo,
            pvSan: quality.pvSan,
            commentary: quality.commentary
          };
          const idx = applyAnalysis(analysis);
          if (idx === -1) return;
          const isLatestMove = idx === analyzedMovesRef.current.length - 1;
          if (isLatestMove) setEvalScore(quality.evalAfter);

          if (activeMode === 'coach') {
            const isPlayerMove = move.color === activePlayerColor;
            const oppReasons = !isPlayerMove ? quality.reasons : [];

            setCoachLesson(prev => {
              const prevWasPlayerSlip =
                prev &&
                prev.mover === 'player' &&
                (prev.classification === 'inaccuracy' ||
                  prev.classification === 'mistake' ||
                  prev.classification === 'missed_win' ||
                  prev.classification === 'blunder');

              if (!isPlayerMove && prevWasPlayerSlip && prev) {
                return {
                  ...prev,
                  evalLabel: formatEvaluation(quality.evalAfter),
                  threats: threatsAfterMove,
                  opponentReplyNote: `${selectedBotRef.current.name} replied ${move.san}: ${oppReasons[0] || 'Look closely at what changed.'}`
                };
              }

              return {
                ply: idx + 1,
                san: move.san,
                mover: isPlayerMove ? 'player' : 'ai',
                classification: quality.classification,
                moveAccuracy: quality.moveAccuracy,
                bestMoveSan: quality.bestMoveSan,
                bestMoveFrom: quality.bestMoveFrom,
                bestMoveTo: quality.bestMoveTo,
                pvSan: quality.pvSan,
                evalLabel: formatEvaluation(quality.evalAfter),
                commentary: quality.commentary,
                opponentIntent: oppReasons[0],
                threats: threatsAfterMove,
                fenBefore,
                evalBeforeCp: quality.evalBefore,
                evalAfterCp: quality.evalAfter,
                aiDeepNote: null
              };
            });
          }

          if (
            liveTipsEnabledRef.current &&
            showEvalNow &&
            activeMode !== 'coach' &&
            (activeMode === 'local_2p' || move.color === activePlayerColor)
          ) {
            const sideLabel = activeMode === 'local_2p' ? (move.color === 'w' ? 'White' : 'Black') : 'You';
            const meta = CLASSIFICATION_META[quality.classification];
            const tone: 'good' | 'info' | 'warn' =
              quality.classification === 'blunder' ||
              quality.classification === 'mistake' ||
              quality.classification === 'missed_win'
                ? 'warn'
                : quality.classification === 'brilliant' ||
                  quality.classification === 'great' ||
                  quality.classification === 'best' ||
                  quality.classification === 'book'
                ? 'good'
                : 'info';
            setLiveCoachTip({
              title: `${sideLabel}: ${move.san} · ${meta.label} (${quality.moveAccuracy}%)`,
              body: quality.reasons[0] || quality.commentary,
              tone
            });
          }
        })
        .catch(() => {
          // Analysis unavailable: keep the move, just drop the "pending" marker
          applyAnalysis({ ...provisional, pending: undefined });
        });
      pendingAnalysesRef.current.add(analysisJob);
      analysisJob.finally(() => pendingAnalysesRef.current.delete(analysisJob));

      if (!showEvalNow) {
        setLiveCoachTip(null);
      }

      if (activeVariant === 'three_check' && activeChess.inCheck()) {
        if (move.color === 'w') {
          const nextCount = checksWhite + 1;
          setChecksWhite(nextCount);
          if (nextCount >= 3) {
            finishGame('1-0', 'Three checks delivered! White wins.');
            return;
          }
        } else {
          const nextCount = checksBlack + 1;
          setChecksBlack(nextCount);
          if (nextCount >= 3) {
            finishGame('0-1', 'Three checks delivered! Black wins.');
            return;
          }
        }
      }

      if (activeVariant === 'king_of_the_hill') {
        const kingWinner = checkKingOfTheHillWin(activeChess);
        if (kingWinner) {
          finishGame(kingWinner === 'w' ? '1-0' : '0-1', 'King reached center hill! Victory.');
          return;
        }
      }

      if (activeVariant === 'racing_kings') {
        const racingWinner = checkRacingKingsWin(activeChess);
        if (racingWinner) {
          finishGame(racingWinner === 'w' ? '1-0' : '0-1', 'King reached the 8th rank! Victory.');
          return;
        }
      }

      if (activeVariant === 'duck_chess' && (activeMode === 'local_2p' || move.color === activePlayerColor)) {
        setIsPlacingDuck(true);
      }

      if (activeChess.isGameOver()) {
        updatePremoveQueue([]);
        if (activeChess.isCheckmate()) {
          const result = activeChess.turn() === 'w' ? '0-1' : '1-0';
          finishGame(result, 'checkmate');
        } else if (activeChess.isDraw()) {
          finishGame('1/2-1/2', 'stalemate / draw');
        }
        return;
      }

      if (activeMode !== 'local_2p' && activeChess.turn() !== activePlayerColor && activeVariant !== 'duck_chess') {
        triggerAIMove(activeChess);
      }
    } catch {
      // Invalid move attempt
    }
  };

  const handleMakeMoveRef = useRef(handleMakeMove);
  handleMakeMoveRef.current = handleMakeMove;

  const handlePlaceDuck = (square: Square) => {
    duckSquareRef.current = square;
    setDuckSquare(square);
    setIsPlacingDuck(false);
    if (opponentModeRef.current !== 'local_2p' && chessRef.current.turn() !== playerColorRef.current) {
      triggerAIMove(chessRef.current);
    }
  };

  const triggerAIMove = (currentBoard: Chess) => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    if (premoveTimerRef.current) clearTimeout(premoveTimerRef.current);
    const gen = matchGenRef.current;
    setIsEvaluating(true);
    const thinkMode = settingsRef.current.aiThinkingMode || 'human';
    const liveBot = resolveLiveBotForMove();
    selectedBotRef.current = liveBot;
    let delay: number;
    if (thinkMode === 'instant' || settingsRef.current.batterySaver) {
      delay = settingsRef.current.batterySaver ? 180 : 380;
    } else {
      const botColor = currentBoard.turn() as PieceColor;
      const botRemainingSec = botColor === 'w' ? whiteTimeRef.current : blackTimeRef.current;
      const expectedCpuMs =
        liveBot.timeLimitMs ??
        (liveBot.depth >= 4
          ? 340
          : liveBot.depth === 3
          ? 240
          : liveBot.depth === 2
          ? 150
          : 30);
      const targetHumanMs = computeHumanThinkDelayMs(
        currentBoard,
        liveBot,
        initialTimeSecRef.current,
        botRemainingSec
      );
      delay = Math.max(220, targetHumanMs - Math.round(expectedCpuMs * 0.5));
    }

    // The bot searches in the engine worker while its human-like think delay elapses
    aiRequestTokenRef.current += 1;
    const requestToken = aiRequestTokenRef.current;
    const requestFen = currentBoard.fen();
    const botMoveRequest = engineGetAIMove(currentBoard, liveBot, engineOpts()).catch(() => null);

    aiTimerRef.current = setTimeout(() => {
      aiTimerRef.current = null;
      botMoveRequest.then(botMove => {
      if (
        requestToken !== aiRequestTokenRef.current ||
        gen !== matchGenRef.current ||
        currentBoard.isGameOver() ||
        gameOverRef.current ||
        currentBoard.fen() !== requestFen
      ) {
        setIsEvaluating(false);
        return;
      }
      setIsEvaluating(false);

      if (botMove) {
        handleMakeMoveRef.current({
          from: botMove.from as Square,
          to: botMove.to as Square,
          promotion: botMove.promotion
        });

        if (selectedVariantRef.current === 'duck_chess') {
          duckTimerRef.current = setTimeout(() => {
            duckTimerRef.current = null;
            if (gen !== matchGenRef.current || gameOverRef.current) return;
            const emptySquares: Square[] = [];
            const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            for (let f = 0; f < 8; f++) {
              for (let r = 1; r <= 8; r++) {
                const sq = `${files[f]}${r}` as Square;
                if (!currentBoard.get(sq) && sq !== duckSquareRef.current) {
                  emptySquares.push(sq);
                }
              }
            }
            if (emptySquares.length > 0) {
              const randomSq = emptySquares[Math.floor(Math.random() * emptySquares.length)];
              duckSquareRef.current = randomSq;
              setDuckSquare(randomSq);
              setIsPlacingDuck(false);
            }
          }, 180);
        }

        // Execute next queued premove almost instantly (Chess.com feel) if still legal after AI responds
        const activeColor = playerColorRef.current;
        if (
          gen === matchGenRef.current &&
          !gameOverRef.current &&
          !currentBoard.isGameOver() &&
          currentBoard.turn() === activeColor &&
          selectedVariantRef.current !== 'duck_chess' &&
          premoveQueueRef.current.length > 0
        ) {
          premoveTimerRef.current = setTimeout(() => {
            premoveTimerRef.current = null;
            const colorNow = playerColorRef.current;
            const queue = premoveQueueRef.current;
            if (
              gen !== matchGenRef.current ||
              gameOverRef.current ||
              queue.length === 0 ||
              currentBoard.isGameOver() ||
              currentBoard.turn() !== colorNow
            ) {
              return;
            }
            const [nextPm, ...rest] = queue;
            const legalMatch = currentBoard
              .moves({ square: nextPm.from, verbose: true })
              .find(m => m.to === nextPm.to && (!m.promotion || m.promotion === (nextPm.promotion || 'q')));

            if (legalMatch && nextPm.to !== duckSquareRef.current) {
              updatePremoveQueue(rest);
              handleMakeMoveRef.current({
                from: nextPm.from,
                to: nextPm.to,
                promotion: nextPm.promotion || (legalMatch.promotion ? 'q' : undefined),
                isPremoveExecution: true
              });
            } else {
              // Cancel invalidated premove chain immediately
              updatePremoveQueue([]);
            }
          }, 25);
        }
      }
      });
    }, delay);
  };

  const buildMoveTextFromList = (moves: MoveAnalysis[]) => {
    const parts: string[] = [];
    for (let i = 0; i < moves.length; i += 2) {
      const num = Math.floor(i / 2) + 1;
      const wSan = moves[i]?.san || '';
      const bSan = moves[i + 1]?.san;
      parts.push(bSan ? `${num}. ${wSan} ${bSan}` : `${num}. ${wSan}`);
    }
    return parts.join(' ');
  };

  const finishGame = (result: '1-0' | '0-1' | '1/2-1/2', reason: string) => {
    clearEngineTimers();
    setClockRunning(false);
    const overObj = { result, reason };
    gameOverRef.current = overObj;
    setGameOverResult(overObj);

    const activePlayerColor = playerColorRef.current;
    const activeMode = opponentModeRef.current;
    const activeBot = selectedBotRef.current;
    const activeVariant = selectedVariantRef.current;
    const activeChess = chessRef.current;
    const activeCustom = customStateRef.current;
    const inCustom = !!activeCustom;
    const movesAtFinish = analyzedMovesRef.current;
    const pgnAtFinish = inCustom
      ? buildMoveTextFromList(movesAtFinish)
      : activeChess.history().length === movesAtFinish.length
      ? activeChess.pgn()
      : buildMoveTextFromList(movesAtFinish);

    if ((result === '1-0' && activePlayerColor === 'w') || (result === '0-1' && activePlayerColor === 'b')) {
      sounds.playVictory();
      if (activeMode !== 'local_2p' && activeBot.id && !activeBot.isCustom) {
        setDefeatedBotIds(recordDefeatedBot(activeBot.id));
      }
    }

    // Save once the engine worker has finished grading the final moves
    const saveRecord = () => {
      const movesSnapshot = movesAtFinish.map(m => finalizedAnalysesRef.current.get(m) ?? m);
      const accuracyW = calculateAccuracyFromMoves(movesSnapshot, 'w');
      const accuracyB = calculateAccuracyFromMoves(movesSnapshot, 'b');
      const blunders = movesSnapshot.filter(m => m.classification === 'blunder').length;

      const gameRecord: GameHistoryItem = {
        id: `game-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        variant: activeVariant,
        playerColor: activePlayerColor,
        opponentName:
          activeMode === 'local_2p'
            ? 'Pass & Play (Local 2P)'
            : activeMode === 'coach'
            ? `${activeBot.name} (Coach)`
            : activeBot.name,
        opponentElo: activeMode === 'local_2p' ? 0 : activeBot.elo,
        timeControl: timeControlName,
        result,
        reason: reason as GameHistoryItem['reason'],
        movesCount: movesSnapshot.length,
        pgn: pgnAtFinish,
        startFen: !inCustom ? startFenForReplay : undefined,
        startCustomConfig: inCustom && activeCustom ? activeCustom.config : undefined,
        accuracyWhite: accuracyW,
        accuracyBlack: accuracyB,
        playerAccuracy: activePlayerColor === 'w' ? accuracyW : accuracyB,
        blundersCount: blunders,
        analyzedMoves: movesSnapshot
      };

      onSaveGame(gameRecord);
    };

    const inFlight = [...pendingAnalysesRef.current];
    if (inFlight.length > 0) {
      Promise.allSettled(inFlight).then(saveRecord);
    } else {
      saveRecord();
    }
  };

  const handleGetHint = () => {
    if (!hintsEnabled || !!gameOverResult) return;
    if (customState) {
      hintRequestTokenRef.current += 1;
      const token = hintRequestTokenRef.current;
      const stateAtRequest = customState;
      setHintText('Engine is thinking…');
      engineGetCustomAIMove(stateAtRequest)
        .then(suggestion => {
          if (token !== hintRequestTokenRef.current || customStateRef.current !== stateAtRequest) return;
          setHintText(suggestion ? `Engine suggests ${suggestion.san}` : null);
        })
        .catch(() => {
          if (token === hintRequestTokenRef.current) setHintText(null);
        });
      return;
    }
    // Time-bounded search in the engine worker (a fixed depth-4 search could take 30s+ on the UI thread)
    hintRequestTokenRef.current += 1;
    const token = hintRequestTokenRef.current;
    const board = chess;
    const fenAtRequest = board.fen();
    setHintText('Engine is thinking…');
    engineSearch(board, 4, 1200, engineOpts())
      .then(result => {
        if (token !== hintRequestTokenRef.current || board.fen() !== fenAtRequest) return;
        if (result.bestMove) {
          setHintArrow({ from: result.bestMove.from as Square, to: result.bestMove.to as Square });
          setHintText(`Engine recommends ${result.bestMove.san} (${formatEvaluation(result.score)})`);
        } else {
          setHintText(null);
        }
      })
      .catch(() => {
        if (token === hintRequestTokenRef.current) setHintText(null);
      });
  };

  const handleTakeback = () => {
    if (!undosEnabled || gameOverResult || isEvaluating) return;
    if (analyzedMoves.length === 0) return;

    clearEngineTimers();
    matchGenRef.current += 1;
    updatePremoveQueue([]);
    setReviewPly(null);
    setSelectedDropPiece(null);
    setIsPlacingDuck(false);

    if (isCustomMode && customState) {
      if (customHistoryStackRef.current.length === 0) return;
      const plyToUndo =
        opponentMode === 'local_2p'
          ? 1
          : customState.turn === playerColor && customHistoryStackRef.current.length >= 2
          ? 2
          : 1;
      let restored: CustomGameState | undefined;
      let undone = 0;
      for (let i = 0; i < plyToUndo; i++) {
        const popped = customHistoryStackRef.current.pop();
        if (popped) {
          restored = popped;
          undone++;
        }
      }
      if (!restored || undone === 0) return;
      customStateRef.current = restored;
      setCustomState(restored);
      const remaining = analyzedMoves.slice(0, Math.max(0, analyzedMoves.length - undone));
      analyzedMovesRef.current = remaining;
      setAnalyzedMoves(remaining);
      setHintArrow(null);
      setHintText(null);
      setCoachLesson(null);
      setCoachDeepError(null);
      setCoachHintStep(0);
      setEvalScore(evaluateCustomBoard(restored.grid));
      return;
    }

    // Undo 1 ply in local 2-player mode, or undo AI reply + player move when awaiting player in AI mode
    const plyToUndo =
      opponentMode === 'local_2p'
        ? 1
        : chess.turn() === playerColor && analyzedMoves.length >= 2
        ? 2
        : 1;

    let undone = 0;
    if (selectedVariant === 'crazyhouse' && standardFenStackRef.current.length > 0) {
      let restoredFen: string | undefined;
      let restoredPocket: { w: DropPieceType[]; b: DropPieceType[] } | undefined;
      for (let i = 0; i < plyToUndo; i++) {
        const f = standardFenStackRef.current.pop();
        const p = crazyhousePocketStackRef.current.pop();
        if (f) {
          restoredFen = f;
          restoredPocket = p;
          undone++;
        }
      }
      if (undone === 0 || !restoredFen) return;
      let restoredBoard: Chess;
      try {
        restoredBoard = new Chess(restoredFen);
      } catch {
        restoredBoard = new Chess(restoredFen, { skipValidation: true });
      }
      chessRef.current = restoredBoard;
      setChess(restoredBoard);
      if (restoredPocket) {
        crazyhousePocketRef.current = restoredPocket;
        setCrazyhousePocket(restoredPocket);
      }
    } else {
      for (let i = 0; i < plyToUndo; i++) {
        if (chess.undo()) {
          undone++;
          standardFenStackRef.current.pop();
          crazyhousePocketStackRef.current.pop();
        }
      }
      if (undone === 0) return;
    }

    const remaining = analyzedMoves.slice(0, Math.max(0, analyzedMoves.length - undone));
    analyzedMovesRef.current = remaining;
    setAnalyzedMoves(remaining);
    setHintArrow(null);
    setHintText(null);
    setCoachLesson(null);
    setCoachDeepError(null);
    setCoachHintStep(0);
    setEvalScore(evaluateBoard(chessRef.current));
  };

  const handleCrazyhouseDrop = (sq: Square) => {
    if (gameOverRef.current || isCustomMode || selectedVariantRef.current !== 'crazyhouse') return;
    if (!selectedDropPiece) return;
    const activeChess = chessRef.current;
    const side = activeChess.turn();
    if (opponentModeRef.current !== 'local_2p' && side !== playerColorRef.current) return;
    if (!crazyhousePocketRef.current[side].includes(selectedDropPiece)) return;
    if (activeChess.get(sq)) return;
    if (selectedDropPiece === 'p' && (sq[1] === '1' || sq[1] === '8')) return;

    const fenBefore = activeChess.fen();
    const parts = fenBefore.split(' ');
    const nextChess = new Chess(fenBefore, { skipValidation: true });
    nextChess.put({ type: selectedDropPiece, color: side }, sq);
    const placedFen = nextChess.fen().split(' ');
    const nextTurn: PieceColor = side === 'w' ? 'b' : 'w';
    const nextHalf = '0';
    const nextFull = side === 'b' ? String((parseInt(parts[5] || '1', 10) || 1) + 1) : parts[5] || '1';

    // Ensure dropping side does not leave its own king in check
    try {
      const checkSelfFen = [placedFen[0], side, parts[2] || '-', '-', nextHalf, parts[5] || '1'].join(' ');
      const selfBoard = new Chess(checkSelfFen, { skipValidation: true });
      if (selfBoard.inCheck()) {
        setNotationError('Cannot drop piece while leaving your king in check');
        return;
      }
    } catch {
      // ignore if custom start fen lacks a king
    }

    const finalFen = [placedFen[0], nextTurn, parts[2] || '-', '-', nextHalf, nextFull].join(' ');
    let droppedBoard: Chess;
    try {
      droppedBoard = new Chess(finalFen);
    } catch {
      droppedBoard = new Chess(finalFen, { skipValidation: true });
    }

    standardFenStackRef.current.push(fenBefore);
    crazyhousePocketStackRef.current.push({
      w: [...crazyhousePocketRef.current.w],
      b: [...crazyhousePocketRef.current.b]
    });

    const nextPocket = {
      w: [...crazyhousePocketRef.current.w],
      b: [...crazyhousePocketRef.current.b]
    };
    const rmIdx = nextPocket[side].indexOf(selectedDropPiece);
    if (rmIdx !== -1) nextPocket[side].splice(rmIdx, 1);
    crazyhousePocketRef.current = nextPocket;
    setCrazyhousePocket(nextPocket);
    setSelectedDropPiece(null);
    setNotationError(null);
    setReviewPly(null);

    chessRef.current = droppedBoard;
    setChess(droppedBoard);

    if (!clockRunning) setClockRunning(true);
    if (incrementSec > 0) {
      if (side === 'w') setWhiteTime(t => t + incrementSec);
      else setBlackTime(t => t + incrementSec);
    }

    if (droppedBoard.inCheck()) sounds.playCheck();
    else sounds.playMove();

    const dropLabel = selectedDropPiece === 'p' ? '' : selectedDropPiece.toUpperCase();
    const checkSuffix = droppedBoard.isCheckmate() ? '#' : droppedBoard.inCheck() ? '+' : '';
    const dropSan = `${dropLabel}@${sq}${checkSuffix}`;
    const evalBefore = evaluateBoard(activeChess);
    const evalAfter = evaluateBoard(droppedBoard);
    setEvalScore(evalAfter);

    const dropAnalysis: MoveAnalysis = {
      san: dropSan,
      from: sq,
      to: sq,
      classification: 'good',
      evalBefore,
      evalAfter
    };
    const updated = [...analyzedMovesRef.current, dropAnalysis];
    analyzedMovesRef.current = updated;
    setAnalyzedMoves(updated);

    if (droppedBoard.isGameOver()) {
      updatePremoveQueue([]);
      if (droppedBoard.isCheckmate()) {
        finishGame(droppedBoard.turn() === 'w' ? '0-1' : '1-0', 'checkmate');
      } else if (droppedBoard.isDraw()) {
        finishGame('1/2-1/2', 'stalemate / draw');
      }
      return;
    }

    if (opponentModeRef.current !== 'local_2p' && droppedBoard.turn() !== playerColorRef.current) {
      triggerAIMove(droppedBoard);
    }
  };

  const handleCoachStepHint = () => {
    if (isCustomMode || !!gameOverResult || chess.turn() !== playerColor) return;
    hintRequestTokenRef.current += 1;
    const token = hintRequestTokenRef.current;
    const board = chess;
    const fenAtRequest = board.fen();
    const step = coachHintStep;
    engineSearch(board, 3, 150, { quiescenceDepth: 2, withReasons: true, ...engineOpts() })
      .then(result => {
        if (token !== hintRequestTokenRef.current || board.fen() !== fenAtRequest) return;
        const best = result.bestMove;
        if (!best) return;
        const reasons = result.reasons;
        if (step === 0) {
          setCoachHintStep(1);
          setHintArrow({ from: best.from as Square, to: best.from as Square });
          setHintText(`Coach Tip: Focus on your ${best.piece.toUpperCase()} on ${best.from} — ${reasons[0] || 'improves piece activity.'}`);
        } else {
          setCoachHintStep(2);
          setHintArrow({ from: best.from as Square, to: best.to as Square });
          setHintText(`Coach Best Move: ${best.san} (${formatEvaluation(result.score)}) — ${reasons[0] || 'maintains initiative.'}`);
        }
      })
      .catch(() => {
        /* hint unavailable */
      });
  };

  const handleAskCoachDeepLive = async () => {
    if (!coachLesson || loadingCoachDeep) return;
    setLoadingCoachDeep(true);
    setCoachDeepError(null);
    try {
      const res = await fetch('/api/coach/explain-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fenBefore: coachLesson.fenBefore,
          playedSan: coachLesson.san,
          bestSan: coachLesson.bestMoveSan,
          classification: coachLesson.classification,
          evalBeforeCp: coachLesson.evalBeforeCp,
          evalAfterCp: coachLesson.evalAfterCp,
          moveAccuracy: coachLesson.moveAccuracy,
          pvSan: coachLesson.pvSan,
          threats: coachLesson.threats,
          mode: 'live_coach',
          playerColor
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCoachLesson(prev => (prev ? { ...prev, aiDeepNote: data } : prev));
      } else {
        let errMessage = 'Cloud Gemini coaching request failed.';
        try {
          const errJson = await res.json();
          if (errJson?.error) errMessage = errJson.error;
        } catch {
          // ignore
        }
        setCoachDeepError(errMessage);
      }
    } catch {
      setCoachDeepError('Network unavailable. Check your connection or use Local Breakdown below.');
    } finally {
      setLoadingCoachDeep(false);
    }
  };

  const handleUseLocalDeepLive = async () => {
    if (!coachLesson || loadingCoachOffline) return;
    setLoadingCoachOffline(true);
    setCoachDeepError(null);
    try {
      const res = await fetch('/api/coach/offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'move',
          playedSan: coachLesson.san,
          bestSan: coachLesson.bestMoveSan,
          classification: coachLesson.classification,
          evalBeforeCp: coachLesson.evalBeforeCp,
          evalAfterCp: coachLesson.evalAfterCp,
          moveAccuracy: coachLesson.moveAccuracy,
          pvSan: coachLesson.pvSan,
          threats: coachLesson.threats
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCoachLesson(prev => (prev ? { ...prev, aiDeepNote: data } : prev));
      } else {
        setCoachDeepError('Local coach breakdown service unavailable.');
      }
    } catch {
      setCoachDeepError('Unable to reach local coach breakdown endpoint.');
    } finally {
      setLoadingCoachOffline(false);
    }
  };

  const handleCopyPgn = async () => {
    const pgnText = isCustomMode
      ? buildMoveTextFromList(analyzedMoves)
      : chess.history().length === analyzedMoves.length
      ? chess.pgn()
      : buildMoveTextFromList(analyzedMoves);
    if (!pgnText) return;
    try {
      await navigator.clipboard.writeText(pgnText);
      setCopiedPgn(true);
      setTimeout(() => setCopiedPgn(false), 1800);
    } catch {
      // clipboard permission unavailable
    }
  };

  const handleCopyFen = async () => {
    if (isCustomMode) return;
    try {
      await navigator.clipboard.writeText(chess.fen());
      setCopiedFen(true);
      setTimeout(() => setCopiedFen(false), 1800);
    } catch {
      // clipboard permission unavailable
    }
  };

  const handleLoadFen = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCustomMode) return;
    const raw = fenInput.trim();
    if (!raw) return;
    try {
      const nextChess = new Chess(raw);
      resetSharedMatchState(initialTimeSec);
      setStartFenForReplay(nextChess.fen());
      chessRef.current = nextChess;
      setChess(nextChess);
      setEvalScore(evaluateBoard(nextChess));
      setFenStatus('FEN loaded');
      setShowFenTools(false);
      if (opponentMode !== 'local_2p' && !nextChess.isGameOver() && nextChess.turn() !== playerColor) {
        triggerAIMove(nextChess);
      }
    } catch {
      setFenStatus('Invalid FEN string');
    }
  };

  const formatClock = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Compute check square and last move for Custom / Chaturanga mode
  const customLegalMoves = customState ? getAllLegalMoves(customState) : [];
  const customLastMove =
    customState && customState.history.length > 0
      ? customState.history[customState.history.length - 1]
      : null;
  const customCheckSquare =
    customState &&
    isKingInCheck(customState.grid, customState.turn, customState.config.rules, customState.duckPos)
      ? findKingPosition(customState.grid, customState.turn)
      : null;

  const activeTitle = activeCustomConfig ? activeCustomConfig.name : variantDef.name;
  const activeTagline = activeCustomConfig ? activeCustomConfig.tagline : variantDef.tagline;
  const detectedOpening = !isCustomMode ? detectOpening(analyzedMoves.map(m => m.san)) : null;

  // Material captured balance on standard chess.js board (derived dynamically from startFenForReplay)
  const materialSummary = (() => {
    if (isCustomMode) return { whiteCap: [] as string[], blackCap: [] as string[], whiteLead: 0, blackLead: 0 };
    const startCountsW: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    const startCountsB: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    const placement = (startFenForReplay || '').split(' ')[0] || '';
    for (const ch of placement) {
      if (ch === '/' || (ch >= '1' && ch <= '8')) continue;
      const lower = ch.toLowerCase();
      if (!(lower in startCountsW)) continue;
      if (ch === ch.toUpperCase()) startCountsW[lower] += 1;
      else startCountsB[lower] += 1;
    }
    const currentW: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    const currentB: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    for (const row of chess.board()) {
      for (const sq of row) {
        if (!sq || sq.type === 'k') continue;
        if (sq.color === 'w') currentW[sq.type] = (currentW[sq.type] || 0) + 1;
        else currentB[sq.type] = (currentB[sq.type] || 0) + 1;
      }
    }
    const weights: Record<string, number> = { q: 9, r: 5, b: 3, n: 3, p: 1 };
    const order = ['q', 'r', 'b', 'n', 'p'];
    const whiteCap: string[] = [];
    const blackCap: string[] = [];
    let wPts = 0;
    let bPts = 0;
    for (const t of order) {
      wPts += (currentW[t] || 0) * weights[t];
      bPts += (currentB[t] || 0) * weights[t];
      const lostB = Math.max(0, startCountsB[t] - (currentB[t] || 0));
      const lostW = Math.max(0, startCountsW[t] - (currentW[t] || 0));
      for (let i = 0; i < lostB; i++) whiteCap.push(t);
      for (let i = 0; i < lostW; i++) blackCap.push(t);
    }
    return {
      whiteCap,
      blackCap,
      whiteLead: Math.max(0, wPts - bPts),
      blackLead: Math.max(0, bPts - wPts)
    };
  })();

  const fogVisibleSquares = useMemo<ReadonlySet<string> | undefined>(() => {
    if (selectedVariant !== 'fog_of_war' || isCustomMode || gameOverResult || reviewPly !== null) {
      return undefined;
    }
    const viewerColor: PieceColor = opponentMode === 'local_2p' ? activeTurn : playerColor;
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const brd = chess.board();
    const visible = new Set<string>();
    const addSq = (r: number, c: number) => {
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        visible.add(`${files[c]}${8 - r}`);
      }
    };
    const slide = (r: number, c: number, dr: number, dc: number) => {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        addSq(nr, nc);
        if (brd[nr][nc]) break;
        nr += dr;
        nc += dc;
      }
    };

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = brd[r][c];
        if (!piece || piece.color !== viewerColor) continue;
        addSq(r, c);
        if (piece.type === 'p') {
          const dir = viewerColor === 'w' ? -1 : 1;
          const startRow = viewerColor === 'w' ? 6 : 1;
          if (r + dir >= 0 && r + dir < 8) {
            if (!brd[r + dir][c]) {
              addSq(r + dir, c);
              if (r === startRow && r + 2 * dir >= 0 && r + 2 * dir < 8 && !brd[r + 2 * dir][c]) {
                addSq(r + 2 * dir, c);
              }
            }
            if (c - 1 >= 0 && brd[r + dir][c - 1] && brd[r + dir][c - 1]!.color !== viewerColor) {
              addSq(r + dir, c - 1);
            }
            if (c + 1 < 8 && brd[r + dir][c + 1] && brd[r + dir][c + 1]!.color !== viewerColor) {
              addSq(r + dir, c + 1);
            }
          }
        } else if (piece.type === 'n') {
          for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
            addSq(r + dr, c + dc);
          }
        } else if (piece.type === 'k') {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr !== 0 || dc !== 0) addSq(r + dr, c + dc);
            }
          }
        } else if (piece.type === 'b' || piece.type === 'q') {
          slide(r, c, -1, -1);
          slide(r, c, -1, 1);
          slide(r, c, 1, -1);
          slide(r, c, 1, 1);
        }
        if (piece.type === 'r' || piece.type === 'q') {
          slide(r, c, -1, 0);
          slide(r, c, 1, 0);
          slide(r, c, 0, -1);
          slide(r, c, 0, 1);
        }
      }
    }
    return visible;
  }, [selectedVariant, isCustomMode, gameOverResult, reviewPly, opponentMode, activeTurn, playerColor, chess, analyzedMoves.length]);

  const crazyhouseDropTargets = useMemo<ReadonlySet<string> | null>(() => {
    if (
      selectedVariant !== 'crazyhouse' ||
      isCustomMode ||
      gameOverResult ||
      reviewPly !== null ||
      !selectedDropPiece
    ) {
      return null;
    }
    const turn = chess.turn();
    if (opponentMode !== 'local_2p' && turn !== playerColor) return null;
    if (!crazyhousePocket[turn].includes(selectedDropPiece)) return null;
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const brd = chess.board();
    const targets = new Set<string>();
    for (let r = 0; r < 8; r++) {
      if (selectedDropPiece === 'p' && (r === 0 || r === 7)) continue;
      for (let c = 0; c < 8; c++) {
        if (!brd[r][c]) {
          targets.add(`${files[c]}${8 - r}`);
        }
      }
    }
    return targets;
  }, [selectedVariant, isCustomMode, gameOverResult, reviewPly, selectedDropPiece, chess, opponentMode, playerColor, crazyhousePocket, analyzedMoves.length]);

  const effectiveIsFlipped =
    opponentMode === 'local_2p' && settings.autoFlipLocal2P ? activeTurn === 'b' : isFlipped;

  const bottomSideColor: PieceColor = effectiveIsFlipped ? 'b' : 'w';
  const topSideColor: PieceColor = bottomSideColor === 'w' ? 'b' : 'w';

  const oppCaptured = topSideColor === 'w' ? materialSummary.whiteCap : materialSummary.blackCap;
  const oppLead = topSideColor === 'w' ? materialSummary.whiteLead : materialSummary.blackLead;
  const plyCaptured = bottomSideColor === 'w' ? materialSummary.whiteCap : materialSummary.blackCap;
  const plyLead = bottomSideColor === 'w' ? materialSummary.whiteLead : materialSummary.blackLead;

  // Legal move suggestions for typed notation input bar
  const notationSuggestions = useMemo(() => {
    if (!settings.notationInput || gameOverResult || isPlacingDuck) return [] as string[];
    const q = notationText.trim().toLowerCase().replace(/^0-0-0$/, 'o-o-o').replace(/^0-0$/, 'o-o');
    if (customState) {
      const h = customState.grid.length;
      const legal = getAllLegalMoves(customState);
      const filtered = q
        ? legal.filter(m => {
            const coord = `${coordsToSquare(m.fromRow, m.fromCol, h)}${coordsToSquare(m.toRow, m.toCol, h)}`;
            return (
              m.san.toLowerCase().startsWith(q) ||
              m.san.replace(/[+#]/g, '').toLowerCase().startsWith(q) ||
              coord.toLowerCase().startsWith(q)
            );
          })
        : legal;
      return Array.from(new Set(filtered.map(m => m.san))).slice(0, 6);
    }

    if (opponentMode !== 'local_2p' && chess.turn() !== playerColor) return [] as string[];
    const legal = chess
      .moves({ verbose: true })
      .filter(m => !duckSquare || m.to !== duckSquare);
    const filtered = q
      ? legal.filter(
          m =>
            m.san.toLowerCase().startsWith(q) ||
            m.san.replace(/[+#]/g, '').toLowerCase().startsWith(q) ||
            `${m.from}${m.to}`.toLowerCase().startsWith(q)
        )
      : legal;
    return Array.from(new Set(filtered.map(m => m.san))).slice(0, 6);
  }, [
    settings.notationInput,
    notationText,
    gameOverResult,
    isPlacingDuck,
    customState,
    chess,
    analyzedMoves.length,
    duckSquare,
    opponentMode,
    playerColor
  ]);

  const executeNotationMove = (rawInput: string) => {
    const raw = rawInput.trim();
    if (!raw || gameOverResult) return;
    setNotationError(null);

    const normalized = raw
      .replace(/^0-0-0([+#]?)$/i, 'O-O-O$1')
      .replace(/^0-0([+#]?)$/i, 'O-O$1')
      .replace(/^o-o-o([+#]?)$/i, 'O-O-O$1')
      .replace(/^o-o([+#]?)$/i, 'O-O$1');
    const cleanNoCheck = normalized.replace(/[+#!?]+$/g, '');

    if (customState) {
      if (isPlacingDuck) {
        const sqMatch = cleanNoCheck.toLowerCase().match(/^([a-z])(\d{1,2})$/);
        if (sqMatch) {
          const h = customState.grid.length;
          const w = customState.grid[0]?.length || 8;
          const col = sqMatch[1].charCodeAt(0) - 97;
          const row = h - parseInt(sqMatch[2], 10);
          if (row >= 0 && row < h && col >= 0 && col < w && !customState.grid[row][col]) {
            handleCustomPlaceDuck({ row, col });
            setNotationText('');
            return;
          }
        }
        setNotationError(`Invalid duck square "${raw}"`);
        return;
      }

      const h = customState.grid.length;
      const legal = getAllLegalMoves(customState);
      const uciMatch = cleanNoCheck.toLowerCase().match(/^([a-z]\d{1,2})[-x]?([a-z]\d{1,2})$/);
      const matched =
        legal.find(m => m.san === normalized) ||
        legal.find(m => m.san.replace(/[+#]/g, '').toLowerCase() === cleanNoCheck.toLowerCase()) ||
        (uciMatch
          ? legal.find(
              m =>
                coordsToSquare(m.fromRow, m.fromCol, h) === uciMatch[1] &&
                coordsToSquare(m.toRow, m.toCol, h) === uciMatch[2]
            )
          : undefined);

      if (!matched) {
        setNotationError(`Illegal or unknown move "${raw}"`);
        return;
      }
      handleCustomMove(matched);
      setNotationText('');
      return;
    }

    // Standard 8x8 Duck Placement via coordinate
    if (isPlacingDuck) {
      const sqMatch = cleanNoCheck.toLowerCase().match(/^([a-h][1-8])$/);
      if (sqMatch) {
        const sq = sqMatch[1] as Square;
        if (!chess.get(sq) && sq !== duckSquare) {
          handlePlaceDuck(sq);
          setNotationText('');
          return;
        }
      }
      setNotationError(`Invalid duck square "${raw}" (e.g. d5)`);
      return;
    }

    // Standard 8x8 Premove via notation when waiting on AI
    if (opponentMode !== 'local_2p' && chess.turn() !== playerColor) {
      if ((settings.premoveMode || 'infinite') === 'off') {
        setNotationError('Enable premoves or wait for AI move');
        return;
      }
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const vMap: Record<string, { type: string; color: PieceColor }> = {};
      const brd = chess.board();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = brd[r][c];
          if (p) vMap[`${files[c]}${8 - r}`] = { type: p.type, color: p.color as PieceColor };
        }
      }
      for (const pm of premoveQueueRef.current) {
        const mv = vMap[pm.from];
        if (!mv) continue;
        delete vMap[pm.from];
        vMap[pm.to] = mv;
      }

      if (normalized === 'O-O' || normalized === 'O-O-O') {
        const backRank = playerColor === 'w' ? '1' : '8';
        const kingSq = `e${backRank}` as Square;
        const targetSq = (normalized === 'O-O' ? `g${backRank}` : `c${backRank}`) as Square;
        if (vMap[kingSq]?.type === 'k' && vMap[kingSq]?.color === playerColor) {
          handleQueuePremove({ from: kingSq, to: targetSq });
          setNotationText('');
          return;
        }
      }

      const coordMatch = cleanNoCheck.toLowerCase().match(/^([a-h][1-8])[-x]?([a-h][1-8])=?([qrbn])?$/);
      if (coordMatch) {
        const from = coordMatch[1] as Square;
        const to = coordMatch[2] as Square;
        const promo = coordMatch[3];
        if (vMap[from]?.color === playerColor && from !== to) {
          handleQueuePremove({ from, to, promotion: promo });
          setNotationText('');
          return;
        }
      }
      setNotationError(`Type coordinate premove like g1f3, e2e4, or O-O`);
      return;
    }

    // Active turn legal move matching (exact SAN -> case-insensitive SAN -> UCI coordinate)
    const verboseMoves = chess
      .moves({ verbose: true })
      .filter(m => !duckSquare || m.to !== duckSquare);
    const coordMatch = cleanNoCheck.toLowerCase().match(/^([a-h][1-8])[-x]?([a-h][1-8])=?([qrbn])?$/);
    const matchedMove =
      verboseMoves.find(m => m.san === normalized) ||
      verboseMoves.find(m => m.san.replace(/[+#]/g, '').toLowerCase() === cleanNoCheck.toLowerCase()) ||
      (coordMatch
        ? verboseMoves.find(
            m =>
              m.from === coordMatch[1] &&
              m.to === coordMatch[2] &&
              (!coordMatch[3] || m.promotion === coordMatch[3])
          )
        : undefined);

    if (!matchedMove) {
      setNotationError(`Illegal or unknown move "${raw}"`);
      return;
    }

    handleMakeMove({
      from: matchedMove.from,
      to: matchedMove.to,
      promotion: matchedMove.promotion || 'q'
    });
    setNotationText('');
  };

  const threatenedSquares = useMemo(() => {
    if (!showThreats || isCustomMode || !!gameOverResult || reviewPly !== null) return [];
    const target = opponentMode === 'local_2p' ? chess.turn() : playerColor;
    return getThreatenedSquares(chess, target);
  }, [showThreats, isCustomMode, gameOverResult, reviewPly, opponentMode, chess, playerColor, analyzedMoves.length]);

  const isVsAI = opponentMode === 'ai' || opponentMode === 'coach';
    const isLiveEvalOffInAI = opponentMode === 'ai' && settings.showLiveEval === false && !gameOverResult;
    const liveEvalAllowed = !isLiveEvalOffInAI;
    const evalHidden = settings.evalBarPosition === 'hidden' || isLiveEvalOffInAI;
    // Player plates and panels track the board size setting (board + eval bar gutter), like ChessBoard does.
    // On compact viewports, the board fits to screen so no maxWidth constraint is applied.
    const boardPlateStyle: React.CSSProperties = isCompactViewport
      ? {}
      : {
          maxWidth: `${getBoardMaxWidthPx(settings.boardSize) + (evalHidden ? 0 : 44)}px`
        };

  const liveAccWhite = useMemo(
    () => (analyzedMoves.length > 0 ? calculateAccuracyFromMoves(analyzedMoves.filter(m => !m.pending), 'w') : null),
    [analyzedMoves]
  );
  const liveAccBlack = useMemo(
    () => (analyzedMoves.length > 0 ? calculateAccuracyFromMoves(analyzedMoves.filter(m => !m.pending), 'b') : null),
    [analyzedMoves]
  );

  const boardMoveClassification = useMemo(() => {
    if (isCustomMode || !liveEvalAllowed || premoveQueue.length > 0) return null;
    const ply = reviewPly ?? analyzedMoves.length;
    if (ply <= 0) return null;
    const m = analyzedMoves[ply - 1];
    if (!m || m.pending || !m.to || m.to.length !== 2) return null;
    return { square: m.to as Square, type: m.classification };
  }, [isCustomMode, liveEvalAllowed, premoveQueue.length, reviewPly, analyzedMoves]);

  // Play Arena gameplay & ledger shortcuts (F, H, U, P, N, T, move stepping)
  const playShortcutRef = useRef<(e: KeyboardEvent) => void>(() => {});
  playShortcutRef.current = (e: KeyboardEvent) => {
    if (opponentModeRef.current === 'online') return;
    const action = resolvePlayViewShortcut(e, {
      keyboardControl: Boolean(settings.keyboardControl),
      hasMoves: !isCustomMode && analyzedMoves.length > 0,
      modalOpen: showCharacterModal || hasOpenModalDialog()
    });
    if (!action) return;

    if (action.type === 'flip') {
      e.preventDefault();
      setIsFlipped(f => !f);
    } else if (action.type === 'hint') {
      if (hintsEnabled && !gameOverResult) {
        e.preventDefault();
        handleGetHint();
      }
    } else if (action.type === 'undo') {
      if (undosEnabled && !gameOverResult && analyzedMoves.length > 0 && !isEvaluating) {
        e.preventDefault();
        handleTakeback();
      }
    } else if (action.type === 'toggle_pause') {
      if (clockRunning && !gameOverResult) {
        e.preventDefault();
        setClockPaused(p => !p);
      }
    } else if (action.type === 'new_game') {
      e.preventDefault();
      const resolved: PieceColor =
        isVsAI && sidePreference === 'random'
          ? Math.random() < 0.5
            ? 'w'
            : 'b'
          : playerColor;
      if (isVsAI && sidePreference === 'random') {
        setPlayerColor(resolved);
        setIsFlipped(resolved === 'b');
      }
      startNewGame(selectedVariant, activeCustomConfig, resolved);
    } else if (action.type === 'focus_notation') {
      e.preventDefault();
      if (!settings.notationInput && onUpdateSettings) {
        onUpdateSettings({ ...settings, notationInput: true });
      }
      window.requestAnimationFrame(() => {
        notationInputRef.current?.focus();
      });
    } else if (action.type === 'toggle_zen') {
      e.preventDefault();
      setZenMode(z => !z);
    } else if (action.type === 'history_first') {
      e.preventDefault();
      setReviewPly(0);
    } else if (action.type === 'history_prev') {
      e.preventDefault();
      setReviewPly(Math.max(0, (reviewPly ?? analyzedMoves.length) - 1));
    } else if (action.type === 'history_next') {
      e.preventDefault();
      const next = Math.min(analyzedMoves.length, (reviewPly ?? analyzedMoves.length) + 1);
      setReviewPly(next >= analyzedMoves.length ? null : next);
    } else if (action.type === 'history_live') {
      e.preventDefault();
      setReviewPly(null);
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => playShortcutRef.current(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto px-3 sm:px-6 py-4" style={{ color: theme.textPrimary }}>
      {zenMode ? (
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-mono font-semibold" style={{ color: theme.textMutedHex }}>
            Zen Focus · {activeTitle} · {opponentMode === 'local_2p' ? 'Pass & Play' : `${effectiveBot.name} (${effectiveBot.elo})`}
          </span>
          <button
            type="button"
            onClick={() => setZenMode(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold transition hover:opacity-85 cursor-pointer whitespace-nowrap"
            style={{
              backgroundColor: theme.cardHex,
              borderColor: theme.accentHex,
              color: theme.accentHex
            }}
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Zen Mode (Z)</span>
          </button>
        </div>
      ) : (
      /* Precision Match Setup Bar */
      <div
        className="flex flex-col gap-3 rounded-xl px-4 py-3 border"
        style={{
          backgroundColor: theme.cardHex,
          borderColor: theme.cardBorderHex
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Character / Mode Summary */}
          <div className="flex items-center gap-3 min-w-0 sm:flex-1">
            {opponentMode === 'online' ? (
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${theme.accentHex}1f`,
                  border: `1px solid ${theme.accentHex}55`,
                  color: theme.accentHex
                }}
              >
                <Globe className="w-5 h-5" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => isVsAI && setShowCharacterModal(true)}
                disabled={!isVsAI}
                title={isVsAI ? 'Browse AI Characters' : 'Pass & Play (Local Shared Board)'}
                className={`relative rounded-xl shrink-0 transition ${
                  isVsAI ? 'hover:scale-105 cursor-pointer ring-1 ring-white/10 hover:ring-2' : 'cursor-default'
                }`}
                style={{
                  boxShadow: isVsAI ? `0 2px 10px ${effectiveBot.accentHex || theme.accentHex}30` : undefined
                }}
              >
                <BotCharacterAvatar
                  botId={effectiveBot.id}
                  elo={effectiveBot.elo}
                  isLocal2P={opponentMode === 'local_2p'}
                  size={44}
                />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {opponentMode === 'online' ? (
                  <span className="font-display font-bold text-sm sm:text-base tracking-tight" style={{ color: theme.textPrimary }}>
                    Online Arena · Classic Only
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => isVsAI && setShowCharacterModal(true)}
                    disabled={!isVsAI}
                    className={`font-display font-bold text-sm sm:text-base tracking-tight text-left whitespace-nowrap ${
                      isVsAI ? 'hover:underline cursor-pointer' : 'cursor-default'
                    }`}
                    style={{ color: theme.textPrimary }}
                  >
                    {opponentMode === 'local_2p' ? 'Pass & Play (2 Players)' : effectiveBot.name}
                  </button>
                )}
                {opponentMode === 'coach' && (
                  <span className="text-xs font-mono font-bold whitespace-nowrap" style={{ color: theme.accentHex }}>
                    · Coach Mode
                  </span>
                )}
              </div>
              <p className="text-xs flex flex-wrap items-center gap-x-1.5 gap-y-0.5" style={{ color: theme.textSecondary }}>
                {opponentMode === 'online' ? (
                  <>
                    <span className="font-mono font-bold" style={{ color: theme.accentHex }}>
                      Standard Rules
                    </span>
                    <span style={{ color: theme.textMutedHex }}>
                      · Bullet, Blitz, Rapid, Classical, Unlimited &amp; Custom Clocks
                    </span>
                  </>
                ) : isVsAI ? (
                  <>
                    <span className="font-mono font-bold tabular-nums whitespace-nowrap" style={{ color: effectiveBot.accentHex || theme.accentHex }}>
                      {effectiveBot.elo} Elo
                    </span>
                    {(effectiveBot.styleLabel || effectiveBot.title) && (
                      <span className="whitespace-nowrap">
                        · {effectiveBot.styleLabel || effectiveBot.title}
                      </span>
                    )}
                    <span className="whitespace-nowrap" style={{ color: theme.textMutedHex }}>
                      · {activeTitle}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-mono font-bold whitespace-nowrap" style={{ color: theme.accentHex }}>
                      Local Shared Board
                    </span>
                    <span className="whitespace-nowrap" style={{ color: theme.textMutedHex }}>
                      · {activeTitle}
                    </span>
                  </>
                )}
                {opponentMode !== 'online' && detectedOpening && (
                  <span className="hidden sm:inline-flex items-center gap-1 whitespace-nowrap" style={{ color: theme.textSecondary }}>
                    <span>·</span>
                    <BookOpen className="w-3 h-3 shrink-0" style={{ color: theme.accentHex }} />
                    <span className="font-mono font-bold" style={{ color: theme.accentHex }}>{detectedOpening.eco}</span>
                    <span>{detectedOpening.name}</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Primary Right Actions: Play Mode + Timer + Side Circle + Assists + Bots Picker + New Game */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            {/* Quick Online Classic Switch Pill */}
            <button
              type="button"
              onClick={() => {
                if (opponentMode === 'online') {
                  setOpponentMode('ai');
                  opponentModeRef.current = 'ai';
                  startNewGame(selectedVariant, activeCustomConfig, playerColor, openingId, 'ai');
                } else {
                  setSelectedVariant('standard');
                  selectedVariantRef.current = 'standard';
                  setActiveCustomConfig(null);
                  customStateRef.current = null;
                  setCustomState(null);
                  setOpponentMode('online');
                  opponentModeRef.current = 'online';
                  setZenMode(false);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition hover:opacity-90 cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: opponentMode === 'online' ? theme.accentHex : theme.cardSecondaryHex,
                borderColor: opponentMode === 'online' ? theme.accentHex : theme.cardBorderHex,
                color: opponentMode === 'online' ? theme.accentTextHex : theme.textPrimary
              }}
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>{opponentMode === 'online' ? 'Online Classic Active' : 'Online Classic'}</span>
            </button>

            {/* Play Mode Dropdown (icon-only trigger, full labels inside menu) */}
            <div className="relative" ref={playModeMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowPlayModeMenu(o => !o);
                  setShowTimeMenu(false);
                  setShowAssistsMenu(false);
                }}
                aria-expanded={showPlayModeMenu}
                aria-label={`Select play mode (current: ${
                  opponentMode === 'online'
                    ? 'Online (Classic Only)'
                    : opponentMode === 'coach'
                    ? 'Coach Game'
                    : opponentMode === 'ai'
                    ? 'vs AI Character'
                    : 'Pass & Play (2P)'
                })`}
                title={
                  opponentMode === 'online'
                    ? 'Mode: Online Multiplayer (Classic Variant Only)'
                    : opponentMode === 'coach'
                    ? 'Mode: Coach Game (Teach While You Play)'
                    : opponentMode === 'ai'
                    ? 'Mode: vs AI Character'
                    : 'Mode: Pass & Play (2P)'
                }
                className="flex items-center justify-center w-8 h-8 rounded-lg border transition hover:opacity-85 shrink-0 cursor-pointer"
                style={{
                  backgroundColor: showPlayModeMenu || opponentMode === 'coach' || opponentMode === 'online' ? `${theme.accentHex}18` : theme.cardSecondaryHex,
                  borderColor: showPlayModeMenu || opponentMode === 'coach' || opponentMode === 'online' ? theme.accentHex : theme.cardBorderHex,
                  color: theme.accentHex
                }}
              >
                {opponentMode === 'online' ? (
                  <Globe className="w-4 h-4" />
                ) : opponentMode === 'coach' ? (
                  <GraduationCap className="w-4 h-4" />
                ) : opponentMode === 'ai' ? (
                  <Cpu className="w-4 h-4" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
              </button>

              {showPlayModeMenu && (
                <div
                  className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 rounded-xl border shadow-2xl p-1.5 z-40 flex flex-col gap-1 text-xs"
                  style={{
                    backgroundColor: theme.cardHex,
                    borderColor: theme.cardBorderHex,
                    color: theme.textPrimary
                  }}
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
                    Play Mode
                  </div>
                  {([
                    { id: 'online' as OpponentMode, label: 'Online (Classic Only)', Icon: Globe },
                    { id: 'ai' as OpponentMode, label: 'AI Characters', Icon: Cpu },
                    { id: 'coach' as OpponentMode, label: 'Coach Practice', Icon: GraduationCap },
                    { id: 'local_2p' as OpponentMode, label: 'Pass & Play', Icon: Users }
                  ]).map(item => {
                    const active = opponentMode === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setShowPlayModeMenu(false);
                          if (item.id === opponentMode) return;
                          if (item.id === 'online') {
                            setSelectedVariant('standard');
                            selectedVariantRef.current = 'standard';
                            setActiveCustomConfig(null);
                            customStateRef.current = null;
                            setCustomState(null);
                            setOpponentMode('online');
                            opponentModeRef.current = 'online';
                            setZenMode(false);
                            return;
                          }
                          setOpponentMode(item.id);
                          if (item.id === 'local_2p') {
                            setShowCustomElo(false);
                            setIsFlipped(false);
                            startNewGame(selectedVariant, activeCustomConfig, 'w', openingId, 'local_2p');
                          } else {
                            if (item.id === 'coach') {
                              applyAssistPreset('coach');
                            }
                            const resolved: PieceColor =
                              sidePreference === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : sidePreference;
                            setPlayerColor(resolved);
                            setIsFlipped(resolved === 'b');
                            startNewGame(selectedVariant, activeCustomConfig, resolved, openingId, item.id);
                          }
                        }}
                        className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left font-semibold transition hover:opacity-90 cursor-pointer"
                        style={{
                          backgroundColor: active ? `${theme.accentHex}20` : 'transparent',
                          color: active ? theme.accentHex : theme.textPrimary
                        }}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <item.Icon className="w-3.5 h-3.5 shrink-0" style={{ color: active ? theme.accentHex : theme.textSecondary }} />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {opponentMode !== 'online' && (
              <>
            {/* Timer Chooser Dropdown (icon-only trigger, full labels inside menu) */}
            <div className="relative" ref={timeMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowTimeMenu(o => !o);
                  setShowPlayModeMenu(false);
                  setShowAssistsMenu(false);
                }}
                aria-expanded={showTimeMenu}
                aria-label={`Select time control (current: ${timeControlName})`}
                title={`Time Control: ${timeControlName}`}
                className="flex items-center justify-center w-8 h-8 rounded-lg border transition hover:opacity-85 shrink-0 cursor-pointer"
                style={{
                  backgroundColor: showTimeMenu ? `${theme.accentHex}18` : theme.cardSecondaryHex,
                  borderColor: showTimeMenu ? theme.accentHex : theme.cardBorderHex,
                  color: theme.accentHex
                }}
              >
                <Clock className="w-4 h-4" />
              </button>

              {showTimeMenu && (
                <div
                  className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-48 rounded-xl border shadow-2xl p-1.5 z-40 flex flex-col gap-0.5 text-xs"
                  style={{
                    backgroundColor: theme.cardHex,
                    borderColor: theme.cardBorderHex,
                    color: theme.textPrimary
                  }}
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
                    Time Control
                  </div>
                  {TIME_PRESETS.map(p => {
                    const active = selectedPresetId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          applyTimePreset(p.id);
                          setShowTimeMenu(false);
                        }}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left font-mono font-semibold transition hover:opacity-90 cursor-pointer"
                        style={{
                          backgroundColor: active ? `${theme.accentHex}20` : 'transparent',
                          color: active ? theme.accentHex : theme.textPrimary
                        }}
                      >
                        <span>{p.label}</span>
                        {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      applyTimePreset('custom');
                      setShowTimeMenu(false);
                    }}
                    className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left font-semibold transition hover:opacity-90 cursor-pointer mt-0.5 border-t pt-2"
                    style={{
                      borderColor: theme.cardBorderHex,
                      backgroundColor: selectedPresetId === 'custom' ? `${theme.accentHex}20` : 'transparent',
                      color: selectedPresetId === 'custom' ? theme.accentHex : theme.textPrimary
                    }}
                  >
                    <span>Custom Time...</span>
                    {selectedPresetId === 'custom' && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                </div>
              )}
            </div>

            {isVsAI && (
              <button
                type="button"
                onClick={() => {
                  const nextPref: 'w' | 'b' | 'random' =
                    sidePreference === 'w' ? 'b' : sidePreference === 'b' ? 'random' : 'w';
                  setSidePreference(nextPref);
                  const resolved: PieceColor =
                    nextPref === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : nextPref;
                  setPlayerColor(resolved);
                  setIsFlipped(resolved === 'b');
                  startNewGame(selectedVariant, activeCustomConfig, resolved, openingId, opponentMode);
                }}
                aria-label={
                  sidePreference === 'random'
                    ? 'Playing side: Random (click to switch to White)'
                    : playerColor === 'w'
                    ? 'Playing side: White (click to switch to Black)'
                    : 'Playing side: Black (click to switch to Random)'
                }
                title={
                  sidePreference === 'random'
                    ? 'Side: Random (click for White)'
                    : playerColor === 'w'
                    ? 'Side: White (click for Black)'
                    : 'Side: Black (click for Random)'
                }
                className="flex items-center justify-center w-8 h-8 rounded-lg border transition hover:opacity-85 shrink-0 cursor-pointer"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex
                }}
              >
                <span
                  className="w-4 h-4 rounded-full border shrink-0"
                  style={{
                    background:
                      sidePreference === 'random'
                        ? 'linear-gradient(90deg, #f8fafc 50%, #0f172a 50%)'
                        : playerColor === 'w'
                        ? '#f8fafc'
                        : '#0f172a',
                    borderColor: theme.textMutedHex
                  }}
                />
              </button>
            )}

            {/* Assists & Display Dropdown Menu (icon-only trigger between Side chooser & Bots) */}
            <div className="relative" ref={assistsMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowAssistsMenu(o => !o);
                  setShowPlayModeMenu(false);
                  setShowTimeMenu(false);
                }}
                aria-expanded={showAssistsMenu}
                aria-label="Match assists and display options"
                title={`Assists (${assistPreset === 'coach' ? 'Coach Aids' : assistPreset === 'challenge' ? 'Challenge' : 'Standard'})`}
                className="flex items-center justify-center w-8 h-8 rounded-lg border transition hover:opacity-85 shrink-0 cursor-pointer"
                style={{
                  backgroundColor: showAssistsMenu ? `${theme.accentHex}20` : theme.cardSecondaryHex,
                  borderColor: showAssistsMenu ? theme.accentHex : theme.cardBorderHex,
                  color: theme.accentHex
                }}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {showAssistsMenu && (
                <div
                  className="fixed left-3 right-3 mt-2 w-auto md:absolute md:left-auto md:right-0 md:w-72 rounded-xl border shadow-2xl p-3 z-40 flex flex-col gap-3 text-xs"
                  style={{
                    backgroundColor: theme.cardHex,
                    borderColor: theme.cardBorderHex,
                    color: theme.textPrimary
                  }}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
                      Assist Mode Preset
                    </span>
                    <div className="grid grid-cols-3 gap-1 mt-1.5">
                      {([
                        { id: 'coach', label: 'Coach' },
                        { id: 'standard', label: 'Standard' },
                        { id: 'challenge', label: 'Challenge' }
                      ] as const).map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => applyAssistPreset(p.id)}
                          className="py-1.5 px-2 rounded-lg border font-bold text-[11px] transition whitespace-nowrap"
                          style={{
                            backgroundColor: assistPreset === p.id ? theme.accentHex : theme.cardSecondaryHex,
                            borderColor: assistPreset === p.id ? theme.accentHex : theme.cardBorderHex,
                            color: assistPreset === p.id ? theme.accentTextHex : theme.textSecondary
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedVariant === 'standard' && !activeCustomConfig && (
                    <div className="pt-2 border-t" style={{ borderColor: theme.cardBorderHex }}>
                      <label className="flex items-center justify-between gap-2">
                        <span className="font-semibold flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                          Opening
                        </span>
                        <select
                          value={openingId}
                          aria-label="Play from Opening"
                          onChange={e => handleSelectOpeningStarter(e.target.value)}
                          className="px-2 py-1 rounded border text-[11px] font-semibold focus:outline-none cursor-pointer max-w-[160px]"
                          style={{
                            backgroundColor: theme.cardSecondaryHex,
                            borderColor: theme.cardBorderHex,
                            color: theme.textPrimary
                          }}
                        >
                          {OPENING_STARTERS.map(op => (
                            <option key={op.id} value={op.id} style={{ backgroundColor: theme.cardHex }}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}

                  {onUpdateSettings && (
                    <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: theme.cardBorderHex }}>
                      <label className="flex items-center justify-between gap-2">
                        <span className="font-semibold flex items-center gap-1.5">
                          {evalHidden ? <EyeOff className="w-3.5 h-3.5 opacity-70" /> : <Eye className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />}
                          Eval Bar
                        </span>
                        <select
                          value={settings.evalBarPosition}
                          aria-label="Evaluation bar visibility"
                          onChange={e => {
                            const pos = e.target.value as UserSettings['evalBarPosition'];
                            onUpdateSettings({
                              ...settings,
                              evalBarPosition: pos,
                              showLiveEval: pos !== 'hidden' ? true : settings.showLiveEval
                            });
                            setAssistPreset('custom');
                          }}
                          className="px-2 py-1 rounded border text-[11px] font-semibold focus:outline-none cursor-pointer"
                          style={{
                            backgroundColor: theme.cardSecondaryHex,
                            borderColor: theme.cardBorderHex,
                            color: theme.textPrimary
                          }}
                        >
                          <option value="left" style={{ backgroundColor: theme.cardHex }}>{isCompactViewport ? 'Show Above' : 'Show Left'}</option>
                          <option value="right" style={{ backgroundColor: theme.cardHex }}>{isCompactViewport ? 'Show Below' : 'Show Right'}</option>
                          <option value="hidden" style={{ backgroundColor: theme.cardHex }}>Hidden</option>
                        </select>
                      </label>

                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="font-medium">Live Eval &amp; Badges (vs AI)</span>
                        <input
                          type="checkbox"
                          checked={settings.showLiveEval !== false}
                          onChange={e => {
                            onUpdateSettings({
                              ...settings,
                              showLiveEval: e.target.checked,
                              evalBarPosition: e.target.checked && settings.evalBarPosition === 'hidden' ? 'left' : settings.evalBarPosition
                            });
                            if (!e.target.checked) setLiveCoachTip(null);
                            setAssistPreset('custom');
                          }}
                          className="accent-current w-4 h-4 cursor-pointer"
                          style={{ color: theme.accentHex }}
                        />
                      </label>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: theme.cardBorderHex }}>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                        Allow Hints
                      </span>
                      <input
                        type="checkbox"
                        checked={hintsEnabled}
                        onChange={e => {
                          setHintsEnabled(e.target.checked);
                          if (!e.target.checked) {
                            setHintArrow(null);
                            setHintText(null);
                          }
                          setAssistPreset('custom');
                        }}
                        className="accent-current w-4 h-4 cursor-pointer"
                        style={{ color: theme.accentHex }}
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Undo2 className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
                        Allow Undos (Takeback)
                      </span>
                      <input
                        type="checkbox"
                        checked={undosEnabled}
                        onChange={e => {
                          setUndosEnabled(e.target.checked);
                          setAssistPreset('custom');
                        }}
                        className="accent-current w-4 h-4 cursor-pointer"
                        style={{ color: theme.accentHex }}
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        Live Coach Tips
                      </span>
                      <input
                        type="checkbox"
                        checked={liveTipsEnabled}
                        onChange={e => {
                          setLiveTipsEnabled(e.target.checked);
                          if (!e.target.checked) setLiveCoachTip(null);
                          setAssistPreset('custom');
                        }}
                        className="accent-current w-4 h-4 cursor-pointer"
                        style={{ color: theme.accentHex }}
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-1.5 font-medium">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        Threat Alerts (!)
                      </span>
                      <input
                        type="checkbox"
                        checked={showThreats}
                        onChange={e => {
                          setShowThreats(e.target.checked);
                          setAssistPreset('custom');
                        }}
                        className="accent-current w-4 h-4 cursor-pointer"
                        style={{ color: theme.accentHex }}
                      />
                    </label>

                    {onUpdateSettings && (
                      <>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="font-medium">Show Legal Move Dots</span>
                          <input
                            type="checkbox"
                            checked={settings.highlightLegalMoves}
                            onChange={e =>
                              onUpdateSettings({ ...settings, highlightLegalMoves: e.target.checked })
                            }
                            className="accent-current w-4 h-4 cursor-pointer"
                            style={{ color: theme.accentHex }}
                          />
                        </label>

                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="font-medium">Auto-Promote Queen</span>
                          <input
                            type="checkbox"
                            checked={settings.autoQueen}
                            onChange={e =>
                              onUpdateSettings({ ...settings, autoQueen: e.target.checked })
                            }
                            className="accent-current w-4 h-4 cursor-pointer"
                            style={{ color: theme.accentHex }}
                          />
                        </label>

                        {opponentMode === 'local_2p' && (
                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="flex items-center gap-1.5 font-medium">
                              <FlipVertical2 className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                              Auto-Flip 2P Board
                            </span>
                            <input
                              type="checkbox"
                              checked={!!settings.autoFlipLocal2P}
                              onChange={e =>
                                onUpdateSettings({ ...settings, autoFlipLocal2P: e.target.checked })
                              }
                              className="accent-current w-4 h-4 cursor-pointer"
                              style={{ color: theme.accentHex }}
                            />
                          </label>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isVsAI && (
              <button
                type="button"
                onClick={() => setShowCharacterModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition hover:opacity-85 whitespace-nowrap cursor-pointer"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
                title="Browse Chess.com-style AI Bots & Playing Styles"
              >
                <Bot className="w-3.5 h-3.5" style={{ color: effectiveBot.accentHex || theme.accentHex }} />
                <span>Bots</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setZenMode(true)}
              aria-label="Enter Zen Mode"
              title="Zen / Focus Mode (Z)"
              className="flex items-center justify-center w-8 h-8 rounded-lg border transition hover:opacity-85 shrink-0 cursor-pointer"
              style={{
                backgroundColor: theme.cardSecondaryHex,
                borderColor: theme.cardBorderHex,
                color: theme.textSecondary
              }}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                const resolved: PieceColor =
                  isVsAI && sidePreference === 'random'
                    ? Math.random() < 0.5
                      ? 'w'
                      : 'b'
                    : playerColor;
                if (isVsAI && sidePreference === 'random') {
                  setPlayerColor(resolved);
                  setIsFlipped(resolved === 'b');
                }
                startNewGame(selectedVariant, activeCustomConfig, resolved);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition hover:opacity-90 active:scale-[0.98] whitespace-nowrap cursor-pointer"
              style={{
                backgroundColor: theme.accentHex,
                color: theme.accentTextHex
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Game</span>
            </button>
              </>
            )}
          </div>
        </div>
      </div>
      )}

      {opponentMode === 'online' ? (
        <OnlinePlayPanel
          firebaseUser={firebaseUser}
          publicProfile={publicProfile}
          settings={settings}
          pendingChallengeCode={pendingChallengeCode}
          onConsumeChallengeCode={onConsumeChallengeCode}
          onOpenAuthModal={onOpenAuthModal || (() => {})}
          onSaveOnlineGame={onSaveGame}
          onRunGameReview={onRunGameReview}
          onOnlineEloUpdated={onOnlineEloUpdated}
        />
      ) : (
        <>
      {/* Custom AI Elo Calibration Bar (100 to 3600 Max Strength) */}
      {isVsAI && showCustomElo && (
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl px-4 py-3 border text-xs"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: theme.accentHex
          }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-bold" style={{ color: theme.textPrimary }}>
              Custom AI Strength (100 – {MAX_AI_ELO} Max Local Engine)
            </span>
            <span className="text-[11px]" style={{ color: theme.textSecondary }}>
              {selectedBot.description}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="range"
              aria-label="Custom AI Elo slider"
              min={MIN_AI_ELO}
              max={MAX_AI_ELO}
              step={25}
              value={customEloInput}
              onChange={e => {
                const val = Number(e.target.value);
                setCustomEloInput(val);
                setSelectedBot(createCustomBotProfile(val));
              }}
              className="w-36 sm:w-44 accent-current cursor-pointer"
              style={{ color: theme.accentHex }}
            />
            <input
              type="number"
              aria-label="Custom AI Elo value"
              min={MIN_AI_ELO}
              max={MAX_AI_ELO}
              value={customEloInput}
              onChange={e => {
                const raw = Number(e.target.value);
                setCustomEloInput(raw);
                if (!Number.isNaN(raw)) {
                  setSelectedBot(createCustomBotProfile(raw));
                }
              }}
              onBlur={() => {
                const clamped = Math.max(MIN_AI_ELO, Math.min(MAX_AI_ELO, customEloInput || MIN_AI_ELO));
                setCustomEloInput(clamped);
                setSelectedBot(createCustomBotProfile(clamped));
              }}
              className="w-20 px-2 py-1 rounded border font-mono font-bold text-center tabular-nums focus:outline-none"
              style={{
                backgroundColor: theme.cardSecondaryHex,
                borderColor: theme.cardBorderHex,
                color: theme.textPrimary
              }}
            />
            <div className="flex items-center gap-1">
              {[100, 800, 1500, 2400, 3600].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setCustomEloInput(preset);
                    setSelectedBot(createCustomBotProfile(preset));
                  }}
                  className="px-2 py-1 rounded border font-mono text-[11px] font-bold transition hover:opacity-80"
                  style={{
                    backgroundColor: customEloInput === preset ? theme.accentHex : theme.cardSecondaryHex,
                    borderColor: customEloInput === preset ? theme.accentHex : theme.cardBorderHex,
                    color: customEloInput === preset ? theme.accentTextHex : theme.textSecondary
                  }}
                >
                  {preset === MAX_AI_ELO ? 'MAX' : preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Time Inline Controls */}
      {showCustomTime && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-2.5 border text-xs"
          style={{
            backgroundColor: theme.cardHex,
            borderColor: theme.accentHex
          }}
        >
          <span className="font-semibold" style={{ color: theme.textPrimary }}>
            Custom Time Control:
          </span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5">
              <span style={{ color: theme.textSecondary }}>Minutes</span>
              <input
                type="number"
                min={1}
                max={180}
                value={customMinutesInput}
                onChange={e => setCustomMinutesInput(Number(e.target.value))}
                className="w-16 px-2 py-1 rounded border font-mono text-center focus:outline-none"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              />
            </label>
            <label className="flex items-center gap-1.5">
              <span style={{ color: theme.textSecondary }}>Increment (s)</span>
              <input
                type="number"
                min={0}
                max={60}
                value={customIncInput}
                onChange={e => setCustomIncInput(Number(e.target.value))}
                className="w-16 px-2 py-1 rounded border font-mono text-center focus:outline-none"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              />
            </label>
            <button
              type="button"
              onClick={applyCustomTime}
              className="px-3 py-1 rounded-lg font-bold"
              style={{
                backgroundColor: theme.accentHex,
                color: theme.accentTextHex
              }}
            >
              Apply {customMinutesInput}+{customIncInput}
            </button>
          </div>
        </div>
      )}

      {/* Main Board Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Board Column */}
        <div className="lg:col-span-8 flex flex-col items-center gap-2.5">
          {/* Top Plate */}
          <div
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border"
            style={{
              ...boardPlateStyle,
              backgroundColor: theme.cardHex,
              borderColor: activeTurn === topSideColor ? theme.accentHex : theme.cardBorderHex
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-bold text-xs sm:text-sm truncate" style={{ color: theme.textPrimary }}>
                {opponentMode === 'local_2p'
                  ? topSideColor === 'w'
                    ? 'Player 1'
                    : 'Player 2'
                  : topSideColor === playerColor
                  ? 'You'
                  : selectedBot.name}
              </span>
              <span className="text-[11px] font-mono" style={{ color: theme.textMutedHex }}>
                · {topSideColor === 'w' ? 'White' : 'Black'}
                {isVsAI && isEvaluating && topSideColor !== playerColor && (
                  <span style={{ color: theme.accentHex }}> · Thinking…</span>
                )}
              </span>
              {oppCaptured.length > 0 && (
                <div className="hidden sm:flex items-center gap-0.5 ml-1">
                  {oppCaptured.slice(0, 8).map((pt, idx) => (
                    <div key={idx} className="w-4 h-4">
                      <ChessPieceIcon
                        type={pt as 'p' | 'n' | 'b' | 'r' | 'q'}
                        color={topSideColor === 'w' ? 'b' : 'w'}
                        set={settings.pieceSet}
                      />
                    </div>
                  ))}
                  {oppLead > 0 && (
                    <span className="text-[11px] font-mono font-bold ml-1 tabular-nums" style={{ color: theme.accentHex }}>
                      +{oppLead}
                    </span>
                  )}
                </div>
              )}
              {(selectedVariant === 'three_check' || customState?.config.rules.winConditions.threeCheck) && (
                <span className="text-[11px] font-mono font-bold" style={{ color: theme.accentHex }}>
                  · Checks {topSideColor === 'w' ? (customState ? customState.whiteChecks : checksWhite) : (customState ? customState.blackChecks : checksBlack)}/3
                </span>
              )}
            </div>
            <div
              className="px-3.5 py-1.5 rounded-lg font-mono font-bold text-sm sm:text-base tabular-nums shrink-0"
              style={{
                backgroundColor: activeTurn === topSideColor ? `${theme.accentHex}20` : theme.cardSecondaryHex,
                color: activeTurn === topSideColor ? theme.accentHex : theme.textSecondary,
                border: `1px solid ${activeTurn === topSideColor ? theme.accentHex : theme.cardBorderHex}`
              }}
            >
              {formatClock(topSideColor === 'w' ? whiteTime : blackTime)}
            </div>
          </div>

          {/* EvalBar + ChessBoard */}
                    <div className="flex flex-col items-center gap-2.5 w-full">
                      {/* Horizontal eval bar on compact viewports - placed above board when position is 'left' */}
                      {isCompactViewport && !evalHidden && settings.evalBarPosition === 'left' && (
                        <EvalBar
                          scoreCp={evalScore}
                          isFlipped={effectiveIsFlipped}
                          isEvaluating={isEvaluating}
                          engineDepth={selectedBot.depth + 12}
                          position={settings.evalBarPosition}
                          horizontal
                        />
                      )}
          
                      <div className="flex items-center justify-center gap-3 w-full">
                        {!isCompactViewport && !evalHidden && settings.evalBarPosition === 'left' && (
                          <EvalBar
                            scoreCp={evalScore}
                            isFlipped={effectiveIsFlipped}
                            isEvaluating={isEvaluating}
                            engineDepth={selectedBot.depth + 12}
                            position={settings.evalBarPosition}
                          />
                        )}
          
                        {customState ? (
                          <ChessBoard
                            customGrid={customState.grid}
                            customTurn={customState.turn}
                            customLegalMoves={customLegalMoves}
                            customLastMove={customLastMove}
                            customCheckSquare={customCheckSquare}
                            customDuckPos={customState.duckPos}
                            customShieldedPos={customState.shieldedPos ?? null}
                            isPlacingDuck={isPlacingDuck}
                            isFlipped={effectiveIsFlipped}
                            theme={settings.boardTheme}
                            pieceSet={settings.pieceSet}
                            showCoordinates={settings.showCoordinates}
                            onCustomMove={handleCustomMove}
                            onCustomPlaceDuck={handleCustomPlaceDuck}
                            disabled={isEvaluating || !!gameOverResult || !!customState.winner}
                          />
                        ) : (
                          (() => {
                            let boardToRender = chess;
                            if (reviewPly !== null) {
                              const reviewChess = new Chess(startFenForReplay);
                              for (let i = 0; i < Math.min(reviewPly, analyzedMoves.length); i++) {
                                try {
                                  reviewChess.move(analyzedMoves[i].san);
                                } catch {
                                  break;
                                }
                              }
                              boardToRender = reviewChess;
                            }
                            const isInspectingHistory = reviewPly !== null;
                            return (
                              <ChessBoard
                                chess={boardToRender}
                                isFlipped={effectiveIsFlipped}
                                theme={settings.boardTheme}
                                pieceSet={settings.pieceSet}
                                showCoordinates={settings.showCoordinates}
                                bestMoveArrow={isInspectingHistory ? null : hintArrow}
                                moveClassification={boardMoveClassification}
                                threatenedSquares={isInspectingHistory || !liveEvalAllowed ? [] : threatenedSquares}
                                duckSquare={duckSquare}
                                isPlacingDuck={isPlacingDuck}
                                blindfold={selectedVariant === 'blindfold'}
                                fogVisibleSquares={fogVisibleSquares}
                                pendingDropTargets={crazyhouseDropTargets}
                                onDropPiece={handleCrazyhouseDrop}
                                playerColor={opponentMode === 'local_2p' ? undefined : playerColor}
                                premoveMode={
                                  opponentMode === 'local_2p' || isInspectingHistory || gameOverResult
                                    ? 'off'
                                    : settings.premoveMode || 'infinite'
                                }
                                premoves={opponentMode === 'local_2p' || isInspectingHistory ? [] : premoveQueue}
                                onQueuePremove={handleQueuePremove}
                                onCancelPremoves={handleCancelPremoves}
                                onMakeMove={handleMakeMove}
                                onPlaceDuck={handlePlaceDuck}
                                disabled={isInspectingHistory || isEvaluating || !!gameOverResult}
                              />
                            );
                          })()
                        )}
          
                        {!isCompactViewport && !evalHidden && settings.evalBarPosition === 'right' && (
                          <EvalBar
                            scoreCp={evalScore}
                            isFlipped={effectiveIsFlipped}
                            isEvaluating={isEvaluating}
                            engineDepth={selectedBot.depth + 12}
                            position={settings.evalBarPosition}
                          />
                        )}
                      </div>
          
                      {/* Horizontal eval bar on compact viewports - placed below board when position is 'right' */}
                      {isCompactViewport && !evalHidden && settings.evalBarPosition === 'right' && (
                        <EvalBar
                          scoreCp={evalScore}
                          isFlipped={effectiveIsFlipped}
                          isEvaluating={isEvaluating}
                          engineDepth={selectedBot.depth + 12}
                          position={settings.evalBarPosition}
                          horizontal
                        />
                      )}
                    </div>

          {/* Bottom Plate */}
          <div
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border"
            style={{
              ...boardPlateStyle,
              backgroundColor: theme.cardHex,
              borderColor: activeTurn === bottomSideColor ? theme.accentHex : theme.cardBorderHex
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-bold text-xs sm:text-sm truncate" style={{ color: theme.textPrimary }}>
                {opponentMode === 'local_2p'
                  ? bottomSideColor === 'w'
                    ? 'Player 1'
                    : 'Player 2'
                  : bottomSideColor === playerColor
                  ? 'You'
                  : selectedBot.name}
              </span>
              <span className="text-[11px] font-mono" style={{ color: theme.textMutedHex }}>
                · {bottomSideColor === 'w' ? 'White' : 'Black'} · {timeControlName}
                {clockPaused ? ' · Paused' : ''}
                {isVsAI && isEvaluating && bottomSideColor !== playerColor && (
                  <span style={{ color: theme.accentHex }}> · Thinking…</span>
                )}
              </span>
              {plyCaptured.length > 0 && (
                <div className="hidden sm:flex items-center gap-0.5 ml-1">
                  {plyCaptured.slice(0, 8).map((pt, idx) => (
                    <div key={idx} className="w-4 h-4">
                      <ChessPieceIcon
                        type={pt as 'p' | 'n' | 'b' | 'r' | 'q'}
                        color={bottomSideColor === 'w' ? 'b' : 'w'}
                        set={settings.pieceSet}
                      />
                    </div>
                  ))}
                  {plyLead > 0 && (
                    <span className="text-[11px] font-mono font-bold ml-1 tabular-nums" style={{ color: theme.accentHex }}>
                      +{plyLead}
                    </span>
                  )}
                </div>
              )}
              {(selectedVariant === 'three_check' || customState?.config.rules.winConditions.threeCheck) && (
                <span className="text-[11px] font-mono font-bold" style={{ color: theme.accentHex }}>
                  · Checks {bottomSideColor === 'w' ? (customState ? customState.whiteChecks : checksWhite) : (customState ? customState.blackChecks : checksBlack)}/3
                </span>
              )}
            </div>
            <div
              className="px-3.5 py-1.5 rounded-lg font-mono font-bold text-sm sm:text-base tabular-nums shrink-0"
              style={{
                backgroundColor: activeTurn === bottomSideColor ? `${theme.accentHex}20` : theme.cardSecondaryHex,
                color: activeTurn === bottomSideColor ? theme.accentHex : theme.textSecondary,
                border: `1px solid ${activeTurn === bottomSideColor ? theme.accentHex : theme.cardBorderHex}`
              }}
            >
              {formatClock(bottomSideColor === 'w' ? whiteTime : blackTime)}
            </div>
          </div>

          {/* Crazyhouse Reserve Pocket */}
          {selectedVariant === 'crazyhouse' && !isCustomMode && !gameOverResult && reviewPly === null && (
            <div
              className="w-full rounded-xl border px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
              style={{
                ...boardPlateStyle,
                backgroundColor: theme.cardHex,
                borderColor: selectedDropPiece ? theme.accentHex : theme.cardBorderHex
              }}
            >
              <span className="font-bold text-[11px] uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
                {selectedDropPiece
                  ? `Click an empty square to drop ${selectedDropPiece.toUpperCase()}`
                  : 'Crazyhouse Pocket'}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {(['q', 'r', 'b', 'n', 'p'] as const).map(pt => {
                  const turnColor = chess.turn();
                  const canDropSide = opponentMode === 'local_2p' || turnColor === playerColor;
                  const count = crazyhousePocket[turnColor].filter(p => p === pt).length;
                  if (count === 0) return null;
                  const isSel = selectedDropPiece === pt;
                  return (
                    <button
                      key={pt}
                      type="button"
                      disabled={!canDropSide || isEvaluating}
                      onClick={() => setSelectedDropPiece(isSel ? null : pt)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border font-mono font-bold transition hover:opacity-90 disabled:opacity-40"
                      style={{
                        backgroundColor: isSel ? `${theme.accentHex}25` : theme.cardSecondaryHex,
                        borderColor: isSel ? theme.accentHex : theme.cardBorderHex,
                        color: theme.textPrimary
                      }}
                      title={`Drop captured ${pt.toUpperCase()}`}
                    >
                      <span className="w-5 h-5">
                        <ChessPieceIcon type={pt} color={turnColor} set={settings.pieceSet} />
                      </span>
                      <span className="text-[11px]">×{count}</span>
                    </button>
                  );
                })}
                {crazyhousePocket[chess.turn()].length === 0 && (
                  <span className="text-[11px]" style={{ color: theme.textMutedHex }}>
                    Capture a piece to add it to your reserve
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Type Notation to Move Command Bar */}
          {settings.notationInput && (
            <form
              onSubmit={e => {
                e.preventDefault();
                executeNotationMove(notationText);
              }}
              className="w-full rounded-xl border p-2.5 flex flex-col gap-2"
              style={{
                ...boardPlateStyle,
                backgroundColor: theme.cardHex,
                borderColor: notationError ? '#f43f5e' : theme.cardBorderHex
              }}
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
                <input
                  ref={notationInputRef}
                  type="text"
                  value={notationText}
                  onChange={e => {
                    setNotationText(e.target.value);
                    if (notationError) setNotationError(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Tab' && notationSuggestions.length > 0) {
                      e.preventDefault();
                      setNotationText(notationSuggestions[0]);
                      setNotationError(null);
                    }
                  }}
                  disabled={!!gameOverResult}
                  aria-label="Type chess move notation"
                  placeholder={
                    isPlacingDuck
                      ? 'Type square for Rubber Duck (e.g. d5)...'
                      : 'Type move notation (e.g. e4, Nf3, O-O, e2e4)...'
                  }
                  className="flex-1 min-w-0 bg-transparent text-xs font-mono font-semibold focus:outline-none"
                  style={{ color: theme.textPrimary }}
                />
                <button
                  type="submit"
                  disabled={!notationText.trim() || !!gameOverResult}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition hover:opacity-90 disabled:opacity-40 whitespace-nowrap"
                  style={{
                    backgroundColor: theme.accentHex,
                    color: theme.accentTextHex
                  }}
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                  <span>Play Move</span>
                </button>
              </div>
              {(notationError || notationSuggestions.length > 0) && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  {notationError ? (
                    <span className="font-semibold text-rose-400">{notationError}</span>
                  ) : (
                    <span className="font-mono" style={{ color: theme.textMutedHex }}>
                      Tab to autocomplete · {activeTurn === 'w' ? 'White' : 'Black'} to move
                    </span>
                  )}
                  {notationSuggestions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      {notationSuggestions.map(sug => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => executeNotationMove(sug)}
                          className="px-2 py-0.5 rounded border font-mono font-bold transition hover:opacity-85 whitespace-nowrap"
                          style={{
                            backgroundColor: theme.cardSecondaryHex,
                            borderColor: theme.cardBorderHex,
                            color: theme.accentHex
                          }}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form>
          )}

          {premoveQueue.length > 0 && isVsAI && (
            <div
              data-testid="premove-queue-bar"
              className="w-full flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl border text-xs"
              style={{
                ...boardPlateStyle,
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                borderColor: 'rgba(244, 63, 94, 0.45)',
                color: theme.textPrimary
              }}
            >
              <div className="flex items-center gap-2 font-mono min-w-0">
                <FastForward className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="font-bold whitespace-nowrap">
                  {premoveQueue.length} {premoveQueue.length === 1 ? 'Premove' : 'Premoves'}:
                </span>
                <span className="text-rose-300 font-semibold truncate">
                  {premoveQueue.map((p, idx) => `${idx + 1}.${p.from}→${p.to}`).join(' ')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {premoveQueue.length > 1 && (
                  <button
                    type="button"
                    onClick={handleUndoLastPremove}
                    className="px-2 py-1 rounded-md text-[11px] font-bold bg-rose-500/15 text-rose-200 border border-rose-500/35 hover:bg-rose-500/25 transition whitespace-nowrap"
                  >
                    Undo Last
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCancelPremoves}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition whitespace-nowrap"
                >
                  Clear All (Esc)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Telemetry & Move Ledger */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Action Strip */}
          <div
            className="rounded-xl p-2 border grid grid-cols-6 gap-1"
            style={{
              backgroundColor: theme.cardHex,
              borderColor: theme.cardBorderHex
            }}
          >
            <button
              type="button"
              onClick={handleGetHint}
              disabled={!hintsEnabled || !!gameOverResult}
              className="flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition hover:opacity-80 disabled:opacity-35 whitespace-nowrap"
              style={{ color: theme.textPrimary }}
              title={hintsEnabled ? 'Engine Hint' : 'Hints disabled in Challenge/Assist settings'}
            >
              <Sparkles className="w-4 h-4" style={{ color: theme.accentHex }} />
              <span>Hint</span>
            </button>

            <button
              type="button"
              onClick={handleTakeback}
              disabled={!undosEnabled || !!gameOverResult || analyzedMoves.length === 0 || isEvaluating}
              className="flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition hover:opacity-80 disabled:opacity-35 whitespace-nowrap"
              style={{ color: theme.textPrimary }}
              title={undosEnabled ? 'Takeback last move' : 'Undos disabled in Challenge/Assist settings'}
            >
              <Undo2 className="w-4 h-4" style={{ color: theme.textSecondary }} />
              <span>Undo</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFlipped(f => !f)}
              className="flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition hover:opacity-80 whitespace-nowrap"
              style={{ color: theme.textPrimary }}
              title="Flip Board"
            >
              <ArrowUpDown className="w-4 h-4" style={{ color: theme.textSecondary }} />
              <span>Flip</span>
            </button>

            <button
              type="button"
              onClick={() => setClockPaused(p => !p)}
              disabled={!clockRunning || !!gameOverResult}
              className="flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition hover:opacity-80 disabled:opacity-40 whitespace-nowrap"
              style={{ color: clockPaused ? theme.accentHex : theme.textPrimary }}
              title={clockPaused ? 'Resume Clock' : 'Pause Clock'}
            >
              {clockPaused ? (
                <Play className="w-4 h-4" style={{ color: theme.accentHex }} />
              ) : (
                <Pause className="w-4 h-4" style={{ color: theme.textSecondary }} />
              )}
              <span>{clockPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              type="button"
              onClick={() => finishGame('1/2-1/2', 'draw agreement')}
              disabled={!!gameOverResult}
              className="flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition hover:opacity-80 disabled:opacity-40 whitespace-nowrap"
              style={{ color: theme.textSecondary }}
              title="Agree Draw"
            >
              <Handshake className="w-4 h-4" style={{ color: theme.textSecondary }} />
              <span>Draw</span>
            </button>

            <button
              type="button"
              onClick={() =>
                finishGame(
                  (opponentMode === 'local_2p' ? activeTurn : playerColor) === 'w' ? '0-1' : '1-0',
                  'resignation'
                )
              }
              disabled={!!gameOverResult}
              className="flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] font-semibold transition hover:opacity-80 text-rose-500 disabled:opacity-40 whitespace-nowrap"
              title="Resign Match"
            >
              <Flag className="w-4 h-4 text-rose-500" />
              <span>Resign</span>
            </button>
          </div>

          {/* Interactive Coach Game Panel (Teach While You Play) */}
          {opponentMode === 'coach' && !isCustomMode && (
            <div
              data-testid="live-coach-panel"
              className="rounded-xl p-4 border flex flex-col gap-3"
              style={{
                backgroundColor: theme.cardHex,
                borderColor:
                  coachLesson &&
                  (coachLesson.classification === 'blunder' ||
                    coachLesson.classification === 'mistake' ||
                    coachLesson.classification === 'missed_win')
                    ? '#E6912C'
                    : `${theme.accentHex}55`
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <GraduationCap className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
                  <span className="font-display font-bold text-sm truncate">Coach Mikhail · Live Tutor</span>
                </div>
                {coachLesson && (
                  <span className="font-mono text-xs font-bold tabular-nums whitespace-nowrap" style={{ color: theme.accentHex }}>
                    {coachLesson.moveAccuracy}% acc · {coachLesson.evalLabel}
                  </span>
                )}
              </div>

              {!coachLesson ? (
                <div className="text-xs leading-relaxed space-y-2" style={{ color: theme.textSecondary }}>
                  <p>
                    Play any opening move against {selectedBot.name}. I will grade every move in real time, warn you of threats, and offer an instant Retry when a tactic slips.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <MoveClassificationBadge type={coachLesson.classification} size="md" showLabel />
                      <span className="font-mono font-bold text-sm" style={{ color: theme.textPrimary }}>
                        {coachLesson.san}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono" style={{ color: theme.textMutedHex }}>
                      Best: <strong style={{ color: theme.textPrimary }}>{coachLesson.bestMoveSan}</strong>
                    </span>
                  </div>

                  <p className="leading-relaxed" style={{ color: theme.textPrimary }}>
                    {coachLesson.mover === 'ai' && coachLesson.opponentIntent
                      ? `${selectedBot.name} played ${coachLesson.san}: ${coachLesson.opponentIntent}`
                      : coachLesson.commentary}
                  </p>

                  {coachLesson.opponentReplyNote && (
                    <div
                      className="px-2.5 py-1.5 rounded-lg border text-[11px]"
                      style={{
                        backgroundColor: theme.cardSecondaryHex,
                        borderColor: theme.cardBorderHex,
                        color: theme.textSecondary
                      }}
                    >
                      {coachLesson.opponentReplyNote}
                    </div>
                  )}

                  {coachLesson.pvSan.length > 0 && (
                    <div className="font-mono text-[11px]" style={{ color: theme.textSecondary }}>
                      Continuation: {coachLesson.pvSan.join(' ')}
                    </div>
                  )}

                  {coachLesson.threats.length > 0 && (
                    <div
                      className="px-2.5 py-1.5 rounded-lg border text-[11px] flex items-center gap-1.5"
                      style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.10)',
                        borderColor: 'rgba(245, 158, 11, 0.35)',
                        color: theme.textPrimary
                      }}
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        Watch attacked squares: <strong className="font-mono">{coachLesson.threats.join(', ')}</strong>
                      </span>
                    </div>
                  )}

                  {coachLesson.aiDeepNote && (
                    <div
                      className="p-2.5 rounded-lg border space-y-1 text-xs"
                      style={{
                        backgroundColor: theme.cardSecondaryHex,
                        borderColor: theme.cardBorderHex
                      }}
                    >
                      <div className="font-bold" style={{ color: theme.accentHex }}>
                        {coachLesson.aiDeepNote.headline}
                      </div>
                      <p style={{ color: theme.textPrimary }}>{coachLesson.aiDeepNote.whyMoveWorkedOrFailed}</p>
                      <p className="text-[11px]" style={{ color: theme.textSecondary }}>
                        <strong>Tip:</strong> {coachLesson.aiDeepNote.coachTip}
                      </p>
                    </div>
                  )}

                  {coachDeepError && (
                    <div className="p-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-xs flex flex-col gap-2">
                      <span className="text-amber-200">{coachDeepError}</span>
                      <button
                        type="button"
                        onClick={handleUseLocalDeepLive}
                        disabled={loadingCoachOffline}
                        className="self-start px-2.5 py-1 rounded-md border font-bold text-[11px] transition hover:opacity-85 disabled:opacity-50"
                        style={{
                          backgroundColor: theme.cardSecondaryHex,
                          borderColor: theme.cardBorderHex,
                          color: theme.accentHex
                        }}
                      >
                        {loadingCoachOffline ? 'Loading...' : 'Use Local Breakdown'}
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {undosEnabled &&
                      !gameOverResult &&
                      !isEvaluating &&
                      chess.turn() === playerColor &&
                      (coachLesson.classification === 'inaccuracy' ||
                        coachLesson.classification === 'mistake' ||
                        coachLesson.classification === 'missed_win' ||
                        coachLesson.classification === 'blunder') && (
                        <>
                          <button
                            type="button"
                            onClick={handleTakeback}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition hover:opacity-90 whitespace-nowrap"
                            style={{
                              backgroundColor: theme.accentHex,
                              color: theme.accentTextHex
                            }}
                          >
                            <Undo2 className="w-3 h-3" />
                            <span>Undo &amp; Retry</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setHintArrow({
                                from: coachLesson.bestMoveFrom,
                                to: coachLesson.bestMoveTo
                              });
                              setHintText(
                                `Coach recommends ${coachLesson.bestMoveSan} (${coachLesson.pvSan.slice(0, 3).join(' ')})`
                              );
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition hover:opacity-85 whitespace-nowrap"
                            style={{
                              backgroundColor: theme.cardSecondaryHex,
                              borderColor: theme.cardBorderHex,
                              color: theme.textPrimary
                            }}
                          >
                            <Sparkles className="w-3 h-3" style={{ color: theme.accentHex }} />
                            <span>Show Best Move</span>
                          </button>
                        </>
                      )}

                    <button
                      type="button"
                      onClick={handleAskCoachDeepLive}
                      disabled={loadingCoachDeep}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition hover:opacity-85 disabled:opacity-50 whitespace-nowrap"
                      style={{
                        backgroundColor: theme.cardSecondaryHex,
                        borderColor: `${theme.accentHex}45`,
                        color: theme.accentHex
                      }}
                    >
                      <Bot className="w-3 h-3" />
                      <span>{loadingCoachDeep ? 'Explaining...' : 'Ask Coach Why'}</span>
                    </button>
                  </div>
                </div>
              )}

              {!gameOverResult && !isEvaluating && chess.turn() === playerColor && (
                <button
                  type="button"
                  onClick={handleCoachStepHint}
                  className="w-full py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition hover:opacity-85"
                  style={{
                    backgroundColor: theme.cardSecondaryHex,
                    borderColor: theme.cardBorderHex,
                    color: theme.textPrimary
                  }}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>{coachHintStep === 0 ? 'Get Coach Idea (Step 1)' : 'Show Exact Move (Step 2)'}</span>
                </button>
              )}
            </div>
          )}

          {hintText && hintsEnabled && (
            <div
              className="px-3.5 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-2"
              style={{
                backgroundColor: `${theme.accentHex}15`,
                borderColor: `${theme.accentHex}45`,
                color: theme.textPrimary
              }}
            >
              <Sparkles className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
              <span>{hintText}</span>
            </div>
          )}

          {liveTipsEnabled && liveEvalAllowed && opponentMode !== 'coach' && liveCoachTip && (
            <div
              className="px-3.5 py-2.5 rounded-xl border text-xs flex items-start gap-2.5"
              style={{
                backgroundColor:
                  liveCoachTip.tone === 'warn'
                    ? 'rgba(245, 158, 11, 0.12)'
                    : liveCoachTip.tone === 'good'
                    ? `${theme.accentHex}12`
                    : theme.cardHex,
                borderColor:
                  liveCoachTip.tone === 'warn'
                    ? 'rgba(245, 158, 11, 0.45)'
                    : liveCoachTip.tone === 'good'
                    ? `${theme.accentHex}40`
                    : theme.cardBorderHex,
                color: theme.textPrimary
              }}
            >
              <Lightbulb
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{
                  color: liveCoachTip.tone === 'warn' ? '#f59e0b' : theme.accentHex
                }}
              />
              <div className="min-w-0">
                <div className="font-bold text-xs">{liveCoachTip.title}</div>
                <div className="text-[11px] leading-snug mt-0.5" style={{ color: theme.textSecondary }}>
                  {liveCoachTip.body}
                </div>
              </div>
            </div>
          )}

          {showThreats && liveEvalAllowed && threatenedSquares.length > 0 && (
            <div
              className="px-3.5 py-2 rounded-xl border text-xs flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                borderColor: 'rgba(245, 158, 11, 0.45)',
                color: theme.textPrimary
              }}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Watch out: <span className="font-mono font-bold text-amber-300">{threatenedSquares.join(', ')}</span> under attack
              </span>
            </div>
          )}

          {/* Active Variant Rules Breakdown (only rendered cleanly for non-standard variants or custom configurations) */}
          {(selectedVariant !== 'standard' || activeCustomConfig) && (
            <div
              className="rounded-xl p-4 border flex flex-col gap-2"
              style={{
                backgroundColor: theme.cardHex,
                borderColor: theme.cardBorderHex
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
                  {activeTitle} Rules
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: theme.accentHex }}>
                  {activeCustomConfig
                    ? `${activeCustomConfig.boardWidth}×${activeCustomConfig.boardHeight}`
                    : '8×8'}
                </span>
              </div>
              {activeCustomConfig ? (
                <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                  {activeCustomConfig.description}
                </p>
              ) : (
                <ul className="space-y-1 text-xs" style={{ color: theme.textSecondary }}>
                  {variantDef.specialRules.slice(0, 3).map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span style={{ color: theme.accentHex }}>·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Move Notation Ledger with Replay Navigation */}
          <div
            className="rounded-xl p-4 border flex flex-col h-[340px]"
            style={{
              backgroundColor: theme.cardHex,
              borderColor: theme.cardBorderHex
            }}
          >
            <div className="flex items-center justify-between pb-2.5 border-b mb-2" style={{ borderColor: theme.cardBorderHex }}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: theme.textMutedHex }}>
                  Moves ({analyzedMoves.length})
                </span>
                {liveEvalAllowed && !isCustomMode && liveAccWhite !== null && (
                  <span className="text-[11px] font-mono tabular-nums truncate" style={{ color: theme.textSecondary }}>
                    · W {liveAccWhite}%{liveAccBlack !== null ? ` · B ${liveAccBlack}%` : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                {reviewPly !== null && !isCustomMode && (
                  <button
                    type="button"
                    onClick={() => setReviewPly(null)}
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                    style={{
                      backgroundColor: theme.accentHex,
                      color: theme.accentTextHex
                    }}
                  >
                    Live
                  </button>
                )}
                {!isCustomMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowFenTools(s => !s);
                      setFenInput(chess.fen());
                      setFenStatus(null);
                    }}
                    className="text-[11px] font-semibold transition hover:opacity-80 whitespace-nowrap"
                    style={{ color: showFenTools ? theme.accentHex : theme.textSecondary }}
                    title="Copy or load FEN position"
                  >
                    FEN
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCopyPgn}
                  disabled={analyzedMoves.length === 0}
                  className="flex items-center gap-1 text-[11px] font-semibold transition hover:opacity-80 disabled:opacity-35 whitespace-nowrap"
                  style={{ color: theme.accentHex }}
                  title="Copy PGN notation"
                >
                  {copiedPgn ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPgn ? 'Copied' : 'PGN'}</span>
                </button>
              </div>
            </div>

            {showFenTools && !isCustomMode && (
              <form
                onSubmit={handleLoadFen}
                className="mb-2 p-2 rounded-lg border flex flex-col gap-1.5 text-[11px]"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex
                }}
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={fenInput}
                    onChange={e => setFenInput(e.target.value)}
                    aria-label="Position FEN string"
                    placeholder="Paste FEN position..."
                    className="flex-1 min-w-0 px-2 py-1 rounded border font-mono text-[11px] focus:outline-none"
                    style={{
                      backgroundColor: theme.cardHex,
                      borderColor: theme.cardBorderHex,
                      color: theme.textPrimary
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCopyFen}
                    className="px-2 py-1 rounded border font-semibold whitespace-nowrap"
                    style={{
                      backgroundColor: theme.cardHex,
                      borderColor: theme.cardBorderHex,
                      color: theme.textPrimary
                    }}
                  >
                    {copiedFen ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded font-bold whitespace-nowrap"
                    style={{
                      backgroundColor: theme.accentHex,
                      color: theme.accentTextHex
                    }}
                  >
                    Load
                  </button>
                </div>
                {fenStatus && (
                  <span
                    className={`text-[10px] font-semibold ${
                      fenStatus.includes('Invalid') ? 'text-rose-400' : ''
                    }`}
                    style={fenStatus.includes('Invalid') ? undefined : { color: theme.accentHex }}
                  >
                    {fenStatus}
                  </span>
                )}
              </form>
            )}

            <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 font-mono text-xs tabular-nums">
              {analyzedMoves.length === 0 ? (
                <div className="text-center py-12 text-xs" style={{ color: theme.textMutedHex }}>
                  Drag or click a piece on the board to begin.
                </div>
              ) : (
                Array.from({ length: Math.ceil(analyzedMoves.length / 2) }).map((_, movePairIdx) => {
                  const whiteIdx = movePairIdx * 2;
                  const blackIdx = movePairIdx * 2 + 1;
                  const whiteMove = analyzedMoves[whiteIdx];
                  const blackMove = analyzedMoves[blackIdx];
                  const activePly = reviewPly ?? analyzedMoves.length;

                  return (
                    <div
                      key={movePairIdx}
                      className="flex items-center py-1 px-2 rounded"
                      style={{ backgroundColor: movePairIdx % 2 === 1 ? theme.surfaceHoverHex : 'transparent' }}
                    >
                      <span className="w-8 font-bold" style={{ color: theme.textMutedHex }}>{movePairIdx + 1}.</span>
                      <button
                        type="button"
                        disabled={isCustomMode || !whiteMove}
                        onClick={() => setReviewPly(whiteIdx + 1 >= analyzedMoves.length ? null : whiteIdx + 1)}
                        className="w-28 text-left font-bold px-1.5 py-0.5 rounded transition disabled:cursor-default inline-flex items-center gap-1.5"
                        style={{
                          backgroundColor: activePly === whiteIdx + 1 ? `${theme.accentHex}25` : 'transparent',
                          color: activePly === whiteIdx + 1 ? theme.accentHex : theme.textPrimary
                        }}
                      >
                        {liveEvalAllowed && !isCustomMode && whiteMove && !whiteMove.pending && (
                          <MoveClassificationBadge type={whiteMove.classification} size="xs" />
                        )}
                        <span>{whiteMove?.san}</span>
                      </button>
                      {blackMove && (
                        <button
                          type="button"
                          disabled={isCustomMode}
                          onClick={() => setReviewPly(blackIdx + 1 >= analyzedMoves.length ? null : blackIdx + 1)}
                          className="w-28 text-left font-bold px-1.5 py-0.5 rounded transition disabled:cursor-default inline-flex items-center gap-1.5"
                          style={{
                            backgroundColor: activePly === blackIdx + 1 ? `${theme.accentHex}25` : 'transparent',
                            color: activePly === blackIdx + 1 ? theme.accentHex : theme.textSecondary
                          }}
                        >
                          {liveEvalAllowed && !isCustomMode && !blackMove.pending && (
                            <MoveClassificationBadge type={blackMove.classification} size="xs" />
                          )}
                          <span>{blackMove?.san}</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Interactive Board Step Controls */}
            {!isCustomMode && analyzedMoves.length > 0 && (
              <div className="flex items-center justify-between gap-1.5 pt-2.5 mt-2 border-t" style={{ borderColor: theme.cardBorderHex }}>
                <button
                  type="button"
                  onClick={() => setReviewPly(0)}
                  aria-label="Jump to start position"
                  className="flex-1 flex items-center justify-center py-1.5 rounded-lg border hover:opacity-80 transition"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setReviewPly(Math.max(0, (reviewPly ?? analyzedMoves.length) - 1))}
                  aria-label="Step back one move"
                  className="flex-1 flex items-center justify-center py-1.5 rounded-lg border hover:opacity-80 transition"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(analyzedMoves.length, (reviewPly ?? analyzedMoves.length) + 1);
                    setReviewPly(next >= analyzedMoves.length ? null : next);
                  }}
                  aria-label="Step forward one move"
                  className="flex-1 flex items-center justify-center py-1.5 rounded-lg border hover:opacity-80 transition"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setReviewPly(null)}
                  aria-label="Jump to live position"
                  className="flex-1 flex items-center justify-center py-1.5 rounded-lg border hover:opacity-80 transition"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* End of Match Overlay */}
      {gameOverResult && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="border rounded-2xl max-w-md w-full p-6 shadow-2xl text-center flex flex-col items-center gap-4 animate-modal-reveal"
            style={{
              backgroundColor: theme.cardHex,
              borderColor: theme.cardBorderHex,
              color: theme.textPrimary
            }}
          >
            <div
              className="w-14 h-14 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: `${theme.accentHex}18`,
                borderColor: `${theme.accentHex}40`,
                color: theme.accentHex
              }}
            >
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-extrabold" style={{ color: theme.textPrimary }}>
                {gameOverResult.result === '1-0'
                  ? opponentMode === 'local_2p'
                    ? 'Player 1 (White) Won'
                    : playerColor === 'w'
                    ? 'Victory'
                    : 'White Won'
                  : gameOverResult.result === '0-1'
                  ? opponentMode === 'local_2p'
                    ? 'Player 2 (Black) Won'
                    : playerColor === 'b'
                    ? 'Victory'
                    : 'Black Won'
                  : 'Drawn Match'}
              </h3>
              <p className="text-xs mt-1 capitalize" style={{ color: theme.textSecondary }}>
                {gameOverResult.reason} · {analyzedMoves.length} moves played
              </p>
            </div>

            <div className="w-full flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const accW = calculateAccuracyFromMoves(analyzedMoves, 'w');
                  const accB = calculateAccuracyFromMoves(analyzedMoves, 'b');
                  const pgnText = isCustomMode
                    ? buildMoveTextFromList(analyzedMoves)
                    : chess.history().length === analyzedMoves.length
                    ? chess.pgn()
                    : buildMoveTextFromList(analyzedMoves);
                  const lastGame: GameHistoryItem = {
                    id: `game-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    variant: selectedVariant,
                    playerColor,
                    opponentName:
                      opponentMode === 'local_2p'
                        ? 'Pass & Play (Local 2P)'
                        : opponentMode === 'coach'
                        ? `${selectedBot.name} (Coach)`
                        : selectedBot.name,
                    opponentElo: opponentMode === 'local_2p' ? 0 : selectedBot.elo,
                    timeControl: timeControlName,
                    result: gameOverResult.result,
                    reason: gameOverResult.reason as GameHistoryItem['reason'],
                    movesCount: analyzedMoves.length,
                    pgn: pgnText,
                    startFen: !isCustomMode ? startFenForReplay : undefined,
                    startCustomConfig: isCustomMode && activeCustomConfig ? activeCustomConfig : undefined,
                    accuracyWhite: accW,
                    accuracyBlack: accB,
                    playerAccuracy: playerColor === 'w' ? accW : accB,
                    blundersCount: analyzedMoves.filter(m => m.classification === 'blunder').length,
                    analyzedMoves
                  };
                  setGameOverResult(null);
                  onRunGameReview(lastGame);
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs tracking-wide transition flex items-center justify-center gap-2 hover:opacity-90"
                style={{
                  backgroundColor: theme.accentHex,
                  color: theme.accentTextHex
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Post-Game Analysis</span>
              </button>

              <div className={opponentMode !== 'local_2p' ? 'grid grid-cols-2 gap-2' : 'w-full'}>
                <button
                  type="button"
                  onClick={() => startNewGame(selectedVariant, activeCustomConfig)}
                  className="w-full py-2.5 rounded-xl border font-semibold text-xs transition hover:opacity-80"
                  style={{
                    backgroundColor: isCustomMode ? theme.accentHex : theme.cardSecondaryHex,
                    borderColor: isCustomMode ? theme.accentHex : theme.cardBorderHex,
                    color: isCustomMode ? theme.accentTextHex : theme.textPrimary
                  }}
                >
                  Play Again
                </button>

                {opponentMode !== 'local_2p' && (
                  <button
                    type="button"
                    onClick={() => {
                      const swapped: PieceColor = playerColor === 'w' ? 'b' : 'w';
                      setSidePreference(swapped);
                      setPlayerColor(swapped);
                      setIsFlipped(swapped === 'b');
                      startNewGame(selectedVariant, activeCustomConfig, swapped);
                    }}
                    className="w-full py-2.5 rounded-xl border font-semibold text-xs transition hover:opacity-80 flex items-center justify-center gap-1.5"
                    style={{
                      backgroundColor: theme.cardSecondaryHex,
                      borderColor: theme.cardBorderHex,
                      color: theme.textPrimary
                    }}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                    <span>Swap Colors</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chess.com-Style Bot Roster Selector Modal */}
      <BotRosterModal
        isOpen={showCharacterModal && isVsAI}
        selectedBot={effectiveBot}
        customEloInput={customEloInput}
        sidePreference={sidePreference}
        adaptiveResolution={adaptiveResolution}
        adaptivePosture={adaptivePosture}
        defeatedBotIds={defeatedBotIds}
        onChangeCustomElo={elo => {
          setCustomEloInput(elo);
          if (selectedBot.isCustom) {
            const customBot = createCustomBotProfile(elo);
            rawSelectedBotRef.current = customBot;
            selectedBotRef.current = customBot;
            setSelectedBot(customBot);
          }
        }}
        onChangeAdaptivePosture={posture => {
          adaptivePostureRef.current = posture;
          setAdaptivePosture(posture);
        }}
        onSelectAndPlay={(chosenBot, chosenSide) => {
          rawSelectedBotRef.current = chosenBot;
          selectedBotRef.current = chosenBot;
          setSelectedBot(chosenBot);
          setShowCustomElo(Boolean(chosenBot.isCustom));
          setSidePreference(chosenSide);
          const resolved: PieceColor =
            chosenSide === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : chosenSide;
          setPlayerColor(resolved);
          setIsFlipped(resolved === 'b');
          setShowCharacterModal(false);
          startNewGame(selectedVariant, activeCustomConfig, resolved, openingId, opponentMode);
        }}
        onClose={() => setShowCharacterModal(false)}
      />
        </>
      )}
    </div>
  );
};
