import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { User } from 'firebase/auth';
import {
  Globe,
  Swords,
  Clock,
  Copy,
  Check,
  XCircle,
  Trophy,
  Users,
  Eye,
  Flag,
  Handshake,
  Undo2,
  FlipVertical2,
  Send,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Link2,
  Microscope,
  RotateCcw
} from 'lucide-react';
import {
  GameHistoryItem,
  PieceColor,
  UserSettings
} from '../types/chess';
import {
  ONLINE_TIME_CONTROL_PRESETS,
  OnlineChatMessageDoc,
  OnlineMatchDoc,
  OnlinePlayerPublic,
  OnlineTimeControlSpec,
  SPORTSMANSHIP_QUICK_CHATS,
  buildAnyOnlineTimeControl,
  computeLiveClockMs,
  formatOnlineClock,
  getEloBucketForTimeControl
} from '../engine/onlineClassic';
import {
  cancelOnlineMatch,
  claimOnlineTimeout,
  commitOwnOnlineEloForMatch,
  createOnlineClassicMatch,
  createOnlineRematch,
  fetchOnlineLeaderboard,
  findMatchByInviteCode,
  findOrCreateQuickMatch,
  joinOnlineClassicMatch,
  offerOrRespondDraw,
  offerOrRespondTakeback,
  resignOnlineMatch,
  sendMatchChatMessage,
  submitOnlineMove,
  subscribeActivePublicMatches,
  subscribeMatchById,
  subscribeMatchChat,
  subscribeWaitingMatches
} from '../services/onlineChessService';
import { ChessBoard, QueuedPremove } from './ChessBoard';
import { useAppTheme } from '../context/ThemeContext';
import { sounds } from '../utils/sound';
import { detectOpening } from '../engine/openings';

interface OnlinePlayPanelProps {
  firebaseUser: User | null;
  publicProfile: OnlinePlayerPublic | null;
  settings: UserSettings;
  pendingChallengeCode?: string | null;
  onConsumeChallengeCode?: () => void;
  onOpenAuthModal: () => void;
  onSaveOnlineGame: (game: GameHistoryItem) => void;
  onRunGameReview: (game: GameHistoryItem) => void;
  onOnlineEloUpdated?: (bucket: 'bullet' | 'blitz' | 'rapid', elo: number) => void;
}

export const OnlinePlayPanel: React.FC<OnlinePlayPanelProps> = ({
  firebaseUser,
  publicProfile,
  settings,
  pendingChallengeCode,
  onConsumeChallengeCode,
  onOpenAuthModal,
  onSaveOnlineGame,
  onRunGameReview,
  onOnlineEloUpdated
}) => {
  const { theme } = useAppTheme();

  // Lobby Configuration (Classic variant only, ANY timestamp/time control)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rapid_10_0');
  const [useCustomTime, setUseCustomTime] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<number>(10);
  const [customIncrement, setCustomIncrement] = useState<number>(5);
  const [customUnlimited, setCustomUnlimited] = useState<boolean>(false);
  const [colorPref, setColorPref] = useState<'w' | 'b' | 'random'>('random');
  const [rated, setRated] = useState<boolean>(true);
  const [inviteCodeInput, setInviteCodeInput] = useState<string>('');
  const [lobbySubTab, setLobbySubTab] = useState<'seeks' | 'watch' | 'leaderboard'>('seeks');

  // Lobby Live Data
  const [waitingMatches, setWaitingMatches] = useState<OnlineMatchDoc[]>([]);
  const [activeMatches, setActiveMatches] = useState<OnlineMatchDoc[]>([]);
  const [leaderboard, setLeaderboard] = useState<OnlinePlayerPublic[]>([]);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [lobbyError, setLobbyError] = useState<string | null>(null);

  // Active Room State
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [activeMatch, setActiveMatch] = useState<OnlineMatchDoc | null>(null);
  const [chatMessages, setChatMessages] = useState<OnlineChatMessageDoc[]>([]);
  const [chatDraft, setChatDraft] = useState<string>('');
  const [copiedInvite, setCopiedInvite] = useState<boolean>(false);
  const [manualFlip, setManualFlip] = useState<boolean>(false);
  const [confirmResign, setConfirmResign] = useState<boolean>(false);
  const [premoves, setPremoves] = useState<QueuedPremove[]>([]);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [viewPly, setViewPly] = useState<number | null>(null);

  const recordedFinishedIdsRef = useRef<Set<string>>(new Set());
  const prevMovesCountRef = useRef<number>(0);

  const activeTimeControl: OnlineTimeControlSpec = useMemo(() => {
    if (useCustomTime) {
      return buildAnyOnlineTimeControl(customMinutes, customIncrement, customUnlimited);
    }
    return (
      ONLINE_TIME_CONTROL_PRESETS.find(p => p.id === selectedPresetId) ||
      ONLINE_TIME_CONTROL_PRESETS[6]
    );
  }, [useCustomTime, customMinutes, customIncrement, customUnlimited, selectedPresetId]);

  // Subscribe to waiting seeks & live matches only when user is authenticated & verified
  useEffect(() => {
    if (!firebaseUser) {
      setWaitingMatches([]);
      setActiveMatches([]);
      setLeaderboard([]);
      return;
    }

    const unsubWaiting = subscribeWaitingMatches(setWaitingMatches);
    const unsubActive = subscribeActivePublicMatches(setActiveMatches);
    fetchOnlineLeaderboard()
      .then(setLeaderboard)
      .catch(() => {
        // handled quietly if leaderboard fails transiently
      });

    return () => {
      unsubWaiting();
      unsubActive();
    };
  }, [firebaseUser]);

  // Auto-join pending challenge code from ?challenge=CODE URL
  useEffect(() => {
    if (!firebaseUser || !publicProfile || !pendingChallengeCode || activeMatchId) return;
    let active = true;
    setLoadingAction(true);
    setLobbyError(null);
    findMatchByInviteCode(pendingChallengeCode)
      .then(async found => {
        if (!active) return;
        if (!found) {
          setLobbyError(`Challenge "${pendingChallengeCode}" was not found or has already closed.`);
          onConsumeChallengeCode?.();
          return;
        }
        if (found.status === 'waiting' && found.creatorId !== publicProfile.uid) {
          const joined = await joinOnlineClassicMatch(found.matchId, publicProfile);
          if (active) setActiveMatchId(joined.matchId);
        } else {
          setActiveMatchId(found.matchId);
        }
        onConsumeChallengeCode?.();
      })
      .catch(err => {
        if (active) setLobbyError(err instanceof Error ? err.message : 'Could not join invite link.');
      })
      .finally(() => {
        if (active) setLoadingAction(false);
      });

    return () => {
      active = false;
    };
  }, [firebaseUser, publicProfile, pendingChallengeCode, activeMatchId, onConsumeChallengeCode]);

  // Subscribe to active match room
  useEffect(() => {
    if (!activeMatchId || !firebaseUser) {
      setActiveMatch(null);
      setChatMessages([]);
      return;
    }
    prevMovesCountRef.current = 0;
    setPremoves([]);
    setConfirmResign(false);
    setViewPly(null);
    return subscribeMatchById(activeMatchId, setActiveMatch);
  }, [activeMatchId, firebaseUser]);

  // Subscribe to per-match chat when user is a participant
  useEffect(() => {
    if (!activeMatch || !firebaseUser) {
      setChatMessages([]);
      return;
    }
    return subscribeMatchChat(activeMatch, firebaseUser.uid, setChatMessages);
  }, [activeMatch?.matchId, activeMatch?.whiteUid, activeMatch?.blackUid, firebaseUser]);

  // High-frequency local clock display tick while an online game is active
  useEffect(() => {
    if (!activeMatch || activeMatch.status !== 'active' || activeMatch.isUnlimited) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [activeMatch]);

  // Sound + Premove execution + Finished Game Archive/Elo sync
  useEffect(() => {
    if (!activeMatch || !firebaseUser) return;

    if (activeMatch.movesCount > prevMovesCountRef.current) {
      prevMovesCountRef.current = activeMatch.movesCount;
      setViewPly(null);
      if (settings.soundEnabled) {
        if (activeMatch.status === 'finished') sounds.playVictory();
        else if (activeMatch.lastMoveSan.includes('+') || activeMatch.lastMoveSan.includes('#')) sounds.playCheck();
        else if (activeMatch.lastMoveSan.includes('x')) sounds.playCapture();
        else sounds.playMove();
      }
    }

    const myColor: PieceColor | null =
      activeMatch.whiteUid === firebaseUser.uid
        ? 'w'
        : activeMatch.blackUid === firebaseUser.uid
        ? 'b'
        : null;

    // Auto-execute queued premove when it becomes my turn
    if (
      activeMatch.status === 'active' &&
      myColor &&
      activeMatch.turn === myColor &&
      premoves.length > 0
    ) {
      const [nextPm, ...restPm] = premoves;
      setPremoves(restPm);
      submitOnlineMove({
        matchId: activeMatch.matchId,
        moverUid: firebaseUser.uid,
        from: nextPm.from,
        to: nextPm.to,
        promotion: (nextPm.promotion as 'q' | 'r' | 'b' | 'n') || 'q'
      }).catch(() => {
        setPremoves([]);
      });
    }

    // Commit Elo + local history once when finished
    if (
      activeMatch.status === 'finished' &&
      myColor &&
      !recordedFinishedIdsRef.current.has(activeMatch.matchId)
    ) {
      recordedFinishedIdsRef.current.add(activeMatch.matchId);
      const historyItem: GameHistoryItem = {
        id: `online_${activeMatch.matchId}`,
        date: new Date().toISOString().split('T')[0],
        variant: 'standard',
        playerColor: myColor,
        opponentName: `${myColor === 'w' ? activeMatch.blackName : activeMatch.whiteName} (Online)`,
        opponentElo: myColor === 'w' ? activeMatch.blackElo : activeMatch.whiteElo,
        timeControl: activeMatch.timeControlLabel,
        result: activeMatch.result === '*' ? '1/2-1/2' : activeMatch.result,
        reason:
          activeMatch.reason === 'checkmate' ||
          activeMatch.reason === 'resignation' ||
          activeMatch.reason === 'timeout' ||
          activeMatch.reason === 'stalemate' ||
          activeMatch.reason === 'repetition'
            ? activeMatch.reason
            : 'draw_agreement' === activeMatch.reason || activeMatch.reason === 'insufficient'
            ? 'repetition'
            : 'abandoned',
        movesCount: activeMatch.movesCount,
        pgn: activeMatch.pgn
      };
      onSaveOnlineGame(historyItem);

      commitOwnOnlineEloForMatch(activeMatch, firebaseUser.uid)
        .then(nextElo => {
          if (typeof nextElo === 'number' && onOnlineEloUpdated) {
            const b =
              activeMatch.timeControlType === 'bullet'
                ? 'bullet'
                : activeMatch.timeControlType === 'blitz'
                ? 'blitz'
                : 'rapid';
            onOnlineEloUpdated(b, nextElo);
          }
        })
        .catch(() => {
          // Elo sync error handled via handleFirestoreError if fatal
        });
    }
  }, [activeMatch, firebaseUser, premoves, settings.soundEnabled, onSaveOnlineGame, onOnlineEloUpdated]);

  const boardChess = useMemo(() => {
    const c = new Chess();
    if (!activeMatch) return c;
    try {
      if (activeMatch.pgn.trim()) c.loadPgn(activeMatch.pgn);
      else if (activeMatch.fen) c.load(activeMatch.fen);
    } catch {
      // fallback start
    }
    return c;
  }, [activeMatch]);

  const moveHistory = useMemo(() => boardChess.history({ verbose: true }), [boardChess]);

  const displayedChess = useMemo(() => {
    if (viewPly === null || viewPly >= moveHistory.length) return boardChess;
    const replay = new Chess();
    for (let i = 0; i < viewPly; i++) {
      replay.move(moveHistory[i]);
    }
    return replay;
  }, [boardChess, moveHistory, viewPly]);

  const liveOpening = useMemo(() => {
    const sans = moveHistory.map(m => m.san);
    return detectOpening(sans);
  }, [moveHistory]);

  const liveClocks = useMemo(() => {
    if (!activeMatch) return { whiteMs: 0, blackMs: 0, activeFlagged: null as PieceColor | null };
    return computeLiveClockMs(activeMatch, nowMs);
  }, [activeMatch, nowMs]);

  const myColor: PieceColor | null =
    activeMatch && firebaseUser
      ? activeMatch.whiteUid === firebaseUser.uid
        ? 'w'
        : activeMatch.blackUid === firebaseUser.uid
        ? 'b'
        : null
      : null;

  const isSpectator = Boolean(activeMatch && !myColor);
  const boardFlipped = myColor === 'b' ? !manualFlip : manualFlip;

  const handleQuickPair = async () => {
    if (!publicProfile) {
      onOpenAuthModal();
      return;
    }
    setLoadingAction(true);
    setLobbyError(null);
    try {
      const res = await findOrCreateQuickMatch({
        player: publicProfile,
        timeControl: activeTimeControl,
        colorPref,
        rated
      });
      setActiveMatchId(res.match.matchId);
    } catch (err) {
      setLobbyError(err instanceof Error ? err.message : 'Failed to start matchmaking.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCreateChallengeLink = async () => {
    if (!publicProfile) {
      onOpenAuthModal();
      return;
    }
    setLoadingAction(true);
    setLobbyError(null);
    try {
      const created = await createOnlineClassicMatch({
        player: publicProfile,
        timeControl: activeTimeControl,
        colorPref,
        rated,
        isPublicSeek: false
      });
      setActiveMatchId(created.matchId);
    } catch (err) {
      setLobbyError(err instanceof Error ? err.message : 'Could not create private invite.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleJoinByCode = async () => {
    if (!publicProfile) {
      onOpenAuthModal();
      return;
    }
    const raw = inviteCodeInput.trim();
    if (!raw) return;
    setLoadingAction(true);
    setLobbyError(null);

    let extracted = raw;
    try {
      if (raw.includes('challenge=')) {
        const parsed = new URL(raw);
        extracted = parsed.searchParams.get('challenge') || raw;
      }
    } catch {
      // keep raw
    }

    try {
      const found = await findMatchByInviteCode(extracted);
      if (!found) {
        setLobbyError('No open Classic match matched that invite code.');
        return;
      }
      if (found.status === 'waiting' && found.creatorId !== publicProfile.uid) {
        const joined = await joinOnlineClassicMatch(found.matchId, publicProfile);
        setActiveMatchId(joined.matchId);
      } else {
        setActiveMatchId(found.matchId);
      }
      setInviteCodeInput('');
    } catch (err) {
      setLobbyError(err instanceof Error ? err.message : 'Could not join challenge.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleJoinLobbySeek = async (m: OnlineMatchDoc) => {
    if (!publicProfile) {
      onOpenAuthModal();
      return;
    }
    setLoadingAction(true);
    setLobbyError(null);
    try {
      const joined = await joinOnlineClassicMatch(m.matchId, publicProfile);
      setActiveMatchId(joined.matchId);
    } catch (err) {
      setLobbyError(err instanceof Error ? err.message : 'Challenge was already accepted.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCancelSeek = async (matchId: string) => {
    setLoadingAction(true);
    try {
      await cancelOnlineMatch(matchId);
      if (activeMatchId === matchId) {
        setActiveMatchId(null);
        setActiveMatch(null);
      }
    } catch (err) {
      setLobbyError(err instanceof Error ? err.message : 'Could not cancel seek.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleBoardMove = (move: { from: Square; to: Square; promotion?: string }): boolean => {
    if (!activeMatch || !firebaseUser || !myColor) return false;
    if (activeMatch.status !== 'active' || activeMatch.turn !== myColor || viewPly !== null) {
      return false;
    }
    const promo = (move.promotion as 'q' | 'r' | 'b' | 'n') || 'q';
    // Quick local validation for immediate UI feedback before Firebase transaction
    const testChess = new Chess(boardChess.fen());
    try {
      const res = testChess.move({ from: move.from, to: move.to, promotion: promo });
      if (!res) return false;
    } catch {
      return false;
    }

    submitOnlineMove({
      matchId: activeMatch.matchId,
      moverUid: firebaseUser.uid,
      from: move.from,
      to: move.to,
      promotion: promo
    }).catch((err: unknown) => {
      setLobbyError(err instanceof Error ? err.message : 'Move sync error.');
    });
    return true;
  };

  const handleCopyShareUrl = async (code: string) => {
    const shareUrl = `${window.location.origin}/?challenge=${encodeURIComponent(code)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2200);
    } catch {
      setLobbyError(`Share link: ${shareUrl}`);
    }
  };

  const handleSendToReview = () => {
    if (!activeMatch) return;
    const cColor: PieceColor = myColor || 'w';
    onRunGameReview({
      id: `online_${activeMatch.matchId}`,
      date: new Date().toISOString().split('T')[0],
      variant: 'standard',
      playerColor: cColor,
      opponentName: `${cColor === 'w' ? activeMatch.blackName : activeMatch.whiteName} (Online)`,
      opponentElo: cColor === 'w' ? activeMatch.blackElo : activeMatch.whiteElo,
      timeControl: activeMatch.timeControlLabel,
      result: activeMatch.result === '*' ? '1/2-1/2' : activeMatch.result,
      reason: 'checkmate',
      movesCount: activeMatch.movesCount,
      pgn: activeMatch.pgn
    });
  };

  // ---- Render: Google Sign-Up Required Gate ----
  if (!firebaseUser || !publicProfile) {
    return (
      <div
        className="max-w-3xl mx-auto rounded-2xl border p-6 sm:p-8 flex flex-col items-center text-center gap-4"
        style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${theme.accentHex}1f`, border: `1px solid ${theme.accentHex}55`, color: theme.accentHex }}
        >
          <Globe className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-lg">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: theme.accentHex }}>
            Classic Chess Only · Web &amp; Android APK Synced
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Play Real Online Classic Chess
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
            Sign in with Google to challenge real players worldwide in Classic Chess at any time control (Bullet, Blitz, Rapid, Classical, Unlimited, or custom minutes + increment), track verified Elo ratings, and play seamlessly between the website and installed Android WebAPK.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAuthModal}
          className="px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
        >
          <UserCheck className="w-4 h-4" />
          <span>Sign Up / Sign In with Google</span>
        </button>
        <p className="text-[11px] flex items-center gap-1.5" style={{ color: theme.textMutedHex }}>
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentHex }} />
          <span>Includes 13+ age check, strict PII privacy protection, and 1-click Delete Account control.</span>
        </p>
      </div>
    );
  }

  // ---- Render: Live Room View (Waiting / Active / Finished / Spectator) ----
  if (activeMatch) {
    const topIsWhite = boardFlipped;
    const topName = topIsWhite ? activeMatch.whiteName || 'Waiting…' : activeMatch.blackName || 'Waiting…';
    const topElo = topIsWhite ? activeMatch.whiteElo : activeMatch.blackElo;
    const topTimeMs = topIsWhite ? liveClocks.whiteMs : liveClocks.blackMs;
    const topTurn = activeMatch.status === 'active' && activeMatch.turn === (topIsWhite ? 'w' : 'b');

    const bottomName = topIsWhite ? activeMatch.blackName || 'Waiting…' : activeMatch.whiteName || 'Waiting…';
    const bottomElo = topIsWhite ? activeMatch.blackElo : activeMatch.whiteElo;
    const bottomTimeMs = topIsWhite ? liveClocks.blackMs : liveClocks.whiteMs;
    const bottomTurn = activeMatch.status === 'active' && activeMatch.turn === (topIsWhite ? 'b' : 'w');

    const oppColor: PieceColor | null = myColor === 'w' ? 'b' : myColor === 'b' ? 'w' : null;
    const hasIncomingDraw = Boolean(myColor && activeMatch.drawOfferBy && activeMatch.drawOfferBy === oppColor);
    const hasOutgoingDraw = Boolean(myColor && activeMatch.drawOfferBy && activeMatch.drawOfferBy === myColor);
    const hasIncomingTakeback = Boolean(myColor && activeMatch.takebackOfferBy && activeMatch.takebackOfferBy === oppColor);
    const oppFlagged = Boolean(
      myColor && !activeMatch.isUnlimited && activeMatch.status === 'active' && liveClocks.activeFlagged === oppColor
    );

    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Board & Pinned Player Plates */}
        <div className="lg:col-span-7 flex flex-col items-center gap-2.5">
          {/* Waiting Banner with Easy Cancel Button */}
          {activeMatch.status === 'waiting' && (
            <div
              className="w-full rounded-xl border p-3.5 flex flex-wrap items-center justify-between gap-3"
              style={{ backgroundColor: theme.cardHex, borderColor: `${theme.accentHex}55` }}
            >
              <div>
                <div className="font-display text-sm font-bold flex items-center gap-2" style={{ color: theme.accentHex }}>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Waiting for opponent ({activeMatch.timeControlLabel})</span>
                </div>
                <div className="text-xs font-mono mt-0.5" style={{ color: theme.textSecondary }}>
                  Invite Code: <strong style={{ color: theme.textPrimary }}>{activeMatch.inviteCode}</strong> ·{' '}
                  {activeMatch.isPublicSeek ? 'Listed in Open Classic Lobby' : 'Private Invite Link'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyShareUrl(activeMatch.inviteCode)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
                >
                  {copiedInvite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />}
                  <span>{copiedInvite ? 'Copied Link' : 'Copy Invite Link'}</span>
                </button>
                {activeMatch.creatorId === firebaseUser.uid && (
                  <button
                    type="button"
                    onClick={() => handleCancelSeek(activeMatch.matchId)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-rose-500/25 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Search</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Top Opponent Plate */}
          <div
            className="w-full max-w-[540px] rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-3"
            style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
          >
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm truncate flex items-center gap-2" style={{ color: theme.textPrimary }}>
                <span>{topName}</span>
                {activeMatch.blackUid || activeMatch.whiteUid ? (
                  <span className="font-mono text-[11px]" style={{ color: theme.textMutedHex }}>
                    ({topElo})
                  </span>
                ) : null}
              </div>
              <div className="text-[10px] font-mono" style={{ color: theme.textMutedHex }}>
                {topIsWhite ? 'White' : 'Black'} · Classic
              </div>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg font-mono font-extrabold text-sm sm:text-base tabular-nums border"
              style={
                topTurn
                  ? { backgroundColor: `${theme.accentHex}22`, borderColor: theme.accentHex, color: theme.accentHex }
                  : { backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textSecondary }
              }
            >
              {formatOnlineClock(topTimeMs, activeMatch.isUnlimited)}
            </div>
          </div>

          {/* Interactive Classic ChessBoard (Premoves active, Engine assists strictly disabled for online fair play) */}
          <ChessBoard
            chess={displayedChess}
            isFlipped={boardFlipped}
            theme={settings.boardTheme}
            pieceSet={settings.pieceSet}
            showCoordinates={settings.showCoordinates}
            disabled={isSpectator || activeMatch.status !== 'active' || viewPly !== null}
            playerColor={myColor || 'w'}
            premoveMode={myColor ? settings.premoveMode : 'off'}
            premoves={premoves}
            onQueuePremove={pm => setPremoves(prev => [...prev, pm])}
            onCancelPremoves={() => setPremoves([])}
            onMakeMove={handleBoardMove}
          />

          {/* Bottom Player Plate */}
          <div
            className="w-full max-w-[540px] rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-3"
            style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
          >
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm truncate flex items-center gap-2" style={{ color: theme.textPrimary }}>
                <span>{bottomName}</span>
                <span className="font-mono text-[11px]" style={{ color: theme.textMutedHex }}>
                  ({bottomElo})
                </span>
              </div>
              <div className="text-[10px] font-mono" style={{ color: theme.textMutedHex }}>
                {topIsWhite ? 'Black' : 'White'} · {activeMatch.rated ? 'Rated' : 'Casual'}
              </div>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg font-mono font-extrabold text-sm sm:text-base tabular-nums border"
              style={
                bottomTurn
                  ? { backgroundColor: `${theme.accentHex}22`, borderColor: theme.accentHex, color: theme.accentHex }
                  : { backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textSecondary }
              }
            >
              {formatOnlineClock(bottomTimeMs, activeMatch.isUnlimited)}
            </div>
          </div>
        </div>

        {/* Right: Controls, Moves, Draw/Takeback/Timeout & Match Chat */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* Header & Fair-Play Notice */}
          <div
            className="rounded-xl border p-4 space-y-3"
            style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: theme.accentHex }}>
                  Online Classic · {activeMatch.timeControlLabel}
                </div>
                <div className="text-xs font-semibold mt-0.5 truncate" style={{ color: theme.textSecondary }}>
                  {liveOpening ? `${liveOpening.eco} · ${liveOpening.name}` : 'Classic Starting Position'}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setManualFlip(v => !v)}
                  title="Flip Board"
                  className="p-2 rounded-lg border hover:opacity-80 cursor-pointer"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textSecondary }}
                >
                  <FlipVertical2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMatchId(null);
                    setActiveMatch(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border text-xs font-bold hover:opacity-85 cursor-pointer"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
                >
                  Lobby
                </button>
              </div>
            </div>

            {activeMatch.status === 'finished' && (
              <div
                className="p-3 rounded-xl border space-y-2"
                style={{ backgroundColor: `${theme.accentHex}15`, borderColor: `${theme.accentHex}55` }}
              >
                <div className="font-display font-extrabold text-sm" style={{ color: theme.textPrimary }}>
                  Result: {activeMatch.result} ({activeMatch.reason.replace('_', ' ')})
                </div>
                <div className="flex flex-wrap gap-2">
                  {myColor && !activeMatch.rematchMatchId && (
                    <button
                      type="button"
                      onClick={async () => {
                        const r = await createOnlineRematch(activeMatch, publicProfile);
                        setActiveMatchId(r.matchId);
                      }}
                      className="px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                      style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rematch</span>
                    </button>
                  )}
                  {activeMatch.rematchMatchId && (
                    <button
                      type="button"
                      onClick={() => setActiveMatchId(activeMatch.rematchMatchId)}
                      className="px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                      style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Join Rematch</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSendToReview}
                    className="px-3 py-1.5 rounded-lg border font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
                  >
                    <Microscope className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                    <span>Analyze Game</span>
                  </button>
                </div>
              </div>
            )}

            {/* Incoming Draw / Takeback Prompts */}
            {hasIncomingDraw && (
              <div className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-amber-300">Opponent offers a draw</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => offerOrRespondDraw(activeMatch.matchId, firebaseUser.uid, 'accept')}
                    className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => offerOrRespondDraw(activeMatch.matchId, firebaseUser.uid, 'decline')}
                    className="px-2.5 py-1 rounded border border-white/20 text-slate-200 font-semibold cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {hasIncomingTakeback && (
              <div className="p-2.5 rounded-xl border border-sky-500/40 bg-sky-500/10 flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-sky-300">Opponent requests a takeback</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => offerOrRespondTakeback(activeMatch.matchId, firebaseUser.uid, 'accept')}
                    className="px-2.5 py-1 rounded bg-sky-500 text-slate-950 font-bold cursor-pointer"
                  >
                    Allow
                  </button>
                  <button
                    type="button"
                    onClick={() => offerOrRespondTakeback(activeMatch.matchId, firebaseUser.uid, 'decline')}
                    className="px-2.5 py-1 rounded border border-white/20 text-slate-200 font-semibold cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {oppFlagged && (
              <button
                type="button"
                onClick={() => claimOnlineTimeout(activeMatch.matchId)}
                className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-amber-500 text-slate-950 hover:opacity-90 cursor-pointer"
              >
                Opponent Time Expired · Claim Victory
              </button>
            )}

            {/* Match Controls */}
            {activeMatch.status === 'active' && myColor && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={hasOutgoingDraw}
                  onClick={() => offerOrRespondDraw(activeMatch.matchId, firebaseUser.uid, 'offer')}
                  className="flex-1 py-2 px-2.5 rounded-lg border text-xs font-bold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
                >
                  <Handshake className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                  <span>{hasOutgoingDraw ? 'Draw Sent' : 'Offer Draw'}</span>
                </button>

                <button
                  type="button"
                  disabled={activeMatch.movesCount < 1 || activeMatch.takebackOfferBy === myColor}
                  onClick={() => offerOrRespondTakeback(activeMatch.matchId, firebaseUser.uid, 'offer')}
                  className="flex-1 py-2 px-2.5 rounded-lg border text-xs font-bold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
                >
                  <Undo2 className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                  <span>Takeback</span>
                </button>

                {!confirmResign ? (
                  <button
                    type="button"
                    onClick={() => setConfirmResign(true)}
                    className="py-2 px-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Resign</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => resignOnlineMatch(activeMatch.matchId, firebaseUser.uid)}
                    className="py-2 px-3 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Confirm Resign
                  </button>
                )}
              </div>
            )}

            <div className="text-[10px] flex items-center gap-1.5" style={{ color: theme.textMutedHex }}>
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentHex }} />
              <span>Engine hints &amp; live eval disabled during human online games per Fair Play Rules.</span>
            </div>
          </div>

          {/* Moves List */}
          <div
            className="rounded-xl border p-4 space-y-2"
            style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Moves ({moveHistory.length} ply)</span>
              {viewPly !== null && (
                <button
                  type="button"
                  onClick={() => setViewPly(null)}
                  className="text-[11px] font-bold underline cursor-pointer"
                  style={{ color: theme.accentHex }}
                >
                  Jump to Live
                </button>
              )}
            </div>
            <div className="max-h-36 overflow-y-auto text-xs font-mono grid grid-cols-2 gap-1 pr-1">
              {moveHistory.map((m, idx) => (
                <button
                  key={`${idx}-${m.san}`}
                  type="button"
                  onClick={() => setViewPly(idx + 1)}
                  className="text-left px-2 py-1 rounded hover:opacity-85 cursor-pointer"
                  style={
                    (viewPly === idx + 1) || (viewPly === null && idx === moveHistory.length - 1)
                      ? { backgroundColor: `${theme.accentHex}22`, color: theme.accentHex }
                      : { color: theme.textSecondary }
                  }
                >
                  {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : ''}
                  {m.san}
                </button>
              ))}
              {moveHistory.length === 0 && (
                <div className="col-span-2 text-xs italic" style={{ color: theme.textMutedHex }}>
                  Game starts on White&apos;s first move.
                </div>
              )}
            </div>
          </div>

          {/* Match Chat (Participants only) */}
          {myColor && (
            <div
              className="rounded-xl border p-4 space-y-2.5"
              style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
            >
              <div className="font-bold text-xs">Match Chat</div>
              <div className="flex flex-wrap gap-1.5">
                {SPORTSMANSHIP_QUICK_CHATS.map(qText => (
                  <button
                    key={qText}
                    type="button"
                    onClick={() => sendMatchChatMessage(activeMatch, publicProfile, qText)}
                    className="px-2 py-1 rounded-md border text-[10px] font-semibold hover:opacity-85 cursor-pointer"
                    style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textSecondary }}
                  >
                    {qText}
                  </button>
                ))}
              </div>
              <div
                className="max-h-32 overflow-y-auto space-y-1.5 p-2 rounded-lg text-xs"
                style={{ backgroundColor: theme.cardSecondaryHex }}
              >
                {chatMessages.length === 0 ? (
                  <div className="text-[11px] italic" style={{ color: theme.textMutedHex }}>
                    Say hello or send a quick greeting above.
                  </div>
                ) : (
                  chatMessages.map(msg => (
                    <div key={msg.messageId}>
                      <span className="font-bold" style={{ color: msg.senderUid === firebaseUser.uid ? theme.accentHex : theme.textPrimary }}>
                        {msg.senderName}:{' '}
                      </span>
                      <span style={{ color: theme.textSecondary }}>{msg.text}</span>
                    </div>
                  ))
                )}
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!chatDraft.trim()) return;
                  sendMatchChatMessage(activeMatch, publicProfile, chatDraft);
                  setChatDraft('');
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  maxLength={160}
                  value={chatDraft}
                  onChange={e => setChatDraft(e.target.value)}
                  placeholder="Write a respectful message..."
                  className="flex-1 rounded-lg px-2.5 py-1.5 text-xs"
                  style={{
                    backgroundColor: theme.cardSecondaryHex,
                    border: `1px solid ${theme.cardBorderHex}`,
                    color: theme.textPrimary
                  }}
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="p-2 rounded-lg cursor-pointer"
                  style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- Render: Online Classic Lobby ----
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {lobbyError && (
        <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300 flex items-center justify-between gap-2">
          <span>{lobbyError}</span>
          <button type="button" onClick={() => setLobbyError(null)} className="font-bold underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Pairing & Any Timestamp Selector */}
        <div
          className="lg:col-span-5 rounded-2xl border p-5 space-y-4"
          style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: theme.accentHex }}>
                Classic Chess Only
              </div>
              <h2 className="font-display text-lg font-extrabold" style={{ color: theme.textPrimary }}>
                Online Matchmaking
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-2.5 py-1 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
            >
              <Users className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
              <span>{publicProfile.username}</span>
            </button>
          </div>

          {/* Preset vs Any Custom Time Control */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[11px]" style={{ color: theme.textSecondary }}>
                Time Control (Any Timestamp)
              </span>
              <button
                type="button"
                onClick={() => setUseCustomTime(v => !v)}
                className="text-xs font-bold hover:underline cursor-pointer"
                style={{ color: theme.accentHex }}
              >
                {useCustomTime ? 'Use Quick Presets' : 'Custom Any Time'}
              </button>
            </div>

            {!useCustomTime ? (
              <div className="grid grid-cols-3 gap-1.5">
                {ONLINE_TIME_CONTROL_PRESETS.map(preset => {
                  const selected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPresetId(preset.id)}
                      className="px-2 py-2 rounded-lg border text-[11px] font-bold transition text-center cursor-pointer"
                      style={
                        selected
                          ? { backgroundColor: `${theme.accentHex}22`, borderColor: theme.accentHex, color: theme.accentHex }
                          : { backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }
                      }
                    >
                      {preset.label.split(' ')[0]}
                      <div className="text-[9px] font-normal opacity-75">
                        {preset.type.charAt(0).toUpperCase() + preset.type.slice(1)}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div
                className="p-3.5 rounded-xl border space-y-3 text-xs"
                style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
              >
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span className="font-semibold">Unlimited / Untimed Game</span>
                  <input
                    type="checkbox"
                    checked={customUnlimited}
                    onChange={e => setCustomUnlimited(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                    style={{ accentColor: theme.accentHex }}
                  />
                </label>

                {!customUnlimited && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase mb-1" style={{ color: theme.textMutedHex }}>
                        Base Minutes (0.25–180)
                      </label>
                      <input
                        type="number"
                        min={0.25}
                        max={180}
                        step={0.5}
                        value={customMinutes}
                        onChange={e => setCustomMinutes(Number(e.target.value))}
                        className="w-full rounded-lg px-2.5 py-1.5 font-mono text-xs"
                        style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}`, color: theme.textPrimary }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase mb-1" style={{ color: theme.textMutedHex }}>
                        Increment Sec (0–180)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={180}
                        step={1}
                        value={customIncrement}
                        onChange={e => setCustomIncrement(Number(e.target.value))}
                        className="w-full rounded-lg px-2.5 py-1.5 font-mono text-xs"
                        style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}`, color: theme.textPrimary }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-[11px] font-mono" style={{ color: theme.accentHex }}>
                  Configured: <strong>{activeTimeControl.label}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Side & Rated */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase mb-1" style={{ color: theme.textMutedHex }}>
                Side
              </div>
              <div className="grid grid-cols-3 gap-1 p-1 rounded-lg border" style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}>
                {(['w', 'random', 'b'] as const).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColorPref(c)}
                    className="py-1 rounded text-[11px] font-bold cursor-pointer"
                    style={
                      colorPref === c
                        ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                        : { color: theme.textSecondary }
                    }
                  >
                    {c === 'w' ? 'White' : c === 'b' ? 'Black' : 'Rand'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase mb-1" style={{ color: theme.textMutedHex }}>
                Match Mode
              </div>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-lg border" style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}>
                {[
                  { val: true, label: 'Rated' },
                  { val: false, label: 'Casual' }
                ].map(opt => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setRated(opt.val)}
                    className="py-1 rounded text-[11px] font-bold cursor-pointer"
                    style={
                      rated === opt.val
                        ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                        : { color: theme.textSecondary }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={loadingAction}
              onClick={handleQuickPair}
              className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
            >
              <Swords className="w-4 h-4" />
              <span>Find Classic Match</span>
            </button>

            <button
              type="button"
              disabled={loadingAction}
              onClick={handleCreateChallengeLink}
              className="py-3 px-4 rounded-xl border font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition hover:opacity-85 disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
            >
              <Link2 className="w-4 h-4" style={{ color: theme.accentHex }} />
              <span>Invite Friend Link</span>
            </button>
          </div>

          {/* Join by Invite Code / URL */}
          <div className="pt-3 border-t space-y-1.5" style={{ borderColor: theme.cardBorderHex }}>
            <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
              Join by Challenge Code or URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inviteCodeInput}
                onChange={e => setInviteCodeInput(e.target.value)}
                placeholder="Paste 6-char code or ?challenge=..."
                className="flex-1 rounded-lg px-3 py-2 text-xs font-mono"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  border: `1px solid ${theme.cardBorderHex}`,
                  color: theme.textPrimary
                }}
              />
              <button
                type="button"
                disabled={loadingAction || !inviteCodeInput.trim()}
                onClick={handleJoinByCode}
                className="px-3.5 py-2 rounded-lg font-bold text-xs disabled:opacity-45 cursor-pointer"
                style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Lobby Seeks, Spectate Games, Leaderboard */}
        <div
          className="lg:col-span-7 rounded-2xl border p-5 space-y-4"
          style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div
              className="flex items-center gap-1 p-1 rounded-xl border text-xs font-bold"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
            >
              <button
                type="button"
                onClick={() => setLobbySubTab('seeks')}
                className="px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                style={
                  lobbySubTab === 'seeks'
                    ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                    : { color: theme.textSecondary }
                }
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Lobby ({waitingMatches.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setLobbySubTab('watch')}
                className="px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                style={
                  lobbySubTab === 'watch'
                    ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                    : { color: theme.textSecondary }
                }
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Games ({activeMatches.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLobbySubTab('leaderboard');
                  fetchOnlineLeaderboard().then(setLeaderboard).catch(() => {});
                }}
                className="px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                style={
                  lobbySubTab === 'leaderboard'
                    ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                    : { color: theme.textSecondary }
                }
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Leaderboard</span>
              </button>
            </div>
          </div>

          {lobbySubTab === 'seeks' && (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {waitingMatches.length === 0 ? (
                <div className="py-12 text-center text-xs" style={{ color: theme.textMutedHex }}>
                  No open seeks in the lobby right now. Click <strong>Find Classic Match</strong> or share an invite link!
                </div>
              ) : (
                waitingMatches.map(m => {
                  const hostName = m.whiteName || m.blackName || 'Player';
                  const hostElo = m.whiteUid ? m.whiteElo : m.blackElo;
                  const isMine = m.creatorId === firebaseUser.uid;
                  return (
                    <div
                      key={m.matchId}
                      className="p-3 rounded-xl border flex items-center justify-between gap-3 text-xs"
                      style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-2" style={{ color: theme.textPrimary }}>
                          <span>{hostName}</span>
                          <span className="font-mono text-[11px]" style={{ color: theme.accentHex }}>
                            ({hostElo})
                          </span>
                        </div>
                        <div className="text-[11px] font-mono mt-0.5" style={{ color: theme.textMutedHex }}>
                          {m.timeControlLabel} · {m.rated ? 'Rated' : 'Casual'} · Code {m.inviteCode}
                        </div>
                      </div>

                      {isMine ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveMatchId(m.matchId)}
                            className="px-3 py-1.5 rounded-lg border font-bold cursor-pointer"
                            style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex, color: theme.textPrimary }}
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelSeek(m.matchId)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleJoinLobbySeek(m)}
                          className="px-3.5 py-1.5 rounded-lg font-bold cursor-pointer"
                          style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                        >
                          Accept
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {lobbySubTab === 'watch' && (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {activeMatches.length === 0 ? (
                <div className="py-12 text-center text-xs" style={{ color: theme.textMutedHex }}>
                  No active public Classic games at this moment.
                </div>
              ) : (
                activeMatches.map(m => (
                  <div
                    key={m.matchId}
                    className="p-3 rounded-xl border flex items-center justify-between gap-3 text-xs"
                    style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                  >
                    <div>
                      <div className="font-bold" style={{ color: theme.textPrimary }}>
                        {m.whiteName} ({m.whiteElo}) vs {m.blackName} ({m.blackElo})
                      </div>
                      <div className="text-[11px] font-mono mt-0.5" style={{ color: theme.textMutedHex }}>
                        {m.timeControlLabel} · {m.movesCount} ply · Classic
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveMatchId(m.matchId)}
                      className="px-3 py-1.5 rounded-lg border font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex, color: theme.accentHex }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Spectate</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {lobbySubTab === 'leaderboard' && (
            <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[10px] uppercase font-bold" style={{ borderColor: theme.cardBorderHex, color: theme.textMutedHex }}>
                    <th className="py-2 pr-2">#</th>
                    <th className="py-2 pr-3">Player</th>
                    <th className="py-2 pr-2">Rapid</th>
                    <th className="py-2 pr-2">Blitz</th>
                    <th className="py-2 pr-2">Bullet</th>
                    <th className="py-2 text-right">Games</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono tabular-nums" style={{ borderColor: `${theme.cardBorderHex}66` }}>
                  {leaderboard.map((row, idx) => (
                    <tr key={row.uid}>
                      <td className="py-2 pr-2 font-bold" style={{ color: theme.textMutedHex }}>{idx + 1}</td>
                      <td className="py-2 pr-3 font-sans font-bold" style={{ color: row.uid === firebaseUser.uid ? theme.accentHex : theme.textPrimary }}>
                        {row.username}
                      </td>
                      <td className="py-2 pr-2 font-bold" style={{ color: theme.accentHex }}>{row.rapidElo}</td>
                      <td className="py-2 pr-2">{row.blitzElo}</td>
                      <td className="py-2 pr-2">{row.bulletElo}</td>
                      <td className="py-2 text-right" style={{ color: theme.textMutedHex }}>{row.onlineGames}</td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center font-sans text-xs" style={{ color: theme.textMutedHex }}>
                        Play rated Classic games to rank on the live leaderboard!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
