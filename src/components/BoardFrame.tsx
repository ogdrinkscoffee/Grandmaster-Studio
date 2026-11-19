import React, { useId } from 'react';
import { BoardFrameConfig, BoardOrnamentKind } from '../theme/themes';

/**
 * Decorative frame drawn around a board. Each signature board picks an
 * ornament set: corner pieces (rotated per corner), top/bottom/side
 * medallions and optional quarter studs, all sized relative to the band.
 */

interface OrnamentColors {
  p: string; // primary
  s: string; // secondary
  a: string; // accent
  uid: string;
}

type Draw = (c: OrnamentColors) => React.ReactNode;

interface OrnamentSet {
  corner?: Draw;
  cornerScale?: number;
  top?: Draw;
  bottom?: Draw;
  edgeScale?: number;
  side?: Draw;
  sideScale?: number;
  quarter?: Draw;
  quarterScale?: number;
  /** Extra inset line inside the band (filigree / hairline). */
  bandLine?: (f: BoardFrameConfig) => { color: string; style?: 'solid' | 'dashed' | 'dotted'; width?: number };
  /** Keep corner art upright instead of rotating it into each corner. */
  uprightCorners?: boolean;
  /** Which pieces get the ornament motion class. */
  animated?: Array<'corner' | 'edge' | 'side' | 'quarter'>;
}

/* Pixel-art helper: rows of characters mapped to palette colours. */
const pixelArt = (rows: string[], palette: Record<string, string>, size = 40) => {
  const cols = Math.max(...rows.map(r => r.length));
  const cell = Math.floor(size / Math.max(cols, rows.length));
  const ox = (size - cols * cell) / 2;
  const oy = (size - rows.length * cell) / 2;
  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) =>
    row.split('').forEach((ch, x) => {
      const fill = palette[ch];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={ox + x * cell} y={oy + y * cell} width={cell} height={cell} fill={fill} />);
    })
  );
  return <g shapeRendering="crispEdges">{rects}</g>;
};

const star4 = (cx: number, cy: number, r: number, inner = 0.28) => {
  const i = r * inner;
  return `M${cx} ${cy - r} Q${cx + i} ${cy - i} ${cx + r} ${cy} Q${cx + i} ${cy + i} ${cx} ${cy + r} Q${cx - i} ${cy + i} ${cx - r} ${cy} Q${cx - i} ${cy - i} ${cx} ${cy - r}Z`;
};

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, k) => {
    const ang = (Math.PI / 3) * k - Math.PI / 2;
    return `${(cx + r * Math.cos(ang)).toFixed(2)},${(cy + r * Math.sin(ang)).toFixed(2)}`;
  }).join(' ');

const goldGrad = (id: string, light: string, dark: string) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor={light} />
    <stop offset="0.45" stopColor={dark} />
    <stop offset="0.7" stopColor={light} />
    <stop offset="1" stopColor={dark} />
  </linearGradient>
);

const ORNAMENTS: Record<BoardOrnamentKind, OrnamentSet> = {
  /* Tournament — carbon stage, LED brackets, trophy, nameplate and scoreboard lights */
  tournament: {
    cornerScale: 1.65,
    corner: ({ p, s, a }) => (
      <g fill="none" strokeLinecap="round">
        <path d="M7 37V13a6 6 0 0 1 6-6h24" stroke={s} strokeWidth="7" />
        <path d="M7 37V13a6 6 0 0 1 6-6h24" stroke={p} strokeWidth="3.4" />
        <path d="M12.5 34V15.5a3 3 0 0 1 3-3H34" stroke={a} strokeWidth="1.6" />
        <rect x="2.5" y="2.5" width="8" height="8" rx="2" fill={a} stroke={p} strokeWidth="1" />
      </g>
    ),
    edgeScale: 2.0,
    top: ({ s, a, uid }) => (
      <g strokeLinejoin="round">
        <defs>
          <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff4c2" />
            <stop offset="0.45" stopColor="#f5c542" />
            <stop offset="1" stopColor="#a8740c" />
          </linearGradient>
        </defs>
        <path d="M12.5 8.5H7.5c0 5.5 2.6 8.6 6.4 9.2M27.5 8.5h5c0 5.5-2.6 8.6-6.4 9.2" fill="none" stroke="#c99a1e" strokeWidth="2" />
        <path d="M12 5.5h16v6.5c0 6.2-3.6 10.4-8 10.4s-8-4.2-8-10.4z" fill={`url(#${uid}-gold)`} stroke="#7a5408" strokeWidth="1" />
        <path d="M20 9.2l1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3z" fill="#fff8dc" />
        <path d="M18 22.2h4v4.6h-4z" fill={`url(#${uid}-gold)`} stroke="#7a5408" strokeWidth="0.8" />
        <path d="M13.5 26.8h13l1 3.4h-15z" fill={`url(#${uid}-gold)`} stroke="#7a5408" strokeWidth="0.8" />
        <rect x="10.5" y="30.2" width="19" height="5" rx="1" fill={s} stroke={a} strokeWidth="1" />
        <path d="M14 32.7h12" stroke={a} strokeWidth="1" strokeDasharray="1.5 1.2" />
      </g>
    ),
    bottom: ({ p, s, a, uid }) => (
      <g>
        <defs>
          <linearGradient id={`${uid}-plate`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8fafc" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <path d="M4 20c2-5 4-7 7-8M4 20c2 5 4 7 7 8" fill="none" stroke={p} strokeWidth="1.2" />
        <path d="M36 20c-2-5-4-7-7-8M36 20c-2 5-4 7-7 8" fill="none" stroke={p} strokeWidth="1.2" />
        {[[6, 15], [5, 20], [6, 25], [34, 15], [35, 20], [34, 25]].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.6" ry="0.9" fill={p} transform={`rotate(${x < 20 ? -35 : 35} ${x} ${y})`} />
        ))}
        <rect x="9.5" y="14" width="21" height="12" rx="2" fill={`url(#${uid}-plate)`} stroke={s} strokeWidth="1.2" />
        <path d="M13 18.5h14M15 22h10" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="11.8" cy="16.2" r="0.8" fill={a} />
        <circle cx="28.2" cy="16.2" r="0.8" fill={a} />
      </g>
    ),
    side: ({ p, s, a }) => (
      <g>
        <rect x="12.5" y="4" width="15" height="32" rx="3.5" fill={s} stroke={p} strokeWidth="1.6" />
        {[10, 16, 22, 28].map((y, i) => (
          <rect key={y} x="16" y={y} width="8" height="3.4" rx="1" fill={a} opacity={i === 3 ? 0.35 : 1} />
        ))}
      </g>
    ),
    sideScale: 1.5,
    quarter: ({ p, a }) => (
      <g>
        <circle cx="20" cy="20" r="9" fill={a} stroke={p} strokeWidth="2.4" />
        <circle cx="17" cy="17" r="2.6" fill="#fff" opacity="0.7" />
      </g>
    ),
    quarterScale: 0.6,
    bandLine: f => ({ color: f.accent, width: 1.2 }),
    animated: ['corner', 'side', 'quarter']
  },

  /* Electric — lightning bolts, power cores, high-voltage signs and arcs */
  electric: {
    cornerScale: 1.75,
    corner: ({ p, s, a }) => (
      <g strokeLinejoin="round" strokeLinecap="round">
        <path d="M3 30l6-6-3-2 7-8" fill="none" stroke={p} strokeWidth="1.4" />
        <path d="M30 3l-6 6-2-3-8 7" fill="none" stroke={p} strokeWidth="1.4" />
        <path d="M24 4L10 21h8.5L13 36l17-20h-8.8z" fill={a} stroke={s} strokeWidth="1.6" />
        <path d="M21 9l-6 8" stroke="#fff9c4" strokeWidth="1.1" />
      </g>
    ),
    edgeScale: 1.85,
    top: ({ p, s, a }) => (
      <g strokeLinejoin="round">
        <circle cx="20" cy="20" r="15" fill={s} stroke={p} strokeWidth="2" />
        <circle cx="20" cy="20" r="11" fill="none" stroke={a} strokeWidth="1" strokeDasharray="2 2.2" />
        <path d="M22.5 9.5L14 21.5h6l-3 9 9.5-12.5h-6z" fill={a} stroke={s} strokeWidth="0.8" />
      </g>
    ),
    bottom: ({ s, a }) => (
      <g strokeLinejoin="round">
        <path d="M20 4L37 34H3z" fill={a} stroke={s} strokeWidth="2.2" />
        <path d="M21.5 13l-6 10h4.5l-2 7.5 7-10h-4.5z" fill={s} />
      </g>
    ),
    side: ({ p, a }) => (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 2l-5 7 6 4-6 6 7 5-6 6 5 8" stroke={a} strokeWidth="2.2" />
        <path d="M23 4l-3 6 5 3-5 7 5 4-4 7 3 6" stroke={p} strokeWidth="1.1" />
        <circle cx="20" cy="2.5" r="2" fill={a} />
        <circle cx="20" cy="37.5" r="2" fill={a} />
      </g>
    ),
    sideScale: 1.6,
    quarter: ({ a }) => <path d={star4(20, 20, 13, 0.18)} fill={a} />,
    quarterScale: 0.7,
    bandLine: f => ({ color: f.accent, style: 'dashed', width: 1.2 }),
    animated: ['corner', 'edge', 'side', 'quarter']
  },

  /* Venom — acid slime, poison flask, skull mark and venom drops */
  venom: {
    cornerScale: 1.9,
    corner: ({ p, a }) => (
      <g>
        <path
          d="M2 2h36c-2 4-5 4-7 7-1.5 2.5-4.5 2.5-5.2-.5-.6-2.6-3.6-2.6-4.4.6-1 5-3 9-6 9.4-2.6.3-3.4-3.6-4.6-6.4-1-2.4-4-1.6-4 1.6v10.6c0 3.2-2.5 3.4-3 .2-.5-4-1.8-6-1.8-9.5z"
          fill={p}
        />
        <path d="M2 2h36c-2 4-5 4-7 7" fill="none" stroke="#ecfccb" strokeWidth="1" opacity="0.6" />
        <circle cx="18.6" cy="17.6" r="2.2" fill={p} />
        <circle cx="10" cy="27" r="1.8" fill={p} />
        <circle cx="12" cy="7" r="2.2" fill={a} opacity="0.85" />
        <circle cx="24" cy="6" r="1.3" fill="#ecfccb" opacity="0.8" />
      </g>
    ),
    edgeScale: 2.0,
    top: ({ p, s, a }) => (
      <g strokeLinejoin="round">
        <path d="M16.5 3.5h7v9.2c5 1.6 8.5 6 8.5 11.3 0 6.8-5.4 12-12 12s-12-5.2-12-12c0-5.3 3.5-9.7 8.5-11.3z" fill={s} stroke={p} strokeWidth="1.6" />
        <path d="M9.3 24.5c3-1.8 6.8 1.6 10.7 0s7.7-1.8 10.7 0c-.5 6.1-5.2 10.4-10.7 10.4S9.8 30.6 9.3 24.5z" fill={p} />
        <rect x="15" y="2" width="10" height="3" rx="1" fill={a} />
        <circle cx="16" cy="28.5" r="1.6" fill="#ecfccb" />
        <circle cx="23" cy="31" r="1.1" fill="#ecfccb" />
        <circle cx="21" cy="19" r="1.3" fill={p} opacity="0.85" />
        <circle cx="18" cy="15" r="0.9" fill={p} opacity="0.7" />
      </g>
    ),
    bottom: ({ p, s, a }) => (
      <g strokeLinecap="round">
        <path d="M7 26l26 11M33 26L7 37" stroke={p} strokeWidth="3.2" />
        {[[6, 25], [8, 28], [34, 25], [32, 28], [6, 38], [8, 35], [34, 38], [32, 35]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={p} />
        ))}
        <path d="M20 4c-7.2 0-11.5 4.8-11.5 10.8 0 3.9 1.9 6.4 4.3 7.6v4.1h14.4v-4.1c2.4-1.2 4.3-3.7 4.3-7.6C31.5 8.8 27.2 4 20 4z" fill={p} stroke={s} strokeWidth="1.2" />
        <circle cx="15.4" cy="15" r="3" fill={s} />
        <circle cx="24.6" cy="15" r="3" fill={s} />
        <circle cx="15.4" cy="15" r="1" fill={a} />
        <circle cx="24.6" cy="15" r="1" fill={a} />
        <path d="M20 18.5l-1.6 2.6h3.2z" fill={s} />
        <path d="M16.5 23.2v3M20 23.2v3M23.5 23.2v3" stroke={s} strokeWidth="1" />
      </g>
    ),
    side: ({ p, s, a, uid }) => (
      <g>
        <defs>
          <radialGradient id={`${uid}-drop`} cx="0.4" cy="0.55" r="0.7">
            <stop offset="0" stopColor="#f0abfc" />
            <stop offset="0.5" stopColor={a} />
            <stop offset="1" stopColor="#4a044e" />
          </radialGradient>
        </defs>
        <path d="M20 3c5 8 10.5 13.6 10.5 20.5a10.5 10.5 0 0 1-21 0C9.5 16.6 15 11 20 3z" fill={`url(#${uid}-drop)`} stroke={p} strokeWidth="1.6" />
        <path d="M15.5 22c0-3 1.5-6 3-8" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
        <circle cx="20" cy="26" r="2" fill={s} opacity="0.4" />
      </g>
    ),
    sideScale: 1.6,
    quarter: ({ p }) => (
      <g fill="none" stroke={p}>
        <circle cx="16" cy="22" r="7" strokeWidth="2.4" />
        <circle cx="27" cy="12" r="4" strokeWidth="2" />
        <circle cx="14" cy="20" r="1.6" fill="#ecfccb" stroke="none" />
      </g>
    ),
    quarterScale: 0.7,
    bandLine: f => ({ color: f.primary, style: 'dotted', width: 2 }),
    animated: ['edge', 'side', 'quarter']
  },

  /* Stone & Gem — crystal clusters, a brilliant-cut sapphire, emerald step-cut and agate geodes */
  geode: {
    cornerScale: 1.8,
    corner: ({ p, s, a }) => (
      <g strokeLinejoin="round">
        <path d="M2 14l5-9 9-3 9 4 2 8-6 7-9 4-7-3z" fill={s} stroke="#16171a" strokeWidth="1" />
        <path d="M5 13l4-6 6-2" fill="none" stroke="#9ca3af" strokeWidth="0.8" opacity="0.6" />
        {/* amethyst */}
        <path d="M8 18L2.5 4.5 13 10z" fill={a} stroke="#3b0764" strokeWidth="0.8" />
        <path d="M2.5 4.5L9 12.5" stroke="#e9d5ff" strokeWidth="0.7" opacity="0.8" />
        {/* sapphire */}
        <path d="M13 15L6 2l14 6z" fill={p} stroke="#172554" strokeWidth="0.8" />
        <path d="M6 2l7.5 9" stroke="#dbeafe" strokeWidth="0.7" opacity="0.85" />
        {/* emerald */}
        <path d="M17 19L19 4l6 11z" fill="#10b981" stroke="#064e3b" strokeWidth="0.8" />
        <path d="M19 4l0.5 12" stroke="#d1fae5" strokeWidth="0.6" opacity="0.8" />
      </g>
    ),
    edgeScale: 1.95,
    top: ({ p, s, uid }) => (
      <g strokeLinejoin="round">
        <defs>
          <radialGradient id={`${uid}-sap`} cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#bfdbfe" />
            <stop offset="0.45" stopColor={p} />
            <stop offset="1" stopColor="#172554" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="16" fill={s} stroke="#16171a" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="13.5" fill="none" stroke="#9ca3af" strokeWidth="0.8" opacity="0.5" />
        <polygon points="14.5,8 25.5,8 32,14.5 32,25.5 25.5,32 14.5,32 8,25.5 8,14.5" fill={`url(#${uid}-sap)`} stroke="#0b1a3d" strokeWidth="0.9" />
        <polygon points="16,13 24,13 27,16 27,24 24,27 16,27 13,24 13,16" fill="none" stroke="#dbeafe" strokeWidth="0.6" opacity="0.7" />
        <path d="M14.5 8L16 13M25.5 8L24 13M32 14.5L27 16M32 25.5L27 24M25.5 32L24 27M14.5 32L16 27M8 25.5L13 24M8 14.5L13 16" stroke="#dbeafe" strokeWidth="0.5" opacity="0.6" />
        <path d="M15 14l4 0-3 4z" fill="#fff" opacity="0.65" />
        {[[20, 4.5], [35.5, 20], [20, 35.5], [4.5, 20]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill="#d1d5db" stroke="#16171a" strokeWidth="0.5" />
        ))}
      </g>
    ),
    bottom: ({ s, uid }) => (
      <g strokeLinejoin="round">
        <defs>
          <linearGradient id={`${uid}-em`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6ee7b7" />
            <stop offset="0.5" stopColor="#059669" />
            <stop offset="1" stopColor="#022c22" />
          </linearGradient>
        </defs>
        <rect x="5" y="9" width="30" height="22" rx="4" fill={s} stroke="#16171a" strokeWidth="1.2" />
        <polygon points="11,12 29,12 32,15 32,25 29,28 11,28 8,25 8,15" fill={`url(#${uid}-em)`} stroke="#022c22" strokeWidth="0.9" />
        <polygon points="14,15.5 26,15.5 28,17.5 28,22.5 26,24.5 14,24.5 12,22.5 12,17.5" fill="none" stroke="#d1fae5" strokeWidth="0.6" opacity="0.7" />
        <path d="M11 12l3 3.5M29 12l-3 3.5M32 25l-4-2.5M8 25l4-2.5" stroke="#d1fae5" strokeWidth="0.5" opacity="0.6" />
        <path d="M13 14h6l-2 2h-4z" fill="#fff" opacity="0.5" />
      </g>
    ),
    side: ({ s, a }) => (
      <g strokeLinejoin="round">
        <path d="M20 3c8 0 13 7 13 17s-5 17-13 17S7 30 7 20 12 3 20 3z" fill={s} stroke="#16171a" strokeWidth="1.2" />
        <path d="M20 6.5c6 0 10 6 10 13.5s-4 13.5-10 13.5S10 27.5 10 20 14 6.5 20 6.5z" fill="#e9d5ff" />
        <path d="M20 9c4.8 0 8 5 8 11s-3.2 11-8 11-8-5-8-11 3.2-11 8-11z" fill="#c084fc" />
        <path d="M20 12c3.4 0 5.6 3.6 5.6 8s-2.2 8-5.6 8-5.6-3.6-5.6-8 2.2-8 5.6-8z" fill={a} />
        <path d="M20 15l2.4 3-2.4 2 2.4 3-2.4 3-2.4-3 2.4-3-2.4-2z" fill="#f3e8ff" opacity="0.85" />
        <circle cx="17" cy="14.5" r="1" fill="#fff" opacity="0.8" />
      </g>
    ),
    sideScale: 1.6,
    quarter: ({ a }) => (
      <g>
        <circle cx="20" cy="20" r="9" fill="#d1d5db" stroke="#16171a" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="6" fill={a} />
        <circle cx="18" cy="18" r="2" fill="#fff" opacity="0.7" />
      </g>
    ),
    quarterScale: 0.62,
    bandLine: f => ({ color: f.innerLine, width: 1 }),
    animated: ['edge', 'quarter']
  },

  /* Staunton — mahogany with brass caps and medallions */
  staunton: {
    cornerScale: 1.55,
    corner: ({ p, s, a, uid }) => (
      <g>
        <defs>{goldGrad(`${uid}-brass`, a, p)}</defs>
        <path d="M3 3h30v8H11v22H3z" fill={`url(#${uid}-brass)`} stroke={s} strokeWidth="1.2" />
        <circle cx="7" cy="7" r="1.8" fill={s} />
        <circle cx="27" cy="7" r="1.4" fill={s} />
        <circle cx="7" cy="27" r="1.4" fill={s} />
      </g>
    ),
    edgeScale: 1.45,
    top: ({ p, s, a, uid }) => (
      <g>
        <defs>{goldGrad(`${uid}-medal`, a, p)}</defs>
        <ellipse cx="20" cy="20" rx="15" ry="11" fill={`url(#${uid}-medal)`} stroke={s} strokeWidth="1.4" />
        <ellipse cx="20" cy="20" rx="10.5" ry="7" fill="none" stroke={s} strokeWidth="1" opacity="0.7" />
        {/* Knight silhouette */}
        <path d="M17 26h8l-.8-2.4c1.8-1.6 2.4-4 1.4-6.6-1-2.6-3.6-4-6.4-3.6l-1.2-1.4-.6 2c-1.6 1-2.6 2.6-2.8 4.2l2.4.6 1.6-1.2c.4 1.4-.4 3-1.6 4.4z" fill={s} />
      </g>
    ),
    side: ({ p, s, a, uid }) => (
      <g>
        <defs>{goldGrad(`${uid}-dia`, a, p)}</defs>
        <path d="M20 5l10 15-10 15-10-15z" fill={`url(#${uid}-dia)`} stroke={s} strokeWidth="1.2" />
        <circle cx="20" cy="20" r="3" fill={s} />
      </g>
    ),
    sideScale: 1.35,
    bandLine: f => ({ color: f.primary, width: 1 })
  },

  /* Electric Geometric — chevrons and charged hex nodes */
  geometric: {
    cornerScale: 1.6,
    corner: ({ p, s, a }) => (
      <g>
        <path d="M2 2h30L2 32z" fill={s} stroke={p} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 8h13L8 21z" fill={p} />
        <path d="M2 38L38 2" stroke={a} strokeWidth="0.8" opacity="0.7" />
      </g>
    ),
    edgeScale: 1.45,
    top: ({ p, s, a }) => (
      <g>
        <polygon points={hexPoints(20, 20, 15)} fill={s} stroke={p} strokeWidth="2" />
        <polygon points={hexPoints(20, 20, 7)} fill={a} />
        <polygon points={hexPoints(20, 20, 3)} fill={p} />
      </g>
    ),
    side: ({ p, s, a }) => (
      <g>
        <polygon points={hexPoints(20, 20, 12)} fill={s} stroke={p} strokeWidth="2" />
        <polygon points={hexPoints(20, 20, 4.5)} fill={a} />
      </g>
    ),
    sideScale: 1.25,
    bandLine: f => ({ color: f.primary, style: 'dashed', width: 1 }),
    animated: ['edge', 'side']
  },

  /* Hardwood — dovetail joints, oak leaves and acorns */
  hardwood: {
    cornerScale: 1.35,
    corner: ({ p, s }) => (
      <g>
        <rect x="3" y="3" width="34" height="34" rx="4" fill={p} stroke={s} strokeWidth="1.5" />
        <path d="M3 12h9l3-4h7l3 4h12M3 24h9l3 4h7l3-4h12" fill="none" stroke={s} strokeWidth="1.3" opacity="0.65" />
        <path d="M7 18c8-2 18 2 26 0" fill="none" stroke={s} strokeWidth="0.8" opacity="0.4" />
      </g>
    ),
    edgeScale: 1.6,
    top: ({ s, a }) => (
      <g>
        <path d="M20 4c3 3 2 5 5 5s4 3 3 5 3 3 1 6-4 1-4 4-3 5-5 5c-2 0-3-3-5-5s-4-1-4-4-3-4-1-6 0-5 3-5 2-2 5-5z" fill={a} stroke={s} strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M20 8v28M20 16l-5-3M20 16l5-3M20 23l-6-3M20 23l6-3" stroke={s} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      </g>
    ),
    side: ({ p, s }) => (
      <g>
        <ellipse cx="20" cy="24" rx="7.5" ry="9" fill={p} stroke={s} strokeWidth="1.3" />
        <path d="M11 17c0-4 4-6 9-6s9 2 9 6z" fill={s} />
        <path d="M20 11V6" stroke={s} strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
    sideScale: 1.35,
    bandLine: f => ({ color: 'rgba(0,0,0,0.35)', width: 1 })
  },

  /* Minimal — pin dots and hairline ticks */
  hairline: {
    cornerScale: 0.8,
    corner: ({ p }) => <circle cx="20" cy="20" r="4.5" fill={p} />,
    edgeScale: 0.9,
    top: ({ p }) => <path d="M10 20h20" stroke={p} strokeWidth="2" strokeLinecap="round" />,
    side: ({ p }) => <path d="M20 10v20" stroke={p} strokeWidth="2" strokeLinecap="round" />,
    sideScale: 0.9
  },

  /* Cyberpunk — circuit traces, nodes and data chips */
  circuit: {
    cornerScale: 1.8,
    corner: ({ p, s, a }) => (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 38V15L15 5h23" stroke={p} strokeWidth="2.2" />
        <path d="M11 38V19l8-8h19" stroke={s} strokeWidth="1.4" />
        <circle cx="15" cy="5" r="2.6" fill={a} stroke={p} strokeWidth="1" />
        <circle cx="5" cy="15" r="2.2" fill={p} />
        <circle cx="19" cy="11" r="1.8" fill={s} />
      </g>
    ),
    edgeScale: 1.55,
    top: ({ p, s, a }) => (
      <g>
        {[13, 18, 23, 28].map(x => (
          <path key={x} d={`M${x} 8v4M${x} 28v4`} stroke={p} strokeWidth="1.6" strokeLinecap="round" />
        ))}
        <rect x="9" y="12" width="22" height="16" rx="2" fill="#0a0820" stroke={p} strokeWidth="1.6" />
        <rect x="14" y="16.5" width="12" height="7" rx="1" fill={s} />
        <circle cx="12" cy="15" r="1" fill={a} />
      </g>
    ),
    side: ({ p, s }) => (
      <g>
        {[13, 18, 23, 28].map(y => (
          <path key={y} d={`M8 ${y}h4M28 ${y}h4`} stroke={p} strokeWidth="1.6" strokeLinecap="round" />
        ))}
        <rect x="12" y="9" width="16" height="22" rx="2" fill="#0a0820" stroke={p} strokeWidth="1.6" />
        <rect x="16.5" y="14" width="7" height="12" rx="1" fill={s} />
      </g>
    ),
    sideScale: 1.45,
    quarter: ({ p, a }) => <circle cx="20" cy="20" r="5" fill={a} stroke={p} strokeWidth="2" />,
    quarterScale: 0.75,
    bandLine: f => ({ color: f.secondary, style: 'dashed', width: 1 }),
    animated: ['corner', 'edge', 'side', 'quarter']
  },

  /* Glass — faceted crystal clusters and prisms */
  crystal: {
    cornerScale: 1.7,
    corner: ({ p, s, a }) => (
      <g stroke={a} strokeWidth="0.8" strokeLinejoin="round">
        <path d="M4 4l14 4 6 10-10 6-10-6z" fill={s} fillOpacity="0.75" />
        <path d="M4 4l14 4-4 16z" fill={a} fillOpacity="0.8" />
        <path d="M18 8l14-2-4 14-4-2z" fill={p} fillOpacity="0.85" />
        <path d="M8 18l6 6-2 12-6-10z" fill={p} fillOpacity="0.7" />
      </g>
    ),
    edgeScale: 1.5,
    top: ({ p, s, a }) => (
      <g stroke={a} strokeWidth="0.9" strokeLinejoin="round">
        <path d="M20 4l14 16-14 16L6 20z" fill={s} fillOpacity="0.7" />
        <path d="M20 4l6 16-6 16-6-16z" fill={p} fillOpacity="0.9" />
        <path d="M6 20h28" />
        <path d="M20 4l-6 16" fill="none" />
      </g>
    ),
    side: ({ p, s, a }) => (
      <g stroke={a} strokeWidth="0.9" strokeLinejoin="round">
        <path d="M20 6l9 14-9 14-9-14z" fill={s} fillOpacity="0.7" />
        <path d="M20 6l4 14-4 14-4-14z" fill={p} fillOpacity="0.9" />
      </g>
    ),
    sideScale: 1.3,
    bandLine: () => ({ color: 'rgba(255,255,255,0.7)', width: 1 }),
    animated: ['edge']
  },

  /* Royal — fleur-de-lis, crowns, ruby cabochons and gold studs */
  royal: {
    cornerScale: 1.75,
    corner: ({ p, s, a, uid }) => (
      <g>
        <defs>{goldGrad(`${uid}-fl`, '#fff1b8', p)}</defs>
        <g transform="rotate(-45 20 20)" fill={`url(#${uid}-fl)`} stroke={s} strokeWidth="1" strokeLinejoin="round">
          <path d="M20 3c4.4 6 5.4 11.5 0 19-5.4-7.5-4.4-13 0-19z" />
          <path d="M18 22c-6.5 0-12.5-4-12.5-10 0-4.2 4.6-5.2 6.8-2-3.3 1-3 5.4 1.2 6.4 2.4.8 4 3 4.5 5.6z" />
          <path d="M22 22c6.5 0 12.5-4 12.5-10 0-4.2-4.6-5.2-6.8-2 3.3 1 3 5.4-1.2 6.4-2.4.8-4 3-4.5 5.6z" />
          <rect x="11" y="21.5" width="18" height="4.5" rx="1.6" />
          <path d="M16.5 26L20 37l3.5-11z" />
        </g>
        <circle cx="20" cy="20" r="2.4" fill={a} stroke={s} strokeWidth="0.8" />
      </g>
    ),
    edgeScale: 2.05,
    top: ({ p, s, a, uid }) => (
      <g>
        <defs>{goldGrad(`${uid}-cr`, '#fff1b8', p)}</defs>
        <g fill={`url(#${uid}-cr)`} stroke={s} strokeWidth="1.1" strokeLinejoin="round">
          <path d="M7 30L5 12l8.5 8L20 7l6.5 13L35 12l-2 18z" />
          <rect x="6.5" y="29" width="27" height="5.5" rx="1.4" />
          <circle cx="5" cy="11" r="2.2" />
          <circle cx="20" cy="6" r="2.4" />
          <circle cx="35" cy="11" r="2.2" />
        </g>
        <circle cx="20" cy="23.5" r="2.8" fill={a} stroke={s} strokeWidth="0.8" />
        <circle cx="12.5" cy="25.5" r="1.6" fill="#2563eb" stroke={s} strokeWidth="0.6" />
        <circle cx="27.5" cy="25.5" r="1.6" fill="#2563eb" stroke={s} strokeWidth="0.6" />
        <path d="M10 31.8h20" stroke={a} strokeWidth="1.2" strokeDasharray="1.6 1.6" />
      </g>
    ),
    side: ({ p, s, a, uid }) => (
      <g>
        <defs>
          {goldGrad(`${uid}-bz`, '#fff1b8', p)}
          <radialGradient id={`${uid}-rb`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#ff8aa0" />
            <stop offset="0.45" stopColor={a} />
            <stop offset="1" stopColor="#4c0519" />
          </radialGradient>
        </defs>
        <ellipse cx="20" cy="20" rx="10" ry="14" fill={`url(#${uid}-bz)`} stroke={s} strokeWidth="1.1" />
        <ellipse cx="20" cy="20" rx="6.5" ry="10" fill={`url(#${uid}-rb)`} stroke={s} strokeWidth="0.7" />
        <ellipse cx="18" cy="15.5" rx="1.8" ry="3" fill="#fff" opacity="0.55" />
      </g>
    ),
    sideScale: 1.6,
    quarter: ({ p, s, a }) => (
      <g>
        <circle cx="20" cy="20" r="9" fill={p} stroke={s} strokeWidth="1.4" />
        <circle cx="20" cy="20" r="4.2" fill={a} />
      </g>
    ),
    quarterScale: 0.85,
    bandLine: f => ({ color: f.secondary, width: 1.2 })
  },

  /* 8-bit arcade — pixel hearts, coins and stars */
  pixel: {
    cornerScale: 1.4,
    uprightCorners: true,
    corner: ({ s, a }) =>
      pixelArt([' XX XX ', 'XWXXXXX', 'XXXXXXX', ' XXXXX ', '  XXX  ', '   X   '], { X: s, W: a }),
    edgeScale: 1.4,
    top: ({ p }) =>
      pixelArt(['  YYYY  ', ' YWYYYO ', ' YWYYYO ', ' YWYYYO ', ' YWYYYO ', ' YYYYYO ', '  OOOO  '], { Y: p, W: '#fff7ae', O: '#b45309' }),
    side: ({ p }) =>
      pixelArt(['   X   ', '   X   ', 'XXXXXXX', ' XXXXX ', '  XXX  ', ' XX XX ', 'X     X'], { X: p }),
    sideScale: 1.3,
    quarter: ({ a }) => pixelArt(['X'], { X: a }, 12),
    quarterScale: 0.6,
    bandLine: f => ({ color: f.primary, style: 'dotted', width: 2 }),
    animated: ['side', 'quarter']
  },

  /* Shadow Realm — carved stone medallions, watchtower arches and oculus windows */
  gothic: {
    cornerScale: 1.5,
    corner: ({ p, s, a }) => (
      <g stroke={p} strokeWidth="1.3">
        <rect x="4" y="4" width="32" height="32" rx="2" fill={s} />
        <g fill={s}>
          <circle cx="20" cy="12.5" r="6" />
          <circle cx="20" cy="27.5" r="6" />
          <circle cx="12.5" cy="20" r="6" />
          <circle cx="27.5" cy="20" r="6" />
        </g>
        <circle cx="20" cy="20" r="5" fill={a} stroke="none" />
        <path d="M20 4v6M20 30v6M4 20h6M30 20h6" />
      </g>
    ),
    edgeScale: 1.85,
    top: ({ p, s, a }) => (
      <g strokeLinejoin="round">
        <path d="M11 37V21Q11 11 20 3q9 8 9 18v16z" fill={s} stroke={p} strokeWidth="1.4" />
        <path d="M15 35V22q0-6.5 5-11.5 5 5 5 11.5v13z" fill={a} />
        <path d="M20 12V35" stroke={s} strokeWidth="1.2" />
        <circle cx="20" cy="18" r="2.2" fill={p} />
      </g>
    ),
    side: ({ p, s, a }) => (
      <g>
        <circle cx="20" cy="20" r="13" fill={s} stroke={p} strokeWidth="1.5" />
        <circle cx="20" cy="20" r="9.5" fill={a} />
        {Array.from({ length: 8 }, (_, k) => {
          const ang = (Math.PI / 4) * k;
          return <path key={k} d={`M20 20L${20 + 9.5 * Math.cos(ang)} ${20 + 9.5 * Math.sin(ang)}`} stroke={s} strokeWidth="1.3" />;
        })}
        <circle cx="20" cy="20" r="3" fill={p} />
      </g>
    ),
    sideScale: 1.55,
    bandLine: f => ({ color: f.innerLine, width: 1 })
  },

  /* Gunmetal — hex bolts, hazard plates and rivets */
  industrial: {
    cornerScale: 1.25,
    corner: ({ p, s, uid }) => (
      <g>
        <defs>
          <linearGradient id={`${uid}-bolt`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f1f5f9" />
            <stop offset="0.5" stopColor={p} />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
        </defs>
        <polygon points={hexPoints(20, 20, 14)} fill={`url(#${uid}-bolt)`} stroke={s} strokeWidth="1.6" />
        <circle cx="20" cy="20" r="7" fill="none" stroke={s} strokeWidth="1.2" opacity="0.6" />
        <path d="M15 20h10M20 15v10" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      </g>
    ),
    edgeScale: 1.25,
    top: ({ s, a, uid }) => (
      <g>
        <defs>
          <pattern id={`${uid}-haz`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="3" height="6" fill={a} />
            <rect x="3" width="3" height="6" fill={s} />
          </pattern>
        </defs>
        <rect x="3" y="12" width="34" height="16" rx="2" fill={`url(#${uid}-haz)`} stroke={s} strokeWidth="1.6" />
      </g>
    ),
    side: ({ p, s, uid }) => (
      <g>
        <defs>
          <linearGradient id={`${uid}-sb`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
        </defs>
        <polygon points={hexPoints(20, 20, 11)} fill={`url(#${uid}-sb)`} stroke={s} strokeWidth="1.5" />
        <path d="M16 20h8" stroke={s} strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="1" fill={p} />
      </g>
    ),
    sideScale: 1.1,
    quarter: ({ s }) => (
      <g>
        <circle cx="20" cy="20" r="8" fill="#94a3b8" stroke={s} strokeWidth="2" />
        <circle cx="18" cy="18" r="2.5" fill="#f1f5f9" opacity="0.7" />
      </g>
    ),
    quarterScale: 0.55,
    bandLine: () => ({ color: 'rgba(0,0,0,0.45)', width: 1 })
  },

  /* Ruby — brilliant-cut corners, marquise gems, gold prongs */
  ruby: {
    cornerScale: 1.55,
    corner: ({ p, s, a }) => (
      <g strokeLinejoin="round">
        <polygon points="13,4 27,4 36,13 36,27 27,36 13,36 4,27 4,13" fill={s} stroke={a} strokeWidth="1.8" />
        <polygon points="15,9 25,9 31,15 31,25 25,31 15,31 9,25 9,15" fill={p} />
        <path d="M15 9l5 11 5-11M31 15l-11 5 11 5M25 31l-5-11-5 11M9 25l11-5-11-5" stroke="#ffd1da" strokeWidth="0.7" fill="none" opacity="0.8" />
        <polygon points="17,15 23,15 25,20 20,23 15,20" fill="#ffd1da" opacity="0.55" />
        {[[13, 4], [36, 13], [27, 36], [4, 27]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={a} />
        ))}
      </g>
    ),
    edgeScale: 1.6,
    top: ({ p, s, a }) => (
      <g strokeLinejoin="round">
        <path d="M3 20Q20 4 37 20 20 36 3 20z" fill={a} />
        <path d="M7 20Q20 8 33 20 20 32 7 20z" fill={p} stroke={s} strokeWidth="1" />
        <path d="M7 20h26M20 10.5v19M13 15l14 10M27 15L13 25" stroke="#ffd1da" strokeWidth="0.6" opacity="0.75" />
      </g>
    ),
    side: ({ p, s, a }) => (
      <g strokeLinejoin="round">
        <path d="M20 4Q34 20 20 36 6 20 20 4z" fill={a} />
        <path d="M20 8Q30 20 20 32 10 20 20 8z" fill={p} stroke={s} strokeWidth="1" />
        <path d="M20 8v24M12.5 20h15" stroke="#ffd1da" strokeWidth="0.6" opacity="0.75" />
      </g>
    ),
    sideScale: 1.45,
    quarter: ({ s, a }) => (
      <g>
        <circle cx="20" cy="20" r="8" fill={a} stroke={s} strokeWidth="1.5" />
        <circle cx="18" cy="18" r="2.6" fill="#fff" opacity="0.6" />
      </g>
    ),
    quarterScale: 0.6,
    bandLine: f => ({ color: f.accent, width: 1 })
  },

  /* Imperial Jade — ruyi cloud scrolls, bi discs and pearls */
  jade: {
    cornerScale: 1.6,
    corner: ({ p, s }) => (
      <g>
        <g transform="rotate(-45 20 20)">
          <path
            d="M20 6c6.5 0 10 4.5 8 9.5 5.5-1 8.5 4.5 4.5 8.5-3 3-7 1-8-1.5L20 33l-4.5-10.5c-1 2.5-5 4.5-8 1.5-4-4-1-9.5 4.5-8.5-2-5 1.5-9.5 8-9.5z"
            fill={s}
            stroke="#6b4e12"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d="M14 15c2-3 10-3 12 0" fill="none" stroke="#6b4e12" strokeWidth="1" />
        </g>
        <circle cx="20" cy="20" r="3.4" fill={p} stroke="#6b4e12" strokeWidth="0.6" />
      </g>
    ),
    edgeScale: 1.6,
    top: ({ p, s, a, uid }) => (
      <g>
        <defs>
          <radialGradient id={`${uid}-bi`} cx="0.35" cy="0.3" r="0.9">
            <stop offset="0" stopColor="#d1fae5" />
            <stop offset="0.5" stopColor={a} />
            <stop offset="1" stopColor="#047857" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="14" fill={`url(#${uid}-bi)`} stroke={s} strokeWidth="1.8" />
        <circle cx="20" cy="20" r="5" fill="#08442f" stroke={s} strokeWidth="1.4" />
        <circle cx="20" cy="20" r="9.5" fill="none" stroke="#ecfdf5" strokeWidth="0.6" strokeDasharray="1.5 2" opacity="0.8" />
        <circle cx="4" cy="20" r="2.4" fill={p} />
        <circle cx="36" cy="20" r="2.4" fill={p} />
      </g>
    ),
    side: ({ p, s }) => (
      <g>
        {[9, 20, 31].map(y => (
          <g key={y}>
            <circle cx="20" cy={y} r="5" fill={p} stroke={s} strokeWidth="0.8" />
            <circle cx="18.6" cy={y - 1.6} r="1.4" fill="#fff" opacity="0.8" />
          </g>
        ))}
      </g>
    ),
    sideScale: 1.5,
    quarter: ({ p, s }) => (
      <g>
        <circle cx="20" cy="20" r="9" fill={p} stroke={s} strokeWidth="1.2" />
        <circle cx="17" cy="17" r="3" fill="#fff" opacity="0.85" />
      </g>
    ),
    quarterScale: 0.6,
    bandLine: f => ({ color: f.secondary, width: 1 })
  },

  /* Noir Deco — sunburst fans, ziggurats and tick rails */
  noir: {
    cornerScale: 1.45,
    corner: ({ p }) => (
      <g fill="none" stroke={p}>
        {Array.from({ length: 6 }, (_, k) => {
          const ang = Math.PI + (Math.PI / 2) * (k / 5);
          return <path key={k} d={`M34 34L${34 + 30 * Math.cos(ang)} ${34 + 30 * Math.sin(ang)}`} strokeWidth="1.6" />;
        })}
        <path d="M34 22a12 12 0 0 0-12 12" strokeWidth="2" />
        <path d="M34 12a22 22 0 0 0-22 22" strokeWidth="1.2" />
        <rect x="2" y="2" width="8" height="8" fill={p} stroke="none" />
      </g>
    ),
    edgeScale: 1.3,
    top: ({ p }) => (
      <g fill={p}>
        <rect x="6" y="26" width="28" height="4" />
        <rect x="11" y="19" width="18" height="4" />
        <rect x="16" y="12" width="8" height="4" />
        <rect x="19" y="5" width="2" height="5" />
      </g>
    ),
    side: ({ p }) => (
      <g fill={p}>
        <rect x="11" y="8" width="3" height="24" />
        <rect x="18.5" y="4" width="3" height="32" />
        <rect x="26" y="8" width="3" height="24" />
      </g>
    ),
    sideScale: 1.2,
    quarter: ({ p }) => <rect x="17" y="8" width="6" height="24" fill={p} />,
    quarterScale: 0.6,
    bandLine: () => ({ color: '#ffffff', width: 1 })
  },

  /* Celestial — sun, crescent moon and twinkling stars */
  celestial: {
    cornerScale: 1.5,
    corner: ({ p, a }) => (
      <g>
        <path d={star4(20, 20, 15)} fill={p} />
        <path d={star4(20, 20, 6)} fill={a} />
      </g>
    ),
    edgeScale: 1.95,
    top: ({ p, uid }) => (
      <g>
        <defs>
          <radialGradient id={`${uid}-sun`} cx="0.4" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#fffbeb" />
            <stop offset="0.6" stopColor={p} />
            <stop offset="1" stopColor="#f59e0b" />
          </radialGradient>
        </defs>
        {Array.from({ length: 12 }, (_, k) => {
          const ang = (Math.PI / 6) * k;
          const tip = k % 2 === 0 ? 17 : 13.5;
          const w = 0.22;
          const x1 = 20 + 9 * Math.cos(ang - w);
          const y1 = 20 + 9 * Math.sin(ang - w);
          const x2 = 20 + 9 * Math.cos(ang + w);
          const y2 = 20 + 9 * Math.sin(ang + w);
          return <polygon key={k} points={`${x1},${y1} ${20 + tip * Math.cos(ang)},${20 + tip * Math.sin(ang)} ${x2},${y2}`} fill={p} />;
        })}
        <circle cx="20" cy="20" r="8.5" fill={`url(#${uid}-sun)`} />
      </g>
    ),
    bottom: ({ p, s }) => (
      <g>
        <path d="M24 5a15 15 0 1 0 11 24 12 12 0 1 1-11-24z" fill={p} />
        <path d={star4(30, 11, 4)} fill={s} />
      </g>
    ),
    side: ({ p, s }) => (
      <g>
        <path d={star4(20, 20, 13)} fill={s} />
        <circle cx="20" cy="20" r="2.4" fill={p} />
      </g>
    ),
    sideScale: 1.3,
    quarter: ({ p }) => <path d={star4(20, 20, 12)} fill={p} />,
    quarterScale: 0.65,
    bandLine: f => ({ color: f.primary, style: 'dotted', width: 1 }),
    animated: ['corner', 'side', 'quarter']
  }
};

interface BoardFrameProps {
  frame?: BoardFrameConfig;
  /** Disable ornament motion (battery saver). */
  still?: boolean;
  children: React.ReactNode;
}

export const BoardFrame: React.FC<BoardFrameProps> = React.memo(({ frame, still, children }) => {
  const uid = useId().replace(/:/g, '');
  if (!frame) return <>{children}</>;

  const baseSet: OrnamentSet = frame.ornament === 'none' ? {} : ORNAMENTS[frame.ornament];
  const parts = frame.parts || {};
  const set: OrnamentSet = {
    ...baseSet,
    corner: parts.corners === false ? undefined : baseSet.corner,
    top: parts.edges === false ? undefined : baseSet.top,
    bottom: parts.edges === false ? undefined : baseSet.bottom,
    side: parts.sides === false ? undefined : baseSet.side,
    quarter: parts.studs === false ? undefined : baseSet.quarter,
    bandLine:
      frame.bandLine === false
        ? undefined
        : baseSet.bandLine || (frame.ornament === 'none' ? f => ({ color: f.innerLine, width: 1 }) : undefined)
  };
  const t = frame.thickness ?? 4.5;
  const colors: OrnamentColors = { p: frame.primary, s: frame.secondary, a: frame.accent, uid };
  const motionClass = !still && frame.motion ? `board-orn-${frame.motion === 'shimmer' ? 'pulse' : frame.motion}` : '';
  const animated = new Set<'corner' | 'edge' | 'side' | 'quarter'>(
    frame.animateAll ? ['corner', 'edge', 'side', 'quarter'] : set.animated || []
  );

  // Ornament box size (as % of frame width) and its offset from the outer edge.
  // Large ornaments are pushed outward so they barely overlap the squares.
  const offsetFor = (size: number) => Math.min((t - size) / 2, t * 1.1 - size);

  const sizes = [
    set.corner ? t * (set.cornerScale ?? 1.4) : 0,
    set.top || set.bottom ? t * (set.edgeScale ?? 1.4) : 0,
    set.side ? t * (set.sideScale ?? 1.3) : 0,
    set.quarter ? t * (set.quarterScale ?? 0.7) : 0
  ];
  const protrusion = Math.max(0, ...sizes.filter(Boolean).map(sz => -offsetFor(sz)));

  const svg = (draw: Draw, key: string, animate: boolean) => (
    <svg
      viewBox="0 0 40 40"
      width="100%"
      height="100%"
      overflow="visible"
      aria-hidden="true"
      className={animate ? motionClass : undefined}
      style={animate && motionClass ? { animationDelay: `${(key.length * 0.37 + key.charCodeAt(key.length - 1) * 0.11) % 2.4}s` } : undefined}
    >
      {draw({ ...colors, uid: `${uid}-${key}` })}
    </svg>
  );

  const ornamentBox = (
    key: string,
    draw: Draw,
    size: number,
    place: React.CSSProperties,
    rotate = 0,
    kind: 'corner' | 'edge' | 'side' | 'quarter'
  ) => (
    <div
      key={key}
      className="absolute pointer-events-none"
      style={{
        width: `${size}%`,
        aspectRatio: '1 / 1',
        zIndex: 3,
        filter: frame.glow ? `drop-shadow(0 0 3px ${frame.glow})` : 'drop-shadow(0 1px 1.5px rgba(0,0,0,0.45))',
        ...place
      }}
    >
      <div className="w-full h-full" style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}>
        {svg(draw, key, animated.has(kind))}
      </div>
    </div>
  );

  const ornaments: React.ReactNode[] = [];

  if (set.corner) {
    const sz = sizes[0];
    const m = `${offsetFor(sz)}%`;
    const rot = (deg: number) => (set.uprightCorners ? 0 : deg);
    ornaments.push(
      ornamentBox('c-tl', set.corner, sz, { top: 0, left: 0, marginTop: m, marginLeft: m }, rot(0), 'corner'),
      ornamentBox('c-tr', set.corner, sz, { top: 0, right: 0, marginTop: m, marginRight: m }, rot(90), 'corner'),
      ornamentBox('c-br', set.corner, sz, { bottom: 0, right: 0, marginBottom: m, marginRight: m }, rot(180), 'corner'),
      ornamentBox('c-bl', set.corner, sz, { bottom: 0, left: 0, marginBottom: m, marginLeft: m }, rot(270), 'corner')
    );
  }

  if (set.top || set.bottom) {
    const sz = sizes[1];
    const m = `${offsetFor(sz)}%`;
    const top = set.top || set.bottom!;
    const bottom = set.bottom || set.top!;
    ornaments.push(
      ornamentBox('e-t', top, sz, { top: 0, left: `${50 - sz / 2}%`, marginTop: m }, 0, 'edge'),
      ornamentBox('e-b', bottom, sz, { bottom: 0, left: `${50 - sz / 2}%`, marginBottom: m }, 0, 'edge')
    );
  }

  if (set.side) {
    const sz = sizes[2];
    const m = `${offsetFor(sz)}%`;
    ornaments.push(
      ornamentBox('s-l', set.side, sz, { left: 0, top: '50%', marginLeft: m, transform: 'translateY(-50%)' }, 0, 'side'),
      ornamentBox('s-r', set.side, sz, { right: 0, top: '50%', marginRight: m, transform: 'translateY(-50%)' }, 0, 'side')
    );
  }

  if (set.quarter) {
    const sz = sizes[3];
    const m = `${offsetFor(sz)}%`;
    const along = [25, 75];
    along.forEach(pct => {
      ornaments.push(
        ornamentBox(`q-t${pct}`, set.quarter!, sz, { top: 0, left: `calc(${pct}% - ${sz / 2}%)`, marginTop: m }, 0, 'quarter'),
        ornamentBox(`q-b${pct}`, set.quarter!, sz, { bottom: 0, left: `calc(${pct}% - ${sz / 2}%)`, marginBottom: m }, 0, 'quarter'),
        ornamentBox(`q-l${pct}`, set.quarter!, sz, { left: 0, top: `${pct}%`, marginLeft: m, transform: 'translateY(-50%)' }, 0, 'quarter'),
        ornamentBox(`q-r${pct}`, set.quarter!, sz, { right: 0, top: `${pct}%`, marginRight: m, transform: 'translateY(-50%)' }, 0, 'quarter')
      );
    });
  }

  const radius = frame.radius ?? 12;
  const line = set.bandLine?.(frame);
  const shadows = [
    `0 0 0 1.5px ${frame.rim}`,
    'inset 0 1px 0 rgba(255,255,255,0.28)',
    'inset 0 -1.5px 0 rgba(0,0,0,0.35)',
    frame.glow ? `0 0 26px 2px ${frame.glow}` : '',
    '0 22px 44px -16px rgba(0,0,0,0.6)'
  ].filter(Boolean);

  return (
    <div className="w-full" style={{ padding: `${protrusion + 0.6}%` }}>
      <div
        className="relative w-full"
        data-board-frame={frame.ornament}
        style={{
          padding: `${t}%`,
          background: frame.plating,
          borderRadius: radius,
          boxShadow: shadows.join(', '),
          backdropFilter: frame.frosted ? 'blur(14px) saturate(1.4)' : undefined,
          WebkitBackdropFilter: frame.frosted ? 'blur(14px) saturate(1.4)' : undefined
        }}
      >
        {/* Inset filigree / hairline running around the band */}
        {line && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              margin: `${t * 0.32}%`,
              border: `${line.width ?? 1}px ${line.style ?? 'solid'} ${line.color}`,
              borderRadius: Math.max(radius - 4, 0),
              opacity: 0.85
            }}
          />
        )}

        {/* Moving sheen across metallic / crystal bands */}
        {frame.motion === 'shimmer' && !still && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: radius }}>
            <div className="board-frame-sheen absolute inset-0" />
          </div>
        )}

        <div
          className="relative"
          style={{
            zIndex: 1,
            borderRadius: Math.max(radius - 6, 2),
            boxShadow: `0 0 0 1.5px ${frame.innerLine}, 0 0 0 3px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.2)`
          }}
        >
          {children}
        </div>

        {ornaments}
      </div>
    </div>
  );
});
