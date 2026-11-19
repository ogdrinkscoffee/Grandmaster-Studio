import React from 'react';
import { winChanceFromCp, formatEvaluation } from '../engine/chessEngine';
import { useAppTheme } from '../context/ThemeContext';

interface EvalBarProps {
  scoreCp: number;
  isFlipped: boolean;
  engineDepth?: number;
  isEvaluating?: boolean;
  position?: 'left' | 'right' | 'hidden';
}

export const EvalBar: React.FC<EvalBarProps> = ({
  scoreCp,
  isFlipped,
  engineDepth = 16,
  isEvaluating = false,
  position = 'left'
}) => {
  const { theme } = useAppTheme();
  if (position === 'hidden') return null;

  const whiteWinChance = winChanceFromCp(scoreCp);
  const evalText = formatEvaluation(scoreCp);
  const isWhiteAdvantage = scoreCp >= 0;

  // The bar mirrors the board: White's share sits at the bottom normally and at the top when flipped.
  const whiteSection = { heightPercent: whiteWinChance, bg: '#f8fafc', fg: '#0f172a', showText: isWhiteAdvantage };
  const blackSection = { heightPercent: 100 - whiteWinChance, bg: '#1b202a', fg: '#f1f5f9', showText: !isWhiteAdvantage };
  const topSection = isFlipped ? whiteSection : blackSection;
  const bottomSection = isFlipped ? blackSection : whiteSection;

  return (
    <div
      className="flex flex-col items-center justify-between self-stretch min-h-[200px] w-7 sm:w-8 rounded-lg overflow-hidden relative select-none shrink-0"
      style={{
        border: `1px solid ${theme.cardBorderHex}`,
        backgroundColor: '#1a1f29',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.22)'
      }}
      title={`Engine Evaluation: ${evalText} (White win chance: ${whiteWinChance}%)`}
      aria-label={`Evaluation bar: ${evalText}`}
    >
      {/* Top section (opponent's side) */}
      <div
        className="w-full transition-[height] duration-300 ease-out flex flex-col justify-start items-center pt-1.5 text-[10px] font-bold font-mono tabular-nums"
        style={{
          height: `${topSection.heightPercent}%`,
          backgroundColor: topSection.bg,
          color: topSection.fg
        }}
      >
        {topSection.showText && (
          <span className="px-0.5 tracking-tight">
            {evalText}
          </span>
        )}
      </div>

      {/* Bottom section (side at the bottom of the board) */}
      <div
        className="w-full transition-[height] duration-300 ease-out flex flex-col justify-end items-center pb-1.5 text-[10px] font-bold font-mono tabular-nums"
        style={{
          height: `${bottomSection.heightPercent}%`,
          backgroundColor: bottomSection.bg,
          color: bottomSection.fg
        }}
      >
        {bottomSection.showText && (
          <span className="px-0.5 tracking-tight">
            {evalText}
          </span>
        )}
      </div>

      {/* Centered hairline + depth indicator */}
      <div
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center"
      >
        <div
          className="text-[8px] font-mono font-bold px-1 py-0.5 rounded uppercase tracking-tighter whitespace-nowrap shadow-sm"
          style={{
            backgroundColor: theme.cardHex,
            color: theme.accentHex,
            border: `1px solid ${theme.cardBorderHex}`
          }}
        >
          {isEvaluating ? '•••' : `D${engineDepth}`}
        </div>
      </div>
    </div>
  );
};
