import React from 'react';
import { PieceSetId, KingFinialStyle } from '../types/chess';

export interface PieceRenderProps {
  set: PieceSetId;
  fillRef: string;
  stroke: string;
  inner: string;
  sheen: string;
  sw: number;
  join: 'round' | 'miter' | 'bevel';
  cap: 'round' | 'square' | 'butt';
  isWhite: boolean;
  kingFinial: KingFinialStyle;
}

/**
 * Crisp geometric King Finial (zero crosses).
 * `crescent` lies perfectly horizontal on its back (90° counterclockwise), horns pointing straight up.
 * `crescent_star` cradles the 5-point star symmetrically inside the upturned crescent.
 */
export function renderKingFinial(props: PieceRenderProps): React.ReactNode {
  const { set, fillRef, stroke, inner, sheen, sw, kingFinial } = props;

  if (set === 'retro') {
    if (kingFinial === 'star') {
      return (
        <g>
          {/* 13×12 pixel five-point star: top point, wide arms, two splayed legs */}
          <path
            d="M22 2H23V4H24V6H29V7H28V8H27V9H26V11H27V13H28V14H26V13H24V12H23V11H22V12H21V13H19V14H17V13H18V11H19V9H18V8H17V7H16V6H21V4H22Z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw * 0.85}
          />
        </g>
      );
    }
    if (kingFinial === 'crescent_star') {
      return (
        <g>
          {/* Pixel horizontal boat crescent cradling pixel star */}
          <path
            d="M15 6h2v3h2v2h7V9h2V6h2v5h-2v2H17v-2h-2z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw * 0.82}
          />
          {/* 7×7 pixel five-point star sitting in the crescent's cup */}
          <path
            d="M22 2H23V4H26V5H25V6H24V7H25V9H24V8H23V7H22V8H21V9H20V7H21V6H20V5H19V4H22Z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw * 0.75}
          />
        </g>
      );
    }
    // Pixel Crescent lying perfectly horizontal on its back
    return (
      <g>
        <path
          d="M15 5h3v3h2v2h5V8h2V5h3v5h-2v2h-2v1h-7v-1h-2v-2h-2z"
          fill={fillRef}
          stroke={stroke}
          strokeWidth={sw * 0.85}
        />
      </g>
    );
  }

  if (kingFinial === 'star') {
    return (
      <g>
        <path
          d="M22.50 1.80L23.76 5.36L27.54 5.46L24.54 7.76L25.62 11.39L22.50 9.25L19.38 11.39L20.46 7.76L17.46 5.46L21.24 5.36Z"
          fill={fillRef}
          stroke={stroke}
          strokeWidth={sw * 0.9}
        />
        <circle cx="22.5" cy="7.1" r="1.15" fill={inner} opacity="0.85" />
      </g>
    );
  }

  if (kingFinial === 'crescent_star') {
    return (
      <g>
        {/* Horizontal upturned crescent lying on its back cradling the 5-point star */}
        <path
          d="M17.75 4.43A5.5 5.5 0 1 0 27.25 4.43A4.85 4.85 0 1 1 17.75 4.43Z"
          fill={fillRef}
          stroke={stroke}
          strokeWidth={sw * 0.88}
        />
        <path
          d="M19.0 10.6A4.5 4.5 0 0 0 26.0 10.6"
          stroke={sheen}
          strokeWidth="0.95"
          fill="none"
        />
        <path
          d="M22.50 2.30L23.31 4.48L25.64 4.58L23.81 6.03L24.44 8.27L22.50 6.98L20.56 8.27L21.19 6.03L19.36 4.58L21.69 4.48Z"
          fill={fillRef}
          stroke={stroke}
          strokeWidth={sw * 0.8}
        />
      </g>
    );
  }

  // Horizontal Crescent lying perfectly on its back (90° counterclockwise, horns pointing straight UP)
  return (
    <g>
      <path
        d="M17.97 4.17A5.4 5.4 0 1 0 27.03 4.17A4.65 4.65 0 1 1 17.97 4.17Z"
        fill={fillRef}
        stroke={stroke}
        strokeWidth={sw * 0.9}
      />
      <path
        d="M18.6 10.1A4.4 4.4 0 0 0 26.4 10.1"
        stroke={sheen}
        strokeWidth="1.0"
        fill="none"
      />
    </g>
  );
}

/**
 * Distinct per-style Pawn Renderer across ALL 15 piece styles.
 * Proportions: compact ~28px height (y=12..40.4), base ~23px wide (x=11..34).
 */
export function renderStyledPawn(p: PieceRenderProps): React.ReactNode {
  const { set, fillRef, stroke, inner, sheen, sw } = p;

  switch (set) {
    case 'retro': // 1. 8-Bit Pixel Arcade
      return (
        <g>
          <path d="M19 12h7v2h2v4h-2v2h-7v-2h-2v-4h2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="16" y="20" width="13" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M18 22.8h9v4.2h2v4h2v3.6H14V31h2v-4h2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="11" y="34.6" width="23" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10" y="37.4" width="25" height="3.1" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="20" y="13.5" width="2" height="2" fill={sheen} />
        </g>
      );

    case 'classic': // 2. Staunton Classic
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="14.2" r="4.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="22.5" cy="19.5" rx="6.2" ry="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <ellipse cx="22.5" cy="21.4" rx="5.0" ry="1.2" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M18.6 22.5c.2 4.3-2.5 8.5-5.8 12.1h19.4c-3.3-3.6-6.0-7.8-5.8-12.1z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M11.6 34.6h21.8c1.1 0 1.6.9 1.6 2.1H10c0-1.2.5-2.1 1.6-2.1z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.6" y="36.7" width="25.8" height="3.7" rx="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M19.8 11.9a3 3 0 0 1 3.2-.3" stroke={sheen} strokeWidth="1.1" fill="none" />
        </g>
      );

    case 'modern': // 3. Electric Geometric
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="14.2" r="4.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M19.5 20.6h6l6.2 16.2H13.3z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="11.5" y="37.0" width="22" height="3.4" rx="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="20.9" cy="12.5" r="1.2" fill={sheen} opacity="0.85" />
        </g>
      );

    case 'wood': // 4. Natural Hardwood
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="14.6" r="4.7" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="15.5" y="19.3" width="14" height="3.0" rx="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M17.8 22.3c-1.8 3.0-4.2 7.0-4.8 12.1h19c-.6-5.1-3.0-9.1-4.8-12.1z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="22.5" cy="34.8" rx="12.0" ry="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10.2" y="36.7" width="24.6" height="3.7" rx="1.8" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M18.8 26.6c2.2.9 5.2.9 7.4 0M17.6 30.8c3.0 1.0 6.8 1.0 9.8 0" stroke={inner} strokeWidth="1.0" fill="none" opacity="0.6" />
        </g>
      );

    case 'minimal': // 5. Minimalist Line (Architectural drafting ceramic with collar & fluting)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="14.8" r="4.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M20.3 13.0a2.8 2.8 0 0 1 2.6-.7" stroke={sheen} strokeWidth="1.0" fill="none" />
          <rect x="17.8" y="19.3" width="9.4" height="2.0" rx="1.0" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M19.2 21.4c.7 4.4-2.2 10.4-4.8 13.6h16.2c-2.6-3.2-5.5-9.2-4.8-13.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="22.5" y1="23.2" x2="22.5" y2="33.4" stroke={inner} strokeWidth="0.95" opacity="0.5" />
          <rect x="12.2" y="35.2" width="20.6" height="4.6" rx="2.1" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="14.6" y1="37.5" x2="30.4" y2="37.5" stroke={inner} strokeWidth="0.9" opacity="0.55" />
        </g>
      );

    case 'cyber': // 6. Cyberpunk Circuit
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M22.5 10.2l4.2 2.8v4.6l-4.2 2.8-4.2-2.8V13z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M17.8 20.8h9.4l1.6 2.2H16.2z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M18.4 23h8.2l4.2 11.4H14.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M12.0 34.4h21l1.4 3v3H10.6v-3z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 13.4l1.8 1.6-1.8 1.6-1.8-1.6z" fill={inner} />
          <line x1="18.2" y1="28.8" x2="26.8" y2="28.8" stroke={inner} strokeWidth="1.15" opacity="0.85" />
        </g>
      );

    case 'glass': // 7. Translucent Glass (Faceted cut-crystal pawn with prism ribs)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M22.5 9.8l4.0 5.0-4.0 5.0-4.0-5.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <polygon points="22.5,10.8 25.4,14.8 22.5,18.8" fill={sheen} opacity="0.24" />
          <ellipse cx="22.5" cy="21.0" rx="5.0" ry="1.35" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M19.2 22.4h6.6l4.2 12.8H15.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <polygon points="22.5,22.8 25.5,22.8 29.0,34.8 22.5,34.8" fill={sheen} opacity="0.16" />
          <path d="M12.0 35.2h21.0l1.3 4.9H10.7z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 10.6v24.0M16.4 37.6h12.2" stroke={sheen} strokeWidth="1.05" opacity="0.78" />
        </g>
      );

    case 'gold': // 8. 24K Imperial Gold
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="13.8" r="4.3" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M16.8 19.2h11.4l-1.3 2.5H18.1z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M18.4 21.7h8.2c1.1 4.4 3.2 8.4 6.0 12.1H12.4c2.8-3.7 4.9-7.7 6.0-12.1z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M11.2 33.8h22.6l1.3 2.9H9.9z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.6" y="36.7" width="25.8" height="3.7" rx="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 25.0l1.8 2.4-1.8 2.4-1.8-2.4z" fill={inner} opacity="0.9" />
        </g>
      );

    case 'gothic': // 9. Shadow Realm
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M22.5 9.6c3.0 3.2 4.0 6.4 2.8 9.8h-5.6c-1.2-3.4-.2-6.6 2.8-9.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M16.2 21.0l6.3-1.8 6.3 1.8-1.8 1.6h-9z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M18.8 22.6h7.4l4.2 12.4H14.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M12.0 35.0h21l1.2 5.2H10.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M20.6 33.6c0-3.8.9-6.6 1.9-8.0 1 1.4 1.9 4.2 1.9 8.0" stroke={inner} strokeWidth="1.2" fill="none" />
        </g>
      );

    case 'metal': // 10. Brushed Gunmetal
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M18.8 11.8h7.4l1.2 4.2-2.0 3.0h-5.8l-2.0-3.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="16" y="19.4" width="13" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M17.8 22.2h9.4l4.2 12.2H13.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10.8" y="34.4" width="23.4" height="5.8" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="14.2" cy="37.3" r="0.85" fill={inner} />
          <circle cx="22.5" cy="37.3" r="0.85" fill={inner} />
          <circle cx="30.8" cy="37.3" r="0.85" fill={inner} />
        </g>
      );

    case 'ruby': // 11. Star Ruby Gem
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M22.5 9.8c3.2 1.5 4.8 4.4 3.8 7.4l-3.8 2.9-3.8-2.9c-1.0-3.0.6-5.9 3.8-7.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M16.4 21.4l6.1-1.5 6.1 1.5-6.1 1.5z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M18.6 22.8h7.8c.4 4.5 2.2 8.4 4.6 12.0H14c2.4-3.6 4.2-7.5 4.6-12.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M11.8 34.8h21.4l1.3 5.4H10.5z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 24.8l1.9 3.8-1.9 3.8-1.9-3.8z" fill={inner} opacity="0.78" />
        </g>
      );

    case 'emerald_gem': // 12. Imperial Jade
      return (
        <g strokeLinejoin="miter" strokeLinecap="butt">
          <path d="M20.2 11h4.6l2.5 2.5v3.9L24.8 20h-4.6l-2.5-2.6v-3.9z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="16.8" y="20.4" width="11.4" height="2.2" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M18.2 22.6h8.6l3.6 12.0H14.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M12.5 34.6h20l1.8 2.0v3.6H10.7v-3.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="20.6" y="13.5" width="3.8" height="3.8" stroke={inner} strokeWidth="1.0" fill="none" />
        </g>
      );

    case 'monochrome_bold': // 13. Bold Noir Silhouette
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="14.4" r="4.9" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <path d="M17.8 20.8h9.4l5.0 13.8H12.8z" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <rect x="10.2" y="34.8" width="24.6" height="5.4" rx="1.2" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <line x1="17.8" y1="23.2" x2="27.2" y2="23.2" stroke={inner} strokeWidth="1.7" />
          <line x1="13.2" y1="37.5" x2="31.8" y2="37.5" stroke={inner} strokeWidth="1.45" />
        </g>
      );

    case 'celestial': // 14. Celestial Nebula
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="14.0" r="4.1" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="22.5" cy="19.6" rx="7.6" ry="1.7" transform="rotate(-12 22.5 19.6)" stroke={inner} strokeWidth="1.25" fill="none" opacity="0.85" />
          <path d="M18.8 21.8c.2 4.4-2.2 8.8-5.2 12.8h17.8c-3.0-4.0-5.4-8.4-5.2-12.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M12.0 34.6h21l1.2 5.6H10.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="22.5" cy="14.0" r="1.2" fill={inner} opacity="0.8" />
        </g>
      );

    default: // 15. neo
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="15.0" r="4.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M17.2 20.6c0-1.0 2.0-1.5 5.3-1.5s5.3.5 5.3 1.5c0 .9-2.0 1.4-5.3 1.4s-5.3-.5-5.3-1.4z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M19.0 22.0c.2 4.3-2.2 8.8-5.2 12.8h17.4c-3.0-4.0-5.4-8.5-5.2-12.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M12.6 34.8h19.8c1.1 0 1.6.9 1.6 2H11c0-1.1.5-2 1.6-2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10.4" y="36.8" width="24.2" height="3.5" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M20.2 12.7a3 3 0 0 1 3.0-.3" stroke={sheen} strokeWidth="1.1" fill="none" />
        </g>
      );
  }
}

/**
 * Distinct per-style Rook Renderer across ALL 15 piece styles.
 * Proportions: sturdy medium height ~30.5px (y=9.8..40.4), base ~25px wide (x=10..35).
 */
export function renderStyledRook(p: PieceRenderProps): React.ReactNode {
  const { set, fillRef, stroke, inner, sheen, sw } = p;

  switch (set) {
    case 'retro': // 1. 8-Bit Pixel Arcade
      return (
        <g>
          <path d="M12 9.5h4.5v3.5h4V9.5h4v3.5h4V9.5H33v7.5H12z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="14" y="17" width="17" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="15.5" y="19.8" width="14" height="14.2" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="11.5" y="34" width="22" height="3" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10" y="37" width="25" height="3.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="21" y="22.5" width="3" height="7" fill={inner} opacity="0.7" />
        </g>
      );

    case 'classic': // 2. Staunton Classic
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M11.2 9.6h4.2v3.2h4.2V9.6h5.8v3.2h4.2V9.6h4.2v7.0H11.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M12.4 16.6h20.2l-2.4 3.4H14.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M14.8 20.0h15.4l2.0 13.8H12.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.8 33.8h23.4l1.5 3.0H9.3z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.0" y="36.8" width="27.0" height="3.6" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="15.2" y1="25" x2="29.8" y2="25" stroke={inner} strokeWidth="1.1" opacity="0.55" />
          <line x1="14.2" y1="29.5" x2="30.8" y2="29.5" stroke={inner} strokeWidth="1.1" opacity="0.55" />
        </g>
      );

    case 'modern': // 3. Electric Geometric
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M13 9.8h4.8v4.0h9.4V9.8H32V18H13z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="14.5" y="19.4" width="16" height="16.2" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="11" y="36.8" width="23" height="3.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="16.8" y1="21.5" x2="16.8" y2="33" stroke={sheen} strokeWidth="1.2" />
        </g>
      );

    case 'wood': // 4. Natural Hardwood
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M12.2 9.8h4v3.4h3.9V9.8h4.8v3.4h3.9V9.8h4v6.6H12.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="12.6" y="16.4" width="19.8" height="3.2" rx="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M15.4 19.6h14.2c1.0 4.4 1.6 9.0 2.2 14.2H13.2c.6-5.2 1.2-9.8 2.2-14.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="22.5" cy="34.6" rx="12.8" ry="2.1" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.6" y="36.5" width="25.8" height="3.9" rx="1.9" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M17.0 24.6c3.4.9 7.6.9 11.0 0M16.2 29.8c4.0 1.0 8.6 1.0 12.6 0" stroke={inner} strokeWidth="1.0" fill="none" opacity="0.55" />
        </g>
      );

    case 'minimal': // 5. Minimalist Line (Drafted ceramic turret with twin architectural flutes)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M13.2 10.4h3.8v2.8h3.6v-2.8h3.8v2.8h3.6v-2.8h3.8v6.2H13.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="14.2" y="16.8" width="16.6" height="2.2" rx="0.9" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M15.4 19.2h14.2l1.6 15.8H13.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M19.2 21.8v11.0M25.8 21.8v11.0" stroke={inner} strokeWidth="0.95" opacity="0.5" />
          <rect x="11.4" y="35.2" width="22.2" height="4.7" rx="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="14.2" y1="37.6" x2="30.8" y2="37.6" stroke={inner} strokeWidth="0.9" opacity="0.55" />
        </g>
      );

    case 'cyber': // 6. Cyberpunk Circuit
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M11.2 12l3.2-3.2h4.2v2.8h7.8V8.8h4.2L33.8 12v5.6H11.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M13.6 17.6h17.8l1.8 16.4H11.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M9.6 34h25.8l1.2 6.2H8.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M17.8 22.6h9.4l-1 3.8h-7.4z" fill={inner} opacity="0.88" />
          <line x1="14.4" y1="30.5" x2="30.6" y2="30.5" stroke={inner} strokeWidth="1.2" />
        </g>
      );

    case 'glass': // 7. Translucent Glass (Prismatic cut crystal rook)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M13.2 12.2l2.4-4.2 2.7 4.2h4.2l2.4-4.2 2.4 4.2h4.2l-2.4 5.4H15.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M16.2 17.6h12.6l2.2 17.6H14z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <polygon points="22.5,18.0 28.4,18.0 30.2,34.8 22.5,34.8" fill={sheen} opacity="0.18" />
          <path d="M11.2 35.2h22.6l1.4 5.0H9.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 13v21.5M18.4 18.4l-1.4 16.0M26.6 18.4l1.4 16.0M14.2 37.7h16.6" stroke={sheen} strokeWidth="1.0" opacity="0.72" />
        </g>
      );

    case 'gold': // 8. 24K Imperial Gold
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M10.6 9.4h4.2v3.4h4.0V9.4h7.4v3.4h4.0V9.4h4.2l-1.6 7.4H12.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M13.8 16.8h17.4l-1.4 2.6H15.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M15.4 19.4h14.2c.4 4.8 1.6 9.6 3.2 14.2H12.2c1.6-4.6 2.8-9.4 3.2-14.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.6 33.6h23.8l1.5 3.0H9.1z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="8.8" y="36.6" width="27.4" height="3.8" rx="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 22.8l2.4 3.4-2.4 3.4-2.4-3.4z" fill={inner} opacity="0.85" />
        </g>
      );

    case 'gothic': // 9. Shadow Realm
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M11.8 11.8l2.3-4.2 2.3 4.2h3.6l2.5-4.2 2.5 4.2h3.6l2.3-4.2 2.3 4.2v5.2H11.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M12.8 17h19.4l-1.8 2.8H14.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M14.8 19.8h15.4l1.8 14.4H13z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.5 34.2h24l1 6.0H9.5z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M20.4 33v-7.2c0-2 2.1-3.4 2.1-3.4s2.1 1.4 2.1 3.4V33" stroke={inner} strokeWidth="1.4" fill="none" />
        </g>
      );

    case 'metal': // 10. Brushed Gunmetal
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M10.5 9.8h4.6v3.2h4.2V9.8h6.4V13h4.2V9.8h4.6V17h-24z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="12.2" y="17" width="20.6" height="3.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M14.4 20h16.2l2.0 14H12.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10" y="34" width="25" height="6.2" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="14.5" cy="18.5" r="0.85" fill={inner} />
          <circle cx="30.5" cy="18.5" r="0.85" fill={inner} />
          <circle cx="13.5" cy="37.1" r="0.9" fill={inner} />
          <circle cx="22.5" cy="37.1" r="0.9" fill={inner} />
          <circle cx="31.5" cy="37.1" r="0.9" fill={inner} />
        </g>
      );

    case 'ruby': // 11. Star Ruby Gem
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M12.5 11.2a2.2 2.2 0 0 1 4.4 0v1.8h3.4v-1.8a2.2 2.2 0 0 1 4.4 0v1.8h3.4v-1.8a2.2 2.2 0 0 1 4.4 0v6.0h-20z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M14.6 17.2h15.8l2.6 17.0H12z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.5 34.2h24l1.4 6.0H9.1z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 20.6l2.8 4.8-2.8 4.8-2.8-4.8z" fill={inner} opacity="0.8" />
        </g>
      );

    case 'emerald_gem': // 12. Imperial Jade
      return (
        <g strokeLinejoin="miter" strokeLinecap="butt">
          <path d="M12.2 9.2h4v3.4h3.8V9.2h5v3.4h3.8V9.2h4l.9 6.0-3.2 2.8H14.5l-3.2-2.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M15.4 18h14.2l1.8 16.5H13.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M11.2 34.5h22.6l1.8 2.2v3.6H9.4v-3.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="20.2" y="22.6" width="4.6" height="6.8" stroke={inner} strokeWidth="1.15" fill="none" />
          <line x1="16.8" y1="19.6" x2="15.4" y2="33" stroke={sheen} strokeWidth="1.15" />
        </g>
      );

    case 'monochrome_bold': // 13. Bold Noir Silhouette (Woodcut textured keep with masonry joints)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M11.2 9.2h5.4v3.8h3.8V9.2h4.2v3.8h3.8V9.2h5.4v8.0H11.2z" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <path d="M14.0 19.2h17l2.0 15.4H12.0z" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <path d="M16.5 24.5h12.0M15.4 29.8h14.2M22.5 21.0v3.5" stroke={inner} strokeWidth="1.35" opacity="0.7" />
          <rect x="9.6" y="34.8" width="25.8" height="5.4" rx="1.2" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <line x1="12.8" y1="37.5" x2="32.2" y2="37.5" stroke={inner} strokeWidth="1.5" />
        </g>
      );

    case 'celestial': // 14. Celestial Nebula
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M13 11.8h3.8v2.6h3.8v-3.8h3.8v3.8h3.8v-2.6h3.8v5.8H13z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="22.5" cy="18.3" rx="10.6" ry="1.7" stroke={inner} strokeWidth="1.2" fill="none" opacity="0.8" />
          <path d="M15.2 19.8h14.6l2.0 14.6H13.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.8 34.4h23.4l1.4 5.8H9.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="22.5" cy="26.5" r="2.1" fill={inner} opacity="0.85" />
        </g>
      );

    default: // 15. neo
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M12.2 10.0h4.0v3.0h3.8v-3.0h5.0v3.0h3.8v-3.0h4.0v6.6H12.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M13.2 16.6h18.6l-2.1 2.9H15.3z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M15.4 19.5h14.2l1.6 14.5H13.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M11.6 34h21.8l1.2 2.8H10.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.8" y="36.8" width="25.4" height="3.6" rx="1.2" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="15.6" y1="24.2" x2="29.4" y2="24.2" stroke={inner} strokeWidth="1.15" opacity="0.7" />
          <line x1="14.8" y1="29.5" x2="30.2" y2="29.5" stroke={inner} strokeWidth="1.15" opacity="0.7" />
          <line x1="22.5" y1="21" x2="22.5" y2="27.2" stroke={inner} strokeWidth="1.35" opacity="0.85" />
          <line x1="17.4" y1="20.8" x2="16.4" y2="32.5" stroke={sheen} strokeWidth="1.1" />
        </g>
      );
  }
}

/**
 * Distinct per-style Knight (Horse) Renderer across ALL 15 piece styles.
 * Anatomy invariant: upright ears (y=6..10), clean 45-50° forehead-to-muzzle slope ending at y=18.5..21.5
 * (never drooping anteater snouts), crisp throat tuck at (21, 22.5), proud chest & curved mane down to y=34.2.
 */
export function renderStyledKnight(p: PieceRenderProps): React.ReactNode {
  const { set, fillRef, stroke, inner, sheen, sw } = p;

  switch (set) {
    case 'retro': // 1. 8-Bit Pixel Arcade (crisp blocky pixel stallion, clean snout & mane)
      return (
        <g>
          <path
            d="M19 7h3v3h3V7h3v3h3v3h2v6h2v8h-2v7H16v-6h3v-4h3v-2h-5v1h-6v-4h2v-3h3v-3h3z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <rect x="17" y="14" width="2.4" height="2.4" fill={inner} />
          <rect x="11.5" y="34" width="22" height="3" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10" y="37" width="25" height="3.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'classic': // 2. Staunton Classic (Tall dignified heritage stallion with sculpted muzzle & mane)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M21.8 9.2L19.6 5.2l4.4 2.8 2.8-2.4 1.0 3.8C33.4 12.0 35.4 18.6 34.0 26.8L34.4 34.2H15.0C15.4 29.0 17.8 25.4 21.4 22.8c-1.8.8-3.8 1.2-6.2 1.0l-3.2.6c-1.8.2-2.8-1.2-2.0-2.9l4.2-6.6c1.2-3.0 4.0-5.2 7.6-5.7z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M12.2 34.2h23.0l1.2 2.7H11.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.6" y="36.9" width="26.2" height="3.6" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="16.4" cy="15.2" rx="1.5" ry="1.05" transform="rotate(-18 16.4 15.2)" fill={inner} />
          <path d="M13.6 23.6c2.6-.2 5.0-1.2 7.0-3.0" stroke={inner} strokeWidth="1.2" fill="none" />
          <path d="M27.4 11.8c2.8 2.2 4.2 6.0 3.8 10.2M29.0 18.8c1.4 2.6 2.0 6.0 1.6 9.6" stroke={inner} strokeWidth="1.2" fill="none" />
        </g>
      );

    case 'modern': // 3. Electric Geometric (Sharp crisp Bauhaus polygonal horse head)
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path
            d="M21.5 9.2L24.5 5.4l2.4 3.6 5.8 5.2 1.5 11.2-1.0 9.0H15.5l5.4-10.2-6.8.6-3.8-2.0 4.8-8.2z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon points="16.8,14.6 19.6,13.8 18.2,16.4" fill={inner} />
          <line x1="24.5" y1="11.2" x2="31.2" y2="31.5" stroke={sheen} strokeWidth="1.15" />
          <rect x="11" y="36.8" width="23" height="3.5" rx="1.2" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M12.8 34.4h21.4l1.0 2.4H11.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'wood': // 4. Natural Hardwood (Warm heirloom carved horse with stout notched mane & bead base)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M21.4 9.6l-2.0-4.0 4.4 2.6 2.6-2.2 1.0 3.6c5.0 2.4 7.0 8.8 5.8 16.8l.4 7.6H15.2c.6-4.8 3.0-8.2 6.2-10.6-2.0.8-4.2 1.0-6.4.6l-3.0.4c-1.8 0-2.6-1.4-1.8-3.0l4.0-6.2c1.2-2.6 3.8-4.8 7.2-5.6z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle cx="16.8" cy="15.2" r="1.4" fill={inner} />
          <path d="M26.8 12.2l2.4 2.4-1.8 2.2 2.4 2.4-1.6 2.2 2.0 2.4" stroke={inner} strokeWidth="1.25" fill="none" />
          <ellipse cx="22.5" cy="34.7" rx="12.6" ry="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.6" y="36.6" width="25.8" height="3.8" rx="1.9" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'minimal': // 5. Minimalist Line (Sleek architectural drafted horse with mane & base contour)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M22.2 9.4l2.4-3.8 2.2 3.8c5.4 2.4 7.2 8.8 5.8 17.0l.2 8.2H15.6c.8-4.6 3.2-8.2 6.6-10.6l-7.2.4c-1.8-.2-2.6-1.6-1.8-3.2l4.0-6.6c1.4-2.8 3.0-4.4 5.0-5.2z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M26.2 12.2c2.8 2.8 3.6 7.8 2.6 14.5" stroke={inner} strokeWidth="1.05" fill="none" opacity="0.55" />
          <circle cx="17.8" cy="15.0" r="1.25" fill={inner} />
          <rect x="11.2" y="35.3" width="22.6" height="4.6" rx="2.1" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="14.2" y1="37.6" x2="30.8" y2="37.6" stroke={inner} strokeWidth="0.9" opacity="0.55" />
        </g>
      );

    case 'cyber': // 6. Cyberpunk Circuit (Mecha stallion with glowing angled cyber-visor & armored plates)
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path
            d="M21.8 9.2l2.2-3.6 3.6 2.4 1.4 3.2c4.4 3.0 5.4 9.6 4.0 22.8H15.2l4.8-10.4-5.4.6-4.2-2.0 4.0-7.6z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M13.2 15.2l6.0-1.2-.8 2.4-5.8 1.2z" fill={inner} />
          <path d="M26.2 12.2l3.4 4.0-.8 12.2" stroke={inner} strokeWidth="1.3" fill="none" />
          <path d="M11.6 34.0h22.8l1.2 6.2H10.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'glass': // 7. Translucent Glass (Multi-faceted crystal knight)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M21.8 9.0L24.4 5.2l2.0 4.0 6.8 6.4-.8 18.8H15.6l5.4-10.6-6.2.6-3.8-2.0 4.6-8.2z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon points="24.2,9.8 31.8,16.0 31.2,34.0 23.0,34.0" fill={sheen} opacity="0.16" />
          <path d="M23.5 11.2l5.8 8.8-.8 12.5M20.2 18.4l8.8-1.4" stroke={sheen} strokeWidth="1.1" fill="none" opacity="0.78" />
          <polygon points="16.6,14.8 19.0,14.2 17.8,16.2" fill={inner} opacity="0.85" />
          <path d="M11.4 34.8h22.2l1.4 5.4H10z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="14.0" y1="37.5" x2="31.0" y2="37.5" stroke={sheen} strokeWidth="0.95" opacity="0.7" />
        </g>
      );

    case 'gold': // 8. 24K Imperial Gold (Proud curved Arabian stallion with royal plume & jewel collar)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M22.2 9.4l-2.4-4.2 4.6 2.8 2.8-2.4 1.0 3.8c5.6 2.6 7.4 9.4 5.6 17.4l.4 7.4H15.2c.6-4.8 3.0-8.2 6.4-10.4-1.8.8-4.0.9-6.0.4l-3.0.4c-1.8.1-2.6-1.4-1.8-3.0l4.0-6.4c1.2-2.8 4.0-5.0 7.4-5.8z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M27.2 12.0c3.6 3.0 4.4 8.2 3.2 14.6M25.0 15.8c2.4 2.6 2.8 6.8 1.8 11.8" stroke={inner} strokeWidth="1.3" fill="none" />
          <ellipse cx="16.4" cy="15.2" rx="1.5" ry="1.05" transform="rotate(-18 16.4 15.2)" fill={inner} />
          <path d="M21.0 29.0l1.5 2.0-1.5 2.0-1.5-2.0z" fill={inner} opacity="0.85" />
          <path d="M10.8 34.2h24.4l1.4 2.8H9.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="8.8" y="37.0" width="27.4" height="3.4" rx="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'gothic': // 9. Shadow Realm (Barded armored charger with pointed steel brow)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M20.8 9.2l-2.6-4.2 4.8 3.0 3.2-2.6.8 4.0c5.2 2.4 7.4 9.0 6.0 17.2l.6 7.6H15.0c.6-4.6 3.0-8.2 6.2-10.6-2.0.8-4.2 1.0-6.2.5l-3.4-1.2c-1.2-.8-1.4-2.2-.6-3.4l4.4-6.4c1.2-2.4 3.0-3.6 5.4-3.9z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M12.6 18.2l5.2-2.2 1.0 3.2-5.4 1.6z" fill={inner} opacity="0.85" />
          <path d="M26.5 11.6c3.0 2.4 4.4 6.2 4.2 11.0" stroke={inner} strokeWidth="1.25" fill="none" />
          <path d="M11.6 34.2h22.8l1.4 6.0H10.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'metal': // 10. Brushed Gunmetal (Forged steel-plated stallion with bolted armor & rivets)
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path
            d="M21.4 9.2l-2.2-3.6 4.4 2.6 2.8-2.2 1.0 3.6 5.8 6.2.8 18.2H15.4l4.8-10.2-5.4.6-4.2-2.0 4.2-8.2z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M14.2 17.2l5.8-1.6 1.2 3.8-6.0 1.6z" stroke={inner} strokeWidth="1.15" fill="none" />
          <circle cx="17.0" cy="14.8" r="1.2" fill={inner} />
          <rect x="10.2" y="34.2" width="24.6" height="6.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="13.8" cy="37.2" r="0.85" fill={inner} />
          <circle cx="22.5" cy="37.2" r="0.85" fill={inner} />
          <circle cx="31.2" cy="37.2" r="0.85" fill={inner} />
        </g>
      );

    case 'ruby': // 11. Star Ruby Gem (Sleek sculpted gem-eyed stallion with diamond breastplate jewel)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M22.0 9.4l-2.0-4.0 4.2 2.8 2.8-2.2.8 3.6c5.4 2.4 7.2 9.0 5.8 17.2l.4 7.4H15.2c.6-4.6 3.0-8.0 6.2-10.4-1.8.8-4.0.9-6.0.4l-3.0.4c-1.8 0-2.6-1.4-1.8-3.0l4.0-6.2c1.4-2.8 3.8-4.8 7.4-6.0z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M16.2 15.0l1.6-1.3 1.6 1.3-1.6 1.3z" fill={inner} />
          <path d="M25.5 25.0l2.0 3.0-2.0 3.0-2.0-3.0z" fill={inner} opacity="0.82" />
          <path d="M11.4 34.4h23.2l1.4 5.8H10z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'emerald_gem': // 12. Imperial Jade (45-deg step-cut octagonal jade charger)
      return (
        <g strokeLinejoin="miter" strokeLinecap="butt">
          <path
            d="M22.0 9.0l2.4-3.4 2.8 3.4 5.2 5.4v10.2l-1.4 9.8H15.6l4.8-10.4-5.4.6-4.2-2.0 4.2-7.8 4.2-3.4z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon points="16.6,14.8 18.8,13.6 18.8,16.0" fill={inner} />
          <path d="M11.2 34.4h22.6l1.8 2.2v3.6H9.4v-3.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="25.5" y1="12.2" x2="29.0" y2="27.5" stroke={sheen} strokeWidth="1.15" />
        </g>
      );

    case 'monochrome_bold': // 13. Bold Noir Silhouette (Woodcut stallion with carved mane ribs)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M21.8 9.4L19.6 5.0l4.6 2.8 2.8-2.4 1.0 3.8C33.8 12.0 35.6 19.2 34.0 34.4H14.5c.8-4.8 3.2-8.2 6.6-10.6-2.0.8-4.2.9-6.4.4l-3.0.4c-1.8.1-2.6-1.4-1.8-3.0l4.2-6.6c1.2-2.8 4.0-4.8 7.7-5.6z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw * 1.25}
          />
          <path d="M27.6 12.4c3.2 2.8 4.0 8.0 2.8 14.8" stroke={inner} strokeWidth="1.5" fill="none" opacity="0.75" />
          <circle cx="16.6" cy="15.0" r="1.55" fill={inner} />
          <rect x="9.6" y="34.8" width="25.8" height="5.4" rx="1.2" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <line x1="12.8" y1="37.5" x2="32.2" y2="37.5" stroke={inner} strokeWidth="1.5" />
        </g>
      );

    case 'celestial': // 14. Celestial Nebula (Graceful Pegasus stallion with swept upward shoulder wing)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M21.4 9.4L19.2 5.0l4.4 2.8 2.8-2.4 1.0 3.8c3.6 1.8 5.6 5.0 6.2 9.2 2.4-2.4 4.2-5.4 4.4-8.4.4 5.4-1.2 10.6-4.2 14.0l.4 10.2H15.0c.6-4.8 3.0-8.2 6.2-10.6-1.8.8-4.0.9-6.0.4l-3.0.4c-1.8.1-2.6-1.4-1.8-3.0l4.0-6.4c1.2-2.8 3.6-4.8 7.0-5.6z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M27.0 17.5c3.4-1.2 6.0-3.2 7.8-5.8M27.4 21.5c2.8-.8 5.0-2.2 6.4-4.2" stroke={inner} strokeWidth="1.2" fill="none" />
          <circle cx="16.4" cy="15.2" r="1.35" fill={inner} />
          <path d="M11.2 34.4h23.6l1.4 5.8H9.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    default: // 15. neo
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M22.2 9.8L20.1 5.6L24.4 8.4L27.0 6.0L28.0 9.5C33.2 12.0 35.2 18.4 34.0 26.5L34.3 34.2H15.4C15.7 29.2 18.2 25.8 21.6 23.4C20.0 24.2 17.8 24.5 15.4 24.3L12.0 25.0C10.2 25.2 9.2 23.8 9.9 22.0L13.8 15.6C15.0 12.4 18.0 10.2 22.2 9.8Z"
            fill={fillRef}
            stroke={stroke}
            strokeWidth={sw}
          />
          <path d="M12.6 34.2h22.2l1.0 2.7H11.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.8" y="36.9" width="25.4" height="3.5" rx="1.3" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M13.6 24.4c2.6-.2 5.0-1.2 6.9-3.0" stroke={inner} strokeWidth="1.2" fill="none" />
          <ellipse cx="16.6" cy="15.5" rx="1.6" ry="1.1" transform="rotate(-18 16.6 15.5)" fill={inner} />
          <circle cx="16.2" cy="15.1" r="0.52" fill={sheen} />
          <ellipse cx="11.5" cy="22.4" rx="0.8" ry="1.1" transform="rotate(20 11.5 22.4)" fill={inner} />
          <path d="M27.4 12.0c2.7 2.0 4.0 5.4 4.0 9.2M29.2 18.0c1.4 2.4 2.0 5.4 1.6 8.8" stroke={inner} strokeWidth="1.15" fill="none" opacity="0.85" />
          <path d="M14.0 18.0l2.2-3.5" stroke={sheen} strokeWidth="1.05" fill="none" />
        </g>
      );
  }
}

/**
 * Distinct per-style Bishop Renderer across ALL 15 piece styles (STRICTLY CROSS-FREE).
 * Proportions: Tall & slender (~35px height, top ~y=4.8..5.6, slender mitre x=16..29, tall stem y=23.6..34.6).
 */
export function renderStyledBishop(p: PieceRenderProps): React.ReactNode {
  const { set, fillRef, stroke, inner, sheen, sw } = p;

  switch (set) {
    case 'retro': // 1. 8-Bit Pixel Arcade
      return (
        <g>
          <rect x="20.5" y="4.8" width="4" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M19 7.6h7v2.8h2.5v7.6H26v4h-7v-4h-2.5v-7.6H19z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="22.5" y="11" width="2.5" height="2" fill={inner} />
          <rect x="20.5" y="13" width="2.5" height="2" fill={inner} />
          <rect x="16.5" y="22" width="12" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M16 24.8h13l2 9.2H14z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="11" y="34" width="23" height="3" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.5" y="37" width="26" height="3.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'classic': // 2. Staunton Classic
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="5.8" r="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 8.2C16.8 11.8 15.2 17.8 17.2 22.8H27.8C29.8 17.8 28.2 11.8 22.5 8.2Z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M25.4 11.6l-4.8 4.8" stroke={inner} strokeWidth="1.75" />
          <ellipse cx="22.5" cy="23.6" rx="7.2" ry="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <ellipse cx="22.5" cy="25.6" rx="5.8" ry="1.3" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M17.8 26.8h9.4c.5 3.0 1.8 5.4 4.2 7.6H13.6c2.4-2.2 3.7-4.6 4.2-7.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M11.0 34.4h23.0l1.5 2.5H9.5z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.2" y="36.9" width="26.6" height="3.5" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'modern': // 3. Electric Geometric
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="6.2" r="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 9.0c-5.2 3.8-6.4 9.6-4.4 14.4h8.8c2.0-4.8.8-10.6-4.4-14.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="25.2" y1="12.8" x2="19.8" y2="18.2" stroke={inner} strokeWidth="1.85" />
          <path d="M17.5 25.0h10l4.2 11.8H13.3z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="11" y="37.2" width="23" height="3.2" rx="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'wood': // 4. Natural Hardwood
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="6.2" r="2.1" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 8.6C16.2 12.2 15.0 18.0 17.4 22.8H27.6C30.0 18.0 28.8 12.2 22.5 8.6Z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M25.2 12.0l-4.6 4.6" stroke={inner} strokeWidth="1.75" />
          <rect x="15.2" y="22.8" width="14.6" height="2.8" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M17.4 25.6h10.2l3.8 8.8H13.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="22.5" cy="34.8" rx="12.6" ry="1.9" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.6" y="36.6" width="25.8" height="3.8" rx="1.9" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'minimal': // 5. Minimalist Line (Architectural Bishop with collar band & stem flute)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="6.2" r="1.85" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 8.8c-4.6 3.8-5.8 9.4-3.8 14.4h7.6c2.0-5.0.8-10.6-3.8-14.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="24.8" y1="12.6" x2="20.2" y2="17.2" stroke={inner} strokeWidth="1.5" />
          <rect x="16.6" y="23.4" width="11.8" height="2.2" rx="1.1" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M18.2 25.8h8.6l3.4 9.2H14.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="22.5" y1="27.2" x2="22.5" y2="33.4" stroke={inner} strokeWidth="0.95" opacity="0.5" />
          <rect x="11.4" y="35.3" width="22.2" height="4.6" rx="2.1" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="14.2" y1="37.6" x2="30.8" y2="37.6" stroke={inner} strokeWidth="0.9" opacity="0.55" />
        </g>
      );

    case 'cyber': // 6. Cyberpunk Circuit
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M22.5 4.8l2.2 2.6-2.2 2.2-2.2-2.2z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M22.5 9.8l5.6 6.4-1.8 7.0h-7.6l-1.8-7.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M25.2 14.0l-4.6 4.6" stroke={inner} strokeWidth="1.75" />
          <rect x="15.8" y="23.4" width="13.4" height="2.4" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M17.4 25.8h10.2l3.8 9.2H13.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10.2" y="35.0" width="24.6" height="5.2" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'glass': // 7. Translucent Glass (Prismatic faceted crystal Bishop)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M22.5 4.6l2.0 2.8-2.0 2.2-2.0-2.2z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M22.5 9.6l4.8 7.2-1.6 7.4h-6.4l-1.6-7.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <polygon points="22.5,10.2 26.8,16.8 25.4,23.8 22.5,23.8" fill={sheen} opacity="0.22" />
          <path d="M18.2 24.4h8.6l3.8 10.8H14.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <polygon points="22.5,24.8 26.2,24.8 29.8,34.8 22.5,34.8" fill={sheen} opacity="0.15" />
          <path d="M11 35.2h23l1.4 5.0H9.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 10.8v23.6M25.0 13.4l-4.6 4.6M14.2 37.7h16.6" stroke={sheen} strokeWidth="1.05" opacity="0.78" />
        </g>
      );

    case 'gold': // 8. 24K Imperial Gold
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="5.6" r="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 8.0C16.6 11.8 15.2 17.6 17.2 22.8h10.6C29.8 17.6 28.4 11.8 22.5 8.0Z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M17.6 16.5c3.0 1.0 6.8 1.0 9.8 0" stroke={inner} strokeWidth="1.15" fill="none" />
          <path d="M25.2 11.8l-4.6 4.6" stroke={inner} strokeWidth="1.7" />
          <ellipse cx="22.5" cy="23.6" rx="7.0" ry="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M17.4 25.2h10.2l3.8 9.2H13.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M11.0 34.4h23l1.5 2.5H9.5z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.0" y="36.9" width="27" height="3.5" rx="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'gothic': // 9. Shadow Realm
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M22.5 4.8l1.8 3.2-1.8 1.5-1.8-1.5z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M22.5 9.4C17.0 13.6 15.8 19.2 17.6 24.0h9.8C29.2 19.2 28.0 13.6 22.5 9.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M25.2 13.4l-4.6 4.6" stroke={inner} strokeWidth="1.7" />
          <path d="M16.8 24.2h11.4l4.0 10.4H12.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.4 34.6h24.2l1.0 5.6H9.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M20.4 33.8v-4.8c0-1.6 2.1-2.8 2.1-2.8s2.1 1.2 2.1 2.8v4.8" stroke={inner} strokeWidth="1.15" fill="none" />
        </g>
      );

    case 'metal': // 10. Brushed Gunmetal
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M20.6 5.4h3.8l1.0 3.0h-5.8z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M22.5 8.6l5.4 6.4-1.6 8.2H18.7l-1.6-8.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="25.0" y1="13.2" x2="20.0" y2="18.2" stroke={inner} strokeWidth="1.7" />
          <rect x="15.2" y="23.2" width="14.6" height="2.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M17.2 25.8h10.6l3.8 8.8H13.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10.2" y="34.6" width="24.6" height="5.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="14" cy="37.4" r="0.85" fill={inner} />
          <circle cx="31" cy="37.4" r="0.85" fill={inner} />
        </g>
      );

    case 'ruby': // 11. Star Ruby Gem
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M22.5 5.0l1.9 2.2-1.9 2.0-1.9-2.0z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M22.5 9.0c-5.8 3.2-7.0 9.6-4.6 14.6h9.2c2.4-5.0 1.2-11.4-4.6-14.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 13.0l2.0 3.4-2.0 3.4-2.0-3.4z" fill={inner} opacity="0.8" />
          <ellipse cx="22.5" cy="24.2" rx="6.6" ry="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M17.4 25.7h10.2l3.8 9.0H13.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.8 34.7h23.4l1.4 5.5H9.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'emerald_gem': // 12. Imperial Jade
      return (
        <g strokeLinejoin="miter" strokeLinecap="butt">
          <rect x="20.9" y="5.0" width="3.2" height="3.2" transform="rotate(45 22.5 6.6)" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M20.2 9.2h4.6l3.6 4.8v5.8l-2.4 3.8h-7l-2.4-3.8V14z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="25.0" y1="13.2" x2="20.0" y2="18.2" stroke={inner} strokeWidth="1.7" />
          <rect x="16.2" y="23.6" width="12.6" height="2.2" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M17.6 25.8h9.8l3.8 8.8H13.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M11.0 34.6h23l1.8 2.2v3.4H9.2v-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'monochrome_bold': // 13. Bold Noir Silhouette
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="6.2" r="2.3" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.2} />
          <path d="M22.5 8.8C16.4 12.6 14.8 18.6 17.2 23.6H27.8C30.2 18.6 28.6 12.6 22.5 8.8Z" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <line x1="25.6" y1="12.4" x2="19.6" y2="18.4" stroke={inner} strokeWidth="2.0" />
          <path d="M16.8 24.4h11.4l3.8 10.2H13.0z" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <rect x="9.8" y="34.8" width="25.4" height="5.4" rx="1.2" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <line x1="12.8" y1="37.5" x2="32.2" y2="37.5" stroke={inner} strokeWidth="1.5" />
        </g>
      );

    case 'celestial': // 14. Celestial Nebula
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="6.0" r="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 8.6C16.8 12.2 15.4 18.0 17.4 22.8h10.2C29.6 18.0 28.2 12.2 22.5 8.6Z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="22.5" cy="19.8" rx="9.0" ry="2.0" transform="rotate(-14 22.5 19.8)" stroke={inner} strokeWidth="1.3" fill="none" opacity="0.85" />
          <path d="M25.2 12.0l-4.6 4.6" stroke={inner} strokeWidth="1.7" />
          <path d="M17.2 24.0h10.6l4.0 10.5H13.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.6 34.5h23.8l1.4 5.7H9.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    default: // 15. neo (tall slender classic bishop)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="5.8" r="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 8.2C16.8 11.8 15.2 17.8 17.2 22.8H27.8C29.8 17.8 28.2 11.8 22.5 8.2Z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M25.4 11.6l-4.8 4.8" stroke={inner} strokeWidth="1.75" />
          <ellipse cx="22.5" cy="23.8" rx="6.6" ry="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M17.8 25.4h9.4l3.6 9.0H14.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M11.6 34.4h21.8l1.6 2.5H10z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.6" y="36.9" width="25.8" height="3.5" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M18.2 19.2c-.3-2.8.8-5.6 2.6-8.0" stroke={sheen} strokeWidth="1.05" fill="none" />
        </g>
      );
  }
}

/**
 * Distinct per-style Queen Renderer across ALL 15 piece styles.
 * Proportions: Tall & regal (~35.5px height, crown span x=10.6..34.4, collar y=22.4, tall gown y=23.6..34.6).
 */
export function renderStyledQueen(p: PieceRenderProps): React.ReactNode {
  const { set, fillRef, stroke, inner, sheen, sw } = p;

  switch (set) {
    case 'retro': // 1. 8-Bit Pixel Arcade
      return (
        <g>
          <rect x="9.5" y="8.5" width="3" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <rect x="15.5" y="6" width="3" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <rect x="21" y="4.8" width="3" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <rect x="26.5" y="6" width="3" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <rect x="32.5" y="8.5" width="3" height="2.8" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M10.5 11.3h2.8v5h3.5V9h2.8v7h2V7.6h2.8V16h2V9h2.8v7h3.5v-5h2.8l-3.6 11.8H14.1z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M15.2 23.1h14.6l2.2 11.0H13z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10.5" y="34.1" width="24" height="3" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9" y="37.1" width="27" height="3.3" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'classic': // 2. Staunton Classic (Balanced 5-pearl coronet + tall fluted classic robe)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M10.8 11.8l4.0 10.6h15.4l4.0-10.6-5.6 5.6-2.4-7.8-3.7 7.0-3.7-7.0-2.4 7.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="10.2" cy="10.6" r="1.55" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="16.2" cy="8.2" r="1.55" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="22.5" cy="6.6" r="1.75" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="28.8" cy="8.2" r="1.55" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="34.8" cy="10.6" r="1.55" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <ellipse cx="22.5" cy="23.2" rx="8.2" ry="1.7" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M15.8 24.9h13.4l3.0 9.6H12.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.4 34.5h24.2l1.4 2.5H9.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="8.6" y="37" width="27.8" height="3.4" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'modern': // 3. Electric Geometric (Sleek 3-Spike Bauhaus Queen, tall gown)
      return (
        <g strokeLinejoin="miter" strokeLinecap="round">
          <path d="M11.6 11.4l4.6 11.2h12.6l4.6-11.2-5.4 6.6-5.5-10.2-5.5 10.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="11.2" cy="10.2" r="1.65" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="22.5" cy="6.6" r="1.9" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="33.8" cy="10.2" r="1.65" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M15.6 24.2h13.8l3.2 12.6H12.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10.2" y="37.0" width="24.6" height="3.4" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'wood': // 4. Natural Hardwood (Fixed! True carved wooden 5-spike Queen coronet with turned balls & bead collar)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M11.2 12.2l4.0 10.2h14.6l4.0-10.2-5.2 5.4-2.4-7.6-3.7 6.8-3.7-6.8-2.4 7.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="10.8" cy="11.0" r="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="16.4" cy="8.6" r="1.55" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="22.5" cy="7.0" r="1.75" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="28.6" cy="8.6" r="1.55" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="34.2" cy="11.0" r="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <rect x="13.8" y="22.4" width="17.4" height="3.0" rx="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M15.8 25.4h13.4l3.2 9.0H12.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="22.5" cy="34.8" rx="13.4" ry="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.0" y="36.6" width="27.0" height="3.8" rx="1.9" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M16.8 29.2c3.5.9 7.9.9 11.4 0M15.6 32.5c4.2.9 9.6.9 13.8 0" stroke={inner} strokeWidth="0.95" fill="none" opacity="0.55" />
        </g>
      );

    case 'minimal': // 5. Minimalist Line (Architectural 3-peak Swiss Queen with inner gown ribs)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M11.8 11.4l4.2 11.2h13.0l4.2-11.2-5.2 6.0-5.5-9.8-5.5 9.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="15.0" y="23.0" width="15.0" height="2.2" rx="1.1" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M16.4 25.4h12.2l3.0 9.6H13.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M19.8 26.8l-.8 6.8M22.5 26.8v6.8M25.2 26.8l.8 6.8" stroke={inner} strokeWidth="0.9" opacity="0.48" />
          <rect x="10.6" y="35.3" width="23.8" height="4.6" rx="2.1" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="13.8" y1="37.6" x2="31.2" y2="37.6" stroke={inner} strokeWidth="0.9" opacity="0.55" />
        </g>
      );

    case 'cyber': // 6. Cyberpunk Circuit (5-point laser-spire Queen)
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M10.4 11.6l4.6 11.6h15l4.6-11.6-5.4 6.0-2.8-8.6-3.9 7.2-3.9-7.2-2.8 8.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 5.2l1.8 2.4-1.8 2.2-1.8-2.2z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M15.4 23.4h14.2l3.4 11.4H12z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.2" y="34.8" width="26.6" height="5.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 18.8l2.0 2.4-2.0 2.4-2.0-2.4z" fill={inner} opacity="0.85" />
        </g>
      );

    case 'glass': // 7. Translucent Glass (5 faceted crystal spire Queen with internal refraction)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M11.2 10.8l3.8 12.2h15l3.8-12.2-4.8 6.8-2.6-9.2-3.9 7.6-3.9-7.6-2.6 9.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 4.8l1.6 2.2-1.6 2.0-1.6-2.0z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M15.6 23.2h13.8l3.4 12.0H12.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <polygon points="22.5,23.6 28.8,23.6 32.0,34.8 22.5,34.8" fill={sheen} opacity="0.18" />
          <path d="M10 35.2h25l1.4 5.0H8.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 16.0v18.4M18.2 24.0l-1.8 10.4M26.8 24.0l1.8 10.4M13.5 37.7h18.0" stroke={sheen} strokeWidth="1.05" opacity="0.76" />
        </g>
      );

    case 'gold': // 8. 24K Imperial Gold (Regal jeweled coronet + tall royal gown)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <circle cx="22.5" cy="6.0" r="1.9" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.4 12.0l4.2 10.6h15.8l4.2-10.6-5.8 5.2-2.6-7.8-3.7 6.8-3.7-6.8-2.6 7.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="10.2" cy="10.8" r="1.45" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="16.2" cy="8.4" r="1.45" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="28.8" cy="8.4" r="1.45" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="34.8" cy="10.8" r="1.45" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <ellipse cx="22.5" cy="23.0" rx="8.2" ry="1.7" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M15.4 24.7h14.2l3.2 9.8H12.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.2 34.5h24.6l1.5 2.4H8.7z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="8.6" y="36.9" width="27.8" height="3.5" rx="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 18.6l1.8 2.2-1.8 2.2-1.8-2.2z" fill={inner} opacity="0.9" />
        </g>
      );

    case 'gothic': // 9. Shadow Realm (Tall jagged iron crown)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M10.8 10.0l3.8 13.0h15.8l3.8-13.0-5.0 6.8-2.4-9.8-4.5 7.8-4.5-7.8-2.4 9.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M15.2 23.0h14.6l3.2 11.6H12z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10 34.6h25l1 5.6H9z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M19.5 34v-4.8c0-1.8 3-3.2 3-3.2s3 1.4 3 3.2V34" stroke={inner} strokeWidth="1.2" fill="none" />
        </g>
      );

    case 'metal': // 10. Brushed Gunmetal (Fixed! Sleek forged 5-point ironclad crown + bolted waist & riveted base)
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M10.8 11.2l4.0 11.6h15.4l4.0-11.6-5.2 5.4-2.5-8.0-4.0 6.6-4.0-6.6-2.5 8.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="13.8" y="22.8" width="17.4" height="2.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M15.4 25.4h14.2l3.0 9.2H12.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.4" y="34.6" width="26.2" height="5.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="13.5" cy="37.4" r="0.85" fill={inner} />
          <circle cx="22.5" cy="37.4" r="0.85" fill={inner} />
          <circle cx="31.5" cy="37.4" r="0.85" fill={inner} />
        </g>
      );

    case 'ruby': // 11. Star Ruby Gem (Fixed! Tall 5-point Queen coronet tipped with kite ruby gems + sleek tall gown)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M10.8 11.8l4.0 11.0h15.4l4.0-11.0-5.4 5.6-2.6-8.0-3.7 6.8-3.7-6.8-2.6 8.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          {/* Kite ruby tips seated flush onto spike tips */}
          <path d="M10.8 9.2l1.2 1.5-1.2 1.5-1.2-1.5z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.8} />
          <path d="M16.2 7.0l1.3 1.6-1.3 1.6-1.3-1.6z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.8} />
          <path d="M22.5 5.6l1.5 1.9-1.5 1.9-1.5-1.9z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M28.8 7.0l1.3 1.6-1.3 1.6-1.3-1.6z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.8} />
          <path d="M34.2 9.2l1.2 1.5-1.2 1.5-1.2-1.5z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.8} />
          <ellipse cx="22.5" cy="23.2" rx="8.0" ry="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M15.6 24.8h13.8l3.2 9.8H12.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M9.6 34.6h25.8l1.4 5.6H8.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 18.6l1.8 2.4-1.8 2.4-1.8-2.4z" fill={inner} opacity="0.85" />
        </g>
      );

    case 'emerald_gem': // 12. Imperial Jade (5-stepped octagonal Jade Queen)
      return (
        <g strokeLinejoin="miter" strokeLinecap="butt">
          <path d="M11.2 11.4l4.0 11.6h14.6l4.0-11.6-4.8 6.2-2.4-8.4-4.1 6.8-4.1-6.8-2.4 8.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="21.0" y="5.4" width="3.0" height="3.0" transform="rotate(45 22.5 6.9)" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <rect x="14.4" y="23.0" width="16.2" height="2.2" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M15.6 25.2h13.8l3.2 9.4H12.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.4 34.6h24.2l1.8 2.2v3.4H8.6v-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'monochrome_bold': // 13. Bold Noir Silhouette
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M10.2 10.8l4.0 12.4h16.6l4.0-12.4-5.4 6.2-2.8-8.8-4.1 7.6-4.1-7.6-2.8 8.8z" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <path d="M14.8 24.0h15.4l2.8 10.6H12.0z" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <rect x="9.2" y="34.8" width="26.6" height="5.4" rx="1.2" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <line x1="12.4" y1="37.5" x2="32.6" y2="37.5" stroke={inner} strokeWidth="1.5" />
        </g>
      );

    case 'celestial': // 14. Celestial Nebula
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M11.2 12.4l4.0 10.2h14.6l4.0-10.2-5.4 5.4-2.6-7.6-3.3 6.6-3.3-6.6-2.6 7.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 4.6L23.3 7.0L25.8 7.1L23.8 8.6L24.5 11.0L22.5 9.6L20.5 11.0L21.2 8.6L19.2 7.1L21.7 7.0Z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.78} />
          <ellipse cx="22.5" cy="23.4" rx="9.4" ry="1.8" stroke={inner} strokeWidth="1.2" fill="none" opacity="0.85" />
          <path d="M15.4 25.0h14.2l3.2 9.6H12.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.2 34.6h24.6l1.4 5.6H8.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    default: // 15. neo (balanced 5-spike coronet + tall graceful gown)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M11.0 12.2l4.0 10.6h15.0l4.0-10.6-5.8 5.6-2.5-8.0-3.2 7.0-3.2-7.0-2.5 8.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="10.4" cy="11.0" r="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="16.4" cy="8.4" r="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="22.5" cy="6.8" r="1.7" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="28.6" cy="8.4" r="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <circle cx="34.6" cy="11.0" r="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <ellipse cx="22.5" cy="23.2" rx="8.0" ry="1.7" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M15.8 24.9h13.4l3.0 9.6H12.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.8 34.5h23.4l1.4 2.4H9.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.0" y="36.9" width="27" height="3.5" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M18.6 25.4l-1.5 8.6M22.5 25.4v8.8M26.4 25.4l1.5 8.6" stroke={inner} strokeWidth="1.0" opacity="0.65" />
          <path d="M22.5 18.6l1.5 1.9-1.5 1.9-1.5-1.9z" fill={inner} opacity="0.85" />
        </g>
      );
  }
}

/**
 * Distinct per-style King Body across ALL 15 piece styles.
 * Proportions: Tallest royal silhouette (finial y=2.3..12.5, crown lobes y=14..24.8, tall robe y=24.8..34.6, base x=8.5..36.5).
 */
export function renderStyledKingBody(p: PieceRenderProps): React.ReactNode {
  const { set, fillRef, stroke, inner, sheen, sw } = p;

  switch (set) {
    case 'retro': // 1. 8-Bit Pixel Arcade
      return (
        <g>
          <rect x="20.5" y="12.2" width="4" height="2.4" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M12.5 14.6h7.5v2h5v-2h7.5V25H12.5z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M14.5 25h16l1.5 9.0H13z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="10.5" y="34" width="24" height="3" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9" y="37" width="27" height="3.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="21" y="18" width="3" height="6" fill={inner} opacity="0.8" />
        </g>
      );

    case 'classic': // 2. Staunton Classic
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M20.8 12.2h3.4v2.4h-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M22.5 14.4C18.0 12.0 10.6 13.8 11.6 20.6C12.3 23.6 14.2 25.0 15.6 26.0H29.4C30.8 25.0 32.7 23.6 33.4 20.6C34.4 13.8 27.0 12.0 22.5 14.4Z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 14.4v11.6M15.4 23.8c4.0-1.6 10.2-1.6 14.2 0" stroke={inner} strokeWidth="1.2" fill="none" opacity="0.85" />
          <path d="M14.4 26.0h16.2l2.6 8.4H11.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.2 34.4h24.6l1.5 2.6H8.7z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="8.5" y="37" width="28.0" height="3.5" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'modern': // 3. Electric Geometric
      return (
        <g strokeLinejoin="miter" strokeLinecap="round">
          <rect x="20.8" y="12.2" width="3.4" height="2.4" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M13.8 14.6h17.4l-2.0 11.4H15.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M15.2 26.2h14.6l3.8 10.8H11.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.6" y="37" width="25.8" height="3.4" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="22.5" y1="15.8" x2="22.5" y2="24.8" stroke={inner} strokeWidth="1.35" />
        </g>
      );

    case 'wood': // 4. Natural Hardwood
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M20.6 12.2h3.8v2.4h-3.8z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M22.5 14.4C17.4 12.6 11.8 14.4 12.4 20.6c.4 2.8 2.0 4.4 3.4 5.2H29.2c1.4-.8 3.0-2.4 3.4-5.2.6-6.2-5.0-8.0-10.1-6.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="13.2" y="25.6" width="18.6" height="2.8" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M14.8 28.4h15.4l2.8 6.2H12z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="22.5" cy="34.8" rx="13.8" ry="2.0" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="8.8" y="36.6" width="27.4" height="3.8" rx="1.9" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'minimal': // 5. Minimalist Line (Architectural King with crown seam & robed flutes)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <line x1="22.5" y1="12.2" x2="22.5" y2="14.6" stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 14.6C18.6 12.8 13.0 14.4 14.0 20.4c.5 2.4 1.8 4.0 3.2 5.0h10.6c1.4-1.0 2.7-2.6 3.2-5.0 1.0-6.0-4.6-7.6-8.5-5.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 14.8v10.2" stroke={inner} strokeWidth="1.0" opacity="0.55" />
          <rect x="14.8" y="25.6" width="15.4" height="2.2" rx="1.1" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M16.0 28.0h13.0l2.8 7.0H13.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M19.4 29.4l-.6 4.4M25.6 29.4l.6 4.4" stroke={inner} strokeWidth="0.9" opacity="0.48" />
          <rect x="10.4" y="35.3" width="24.2" height="4.6" rx="2.1" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="13.4" y1="37.6" x2="31.6" y2="37.6" stroke={inner} strokeWidth="0.9" opacity="0.55" />
        </g>
      );

    case 'cyber': // 6. Cyberpunk Circuit
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M20.8 12.2h3.4v2.4h-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M22.5 14.5L15.0 13.0 11.8 18.6 15.6 25.8H29.4L33.2 18.6 30.0 13.0Z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 15.4v10.0M15.8 23.2h13.4" stroke={inner} strokeWidth="1.2" fill="none" />
          <path d="M14.8 25.8h15.4l3.2 9.0H11.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.0" y="34.8" width="27" height="5.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'glass': // 7. Translucent Glass (Prismatic faceted crystal King)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M20.8 12.2h3.4v2.4h-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M22.5 14.4L15.2 12.8 12.8 19.2 16.4 25.6H28.6L32.2 19.2 29.8 12.8Z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <polygon points="22.5,14.8 29.4,13.4 31.6,19.2 28.2,25.2 22.5,25.2" fill={sheen} opacity="0.2" />
          <path d="M15.8 25.6h13.4l3.4 9.6H12.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <polygon points="22.5,26.0 28.8,26.0 32.0,34.8 22.5,34.8" fill={sheen} opacity="0.16" />
          <path d="M9.8 35.2h25.4l1.4 5.0H8.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 15.0v19.6M17.2 19.4h10.6M13.2 37.7h18.6" stroke={sheen} strokeWidth="1.05" opacity="0.78" />
        </g>
      );

    case 'gold': // 8. 24K Imperial Gold
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M20.6 12.2h3.8v2.4h-3.8z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M22.5 14.4C17.8 11.4 11.0 13.2 12.0 20.2c.6 3.2 2.4 5.0 4.0 6.0H29.0c1.6-1.0 3.4-2.8 4.0-6.0 1.0-7.0-5.8-8.8-10.5-5.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 17.6l1.8 2.4-1.8 2.4-1.8-2.4z" fill={inner} opacity="0.9" />
          <ellipse cx="22.5" cy="26.2" rx="8.0" ry="1.6" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.9} />
          <path d="M15.0 27.6h15.0l3.0 7.0H12.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.0 34.6h25.0l1.5 2.4H8.5z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="8.2" y="37" width="28.6" height="3.5" rx="1.5" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'gothic': // 9. Shadow Realm
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M20.8 12.2h3.4v2.4h-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M22.5 14.2l-6.8-2.8-3.8 7.0 4.0 7.8h13.2l4.0-7.8-3.8-7.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 14.4v11.6M16.4 24.0c3.8-1.4 8.4-1.4 12.2 0" stroke={inner} strokeWidth="1.2" fill="none" />
          <path d="M14.8 26.2h15.4l3.2 8.4H11.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M9.6 34.6h25.8l1.0 5.6H8.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'metal': // 10. Brushed Gunmetal
      return (
        <g strokeLinejoin="miter" strokeLinecap="square">
          <path d="M20.6 12.2h3.8v2.4h-3.8z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M12.8 14.6h19.4l-2.2 11.4H15.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <line x1="22.5" y1="15.8" x2="22.5" y2="24.8" stroke={inner} strokeWidth="1.35" />
          <rect x="13.8" y="26.0" width="17.4" height="2.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M15.0 28.6h15.0l2.8 6.0H12.2z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="9.2" y="34.6" width="26.6" height="5.6" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <circle cx="13.2" cy="37.4" r="0.85" fill={inner} />
          <circle cx="22.5" cy="37.4" r="0.85" fill={inner} />
          <circle cx="31.8" cy="37.4" r="0.85" fill={inner} />
        </g>
      );

    case 'ruby': // 11. Star Ruby Gem
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M20.8 12.2h3.4v2.4h-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M22.5 14.4c-4.2-2.8-10.4-1.2-9.8 5.8.4 3.0 2.0 4.8 3.6 6.0h12.4c1.6-1.2 3.2-3.0 3.6-6.0.6-7.0-5.6-8.6-9.8-5.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 17.6l2.0 2.8-2.0 2.8-2.0-2.8z" fill={inner} opacity="0.85" />
          <path d="M14.8 26.2h15.4l3.0 8.4H11.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M9.8 34.6h25.4l1.4 5.6H8.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'emerald_gem': // 12. Imperial Jade
      return (
        <g strokeLinejoin="miter" strokeLinecap="butt">
          <path d="M20.8 12.2h3.4v2.4h-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M22.5 14.4L15.4 13.0l-3.2 3.4v5.6l3.4 4.2h13.8l3.4-4.2v-5.6L29.6 13.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="20.0" y="17.2" width="5.0" height="5.6" stroke={inner} strokeWidth="1.1" fill="none" />
          <path d="M15.0 26.2h15.0l3.2 8.4H11.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.0 34.6h25.0l1.8 2.2v3.4H8.2v-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    case 'monochrome_bold': // 13. Bold Noir Silhouette (Woodcut textured King with carved breastplate contour)
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M20.5 12.2h4v2.4h-4z" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.15} />
          <path d="M22.5 14.4C17.6 11.4 10.4 13.4 11.6 20.6c.6 3.2 2.4 4.8 4.0 5.8h13.8c1.6-1.0 3.4-2.6 4.0-5.8 1.2-7.2-6.0-9.2-10.9-6.2z" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <path d="M22.5 16.0v8.6M16.2 22.8h12.6" stroke={inner} strokeWidth="1.45" opacity="0.72" />
          <path d="M14.6 26.4h15.8l2.8 8.2H11.8z" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <rect x="9.0" y="34.8" width="27" height="5.4" rx="1.2" fill={fillRef} stroke={stroke} strokeWidth={sw * 1.25} />
          <line x1="12.2" y1="37.5" x2="32.8" y2="37.5" stroke={inner} strokeWidth="1.5" />
        </g>
      );

    case 'celestial': // 14. Celestial Nebula
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M20.8 12.2h3.4v2.4h-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M22.5 14.4C18.4 12.0 11.8 13.6 12.6 20.2c.5 2.8 2.2 4.6 3.6 5.8h12.6c1.4-1.2 3.1-3.0 3.6-5.8.8-6.6-5.8-8.2-9.9-5.8z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="22.5" cy="22.8" rx="11.2" ry="2.0" transform="rotate(-8 22.5 22.8)" stroke={inner} strokeWidth="1.3" fill="none" opacity="0.85" />
          <path d="M15.0 26.2h15.0l3.0 8.4H12.0z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.0 34.6h25.0l1.4 5.6H8.6z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
        </g>
      );

    default: // 15. neo
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M20.8 12.2h3.4v2.4h-3.4z" fill={fillRef} stroke={stroke} strokeWidth={sw * 0.85} />
          <path d="M22.5 14.4C18.4 12.0 11.2 13.8 12.2 20.4C12.8 23.4 14.6 25.0 16.0 26.0H29.0C30.4 25.0 32.2 23.4 32.8 20.4C33.8 13.8 26.6 12.0 22.5 14.4Z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M22.5 14.4v11.6M15.6 23.6c3.6-1.5 10.2-1.5 13.8 0" stroke={inner} strokeWidth="1.2" fill="none" opacity="0.85" />
          <path d="M14.8 26.0h15.4l2.4 8.5H12.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M10.8 34.5h23.4l1.4 2.4H9.4z" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <rect x="8.8" y="36.9" width="27.4" height="3.5" rx="1.4" fill={fillRef} stroke={stroke} strokeWidth={sw} />
          <path d="M14.2 18.6c-.4-2.2 1.6-3.6 4.2-3.4" stroke={sheen} strokeWidth="1.1" fill="none" />
          <line x1="11.6" y1="38.6" x2="33.4" y2="38.6" stroke={inner} strokeWidth="0.9" opacity="0.45" />
        </g>
      );
  }
}
