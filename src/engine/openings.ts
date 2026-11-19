export interface OpeningInfo {
  eco: string;
  name: string;
}

interface OpeningEntry {
  moves: string[];
  eco: string;
  name: string;
}

const OPENING_BOOK: OpeningEntry[] = [
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4'], eco: 'C54', name: 'Italian Game: Greco Attack' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'], eco: 'C50', name: 'Italian Game: Giuoco Piano' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5'], eco: 'C57', name: 'Italian Game: Fried Liver Attack' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'], eco: 'C55', name: 'Italian Game: Two Knights Defense' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'], eco: 'C50', name: 'Italian Game' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O'], eco: 'C78', name: 'Ruy Lopez: Morphy Defense' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'], eco: 'C70', name: 'Ruy Lopez: Morphy Defense' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6'], eco: 'C65', name: 'Ruy Lopez: Berlin Defense' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], eco: 'C60', name: 'Ruy Lopez' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4'], eco: 'C45', name: 'Scotch Game' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'], eco: 'C44', name: 'Scotch Game' },
  { moves: ['e4', 'e5', 'Nf3', 'Nf6'], eco: 'C42', name: 'Petrov Defense' },
  { moves: ['e4', 'e5', 'Nf3', 'd6'], eco: 'C41', name: 'Philidor Defense' },
  { moves: ['e4', 'e5', 'f4', 'exf4'], eco: 'C33', name: "King's Gambit Accepted" },
  { moves: ['e4', 'e5', 'f4'], eco: 'C30', name: "King's Gambit" },
  { moves: ['e4', 'e5', 'Nc3', 'Nf6'], eco: 'C25', name: 'Vienna Game' },
  { moves: ['e4', 'e5', 'Bc4'], eco: 'C23', name: "Bishop's Opening" },
  { moves: ['e4', 'e5'], eco: 'C20', name: "King's Pawn Game" },
  { moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'], eco: 'B90', name: 'Sicilian Defense: Najdorf' },
  { moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'], eco: 'B70', name: 'Sicilian Defense: Dragon' },
  { moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4'], eco: 'B32', name: 'Sicilian Defense: Open' },
  { moves: ['e4', 'c5', 'Nf3', 'e6', 'd4', 'cxd4', 'Nxd4'], eco: 'B40', name: 'Sicilian Defense: Taimanov / Kan' },
  { moves: ['e4', 'c5', 'c3'], eco: 'B22', name: 'Sicilian Defense: Alapin' },
  { moves: ['e4', 'c5', 'Nc3'], eco: 'B23', name: 'Sicilian Defense: Closed' },
  { moves: ['e4', 'c5'], eco: 'B20', name: 'Sicilian Defense' },
  { moves: ['e4', 'e6', 'd4', 'd5', 'Nc3'], eco: 'C11', name: 'French Defense: Classical' },
  { moves: ['e4', 'e6', 'd4', 'd5', 'e5'], eco: 'C02', name: 'French Defense: Advance' },
  { moves: ['e4', 'e6', 'd4', 'd5'], eco: 'C00', name: 'French Defense' },
  { moves: ['e4', 'e6'], eco: 'C00', name: 'French Defense' },
  { moves: ['e4', 'c6', 'd4', 'd5', 'Nc3'], eco: 'B15', name: 'Caro-Kann Defense' },
  { moves: ['e4', 'c6', 'd4', 'd5', 'e5'], eco: 'B12', name: 'Caro-Kann Defense: Advance' },
  { moves: ['e4', 'c6'], eco: 'B10', name: 'Caro-Kann Defense' },
  { moves: ['e4', 'd5', 'exd5', 'Qxd5'], eco: 'B01', name: 'Scandinavian Defense' },
  { moves: ['e4', 'd5'], eco: 'B01', name: 'Scandinavian Defense' },
  { moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6'], eco: 'B07', name: 'Pirc Defense' },
  { moves: ['e4', 'Nf6'], eco: 'B02', name: "Alekhine's Defense" },
  { moves: ['e4', 'g6'], eco: 'B06', name: 'Modern Defense' },
  { moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6'], eco: 'D37', name: "Queen's Gambit Declined" },
  { moves: ['d4', 'd5', 'c4', 'c6'], eco: 'D10', name: 'Slav Defense' },
  { moves: ['d4', 'd5', 'c4', 'dxc4'], eco: 'D20', name: "Queen's Gambit Accepted" },
  { moves: ['d4', 'd5', 'c4'], eco: 'D06', name: "Queen's Gambit" },
  { moves: ['d4', 'd5', 'Bf4'], eco: 'D02', name: 'London System' },
  { moves: ['d4', 'd5'], eco: 'D00', name: "Queen's Pawn Game" },
  { moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'], eco: 'E60', name: "King's Indian Defense" },
  { moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'], eco: 'D80', name: 'Grünfeld Defense' },
  { moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'], eco: 'E20', name: 'Nimzo-Indian Defense' },
  { moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6'], eco: 'E12', name: "Queen's Indian Defense" },
  { moves: ['d4', 'Nf6', 'c4', 'c5'], eco: 'A56', name: 'Benoni Defense' },
  { moves: ['d4', 'Nf6', 'Bf4'], eco: 'A45', name: 'London System (Indian)' },
  { moves: ['d4', 'Nf6'], eco: 'A45', name: 'Indian Defense' },
  { moves: ['d4', 'f5'], eco: 'A80', name: 'Dutch Defense' },
  { moves: ['c4', 'e5'], eco: 'A20', name: 'English Opening: Reversed Sicilian' },
  { moves: ['c4', 'Nf6'], eco: 'A15', name: 'English Opening' },
  { moves: ['c4'], eco: 'A10', name: 'English Opening' },
  { moves: ['Nf3', 'd5', 'c4'], eco: 'A09', name: 'Réti Opening' },
  { moves: ['Nf3', 'd5'], eco: 'A06', name: 'Réti / Zukertort Opening' },
  { moves: ['Nf3'], eco: 'A04', name: 'Zukertort Opening' },
  { moves: ['f4'], eco: 'A02', name: "Bird's Opening" },
  { moves: ['b3'], eco: 'A01', name: 'Nimzowitsch-Larsen Attack' },
];

// Sort longest prefix first for exact longest-match ECO lookup
const SORTED_OPENINGS = [...OPENING_BOOK].sort((a, b) => b.moves.length - a.moves.length);

export function detectOpening(sanMoves: string[]): OpeningInfo | null {
  if (!sanMoves || sanMoves.length === 0) return null;

  for (const entry of SORTED_OPENINGS) {
    if (sanMoves.length < entry.moves.length) continue;
    let matches = true;
    for (let i = 0; i < entry.moves.length; i++) {
      if (sanMoves[i] !== entry.moves[i]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      return { eco: entry.eco, name: entry.name };
    }
  }
  return null;
}
