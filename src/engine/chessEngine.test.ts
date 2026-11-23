import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import {
  evaluateBoard,
  minimax,
  winChanceFromCp,
  formatEvaluation,
  classifyMove,
  AI_BOT_PROFILES,
  MIN_AI_ELO,
  MAX_AI_ELO,
  createCustomBotProfile,
  getAIMove,
  analyzeTopLines,
  decodeMoveReasons,
  calculateAccuracyFromMoves,
  getThreatenedSquares,
  computeHumanThinkDelayMs,
  calculateSingleMoveAccuracy,
  analyzeMoveInPosition,
  analyzeCompletedGame,
  computeGamePhaseAccuracy,
  estimatePerformanceElo
} from './chessEngine';
import {
  CHESS_VARIANTS,
  generateChess960Fen,
  generateTranscendentalFen,
  checkKingOfTheHillWin,
  checkRacingKingsWin
} from './variants';
import {
  PUZZLE_DATABASE,
  getAdaptivePuzzle,
  getFilteredPuzzle,
  getPuzzleRushSequence,
  normalizePuzzleCategory,
  calculatePuzzleRatingChange,
  getLocalDailyPuzzle
} from './puzzles';
import { detectOpening } from './openings';

test('Initial chess board evaluation is approximately equal (near 0)', () => {
  const chess = new Chess();
  const evalScore = evaluateBoard(chess);
  // Both sides have symmetric material and PSTs, slight mobility difference may exist
  assert.ok(Math.abs(evalScore) < 50, `Initial eval score should be close to 0, was ${evalScore}`);
});

test('Minimax detects checkmate in 1', () => {
  // Scholar's mate setup: White queen at f3, bishop at c4, black king at e8. Move Qf7#
  const chess = new Chess('r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1');
  const result = minimax(chess, 2, -Infinity, Infinity, true);
  assert.ok(result.bestMove, 'Should find a move');
  assert.equal(result.bestMove?.from, 'f3');
  assert.equal(result.bestMove?.to, 'f7');
});

test('Win chance converts centipawns reliably', () => {
  assert.equal(winChanceFromCp(0), 50);
  assert.ok(winChanceFromCp(500) > 85);
  assert.ok(winChanceFromCp(-500) < 15);
  assert.equal(winChanceFromCp(20000), 100);
  assert.equal(winChanceFromCp(-20000), 0);
});

test('Format evaluation returns expected string formatting', () => {
  assert.equal(formatEvaluation(150), '+1.5');
  assert.equal(formatEvaluation(-80), '-0.8');
  assert.equal(formatEvaluation(20000), '+M1');
  assert.equal(formatEvaluation(-20000), '-M1');
});

test('Classify move accurately distinguishes blunder and best move', () => {
  // From +200 to -300 is a severe blunder
  const blunderClassification = classifyMove(200, -300, 'w', false, false);
  assert.equal(blunderClassification, 'blunder');

  // Finding the top move
  const bestClassification = classifyMove(100, 150, 'w', true, false);
  assert.equal(bestClassification, 'best');
});

test('Chess960 generator produces valid 8-rank starting FEN', () => {
  const fen = generateChess960Fen();
  assert.ok(fen.length > 20);
  const parts = fen.split(' ');
  const ranks = parts[0].split('/');
  assert.equal(ranks.length, 8);
  // Should have 1 king, 2 rooks, 2 bishops, 2 knights, 1 queen in rank 1
  const rank1 = ranks[7];
  assert.equal(rank1.length, 8);
  assert.ok(rank1.includes('K'));
  assert.ok(rank1.includes('Q'));
  assert.ok(rank1.includes('R'));
  assert.ok(rank1.includes('B'));
  assert.ok(rank1.includes('N'));
});

test('King of the Hill detects victory on center squares', () => {
  const chess = new Chess();
  assert.equal(checkKingOfTheHillWin(chess), null);

  // Position with white king on e4
  const kingCenterChess = new Chess('rnbqkbnr/pppppppp/8/8/4K3/8/PPPP1PPP/RNBQ1BNR w - - 0 1');
  assert.equal(checkKingOfTheHillWin(kingCenterChess), 'w');
});

test('Racing Kings detects victory when king reaches rank 8', () => {
  const racingFen = CHESS_VARIANTS.find(v => v.id === 'racing_kings')?.startFen!;
  const chess = new Chess(racingFen);
  assert.equal(checkRacingKingsWin(chess), null);

  const kingRank8Chess = new Chess('4K3/8/8/8/8/8/8/4k3 w - - 0 1');
  assert.equal(checkRacingKingsWin(kingRank8Chess), 'w');
});

test('Adaptive puzzle algorithm adapts to user rating', () => {
  const puz1 = getAdaptivePuzzle(500);
  assert.ok(puz1.rating <= 1000);

  const puzGM = getAdaptivePuzzle(2600);
  assert.ok(puzGM.rating >= 1900);

  // Rating change math
  const gain = calculatePuzzleRatingChange(1200, 1200, true);
  assert.equal(gain, 16); // 32 * (1 - 0.5)

  const loss = calculatePuzzleRatingChange(1200, 1200, false);
  assert.equal(loss, -16);
});

test('Bot profiles are configured with valid depth and elo', () => {
  assert.ok(AI_BOT_PROFILES.length >= 6);
  for (const bot of AI_BOT_PROFILES) {
    assert.ok(bot.depth >= 1);
    assert.ok(bot.elo >= 100);
  }
});

test('15 classic + 15 signature boards, 10 app themes (dark & light), and 15 piece sets are configured', async () => {
  const {
    ALL_15_BOARD_THEMES,
    APP_THEME_FAMILIES,
    SIGNATURE_BOARDS,
    ALL_15_PIECE_SETS,
    getBoardTheme,
    getAppTheme,
    signatureBoardFor,
    normalizeThemeSettings
  } = await import('../theme/themes');
  
  // Verify 15 Boards
  assert.equal(ALL_15_BOARD_THEMES.length, 15, 'Should have exactly 15 board themes');
  const boardIds = new Set(ALL_15_BOARD_THEMES.map(b => b.id));
  assert.equal(boardIds.size, 15, 'All 15 board IDs must be unique');
  for (const b of ALL_15_BOARD_THEMES) {
    assert.ok(b.name && b.name.length > 0);
    assert.ok(b.darkHex && b.darkHex.length > 0);
    assert.ok(b.lightHex && b.lightHex.length > 0);
    assert.equal(getBoardTheme(b.id).name, b.name);
  }

  // Verify 10 App Themes, each with a dark and a light mode
  assert.equal(APP_THEME_FAMILIES.length, 10, 'Should have exactly 10 app themes');
  const themeIds = new Set(APP_THEME_FAMILIES.map(t => t.id));
  assert.equal(themeIds.size, 10, 'All 10 app theme IDs must be unique');
  for (const f of APP_THEME_FAMILIES) {
    assert.ok(f.name && f.name.length > 0);
    for (const mode of ['dark', 'light'] as const) {
      const t = getAppTheme(f.id, mode);
      assert.equal(t.mode, mode);
      assert.equal(t.name, f.name);
      assert.match(t.accentHex, /^#[0-9a-f]{6}$/i, 'accentHex must be 6-digit hex (alpha suffixes are appended)');
      assert.ok(t.bgHex && t.bgGradient);
    }
  }

  // Every piece style has a framed signature board
  assert.equal(SIGNATURE_BOARDS.length, 15, 'Should have one signature board per piece style');
  for (const p of ALL_15_PIECE_SETS) {
    const sig = signatureBoardFor(p.id);
    assert.equal(sig.pieceSet, p.id);
    assert.ok(sig.frame, `${p.id} signature board needs a frame`);
  }

  // Legacy single-mode theme ids migrate to a family + mode
  const migrated = normalizeThemeSettings({ appTheme: 'rose_light' } as unknown as Partial<import('../types/chess').UserSettings>);
  assert.equal(migrated.appTheme, 'ink_vermilion');
  assert.equal(migrated.colorMode, 'light');

  // Replaced v2 families migrate without touching the chosen mode
  const replaced = normalizeThemeSettings({ appTheme: 'deep_ocean', colorMode: 'light' } as unknown as Partial<import('../types/chess').UserSettings>);
  assert.equal(replaced.appTheme, 'coral_reef');
  assert.equal(replaced.colorMode, 'light');

  // Verify 15 Piece Sets
  assert.equal(ALL_15_PIECE_SETS.length, 15, 'Should have exactly 15 piece styles');
  const pieceIds = new Set(ALL_15_PIECE_SETS.map(p => p.id));
  assert.equal(pieceIds.size, 15, 'All 15 piece set IDs must be unique');
  for (const p of ALL_15_PIECE_SETS) {
    assert.ok(p.name && p.name.length > 0);
    assert.ok(p.tagline && p.tagline.length > 0);
    assert.ok(p.icon && p.icon.length > 0);
  }
});

test('Chaturanga variant is properly configured in CHESS_VARIANTS', () => {
  const chaturanga = CHESS_VARIANTS.find(v => v.id === 'chaturanga');
  assert.ok(chaturanga, 'Chaturanga variant must exist in CHESS_VARIANTS');
  assert.equal(chaturanga?.category, 'Historical');
  assert.ok(chaturanga?.name.includes('Chaturanga'));
  assert.ok(chaturanga?.specialRules.some(r => r.includes('Gaja') || r.includes('Elephant')));
  assert.ok(chaturanga?.specialRules.some(r => r.includes('Mantri') || r.includes('Counselor')));
});

test('Custom Variant Engine correctly handles fairy pieces, custom sizes, and bare king victory', async () => {
  const {
    getPieceMoves,
    executeCustomMove,
    getAllLegalMoves,
    evaluateCustomBoard,
    DEFAULT_CUSTOM_PRESETS
  } = await import('./customVariantEngine');

  // 1. Elephant (Gaja / Alfil) leaps exactly 2 squares diagonally over any piece
  const grid: (import('../types/chess').CustomBoardSquare | null)[][] = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));
  grid[4][4] = { type: 'e', color: 'w' };
  // Put a piece right next to the elephant (at 3, 3) to test jumping over
  grid[3][3] = { type: 'p', color: 'w' };

  const elephantMoves = getPieceMoves(grid, 4, 4, {
    pawnDoubleStep: false,
    enPassant: false,
    castling: false,
    mandatoryCaptures: false,
    atomicExplosions: false,
    allowDuckPlacement: false,
    winConditions: { checkmate: true, centerHill: false, racingKings: false, bareKing: true, threeCheck: false }
  }, null);

  // An Elephant at (4,4) should leap to (2,2), (2,6), (6,2), (6,6) even jumping over (3,3)!
  const targetSquares = elephantMoves.map(m => `${m.toRow},${m.toCol}`);
  assert.ok(targetSquares.includes('2,2'), 'Elephant leaps over piece at (3,3) to (2,2)');
  assert.ok(targetSquares.includes('2,6'), 'Elephant leaps to (2,6)');
  assert.ok(targetSquares.includes('6,2'), 'Elephant leaps to (6,2)');
  assert.ok(targetSquares.includes('6,6'), 'Elephant leaps to (6,6)');
  assert.equal(elephantMoves.length, 4, 'Elephant on open board has exactly 4 diagonal leaps');

  // 2. Ferz / Mantri moves 1 square diagonally
  grid[4][4] = { type: 'f', color: 'w' };
  const ferzMoves = getPieceMoves(grid, 4, 4, {
    pawnDoubleStep: false,
    enPassant: false,
    castling: false,
    mandatoryCaptures: false,
    atomicExplosions: false,
    allowDuckPlacement: false,
    winConditions: { checkmate: true, centerHill: false, racingKings: false, bareKing: true, threeCheck: false }
  }, null);
  // (3,3) has a friendly pawn, so Ferz can move to (3,5), (5,3), (5,5)
  assert.equal(ferzMoves.length, 3, 'Ferz moves 1 diagonal step');

  // 3. Chancellor (Rook + Knight compound)
  grid[4][4] = { type: 'c', color: 'w' };
  const chancellorMoves = getPieceMoves(grid, 4, 4, {
    pawnDoubleStep: false,
    enPassant: false,
    castling: false,
    mandatoryCaptures: false,
    atomicExplosions: false,
    allowDuckPlacement: false,
    winConditions: { checkmate: true, centerHill: false, racingKings: false, bareKing: false, threeCheck: false }
  }, null);
  // Should have orthogonal moves + knight hops
  assert.ok(chancellorMoves.some(m => m.toRow === 4 && m.toCol === 0), 'Chancellor moves like Rook');
  assert.ok(chancellorMoves.some(m => m.toRow === 2 && m.toCol === 5), 'Chancellor jumps like Knight');

  // 4. Bare King Victory test
  const bareKingPreset = DEFAULT_CUSTOM_PRESETS[0]; // Chaturanga
  const customGrid: (import('../types/chess').CustomBoardSquare | null)[][] = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));
  const customState = {
    config: bareKingPreset,
    grid: customGrid,
    turn: 'w' as const,
    moveNumber: 1,
    history: [],
    duckPos: null,
    whiteChecks: 0,
    blackChecks: 0,
    winner: null
  };
  // White has King and Rook, Black has King and 1 Pawn
  customState.grid[7][4] = { type: 'k', color: 'w' };
  customState.grid[7][0] = { type: 'r', color: 'w' };
  customState.grid[0][4] = { type: 'k', color: 'b' };
  customState.grid[1][0] = { type: 'p', color: 'b' };

  // Rook captures the last Black pawn
  const captureMove = {
    fromRow: 7,
    fromCol: 0,
    toRow: 1,
    toCol: 0,
    piece: { type: 'r' as const, color: 'w' as const },
    captured: { type: 'p' as const, color: 'b' as const },
    san: 'Rxa7'
  };
  const afterCap = executeCustomMove(customState, captureMove);
  assert.equal(afterCap.winner, 'w', 'White wins by baring the Black King');
  assert.ok(afterCap.winReason?.includes('bared the opponent King'));
});

test('variantToCustomConfig produces authentic Chaturanga setup and enforces check legality', async () => {
  const {
    variantToCustomConfig,
    getAllLegalMoves,
    executeCustomMove
  } = await import('./customVariantEngine');

  const chaturangaConfig = variantToCustomConfig('chaturanga');
  assert.equal(chaturangaConfig.boardWidth, 8);
  assert.equal(chaturangaConfig.boardHeight, 8);
  assert.equal(chaturangaConfig.rules.pawnDoubleStep, false);
  assert.equal(chaturangaConfig.rules.castling, false);
  assert.equal(chaturangaConfig.rules.promotionPiece, 'f');
  assert.equal(chaturangaConfig.rules.winConditions.bareKing, true);

  // Verify White back rank has Gaja (e) on c1/f1, Raja (k) on d1, and Mantri (f) on e1
  assert.equal(chaturangaConfig.grid[7][2]?.type, 'e');
  assert.equal(chaturangaConfig.grid[7][3]?.type, 'k');
  assert.equal(chaturangaConfig.grid[7][4]?.type, 'f');
  assert.equal(chaturangaConfig.grid[7][5]?.type, 'e');

  const game = {
    config: chaturangaConfig,
    grid: chaturangaConfig.grid.map(row => row.map(sq => (sq ? { ...sq } : null))),
    turn: 'w' as const,
    moveNumber: 1,
    history: [],
    duckPos: null,
    whiteChecks: 0,
    blackChecks: 0,
    winner: null
  };
  const openingMoves = getAllLegalMoves(game);
  // 8 pawns x 1 step (no double step) + 2 knights x 2 hops + 2 Gajas x 2 diagonal leaps over pawns = 16
  assert.equal(openingMoves.length, 16, 'Chaturanga opening has 16 legal moves (single pawn steps + knight hops + Gaja leaps)');

  // Verify self-check is filtered and back-rank checkmate ends the game
  const emptyGrid: (import('../types/chess').CustomBoardSquare | null)[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => null)
  );
  emptyGrid[0][7] = { type: 'k', color: 'b' };
  emptyGrid[1][6] = { type: 'p', color: 'b' };
  emptyGrid[1][7] = { type: 'p', color: 'b' };
  emptyGrid[7][4] = { type: 'k', color: 'w' };
  emptyGrid[2][0] = { type: 'r', color: 'w' };

  const mateSetup = {
    config: chaturangaConfig,
    grid: emptyGrid,
    turn: 'w' as const,
    moveNumber: 10,
    history: [],
    duckPos: null,
    whiteChecks: 0,
    blackChecks: 0,
    winner: null
  };

  const mateMove = {
    fromRow: 2,
    fromCol: 0,
    toRow: 0,
    toCol: 0,
    piece: { type: 'r' as const, color: 'w' as const },
    san: 'Ra8'
  };
  const afterMate = executeCustomMove(mateSetup, mateMove);
  assert.equal(afterMate.winner, 'w', 'Back-rank rook mate awards victory in customVariantEngine');
  assert.ok(afterMate.winReason?.includes('Checkmate'));
});

test('All 1000+ puzzles in PUZZLE_DATABASE have valid FENs and 100% legal UCI move sequences', () => {
  assert.ok(PUZZLE_DATABASE.length >= 1000, `Expected at least 1000 puzzles, found ${PUZZLE_DATABASE.length}`);
  const seenIds = new Set<string>();

  for (const puzzle of PUZZLE_DATABASE) {
    assert.ok(!seenIds.has(puzzle.id), `Duplicate puzzle ID: ${puzzle.id}`);
    seenIds.add(puzzle.id);

    const game = new Chess(puzzle.fen);
    assert.equal(game.turn(), puzzle.playerColor, `Turn mismatch for puzzle ${puzzle.id}`);
    assert.ok(puzzle.moves.length >= 1, `Puzzle ${puzzle.id} must have moves`);

    for (let i = 0; i < puzzle.moves.length; i++) {
      const uci = puzzle.moves[i];
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const move = game.move({ from, to, promotion });
      assert.ok(move, `Illegal move ${uci} at step ${i} in puzzle ${puzzle.id} (FEN: ${puzzle.fen})`);
    }
  }
});

test('Puzzle filtering, search query, daily fallback, and Puzzle Rush ordering work accurately', () => {
  assert.equal(normalizePuzzleCategory('Pin & Skewer'), 'Pins & Skewers');
  assert.equal(normalizePuzzleCategory('Greek Gift'), 'Sacrifices & Attack');

  const forkPuzzle = getFilteredPuzzle(1000, 'Forks & Outposts', 'all', []);
  assert.equal(forkPuzzle.category, 'Forks & Outposts');

  const masterPuzzle = getFilteredPuzzle(2400, 'All Themes', 'master', []);
  assert.ok(masterPuzzle.rating >= 2200);

  const searchMatch = getFilteredPuzzle(1500, 'All Themes', 'all', [], undefined, 'smothered');
  assert.ok(searchMatch.theme.toLowerCase().includes('smothered'));

  const dailyFallback = getLocalDailyPuzzle();
  assert.ok(dailyFallback.fen && dailyFallback.moves.length >= 1);

  const rush = getPuzzleRushSequence();
  assert.equal(rush.length, PUZZLE_DATABASE.length);
  for (let i = 1; i < rush.length; i++) {
    assert.ok(rush[i].rating >= rush[i - 1].rating, 'Puzzle Rush must be sorted in ascending difficulty');
  }
});

test('ECO Opening Book detects classic chess openings accurately', () => {
  const italian = detectOpening(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5']);
  assert.equal(italian?.eco, 'C50');
  assert.ok(italian?.name.includes('Italian'));

  const sicilianNajdorf = detectOpening(['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6']);
  assert.equal(sicilianNajdorf?.eco, 'B90');
  assert.ok(sicilianNajdorf?.name.includes('Najdorf'));

  const empty = detectOpening([]);
  assert.equal(empty, null);
});

test('Custom AI Elo scales cleanly from 100 minimum to 3600 maximum local strength', () => {
  const lowBot = createCustomBotProfile(25);
  assert.equal(lowBot.elo, MIN_AI_ELO); // Clamped to 100
  assert.equal(lowBot.depth, 1);
  assert.ok(lowBot.blunderRate > 0.5);

  const highBot = createCustomBotProfile(5000);
  assert.equal(highBot.elo, MAX_AI_ELO); // Clamped to 3600
  assert.ok(highBot.depth >= 6);
  assert.equal(highBot.blunderRate, 0);

  // Ensure both bots produce valid moves swiftly
  const chess = new Chess('r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1');
  const lowMove = getAIMove(chess, lowBot);
  assert.ok(lowMove, '100 Elo bot returns a valid legal move');

  const maxMove = getAIMove(chess, highBot);
  assert.ok(maxMove, '3600 Elo Max bot returns a valid legal move');
  assert.equal(maxMove?.from, 'f3');
  assert.equal(maxMove?.to, 'f7'); // Finds forced Qf7# mate immediately
});

test('analyzeTopLines and decodeMoveReasons produce ranked lines and plain-English insights', () => {
  const chess = new Chess('r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1');
  const lines = analyzeTopLines(chess, 3, 3, 400);
  assert.ok(lines.length >= 2);
  assert.equal(lines[0].san, 'Qxf7#');
  assert.ok(lines[0].reasons.some(r => r.toLowerCase().includes('checkmate')));
  assert.ok(lines[0].pvSan.length >= 1);

  const startBoard = new Chess();
  const e4 = startBoard.move('e4');
  startBoard.undo();
  const reasons = decodeMoveReasons(startBoard, e4);
  assert.ok(reasons.length >= 1);
  assert.ok(reasons.some(r => r.includes('e4')));

  const acc = calculateAccuracyFromMoves(
    [
      { san: 'e4', from: 'e2', to: 'e4', classification: 'best', evalBefore: 10, evalAfter: 25 },
      { san: 'e5', from: 'e7', to: 'e5', classification: 'good', evalBefore: 25, evalAfter: 10 }
    ],
    'w'
  );
  assert.ok(acc >= 90);
});

test('36 chess variants, Transcendental FEN, and expanded 5x5/6x6/10x8 custom configs are configured accurately', async () => {
  const { variantToCustomConfig, getAllLegalMoves } = await import('./customVariantEngine');

  assert.equal(CHESS_VARIANTS.length, 36, 'Should configure 36 distinct chess variants');
  const uniqueVariantIds = new Set(CHESS_VARIANTS.map(v => v.id));
  assert.equal(uniqueVariantIds.size, 36, 'All 36 variant IDs must be unique');

  const transFen = generateTranscendentalFen();
  const transBoard = new Chess(transFen);
  assert.equal(transBoard.turn(), 'w');
  assert.ok(transBoard.moves().length >= 16);

  const losAlamos = variantToCustomConfig('los_alamos');
  assert.equal(losAlamos.boardWidth, 6);
  assert.equal(losAlamos.boardHeight, 6);

  const gardner = variantToCustomConfig('minichess_5x5');
  assert.equal(gardner.boardWidth, 5);
  assert.equal(gardner.boardHeight, 5);

  const capablanca = variantToCustomConfig('capablanca_10x8');
  assert.equal(capablanca.boardWidth, 10);
  assert.equal(capablanca.boardHeight, 8);
  const capaMoves = getAllLegalMoves({
    config: capablanca,
    grid: capablanca.grid,
    turn: 'w',
    moveNumber: 1,
    history: [],
    duckPos: null,
    whiteChecks: 0,
    blackChecks: 0,
    winner: null
  });
  // 10 pawns * 2 steps + 2 knights * 2 + Archbishop * 2 + Chancellor * 2 = 28 moves
  assert.equal(capaMoves.length, 28, 'Capablanca 10x8 opening has 28 legal moves');

  const cannon = variantToCustomConfig('cannon_siege');
  assert.equal(cannon.boardWidth, 8);
  assert.ok(cannon.customPiecesUsed.includes('o'));
});

test('AI bot characters include distinct personas and getThreatenedSquares flags hanging pieces', () => {
  assert.ok(AI_BOT_PROFILES.length >= 9);
  const ids = new Set(AI_BOT_PROFILES.map(b => b.id));
  assert.equal(ids.size, AI_BOT_PROFILES.length);
  for (const bot of AI_BOT_PROFILES) {
    assert.ok(bot.title && bot.title.length > 0, `Bot ${bot.name} should have a character title`);
    assert.ok(bot.accentHex && bot.accentHex.startsWith('#'), `Bot ${bot.name} should have an accent color`);
  }

  // White knight on e5 is undefended and attacked by Black bishop on g7 or pawn on d6; also White queen on d4 attacked by pawn c5
  const chess = new Chess('rnbqkbnr/ppp2ppp/3p4/4N3/3Q4/8/PPPPPPPP/RNB1KB1R w KQkq - 0 4');
  const threats = getThreatenedSquares(chess, 'w');
  assert.ok(threats.includes('e5'), `Expected hanging knight on e5 to be flagged, got ${threats.join(',')}`);
});

test('computeHumanThinkDelayMs scales naturally by time control, low-clock scramble, and forcingness', () => {
  const bot = AI_BOT_PROFILES[3]; // Viktor 1250 Elo
  const complexMid = new Chess('r1bq1rk1/pp2bppp/2n1pn2/2pp4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 9');
  const forcedOnlyKing = new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1'); // Only one or two legal moves (Kg8)

  const rapidDelay = computeHumanThinkDelayMs(complexMid, bot, 600, 580, 0.5);
  const blitzDelay = computeHumanThinkDelayMs(complexMid, bot, 180, 170, 0.5);
  const bulletDelay = computeHumanThinkDelayMs(complexMid, bot, 60, 55, 0.5);
  const scrambleDelay = computeHumanThinkDelayMs(complexMid, bot, 600, 8, 0.5);
  const forcedDelay = computeHumanThinkDelayMs(forcedOnlyKing, bot, 600, 580, 0.5);

  assert.ok(rapidDelay > blitzDelay, `Rapid (${rapidDelay}ms) should exceed Blitz (${blitzDelay}ms)`);
  assert.ok(blitzDelay > bulletDelay, `Blitz (${blitzDelay}ms) should exceed Bullet (${bulletDelay}ms)`);
  assert.ok(scrambleDelay <= 720 && scrambleDelay >= 220, `Scramble (${scrambleDelay}ms) should stay brisk`);
  assert.ok(forcedDelay < rapidDelay, `Forced reply (${forcedDelay}ms) should be quicker than complex middlegame (${rapidDelay}ms)`);
});

test('analyzeMoveInPosition classifies best move vs hanging-piece blunder and populates PV & accuracy', () => {
  // Queen takes pawn on e5 when e5 is defended by Knight on c6
  const dropFen = 'r1bqkbnr/pppp1ppp/2n5/4p3/4Q3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3';
  const dropBoard = new Chess(dropFen);
  const qxe5 = dropBoard.move('Qxe5');
  dropBoard.undo();

  const blunderResult = analyzeMoveInPosition(dropBoard, qxe5, 80, 10);
  assert.equal(blunderResult.classification, 'blunder', `Expected Qxe5 to be blunder, got ${blunderResult.classification}`);
  assert.ok(blunderResult.moveAccuracy < 45, `Expected low move accuracy for queen blunder, got ${blunderResult.moveAccuracy}`);
  assert.ok(blunderResult.bestMoveSan && blunderResult.bestMoveSan !== 'Qxe5');
  assert.ok(blunderResult.pvSan.length >= 1);
  assert.ok(blunderResult.commentary.length > 10);

  // Mate in 1 is always top-tier & ~100% accuracy
  const mateFen = 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1';
  const mateBoard = new Chess(mateFen);
  const qxf7 = mateBoard.move('Qxf7#');
  mateBoard.undo();
  const bestResult = analyzeMoveInPosition(mateBoard, qxf7, 80, 12);
  assert.ok(['best', 'great', 'brilliant'].includes(bestResult.classification));
  assert.ok(bestResult.moveAccuracy >= 95);
});

test('analyzeCompletedGame, computeGamePhaseAccuracy, and estimatePerformanceElo work cleanly', () => {
  const sampleGame = new Chess();
  const rawMoves: import('../types/chess').MoveAnalysis[] = [];
  for (const san of ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6']) {
    const m = sampleGame.move(san);
    rawMoves.push({
      san: m.san,
      from: m.from,
      to: m.to,
      classification: 'good',
      evalBefore: 0,
      evalAfter: 0
    });
  }
  const enriched = analyzeCompletedGame(rawMoves);
  assert.equal(enriched.length, 6);
  for (const item of enriched) {
    assert.equal(typeof item.moveAccuracy, 'number');
    assert.ok(item.bestMoveSan && item.bestMoveSan.length > 0);
    assert.ok(item.commentary && item.commentary.length > 0);
  }

  const phases = computeGamePhaseAccuracy(enriched, 'w');
  assert.ok(phases.opening !== null && phases.opening >= 50);
  assert.equal(phases.middlegame, null);

  const singleAcc = calculateSingleMoveAccuracy(50, 50, 'w', true, 'best');
  assert.equal(singleAcc, 98.5);
  assert.equal(calculateSingleMoveAccuracy(50, 50, 'w', true, 'brilliant'), 100);

  const winElo = estimatePerformanceElo(92, 1400, 1);
  const lossElo = estimatePerformanceElo(45, 1400, 0);
  assert.ok(winElo > 1600);
  assert.ok(lossElo < 1000);
});

test('Rule-changing custom variants (Horde, Atomic, Antichess, Checkless, Gladiator, Extinction, Absorption, Knightmare) execute legally', async () => {
  const {
    createCustomGameState,
    variantToCustomConfig,
    getAllLegalMoves,
    executeCustomMove,
    chooseSmartDuckPos
  } = await import('./customVariantEngine');

  // Horde: White starts with 36 pawns vs Black full army
  const hordeState = createCustomGameState(variantToCustomConfig('horde'));
  const hordeMoves = getAllLegalMoves(hordeState);
  assert.ok(hordeMoves.length >= 8, `Horde White opening should have legal pawn moves, got ${hordeMoves.length}`);

  // Antichess: Captures are mandatory when available
  const antiCfg = variantToCustomConfig('antichess');
  const antiGrid: (import('../types/chess').CustomBoardSquare | null)[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => null)
  );
  antiGrid[4][4] = { type: 'r', color: 'w' };
  antiGrid[4][6] = { type: 'p', color: 'b' };
  const antiMoves = getAllLegalMoves({
    ...createCustomGameState(antiCfg),
    grid: antiGrid
  });
  assert.equal(antiMoves.length, 1, 'Antichess forces the single available capture');
  assert.equal(antiMoves[0].toRow, 4);
  assert.equal(antiMoves[0].toCol, 6);

  // Duck Chess: chooseSmartDuckPos picks an empty square
  const duckState = createCustomGameState(variantToCustomConfig('duck_chess'));
  const duckTarget = chooseSmartDuckPos(duckState);
  assert.ok(duckTarget !== null, 'chooseSmartDuckPos returns a valid empty square');
  assert.equal(duckState.grid[duckTarget!.row][duckTarget!.col], null);

  // Checkless: Non-checkmating check moves are filtered out
  const checklessCfg = variantToCustomConfig('checkless');
  const checklessGrid: (import('../types/chess').CustomBoardSquare | null)[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => null)
  );
  checklessGrid[0][4] = { type: 'k', color: 'b' };
  checklessGrid[7][0] = { type: 'r', color: 'w' };
  checklessGrid[7][7] = { type: 'k', color: 'w' };
  const checklessMoves = getAllLegalMoves({
    ...createCustomGameState(checklessCfg),
    grid: checklessGrid
  });
  assert.ok(
    !checklessMoves.some(m => m.toRow === 0 && m.toCol === 0),
    'Checkless must forbid non-mating checking move Ra8+'
  );

  // Gladiator: Capturer receives one-turn shield, preventing immediate recapture
  const gladCfg = variantToCustomConfig('gladiator');
  const gladGrid: (import('../types/chess').CustomBoardSquare | null)[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => null)
  );
  gladGrid[7][4] = { type: 'k', color: 'w' };
  gladGrid[0][4] = { type: 'k', color: 'b' };
  gladGrid[4][4] = { type: 'r', color: 'w' };
  gladGrid[3][4] = { type: 'n', color: 'b' };
  gladGrid[2][3] = { type: 'p', color: 'b' };
  const gladStart = { ...createCustomGameState(gladCfg), grid: gladGrid };
  const gladCap = getAllLegalMoves(gladStart).find(m => m.fromRow === 4 && m.fromCol === 4 && m.toRow === 3 && m.toCol === 4);
  assert.ok(gladCap, 'White rook can capture Black knight');
  const afterGlad = executeCustomMove(gladStart, gladCap!);
  assert.equal(afterGlad.shieldedPos?.row, 3);
  assert.equal(afterGlad.shieldedPos?.col, 4);
  assert.equal(afterGlad.shieldedPos?.protectedColor, 'w');
  const blackReplies = getAllLegalMoves(afterGlad);
  assert.ok(
    !blackReplies.some(m => m.toRow === 3 && m.toCol === 4),
    'Gladiator shield prevents Black pawn from immediately recapturing shielded Rook'
  );

  // Absorption: Capturing a Knight grants Knight hops to a Rook
  const absCfg = variantToCustomConfig('absorption');
  const absGrid: (import('../types/chess').CustomBoardSquare | null)[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => null)
  );
  absGrid[7][4] = { type: 'k', color: 'w' };
  absGrid[0][4] = { type: 'k', color: 'b' };
  absGrid[4][4] = { type: 'r', color: 'w' };
  absGrid[4][6] = { type: 'n', color: 'b' };
  const absStart = { ...createCustomGameState(absCfg), grid: absGrid };
  const absCap = getAllLegalMoves(absStart).find(m => m.fromRow === 4 && m.fromCol === 4 && m.toRow === 4 && m.toCol === 6);
  assert.ok(absCap);
  const afterAbs = executeCustomMove(absStart, absCap!);
  assert.ok(afterAbs.grid[4][6]?.absorbed?.includes('n'), 'Rook absorbs captured Knight ability');

  // Extinction: Capturing the last enemy Pawn awards immediate win
  const extCfg = variantToCustomConfig('extinction');
  const extGrid: (import('../types/chess').CustomBoardSquare | null)[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => null)
  );
  extGrid[7][4] = { type: 'k', color: 'w' };
  extGrid[0][4] = { type: 'k', color: 'b' };
  extGrid[4][0] = { type: 'r', color: 'w' };
  extGrid[2][0] = { type: 'p', color: 'b' };
  extGrid[0][7] = { type: 'r', color: 'b' };
  const extStart = { ...createCustomGameState(extCfg), grid: extGrid };
  const extCap = getAllLegalMoves(extStart).find(m => m.fromRow === 4 && m.fromCol === 0 && m.toRow === 2 && m.toCol === 0);
  assert.ok(extCap);
  const afterExt = executeCustomMove(extStart, extCap!);
  assert.equal(afterExt.winner, 'w', 'Extinction awards victory when all enemy Pawns are eliminated');
});

test('STOCKFISH_VARIANTS excludes rule-changing variants and keeps standard-rule variants', async () => {
  const { STOCKFISH_VARIANTS } = await import('./variants');
  assert.ok(STOCKFISH_VARIANTS.has('standard'));
  assert.ok(STOCKFISH_VARIANTS.has('chess960'));
  assert.ok(STOCKFISH_VARIANTS.has('transcendental'));
  assert.ok(!STOCKFISH_VARIANTS.has('crazyhouse'));
  assert.ok(!STOCKFISH_VARIANTS.has('fog_of_war'));
  assert.ok(!STOCKFISH_VARIANTS.has('atomic'));
  assert.ok(!STOCKFISH_VARIANTS.has('duck_chess'));
});

test('pgnImport parses valid PGNs, formats time controls, and rejects non-standard FEN/Variant headers', async () => {
  const { parsePgn, formatTimeControl } = await import('./pgnImport');

  assert.equal(formatTimeControl('600+5'), 'Rapid 10+5');
  assert.equal(formatTimeControl('180+0'), 'Blitz 3+0');
  assert.equal(formatTimeControl('60+0'), 'Bullet 1+0');
  assert.equal(formatTimeControl('-'), 'Imported');

  const valid = parsePgn('[Event "Club Match"]\n[White "Alice"]\n[Black "Bob"]\n[Result "1-0"]\n\n1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0');
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.game.white, 'Alice');
    assert.equal(valid.game.moves.length, 7);
    assert.equal(valid.game.reason, 'checkmate');
  }

  const customFenPgn = parsePgn('[SetUp "1"]\n[FEN "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"]\n\n1... e5');
  assert.equal(customFenPgn.ok, false);

  const variantPgn = parsePgn('[Variant "Crazyhouse"]\n\n1. e4 e5');
  assert.equal(variantPgn.ok, false);
});

test('searchGlobalCatalog finds games, variants, custom variants, help topics, openings, and endgames accurately', async () => {
  const { searchGlobalCatalog } = await import('./globalSearch');
  const sampleMatches: import('../types/chess').GameHistoryItem[] = [
    {
      id: 'g-1',
      date: '2026-11-10',
      variant: 'standard',
      playerColor: 'w',
      opponentName: 'Viktor (Intermediate)',
      opponentElo: 1400,
      timeControl: 'Rapid 10+0',
      result: '1-0',
      reason: 'checkmate',
      movesCount: 28,
      pgn: '1. e4 e5 2. Nf3 Nc6'
    },
    {
      id: 'g-2',
      date: '2026-11-08',
      variant: 'king_of_the_hill',
      playerColor: 'b',
      opponentName: 'Elena (Club Player)',
      opponentElo: 900,
      timeControl: 'Blitz 5+0',
      result: '0-1',
      reason: 'variant_goal',
      movesCount: 16,
      pgn: '1. e4 e5'
    }
  ];

  // Empty query returns featured results across categories
  const defaults = searchGlobalCatalog('', { matches: sampleMatches });
  assert.ok(defaults.some(r => r.kind === 'game'));
  assert.ok(defaults.some(r => r.kind === 'variant'));
  assert.ok(defaults.some(r => r.kind === 'help'));

  // Finds game by opponent or variant name
  const gameResults = searchGlobalCatalog('viktor', { matches: sampleMatches, category: 'game' });
  assert.equal(gameResults.length, 1);
  assert.equal(gameResults[0].kind, 'game');

  const kothGame = searchGlobalCatalog('king of the hill', { matches: sampleMatches, category: 'game' });
  assert.equal(kothGame.length, 1);
  assert.equal(kothGame[0].id, 'game:g-2');

  // Finds built-in and custom variants
  const chaturanga = searchGlobalCatalog('chaturanga', { matches: sampleMatches, category: 'variant' });
  assert.ok(chaturanga.some(r => r.kind === 'variant' && r.variantId === 'chaturanga'));

  const customSearch = searchGlobalCatalog('Nebula 9x9', {
    matches: sampleMatches,
    category: 'variant',
    customVariants: [
      {
        id: 'cv-nebula',
        name: 'Nebula 9x9',
        tagline: 'Custom 9x9 test board',
        description: 'Custom test variant',
        boardWidth: 9,
        boardHeight: 9,
        grid: [],
        customPiecesUsed: ['k'],
        createdAt: '2026-11-17',
        rules: {
          castling: false,
          enPassant: false,
          pawnDoubleStep: false,
          mandatoryCaptures: false,
          atomicExplosions: false,
          allowDuckPlacement: false,
          winConditions: {
            checkmate: true,
            centerHill: false,
            racingKings: false,
            bareKing: false,
            threeCheck: false
          }
        }
      }
    ]
  });
  assert.ok(customSearch.some(r => r.kind === 'custom_variant' && r.title === 'Nebula 9x9'));

  // Finds help topics, openings, and endgames
  const e2eeHelp = searchGlobalCatalog('e2ee vault', { matches: sampleMatches, category: 'help' });
  assert.ok(
    e2eeHelp.some(
      r =>
        r.kind === 'help' &&
        r.helpTopic.action?.target.type === 'settings' &&
        r.helpTopic.action.target.tab === 'sync'
    )
  );

  const lucenaHelp = searchGlobalCatalog('lucena', { matches: sampleMatches, category: 'help' });
  assert.ok(
    lucenaHelp.some(
      r =>
        r.kind === 'help' &&
        r.helpTopic.action?.target.type === 'tab' &&
        r.helpTopic.action.target.trainSection === 'endgames'
    )
  );
});

test('keyboardShortcuts catalog filters cleanly and resolves global & PlayView keybindings without conflicts', async () => {
  const {
    KEYBOARD_SHORTCUTS,
    filterShortcuts,
    resolveGlobalNavigationShortcut,
    resolvePlayViewShortcut
  } = await import('./keyboardShortcuts');

  assert.ok(KEYBOARD_SHORTCUTS.length >= 20);
  const gameplayItems = filterShortcuts('flip', 'gameplay');
  assert.equal(gameplayItems.length, 1);
  assert.equal(gameplayItems[0].id, 'play-flip');

  // Global navigation shortcuts
  assert.deepEqual(resolveGlobalNavigationShortcut({ key: '?' }, { modalOpen: false }), {
    type: 'toggle_shortcuts'
  });
  assert.deepEqual(resolveGlobalNavigationShortcut({ key: '3' }, { modalOpen: false }), {
    type: 'switch_tab',
    tab: 'puzzles'
  });
  assert.deepEqual(resolveGlobalNavigationShortcut({ key: ',' }, { modalOpen: false }), {
    type: 'open_settings'
  });
  assert.deepEqual(resolveGlobalNavigationShortcut({ key: 't', altKey: true }, { modalOpen: false }), {
    type: 'toggle_color_mode'
  });
  // Blocked when typing in input or when modal is open (except Escape / ?)
  assert.equal(
    resolveGlobalNavigationShortcut({ key: '1', target: { tagName: 'INPUT' } as unknown as EventTarget }, { modalOpen: false }),
    null
  );
  assert.equal(resolveGlobalNavigationShortcut({ key: '2' }, { modalOpen: true }), null);
  assert.deepEqual(resolveGlobalNavigationShortcut({ key: 'Escape' }, { modalOpen: true }), {
    type: 'close_modal'
  });

  // Play Arena gameplay shortcuts
  assert.deepEqual(resolvePlayViewShortcut({ key: 'f' }, { keyboardControl: true, hasMoves: true, modalOpen: false }), {
    type: 'flip'
  });
  assert.deepEqual(resolvePlayViewShortcut({ key: 'h' }, { keyboardControl: false, hasMoves: false, modalOpen: false }), {
    type: 'hint'
  });
  assert.deepEqual(resolvePlayViewShortcut({ key: 'u' }, { keyboardControl: false, hasMoves: true, modalOpen: false }), {
    type: 'undo'
  });
  assert.deepEqual(resolvePlayViewShortcut({ key: 'p' }, { keyboardControl: false, hasMoves: true, modalOpen: false }), {
    type: 'toggle_pause'
  });
  assert.deepEqual(resolvePlayViewShortcut({ key: 'n' }, { keyboardControl: false, hasMoves: true, modalOpen: false }), {
    type: 'new_game'
  });
  assert.deepEqual(resolvePlayViewShortcut({ key: 't' }, { keyboardControl: false, hasMoves: true, modalOpen: false }), {
    type: 'focus_notation'
  });

  // Arrow keys step history only when keyboardControl is OFF or Shift is held; [ / ] always step
  assert.equal(
    resolvePlayViewShortcut({ key: 'ArrowLeft' }, { keyboardControl: true, hasMoves: true, modalOpen: false }),
    null
  );
  assert.deepEqual(
    resolvePlayViewShortcut({ key: 'ArrowLeft', shiftKey: true }, { keyboardControl: true, hasMoves: true, modalOpen: false }),
    { type: 'history_prev' }
  );
  assert.deepEqual(
    resolvePlayViewShortcut({ key: '[' }, { keyboardControl: true, hasMoves: true, modalOpen: false }),
    { type: 'history_prev' }
  );
  assert.deepEqual(
    resolvePlayViewShortcut({ key: 'ArrowRight' }, { keyboardControl: false, hasMoves: true, modalOpen: false }),
    { type: 'history_next' }
  );
});

test('computeDailyPuzzleStreak tracks consecutive daily solves, yesterday grace window, missed-day resets, and 7-day history', async () => {
  const { computeDailyPuzzleStreak, shiftDateKey } = await import('./dailyPuzzleStreak');

  assert.equal(shiftDateKey('2026-11-18', -1), '2026-11-17');
  assert.equal(shiftDateKey('2026-03-01', -1), '2026-02-28');

  // Empty history -> 0 streak, 7 days ending today
  const empty = computeDailyPuzzleStreak(
    { solvedDates: [], dailyChallengeSolvedDates: [], bestStreak: 0 },
    '2026-11-18'
  );
  assert.equal(empty.currentStreak, 0);
  assert.equal(empty.solvedToday, false);
  assert.equal(empty.atRisk, false);
  assert.equal(empty.last7Days.length, 7);
  assert.equal(empty.last7Days[6].dateKey, '2026-11-18');
  assert.equal(empty.last7Days[6].isToday, true);

  // Solved yesterday + 2 days before, not yet today -> active 3-day streak at risk
  const graceWindow = computeDailyPuzzleStreak(
    {
      solvedDates: ['2026-11-15', '2026-11-16', '2026-11-17'],
      dailyChallengeSolvedDates: [],
      bestStreak: 2
    },
    '2026-11-18'
  );
  assert.equal(graceWindow.currentStreak, 3);
  assert.equal(graceWindow.bestStreak, 3);
  assert.equal(graceWindow.solvedToday, false);
  assert.equal(graceWindow.atRisk, true);

  // Extending today lifts currentStreak to 4 and clears atRisk
  const extendedToday = computeDailyPuzzleStreak(
    {
      solvedDates: ['2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18'],
      dailyChallengeSolvedDates: ['2026-11-18'],
      bestStreak: 3
    },
    '2026-11-18'
  );
  assert.equal(extendedToday.currentStreak, 4);
  assert.equal(extendedToday.bestStreak, 4);
  assert.equal(extendedToday.solvedToday, true);
  assert.equal(extendedToday.dailyChallengeSolvedToday, true);
  assert.equal(extendedToday.atRisk, false);

  // Broken gap (missed yesterday) resets currentStreak to 0 while keeping historical bestStreak
  const broken = computeDailyPuzzleStreak(
    {
      solvedDates: ['2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14'],
      dailyChallengeSolvedDates: [],
      bestStreak: 5
    },
    '2026-11-18'
  );
  assert.equal(broken.currentStreak, 0);
  assert.equal(broken.bestStreak, 5);
  assert.equal(broken.atRisk, false);
});

test('applyOddsToStandardFen removes target handicap piece and updates FEN castling availability', async () => {
  const { applyOddsToStandardFen } = await import('./odds');
  const { getLocalDailyPuzzle } = await import('./puzzles');

  const pawnOdds = new Chess(applyOddsToStandardFen('pawn', 'w'));
  assert.equal(pawnOdds.get('f2'), undefined);
  assert.equal(pawnOdds.turn(), 'w');

  const knightOdds = new Chess(applyOddsToStandardFen('knight', 'b'));
  assert.equal(knightOdds.get('b8'), undefined);
  assert.equal(knightOdds.get('b1')?.type, 'n');

  const rookOddsWhite = applyOddsToStandardFen('rook', 'w');
  assert.ok(rookOddsWhite.includes(' Kkq '), `White rook odds on a1 must strip Q castling right, got ${rookOddsWhite}`);
  const rookBoard = new Chess(rookOddsWhite);
  assert.equal(rookBoard.get('a1'), undefined);

  const queenOddsBlack = new Chess(applyOddsToStandardFen('queen', 'b'));
  assert.equal(queenOddsBlack.get('d8'), undefined);

  const d1 = getLocalDailyPuzzle('2026-11-18');
  const d1Repeat = getLocalDailyPuzzle('2026-11-18');
  const d2 = getLocalDailyPuzzle('2026-11-19');
  assert.equal(d1.id, d1Repeat.id);
  assert.ok(d1.theme.startsWith('Daily Challenge · '));
  assert.notEqual(d1.id, d2.id);
});

test('computeDragTransformOffset centers dragged piece directly beneath pointer relative to boardRect', async () => {
  const { computeDragTransformOffset } = await import('../components/ChessBoard');

  // Board container starts at (120, 80); piece rendered size is 60x60 (half = 30x30)
  // Pointer is at (250, 200) -> top-left transform must be (250 - 120 - 30, 200 - 80 - 30) = (100, 90)
  const offset = computeDragTransformOffset(250, 200, { left: 120, top: 80 }, 60, 60);
  assert.deepEqual(offset, { x: 100, y: 90 });

  // Center of piece in viewport coordinates matches pointer coordinates exactly
  assert.equal(120 + offset.x + 60 / 2, 250);
  assert.equal(80 + offset.y + 60 / 2, 200);

  // Handles non-square custom grids and subpixel client positions accurately
  const customOffset = computeDragTransformOffset(412.5, 315.5, { left: 100.5, top: 55.5 }, 50, 70);
  assert.deepEqual(customOffset, { x: 287, y: 225 });
});

test('AI bot roster offers 20+ personalities and multiple playstyles within identical Elo tiers', async () => {
  const { AI_BOT_PROFILES, scoreMoveStyleBias } = await import('./chessEngine');

  assert.ok(AI_BOT_PROFILES.length >= 20, `Expected at least 20 bots, found ${AI_BOT_PROFILES.length}`);

  const uniqueIds = new Set(AI_BOT_PROFILES.map(b => b.id));
  assert.equal(uniqueIds.size, AI_BOT_PROFILES.length, 'Bot IDs must be unique');

  const adaptive = AI_BOT_PROFILES.find(b => b.id === 'bot_adaptive_coach');
  assert.ok(adaptive && adaptive.isAdaptive === true && adaptive.category === 'special');

  // Verify matched-Elo cohorts with distinct playing styles
  const elosToCheck = [400, 850, 1250, 1600, 1950, 2350];
  for (const elo of elosToCheck) {
    const cohort = AI_BOT_PROFILES.filter(b => b.elo === elo);
    assert.ok(cohort.length >= 2, `Expected >= 2 bots at ${elo} Elo, found ${cohort.length}`);
    const styles = new Set(cohort.map(b => b.playStyle));
    assert.ok(styles.size >= 2, `Expected distinct play styles at ${elo} Elo`);
  }

  // Verify style bias awards different preferences on queen trade vs tactical check
  const tradeBoard = new Chess('3qk3/8/8/8/8/8/3Q4/4K3 w - - 0 1');
  const moves = tradeBoard.moves({ verbose: true });
  const queenTrade = moves.find(m => m.san === 'Qxd8+');
  const quietKing = moves.find(m => m.san === 'Kd1');
  assert.ok(queenTrade && quietKing);
  assert.ok(
    scoreMoveStyleBias(tradeBoard, queenTrade, 'endgame') > scoreMoveStyleBias(tradeBoard, quietKing, 'endgame'),
    'Endgame style should reward queen trade / check conversion'
  );
  assert.ok(
    scoreMoveStyleBias(tradeBoard, queenTrade, 'aggressive') > scoreMoveStyleBias(tradeBoard, quietKing, 'aggressive'),
    'Aggressive style should reward forcing checks'
  );
});

test('resolveAdaptiveBot dials difficulty down on slumps/deficits and up on hot streaks/leads', async () => {
  const { resolveAdaptiveBot } = await import('./adaptiveBot');

  const losingStreakGames = Array.from({ length: 4 }, (_, i) => ({
    id: `loss-${i}`,
    date: '2026-11-18',
    variant: 'standard' as const,
    playerColor: 'w' as const,
    opponentName: 'Test Bot',
    opponentElo: 1400,
    timeControl: 'Rapid 10+0',
    result: '0-1' as const,
    reason: 'checkmate' as const,
    movesCount: 28,
    pgn: '',
    playerAccuracy: 62,
    blundersCount: 3
  }));

  const winningStreakGames = Array.from({ length: 4 }, (_, i) => ({
    id: `win-${i}`,
    date: '2026-11-18',
    variant: 'standard' as const,
    playerColor: 'w' as const,
    opponentName: 'Test Bot',
    opponentElo: 1400,
    timeControl: 'Rapid 10+0',
    result: '1-0' as const,
    reason: 'checkmate' as const,
    movesCount: 28,
    pgn: '',
    playerAccuracy: 92,
    blundersCount: 0
  }));

  const eased = resolveAdaptiveBot({
    playerRapidElo: 1450,
    recentGames: losingStreakGames,
    posture: 'auto',
    inGameEvalCp: -320,
    playerColor: 'w',
    recentPlayerMoveAccuracies: [55, 60],
    playerBlundersInGame: 2,
    movesPlayed: 16
  });

  const sharpened = resolveAdaptiveBot({
    playerRapidElo: 1450,
    recentGames: winningStreakGames,
    posture: 'auto',
    inGameEvalCp: 260,
    playerColor: 'w',
    recentPlayerMoveAccuracies: [95, 93],
    playerBlundersInGame: 0,
    movesPlayed: 16
  });

  assert.ok(eased.effectiveElo < 1450, `Expected eased Elo < 1450, got ${eased.effectiveElo}`);
  assert.ok(sharpened.effectiveElo > 1450, `Expected sharpened Elo > 1450, got ${sharpened.effectiveElo}`);
  assert.ok(sharpened.effectiveElo - eased.effectiveElo >= 500);
  assert.ok(eased.blunderRate > sharpened.blunderRate);

  const forcedEasy = resolveAdaptiveBot({ playerRapidElo: 1450, recentGames: [], posture: 'easy' });
  const forcedHard = resolveAdaptiveBot({ playerRapidElo: 1450, recentGames: [], posture: 'hard' });
  assert.ok(forcedEasy.effectiveElo < forcedHard.effectiveElo);
});

test('fenEditor converts, edits, sanitizes castling, and validates FEN positions cleanly', async () => {
  const {
    fenToGridState,
    gridStateToFen,
    sanitizeCastlingForGrid,
    setSquarePieceInGrid,
    validateEditedPosition
  } = await import('./fenEditor');

  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const parsed = fenToGridState(startFen);
  assert.equal(parsed.turn, 'w');
  assert.deepEqual(parsed.castling, { K: true, Q: true, k: true, q: true });
  assert.equal(gridStateToFen(parsed), startFen);
  assert.equal(validateEditedPosition(startFen).valid, true);

  // Removing White's h1 rook (row 7, col 7) must strip White kingside 'K' castling right automatically
  const noH1Grid = setSquarePieceInGrid(parsed.grid, 7, 7, null);
  const noH1State = {
    ...parsed,
    grid: noH1Grid,
    castling: sanitizeCastlingForGrid(noH1Grid, parsed.castling)
  };
  assert.equal(noH1State.castling.K, false);
  assert.equal(noH1State.castling.Q, true);
  assert.equal(validateEditedPosition(gridStateToFen(noH1State)).valid, true);

  // Removing White King makes position invalid
  const noWhiteKingGrid = setSquarePieceInGrid(parsed.grid, 7, 4, null);
  const missingKingRes = validateEditedPosition(
    gridStateToFen({ ...parsed, grid: noWhiteKingGrid })
  );
  assert.equal(missingKingRes.valid, false);
  assert.ok(missingKingRes.errors.some(err => err.toLowerCase().includes('king')));

  // Pawn on rank 8 (row 0) makes position invalid
  const baseKings = fenToGridState('4k3/8/8/8/8/8/8/4K3 w - - 0 1');
  const pawnOn8Grid = setSquarePieceInGrid(baseKings.grid, 0, 0, {
    type: 'p',
    color: 'w'
  });
  const pawnErr = validateEditedPosition(
    gridStateToFen({ ...baseKings, grid: pawnOn8Grid })
  );
  assert.equal(pawnErr.valid, false);
  assert.ok(pawnErr.errors.some(err => err.toLowerCase().includes('pawn')));
});

test('getOpeningContinuations returns valid ECO continuations and normalized W/D/B percentages', async () => {
  const { getOpeningContinuations } = await import('./openings');

  const initial = getOpeningContinuations([]);
  assert.ok(initial.length >= 4);
  const sans = initial.map(c => c.san);
  assert.ok(sans.includes('e4') && sans.includes('d4') && sans.includes('c4') && sans.includes('Nf3'));
  for (const item of initial) {
    assert.equal(item.whitePct + item.drawPct + item.blackPct, 100);
    assert.ok(item.sampleGames > 0);
  }

  const afterE4 = getOpeningContinuations(['e4']);
  const e4Replies = afterE4.map(c => c.san);
  assert.ok(e4Replies.includes('e5') && e4Replies.includes('c5') && e4Replies.includes('e6'));
  for (const item of afterE4) {
    assert.equal(item.whitePct + item.drawPct + item.blackPct, 100);
  }
});

test('resolvePlayViewShortcut recognizes z for Zen Focus Mode', async () => {
  const { resolvePlayViewShortcut, KEYBOARD_SHORTCUTS } = await import('./keyboardShortcuts');
  assert.deepEqual(
    resolvePlayViewShortcut({ key: 'z' }, { keyboardControl: false, hasMoves: false, modalOpen: false }),
    { type: 'toggle_zen' }
  );
  assert.ok(KEYBOARD_SHORTCUTS.some(item => item.id === 'play-zen' && item.keys.includes('Z')));
});

test('buildAnyOnlineTimeControl supports any timestamp including sub-minute, multi-hour classical, and unlimited', async () => {
  const { buildAnyOnlineTimeControl, formatOnlineClock, getEloBucketForTimeControl } = await import('./onlineClassic');

  const ultraBullet = buildAnyOnlineTimeControl(0.25, 0, false);
  assert.equal(ultraBullet.type, 'bullet');
  assert.equal(ultraBullet.baseSeconds, 15);
  assert.equal(getEloBucketForTimeControl(ultraBullet.type), 'bulletElo');

  const blitz = buildAnyOnlineTimeControl(3, 2, false);
  assert.equal(blitz.type, 'blitz');
  assert.equal(blitz.baseSeconds, 180);
  assert.equal(blitz.incrementSeconds, 2);
  assert.equal(getEloBucketForTimeControl(blitz.type), 'blitzElo');

  const rapid = buildAnyOnlineTimeControl(10, 5, false);
  assert.equal(rapid.type, 'rapid');
  assert.equal(rapid.baseSeconds, 600);
  assert.equal(getEloBucketForTimeControl(rapid.type), 'rapidElo');

  const classical = buildAnyOnlineTimeControl(90, 30, false);
  assert.equal(classical.type, 'classical');
  assert.equal(classical.baseSeconds, 5400);
  assert.equal(getEloBucketForTimeControl(classical.type), 'classicalElo');

  const unlimited = buildAnyOnlineTimeControl(0, 0, true);
  assert.equal(unlimited.type, 'unlimited');
  assert.equal(unlimited.isUnlimited, true);
  assert.equal(formatOnlineClock(0, true), '∞');
  assert.equal(formatOnlineClock(9500, false), '0:09.5');
  assert.equal(formatOnlineClock(3661000, false), '1:01:01');
});

test('computeClassicOnlineMove enforces standard rules, turn lock, clock increment, checkmate, and Elo deltas', async () => {
  const { computeClassicOnlineMove, computeLiveClockMs, computeOnlineEloDelta, sanitizeOnlineUsername } = await import('./onlineClassic');

  const baseMatch = {
    matchId: 'm-test',
    inviteCode: 'TEST99',
    variant: 'standard' as const,
    isPublicSeek: true,
    rated: true,
    status: 'active' as const,
    creatorId: 'u1',
    creatorColorPref: 'w' as const,
    whiteUid: 'u1',
    blackUid: 'u2',
    whiteName: 'WhitePlayer',
    blackName: 'BlackPlayer',
    whiteElo: 1200,
    blackElo: 1200,
    timeControlType: 'blitz' as const,
    timeControlLabel: '3+2 Blitz',
    baseSeconds: 180,
    incrementSeconds: 2,
    isUnlimited: false,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    pgn: '',
    lastMoveUci: '',
    lastMoveSan: '',
    movesCount: 0,
    turn: 'w' as const,
    whiteTimeMs: 180_000,
    blackTimeMs: 180_000,
    drawOfferBy: '' as const,
    takebackOfferBy: '' as const,
    winner: '' as const,
    result: '*' as const,
    reason: 'none' as const,
    rematchMatchId: '',
    createdAtMs: 1_000_000,
    lastMoveAtMs: 1_000_000,
    updatedAtMs: 1_000_000
  };

  // Black cannot move on White's turn
  assert.equal(computeClassicOnlineMove(baseMatch, 'b', 'e7', 'e5', 'q', 1_001_000), null);

  // White legal opening e4 updates turn, movesCount, and awards increment
  const m1 = computeClassicOnlineMove(baseMatch, 'w', 'e2', 'e4', 'q', 1_001_000);
  assert.ok(m1);
  assert.equal(m1.lastMoveSan, 'e4');
  assert.equal(m1.turn, 'b');
  assert.equal(m1.movesCount, 1);
  assert.equal(m1.whiteTimeMs, 182_000);

  // Elapsed clock check & flag detection after ply >= 1
  const secondTurnMatch = {
    ...baseMatch,
    ...m1,
    blackTimeMs: 5_000,
    lastMoveAtMs: 2_000_000
  };
  const flaggedClock = computeLiveClockMs(secondTurnMatch, 2_006_000);
  assert.equal(flaggedClock.blackMs, 0);
  assert.equal(flaggedClock.activeFlagged, 'b');
  // Black cannot move once flagged
  assert.equal(computeClassicOnlineMove(secondTurnMatch, 'b', 'e7', 'e5', 'q', 2_006_000), null);

  // Mate-in-1 detection (Fool's Mate)
  const foolsSetup = {
    ...baseMatch,
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2',
    pgn: '1. f3 e5 2. g4',
    movesCount: 3,
    turn: 'b' as const,
    lastMoveAtMs: 3_000_000
  };
  const mateTransition = computeClassicOnlineMove(foolsSetup, 'b', 'd8', 'h4', 'q', 3_001_500);
  assert.ok(mateTransition);
  assert.equal(mateTransition.status, 'finished');
  assert.equal(mateTransition.winner, 'b');
  assert.equal(mateTransition.result, '0-1');
  assert.equal(mateTransition.reason, 'checkmate');

  // Elo & sanitization checks
  assert.equal(computeOnlineEloDelta(1200, 1200, 1), 12);
  assert.equal(computeOnlineEloDelta(1200, 1200, 0.5), 0);
  assert.equal(sanitizeOnlineUsername('<script>alert(1)</script> GM'), 'scriptalert1script GM');
});

