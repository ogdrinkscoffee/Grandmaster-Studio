import React, { useEffect } from 'react';
import { Award, Lock, X } from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { AchievementCategory, AchievementDef, AchievementStatus } from '../engine/achievements';

const CATEGORIES: AchievementCategory[] = ['Games', 'Puzzles', 'Training'];

/** Achievement grid for the Stats page. */
export const AchievementsPanel: React.FC<{ statuses: AchievementStatus[] }> = ({ statuses }) => {
  const { theme } = useAppTheme();
  const unlockedCount = statuses.filter(s => s.unlocked).length;

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4" style={{ color: theme.accentHex }} />
          <h2 className="font-display text-base font-bold" style={{ color: theme.textPrimary }}>
            Achievements
          </h2>
        </div>
        <span className="text-xs font-mono tabular-nums" style={{ color: theme.textMutedHex }}>
          {unlockedCount}/{statuses.length} unlocked
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {CATEGORIES.map(category => (
          <div key={category}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: theme.textMutedHex }}>
              {category}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {statuses
                .filter(s => s.def.category === category)
                .map(s => {
                  const pct = Math.round((s.current / s.target) * 100);
                  return (
                    <div
                      key={s.def.id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        backgroundColor: s.unlocked ? `${theme.accentHex}12` : theme.cardSecondaryHex,
                        border: `1px solid ${s.unlocked ? `${theme.accentHex}55` : theme.cardBorderHex}`
                      }}
                      title={s.unlocked && s.unlockedOn ? `Unlocked ${s.unlockedOn}` : undefined}
                    >
                      <div
                        className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-xl"
                        style={{
                          backgroundColor: s.unlocked ? `${theme.accentHex}22` : theme.cardHex,
                          filter: s.unlocked ? undefined : 'grayscale(1)',
                          opacity: s.unlocked ? 1 : 0.45
                        }}
                        aria-hidden="true"
                      >
                        {s.def.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold truncate" style={{ color: s.unlocked ? theme.textPrimary : theme.textSecondary }}>
                            {s.def.name}
                          </span>
                          {!s.unlocked && <Lock className="w-3 h-3 shrink-0" style={{ color: theme.textMutedHex }} />}
                        </div>
                        <div className="text-[11px] leading-snug" style={{ color: theme.textMutedHex }}>
                          {s.def.description}
                        </div>
                        {!s.unlocked && s.target > 1 && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: theme.cardHex }}>
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: theme.accentHex }} />
                            </div>
                            <span className="text-[10px] font-mono tabular-nums" style={{ color: theme.textMutedHex }}>
                              {s.current}/{s.target}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Bottom-corner toast shown when an achievement unlocks. */
export const AchievementToast: React.FC<{
  achievement: AchievementDef | null;
  onDismiss: () => void;
  onOpen: () => void;
}> = ({ achievement, onDismiss, onOpen }) => {
  const { theme } = useAppTheme();

  useEffect(() => {
    if (!achievement) return;
    const id = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(id);
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div className="fixed z-50 right-3 bottom-20 md:bottom-6 animate-modal-reveal" role="status" aria-live="polite">
      <div
        className="flex items-center gap-3 pl-3 pr-2 py-2.5 rounded-xl shadow-2xl max-w-xs"
        style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.accentHex}66` }}
      >
        <button type="button" onClick={onOpen} className="flex items-center gap-3 text-left min-w-0">
          <span
            className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${theme.accentHex}22` }}
            aria-hidden="true"
          >
            {achievement.icon}
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.accentHex }}>
              Achievement unlocked
            </span>
            <span className="block text-sm font-bold truncate" style={{ color: theme.textPrimary }}>
              {achievement.name}
            </span>
            <span className="block text-[11px] truncate" style={{ color: theme.textMutedHex }}>
              {achievement.description}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="p-1 rounded-md self-start hover:opacity-80"
          style={{ color: theme.textMutedHex }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
