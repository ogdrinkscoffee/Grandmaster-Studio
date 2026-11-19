/**
 * Minimal UCI client for Stockfish 19 (lite, single-threaded WASM) running in a Web Worker.
 * Files live in /public/stockfish (GPL-3, see public/stockfish/README.md).
 *
 * - One search at a time; requests queue up.
 * - A request with a `key` supersedes queued requests with the same key and stops a running one,
 *   so rapid position changes (e.g. stepping through moves) never pile up.
 * - Any load failure or hang marks the engine unavailable so callers fall back to the built-in engine.
 */

export interface UciLine {
  multipv: number;
  depth: number;
  /** Score from the side to move's perspective. Exactly one of cp / mate is set. */
  cp?: number;
  mate?: number;
  pv: string[];
}

export interface UciSearchResult {
  bestmove: string | null;
  lines: UciLine[];
}

export type UciStrength = { kind: 'full' } | { kind: 'elo'; elo: number } | { kind: 'skill'; level: number };

export interface UciSearchRequest {
  /** FEN of the starting position, plus optional UCI moves played from it. */
  fen: string;
  moves?: string[];
  movetime?: number;
  depth?: number;
  multipv?: number;
  strength?: UciStrength;
}

interface Job {
  req: UciSearchRequest;
  key?: string;
  resolve: (r: UciSearchResult) => void;
  reject: (e: Error) => void;
}

const ENGINE_URL = `${import.meta.env.BASE_URL ?? '/'}stockfish/stockfish-19-lite-single.js`;
const INIT_TIMEOUT_MS = 20000;
const READY_TIMEOUT_MS = 5000;
const SEARCH_GRACE_MS = 5000;
const MAX_CONSECUTIVE_FAILURES = 3;

class StockfishClient {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private unavailable = typeof Worker === 'undefined';
  private consecutiveFailures = 0;
  private queue: Job[] = [];
  private current: Job | null = null;
  private lines = new Map<number, UciLine>();
  private waiter: {
    match: (line: string) => boolean;
    resolve: () => void;
    reject: (err: Error) => void;
    timer: number;
  } | null = null;
  private options: Record<string, string> = {};

  get isUnavailable() {
    return this.unavailable;
  }

  /** Start downloading/initialising the engine early so the first request is fast. */
  warmUp() {
    this.ensureReady().catch(() => undefined);
  }

  search(req: UciSearchRequest, key?: string): Promise<UciSearchResult> {
    if (this.unavailable) return Promise.reject(new Error('Stockfish unavailable'));
    return new Promise<UciSearchResult>((resolve, reject) => {
      if (key) {
        // Drop queued requests for the same purpose, and cut a running one short
        this.queue = this.queue.filter(j => {
          if (j.key !== key) return true;
          j.reject(new Error('superseded'));
          return false;
        });
        if (this.current?.key === key) this.worker?.postMessage('stop');
      }
      this.queue.push({ req, key, resolve, reject });
      this.pump();
    });
  }

  private ensureReady(): Promise<void> {
    if (this.unavailable) return Promise.reject(new Error('Stockfish unavailable'));
    if (this.ready) return this.ready;
    this.ready = new Promise<void>((resolve, reject) => {
      let worker: Worker;
      try {
        worker = new Worker(ENGINE_URL);
      } catch (err) {
        this.failAll();
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }
      this.worker = worker;
      let settled = false;
      const timer = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        this.failAll();
        reject(new Error('Stockfish init timed out'));
      }, INIT_TIMEOUT_MS);

      worker.onmessage = e => this.onLine(String(e.data));
      worker.onerror = () => {
        window.clearTimeout(timer);
        if (!settled) {
          settled = true;
          this.failAll();
          reject(new Error('Stockfish failed to load'));
        } else {
          this.recoverFromCrash('Stockfish worker crashed');
        }
      };

      this.send('uci');
      this.waitFor(l => l === 'uciok', INIT_TIMEOUT_MS)
        .then(() => {
          this.setOption('Hash', '32');
          this.send('isready');
          return this.waitFor(l => l === 'readyok', READY_TIMEOUT_MS);
        })
        .then(() => {
          window.clearTimeout(timer);
          if (!settled) {
            settled = true;
            this.consecutiveFailures = 0;
            resolve();
          }
        })
        .catch(err => {
          window.clearTimeout(timer);
          if (!settled) {
            settled = true;
            this.failAll();
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        });
    });
    return this.ready;
  }

  private clearWaiter(err?: Error) {
    if (!this.waiter) return;
    const w = this.waiter;
    this.waiter = null;
    window.clearTimeout(w.timer);
    if (err) w.reject(err);
  }

  private terminateWorker() {
    try {
      this.worker?.terminate();
    } catch {
      /* ignore */
    }
    this.worker = null;
    this.ready = null;
    this.options = {};
    this.lines.clear();
  }

  private recoverFromCrash(reason: string) {
    this.consecutiveFailures += 1;
    this.clearWaiter(new Error(reason));
    this.terminateWorker();
    const job = this.current;
    this.current = null;
    job?.reject(new Error(reason));

    if (this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      this.unavailable = true;
      const fatal = new Error('Stockfish unavailable');
      this.queue.forEach(j => j.reject(fatal));
      this.queue = [];
      return;
    }
    this.pump();
  }

  private failAll() {
    this.unavailable = true;
    const err = new Error('Stockfish unavailable');
    this.clearWaiter(err);
    this.terminateWorker();
    this.current?.reject(err);
    this.current = null;
    this.queue.forEach(j => j.reject(err));
    this.queue = [];
  }

  private send(cmd: string) {
    this.worker?.postMessage(cmd);
  }

  private setOption(name: string, value: string) {
    if (this.options[name] === value) return;
    this.options[name] = value;
    this.send(`setoption name ${name} value ${value}`);
  }

  private waitFor(match: (line: string) => boolean, timeoutMs = READY_TIMEOUT_MS): Promise<void> {
    this.clearWaiter(new Error('Superseded waiter'));
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        if (this.waiter) {
          this.waiter = null;
          reject(new Error('Stockfish handshake timed out'));
        }
      }, timeoutMs);
      this.waiter = { match, resolve, reject, timer };
    });
  }

  private onLine(line: string) {
    if (this.waiter && this.waiter.match(line)) {
      const w = this.waiter;
      this.waiter = null;
      window.clearTimeout(w.timer);
      w.resolve();
      return;
    }
    if (!this.current) return;

    if (line.startsWith('info ') && line.includes(' pv ') && !line.includes('bound')) {
      const parsed = parseInfo(line);
      if (parsed) this.lines.set(parsed.multipv, parsed);
      return;
    }
    if (line.startsWith('bestmove')) {
      const best = line.split(/\s+/)[1];
      const job = this.current;
      this.current = null;
      this.consecutiveFailures = 0;
      const lines = [...this.lines.values()].sort((a, b) => a.multipv - b.multipv);
      this.lines.clear();
      job.resolve({ bestmove: best && best !== '(none)' ? best : null, lines });
      this.pump();
    }
  }

  private async pump() {
    if (this.current || this.queue.length === 0) return;
    const job = this.queue.shift()!;
    this.current = job;
    try {
      await this.ensureReady();
    } catch (err) {
      if (this.current === job) {
        this.current = null;
        job.reject(err instanceof Error ? err : new Error(String(err)));
        this.pump();
      }
      return;
    }
    if (this.current !== job) return;

    const { req } = job;
    const strength = req.strength ?? { kind: 'full' };
    this.setOption('MultiPV', String(Math.max(1, req.multipv ?? 1)));
    if (strength.kind === 'elo') {
      this.setOption('Skill Level', '20');
      this.setOption('UCI_LimitStrength', 'true');
      this.setOption('UCI_Elo', String(Math.round(Math.min(3190, Math.max(1320, strength.elo)))));
    } else {
      this.setOption('UCI_LimitStrength', 'false');
      this.setOption('Skill Level', String(strength.kind === 'skill' ? Math.min(20, Math.max(0, strength.level)) : 20));
    }

    try {
      this.send('isready');
      await this.waitFor(l => l === 'readyok', READY_TIMEOUT_MS);
    } catch {
      if (this.current === job) {
        this.recoverFromCrash('Stockfish isready timed out');
      }
      return;
    }
    if (this.current !== job) return;

    this.lines.clear();
    const movesPart = req.moves && req.moves.length > 0 ? ` moves ${req.moves.join(' ')}` : '';
    this.send(`position fen ${req.fen}${movesPart}`);
    const limits = [req.depth ? `depth ${req.depth}` : '', req.movetime ? `movetime ${req.movetime}` : ''].filter(Boolean);
    this.send(`go ${limits.length ? limits.join(' ') : 'movetime 500'}`);

    // Safety net: if a single search stalls, recycle the worker and continue queued jobs
    const budget = (req.movetime ?? 3000) + SEARCH_GRACE_MS;
    window.setTimeout(() => {
      if (this.current !== job) return;
      this.send('stop');
      window.setTimeout(() => {
        if (this.current === job) {
          this.recoverFromCrash('Stockfish search timed out');
        }
      }, 1500);
    }, budget);
  }
}

function parseInfo(line: string): UciLine | null {
  const tokens = line.split(/\s+/);
  let multipv = 1;
  let depth = 0;
  let cp: number | undefined;
  let mate: number | undefined;
  let pv: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === 'multipv') multipv = parseInt(tokens[++i], 10);
    else if (t === 'depth') depth = parseInt(tokens[++i], 10);
    else if (t === 'score') {
      const kind = tokens[++i];
      const value = parseInt(tokens[++i], 10);
      if (kind === 'cp') cp = value;
      else if (kind === 'mate') mate = value;
    } else if (t === 'pv') {
      pv = tokens.slice(i + 1);
      break;
    }
  }
  if (pv.length === 0 || (cp === undefined && mate === undefined)) return null;
  return { multipv, depth, cp, mate, pv };
}

export const stockfish = new StockfishClient();
