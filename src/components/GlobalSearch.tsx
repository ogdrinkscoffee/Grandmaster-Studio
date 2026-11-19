import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  HelpCircle,
  History,
  Search,
  Sparkles,
  X
} from 'lucide-react';
import { CustomVariantConfig, GameHistoryItem, VariantId } from '../types/chess';
import { useAppTheme } from '../context/ThemeContext';
import {
  GlobalSearchResult,
  HelpTopic,
  SearchActionTarget,
  SearchCategory,
  searchGlobalCatalog
} from '../engine/globalSearch';

interface GlobalSearchProps {
  matches: GameHistoryItem[];
  onSelectGame: (game: GameHistoryItem) => void;
  onSelectVariant: (variantId: VariantId) => void;
  onSelectCustomVariant: (config: CustomVariantConfig) => void;
  onExecuteHelpAction: (target: SearchActionTarget) => void;
  iconOnly?: boolean;
}

const CATEGORIES: { id: SearchCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'game', label: 'Games' },
  { id: 'variant', label: 'Variants' },
  { id: 'help', label: 'Help' }
];

function loadSavedCustomVariants(): CustomVariantConfig[] {
  try {
    const raw = localStorage.getItem('gm_chess_custom_variants');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CustomVariantConfig[]) : [];
  } catch {
    return [];
  }
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  matches,
  onSelectGame,
  onSelectVariant,
  onSelectCustomVariant,
  onExecuteHelpAction,
  iconOnly = false
}) => {
  const { theme } = useAppTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedHelp, setSelectedHelp] = useState<HelpTopic | null>(null);
  const [customVariants, setCustomVariants] = useState<CustomVariantConfig[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCustomVariants(loadSavedCustomVariants());
    }
  }, [isOpen]);

  const results = useMemo(
    () =>
      searchGlobalCatalog(query, {
        matches,
        customVariants,
        category,
        limit: 16
      }),
    [query, matches, customVariants, category]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query, category, results.length]);

  const openAndFocus = () => {
    setSelectedHelp(null);
    setIsOpen(true);
    window.requestAnimationFrame(() => {
      if (desktopInputRef.current && desktopInputRef.current.offsetParent !== null) {
        desktopInputRef.current.focus();
      } else {
        mobileInputRef.current?.focus();
      }
    });
  };

  // Global keyboard shortcuts: "/" or Ctrl/Cmd + K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inEditable =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openAndFocus();
        return;
      }

      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !inEditable) {
        e.preventDefault();
        openAndFocus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close when clicking outside or pressing Escape anywhere while open
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelectedHelp(null);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        setSelectedHelp(null);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const closePopover = () => {
    setIsOpen(false);
    setSelectedHelp(null);
  };

  const handleSelectResult = (item: GlobalSearchResult) => {
    if (item.kind === 'game') {
      onSelectGame(item.game);
      closePopover();
      return;
    }
    if (item.kind === 'variant') {
      onSelectVariant(item.variantId);
      closePopover();
      return;
    }
    if (item.kind === 'custom_variant') {
      onSelectCustomVariant(item.customVariant);
      closePopover();
      return;
    }
    if (item.kind === 'help') {
      setSelectedHelp(item.helpTopic);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (selectedHelp) {
        setSelectedHelp(null);
      } else {
        closePopover();
        e.currentTarget.blur();
      }
      return;
    }

    if (selectedHelp) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex(prev => (results.length === 0 ? 0 : (prev + 1) % results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex(prev => (results.length === 0 ? 0 : (prev - 1 + results.length) % results.length));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      handleSelectResult(results[activeIndex]);
    }
  };

  const renderResultIcon = (kind: GlobalSearchResult['kind']) => {
    switch (kind) {
      case 'game':
        return <History className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />;
      case 'variant':
        return <Compass className="w-4 h-4 shrink-0" style={{ color: theme.accent2Hex }} />;
      case 'custom_variant':
        return <Sparkles className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />;
      case 'help':
        return <HelpCircle className="w-4 h-4 shrink-0" style={{ color: theme.textSecondary }} />;
    }
  };

  const getKindActionHint = (kind: GlobalSearchResult['kind']) => {
    if (kind === 'game') return 'Review';
    if (kind === 'variant' || kind === 'custom_variant') return 'Play';
    return 'Guide';
  };

  return (
    <div ref={containerRef} className="relative flex items-center shrink-0">
      {/* Desktop / Tablet inline header search input */}
      {!iconOnly && (
        <div
          className="hidden sm:flex items-center gap-1.5 h-8 w-44 md:w-36 lg:w-44 xl:w-56 px-2.5 rounded-lg border transition-colors"
          style={{
            backgroundColor: theme.cardSecondaryHex,
            borderColor: isOpen ? theme.accentHex : theme.cardBorderHex
          }}
        >
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: isOpen ? theme.accentHex : theme.textMutedHex }} />
          <input
            ref={desktopInputRef}
            type="text"
            value={query}
            aria-label="Global search"
            placeholder="Search games, variants, help..."
            onFocus={() => setIsOpen(true)}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedHelp(null);
              if (!isOpen) setIsOpen(true);
            }}
            onKeyDown={handleInputKeyDown}
            className="w-full min-w-0 bg-transparent text-xs focus:outline-none"
            style={{ color: theme.textPrimary }}
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery('');
                setSelectedHelp(null);
                desktopInputRef.current?.focus();
              }}
              className="p-0.5 rounded hover:opacity-75 transition shrink-0"
              style={{ color: theme.textMutedHex }}
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd
              aria-hidden="true"
              className="hidden lg:inline-block text-[10px] font-mono shrink-0"
              style={{ color: theme.textMutedHex }}
            >
              /
            </kbd>
          )}
        </div>
      )}

      {/* Mobile compact icon button */}
      <button
        type="button"
        aria-label="Open search"
        title="Search games, variants & help (/)"
        onClick={() => {
          if (isOpen) {
            closePopover();
          } else {
            openAndFocus();
          }
        }}
        className={`${iconOnly ? '' : 'sm:hidden '}p-2 rounded-lg border transition hover:opacity-80`}
        style={{
          backgroundColor: theme.cardSecondaryHex,
          borderColor: isOpen ? theme.accentHex : theme.cardBorderHex,
          color: isOpen ? theme.accentHex : theme.textPrimary
        }}
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Search Results / Help Guide Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Global search results"
          className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-[62px] sm:top-[calc(100%+8px)] sm:w-[420px] md:w-[450px] z-50 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: theme.cardHex,
            border: `1px solid ${theme.cardBorderHex}`,
            maxHeight: 'min(76vh, 540px)'
          }}
        >
          {/* Mobile search input inside popover */}
          <div
            className={`${iconOnly ? '' : 'sm:hidden '}flex items-center gap-2 px-3 py-2.5 border-b`}
            style={{ borderColor: theme.cardBorderHex, backgroundColor: theme.cardSecondaryHex }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              aria-label="Global search mobile"
              placeholder="Search games, variants, help..."
              onChange={e => {
                setQuery(e.target.value);
                setSelectedHelp(null);
              }}
              onKeyDown={handleInputKeyDown}
              className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none"
              style={{ color: theme.textPrimary }}
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery('');
                  setSelectedHelp(null);
                  mobileInputRef.current?.focus();
                }}
                style={{ color: theme.textMutedHex }}
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Close search"
                onClick={closePopover}
                style={{ color: theme.textMutedHex }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedHelp ? (
            /* Help Topic Detail View */
            <div className="p-4 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHelp(null)}
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition"
                  style={{ color: theme.accentHex }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to results
                </button>
                <span className="text-[11px] font-medium" style={{ color: theme.textMutedHex }}>
                  {selectedHelp.section}
                </span>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold leading-snug" style={{ color: theme.textPrimary }}>
                  {selectedHelp.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                  {selectedHelp.summary}
                </p>
              </div>

              <ol className="space-y-2 pt-1">
                {selectedHelp.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs leading-relaxed"
                    style={{ color: theme.textPrimary }}
                  >
                    <span
                      className="font-mono text-[11px] font-bold shrink-0 mt-0.5"
                      style={{ color: theme.accentHex }}
                    >
                      {i + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              {selectedHelp.action && (
                <div className="pt-2 border-t flex justify-end" style={{ borderColor: theme.cardBorderHex }}>
                  <button
                    type="button"
                    onClick={() => {
                      onExecuteHelpAction(selectedHelp.action!.target);
                      closePopover();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition hover:opacity-90"
                    style={{
                      backgroundColor: theme.accentHex,
                      color: theme.accentTextHex
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {selectedHelp.action.label}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Interactive Category Filters */}
              <div
                className="flex items-center justify-between gap-2 px-3 py-2 border-b"
                style={{ borderColor: theme.cardBorderHex }}
              >
                <div className="flex items-center gap-1" role="tablist" aria-label="Search categories">
                  {CATEGORIES.map(cat => {
                    const active = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setCategory(cat.id)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold transition"
                        style={
                          active
                            ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                            : { color: theme.textSecondary }
                        }
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] tabular-nums" style={{ color: theme.textMutedHex }}>
                  {results.length} {results.length === 1 ? 'result' : 'results'}
                </span>
              </div>

              {/* Search Results List */}
              <div className="overflow-y-auto divide-y" style={{ borderColor: theme.cardBorderHex }}>
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center space-y-1">
                    <p className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
                      No matches for &ldquo;{query.trim()}&rdquo;
                    </p>
                    <p className="text-[11px]" style={{ color: theme.textMutedHex }}>
                      Try searching an opponent, variant (Crazyhouse, Fog of War), opening, or shortcut.
                    </p>
                  </div>
                ) : (
                  results.map((item, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => handleSelectResult(item)}
                        className="w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 transition-colors"
                        style={{
                          backgroundColor: isActive ? theme.surfaceHoverHex : 'transparent',
                          borderColor: theme.cardBorderHex
                        }}
                      >
                        <span className="mt-0.5">{renderResultIcon(item.kind)}</span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-baseline justify-between gap-2">
                            <span
                              className="text-xs font-bold truncate"
                              style={{ color: theme.textPrimary }}
                            >
                              {item.title}
                            </span>
                            <span
                              className="text-[10px] font-semibold shrink-0"
                              style={{ color: isActive ? theme.accentHex : theme.textMutedHex }}
                            >
                              {getKindActionHint(item.kind)}
                            </span>
                          </span>
                          <span
                            className="block text-[11px] truncate mt-0.5"
                            style={{ color: theme.textSecondary }}
                          >
                            {item.subtitle}
                          </span>
                          <span
                            className="block text-[10px] truncate mt-0.5"
                            style={{ color: theme.textMutedHex }}
                          >
                            {item.meta}
                          </span>
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
