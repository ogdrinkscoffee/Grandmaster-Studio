import React, { useMemo, useState, useEffect } from 'react';
import {
  AI_BOT_PROFILES,
  BotCategory,
  BotPlayStyle,
  BotProfile,
  MAX_AI_ELO,
  MIN_AI_ELO,
  createCustomBotProfile
} from '../engine/chessEngine';
import { AdaptiveBotResolution, AdaptivePosture } from '../engine/adaptiveBot';
import { BotCharacterAvatar } from './BotCharacterAvatar';
import { useAppTheme } from '../context/ThemeContext';
import { Crown, Play, Sliders, Sparkles, Swords, X } from 'lucide-react';

interface BotRosterModalProps {
  isOpen: boolean;
  selectedBot: BotProfile;
  customEloInput: number;
  sidePreference: 'w' | 'b' | 'random';
  adaptiveResolution: AdaptiveBotResolution;
  adaptivePosture: AdaptivePosture;
  defeatedBotIds: string[];
  onChangeCustomElo: (elo: number) => void;
  onChangeAdaptivePosture: (posture: AdaptivePosture) => void;
  onSelectAndPlay: (bot: BotProfile, side: 'w' | 'b' | 'random') => void;
  onClose: () => void;
}

type CategoryFilter = 'all' | BotCategory;
type StyleFilter = 'all' | Exclude<BotPlayStyle, 'adaptive'>;

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Bots' },
  { id: 'special', label: 'Adaptive & Custom' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'casual', label: 'Casual & Club' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'master', label: 'Master & Apex' }
];

const TIER_SECTIONS: { category: BotCategory; heading: string; rangeLabel: string }[] = [
  { category: 'special', heading: 'Coach Adaptive & Custom', rangeLabel: 'Dynamic Strength' },
  { category: 'beginner', heading: 'Beginner', rangeLabel: '250 – 550 Elo' },
  { category: 'casual', heading: 'Casual & Club', rangeLabel: '850 – 1250 Elo' },
  { category: 'intermediate', heading: 'Intermediate', rangeLabel: '1600 Elo Trio' },
  { category: 'advanced', heading: 'Advanced', rangeLabel: '1950 – 2150 Elo' },
  { category: 'master', heading: 'Master & Apex', rangeLabel: '2350 – 3600 Elo' }
];

const STYLE_FILTERS: { id: StyleFilter; label: string }[] = [
  { id: 'all', label: 'All Styles' },
  { id: 'aggressive', label: 'Aggressive' },
  { id: 'positional', label: 'Positional' },
  { id: 'tactical', label: 'Tactical' },
  { id: 'defensive', label: 'Defensive' },
  { id: 'endgame', label: 'Endgame' },
  { id: 'chaotic', label: 'Chaotic' }
];

export const BotRosterModal: React.FC<BotRosterModalProps> = ({
  isOpen,
  selectedBot,
  customEloInput,
  sidePreference,
  adaptiveResolution,
  adaptivePosture,
  defeatedBotIds,
  onChangeCustomElo,
  onChangeAdaptivePosture,
  onSelectAndPlay,
  onClose
}) => {
  const { theme } = useAppTheme();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('all');
  const [previewBotId, setPreviewBotId] = useState<string>(selectedBot.id);
  const [draftSide, setDraftSide] = useState<'w' | 'b' | 'random'>(sidePreference);

  useEffect(() => {
    if (isOpen) {
      setPreviewBotId(selectedBot.id);
      setDraftSide(sidePreference);
    }
  }, [isOpen, selectedBot.id, sidePreference]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const defeatedSet = useMemo(() => new Set(defeatedBotIds), [defeatedBotIds]);

  const resolvedBots = useMemo(() => {
    return AI_BOT_PROFILES.map(bot =>
      bot.isAdaptive ? adaptiveResolution.bot : bot
    );
  }, [adaptiveResolution.bot]);

  const customBot = useMemo(() => createCustomBotProfile(customEloInput), [customEloInput]);

  const previewBot: BotProfile = useMemo(() => {
    if (previewBotId === 'custom_elo') return customBot;
    return resolvedBots.find(b => b.id === previewBotId) || resolvedBots[0];
  }, [previewBotId, customBot, resolvedBots]);

  const totalRosterCount = AI_BOT_PROFILES.length;
  const defeatedCount = useMemo(
    () => AI_BOT_PROFILES.filter(b => defeatedSet.has(b.id)).length,
    [defeatedSet]
  );

  if (!isOpen) return null;

  const visibleSections = TIER_SECTIONS.filter(
    sec => categoryFilter === 'all' || categoryFilter === sec.category
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Play Bots Roster"
    >
      <div
        className="border rounded-2xl max-w-5xl w-full shadow-2xl animate-modal-reveal flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: theme.cardHex,
          borderColor: theme.cardBorderHex,
          color: theme.textPrimary
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b shrink-0"
          style={{ borderColor: theme.cardBorderHex }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-display text-lg sm:text-xl font-extrabold tracking-tight">
                Play Bots
              </h3>
              <span
                className="inline-flex items-center gap-1 text-xs font-mono font-bold tabular-nums"
                style={{ color: '#eab308' }}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{defeatedCount} / {totalRosterCount} Defeated</span>
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Compare multiple personalities at identical Elo tiers, or challenge Coach Mikhail&apos;s Adaptive AI.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close character selector"
            className="p-2 rounded-lg border hover:opacity-80 transition shrink-0"
            style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category & Style Filter Bar */}
        <div
          className="px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 shrink-0"
          style={{
            backgroundColor: theme.cardSecondaryHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {CATEGORY_TABS.map(tab => {
              const active = categoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className="px-2.5 py-1.5 rounded-md text-xs font-semibold transition whitespace-nowrap shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: active ? theme.accentHex : 'transparent',
                    color: active ? theme.accentTextHex : theme.textSecondary
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 text-xs shrink-0">
            <span style={{ color: theme.textMutedHex }}>Style</span>
            <select
              value={styleFilter}
              onChange={e => setStyleFilter(e.target.value as StyleFilter)}
              aria-label="Filter bots by playing style"
              className="px-2.5 py-1 rounded-md border text-xs font-semibold focus:outline-none cursor-pointer"
              style={{
                backgroundColor: theme.cardHex,
                borderColor: theme.cardBorderHex,
                color: theme.textPrimary
              }}
            >
              {STYLE_FILTERS.map(sf => (
                <option key={sf.id} value={sf.id} style={{ backgroundColor: theme.cardHex, color: theme.textPrimary }}>
                  {sf.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Two-Column Chess.com Split Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* Left: Categorized Bot Grid */}
          <div className="lg:col-span-7 overflow-y-auto p-4 sm:p-5 space-y-5">
            {visibleSections.map(section => {
              const botsInSection = resolvedBots.filter(b => {
                if (b.category !== section.category) return false;
                if (styleFilter === 'all') return true;
                return b.playStyle === styleFilter;
              });

              const includeCustomCard =
                section.category === 'special' && (styleFilter === 'all' || styleFilter === 'balanced');

              if (botsInSection.length === 0 && !includeCustomCard) return null;

              return (
                <section key={section.category}>
                  <div className="flex items-baseline justify-between gap-2 mb-2.5">
                    <h4 className="font-display text-sm font-bold" style={{ color: theme.textPrimary }}>
                      {section.heading}
                    </h4>
                    <span className="text-xs font-mono tabular-nums" style={{ color: theme.textMutedHex }}>
                      {section.rangeLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {botsInSection.map(bot => {
                      const isPreviewed = previewBot.id === bot.id;
                      const isDefeated = defeatedSet.has(bot.id);
                      const botAccent = bot.accentHex || theme.accentHex;
                      return (
                        <button
                          key={bot.id}
                          type="button"
                          onClick={() => setPreviewBotId(bot.id)}
                          onDoubleClick={() => onSelectAndPlay(bot, draftSide)}
                          className="flex items-start gap-3 p-3 rounded-xl border text-left transition cursor-pointer"
                          style={{
                            backgroundColor: isPreviewed ? `${botAccent}18` : theme.cardSecondaryHex,
                            borderColor: isPreviewed ? botAccent : theme.cardBorderHex
                          }}
                        >
                          <div className="relative shrink-0">
                            <BotCharacterAvatar botId={bot.id} elo={bot.elo} size={48} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="font-bold text-sm truncate flex items-center gap-1.5">
                                <span className="truncate">{bot.name}</span>
                                {isDefeated && (
                                  <Crown
                                    className="w-3.5 h-3.5 shrink-0"
                                    style={{ color: '#eab308' }}
                                    aria-label="Defeated"
                                  />
                                )}
                              </span>
                              <span
                                className="font-mono text-xs font-extrabold tabular-nums shrink-0"
                                style={{ color: botAccent }}
                              >
                                {bot.elo}
                              </span>
                            </div>

                            <div className="text-[11px] font-medium truncate mt-0.5" style={{ color: theme.textSecondary }}>
                              {bot.styleLabel || bot.title}
                            </div>

                            <p className="text-[11px] leading-snug mt-1 line-clamp-2" style={{ color: theme.textMutedHex }}>
                              {bot.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}

                    {includeCustomCard && (
                      <button
                        type="button"
                        onClick={() => setPreviewBotId('custom_elo')}
                        onDoubleClick={() => onSelectAndPlay(customBot, draftSide)}
                        className="flex items-start gap-3 p-3 rounded-xl border text-left transition cursor-pointer"
                        style={{
                          backgroundColor:
                            previewBot.id === 'custom_elo' ? `${theme.accentHex}18` : theme.cardSecondaryHex,
                          borderColor:
                            previewBot.id === 'custom_elo' ? theme.accentHex : theme.cardBorderHex
                        }}
                      >
                        <div className="shrink-0">
                          <BotCharacterAvatar botId="custom_elo" elo={customEloInput} size={48} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-bold text-sm truncate">Custom Elo</span>
                            <span
                              className="font-mono text-xs font-extrabold tabular-nums shrink-0"
                              style={{ color: theme.accentHex }}
                            >
                              {customEloInput}
                            </span>
                          </div>
                          <div className="text-[11px] font-medium truncate mt-0.5" style={{ color: theme.textSecondary }}>
                            Calibrated 100–3600
                          </div>
                          <p className="text-[11px] leading-snug mt-1 line-clamp-2" style={{ color: theme.textMutedHex }}>
                            Set any exact rating from 100 beginner up to 3600 peak engine depth.
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Right: Chess.com-style Selected Bot Spotlight */}
          <div
            className="lg:col-span-5 border-t lg:border-t-0 lg:border-l p-5 flex flex-col justify-between gap-4 overflow-y-auto"
            style={{
              backgroundColor: theme.cardSecondaryHex,
              borderColor: theme.cardBorderHex
            }}
          >
            <div className="space-y-4">
              {/* Spotlight Identity */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-xl overflow-hidden">
                  <BotCharacterAvatar botId={previewBot.id} elo={previewBot.elo} size={74} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-display text-lg font-extrabold truncate">{previewBot.name}</h4>
                    <span
                      className="font-mono text-base font-extrabold tabular-nums shrink-0"
                      style={{ color: previewBot.accentHex || theme.accentHex }}
                    >
                      {previewBot.elo} Elo
                    </span>
                  </div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: theme.textSecondary }}>
                    {previewBot.title} · {previewBot.styleLabel || 'Balanced'}
                  </div>
                  <div className="text-xs mt-1 flex items-center gap-1.5" style={{ color: theme.textMutedHex }}>
                    {defeatedSet.has(previewBot.id) ? (
                      <>
                        <Crown className="w-3.5 h-3.5" style={{ color: '#eab308' }} />
                        <span style={{ color: '#eab308' }}>Defeated</span>
                      </>
                    ) : (
                      <>
                        <Swords className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                        <span>Ready to challenge</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quote */}
              {previewBot.quote && (
                <p
                  className="text-xs italic leading-relaxed py-2.5 border-y"
                  style={{
                    borderColor: theme.cardBorderHex,
                    color: theme.textPrimary
                  }}
                >
                  &ldquo;{previewBot.quote}&rdquo;
                </p>
              )}

              {/* Bio & Opening */}
              <div className="space-y-2 text-xs">
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  {previewBot.description}
                </p>
                {previewBot.openingPreference && (
                  <div style={{ color: theme.textMutedHex }}>
                    Repertoire: <span style={{ color: theme.textPrimary }}>{previewBot.openingPreference}</span>
                  </div>
                )}
              </div>

              {/* Adaptive Coach Posture Controls */}
              {previewBot.isAdaptive && (
                <div
                  className="p-3.5 rounded-xl border space-y-2.5"
                  style={{
                    backgroundColor: theme.cardHex,
                    borderColor: theme.cardBorderHex
                  }}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-bold">
                    <span className="flex items-center gap-1.5" style={{ color: adaptiveResolution.accentHex }}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Coach Difficulty Posture</span>
                    </span>
                    <span className="font-mono tabular-nums" style={{ color: theme.textMutedHex }}>
                      Live {adaptiveResolution.effectiveElo} Elo
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'auto', label: 'Auto-Adapt' },
                        { id: 'easy', label: 'Play Easy' },
                        { id: 'hard', label: 'Play Hard' }
                      ] as { id: AdaptivePosture; label: string }[]
                    ).map(opt => {
                      const active = adaptivePosture === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onChangeAdaptivePosture(opt.id)}
                          className="py-1.5 px-2 rounded-md text-[11px] font-bold transition whitespace-nowrap cursor-pointer"
                          style={{
                            backgroundColor: active ? theme.accentHex : theme.cardSecondaryHex,
                            color: active ? theme.accentTextHex : theme.textSecondary
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] leading-snug" style={{ color: theme.textMutedHex }}>
                    {adaptiveResolution.reasonSummary}
                  </p>
                </div>
              )}

              {/* Custom Elo Dial */}
              {previewBot.isCustom && (
                <div
                  className="p-3.5 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: theme.cardHex,
                    borderColor: theme.cardBorderHex
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                      <span>Target Rating</span>
                    </span>
                    <span className="font-mono tabular-nums" style={{ color: theme.accentHex }}>
                      {customEloInput} Elo
                    </span>
                  </div>
                  <input
                    type="range"
                    min={MIN_AI_ELO}
                    max={MAX_AI_ELO}
                    step={25}
                    value={customEloInput}
                    onChange={e => onChangeCustomElo(Number(e.target.value))}
                    aria-label="Custom bot Elo slider"
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono tabular-nums" style={{ color: theme.textMutedHex }}>
                    <span>{MIN_AI_ELO}</span>
                    <input
                      type="number"
                      min={MIN_AI_ELO}
                      max={MAX_AI_ELO}
                      value={customEloInput}
                      onChange={e =>
                        onChangeCustomElo(Math.max(MIN_AI_ELO, Math.min(MAX_AI_ELO, Number(e.target.value) || MIN_AI_ELO)))
                      }
                      aria-label="Custom bot Elo input"
                      className="w-20 px-2 py-0.5 rounded border text-center font-mono font-bold text-xs focus:outline-none"
                      style={{
                        backgroundColor: theme.cardSecondaryHex,
                        borderColor: theme.cardBorderHex,
                        color: theme.textPrimary
                      }}
                    />
                    <span>{MAX_AI_ELO}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Side Selector + Primary Play Button */}
            <div className="space-y-3 pt-3 border-t" style={{ borderColor: theme.cardBorderHex }}>
              <div>
                <div className="text-[11px] font-semibold mb-1.5" style={{ color: theme.textMutedHex }}>
                  I play as
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'w', label: 'White' },
                      { id: 'random', label: 'Random' },
                      { id: 'b', label: 'Black' }
                    ] as { id: 'w' | 'b' | 'random'; label: string }[]
                  ).map(side => {
                    const active = draftSide === side.id;
                    return (
                      <button
                        key={side.id}
                        type="button"
                        onClick={() => setDraftSide(side.id)}
                        className="py-2 px-3 rounded-lg border text-xs font-bold transition whitespace-nowrap cursor-pointer"
                        style={{
                          backgroundColor: active ? `${theme.accentHex}22` : theme.cardHex,
                          borderColor: active ? theme.accentHex : theme.cardBorderHex,
                          color: active ? theme.accentHex : theme.textSecondary
                        }}
                      >
                        {side.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectAndPlay(previewBot, draftSide)}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-[0.99] whitespace-nowrap cursor-pointer"
                style={{
                  backgroundColor: theme.accentHex,
                  color: theme.accentTextHex
                }}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play {previewBot.name}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
