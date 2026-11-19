export type ShortcutScope = 'all' | 'navigation' | 'gameplay' | 'board' | 'analysis';

export interface KeyboardShortcutItem {
  id: string;
  keys: string[];
  /** Optional separator between alternative triggers (e.g. 'or' or '/') */
  keySeparator?: 'then' | 'or';
  action: string;
  description: string;
  scope: Exclude<ShortcutScope, 'all'>;
  scopeLabel: string;
  settingKey?: 'keyboardControl' | 'notationInput';
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcutItem[] = [
  // Navigation & App Controls
  {
    id: 'nav-shortcuts',
    keys: ['?'],
    action: 'Keyboard Shortcuts',
    description: 'Open or close this keyboard shortcuts reference modal',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-search',
    keys: ['/'],
    action: 'Global Search',
    description: 'Jump to games, variants, or help guides (also Ctrl/Cmd + K)',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-search-cmd',
    keys: ['Ctrl / Cmd', 'K'],
    keySeparator: 'then',
    action: 'Quick Command Search',
    description: 'Focus Global Search from anywhere, including input fields',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-tabs-play',
    keys: ['1'],
    action: 'Go to Play Arena',
    description: 'Switch directly to the Play workspace',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-tabs-variants',
    keys: ['2'],
    action: 'Go to Variants & Studio',
    description: 'Browse all 36 variants or open the Custom Variant Studio',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-tabs-puzzles',
    keys: ['3'],
    action: 'Go to Puzzles',
    description: 'Switch to Adaptive Tactics, Puzzle Rush & Spaced Review',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-tabs-train',
    keys: ['4'],
    action: 'Go to Training',
    description: 'Switch to Openings, Endgame Drills & Free Analysis Board',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-tabs-coach',
    keys: ['5'],
    action: 'Go to AI Coach',
    description: 'Switch to Strategy Coach & Position Decoder',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-tabs-dashboard',
    keys: ['6'],
    action: 'Go to Archive & Stats',
    description: 'Switch to Match History, PGN Import & Rating Curves',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-settings',
    keys: [','],
    action: 'Open Studio Settings',
    description: 'Open Themes, Boards, Gameplay & Encrypted Sync settings',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-theme-mode',
    keys: ['Alt', 'T'],
    keySeparator: 'then',
    action: 'Toggle Dark / Light Mode',
    description: 'Switch immediately between Dark and Light color palettes',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },
  {
    id: 'nav-escape',
    keys: ['Esc'],
    action: 'Dismiss Overlay',
    description: 'Close open modal dialogs or dismiss search results',
    scope: 'navigation',
    scopeLabel: 'Navigation'
  },

  // Play Arena Gameplay
  {
    id: 'play-flip',
    keys: ['F'],
    action: 'Flip Board',
    description: 'Rotate board orientation between White and Black perspective',
    scope: 'gameplay',
    scopeLabel: 'Play Arena'
  },
  {
    id: 'play-hint',
    keys: ['H'],
    action: 'Engine Hint',
    description: 'Request best move arrow in Play Arena or Coach step-by-step idea',
    scope: 'gameplay',
    scopeLabel: 'Play Arena'
  },
  {
    id: 'play-undo',
    keys: ['U'],
    action: 'Undo / Takeback',
    description: 'Take back the last move pair when takebacks are enabled',
    scope: 'gameplay',
    scopeLabel: 'Play Arena'
  },
  {
    id: 'play-pause',
    keys: ['P'],
    action: 'Pause / Resume Clock',
    description: 'Pause or resume the active match timer',
    scope: 'gameplay',
    scopeLabel: 'Play Arena'
  },
  {
    id: 'play-new-game',
    keys: ['N'],
    action: 'New Game',
    description: 'Start a fresh match with the current opponent and variant setup',
    scope: 'gameplay',
    scopeLabel: 'Play Arena'
  },
  {
    id: 'play-notation',
    keys: ['T'],
    action: 'Type Notation Bar',
    description: 'Focus (and enable if hidden) the SAN/UCI command bar to type moves',
    scope: 'gameplay',
    scopeLabel: 'Play Arena',
    settingKey: 'notationInput'
  },
  {
    id: 'play-cancel-premoves',
    keys: ['Esc'],
    action: 'Cancel Premoves & Arrows',
    description: 'Clear queued premoves, square selection, and board annotations',
    scope: 'gameplay',
    scopeLabel: 'Play Arena'
  },

  // Board Keyboard Control & Input
  {
    id: 'board-move-cursor',
    keys: ['Arrows', 'W A S D'],
    keySeparator: 'or',
    action: 'Move Board Cursor',
    description: 'Navigate the active square highlight across ranks and files',
    scope: 'board',
    scopeLabel: 'Board Control',
    settingKey: 'keyboardControl'
  },
  {
    id: 'board-select-drop',
    keys: ['Space', 'Enter'],
    keySeparator: 'or',
    action: 'Select / Place Piece',
    description: 'Pick up a piece at the cursor or execute the move to the target square',
    scope: 'board',
    scopeLabel: 'Board Control',
    settingKey: 'keyboardControl'
  },
  {
    id: 'board-notation-tab',
    keys: ['Tab'],
    action: 'Autocomplete Move',
    description: 'Fill the top matching SAN/UCI move inside the Type Notation bar',
    scope: 'board',
    scopeLabel: 'Board Control',
    settingKey: 'notationInput'
  },

  // Review, Analysis & Puzzles
  {
    id: 'analysis-step',
    keys: ['←', '→'],
    keySeparator: 'or',
    action: 'Step Moves Backward / Forward',
    description: 'Navigate plies in Game Review, Analysis Board, Solved Puzzles & Play ledger (use [ / ] or Shift + Arrows if Board Control is on)',
    scope: 'analysis',
    scopeLabel: 'Review & Puzzles'
  },
  {
    id: 'analysis-jumps',
    keys: ['Home', 'End'],
    keySeparator: 'or',
    action: 'Jump to Start / Latest Position',
    description: 'Jump directly to the opening board or final/live position',
    scope: 'analysis',
    scopeLabel: 'Review & Puzzles'
  },
  {
    id: 'puzzle-hint',
    keys: ['H'],
    action: 'Reveal Puzzle Hint',
    description: 'Highlight the tactical piece or show the solution arrow in Puzzles',
    scope: 'analysis',
    scopeLabel: 'Review & Puzzles'
  },
  {
    id: 'puzzle-retry',
    keys: ['R'],
    action: 'Retry Failed Puzzle',
    description: 'Reset the current tactical position to attempt the solution again',
    scope: 'analysis',
    scopeLabel: 'Review & Puzzles'
  },
  {
    id: 'puzzle-next',
    keys: ['N'],
    action: 'Next Puzzle',
    description: 'Advance to the next puzzle after completing or failing the current one',
    scope: 'analysis',
    scopeLabel: 'Review & Puzzles'
  }
];

export function filterShortcuts(query: string, scope: ShortcutScope): KeyboardShortcutItem[] {
  const q = query.trim().toLowerCase();
  return KEYBOARD_SHORTCUTS.filter(item => {
    if (scope !== 'all' && item.scope !== scope) return false;
    if (!q) return true;
    const haystack = [item.action, item.description, item.scopeLabel, ...item.keys].join(' ').toLowerCase();
    return q.split(/\s+/).every(token => haystack.includes(token));
  });
}

export function isEditableEventTarget(target: EventTarget | null): boolean {
  if (!target || typeof target !== 'object') return false;
  const el = target as { tagName?: string; isContentEditable?: boolean };
  const tag = (el.tagName || '').toUpperCase();
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(el.isContentEditable);
}

export function hasOpenModalDialog(): boolean {
  if (typeof document === 'undefined') return false;
  return document.querySelector('[role="dialog"][aria-modal="true"]') !== null;
}

export type GlobalShortcutAction =
  | { type: 'toggle_shortcuts' }
  | { type: 'close_modal' }
  | { type: 'open_settings' }
  | { type: 'toggle_color_mode' }
  | { type: 'switch_tab'; tab: 'play' | 'variants' | 'puzzles' | 'train' | 'coach' | 'dashboard' };

export interface ShortcutKeyEventLike {
  key: string;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  target?: EventTarget | null;
}

export function resolveGlobalNavigationShortcut(
  e: ShortcutKeyEventLike,
  options: { modalOpen: boolean }
): GlobalShortcutAction | null {
  const inEditable = isEditableEventTarget(e.target ?? null);

  if (e.key === 'Escape' && options.modalOpen) {
    return { type: 'close_modal' };
  }

  // Toggle Dark / Light mode via Alt + T (safe even outside text inputs)
  if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 't' && !inEditable) {
    return { type: 'toggle_color_mode' };
  }

  if (e.ctrlKey || e.metaKey || e.altKey || inEditable) {
    return null;
  }

  if (e.key === '?') {
    return { type: 'toggle_shortcuts' };
  }

  // Remaining global navigation shortcuts should not switch tabs behind an open modal
  if (options.modalOpen) {
    return null;
  }

  if (e.key === ',') {
    return { type: 'open_settings' };
  }

  switch (e.key) {
    case '1':
      return { type: 'switch_tab', tab: 'play' };
    case '2':
      return { type: 'switch_tab', tab: 'variants' };
    case '3':
      return { type: 'switch_tab', tab: 'puzzles' };
    case '4':
      return { type: 'switch_tab', tab: 'train' };
    case '5':
      return { type: 'switch_tab', tab: 'coach' };
    case '6':
      return { type: 'switch_tab', tab: 'dashboard' };
    default:
      return null;
  }
}

export type PlayViewShortcutAction =
  | { type: 'flip' }
  | { type: 'hint' }
  | { type: 'undo' }
  | { type: 'toggle_pause' }
  | { type: 'new_game' }
  | { type: 'focus_notation' }
  | { type: 'history_first' }
  | { type: 'history_prev' }
  | { type: 'history_next' }
  | { type: 'history_live' };

export function resolvePlayViewShortcut(
  e: ShortcutKeyEventLike,
  options: { keyboardControl: boolean; hasMoves: boolean; modalOpen: boolean }
): PlayViewShortcutAction | null {
  if (options.modalOpen || isEditableEventTarget(e.target ?? null)) return null;
  if (e.ctrlKey || e.metaKey || e.altKey) return null;

  const lower = e.key.toLowerCase();
  if (lower === 'f') return { type: 'flip' };
  if (lower === 'h') return { type: 'hint' };
  if (lower === 'u') return { type: 'undo' };
  if (lower === 'p') return { type: 'toggle_pause' };
  if (lower === 'n') return { type: 'new_game' };
  if (lower === 't') return { type: 'focus_notation' };

  if (!options.hasMoves) return null;

  if (e.key === 'Home') return { type: 'history_first' };
  if (e.key === 'End') return { type: 'history_live' };

  // Bracket keys or Shift+Arrows always navigate move ledger even when Keyboard Board Control uses Arrows
  if (e.key === '[' || (e.key === 'ArrowLeft' && (e.shiftKey || !options.keyboardControl))) {
    return { type: 'history_prev' };
  }
  if (e.key === ']' || (e.key === 'ArrowRight' && (e.shiftKey || !options.keyboardControl))) {
    return { type: 'history_next' };
  }

  return null;
}
