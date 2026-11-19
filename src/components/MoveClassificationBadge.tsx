import React from 'react';
import { MoveClassification } from '../types/chess';

export interface ClassificationMeta {
  label: string;
  symbol: string;
  hex: string;
  textHex: string;
  shortDesc: string;
}

export const CLASSIFICATION_META: Record<MoveClassification, ClassificationMeta> = {
  brilliant: {
    label: 'Brilliant',
    symbol: '!!',
    hex: '#1BADA6',
    textHex: '#FFFFFF',
    shortDesc: 'Rare tactical sacrifice that maintains or wins the advantage'
  },
  great: {
    label: 'Great Move',
    symbol: '!',
    hex: '#5B8BB4',
    textHex: '#FFFFFF',
    shortDesc: 'Critical or only strong move in a demanding position'
  },
  best: {
    label: 'Best Move',
    symbol: '★',
    hex: '#81B64C',
    textHex: '#FFFFFF',
    shortDesc: 'Top engine choice maximizing evaluation'
  },
  excellent: {
    label: 'Excellent',
    symbol: '✓+',
    hex: '#96BC4B',
    textHex: '#FFFFFF',
    shortDesc: 'Very strong continuation nearly equal to the top move'
  },
  good: {
    label: 'Good',
    symbol: '✓',
    hex: '#7FA67D',
    textHex: '#FFFFFF',
    shortDesc: 'Sound move that preserves your position'
  },
  book: {
    label: 'Book',
    symbol: 'B',
    hex: '#A88865',
    textHex: '#FFFFFF',
    shortDesc: 'Standard established opening theory'
  },
  inaccuracy: {
    label: 'Inaccuracy',
    symbol: '?!',
    hex: '#F0C132',
    textHex: '#1E293B',
    shortDesc: 'Slight slip giving the opponent easier counterplay'
  },
  mistake: {
    label: 'Mistake',
    symbol: '?',
    hex: '#E6912C',
    textHex: '#FFFFFF',
    shortDesc: 'Significant error that worsens your evaluation'
  },
  missed_win: {
    label: 'Missed Win',
    symbol: '×',
    hex: '#E11D48',
    textHex: '#FFFFFF',
    shortDesc: 'Overlooked a forcing tactical or winning continuation'
  },
  blunder: {
    label: 'Blunder',
    symbol: '??',
    hex: '#CA3431',
    textHex: '#FFFFFF',
    shortDesc: 'Severe tactical oversight losing material or decisive advantage'
  }
};

export const CLASSIFICATION_ORDER: MoveClassification[] = [
  'brilliant',
  'great',
  'best',
  'excellent',
  'good',
  'book',
  'inaccuracy',
  'mistake',
  'missed_win',
  'blunder'
];

export const MoveClassificationGlyph: React.FC<{
  type: MoveClassification;
  color?: string;
  sizePx?: number;
}> = ({ type, color = '#FFFFFF', sizePx = 14 }) => {
  switch (type) {
    case 'brilliant':
      return (
        <svg width={sizePx} height={sizePx} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="6.3" y="4" width="3.8" height="10.2" rx="1.8" fill={color} />
          <circle cx="8.2" cy="18.2" r="2" fill={color} />
          <rect x="13.9" y="4" width="3.8" height="10.2" rx="1.8" fill={color} />
          <circle cx="15.8" cy="18.2" r="2" fill={color} />
        </svg>
      );

    case 'great':
      return (
        <svg width={sizePx} height={sizePx} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9.9" y="3.8" width="4.2" height="10.6" rx="2" fill={color} />
          <circle cx="12" cy="18.3" r="2.2" fill={color} />
        </svg>
      );

    case 'best':
      return (
        <svg width={sizePx} height={sizePx} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3.2L14.65 8.58L20.58 9.44L16.29 13.62L17.3 19.53L12 16.74L6.7 19.53L7.71 13.62L3.42 9.44L9.35 8.58L12 3.2Z"
            fill={color}
          />
        </svg>
      );

    case 'excellent':
      // Distinct crisp thumbs-up mark (Chess.com style)
      return (
        <svg width={sizePx} height={sizePx} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 11.2V19H4.6C4.1 19 3.7 18.6 3.7 18.1V12.1C3.7 11.6 4.1 11.2 4.6 11.2H7ZM9.2 10.6L12.5 4.9C13.1 4 14.5 4.3 14.6 5.4L14.2 9.8H18.7C19.8 9.8 20.6 10.8 20.4 11.9L19.1 17.7C18.9 18.5 18.2 19 17.4 19H9.2V10.6Z"
            fill={color}
          />
        </svg>
      );

    case 'good':
      return (
        <svg width={sizePx} height={sizePx} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5.2 12.6L9.8 17.2L18.8 7.2"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'book':
      return (
        <svg width={sizePx} height={sizePx} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4.5 6.2C4.5 5.4 5.2 4.8 6 4.9C8.2 5.1 10.4 5.8 11.5 6.8V18.6C10.2 17.6 8 17 5.8 16.8C5 16.7 4.5 16.1 4.5 15.3V6.2Z"
            fill={color}
          />
          <path
            d="M19.5 6.2C19.5 5.4 18.8 4.8 18 4.9C15.8 5.1 13.6 5.8 12.5 6.8V18.6C13.8 17.6 16 17 18.2 16.8C19 16.7 19.5 16.1 19.5 15.3V6.2Z"
            fill={color}
          />
        </svg>
      );

    case 'inaccuracy':
      return (
        <svg width={sizePx} height={sizePx} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5.5 8.4C5.5 6.2 7.2 4.8 9.6 4.8C12 4.8 13.6 6.2 13.6 8.2C13.6 9.8 12.6 10.8 11.2 11.6C10.4 12.1 10.1 12.6 10.1 13.6V14.1H7.6V13.4C7.6 11.8 8.3 10.9 9.5 10.2C10.5 9.6 11 9.1 11 8.3C11 7.4 10.3 6.9 9.5 6.9C8.5 6.9 7.9 7.5 7.8 8.5L5.5 8.4Z"
            fill={color}
          />
          <circle cx="8.85" cy="17.8" r="1.75" fill={color} />
          <rect x="15.3" y="4.8" width="3" height="9.4" rx="1.5" fill={color} />
          <circle cx="16.8" cy="17.8" r="1.75" fill={color} />
        </svg>
      );

    case 'mistake':
      return (
        <svg width={sizePx} height={sizePx} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7.6 8.5C7.6 5.9 9.6 4.3 12.3 4.3C15.1 4.3 17 5.9 17 8.3C17 10.2 15.8 11.4 14.2 12.3C13.2 12.9 12.9 13.4 12.9 14.5V15H10V14.2C10 12.4 10.8 11.4 12.2 10.6C13.4 9.9 14 9.3 14 8.4C14 7.3 13.2 6.7 12.2 6.7C11 6.7 10.3 7.4 10.2 8.6L7.6 8.5Z"
            fill={color}
          />
          <circle cx="11.5" cy="18.3" r="2" fill={color} />
        </svg>
      );

    case 'missed_win':
      return (
        <svg width={sizePx} height={sizePx} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="7.5" stroke={color} strokeWidth="2.2" opacity="0.45" />
          <path
            d="M7.5 7.5L16.5 16.5M16.5 7.5L7.5 16.5"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'blunder':
    default:
      return (
        <svg width={sizePx} height={sizePx} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3.6 8.4C3.6 6.2 5.2 4.8 7.5 4.8C9.8 4.8 11.3 6.1 11.3 8.1C11.3 9.7 10.4 10.7 9.1 11.4C8.3 11.9 8 12.4 8 13.4V13.9H5.6V13.2C5.6 11.7 6.3 10.8 7.4 10.1C8.3 9.6 8.8 9.1 8.8 8.3C8.8 7.4 8.2 6.9 7.4 6.9C6.5 6.9 6 7.5 5.9 8.5L3.6 8.4Z"
            fill={color}
          />
          <circle cx="6.8" cy="17.8" r="1.65" fill={color} />
          <path
            d="M12.7 8.4C12.7 6.2 14.3 4.8 16.6 4.8C18.9 4.8 20.4 6.1 20.4 8.1C20.4 9.7 19.5 10.7 18.2 11.4C17.4 11.9 17.1 12.4 17.1 13.4V13.9H14.7V13.2C14.7 11.7 15.4 10.8 16.5 10.1C17.4 9.6 17.9 9.1 17.9 8.3C17.9 7.4 17.3 6.9 16.5 6.9C15.6 6.9 15.1 7.5 15 8.5L12.7 8.4Z"
            fill={color}
          />
          <circle cx="15.9" cy="17.8" r="1.65" fill={color} />
        </svg>
      );
  }
};

interface MoveClassificationBadgeProps {
  type: MoveClassification;
  variant?: 'board' | 'inline' | 'chip';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const MoveClassificationBadge: React.FC<MoveClassificationBadgeProps> = ({
  type,
  variant = 'inline',
  size = 'sm',
  showLabel = false,
  className = ''
}) => {
  const meta = CLASSIFICATION_META[type] || CLASSIFICATION_META.good;

  if (variant === 'board') {
    const dim =
      size === 'xs'
        ? 'w-4 h-4'
        : size === 'lg'
        ? 'w-6 h-6 sm:w-7 sm:h-7'
        : 'w-5 h-5 sm:w-6 sm:h-6';
    const glyphSize = size === 'xs' ? 10 : size === 'lg' ? 16 : 13;

    return (
      <span
        data-testid={`board-eval-badge-${type}`}
        title={`${meta.label} (${meta.symbol}) — ${meta.shortDesc}`}
        aria-label={`${meta.label} (${meta.symbol})`}
        className={`absolute -top-1 -right-1 sm:top-0.5 sm:right-0.5 z-30 ${dim} rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/95 pointer-events-none ${className}`}
        style={{ backgroundColor: meta.hex }}
      >
        <MoveClassificationGlyph type={type} color={meta.textHex} sizePx={glyphSize} />
      </span>
    );
  }

  if (variant === 'chip') {
    const px = size === 'lg' ? 15 : size === 'md' ? 13 : 11;
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold whitespace-nowrap ${className}`}
        title={meta.shortDesc}
      >
        <span
          className="inline-flex items-center justify-center rounded-full shrink-0 shadow-sm"
          style={{
            width: size === 'lg' ? 22 : size === 'md' ? 19 : 16,
            height: size === 'lg' ? 22 : size === 'md' ? 19 : 16,
            backgroundColor: meta.hex
          }}
        >
          <MoveClassificationGlyph type={type} color={meta.textHex} sizePx={px} />
        </span>
        {showLabel && (
          <span className="text-xs font-bold" style={{ color: meta.hex }}>
            {meta.label}
          </span>
        )}
      </span>
    );
  }

  // 'inline' circular badge icon
  const circlePx = size === 'xs' ? 14 : size === 'lg' ? 22 : size === 'md' ? 18 : 16;
  const glyphPx = size === 'xs' ? 9 : size === 'lg' ? 14 : size === 'md' ? 12 : 11;

  return (
    <span
      className={`inline-flex items-center gap-1.5 shrink-0 ${className}`}
      title={`${meta.label} (${meta.symbol})`}
    >
      <span
        className="inline-flex items-center justify-center rounded-full shrink-0"
        style={{
          width: circlePx,
          height: circlePx,
          backgroundColor: meta.hex
        }}
      >
        <MoveClassificationGlyph type={type} color={meta.textHex} sizePx={glyphPx} />
      </span>
      {showLabel && (
        <span className="text-xs font-bold whitespace-nowrap" style={{ color: meta.hex }}>
          {meta.label}
        </span>
      )}
    </span>
  );
};
