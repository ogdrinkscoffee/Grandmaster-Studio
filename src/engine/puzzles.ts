import { Chess, Square } from 'chess.js';
import { Puzzle, PuzzleCategory } from '../types/chess';
import { LICHESS_PUZZLE_BANK } from './puzzleBank';

export const PUZZLE_CATEGORIES: PuzzleCategory[] = [
  'All Themes',
  'Mate & Back Rank',
  'Forks & Outposts',
  'Pins & Skewers',
  'Sacrifices & Attack',
  'Endgame & Defense'
];

export type PuzzleDifficultyBand = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'master';

const CURATED_PUZZLES: Puzzle[] = [
  // ==========================================
  // BEGINNER (400 - 950)
  // ==========================================
  {
    id: 'puz-01',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    moves: ['f3f7'],
    rating: 500,
    theme: 'Scholar Mate · Mate in 1',
    category: 'Mate & Back Rank',
    description: 'Find the instant checkmate delivering the blow to the weak f7 square.',
    playerColor: 'w',
  },
  {
    id: 'puz-16',
    fen: '4r1k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    moves: ['e1e8'],
    rating: 550,
    theme: 'Back Rank Capture Mate',
    category: 'Mate & Back Rank',
    description: 'Capture the defending rook on the back rank for immediate checkmate.',
    playerColor: 'w',
  },
  {
    id: 'puz-02',
    fen: '6k1/5ppp/8/8/8/8/4QPPP/6K1 w - - 0 1',
    moves: ['e2e8'],
    rating: 600,
    theme: 'Back Rank Mate in 1',
    category: 'Mate & Back Rank',
    description: 'The enemy king is trapped behind a wall of pawns.',
    playerColor: 'w',
  },
  {
    id: 'puz-17',
    fen: '1r4k1/5ppp/8/8/8/8/1q3PPP/6K1 b - - 0 1',
    moves: ['b2b1'],
    rating: 660,
    theme: 'Supported Back Rank Mate',
    category: 'Mate & Back Rank',
    description: 'Black to move — deliver checkmate along the exposed first rank.',
    playerColor: 'b',
  },
  {
    id: 'puz-03',
    fen: 'r1b1k2r/ppppqppp/2n5/4P3/1bP2Bn1/5N2/PP1NPPPP/R2QKB1R w KQkq - 4 7',
    moves: ['a2a3'],
    rating: 750,
    theme: 'Pawn Kick & Defense',
    category: 'Endgame & Defense',
    description: 'Put the question to the intrusive bishop and free your queenside.',
    playerColor: 'w',
  },
  {
    id: 'puz-18',
    fen: 'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1',
    moves: ['d5c7', 'e8d7', 'c7a8'],
    rating: 780,
    theme: 'Royal Fork (King + Rook)',
    category: 'Forks & Outposts',
    description: 'Leap into c7 to check the enemy king and win the corner rook.',
    playerColor: 'w',
  },
  {
    id: 'puz-04',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5',
    moves: ['c2c3'],
    rating: 850,
    theme: 'Center Control Prep',
    category: 'Endgame & Defense',
    description: 'Prepare the central break with d4 and secure an escape square.',
    playerColor: 'w',
  },
  {
    id: 'puz-05',
    fen: 'r1b2rk1/ppp2ppp/2n5/3qp3/8/3P1N2/PPP1BPPP/R2QK2R w KQ - 0 10',
    moves: ['e1g1'],
    rating: 900,
    theme: 'King Safety · Castle',
    category: 'Endgame & Defense',
    description: 'Safeguard your king and connect your rooks.',
    playerColor: 'w',
  },
  {
    id: 'puz-19',
    fen: '5k2/8/8/8/4n3/8/Q3RPPP/6K1 b - - 0 1',
    moves: ['e4c3', 'a2b1', 'c3e2'],
    rating: 940,
    theme: 'Queen & Rook Knight Fork',
    category: 'Forks & Outposts',
    description: 'Find the knight jump attacking both major White pieces at once.',
    playerColor: 'b',
  },

  // ==========================================
  // INTERMEDIATE (1000 - 1550)
  // ==========================================
  {
    id: 'puz-20',
    fen: '4k3/8/4q3/8/8/8/R7/4K3 w - - 0 1',
    moves: ['a2e2', 'e6e2', 'e1e2'],
    rating: 1020,
    theme: 'Absolute File Pin',
    category: 'Pins & Skewers',
    description: 'Pin the exposed queen directly to her own king on the e-file.',
    playerColor: 'w',
  },
  {
    id: 'puz-24',
    fen: '3k4/8/2P5/3K4/8/8/8/8 w - - 0 1',
    moves: ['d5d6', 'd8c8', 'c6c7', 'c8b7', 'd6d7'],
    rating: 1100,
    theme: 'King & Pawn Technique',
    category: 'Endgame & Defense',
    description: 'Lead with your king to escort the passed c-pawn to promotion.',
    playerColor: 'w',
  },
  {
    id: 'puz-06',
    fen: 'r1b1kb1r/pppp1ppp/5q2/4n3/3QP3/2N5/PPP2PPP/R1B1KB1R w KQkq - 1 7',
    moves: ['c3d5', 'f6d6', 'c1f4'],
    rating: 1150,
    theme: 'Knight Outpost Fork',
    category: 'Forks & Outposts',
    description: 'Centralize your knight with tempo against the exposed queen.',
    playerColor: 'w',
  },
  {
    id: 'puz-21',
    fen: '4r1k1/5ppp/8/b7/8/8/3Q1PPP/4K3 b - - 0 1',
    moves: ['a5b4', 'e1d1', 'b4d2'],
    rating: 1200,
    theme: 'Diagonal Absolute Pin',
    category: 'Pins & Skewers',
    description: "Pin White's queen to her king along the a5-e1 diagonal.",
    playerColor: 'b',
  },
  {
    id: 'puz-07',
    fen: 'r2qk2r/ppp1bppp/2np1n2/4p3/2B1P1b1/2NP1N2/PPP2PPP/R1BQR1K1 w kq - 3 8',
    moves: ['h2h3', 'g4h5', 'g2g4'],
    rating: 1250,
    theme: 'Pin Breaking',
    category: 'Pins & Skewers',
    description: 'Break the pin on your f3 knight and seize the kingside initiative.',
    playerColor: 'w',
  },
  {
    id: 'puz-25',
    fen: '6k1/p4pp1/7p/3q4/1B6/8/5PPP/R5K1 b - - 0 1',
    moves: ['d5d4', 'a1e1', 'd4b4'],
    rating: 1300,
    theme: 'Queen Double Attack',
    category: 'Forks & Outposts',
    description: 'Centralize your queen to simultaneously threaten both the rook and bishop.',
    playerColor: 'b',
  },
  {
    id: 'puz-08',
    fen: 'r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPP3PP/2KR1B1R w - - 0 10',
    moves: ['g2g4'],
    rating: 1350,
    theme: 'Yugoslav Attack Storm',
    category: 'Sacrifices & Attack',
    description: 'Launch the kingside pawn storm in this Sicilian Dragon structure.',
    playerColor: 'w',
  },
  {
    id: 'puz-26',
    fen: '6k1/5pp1/4q2p/8/8/8/B1P5/6K1 w - - 0 1',
    moves: ['a2b3', 'e6b3', 'c2b3'],
    rating: 1400,
    theme: 'Supported Diagonal Pin',
    category: 'Pins & Skewers',
    description: 'Use your pawn-protected bishop to lock the enemy queen in place.',
    playerColor: 'w',
  },
  {
    id: 'puz-22',
    fen: '3r2k1/5ppp/8/8/8/2Q5/5PPP/3R2K1 w - - 0 1',
    moves: ['c3c8', 'd8c8', 'd1d8'],
    rating: 1440,
    theme: 'Back Rank Deflection',
    category: 'Sacrifices & Attack',
    description: 'Sacrifice the queen to deflect the sole defender of the back rank.',
    playerColor: 'w',
  },
  {
    id: 'puz-09',
    fen: 'r1b2rk1/pp3ppp/2n1pn2/q1b5/2B5/P1N1PN2/1PQ2PPP/R1B1K2R w KQ - 1 11',
    moves: ['a1b1'],
    rating: 1480,
    theme: 'Tactical Trap Preparation',
    category: 'Pins & Skewers',
    description: 'Prepare b4 to trap or displace the black queen and bishop.',
    playerColor: 'w',
  },

  // ==========================================
  // ADVANCED (1600 - 2150)
  // ==========================================
  {
    id: 'puz-28',
    fen: '3r3k/1P4pp/8/8/8/8/5PPP/2R3K1 w - - 0 1',
    moves: ['c1c8', 'd8c8', 'b7c8q'],
    rating: 1640,
    theme: 'Passed Pawn Promotion Pin',
    category: 'Endgame & Defense',
    description: 'Use the rook pin to force a decisive capture-promotion.',
    playerColor: 'w',
  },
  {
    id: 'puz-10',
    fen: 'r1b2rk1/2q1bppp/p2ppn2/1p2P3/3B1P2/2NB1Q2/PPP3PP/4RRK1 w - - 0 15',
    moves: ['e5f6', 'e7f6', 'd4f6'],
    rating: 1680,
    theme: 'Kingside Breakthrough',
    category: 'Sacrifices & Attack',
    description: 'Shatter the black king shield by removing the key defensive minor pieces.',
    playerColor: 'w',
  },
  {
    id: 'puz-23',
    fen: '6k1/5ppp/bq6/8/6n1/8/6PP/R6K b - - 0 1',
    moves: ['g4f2', 'h1g1', 'f2h3', 'g1h1', 'b6g1', 'a1g1', 'h3f2'],
    rating: 1760,
    theme: 'Philidor Smothered Mate',
    category: 'Mate & Back Rank',
    description: 'Execute the timeless smothered mate combination with queen sacrifice.',
    playerColor: 'b',
  },
  {
    id: 'puz-11',
    fen: 'r4rk1/1pp2ppp/p1np1q2/4p3/1b2P1b1/2NP1NP1/PPP1BP1P/R2Q1RK1 w - - 0 11',
    moves: ['c3d5', 'f6d8', 'f3h4'],
    rating: 1820,
    theme: 'Knight Relocation & Swap',
    category: 'Forks & Outposts',
    description: "Occupy the dream outpost and neutralize black's active light-squared bishop.",
    playerColor: 'w',
  },
  {
    id: 'puz-27',
    fen: '6k1/5ppp/4r3/8/3n3q/8/5PPP/5RK1 b - - 0 1',
    moves: ['d4e2', 'g1h1', 'h4h2', 'h1h2', 'e6h6'],
    rating: 1920,
    theme: "Anastasia's Mate",
    category: 'Sacrifices & Attack',
    description: 'Trap the king on the h-file with knight control and a queen sacrifice.',
    playerColor: 'b',
  },
  {
    id: 'puz-12',
    fen: '2r2rk1/1b2qppp/pp2p3/n2pP3/P2P4/3B1N2/1P1Q1PPP/2R2RK1 w - - 4 19',
    moves: ['d3h7', 'g8h7', 'f3g5'],
    rating: 1980,
    theme: 'Greek Gift Sacrifice (Bxh7+)',
    category: 'Sacrifices & Attack',
    description: 'Unleash the classic bishop sacrifice against the castled king.',
    playerColor: 'w',
  },
  {
    id: 'puz-29',
    fen: 'r2q1rk1/pp2bppp/2n1bn2/3p4/3P4/2NB1N2/PP1B1PPP/R2Q1RK1 w - - 0 12',
    moves: ['f1e1', 'f8e8', 'a1c1'],
    rating: 2060,
    theme: 'Central File Domination',
    category: 'Endgame & Defense',
    description: 'Seize the open e-file and reinforce your queenside before expanding.',
    playerColor: 'w',
  },

  // ==========================================
  // GRANDMASTER (2200 - 2800+)
  // ==========================================
  {
    id: 'puz-30',
    fen: '5rk1/4Nppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    moves: ['e7f5', 'g7g6', 'f5h6'],
    rating: 2240,
    theme: 'Knight Restriction',
    category: 'Forks & Outposts',
    description: 'Re-route the knight to bind the enemy kingside dark squares.',
    playerColor: 'w',
  },
  {
    id: 'puz-13',
    fen: 'r1b2rk1/pp3ppp/8/3pb3/3Nn2q/1P2P3/PB2BPPP/2RQ1RK1 w - - 7 17',
    moves: ['g2g3', 'e4g3', 'f2g3', 'e5g3'],
    rating: 2350,
    theme: 'Defensive Fortification',
    category: 'Endgame & Defense',
    description: 'Navigate extreme tactical fireworks where opponent threatens mate.',
    playerColor: 'w',
  },
  {
    id: 'puz-14',
    fen: 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 8',
    moves: ['c4d5', 'e6d5', 'd4c5'],
    rating: 2480,
    theme: 'Isolated Pawn Creation',
    category: 'Endgame & Defense',
    description: 'Surgically saddle the opponent with an isolated queen pawn.',
    playerColor: 'w',
  },
  {
    id: 'puz-15',
    fen: '6k1/5p2/6p1/7p/3q4/1P4P1/2r2P1P/1Q2R1K1 w - - 0 35',
    moves: ['e1e8', 'g8g7', 'b1c2'],
    rating: 2750,
    theme: 'Back Rank Deflection Capture',
    category: 'Pins & Skewers',
    description: 'Deflect the king away to win the hanging rook.',
    playerColor: 'w',
  }
];

export const PUZZLE_DATABASE: Puzzle[] = [...CURATED_PUZZLES, ...LICHESS_PUZZLE_BANK];

/**
 * Normalize external theme string (e.g. from AI Coach) to one of the structured PuzzleCategories.
 */
export function normalizePuzzleCategory(themeHint?: string): PuzzleCategory {
  if (!themeHint) return 'All Themes';
  const lower = themeHint.toLowerCase();
  if (lower.includes('mate') || lower.includes('back rank')) return 'Mate & Back Rank';
  if (lower.includes('fork') || lower.includes('outpost') || lower.includes('knight')) return 'Forks & Outposts';
  if (lower.includes('pin') || lower.includes('skewer')) return 'Pins & Skewers';
  if (lower.includes('sac') || lower.includes('attack') || lower.includes('greek')) return 'Sacrifices & Attack';
  if (lower.includes('endgame') || lower.includes('defense') || lower.includes('pawn') || lower.includes('rook')) {
    return 'Endgame & Defense';
  }
  return 'All Themes';
}

export function matchesDifficultyBand(rating: number, band: PuzzleDifficultyBand): boolean {
  switch (band) {
    case 'beginner': return rating < 1000;
    case 'intermediate': return rating >= 1000 && rating < 1600;
    case 'advanced': return rating >= 1600 && rating < 2200;
    case 'master': return rating >= 2200;
    default: return true;
  }
}

export function getPuzzleCategoryCount(category: PuzzleCategory): number {
  if (category === 'All Themes') return PUZZLE_DATABASE.length;
  return PUZZLE_DATABASE.filter(p => p.category === category).length;
}

/**
 * Filter and select the closest matching puzzle for Adaptive or Themed training.
 */
export function getFilteredPuzzle(
  currentRating: number,
  category: PuzzleCategory = 'All Themes',
  difficultyBand: PuzzleDifficultyBand = 'all',
  solvedIds: string[] = [],
  excludeId?: string,
  searchQuery: string = ''
): Puzzle {
  const q = searchQuery.trim().toLowerCase();

  let pool = PUZZLE_DATABASE.filter(p => {
    const catMatch = category === 'All Themes' || p.category === category;
    const diffMatch = matchesDifficultyBand(p.rating, difficultyBand);
    const queryMatch =
      !q ||
      p.theme.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q);
    return catMatch && diffMatch && queryMatch;
  });

  if (pool.length === 0) {
    pool = PUZZLE_DATABASE;
  }

  const unsolved = pool.filter(p => !solvedIds.includes(p.id) && p.id !== excludeId);
  const candidates = unsolved.length > 0 ? unsolved : pool.filter(p => p.id !== excludeId);
  const finalPool = candidates.length > 0 ? candidates : pool;

  const sorted = [...finalPool].sort(
    (a, b) => Math.abs(a.rating - currentRating) - Math.abs(b.rating - currentRating)
  );

  const topCandidates = sorted.slice(0, Math.min(8, sorted.length));
  return topCandidates[Math.floor(Math.random() * topCandidates.length)];
}

/**
 * Given user's current puzzle rating, find the closest matching puzzle that hasn't been solved recently
 */
export function getAdaptivePuzzle(currentRating: number, solvedIds: string[] = []): Puzzle {
  return getFilteredPuzzle(currentRating, 'All Themes', 'all', solvedIds);
}

function hashDateKey(dateKey: string): number {
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) {
    h = (h * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return h;
}

function getTodayLocalDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const DAILY_PUZZLE_CACHE_KEY = 'gm_daily_puzzle_cache_v1';

/**
 * Deterministic daily challenge fallback + live Lichess Daily Puzzle loader.
 */
export function getLocalDailyPuzzle(dateKey: string = getTodayLocalDateKey()): Puzzle {
  const dayHash = hashDateKey(dateKey);
  const targetPool = PUZZLE_DATABASE.filter(p => p.rating >= 1100 && p.rating <= 2100);
  const pool = targetPool.length > 0 ? targetPool : PUZZLE_DATABASE;
  const picked = pool[dayHash % pool.length];
  return {
    ...picked,
    theme: `Daily Challenge · ${picked.theme}`
  };
}

export function getCachedDailyPuzzle(dateKey: string = getTodayLocalDateKey()): Puzzle {
  try {
    const raw = localStorage.getItem(DAILY_PUZZLE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { dateKey?: string; puzzle?: Puzzle };
      if (parsed?.dateKey === dateKey && parsed.puzzle?.fen && Array.isArray(parsed.puzzle.moves)) {
        return parsed.puzzle;
      }
    }
  } catch {
    // ignore storage errors
  }
  return getLocalDailyPuzzle(dateKey);
}

const PUZZLE_THEME_LABELS: Record<string, string> = {
  veryLong: 'Deep Calculation Line',
  long: 'Multi-Move Tactic',
  short: 'Sharp Tactical Shot',
  oneMove: 'Mate in One',
  backRankMate: 'Back Rank Mate',
  smotheredMate: 'Smothered Mate',
  arabianMate: 'Arabian Mate',
  anastasiaMate: "Anastasia's Mate",
  discoveredAttack: 'Discovered Attack',
  doubleCheck: 'Double Check',
  deflection: 'Deflection Tactic',
  attraction: 'Decoy & Attraction',
  clearance: 'Clearance Sacrifice',
  interference: 'Interference Tactic',
  intermezzo: 'In-Between Move',
  quietMove: 'Quiet Winning Move',
  xRayAttack: 'X-Ray Attack',
  zugzwang: 'Zugzwang Endgame',
  hangingPiece: 'Hanging Piece',
  trappedPiece: 'Trapped Piece',
  exposedKing: 'Exposed King Attack',
  kingsideAttack: 'Kingside Attack',
  queensideAttack: 'Queenside Attack',
  endgame: 'Endgame Technique',
  middlegame: 'Middlegame Tactic',
  crushing: 'Crushing Advantage',
  advantage: 'Winning Advantage',
  mateIn1: 'Mate in 1',
  mateIn2: 'Mate in 2',
  mateIn3: 'Mate in 3',
  mateIn4: 'Mate in 4',
  fork: 'Knight / Double Fork',
  pin: 'Tactical Pin',
  skewer: 'Skewer Tactic',
  sacrifice: 'Tactical Sacrifice',
  promotion: 'Pawn Promotion'
};

export function formatPuzzleThemeLabel(rawTheme: string): string {
  const cleaned = rawTheme.replace(/^Daily Challenge · /, '').trim();
  if (!cleaned) return 'Daily Tactic';
  if (PUZZLE_THEME_LABELS[cleaned]) return PUZZLE_THEME_LABELS[cleaned];
  if (cleaned.includes(' ')) return cleaned;
  return cleaned
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d+)/g, '$1 $2')
    .replace(/^./, c => c.toUpperCase());
}

export async function fetchDailyLichessPuzzle(dateKey: string = getTodayLocalDateKey()): Promise<Puzzle> {
  try {
    const res = await fetch('https://lichess.org/api/puzzle/daily');
    if (!res.ok) return getLocalDailyPuzzle(dateKey);
    const data = await res.json();
    const pgn: string | undefined = data?.game?.pgn;
    const initialPly: number | undefined = data?.puzzle?.initialPly;
    const solution: string[] | undefined = data?.puzzle?.solution;
    const rating: number = data?.puzzle?.rating || 1600;
    const themes: string[] = data?.puzzle?.themes || [];

    if (!pgn || typeof initialPly !== 'number' || !Array.isArray(solution) || solution.length === 0) {
      return getLocalDailyPuzzle(dateKey);
    }

    const replay = new Chess();
    const tokens = pgn.trim().split(/\s+/);
    const board = new Chess();
    let applied = 0;
    for (const san of tokens) {
      if (applied > initialPly) break;
      try {
        const mv = replay.move(san);
        if (mv) {
          board.move(mv.san);
          applied++;
        }
      } catch {
        // ignore header/move numbers
      }
    }

    const fen = board.fen();
    const playerColor = board.turn();
    // Validate solution legality before exposing to UI
    const verifier = new Chess(fen);
    for (const uci of solution) {
      const m = verifier.move({
        from: uci.slice(0, 2) as Square,
        to: uci.slice(2, 4) as Square,
        promotion: uci.length > 4 ? uci[4] : undefined
      });
      if (!m) return getLocalDailyPuzzle(dateKey);
    }

    const primaryTheme = formatPuzzleThemeLabel(themes[0] || 'Daily Tactic');
    const category = normalizePuzzleCategory(themes.join(' '));
    const dailyPuzzle: Puzzle = {
      id: `daily-${dateKey}-${data?.puzzle?.id || Date.now()}`,
      fen,
      moves: solution,
      rating,
      theme: `Daily Challenge · ${primaryTheme}`,
      category: category === 'All Themes' ? 'Sacrifices & Attack' : category,
      description: `${playerColor === 'w' ? 'White' : 'Black'} to move — solve today's featured community tactical challenge.`,
      playerColor
    };
    try {
      localStorage.setItem(DAILY_PUZZLE_CACHE_KEY, JSON.stringify({ dateKey, puzzle: dailyPuzzle }));
    } catch {
      // ignore storage quota errors
    }
    return dailyPuzzle;
  } catch {
    return getLocalDailyPuzzle(dateKey);
  }
}

/**
 * Generate an ascending difficulty sequence for Puzzle Rush (3:00 survival).
 */
export function getPuzzleRushSequence(): Puzzle[] {
  return [...PUZZLE_DATABASE].sort((a, b) => a.rating - b.rating);
}

/**
 * Calculate Elo rating change after a puzzle attempt
 * Standard K-factor = 32
 */
export function calculatePuzzleRatingChange(userRating: number, puzzleRating: number, success: boolean): number {
  const K = 32;
  const expected = 1 / (1 + Math.pow(10, (puzzleRating - userRating) / 400));
  const actual = success ? 1 : 0;
  return Math.round(K * (actual - expected));
}
