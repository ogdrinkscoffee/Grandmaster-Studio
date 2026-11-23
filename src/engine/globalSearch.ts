import { CustomVariantConfig, GameHistoryItem, VariantId } from '../types/chess';
import { CHESS_VARIANTS, getVariantDisplayName } from './variants';
import { DEFAULT_CUSTOM_PRESETS } from './customVariantEngine';
import { OPENING_REPERTOIRE } from './openingRepertoire';
import { ENDGAME_DRILLS } from './endgameDrills';

export type SearchCategory = 'all' | 'game' | 'variant' | 'help';

export type SearchActionTarget =
  | { type: 'tab'; tab: 'play' | 'variants' | 'puzzles' | 'train' | 'coach' | 'dashboard'; trainSection?: 'openings' | 'endgames' | 'vision' | 'analysis' | 'editor'; variantsSubTab?: 'catalog' | 'custom' }
  | { type: 'daily_puzzle' }
  | { type: 'settings'; tab: 'customization' | 'gameplay' | 'sync' }
  | { type: 'shortcuts' };

export interface HelpTopic {
  id: string;
  title: string;
  section: string;
  summary: string;
  steps: string[];
  keywords: string[];
  action?: {
    label: string;
    target: SearchActionTarget;
  };
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'help-keyboard-shortcuts',
    title: 'Keyboard Shortcuts for Navigation & Gameplay',
    section: 'Controls & Shortcuts',
    summary: 'Switch tabs with 1–6, open search with /, flip boards with F, request hints with H, undo with U, and open this guide anytime with ?.',
    steps: [
      'Press ? anywhere outside text inputs to open the searchable Keyboard Shortcuts modal.',
      'Navigation: Use 1–6 to switch tabs, / or Ctrl/Cmd+K for Global Search, Comma (,) for Settings, and Alt+T for Dark/Light mode.',
      'Play Arena: Press F to flip, H for Hint, U to Undo, P to Pause/Resume clock, N for New Game, and T to focus Type Notation.',
      'Board Control: Enable Keyboard Board Control in Settings or the Shortcuts modal to move pieces using Arrows/WASD + Space/Enter.'
    ],
    keywords: ['keyboard', 'shortcuts', 'hotkeys', 'keybindings', 'keys', 'navigation', 'flip', 'undo', 'hint', 'wasd', '?'],
    action: { label: 'View Keyboard Shortcuts', target: { type: 'shortcuts' } }
  },
  {
    id: 'help-play-modes',
    title: 'Playing Against AI, Coach Mode & Pass-and-Play',
    section: 'Play Arena',
    summary: 'Start standard or variant matches against adaptive bots (100–3600 Elo), live Coach hints, or local 2-player Pass & Play.',
    steps: [
      'Open the Play tab and expand Game Setup if collapsed.',
      'Choose Bullet, Blitz, Rapid, Classical, or Untimed time controls and pick your opponent or AI strength.',
      'Enable Premoves, Notation Input, or Keyboard Board Control anytime under Settings → Gameplay & Audio.'
    ],
    keywords: ['play', 'bot', 'ai', 'elo', 'time control', 'bullet', 'blitz', 'rapid', 'pass and play', 'coach mode', 'opponent'],
    action: { label: 'Open Play Arena', target: { type: 'tab', tab: 'play' } }
  },
  {
    id: 'help-stockfish-engine',
    title: 'Stockfish 19 WASM vs Variant Engine',
    section: 'Engines & Analysis',
    summary: 'Standard chess, Chess960, Transcendental, Blindfold, and custom start-position variants run on Stockfish 19 WebAssembly.',
    steps: [
      'Stockfish 19 runs inside a background Web Worker so the board stays responsive.',
      'Rule-changing variants (Chaturanga, Crazyhouse, Fog of War, Atomic, Duck Chess, Gladiator, etc.) use the built-in custom variant engine.',
      'Adjust max search depth or Battery Saver throttling in Settings → Gameplay & Audio.'
    ],
    keywords: ['stockfish', 'wasm', 'engine', 'depth', 'analysis', 'battery saver', 'worker', 'eval bar'],
    action: { label: 'Open Analysis Board', target: { type: 'tab', tab: 'train', trainSection: 'analysis' } }
  },
  {
    id: 'help-custom-variant-studio',
    title: 'Creating Custom Variants & Fairy Pieces (5×5 to 10×10)',
    section: 'Custom Variant Studio',
    summary: 'Build original chess boards from scratch using fairy pieces like Gaja, Mantri, Chancellor, Archbishop, Cannon, and Amazon.',
    steps: [
      'Go to Variants & Studio and switch to Custom Variant Studio.',
      'Resize the grid (5×5 up to 10×10), place White/Black pieces or use Mirror W→B for symmetry.',
      'Toggle special rules such as Atomic Explosions, Bare King, Extinction, Absorption, Knightmare, or Gladiator Shield, then click Test Board or Main Arena.'
    ],
    keywords: ['custom variant', 'studio', 'fairy', 'chaturanga', 'gaja', 'mantri', 'chancellor', 'archbishop', 'amazon', 'gladiator', 'absorption', 'extinction', 'knightmare', 'editor'],
    action: { label: 'Open Variant Studio', target: { type: 'tab', tab: 'variants', variantsSubTab: 'custom' } }
  },
  {
    id: 'help-fog-crazyhouse',
    title: 'Fog of War & Crazyhouse Special Rules',
    section: 'Variants Guide',
    summary: 'Fog of War conceals enemy pieces outside your legal vision; Crazyhouse lets you drop captured pieces onto empty squares.',
    steps: [
      'In Fog of War, you see squares occupied or attacked by your pieces (capturing the enemy King ends the match).',
      'In Crazyhouse, captured enemy pieces appear in your reserve tray below the board—click a piece in reserve, then click any highlighted empty square to drop it (pawns cannot drop on ranks 1 or 8).'
    ],
    keywords: ['fog of war', 'crazyhouse', 'drop', 'pocket', 'reserve', 'vision', 'dark chess', 'hidden'],
    action: { label: 'Browse All 36 Variants', target: { type: 'tab', tab: 'variants', variantsSubTab: 'catalog' } }
  },
  {
    id: 'help-puzzles-rush',
    title: 'Adaptive Puzzles, Puzzle Rush & Spaced Review',
    section: 'Tactical Training',
    summary: 'Solve 1,000+ verified puzzles with Elo tracking, 3:00/5:00/Survival Rush, and automatic spaced repetition for missed tactics.',
    steps: [
      'Use Adaptive Rated mode to automatically match puzzles near your Puzzle Elo or filter by motif (Forks, Pins, Sacrifices, Mates).',
      'Switch to Puzzle Rush for 3:00 Blitz, 5:00 Endurance, or Survival speed runs (3 strikes ends the run).',
      'Missed tactics join your Spaced Review deck—solve them cleanly without hints to graduate them out.'
    ],
    keywords: ['puzzle', 'puzzles', 'rush', 'survival', 'spaced review', 'tactics', 'hint', 'daily challenge', 'lichess'],
    action: { label: 'Open Puzzles', target: { type: 'tab', tab: 'puzzles' } }
  },
  {
    id: 'help-daily-puzzle-streak',
    title: 'Daily Puzzle Challenge & Daily Streak',
    section: 'Tactical Training',
    summary: 'Solve at least one puzzle per day (Daily Challenge, Adaptive, Rush, or Spaced Review) to extend your Daily Puzzle Streak.',
    steps: [
      'Check the Daily Puzzle Streak card and 7-day activity calendar on the Archive/Stats Dashboard.',
      'Click Solve Daily Puzzle on the Dashboard or Daily Challenge inside Puzzles to load today’s featured puzzle.',
      'Your streak extends automatically whenever you solve any puzzle on a new local calendar day.'
    ],
    keywords: ['daily', 'daily puzzle', 'streak', 'daily streak', 'calendar', 'consecutive', 'spotlight'],
    action: { label: 'Solve Daily Puzzle', target: { type: 'daily_puzzle' } }
  },
  {
    id: 'help-coordinate-vision',
    title: 'Coordinate Vision Speed Trainer',
    section: 'Training Hub',
    summary: 'Drill instant square identification (30-second speed sprint or endless practice) with White, Black, or Auto-Flip board perspectives.',
    steps: [
      'Open Training → Vision to launch the Coordinate Vision Trainer.',
      'Pick 30s Speed Sprint or Endless Practice, choose White/Black/Auto-Flip, and toggle starting pieces on or off.',
      'Click the target algebraic coordinate square as quickly as possible to beat your personal 30-second high score.'
    ],
    keywords: ['vision', 'coordinate', 'coordinates', 'squares', 'drill', 'speed', 'blindfold'],
    action: { label: 'Open Vision Trainer', target: { type: 'tab', tab: 'train', trainSection: 'vision' } }
  },
  {
    id: 'help-piece-odds',
    title: 'Custom Handicap Boards & Rematch Color Swap',
    section: 'Play Arena',
    summary: 'Design custom handicap setups in the Custom Variant Studio / Board Editor and rematch bots with swapped White/Black colors.',
    steps: [
      'Open Variants & Studio → Custom Variant Studio to remove or customize pieces on the board and launch directly into the Play Arena.',
      'You can also load any custom FEN setup from the Play Arena using FEN Tools.',
      'After any match against a bot or Coach, click Swap Colors in the result dialog for an immediate reversed-color rematch.'
    ],
    keywords: ['odds', 'handicap', 'custom board', 'board editor', 'swap colors', 'rematch', 'fen'],
    action: { label: 'Open Custom Board Studio', target: { type: 'tab', tab: 'variants', variantsSubTab: 'custom' } }
  },
  {
    id: 'help-openings-endgames',
    title: 'Opening Repertoire, Endgame Drills & Vision',
    section: 'Training Hub',
    summary: 'Drill main-line openings with visual move arrows, master key endgames, and sharpen board coordinate vision.',
    steps: [
      'Open Training → Openings to learn and test White/Black repertoire lines from memory and earn mastery stars.',
      'Open Training → Endgames to convert Lucena, Philidor, Queen/Rook mates, or opposite-colored bishop draws within par.',
      'Open Training → Vision for 30-second coordinate speed drills, or Analysis board to inspect any FEN/PGN freely.'
    ],
    keywords: ['training', 'opening', 'repertoire', 'endgame', 'drills', 'lucena', 'philidor', 'analysis board', 'fen', 'pgn'],
    action: { label: 'Open Training Hub', target: { type: 'tab', tab: 'train', trainSection: 'openings' } }
  },
  {
    id: 'help-board-editor-explorer',
    title: 'Board Position Editor, Opening Explorer & Zen Mode',
    section: 'Training & Analysis',
    summary: 'Build custom FEN positions visually, inspect Lichess-style Opening Explorer W/D/B win-rate bars, or press Z in Play Arena for Zen Mode.',
    steps: [
      'Open Learn → Board Editor to place White/Black pieces, configure turn & castling rights, or load presets like Lucena.',
      'Click Analyze Position to send your setup to the Analysis Board, or Play vs Engine to spar immediately.',
      'Inside Learn → Analysis board, click any Opening Explorer continuation move to explore theory and W/D/B statistics.',
      'In the Play Arena, press Z (or click Zen Mode) to hide setup toolbars for distraction-free play.'
    ],
    keywords: ['board editor', 'position editor', 'setup', 'opening explorer', 'win rate', 'zen mode', 'focus mode', 'fen'],
    action: { label: 'Open Board Editor', target: { type: 'tab', tab: 'train', trainSection: 'editor' } }
  },
  {
    id: 'help-pgn-review',
    title: 'Importing PGNs & Post-Game Move Review',
    section: 'Archive & Review',
    summary: 'Paste external PGNs or open any finished match to step through centipawn accuracy, blunders, best-move arrows, and coaching notes.',
    steps: [
      'Open Archive (Stats) and click Import PGN to paste a game from Lichess, Chess.com, or any PGN export.',
      'Click Review on any game card to inspect move classifications (!!, ★, ?, ??) and the evaluation swing chart.',
      'Use Left/Right arrow keys or Home/End to step through plies quickly.'
    ],
    keywords: ['import', 'pgn', 'review', 'accuracy', 'blunder', 'mistake', 'brilliant', 'archive', 'history', 'stats'],
    action: { label: 'Open Match Archive', target: { type: 'tab', tab: 'dashboard' } }
  },
  {
    id: 'help-ai-coach',
    title: 'Strategy Coach & Position Decoder',
    section: 'AI Coach',
    summary: 'Analyze any FEN position for top 3 candidate moves, view real per-game phase accuracy, and request tailored coaching feedback.',
    steps: [
      'Use the Interactive Position Decoder to paste any FEN or play moves and inspect plain-English reasoning for top engine lines.',
      'Set your Training Goal and click Ask Coach to query Gemini coaching (when GEMINI_API_KEY is configured on the server) or opt into the Offline Coach Report.'
    ],
    keywords: ['coach', 'mikhail', 'gemini', 'decoder', 'phase accuracy', 'scouting', 'offline coach', 'training goal'],
    action: { label: 'Open AI Coach', target: { type: 'tab', tab: 'coach' } }
  },
  {
    id: 'help-e2ee-sync',
    title: 'End-to-End Encrypted (E2EE) Cloud Sync & Vault Backup',
    section: 'Sync & Privacy',
    summary: 'Encrypt your profile, ratings, and match history locally with AES-GCM 256 before syncing to the vault or exporting a .gmchess file.',
    steps: [
      'Open Settings → Profile, App & Sync and enter a private passphrase (6+ characters) plus your Vault ID.',
      'Click Push Encrypted Backup to upload AES-GCM ciphertext protected by a SHA-256 vault token.',
      'Use Export Vault / Import Vault anytime to save or restore a portable .gmchess backup file.'
    ],
    keywords: ['sync', 'e2ee', 'encryption', 'vault', 'passphrase', 'backup', 'export', 'import', 'gmchess', 'privacy', 'reset'],
    action: { label: 'Open Sync Settings', target: { type: 'settings', tab: 'sync' } }
  },
  {
    id: 'help-pwa-offline',
    title: 'Installing as an Offline Desktop or Mobile App (PWA)',
    section: 'Offline & PWA',
    summary: 'Install Grandmaster Studio as a standalone Progressive Web App with cached Stockfish WASM, variants, and 1,000+ puzzles.',
    steps: [
      'On Chrome/Edge/Android, click the Install App button in the header or inside Settings → Profile, App & Sync.',
      'On iPhone/iPad Safari, tap Share → Add to Home Screen.',
      'Once installed, you can play AI bots, solve puzzles, and review saved matches offline.'
    ],
    keywords: ['pwa', 'install', 'offline', 'standalone', 'app', 'mobile', 'ios', 'safari', 'service worker'],
    action: { label: 'Open App & Sync Settings', target: { type: 'settings', tab: 'sync' } }
  },
  {
    id: 'help-themes-controls',
    title: 'Board Themes, Piece Styles & Premove Controls',
    section: 'Customization & Controls',
    summary: 'Switch across 30 boards, 10 dark/light themes, 15 piece sets, premove queue limits, and input preferences.',
    steps: [
      'Choose any of the 10 Dark & Light app themes or 30 boards in Settings → Customization.',
      'Use Alt+T anytime to flip between Dark and Light mode.',
      'Premoves: Right-click the board or press Esc to cancel queued premoves.'
    ],
    keywords: ['theme', 'dark mode', 'light mode', 'board', 'piece', 'premove', 'sound', 'notation', 'customization'],
    action: { label: 'Open Customization Settings', target: { type: 'settings', tab: 'customization' } }
  }
];

export type GlobalSearchResult =
  | {
      id: string;
      kind: 'game';
      title: string;
      subtitle: string;
      meta: string;
      score: number;
      game: GameHistoryItem;
    }
  | {
      id: string;
      kind: 'variant';
      title: string;
      subtitle: string;
      meta: string;
      score: number;
      variantId: VariantId;
    }
  | {
      id: string;
      kind: 'custom_variant';
      title: string;
      subtitle: string;
      meta: string;
      score: number;
      customVariant: CustomVariantConfig;
    }
  | {
      id: string;
      kind: 'help';
      title: string;
      subtitle: string;
      meta: string;
      score: number;
      helpTopic: HelpTopic;
    };

function scoreTextMatch(queryTokens: string[], primary: string, secondary: string[]): number {
  if (queryTokens.length === 0) return 1;
  const primaryLower = primary.toLowerCase();
  const secondaryText = secondary.join(' ').toLowerCase();
  let total = 0;

  for (const token of queryTokens) {
    if (primaryLower === token) {
      total += 120;
    } else if (primaryLower.startsWith(token)) {
      total += 90;
    } else if (primaryLower.includes(token)) {
      total += 65;
    } else if (secondaryText.includes(token)) {
      total += 30;
    } else {
      return 0;
    }
  }
  return total;
}

export function searchGlobalCatalog(
  rawQuery: string,
  options: {
    matches: GameHistoryItem[];
    customVariants?: CustomVariantConfig[];
    category?: SearchCategory;
    limit?: number;
  }
): GlobalSearchResult[] {
  const { matches, customVariants = [], category = 'all', limit = 18 } = options;
  const trimmed = rawQuery.trim().toLowerCase();
  const tokens = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];

  const results: GlobalSearchResult[] = [];

  // Default suggestions when search box is opened empty
  if (tokens.length === 0) {
    if (category === 'all' || category === 'game') {
      for (const g of matches.slice(0, category === 'game' ? 8 : 3)) {
        const variantName = getVariantDisplayName(g.variant);
        results.push({
          id: `game:${g.id}`,
          kind: 'game',
          title: `vs ${g.opponentName}`,
          subtitle: `${g.result} · ${variantName} · ${g.timeControl}`,
          meta: `${g.date} · ${g.movesCount} ply`,
          score: 10,
          game: g
        });
      }
    }

    if (category === 'all' || category === 'variant') {
      const featuredIds: VariantId[] = ['standard', 'chaturanga', 'crazyhouse', 'fog_of_war', 'chess960', 'duck_chess'];
      const list = category === 'variant' ? CHESS_VARIANTS.slice(0, 10) : CHESS_VARIANTS.filter(v => featuredIds.includes(v.id));
      for (const v of list) {
        results.push({
          id: `variant:${v.id}`,
          kind: 'variant',
          title: v.name,
          subtitle: v.tagline,
          meta: v.category,
          score: 9,
          variantId: v.id
        });
      }
    }

    if (category === 'all' || category === 'help') {
      const list = category === 'help' ? HELP_TOPICS.slice(0, 10) : HELP_TOPICS.slice(0, 4);
      for (const h of list) {
        results.push({
          id: `help:${h.id}`,
          kind: 'help',
          title: h.title,
          subtitle: h.summary,
          meta: h.section,
          score: 8,
          helpTopic: h
        });
      }
    }

    return results.slice(0, limit);
  }

  // 1. Games in archive
  if (category === 'all' || category === 'game') {
    for (const g of matches) {
      const variantName = getVariantDisplayName(g.variant);
      const title = `vs ${g.opponentName}`;
      const score = scoreTextMatch(tokens, title, [
        variantName,
        g.variant,
        g.result,
        g.reason,
        g.timeControl,
        g.date,
        g.pgn.slice(0, 260),
        g.playerColor === 'w' ? 'white' : 'black'
      ]);
      if (score > 0) {
        results.push({
          id: `game:${g.id}`,
          kind: 'game',
          title,
          subtitle: `${g.result} · ${variantName} · ${g.timeControl}`,
          meta: `${g.date} · ${g.movesCount} ply`,
          score,
          game: g
        });
      }
    }
  }

  // 2. Built-in 36 Variants + Saved Custom Variants
  if (category === 'all' || category === 'variant') {
    for (const v of CHESS_VARIANTS) {
      const score = scoreTextMatch(tokens, v.name, [
        v.id,
        v.tagline,
        v.category,
        v.description,
        ...v.specialRules
      ]);
      if (score > 0) {
        results.push({
          id: `variant:${v.id}`,
          kind: 'variant',
          title: v.name,
          subtitle: v.tagline,
          meta: v.category,
          score,
          variantId: v.id
        });
      }
    }

    const seenCustomIds = new Set<string>();
    for (const cv of [...customVariants, ...DEFAULT_CUSTOM_PRESETS]) {
      if (seenCustomIds.has(cv.id)) continue;
      seenCustomIds.add(cv.id);
      const score = scoreTextMatch(tokens, cv.name, [
        cv.tagline,
        cv.description,
        `${cv.boardWidth}x${cv.boardHeight}`,
        'custom variant'
      ]);
      if (score > 0) {
        results.push({
          id: `custom:${cv.id}`,
          kind: 'custom_variant',
          title: cv.name,
          subtitle: cv.tagline,
          meta: `Custom · ${cv.boardWidth}×${cv.boardHeight}`,
          score: score - 2,
          customVariant: cv
        });
      }
    }
  }

  // 3. Help Topics + Opening Repertoire + Endgame Drills (searchable as Help & Guides)
  if (category === 'all' || category === 'help') {
    for (const h of HELP_TOPICS) {
      const score = scoreTextMatch(tokens, h.title, [h.section, h.summary, ...h.keywords, ...h.steps]);
      if (score > 0) {
        results.push({
          id: `help:${h.id}`,
          kind: 'help',
          title: h.title,
          subtitle: h.summary,
          meta: h.section,
          score,
          helpTopic: h
        });
      }
    }

    for (const line of OPENING_REPERTOIRE) {
      const score = scoreTextMatch(tokens, line.name, [line.eco, line.summary, ...line.ideas, 'opening', 'repertoire']);
      if (score > 0) {
        results.push({
          id: `help:opening:${line.id}`,
          kind: 'help',
          title: `${line.name} (${line.eco})`,
          subtitle: line.summary,
          meta: 'Opening Trainer',
          score: score - 5,
          helpTopic: {
            id: `opening-${line.id}`,
            title: `${line.name} (${line.eco})`,
            section: 'Opening Repertoire',
            summary: line.summary,
            steps: line.ideas,
            keywords: [line.eco, 'opening'],
            action: { label: 'Practice in Opening Trainer', target: { type: 'tab', tab: 'train', trainSection: 'openings' } }
          }
        });
      }
    }

    for (const drill of ENDGAME_DRILLS) {
      const score = scoreTextMatch(tokens, drill.name, [drill.difficulty, drill.summary, ...drill.tips, 'endgame', 'drill']);
      if (score > 0) {
        results.push({
          id: `help:endgame:${drill.id}`,
          kind: 'help',
          title: drill.name,
          subtitle: drill.summary,
          meta: `Endgame Drill · ${drill.difficulty}`,
          score: score - 5,
          helpTopic: {
            id: `endgame-${drill.id}`,
            title: drill.name,
            section: 'Endgame Drills',
            summary: drill.summary,
            steps: drill.tips,
            keywords: ['endgame', drill.difficulty],
            action: { label: 'Open Endgame Drills', target: { type: 'tab', tab: 'train', trainSection: 'endgames' } }
          }
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return results.slice(0, limit);
}
