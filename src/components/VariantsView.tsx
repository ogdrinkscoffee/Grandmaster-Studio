import React, { useState, useEffect } from 'react';
import { CHESS_VARIANTS } from '../engine/variants';
import { variantToCustomConfig } from '../engine/customVariantEngine';
import {
  VariantDefinition,
  VariantId,
  PieceType,
  CustomVariantConfig
} from '../types/chess';
import { ChessPieceIcon } from './ChessPieces';
import {
  Swords,
  Info,
  Sparkles,
  Filter,
  Search,
  Sliders,
  Plus,
  Check,
  X
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { CustomVariantStudio } from './CustomVariantStudio';

/** Card/modal titles drop parenthetical subtitles, e.g. 'Chess960 (Fischer Random)' → 'Chess960'. */
const stripParenthetical = (name: string) => name.replace(/\s*\([^)]*\)/g, '').trim();

const VARIANT_PIECE_BADGE: Partial<Record<VariantId, PieceType>> = {
  standard: 'k',
  chaturanga: 'e',
  chess960: 'b',
  king_of_the_hill: 'k',
  three_check: 'n',
  atomic: 'z',
  horde: 'p',
  antichess: 'f',
  racing_kings: 'k',
  crazyhouse: 'c',
  fog_of_war: 'm',
  duck_chess: 'd',
  absorption: 'a',
  knightmare: 'n',
  pawns_only: 'p',
  queens_mayhem: 'q',
  peasant_revolt: 'p',
  almost_chess: 'c',
  grand_chess: 'a',
  upside_down: 'r',
  endgame_lucena: 'r',
  checkless: 'b',
  anti_queen: 'q',
  extinction: 'o',
  giveaway: 'f',
  gladiator: 'm',
  blindfold: 'n',
  los_alamos: 'r',
  minichess_5x5: 'q',
  shatranj: 'f',
  capablanca_10x8: 'a',
  cannon_siege: 'o',
  amazon_chess: 'z',
  light_brigade: 'q',
  weak_chess: 'n',
  transcendental: 'b'
};

interface VariantsViewProps {
  initialSubTab?: 'catalog' | 'custom';
  initialCustomConfig?: CustomVariantConfig | null;
  onSelectVariant: (variantId: VariantId) => void;
  onPlayCustomInArena?: (config: CustomVariantConfig) => void;
}

export const VariantsView: React.FC<VariantsViewProps> = ({
  initialSubTab = 'catalog',
  initialCustomConfig = null,
  onSelectVariant,
  onPlayCustomInArena
}) => {
  const { theme, pieceSet } = useAppTheme();
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'custom'>(initialSubTab);
  const [studioSeedConfig, setStudioSeedConfig] = useState<CustomVariantConfig | null>(initialCustomConfig);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalVariant, setActiveModalVariant] = useState<VariantDefinition | null>(null);

  useEffect(() => {
    if (initialCustomConfig) {
      setStudioSeedConfig(initialCustomConfig);
      setActiveSubTab('custom');
    } else if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialCustomConfig, initialSubTab]);

  const categories = ['All', 'Historical', 'Popular', 'Chaotic', 'Tactical', 'Endgame'];

  const filteredVariants = CHESS_VARIANTS.filter(v => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesQuery =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleForkToCustomMode = (variantId: VariantId) => {
    const cfg = variantToCustomConfig(variantId);
    setStudioSeedConfig(cfg);
    setActiveSubTab('custom');
  };

  const handleCreateFromScratch = () => {
    setStudioSeedConfig({
      id: `custom_${Date.now()}`,
      name: 'New Custom Variant',
      tagline: 'Crafted from scratch',
      description: 'Custom rules, board dimensions, and piece army.',
      boardWidth: 8,
      boardHeight: 8,
      grid: Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => {
          if (r === 0 && c === 4) return { type: 'k', color: 'b' };
          if (r === 7 && c === 4) return { type: 'k', color: 'w' };
          return null;
        })
      ),
      rules: {
        pawnDoubleStep: true,
        enPassant: false,
        castling: false,
        mandatoryCaptures: false,
        atomicExplosions: false,
        allowDuckPlacement: false,
        promotionPiece: 'q',
        winConditions: {
          checkmate: true,
          centerHill: false,
          racingKings: false,
          bareKing: false,
          threeCheck: false
        }
      },
      customPiecesUsed: ['k'],
      createdAt: new Date().toISOString().split('T')[0]
    });
    setActiveSubTab('custom');
  };

  return (
    <div
      className="flex flex-col gap-5 max-w-7xl mx-auto px-3 sm:px-6 py-4"
      style={{ color: theme.textPrimary }}
    >
      {/* Top Header & Mode Switcher */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border"
        style={{
          backgroundColor: theme.cardHex,
          borderColor: theme.cardBorderHex
        }}
      >
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: theme.textPrimary }}>
            Chess Variants & Custom Mode
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: theme.textSecondary }}>
            Play {CHESS_VARIANTS.length} historical & tactical variants including Chaturanga, Capablanca, and Shatranj, or design custom boards from scratch.
          </p>
        </div>

        {/* Clean Segmented Switcher */}
        <div
          className="flex items-center p-1 rounded-lg border self-start sm:self-center shrink-0"
          style={{
            backgroundColor: theme.cardSecondaryHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <button
            type="button"
            onClick={() => setActiveSubTab('catalog')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition"
            style={{
              backgroundColor: activeSubTab === 'catalog' ? theme.accentHex : 'transparent',
              color: activeSubTab === 'catalog' ? theme.accentTextHex : theme.textSecondary
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Variants ({CHESS_VARIANTS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('custom')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition"
            style={{
              backgroundColor: activeSubTab === 'custom' ? theme.accentHex : 'transparent',
              color: activeSubTab === 'custom' ? theme.accentTextHex : theme.textSecondary
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Custom Variant Mode</span>
          </button>
        </div>
      </div>

      {/* CATALOG SUB-VIEW */}
      {activeSubTab === 'catalog' && (
        <>
          {/* Filter & Search Bar */}
          <div
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-xl border"
            style={{
              backgroundColor: theme.cardHex,
              borderColor: theme.cardBorderHex
            }}
          >
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <Filter className="w-3.5 h-3.5 shrink-0 ml-1" style={{ color: theme.textMutedHex }} />
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition"
                    style={{
                      backgroundColor: isActive ? theme.accentHex : theme.cardSecondaryHex,
                      color: isActive ? theme.accentTextHex : theme.textSecondary
                    }}
                  >
                    {cat} {cat === 'All' ? `(${CHESS_VARIANTS.length})` : ''}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textMutedHex }} />
                <input
                  type="text"
                  placeholder="Search variants..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full sm:w-56 pl-8 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none"
                  style={{
                    backgroundColor: theme.cardSecondaryHex,
                    borderColor: theme.cardBorderHex,
                    color: theme.textPrimary
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleCreateFromScratch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition hover:opacity-90"
                style={{
                  backgroundColor: theme.accentHex,
                  color: theme.accentTextHex
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create from Scratch</span>
              </button>
            </div>
          </div>

          {/* Grid of Variants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVariants.map(variant => {
              const badgePiece = VARIANT_PIECE_BADGE[variant.id] || 'k';
              return (
                <div
                  key={variant.id}
                  className="p-4 rounded-xl border flex flex-col justify-between gap-4 transition-transform duration-150 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: theme.cardHex,
                    borderColor: theme.cardBorderHex
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 p-1.5"
                          style={{
                            backgroundColor: theme.cardSecondaryHex,
                            borderColor: theme.cardBorderHex
                          }}
                        >
                          <ChessPieceIcon type={badgePiece} color="w" set={pieceSet} />
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-display font-bold text-sm sm:text-base leading-tight truncate" style={{ color: theme.textPrimary }}>
                            {stripParenthetical(variant.name)}
                          </h2>
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.accentHex }}>
                            {variant.category}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveModalVariant(variant)}
                        aria-label={`View rules for ${variant.name}`}
                        className="p-1.5 rounded-lg border hover:opacity-80 transition shrink-0"
                        style={{
                          backgroundColor: theme.cardSecondaryHex,
                          borderColor: theme.cardBorderHex,
                          color: theme.textSecondary
                        }}
                        title="View detailed rules"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs font-semibold mb-1 truncate" style={{ color: theme.textPrimary }}>
                      {variant.tagline}
                    </p>
                    <p className="text-xs line-clamp-2 leading-relaxed mb-3" style={{ color: theme.textSecondary }}>
                      {variant.description}
                    </p>

                    <div className="flex flex-col gap-1.5">
                      {variant.specialRules.slice(0, 2).map((rule, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] flex items-start gap-1.5 leading-snug"
                          style={{ color: theme.textMutedHex }}
                        >
                          <span className="shrink-0" style={{ color: theme.accentHex }}>·</span>
                          <span className="line-clamp-2">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dual Actions: Play vs AI + Edit Rules */}
                  <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: theme.cardBorderHex }}>
                    <button
                      type="button"
                      onClick={() => onSelectVariant(variant.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-xs transition hover:opacity-90"
                      style={{
                        backgroundColor: theme.accentHex,
                        color: theme.accentTextHex
                      }}
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Play</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleForkToCustomMode(variant.id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border font-semibold text-xs transition hover:opacity-80"
                      style={{
                        backgroundColor: theme.cardSecondaryHex,
                        borderColor: theme.cardBorderHex,
                        color: theme.textPrimary
                      }}
                      title="Edit rules, board size, or pieces in Custom Variant Mode"
                    >
                      <Sliders className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                      <span>Edit Rules</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CUSTOM VARIANT MODE */}
      {activeSubTab === 'custom' && (
        <CustomVariantStudio
          initialVariantConfig={studioSeedConfig}
          onBackToVariants={() => setActiveSubTab('catalog')}
          onPlayInMainArena={onPlayCustomInArena}
        />
      )}

      {/* Rules Modal */}
      {activeModalVariant && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="rounded-2xl max-w-md w-full p-6 shadow-2xl border flex flex-col gap-4 animate-modal-reveal"
            style={{
              backgroundColor: theme.cardHex,
              borderColor: theme.cardBorderHex,
              color: theme.textPrimary
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-lg border p-1.5 flex items-center justify-center"
                  style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
                >
                  <ChessPieceIcon type={VARIANT_PIECE_BADGE[activeModalVariant.id] || 'k'} color="w" set={pieceSet} />
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-extrabold" style={{ color: theme.textPrimary }}>
                    {stripParenthetical(activeModalVariant.name)}
                  </h3>
                  <p className="text-xs font-semibold" style={{ color: theme.accentHex }}>
                    {activeModalVariant.tagline}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalVariant(null)}
                className="p-1 rounded-lg hover:opacity-70"
                style={{ color: theme.textMutedHex }}
                aria-label="Close rules"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
              {activeModalVariant.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: theme.textMutedHex }}>
                Special Rules & Mechanics
              </h4>
              <div className="flex flex-col gap-1.5">
                {activeModalVariant.specialRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs" style={{ color: theme.textPrimary }}>
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: theme.accentHex }} />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t" style={{ borderColor: theme.cardBorderHex }}>
              <button
                type="button"
                onClick={() => {
                  const id = activeModalVariant.id;
                  setActiveModalVariant(null);
                  handleForkToCustomMode(id);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold border hover:opacity-80 transition"
                style={{
                  backgroundColor: theme.cardSecondaryHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                Edit Rules
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = activeModalVariant.id;
                  setActiveModalVariant(null);
                  onSelectVariant(id);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold transition hover:opacity-90"
                style={{
                  backgroundColor: theme.accentHex,
                  color: theme.accentTextHex
                }}
              >
                Play
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
