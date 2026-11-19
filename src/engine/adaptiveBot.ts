import { GameHistoryItem, PieceColor } from '../types/chess';
import { AI_BOT_PROFILES, BotPlayStyle, BotProfile } from './chessEngine';

export type AdaptivePosture = 'auto' | 'easy' | 'hard';

export const DEFEATED_BOTS_STORAGE_KEY = 'gm_defeated_bots_v1';

export interface AdaptiveBotContext {
  playerRapidElo: number;
  recentGames: GameHistoryItem[];
  posture?: AdaptivePosture;
  /** White-perspective centipawns evaluation in an ongoing game. */
  inGameEvalCp?: number;
  playerColor?: PieceColor;
  /** Last few move accuracies (0–100) played by the human in the current match. */
  recentPlayerMoveAccuracies?: number[];
  playerBlundersInGame?: number;
  movesPlayed?: number;
}

export interface AdaptiveBotResolution {
  bot: BotProfile;
  effectiveElo: number;
  blunderRate: number;
  posture: AdaptivePosture;
  formScore: number;
  tierLabel: string;
  accentHex: string;
  reasonSummary: string;
  telemetry: {
    recentWinRate: number | null;
    recentAccuracy: number | null;
    blundersPerGame: number | null;
    streakLabel: string;
    inGameEdgeCp: number | null;
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function loadDefeatedBots(): string[] {
  try {
    const raw = localStorage.getItem(DEFEATED_BOTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function recordDefeatedBot(botId: string): string[] {
  if (!botId) return loadDefeatedBots();
  const existing = loadDefeatedBots();
  if (existing.includes(botId)) return existing;
  const next = [...existing, botId];
  try {
    localStorage.setItem(DEFEATED_BOTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage quota errors
  }
  return next;
}

/**
 * Dynamically calibrates Coach Mikhail's Adaptive AI based on the player's
 * recent match history (win/loss streak, mean accuracy, blunder tendency) AND
 * live in-game board performance (advantage/deficit, recent move accuracy, blunders).
 */
export function resolveAdaptiveBot(ctx: AdaptiveBotContext): AdaptiveBotResolution {
  const posture: AdaptivePosture = ctx.posture || 'auto';
  const baseTemplate = AI_BOT_PROFILES.find(b => b.id === 'bot_adaptive_coach') || AI_BOT_PROFILES[0];
  const baseElo = clamp(Math.round(ctx.playerRapidElo || 1400), 400, 2600);

  const sample = (ctx.recentGames || []).slice(0, 6);
  let recentWinRate: number | null = null;
  let recentAccuracy: number | null = null;
  let blundersPerGame: number | null = null;
  let streakDelta = 0;
  let streakLabel = 'Even form';

  let eloShift = 0;
  let formScore = 0;

  if (sample.length > 0) {
    let wins = 0;
    let losses = 0;
    for (const g of sample) {
      const won = (g.playerColor === 'w' && g.result === '1-0') || (g.playerColor === 'b' && g.result === '0-1');
      const drew = g.result === '1/2-1/2';
      if (won) wins += 1;
      else if (!drew) losses += 1;
    }
    recentWinRate = Math.round((wins / sample.length) * 100);

    // Consecutive streak from most recent game
    for (const g of sample) {
      const won = (g.playerColor === 'w' && g.result === '1-0') || (g.playerColor === 'b' && g.result === '0-1');
      const drew = g.result === '1/2-1/2';
      if (drew) break;
      if (streakDelta === 0) {
        streakDelta = won ? 1 : -1;
      } else if ((streakDelta > 0 && won) || (streakDelta < 0 && !won)) {
        streakDelta += won ? 1 : -1;
      } else {
        break;
      }
    }

    if (streakDelta >= 2) {
      streakLabel = `${streakDelta}W streak`;
      eloShift += Math.min(160, streakDelta * 45);
      formScore += Math.min(30, streakDelta * 10);
    } else if (streakDelta <= -2) {
      streakLabel = `${Math.abs(streakDelta)}L slump`;
      eloShift -= Math.min(190, Math.abs(streakDelta) * 55);
      formScore -= Math.min(35, Math.abs(streakDelta) * 12);
    } else if (wins > losses) {
      streakLabel = 'Positive form';
    } else if (losses > wins) {
      streakLabel = 'Recovering form';
    }

    if (recentWinRate >= 70) {
      eloShift += 120;
      formScore += 22;
    } else if (recentWinRate <= 30) {
      eloShift -= 150;
      formScore -= 25;
    }

    const accItems = sample.filter(g => typeof g.playerAccuracy === 'number');
    if (accItems.length > 0) {
      recentAccuracy =
        Math.round(
          (accItems.reduce((sum, g) => sum + (g.playerAccuracy as number), 0) / accItems.length) * 10
        ) / 10;
      if (recentAccuracy >= 88) {
        eloShift += 130;
        formScore += 20;
      } else if (recentAccuracy >= 80) {
        eloShift += 45;
        formScore += 8;
      } else if (recentAccuracy <= 68) {
        eloShift -= 160;
        formScore -= 24;
      } else if (recentAccuracy <= 74) {
        eloShift -= 75;
        formScore -= 12;
      }
    }

    blundersPerGame =
      Math.round((sample.reduce((sum, g) => sum + (g.blundersCount ?? 0), 0) / sample.length) * 10) / 10;
    if (blundersPerGame >= 2.2) {
      eloShift -= 130;
      formScore -= 18;
    } else if (blundersPerGame <= 0.4) {
      eloShift += 80;
      formScore += 12;
    }
  }

  // Live in-game performance adjustment
  let inGameEdgeCp: number | null = null;
  const reasons: string[] = [];

  if (typeof ctx.inGameEvalCp === 'number' && (ctx.movesPlayed ?? 0) >= 2) {
    const color = ctx.playerColor || 'w';
    inGameEdgeCp = color === 'w' ? ctx.inGameEvalCp : -ctx.inGameEvalCp;

    if (inGameEdgeCp <= -280) {
      eloShift -= 210;
      formScore -= 30;
      reasons.push('easing pressure while you fight back from a deficit');
    } else if (inGameEdgeCp <= -130) {
      eloShift -= 105;
      formScore -= 14;
      reasons.push('giving constructive breathing room after recent slips');
    } else if (inGameEdgeCp >= 220) {
      eloShift += 220;
      formScore += 28;
      reasons.push('sharpening defenses because you hold a strong advantage');
    } else if (inGameEdgeCp >= 90) {
      eloShift += 95;
      formScore += 12;
    }
  }

  if (ctx.recentPlayerMoveAccuracies && ctx.recentPlayerMoveAccuracies.length >= 2) {
    const liveAcc =
      ctx.recentPlayerMoveAccuracies.reduce((a, b) => a + b, 0) / ctx.recentPlayerMoveAccuracies.length;
    if (liveAcc >= 91) {
      eloShift += 125;
      formScore += 16;
      if (reasons.length === 0) reasons.push(`matching your crisp ${Math.round(liveAcc)}% live accuracy`);
    } else if (liveAcc <= 64) {
      eloShift -= 145;
      formScore -= 18;
      if (reasons.length === 0) reasons.push('softening tactical traps after inaccurate moves');
    }
  }

  if ((ctx.playerBlundersInGame ?? 0) >= 2) {
    eloShift -= 120;
    formScore -= 15;
  }

  // Posture bias requested by player
  if (posture === 'easy') {
    eloShift -= 280;
    formScore -= 30;
  } else if (posture === 'hard') {
    eloShift += 300;
    formScore += 32;
  }

  const rawEffectiveElo = baseElo + clamp(eloShift, -550, 620);
  const effectiveElo = clamp(Math.round(rawEffectiveElo / 10) * 10, 350, 2950);
  const clampedForm = clamp(Math.round(formScore), -100, 100);

  let depth = 3;
  let blunderRate = 0.1;
  let timeLimitMs: number | undefined;
  let playStyle: BotPlayStyle = 'balanced';

  if (effectiveElo < 650) {
    depth = 1;
    blunderRate = 0.42;
    playStyle = 'balanced';
  } else if (effectiveElo < 1050) {
    depth = 2;
    blunderRate = 0.24;
    playStyle = 'positional';
  } else if (effectiveElo < 1450) {
    depth = 3;
    blunderRate = 0.14;
    playStyle = 'positional';
  } else if (effectiveElo < 1850) {
    depth = 3;
    blunderRate = 0.06;
    playStyle = 'tactical';
  } else if (effectiveElo < 2300) {
    depth = 4;
    blunderRate = 0.02;
    timeLimitMs = 300;
    playStyle = 'tactical';
  } else {
    depth = 5;
    blunderRate = 0.0;
    timeLimitMs = 460;
    playStyle = 'tactical';
  }

  if (posture === 'easy') {
    blunderRate = clamp(blunderRate + 0.14, 0.12, 0.58);
  } else if (posture === 'hard') {
    blunderRate = clamp(blunderRate * 0.35, 0, 0.06);
  }

  let tierLabel = 'Matched Sparring';
  let accentHex = '#10b981';

  if (posture === 'easy' || clampedForm <= -20) {
    tierLabel = 'Gentle · Easing Up';
    accentHex = '#38bdf8';
  } else if (posture === 'hard' || clampedForm >= 28) {
    tierLabel = effectiveElo >= 2000 ? 'Grandmaster Pressure' : 'Sharp · High Pressure';
    accentHex = '#f43f5e';
  }

  const historyClause =
    recentAccuracy !== null
      ? `recent ${recentAccuracy}% accuracy`
      : recentWinRate !== null
      ? `${recentWinRate}% recent win rate`
      : `your ${baseElo} Rapid rating`;

  const reasonSummary =
    posture === 'easy'
      ? `Supportive Coach posture calibrated to ${effectiveElo} Elo — plays forgiving lines and gives tactical counterplay.`
      : posture === 'hard'
      ? `Full-pressure Coach test calibrated to ${effectiveElo} Elo — punishes inaccuracies and tests endgame conversion.`
      : reasons.length > 0
      ? `Auto-tuned to ${effectiveElo} Elo (${tierLabel.toLowerCase()}), ${reasons[0]}.`
      : `Calibrated to ${effectiveElo} Elo from ${historyClause} (${streakLabel.toLowerCase()}).`;

  const bot: BotProfile = {
    ...baseTemplate,
    elo: effectiveElo,
    depth,
    blunderRate,
    timeLimitMs,
    accentHex,
    playStyle,
    isAdaptive: true,
    adaptivePosture: posture,
    styleLabel: tierLabel,
    description: reasonSummary
  };

  return {
    bot,
    effectiveElo,
    blunderRate,
    posture,
    formScore: clampedForm,
    tierLabel,
    accentHex,
    reasonSummary,
    telemetry: {
      recentWinRate,
      recentAccuracy,
      blundersPerGame,
      streakLabel,
      inGameEdgeCp
    }
  };
}
