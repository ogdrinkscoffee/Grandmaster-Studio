import { PROGRESS_EVENT } from './progressEvents';

export const DAILY_STREAK_STORAGE_KEY = 'gm_daily_puzzle_streak_v1';
export const VISION_BEST_STORAGE_KEY = 'gm_vision_best_v1';

export interface DailyPuzzleStreakState {
  solvedDates: string[];
  dailyChallengeSolvedDates: string[];
  bestStreak: number;
}

export interface DailyStreakSummary {
  currentStreak: number;
  bestStreak: number;
  solvedToday: boolean;
  dailyChallengeSolvedToday: boolean;
  atRisk: boolean;
  totalActiveDays: number;
  last7Days: {
    dateKey: string;
    label: string;
    isToday: boolean;
    solved: boolean;
  }[];
}

export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
  dt.setDate(dt.getDate() + deltaDays);
  return getLocalDateKey(dt);
}

function getWeekdayShortLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
  return dt.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
}

function normalizeUniqueDates(dates: unknown): string[] {
  if (!Array.isArray(dates)) return [];
  const valid = dates.filter(
    (d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
  );
  return Array.from(new Set(valid)).sort();
}

export function loadDailyPuzzleStreakState(): DailyPuzzleStreakState {
  try {
    const raw = localStorage.getItem(DAILY_STREAK_STORAGE_KEY);
    if (!raw) {
      return { solvedDates: [], dailyChallengeSolvedDates: [], bestStreak: 0 };
    }
    const parsed = JSON.parse(raw) as Partial<DailyPuzzleStreakState>;
    return {
      solvedDates: normalizeUniqueDates(parsed.solvedDates),
      dailyChallengeSolvedDates: normalizeUniqueDates(parsed.dailyChallengeSolvedDates),
      bestStreak: typeof parsed.bestStreak === 'number' && parsed.bestStreak >= 0 ? parsed.bestStreak : 0
    };
  } catch {
    return { solvedDates: [], dailyChallengeSolvedDates: [], bestStreak: 0 };
  }
}

export function saveDailyPuzzleStreakState(state: DailyPuzzleStreakState): void {
  try {
    localStorage.setItem(DAILY_STREAK_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

function computeLongestRun(sortedUniqueDates: string[]): number {
  if (sortedUniqueDates.length === 0) return 0;
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sortedUniqueDates.length; i++) {
    if (shiftDateKey(sortedUniqueDates[i - 1], 1) === sortedUniqueDates[i]) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }
  return longest;
}

export function computeDailyPuzzleStreak(
  state: DailyPuzzleStreakState,
  todayKey: string = getLocalDateKey()
): DailyStreakSummary {
  const solvedSet = new Set(normalizeUniqueDates(state.solvedDates));
  const dailySet = new Set(normalizeUniqueDates(state.dailyChallengeSolvedDates));

  const solvedToday = solvedSet.has(todayKey);
  const dailyChallengeSolvedToday = dailySet.has(todayKey);
  const yesterdayKey = shiftDateKey(todayKey, -1);

  // Active streak counts backwards from today if solved today, or from yesterday while today is still open
  let currentStreak = 0;
  let cursor = solvedToday ? todayKey : solvedSet.has(yesterdayKey) ? yesterdayKey : null;
  while (cursor && solvedSet.has(cursor)) {
    currentStreak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  const longestRun = computeLongestRun(Array.from(solvedSet).sort());
  const bestStreak = Math.max(state.bestStreak || 0, currentStreak, longestRun);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const offset = i - 6;
    const dateKey = shiftDateKey(todayKey, offset);
    return {
      dateKey,
      label: offset === 0 ? 'Today' : getWeekdayShortLabel(dateKey),
      isToday: offset === 0,
      solved: solvedSet.has(dateKey)
    };
  });

  return {
    currentStreak,
    bestStreak,
    solvedToday,
    dailyChallengeSolvedToday,
    atRisk: currentStreak > 0 && !solvedToday,
    totalActiveDays: solvedSet.size,
    last7Days
  };
}

export function recordPuzzleSolvedToday(options?: {
  isDailyChallenge?: boolean;
  dateKey?: string;
}): DailyPuzzleStreakState {
  const todayKey = options?.dateKey || getLocalDateKey();
  const prev = loadDailyPuzzleStreakState();
  const solvedDates = prev.solvedDates.includes(todayKey)
    ? prev.solvedDates
    : [...prev.solvedDates, todayKey].sort();

  const dailyChallengeSolvedDates = options?.isDailyChallenge
    ? prev.dailyChallengeSolvedDates.includes(todayKey)
      ? prev.dailyChallengeSolvedDates
      : [...prev.dailyChallengeSolvedDates, todayKey].sort()
    : prev.dailyChallengeSolvedDates;

  const tempState: DailyPuzzleStreakState = {
    solvedDates,
    dailyChallengeSolvedDates,
    bestStreak: prev.bestStreak
  };
  const summary = computeDailyPuzzleStreak(tempState, todayKey);
  const nextState: DailyPuzzleStreakState = {
    solvedDates,
    dailyChallengeSolvedDates,
    bestStreak: summary.bestStreak
  };

  saveDailyPuzzleStreakState(nextState);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  }
  return nextState;
}
