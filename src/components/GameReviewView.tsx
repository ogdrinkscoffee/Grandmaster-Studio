import React, { useState, useEffect, useMemo } from 'react';
import { GameHistoryItem, MoveAnalysis, MoveClassification } from '../types/chess';
import { Chess, Square } from 'chess.js';
import { ChessBoard, CustomBoardMoveTarget, getBoardMaxWidthPx } from './ChessBoard';
import { EvalBar } from './EvalBar';
import { ChessPieceIcon } from './ChessPieces';
import {
  MoveClassificationBadge,
  CLASSIFICATION_META,
  CLASSIFICATION_ORDER
} from './MoveClassificationBadge';
import {
  formatEvaluation,
  winChanceFromCp,
  calculateAccuracyFromMoves,
  computeGamePhaseAccuracy,
  estimatePerformanceElo,
  getThreatenedSquares
} from '../engine/chessEngine';
import { hasOpenModalDialog, isEditableEventTarget } from '../engine/keyboardShortcuts';
import {
  coordsToSquare,
  createCustomGameState,
  CustomGameState,
  executeCustomMove,
  findKingPosition,
  getAllLegalMoves,
  isKingInCheck
} from '../engine/customVariantEngine';
import { detectOpening } from '../engine/openings';
import { getVariantDisplayName } from '../engine/variants';
import { engineAnalyzeCompletedGame } from '../engine/engineClient';
import {
  ArrowLeft,
  Copy,
  Check,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Brain,
  Target,
  RotateCcw,
  Sparkles,
  Send,
  Loader2,
  PlayCircle,
  AlertCircle
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';

interface GameReviewViewProps {
  game: GameHistoryItem;
  playerElo?: number;
  onBack: () => void;
  onSaveToVault?: () => void;
}

interface CoachMoveDetail {
  headline: string;
  whyMoveWorkedOrFailed: string;
  bestMoveIdea: string;
  coachTip: string;
  source: 'gemini' | 'local';
}

function createChessFromFenSafe(fen?: string): Chess {
  if (!fen) return new Chess();
  try {
    return new Chess(fen);
  } catch {
    try {
      return new Chess(fen, { skipValidation: true });
    } catch {
      return new Chess();
    }
  }
}

export const GameReviewView: React.FC<GameReviewViewProps> = ({ game, playerElo, onBack }) => {
  const { theme: currentTheme, pieceSet, settings: appSettings } = useAppTheme();
  const boardPlateMaxWidth = `${getBoardMaxWidthPx(appSettings.boardSize) + 44}px`;
  const [currentMoveIdx, setCurrentMoveIdx] = useState<number>(0);
  const [copiedPgn, setCopiedPgn] = useState<boolean>(false);
  const [coachMode, setCoachMode] = useState<boolean>(true);
  const [retryActive, setRetryActive] = useState<boolean>(false);
  const [retryFeedback, setRetryFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [showPvPreview, setShowPvPreview] = useState<boolean>(false);

  // Per-move AI coach cache keyed by ply index + honest error reporting
  const [coachDetailsByPly, setCoachDetailsByPly] = useState<Record<number, CoachMoveDetail>>({});
  const [coachErrorByPly, setCoachErrorByPly] = useState<Record<number, string>>({});
  const [coachLoadingPly, setCoachLoadingPly] = useState<number | null>(null);
  const [coachQuestion, setCoachQuestion] = useState<string>('');
  const [lastQuestionByPly, setLastQuestionByPly] = useState<Record<number, string | undefined>>({});

  const isCustomGridGame = Boolean(game.startCustomConfig);

  // Base move list per game (handles both pre-analyzed games and PGN-only seed games)
  const baseMoves = useMemo<MoveAnalysis[]>(() => {
    let base: MoveAnalysis[] = game.analyzedMoves ? [...game.analyzedMoves] : [];
    if (base.length === 0 && game.pgn && !game.startCustomConfig) {
      const parser = new Chess();
      try {
        parser.loadPgn(game.pgn);
        const hist = parser.history({ verbose: true });
        base = hist.map(m => ({
          san: m.san,
          from: m.from,
          to: m.to,
          promotion: m.promotion,
          classification: 'good' as MoveClassification,
          evalBefore: 0,
          evalAfter: 0
        }));
      } catch {
        base = [];
      }
    }
    return base;
  }, [game]);

  // Full-game enrichment runs in the engine worker (standard 8x8 games only)
  const [enrichedMoves, setEnrichedMoves] = useState<MoveAnalysis[]>(baseMoves);
  useEffect(() => {
    let cancelled = false;
    setEnrichedMoves(baseMoves);
    if (baseMoves.length === 0 || isCustomGridGame) return;
    engineAnalyzeCompletedGame(baseMoves, game.startFen)
      .then(result => {
        if (!cancelled) setEnrichedMoves(result);
      })
      .catch(() => {
        /* keep the base analysis */
      });
    return () => {
      cancelled = true;
    };
  }, [baseMoves, game.startFen, isCustomGridGame]);

  useEffect(() => {
    setCurrentMoveIdx(0);
    setRetryActive(false);
    setRetryFeedback(null);
    setCoachDetailsByPly({});
    setCoachErrorByPly({});
    setLastQuestionByPly({});
  }, [game.id]);

  // Board state before `currentMoveIdx` and after `currentMoveIdx` (8x8 chess.js mode)
  const { chessBefore, chessAfter } = useMemo(() => {
    if (isCustomGridGame) {
      const empty = createChessFromFenSafe(game.startFen);
      return { chessBefore: empty, chessAfter: empty };
    }
    const before = createChessFromFenSafe(game.startFen);
    for (let i = 0; i < currentMoveIdx && i < enrichedMoves.length; i++) {
      const m = enrichedMoves[i];
      try {
        before.move({ from: m.from, to: m.to, promotion: m.promotion });
      } catch {
        try {
          before.move(m.san);
        } catch {
          break;
        }
      }
    }
    const after = createChessFromFenSafe(before.fen());
    const curr = enrichedMoves[currentMoveIdx];
    if (curr) {
      try {
        after.move({
          from: curr.from,
          to: curr.to,
          promotion: curr.promotion
        });
      } catch {
        try {
          after.move(curr.san);
        } catch {
          // ignore
        }
      }
    }
    return { chessBefore: before, chessAfter: after };
  }, [enrichedMoves, currentMoveIdx, game.startFen, isCustomGridGame]);

  // Custom-grid replay state when reviewing fairy/custom grid games
  const customReplay = useMemo<{
    state: CustomGameState | null;
    lastMove: CustomBoardMoveTarget | null;
    checkSq: { row: number; col: number } | null;
  }>(() => {
    if (!game.startCustomConfig) {
      return { state: null, lastMove: null, checkSq: null };
    }
    let st = createCustomGameState(game.startCustomConfig);
    let lastMove: CustomBoardMoveTarget | null = null;
    const height = st.grid.length;
    const limit = Math.min(currentMoveIdx + 1, enrichedMoves.length);
    for (let i = 0; i < limit; i++) {
      const m = enrichedMoves[i];
      const legal = getAllLegalMoves(st);
      const matched =
        legal.find(
          lm =>
            coordsToSquare(lm.fromRow, lm.fromCol, height) === m.from &&
            coordsToSquare(lm.toRow, lm.toCol, height) === m.to &&
            (!m.promotion || lm.promotion === m.promotion)
        ) || legal.find(lm => lm.san === m.san);
      if (!matched) break;
      lastMove = {
        fromRow: matched.fromRow,
        fromCol: matched.fromCol,
        toRow: matched.toRow,
        toCol: matched.toCol
      };
      st = executeCustomMove(st, matched);
    }
    const inCheck = isKingInCheck(st.grid, st.turn, st.config.rules, st.duckPos);
    const checkSq = inCheck ? findKingPosition(st.grid, st.turn) : null;
    return { state: st, lastMove, checkSq };
  }, [game.startCustomConfig, enrichedMoves, currentMoveIdx]);

  // Keyboard arrow + Home/End stepping
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableEventTarget(e.target) || hasOpenModalDialog()) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setRetryActive(false);
        setRetryFeedback(null);
        setShowPvPreview(false);
        setCurrentMoveIdx(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setRetryActive(false);
        setRetryFeedback(null);
        setShowPvPreview(false);
        setCurrentMoveIdx(prev => Math.min(Math.max(0, enrichedMoves.length - 1), prev + 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setRetryActive(false);
        setRetryFeedback(null);
        setShowPvPreview(false);
        setCurrentMoveIdx(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setRetryActive(false);
        setRetryFeedback(null);
        setShowPvPreview(false);
        setCurrentMoveIdx(Math.max(0, enrichedMoves.length - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enrichedMoves.length]);

  const jumpToPly = (idx: number) => {
    const clamped = Math.max(0, Math.min(Math.max(0, enrichedMoves.length - 1), idx));
    setCurrentMoveIdx(clamped);
    setRetryActive(false);
    setRetryFeedback(null);
    setShowPvPreview(false);
  };

  const detectedOpening = useMemo(
    () => (isCustomGridGame ? null : detectOpening(enrichedMoves.map(m => m.san))),
    [enrichedMoves, isCustomGridGame]
  );
  const currentAnalysis: MoveAnalysis | undefined = enrichedMoves[currentMoveIdx];
  const evalScore = retryActive
    ? currentAnalysis?.evalBefore ?? 0
    : currentAnalysis?.evalAfter ?? 0;

  const accuracyWhite = useMemo(
    () => (enrichedMoves.length > 0 ? calculateAccuracyFromMoves(enrichedMoves, 'w') : game.accuracyWhite ?? 85),
    [enrichedMoves, game.accuracyWhite]
  );
  const accuracyBlack = useMemo(
    () => (enrichedMoves.length > 0 ? calculateAccuracyFromMoves(enrichedMoves, 'b') : game.accuracyBlack ?? 82),
    [enrichedMoves, game.accuracyBlack]
  );

  const whitePhaseAcc = useMemo(() => computeGamePhaseAccuracy(enrichedMoves, 'w'), [enrichedMoves]);
  const blackPhaseAcc = useMemo(() => computeGamePhaseAccuracy(enrichedMoves, 'b'), [enrichedMoves]);

  const whiteResultScore: 1 | 0.5 | 0 = game.result === '1-0' ? 1 : game.result === '1/2-1/2' ? 0.5 : 0;
  const blackResultScore: 1 | 0.5 | 0 = game.result === '0-1' ? 1 : game.result === '1/2-1/2' ? 0.5 : 0;
  const whitePerfElo = estimatePerformanceElo(
    accuracyWhite,
    game.playerColor === 'w' ? game.opponentElo || 1200 : playerElo || 1400,
    whiteResultScore
  );
  const blackPerfElo = estimatePerformanceElo(
    accuracyBlack,
    game.playerColor === 'b' ? game.opponentElo || 1200 : playerElo || 1400,
    blackResultScore
  );

  // Key moments (brilliant, great, inaccuracy, mistake, blunder, missed_win)
  const keyMomentIndices = useMemo(() => {
    const important = new Set<MoveClassification>([
      'brilliant',
      'great',
      'inaccuracy',
      'mistake',
      'missed_win',
      'blunder'
    ]);
    return enrichedMoves
      .map((m, idx) => (important.has(m.classification) ? idx : -1))
      .filter(i => i >= 0);
  }, [enrichedMoves]);

  const prevKeyMoment = [...keyMomentIndices].reverse().find(i => i < currentMoveIdx);
  const nextKeyMoment = keyMomentIndices.find(i => i > currentMoveIdx);

  const countStats = (colorTurn: 'w' | 'b') => {
    const stats: Partial<Record<MoveClassification, number>> = {};
    enrichedMoves.forEach((m, idx) => {
      const isWhiteTurn = idx % 2 === 0;
      if ((isWhiteTurn && colorTurn === 'w') || (!isWhiteTurn && colorTurn === 'b')) {
        stats[m.classification] = (stats[m.classification] || 0) + 1;
      }
    });
    return stats;
  };

  const whiteStats = countStats('w');
  const blackStats = countStats('b');

  const handleCopyPgn = async () => {
    try {
      await navigator.clipboard.writeText(game.pgn || enrichedMoves.map(m => m.san).join(' '));
      setCopiedPgn(true);
      setTimeout(() => setCopiedPgn(false), 2000);
    } catch {
      // ignore clipboard permission denial
    }
  };

  const handleRetryMove = (moveAttempt: { from: Square; to: Square; promotion?: string }) => {
    if (!currentAnalysis) return;
    if (!currentAnalysis.bestMoveFrom || !currentAnalysis.bestMoveTo) {
      setRetryFeedback({
        ok: false,
        text: 'Engine analysis for this move is still loading — try again in a moment.'
      });
      return;
    }
    if (
      moveAttempt.from === currentAnalysis.bestMoveFrom &&
      moveAttempt.to === currentAnalysis.bestMoveTo
    ) {
      setRetryFeedback({
        ok: true,
        text: `Exact best move! ${currentAnalysis.bestMoveSan} is the top engine choice here.`
      });
      setRetryActive(false);
    } else {
      setRetryFeedback({
        ok: false,
        text: `Not the top line — look for stronger central control or forcing tactical pressure (${currentAnalysis.bestMoveSan || 'engine move'} was best).`
      });
    }
  };

  const buildExplainPayload = (customQ?: string) => {
    if (!currentAnalysis) return null;
    const threats = isCustomGridGame ? [] : getThreatenedSquares(chessAfter, chessAfter.turn());
    return {
      fenBefore: isCustomGridGame ? 'custom-variant-position' : chessBefore.fen(),
      fenAfter: isCustomGridGame ? 'custom-variant-position' : chessAfter.fen(),
      playedSan: currentAnalysis.san,
      bestSan: currentAnalysis.bestMoveSan || currentAnalysis.san,
      classification: currentAnalysis.classification,
      evalBeforeCp: currentAnalysis.evalBefore,
      evalAfterCp: currentAnalysis.evalAfter,
      moveAccuracy: currentAnalysis.moveAccuracy,
      pvSan: currentAnalysis.pvSan || [],
      threats,
      mode: 'review',
      userQuestion: customQ || undefined
    };
  };

  const handleAskCoachAboutMove = async (customQ?: string) => {
    const payload = buildExplainPayload(customQ);
    if (!payload) return;
    const ply = currentMoveIdx;
    setCoachLoadingPly(ply);
    setLastQuestionByPly(prev => ({ ...prev, [ply]: customQ }));
    setCoachErrorByPly(prev => {
      const next = { ...prev };
      delete next[ply];
      return next;
    });
    try {
      const res = await fetch('/api/coach/explain-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCoachErrorByPly(prev => ({
          ...prev,
          [ply]: data?.error || `Live AI Coach request failed (HTTP ${res.status}).`
        }));
        return;
      }
      setCoachDetailsByPly(prev => ({ ...prev, [ply]: data as CoachMoveDetail }));
    } catch {
      setCoachErrorByPly(prev => ({
        ...prev,
        [ply]: 'Unable to reach Coach API while offline.'
      }));
    } finally {
      setCoachLoadingPly(null);
    }
  };

  const handleUseOfflineBreakdown = async (ply: number) => {
    const payload = buildExplainPayload(lastQuestionByPly[ply]);
    if (!payload) return;
    setCoachLoadingPly(ply);
    try {
      const res = await fetch('/api/coach/offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'move', ...payload })
      });
      if (res.ok) {
        const data = (await res.json()) as CoachMoveDetail;
        setCoachDetailsByPly(prev => ({ ...prev, [ply]: data }));
        setCoachErrorByPly(prev => {
          const next = { ...prev };
          delete next[ply];
          return next;
        });
      }
    } catch {
      setCoachErrorByPly(prev => ({
        ...prev,
        [ply]: 'Local Coach breakdown could not be loaded.'
      }));
    } finally {
      setCoachLoadingPly(null);
    }
  };

  const meta = currentAnalysis ? CLASSIFICATION_META[currentAnalysis.classification] : null;
  const activeCoachDetail = coachDetailsByPly[currentMoveIdx];
  const activeCoachError = coachErrorByPly[currentMoveIdx];
  const winBeforeWhite = currentAnalysis ? winChanceFromCp(currentAnalysis.evalBefore) : 50;
  const winAfterWhite = currentAnalysis ? winChanceFromCp(currentAnalysis.evalAfter) : 50;
  const moverIsWhite = currentMoveIdx % 2 === 0;
  const moverWinBefore = moverIsWhite ? winBeforeWhite : 100 - winBeforeWhite;
  const moverWinAfter = moverIsWhite ? winAfterWhite : 100 - winAfterWhite;

  const isCriticalError =
    !isCustomGridGame &&
    currentAnalysis &&
    (currentAnalysis.classification === 'inaccuracy' ||
      currentAnalysis.classification === 'mistake' ||
      currentAnalysis.classification === 'blunder' ||
      currentAnalysis.classification === 'missed_win');

  // Preview board for PV continuation when toggled
  const displayedBoard = useMemo(() => {
    if (isCustomGridGame) return chessAfter;
    if (retryActive) return chessBefore;
    if (showPvPreview && currentAnalysis?.pvSan && currentAnalysis.pvSan.length > 0) {
      const pvBoard = createChessFromFenSafe(chessBefore.fen());
      for (const san of currentAnalysis.pvSan) {
        try {
          pvBoard.move(san);
        } catch {
          break;
        }
      }
      return pvBoard;
    }
    return chessAfter;
  }, [isCustomGridGame, retryActive, showPvPreview, currentAnalysis, chessBefore, chessAfter]);

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto p-3 sm:p-5" style={{ color: currentTheme.textPrimary }}>
      {/* Top Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 pb-4"
        style={{ borderBottom: `1px solid ${currentTheme.cardBorderHex}` }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              border: `1px solid ${currentTheme.cardBorderHex}`,
              color: currentTheme.textPrimary
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight" style={{ color: currentTheme.textPrimary }}>
              Game Review &amp; Coach Analysis
            </h1>
            <p className="text-xs mt-0.5 tabular-nums" style={{ color: currentTheme.textMutedHex }}>
              {getVariantDisplayName(game.variant)} · {game.date} · {game.result}
              {detectedOpening ? ` · ${detectedOpening.eco} ${detectedOpening.name}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Coach Mode Toggle */}
          <button
            type="button"
            onClick={() => setCoachMode(c => !c)}
            data-testid="toggle-review-coach-mode"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border transition cursor-pointer whitespace-nowrap"
            style={{
              backgroundColor: coachMode ? currentTheme.accentHex : currentTheme.cardSecondaryHex,
              borderColor: coachMode ? currentTheme.accentHex : currentTheme.cardBorderHex,
              color: coachMode ? currentTheme.accentTextHex : currentTheme.textPrimary
            }}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>{coachMode ? 'Coach Mode: On' : 'Coach Mode: Off'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyPgn}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap"
            style={{
              backgroundColor: currentTheme.cardSecondaryHex,
              border: `1px solid ${currentTheme.cardBorderHex}`,
              color: currentTheme.textPrimary
            }}
          >
            {copiedPgn ? <Check className="w-3.5 h-3.5" style={{ color: '#059669' }} /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPgn ? 'PGN Copied' : 'Copy PGN'}</span>
          </button>
        </div>
      </div>

      {/* Accuracy, Phase Accuracy & Game Rating Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* White Summary */}
        <div
          className="p-4 rounded-xl flex flex-col gap-3"
          style={{
            backgroundColor: currentTheme.cardHex,
            border: `1px solid ${currentTheme.cardBorderHex}`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center p-1.5"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <ChessPieceIcon type="k" color="w" set={pieceSet} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: currentTheme.textPrimary }}>
                  {game.playerColor === 'w' ? 'You (White)' : game.opponentName}
                </div>
                <div className="text-xs font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>
                  Elo {game.playerColor === 'w' ? (playerElo ?? 1450) : game.opponentElo || 1250} · Game Rating {whitePerfElo}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono tabular-nums" style={{ color: currentTheme.accentHex }}>
                {accuracyWhite.toFixed(1)}%
              </div>
              <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: currentTheme.textMutedHex }}>
                Accuracy
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-3 gap-2 pt-2.5 border-t text-[11px] font-mono tabular-nums"
            style={{ borderColor: currentTheme.cardBorderHex }}
          >
            <div>
              <span style={{ color: currentTheme.textMutedHex }}>Opening </span>
              <strong style={{ color: currentTheme.textPrimary }}>
                {whitePhaseAcc.opening !== null ? `${whitePhaseAcc.opening}%` : '—'}
              </strong>
            </div>
            <div>
              <span style={{ color: currentTheme.textMutedHex }}>Midgame </span>
              <strong style={{ color: currentTheme.textPrimary }}>
                {whitePhaseAcc.middlegame !== null ? `${whitePhaseAcc.middlegame}%` : '—'}
              </strong>
            </div>
            <div>
              <span style={{ color: currentTheme.textMutedHex }}>Endgame </span>
              <strong style={{ color: currentTheme.textPrimary }}>
                {whitePhaseAcc.endgame !== null ? `${whitePhaseAcc.endgame}%` : '—'}
              </strong>
            </div>
          </div>
        </div>

        {/* Black Summary */}
        <div
          className="p-4 rounded-xl flex flex-col gap-3"
          style={{
            backgroundColor: currentTheme.cardHex,
            border: `1px solid ${currentTheme.cardBorderHex}`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center p-1.5"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <ChessPieceIcon type="k" color="b" set={pieceSet} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: currentTheme.textPrimary }}>
                  {game.playerColor === 'b' ? 'You (Black)' : game.opponentName}
                </div>
                <div className="text-xs font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>
                  Elo {game.playerColor === 'b' ? (playerElo ?? 1450) : game.opponentElo || 1250} · Game Rating {blackPerfElo}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono tabular-nums" style={{ color: currentTheme.textPrimary }}>
                {accuracyBlack.toFixed(1)}%
              </div>
              <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: currentTheme.textMutedHex }}>
                Accuracy
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-3 gap-2 pt-2.5 border-t text-[11px] font-mono tabular-nums"
            style={{ borderColor: currentTheme.cardBorderHex }}
          >
            <div>
              <span style={{ color: currentTheme.textMutedHex }}>Opening </span>
              <strong style={{ color: currentTheme.textPrimary }}>
                {blackPhaseAcc.opening !== null ? `${blackPhaseAcc.opening}%` : '—'}
              </strong>
            </div>
            <div>
              <span style={{ color: currentTheme.textMutedHex }}>Midgame </span>
              <strong style={{ color: currentTheme.textPrimary }}>
                {blackPhaseAcc.middlegame !== null ? `${blackPhaseAcc.middlegame}%` : '—'}
              </strong>
            </div>
            <div>
              <span style={{ color: currentTheme.textMutedHex }}>Endgame </span>
              <strong style={{ color: currentTheme.textPrimary }}>
                {blackPhaseAcc.endgame !== null ? `${blackPhaseAcc.endgame}%` : '—'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Board + Eval Bar + Clickable Advantage Timeline */}
        <div className="lg:col-span-7 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-3 w-full">
            <EvalBar scoreCp={evalScore} isFlipped={game.playerColor === 'b'} />
            {isCustomGridGame && customReplay.state ? (
              <ChessBoard
                isFlipped={game.playerColor === 'b'}
                customGrid={customReplay.state.grid}
                customTurn={customReplay.state.turn}
                customLastMove={customReplay.lastMove}
                customCheckSquare={customReplay.checkSq}
                customDuckPos={customReplay.state.duckPos}
                customShieldedPos={customReplay.state.shieldedPos}
                disabled
              />
            ) : (
              <ChessBoard
                chess={displayedBoard}
                isFlipped={game.playerColor === 'b'}
                moveClassification={
                  !retryActive && !showPvPreview && currentAnalysis
                    ? {
                        square: currentAnalysis.to as Square,
                        type: currentAnalysis.classification
                      }
                    : null
                }
                bestMoveArrow={
                  !retryActive &&
                  currentAnalysis?.bestMoveFrom &&
                  currentAnalysis?.bestMoveTo &&
                  (currentAnalysis.classification !== 'best' || showPvPreview)
                    ? {
                        from: currentAnalysis.bestMoveFrom as Square,
                        to: currentAnalysis.bestMoveTo as Square
                      }
                    : null
                }
                onMakeMove={handleRetryMove}
                disabled={!retryActive}
              />
            )}
          </div>

          {/* Interactive Evaluation Timeline Chart */}
          {enrichedMoves.length > 1 && (
            <div
              className="w-full rounded-xl p-3 border"
              style={{
                maxWidth: boardPlateMaxWidth,
                backgroundColor: currentTheme.cardHex,
                borderColor: currentTheme.cardBorderHex
              }}
            >
              <div className="flex items-center justify-between mb-1.5 text-[11px]">
                <span className="font-bold uppercase tracking-wider" style={{ color: currentTheme.textMutedHex }}>
                  Evaluation Timeline (Click move)
                </span>
                <span className="font-mono tabular-nums" style={{ color: currentTheme.accentHex }}>
                  Move {currentMoveIdx + 1}: {currentAnalysis?.san} ({formatEvaluation(evalScore)})
                </span>
              </div>
              <svg
                viewBox={`0 0 ${Math.max(100, enrichedMoves.length * 14)} 64`}
                className="w-full h-16 cursor-pointer rounded-lg overflow-hidden"
                style={{ backgroundColor: '#0f172a' }}
                preserveAspectRatio="none"
              >
                {(() => {
                  const totalW = Math.max(100, enrichedMoves.length * 14);
                  const stepX = totalW / Math.max(1, enrichedMoves.length - 1);
                  const pts = enrichedMoves.map((m, idx) => {
                    const winPct = winChanceFromCp(m.evalAfter);
                    const y = 64 - (winPct / 100) * 64;
                    return { x: idx * stepX, y, idx, cls: m.classification };
                  });
                  const poly = `0,64 ${pts.map(p => `${p.x},${p.y}`).join(' ')} ${totalW},64`;
                  const activeX = (currentMoveIdx / Math.max(1, enrichedMoves.length - 1)) * totalW;
                  return (
                    <>
                      <line x1="0" y1="32" x2={totalW} y2="32" stroke="#475569" strokeWidth="0.8" strokeDasharray="3 3" />
                      <polygon points={poly} fill="#f8fafc" fillOpacity="0.85" />
                      <line x1={activeX} y1="0" x2={activeX} y2="64" stroke={currentTheme.accentHex} strokeWidth="2" />
                      {pts.map(p => {
                        const isSpecial =
                          p.cls === 'blunder' ||
                          p.cls === 'mistake' ||
                          p.cls === 'missed_win' ||
                          p.cls === 'brilliant';
                        return (
                          <g key={p.idx} onClick={() => jumpToPly(p.idx)}>
                            <rect
                              x={Math.max(0, p.x - stepX / 2)}
                              y={0}
                              width={stepX}
                              height={64}
                              fill="transparent"
                            />
                            {isSpecial && (
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="3.4"
                                fill={CLASSIFICATION_META[p.cls].hex}
                                stroke="#ffffff"
                                strokeWidth="1"
                              />
                            )}
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>
          )}
        </div>

        {/* Right Sidebar: Coach Mikhail Move Card + Stepper + Move Ledger + Breakdown */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {currentAnalysis && meta && (
            <div
              className="p-4 rounded-xl flex flex-col gap-3"
              style={{
                backgroundColor: currentTheme.cardHex,
                border: `1px solid ${currentTheme.cardBorderHex}`
              }}
            >
              {/* Move Header + Distinct Classification Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <MoveClassificationBadge
                    type={currentAnalysis.classification}
                    variant="chip"
                    size="lg"
                    showLabel
                  />
                  <span className="text-2xl font-bold font-mono" style={{ color: currentTheme.textPrimary }}>
                    {currentAnalysis.san}
                  </span>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-xs font-bold" style={{ color: currentTheme.accentHex }}>
                    {typeof currentAnalysis.moveAccuracy === 'number'
                      ? `${currentAnalysis.moveAccuracy.toFixed(1)}% Acc`
                      : '—'}
                  </div>
                  <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                    Eval {formatEvaluation(currentAnalysis.evalAfter)} · Win {moverWinAfter}%
                  </div>
                </div>
              </div>

              {/* Coach Mode Move Breakdown */}
              {coachMode ? (
                <div
                  className="p-3.5 rounded-lg flex flex-col gap-2.5 text-xs"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    border: `1px solid ${currentTheme.cardBorderHex}`
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold" style={{ color: currentTheme.textPrimary }}>
                      <Brain className="w-4 h-4 shrink-0" style={{ color: currentTheme.accentHex }} />
                      <span>Coach Mikhail · Move {currentMoveIdx + 1}</span>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>
                      Win% {moverWinBefore}% → {moverWinAfter}%
                    </span>
                  </div>

                  <p className="leading-relaxed" style={{ color: currentTheme.textPrimary }}>
                    {activeCoachDetail?.whyMoveWorkedOrFailed ||
                      currentAnalysis.commentary ||
                      meta.shortDesc}
                  </p>

                  {currentAnalysis.bestMoveSan && (
                    <div
                      className="p-2.5 rounded-lg flex flex-col gap-1"
                      style={{
                        backgroundColor: currentTheme.cardHex,
                        border: `1px solid ${currentTheme.cardBorderHex}`
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold flex items-center gap-1.5" style={{ color: currentTheme.accentHex }}>
                          <Target className="w-3.5 h-3.5 shrink-0" />
                          Best Move: <strong className="font-mono">{currentAnalysis.bestMoveSan}</strong>
                        </span>
                        {!isCustomGridGame && currentAnalysis.pvSan && currentAnalysis.pvSan.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setRetryActive(false);
                              setShowPvPreview(p => !p);
                            }}
                            className="flex items-center gap-1 text-[11px] font-bold hover:opacity-80 whitespace-nowrap"
                            style={{ color: currentTheme.accentHex }}
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>{showPvPreview ? 'Back to Move' : 'Preview Line'}</span>
                          </button>
                        )}
                      </div>
                      {activeCoachDetail?.bestMoveIdea && (
                        <p className="text-[11px] leading-relaxed" style={{ color: currentTheme.textSecondary }}>
                          {activeCoachDetail.bestMoveIdea}
                        </p>
                      )}
                      {currentAnalysis.pvSan && currentAnalysis.pvSan.length > 0 && (
                        <div className="text-[11px] font-mono" style={{ color: currentTheme.textMutedHex }}>
                          Follow-up: {currentAnalysis.pvSan.join(' ')}
                        </div>
                      )}
                    </div>
                  )}

                  {activeCoachDetail?.coachTip && (
                    <div className="text-[11px] leading-relaxed" style={{ color: currentTheme.textSecondary }}>
                      <strong style={{ color: currentTheme.textPrimary }}>Principle: </strong>
                      {activeCoachDetail.coachTip}
                    </div>
                  )}

                  {activeCoachError && (
                    <div className="p-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 flex flex-col gap-2 text-[11px]">
                      <div className="flex items-start gap-1.5 text-amber-300 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{activeCoachError}</span>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleUseOfflineBreakdown(currentMoveIdx)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/20 border border-amber-400/50 text-amber-200 hover:bg-amber-500/30 transition"
                        >
                          Use Local Breakdown
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Ask AI Coach Deeper / Retry Mistake Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {isCriticalError && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowPvPreview(false);
                          setRetryFeedback(null);
                          setRetryActive(r => !r);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition whitespace-nowrap"
                        style={{
                          backgroundColor: retryActive ? currentTheme.accentHex : currentTheme.cardHex,
                          borderColor: retryActive ? currentTheme.accentHex : currentTheme.cardBorderHex,
                          color: retryActive ? currentTheme.accentTextHex : currentTheme.textPrimary
                        }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{retryActive ? 'Cancel Retry' : 'Retry Mistake'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={coachLoadingPly === currentMoveIdx}
                      onClick={() => handleAskCoachAboutMove()}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition hover:opacity-85 disabled:opacity-50 whitespace-nowrap"
                      style={{
                        backgroundColor: `${currentTheme.accentHex}15`,
                        borderColor: `${currentTheme.accentHex}45`,
                        color: currentTheme.accentHex
                      }}
                    >
                      {coachLoadingPly === currentMoveIdx ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {coachLoadingPly === currentMoveIdx
                          ? 'Analyzing...'
                          : activeCoachDetail
                          ? 'Refresh Coach Insight'
                          : 'Explain Deeper with AI'}
                      </span>
                    </button>
                  </div>

                  {/* Custom Follow-up Question */}
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      const q = coachQuestion.trim();
                      if (!q) return;
                      setCoachQuestion('');
                      handleAskCoachAboutMove(q);
                    }}
                    className="flex gap-1.5 pt-1"
                  >
                    <input
                      type="text"
                      value={coachQuestion}
                      onChange={e => setCoachQuestion(e.target.value)}
                      placeholder="Ask Coach about this position..."
                      aria-label="Ask Coach about this move"
                      className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border text-[11px] focus:outline-none"
                      style={{
                        backgroundColor: currentTheme.cardHex,
                        borderColor: currentTheme.cardBorderHex,
                        color: currentTheme.textPrimary
                      }}
                    />
                    <button
                      type="submit"
                      disabled={coachLoadingPly === currentMoveIdx || !coachQuestion.trim()}
                      aria-label="Send question to Coach"
                      className="px-2.5 py-1.5 rounded-lg font-bold text-[11px] disabled:opacity-40 transition"
                      style={{
                        backgroundColor: currentTheme.accentHex,
                        color: currentTheme.accentTextHex
                      }}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              ) : (
                currentAnalysis.bestMoveSan &&
                currentAnalysis.classification !== 'best' &&
                currentAnalysis.classification !== 'brilliant' && (
                  <div
                    className="text-xs p-3 rounded-lg"
                    style={{
                      backgroundColor: currentTheme.cardSecondaryHex,
                      border: `1px solid ${currentTheme.cardBorderHex}`
                    }}
                  >
                    <div className="font-semibold mb-1" style={{ color: currentTheme.accentHex }}>
                      Best Move: <strong className="font-mono">{currentAnalysis.bestMoveSan}</strong>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: currentTheme.textMutedHex }}>
                      {currentAnalysis.commentary || meta.shortDesc}
                    </p>
                  </div>
                )
              )}

              {retryActive && (
                <div
                  className="text-xs font-medium p-2.5 rounded-lg"
                  style={{
                    backgroundColor: `${currentTheme.accentHex}15`,
                    border: `1px solid ${currentTheme.accentHex}40`,
                    color: currentTheme.textPrimary
                  }}
                >
                  Retry mode active: play the better move directly on the board!
                </div>
              )}

              {retryFeedback && (
                <div
                  className="text-xs font-medium p-2.5 rounded-lg"
                  style={{
                    backgroundColor: retryFeedback.ok ? 'rgba(16, 185, 129, 0.14)' : 'rgba(245, 158, 11, 0.14)',
                    border: `1px solid ${retryFeedback.ok ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                    color: currentTheme.textPrimary
                  }}
                >
                  {retryFeedback.text}
                </div>
              )}
            </div>
          )}

          {/* Stepper & Key Moments Controls */}
          <div
            className="flex flex-col gap-2 p-2.5 rounded-xl"
            style={{
              backgroundColor: currentTheme.cardHex,
              border: `1px solid ${currentTheme.cardBorderHex}`
            }}
          >
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => jumpToPly(0)}
                disabled={currentMoveIdx === 0}
                aria-label="First move"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
                style={{ backgroundColor: currentTheme.cardSecondaryHex, color: currentTheme.textPrimary }}
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => jumpToPly(currentMoveIdx - 1)}
                disabled={currentMoveIdx === 0}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg disabled:opacity-40 transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: currentTheme.cardSecondaryHex, color: currentTheme.textPrimary }}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <span className="text-xs font-mono tabular-nums px-2" style={{ color: currentTheme.textMutedHex }}>
                {currentMoveIdx + 1} / {Math.max(1, enrichedMoves.length)}
              </span>
              <button
                type="button"
                onClick={() => jumpToPly(currentMoveIdx + 1)}
                disabled={currentMoveIdx >= enrichedMoves.length - 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg disabled:opacity-40 transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: currentTheme.cardSecondaryHex, color: currentTheme.textPrimary }}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => jumpToPly(enrichedMoves.length - 1)}
                disabled={currentMoveIdx >= enrichedMoves.length - 1}
                aria-label="Last move"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
                style={{ backgroundColor: currentTheme.cardSecondaryHex, color: currentTheme.textPrimary }}
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            {keyMomentIndices.length > 0 && (
              <div className="flex items-center justify-between gap-2 pt-2 border-t text-[11px]" style={{ borderColor: currentTheme.cardBorderHex }}>
                <button
                  type="button"
                  disabled={prevKeyMoment === undefined}
                  onClick={() => prevKeyMoment !== undefined && jumpToPly(prevKeyMoment)}
                  className="flex-1 py-1 px-2 rounded-lg font-semibold border disabled:opacity-35 transition whitespace-nowrap"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    borderColor: currentTheme.cardBorderHex,
                    color: currentTheme.textPrimary
                  }}
                >
                  Prev Key Moment
                </button>
                <button
                  type="button"
                  disabled={nextKeyMoment === undefined}
                  onClick={() => nextKeyMoment !== undefined && jumpToPly(nextKeyMoment)}
                  className="flex-1 py-1 px-2 rounded-lg font-semibold border disabled:opacity-35 transition whitespace-nowrap"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    borderColor: currentTheme.cardBorderHex,
                    color: currentTheme.accentHex
                  }}
                >
                  Next Key Moment ({keyMomentIndices.length})
                </button>
              </div>
            )}
          </div>

          {/* Clickable 2-Column Move List with Classification Icons */}
          <div
            className="p-4 rounded-xl flex flex-col gap-2"
            style={{
              backgroundColor: currentTheme.cardHex,
              border: `1px solid ${currentTheme.cardBorderHex}`
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textMutedHex }}>
                Move List &amp; Evaluation Icons
              </h3>
              <span className="text-[11px] font-mono tabular-nums" style={{ color: currentTheme.textMutedHex }}>
                {enrichedMoves.length} ply
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 font-mono text-xs tabular-nums">
              {Array.from({ length: Math.ceil(enrichedMoves.length / 2) }).map((_, pairIdx) => {
                const wIdx = pairIdx * 2;
                const bIdx = pairIdx * 2 + 1;
                const wMove = enrichedMoves[wIdx];
                const bMove = enrichedMoves[bIdx];
                return (
                  <div
                    key={pairIdx}
                    className="grid grid-cols-12 items-center py-1 px-1.5 rounded"
                    style={{ backgroundColor: pairIdx % 2 === 1 ? currentTheme.surfaceHoverHex : 'transparent' }}
                  >
                    <span className="col-span-2 font-bold" style={{ color: currentTheme.textMutedHex }}>
                      {pairIdx + 1}.
                    </span>
                    <button
                      type="button"
                      onClick={() => jumpToPly(wIdx)}
                      className="col-span-5 flex items-center gap-1.5 text-left font-bold px-1.5 py-0.5 rounded transition"
                      style={{
                        backgroundColor: currentMoveIdx === wIdx ? `${currentTheme.accentHex}25` : 'transparent',
                        color: currentMoveIdx === wIdx ? currentTheme.accentHex : currentTheme.textPrimary
                      }}
                    >
                      {wMove && <MoveClassificationBadge type={wMove.classification} size="xs" />}
                      <span className="truncate">{wMove?.san}</span>
                    </button>
                    {bMove ? (
                      <button
                        type="button"
                        onClick={() => jumpToPly(bIdx)}
                        className="col-span-5 flex items-center gap-1.5 text-left font-bold px-1.5 py-0.5 rounded transition"
                        style={{
                          backgroundColor: currentMoveIdx === bIdx ? `${currentTheme.accentHex}25` : 'transparent',
                          color: currentMoveIdx === bIdx ? currentTheme.accentHex : currentTheme.textSecondary
                        }}
                      >
                        <MoveClassificationBadge type={bMove.classification} size="xs" />
                        <span className="truncate">{bMove.san}</span>
                      </button>
                    ) : (
                      <span className="col-span-5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Classification Breakdown */}
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: currentTheme.cardHex,
              border: `1px solid ${currentTheme.cardBorderHex}`
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textMutedHex }}>
                Move Quality Breakdown
              </h3>
              <span className="text-[10px] font-mono uppercase" style={{ color: currentTheme.textMutedHex }}>
                W / B
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              {CLASSIFICATION_ORDER.map(type => {
                const typeMeta = CLASSIFICATION_META[type];
                const wCount = whiteStats[type] || 0;
                const bCount = blackStats[type] || 0;
                if (wCount === 0 && bCount === 0) return null;

                return (
                  <div
                    key={type}
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-lg"
                    style={{ backgroundColor: currentTheme.cardSecondaryHex }}
                  >
                    <div className="flex items-center gap-2">
                      <MoveClassificationBadge type={type} size="sm" />
                      <span className="font-medium" style={{ color: currentTheme.textPrimary }}>
                        {typeMeta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono font-bold tabular-nums text-xs">
                      <span style={{ color: currentTheme.textPrimary }}>{wCount}</span>
                      <span style={{ color: currentTheme.cardBorderHex }}>/</span>
                      <span style={{ color: currentTheme.textMutedHex }}>{bCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
