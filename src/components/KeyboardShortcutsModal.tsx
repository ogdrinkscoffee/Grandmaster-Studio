import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Search, Terminal, X } from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import {
  KEYBOARD_SHORTCUTS,
  ShortcutScope,
  filterShortcuts
} from '../engine/keyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyboardControl: boolean;
  notationInput: boolean;
  onToggleSetting: (key: 'keyboardControl' | 'notationInput', value: boolean) => void;
}

const SCOPE_TABS: { id: ShortcutScope; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'gameplay', label: 'Play Arena' },
  { id: 'board', label: 'Board Control' },
  { id: 'analysis', label: 'Review & Puzzles' }
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  keyboardControl,
  notationInput,
  onToggleSetting
}) => {
  const { theme } = useAppTheme();
  const [scope, setScope] = useState<ShortcutScope>('all');
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }
    const timer = window.setTimeout(() => searchInputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const filtered = useMemo(() => filterShortcuts(query, scope), [query, scope]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
        className="animate-modal-reveal rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl max-h-[90vh] flex flex-col gap-4"
        style={{
          backgroundColor: theme.cardHex,
          border: `1px solid ${theme.cardBorderHex}`,
          color: theme.textPrimary
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 pb-3 border-b"
          style={{ borderColor: theme.cardBorderHex }}
        >
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 shrink-0" style={{ color: theme.accentHex }} />
            <div>
              <h2
                id="shortcuts-modal-title"
                className="font-display text-lg font-bold tracking-tight"
                style={{ color: theme.textPrimary }}
              >
                Keyboard Shortcuts
              </h2>
              <p className="text-xs tabular-nums" style={{ color: theme.textMutedHex }}>
                {KEYBOARD_SHORTCUTS.length} navigation, gameplay &amp; board keybindings · Press ? to toggle
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="p-1.5 rounded-lg transition hover:opacity-75"
            style={{ color: theme.textMutedHex }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls: Search + Interactive Scope Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div
            role="tablist"
            aria-label="Shortcut categories"
            className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto scrollbar-none"
            style={{
              backgroundColor: theme.cardSecondaryHex,
              border: `1px solid ${theme.cardBorderHex}`
            }}
          >
            {SCOPE_TABS.map(tab => {
              const active = scope === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setScope(tab.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap"
                  style={
                    active
                      ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                      : { color: theme.textSecondary }
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border sm:w-56"
            style={{
              backgroundColor: theme.cardSecondaryHex,
              borderColor: theme.cardBorderHex
            }}
          >
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: theme.textMutedHex }} />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape' && query) {
                  e.stopPropagation();
                  setQuery('');
                }
              }}
              aria-label="Filter keyboard shortcuts"
              placeholder="Filter shortcuts..."
              className="w-full min-w-0 bg-transparent text-xs focus:outline-none"
              style={{ color: theme.textPrimary }}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear shortcut filter"
                onClick={() => {
                  setQuery('');
                  searchInputRef.current?.focus();
                }}
                style={{ color: theme.textMutedHex }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Shortcut List */}
        <div
          className="flex-1 overflow-y-auto divide-y rounded-xl border"
          style={{
            borderColor: theme.cardBorderHex,
            backgroundColor: theme.cardSecondaryHex
          }}
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center space-y-1">
              <p className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
                No shortcuts matching &ldquo;{query.trim()}&rdquo;
              </p>
              <p className="text-[11px]" style={{ color: theme.textMutedHex }}>
                Try searching for &ldquo;flip&rdquo;, &ldquo;hint&rdquo;, &ldquo;search&rdquo;, or &ldquo;puzzle&rdquo;.
              </p>
            </div>
          ) : (
            filtered.map(item => {
              const needsKeyboard = item.settingKey === 'keyboardControl' && !keyboardControl;
              return (
                <div
                  key={item.id}
                  className="px-4 py-3 flex items-center justify-between gap-4"
                  style={{ borderColor: theme.cardBorderHex }}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                        {item.action}
                      </span>
                      <span className="text-[11px]" style={{ color: theme.textMutedHex }}>
                        {item.scopeLabel}
                        {needsKeyboard ? ' · Enable Keyboard Board Control below' : ''}
                      </span>
                    </div>
                    <p className="text-[11px] leading-snug mt-0.5" style={{ color: theme.textSecondary }}>
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.keys.map((k, idx) => (
                      <React.Fragment key={`${item.id}-k-${idx}`}>
                        {idx > 0 && (
                          <span className="text-[10px] font-medium" style={{ color: theme.textMutedHex }}>
                            {item.keySeparator === 'then' ? '+' : 'or'}
                          </span>
                        )}
                        <kbd
                          className="px-2 py-1 rounded-md border font-mono text-[11px] font-bold shadow-xs whitespace-nowrap"
                          style={{
                            backgroundColor: theme.cardHex,
                            borderColor: theme.cardBorderHex,
                            color: theme.accentHex
                          }}
                        >
                          {k}
                        </kbd>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Interactive Board Input Toggles */}
        <div
          className="pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          style={{ borderColor: theme.cardBorderHex }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keyboardControl}
                onChange={e => onToggleSetting('keyboardControl', e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: theme.accentHex }}
              />
              <span className="font-semibold" style={{ color: theme.textPrimary }}>
                Keyboard Board Control (WASD / Arrows + Space)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notationInput}
                onChange={e => onToggleSetting('notationInput', e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: theme.accentHex }}
              />
              <span className="inline-flex items-center gap-1 font-semibold" style={{ color: theme.textPrimary }}>
                <Terminal className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
                Type Notation to Move
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-90 self-end sm:self-auto"
            style={{
              backgroundColor: theme.accentHex,
              color: theme.accentTextHex
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
