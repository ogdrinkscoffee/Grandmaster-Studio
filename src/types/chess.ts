export type PieceType =
  | 'p' // Pawn / Padati
  | 'n' // Knight / Ashva
  | 'b' // Bishop
  | 'r' // Rook / Ratha
  | 'q' // Queen
  | 'k' // King / Raja
  // Fairy & Historic Pieces for Chaturanga and Custom Variants
  | 'e' // Elephant / Gaja / Alfil (leaps 2 diagonally)
  | 'f' // Ferz / Mantri / Counselor (moves 1 diagonally)
  | 'c' // Chancellor / Empress (Rook + Knight compound)
  | 'a' // Archbishop / Princess (Bishop + Knight compound)
  | 'z' // Amazon / Dragon (Queen + Knight compound)
  | 'o' // Cannon / Pao (slides like rook, hops over 1 piece to capture)
  | 'm' // Guard / Mann (moves 1 step any direction, non-royal)
  | 'd'; // Duck blocker

export type PieceColor = 'w' | 'b';

export interface CustomPieceDef {
  type: PieceType;
  name: string;
  hindiName?: string;
  tagline: string;
  description: string;
  icon: string;
  isFairy: boolean;
}

export interface CustomVariantRules {
  pawnDoubleStep: boolean;
  enPassant: boolean;
  castling: boolean;
  mandatoryCaptures: boolean; // Antichess / Giveaway
  atomicExplosions: boolean;
  allowDuckPlacement: boolean;
  reversePawns?: boolean;
  horde?: boolean;
  checkless?: boolean;
  antiQueen?: boolean;
  gladiator?: boolean;
  absorption?: boolean;
  knightmare?: boolean;
  stalemateWins?: boolean;
  promotionPiece?: PieceType;
  winConditions: {
    checkmate: boolean;
    centerHill: boolean;
    racingKings: boolean;
    bareKing: boolean; // Win if opponent has only king remaining
    threeCheck: boolean;
    extinction?: boolean;
  };
}

export interface CustomBoardSquare {
  type: PieceType;
  color: PieceColor;
  absorbed?: PieceType[];
}

export interface CustomVariantConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  boardWidth: number; // 5 to 10
  boardHeight: number; // 5 to 10
  grid: (CustomBoardSquare | null)[][]; // [row][col] where row 0 is top rank
  rules: CustomVariantRules;
  customPiecesUsed: PieceType[];
  createdAt: string;
}

export type MoveClassification =
  | 'brilliant'   // !!
  | 'great'       // !
  | 'best'        // ★
  | 'excellent'   // Checkmark green
  | 'good'        // Solid
  | 'book'        // 📖
  | 'inaccuracy'  // ?!
  | 'mistake'     // ?
  | 'blunder'     // ??
  | 'missed_win'; // Missed opportunity

export interface MoveAnalysis {
  san: string;
  from: string;
  to: string;
  promotion?: string;
  classification: MoveClassification;
  evalBefore: number; // centipawns or mate
  evalAfter: number;
  moveAccuracy?: number;
  pvSan?: string[];
  bestMoveSan?: string;
  bestMoveFrom?: string;
  bestMoveTo?: string;
  commentary?: string;
  coachExplanation?: string;
  /** True while the engine worker is still grading this move (classification is provisional). */
  pending?: boolean;
}

export type VariantId =
  | 'standard'
  | 'chaturanga'
  | 'chess960'
  | 'king_of_the_hill'
  | 'three_check'
  | 'atomic'
  | 'horde'
  | 'antichess'
  | 'racing_kings'
  | 'crazyhouse'
  | 'fog_of_war'
  | 'duck_chess'
  | 'absorption'
  | 'knightmare'
  | 'pawns_only'
  | 'queens_mayhem'
  | 'peasant_revolt'
  | 'almost_chess'
  | 'grand_chess'
  | 'upside_down'
  | 'endgame_lucena'
  | 'checkless'
  | 'anti_queen'
  | 'extinction'
  | 'giveaway'
  | 'gladiator'
  | 'blindfold'
  | 'los_alamos'
  | 'minichess_5x5'
  | 'shatranj'
  | 'capablanca_10x8'
  | 'cannon_siege'
  | 'amazon_chess'
  | 'light_brigade'
  | 'weak_chess'
  | 'transcendental';

export interface VariantDefinition {
  id: VariantId;
  name: string;
  tagline: string;
  description: string;
  startFen?: string;
  specialRules: string[];
  icon: string;
  category: 'Popular' | 'Chaotic' | 'Endgame' | 'Tactical' | 'Historical';
}

export interface GameHistoryItem {
  id: string;
  date: string;
  variant: VariantId;
  playerColor: PieceColor;
  opponentName: string;
  opponentElo: number;
  timeControl: string;
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  reason: 'checkmate' | 'resignation' | 'timeout' | 'stalemate' | 'repetition' | 'variant_goal' | 'abandoned';
  movesCount: number;
  pgn: string;
  startFen?: string;
  startCustomConfig?: CustomVariantConfig;
  accuracyWhite?: number;
  accuracyBlack?: number;
  playerAccuracy?: number;
  blundersCount?: number;
  analyzedMoves?: MoveAnalysis[];
}

export interface UserRatingHistory {
  bullet: { date: string; elo: number }[];
  blitz: { date: string; elo: number }[];
  rapid: { date: string; elo: number }[];
  puzzles: { date: string; elo: number }[];
  variants: { date: string; elo: number }[];
}

export interface UserProfile {
  id: string;
  username: string;
  title: string;
  avatarSeed: string;
  ratings: {
    bullet: number;
    blitz: number;
    rapid: number;
    puzzles: number;
    variants: number;
  };
  ratingHistory: UserRatingHistory;
  stats: {
    gamesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    puzzlesSolved: number;
    puzzlesAttempted: number;
    highestRating: number;
    currentStreak: number;
  };
  settings: UserSettings;
}

/** Signature boards are paired 1:1 with a piece style. */
export type SignatureBoardId = `sig_${PieceSetId}`;

/** Boards built by the player in the Board Editor. */
export type CustomBoardId = `custom_${string}`;

/** Ornament sets a board frame can draw. */
export type BoardOrnamentKind =
  | 'tournament'
  | 'staunton'
  | 'geometric'
  | 'hardwood'
  | 'hairline'
  | 'circuit'
  | 'crystal'
  | 'royal'
  | 'pixel'
  | 'gothic'
  | 'industrial'
  | 'ruby'
  | 'jade'
  | 'noir'
  | 'celestial'
  | 'electric'
  | 'venom'
  | 'geode';

/** Everything the Board Editor stores for a custom board. */
export interface CustomBoardRecipe {
  id: CustomBoardId;
  name: string;
  lightHex: string;
  darkHex: string;
  selectedHex: string;
  lastMoveHex: string;
  /** Square texture preset id ('none' for flat). */
  texture: string;
  /** Plating preset id, 'custom' for a two-colour gradient, or 'none' for no frame. */
  plating: string;
  plateA: string;
  plateB: string;
  rim: string;
  innerLine: string;
  ornament: BoardOrnamentKind | 'none';
  primary: string;
  secondary: string;
  accent: string;
  showCorners: boolean;
  showEdges: boolean;
  showSides: boolean;
  showStuds: boolean;
  bandLine: boolean;
  glow: boolean;
  glowColor: string;
  motion: 'none' | 'pulse' | 'twinkle' | 'shimmer' | 'flicker';
  thickness: number;
  radius: number;
}

export type BoardThemeId =
  | SignatureBoardId
  | CustomBoardId
  | 'emerald'
  | 'wood'
  | 'obsidian'
  | 'cyberpunk'
  | 'slate'
  | 'glass'
  | 'marble'
  | 'crimson'
  | 'ocean'
  | 'desert'
  | 'forest'
  | 'sunset'
  | 'amethyst'
  | 'mocha'
  | 'monochrome';

/** 10 theme families; each renders in dark or light via `colorMode`. */
export type AppThemeId =
  | 'emerald_studio'
  | 'carbon_volt'
  | 'synthwave'
  | 'royal_velvet'
  | 'honeycomb'
  | 'coral_reef'
  | 'ink_vermilion'
  | 'cosmic_nebula'
  | 'blueprint'
  | 'liquid_chrome';

export type ColorMode = 'dark' | 'light';

export type PieceSetId =
  | 'neo'
  | 'classic'
  | 'modern'
  | 'wood'
  | 'minimal'
  | 'cyber'
  | 'glass'
  | 'gold'
  | 'retro'
  | 'gothic'
  | 'metal'
  | 'ruby'
  | 'emerald_gem'
  | 'monochrome_bold'
  | 'celestial';

export type KingFinialStyle = 'crescent' | 'star' | 'crescent_star';

export type PremoveMode = 'off' | '2' | 'infinite';

export type OpponentMode = 'ai' | 'local_2p' | 'coach';

export type AIThinkingMode = 'human' | 'instant';

export interface UserSettings {
  appTheme: AppThemeId;
  colorMode: ColorMode;
  boardTheme: BoardThemeId;
  /** When on, the board follows the piece style's signature board. */
  matchBoardToPieces: boolean;
  /** Boards saved from the Board Editor. */
  customBoards: CustomBoardRecipe[];
  pieceSet: PieceSetId;
  kingFinial: KingFinialStyle;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  hapticsEnabled: boolean;
  batterySaver: boolean;
  evalBarPosition: 'left' | 'right' | 'hidden';
  /** Board size as a percentage of the standard 540px board (60–140). */
  boardSize: number;
  showLiveEval: boolean;
  showCoordinates: 'inside' | 'outside' | 'hidden';
  showBestMoveArrow: boolean;
  autoQueen: boolean;
  moveInputMethod: 'click' | 'drag' | 'both';
  keyboardControl: boolean;
  notationInput: boolean;
  autoFlipLocal2P: boolean;
  premoveMode: PremoveMode;
  aiThinkingMode: AIThinkingMode;
  highlightLegalMoves: boolean;
  engineMaxDepth: number; // 1 to 16
  syncVaultId: string;
  e2eeEnabled: boolean;
}

export type PuzzleCategory =
  | 'All Themes'
  | 'Mate & Back Rank'
  | 'Forks & Outposts'
  | 'Pins & Skewers'
  | 'Sacrifices & Attack'
  | 'Endgame & Defense';

export interface Puzzle {
  id: string;
  fen: string;
  moves: string[]; // UCI or SAN sequence
  rating: number;
  theme: string;
  category?: Exclude<PuzzleCategory, 'All Themes'>;
  description: string;
  playerColor: PieceColor;
}
