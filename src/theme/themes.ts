import {
  AppThemeId,
  BoardOrnamentKind,
  BoardThemeId,
  ColorMode,
  CustomBoardRecipe,
  PieceSetId,
  SignatureBoardId,
  UserSettings
} from '../types/chess';

export type { BoardOrnamentKind } from '../types/chess';

/* ------------------------------------------------------------------ */
/*  Board themes                                                       */
/* ------------------------------------------------------------------ */

export interface BoardFrameParts {
  corners?: boolean;
  edges?: boolean;
  sides?: boolean;
  studs?: boolean;
}

export interface BoardFrameConfig {
  /** Which ornament set the frame draws (see components/BoardFrame.tsx). */
  ornament: BoardOrnamentKind | 'none';
  /** Hide individual ornament groups (all shown by default). */
  parts?: BoardFrameParts;
  /** Show the inset filigree line in the band (default on). */
  bandLine?: boolean;
  /** Animate every ornament group, not just the set's defaults. */
  animateAll?: boolean;
  /** CSS background for the frame band (gradients / patterns). */
  plating: string;
  /** Outer rim colour. */
  rim: string;
  /** Thin line framing the squares. */
  innerLine: string;
  /** Ornament palette. */
  primary: string;
  secondary: string;
  accent: string;
  /** Optional outer glow colour. */
  glow?: string;
  /** Band thickness as % of board width. */
  thickness?: number;
  /** Corner radius in px. */
  radius?: number;
  /** Ornament animation flavour. */
  motion?: 'pulse' | 'twinkle' | 'shimmer' | 'flicker';
  /** Render the band with a frosted backdrop blur. */
  frosted?: boolean;
}

export interface BoardThemeConfig {
  id: BoardThemeId;
  name: string;
  darkHex: string;
  lightHex: string;
  selectedHex: string;
  lastMoveHex: string;
  coordDark: string;
  coordLight: string;
  description: string;
  /** Signature boards are paired with a piece style. */
  pieceSet?: PieceSetId;
  frame?: BoardFrameConfig;
  /** CSS background-image layered over the square colour. */
  squareTexture?: { dark?: string; light?: string };
}

export interface AppThemeConfig {
  id: AppThemeId;
  name: string;
  mode: ColorMode;
  bgHex: string;
  /** Atmospheric layers painted behind the whole app. */
  bgGradient: string;
  headerHex: string;
  cardHex: string;
  cardSecondaryHex: string;
  cardBorderHex: string;
  /** Must stay a 6-digit hex: components append alpha suffixes to it. */
  accentHex: string;
  accent2Hex: string;
  accentTextHex: string;
  textPrimary: string;
  textSecondary: string;
  textMutedHex: string;
  surfaceHoverHex: string;
  description: string;
}

export interface AppThemeFamily {
  id: AppThemeId;
  name: string;
  description: string;
  dark: Omit<AppThemeConfig, 'id' | 'name' | 'mode' | 'description'>;
  light: Omit<AppThemeConfig, 'id' | 'name' | 'mode' | 'description'>;
}

export interface PieceSetConfig {
  id: PieceSetId;
  name: string;
  tagline: string;
  icon: string;
}

const svgUrl = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

/* Classic colour-only boards ---------------------------------------- */

export const ALL_15_BOARD_THEMES: BoardThemeConfig[] = [
  { id: 'emerald', name: 'Emerald Classic', darkHex: '#739552', lightHex: '#ebecd0', selectedHex: 'rgba(186, 202, 68, 0.85)', lastMoveHex: 'rgba(246, 246, 105, 0.45)', coordDark: '#ebecd0', coordLight: '#739552', description: 'Iconic tournament emerald and buff parchment' },
  { id: 'wood', name: 'Walnut & Maple', darkHex: '#b58863', lightHex: '#f0d9b5', selectedHex: 'rgba(214, 165, 79, 0.85)', lastMoveHex: 'rgba(228, 184, 92, 0.45)', coordDark: '#f0d9b5', coordLight: '#b58863', description: 'Traditional handcrafted hardwood timber' },
  { id: 'obsidian', name: 'Obsidian OLED', darkHex: '#181e28', lightHex: '#2e3848', selectedHex: 'rgba(59, 130, 246, 0.75)', lastMoveHex: 'rgba(59, 130, 246, 0.35)', coordDark: '#94a3b8', coordLight: '#cbd5e1', description: 'Ultra dark midnight carbon steel' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', darkHex: '#211038', lightHex: '#3b1c68', selectedHex: 'rgba(0, 240, 255, 0.75)', lastMoveHex: 'rgba(255, 0, 127, 0.4)', coordDark: '#00f0ff', coordLight: '#ff007f', description: 'Synthwave electric neon purple & cyan' },
  { id: 'slate', name: 'Tournament Slate', darkHex: '#475569', lightHex: '#cbd5e1', selectedHex: 'rgba(56, 189, 248, 0.8)', lastMoveHex: 'rgba(56, 189, 248, 0.4)', coordDark: '#cbd5e1', coordLight: '#475569', description: 'Cool architectural slate and mist' },
  { id: 'glass', name: 'Frosted Glass', darkHex: 'rgba(30, 41, 59, 0.88)', lightHex: 'rgba(226, 232, 240, 0.88)', selectedHex: 'rgba(16, 185, 129, 0.8)', lastMoveHex: 'rgba(52, 211, 153, 0.4)', coordDark: '#e2e8f0', coordLight: '#334155', description: 'Frosted translucent crystal' },
  { id: 'marble', name: 'Royal Marble', darkHex: '#334155', lightHex: '#f1f5f9', selectedHex: 'rgba(234, 179, 8, 0.85)', lastMoveHex: 'rgba(250, 204, 21, 0.4)', coordDark: '#f1f5f9', coordLight: '#334155', description: 'Carrara marble and Nero Marquina' },
  { id: 'crimson', name: 'Crimson Wine', darkHex: '#881337', lightHex: '#ffe4e6', selectedHex: 'rgba(244, 63, 94, 0.85)', lastMoveHex: 'rgba(251, 113, 133, 0.45)', coordDark: '#ffe4e6', coordLight: '#881337', description: 'Deep ruby wine & blush velvet' },
  { id: 'ocean', name: 'Pacific Ocean', darkHex: '#1e3a8a', lightHex: '#dbeafe', selectedHex: 'rgba(6, 182, 212, 0.85)', lastMoveHex: 'rgba(56, 189, 248, 0.45)', coordDark: '#dbeafe', coordLight: '#1e3a8a', description: 'Deep naval ocean & cool sea foam' },
  { id: 'desert', name: 'Sahara Dune', darkHex: '#9a3412', lightHex: '#ffedd5', selectedHex: 'rgba(249, 115, 22, 0.85)', lastMoveHex: 'rgba(251, 146, 60, 0.45)', coordDark: '#ffedd5', coordLight: '#9a3412', description: 'Terracotta clay & warm desert sand' },
  { id: 'forest', name: 'Evergreen Forest', darkHex: '#14532d', lightHex: '#dcfce7', selectedHex: 'rgba(34, 197, 94, 0.85)', lastMoveHex: 'rgba(74, 222, 128, 0.45)', coordDark: '#dcfce7', coordLight: '#14532d', description: 'Nordic spruce & spring clover' },
  { id: 'sunset', name: 'Sunset Twilight', darkHex: '#581c87', lightHex: '#fed7aa', selectedHex: 'rgba(236, 72, 153, 0.85)', lastMoveHex: 'rgba(244, 114, 182, 0.45)', coordDark: '#fed7aa', coordLight: '#581c87', description: 'Imperial violet & warm apricot' },
  { id: 'amethyst', name: 'Imperial Amethyst', darkHex: '#581c87', lightHex: '#f3e8ff', selectedHex: 'rgba(168, 85, 247, 0.85)', lastMoveHex: 'rgba(192, 132, 252, 0.45)', coordDark: '#f3e8ff', coordLight: '#581c87', description: 'Crystalline amethyst & lavender' },
  { id: 'mocha', name: 'Roasted Mocha', darkHex: '#451a03', lightHex: '#fef3c7', selectedHex: 'rgba(217, 119, 6, 0.85)', lastMoveHex: 'rgba(245, 158, 11, 0.45)', coordDark: '#fef3c7', coordLight: '#451a03', description: 'Espresso & frothy cream' },
  { id: 'monochrome', name: 'Stark Noir Monochrome', darkHex: '#090d16', lightHex: '#f8fafc', selectedHex: 'rgba(16, 185, 129, 0.85)', lastMoveHex: 'rgba(148, 163, 184, 0.5)', coordDark: '#f8fafc', coordLight: '#090d16', description: 'High-contrast black & white' }
];

/* Signature boards: one per piece style, with ornamental frames ------ */

const WOOD_GRAIN_LIGHT =
  'repeating-linear-gradient(100deg, rgba(120,72,30,0.07) 0 2px, transparent 2px 7px, rgba(120,72,30,0.05) 7px 8px, transparent 8px 15px)';
const STONE_SPECKLE_DARK = svgUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><g fill="#fff"><circle cx="5" cy="7" r="0.9" fill-opacity="0.18"/><circle cx="21" cy="4" r="0.6" fill-opacity="0.14"/><circle cx="30" cy="18" r="1" fill-opacity="0.12"/><circle cx="12" cy="24" r="0.7" fill-opacity="0.16"/><circle cx="26" cy="31" r="0.5" fill-opacity="0.15"/></g><g fill="#000"><circle cx="15" cy="12" r="1.1" fill-opacity="0.16"/><circle cx="33" cy="6" r="0.7" fill-opacity="0.14"/><circle cx="6" cy="30" r="0.9" fill-opacity="0.14"/><circle cx="20" cy="33" r="0.6" fill-opacity="0.12"/></g><path d="M0 20c8-3 14 4 22 1s10-6 14-4" fill="none" stroke="#fff" stroke-opacity="0.06" stroke-width="0.8"/></svg>'
);
const STONE_SPECKLE_LIGHT = svgUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><g fill="#3a342b"><circle cx="6" cy="9" r="0.8" fill-opacity="0.14"/><circle cx="24" cy="5" r="0.6" fill-opacity="0.12"/><circle cx="31" cy="21" r="0.9" fill-opacity="0.1"/><circle cx="13" cy="27" r="0.7" fill-opacity="0.12"/><circle cx="20" cy="16" r="0.5" fill-opacity="0.1"/></g><path d="M0 14c9 4 15-3 24 0s9 6 12 4" fill="none" stroke="#3a342b" stroke-opacity="0.05" stroke-width="0.8"/></svg>'
);
const WOOD_GRAIN_DARK =
  'repeating-linear-gradient(100deg, rgba(40,18,4,0.16) 0 2px, transparent 2px 6px, rgba(40,18,4,0.1) 6px 7px, transparent 7px 13px)';

export const SIGNATURE_BOARDS: BoardThemeConfig[] = [
  {
    id: 'sig_neo', pieceSet: 'neo', name: 'Tournament Arena',
    darkHex: '#2f6b45', lightHex: '#f4f4ec',
    selectedHex: 'rgba(186, 202, 68, 0.85)', lastMoveHex: 'rgba(246, 246, 105, 0.5)',
    coordDark: '#f4f4ec', coordLight: '#2f6b45',
    description: 'Carbon-fibre stage with LED rails, broadcast brackets, a championship trophy and scoreboard lights',
    squareTexture: {
      dark: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, transparent 45%, rgba(0,0,0,0.08) 100%)',
      light: 'linear-gradient(160deg, rgba(255,255,255,0.65) 0%, transparent 50%, rgba(47,107,69,0.05) 100%)'
    },
    frame: {
      ornament: 'tournament',
      plating: [
        'linear-gradient(180deg, rgba(74,222,128,0.16) 0%, transparent 18%, transparent 82%, rgba(74,222,128,0.16) 100%)',
        'repeating-linear-gradient(45deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 4px)',
        'repeating-linear-gradient(-45deg, rgba(0,0,0,0.28) 0 2px, transparent 2px 4px)',
        'linear-gradient(145deg, #2a3242 0%, #10141b 50%, #222a37 100%)'
      ].join(', '),
      rim: '#05070b', innerLine: '#4ade80',
      primary: '#f1f5f9', secondary: '#14261b', accent: '#4ade80',
      glow: 'rgba(74, 222, 128, 0.28)', thickness: 5.2, radius: 14, motion: 'pulse'
    }
  },
  {
    id: 'sig_classic', pieceSet: 'classic', name: 'Stone & Gem',
    darkHex: '#7b828c', lightHex: '#ebe5d7',
    selectedHex: 'rgba(45, 212, 191, 0.6)', lastMoveHex: 'rgba(96, 165, 250, 0.45)',
    coordDark: '#ebe5d7', coordLight: '#6b7280',
    description: 'Carved granite frame set with sapphires, amethyst geodes and emerald-cut gems',
    squareTexture: { dark: STONE_SPECKLE_DARK, light: STONE_SPECKLE_LIGHT },
    frame: {
      ornament: 'geode',
      plating: `${STONE_SPECKLE_DARK}, radial-gradient(ellipse at 30% 0%, rgba(255,255,255,0.14), transparent 55%), linear-gradient(150deg, #5c6068 0%, #3a3d43 50%, #4d5158 100%)`,
      rim: '#1c1d21', innerLine: '#a7f3d0',
      primary: '#3b82f6', secondary: '#2b2d33', accent: '#a855f7',
      glow: 'rgba(96, 165, 250, 0.25)', thickness: 5.4, radius: 12, motion: 'shimmer'
    }
  },
  {
    id: 'sig_modern', pieceSet: 'modern', name: 'Electric Grid',
    darkHex: '#3f72b9', lightHex: '#e3eefc',
    selectedHex: 'rgba(250, 204, 21, 0.72)', lastMoveHex: 'rgba(253, 224, 71, 0.48)',
    coordDark: '#fde047', coordLight: '#2f5f9e',
    description: 'Charged cobalt frame crackling with yellow lightning, power cores and high-voltage arcs',
    squareTexture: {
      dark: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M30 2l-9 15h7l-8 13" fill="none" stroke="#fde047" stroke-opacity="0.22" stroke-width="1.3" stroke-linejoin="round"/><circle cx="38" cy="38" r="1.2" fill="#fde047" fill-opacity="0.35"/></svg>'),
      light: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M18 46l9-15h-7l8-13" fill="none" stroke="#2563eb" stroke-opacity="0.10" stroke-width="1.3" stroke-linejoin="round"/></svg>')
    },
    frame: {
      ornament: 'electric',
      plating: [
        svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><path d="M14 8l-6 12h6l-6 12M86 70l-7 13h7l-7 13" fill="none" stroke="#facc15" stroke-opacity="0.35" stroke-width="1.4" stroke-linejoin="round"/><path d="M60 20l-5 9h5l-5 9" fill="none" stroke="#38bdf8" stroke-opacity="0.35" stroke-width="1.2"/></svg>'),
        'radial-gradient(ellipse at 50% 0%, rgba(250,204,21,0.18), transparent 55%)',
        'linear-gradient(135deg, #0b2a52 0%, #071a36 50%, #123a6e 100%)'
      ].join(', '),
      rim: '#facc15', innerLine: '#facc15',
      primary: '#38bdf8', secondary: '#0a1c38', accent: '#facc15',
      glow: 'rgba(250, 204, 21, 0.38)', thickness: 5, radius: 6, motion: 'flicker'
    }
  },
  {
    id: 'sig_wood', pieceSet: 'wood', name: 'Carved Walnut',
    darkHex: '#a06a3b', lightHex: '#e9c891',
    selectedHex: 'rgba(234, 179, 8, 0.65)', lastMoveHex: 'rgba(250, 204, 21, 0.4)',
    coordDark: '#f3dcae', coordLight: '#7c4a22',
    description: 'Hand-carved walnut with dovetail joints and oak-leaf knots',
    squareTexture: { dark: WOOD_GRAIN_DARK, light: WOOD_GRAIN_LIGHT },
    frame: {
      ornament: 'hardwood',
      plating: `${WOOD_GRAIN_DARK}, linear-gradient(160deg, #6b3a17 0%, #4a250c 55%, #5e3213 100%)`,
      rim: '#241002', innerLine: '#d9a45b',
      primary: '#e9c27f', secondary: '#3b1d07', accent: '#8fbf5a',
      thickness: 5.4, radius: 12
    }
  },
  {
    id: 'sig_minimal', pieceSet: 'minimal', name: 'Gallery Hairline',
    darkHex: '#c5c9cf', lightHex: '#f6f6f4',
    selectedHex: 'rgba(100, 116, 139, 0.45)', lastMoveHex: 'rgba(148, 163, 184, 0.35)',
    coordDark: '#f6f6f4', coordLight: '#8b9099',
    description: 'Museum-white mat with a single hairline and pin-dot corners',
    frame: {
      ornament: 'hairline',
      plating: 'linear-gradient(180deg, #fbfbfa 0%, #efefec 100%)',
      rim: '#d4d4d0', innerLine: '#1e293b',
      primary: '#1e293b', secondary: '#94a3b8', accent: '#1e293b',
      thickness: 3.4, radius: 4
    }
  },
  {
    id: 'sig_cyber', pieceSet: 'cyber', name: 'Neon Mainframe',
    darkHex: '#151133', lightHex: '#2a2160',
    selectedHex: 'rgba(34, 211, 238, 0.6)', lastMoveHex: 'rgba(244, 63, 94, 0.4)',
    coordDark: '#22d3ee', coordLight: '#fb7185',
    description: 'Circuit-traced chassis with glowing nodes and data-chip pins',
    squareTexture: {
      dark: 'linear-gradient(rgba(34,211,238,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.10) 1px, transparent 1px)',
      light: 'linear-gradient(rgba(244,63,94,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,0.10) 1px, transparent 1px)'
    },
    frame: {
      ornament: 'circuit',
      plating: 'linear-gradient(135deg, #0a0820 0%, #120d33 50%, #0a0820 100%)',
      rim: '#22d3ee', innerLine: '#f43f5e',
      primary: '#22d3ee', secondary: '#f43f5e', accent: '#f0abfc',
      glow: 'rgba(34, 211, 238, 0.45)', thickness: 4.6, radius: 4, motion: 'pulse'
    }
  },
  {
    id: 'sig_glass', pieceSet: 'glass', name: 'Crystal Prism',
    darkHex: 'rgba(74, 110, 148, 0.82)', lightHex: 'rgba(226, 240, 250, 0.88)',
    selectedHex: 'rgba(125, 211, 252, 0.7)', lastMoveHex: 'rgba(186, 230, 253, 0.55)',
    coordDark: '#e0f2fe', coordLight: '#3e6a92',
    description: 'Frosted crystal bezel with faceted prisms that catch the light',
    squareTexture: {
      dark: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 45%)',
      light: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, transparent 50%)'
    },
    frame: {
      ornament: 'crystal',
      plating: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(186,230,253,0.28) 40%, rgba(255,255,255,0.4) 70%, rgba(125,211,252,0.3) 100%)',
      rim: 'rgba(255,255,255,0.75)', innerLine: 'rgba(255,255,255,0.9)',
      primary: '#e0f2fe', secondary: '#7dd3fc', accent: '#ffffff',
      glow: 'rgba(125, 211, 252, 0.4)', thickness: 4.4, radius: 18, motion: 'shimmer', frosted: true
    }
  },
  {
    id: 'sig_gold', pieceSet: 'gold', name: 'Royal Throne Room',
    darkHex: '#7a1f2b', lightHex: '#f4e6c3',
    selectedHex: 'rgba(250, 204, 21, 0.7)', lastMoveHex: 'rgba(253, 224, 71, 0.45)',
    coordDark: '#f4e6c3', coordLight: '#7a1f2b',
    description: 'Gold-plated frame with crowns, fleur-de-lis corners and ruby cabochons',
    squareTexture: {
      dark: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 3l4 9-4 9-4-9z" fill="none" stroke="#f5d17a" stroke-opacity="0.13" stroke-width="1"/></svg>'),
      light: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), transparent 60%)'
    },
    frame: {
      ornament: 'royal',
      plating: 'linear-gradient(135deg, #8a5a0b 0%, #f5d17a 18%, #b8860b 36%, #fff1b8 50%, #c8941a 64%, #f0c75e 82%, #7a4e08 100%)',
      rim: '#4a2e04', innerLine: '#fff1b8',
      primary: '#ffe08a', secondary: '#8a5a0b', accent: '#c81d3a',
      glow: 'rgba(245, 209, 122, 0.45)', thickness: 6, radius: 10, motion: 'shimmer'
    }
  },
  {
    id: 'sig_retro', pieceSet: 'retro', name: 'Arcade Cabinet',
    darkHex: '#306230', lightHex: '#9bbc0f',
    selectedHex: 'rgba(250, 204, 21, 0.7)', lastMoveHex: 'rgba(15, 56, 15, 0.35)',
    coordDark: '#9bbc0f', coordLight: '#0f380f',
    description: 'Pixel-stepped cabinet bezel with hearts, coins and 1-UP stars',
    squareTexture: {
      dark: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" shape-rendering="crispEdges"><rect width="2" height="2" fill="#0f380f" fill-opacity="0.35"/><rect x="4" y="4" width="2" height="2" fill="#0f380f" fill-opacity="0.35"/></svg>'),
      light: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" shape-rendering="crispEdges"><rect width="2" height="2" fill="#8bac0f" fill-opacity="0.8"/><rect x="4" y="4" width="2" height="2" fill="#8bac0f" fill-opacity="0.8"/></svg>')
    },
    frame: {
      ornament: 'pixel',
      plating: 'repeating-linear-gradient(0deg, #2b1b6b 0 4px, #24165c 4px 8px)',
      rim: '#0b0623', innerLine: '#facc15',
      primary: '#facc15', secondary: '#ef4444', accent: '#ffffff',
      thickness: 5.2, radius: 0, motion: 'twinkle'
    }
  },
  {
    id: 'sig_gothic', pieceSet: 'gothic', name: 'Obsidian Citadel',
    darkHex: '#4a2027', lightHex: '#c9c3b8',
    selectedHex: 'rgba(225, 29, 72, 0.55)', lastMoveHex: 'rgba(190, 18, 60, 0.35)',
    coordDark: '#c9c3b8', coordLight: '#4a2027',
    description: 'Carved obsidian stone with watchtower arches and blood-glass oculus windows',
    squareTexture: {
      dark: 'radial-gradient(circle at 70% 30%, rgba(0,0,0,0.16), transparent 70%)',
      light: 'radial-gradient(circle at 30% 70%, rgba(80,70,60,0.1), transparent 65%)'
    },
    frame: {
      ornament: 'gothic',
      plating: 'linear-gradient(160deg, #2a2a2e 0%, #18181b 50%, #232327 100%)',
      rim: '#050506', innerLine: '#9f1239',
      primary: '#a1a1aa', secondary: '#3f3f46', accent: '#e11d48',
      glow: 'rgba(159, 18, 57, 0.35)', thickness: 5.6, radius: 6
    }
  },
  {
    id: 'sig_metal', pieceSet: 'metal', name: 'Forged Bulkhead',
    darkHex: '#4f5967', lightHex: '#c3cad4',
    selectedHex: 'rgba(250, 204, 21, 0.55)', lastMoveHex: 'rgba(148, 163, 184, 0.55)',
    coordDark: '#c3cad4', coordLight: '#4f5967',
    description: 'Brushed gunmetal bulkhead bolted down with hex rivets',
    squareTexture: {
      dark: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)',
      light: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px)'
    },
    frame: {
      ornament: 'industrial',
      plating: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px), linear-gradient(180deg, #5b6573 0%, #2f3640 50%, #4a525e 100%)',
      rim: '#0f1318', innerLine: '#1a1f26',
      primary: '#cbd5e1', secondary: '#1e252e', accent: '#facc15',
      thickness: 5, radius: 8
    }
  },
  {
    id: 'sig_ruby', pieceSet: 'ruby', name: 'Star Ruby Vault',
    darkHex: '#c9667a', lightHex: '#fff3f5',
    selectedHex: 'rgba(244, 63, 94, 0.55)', lastMoveHex: 'rgba(253, 164, 175, 0.55)',
    coordDark: '#fff3f5', coordLight: '#b04a60',
    description: 'Faceted crimson setting with brilliant-cut corners and gold prongs',
    squareTexture: {
      dark: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 40%, rgba(0,0,0,0.08) 100%)',
      light: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 45%)'
    },
    frame: {
      ornament: 'ruby',
      plating: 'conic-gradient(from 45deg at 50% 50%, #7f0f2a, #c2183f, #5e0a1e, #a3133a, #7f0f2a, #d61f4a, #5e0a1e, #a3133a, #7f0f2a)',
      rim: '#2a0410', innerLine: '#f5c76a',
      primary: '#ff4d6d', secondary: '#7f0f2a', accent: '#f5c76a',
      glow: 'rgba(225, 29, 72, 0.4)', thickness: 5, radius: 12, motion: 'shimmer'
    }
  },
  {
    id: 'sig_emerald_gem', pieceSet: 'emerald_gem', name: 'Imperial Jade Court',
    darkHex: '#5f9e80', lightHex: '#eaf5ee',
    selectedHex: 'rgba(250, 204, 21, 0.55)', lastMoveHex: 'rgba(167, 243, 208, 0.6)',
    coordDark: '#eaf5ee', coordLight: '#3f7d60',
    description: 'Polished jade frame strung with pearls and ruyi cloud scrolls',
    squareTexture: {
      dark: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.14), transparent 60%)',
      light: 'radial-gradient(ellipse at 70% 80%, rgba(52,211,153,0.10), transparent 60%)'
    },
    frame: {
      ornament: 'jade',
      plating: 'radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.18), transparent 50%), linear-gradient(135deg, #0f5f45 0%, #08442f 45%, #13734f 100%)',
      rim: '#02261a', innerLine: '#e8c66a',
      primary: '#f8f4ea', secondary: '#e8c66a', accent: '#34d399',
      thickness: 5.4, radius: 14
    }
  },
  {
    id: 'sig_monochrome_bold', pieceSet: 'monochrome_bold', name: 'Noir Venom',
    darkHex: '#3f6b24', lightHex: '#e6dcf5',
    selectedHex: 'rgba(217, 70, 239, 0.6)', lastMoveHex: 'rgba(163, 230, 53, 0.55)',
    coordDark: '#d9f99d', coordLight: '#6b2fa0',
    description: 'Toxic black-and-violet frame oozing acid slime, with a poison flask, skull mark and venom drops',
    squareTexture: {
      dark: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><g fill="none" stroke="#d9f99d" stroke-opacity="0.3"><circle cx="10" cy="12" r="4"/><circle cx="31" cy="28" r="2.5"/><circle cx="20" cy="37" r="1.6"/></g><circle cx="9" cy="11" r="1" fill="#ecfccb" fill-opacity="0.4"/></svg>'),
      light: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.55), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(192,38,211,0.12), transparent 60%)'
    },
    frame: {
      ornament: 'venom',
      plating: [
        'radial-gradient(ellipse at 50% -10%, rgba(163,230,53,0.38), transparent 50%)',
        'radial-gradient(ellipse at 50% 110%, rgba(192,38,211,0.3), transparent 50%)',
        'linear-gradient(160deg, #1a0b2e 0%, #0b0614 55%, #170a26 100%)'
      ].join(', '),
      rim: '#000000', innerLine: '#a3e635',
      primary: '#a3e635', secondary: '#1a0b2e', accent: '#d946ef',
      glow: 'rgba(163, 230, 53, 0.45)', thickness: 5.4, radius: 10, motion: 'pulse'
    }
  },
  {
    id: 'sig_celestial', pieceSet: 'celestial', name: 'Celestial Observatory',
    darkHex: '#8b7fd0', lightHex: '#e6defa',
    selectedHex: 'rgba(253, 230, 138, 0.65)', lastMoveHex: 'rgba(196, 181, 253, 0.55)',
    coordDark: '#fdf6d8', coordLight: '#6b5fb4',
    description: 'Night-sky frame with a radiant sun, crescent moon and twinkling stars',
    squareTexture: {
      dark: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="8" cy="10" r="0.9" fill="#fff" fill-opacity="0.55"/><circle cx="30" cy="26" r="0.7" fill="#fde68a" fill-opacity="0.6"/><circle cx="20" cy="34" r="0.5" fill="#fff" fill-opacity="0.45"/></svg>'),
      light: 'radial-gradient(circle at 70% 25%, rgba(253,230,138,0.25), transparent 55%)'
    },
    frame: {
      ornament: 'celestial',
      plating: `${svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90"><circle cx="10" cy="14" r="0.9" fill="#fff" fill-opacity="0.8"/><circle cx="52" cy="8" r="0.6" fill="#fde68a"/><circle cx="74" cy="44" r="1" fill="#fff" fill-opacity="0.7"/><circle cx="30" cy="62" r="0.6" fill="#c4b5fd"/><circle cx="64" cy="80" r="0.8" fill="#fff" fill-opacity="0.6"/><circle cx="16" cy="84" r="0.5" fill="#fde68a"/></svg>')}, radial-gradient(ellipse at 20% 10%, rgba(139,92,246,0.55), transparent 55%), radial-gradient(ellipse at 90% 90%, rgba(45,212,191,0.3), transparent 50%), linear-gradient(135deg, #17123d 0%, #0c0a26 100%)`,
      rim: '#05041a', innerLine: '#fde68a',
      primary: '#fde68a', secondary: '#c4b5fd', accent: '#ffffff',
      glow: 'rgba(139, 92, 246, 0.45)', thickness: 5.4, radius: 16, motion: 'twinkle'
    }
  }
];

export const ALL_BOARD_THEMES: BoardThemeConfig[] = [...SIGNATURE_BOARDS, ...ALL_15_BOARD_THEMES];

/* ------------------------------------------------------------------ */
/*  Board Editor: presets and custom board building                    */
/* ------------------------------------------------------------------ */

const sigTexture = (pieceSet: PieceSetId) => SIGNATURE_BOARDS.find(b => b.pieceSet === pieceSet)?.squareTexture || {};

export interface TexturePreset {
  id: string;
  name: string;
  dark?: string;
  light?: string;
}

export const TEXTURE_PRESETS: TexturePreset[] = [
  { id: 'none', name: 'Flat' },
  { id: 'wood', name: 'Wood grain', dark: WOOD_GRAIN_DARK, light: WOOD_GRAIN_LIGHT },
  { id: 'granite', name: 'Speckled granite', ...sigTexture('classic') },
  {
    id: 'marble',
    name: 'Marble veins',
    dark: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><path d="M-5 18C10 12 18 30 32 22S52 8 66 16M-5 46c14-8 22 6 36-2s20-14 34-6" fill="none" stroke="#fff" stroke-opacity="0.16" stroke-width="1.2"/></svg>'),
    light: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><path d="M-5 14C12 20 20 4 34 12s18 18 32 10M-5 42c12 6 24-8 38-2s18 12 32 6" fill="none" stroke="#000" stroke-opacity="0.09" stroke-width="1.1"/></svg>')
  },
  {
    id: 'linen',
    name: 'Woven linen',
    dark: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)',
    light: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 4px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 4px)'
  },
  { id: 'brushed', name: 'Brushed metal', ...sigTexture('metal') },
  {
    id: 'grid',
    name: 'Circuit grid',
    dark: 'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
    light: 'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)'
  },
  { id: 'glass', name: 'Glass sheen', ...sigTexture('glass') },
  { id: 'damask', name: 'Damask diamonds', ...sigTexture('gold') },
  {
    id: 'pixel',
    name: 'Pixel dither',
    dark: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" shape-rendering="crispEdges"><rect width="2" height="2" fill="#000" fill-opacity="0.22"/><rect x="4" y="4" width="2" height="2" fill="#000" fill-opacity="0.22"/></svg>'),
    light: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" shape-rendering="crispEdges"><rect width="2" height="2" fill="#000" fill-opacity="0.1"/><rect x="4" y="4" width="2" height="2" fill="#000" fill-opacity="0.1"/></svg>')
  },
  { id: 'stone', name: 'Weathered stone', ...sigTexture('gothic') },
  { id: 'facets', name: 'Gem facets', ...sigTexture('ruby') },
  { id: 'jade', name: 'Polished jade', ...sigTexture('emerald_gem') },
  { id: 'stars', name: 'Starlight', ...sigTexture('celestial') },
  { id: 'sparks', name: 'Lightning sparks', ...sigTexture('modern') },
  { id: 'bubbles', name: 'Toxic bubbles', ...sigTexture('monochrome_bold') }
];

export interface PlatingPreset {
  id: string;
  name: string;
  plating: string;
  rim: string;
  innerLine: string;
  frosted?: boolean;
}

const PLATING_NAMES: Record<PieceSetId, string> = {
  neo: 'Carbon fibre',
  classic: 'Carved granite',
  modern: 'Charged cobalt',
  wood: 'Carved walnut',
  minimal: 'Gallery white',
  cyber: 'Neon chassis',
  glass: 'Frosted crystal',
  gold: '24K gold',
  retro: 'Arcade stripes',
  gothic: 'Citadel stone',
  metal: 'Gunmetal',
  ruby: 'Faceted ruby',
  emerald_gem: 'Imperial jade',
  monochrome_bold: 'Venom slime',
  celestial: 'Night sky'
};

export const PLATING_PRESETS: PlatingPreset[] = SIGNATURE_BOARDS.map(b => ({
  id: b.pieceSet!,
  name: PLATING_NAMES[b.pieceSet!],
  plating: b.frame!.plating,
  rim: b.frame!.rim,
  innerLine: b.frame!.innerLine,
  frosted: b.frame!.frosted
}));

export const ORNAMENT_OPTIONS: { id: BoardOrnamentKind | 'none'; name: string }[] = [
  { id: 'none', name: 'No ornaments' },
  { id: 'royal', name: 'Crowns & fleur-de-lis' },
  { id: 'geode', name: 'Gems & geodes' },
  { id: 'staunton', name: 'Brass caps & knight' },
  { id: 'tournament', name: 'Trophy & arena lights' },
  { id: 'electric', name: 'Lightning & power cores' },
  { id: 'venom', name: 'Poison flask & skull' },
  { id: 'geometric', name: 'Chevrons & hexes' },
  { id: 'hardwood', name: 'Oak leaves & acorns' },
  { id: 'hairline', name: 'Pin dots' },
  { id: 'circuit', name: 'Circuits & chips' },
  { id: 'crystal', name: 'Crystal prisms' },
  { id: 'pixel', name: 'Pixel hearts & coins' },
  { id: 'gothic', name: 'Towers & oculus windows' },
  { id: 'industrial', name: 'Bolts & hazard plate' },
  { id: 'ruby', name: 'Cut gems' },
  { id: 'jade', name: 'Cloud scrolls & pearls' },
  { id: 'noir', name: 'Deco sunbursts' },
  { id: 'celestial', name: 'Sun, moon & stars' }
];

/** Best-effort conversion of any CSS colour we use (hex / rgb / rgba) to #rrggbb. */
export function toHex(color: string | undefined, fallback = '#888888'): string {
  if (!color) return fallback;
  const c = color.trim();
  if (/^#[0-9a-f]{6}$/i.test(c)) return c.toLowerCase();
  if (/^#[0-9a-f]{8}$/i.test(c)) return c.slice(0, 7).toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(c)) return `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`.toLowerCase();
  const m = c.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (m) {
    return `#${[m[1], m[2], m[3]].map(v => Math.round(Number(v)).toString(16).padStart(2, '0')).join('')}`;
  }
  return fallback;
}

export function withAlpha(hex: string, alpha: number): string {
  const h = toHex(hex);
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Turns an editor recipe into a renderable board. */
export function buildCustomBoard(r: CustomBoardRecipe): BoardThemeConfig {
  const texture = TEXTURE_PRESETS.find(t => t.id === r.texture);
  const preset = PLATING_PRESETS.find(p => p.id === r.plating);
  const plating =
    r.plating === 'none'
      ? null
      : r.plating === 'custom' || !preset
        ? { plating: `linear-gradient(135deg, ${r.plateA} 0%, ${r.plateB} 50%, ${r.plateA} 100%)`, frosted: false }
        : { plating: preset.plating, frosted: preset.frosted };

  return {
    id: r.id,
    name: r.name || 'Custom board',
    description: 'Built in the Board Editor',
    lightHex: r.lightHex,
    darkHex: r.darkHex,
    selectedHex: withAlpha(r.selectedHex, 0.8),
    lastMoveHex: withAlpha(r.lastMoveHex, 0.5),
    coordDark: r.lightHex,
    coordLight: r.darkHex,
    squareTexture: texture && texture.id !== 'none' ? { dark: texture.dark, light: texture.light } : undefined,
    frame: plating
      ? {
          ornament: r.ornament,
          plating: plating.plating,
          frosted: plating.frosted,
          rim: r.rim,
          innerLine: r.innerLine,
          primary: r.primary,
          secondary: r.secondary,
          accent: r.accent,
          glow: r.glow ? withAlpha(r.glowColor, 0.45) : undefined,
          thickness: r.thickness,
          radius: r.radius,
          motion: r.motion === 'none' ? undefined : r.motion,
          animateAll: true,
          bandLine: r.bandLine,
          parts: { corners: r.showCorners, edges: r.showEdges, sides: r.showSides, studs: r.showStuds }
        }
      : undefined
  };
}

/** Seeds an editor recipe from any existing board so it can be remixed. */
export function recipeFromBoard(board: BoardThemeConfig, id: CustomBoardRecipe['id'], name: string): CustomBoardRecipe {
  const f = board.frame;
  const texture = TEXTURE_PRESETS.find(t => t.id !== 'none' && t.dark && t.dark === board.squareTexture?.dark);
  const plating = f ? PLATING_PRESETS.find(p => p.plating === f.plating)?.id || 'custom' : 'none';
  return {
    id,
    name,
    lightHex: toHex(board.lightHex, '#eeeeee'),
    darkHex: toHex(board.darkHex, '#777777'),
    selectedHex: toHex(board.selectedHex, '#facc15'),
    lastMoveHex: toHex(board.lastMoveHex, '#fde047'),
    texture: texture?.id || 'none',
    plating,
    plateA: toHex(f?.rim, '#3b2a12'),
    plateB: toHex(f?.primary, '#c8941a'),
    rim: toHex(f?.rim, '#111111'),
    innerLine: toHex(f?.innerLine, '#d4af37'),
    ornament: f?.ornament || 'none',
    primary: toHex(f?.primary, '#ffe08a'),
    secondary: toHex(f?.secondary, '#8a5a0b'),
    accent: toHex(f?.accent, '#c81d3a'),
    showCorners: f?.parts?.corners !== false,
    showEdges: f?.parts?.edges !== false,
    showSides: f?.parts?.sides !== false,
    showStuds: f?.parts?.studs !== false,
    bandLine: f?.bandLine !== false,
    glow: Boolean(f?.glow),
    glowColor: toHex(f?.glow, '#f5d17a'),
    motion: f?.motion || 'none',
    thickness: f?.thickness ?? 5,
    radius: f?.radius ?? 10
  };
}

export function getBoardTheme(id: BoardThemeId, customBoards: CustomBoardRecipe[] = []): BoardThemeConfig {
  if (typeof id === 'string' && id.startsWith('custom_')) {
    const recipe = customBoards.find(c => c.id === id);
    if (recipe) return buildCustomBoard(recipe);
  }
  return ALL_BOARD_THEMES.find(t => t.id === id) || ALL_15_BOARD_THEMES[0];
}

export function signatureBoardFor(pieceSet: PieceSetId): BoardThemeConfig {
  return getBoardTheme(`sig_${pieceSet}` as SignatureBoardId);
}

/** The board actually shown: the piece style's signature board when matching is on. */
export function resolveBoardTheme(
  settings: Pick<UserSettings, 'boardTheme' | 'matchBoardToPieces' | 'pieceSet'> & { customBoards?: CustomBoardRecipe[] },
  pieceSetOverride?: PieceSetId
): BoardThemeConfig {
  if (settings.matchBoardToPieces !== false) {
    return signatureBoardFor(pieceSetOverride || settings.pieceSet || 'neo');
  }
  return getBoardTheme(settings.boardTheme || 'emerald', settings.customBoards || []);
}

/* ------------------------------------------------------------------ */
/*  App themes: 10 families, each with a dark and a light mode         */
/* ------------------------------------------------------------------ */

const STARFIELD = svgUrl(
  '<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260"><g fill="#fff"><circle cx="22" cy="30" r="0.9" opacity="0.6"/><circle cx="140" cy="18" r="0.6" opacity="0.45"/><circle cx="210" cy="90" r="1.1" opacity="0.55"/><circle cx="80" cy="120" r="0.5" opacity="0.4"/><circle cx="170" cy="190" r="0.8" opacity="0.5"/><circle cx="40" cy="220" r="0.6" opacity="0.35"/><circle cx="240" cy="240" r="0.5" opacity="0.4"/></g></svg>'
);
const GRID_DARK = 'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 44px), repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 44px)';
const GRID_LIGHT = 'repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0 1px, transparent 1px 44px), repeating-linear-gradient(90deg, rgba(0,0,0,0.035) 0 1px, transparent 1px 44px)';
const DAMASK = (c: string) => `repeating-linear-gradient(45deg, ${c} 0 1px, transparent 1px 22px), repeating-linear-gradient(-45deg, ${c} 0 1px, transparent 1px 22px)`;
const glow = (x: string, y: string, color: string, w = '900px', h = '560px') =>
  `radial-gradient(${w} ${h} at ${x} ${y}, ${color}, transparent 65%)`;

/* Background patterns for the themed families */
const HEX_CELLS = (color: string, opacity: number) =>
  svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="90"><path d="M26 0L52 15V45L26 60L0 45V15ZM26 60V90" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1.2"/></svg>`
  );
const CAUSTICS = (color: string, opacity: number) =>
  svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="120"><g fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1.4"><path d="M0 30c20-14 40 10 60-4s38-18 60-2 40 8 60-6"/><path d="M0 72c24-10 36 14 62 2s34-20 58-6 42 14 60 0"/><path d="M-10 106c26-12 44 8 66-2s40-14 62-2 38 10 62-4"/></g></svg>`
  );
const PAPER_FIBRES = (color: string, opacity: number) =>
  svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><g fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="0.8" stroke-linecap="round"><path d="M12 20q10 4 22 1"/><path d="M80 14q8 6 18 3"/><path d="M150 40q10-3 20 2"/><path d="M30 90q12 5 26 0"/><path d="M110 82q6 7 16 6"/><path d="M170 120q8 4 18-2"/><path d="M20 160q14-4 24 3"/><path d="M90 150q10 6 22 1"/><path d="M140 186q8-5 20 0"/><path d="M60 50q4 8 12 10"/><path d="M128 130q10 2 16 10"/></g></svg>`
  );
const DRAFT_GRID = (rgb: string, minor: number, major: number) =>
  [
    `repeating-linear-gradient(0deg, rgba(${rgb},${major}) 0 1px, transparent 1px 120px)`,
    `repeating-linear-gradient(90deg, rgba(${rgb},${major}) 0 1px, transparent 1px 120px)`,
    `repeating-linear-gradient(0deg, rgba(${rgb},${minor}) 0 1px, transparent 1px 24px)`,
    `repeating-linear-gradient(90deg, rgba(${rgb},${minor}) 0 1px, transparent 1px 24px)`
  ].join(', ');

export const APP_THEME_FAMILIES: AppThemeFamily[] = [
  {
    id: 'emerald_studio', name: 'Emerald Studio', description: 'Tournament emerald with a cool cyan aurora',
    dark: {
      bgHex: '#070b12', headerHex: 'rgba(9, 14, 22, 0.78)', cardHex: '#0f1622', cardSecondaryHex: '#162132',
      cardBorderHex: 'rgba(52, 211, 153, 0.16)', accentHex: '#10b981', accent2Hex: '#22d3ee', accentTextHex: '#022c22',
      textPrimary: '#f1f5f9', textSecondary: '#9fb3c8', textMutedHex: '#6b8197', surfaceHoverHex: 'rgba(16, 185, 129, 0.08)',
      bgGradient: [glow('8%', '-8%', 'rgba(16,185,129,0.20)', '1100px', '620px'), glow('100%', '0%', 'rgba(34,211,238,0.11)'), glow('50%', '115%', 'rgba(16,185,129,0.08)')].join(', ')
    },
    light: {
      bgHex: '#f1f7f4', headerHex: 'rgba(255, 255, 255, 0.76)', cardHex: '#ffffff', cardSecondaryHex: '#e8f3ed',
      cardBorderHex: '#cfe3d8', accentHex: '#059669', accent2Hex: '#0891b2', accentTextHex: '#ffffff',
      textPrimary: '#0b1f17', textSecondary: '#3d5a4c', textMutedHex: '#5f7a6d', surfaceHoverHex: 'rgba(5, 150, 105, 0.07)',
      bgGradient: [glow('8%', '-8%', 'rgba(16,185,129,0.16)', '1100px', '620px'), glow('100%', '0%', 'rgba(34,211,238,0.12)')].join(', ')
    }
  },
  {
    id: 'carbon_volt', name: 'Carbon Volt', description: 'Carbon black blueprint grid with volt-lime energy',
    dark: {
      bgHex: '#050505', headerHex: 'rgba(8, 8, 8, 0.8)', cardHex: '#101010', cardSecondaryHex: '#1a1a1a',
      cardBorderHex: 'rgba(198, 244, 50, 0.14)', accentHex: '#c6f432', accent2Hex: '#f97316', accentTextHex: '#111400',
      textPrimary: '#fafafa', textSecondary: '#a3a3a3', textMutedHex: '#7a7a7a', surfaceHoverHex: 'rgba(198, 244, 50, 0.07)',
      bgGradient: [glow('0%', '0%', 'rgba(198,244,50,0.11)'), glow('100%', '100%', 'rgba(249,115,22,0.08)'), GRID_DARK].join(', ')
    },
    light: {
      bgHex: '#f4f4f0', headerHex: 'rgba(250, 250, 247, 0.82)', cardHex: '#ffffff', cardSecondaryHex: '#ecece6',
      cardBorderHex: '#d9d9d0', accentHex: '#4d7c0f', accent2Hex: '#ea580c', accentTextHex: '#ffffff',
      textPrimary: '#0a0a0a', textSecondary: '#404040', textMutedHex: '#6b6b6b', surfaceHoverHex: 'rgba(77, 124, 15, 0.07)',
      bgGradient: [glow('0%', '0%', 'rgba(132,204,22,0.14)'), glow('100%', '100%', 'rgba(249,115,22,0.08)'), GRID_LIGHT].join(', ')
    }
  },
  {
    id: 'synthwave', name: 'Synthwave', description: 'Hot-pink sunset over an electric cyan horizon',
    dark: {
      bgHex: '#0d0518', headerHex: 'rgba(20, 8, 38, 0.78)', cardHex: '#1a0b33', cardSecondaryHex: '#251145',
      cardBorderHex: 'rgba(255, 60, 172, 0.26)', accentHex: '#ff3cac', accent2Hex: '#22e4ff', accentTextHex: '#2a0420',
      textPrimary: '#fdf4ff', textSecondary: '#d8b4fe', textMutedHex: '#a07cc5', surfaceHoverHex: 'rgba(255, 60, 172, 0.10)',
      bgGradient: [glow('15%', '-10%', 'rgba(255,60,172,0.26)'), glow('95%', '20%', 'rgba(34,228,255,0.14)'), 'linear-gradient(180deg, transparent 55%, rgba(255,60,172,0.10) 100%)'].join(', ')
    },
    light: {
      bgHex: '#fbf3ff', headerHex: 'rgba(255, 250, 255, 0.8)', cardHex: '#ffffff', cardSecondaryHex: '#f5e8ff',
      cardBorderHex: '#ead3fb', accentHex: '#c0127f', accent2Hex: '#0891b2', accentTextHex: '#ffffff',
      textPrimary: '#2a0b3d', textSecondary: '#5b3a72', textMutedHex: '#8a6aa0', surfaceHoverHex: 'rgba(192, 18, 127, 0.07)',
      bgGradient: [glow('15%', '-10%', 'rgba(255,60,172,0.16)'), glow('95%', '20%', 'rgba(34,228,255,0.14)')].join(', ')
    }
  },
  {
    id: 'royal_velvet', name: 'Royal Velvet', description: 'Crimson velvet, gold leaf and a faint damask weave',
    dark: {
      bgHex: '#12040a', headerHex: 'rgba(26, 7, 14, 0.8)', cardHex: '#200a13', cardSecondaryHex: '#2e0f1c',
      cardBorderHex: 'rgba(232, 184, 74, 0.22)', accentHex: '#e8b84a', accent2Hex: '#e11d48', accentTextHex: '#2a1702',
      textPrimary: '#fff7ed', textSecondary: '#e7c9b0', textMutedHex: '#b08f7a', surfaceHoverHex: 'rgba(232, 184, 74, 0.08)',
      bgGradient: [glow('50%', '-12%', 'rgba(190,18,60,0.30)', '1200px', '640px'), glow('100%', '100%', 'rgba(232,184,74,0.10)'), DAMASK('rgba(232,184,74,0.028)')].join(', ')
    },
    light: {
      bgHex: '#fbf5ea', headerHex: 'rgba(255, 251, 243, 0.82)', cardHex: '#fffdf8', cardSecondaryHex: '#f5ead6',
      cardBorderHex: '#e7d4b0', accentHex: '#9f1239', accent2Hex: '#b7791f', accentTextHex: '#fff7ed',
      textPrimary: '#2b0a12', textSecondary: '#5c3a2e', textMutedHex: '#8a6b55', surfaceHoverHex: 'rgba(159, 18, 57, 0.06)',
      bgGradient: [glow('50%', '-12%', 'rgba(190,18,60,0.10)', '1200px', '640px'), glow('100%', '100%', 'rgba(232,184,74,0.18)'), DAMASK('rgba(159,18,57,0.035)')].join(', ')
    }
  },
  {
    id: 'honeycomb', name: 'Honeycomb', description: 'Espresso hive glowing with amber honey and hex cells',
    dark: {
      bgHex: '#120c05', headerHex: 'rgba(22, 15, 7, 0.82)', cardHex: '#1c140a', cardSecondaryHex: '#281c0e',
      cardBorderHex: 'rgba(251, 191, 36, 0.2)', accentHex: '#fbbf24', accent2Hex: '#f97316', accentTextHex: '#2a1a00',
      textPrimary: '#fff8e7', textSecondary: '#e3c99a', textMutedHex: '#a88b5c', surfaceHoverHex: 'rgba(251, 191, 36, 0.08)',
      bgGradient: [HEX_CELLS('#fbbf24', 0.07), glow('0%', '0%', 'rgba(251,191,36,0.20)'), glow('100%', '100%', 'rgba(249,115,22,0.12)')].join(', ')
    },
    light: {
      bgHex: '#fbf3dc', headerHex: 'rgba(255, 250, 236, 0.84)', cardHex: '#fffaf0', cardSecondaryHex: '#f6e8c3',
      cardBorderHex: '#ead6a0', accentHex: '#b45309', accent2Hex: '#c2410c', accentTextHex: '#ffffff',
      textPrimary: '#2b1d08', textSecondary: '#5e4a26', textMutedHex: '#836c43', surfaceHoverHex: 'rgba(180, 83, 9, 0.07)',
      bgGradient: [HEX_CELLS('#b45309', 0.1), glow('0%', '0%', 'rgba(251,191,36,0.28)'), glow('100%', '100%', 'rgba(249,115,22,0.12)')].join(', ')
    }
  },
  {
    id: 'coral_reef', name: 'Coral Reef', description: 'Sunlit teal lagoon with rippling caustics and living coral',
    dark: {
      bgHex: '#031a1f', headerHex: 'rgba(4, 30, 36, 0.8)', cardHex: '#072a31', cardSecondaryHex: '#0b3840',
      cardBorderHex: 'rgba(45, 212, 191, 0.2)', accentHex: '#ff7a59', accent2Hex: '#2dd4bf', accentTextHex: '#3a0d00',
      textPrimary: '#effdfb', textSecondary: '#9fd3cc', textMutedHex: '#649f98', surfaceHoverHex: 'rgba(255, 122, 89, 0.08)',
      bgGradient: [CAUSTICS('#ffffff', 0.05), glow('30%', '-10%', 'rgba(45,212,191,0.22)', '1100px', '600px'), glow('100%', '100%', 'rgba(255,122,89,0.14)')].join(', ')
    },
    light: {
      bgHex: '#e9f5f2', headerHex: 'rgba(247, 253, 251, 0.84)', cardHex: '#ffffff', cardSecondaryHex: '#d9efea',
      cardBorderHex: '#bfe1da', accentHex: '#e4572e', accent2Hex: '#0f766e', accentTextHex: '#ffffff',
      textPrimary: '#06302c', textSecondary: '#2f5a55', textMutedHex: '#567c77', surfaceHoverHex: 'rgba(228, 87, 46, 0.07)',
      bgGradient: [CAUSTICS('#0f766e', 0.08), glow('30%', '-10%', 'rgba(45,212,191,0.24)', '1100px', '600px'), glow('100%', '100%', 'rgba(255,122,89,0.16)')].join(', ')
    }
  },
  {
    id: 'ink_vermilion', name: 'Ink & Vermilion', description: 'Sumi ink washes on rice paper under a vermilion sun',
    dark: {
      bgHex: '#111010', headerHex: 'rgba(20, 19, 18, 0.84)', cardHex: '#1a1918', cardSecondaryHex: '#252321',
      cardBorderHex: 'rgba(231, 229, 228, 0.12)', accentHex: '#ef4134', accent2Hex: '#d6c7a1', accentTextHex: '#fff5f2',
      textPrimary: '#f5f0e6', textSecondary: '#b8b0a2', textMutedHex: '#8a8274', surfaceHoverHex: 'rgba(239, 65, 52, 0.08)',
      bgGradient: [
        'radial-gradient(circle at 88% 16%, rgba(239,65,52,0.32) 0 90px, rgba(239,65,52,0.08) 92px, transparent 220px)',
        PAPER_FIBRES('#ffffff', 0.05),
        glow('10%', '90%', 'rgba(255,255,255,0.05)', '700px', '420px'),
        glow('40%', '30%', 'rgba(214,199,161,0.05)', '900px', '500px')
      ].join(', ')
    },
    light: {
      bgHex: '#f3ede1', headerHex: 'rgba(247, 242, 233, 0.86)', cardHex: '#faf6ee', cardSecondaryHex: '#ece4d4',
      cardBorderHex: '#dccfb6', accentHex: '#c8261d', accent2Hex: '#44403c', accentTextHex: '#ffffff',
      textPrimary: '#1c1917', textSecondary: '#44403c', textMutedHex: '#716a62', surfaceHoverHex: 'rgba(200, 38, 29, 0.06)',
      bgGradient: [
        'radial-gradient(circle at 88% 16%, rgba(200,38,29,0.85) 0 70px, rgba(200,38,29,0.12) 72px, transparent 200px)',
        PAPER_FIBRES('#3f3a33', 0.07),
        glow('5%', '95%', 'rgba(28,25,23,0.10)', '760px', '420px'),
        glow('35%', '20%', 'rgba(28,25,23,0.05)', '900px', '480px')
      ].join(', ')
    }
  },
  {
    id: 'cosmic_nebula', name: 'Cosmic Nebula', description: 'Violet nebula clouds drifting through a starfield',
    dark: {
      bgHex: '#07061a', headerHex: 'rgba(12, 10, 36, 0.78)', cardHex: '#110f2e', cardSecondaryHex: '#1a1742',
      cardBorderHex: 'rgba(167, 139, 250, 0.22)', accentHex: '#a78bfa', accent2Hex: '#2dd4bf', accentTextHex: '#1a0b40',
      textPrimary: '#f5f3ff', textSecondary: '#c4bdf0', textMutedHex: '#8a84c0', surfaceHoverHex: 'rgba(167, 139, 250, 0.09)',
      bgGradient: [STARFIELD, glow('15%', '5%', 'rgba(139,92,246,0.28)'), glow('90%', '80%', 'rgba(45,212,191,0.14)'), glow('60%', '30%', 'rgba(236,72,153,0.08)', '600px', '400px')].join(', ')
    },
    light: {
      bgHex: '#f4f3ff', headerHex: 'rgba(251, 250, 255, 0.82)', cardHex: '#ffffff', cardSecondaryHex: '#ebe8ff',
      cardBorderHex: '#d9d3fb', accentHex: '#6d28d9', accent2Hex: '#0d9488', accentTextHex: '#ffffff',
      textPrimary: '#1b1442', textSecondary: '#4a4380', textMutedHex: '#726ca3', surfaceHoverHex: 'rgba(109, 40, 217, 0.06)',
      bgGradient: [glow('15%', '5%', 'rgba(139,92,246,0.18)'), glow('90%', '80%', 'rgba(45,212,191,0.14)')].join(', ')
    }
  },
  {
    id: 'blueprint', name: 'Blueprint', description: 'Cobalt drafting paper with a white grid and highlighter yellow',
    dark: {
      bgHex: '#08224f', headerHex: 'rgba(8, 30, 70, 0.84)', cardHex: '#0c2b5f', cardSecondaryHex: '#11376f',
      cardBorderHex: 'rgba(191, 219, 254, 0.22)', accentHex: '#ffd23f', accent2Hex: '#7dd3fc', accentTextHex: '#2a2000',
      textPrimary: '#f0f6ff', textSecondary: '#b4cbf0', textMutedHex: '#86a3d1', surfaceHoverHex: 'rgba(255, 210, 63, 0.08)',
      bgGradient: [DRAFT_GRID('191,219,254', 0.06, 0.13), glow('50%', '-20%', 'rgba(125,211,252,0.16)', '1200px', '600px')].join(', ')
    },
    light: {
      bgHex: '#e8f0fb', headerHex: 'rgba(244, 248, 255, 0.86)', cardHex: '#f7faff', cardSecondaryHex: '#dde8f8',
      cardBorderHex: '#bcd0ee', accentHex: '#1d4ed8', accent2Hex: '#d97706', accentTextHex: '#ffffff',
      textPrimary: '#0b1f44', textSecondary: '#33507f', textMutedHex: '#56709b', surfaceHoverHex: 'rgba(29, 78, 216, 0.06)',
      bgGradient: [DRAFT_GRID('29,78,216', 0.06, 0.12), glow('50%', '-20%', 'rgba(59,130,246,0.12)', '1200px', '600px')].join(', ')
    }
  },
  {
    id: 'liquid_chrome', name: 'Liquid Chrome', description: 'Polished silver monochrome with a sweeping metallic sheen',
    dark: {
      bgHex: '#0c0d10', headerHex: 'rgba(16, 17, 21, 0.82)', cardHex: '#16171b', cardSecondaryHex: '#202227',
      cardBorderHex: 'rgba(229, 231, 235, 0.14)', accentHex: '#e5e7eb', accent2Hex: '#93c5fd', accentTextHex: '#111214',
      textPrimary: '#fafafa', textSecondary: '#a1a1aa', textMutedHex: '#7c7c85', surfaceHoverHex: 'rgba(229, 231, 235, 0.06)',
      bgGradient: [
        'linear-gradient(115deg, transparent 25%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0.015) 50%, transparent 62%)',
        glow('50%', '-15%', 'rgba(255,255,255,0.10)', '1100px', '520px'),
        'repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 3px)'
      ].join(', ')
    },
    light: {
      bgHex: '#e4e5e9', headerHex: 'rgba(240, 241, 244, 0.84)', cardHex: '#f4f4f6', cardSecondaryHex: '#e9eaee',
      cardBorderHex: '#c9cbd2', accentHex: '#18181b', accent2Hex: '#3b82f6', accentTextHex: '#fafafa',
      textPrimary: '#0b0b0d', textSecondary: '#3f3f46', textMutedHex: '#63636c', surfaceHoverHex: 'rgba(24, 24, 27, 0.06)',
      bgGradient: [
        'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.75) 40%, rgba(255,255,255,0.15) 52%, transparent 65%)',
        glow('50%', '115%', 'rgba(24,24,27,0.10)', '1100px', '520px'),
        'repeating-linear-gradient(90deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 3px)'
      ].join(', ')
    }
  }
];

/** Legacy single-mode theme ids map onto a family + mode. */
const LEGACY_APP_THEMES: Record<string, { id: AppThemeId; mode?: ColorMode }> = {
  // v1 single-mode themes
  midnight_dark: { id: 'emerald_studio', mode: 'dark' },
  oled_dark: { id: 'carbon_volt', mode: 'dark' },
  cyber_dark: { id: 'synthwave', mode: 'dark' },
  crimson_dark: { id: 'royal_velvet', mode: 'dark' },
  forest_dark: { id: 'emerald_studio', mode: 'dark' },
  clean_light: { id: 'emerald_studio', mode: 'light' },
  ivory_light: { id: 'honeycomb', mode: 'light' },
  sky_light: { id: 'blueprint', mode: 'light' },
  rose_light: { id: 'ink_vermilion', mode: 'light' },
  mint_light: { id: 'coral_reef', mode: 'light' },
  // v2 families that were replaced (keep the player's current mode)
  enchanted_forest: { id: 'blueprint' },
  deep_ocean: { id: 'coral_reef' },
  sahara_sunset: { id: 'honeycomb' },
  sakura_bloom: { id: 'ink_vermilion' },
  arctic_frost: { id: 'liquid_chrome' }
}

export function getAppTheme(id: AppThemeId | string, mode: ColorMode = 'dark'): AppThemeConfig {
  const legacy = LEGACY_APP_THEMES[id];
  const familyId = legacy ? legacy.id : id;
  const family = APP_THEME_FAMILIES.find(f => f.id === familyId) || APP_THEME_FAMILIES[0];
  return {
    id: family.id,
    name: family.name,
    description: family.description,
    mode,
    ...(mode === 'light' ? family.light : family.dark)
  };
}

/** Upgrades settings saved by older versions (legacy theme ids, missing toggles). */
export function normalizeThemeSettings<T extends Partial<UserSettings>>(s: T): T {
  const next = { ...s };
  const legacy = s.appTheme ? LEGACY_APP_THEMES[s.appTheme as string] : undefined;
  if (legacy) {
    next.appTheme = legacy.id;
    if (legacy.mode) next.colorMode = legacy.mode;
  } else if (s.appTheme && !APP_THEME_FAMILIES.some(f => f.id === s.appTheme)) {
    next.appTheme = 'emerald_studio';
  }
  if (next.colorMode !== 'light' && next.colorMode !== 'dark') next.colorMode = 'dark';
  if (typeof next.matchBoardToPieces !== 'boolean') next.matchBoardToPieces = true;
  if (!Array.isArray(next.customBoards)) next.customBoards = [];
  if (typeof next.boardSize !== 'number' || !Number.isFinite(next.boardSize)) next.boardSize = 100;
  next.boardSize = Math.min(140, Math.max(60, next.boardSize));
  return next;
}

/* ------------------------------------------------------------------ */
/*  Piece sets                                                         */
/* ------------------------------------------------------------------ */

export const ALL_15_PIECE_SETS: PieceSetConfig[] = [
  { id: 'neo', name: 'Neo Tournament', tagline: 'Crisp modern FIDE vector', icon: '♟' },
  { id: 'classic', name: 'Stone & Gem', tagline: 'Carved limestone and basalt with gem inlays', icon: '💠' },
  { id: 'modern', name: 'Electric Geometric', tagline: 'Lightning yellow vs. charged cobalt', icon: '⚡' },
  { id: 'wood', name: 'Natural Hardwood', tagline: 'Warm oak and dark walnut grain', icon: '♜' },
  { id: 'minimal', name: 'Minimalist Line', tagline: 'Ultra-thin architectural wireframe', icon: '♛' },
  { id: 'cyber', name: 'Cyberpunk Circuit', tagline: 'Glowing circuit traces & neon edges', icon: '🔌' },
  { id: 'glass', name: 'Translucent Glass', tagline: 'Frosted crystal with refraction glow', icon: '💎' },
  { id: 'gold', name: '24K Imperial Gold', tagline: 'Polished royal gold and platinum', icon: '👑' },
  { id: 'retro', name: '8-Bit Pixel Arcade', tagline: 'Charming vintage pixel art', icon: '👾' },
  { id: 'gothic', name: 'Shadow Realm', tagline: 'Dark fantasy in obsidian and blood-red steel', icon: '⚔' },
  { id: 'metal', name: 'Brushed Gunmetal', tagline: 'Heavy industrial titanium alloy', icon: '🛡' },
  { id: 'ruby', name: 'Star Ruby Gem', tagline: 'Brilliant faceted scarlet crystal', icon: '♦' },
  { id: 'emerald_gem', name: 'Imperial Jade', tagline: 'Luminescent jade and royal pearl', icon: '🟢' },
  { id: 'monochrome_bold', name: 'Noir Venom', tagline: 'Acid-green and black-violet toxic silhouettes', icon: '☠' },
  { id: 'celestial', name: 'Celestial Nebula', tagline: 'Starlight cosmos and solar flares', icon: '✨' }
];
