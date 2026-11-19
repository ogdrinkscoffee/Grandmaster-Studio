import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function resolveServerPort(): number {
  const portFlagIdx = process.argv.findIndex(arg => arg === '--port' || arg.startsWith('--port='));
  if (portFlagIdx !== -1) {
    const raw = process.argv[portFlagIdx];
    const value = raw.includes('=') ? raw.split('=')[1] : process.argv[portFlagIdx + 1];
    const parsed = parseInt(value ?? '', 10);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }

  const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : NaN;
  const nginxPort = process.env.NGINX_PORT ? parseInt(process.env.NGINX_PORT, 10) : NaN;
  const defaultAppPort = process.env.DEFAULT_APP_PORT ? parseInt(process.env.DEFAULT_APP_PORT, 10) : 3000;

  if (!Number.isNaN(envPort) && envPort > 0 && envPort !== nginxPort) {
    return envPort;
  }
  return !Number.isNaN(defaultAppPort) && defaultAppPort > 0 ? defaultAppPort : 3000;
}

const PORT = resolveServerPort();

app.use(express.json({ limit: '4mb' }));

// Security headers (frame-compatible for AI Studio preview iframe)
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  next();
});

// Simple fixed-window rate limiter per IP for API endpoints
const rateCounters = new Map<string, { count: number; resetAt: number }>();
function apiRateLimit(maxPerMinute: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${ip}:${req.baseUrl || req.path}`;
    const now = Date.now();
    const current = rateCounters.get(key);
    if (!current || now >= current.resetAt) {
      rateCounters.set(key, { count: 1, resetAt: now + 60_000 });
      next();
      return;
    }
    if (current.count >= maxPerMinute) {
      res.status(429).json({
        error: 'Rate limit exceeded. Please wait a moment and try again.',
        code: 'RATE_LIMITED'
      });
      return;
    }
    current.count += 1;
    next();
  };
}

// Persistent E2EE Vault Store
const DATA_DIR = path.resolve(__dirname, '.data');
const VAULT_FILE = path.join(DATA_DIR, 'sync-vaults.json');
const VAULT_ID_REGEX = /^[a-zA-Z0-9_-]{3,64}$/;
const MAX_VAULTS = 500;
const MAX_CIPHERTEXT_CHARS = 2 * 1024 * 1024;

interface StoredVault {
  ciphertext: string;
  updatedAt: number;
  ownerHash?: string;
}

const encryptedSyncVaults = new Map<string, StoredVault>();

function loadVaultsFromDisk() {
  try {
    if (!fs.existsSync(VAULT_FILE)) return;
    const raw = fs.readFileSync(VAULT_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, StoredVault>;
    if (parsed && typeof parsed === 'object') {
      for (const [id, entry] of Object.entries(parsed)) {
        if (VAULT_ID_REGEX.test(id) && entry && typeof entry.ciphertext === 'string') {
          encryptedSyncVaults.set(id, entry);
        }
      }
    }
  } catch (err) {
    console.warn('Could not load sync vaults from disk:', err);
  }
}

function saveVaultsToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const obj: Record<string, StoredVault> = {};
    for (const [k, v] of encryptedSyncVaults.entries()) {
      obj[k] = v;
    }
    const tmp = `${VAULT_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(obj), 'utf8');
    fs.renameSync(tmp, VAULT_FILE);
  } catch (err) {
    console.warn('Could not persist sync vaults to disk:', err);
  }
}

loadVaultsFromDisk();

function hashVaultToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getHeaderToken(req: Request): string | undefined {
  const raw = req.headers['x-vault-token'];
  if (typeof raw === 'string' && raw.trim().length > 0) return raw.trim();
  return undefined;
}

interface CoachReport {
  coachSummary: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  tacticalTakeaway: string;
  suggestedPuzzlesCategory: string;
  openingTip: string;
}

function buildOfflineCoachReport(params: {
  userRating?: number;
  blundersCount?: number;
  userGoal?: string;
  variant?: string;
  playerColor?: string;
}): CoachReport {
  const rating = params.userRating || 1200;
  const blunders = params.blundersCount || 0;
  const goal = (params.userGoal || '').toLowerCase();
  const variant = params.variant || 'Standard Chess';
  const color = params.playerColor === 'b' ? 'Black' : 'White';

  let suggestedPuzzlesCategory = 'Pin & Skewer';
  let tacticalTakeaway = 'Always inspect every check, capture, and forcing threat before finalizing your move.';
  let openingTip = `As ${color}, prioritize rapid minor-piece development and central pawn control before launching wing attacks.`;
  let summaryFocus = 'converting middlegame advantages without allowing tactical counterplay';

  if (goal.includes('endgame') || goal.includes('rook') || goal.includes('pawn')) {
    suggestedPuzzlesCategory = 'Rook Endgames';
    tacticalTakeaway = 'In rook endgames, place your rook behind passed pawns and activate your King toward the center immediately.';
    openingTip = 'Aim for clean pawn structures with minimal isolated islands so your endgame remains resilient.';
    summaryFocus = 'king activation and pawn-race calculation in simplified positions';
  } else if (goal.includes('opening') || goal.includes('trap') || goal.includes('development')) {
    suggestedPuzzlesCategory = 'Development & Tempo';
    tacticalTakeaway = 'Avoid moving the same minor piece twice in the opening unless winning material or forcing a structural concession.';
    openingTip = `In ${variant}, fight directly for central squares (d4/e4/d5/e5) and castle early before opening central files.`;
    summaryFocus = 'opening development tempo and early king safety';
  } else if (goal.includes('chaturanga') || goal.includes('variant') || goal.includes('custom')) {
    suggestedPuzzlesCategory = 'Tactical Motif';
    tacticalTakeaway = 'Map out leaping piece ranges (like Knights and Gajas) two moves ahead—they bypass pawn chains.';
    openingTip = 'In historical and fairy variants, coordinate non-linear jumpers with central pawns before trading major pieces.';
    summaryFocus = 'piece coordination and asymmetric threat calculation';
  } else if (goal.includes('blunder') || goal.includes('mistake') || blunders > 0) {
    suggestedPuzzlesCategory = 'Hanging Pieces & Forks';
    tacticalTakeaway = 'Run a 3-second blunder check before clicking: verify that your destination square and back rank stay defended.';
    openingTip = 'Choose solid, well-protected piece posts over sharp gambits until your tactical scan becomes automatic.';
    summaryFocus = `eliminating unforced tactical oversights (${blunders} flagged recently)`;
  }

  return {
    coachSummary: `Tailored assessment for ${rating} Elo (${variant}): focus primarily on ${summaryFocus}. Consistent pattern recognition in ${suggestedPuzzlesCategory.toLowerCase()} will produce the fastest rating improvement.`,
    keyStrengths: [
      rating >= 1400 ? 'Strong tactical awareness in open positions' : 'Willingness to contest central territory early',
      blunders === 0 ? 'Clean tactical discipline across recent turns' : 'Resourcefulness in dynamic middlegame positions'
    ],
    areasForImprovement: [
      `Deepen candidate-move scanning around ${suggestedPuzzlesCategory.toLowerCase()}`,
      'Evaluate your opponent’s sharpest reply before committing pawn breaks'
    ],
    tacticalTakeaway,
    suggestedPuzzlesCategory,
    openingTip
  };
}

interface MoveCoachExplanation {
  headline: string;
  whyMoveWorkedOrFailed: string;
  bestMoveIdea: string;
  coachTip: string;
  source: 'gemini' | 'local';
}

function buildLocalMoveCoachExplanation(params: {
  playedSan?: string;
  bestSan?: string;
  classification?: string;
  evalBeforeCp?: number;
  evalAfterCp?: number;
  moveAccuracy?: number;
  pvSan?: string[];
  threats?: string[];
}): MoveCoachExplanation {
  const played = params.playedSan || 'Your move';
  const best = params.bestSan || played;
  const cls = (params.classification || 'good').toLowerCase();
  const hasAcc = typeof params.moveAccuracy === 'number';
  const acc = hasAcc ? `${params.moveAccuracy!.toFixed(1)}%` : null;
  const beforePawns = ((params.evalBeforeCp || 0) / 100).toFixed(1);
  const afterPawns = ((params.evalAfterCp || 0) / 100).toFixed(1);
  const pvText = Array.isArray(params.pvSan) && params.pvSan.length > 0 ? params.pvSan.join(' ') : best;
  const threatText =
    Array.isArray(params.threats) && params.threats.length > 0
      ? `Watch targets on ${params.threats.join(', ')}.`
      : 'Keep pieces mutually defended and control central squares.';

  if (cls === 'brilliant') {
    return {
      headline: acc ? `${played} is Brilliant (${acc} accuracy)` : `${played} is Brilliant!`,
      whyMoveWorkedOrFailed: `${played} sacrifices material or steps into tension to seize lasting initiative (${beforePawns} → ${afterPawns}).`,
      bestMoveIdea: `The critical follow-up line is ${pvText}, maintaining active piece pressure.`,
      coachTip: `Always calculate one move deeper after a sacrifice to confirm the king cannot escape. ${threatText}`,
      source: 'local'
    };
  }
  if (cls === 'great' || cls === 'best' || cls === 'book') {
    return {
      headline: acc ? `${played} hits ${acc} move accuracy` : `${played} is the top engine choice`,
      whyMoveWorkedOrFailed: `${played} keeps optimal evaluation (${beforePawns} → ${afterPawns}) and improves piece coordination cleanly.`,
      bestMoveIdea: `Continuation idea: ${pvText}.`,
      coachTip: `Strong discipline — maintain this habit of checking forcing moves first. ${threatText}`,
      source: 'local'
    };
  }
  if (cls === 'excellent' || cls === 'good') {
    return {
      headline: acc ? `${played} is solid (${acc} accuracy)` : `${played} is a solid continuation`,
      whyMoveWorkedOrFailed: `${played} preserves structural balance (${beforePawns} → ${afterPawns}), though ${best} put slightly more pressure on the position.`,
      bestMoveIdea: `Comparing ${played} vs ${best}: ${pvText} gains an extra tempo on active squares.`,
      coachTip: `Look for the most active square for your least-developed piece before settling. ${threatText}`,
      source: 'local'
    };
  }

  return {
    headline: acc
      ? `${played} dropped accuracy to ${acc}`
      : best !== played
      ? `${played} overlooks ${best}`
      : `${played} weakens the position`,
    whyMoveWorkedOrFailed: `${played} shifted the evaluation from ${beforePawns} to ${afterPawns}, allowing the opponent cleaner counterplay or tactical targets.`,
    bestMoveIdea: `${best} was best here — continuing with ${pvText} neutralizes threats and preserves coordination.`,
    coachTip: `Before playing ${played}, pause for a 3-second check on hanging pieces, checks, and captures. ${threatText}`,
    source: 'local'
  };
}

function mapGeminiError(err: unknown): { status: number; code: string; message: string } {
  const errObj = err as { status?: number; message?: string } | null;
  const rawMsg = errObj?.message || String(err || 'Gemini API request failed');
  const status = errObj?.status;

  if (
    status === 403 ||
    rawMsg.includes('PERMISSION_DENIED') ||
    rawMsg.includes('free tier is not available') ||
    rawMsg.includes('billing')
  ) {
    return {
      status: 403,
      code: 'PERMISSION_DENIED',
      message: 'Cloud Gemini coaching requires a billing-enabled GEMINI_API_KEY in Secrets.'
    };
  }
  if (status === 429 || rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('quota')) {
    return {
      status: 429,
      code: 'RATE_LIMITED',
      message: 'Gemini API quota or rate limit reached. Try again shortly or use Offline Coach.'
    };
  }
  if (status === 404 || rawMsg.includes('NOT_FOUND')) {
    return {
      status: 502,
      code: 'MODEL_UNAVAILABLE',
      message: 'Configured Gemini model is currently unavailable.'
    };
  }
  return {
    status: 502,
    code: 'UPSTREAM_ERROR',
    message: rawMsg || 'Cloud Gemini coaching is temporarily unavailable.'
  };
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    vaultCount: encryptedSyncVaults.size
  });
});

// E2EE Cloud Sync Endpoints
app.post('/api/sync/push', apiRateLimit(40), (req, res) => {
  const { vaultId, encryptedPayload } = req.body || {};
  if (typeof vaultId !== 'string' || !VAULT_ID_REGEX.test(vaultId)) {
    res.status(400).json({
      error: 'Invalid vaultId. Use 3–64 alphanumeric, hyphen, or underscore characters.',
      code: 'INVALID_VAULT_ID'
    });
    return;
  }
  if (typeof encryptedPayload !== 'string' || encryptedPayload.length === 0 || encryptedPayload.length > MAX_CIPHERTEXT_CHARS) {
    res.status(400).json({
      error: 'Invalid or oversized encryptedPayload.',
      code: 'INVALID_PAYLOAD'
    });
    return;
  }

  const token = getHeaderToken(req);
  const existing = encryptedSyncVaults.get(vaultId);
  if (existing?.ownerHash) {
    if (!token || hashVaultToken(token) !== existing.ownerHash) {
      res.status(401).json({
        error: 'Unauthorized vault overwrite — matching vault token / passphrase required.',
        code: 'VAULT_UNAUTHORIZED'
      });
      return;
    }
  }

  // LRU eviction if store exceeds MAX_VAULTS
  if (!existing && encryptedSyncVaults.size >= MAX_VAULTS) {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    for (const [k, v] of encryptedSyncVaults.entries()) {
      if (v.updatedAt < oldestTime) {
        oldestTime = v.updatedAt;
        oldestKey = k;
      }
    }
    if (oldestKey) encryptedSyncVaults.delete(oldestKey);
  }

  const updatedAt = Date.now();
  encryptedSyncVaults.set(vaultId, {
    ciphertext: encryptedPayload,
    updatedAt,
    ownerHash: existing?.ownerHash ?? (token ? hashVaultToken(token) : undefined)
  });
  saveVaultsToDisk();
  res.json({ success: true, updatedAt, protected: Boolean(existing?.ownerHash || token) });
});

app.get('/api/sync/pull/:vaultId', apiRateLimit(60), (req, res) => {
  const { vaultId } = req.params;
  if (!VAULT_ID_REGEX.test(vaultId)) {
    res.status(400).json({ error: 'Invalid vaultId format', code: 'INVALID_VAULT_ID' });
    return;
  }
  const entry = encryptedSyncVaults.get(vaultId);
  if (!entry) {
    res.status(404).json({ error: 'Vault not found', code: 'VAULT_NOT_FOUND' });
    return;
  }
  if (entry.ownerHash) {
    const token = getHeaderToken(req);
    if (!token || hashVaultToken(token) !== entry.ownerHash) {
      res.status(401).json({
        error: 'Vault is token-protected. Enter the matching E2EE passphrase to restore.',
        code: 'VAULT_UNAUTHORIZED'
      });
      return;
    }
  }
  res.json({ ciphertext: entry.ciphertext, updatedAt: entry.updatedAt });
});

// Explicit Offline Local Coach endpoint (called only when user opts into Local Coach)
app.post('/api/coach/offline', (req, res) => {
  const { pgn: _pgn, userRating, blunders, userGoal, variant, playerColor, playedSan, bestSan, bestMoveSan, classification, evalBeforeCp, evalAfterCp, moveAccuracy, pvSan, threats, type } = req.body || {};
  if (type === 'move') {
    res.json(
      buildLocalMoveCoachExplanation({
        playedSan,
        bestSan: bestSan || bestMoveSan,
        classification,
        evalBeforeCp,
        evalAfterCp,
        moveAccuracy,
        pvSan,
        threats
      })
    );
    return;
  }
  res.json({
    ...buildOfflineCoachReport({
      userRating,
      blundersCount: Array.isArray(blunders) ? blunders.length : 0,
      userGoal,
      variant,
      playerColor
    }),
    mode: 'offline'
  });
});

// Gemini AI Chess Coach endpoint (surfaces real error status if unconfigured or failing)
app.post('/api/coach/analyze', apiRateLimit(20), async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: 'Gemini API key not configured. Add GEMINI_API_KEY in Secrets, or switch to Local Grandmaster Heuristics.',
      code: 'MISSING_API_KEY'
    });
    return;
  }

  const { pgn, fen, playerColor, userRating, blunders, userGoal, variant } = req.body || {};

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `You are a high-level Chess Grandmaster Coach and mentor.
A player with an Elo rating of ~${userRating || 1200} just played a game of ${variant || 'Standard Chess'} as ${playerColor || 'White'}.
Current board position (FEN): ${fen || 'standard'}
PGN moves summary: ${pgn ? String(pgn).slice(0, 1000) : 'N/A'}
Number of blunders/mistakes flagged: ${Array.isArray(blunders) ? blunders.length : 0}
Player's stated learning goal: ${userGoal || 'Improve tactical vision and endgame technique'}

Provide a high-impact, encouraging coaching report grounded in concrete chess principles.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction: 'You are Grandmaster Mikhail, a concise, accurate chess coach. Always output valid JSON matching the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coachSummary: { type: Type.STRING, description: '2-3 sentences of direct grandmaster feedback.' },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            tacticalTakeaway: { type: Type.STRING },
            suggestedPuzzlesCategory: { type: Type.STRING },
            openingTip: { type: Type.STRING }
          }
        }
      }
    });

    const text = (response.text ?? '').trim();
    if (!text) {
      res.status(502).json({ error: 'Empty response from Gemini coach model.', code: 'EMPTY_RESPONSE' });
      return;
    }

    let data: Partial<CoachReport>;
    try {
      data = JSON.parse(text) as Partial<CoachReport>;
    } catch {
      res.status(502).json({ error: 'Malformed JSON received from Gemini coach model.', code: 'INVALID_RESPONSE_FORMAT' });
      return;
    }

    res.json({
      coachSummary: data.coachSummary || 'Focus on piece coordination and tactical foresight.',
      keyStrengths: Array.isArray(data.keyStrengths) ? data.keyStrengths : [],
      areasForImprovement: Array.isArray(data.areasForImprovement) ? data.areasForImprovement : [],
      tacticalTakeaway: data.tacticalTakeaway || 'Check checks, captures, and threats before every move.',
      suggestedPuzzlesCategory: data.suggestedPuzzlesCategory || 'Pin & Skewer',
      openingTip: data.openingTip || 'Develop minor pieces toward the center and safeguard the King early.',
      mode: 'gemini'
    });
  } catch (err: unknown) {
    const mapped = mapGeminiError(err);
    res.status(mapped.status).json({ error: mapped.message, code: mapped.code });
  }
});

// Per-move Coach Mikhail interactive explanation endpoint (surfaces real error status if failing)
app.post('/api/coach/explain-move', apiRateLimit(30), async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: 'Gemini API key not configured. Add GEMINI_API_KEY in Secrets, or use the Local Move Breakdown.',
      code: 'MISSING_API_KEY'
    });
    return;
  }

  const {
    fenBefore,
    fenAfter,
    playedSan,
    bestSan,
    bestMoveSan,
    classification,
    evalBeforeCp,
    evalAfterCp,
    moveAccuracy,
    pvSan,
    threats,
    mode,
    userQuestion,
    question
  } = req.body || {};

  const resolvedBestSan = bestSan || bestMoveSan;
  const resolvedQuestion = userQuestion || question;

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Analyze this chess move clearly for an improving club player (${mode === 'live_coach' ? 'mid-game live coaching' : 'post-game review'}):
- FEN before move: ${fenBefore || 'unknown'}
- FEN after move: ${fenAfter || 'unknown'}
- Move played: ${playedSan || 'unknown'} (classification: ${classification || 'good'}, move accuracy: ${typeof moveAccuracy === 'number' ? `${moveAccuracy}%` : 'unknown'})
- Engine best move: ${resolvedBestSan || playedSan || 'unknown'}
- Engine continuation PV: ${Array.isArray(pvSan) ? pvSan.join(' ') : 'N/A'}
- Evaluation swing (White perspective, centipawns): ${evalBeforeCp ?? 0} -> ${evalAfterCp ?? 0}
- Threatened squares after move: ${Array.isArray(threats) && threats.length > 0 ? threats.join(', ') : 'none'}
${resolvedQuestion ? `- Player's specific question: ${resolvedQuestion}` : ''}

Give concise, practical chess coaching without fluff.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction:
          'You are Coach Mikhail, a supportive Chess Grandmaster instructor. Return crisp, accurate chess explanations matching the JSON schema. Keep each field 1-2 sentences.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: 'Short headline summarizing the move quality and key idea.' },
            whyMoveWorkedOrFailed: { type: Type.STRING, description: 'Concrete tactical or positional reason why the played move succeeded or faltered.' },
            bestMoveIdea: { type: Type.STRING, description: 'Why the engine best move and continuation work better.' },
            coachTip: { type: Type.STRING, description: 'One actionable chess habit or rule of thumb for next time.' }
          }
        }
      }
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      res.status(502).json({ error: 'Empty response from Gemini move coach.', code: 'EMPTY_RESPONSE' });
      return;
    }
    const parsed = JSON.parse(rawText) as Partial<MoveCoachExplanation>;
    res.json({
      headline: parsed.headline || `${playedSan || 'Move'} breakdown`,
      whyMoveWorkedOrFailed: parsed.whyMoveWorkedOrFailed || 'Evaluation changed noticeably on this move.',
      bestMoveIdea: parsed.bestMoveIdea || `Top alternative: ${resolvedBestSan || playedSan || 'best continuation'}.`,
      coachTip: parsed.coachTip || 'Scan checks, captures, and threats before committing.',
      source: 'gemini'
    });
  } catch (err: unknown) {
    const mapped = mapGeminiError(err);
    res.status(mapped.status).json({ error: mapped.message, code: mapped.code });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null
      },
      appType: 'spa',
    });
    // Vite still injects <script type="module" src="/@vite/client"> in dev even when hmr: false;
    // serving a no-WebSocket client shim avoids failed ws://...:24678 connections in proxy/iFrame dev.
    app.get('/@vite/client', (_req, res) => {
      res.type('application/javascript').send(`export class ErrorOverlay {
  constructor() {}
  close() {}
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    decline() {},
    invalidate() {},
    on() {},
    off() {},
    send() {}
  };
}
export function injectQuery(url) {
  return url;
}
const sheetsMap = new Map();
export function updateStyle(id, content) {
  if (typeof document === 'undefined') return;
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    document.head.appendChild(style);
    sheetsMap.set(id, style);
  } else if (style.textContent !== content) {
    style.textContent = content;
  }
}
export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
    sheetsMap.delete(id);
  }
}
`);
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
