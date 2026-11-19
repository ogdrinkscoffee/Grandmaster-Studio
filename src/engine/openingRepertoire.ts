import { PieceColor } from '../types/chess';
import { notifyProgressUpdated } from './progressEvents';

/** A main line to drill in the Opening Trainer. The user plays `side`; the trainer plays the other side's book replies. */
export interface RepertoireLine {
  id: string;
  name: string;
  eco: string;
  side: PieceColor;
  moves: string[];
  summary: string;
  ideas: string[];
}

export const OPENING_REPERTOIRE: RepertoireLine[] = [
  // ---- Play as White ----
  {
    id: 'italian-pianissimo',
    name: 'Italian Game: Giuoco Pianissimo',
    eco: 'C50',
    side: 'w',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'O-O', 'Re1', 'a6', 'Bb3', 'Ba7'],
    summary: 'A slow, solid Italian: build with c3 and d3, castle, then manoeuvre before breaking with d4.',
    ideas: ['c3 prepares a later d4 and gives the bishop a b3 retreat', 'Re1 supports e4 and the Nbd2–f1–g3 manoeuvre']
  },
  {
    id: 'ruy-lopez-closed',
    name: 'Ruy Lopez: Closed',
    eco: 'C84',
    side: 'w',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'h3'],
    summary: 'Pressure on e5 through the c6 knight, then a slow central build-up with c3 and h3.',
    ideas: ['Bb5 pins down the e5 defender', 'h3 stops …Bg4 before White plays d4']
  },
  {
    id: 'qgd-classical',
    name: "Queen's Gambit Declined",
    eco: 'D63',
    side: 'w',
    moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'Nbd7', 'Rc1', 'c6', 'Bd3'],
    summary: 'Classical queen-side pressure: pin the f6 knight and aim the rook at the c-file.',
    ideas: ['Bg5 pins the knight that defends d5', 'Rc1 prepares play on the half-open c-file after cxd5']
  },
  {
    id: 'london-system',
    name: 'London System',
    eco: 'D02',
    side: 'w',
    moves: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nf3', 'c5', 'c3', 'Nc6', 'Nbd2', 'Bd6', 'Bg3', 'O-O', 'Bd3'],
    summary: 'A system setup: bishop out to f4 before e3, then the pyramid c3–d4–e3.',
    ideas: ['Develop the dark-squared bishop before locking it in with e3', 'Bg3 keeps the bishop when Black offers …Bd6']
  },
  {
    id: 'scotch-game',
    name: 'Scotch Game: Mieses',
    eco: 'C45',
    side: 'w',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Nf6', 'Nxc6', 'bxc6', 'e5', 'Qe7', 'Qe2', 'Nd5', 'c4'],
    summary: 'Open the centre at once with d4, then gain space with e5 and c4.',
    ideas: ['Nxc6 doubles Black’s pawns', 'e5 and c4 kick the knight and grab space']
  },
  {
    id: 'english-reversed-dragon',
    name: 'English Opening: Reversed Dragon',
    eco: 'A29',
    side: 'w',
    moves: ['c4', 'e5', 'Nc3', 'Nf6', 'g3', 'd5', 'cxd5', 'Nxd5', 'Bg2', 'Nb6', 'Nf3', 'Nc6', 'O-O', 'Be7'],
    summary: 'A Sicilian Dragon with an extra tempo: fianchetto and pressure down the long diagonal.',
    ideas: ['The g2 bishop eyes b7 and the queen-side', 'cxd5 trades a wing pawn for Black’s centre pawn']
  },

  // ---- Play as Black ----
  {
    id: 'sicilian-najdorf',
    name: 'Sicilian Defense: Najdorf',
    eco: 'B90',
    side: 'b',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be3', 'e5', 'Nb3', 'Be6', 'f3', 'Be7'],
    summary: 'The sharpest Sicilian: …a6 keeps pieces off b5, then …e5 grabs central space.',
    ideas: ['…a6 prepares …e5 and …b5', '…Be6 contests d5, the key square of the structure']
  },
  {
    id: 'caro-kann-classical',
    name: 'Caro-Kann: Classical',
    eco: 'B19',
    side: 'b',
    moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'h4', 'h6', 'Nf3', 'Nd7', 'h5', 'Bh7', 'Bd3', 'Bxd3', 'Qxd3'],
    summary: 'Solid and sound: develop the light-squared bishop outside the pawn chain before …e6.',
    ideas: ['…Bf5 gets the "bad" bishop out early', '…h6 gives the bishop a safe retreat on h7']
  },
  {
    id: 'french-advance',
    name: 'French Defense: Advance',
    eco: 'C02',
    side: 'b',
    moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6', 'a3', 'c4', 'Nbd2', 'Na5'],
    summary: 'Attack White’s pawn chain at its base with …c5, …Nc6 and …Qb6.',
    ideas: ['Pressure on d4 is the whole plan', '…c4 and …Na5 clamp the queen-side and eye b3']
  },
  {
    id: 'kings-indian-classical',
    name: "King's Indian Defense: Classical",
    eco: 'E97',
    side: 'b',
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5', 'O-O', 'Nc6', 'd5', 'Ne7'],
    summary: 'Let White take the centre, then strike with …e5 and attack on the king-side.',
    ideas: ['…e5 challenges the big centre', 'After d5, …Ne7 heads for the …f5 king-side push']
  },
  {
    id: 'slav-main',
    name: 'Slav Defense: Main Line',
    eco: 'D17',
    side: 'b',
    moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'dxc4', 'a4', 'Bf5', 'e3', 'e6', 'Bxc4', 'Bb4', 'O-O', 'O-O'],
    summary: 'Support d5 with a pawn, take on c4, and develop the light-squared bishop before …e6.',
    ideas: ['…c6 keeps the c8 bishop’s diagonal open', '…Bb4 pins and pressures e4']
  },
  {
    id: 'scandinavian-main',
    name: 'Scandinavian Defense: Main Line',
    eco: 'B01',
    side: 'b',
    moves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'Nf6', 'Nf3', 'c6', 'Bc4', 'Bf5', 'Bd2', 'e6'],
    summary: 'Challenge e4 immediately; the queen settles on a5 and Black builds a Caro-like setup.',
    ideas: ['…Qa5 avoids losing time and pins along the a5–e1 diagonal', '…c6 gives the queen a retreat and supports d5']
  }
];

/** Per-line progress, persisted in localStorage. */
export interface OpeningProgress {
  attempts: number;
  perfectDrills: number;
  lastPracticed?: string;
}

export const OPENING_PROGRESS_KEY = 'gm_opening_trainer_progress';
export const MASTERY_TARGET = 3;

export function loadOpeningProgress(): Record<string, OpeningProgress> {
  try {
    const raw = localStorage.getItem(OPENING_PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, OpeningProgress>) : {};
  } catch {
    return {};
  }
}

export function saveOpeningProgress(progress: Record<string, OpeningProgress>) {
  try {
    localStorage.setItem(OPENING_PROGRESS_KEY, JSON.stringify(progress));
    notifyProgressUpdated();
  } catch {
    // storage full or unavailable — progress just won't persist
  }
}
