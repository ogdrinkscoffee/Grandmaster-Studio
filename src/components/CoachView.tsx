import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { UserProfile, GameHistoryItem, OpponentMode } from '../types/chess';
import { ChessPieceIcon } from './ChessPieces';
import { ChessBoard, getBoardMaxWidthPx } from './ChessBoard';
import { BotCharacterAvatar } from './BotCharacterAvatar';
import { AdaptivePosture, resolveAdaptiveBot } from '../engine/adaptiveBot';
import { engineTopLines } from '../engine/engineClient';
import {
  evaluateBoard,
  formatEvaluation,
  computeGamePhaseAccuracy,
  EngineLine
} from '../engine/chessEngine';
import {
  Brain,
  Sparkles,
  Target,
  Compass,
  BookOpen,
  ShieldAlert,
  CheckCircle2,
  Send,
  Loader2,
  BarChart3,
  Search,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  Swords,
  GraduationCap
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useAppTheme } from '../context/ThemeContext';

interface CoachViewProps {
  profile: UserProfile;
  recentGames: GameHistoryItem[];
  onStartRecommendedPuzzles?: (theme: string) => void;
  onChallengeAdaptiveBot?: (posture: AdaptivePosture, mode: OpponentMode) => void;
}

const DECODER_PRESETS = [
  {
    id: 'greek_gift',
    label: 'Greek Gift Attack',
    fen: '2r2rk1/1b2qppp/pp2p3/n2pP3/P2P4/3B1N2/1P1Q1PPP/2R2RK1 w - - 4 19'
  },
  {
    id: 'fried_liver',
    label: 'Fried Liver Tension',
    fen: 'r1bqkb1r/ppp2ppp/2n5/3np3/2B5/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5'
  },
  {
    id: 'endgame_pin',
    label: 'Endgame Conversion',
    fen: '6k1/5p2/6p1/7p/3q4/1P4P1/2r2P1P/1Q2R1K1 w - - 0 35'
  },
  {
    id: 'starting',
    label: 'Starting Position',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  }
];

const QUICK_ASK_PROMPTS = [
  'Analyze my latest game & biggest mistake',
  'How do I stop blundering in the middlegame?',
  'Give me a rook endgame conversion checklist',
  'Sharpen my opening development principles'
];

export const CoachView: React.FC<CoachViewProps> = ({
  profile,
  recentGames,
  onStartRecommendedPuzzles,
  onChallengeAdaptiveBot
}) => {
  const { theme: currentTheme, pieceSet, settings: appSettings } = useAppTheme();
  const boardPlateMaxWidth = `${getBoardMaxWidthPx(appSettings.boardSize)}px`;
  const [adaptivePosture, setAdaptivePosture] = useState<AdaptivePosture>('auto');
  const adaptivePreview = useMemo(
    () =>
      resolveAdaptiveBot({
        playerRapidElo: profile.ratings.rapid,
        recentGames,
        posture: adaptivePosture
      }),
    [profile.ratings.rapid, recentGames, adaptivePosture]
  );
  const [userGoal, setUserGoal] = useState<string>('Sharpen tactical vision & eliminate opening blunders');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingOfflineCoach, setLoadingOfflineCoach] = useState<boolean>(false);
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [coachError, setCoachError] = useState<string | null>(null);
  const [lastCoachQuestion, setLastCoachQuestion] = useState<string>('');
  const coachReqRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // DecodeChess-style Position Decoder state
  const [decodeFenInput, setDecodeFenInput] = useState<string>(DECODER_PRESETS[0].fen);
  const [decodeChess, setDecodeChess] = useState<Chess>(() => new Chess(DECODER_PRESETS[0].fen));
  const [decodedLines, setDecodedLines] = useState<EngineLine[]>([]);
  const [isDecoding, setIsDecoding] = useState<boolean>(true);
  const decodeRequestRef = useRef<number>(0);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number>(0);
  const [decodeError, setDecodeError] = useState<string | null>(null);

  const [coachResponse, setCoachResponse] = useState<{
    coachSummary: string;
    keyStrengths: string[];
    areasForImprovement: string[];
    tacticalTakeaway: string;
    suggestedPuzzlesCategory: string;
    openingTip: string;
  }>({
    coachSummary: `Based on your current rating (${profile.ratings.rapid} Rapid · ${profile.ratings.puzzles} Puzzles), you show strong tactical instinct in open positions. Focus on eliminating unforced middlegame blunders after queen trades to push past candidate-master thresholds.`,
    keyStrengths: [
      'High tactical alertness when initiating king-side attacks',
      'Reliable king safety during the early opening phase',
      'Active piece coordination in dynamic counter-play'
    ],
    areasForImprovement: [
      'Prophylaxis: check opponent threats before advancing flank pawns',
      'Rook endgames: keep rooks behind passed pawns',
      'Clock discipline during sharp tactical complications'
    ],
    tacticalTakeaway:
      'Before playing any candidate move, verify every check, capture, and forcing threat your opponent gains in reply.',
    suggestedPuzzlesCategory: 'Pin & Skewer',
    openingTip:
      'Build around classical central-pawn structures (1.e4 e5 or 1.d4 d5) to reinforce piece activity and development tempo.'
  });

  // Scouting & Habit Analytics computed live from recentGames
  const scoutingMetrics = useMemo(() => {
    const games = recentGames || [];
    const whiteGames = games.filter(g => g.playerColor === 'w');
    const blackGames = games.filter(g => g.playerColor === 'b');

    const isWin = (g: GameHistoryItem) =>
      (g.playerColor === 'w' && g.result === '1-0') ||
      (g.playerColor === 'b' && g.result === '0-1');

    const whiteWinRate =
      whiteGames.length > 0
        ? Math.round((whiteGames.filter(isWin).length / whiteGames.length) * 100)
        : null;
    const blackWinRate =
      blackGames.length > 0
        ? Math.round((blackGames.filter(isWin).length / blackGames.length) * 100)
        : null;

    const accuracyGames = games.filter(g => typeof g.playerAccuracy === 'number');
    const avgAccuracy =
      accuracyGames.length > 0
        ? Math.round(
            (accuracyGames.reduce((acc, g) => acc + (g.playerAccuracy as number), 0) / accuracyGames.length) * 10
          ) / 10
        : null;

    const blundersPerGame =
      games.length > 0
        ? Math.round(
            (games.reduce((acc, g) => acc + (g.blundersCount ?? 0), 0) / games.length) * 10
          ) / 10
        : null;

    const avgMoves =
      games.length > 0
        ? Math.round(games.reduce((acc, g) => acc + (g.movesCount || 0), 0) / games.length)
        : null;

    let priorityTheme = 'Pin & Skewer';
    if (blundersPerGame !== null && blundersPerGame >= 1.5) {
      priorityTheme = 'Forks & Outposts';
    } else if (blackWinRate !== null && whiteWinRate !== null && blackWinRate + 10 < whiteWinRate) {
      priorityTheme = 'Endgame & Defense';
    }

    return {
      whiteWinRate,
      blackWinRate,
      avgAccuracy,
      blundersPerGame,
      avgMoves,
      priorityTheme
    };
  }, [recentGames]);

  // Real Opening, Middlegame, and Endgame accuracy curve derived strictly from analyzed games
  const phaseAccuracySeries = useMemo(() => {
    const games = [...(recentGames || [])].reverse();
    const series: {
      date: string;
      label: string;
      opening: number | null;
      middlegame: number | null;
      endgame: number | null;
    }[] = [];

    for (const g of games) {
      if (!g.analyzedMoves || g.analyzedMoves.length === 0) continue;
      const phases = computeGamePhaseAccuracy(g.analyzedMoves, g.playerColor);
      if (phases.opening === null && phases.middlegame === null && phases.endgame === null) continue;
      const opponentShort = (g.opponentName || 'Match').split(' ')[0];
      series.push({
        date: g.date,
        label: `${g.date} · ${opponentShort}`,
        opening: phases.opening,
        middlegame: phases.middlegame,
        endgame: phases.endgame
      });
    }
    return series;
  }, [recentGames]);

  const phaseDeltas = useMemo(() => {
    const summarize = (key: 'opening' | 'middlegame' | 'endgame') => {
      const vals = phaseAccuracySeries.map(p => p[key]).filter((v): v is number => v !== null);
      if (vals.length === 0) return { current: null as number | null, delta: null as number | null };
      const first = vals[0];
      const last = vals[vals.length - 1];
      return {
        current: last,
        delta: vals.length >= 2 ? Math.round((last - first) * 10) / 10 : null
      };
    };

    const opening = summarize('opening');
    const middlegame = summarize('middlegame');
    const endgame = summarize('endgame');

    return {
      openingCurrent: opening.current,
      openingDelta: opening.delta,
      midCurrent: middlegame.current,
      midDelta: middlegame.delta,
      endCurrent: endgame.current,
      endDelta: endgame.delta
    };
  }, [phaseAccuracySeries]);

  // Candidate lines are computed in the engine worker so the tab never freezes
  const runDecodeAnalysis = (board: Chess, timeLimitMs = 480) => {
    decodeRequestRef.current += 1;
    const requestId = decodeRequestRef.current;
    setIsDecoding(true);
    engineTopLines(board.fen(), 3, 3, timeLimitMs)
      .then(lines => {
        if (requestId !== decodeRequestRef.current) return;
        setDecodedLines(lines);
        setSelectedLineIndex(0);
      })
      .catch(() => {
        if (requestId === decodeRequestRef.current) setDecodedLines([]);
      })
      .finally(() => {
        if (requestId === decodeRequestRef.current) setIsDecoding(false);
      });
  };

  useEffect(() => {
    runDecodeAnalysis(new Chess(DECODER_PRESETS[0].fen), 450);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadPreset = (fen: string) => {
    try {
      const nextBoard = new Chess(fen);
      setDecodeError(null);
      setDecodeFenInput(fen);
      setDecodeChess(nextBoard);
      runDecodeAnalysis(nextBoard);
    } catch {
      setDecodeError('Preset FEN could not be parsed.');
    }
  };

  const handleLoadCustomFen = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nextBoard = new Chess(decodeFenInput.trim());
      setDecodeError(null);
      setDecodeChess(nextBoard);
      runDecodeAnalysis(nextBoard);
    } catch {
      setDecodeError('Invalid FEN string. Check piece placement and turn syntax.');
    }
  };

  const handleDecodeBoardMove = ({
    from,
    to,
    promotion = 'q'
  }: {
    from: Square;
    to: Square;
    promotion?: string;
  }) => {
    try {
      const nextBoard = new Chess(decodeChess.fen());
      const moved = nextBoard.move({ from, to, promotion });
      if (!moved) return;
      setDecodeError(null);
      setDecodeChess(nextBoard);
      setDecodeFenInput(nextBoard.fen());
      runDecodeAnalysis(nextBoard);
    } catch {
      // ignore invalid move
    }
  };

  const submitCoachQuery = async (questionText: string) => {
    const reqId = ++coachReqRef.current;
    const effectiveGoal = questionText || userGoal;
    setLastCoachQuestion(effectiveGoal);
    setCoachError(null);
    setApiNotice(null);
    setIsLoading(true);
    const latestGame = recentGames[0];

    try {
      const res = await fetch('/api/coach/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userRating: profile.ratings.rapid,
          userGoal: effectiveGoal,
          pgn: latestGame ? latestGame.pgn : '',
          fen: decodeChess.fen(),
          variant: latestGame?.variant || 'Standard Chess',
          playerColor: latestGame ? latestGame.playerColor : 'w',
          blunders: latestGame?.blundersCount ? Array(latestGame.blundersCount).fill('blunder') : []
        })
      });

      if (!mountedRef.current || reqId !== coachReqRef.current) return;

      if (res.ok) {
        const data = await res.json();
        setApiNotice(data.apiNotice || 'Live Gemini Grandmaster analysis received.');
        setCoachError(null);
        setCoachResponse({
          coachSummary: data.coachSummary || coachResponse.coachSummary,
          keyStrengths: Array.isArray(data.keyStrengths) ? data.keyStrengths : coachResponse.keyStrengths,
          areasForImprovement: Array.isArray(data.areasForImprovement)
            ? data.areasForImprovement
            : coachResponse.areasForImprovement,
          tacticalTakeaway: data.tacticalTakeaway || coachResponse.tacticalTakeaway,
          suggestedPuzzlesCategory:
            data.suggestedPuzzlesCategory || coachResponse.suggestedPuzzlesCategory,
          openingTip: data.openingTip || coachResponse.openingTip
        });
      } else {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        setCoachError(errData.error || `Cloud Coach request failed (HTTP ${res.status}).`);
      }
    } catch {
      if (mountedRef.current && reqId === coachReqRef.current) {
        setCoachError('Network error: unable to reach Cloud Coach.');
      }
    } finally {
      if (mountedRef.current && reqId === coachReqRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleUseOfflineCoach = async () => {
    if (loadingOfflineCoach) return;
    setLoadingOfflineCoach(true);
    const latestGame = recentGames[0];
    try {
      const res = await fetch('/api/coach/offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'analyze',
          userRating: profile.ratings.rapid,
          userGoal: lastCoachQuestion || userGoal,
          pgn: latestGame ? latestGame.pgn : '',
          variant: latestGame?.variant || 'Standard Chess',
          playerColor: latestGame ? latestGame.playerColor : 'w',
          blunders: latestGame?.blundersCount ? Array(latestGame.blundersCount).fill('blunder') : []
        })
      });
      if (!mountedRef.current) return;
      if (res.ok) {
        const data = await res.json();
        setCoachResponse({
          coachSummary: data.coachSummary || coachResponse.coachSummary,
          keyStrengths: Array.isArray(data.keyStrengths) ? data.keyStrengths : coachResponse.keyStrengths,
          areasForImprovement: Array.isArray(data.areasForImprovement)
            ? data.areasForImprovement
            : coachResponse.areasForImprovement,
          tacticalTakeaway: data.tacticalTakeaway || coachResponse.tacticalTakeaway,
          suggestedPuzzlesCategory:
            data.suggestedPuzzlesCategory || coachResponse.suggestedPuzzlesCategory,
          openingTip: data.openingTip || coachResponse.openingTip
        });
        setCoachError(null);
        setApiNotice('Offline mode active. Showing local Grandmaster heuristics.');
      } else {
        setCoachError(`Local Coach endpoint returned HTTP ${res.status}.`);
      }
    } catch {
      if (mountedRef.current) {
        setCoachError('Unable to reach server for Offline Coach report.');
      }
    } finally {
      if (mountedRef.current) {
        setLoadingOfflineCoach(false);
      }
    }
  };

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = customQuestion.trim() || userGoal;
    setCustomQuestion('');
    await submitCoachQuery(prompt);
  };

  const activeDecodedLine = decodedLines[selectedLineIndex] || decodedLines[0];
  const staticPosEval = useMemo(() => evaluateBoard(decodeChess), [decodeChess]);

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto px-3 sm:px-6 py-4" style={{ color: currentTheme.textPrimary }}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border"
        style={{
          backgroundColor: currentTheme.cardHex,
          borderColor: currentTheme.cardBorderHex
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              borderColor: currentTheme.cardBorderHex,
              color: currentTheme.accentHex
            }}
          >
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: currentTheme.textPrimary }}>
              Strategy Coach & Position Decoder
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: currentTheme.textSecondary }}>
              Per-game phase accuracy tracking, candidate line breakdowns, and personalized drills.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono tabular-nums" style={{ color: currentTheme.textSecondary }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.accentHex }} />
          <span>{recentGames.length} games recorded</span>
        </div>
      </div>

      {/* Special Adaptive AI Sparring Opponent */}
      <section
        aria-label="Adaptive Coach AI Opponent"
        className="rounded-xl p-5 border flex flex-col gap-4"
        style={{
          backgroundColor: currentTheme.cardHex,
          borderColor: `${adaptivePreview.accentHex}60`
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className="rounded-xl shrink-0 ring-1 ring-white/10"
              style={{ boxShadow: `0 4px 16px ${adaptivePreview.accentHex}28` }}
            >
              <BotCharacterAvatar
                botId="bot_adaptive_coach"
                elo={adaptivePreview.effectiveElo}
                size={56}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h2 className="font-display text-base sm:text-lg font-extrabold tracking-tight" style={{ color: currentTheme.textPrimary }}>
                  {adaptivePreview.bot.name}
                </h2>
                <span
                  className="font-mono text-xs font-bold tabular-nums whitespace-nowrap"
                  style={{ color: adaptivePreview.accentHex }}
                >
                  · {adaptivePreview.effectiveElo} Elo
                </span>
                <span className="text-xs font-semibold whitespace-nowrap" style={{ color: currentTheme.textSecondary }}>
                  · {adaptivePreview.tierLabel}
                </span>
              </div>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed" style={{ color: currentTheme.textSecondary }}>
                {adaptivePreview.reasonSummary}
              </p>
              <div
                className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2 text-[11px] font-mono tabular-nums"
                style={{ color: currentTheme.textMutedHex }}
              >
                <span>
                  Win Rate{' '}
                  <strong style={{ color: currentTheme.textPrimary }}>
                    {adaptivePreview.telemetry.recentWinRate !== null ? `${adaptivePreview.telemetry.recentWinRate}%` : '—'}
                  </strong>
                </span>
                <span>·</span>
                <span>
                  Mean Accuracy{' '}
                  <strong style={{ color: currentTheme.textPrimary }}>
                    {adaptivePreview.telemetry.recentAccuracy !== null ? `${adaptivePreview.telemetry.recentAccuracy}%` : '—'}
                  </strong>
                </span>
                <span>·</span>
                <span>
                  Form{' '}
                  <strong style={{ color: adaptivePreview.accentHex }}>
                    {adaptivePreview.telemetry.streakLabel}
                  </strong>
                </span>
                <span>·</span>
                <span>
                  Slip Rate{' '}
                  <strong style={{ color: currentTheme.textPrimary }}>
                    {Math.round(adaptivePreview.blunderRate * 100)}%
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
            {/* Adaptive Posture Selector */}
            <div
              className="grid grid-cols-3 gap-1 p-1 rounded-lg border"
              style={{
                backgroundColor: currentTheme.cardSecondaryHex,
                borderColor: currentTheme.cardBorderHex
              }}
              role="group"
              aria-label="Adaptive AI posture"
            >
              {(
                [
                  { id: 'auto', label: 'Auto-Adapt' },
                  { id: 'easy', label: 'Play Easy' },
                  { id: 'hard', label: 'Play Hard' }
                ] as const
              ).map(option => {
                const active = adaptivePosture === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setAdaptivePosture(option.id)}
                    className="px-2.5 py-1.5 rounded-md text-[11px] font-bold transition whitespace-nowrap cursor-pointer"
                    style={{
                      backgroundColor: active ? `${adaptivePreview.accentHex}22` : 'transparent',
                      color: active ? adaptivePreview.accentHex : currentTheme.textSecondary,
                      border: active ? `1px solid ${adaptivePreview.accentHex}66` : '1px solid transparent'
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {/* Direct Launch Actions */}
            {onChallengeAdaptiveBot && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChallengeAdaptiveBot(adaptivePosture, 'coach')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition hover:opacity-90 active:scale-[0.98] whitespace-nowrap cursor-pointer"
                  style={{
                    backgroundColor: currentTheme.accentHex,
                    color: currentTheme.accentTextHex
                  }}
                >
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span>Play Guided Match</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChallengeAdaptiveBot(adaptivePosture, 'ai')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-bold transition hover:opacity-85 active:scale-[0.98] whitespace-nowrap cursor-pointer"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    borderColor: currentTheme.cardBorderHex,
                    color: currentTheme.textPrimary
                  }}
                >
                  <Swords className="w-3.5 h-3.5 shrink-0" style={{ color: adaptivePreview.accentHex }} />
                  <span>Rated vs Adaptive AI</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Habit & Scouting Telemetry */}
      <div
        className="rounded-xl p-5 border flex flex-col gap-4"
        style={{
          backgroundColor: currentTheme.cardHex,
          borderColor: currentTheme.cardBorderHex
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
            <h2 className="font-display text-base font-bold" style={{ color: currentTheme.textPrimary }}>
              Habit Scouting Telemetry
            </h2>
          </div>
          {onStartRecommendedPuzzles && (
            <button
              type="button"
              onClick={() => onStartRecommendedPuzzles(scoutingMetrics.priorityTheme)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-90"
              style={{
                backgroundColor: currentTheme.accentHex,
                color: currentTheme.accentTextHex
              }}
            >
              Train Focus: {scoutingMetrics.priorityTheme}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            className="p-3.5 rounded-lg border"
            style={{ backgroundColor: currentTheme.cardSecondaryHex, borderColor: currentTheme.cardBorderHex }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: currentTheme.textMutedHex }}>
              White / Black Win Rate
            </div>
            <div className="font-mono font-extrabold text-lg mt-1 tabular-nums" style={{ color: currentTheme.textPrimary }}>
              {scoutingMetrics.whiteWinRate !== null ? `${scoutingMetrics.whiteWinRate}%` : '—'} / {scoutingMetrics.blackWinRate !== null ? `${scoutingMetrics.blackWinRate}%` : '—'}
            </div>
          </div>

          <div
            className="p-3.5 rounded-lg border"
            style={{ backgroundColor: currentTheme.cardSecondaryHex, borderColor: currentTheme.cardBorderHex }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: currentTheme.textMutedHex }}>
              Mean Accuracy
            </div>
            <div className="font-mono font-extrabold text-lg mt-1 tabular-nums" style={{ color: currentTheme.accentHex }}>
              {scoutingMetrics.avgAccuracy !== null ? `${scoutingMetrics.avgAccuracy}%` : '—'}
            </div>
          </div>

          <div
            className="p-3.5 rounded-lg border"
            style={{ backgroundColor: currentTheme.cardSecondaryHex, borderColor: currentTheme.cardBorderHex }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: currentTheme.textMutedHex }}>
              Blunders / Game
            </div>
            <div className="font-mono font-extrabold text-lg mt-1 tabular-nums text-amber-500">
              {scoutingMetrics.blundersPerGame !== null ? scoutingMetrics.blundersPerGame : '—'}
            </div>
          </div>

          <div
            className="p-3.5 rounded-lg border"
            style={{ backgroundColor: currentTheme.cardSecondaryHex, borderColor: currentTheme.cardBorderHex }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: currentTheme.textMutedHex }}>
              Average Length
            </div>
            <div className="font-mono font-extrabold text-lg mt-1 tabular-nums" style={{ color: currentTheme.textPrimary }}>
              {scoutingMetrics.avgMoves !== null ? `${scoutingMetrics.avgMoves} ply` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Performance Analysis: Real Analyzed Game Phase Accuracy */}
      <div
        className="rounded-xl p-5 border flex flex-col gap-4"
        style={{
          backgroundColor: currentTheme.cardHex,
          borderColor: currentTheme.cardBorderHex
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
            <div>
              <h2 className="font-display text-base font-bold" style={{ color: currentTheme.textPrimary }}>
                Visual Performance Analysis · Phase Accuracy Progression
              </h2>
              <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                Computed accuracy across Opening, Middlegame, and Endgame phases from your analyzed matches
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold tabular-nums">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentTheme.accentHex }} />
              <span style={{ color: currentTheme.textSecondary }}>Opening</span>
              <span style={{ color: currentTheme.textPrimary }}>
                {phaseDeltas.openingCurrent !== null ? `${phaseDeltas.openingCurrent}%` : '—'}
              </span>
              {phaseDeltas.openingDelta !== null && (
                <span style={{ color: phaseDeltas.openingDelta >= 0 ? '#10b981' : '#f43f5e' }}>
                  ({phaseDeltas.openingDelta >= 0 ? `+${phaseDeltas.openingDelta}%` : `${phaseDeltas.openingDelta}%`})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span style={{ color: currentTheme.textSecondary }}>Middlegame</span>
              <span style={{ color: currentTheme.textPrimary }}>
                {phaseDeltas.midCurrent !== null ? `${phaseDeltas.midCurrent}%` : '—'}
              </span>
              {phaseDeltas.midDelta !== null && (
                <span style={{ color: phaseDeltas.midDelta >= 0 ? '#10b981' : '#f43f5e' }}>
                  ({phaseDeltas.midDelta >= 0 ? `+${phaseDeltas.midDelta}%` : `${phaseDeltas.midDelta}%`})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span style={{ color: currentTheme.textSecondary }}>Endgame</span>
              <span style={{ color: currentTheme.textPrimary }}>
                {phaseDeltas.endCurrent !== null ? `${phaseDeltas.endCurrent}%` : '—'}
              </span>
              {phaseDeltas.endDelta !== null && (
                <span style={{ color: phaseDeltas.endDelta >= 0 ? '#10b981' : '#f43f5e' }}>
                  ({phaseDeltas.endDelta >= 0 ? `+${phaseDeltas.endDelta}%` : `${phaseDeltas.endDelta}%`})
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          className="w-full h-[270px] rounded-lg p-3 border"
          style={{
            backgroundColor: currentTheme.cardSecondaryHex,
            borderColor: currentTheme.cardBorderHex
          }}
        >
          {phaseAccuracySeries.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-center px-4">
              <p className="text-xs max-w-md" style={{ color: currentTheme.textSecondary }}>
                Play or import analyzed games to view your real Opening, Middlegame, and Endgame accuracy progression.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={phaseAccuracySeries} margin={{ top: 8, right: 16, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.cardBorderHex} opacity={0.6} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: currentTheme.textMutedHex, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: currentTheme.cardBorderHex }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: currentTheme.textMutedHex, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: currentTheme.cardBorderHex }}
                  tickFormatter={v => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: currentTheme.cardHex,
                    borderColor: currentTheme.cardBorderHex,
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: currentTheme.textPrimary
                  }}
                  formatter={(value: unknown, name: unknown) => [
                    value !== null && value !== undefined ? `${Number(value).toFixed(1)}%` : '—',
                    String(name)
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="opening"
                  name="Opening"
                  stroke={currentTheme.accentHex}
                  strokeWidth={2.5}
                  connectNulls
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="middlegame"
                  name="Middlegame"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  connectNulls
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="endgame"
                  name="Endgame"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  connectNulls
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* DecodeChess-Style Interactive Board Position Decoder */}
      <div
        className="rounded-xl p-5 border flex flex-col gap-4"
        style={{
          backgroundColor: currentTheme.cardHex,
          borderColor: currentTheme.cardBorderHex
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: currentTheme.cardBorderHex }}>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
            <div>
              <h2 className="font-display text-base font-bold" style={{ color: currentTheme.textPrimary }}>
                Interactive Position Decoder (Top 3 Lines + Why)
              </h2>
              <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                Play any move on the board or load a FEN to reveal engine candidate variations and plain-English reasoning.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {DECODER_PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleLoadPreset(preset.fen)}
                className="px-2.5 py-1 rounded-md border text-[11px] font-semibold transition hover:opacity-85"
                style={{
                  backgroundColor:
                    decodeChess.fen().split(' ')[0] === preset.fen.split(' ')[0]
                      ? `${currentTheme.accentHex}20`
                      : currentTheme.cardSecondaryHex,
                  borderColor:
                    decodeChess.fen().split(' ')[0] === preset.fen.split(' ')[0]
                      ? currentTheme.accentHex
                      : currentTheme.cardBorderHex,
                  color:
                    decodeChess.fen().split(' ')[0] === preset.fen.split(' ')[0]
                      ? currentTheme.accentHex
                      : currentTheme.textSecondary
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Interactive Decoder Board */}
          <div className="lg:col-span-6 flex flex-col items-center gap-2.5">
            <div
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-mono font-bold tabular-nums"
              style={{
                maxWidth: boardPlateMaxWidth,
                backgroundColor: currentTheme.cardSecondaryHex,
                borderColor: currentTheme.cardBorderHex
              }}
            >
              <span>{decodeChess.turn() === 'w' ? 'White to move' : 'Black to move'}</span>
              <span style={{ color: currentTheme.accentHex }}>
                Eval {formatEvaluation(staticPosEval)}
              </span>
            </div>

            <ChessBoard
              chess={decodeChess}
              isFlipped={false}
              bestMoveArrow={
                activeDecodedLine
                  ? { from: activeDecodedLine.from, to: activeDecodedLine.to }
                  : null
              }
              onMakeMove={handleDecodeBoardMove}
            />

            {/* Custom FEN Input */}
            <form onSubmit={handleLoadCustomFen} className="w-full flex gap-1.5" style={{ maxWidth: boardPlateMaxWidth }}>
              <input
                type="text"
                value={decodeFenInput}
                onChange={e => setDecodeFenInput(e.target.value)}
                aria-label="Position FEN input"
                placeholder="Paste any FEN to decode..."
                className="flex-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono focus:outline-none"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  borderColor: currentTheme.cardBorderHex,
                  color: currentTheme.textPrimary
                }}
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-90"
                style={{
                  backgroundColor: currentTheme.accentHex,
                  color: currentTheme.accentTextHex
                }}
              >
                Decode
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(DECODER_PRESETS[3].fen)}
                aria-label="Reset decoder board"
                className="p-1.5 rounded-lg border hover:opacity-80"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  borderColor: currentTheme.cardBorderHex
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </form>
            {decodeError && <p className="text-xs text-rose-500">{decodeError}</p>}
          </div>

          {/* Top 3 Lines + Plain-English Explanation */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textMutedHex }}>
              Top Engine Candidate Moves (Click to highlight)
            </div>

            <div className="flex flex-col gap-2">
              {decodedLines.length === 0 ? (
                <div
                  className="p-4 rounded-lg border text-xs"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    borderColor: currentTheme.cardBorderHex,
                    color: currentTheme.textSecondary
                  }}
                >
                  {isDecoding
                    ? 'Analyzing candidate moves…'
                    : 'Game over in this position — no legal candidate moves remain.'}
                </div>
              ) : (
                decodedLines.map((line, idx) => {
                  const isSelected = idx === selectedLineIndex;
                  return (
                    <button
                      key={`${line.san}-${idx}`}
                      type="button"
                      onClick={() => setSelectedLineIndex(idx)}
                      className="text-left p-3.5 rounded-lg border transition flex flex-col gap-1.5"
                      style={{
                        backgroundColor: isSelected
                          ? `${currentTheme.accentHex}14`
                          : currentTheme.cardSecondaryHex,
                        borderColor: isSelected ? currentTheme.accentHex : currentTheme.cardBorderHex
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono font-bold text-xs px-1.5 py-0.5 rounded border"
                            style={{
                              backgroundColor: currentTheme.cardHex,
                              borderColor: currentTheme.cardBorderHex,
                              color: currentTheme.accentHex
                            }}
                          >
                            #{idx + 1}
                          </span>
                          <span className="font-mono font-extrabold text-sm" style={{ color: currentTheme.textPrimary }}>
                            {line.san}
                          </span>
                          <span className="font-mono text-xs" style={{ color: currentTheme.textSecondary }}>
                            Line: {line.pvSan.join(' ')}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-xs tabular-nums" style={{ color: currentTheme.accentHex }}>
                          {line.formattedEval}
                        </span>
                      </div>

                      {isSelected && (
                        <ul className="space-y-1 pt-1.5 border-t text-xs" style={{ borderColor: currentTheme.cardBorderHex, color: currentTheme.textPrimary }}>
                          {line.reasons.map((reason, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <span style={{ color: currentTheme.accentHex }}>·</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grandmaster Assessment Panel */}
      <div
        className="rounded-xl p-6 border flex flex-col gap-5"
        style={{
          backgroundColor: currentTheme.cardHex,
          borderColor: currentTheme.cardBorderHex
        }}
      >
        <div className="flex items-center gap-3.5 pb-4 border-b" style={{ borderColor: currentTheme.cardBorderHex }}>
          <div
            className="w-11 h-11 rounded-lg border p-1.5 flex items-center justify-center shrink-0"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              borderColor: currentTheme.cardBorderHex
            }}
          >
            <ChessPieceIcon type="k" color="w" set={pieceSet} />
          </div>
          <div>
            <h2 className="font-display text-base font-bold" style={{ color: currentTheme.textPrimary }}>
              Grandmaster Mikhail&apos;s Briefing
            </h2>
            <p className="text-xs font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>
              Profile: {profile.username} · {profile.ratings.rapid} Rapid Elo · {profile.ratings.puzzles} Puzzles
            </p>
          </div>
        </div>

        {coachError && (
          <div className="p-3.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span style={{ color: currentTheme.textPrimary }}>{coachError}</span>
            </div>
            <button
              type="button"
              onClick={handleUseOfflineCoach}
              disabled={loadingOfflineCoach}
              className="px-3 py-1.5 rounded-lg border font-bold text-xs transition hover:opacity-85 disabled:opacity-50 whitespace-nowrap"
              style={{
                backgroundColor: currentTheme.cardHex,
                borderColor: currentTheme.cardBorderHex,
                color: currentTheme.accentHex
              }}
            >
              {loadingOfflineCoach ? 'Loading...' : 'Use Offline Coach Report'}
            </button>
          </div>
        )}

        {apiNotice && (
          <div
            className="text-xs px-3.5 py-2.5 rounded-lg border"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              borderColor: currentTheme.cardBorderHex,
              color: currentTheme.textMutedHex
            }}
          >
            {apiNotice}
          </div>
        )}

        <p
          className="text-sm leading-relaxed p-4 rounded-lg border"
          style={{
            backgroundColor: currentTheme.cardSecondaryHex,
            borderColor: currentTheme.cardBorderHex,
            color: currentTheme.textPrimary
          }}
        >
          &ldquo;{coachResponse.coachSummary}&rdquo;
        </p>

        {/* Strengths & Improvement Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-lg p-4 border flex flex-col gap-2.5"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              borderColor: currentTheme.cardBorderHex
            }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: currentTheme.accentHex }}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Demonstrated Strengths</span>
            </h3>
            <ul className="space-y-1.5 text-xs" style={{ color: currentTheme.textPrimary }}>
              {coachResponse.keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span style={{ color: currentTheme.accentHex }}>·</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-lg p-4 border flex flex-col gap-2.5"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              borderColor: currentTheme.cardBorderHex
            }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Priority Focus Areas</span>
            </h3>
            <ul className="space-y-1.5 text-xs" style={{ color: currentTheme.textPrimary }}>
              {coachResponse.areasForImprovement.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500">·</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Takeaway & Opening Advice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: `${currentTheme.accentHex}10`,
              borderColor: `${currentTheme.accentHex}35`
            }}
          >
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5" style={{ color: currentTheme.accentHex }}>
              <Compass className="w-4 h-4" />
              <span>Tactical Principle</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: currentTheme.textPrimary }}>
              {coachResponse.tacticalTakeaway}
            </p>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              borderColor: currentTheme.cardBorderHex
            }}
          >
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5 text-sky-500">
              <BookOpen className="w-4 h-4" />
              <span>Opening Structure</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: currentTheme.textPrimary }}>
              {coachResponse.openingTip}
            </p>
          </div>
        </div>

        {/* Recommended Drill CTA */}
        {coachResponse.suggestedPuzzlesCategory && onStartRecommendedPuzzles && (
          <div
            className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              borderColor: currentTheme.cardBorderHex
            }}
          >
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: currentTheme.textPrimary }}>
                <Target className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
                <span>Recommended Drill: {coachResponse.suggestedPuzzlesCategory}</span>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: currentTheme.textMutedHex }}>
                Focused pattern recognition yields the fastest tactical rating gain.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onStartRecommendedPuzzles(coachResponse.suggestedPuzzlesCategory)}
              className="px-4 py-2 rounded-lg font-bold text-xs transition whitespace-nowrap hover:opacity-90"
              style={{
                backgroundColor: currentTheme.accentHex,
                color: currentTheme.accentTextHex
              }}
            >
              Start Drills
            </button>
          </div>
        )}

        {/* Training Goal + Quick-Ask Study Topics + Custom Coach Input */}
        <div className="flex flex-col gap-3 pt-3 border-t" style={{ borderColor: currentTheme.cardBorderHex }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label
              htmlFor="coach-training-goal"
              className="text-[11px] font-bold uppercase tracking-wider shrink-0"
              style={{ color: currentTheme.textMutedHex }}
            >
              Training Goal
            </label>
            <input
              id="coach-training-goal"
              type="text"
              value={userGoal}
              onChange={e => setUserGoal(e.target.value)}
              placeholder="e.g. Master endgame king opposition and stop hanging pieces"
              className="flex-1 px-3 py-1.5 rounded-lg border text-xs focus:outline-none"
              style={{
                backgroundColor: currentTheme.cardSecondaryHex,
                borderColor: currentTheme.cardBorderHex,
                color: currentTheme.textPrimary
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_ASK_PROMPTS.map(prompt => (
              <button
                key={prompt}
                type="button"
                disabled={isLoading}
                onClick={() => submitCoachQuery(prompt)}
                className="px-2.5 py-1 rounded-md border text-[11px] font-semibold transition hover:opacity-85 disabled:opacity-50"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  borderColor: currentTheme.cardBorderHex,
                  color: currentTheme.textSecondary
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleAskCoach} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask for tailored study advice (e.g. 'How do I convert rook endgames?')"
              value={customQuestion}
              onChange={e => setCustomQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg border text-xs focus:outline-none"
              style={{
                backgroundColor: currentTheme.cardSecondaryHex,
                borderColor: currentTheme.cardBorderHex,
                color: currentTheme.textPrimary
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-bold text-xs transition hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: currentTheme.accentHex,
                color: currentTheme.accentTextHex
              }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Ask Coach</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
