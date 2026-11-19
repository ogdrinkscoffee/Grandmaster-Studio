import { VariantDefinition, VariantId } from '../types/chess';
import { Chess, Square } from 'chess.js';

export const CHESS_VARIANTS: VariantDefinition[] = [
  {
    id: 'standard',
    name: 'Standard Chess',
    tagline: 'The classical game of kings',
    description: 'Traditional FIDE rules, standard starting position, full Stockfish analysis and evaluation.',
    specialRules: ['Standard checkmate and draw rules', '50-move rule and threefold repetition'],
    icon: '♚',
    category: 'Popular',
  },
  {
    id: 'chaturanga',
    name: 'Chaturanga (Ancient Indian Chess)',
    tagline: 'The 6th-century Gupta Empire ancestor of chess',
    description: 'Played on an 8x8 Ashtapada board. Features Raja (King), Mantri (Counselor), Gaja (Elephant), Ashva (Horse), Ratha (Chariot), and Padati (Infantry). No castling; victory by checkmate or baring the opponent Raja.',
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1',
    specialRules: [
      'Gaja (Elephant / Bishop spot) leaps 2 squares diagonally over any piece (Alfil)',
      'Mantri (Counselor / Queen spot) moves 1 square diagonally (Ferz)',
      'Padati (Pawns) move 1 step forward, capture diagonally, promote to Mantri on rank 8 (no double-step, no en passant)',
      'Ratha (Chariots) slide orthogonally like Rooks; Ashva (Horses) jump like Knights',
      'No castling allowed',
      'Victory by Checkmate or Baring the enemy Raja (capturing all non-king enemy pieces)'
    ],
    icon: '🐘',
    category: 'Historical',
  },
  {
    id: 'chess960',
    name: 'Chess960 (Fischer Random)',
    tagline: 'End the opening memorization',
    description: 'Back-rank pieces are randomly shuffled with bishops on opposite colors and the king between both rooks.',
    specialRules: ['960 valid starting positions', 'Castling rules preserved with original destination squares'],
    icon: '🎲',
    category: 'Popular',
  },
  {
    id: 'king_of_the_hill',
    name: 'King of the Hill',
    tagline: 'Occupy the throne at the center',
    description: 'Bring your King to any of the four central squares (d4, e4, d5, e5) to claim immediate victory!',
    specialRules: ['Control center squares d4, e4, d5, e5 with your King', 'Standard checkmate also wins'],
    icon: '⛰️',
    category: 'Popular',
  },
  {
    id: 'three_check',
    name: 'Three-Check',
    tagline: 'Deliver 3 checks to win',
    description: 'Check the opponent King three times in total. Fast, aggressive tactical play where every check counts.',
    specialRules: ['First player to check the opponent king 3 times wins', 'Tracks checks delivered per side'],
    icon: '⚡',
    category: 'Popular',
  },
  {
    id: 'atomic',
    name: 'Atomic Chess',
    tagline: 'Explosive tactical devastation',
    description: 'Every capture triggers a catastrophic explosion destroying the capturing piece, captured piece, and all adjacent pieces except pawns!',
    specialRules: ['Capturing destroys the piece and surrounding non-pawns', 'Kings cannot capture because they would explode'],
    icon: '💥',
    category: 'Chaotic',
  },
  {
    id: 'horde',
    name: 'Horde Chess',
    tagline: 'White peasant horde vs Black army',
    description: 'White commands an armada of 36 pawns spanning ranks 1-4. Black commands a standard army with a King.',
    startFen: 'rnbqkbnr/pppppppp/8/1PPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w kq - 0 1',
    specialRules: ['White has no King and wins by checkmating Black', 'Black wins by capturing all White pawns'],
    icon: '🛡️',
    category: 'Chaotic',
  },
  {
    id: 'antichess',
    name: 'Antichess (Losing Chess)',
    tagline: 'First to lose all pieces wins',
    description: 'Captures are mandatory! The first player to lose all their pieces (or have no legal moves left) wins the game.',
    specialRules: ['Captures are compulsory when available', 'Kings have no royal status (can be captured)'],
    icon: '🔄',
    category: 'Chaotic',
  },
  {
    id: 'racing_kings',
    name: 'Racing Kings',
    tagline: 'First King to the 8th rank wins',
    description: 'Both armies start on the 1st and 2nd ranks. Race your king to the 8th rank without putting yourself in check!',
    startFen: '8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w - - 0 1',
    specialRules: ['Checks are illegal', 'First king to reach rank 8 wins'],
    icon: '🏎️',
    category: 'Tactical',
  },
  {
    id: 'crazyhouse',
    name: 'Crazyhouse',
    tagline: 'Captured pieces join your reserve',
    description: 'Whenever you capture an opponent piece, it changes to your color and is placed in your pocket to drop back on the board.',
    specialRules: ['Captured pieces go into player pocket', 'Spend a turn dropping a captured piece anywhere'],
    icon: '🎪',
    category: 'Popular',
  },
  {
    id: 'fog_of_war',
    name: 'Fog of War (Dark Chess)',
    tagline: 'Imperfect information warfare',
    description: 'You only see squares that your pieces occupy or can legally attack. Opponent moves lurk in the shadows.',
    specialRules: ['Board squares obscured unless in your line of sight', 'True stealth strategy'],
    icon: '🌫️',
    category: 'Tactical',
  },
  {
    id: 'duck_chess',
    name: 'Duck Chess',
    tagline: 'The notorious quacking blocker',
    description: 'After every move, you must move a neutral Rubber Duck to any unoccupied square. Neither side can move onto or through the duck!',
    specialRules: ['Duck placed on an empty square each turn', 'Duck completely obstructs diagonals, files, and squares'],
    icon: '🦆',
    category: 'Chaotic',
  },
  {
    id: 'absorption',
    name: 'Absorption Chess',
    tagline: 'Pieces absorb enemy powers',
    description: 'When a piece captures an opponent piece, it permanently gains that captured piece\'s movement profile.',
    specialRules: ['Knights can absorb Bishop diagonals', 'Rooks can gain Knight hopping'],
    icon: '🧬',
    category: 'Tactical',
  },
  {
    id: 'knightmare',
    name: 'Knightmare Chess',
    tagline: 'Hyper-agile equestrian chaos',
    description: 'Knights are supercharged: they can jump two L-shapes in a single turn if the intermediate square is clear.',
    specialRules: ['Super-knights dominate the board', 'Rapid king hunting'],
    icon: '🦄',
    category: 'Chaotic',
  },
  {
    id: 'pawns_only',
    name: 'Pawns Endgame Race',
    tagline: 'Purity of pawn structures and promotion',
    description: 'Only Kings and 8 pawns per side. Master opposition, triangulation, passed pawns, and break-through lines.',
    startFen: '4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1',
    specialRules: ['Fast endgame promotion race', 'Tests endgame precision'],
    icon: '♟️',
    category: 'Endgame',
  },
  {
    id: 'queens_mayhem',
    name: 'Queens Only Mayhem',
    tagline: 'Kings guarded by 7 queens',
    description: 'Every non-king piece is replaced by a Queen. Total tactical fireworks and instant checkmate threats!',
    startFen: 'qqqqkqqq/8/8/8/8/8/8/QQQQKQQQ w - - 0 1',
    specialRules: ['Extreme tactical alertness', '7 Queens per side'],
    icon: '👑',
    category: 'Chaotic',
  },
  {
    id: 'peasant_revolt',
    name: 'Peasant Revolt',
    tagline: '8 pawns vs 4 noble knights',
    description: 'Asymmetric battle: White has King and 8 pawns; Black has King and 4 Knights. Can peasant solidarity prevail?',
    startFen: '1nnk1nn1/8/8/8/8/8/PPPPPPPP/4K3 w - - 0 1',
    specialRules: ['Asymmetric pieces', 'Pawn phalanx vs Knight agility'],
    icon: '⚔️',
    category: 'Historical',
  },
  {
    id: 'almost_chess',
    name: 'Almost Chess',
    tagline: 'The legendary Chancellor replaces the Queen',
    description: 'Queens are replaced with the historical Chancellor piece (moves like a Rook + Knight combined).',
    startFen: 'rnbckbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBCKBNR w KQkq - 0 1',
    specialRules: ['Compound piece Chancellor', 'Devastating forks and file control'],
    icon: '🏰',
    category: 'Historical',
  },
  {
    id: 'grand_chess',
    name: 'Grand Tactical Chess',
    tagline: 'Expanded fairy piece tactical arena',
    description: 'Features specialized auxiliary pieces and deep tactical lines across extended files.',
    specialRules: ['Fairy piece mechanics', 'Open tactical board'],
    icon: '🏛️',
    category: 'Historical',
  },
  {
    id: 'upside_down',
    name: 'Upside Down Chess',
    tagline: 'Inverted starting ranks',
    description: 'White begins on rank 8 moving down; Black begins on rank 1 moving up. Disorients standard opening muscle memory!',
    startFen: 'RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr w - - 0 1',
    specialRules: ['Pawns move in reverse direction', 'Instant close-quarters combat'],
    icon: '🙃',
    category: 'Chaotic',
  },
  {
    id: 'endgame_lucena',
    name: 'Lucena & Philidor Drill',
    tagline: 'Master the bridge building technique',
    description: 'Essential theoretical rook and pawn endgame position. White must build a bridge with the rook to promote.',
    startFen: '1K1k4/1P6/8/8/8/8/8/r6R w - - 0 1',
    specialRules: ['Fundamental GM endgame study', 'Master the rook bridge'],
    icon: '🌉',
    category: 'Endgame',
  },
  {
    id: 'checkless',
    name: 'Checkless Chess',
    tagline: 'Checks are forbidden except mate',
    description: 'A move that delivers check is strictly illegal unless it is an immediate and unavoidable checkmate.',
    specialRules: ['No checking without mate', 'Kings can walk into what would normally be checked squares'],
    icon: '⛔',
    category: 'Tactical',
  },
  {
    id: 'anti_queen',
    name: 'Anti-Queen Chess',
    tagline: 'Queens can sacrifice friendly pieces',
    description: 'Queens can capture their own pieces to open up files, redeploy instantly, or save high-value targets.',
    specialRules: ['Queen can capture friendly pawns and pieces', 'High mobility sacrifices'],
    icon: '🎯',
    category: 'Tactical',
  },
  {
    id: 'extinction',
    name: 'Extinction Chess',
    tagline: 'Wipe out any complete species',
    description: 'Win by capturing all of any single piece type: all 8 pawns, both knights, both bishops, both rooks, or the queen/king.',
    specialRules: ['Eliminating all pieces of one type wins immediately', 'Kings are not special: lose all kings, or all knights, etc.'],
    icon: '🦖',
    category: 'Tactical',
  },
  {
    id: 'giveaway',
    name: 'Giveaway Tactical Blitz',
    tagline: 'Sacrifice blitz sprint',
    description: 'Every turn you must look for ways to force the opponent into winning your material.',
    specialRules: ['Tactical sacrifice calculations', 'Anti-material masterclass'],
    icon: '🎁',
    category: 'Tactical',
  },
  {
    id: 'gladiator',
    name: 'Gladiator Chess',
    tagline: 'First blood receives an invulnerable shield',
    description: 'The first piece on the board to make a capture receives the Gladiator Shield and cannot be captured for 1 full turn!',
    specialRules: ['First capturer gains 1-turn immunity', 'Encourages early bold piece sacrifices'],
    icon: '🛡️',
    category: 'Chaotic',
  },
  {
    id: 'blindfold',
    name: 'Blindfold Chess',
    tagline: 'The ultimate visualization challenge',
    description: 'Pieces are invisible! Tests mental board representation, spatial memory, and deep visualization.',
    specialRules: ['Invisible piece icons', 'Can toggle visual peek mode at any time'],
    icon: '🙈',
    category: 'Tactical',
  },
  {
    id: 'los_alamos',
    name: 'Los Alamos Chess (6×6)',
    tagline: 'Historic 1956 atomic-era computer chess',
    description: 'Played on a compact 6×6 board without bishops, double pawn steps, or castling. Sharp central clashes begin on move one.',
    specialRules: ['6×6 arena with no Bishops', 'No castling or 2-square pawn leaps', 'Also rewards reaching center control'],
    icon: '⚛️',
    category: 'Historical',
  },
  {
    id: 'minichess_5x5',
    name: "Gardner's Minichess (5×5)",
    tagline: 'Lightning-fast pocket warfare on 25 squares',
    description: 'Martin Gardner’s beloved 5×5 miniature variant where every tempo decides the game.',
    specialRules: ['Ultra-compact 5×5 board with K, Q, B, N, R and 5 pawns', 'Immediate tactical confrontation'],
    icon: '📐',
    category: 'Endgame',
  },
  {
    id: 'shatranj',
    name: 'Shatranj (Medieval Persian Chess)',
    tagline: 'The classic Islamic Golden Age ruleset',
    description: 'Direct descendant of Chaturanga and ancestor of European chess. Features Alfil (leaps 2 diagonally), Fers (1 step diagonally), and stalemate/baring victory.',
    specialRules: ['Alfil leaps 2 diagonally; Fers steps 1 diagonally', 'Pawns move 1 step forward and promote to Fers', 'Stalemating or baring the opponent King wins'],
    icon: '🌙',
    category: 'Historical',
  },
  {
    id: 'capablanca_10x8',
    name: 'Capablanca Chess (10×8)',
    tagline: 'World Champion José Capablanca’s grand design',
    description: 'Played on an expanded 10×8 board introducing the compound Archbishop (Bishop+Knight) and Chancellor (Rook+Knight).',
    specialRules: ['10×8 board with files a–j', 'Archbishop combines Bishop & Knight; Chancellor combines Rook & Knight'],
    icon: '🏛️',
    category: 'Historical',
  },
  {
    id: 'cannon_siege',
    name: 'Xiangqi Cannon Siege',
    tagline: 'Screen-hopping siege cannons & imperial guards',
    description: 'Eastern meets Western chess! Classical pieces are reinforced by Xiangqi Cannons that leap across a screen piece to capture and short-range armored Guards.',
    specialRules: ['Cannons slide orthogonally and hop over 1 piece to capture', 'Guards step 1 square in any direction without royal status'],
    icon: '💣',
    category: 'Tactical',
  },
  {
    id: 'amazon_chess',
    name: 'Amazonia (Super-Queen)',
    tagline: 'Queens ascend into unstoppable Amazons',
    description: 'Both Queens are replaced by the fearsome Amazon compound piece (Queen + Knight). Unmatched checking range across every square.',
    specialRules: ['Amazon combines Queen sliding with Knight L-jumps', 'No fortress is safe from smothered or sliding mates'],
    icon: '🐉',
    category: 'Chaotic',
  },
  {
    id: 'light_brigade',
    name: 'Charge of the Light Brigade',
    tagline: 'Three Queens vs Seven Cavalry Knights',
    description: 'Classic asymmetric spectacle: White charges with 3 Queens against Black’s swarming phalanx of 7 Knights.',
    startFen: 'nnnnknnn/pppppppp/8/8/8/8/PPPPPPPP/1Q1QK1Q1 w - - 0 1',
    specialRules: ['White commands 3 Queens; Black commands 7 Knights', 'Asymmetric material strategy'],
    icon: '🐎',
    category: 'Chaotic',
  },
  {
    id: 'weak_chess',
    name: 'Weak! (Pawns & Cavalry Horde)',
    tagline: 'Standard army vs 16 pawns and 7 knights',
    description: 'Face down a relentless cavalry and peasant wave: Black fields 7 Knights and a double wall of 16 Pawns against a classical White army.',
    startFen: 'nnnnknnn/pppppppp/pppppppp/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1',
    specialRules: ['White has the standard army; Black has 16 pawns + 7 knights', 'Test breakthrough tactics against dense pawn barricades'],
    icon: '⚔️',
    category: 'Chaotic',
  },
  {
    id: 'transcendental',
    name: 'Transcendental Shuffle',
    tagline: 'Independent asymmetrical back-rank shuffle',
    description: 'Both White and Black receive independently randomized back-rank armies with opposite-color bishops—pure pattern creativity from move 1.',
    specialRules: ['White and Black start with different shuffled arrangements', 'Opposite-colored bishop guarantee with no castling'],
    icon: '🌀',
    category: 'Popular',
  }
];

/**
 * Variants that use standard chess rules (only the start position or presentation differs),
 * so Stockfish can play and analyse them. Rule-changing variants stay on the built-in engine.
 */
export const STOCKFISH_VARIANTS: ReadonlySet<string> = new Set([
  'standard',
  'chess960',
  'transcendental',
  'blindfold',
  'endgame_lucena',
  'pawns_only',
  'queens_mayhem',
  'peasant_revolt',
  'light_brigade',
  'weak_chess'
]);

/** Human-readable variant name for an id, e.g. 'king_of_the_hill' → 'King of the Hill'. */
export function getVariantDisplayName(id: string): string {
  const known = CHESS_VARIANTS.find(v => v.id === id);
  if (known) return known.name;
  return id
    .split('_')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function generateChess960Fen(): string {
  // Fischer Random 960 generator:
  // Rules:
  // 1. One bishop on light square, one on dark square.
  // 2. King must be between the two rooks.
  // 3. Pawns on rank 2 and rank 7 as normal.
  const squares = [0, 1, 2, 3, 4, 5, 6, 7];
  const piecePlacement = new Array(8).fill('');

  // 1. Bishop on dark square (odd: 1, 3, 5, 7)
  const darkSquares = [1, 3, 5, 7];
  const b1Pos = darkSquares[Math.floor(Math.random() * darkSquares.length)];
  piecePlacement[b1Pos] = 'b';
  squares.splice(squares.indexOf(b1Pos), 1);

  // 2. Bishop on light square (even: 0, 2, 4, 6)
  const lightSquares = [0, 2, 4, 6];
  const b2Pos = lightSquares[Math.floor(Math.random() * lightSquares.length)];
  piecePlacement[b2Pos] = 'b';
  squares.splice(squares.indexOf(b2Pos), 1);

  // 3. Queen on any remaining square
  const qIdx = Math.floor(Math.random() * squares.length);
  const qPos = squares.splice(qIdx, 1)[0];
  piecePlacement[qPos] = 'q';

  // 4. Two Knights
  const n1Pos = squares.splice(Math.floor(Math.random() * squares.length), 1)[0];
  const n2Pos = squares.splice(Math.floor(Math.random() * squares.length), 1)[0];
  piecePlacement[n1Pos] = 'n';
  piecePlacement[n2Pos] = 'n';

  // 5. Remaining 3 squares must be Rook, King, Rook in that order
  piecePlacement[squares[0]] = 'r';
  piecePlacement[squares[1]] = 'k';
  piecePlacement[squares[2]] = 'r';

  const rank1 = piecePlacement.map(p => p.toUpperCase()).join('');
  const rank8 = piecePlacement.join('');

  return `${rank8}/pppppppp/8/8/8/8/PPPPPPPP/${rank1} w KQkq - 0 1`;
}

/**
 * Transcendental Chess: Independent random back-rank setup per color (bishops on opposite colors).
 */
export function generateTranscendentalFen(): string {
  const randomBackRank = () => {
    const squares = [0, 1, 2, 3, 4, 5, 6, 7];
    const row = new Array(8).fill('');
    const dark = [1, 3, 5, 7];
    const b1 = dark[Math.floor(Math.random() * dark.length)];
    row[b1] = 'b';
    squares.splice(squares.indexOf(b1), 1);

    const light = [0, 2, 4, 6];
    const b2 = light[Math.floor(Math.random() * light.length)];
    row[b2] = 'b';
    squares.splice(squares.indexOf(b2), 1);

    const pieces = ['q', 'r', 'r', 'n', 'n', 'k'];
    for (const p of pieces) {
      const idx = Math.floor(Math.random() * squares.length);
      row[squares.splice(idx, 1)[0]] = p;
    }
    return row.join('');
  };

  const rank8 = randomBackRank();
  const rank1 = randomBackRank().toUpperCase();
  return `${rank8}/pppppppp/8/8/8/8/PPPPPPPP/${rank1} w - - 0 1`;
}

/**
 * Check if King of the Hill victory condition is met
 */
export function checkKingOfTheHillWin(chess: Chess): 'w' | 'b' | null {
  const centerSquares: Square[] = ['d4', 'e4', 'd5', 'e5'];
  for (const sq of centerSquares) {
    const piece = chess.get(sq);
    if (piece && piece.type === 'k') {
      return piece.color;
    }
  }
  return null;
}

/**
 * Check if Racing Kings victory condition is met (King reached 8th rank)
 */
export function checkRacingKingsWin(chess: Chess): 'w' | 'b' | null {
  const rank8Squares: Square[] = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'];
  for (const sq of rank8Squares) {
    const piece = chess.get(sq);
    if (piece && piece.type === 'k') {
      return piece.color;
    }
  }
  return null;
}
