import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import confetti from 'canvas-confetti';
import { Puzzle, PuzzleCategory, MoveClassification } from '../types/chess';
import {
  PUZZLE_DATABASE,
  PUZZLE_CATEGORIES,
  PuzzleDifficultyBand,
  getFilteredPuzzle,
  getPuzzleRushSequence,
  normalizePuzzleCategory,
  calculatePuzzleRatingChange,
  fetchDailyLichessPuzzle
} from '../engine/puzzles';
import { decodeMoveReasons, evaluateBoard, formatEvaluation } from '../engine/chessEngine';
import { ChessBoard, getBoardMaxWidthPx } from './ChessBoard';
import { MoveClassificationBadge, CLASSIFICATION_META } from './MoveClassificationBadge';
import { hasOpenModalDialog, isEditableEventTarget } from '../engine/keyboardShortcuts';
import { sounds } from '../utils/sound';
import {
  Flame,
  Lightbulb,
  RotateCcw,
  ArrowRight,
  Trophy,
  Target,
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
  Clock,
  Sparkles,
  Search,
  Calendar,
  Bot,
  Check
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { getCachedDailyPuzzle } from '../engine/puzzles';
import {
  DailyStreakSummary,
  computeDailyPuzzleStreak,
  loadDailyPuzzleStreakState,
  recordPuzzleSolvedToday
} from '../engine/dailyPuzzleStreak';
import { PROGRESS_EVENT } from '../engine/progressEvents';

type PuzzleArenaMode = 'adaptive' | 'rush' | 'review';
type RushVariant = '3min' | '5min' | 'survival';

const REVIEW_QUEUE_STORAGE_KEY = 'chess_puzzle_review_queue_v1';
const RUSH_BEST_STORAGE_KEY = 'chess_puzzle_rush_best_v1';

interface PuzzlesViewProps {
  userPuzzleElo: number;
  initialTheme?: string;
  initialDailyRequestKey?: number;
  onRatingChange: (newElo: number, solved?: boolean) => void;
}

export const PuzzlesView: React.FC<PuzzlesViewProps> = ({
  userPuzzleElo,
  initialTheme,
  initialDailyRequestKey,
  onRatingChange
}) => {
  const { theme: currentTheme, settings: appSettings } = useAppTheme();
  const boardPlateMaxWidth = `${getBoardMaxWidthPx(appSettings.boardSize)}px`;

  // Persistent Spaced Review Queue (Chessable MoveTrainer style)
  const [reviewQueueIds, setReviewQueueIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEW_QUEUE_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : ['puz-12', 'puz-23'];
    } catch {
      return ['puz-12', 'puz-23'];
    }
  });

  // Persistent Rush Best
  const [rushBest, setRushBest] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(RUSH_BEST_STORAGE_KEY);
      return saved ? Number(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(REVIEW_QUEUE_STORAGE_KEY, JSON.stringify(reviewQueueIds));
    } catch {
      // ignore storage errors
    }
  }, [reviewQueueIds]);

  const [mode, setMode] = useState<PuzzleArenaMode>('adaptive');
  const [selectedCategory, setSelectedCategory] = useState<PuzzleCategory>(() =>
    normalizePuzzleCategory(initialTheme)
  );
  const [difficultyBand, setDifficultyBand] = useState<PuzzleDifficultyBand>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingDaily, setLoadingDaily] = useState<boolean>(false);
  const [isDailyActive, setIsDailyActive] = useState<boolean>(() => Boolean(initialDailyRequestKey && initialDailyRequestKey > 0));
  const [dailyStreak, setDailyStreak] = useState<DailyStreakSummary>(() =>
    computeDailyPuzzleStreak(loadDailyPuzzleStreakState())
  );
  const lastDailyRequestRef = useRef<number>(0);

  useEffect(() => {
    const syncStreak = () => setDailyStreak(computeDailyPuzzleStreak(loadDailyPuzzleStreakState()));
    window.addEventListener(PROGRESS_EVENT, syncStreak);
    return () => window.removeEventListener(PROGRESS_EVENT, syncStreak);
  }, []);

  useEffect(() => {
    if (initialTheme) {
      setSelectedCategory(normalizePuzzleCategory(initialTheme));
      setMode('adaptive');
      setIsDailyActive(false);
    }
  }, [initialTheme]);

  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(() =>
    initialDailyRequestKey && initialDailyRequestKey > 0
      ? getCachedDailyPuzzle()
      : getFilteredPuzzle(userPuzzleElo, normalizePuzzleCategory(initialTheme), 'all', [])
  );
  const [chess, setChess] = useState<Chess>(() => new Chess(currentPuzzle.fen));
  const [moveIndex, setMoveIndex] = useState<number>(0);
  const [status, setStatus] = useState<'solving' | 'solved' | 'failed'>('solving');
  const [streak, setStreak] = useState<number>(0);
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [ratingDelta, setRatingDelta] = useState<number | null>(null);

  // Puzzle Rush (Chess.com 3:00 Blitz, 5:00 Endurance, and untimed Survival) states
  const [rushVariant, setRushVariant] = useState<RushVariant>('3min');
  const [rushActive, setRushActive] = useState<boolean>(false);
  const [rushFinished, setRushFinished] = useState<boolean>(false);
  const [rushSecondsLeft, setRushSecondsLeft] = useState<number>(180);
  const [rushStrikes, setRushStrikes] = useState<number>(0);
  const [rushScore, setRushScore] = useState<number>(0);
  const [rushSequence, setRushSequence] = useState<Puzzle[]>(() => getPuzzleRushSequence());
  const [rushIndex, setRushIndex] = useState<number>(0);
  const rushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Post-solve / Post-fail Interactive Solution Replay & Move Classification Badges
  const [replayPly, setReplayPly] = useState<number | null>(null);
  const [boardBadge, setBoardBadge] = useState<{ square: Square; type: MoveClassification } | null>(null);
  const [autoNext, setAutoNext] = useState<boolean>(false);
  const [coachNote, setCoachNote] = useState<{
    headline: string;
    whyMoveWorkedOrFailed: string;
    bestMoveIdea: string;
    coachTip: string;
    source: 'gemini' | 'local';
  } | null>(null);
  const [loadingCoachNote, setLoadingCoachNote] = useState<boolean>(false);
  const [coachNoteError, setCoachNoteError] = useState<string | null>(null);
  const [loadingCoachOffline, setLoadingCoachOffline] = useState<boolean>(false);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const puzzleGenRef = useRef<number>(0);

  const clearPendingTimeouts = () => {
    for (const id of timeoutsRef.current) clearTimeout(id);
    timeoutsRef.current = [];
  };

  const scheduleTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter(t => t !== id);
      fn();
    }, ms);
    timeoutsRef.current.push(id);
  };

  useEffect(() => () => clearPendingTimeouts(), []);

  useEffect(() => {
    const newChess = new Chess(currentPuzzle.fen);
    setChess(newChess);
    setMoveIndex(0);
    setStatus('solving');
    setHintLevel(0);
    setRatingDelta(null);
    setReplayPly(null);
    setBoardBadge(null);
    setCoachNote(null);
    setLoadingCoachNote(false);
    setCoachNoteError(null);
    setLoadingCoachOffline(false);
  }, [currentPuzzle]);

  // Puzzle Rush countdown timer (paused/omitted in Survival mode)
  useEffect(() => {
    if (mode !== 'rush' || rushVariant === 'survival' || !rushActive || rushFinished) {
      if (rushTimerRef.current) clearInterval(rushTimerRef.current);
      return;
    }

    rushTimerRef.current = setInterval(() => {
      setRushSecondsLeft(prev => {
        if (prev <= 1) {
          setRushActive(false);
          setRushFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (rushTimerRef.current) clearInterval(rushTimerRef.current);
    };
  }, [mode, rushVariant, rushActive, rushFinished]);

  useEffect(() => {
    if (rushScore > rushBest) {
      setRushBest(rushScore);
      try {
        localStorage.setItem(RUSH_BEST_STORAGE_KEY, String(rushScore));
      } catch {
        // ignore
      }
    }
  }, [rushScore, rushBest]);

  const startRushRun = (overrideVariant?: RushVariant) => {
    clearPendingTimeouts();
    puzzleGenRef.current += 1;
    setIsDailyActive(false);
    const activeRushVariant = overrideVariant || rushVariant;
    setRushVariant(activeRushVariant);
    const seq = getPuzzleRushSequence();
    setRushSequence(seq);
    setRushIndex(0);
    setRushScore(0);
    setRushStrikes(0);
    setRushSecondsLeft(activeRushVariant === '5min' ? 300 : activeRushVariant === '3min' ? 180 : 0);
    setRushFinished(false);
    setRushActive(true);
    setMode('rush');
    setCurrentPuzzle(seq[0]);
  };

  const switchMode = (nextMode: PuzzleArenaMode) => {
    clearPendingTimeouts();
    puzzleGenRef.current += 1;
    setMode(nextMode);
    setIsDailyActive(false);
    setRushActive(false);
    setRushFinished(false);

    if (nextMode === 'rush') {
      startRushRun();
      return;
    }

    if (nextMode === 'review') {
      const firstId = reviewQueueIds[0];
      const match = PUZZLE_DATABASE.find(p => p.id === firstId) || PUZZLE_DATABASE[0];
      setCurrentPuzzle(match);
      return;
    }

    setCurrentPuzzle(getFilteredPuzzle(userPuzzleElo, selectedCategory, difficultyBand, solvedIds, undefined, searchQuery));
  };

  const handleCategoryChange = (cat: PuzzleCategory) => {
    clearPendingTimeouts();
    puzzleGenRef.current += 1;
    setIsDailyActive(false);
    setSelectedCategory(cat);
    if (mode === 'adaptive') {
      setCurrentPuzzle(getFilteredPuzzle(userPuzzleElo, cat, difficultyBand, solvedIds, currentPuzzle.id, searchQuery));
    }
  };

  const handleDifficultyChange = (band: PuzzleDifficultyBand) => {
    clearPendingTimeouts();
    puzzleGenRef.current += 1;
    setIsDailyActive(false);
    setDifficultyBand(band);
    if (mode === 'adaptive') {
      setCurrentPuzzle(getFilteredPuzzle(userPuzzleElo, selectedCategory, band, solvedIds, currentPuzzle.id, searchQuery));
    }
  };

  const handleSearchChange = (q: string) => {
    clearPendingTimeouts();
    puzzleGenRef.current += 1;
    setIsDailyActive(false);
    setSearchQuery(q);
    if (mode === 'adaptive') {
      setCurrentPuzzle(getFilteredPuzzle(userPuzzleElo, selectedCategory, difficultyBand, solvedIds, currentPuzzle.id, q));
    }
  };

  const handleLoadDailyChallenge = async () => {
    clearPendingTimeouts();
    const gen = ++puzzleGenRef.current;
    setLoadingDaily(true);
    setIsDailyActive(true);
    setMode('adaptive');
    setRushActive(false);
    setRushFinished(false);
    const cached = getCachedDailyPuzzle();
    setCurrentPuzzle(prev => (prev.id === cached.id && prev.fen === cached.fen ? prev : cached));
    try {
      const daily = await fetchDailyLichessPuzzle();
      if (gen !== puzzleGenRef.current) return;
      setCurrentPuzzle(prev => (prev.id === daily.id && prev.fen === daily.fen ? prev : daily));
    } finally {
      if (gen === puzzleGenRef.current) {
        setLoadingDaily(false);
      }
    }
  };

  useEffect(() => {
    if (initialDailyRequestKey && initialDailyRequestKey > 0 && initialDailyRequestKey !== lastDailyRequestRef.current) {
      lastDailyRequestRef.current = initialDailyRequestKey;
      handleLoadDailyChallenge();
    }
  }, [initialDailyRequestKey]);

  const handleMakeMove = ({
    from,
    to,
    promotion = 'q'
  }: {
    from: Square;
    to: Square;
    promotion?: string;
  }) => {
    if (status !== 'solving') return;
    if (mode === 'rush' && (!rushActive || rushFinished)) return;

    const uciAttempt = `${from}${to}`;
    const expectedMove = currentPuzzle.moves[moveIndex];
    const expectedPromo = expectedMove.length > 4 ? expectedMove[4] : promotion;

    if (uciAttempt.toLowerCase() === expectedMove.toLowerCase().slice(0, 4)) {
      const nextChess = new Chess(chess.fen());
      nextChess.move({ from, to, promotion: expectedPromo });
      const stepClass: MoveClassification = solutionStates.steps[moveIndex]?.classification || 'best';
      setChess(nextChess);
      setBoardBadge({ square: to, type: stepClass });
      sounds.playMove();

      const nextMoveIndex = moveIndex + 1;
      if (nextMoveIndex >= currentPuzzle.moves.length) {
        if (mode === 'rush') {
          sounds.playPuzzleSuccess();
          setRushScore(s => s + 1);
          const updated = recordPuzzleSolvedToday({ isDailyChallenge: false });
          setDailyStreak(computeDailyPuzzleStreak(updated));
          const nextIdx = rushIndex + 1;
          if (nextIdx >= rushSequence.length) {
            setRushActive(false);
            setRushFinished(true);
            setStatus('solved');
          } else {
            const gen = puzzleGenRef.current;
            setRushIndex(nextIdx);
            scheduleTimeout(() => {
              if (gen !== puzzleGenRef.current) return;
              setCurrentPuzzle(rushSequence[nextIdx]);
            }, 220);
          }
          return;
        }

        setStatus('solved');
        sounds.playPuzzleSuccess();
        const delta = calculatePuzzleRatingChange(userPuzzleElo, currentPuzzle.rating, true);
        setRatingDelta(delta);
        onRatingChange(userPuzzleElo + delta, true);
        setStreak(prev => prev + 1);
        setSolvedIds(prev => (prev.includes(currentPuzzle.id) ? prev : [...prev, currentPuzzle.id]));
        const nextDailyState = recordPuzzleSolvedToday({ isDailyChallenge: isDailyActive });
        setDailyStreak(computeDailyPuzzleStreak(nextDailyState));

        // Spaced Review: clean solve without hint removes puzzle from review deck!
        if (hintLevel === 0) {
          setReviewQueueIds(prev => prev.filter(id => id !== currentPuzzle.id));
        }

        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#10b981', '#3b82f6', '#f59e0b']
          });
        } catch {
          // ignore
        }
      } else {
        const gen = puzzleGenRef.current;
        setMoveIndex(nextMoveIndex);
        scheduleTimeout(() => {
          if (gen !== puzzleGenRef.current) return;
          const oppUci = currentPuzzle.moves[nextMoveIndex];
          const oppFrom = oppUci.slice(0, 2) as Square;
          const oppTo = oppUci.slice(2, 4) as Square;
          const oppPromo = oppUci.length > 4 ? oppUci[4] : undefined;
          const oppChess = new Chess(nextChess.fen());
          oppChess.move({ from: oppFrom, to: oppTo, promotion: oppPromo });
          setChess(oppChess);
          setBoardBadge(null);
          sounds.playMove();
          setMoveIndex(nextMoveIndex + 1);
        }, 280);
      }
    } else {
      sounds.playBlunder();
      setBoardBadge({ square: to, type: 'blunder' });

      // Add missed puzzle into Chessable-style Spaced Review Queue
      setReviewQueueIds(prev =>
        prev.includes(currentPuzzle.id) ? prev : [...prev, currentPuzzle.id]
      );

      if (mode === 'rush') {
        const nextStrikes = rushStrikes + 1;
        setRushStrikes(nextStrikes);
        if (nextStrikes >= 3) {
          setRushActive(false);
          setRushFinished(true);
          setStatus('failed');
        } else {
          const nextIdx = rushIndex + 1;
          if (nextIdx >= rushSequence.length) {
            setRushActive(false);
            setRushFinished(true);
          } else {
            const gen = puzzleGenRef.current;
            setRushIndex(nextIdx);
            scheduleTimeout(() => {
              if (gen !== puzzleGenRef.current) return;
              setCurrentPuzzle(rushSequence[nextIdx]);
            }, 220);
          }
        }
        return;
      }

      setStatus('failed');
      const delta = calculatePuzzleRatingChange(userPuzzleElo, currentPuzzle.rating, false);
      setRatingDelta(delta);
      onRatingChange(userPuzzleElo + delta, false);
      setStreak(0);
    }
  };

  const handleNextPuzzle = () => {
    clearPendingTimeouts();
    puzzleGenRef.current += 1;
    setIsDailyActive(false);
    if (mode === 'review') {
      const remaining = reviewQueueIds.filter(id => id !== currentPuzzle.id);
      if (remaining.length > 0) {
        const nextPuz = PUZZLE_DATABASE.find(p => p.id === remaining[0]) || PUZZLE_DATABASE[0];
        setCurrentPuzzle(nextPuz);
        return;
      }
      if (reviewQueueIds.length > 0) {
        const nextPuz = PUZZLE_DATABASE.find(p => p.id === reviewQueueIds[0]) || PUZZLE_DATABASE[0];
        setCurrentPuzzle(nextPuz);
        return;
      }
      setMode('adaptive');
    }

    const nextPuz = getFilteredPuzzle(
      userPuzzleElo,
      selectedCategory,
      difficultyBand,
      solvedIds,
      currentPuzzle.id,
      searchQuery
    );
    setCurrentPuzzle(nextPuz);
  };

  const handleRetry = () => {
    clearPendingTimeouts();
    puzzleGenRef.current += 1;
    setChess(new Chess(currentPuzzle.fen));
    setMoveIndex(0);
    setStatus('solving');
    setRatingDelta(null);
    setReplayPly(null);
    setBoardBadge(null);
    setCoachNote(null);
    setCoachNoteError(null);
  };

  // Interactive Post-Puzzle Solution Stepper with per-move classifications
  const solutionStates = useMemo(() => {
    const startBoard = new Chess(currentPuzzle.fen);
    const steps: {
      chess: Chess;
      san: string;
      from: Square;
      to: Square;
      classification: MoveClassification;
    }[] = [];
    const cursor = new Chess(currentPuzzle.fen);
    const PIECE_WTS: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

    for (let idx = 0; idx < currentPuzzle.moves.length; idx++) {
      const uci = currentPuzzle.moves[idx];
      const from = uci.slice(0, 2) as Square;
      const to = uci.slice(2, 4) as Square;
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const move = cursor.move({ from, to, promotion });
      if (move) {
        const isPlayerMove = idx % 2 === 0;
        const oppColor = move.color === 'w' ? 'b' : 'w';
        const movedVal = PIECE_WTS[move.piece] || 0;
        const capVal = move.captured ? PIECE_WTS[move.captured] || 0 : 0;
        const riskyDrop =
          movedVal >= 3 &&
          cursor.attackers(to, oppColor).length > cursor.attackers(to, move.color).length;
        const isSac = (Boolean(move.captured) && movedVal > capVal + 1) || riskyDrop;

        let classification: MoveClassification;
        if (!isPlayerMove) {
          classification = cursor.inCheck() ? 'best' : 'good';
        } else if (cursor.isCheckmate() || isSac) {
          classification = 'brilliant';
        } else if (idx === 0 || cursor.inCheck() || capVal >= movedVal) {
          classification = 'great';
        } else {
          classification = 'best';
        }

        steps.push({ chess: new Chess(cursor.fen()), san: move.san, from, to, classification });
      }
    }
    return { startBoard, steps };
  }, [currentPuzzle]);

  // Auto-advance timer when enabled in adaptive mode
  useEffect(() => {
    if (!autoNext || status !== 'solved' || mode !== 'adaptive' || rushFinished) return;
    const t = setTimeout(() => {
      handleNextPuzzle();
    }, 1100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoNext, status, mode, rushFinished, currentPuzzle.id]);

  // Compute plain-English tactical explanation for key first move
  const tacticalBreakdown = useMemo(() => {
    const startBoard = new Chess(currentPuzzle.fen);
    const firstUci = currentPuzzle.moves[0];
    if (!firstUci) return { reasons: [], evalLabel: '0.0', keySan: '', evalBeforeCp: 0, evalAfterCp: 0 };
    const evalBeforeCp = evaluateBoard(startBoard);
    const sim = new Chess(currentPuzzle.fen);
    const m = sim.move({
      from: firstUci.slice(0, 2) as Square,
      to: firstUci.slice(2, 4) as Square,
      promotion: firstUci.length > 4 ? firstUci[4] : undefined
    });
    if (!m) return { reasons: [], evalLabel: '0.0', keySan: '', evalBeforeCp, evalAfterCp: evalBeforeCp };
    const cp = evaluateBoard(sim);
    return {
      keySan: m.san,
      evalLabel: formatEvaluation(cp),
      evalBeforeCp,
      evalAfterCp: cp,
      reasons: decodeMoveReasons(startBoard, m, cp)
    };
  }, [currentPuzzle]);

  const handleAskCoachWhy = async () => {
    if (loadingCoachNote) return;
    const gen = puzzleGenRef.current;
    setLoadingCoachNote(true);
    setCoachNoteError(null);
    try {
      const primaryClass: MoveClassification =
        status === 'failed'
          ? 'blunder'
          : solutionStates.steps[0]?.classification || 'great';
      const res = await fetch('/api/coach/explain-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fenBefore: currentPuzzle.fen,
          fenAfter: solutionStates.steps[0]?.chess.fen(),
          playedSan: tacticalBreakdown.keySan,
          bestSan: tacticalBreakdown.keySan,
          classification: primaryClass,
          evalBeforeCp: tacticalBreakdown.evalBeforeCp,
          evalAfterCp: tacticalBreakdown.evalAfterCp,
          pvSan: solutionStates.steps.map(s => s.san),
          playerColor: currentPuzzle.playerColor,
          userQuestion: `Explain the tactical motif (${currentPuzzle.category || currentPuzzle.theme}) in this ${currentPuzzle.rating}-rated puzzle.`
        })
      });
      if (gen !== puzzleGenRef.current) return;
      if (res.ok) {
        const data = await res.json();
        setCoachNote(data);
      } else {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        setCoachNoteError(errData.error || `Cloud Coach unavailable (HTTP ${res.status}).`);
      }
    } catch {
      if (gen === puzzleGenRef.current) {
        setCoachNoteError('Network error: could not reach Cloud Coach.');
      }
    } finally {
      if (gen === puzzleGenRef.current) {
        setLoadingCoachNote(false);
      }
    }
  };

  const handleUseLocalCoachBreakdown = async () => {
    if (loadingCoachOffline) return;
    const gen = puzzleGenRef.current;
    setLoadingCoachOffline(true);
    try {
      const primaryClass: MoveClassification =
        status === 'failed'
          ? 'blunder'
          : solutionStates.steps[0]?.classification || 'great';
      const res = await fetch('/api/coach/offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'move',
          playedSan: tacticalBreakdown.keySan,
          bestSan: tacticalBreakdown.keySan,
          classification: primaryClass,
          evalBeforeCp: tacticalBreakdown.evalBeforeCp,
          evalAfterCp: tacticalBreakdown.evalAfterCp,
          pvSan: solutionStates.steps.map(s => s.san)
        })
      });
      if (gen !== puzzleGenRef.current) return;
      if (res.ok) {
        const data = await res.json();
        setCoachNote(data);
        setCoachNoteError(null);
      } else {
        setCoachNote({
          headline: `${tacticalBreakdown.keySan} launches the ${currentPuzzle.theme || 'tactical'} sequence`,
          whyMoveWorkedOrFailed: tacticalBreakdown.reasons[0] || currentPuzzle.description,
          bestMoveIdea: `Winning continuation: ${solutionStates.steps.map(s => s.san).join(' ')}.`,
          coachTip: 'Always scan checks, captures, and undefended pieces before committing.',
          source: 'local'
        });
        setCoachNoteError(null);
      }
    } catch {
      if (gen === puzzleGenRef.current) {
        setCoachNote({
          headline: `${tacticalBreakdown.keySan} launches the ${currentPuzzle.theme || 'tactical'} sequence`,
          whyMoveWorkedOrFailed: tacticalBreakdown.reasons[0] || currentPuzzle.description,
          bestMoveIdea: `Winning continuation: ${solutionStates.steps.map(s => s.san).join(' ')}.`,
          coachTip: 'Always scan checks, captures, and undefended pieces before committing.',
          source: 'local'
        });
        setCoachNoteError(null);
      }
    } finally {
      if (gen === puzzleGenRef.current) {
        setLoadingCoachOffline(false);
      }
    }
  };

  const stepToPly = (targetPly: number) => {
    const clamped = Math.max(0, Math.min(solutionStates.steps.length, targetPly));
    setReplayPly(clamped);
    if (clamped === 0) {
      setChess(new Chess(currentPuzzle.fen));
    } else {
      setChess(new Chess(solutionStates.steps[clamped - 1].chess.fen()));
    }
  };

  // Keyboard shortcuts for puzzle solving & post-solve solution stepping
  const puzzleKeyRef = useRef<(e: KeyboardEvent) => void>(() => {});
  puzzleKeyRef.current = (e: KeyboardEvent) => {
    if (isEditableEventTarget(e.target) || hasOpenModalDialog()) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const lower = e.key.toLowerCase();
    if (lower === 'h' && status === 'solving' && mode !== 'rush') {
      e.preventDefault();
      setHintLevel(prev => Math.min(2, prev + 1));
      return;
    }
    if (lower === 'r' && status === 'failed' && mode !== 'rush') {
      e.preventDefault();
      handleRetry();
      return;
    }
    if (lower === 'n' && (status === 'solved' || status === 'failed') && !rushFinished) {
      e.preventDefault();
      handleNextPuzzle();
      return;
    }

    if (status === 'solving') return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const cur = replayPly ?? solutionStates.steps.length;
      const next = Math.max(0, cur - 1);
      setReplayPly(next);
      setChess(new Chess(next === 0 ? currentPuzzle.fen : solutionStates.steps[next - 1].chess.fen()));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const cur = replayPly ?? 0;
      const next = Math.min(solutionStates.steps.length, cur + 1);
      setReplayPly(next);
      setChess(new Chess(next === 0 ? currentPuzzle.fen : solutionStates.steps[next - 1].chess.fen()));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setReplayPly(0);
      setChess(new Chess(currentPuzzle.fen));
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = solutionStates.steps.length;
      setReplayPly(last);
      setChess(new Chess(last === 0 ? currentPuzzle.fen : solutionStates.steps[last - 1].chess.fen()));
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => puzzleKeyRef.current(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const activeBoardBadge = useMemo(() => {
    if (replayPly !== null && replayPly > 0) {
      const step = solutionStates.steps[replayPly - 1];
      return step ? { square: step.to, type: step.classification } : null;
    }
    return boardBadge;
  }, [replayPly, solutionStates.steps, boardBadge]);

  const getBoardArrow = () => {
    if (replayPly !== null && replayPly > 0) {
      const s = solutionStates.steps[replayPly - 1];
      return s ? { from: s.from, to: s.to } : null;
    }
    if (hintLevel === 0 || status !== 'solving') return null;
    const nextExpected = currentPuzzle.moves[moveIndex];
    if (!nextExpected) return null;
    const from = nextExpected.slice(0, 2) as Square;
    const to = nextExpected.slice(2, 4) as Square;
    if (hintLevel === 1) return { from, to: from };
    return { from, to };
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto px-3 sm:px-6 py-4" style={{ color: currentTheme.textPrimary }}>
      {/* Header + Telemetry */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl border"
        style={{
          backgroundColor: currentTheme.cardHex,
          borderColor: currentTheme.cardBorderHex
        }}
      >
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: currentTheme.textPrimary }}>
            Tactical Training & Puzzle Rush
          </h1>
          <p className="text-xs sm:text-sm mt-0.5 tabular-nums" style={{ color: currentTheme.textSecondary }}>
            {PUZZLE_DATABASE.length.toLocaleString()} verified Lichess & tactical puzzles · Adaptive Elo · 3-min, 5-min &amp; Survival Rush
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-xs font-bold tabular-nums">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span style={{ color: currentTheme.textMutedHex }}>Rating</span>
            <span className="text-sm" style={{ color: currentTheme.textPrimary }}>{userPuzzleElo}</span>
          </div>
          <span style={{ color: currentTheme.cardBorderHex }}>|</span>
          <div
            className="flex items-center gap-1.5"
            title={
              dailyStreak.solvedToday
                ? `Solved today · Best daily streak: ${dailyStreak.bestStreak} days`
                : 'Solve at least 1 puzzle today to extend your daily streak'
            }
          >
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span style={{ color: currentTheme.textMutedHex }}>Daily</span>
            <span className="text-sm" style={{ color: dailyStreak.solvedToday ? '#10b981' : currentTheme.textPrimary }}>
              {dailyStreak.currentStreak}d
            </span>
          </div>
          <span style={{ color: currentTheme.cardBorderHex }}>|</span>
          <div className="flex items-center gap-1.5" title="Consecutive solves in this session">
            <Flame className="w-4 h-4 text-orange-500" />
            <span style={{ color: currentTheme.textMutedHex }}>Session</span>
            <span className="text-sm text-orange-500">{streak}</span>
          </div>
          <span style={{ color: currentTheme.cardBorderHex }}>|</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
            <span style={{ color: currentTheme.textMutedHex }}>Rush Best</span>
            <span className="text-sm" style={{ color: currentTheme.accentHex }}>{rushBest}</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher + Theme Filters */}
      <div
        className="rounded-xl p-3.5 border flex flex-col gap-3"
        style={{
          backgroundColor: currentTheme.cardHex,
          borderColor: currentTheme.cardBorderHex
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg border"
              style={{
                backgroundColor: currentTheme.cardSecondaryHex,
                borderColor: currentTheme.cardBorderHex
              }}
            >
              <button
                type="button"
                onClick={() => switchMode('adaptive')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition"
                style={{
                  backgroundColor: mode === 'adaptive' ? currentTheme.accentHex : 'transparent',
                  color: mode === 'adaptive' ? currentTheme.accentTextHex : currentTheme.textSecondary
                }}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Adaptive Rated</span>
              </button>

              <button
                type="button"
                onClick={() => switchMode('rush')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap"
                style={{
                  backgroundColor: mode === 'rush' ? currentTheme.accentHex : 'transparent',
                  color: mode === 'rush' ? currentTheme.accentTextHex : currentTheme.textSecondary
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Puzzle Rush</span>
              </button>

              <button
                type="button"
                onClick={() => switchMode('review')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition"
                style={{
                  backgroundColor: mode === 'review' ? currentTheme.accentHex : 'transparent',
                  color: mode === 'review' ? currentTheme.accentTextHex : currentTheme.textSecondary
                }}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Spaced Review ({reviewQueueIds.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleLoadDailyChallenge}
              disabled={loadingDaily}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold transition hover:opacity-85 disabled:opacity-50"
              style={{
                backgroundColor: isDailyActive ? `${currentTheme.accentHex}20` : currentTheme.cardSecondaryHex,
                borderColor: isDailyActive ? currentTheme.accentHex : currentTheme.cardBorderHex,
                color: currentTheme.accentHex
              }}
            >
              {dailyStreak.dailyChallengeSolvedToday ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Calendar className="w-3.5 h-3.5" />
              )}
              <span>
                {loadingDaily
                  ? 'Loading...'
                  : dailyStreak.dailyChallengeSolvedToday
                  ? 'Daily Challenge ✓'
                  : 'Daily Challenge'}
              </span>
            </button>
          </div>

          {/* Search + Difficulty Band Filter */}
          {mode === 'adaptive' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: currentTheme.textMutedHex }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Search motif or opening..."
                  aria-label="Search puzzles by motif"
                  className="pl-8 pr-2.5 py-1.5 rounded-lg border text-xs w-44 sm:w-52 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    borderColor: currentTheme.cardBorderHex,
                    color: currentTheme.textPrimary
                  }}
                />
              </div>

              <label className="flex items-center gap-2 text-xs">
                <span className="font-semibold" style={{ color: currentTheme.textSecondary }}>Level</span>
                <select
                  value={difficultyBand}
                  onChange={e => handleDifficultyChange(e.target.value as PuzzleDifficultyBand)}
                  aria-label="Filter puzzle difficulty"
                  className="px-2.5 py-1.5 rounded-lg border font-semibold text-xs focus:outline-none cursor-pointer"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    borderColor: currentTheme.cardBorderHex,
                    color: currentTheme.textPrimary
                  }}
                >
                  <option value="all" style={{ backgroundColor: currentTheme.cardHex }}>All Ratings ({PUZZLE_DATABASE.length})</option>
                  <option value="beginner" style={{ backgroundColor: currentTheme.cardHex }}>Beginner (&lt;1000)</option>
                  <option value="intermediate" style={{ backgroundColor: currentTheme.cardHex }}>Intermediate (1000–1599)</option>
                  <option value="advanced" style={{ backgroundColor: currentTheme.cardHex }}>Advanced (1600–2199)</option>
                  <option value="master" style={{ backgroundColor: currentTheme.cardHex }}>Master (2200+)</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {/* Tactical Motif Filter */}
        {mode === 'adaptive' && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t" style={{ borderColor: currentTheme.cardBorderHex }}>
            {PUZZLE_CATEGORIES.map(cat => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className="px-2.5 py-1 rounded-md border text-[11px] font-semibold transition hover:opacity-85"
                  style={{
                    backgroundColor: active ? `${currentTheme.accentHex}20` : currentTheme.cardSecondaryHex,
                    borderColor: active ? currentTheme.accentHex : currentTheme.cardBorderHex,
                    color: active ? currentTheme.accentHex : currentTheme.textSecondary
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Puzzle Rush HUD Strip + Format Switcher */}
        {mode === 'rush' && (
          <div
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-xs font-mono font-bold tabular-nums"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              borderColor: rushFinished ? '#f43f5e' : currentTheme.accentHex
            }}
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock
                  className="w-4 h-4"
                  style={{
                    color:
                      rushVariant === 'survival'
                        ? currentTheme.accentHex
                        : rushSecondsLeft <= 30
                        ? '#f43f5e'
                        : currentTheme.accentHex
                  }}
                />
                <span
                  style={{
                    color:
                      rushVariant !== 'survival' && rushSecondsLeft <= 30
                        ? '#f43f5e'
                        : currentTheme.textPrimary
                  }}
                >
                  {rushVariant === 'survival' ? 'Survival ∞' : formatTimer(rushSecondsLeft)}
                </span>
              </span>
              <span>
                Score: <span style={{ color: currentTheme.accentHex }}>{rushScore}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span>Strikes:</span>
                {[0, 1, 2].map(idx => (
                  <span
                    key={idx}
                    className="inline-flex w-4 h-4 items-center justify-center rounded border text-[10px]"
                    style={{
                      backgroundColor: idx < rushStrikes ? '#f43f5e25' : currentTheme.cardHex,
                      borderColor: idx < rushStrikes ? '#f43f5e' : currentTheme.cardBorderHex,
                      color: idx < rushStrikes ? '#f43f5e' : currentTheme.textMutedHex
                    }}
                  >
                    {idx < rushStrikes ? 'X' : '·'}
                  </span>
                ))}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-sans">
              <div
                className="flex items-center gap-1 p-0.5 rounded-md border"
                style={{ backgroundColor: currentTheme.cardHex, borderColor: currentTheme.cardBorderHex }}
              >
                {([
                  { id: '3min', label: '3:00' },
                  { id: '5min', label: '5:00' },
                  { id: 'survival', label: 'Survival' }
                ] as const).map(fmt => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => startRushRun(fmt.id)}
                    className="px-2 py-1 rounded text-[11px] font-bold transition whitespace-nowrap"
                    style={{
                      backgroundColor: rushVariant === fmt.id ? currentTheme.accentHex : 'transparent',
                      color: rushVariant === fmt.id ? currentTheme.accentTextHex : currentTheme.textSecondary
                    }}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => startRushRun()}
                className="px-3 py-1.5 rounded-md font-bold text-xs transition hover:opacity-90 whitespace-nowrap"
                style={{
                  backgroundColor: currentTheme.accentHex,
                  color: currentTheme.accentTextHex
                }}
              >
                Restart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Board & Tactical Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 flex flex-col items-center gap-2.5">
          <div
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs font-semibold"
            style={{
              maxWidth: boardPlateMaxWidth,
              backgroundColor: currentTheme.cardHex,
              borderColor: currentTheme.cardBorderHex
            }}
          >
            <span style={{ color: currentTheme.textPrimary }}>
              {currentPuzzle.playerColor === 'w' ? 'White to move' : 'Black to move'}
            </span>
            <span className="font-mono font-bold tabular-nums" style={{ color: currentTheme.accentHex }}>
              Target Elo {currentPuzzle.rating}
            </span>
          </div>

          <ChessBoard
            chess={chess}
            isFlipped={currentPuzzle.playerColor === 'b'}
            bestMoveArrow={getBoardArrow()}
            moveClassification={activeBoardBadge}
            onMakeMove={handleMakeMove}
            disabled={status !== 'solving' || (mode === 'rush' && rushFinished)}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <div
            className="rounded-xl p-5 border flex flex-col gap-4"
            style={{
              backgroundColor: currentTheme.cardHex,
              borderColor: currentTheme.cardBorderHex
            }}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.accentHex }}>
                  {currentPuzzle.category || currentPuzzle.theme}
                </span>
                <span className="text-[11px] font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>
                  {currentPuzzle.moves.length} ply line
                </span>
              </div>
              <h2 className="font-display text-lg font-bold mt-1" style={{ color: currentTheme.textPrimary }}>
                {mode === 'rush' ? currentPuzzle.theme : currentPuzzle.description}
              </h2>
              {mode === 'review' && (
                <p className="text-[11px] mt-1" style={{ color: currentTheme.textSecondary }}>
                  Spaced Repetition Queue: Solve without hints to graduate this motif from your review deck.
                </p>
              )}
            </div>

            {mode === 'rush' && rushFinished && (
              <div
                className="p-4 rounded-lg border flex flex-col gap-2"
                style={{
                  backgroundColor: `${currentTheme.accentHex}15`,
                  borderColor: currentTheme.accentHex
                }}
              >
                <div className="font-display font-bold text-base" style={{ color: currentTheme.textPrimary }}>
                  Puzzle Rush Complete — Score {rushScore}
                </div>
                <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                  Personal Best: {rushBest}. Missed puzzles have been added to your Spaced Review deck!
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => startRushRun()}
                    className="flex-1 py-2 rounded-lg text-xs font-bold"
                    style={{ backgroundColor: currentTheme.accentHex, color: currentTheme.accentTextHex }}
                  >
                    Play Rush Again
                  </button>
                  {reviewQueueIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => switchMode('review')}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold border"
                      style={{
                        backgroundColor: currentTheme.cardSecondaryHex,
                        borderColor: currentTheme.cardBorderHex,
                        color: currentTheme.textPrimary
                      }}
                    >
                      Review Missed ({reviewQueueIds.length})
                    </button>
                  )}
                </div>
              </div>
            )}

            {status === 'solved' && !rushFinished && (() => {
              const solveClass = solutionStates.steps[solutionStates.steps.length - 1]?.classification || 'best';
              const meta = CLASSIFICATION_META[solveClass];
              return (
                <div
                  className="p-4 rounded-lg border flex items-center justify-between"
                  style={{
                    backgroundColor: `${meta.hex}15`,
                    borderColor: `${meta.hex}45`,
                    color: meta.hex
                  }}
                >
                  <div className="flex items-center gap-3">
                    <MoveClassificationBadge type={solveClass} size="lg" />
                    <div>
                      <div className="font-bold text-sm" style={{ color: currentTheme.textPrimary }}>
                        {meta.label} — Solved cleanly
                      </div>
                      <div className="text-xs" style={{ color: currentTheme.textSecondary }}>
                        {mode === 'review' && hintLevel === 0
                          ? 'Graduated from your Spaced Review deck.'
                          : autoNext && mode === 'adaptive'
                          ? 'Auto-advancing to next puzzle…'
                          : 'Tactical motif completed.'}
                      </div>
                    </div>
                  </div>
                  {ratingDelta !== null && (
                    <span className="font-mono font-bold text-lg tabular-nums">
                      +{ratingDelta}
                    </span>
                  )}
                </div>
              );
            })()}

            {status === 'failed' && !rushFinished && (
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/35 text-rose-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MoveClassificationBadge type="blunder" size="lg" />
                  <div>
                    <div className="font-bold text-sm">Blunder — Incorrect Move</div>
                    <div className="text-xs opacity-85">
                      Added to your Spaced Review deck for later mastery.
                    </div>
                  </div>
                </div>
                {ratingDelta !== null && (
                  <span className="font-mono font-bold text-lg tabular-nums">
                    {ratingDelta}
                  </span>
                )}
              </div>
            )}

            {/* Post-Solve / Post-Fail Interactive Solution Stepper + Decode Why + Coach Why */}
            {(status === 'solved' || status === 'failed') && (
              <div
                className="p-3.5 rounded-lg border flex flex-col gap-3"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  borderColor: currentTheme.cardBorderHex
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: currentTheme.accentHex }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Solution · {tacticalBreakdown.keySan} ({tacticalBreakdown.evalLabel})</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAskCoachWhy}
                    disabled={loadingCoachNote}
                    className="flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-bold transition hover:opacity-85 disabled:opacity-50 whitespace-nowrap"
                    style={{
                      backgroundColor: currentTheme.cardHex,
                      borderColor: `${currentTheme.accentHex}50`,
                      color: currentTheme.accentHex
                    }}
                  >
                    <Bot className="w-3 h-3" />
                    <span>{loadingCoachNote ? 'Asking...' : 'Ask Coach Why'}</span>
                  </button>
                </div>

                <ul className="space-y-1 text-xs" style={{ color: currentTheme.textPrimary }}>
                  {tacticalBreakdown.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span style={{ color: currentTheme.accentHex }}>·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                {coachNoteError && (
                  <div className="p-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-xs space-y-2">
                    <p style={{ color: currentTheme.textPrimary }}>{coachNoteError}</p>
                    <button
                      type="button"
                      onClick={handleUseLocalCoachBreakdown}
                      disabled={loadingCoachOffline}
                      className="px-2.5 py-1 rounded-md border font-bold text-[11px] transition hover:opacity-85 disabled:opacity-50"
                      style={{
                        backgroundColor: currentTheme.cardHex,
                        borderColor: currentTheme.cardBorderHex,
                        color: currentTheme.accentHex
                      }}
                    >
                      {loadingCoachOffline ? 'Loading...' : 'Use Local Breakdown'}
                    </button>
                  </div>
                )}

                {coachNote && (
                  <div
                    className="p-2.5 rounded-lg border text-xs space-y-1"
                    style={{
                      backgroundColor: currentTheme.cardHex,
                      borderColor: `${currentTheme.accentHex}45`
                    }}
                  >
                    <div className="font-bold flex items-center gap-1.5" style={{ color: currentTheme.accentHex }}>
                      <Bot className="w-3.5 h-3.5" />
                      <span>{coachNote.headline}</span>
                    </div>
                    <p style={{ color: currentTheme.textPrimary }}>{coachNote.whyMoveWorkedOrFailed}</p>
                    <p className="text-[11px]" style={{ color: currentTheme.textSecondary }}>
                      <span className="font-semibold">Idea: </span>{coachNote.bestMoveIdea}
                    </p>
                  </div>
                )}

                {/* Interactive Line Stepper with Move Classification Badges */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: currentTheme.cardBorderHex }}>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                    {solutionStates.steps.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => stepToPly(idx + 1)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-bold transition"
                        style={{
                          backgroundColor: replayPly === idx + 1 ? currentTheme.accentHex : currentTheme.cardHex,
                          borderColor: replayPly === idx + 1 ? currentTheme.accentHex : currentTheme.cardBorderHex,
                          color: replayPly === idx + 1 ? currentTheme.accentTextHex : currentTheme.textPrimary
                        }}
                      >
                        <MoveClassificationBadge type={s.classification} size="xs" />
                        <span>{s.san}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => stepToPly(0)}
                      aria-label="Reset puzzle board"
                      className="p-1 rounded border hover:opacity-80"
                      style={{ backgroundColor: currentTheme.cardHex, borderColor: currentTheme.cardBorderHex }}
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepToPly((replayPly ?? solutionStates.steps.length) - 1)}
                      aria-label="Previous solution move"
                      className="p-1 rounded border hover:opacity-80"
                      style={{ backgroundColor: currentTheme.cardHex, borderColor: currentTheme.cardBorderHex }}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepToPly((replayPly ?? 0) + 1)}
                      aria-label="Next solution move"
                      className="p-1 rounded border hover:opacity-80"
                      style={{ backgroundColor: currentTheme.cardHex, borderColor: currentTheme.cardBorderHex }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepToPly(solutionStates.steps.length)}
                      aria-label="Final solution position"
                      className="p-1 rounded border hover:opacity-80"
                      style={{ backgroundColor: currentTheme.cardHex, borderColor: currentTheme.cardBorderHex }}
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {hintLevel > 0 && status === 'solving' && (
              <div
                className="p-3 rounded-lg border text-xs flex items-start gap-2"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  borderColor: currentTheme.cardBorderHex,
                  color: currentTheme.textPrimary
                }}
              >
                <Target className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentTheme.accentHex }} />
                <span>
                  {hintLevel === 1
                    ? 'Focus on the highlighted piece to launch the forcing sequence.'
                    : 'Follow the engine arrow on the board to complete the tactic.'}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-3 border-t" style={{ borderColor: currentTheme.cardBorderHex }}>
              {mode === 'adaptive' && (
                <label className="flex items-center justify-between text-xs py-1 cursor-pointer">
                  <span className="font-medium" style={{ color: currentTheme.textSecondary }}>
                    Auto-Next on Clean Solve
                  </span>
                  <input
                    type="checkbox"
                    aria-label="Auto-Next on Clean Solve"
                    checked={autoNext}
                    onChange={e => setAutoNext(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: currentTheme.accentHex }}
                  />
                </label>
              )}

              {status === 'solving' && mode !== 'rush' && (
                <button
                  type="button"
                  onClick={() => setHintLevel(prev => Math.min(2, prev + 1))}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold border transition hover:opacity-85"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    color: currentTheme.textPrimary,
                    borderColor: currentTheme.cardBorderHex
                  }}
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>{hintLevel === 0 ? 'Reveal Piece Hint' : hintLevel === 1 ? 'Show Solution Move' : 'Hint Active'}</span>
                </button>
              )}

              {status === 'failed' && mode !== 'rush' && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold border transition hover:opacity-85"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    color: currentTheme.textPrimary,
                    borderColor: currentTheme.cardBorderHex
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Puzzle</span>
                </button>
              )}

              {(status === 'solved' || status === 'failed') && !rushFinished && (
                <button
                  type="button"
                  onClick={handleNextPuzzle}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition hover:opacity-90"
                  style={{
                    backgroundColor: currentTheme.accentHex,
                    color: currentTheme.accentTextHex
                  }}
                >
                  <span>{mode === 'review' ? 'Next Review Puzzle' : 'Next Adaptive Puzzle'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
