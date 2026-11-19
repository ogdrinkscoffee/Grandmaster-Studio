import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { Check, ChevronRight, Flag, Lightbulb, Loader2, RotateCcw, Star, Target, X } from 'lucide-react';
import { ChessBoard, getBoardMaxWidthPx } from './ChessBoard';
import { useAppTheme } from '../context/ThemeContext';
import { sounds } from '../utils/sound';
import { engineGetAIMove, engineSearch } from '../engine/engineClient';
import {
  DRILL_OPPONENT,
  DrillOutcome,
  DrillProgress,
  ENDGAME_DRILLS,
  EndgameDrill,
  evaluateDrill,
  loadDrillProgress,
  saveDrillProgress,
  starsFor
} from '../engine/endgameDrills';

interface PlayedMove {
  from: string;
  to: string;
  promotion?: string;
}

const MIN_REPLY_DELAY_MS = 300;

function replay(fen: string, moves: PlayedMove[]): Chess {
  const board = new Chess(fen);
  for (const m of moves) board.move(m);
  return board;
}

function playSound(san: string) {
  if (san.includes('#') || san.includes('+')) sounds.playCheck();
  else if (san.includes('=')) sounds.playPromote();
  else if (san.includes('x')) sounds.playCapture();
  else sounds.playMove();
}

const GOAL_LABEL: Record<EndgameDrill['goal'], string> = {
  mate: 'Checkmate',
  promote: 'Promote the pawn',
  draw: 'Hold the draw'
};

const DIFFICULTY_COLOR: Record<EndgameDrill['difficulty'], string> = {
  Basic: '#10b981',
  Intermediate: '#f59e0b',
  Advanced: '#f43f5e'
};

export const EndgameDrills: React.FC = () => {
  const { theme, settings } = useAppTheme();
  const [drillId, setDrillId] = useState(ENDGAME_DRILLS[0].id);
  const [moves, setMoves] = useState<PlayedMove[]>([]);
  const [userMoves, setUserMoves] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintArrow, setHintArrow] = useState<{ from: Square; to: Square } | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isHinting, setIsHinting] = useState(false);
  const [outcome, setOutcome] = useState<DrillOutcome>(null);
  const [earnedStars, setEarnedStars] = useState(0);
  const [progress, setProgress] = useState<Record<string, DrillProgress>>(() => loadDrillProgress());
  // Incremented on every restart so late engine replies from an old attempt are ignored
  const attemptRef = useRef(0);

  const drill = ENDGAME_DRILLS.find(d => d.id === drillId) ?? ENDGAME_DRILLS[0];
  const board = useMemo(() => replay(drill.fen, moves), [drill, moves]);
  const isUserTurn = !outcome && !isThinking && board.turn() === drill.side;

  const finish = (result: NonNullable<DrillOutcome>, movesMade: number) => {
    setOutcome(result);
    setHintArrow(null);
    if (result.status === 'success') {
      const stars = starsFor(drill, movesMade, hintsUsed);
      setEarnedStars(stars);
      sounds.playPuzzleSuccess();
      setProgress(prev => {
        const current = prev[drill.id] ?? { bestStars: 0, completions: 0 };
        const next = {
          ...prev,
          [drill.id]: { bestStars: Math.max(current.bestStars, stars), completions: current.completions + 1 }
        };
        saveDrillProgress(next);
        return next;
      });
    } else {
      sounds.playBlunder();
    }
  };

  const engineReply = (position: Chess, history: PlayedMove[], movesMade: number) => {
    const attempt = attemptRef.current;
    setIsThinking(true);
    const started = Date.now();
    engineGetAIMove(position, DRILL_OPPONENT)
      .then(reply => {
        const wait = Math.max(0, MIN_REPLY_DELAY_MS - (Date.now() - started));
        window.setTimeout(() => {
          if (attempt !== attemptRef.current) return;
          setIsThinking(false);
          if (!reply) return;
          const nextHistory = [...history, { from: reply.from, to: reply.to, promotion: reply.promotion }];
          const after = replay(drill.fen, nextHistory);
          playSound(reply.san);
          setMoves(nextHistory);
          const result = evaluateDrill(drill, after, movesMade, reply.promotion ? reply.color : null);
          if (result) finish(result, movesMade);
        }, wait);
      })
      .catch(() => {
        if (attempt === attemptRef.current) setIsThinking(false);
      });
  };

  const restart = () => {
    attemptRef.current += 1;
    setMoves([]);
    setUserMoves(0);
    setHintsUsed(0);
    setHintArrow(null);
    setIsThinking(false);
    setIsHinting(false);
    setOutcome(null);
    setEarnedStars(0);
    const start = new Chess(drill.fen);
    if (start.turn() !== drill.side) engineReply(start, [], 0);
  };

  useEffect(() => {
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drillId]);

  useEffect(() => () => {
    attemptRef.current += 1;
  }, []);

  const handleMove = ({ from, to, promotion }: { from: Square; to: Square; promotion?: string }) => {
    if (!isUserTurn) return false;
    let san: string;
    let promoted: string | undefined;
    try {
      const probe = new Chess(board.fen());
      const m = probe.move({ from, to, promotion: promotion || 'q' });
      san = m.san;
      promoted = m.promotion;
    } catch {
      return false;
    }
    const nextHistory = [...moves, { from, to, promotion: promoted }];
    const after = replay(drill.fen, nextHistory);
    const movesMade = userMoves + 1;
    playSound(san);
    setMoves(nextHistory);
    setUserMoves(movesMade);
    setHintArrow(null);

    const result = evaluateDrill(drill, after, movesMade, promoted ? drill.side : null);
    if (result) finish(result, movesMade);
    else engineReply(after, nextHistory, movesMade);
    return true;
  };

  const requestHint = () => {
    if (!isUserTurn || isHinting) return;
    const attempt = attemptRef.current;
    const fenAtRequest = board.fen();
    setIsHinting(true);
    engineSearch(board, 6, 1200)
      .then(result => {
        if (attempt !== attemptRef.current || board.fen() !== fenAtRequest) return;
        if (result.bestMove) {
          setHintArrow({ from: result.bestMove.from as Square, to: result.bestMove.to as Square });
          setHintsUsed(h => h + 1);
        }
      })
      .catch(() => {
        /* hint unavailable */
      })
      .finally(() => {
        if (attempt === attemptRef.current) setIsHinting(false);
      });
  };

  const goToNext = () => {
    const idx = ENDGAME_DRILLS.findIndex(d => d.id === drill.id);
    setDrillId(ENDGAME_DRILLS[(idx + 1) % ENDGAME_DRILLS.length].id);
  };

  const plateMaxWidth = `${getBoardMaxWidthPx(settings.boardSize)}px`;
  const counterText =
    drill.goal === 'draw'
      ? `Survive ${Math.min(userMoves, drill.surviveMoves ?? 0)}/${drill.surviveMoves}`
      : `Moves ${userMoves} · par ${drill.par}`;

  const renderStars = (count: number, size = 'w-3 h-3') => (
    <span className="inline-flex items-center gap-0.5" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map(i => (
        <Star
          key={i}
          className={size}
          style={{ color: i < count ? '#f59e0b' : theme.textMutedHex }}
          fill={i < count ? '#f59e0b' : 'none'}
        />
      ))}
    </span>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Board */}
      <div className="lg:col-span-7 flex flex-col items-center gap-2.5">
        <div
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs font-semibold"
          style={{ maxWidth: plateMaxWidth, backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
        >
          <span className="flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
            {isThinking && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: theme.accentHex }} />}
            {outcome ? (outcome.status === 'success' ? 'Drill complete' : 'Drill failed') : isThinking ? 'Engine is thinking…' : 'Your move'}
          </span>
          <span className="font-mono tabular-nums" style={{ color: theme.accentHex }}>
            {counterText}
          </span>
        </div>
        <ChessBoard
          chess={board}
          isFlipped={drill.side === 'b'}
          playerColor={drill.side}
          premoveMode="off"
          bestMoveArrow={hintArrow}
          onMakeMove={handleMove}
          disabled={!isUserTurn}
        />
      </div>

      {/* Panel */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="rounded-xl p-4 flex flex-col gap-3" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                <span style={{ color: DIFFICULTY_COLOR[drill.difficulty] }}>{drill.difficulty.toUpperCase()}</span>
                <span style={{ color: theme.textMutedHex }}>· YOU PLAY {drill.side === 'w' ? 'WHITE' : 'BLACK'}</span>
              </div>
              <h2 className="font-display text-base font-bold leading-tight mt-0.5" style={{ color: theme.textPrimary }}>
                {drill.name}
              </h2>
            </div>
            {renderStars(progress[drill.id]?.bestStars ?? 0, 'w-4 h-4')}
          </div>

          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold"
            style={{ backgroundColor: `${theme.accentHex}14`, color: theme.accentHex, border: `1px solid ${theme.accentHex}33` }}
          >
            <Target className="w-4 h-4 shrink-0" />
            <span>
              Goal: {GOAL_LABEL[drill.goal]}
              {drill.goal === 'draw' ? ` — survive ${drill.surviveMoves} moves` : ` — par ${drill.par} moves for ★★★`}
            </span>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
            {drill.summary}
          </p>
          <ul className="flex flex-col gap-1">
            {drill.tips.map(tip => (
              <li key={tip} className="text-[11px] flex gap-1.5" style={{ color: theme.textMutedHex }}>
                <span style={{ color: theme.accentHex }}>•</span>
                {tip}
              </li>
            ))}
          </ul>

          {outcome && (
            <div
              role="status"
              className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-bold"
              style={{
                backgroundColor: outcome.status === 'success' ? '#10b98114' : '#f43f5e14',
                color: outcome.status === 'success' ? '#10b981' : '#f43f5e',
                border: `1px solid ${outcome.status === 'success' ? '#10b98144' : '#f43f5e44'}`
              }}
            >
              <span className="flex items-center gap-1.5">
                {outcome.status === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {outcome.reason}
              </span>
              {outcome.status === 'success' && renderStars(earnedStars, 'w-3.5 h-3.5')}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: theme.textMutedHex }}>
            <span>Hints used: {hintsUsed} (−1★ each)</span>
            <span>Completed: {progress[drill.id]?.completions ?? 0}×</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={restart}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition hover:opacity-80"
              style={{ borderColor: theme.cardBorderHex, color: theme.textPrimary }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restart
            </button>
            {!outcome ? (
              <button
                type="button"
                onClick={requestHint}
                disabled={!isUserTurn || isHinting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition hover:opacity-80 disabled:opacity-40"
                style={{ borderColor: theme.cardBorderHex, color: theme.textPrimary }}
              >
                {isHinting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
                Hint
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNext}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition hover:opacity-90"
                style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
              >
                Next drill
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Drill list */}
        <div className="rounded-xl p-2 flex flex-col gap-1" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
          {ENDGAME_DRILLS.map(d => {
            const selected = d.id === drill.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDrillId(d.id)}
                className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition"
                style={{
                  backgroundColor: selected ? `${theme.accentHex}1f` : 'transparent',
                  border: `1px solid ${selected ? `${theme.accentHex}66` : 'transparent'}`
                }}
              >
                <span className="min-w-0 flex items-center gap-2">
                  <Flag className="w-3.5 h-3.5 shrink-0" style={{ color: DIFFICULTY_COLOR[d.difficulty] }} />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold truncate" style={{ color: selected ? theme.accentHex : theme.textPrimary }}>
                      {d.name}
                    </span>
                    <span className="block text-[10px] font-mono" style={{ color: theme.textMutedHex }}>
                      {d.difficulty} · {GOAL_LABEL[d.goal]}
                    </span>
                  </span>
                </span>
                {renderStars(progress[d.id]?.bestStars ?? 0)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
