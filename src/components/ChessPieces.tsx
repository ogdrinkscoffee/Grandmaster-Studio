import React, { useId } from 'react';
import { PieceType, PieceColor, PieceSetId, KingFinialStyle } from '../types/chess';
import { usePieceDisplay } from '../context/ThemeContext';
import {
  renderKingFinial,
  renderStyledPawn,
  renderStyledRook,
  renderStyledKnight,
  renderStyledBishop,
  renderStyledQueen,
  renderStyledKingBody,
  PieceRenderProps
} from './pieceShapes';

interface PieceStyleConfig {
  whiteFillGrad: [string, string, string];
  blackFillGrad: [string, string, string];
  whiteStroke: string;
  blackStroke: string;
  whiteInner: string;
  blackInner: string;
  whiteHighlight: string;
  blackHighlight: string;
  shadowColor: string;
  shadowBlur: number;
  shadowOpacity: number;
  strokeWidth?: number;
  isWireframe?: boolean;
  isPixel?: boolean;
}

const PIECE_STYLE_CONFIGS: Record<PieceSetId, PieceStyleConfig> = {
  neo: {
    whiteFillGrad: ['#ffffff', '#f4f6fa', '#dce3ee'],
    blackFillGrad: ['#475569', '#252f3f', '#111827'],
    whiteStroke: '#111827',
    blackStroke: '#090d16',
    whiteInner: '#1e293b',
    blackInner: '#e2e8f0',
    whiteHighlight: 'rgba(255, 255, 255, 0.95)',
    blackHighlight: 'rgba(255, 255, 255, 0.28)',
    shadowColor: '#020617',
    shadowBlur: 1.9,
    shadowOpacity: 0.48
  },
  // Stone & Gem: carved limestone with sapphire inlay vs. polished basalt with turquoise inlay
  classic: {
    whiteFillGrad: ['#fbf9f3', '#e2dccd', '#b9b09c'],
    blackFillGrad: ['#5b5753', '#2c2926', '#0f0d0c'],
    whiteStroke: '#3a342b',
    blackStroke: '#050404',
    whiteInner: '#1d4ed8',
    blackInner: '#2dd4bf',
    whiteHighlight: 'rgba(255, 255, 255, 0.92)',
    blackHighlight: 'rgba(94, 234, 212, 0.32)',
    shadowColor: '#1c1917',
    shadowBlur: 2.2,
    shadowOpacity: 0.55
  },
  // Electric: lightning-yellow vs. charged cobalt with live yellow outlines
  modern: {
    whiteFillGrad: ['#fffbe0', '#fde047', '#eab308'],
    blackFillGrad: ['#2b4fa8', '#14306e', '#0a1838'],
    whiteStroke: '#0a1c38',
    blackStroke: '#facc15',
    whiteInner: '#1d4ed8',
    blackInner: '#fde047',
    whiteHighlight: '#ffffff',
    blackHighlight: 'rgba(125, 211, 252, 0.5)',
    shadowColor: '#facc15',
    shadowBlur: 2.8,
    shadowOpacity: 0.55
  },
  wood: {
    whiteFillGrad: ['#fef3c7', '#fde68a', '#d9a45b'],
    blackFillGrad: ['#78350f', '#4e2107', '#2b1002'],
    whiteStroke: '#5c2808',
    blackStroke: '#1b0901',
    whiteInner: '#713f12',
    blackInner: '#fde68a',
    whiteHighlight: 'rgba(255, 251, 235, 0.8)',
    blackHighlight: 'rgba(251, 191, 36, 0.3)',
    shadowColor: '#1b0901',
    shadowBlur: 2.1,
    shadowOpacity: 0.5
  },
  minimal: {
    whiteFillGrad: ['#ffffff', '#eef2f6', '#dbe2eb'],
    blackFillGrad: ['#333642', '#1d1f28', '#0e1015'],
    whiteStroke: '#1e293b',
    blackStroke: '#cbd5e1',
    whiteInner: '#475569',
    blackInner: '#94a3b8',
    whiteHighlight: 'rgba(255,255,255,0.9)',
    blackHighlight: 'rgba(226,232,240,0.34)',
    shadowColor: '#020617',
    shadowBlur: 1.7,
    shadowOpacity: 0.42,
    strokeWidth: 1.35,
    isWireframe: true
  },
  cyber: {
    whiteFillGrad: ['#e0f2fe', '#38bdf8', '#0284c7'],
    blackFillGrad: ['#4c0519', '#9f1239', '#310413'],
    whiteStroke: '#082f49',
    blackStroke: '#1f020b',
    whiteInner: '#082f49',
    blackInner: '#fda4af',
    whiteHighlight: '#ffffff',
    blackHighlight: 'rgba(251, 113, 133, 0.55)',
    shadowColor: '#0ea5e9',
    shadowBlur: 2.8,
    shadowOpacity: 0.55
  },
  glass: {
    whiteFillGrad: ['rgba(255,255,255,0.96)', 'rgba(214,240,254,0.88)', 'rgba(155,218,252,0.80)'],
    blackFillGrad: ['rgba(71,85,105,0.94)', 'rgba(30,41,59,0.92)', 'rgba(12,19,36,0.96)'],
    whiteStroke: '#0284c7',
    blackStroke: '#7dd3fc',
    whiteInner: '#0369a1',
    blackInner: '#bae6fd',
    whiteHighlight: '#ffffff',
    blackHighlight: 'rgba(125, 211, 252, 0.65)',
    shadowColor: '#0284c7',
    shadowBlur: 2.6,
    shadowOpacity: 0.5
  },
  gold: {
    whiteFillGrad: ['#fefce8', '#fde047', '#ca8a04'],
    blackFillGrad: ['#475569', '#2b3648', '#151d29'],
    whiteStroke: '#713f12',
    blackStroke: '#090d16',
    whiteInner: '#854d0e',
    blackInner: '#facc15',
    whiteHighlight: '#ffffff',
    blackHighlight: 'rgba(250, 204, 21, 0.35)',
    shadowColor: '#422006',
    shadowBlur: 2.2,
    shadowOpacity: 0.52
  },
  retro: {
    whiteFillGrad: ['#fef9c3', '#facc15', '#eab308'],
    blackFillGrad: ['#6b21a8', '#4c1d95', '#2e1065'],
    whiteStroke: '#422006',
    blackStroke: '#1e0642',
    whiteInner: '#713f12',
    blackInner: '#e9d5ff',
    whiteHighlight: '#ffffff',
    blackHighlight: 'rgba(216, 180, 254, 0.4)',
    shadowColor: '#000000',
    shadowBlur: 1.5,
    shadowOpacity: 0.55,
    isPixel: true
  },
  gothic: {
    whiteFillGrad: ['#f8fafc', '#e2e8f0', '#94a3b8'],
    blackFillGrad: ['#27272a', '#18181b', '#09090b'],
    whiteStroke: '#334155',
    blackStroke: '#be123c',
    whiteInner: '#1e293b',
    blackInner: '#fda4af',
    whiteHighlight: '#ffffff',
    blackHighlight: 'rgba(244, 63, 94, 0.4)',
    shadowColor: '#881337',
    shadowBlur: 2.4,
    shadowOpacity: 0.5
  },
  metal: {
    whiteFillGrad: ['#f8fafc', '#cbd5e1', '#64748b'],
    blackFillGrad: ['#334155', '#1e293b', '#0b1120'],
    whiteStroke: '#334155',
    blackStroke: '#020617',
    whiteInner: '#1e293b',
    blackInner: '#cbd5e1',
    whiteHighlight: '#ffffff',
    blackHighlight: 'rgba(203, 213, 225, 0.35)',
    shadowColor: '#020617',
    shadowBlur: 2.1,
    shadowOpacity: 0.55
  },
  ruby: {
    whiteFillGrad: ['#fff1f2', '#fecdd3', '#fb7185'],
    blackFillGrad: ['#9f1239', '#6b0827', '#380212'],
    whiteStroke: '#9f1239',
    blackStroke: '#24010b',
    whiteInner: '#881337',
    blackInner: '#fecdd3',
    whiteHighlight: '#ffffff',
    blackHighlight: 'rgba(254, 205, 211, 0.45)',
    shadowColor: '#881337',
    shadowBlur: 2.4,
    shadowOpacity: 0.5
  },
  emerald_gem: {
    whiteFillGrad: ['#ecfdf5', '#a7f3d0', '#34d399'],
    blackFillGrad: ['#065f46', '#064e3b', '#022c22'],
    whiteStroke: '#065f46',
    blackStroke: '#011e16',
    whiteInner: '#064e3b',
    blackInner: '#a7f3d0',
    whiteHighlight: '#ffffff',
    blackHighlight: 'rgba(167, 243, 208, 0.4)',
    shadowColor: '#022c22',
    shadowBlur: 2.4,
    shadowOpacity: 0.5
  },
  // Venom: acid-green vs. black-violet with toxic green outlines and magenta venom details
  monochrome_bold: {
    whiteFillGrad: ['#f7fee7', '#bef264', '#65a30d'],
    blackFillGrad: ['#4c1d95', '#24093f', '#0b0614'],
    whiteStroke: '#14051f',
    blackStroke: '#a3e635',
    whiteInner: '#86198f',
    blackInner: '#d946ef',
    whiteHighlight: 'rgba(247, 254, 231, 0.95)',
    blackHighlight: 'rgba(163, 230, 53, 0.4)',
    shadowColor: '#4d7c0f',
    shadowBlur: 2.6,
    shadowOpacity: 0.55
  },
  celestial: {
    whiteFillGrad: ['#fffbeb', '#fde68a', '#f59e0b'],
    blackFillGrad: ['#4338ca', '#2e1065', '#17153b'],
    whiteStroke: '#92400e',
    blackStroke: '#0f0a2c',
    whiteInner: '#78350f',
    blackInner: '#fde68a',
    whiteHighlight: '#ffffff',
    blackHighlight: 'rgba(196, 181, 253, 0.5)',
    shadowColor: '#312e81',
    shadowBlur: 2.8,
    shadowOpacity: 0.55
  }
};

export const ChessPieceIcon: React.FC<{
  type: PieceType;
  color: PieceColor;
  set?: PieceSetId;
  kingFinial?: KingFinialStyle;
  className?: string;
  disableShadowFilter?: boolean;
}> = React.memo(({ type, color, set = 'neo', kingFinial, className = 'w-full h-full', disableShadowFilter = false }) => {
  const { kingFinial: contextKingFinial, batterySaver } = usePieceDisplay();
  const skipFilter = disableShadowFilter || batterySaver;
  const activeKingFinial: KingFinialStyle = kingFinial || contextKingFinial || 'crescent';
  const isWhite = color === 'w';
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filterId = `shadow_${safeId}`;
  const gradId = `grad_${safeId}`;
  const microTexId = `tex_${safeId}`;
  const glossId = `gloss_${safeId}`;
  const compositeFillId = `cfill_${safeId}`;

  const cfg = PIECE_STYLE_CONFIGS[set] || PIECE_STYLE_CONFIGS.neo;
  const gradStops = isWhite ? cfg.whiteFillGrad : cfg.blackFillGrad;
  const stroke = isWhite ? cfg.whiteStroke : cfg.blackStroke;
  const inner = isWhite ? cfg.whiteInner : cfg.blackInner;
  const sheen = isWhite ? cfg.whiteHighlight : cfg.blackHighlight;
  const sw = cfg.strokeWidth ?? 1.45;
  const isAngular = cfg.isPixel || set === 'cyber' || set === 'emerald_gem' || set === 'metal' || set === 'modern';
  const join: 'round' | 'miter' | 'bevel' = isAngular ? 'miter' : 'round';
  const cap: 'round' | 'square' | 'butt' = cfg.isPixel ? 'square' : 'round';

  const fillRef = `url(#${compositeFillId})`;
  const shapeProps: PieceRenderProps = {
    set,
    fillRef,
    stroke,
    inner,
    sheen,
    sw,
    join,
    cap,
    isWhite,
    kingFinial: activeKingFinial
  };

  const renderMicroTexture = () => {
    switch (set) {
      case 'minimal':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="5" height="5">
            <path d="M0 5L5 0M-1 1L1 -1M4 6L6 4" stroke={inner} strokeWidth="0.55" opacity="0.22" />
            <circle cx="2.5" cy="2.5" r="0.35" fill={inner} opacity="0.16" />
          </pattern>
        );
      case 'glass':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="9" height="9">
            <polygon points="0,0 9,0 4.5,4.5" fill={sheen} opacity="0.22" />
            <polygon points="0,9 4.5,4.5 9,9" fill={inner} opacity="0.12" />
            <path d="M0 9L9 0" stroke={sheen} strokeWidth="0.65" opacity="0.32" />
          </pattern>
        );
      case 'wood':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="14" height="8">
            <path d="M0 2c3.5-1.2 7 1.2 14 0M0 5.8c4 1.3 8-1.3 14 0" stroke={inner} strokeWidth="0.7" fill="none" opacity="0.28" />
            <path d="M2 4c3-.7 6 .7 10 0" stroke={sheen} strokeWidth="0.45" fill="none" opacity="0.18" />
          </pattern>
        );
      case 'modern':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="10" height="12">
            <path d="M6 0L3 5h3l-3 6" stroke={inner} strokeWidth="0.6" fill="none" opacity="0.3" strokeLinejoin="round" />
            <circle cx="8.5" cy="9.5" r="0.5" fill={sheen} opacity="0.45" />
          </pattern>
        );
      case 'metal':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="12" height="3.5">
            <line x1="0" y1="1.1" x2="12" y2="1.1" stroke={sheen} strokeWidth="0.55" opacity="0.28" />
            <line x1="0" y1="2.7" x2="12" y2="2.7" stroke={inner} strokeWidth="0.45" opacity="0.18" />
          </pattern>
        );
      case 'gold':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="6" height="6">
            <path d="M3 0L6 3L3 6L0 3Z" stroke={inner} strokeWidth="0.5" fill="none" opacity="0.24" />
            <circle cx="3" cy="3" r="0.45" fill={sheen} opacity="0.35" />
          </pattern>
        );
      case 'cyber':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="8" height="8">
            <path d="M0 4h3l2-2h3M4 0v2M4 6v2" stroke={inner} strokeWidth="0.55" fill="none" opacity="0.26" />
            <circle cx="5" cy="2" r="0.6" fill={sheen} opacity="0.35" />
          </pattern>
        );
      case 'retro':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="4" height="4">
            <rect x="0" y="0" width="2" height="2" fill={sheen} opacity="0.14" />
            <rect x="2" y="2" width="2" height="2" fill={inner} opacity="0.14" />
          </pattern>
        );
      case 'gothic':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="6" height="6">
            <circle cx="1.5" cy="1.5" r="0.6" fill={inner} opacity="0.22" />
            <circle cx="4.5" cy="4.5" r="0.55" fill={stroke} opacity="0.22" />
            <path d="M0 6L6 0" stroke={sheen} strokeWidth="0.4" opacity="0.14" />
          </pattern>
        );
      case 'ruby':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="8" height="8">
            <polygon points="4,0 8,4 4,8 0,4" fill={sheen} opacity="0.18" />
            <path d="M0 0L8 8M8 0L0 8" stroke={sheen} strokeWidth="0.45" opacity="0.22" />
          </pattern>
        );
      case 'emerald_gem':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="12" height="10">
            <path d="M0 3c3 2 6-2 12 0M0 8c4-2 7 2 12-1" stroke={sheen} strokeWidth="0.7" fill="none" opacity="0.25" />
            <circle cx="7" cy="4.5" r="0.7" fill={inner} opacity="0.18" />
          </pattern>
        );
      case 'celestial':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="11" height="11">
            <circle cx="2.5" cy="3" r="0.65" fill={sheen} opacity="0.45" />
            <circle cx="8" cy="7.5" r="0.45" fill={inner} opacity="0.4" />
            <circle cx="6.5" cy="2" r="0.35" fill={sheen} opacity="0.3" />
          </pattern>
        );
      case 'monochrome_bold':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="7" height="7">
            <circle cx="2" cy="2" r="1.1" fill="none" stroke={inner} strokeWidth="0.45" opacity="0.35" />
            <circle cx="5.2" cy="5" r="0.6" fill="none" stroke={sheen} strokeWidth="0.4" opacity="0.4" />
            <circle cx="1.7" cy="1.7" r="0.3" fill={sheen} opacity="0.5" />
          </pattern>
        );
      case 'classic':
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="7" height="7">
            <circle cx="1.4" cy="2" r="0.45" fill={stroke} opacity="0.18" />
            <circle cx="4.8" cy="1.2" r="0.3" fill={stroke} opacity="0.14" />
            <circle cx="3.2" cy="5.2" r="0.55" fill={stroke} opacity="0.12" />
            <path d="M5.5 4.5l0.9 0.9-0.9 0.9-0.9-0.9z" fill={inner} opacity="0.35" />
            <path d="M0 6.4L2.6 4.2" stroke={sheen} strokeWidth="0.35" opacity="0.25" />
          </pattern>
        );
      default: // 'neo' satin tournament resin
        return (
          <pattern id={microTexId} patternUnits="userSpaceOnUse" width="8" height="3">
            <line x1="0" y1="1.5" x2="8" y2="1.5" stroke={sheen} strokeWidth="0.45" opacity="0.22" />
          </pattern>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 45 45"
      className={`chess-piece-svg ${className} transition-transform duration-150 select-none`}
      style={{
        filter: skipFilter ? undefined : `url(#${filterId})`,
        overflow: 'visible'
      }}
    >
      <defs>
        {!skipFilter && (
          <filter id={filterId} x="-25%" y="-20%" width="150%" height="155%">
            <feDropShadow
              dx="0"
              dy="2.2"
              stdDeviation={cfg.shadowBlur}
              floodColor={cfg.shadowColor}
              floodOpacity={cfg.shadowOpacity}
            />
          </filter>
        )}

        <linearGradient id={gradId} x1="0.12" y1="0.06" x2="0.88" y2="0.94">
          <stop offset="0%" stopColor={gradStops[0]} />
          <stop offset="52%" stopColor={gradStops[1]} />
          <stop offset="100%" stopColor={gradStops[2]} />
        </linearGradient>

        <radialGradient id={glossId} cx="0.32" cy="0.22" r="0.65">
          <stop offset="0%" stopColor={sheen} stopOpacity={isWhite ? '0.32' : '0.26'} />
          <stop offset="60%" stopColor={sheen} stopOpacity="0.05" />
          <stop offset="100%" stopColor={sheen} stopOpacity="0" />
        </radialGradient>

        {renderMicroTexture()}

        <pattern id={compositeFillId} patternUnits="userSpaceOnUse" x="0" y="0" width="45" height="45">
          <rect x="0" y="0" width="45" height="45" fill={`url(#${gradId})`} />
          <rect x="0" y="0" width="45" height="45" fill={`url(#${microTexId})`} />
          <rect x="0" y="0" width="45" height="45" fill={`url(#${glossId})`} />
        </pattern>
      </defs>

      {/* Subtle contact shadow grounding every piece cleanly on any tile */}
      <ellipse
        cx="22.5"
        cy="41.4"
        rx="13.5"
        ry="1.7"
        fill="#000000"
        opacity="0.22"
      />

      {(() => {
        switch (type) {
          case 'p':
            return renderStyledPawn(shapeProps);

          case 'r':
            return renderStyledRook(shapeProps);

          case 'n':
            return renderStyledKnight(shapeProps);

          case 'b':
            return renderStyledBishop(shapeProps);

          case 'q':
            return renderStyledQueen(shapeProps);

          case 'k':
            return (
              <g strokeLinejoin={join} strokeLinecap={cap}>
                {renderKingFinial(shapeProps)}
                {renderStyledKingBody(shapeProps)}
              </g>
            );

          // HISTORIC CHATURANGA & FAIRY PIECES

          case 'e': // War Elephant / Gaja (Alfil)
            return (
              <g strokeLinejoin={join} strokeLinecap={cap}>
                {/* Royal Howdah Saddle Crest */}
                <path
                  d="M17.5 10.2l2.5-3.4h5l2.5 3.4z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw * 0.9}
                />
                {/* Domed Head, Broad Back Ear & Raised Curled Trunk */}
                <path
                  d="M23.5 10.2
                     C17.2 10.2 13.5 14.5 13.5 20.5
                     L9.5 23.2
                     C7.8 24.4 7.8 27.2 9.6 28.4
                     C11.2 29.4 13.2 28.2 13.2 26.6
                     C13.2 25.5 12.1 25.2 11.4 25.6
                     C11.4 24.5 12.8 23.8 14.6 23.8
                     L15.4 34.5
                     H31.8
                     L32.8 25.5
                     C35.2 24.2 36.2 20.8 35.6 17.2
                     C34.8 12.8 29.8 10.2 23.5 10.2 Z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                {/* Sweeping Ivory Tusk */}
                <path
                  d="M14.2 25.4c-2.6.8-5.2-.2-6.5-2.6 2.2.8 4.4.8 6.8-.5z"
                  fill={isWhite ? '#ffffff' : '#fde68a'}
                  stroke={stroke}
                  strokeWidth={sw * 0.75}
                />
                {/* Broad Carved Ear Contour */}
                <path
                  d="M25.8 14.5c4.2.5 6.4 3.4 5.8 7.6-.4 2.4-2.2 3.8-4.5 3.8"
                  stroke={inner}
                  strokeWidth="1.25"
                  fill="none"
                />
                {/* Eye & Plinth */}
                <circle cx="17.8" cy="17.2" r="1.4" fill={inner} />
                <circle cx="17.4" cy="16.8" r="0.45" fill={sheen} />
                <rect
                  x="10.5"
                  y="36.8"
                  width="25"
                  height="3.6"
                  rx={cfg.isPixel ? '0' : '1.4'}
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                <path d="M12.5 34.5h21.5l1 2.3H11.5z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
              </g>
            );

          case 'f': // Counselor / Mantri (Ferz)
            return (
              <g strokeLinejoin={join} strokeLinecap={cap}>
                {/* Vizier Finial Diamond */}
                <path
                  d="M22.5 5.2l2.4 3.4-2.4 2.4-2.4-2.4z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw * 0.9}
                />
                {/* Tiered Diadem Crown */}
                <path
                  d="M14.2 19.6c-1.4-4.2 2-9.2 8.3-9.2s9.7 5 8.3 9.2l-2.6 5.2H16.8z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                {/* Mantle Collar */}
                <ellipse cx="22.5" cy="25.5" rx="7.6" ry="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
                {/* Flowing Robe */}
                <path
                  d="M16 27.4h13l2.6 7.2H13.4z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                {/* Stepped Plinth */}
                <rect
                  x="10"
                  y="36.8"
                  width="25"
                  height="3.6"
                  rx={cfg.isPixel ? '0' : '1.4'}
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                <path d="M11.6 34.6h21.8l1.6 2.2H10z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
                {/* Inner Crescent Emblem */}
                <path d="M19 17.5c2-1.8 5-1.8 7 0" stroke={inner} strokeWidth="1.35" fill="none" />
                <circle cx="22.5" cy="14.6" r="1.4" fill={inner} />
                <line x1="12.5" y1="38.5" x2="32.5" y2="38.5" stroke={inner} strokeWidth="0.9" opacity="0.45" />
              </g>
            );

          case 'c': // Chancellor (Rook + Knight Compound)
            return (
              <g strokeLinejoin={join} strokeLinecap={cap}>
                {/* Lower Rook Castle Plinth & Turret Wall */}
                <path
                  d="M13 34.4l2.2-11.2h14.6l2.2 11.2z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                {/* Crenellated Turret Belt */}
                <path
                  d="M12.2 19.6h3.6v2h2.8v-2h7.8v2h2.8v-2h3.6v3.8H12.2z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw * 0.95}
                />
                {/* Knight Stallion Crest Emerging Above Turret */}
                <path
                  d="M21 7.6L19.5 4.4l3.5 2.4 2.4-1.8.8 3.2c4.4 1.6 6.2 6.2 5.2 11.4H17.2c.4-2.6 1.8-4.4 3.8-5.6-1.8.5-3.4.4-5-.2l-2.4.7c-1.4 0-2-1.2-1.4-2.4l3-4.6c1-2.2 3.2-3.4 5.8-3.6z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw * 0.95}
                />
                <circle cx="17.8" cy="11.6" r="1.15" fill={inner} />
                <path d="M26.5 10.5c1.8 1.5 2.6 3.8 2.4 6.5" stroke={inner} strokeWidth="1.1" fill="none" />
                <line x1="22.5" y1="25.5" x2="22.5" y2="31" stroke={inner} strokeWidth="1.35" opacity="0.8" />
                {/* Base */}
                <path d="M11 34.4h23l1.4 2.5H9.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
                <rect x="9" y="36.9" width="27" height="3.5" rx={cfg.isPixel ? '0' : '1.3'} fill={fillRef} stroke={stroke} strokeWidth={sw} />
              </g>
            );

          case 'a': // Archbishop (Bishop + Knight Compound)
            return (
              <g strokeLinejoin={join} strokeLinecap={cap}>
                {/* Mitre Top Finial */}
                <circle cx="20.5" cy="6.2" r="1.8" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
                {/* Left Bishop Mitre fused with Right Sweeping Stallion Mane */}
                <path
                  d="M20.5 8.4
                     C14.8 12.2 13 18.8 15.6 25.4
                     H29.4
                     C32.2 20.4 32.8 12.6 26.8 8.2
                     L25.2 5.4
                     L23.1 8.4 Z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                {/* Mitre Slit on Left + Mane Notches on Right */}
                <path d="M18.6 15.6l4.2 4.2" stroke={inner} strokeWidth="1.65" />
                <path d="M27.2 12.4c2 2.4 2.4 5.8 1.4 9.5" stroke={inner} strokeWidth="1.2" fill="none" />
                {/* Collar & Stem */}
                <ellipse cx="22.5" cy="26.6" rx="7.6" ry="1.9" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
                <path d="M16.5 28.5h12l2.6 6H13.9z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
                <path d="M11.2 34.5h22.6l1.4 2.4H9.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
                <rect x="9" y="36.9" width="27" height="3.5" rx={cfg.isPixel ? '0' : '1.3'} fill={fillRef} stroke={stroke} strokeWidth={sw} />
              </g>
            );

          case 'z': // Amazon (Queen + Knight Supreme Compound)
            return (
              <g strokeLinejoin={join} strokeLinecap={cap}>
                {/* Star-Spiked Winged Coronet */}
                <path
                  d="M8.5 13.5l5 12.8h18l5-12.8-6.4 5.2-2.6-9.5-5 6.8-5-6.8-2.6 9.5z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                {/* Coronet Pearls */}
                <circle cx="8.2" cy="12.2" r="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
                <circle cx="17.2" cy="8.2" r="1.7" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
                <circle cx="22.5" cy="14.2" r="1.5" fill={inner} />
                <circle cx="27.8" cy="8.2" r="1.7" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
                <circle cx="36.8" cy="12.2" r="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
                {/* Winged Shoulder Mantle */}
                <path d="M14 26.3h17l2.2 8.2H11.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
                <path d="M22.5 28.2l2.4 2.6-2.4 2.6-2.4-2.6z" fill={inner} opacity="0.85" />
                <path d="M10.2 34.5h24.6l1.4 2.5H8.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
                <rect x="8.5" y="37" width="28" height="3.4" rx={cfg.isPixel ? '0' : '1.4'} fill={fillRef} stroke={stroke} strokeWidth={sw} />
              </g>
            );

          case 'o': // Cannon (Pao) Siege Artillery
            return (
              <g strokeLinejoin={join} strokeLinecap={cap}>
                {/* Heavy Carriage Trail */}
                <path
                  d="M9.5 34.5l10-3.2 13 3.2v2.4H9.5z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                {/* Angled Cannon Barrel */}
                <path
                  d="M12.5 23.2l19.2-10.4 3.4 6.2-19.2 10.4a3.6 3.6 0 0 1-3.4-6.2z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                {/* Muzzle Ring */}
                <ellipse
                  cx="33.4"
                  cy="15.9"
                  rx="2.1"
                  ry="4.2"
                  transform="rotate(-28 33.4 15.9)"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw * 0.9}
                />
                {/* Carriage Spoked Wheels */}
                <circle cx="15.5" cy="34.5" r="5.3" fill={fillRef} stroke={stroke} strokeWidth={sw} />
                <circle cx="15.5" cy="34.5" r="2.0" fill={inner} />
                <circle cx="29.5" cy="34.5" r="5.3" fill={fillRef} stroke={stroke} strokeWidth={sw} />
                <circle cx="29.5" cy="34.5" r="2.0" fill={inner} />
                {/* Barrel Sheen */}
                <line x1="15" y1="23.2" x2="29.8" y2="15.2" stroke={sheen} strokeWidth="1.2" />
              </g>
            );

          case 'm': // Armored Guard / Mann
            return (
              <g strokeLinejoin={join} strokeLinecap={cap}>
                {/* Plumed Crest Fin */}
                <path
                  d="M20.5 11.2c0-3.4 1-5.6 2-5.6s2 2.2 2 5.6z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw * 0.9}
                />
                {/* Knight Close-Helm */}
                <path
                  d="M14.5 22.8c0-6.8 3.2-11.6 8-11.6s8 4.8 8 11.6l-1.8 4H16.3z"
                  fill={fillRef}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                {/* T-Visor Slit & Breathing Vent */}
                <path d="M17.2 18.6h10.6M22.5 18.6v5.2" stroke={inner} strokeWidth="1.75" />
                {/* Armored Breastplate & Pauldrons */}
                <path d="M14.2 26.8h16.6l2.2 7.7H12z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
                <path d="M10.5 34.5h24l1.5 2.5H9z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
                <rect x="9" y="37" width="27" height="3.4" rx={cfg.isPixel ? '0' : '1.3'} fill={fillRef} stroke={stroke} strokeWidth={sw} />
                <path d="M17.5 15.6c1.2-1.8 2.8-2.6 4.2-2.6" stroke={sheen} strokeWidth="1.1" fill="none" />
              </g>
            );

          case 'd': // Stylized Rubber Duck Blocker
            return (
              <g strokeLinejoin={join} strokeLinecap={cap}>
                <path
                  d="M12.5 26.5c0 6.5 4.8 11.2 11.8 11.2 7.8 0 13-4.2 13-9.8 0-3.8-2.6-6.2-6-6.2h-2.5c.8-2.6.2-6.2-2.2-8.2-2.5-2-6.4-1.5-8.2 1.2-1.2 1.8-1.2 4.2-.2 6.2-3.2 1-5.7 3.2-5.7 5.6z"
                  fill="#facc15"
                  stroke="#854d0e"
                  strokeWidth={sw}
                />
                <path
                  d="M15.6 19.6c-4-.2-7.2 1.1-7.2 2.8s3.2 2.4 7.4 1.3z"
                  fill="#ea580c"
                  stroke="#7c2d12"
                  strokeWidth={sw * 0.85}
                />
                <path d="M23.5 27c3.6 0 7.2 2 7.2 5.2" stroke="#ca8a04" strokeWidth="1.5" fill="none" />
                <circle cx="18.2" cy="16.4" r="1.35" fill="#0f172a" />
                <circle cx="17.8" cy="15.9" r="0.45" fill="#ffffff" />
                <path d="M20.5 12.6a4 4 0 0 1 4.2 1.2" stroke="rgba(255,255,255,0.8)" strokeWidth="1.15" fill="none" />
              </g>
            );

          default:
            return null;
        }
      })()}
    </svg>
  );
});
