import { Chess, Square } from 'chess.js';
import {
  User,
  deleteUser,
  reauthenticateWithPopup,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import {
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError
} from '../firebase/config';
import { PieceColor } from '../types/chess';
import {
  OnlineChatMessageDoc,
  OnlineMatchDoc,
  OnlinePlayerPublic,
  OnlineTimeControlSpec,
  computeClassicOnlineMove,
  computeLiveClockMs,
  computeOnlineEloDelta,
  createInviteCode,
  getEloBucketForTimeControl,
  sanitizeOnlineUsername
} from '../engine/onlineClassic';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function toMs(ts: unknown): number {
  if (ts instanceof Timestamp) return ts.toMillis();
  if (ts && typeof ts === 'object' && 'toMillis' in ts && typeof (ts as { toMillis: () => number }).toMillis === 'function') {
    return (ts as { toMillis: () => number }).toMillis();
  }
  return Date.now();
}

function mapMatchDoc(data: Record<string, unknown>, id: string): OnlineMatchDoc {
  return {
    matchId: String(data.matchId || id),
    inviteCode: String(data.inviteCode || ''),
    variant: 'standard',
    isPublicSeek: Boolean(data.isPublicSeek),
    rated: Boolean(data.rated),
    status: (data.status as OnlineMatchDoc['status']) || 'waiting',
    creatorId: String(data.creatorId || ''),
    creatorColorPref: (data.creatorColorPref as OnlineMatchDoc['creatorColorPref']) || 'random',
    whiteUid: String(data.whiteUid || ''),
    blackUid: String(data.blackUid || ''),
    whiteName: String(data.whiteName || ''),
    blackName: String(data.blackName || ''),
    whiteElo: Number(data.whiteElo ?? 1200),
    blackElo: Number(data.blackElo ?? 1200),
    timeControlType: (data.timeControlType as OnlineMatchDoc['timeControlType']) || 'rapid',
    timeControlLabel: String(data.timeControlLabel || '10+0 Rapid'),
    baseSeconds: Number(data.baseSeconds ?? 600),
    incrementSeconds: Number(data.incrementSeconds ?? 0),
    isUnlimited: Boolean(data.isUnlimited),
    fen: String(data.fen || START_FEN),
    pgn: String(data.pgn || ''),
    lastMoveUci: String(data.lastMoveUci || ''),
    lastMoveSan: String(data.lastMoveSan || ''),
    movesCount: Number(data.movesCount ?? 0),
    turn: (data.turn as PieceColor) || 'w',
    whiteTimeMs: Number(data.whiteTimeMs ?? 600000),
    blackTimeMs: Number(data.blackTimeMs ?? 600000),
    drawOfferBy: (data.drawOfferBy as '' | PieceColor) || '',
    takebackOfferBy: (data.takebackOfferBy as '' | PieceColor) || '',
    winner: (data.winner as '' | PieceColor | 'draw') || '',
    result: (data.result as OnlineMatchDoc['result']) || '*',
    reason: (data.reason as OnlineMatchDoc['reason']) || 'none',
    rematchMatchId: String(data.rematchMatchId || ''),
    createdAtMs: toMs(data.createdAt),
    lastMoveAtMs: toMs(data.lastMoveAt),
    updatedAtMs: toMs(data.updatedAt)
  };
}

function mapPlayerPublic(data: Record<string, unknown>, uid: string): OnlinePlayerPublic {
  return {
    uid: String(data.uid || uid),
    username: String(data.username || 'GMPlayer'),
    title: String(data.title || ''),
    avatarSeed: String(data.avatarSeed || 'n'),
    bulletElo: Number(data.bulletElo ?? 1200),
    blitzElo: Number(data.blitzElo ?? 1200),
    rapidElo: Number(data.rapidElo ?? 1200),
    classicalElo: Number(data.classicalElo ?? 1200),
    onlineGames: Number(data.onlineGames ?? 0),
    onlineWins: Number(data.onlineWins ?? 0),
    onlineDraws: Number(data.onlineDraws ?? 0),
    onlineLosses: Number(data.onlineLosses ?? 0)
  };
}

export async function signInWithGoogleWithConsent(options: {
  ageConfirmed: boolean;
  cookieConsent: 'all' | 'essential';
  preferredUsername?: string;
}): Promise<{ user: User; publicProfile: OnlinePlayerPublic }> {
  if (!options.ageConfirmed) {
    throw new Error('Age confirmation (13+) is required before creating an online account.');
  }

  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;
  const publicProfile = await ensureUserProfiles(user, {
    ageConfirmed: options.ageConfirmed,
    cookieConsent: options.cookieConsent,
    preferredUsername: options.preferredUsername
  });
  return { user, publicProfile };
}

export async function signOutGoogle(): Promise<void> {
  await signOut(auth);
}

export async function ensureUserProfiles(
  user: User,
  consent?: {
    ageConfirmed?: boolean;
    cookieConsent?: 'all' | 'essential';
    preferredUsername?: string;
  }
): Promise<OnlinePlayerPublic> {
  const privRef = doc(db, 'usersPrivate', user.uid);
  const pubRef = doc(db, 'playersPublic', user.uid);

  try {
    const privSnap = await getDoc(privRef);
    if (!privSnap.exists()) {
      await setDoc(privRef, {
        uid: user.uid,
        email: (user.email || 'user@example.com').slice(0, 254),
        ageConfirmed: consent?.ageConfirmed ?? true,
        cookieConsent: consent?.cookieConsent ?? 'essential',
        subscriptionTier: 'free',
        acceptedTermsAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else if (consent?.cookieConsent) {
      await updateDoc(privRef, {
        cookieConsent: consent.cookieConsent,
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `usersPrivate/${user.uid}`);
  }

  try {
    const pubSnap = await getDoc(pubRef);
    if (!pubSnap.exists()) {
      const baseName = sanitizeOnlineUsername(
        consent?.preferredUsername || user.displayName || user.email?.split('@')[0] || 'GMPlayer'
      );
      const initialPublic: Record<string, unknown> = {
        uid: user.uid,
        username: baseName,
        title: '',
        avatarSeed: 'n',
        bulletElo: 1200,
        blitzElo: 1200,
        rapidElo: 1200,
        classicalElo: 1200,
        onlineGames: 0,
        onlineWins: 0,
        onlineDraws: 0,
        onlineLosses: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(pubRef, initialPublic);
      return mapPlayerPublic(initialPublic, user.uid);
    }
    return mapPlayerPublic(pubSnap.data() as Record<string, unknown>, user.uid);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `playersPublic/${user.uid}`);
  }
}

export async function updateOnlineUsername(uid: string, username: string): Promise<string> {
  const sanitized = sanitizeOnlineUsername(username);
  const pubRef = doc(db, 'playersPublic', uid);
  try {
    await updateDoc(pubRef, {
      username: sanitized,
      updatedAt: serverTimestamp()
    });
    return sanitized;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `playersPublic/${uid}`);
  }
}

export async function updateCookieConsentInCloud(uid: string, consent: 'all' | 'essential'): Promise<void> {
  const privRef = doc(db, 'usersPrivate', uid);
  try {
    await updateDoc(privRef, {
      cookieConsent: consent,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `usersPrivate/${uid}`);
  }
}

/**
 * Deletes the signed-in user's waiting seeks, public chess card, private PII record, and Firebase Auth identity.
 */
export async function deleteEntireAccount(user: User): Promise<void> {
  const uid = user.uid;

  // 1. Cancel or clean up waiting seeks owned by this user
  try {
    const waitingQuery = query(
      collection(db, 'onlineMatches'),
      where('creatorId', '==', uid),
      where('status', '==', 'waiting'),
      limit(25)
    );
    const snap = await getDocs(waitingQuery);
    await Promise.all(
      snap.docs.map(d =>
        deleteDoc(d.ref).catch(() =>
          updateDoc(d.ref, { status: 'cancelled', reason: 'cancelled', updatedAt: serverTimestamp() })
        )
      )
    );
  } catch {
    // non-fatal cleanup before profile deletion
  }

  // 2. Delete public chess profile
  try {
    await deleteDoc(doc(db, 'playersPublic', uid));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `playersPublic/${uid}`);
  }

  // 3. Delete private PII & consent record
  try {
    await deleteDoc(doc(db, 'usersPrivate', uid));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `usersPrivate/${uid}`);
  }

  // 4. Delete Firebase Auth identity (re-authenticate via Google popup if required)
  try {
    await deleteUser(user);
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === 'auth/requires-recent-login') {
      await reauthenticateWithPopup(user, googleProvider);
      await deleteUser(user);
    } else {
      throw err;
    }
  }
}

export function subscribePublicProfile(
  uid: string,
  onData: (profile: OnlinePlayerPublic | null) => void
): () => void {
  const path = `playersPublic/${uid}`;
  return onSnapshot(
    doc(db, 'playersPublic', uid),
    snap => {
      onData(snap.exists() ? mapPlayerPublic(snap.data() as Record<string, unknown>, uid) : null);
    },
    error => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function fetchOnlineLeaderboard(): Promise<OnlinePlayerPublic[]> {
  try {
    const q = query(collection(db, 'playersPublic'), orderBy('rapidElo', 'desc'), limit(25));
    const snap = await getDocs(q);
    return snap.docs.map(d => mapPlayerPublic(d.data() as Record<string, unknown>, d.id));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'playersPublic');
  }
}

export function subscribeWaitingMatches(onData: (matches: OnlineMatchDoc[]) => void): () => void {
  const q = query(
    collection(db, 'onlineMatches'),
    where('variant', '==', 'standard'),
    where('status', '==', 'waiting'),
    limit(25)
  );
  return onSnapshot(
    q,
    snap => {
      const items = snap.docs
        .map(d => mapMatchDoc(d.data() as Record<string, unknown>, d.id))
        .filter(m => m.isPublicSeek)
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(items);
    },
    error => {
      handleFirestoreError(error, OperationType.LIST, 'onlineMatches');
    }
  );
}

export function subscribeActivePublicMatches(onData: (matches: OnlineMatchDoc[]) => void): () => void {
  const q = query(
    collection(db, 'onlineMatches'),
    where('variant', '==', 'standard'),
    where('status', '==', 'active'),
    limit(20)
  );
  return onSnapshot(
    q,
    snap => {
      const items = snap.docs
        .map(d => mapMatchDoc(d.data() as Record<string, unknown>, d.id))
        .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
      onData(items);
    },
    error => {
      handleFirestoreError(error, OperationType.LIST, 'onlineMatches');
    }
  );
}

export function subscribeMatchById(matchId: string, onData: (match: OnlineMatchDoc | null) => void): () => void {
  const path = `onlineMatches/${matchId}`;
  return onSnapshot(
    doc(db, 'onlineMatches', matchId),
    snap => {
      onData(snap.exists() ? mapMatchDoc(snap.data() as Record<string, unknown>, snap.id) : null);
    },
    error => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function createOnlineClassicMatch(params: {
  player: OnlinePlayerPublic;
  timeControl: OnlineTimeControlSpec;
  colorPref: 'w' | 'b' | 'random';
  rated: boolean;
  isPublicSeek: boolean;
}): Promise<OnlineMatchDoc> {
  const matchId = `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const inviteCode = createInviteCode();
  const bucket = getEloBucketForTimeControl(params.timeControl.type);
  const playerElo = Math.max(100, Math.min(3500, Math.round(params.player[bucket] || 1200)));
  const creatorIsWhite =
    params.colorPref === 'w' ? true : params.colorPref === 'b' ? false : Math.random() < 0.5;
  const initialMs = params.timeControl.isUnlimited ? 0 : Math.min(10800000, params.timeControl.baseSeconds * 1000);

  const payload = {
    matchId,
    inviteCode,
    variant: 'standard' as const,
    isPublicSeek: params.isPublicSeek,
    rated: params.rated,
    status: 'waiting' as const,
    creatorId: params.player.uid,
    creatorColorPref: params.colorPref,
    whiteUid: creatorIsWhite ? params.player.uid : '',
    blackUid: creatorIsWhite ? '' : params.player.uid,
    whiteName: creatorIsWhite ? sanitizeOnlineUsername(params.player.username) : '',
    blackName: creatorIsWhite ? '' : sanitizeOnlineUsername(params.player.username),
    whiteElo: creatorIsWhite ? playerElo : 1200,
    blackElo: creatorIsWhite ? 1200 : playerElo,
    timeControlType: params.timeControl.type,
    timeControlLabel: params.timeControl.label.slice(0, 40),
    baseSeconds: params.timeControl.baseSeconds,
    incrementSeconds: params.timeControl.incrementSeconds,
    isUnlimited: params.timeControl.isUnlimited,
    fen: START_FEN,
    pgn: '',
    lastMoveUci: '',
    lastMoveSan: '',
    movesCount: 0,
    turn: 'w' as const,
    whiteTimeMs: initialMs,
    blackTimeMs: initialMs,
    drawOfferBy: '',
    takebackOfferBy: '',
    winner: '',
    result: '*',
    reason: 'none',
    rematchMatchId: '',
    createdAt: serverTimestamp(),
    lastMoveAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(doc(db, 'onlineMatches', matchId), payload);
    return mapMatchDoc(payload, matchId);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `onlineMatches/${matchId}`);
  }
}

export async function joinOnlineClassicMatch(
  matchId: string,
  joiner: OnlinePlayerPublic
): Promise<OnlineMatchDoc> {
  const ref = doc(db, 'onlineMatches', matchId);
  try {
    return await runTransaction(db, async tx => {
      const snap = await tx.get(ref);
      if (!snap.exists()) {
        throw new Error('Match room does not exist.');
      }
      const existing = mapMatchDoc(snap.data() as Record<string, unknown>, snap.id);
      if (existing.status === 'active' && (existing.whiteUid === joiner.uid || existing.blackUid === joiner.uid)) {
        return existing;
      }
      if (existing.status !== 'waiting') {
        throw new Error('This challenge is no longer open.');
      }
      if (existing.creatorId === joiner.uid) {
        throw new Error('You cannot join your own seek.');
      }

      const bucket = getEloBucketForTimeControl(existing.timeControlType);
      const joinerElo = Math.max(100, Math.min(3500, Math.round(joiner[bucket] || 1200)));
      const joinerName = sanitizeOnlineUsername(joiner.username);
      const patch =
        existing.whiteUid === ''
          ? {
              status: 'active' as const,
              whiteUid: joiner.uid,
              whiteName: joinerName,
              whiteElo: joinerElo,
              lastMoveAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }
          : {
              status: 'active' as const,
              blackUid: joiner.uid,
              blackName: joinerName,
              blackElo: joinerElo,
              lastMoveAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };

      tx.update(ref, patch);
      return {
        ...existing,
        ...patch,
        lastMoveAtMs: Date.now(),
        updatedAtMs: Date.now()
      };
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `onlineMatches/${matchId}`);
  }
}

export async function findOrCreateQuickMatch(params: {
  player: OnlinePlayerPublic;
  timeControl: OnlineTimeControlSpec;
  colorPref: 'w' | 'b' | 'random';
  rated: boolean;
}): Promise<{ match: OnlineMatchDoc; matchedExisting: boolean }> {
  try {
    const q = query(
      collection(db, 'onlineMatches'),
      where('variant', '==', 'standard'),
      where('status', '==', 'waiting'),
      limit(25)
    );
    const snap = await getDocs(q);
    const sorted = snap.docs
      .map(d => mapMatchDoc(d.data() as Record<string, unknown>, d.id))
      .sort((a, b) => a.createdAtMs - b.createdAtMs);
    for (const candidate of sorted) {
      if (
        candidate.isPublicSeek &&
        candidate.creatorId !== params.player.uid &&
        candidate.rated === params.rated &&
        candidate.baseSeconds === params.timeControl.baseSeconds &&
        candidate.incrementSeconds === params.timeControl.incrementSeconds &&
        candidate.isUnlimited === params.timeControl.isUnlimited
      ) {
        try {
          const joined = await joinOnlineClassicMatch(candidate.matchId, params.player);
          return { match: joined, matchedExisting: true };
        } catch {
          // race lost; check next waiting seek
        }
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'onlineMatches');
  }

  const created = await createOnlineClassicMatch({
    player: params.player,
    timeControl: params.timeControl,
    colorPref: params.colorPref,
    rated: params.rated,
    isPublicSeek: true
  });
  return { match: created, matchedExisting: false };
}

export async function findMatchByInviteCode(codeOrMatchId: string): Promise<OnlineMatchDoc | null> {
  const cleaned = codeOrMatchId.trim();
  if (!cleaned) return null;

  if (/^m_[a-zA-Z0-9_]+$/.test(cleaned)) {
    try {
      const snap = await getDoc(doc(db, 'onlineMatches', cleaned));
      return snap.exists() ? mapMatchDoc(snap.data() as Record<string, unknown>, snap.id) : null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `onlineMatches/${cleaned}`);
    }
  }

  const upperCode = cleaned.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!upperCode) return null;

  try {
    for (const statusCheck of ['waiting', 'active'] as const) {
      const q = query(
        collection(db, 'onlineMatches'),
        where('variant', '==', 'standard'),
        where('status', '==', statusCheck),
        where('inviteCode', '==', upperCode),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return mapMatchDoc(snap.docs[0].data() as Record<string, unknown>, snap.docs[0].id);
      }
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'onlineMatches');
  }
}

export async function cancelOnlineMatch(matchId: string): Promise<void> {
  const ref = doc(db, 'onlineMatches', matchId);
  try {
    await updateDoc(ref, {
      status: 'cancelled',
      reason: 'cancelled',
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `onlineMatches/${matchId}`);
  }
}

export async function submitOnlineMove(params: {
  matchId: string;
  moverUid: string;
  from: Square;
  to: Square;
  promotion?: 'q' | 'r' | 'b' | 'n';
}): Promise<OnlineMatchDoc | null> {
  const ref = doc(db, 'onlineMatches', params.matchId);
  try {
    return await runTransaction(db, async tx => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return null;
      const current = mapMatchDoc(snap.data() as Record<string, unknown>, snap.id);
      const moverColor: PieceColor | null =
        current.whiteUid === params.moverUid
          ? 'w'
          : current.blackUid === params.moverUid
          ? 'b'
          : null;
      if (!moverColor) return null;

      const next = computeClassicOnlineMove(
        current,
        moverColor,
        params.from,
        params.to,
        params.promotion || 'q',
        Date.now()
      );
      if (!next) return null;

      tx.update(ref, {
        ...next,
        drawOfferBy: '',
        takebackOfferBy: '',
        lastMoveAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        ...current,
        ...next,
        drawOfferBy: '',
        takebackOfferBy: '',
        lastMoveAtMs: Date.now(),
        updatedAtMs: Date.now()
      };
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `onlineMatches/${params.matchId}`);
  }
}

export async function resignOnlineMatch(matchId: string, resigningUid: string): Promise<void> {
  const ref = doc(db, 'onlineMatches', matchId);
  try {
    await runTransaction(db, async tx => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const m = mapMatchDoc(snap.data() as Record<string, unknown>, snap.id);
      if (m.status !== 'active') return;
      const resignColor: PieceColor | null =
        m.whiteUid === resigningUid ? 'w' : m.blackUid === resigningUid ? 'b' : null;
      if (!resignColor) return;
      const winner: PieceColor = resignColor === 'w' ? 'b' : 'w';
      tx.update(ref, {
        status: 'finished',
        winner,
        result: winner === 'w' ? '1-0' : '0-1',
        reason: 'resignation',
        drawOfferBy: '',
        takebackOfferBy: '',
        updatedAt: serverTimestamp()
      });
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `onlineMatches/${matchId}`);
  }
}

export async function claimOnlineTimeout(matchId: string): Promise<boolean> {
  const ref = doc(db, 'onlineMatches', matchId);
  try {
    return await runTransaction(db, async tx => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return false;
      const m = mapMatchDoc(snap.data() as Record<string, unknown>, snap.id);
      if (m.status !== 'active' || m.isUnlimited) return false;
      const live = computeLiveClockMs(m, Date.now());
      if (!live.activeFlagged) return false;
      const winner: PieceColor = live.activeFlagged === 'w' ? 'b' : 'w';
      tx.update(ref, {
        status: 'finished',
        winner,
        result: winner === 'w' ? '1-0' : '0-1',
        reason: 'timeout',
        whiteTimeMs: live.whiteMs,
        blackTimeMs: live.blackMs,
        drawOfferBy: '',
        takebackOfferBy: '',
        updatedAt: serverTimestamp()
      });
      return true;
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `onlineMatches/${matchId}`);
  }
}

export async function offerOrRespondDraw(
  matchId: string,
  playerUid: string,
  action: 'offer' | 'accept' | 'decline'
): Promise<void> {
  const ref = doc(db, 'onlineMatches', matchId);
  try {
    await runTransaction(db, async tx => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const m = mapMatchDoc(snap.data() as Record<string, unknown>, snap.id);
      if (m.status !== 'active') return;
      const color: PieceColor | null =
        m.whiteUid === playerUid ? 'w' : m.blackUid === playerUid ? 'b' : null;
      if (!color) return;

      if (action === 'offer') {
        tx.update(ref, { drawOfferBy: color, updatedAt: serverTimestamp() });
      } else if (action === 'decline') {
        tx.update(ref, { drawOfferBy: '', updatedAt: serverTimestamp() });
      } else if (action === 'accept' && m.drawOfferBy && m.drawOfferBy !== color) {
        tx.update(ref, {
          status: 'finished',
          winner: 'draw',
          result: '1/2-1/2',
          reason: 'draw_agreement',
          drawOfferBy: '',
          takebackOfferBy: '',
          updatedAt: serverTimestamp()
        });
      }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `onlineMatches/${matchId}`);
  }
}

export async function offerOrRespondTakeback(
  matchId: string,
  playerUid: string,
  action: 'offer' | 'accept' | 'decline'
): Promise<void> {
  const ref = doc(db, 'onlineMatches', matchId);
  try {
    await runTransaction(db, async tx => {
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const m = mapMatchDoc(snap.data() as Record<string, unknown>, snap.id);
      if (m.status !== 'active' || m.movesCount < 1) return;
      const color: PieceColor | null =
        m.whiteUid === playerUid ? 'w' : m.blackUid === playerUid ? 'b' : null;
      if (!color) return;

      if (action === 'offer') {
        tx.update(ref, { takebackOfferBy: color, updatedAt: serverTimestamp() });
      } else if (action === 'decline') {
        tx.update(ref, { takebackOfferBy: '', updatedAt: serverTimestamp() });
      } else if (action === 'accept' && m.takebackOfferBy && m.takebackOfferBy !== color) {
        const chess = new Chess();
        try {
          if (m.pgn.trim()) chess.loadPgn(m.pgn);
          else chess.load(m.fen);
          chess.undo();
        } catch {
          return;
        }
        const history = chess.history({ verbose: true });
        const prevMove = history[history.length - 1];
        tx.update(ref, {
          fen: chess.fen(),
          pgn: chess.pgn(),
          lastMoveUci: prevMove ? `${prevMove.from}${prevMove.to}${prevMove.promotion || ''}` : '',
          lastMoveSan: prevMove ? prevMove.san : '',
          movesCount: Math.max(0, m.movesCount - 1),
          turn: chess.turn(),
          takebackOfferBy: '',
          lastMoveAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `onlineMatches/${matchId}`);
  }
}

export async function createOnlineRematch(
  finishedMatch: OnlineMatchDoc,
  player: OnlinePlayerPublic
): Promise<OnlineMatchDoc> {
  const oppColorPref: 'w' | 'b' = finishedMatch.whiteUid === player.uid ? 'b' : 'w';
  const newMatch = await createOnlineClassicMatch({
    player,
    timeControl: {
      id: `tc_${finishedMatch.baseSeconds}_${finishedMatch.incrementSeconds}`,
      label: finishedMatch.timeControlLabel,
      type: finishedMatch.timeControlType,
      baseSeconds: finishedMatch.baseSeconds,
      incrementSeconds: finishedMatch.incrementSeconds,
      isUnlimited: finishedMatch.isUnlimited
    },
    colorPref: oppColorPref,
    rated: finishedMatch.rated,
    isPublicSeek: false
  });

  try {
    await updateDoc(doc(db, 'onlineMatches', finishedMatch.matchId), {
      rematchMatchId: newMatch.matchId,
      updatedAt: serverTimestamp()
    });
  } catch {
    // non-fatal if opponent linked first
  }

  return newMatch;
}

/**
 * Applies the current player's rated Elo outcome on their own `playersPublic/{uid}` doc once per finished match.
 */
export async function commitOwnOnlineEloForMatch(
  match: OnlineMatchDoc,
  playerUid: string
): Promise<number | null> {
  if (match.status !== 'finished') return null;
  const isWhite = match.whiteUid === playerUid;
  const isBlack = match.blackUid === playerUid;
  if (!isWhite && !isBlack) return null;

  const myColor: PieceColor = isWhite ? 'w' : 'b';
  const score: 1 | 0.5 | 0 =
    match.winner === 'draw' ? 0.5 : match.winner === myColor ? 1 : 0;
  const oppElo = isWhite ? match.blackElo : match.whiteElo;
  const bucket = getEloBucketForTimeControl(match.timeControlType);
  const pubRef = doc(db, 'playersPublic', playerUid);

  try {
    return await runTransaction(db, async tx => {
      const snap = await tx.get(pubRef);
      if (!snap.exists()) return null;
      const pub = mapPlayerPublic(snap.data() as Record<string, unknown>, playerUid);
      const currentBucketElo = pub[bucket] || 1200;
      const delta = match.rated ? computeOnlineEloDelta(currentBucketElo, oppElo, score) : 0;
      const nextBucketElo = Math.max(100, Math.min(3500, currentBucketElo + delta));

      tx.update(pubRef, {
        [bucket]: nextBucketElo,
        onlineGames: pub.onlineGames + 1,
        onlineWins: pub.onlineWins + (score === 1 ? 1 : 0),
        onlineDraws: pub.onlineDraws + (score === 0.5 ? 1 : 0),
        onlineLosses: pub.onlineLosses + (score === 0 ? 1 : 0),
        updatedAt: serverTimestamp()
      });
      return nextBucketElo;
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `playersPublic/${playerUid}`);
  }
}

export function subscribeMatchChat(
  match: OnlineMatchDoc,
  userUid: string,
  onData: (messages: OnlineChatMessageDoc[]) => void
): () => void {
  const isWhite = match.whiteUid === userUid;
  const isBlack = match.blackUid === userUid;
  if (!isWhite && !isBlack) {
    onData([]);
    return () => {};
  }
  const path = `onlineMatches/${match.matchId}/chat`;
  const participantQ = query(
    collection(db, 'onlineMatches', match.matchId, 'chat'),
    where(isWhite ? 'whiteUid' : 'blackUid', '==', userUid),
    limit(50)
  );
  return onSnapshot(
    participantQ,
    snap => {
      const items: OnlineChatMessageDoc[] = snap.docs
        .map(d => {
          const data = d.data() as Record<string, unknown>;
          return {
            messageId: String(data.messageId || d.id),
            matchId: String(data.matchId || match.matchId),
            senderUid: String(data.senderUid || ''),
            senderName: String(data.senderName || ''),
            whiteUid: String(data.whiteUid || ''),
            blackUid: String(data.blackUid || ''),
            text: String(data.text || ''),
            createdAtMs: toMs(data.createdAt)
          };
        })
        .sort((a, b) => a.createdAtMs - b.createdAtMs);
      onData(items);
    },
    error => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function sendMatchChatMessage(
  match: OnlineMatchDoc,
  sender: OnlinePlayerPublic,
  rawText: string
): Promise<void> {
  const text = rawText.replace(/[<>]/g, '').trim().slice(0, 160);
  if (!text) return;
  const messageId = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const ref = doc(db, 'onlineMatches', match.matchId, 'chat', messageId);

  try {
    await setDoc(ref, {
      messageId,
      matchId: match.matchId,
      senderUid: sender.uid,
      senderName: sanitizeOnlineUsername(sender.username),
      whiteUid: match.whiteUid,
      blackUid: match.blackUid,
      text,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `onlineMatches/${match.matchId}/chat/${messageId}`);
  }
}
