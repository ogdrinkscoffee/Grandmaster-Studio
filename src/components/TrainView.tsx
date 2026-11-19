import React, { useEffect, useState } from 'react';
import { BookOpen, Crosshair, Crown, GraduationCap, Microscope } from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { OpeningTrainer } from './OpeningTrainer';
import { EndgameDrills } from './EndgameDrills';
import { AnalysisBoard } from './AnalysisBoard';
import { VisionTrainer } from './VisionTrainer';

export type TrainSection = 'openings' | 'endgames' | 'vision' | 'analysis';

interface TrainViewProps {
  initialSection?: TrainSection;
  sectionRequestKey?: number;
}

const SECTIONS: { id: TrainSection; label: string; icon: React.ReactNode; blurb: string }[] = [
  {
    id: 'openings',
    label: 'Openings',
    icon: <BookOpen className="w-4 h-4" />,
    blurb: 'Learn a main line with arrows, then drill it from memory to earn stars.'
  },
  {
    id: 'endgames',
    label: 'Endgames',
    icon: <Crown className="w-4 h-4" />,
    blurb: 'Convert classic endgames against the engine — mate, promote or hold the draw.'
  },
  {
    id: 'vision',
    label: 'Vision',
    icon: <Crosshair className="w-4 h-4" />,
    blurb: '30-second Coordinate Vision sprint — sharpen board sight without coordinate labels.'
  },
  {
    id: 'analysis',
    label: 'Analysis board',
    icon: <Microscope className="w-4 h-4" />,
    blurb: 'Play both sides freely, load any FEN or PGN, and see live engine lines.'
  }
];

/** Training hub: opening trainer, endgame drills, coordinate vision, and a free analysis board. */
export const TrainView: React.FC<TrainViewProps> = ({ initialSection, sectionRequestKey }) => {
  const { theme } = useAppTheme();
  const [section, setSection] = useState<TrainSection>(initialSection ?? 'openings');

  useEffect(() => {
    if (initialSection) {
      setSection(initialSection);
    }
  }, [initialSection, sectionRequestKey]);

  const active = SECTIONS.find(s => s.id === section) ?? SECTIONS[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 flex flex-col gap-5">
      <div
        className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ backgroundColor: theme.cardHex, border: `1px solid ${theme.cardBorderHex}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${theme.accentHex}1f`, color: theme.accentHex }}
          >
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight" style={{ color: theme.textPrimary }}>
              Training
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
              {active.blurb}
            </p>
          </div>
        </div>

        {SECTIONS.length > 1 && (
          <div
            role="tablist"
            aria-label="Training sections"
            className="flex flex-wrap p-1 rounded-xl self-start sm:self-auto"
            style={{ backgroundColor: theme.cardSecondaryHex, border: `1px solid ${theme.cardBorderHex}` }}
          >
            {SECTIONS.map(s => {
              const isActive = s.id === section;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSection(s.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap"
                  style={isActive ? { backgroundColor: theme.accentHex, color: theme.accentTextHex } : { color: theme.textSecondary }}
                >
                  {s.icon}
                  {s.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {section === 'openings' && <OpeningTrainer />}
      {section === 'endgames' && <EndgameDrills />}
      {section === 'vision' && <VisionTrainer />}
      {section === 'analysis' && <AnalysisBoard />}
    </div>
  );
};
