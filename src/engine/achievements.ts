import { GameHistoryItem, MoveAnalysis, UserProfile } from '../types/chess';
import { MASTERY_TARGET, OPENING_REPERTOIRE, OpeningProgress, loadOpeningProgress } from './openingRepertoire';
import { DrillProgress, ENDGAME_DRILLS, loadDrillProgress } from './endgameDrills';
import {
  DailyStreakSummary,
  computeDailyPuzzleStreak,
  loadDailyPuzzleStreakState
} from './dailyPuzzleStreak';

/**
 * Achievements are derived from data the app already stores (games, profile stats and
 * training progress), so nothing needs special tracking and past activity counts.
 */

export type AchievementCategory = 'Games' | 'Puzzles' | 'Training';

export interface AchievementContext {
  profile: UserProfile;
  /** Games played in the app (imports excluded). */
  playedGames: GameHistoryItem[];
  importedGames: GameHistoryItem[];
  openingProgress: Record<string, OpeningProgress>;
  drillProgress: Record<string, DrillProgress>;
  dailyStreak: DailyStreakSummary;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  progress: (ctx: AchievementContext) => { current: number; target: number };
}

const isWin = (g: GameHistoryItem) =>
  (g.result === '1-0' && g.playerColor === 'w') || (g.result === '0-1' && g.playerColor === 'b');

/** The player's own analysed moves (white moves first from the standard start). */
const playerMoves = (g: GameHistoryItem): MoveAnalysis[] =>
  (g.analyzedMoves || []).filter((_, i) => (i % 2 === 0 ? 'w' : 'b') === g.playerColor);

const count = (n: number, target: number) => ({ current: Math.min(n, target), target });
const flag = (ok: boolean) => ({ current: ok ? 1 : 0, target: 1 });

export const ACHIEVEMENTS: AchievementDef[] = [
  // Games
  {
    id: 'first-win',
    name: 'First Blood',
    description: 'Win a game',
    icon: '🏆',
    category: 'Games',
    progress: ctx => flag(ctx.playedGames.some(isWin))
  },
  {
    id: 'checkmate-artist',
    name: 'Checkmate Artist',
    description: 'Win a game by checkmate',
    icon: '♚',
    category: 'Games',
    progress: ctx => flag(ctx.playedGames.some(g => isWin(g) && g.reason === 'checkmate'))
  },
  {
    id: 'hot-streak',
    name: 'Hot Streak',
    description: 'Win 3 games in a row',
    icon: '🔥',
    category: 'Games',
    progress: ctx => count(ctx.profile.stats.currentStreak, 3)
  },
  {
    id: 'giant-slayer',
    name: 'Giant Slayer',
    description: 'Beat an opponent rated 200+ above you',
    icon: '🗡️',
    category: 'Games',
    progress: ctx =>
      flag(ctx.playedGames.some(g => isWin(g) && g.opponentElo >= ctx.profile.ratings.rapid + 200))
  },
  {
    id: 'brilliant',
    name: 'Brilliant!',
    description: 'Play a brilliant move',
    icon: '💎',
    category: 'Games',
    progress: ctx => flag(ctx.playedGames.some(g => playerMoves(g).some(m => m.classification === 'brilliant')))
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Finish a game with 90%+ accuracy',
    icon: '🎯',
    category: 'Games',
    progress: ctx => flag(ctx.playedGames.some(g => (g.playerAccuracy ?? 0) >= 90))
  },
  {
    id: 'clean-sheet',
    name: 'Clean Sheet',
    description: 'Win a 20+ move game without a single blunder',
    icon: '🧼',
    category: 'Games',
    progress: ctx =>
      flag(
        ctx.playedGames.some(
          g => isWin(g) && g.movesCount >= 40 && playerMoves(g).length > 0 && !playerMoves(g).some(m => m.classification === 'blunder')
        )
      )
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Play 3 different variants',
    icon: '🧭',
    category: 'Games',
    progress: ctx => count(new Set(ctx.playedGames.map(g => g.variant)).size, 3)
  },
  {
    id: 'marathon',
    name: 'Marathon',
    description: 'Play a game lasting 40+ moves',
    icon: '⏳',
    category: 'Games',
    progress: ctx => flag(ctx.playedGames.some(g => g.movesCount >= 80))
  },
  {
    id: 'student',
    name: 'Student of the Game',
    description: 'Import a game for review',
    icon: '📥',
    category: 'Games',
    progress: ctx => count(ctx.importedGames.length, 1)
  },

  // Puzzles
  {
    id: 'puzzle-50',
    name: 'Puzzle Solver',
    description: 'Solve 50 puzzles',
    icon: '🧩',
    category: 'Puzzles',
    progress: ctx => count(ctx.profile.stats.puzzlesSolved, 50)
  },
  {
    id: 'puzzle-250',
    name: 'Puzzle Master',
    description: 'Solve 250 puzzles',
    icon: '🧠',
    category: 'Puzzles',
    progress: ctx => count(ctx.profile.stats.puzzlesSolved, 250)
  },
  {
    id: 'puzzle-1800',
    name: 'Tactician',
    description: 'Reach an 1800 puzzle rating',
    icon: '⚡',
    category: 'Puzzles',
    progress: ctx => count(ctx.profile.ratings.puzzles, 1800)
  },
  {
    id: 'daily-streak-3',
    name: 'Daily Habit',
    description: 'Solve at least 1 puzzle for 3 consecutive days',
    icon: '🔥',
    category: 'Puzzles',
    progress: ctx => count(ctx.dailyStreak.bestStreak, 3)
  },
  {
    id: 'daily-streak-7',
    name: 'Week of Tactics',
    description: 'Maintain a 7-day Daily Puzzle Streak',
    icon: '🗓️',
    category: 'Puzzles',
    progress: ctx => count(ctx.dailyStreak.bestStreak, 7)
  },

  // Training
  {
    id: 'book-worm',
    name: 'Book Worm',
    description: 'Drill an opening perfectly from memory',
    icon: '📖',
    category: 'Training',
    progress: ctx => flag(Object.values(ctx.openingProgress).some(p => p.perfectDrills > 0))
  },
  {
    id: 'repertoire',
    name: 'Repertoire Builder',
    description: `Master 3 openings (${MASTERY_TARGET}★ each)`,
    icon: '📚',
    category: 'Training',
    progress: ctx =>
      count(
        OPENING_REPERTOIRE.filter(l => (ctx.openingProgress[l.id]?.perfectDrills ?? 0) >= MASTERY_TARGET).length,
        3
      )
  },
  {
    id: 'endgame-technician',
    name: 'Endgame Technician',
    description: 'Complete 4 different endgame drills',
    icon: '♜',
    category: 'Training',
    progress: ctx =>
      count(ENDGAME_DRILLS.filter(d => (ctx.drillProgress[d.id]?.completions ?? 0) > 0).length, 4)
  },
  {
    id: 'endgame-perfectionist',
    name: 'Perfectionist',
    description: '3★ on every endgame drill',
    icon: '👑',
    category: 'Training',
    progress: ctx =>
      count(ENDGAME_DRILLS.filter(d => (ctx.drillProgress[d.id]?.bestStars ?? 0) >= 3).length, ENDGAME_DRILLS.length)
  }
];

export function buildAchievementContext(profile: UserProfile, matches: GameHistoryItem[]): AchievementContext {
  return {
    profile,
    playedGames: matches.filter(g => !g.id.startsWith('import-')),
    importedGames: matches.filter(g => g.id.startsWith('import-')),
    openingProgress: loadOpeningProgress(),
    drillProgress: loadDrillProgress(),
    dailyStreak: computeDailyPuzzleStreak(loadDailyPuzzleStreakState())
  };
}

export interface AchievementStatus {
  def: AchievementDef;
  current: number;
  target: number;
  unlocked: boolean;
  unlockedOn?: string;
}

export function evaluateAchievements(ctx: AchievementContext, unlockDates: Record<string, string>): AchievementStatus[] {
  return ACHIEVEMENTS.map(def => {
    const { current, target } = def.progress(ctx);
    const unlocked = current >= target;
    return { def, current, target, unlocked, unlockedOn: unlocked ? unlockDates[def.id] : undefined };
  });
}

// ---- Persistence of unlock dates ----

export { PROGRESS_EVENT } from './progressEvents';
export const ACHIEVEMENTS_KEY = 'gm_achievements_unlocked';

export function loadUnlockDates(): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : null;
  } catch {
    return null;
  }
}

export function saveUnlockDates(dates: Record<string, string>) {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(dates));
  } catch {
    // storage unavailable
  }
}
