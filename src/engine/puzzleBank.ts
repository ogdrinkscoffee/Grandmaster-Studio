import { Puzzle } from '../types/chess';

// Verified Lichess Puzzle Corpus (1000 tactical & endgame positions)
export const LICHESS_PUZZLE_BANK: Puzzle[] = [
  {
    "id": "lic-00008",
    "fen": "r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2b1/PqP3PP/7K w - - 0 25",
    "moves": [
      "e6e7",
      "b2b1",
      "b3c1",
      "b1c1",
      "h6c1"
    ],
    "rating": 1811,
    "theme": "Decisive Tactic · Hanging Piece",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Hanging Piece).",
    "playerColor": "w"
  },
  {
    "id": "lic-0000D",
    "fen": "5rk1/1p3ppp/pq1Q1b2/8/8/1P3N2/P4PPP/3R2K1 b - - 3 27",
    "moves": [
      "f8d8",
      "d6d8",
      "f6d8"
    ],
    "rating": 1529,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-0000H",
    "fen": "r4rk1/pp3ppp/8/2bqp2Q/3N4/P2Bn2P/1PPN1P2/R1B2RK1 b - - 0 15",
    "moves": [
      "d5g2"
    ],
    "rating": 1554,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 1) from French Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0008Q",
    "fen": "8/5R2/1p2P3/p4r2/P6p/1P3Pk1/4K3/8 b - - 2 64",
    "moves": [
      "f5e5",
      "e2f1",
      "e5e6"
    ],
    "rating": 1383,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-0009B",
    "fen": "r2qr1k1/b1p2ppp/p5n1/P1p1p3/4P1n1/B2P2Pb/3NBP1P/RN1QR1K1 w - - 0 17",
    "moves": [
      "e2g4",
      "h3g4",
      "d1g4"
    ],
    "rating": 1084,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge) from Kings Pawn Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-000Pw",
    "fen": "6k1/5p1p/4p3/4q3/3n4/2Q3P1/PP1N1P1P/6K1 b - - 3 37",
    "moves": [
      "d4e2",
      "g1f1",
      "e2c3"
    ],
    "rating": 1530,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-000Sa",
    "fen": "2Q2bk1/5p1p/p5p1/2p3P1/4B3/7P/qPr2P2/2K4R w - - 0 33",
    "moves": [
      "e4c2",
      "a2a1",
      "c2b1"
    ],
    "rating": 1476,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-000VW",
    "fen": "r4r2/1p3pkp/p7/3R1p1Q/3P4/8/P1q2P2/3R2K1 w - - 0 26",
    "moves": [
      "d5c5",
      "c2e4",
      "h5g5",
      "g7h8",
      "g5f6"
    ],
    "rating": 2873,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-000Vc",
    "fen": "8/8/4k1p1/2KpP2P/5P2/8/8/8 b - - 0 53",
    "moves": [
      "g6h5",
      "f4f5",
      "e6e5",
      "f5f6",
      "e5f6"
    ],
    "rating": 1569,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-000Zo",
    "fen": "4r3/1k6/pp3P2/1b5p/3R1p2/P1R2P2/1P4PP/6K1 b - - 0 35",
    "moves": [
      "e8e1",
      "g1f2",
      "e1f1"
    ],
    "rating": 1363,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-000aY",
    "fen": "r4rk1/pp2Bppp/2n1b3/q1pp4/8/P1Q2NP1/1PP1PP1P/2KR3R b - - 1 15",
    "moves": [
      "a5c3",
      "b2c3",
      "c6e7"
    ],
    "rating": 1412,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge) from Benoni Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-000c8",
    "fen": "6k1/Bp3pp1/p3p3/2NpPn1p/5P1q/P2Q1R1P/1P4PK/2r5 b - - 1 28",
    "moves": [
      "h4e1",
      "f3f1",
      "e1f1",
      "d3f1",
      "c1f1"
    ],
    "rating": 1478,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-000h0",
    "fen": "5rk1/p5p1/3bRr1p/1Pp4q/3p4/1P1Q1N2/P4PPP/4R1K1 b - - 0 22",
    "moves": [
      "f6f3",
      "g2f3",
      "h5h2",
      "g1f1",
      "h2h3",
      "f1e2",
      "h3e6"
    ],
    "rating": 2048,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-000hf",
    "fen": "r1bq3r/pp1nbkp1/2p1p2p/8/2BP4/1PN3P1/P3QP1P/3R1RK1 w - - 0 20",
    "moves": [
      "e2e6",
      "f7f8",
      "e6f7"
    ],
    "rating": 1391,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 2) from Horwitz Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-000lC",
    "fen": "3r3r/pQNk1ppp/1qnR1n2/1B6/8/8/PPP3PP/5R1K b - - 0 19",
    "moves": [
      "d7d6",
      "b7b6",
      "a7b6"
    ],
    "rating": 1356,
    "theme": "Winning Edge · Hanging Piece",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Hanging Piece).",
    "playerColor": "b"
  },
  {
    "id": "lic-000o3",
    "fen": "8/2p5/3k2p1/1p1P1p2/1P3P2/3K2Pp/7P/8 w - - 2 44",
    "moves": [
      "d3d4",
      "g6g5",
      "f4g5"
    ],
    "rating": 959,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-000pA",
    "fen": "5rk1/5pp1/7p/3p4/1KpPn3/4PPP1/1P2N1P1/r4R1R b - - 0 24",
    "moves": [
      "f8b8"
    ],
    "rating": 1162,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-000qP",
    "fen": "8/7R/8/5p2/4bk1P/8/2r5/5KR1 b - - 8 51",
    "moves": [
      "f4f3",
      "f1e1",
      "c2c1",
      "e1d2",
      "c1g1"
    ],
    "rating": 2167,
    "theme": "Decisive Tactic · Endgame",
    "category": "Pins & Skewers",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-000rO",
    "fen": "3R4/8/8/KB2b3/1p6/1P2k3/3p4/8 b - - 0 58",
    "moves": [
      "e5c7",
      "a5b4",
      "c7d8"
    ],
    "rating": 1110,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-000rZ",
    "fen": "2kr1b1r/p1p2pp1/2pqN3/7p/6n1/2NPB3/PPP2PPP/R2Q1RK1 b - - 0 13",
    "moves": [
      "d6h2"
    ],
    "rating": 662,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Scandinavian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-00143",
    "fen": "r4rk1/5ppp/1np2q2/p1b5/2p1B3/P7/1P3PPP/R1BQ1RK1 w - - 2 18",
    "moves": [
      "d1h5",
      "h7h6",
      "h5c5"
    ],
    "rating": 1797,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge) from Scotch Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-0017R",
    "fen": "r2qk2r/pp2ppbp/1n1p2p1/3P4/2n5/2NBBP1P/PP3P2/R2QK2R w KQkq - 0 13",
    "moves": [
      "d3c4",
      "b6c4",
      "d1a4",
      "d8d7",
      "a4c4"
    ],
    "rating": 1655,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Tactical Fork) from Alekhine Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0018S",
    "fen": "2kr3r/p4p2/1p2p2p/1N1p2p1/3Q4/1P1P4/2q2PPP/5RK1 w - - 0 21",
    "moves": [
      "d4a1",
      "a7a5",
      "f1c1"
    ],
    "rating": 2608,
    "theme": "Winning Edge · Endgame",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-001Fg",
    "fen": "5r1k/pQR3pp/5rp1/3B4/q2n4/7P/P4PP1/5RK1 b - - 4 30",
    "moves": [
      "d4e2",
      "g1h2",
      "a4f4",
      "h2h1",
      "e2g3",
      "f2g3",
      "f4f1"
    ],
    "rating": 1256,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-001KR",
    "fen": "6k1/p1p3pp/4N3/1p6/2q1r1n1/2B5/PP4PP/3R1R1K w - - 0 29",
    "moves": [
      "f1f8"
    ],
    "rating": 563,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1).",
    "playerColor": "w"
  },
  {
    "id": "lic-001Oo",
    "fen": "6k1/4p1bp/6p1/1p1pP3/qPpPp3/2P1P3/Q2B1KPP/8 w - - 3 24",
    "moves": [
      "a2a4",
      "b5a4",
      "b4b5",
      "g8f7",
      "b5b6"
    ],
    "rating": 2078,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-001Wz",
    "fen": "6k1/5ppp/r1p5/p1n1rP2/8/2P2N1P/2P3P1/3R2K1 w - - 0 22",
    "moves": [
      "d1d8",
      "e5e8",
      "d8e8"
    ],
    "rating": 1118,
    "theme": "Back Rank Mate · Endgame",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Back Rank Mate · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-001XA",
    "fen": "2r2rk1/pbq1bppp/8/8/2p1N3/P1Bn2P1/2Q2PBP/1R3RK1 w - - 4 24",
    "moves": [
      "b1b7",
      "c7b7",
      "e4f6",
      "e7f6",
      "g2b7"
    ],
    "rating": 1687,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-001aK",
    "fen": "6k1/5p2/4p3/P1B5/2P4P/4Pnp1/Rb2r3/5K2 w - - 0 34",
    "moves": [
      "f1e2",
      "g3g2",
      "e3e4",
      "f3d4",
      "e2f2"
    ],
    "rating": 2056,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-001cr",
    "fen": "8/3B2pp/p5k1/6P1/1ppp1K2/8/1P6/8 w - - 0 39",
    "moves": [
      "d7e8"
    ],
    "rating": 1517,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-001h8",
    "fen": "2r3k1/2r4p/4p1p1/1p1q1pP1/p2P1P1Q/P6R/4bB2/2R3K1 w - - 6 35",
    "moves": [
      "h4h7",
      "c7h7",
      "c1c8",
      "g8g7",
      "c8c7"
    ],
    "rating": 1749,
    "theme": "Decisive Tactic · Deflection",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Deflection).",
    "playerColor": "w"
  },
  {
    "id": "lic-001kG",
    "fen": "rnbq3r/1p3kpp/p4n2/2b5/2pNP3/2N5/PPP3PP/R1BQ1RK1 w - - 2 12",
    "moves": [
      "d1h5",
      "f7g8",
      "h5c5"
    ],
    "rating": 1974,
    "theme": "Winning Edge · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Pin) from Sicilian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-001m3",
    "fen": "7r/6k1/2b1Rp2/8/P1N3p1/5nP1/5P2/Q4K2 b - - 0 38",
    "moves": [
      "h8h1",
      "f1e2",
      "h1a1"
    ],
    "rating": 1455,
    "theme": "Winning Edge · Endgame",
    "category": "Pins & Skewers",
    "description": "Black to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-001om",
    "fen": "5r1k/pp4pp/5p2/1BbQp1r1/7K/7P/1PP3P1/3R3R b - - 3 26",
    "moves": [
      "c5f2",
      "g2g3",
      "f2g3"
    ],
    "rating": 1018,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 2).",
    "playerColor": "b"
  },
  {
    "id": "lic-001pC",
    "fen": "r4rk1/pp3ppp/3b4/2p1pPB1/7N/2PP3n/PP4PP/R2Q2RK b - - 0 18",
    "moves": [
      "h3f2"
    ],
    "rating": 848,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Sicilian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-001uD",
    "fen": "6k1/1p4p1/1p3p1p/2r1p3/2n5/r3PN2/2RnNPPP/2R3K1 w - - 0 33",
    "moves": [
      "f3d2",
      "c4d2",
      "c2d2",
      "c5c1",
      "e2c1"
    ],
    "rating": 1890,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-001w5",
    "fen": "1rb3k1/q4rP1/4p2p/3p3p/3P1P2/2P5/2QK3P/3R2R1 w - - 1 30",
    "moves": [
      "c2h7",
      "g8h7",
      "g7g8q"
    ],
    "rating": 1034,
    "theme": "Attraction · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Attraction · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-001wR",
    "fen": "6nr/p4p1p/k1p5/1p6/1QN5/2P1P3/4KPqP/8 w - - 0 27",
    "moves": [
      "b4a5",
      "a6b7",
      "c4d6",
      "b7b8",
      "a5d8"
    ],
    "rating": 1152,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-001wb",
    "fen": "r3k2r/pb1p1ppp/1b4q1/1Q2P3/8/2NP1PP1/PP4P1/R1B2R1K b kq - 0 17",
    "moves": [
      "g6h5"
    ],
    "rating": 1149,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 1) from Ruy Lopez.",
    "playerColor": "b"
  },
  {
    "id": "lic-001wr",
    "fen": "r4rk1/p3ppbp/Pp1q1np1/3PpbB1/2B5/2N2P2/1PPQ2PP/3RR1K1 b - - 0 18",
    "moves": [
      "d6c5",
      "g1h1",
      "c5c4"
    ],
    "rating": 989,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "Black to move — spot the tactical shot (Winning Edge · Tactical Fork) from Pirc Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-001xO",
    "fen": "k1r1b3/p1r1nppp/Bp1qpn2/2Np4/1P1P4/PQR1PN2/5PPP/2R3K1 b - - 1 19",
    "moves": [
      "b6c5",
      "a6c8",
      "c5c4"
    ],
    "rating": 1780,
    "theme": "Decisive Tactic · Sacrifice",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Sacrifice) from Slav Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-001xl",
    "fen": "8/4R3/p4kpp/3B4/5q2/8/5P1P/6K1 w - - 6 41",
    "moves": [
      "e7f7",
      "f6e5",
      "f7f4"
    ],
    "rating": 1299,
    "theme": "Winning Edge · Endgame",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-002Ds",
    "fen": "8/2p5/pp1p4/P2Pk2p/1PP1p2P/2n1K2P/3N4/8 w - - 0 46",
    "moves": [
      "b4b5",
      "c3d1",
      "e3e2",
      "a6b5",
      "a5a6"
    ],
    "rating": 1992,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-002HE",
    "fen": "1qr2rk1/1p1p1ppp/pB2p1n1/7n/2P1P3/1Q2NP1P/PP2BKPb/3R1R2 b - - 2 20",
    "moves": [
      "b8g3"
    ],
    "rating": 1116,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 1).",
    "playerColor": "b"
  },
  {
    "id": "lic-002KJ",
    "fen": "r3k2r/ppq1bppp/4pn2/2Ppn3/1P4bP/2P2N2/P3BPP1/RNBQ1RK1 w kq - 3 11",
    "moves": [
      "f3e5",
      "c7e5",
      "e2g4"
    ],
    "rating": 1569,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic · Discovered Attack) from Caro-Kann Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-002LF",
    "fen": "7r/p4pk1/1pp3p1/8/6q1/4Q3/PP1R1P1r/5KN1 w - - 0 39",
    "moves": [
      "e3e5",
      "f7f6",
      "e5c7",
      "g7h6",
      "c7h2"
    ],
    "rating": 2185,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-002LW",
    "fen": "3r1rk1/1b3pp1/3p4/p3nPPQ/4P3/3q1BN1/8/2R2RK1 w - - 2 29",
    "moves": [
      "f5f6",
      "e5f3",
      "f1f3"
    ],
    "rating": 2464,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-002Mm",
    "fen": "rn1qrk2/ppp3pQ/3p1pP1/3Pp3/2P1P3/8/PP3PP1/R1B1K3 w Q - 3 17",
    "moves": [
      "h7h8",
      "f8e7",
      "h8g7"
    ],
    "rating": 927,
    "theme": "Deflection · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Deflection · Checkmate) from Three Knights Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-002O7",
    "fen": "r3qrk1/2p2pp1/p2bpn1p/2ppN3/3P1Pb1/1PP1P1B1/P2N2PP/R2Q1RK1 w - - 1 15",
    "moves": [
      "e5g4",
      "f6g4",
      "d1g4"
    ],
    "rating": 1008,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic) from Queens Pawn Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-002Q2",
    "fen": "7k/p4R1p/3p3B/2pN1n2/2PbB1b1/3P2P1/P3r3/5R1K b - - 0 28",
    "moves": [
      "f5g3"
    ],
    "rating": 956,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1).",
    "playerColor": "b"
  },
  {
    "id": "lic-002Tf",
    "fen": "r3kbnr/ppp1qppp/2n5/1B1pP3/5B2/4PQ2/PPP2PPP/RN2K2R b KQkq - 2 7",
    "moves": [
      "e7b4",
      "b1c3",
      "b4b2"
    ],
    "rating": 1561,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Tactical Fork) from Queens Pawn Game.",
    "playerColor": "b"
  },
  {
    "id": "lic-002Ua",
    "fen": "r4rk1/pp3ppp/3p1q2/P1P1p3/2B5/2B2n2/2P2P1P/R2Q1R1K b - - 1 16",
    "moves": [
      "f6f4",
      "d1f3",
      "f4f3"
    ],
    "rating": 1666,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic) from Sicilian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-002Uy",
    "fen": "8/8/1p6/k7/P7/1KR4r/8/8 b - - 27 64",
    "moves": [
      "h3c3",
      "b3c3",
      "a5a4",
      "c3b2",
      "a4b4"
    ],
    "rating": 1565,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-002X3",
    "fen": "6k1/2q2p1p/4pPp1/4P3/p1pP1P2/r1P5/6QP/4B1K1 w - - 0 34",
    "moves": [
      "g2a8",
      "c7b8",
      "a8b8"
    ],
    "rating": 914,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-002bK",
    "fen": "8/7p/4k3/pb1p1pPB/1n1P3P/N1p1P3/4K3/8 w - - 2 43",
    "moves": [
      "a3b5",
      "c3c2",
      "e2d2"
    ],
    "rating": 1100,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-002e5",
    "fen": "r2q2k1/pp1n2bp/3P2b1/6N1/6Q1/P3P3/6P1/4K2R w K - 2 22",
    "moves": [
      "g4c4",
      "g8h8",
      "h1h7",
      "g6h7",
      "g5f7"
    ],
    "rating": 2632,
    "theme": "Decisive Tactic · Sacrifice",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Sacrifice).",
    "playerColor": "w"
  },
  {
    "id": "lic-002e8",
    "fen": "3rnrk1/1b3pp1/4pb2/p3q3/1p1N4/3B2R1/PPPQN2P/1K4R1 w - - 2 24",
    "moves": [
      "d2h6",
      "g7g6",
      "g3h3"
    ],
    "rating": 2554,
    "theme": "Decisive Tactic · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Pin).",
    "playerColor": "w"
  },
  {
    "id": "lic-002mG",
    "fen": "5r1k/B1p3pp/2Qb1p2/3Pq3/P6P/8/2P2K2/3R1R2 b - - 2 36",
    "moves": [
      "f8e8",
      "c6e8",
      "e5e8"
    ],
    "rating": 2377,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — uncover the master-level combination (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-002p5",
    "fen": "r1bqr1k1/pp1nbpp1/2p5/3n2P1/2BP4/P7/1PQNNPP1/R3K2R w KQ - 1 14",
    "moves": [
      "c2h7",
      "g8f8",
      "h7h8"
    ],
    "rating": 908,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 2) from French Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-002rd",
    "fen": "r6k/q1p2p1p/1b2bPr1/p1ppP2Q/3P2p1/4B3/PP2NRPP/3R2K1 w - - 2 26",
    "moves": [
      "e2f4",
      "c5d4",
      "f4g6",
      "f7g6",
      "h5h6"
    ],
    "rating": 1795,
    "theme": "Decisive Tactic · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Pin).",
    "playerColor": "w"
  },
  {
    "id": "lic-002uV",
    "fen": "r2r2k1/1p2qppp/2n1p3/5Q2/p2P4/P4N2/BP3PPP/2R1R1K1 b - - 0 20",
    "moves": [
      "e6f5",
      "e1e7",
      "c6e7"
    ],
    "rating": 1498,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-002vV",
    "fen": "8/6k1/1R5p/5p1P/5P1K/6P1/8/r7 b - - 3 58",
    "moves": [
      "a1h1"
    ],
    "rating": 576,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-00347",
    "fen": "8/2p5/8/2pPk2p/8/3K3P/6P1/8 b - - 2 42",
    "moves": [
      "h5h4",
      "d3c4",
      "e5d6"
    ],
    "rating": 2264,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-0039T",
    "fen": "1r5r/p3kp2/4p2p/4P3/R4Pp1/6P1/P1P4P/4K2R b K - 2 25",
    "moves": [
      "b8b1",
      "e1f2",
      "b1h1",
      "a4a7",
      "e7f8"
    ],
    "rating": 1121,
    "theme": "Decisive Tactic · Endgame",
    "category": "Pins & Skewers",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-003AX",
    "fen": "2r2rk1/5ppp/bq2p3/p2pP1N1/Pb1p2P1/1P2P2P/2QN4/2R1K2R w K - 0 19",
    "moves": [
      "c2h7"
    ],
    "rating": 1014,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1) from French Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-003Ec",
    "fen": "3r4/p4R2/1pb2Pp1/n1p1Qqkp/8/P7/1P4PP/6RK w - - 3 33",
    "moves": [
      "e5e3",
      "f5f4",
      "h2h4",
      "g5f5",
      "e3h3"
    ],
    "rating": 2245,
    "theme": "Decisive Tactic · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Pin).",
    "playerColor": "w"
  },
  {
    "id": "lic-003IX",
    "fen": "8/3pk3/R7/1R2PK1p/2PPn1r1/8/8/8 b - - 0 43",
    "moves": [
      "e4g3"
    ],
    "rating": 1698,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-003Jb",
    "fen": "6k1/Q2bqr1p/2rpp1pR/p7/Pp2P3/1B3P2/1PP3P1/2KR4 b - - 7 22",
    "moves": [
      "e7g5",
      "c1b1",
      "g5h6"
    ],
    "rating": 993,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "Black to move — spot the tactical shot (Winning Edge · Tactical Fork).",
    "playerColor": "b"
  },
  {
    "id": "lic-003S3",
    "fen": "1r3k1r/pNqnppb1/6pn/2p3Np/7P/2P2Q2/PP3PP1/R1B1K2R w KQ - 3 16",
    "moves": [
      "g5e6",
      "f8g8",
      "e6c7"
    ],
    "rating": 1336,
    "theme": "Winning Edge · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Winning Edge · Pin) from Modern Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-003Tx",
    "fen": "2r5/pR5p/5p1k/4p3/4R3/B4nPP/PP3P2/1K6 b - - 0 27",
    "moves": [
      "f3d2",
      "b1a1",
      "c8c1"
    ],
    "rating": 1511,
    "theme": "Back Rank Mate · Endgame",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Back Rank Mate · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-003UW",
    "fen": "8/6pk/7p/2pq4/3p4/5PP1/P3QK1P/8 w - - 2 41",
    "moves": [
      "e2e4",
      "d5e4",
      "f3e4"
    ],
    "rating": 1473,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-003YF",
    "fen": "r4rk1/1pp2ppp/p2p4/2bPp3/2P1PB1q/P1N2B2/1P3P2/R2QK1R1 b Q - 0 15",
    "moves": [
      "h4f2"
    ],
    "rating": 1061,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 1) from Mexican Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-003aS",
    "fen": "8/8/5k1p/6pP/1R4P1/1p2KP2/8/1r6 b - - 0 43",
    "moves": [
      "b3b2",
      "b4b6",
      "f6e5",
      "f3f4",
      "g5f4"
    ],
    "rating": 2086,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-003cs",
    "fen": "2r1kbnr/pp4pp/4p3/3pq1N1/8/1P2B3/P3Q1PP/nN3RK1 w k - 0 17",
    "moves": [
      "f1f8",
      "e8f8",
      "e3c5",
      "c8c5",
      "e2e5",
      "c5c1",
      "g1f2"
    ],
    "rating": 2119,
    "theme": "Winning Edge · Attraction",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Attraction) from Caro-Kann Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-003eP",
    "fen": "6k1/r1b1q3/2p3p1/2Pp4/1P2p1n1/2B1P3/NQ6/2K4R w - - 2 37",
    "moves": [
      "h1h8",
      "g8f7",
      "h8h7",
      "f7e8",
      "h7e7"
    ],
    "rating": 1156,
    "theme": "Decisive Tactic · Skewer",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Decisive Tactic · Skewer).",
    "playerColor": "w"
  },
  {
    "id": "lic-003jH",
    "fen": "rn3rk1/p5pp/3N4/4np1q/5Q2/1P6/PB1P1KP1/2R4R b - - 1 25",
    "moves": [
      "e5d3",
      "f2e3",
      "d3f4",
      "h1h5",
      "f4h5"
    ],
    "rating": 1089,
    "theme": "Decisive Tactic · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Tactical Fork).",
    "playerColor": "b"
  },
  {
    "id": "lic-003jb",
    "fen": "r3kb1r/p4ppp/b3p3/2pq4/3Q4/4BN2/PPP2PPP/R3K2R w KQkq - 0 12",
    "moves": [
      "d4a4",
      "a6b5",
      "a4b5"
    ],
    "rating": 962,
    "theme": "Decisive Tactic · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Tactical Fork) from French Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-003jv",
    "fen": "7R/1p2k2p/p2n2p1/4K3/8/6P1/P6P/8 b - - 11 37",
    "moves": [
      "d6f7",
      "e5e4",
      "f7h8"
    ],
    "rating": 1006,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-003md",
    "fen": "r1b1k2N/ppp3pp/2n5/2bp4/7q/1B4n1/PPPP1P1P/RNBQR1K1 b q - 1 10",
    "moves": [
      "g3e4",
      "e1e4",
      "d5e4",
      "d1h5",
      "h4h5",
      "b3f7",
      "h5f7"
    ],
    "rating": 2171,
    "theme": "Decisive Tactic",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic) from Russian Game.",
    "playerColor": "b"
  },
  {
    "id": "lic-003mh",
    "fen": "4rk1r/1pp2p2/p2p3p/3N4/3P2q1/8/PPP5/1K2Q1NR w - - 2 24",
    "moves": [
      "e1e8",
      "f8e8",
      "d5f6",
      "e8e7",
      "f6g4"
    ],
    "rating": 1325,
    "theme": "Winning Edge · Attraction",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Attraction).",
    "playerColor": "w"
  },
  {
    "id": "lic-003o0",
    "fen": "r1bqk2r/pp1nbppp/3p4/1B1p4/3P1B2/5N2/PPP2PPP/R2QK2R b KQkq - 3 9",
    "moves": [
      "d8a5",
      "d1d2",
      "a5b5"
    ],
    "rating": 1001,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Tactical Fork) from Czech Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-003r5",
    "fen": "r2qr1k1/ppp2ppp/4P3/8/1nP2Q2/2N2N1P/PP3KP1/R4R2 b - - 0 15",
    "moves": [
      "b4d3",
      "f2g1",
      "d3f4"
    ],
    "rating": 1130,
    "theme": "Decisive Tactic · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Tactical Fork) from Kings Gambit Accepted.",
    "playerColor": "b"
  },
  {
    "id": "lic-003wQ",
    "fen": "2r2rk1/6pp/3Q1q2/8/3N1B2/6P1/PP1K3P/5R2 b - - 0 24",
    "moves": [
      "f6d6",
      "f4d6",
      "f8f1"
    ],
    "rating": 1814,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Pins & Skewers",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-0088O",
    "fen": "7Q/2p5/1p2prp1/p4k1p/q4p1P/8/6RK/8 w - - 0 38",
    "moves": [
      "g2g5",
      "f5e4",
      "h8f6"
    ],
    "rating": 1133,
    "theme": "Decisive Tactic · Deflection",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Decisive Tactic · Deflection).",
    "playerColor": "w"
  },
  {
    "id": "lic-008D5",
    "fen": "r1bqk2r/pp3ppp/4p3/3pPn2/1b1P1P2/2N5/PP4PP/R1BQKB1R w KQkq - 3 10",
    "moves": [
      "d1a4",
      "c8d7",
      "a4b4"
    ],
    "rating": 1421,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Tactical Fork) from French Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-008GK",
    "fen": "1k6/ppp3p1/8/1P5p/8/P3n2P/2P1r1P1/B2rNRK1 w - - 5 32",
    "moves": [
      "f1f8",
      "d1d8",
      "f8d8"
    ],
    "rating": 651,
    "theme": "Back Rank Mate · Endgame",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Back Rank Mate · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-008LD",
    "fen": "8/6pp/6k1/5pN1/5P2/5rPb/4R2P/6K1 b - - 1 35",
    "moves": [
      "f3f1"
    ],
    "rating": 403,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-008LT",
    "fen": "r4r1k/6p1/b3p1nN/p1pp4/1p3P1q/3P1Q1B/PPP2PK1/R6R w - - 1 27",
    "moves": [
      "h6f7",
      "f8f7",
      "h3e6"
    ],
    "rating": 2209,
    "theme": "Decisive Tactic · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Pin).",
    "playerColor": "w"
  },
  {
    "id": "lic-008Nz",
    "fen": "6k1/2p2ppp/pnp5/B7/2P3PP/1P2PPR1/r3b2r/3R2K1 w - - 2 30",
    "moves": [
      "d1d8"
    ],
    "rating": 473,
    "theme": "Back Rank Mate · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Back Rank Mate · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-008P4",
    "fen": "8/4k3/1p1p4/rP2p1p1/P2nP1P1/3B4/3K4/R7 b - - 1 35",
    "moves": [
      "d4b3",
      "d2c3",
      "b3a1"
    ],
    "rating": 703,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-008Sk",
    "fen": "8/6pp/3Bp2k/p2pP2P/P3p1PK/8/r4b2/5R2 w - - 3 38",
    "moves": [
      "f1f2",
      "g7g5",
      "h4g3",
      "a2f2",
      "g3f2"
    ],
    "rating": 1912,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-008Y3",
    "fen": "r5k1/1p1r1pp1/p3pnp1/2qN4/8/1Q5P/PP3PP1/3RR1K1 w - - 0 25",
    "moves": [
      "d5f6",
      "g7f6",
      "d1d7"
    ],
    "rating": 1054,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-008aL",
    "fen": "7k/6p1/1r5p/P4p2/3Rp3/4P3/5PPP/6K1 b - - 0 39",
    "moves": [
      "b6b1",
      "d4d1",
      "b1d1"
    ],
    "rating": 541,
    "theme": "Back Rank Mate · Endgame",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Back Rank Mate · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-008cl",
    "fen": "r3k2r/ppp2p1p/2n1pp2/7q/2PN2P1/2BP2b1/PP2B1P1/R2Q1RK1 b kq - 0 16",
    "moves": [
      "h5h2"
    ],
    "rating": 828,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Scandinavian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-008lc",
    "fen": "7k/pb1qn1rn/1p2R2Q/2p2p2/2Pp4/3B4/PP3P1P/4RK2 w - - 2 28",
    "moves": [
      "h6g7",
      "h8g7",
      "e6e7",
      "d7e7",
      "e1e7"
    ],
    "rating": 1974,
    "theme": "Attraction · Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Attraction · Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-008nF",
    "fen": "2rq1rk1/7p/1n4pb/1R2Q3/pPpP1P2/P1B5/3N2PP/2R3K1 b - - 0 31",
    "moves": [
      "f8e8",
      "e5e8",
      "d8e8"
    ],
    "rating": 2168,
    "theme": "Decisive Tactic · Trapped Piece",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Trapped Piece).",
    "playerColor": "b"
  },
  {
    "id": "lic-008o6",
    "fen": "Q4rk1/p1p3p1/6P1/8/3P4/7P/q3r3/B4RK1 w - - 2 35",
    "moves": [
      "a8f8"
    ],
    "rating": 468,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-008qL",
    "fen": "r7/6pk/p2Q4/2p1p1qp/1pP1PrP1/1P3P1P/1P4K1/R4R2 b - - 0 25",
    "moves": [
      "a8d8",
      "d6d8",
      "g5d8"
    ],
    "rating": 1843,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-008rw",
    "fen": "rn2kb1r/pp2pp1p/2p2np1/4q3/8/2N4Q/PPPPBPPP/R1B1K2R w KQkq - 0 9",
    "moves": [
      "h3c8"
    ],
    "rating": 912,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1) from Scandinavian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-008tL",
    "fen": "8/7k/R6p/3p4/5r2/2P1p2P/P5P1/6K1 b - - 0 40",
    "moves": [
      "e3e2",
      "a6e6",
      "f4f1"
    ],
    "rating": 1193,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-0091A",
    "fen": "5rk1/q4ppp/p3Pb2/3nN3/P2P4/7Q/1r4PP/1R3RK1 w - - 0 25",
    "moves": [
      "e6f7",
      "f8f7",
      "h3c8",
      "f7f8",
      "c8e6"
    ],
    "rating": 2177,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-0092V",
    "fen": "r2qk1nr/ppp3pp/2n5/1B1p4/1b1Pp3/5Q1P/PP1B1PP1/RN2K2R w KQkq - 0 12",
    "moves": [
      "b5c6",
      "b7c6",
      "f3h5",
      "g7g6",
      "h5e5"
    ],
    "rating": 2259,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Decisive Tactic) from Ponziani Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-0092z",
    "fen": "2r3k1/3R1ppp/p1q5/2p2Q2/P7/7P/5PP1/6K1 w - - 4 27",
    "moves": [
      "f5f7",
      "g8h8",
      "f7g7"
    ],
    "rating": 991,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-0095W",
    "fen": "8/pp1r2kp/q2P1ppb/4N3/4P3/1Q5P/PPR2PP1/6K1 b - - 0 32",
    "moves": [
      "f6e5",
      "c2c7",
      "a6d6"
    ],
    "rating": 1832,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-009BH",
    "fen": "3r3k/6p1/4Q3/4B3/1p3P2/4PKP1/3q4/8 w - - 18 52",
    "moves": [
      "e6h6",
      "h8g8",
      "h6g7"
    ],
    "rating": 1513,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-009FP",
    "fen": "r1b1k1nr/ppp2pbp/3p1qp1/4p3/2BnP3/N2P2QP/PPP2PP1/R1B1K2R w KQkq - 0 10",
    "moves": [
      "c1g5",
      "f6g5",
      "g3g5"
    ],
    "rating": 1339,
    "theme": "Winning Edge · Trapped Piece",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Trapped Piece) from Pirc Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-009FS",
    "fen": "r2qr1k1/p5bp/1pp1N1p1/8/2Q2p2/2P1n2P/PP3PP1/R1B1RNK1 b - - 0 18",
    "moves": [
      "e3c4",
      "e6d8",
      "e8e1"
    ],
    "rating": 1712,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Discovered Attack) from Sicilian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-009IO",
    "fen": "3r4/4kp1r/p2Np1p1/3bP3/P2n4/8/1P3RPP/5RK1 w - - 5 26",
    "moves": [
      "f2f7",
      "h7f7",
      "f1f7"
    ],
    "rating": 1162,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 2).",
    "playerColor": "w"
  },
  {
    "id": "lic-009J1",
    "fen": "rn3k1r/pp2bp1p/2p1pNp1/6B1/5P2/7P/PPP4P/2K1RR2 w - - 4 18",
    "moves": [
      "g5h6"
    ],
    "rating": 1243,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1) from Pirc Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-009Os",
    "fen": "r2b2k1/1p3q1p/p2p4/3P2p1/2P1PR1r/6Q1/P2B3P/2R4K b - - 2 29",
    "moves": [
      "h4f4",
      "d2f4",
      "f7f4",
      "g3f4",
      "g5f4"
    ],
    "rating": 1390,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-009Sz",
    "fen": "r2qkb1r/pp4pp/4ppb1/3pN2B/3nnP2/2N5/PPP3PP/R1B1QRK1 w kq - 2 12",
    "moves": [
      "e5g6",
      "h7g6",
      "h5g6"
    ],
    "rating": 1619,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge) from Caro-Kann Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-009Wc",
    "fen": "1r3rk1/1pqN1pbp/p1p1pnp1/2N5/3P4/1QP5/PP3PPP/3RR1K1 b - - 3 19",
    "moves": [
      "f6d7",
      "c5d7",
      "c7d7"
    ],
    "rating": 1076,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic) from Caro-Kann Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-009XT",
    "fen": "rn1qk2r/pp3ppp/3bp1N1/3p4/3Pn3/3BB3/PPP2PPP/RN1Q1RK1 b kq - 0 10",
    "moves": [
      "d6h2",
      "g1h1",
      "h7g6"
    ],
    "rating": 1950,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic) from Caro-Kann Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-009aD",
    "fen": "r4k1r/pp3pp1/4p3/3pP1np/6Pq/1PP5/P3B1PP/RN1Q1RK1 b - - 0 14",
    "moves": [
      "h5g4",
      "e2g4",
      "h4h2"
    ],
    "rating": 1426,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge) from Queens Pawn Game.",
    "playerColor": "b"
  },
  {
    "id": "lic-009bR",
    "fen": "4r2k/3q3r/1p4pQ/p1pP4/2P4P/1N4p1/PP3RK1/8 w - - 2 38",
    "moves": [
      "f2f8",
      "e8f8",
      "h6f8"
    ],
    "rating": 1024,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-009bn",
    "fen": "2kr2r1/ppb2ppp/3qNn2/3p2B1/P7/2P2Q1P/1PB2PP1/R4RK1 b - - 0 18",
    "moves": [
      "d6h2"
    ],
    "rating": 580,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Caro-Kann Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-009eX",
    "fen": "2r3k1/7p/6q1/p1Np4/Qp2pr2/P4P2/1PR2P1K/6R1 b - - 1 36",
    "moves": [
      "f4h4"
    ],
    "rating": 922,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1).",
    "playerColor": "b"
  },
  {
    "id": "lic-009f8",
    "fen": "8/1p4p1/pb2pp1p/3n1k2/3P4/P3BN1P/1P2KPP1/8 w - - 1 27",
    "moves": [
      "f3h4",
      "f5e4",
      "f2f3"
    ],
    "rating": 1149,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-009fH",
    "fen": "rn2kb1r/pQ2pppp/2p2n2/8/3q2b1/8/PPP2PPP/RNB1KBNR b KQkq - 0 7",
    "moves": [
      "d4d1"
    ],
    "rating": 750,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Caro-Kann Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-009hH",
    "fen": "k3r3/p3q3/1pp5/3pnB2/1P1Q4/1KPP4/P3R3/8 b - - 1 41",
    "moves": [
      "e5f3",
      "e2e7",
      "f3d4",
      "c3d4",
      "e8e7"
    ],
    "rating": 1980,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-009lk",
    "fen": "1R6/6pk/2p4p/3bP2r/5B1P/2P1RqP1/P4P1Q/6K1 b - - 3 40",
    "moves": [
      "f3d1",
      "e3e1",
      "d1e1"
    ],
    "rating": 915,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 2).",
    "playerColor": "b"
  },
  {
    "id": "lic-009oc",
    "fen": "5Q2/pbp3np/1p1pq1pk/1P6/P6P/6K1/8/8 w - - 0 33",
    "moves": [
      "f8f4",
      "g6g5",
      "f4g5"
    ],
    "rating": 1165,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-009tE",
    "fen": "6k1/6pp/p1N5/1pP2bp1/5P2/8/PPP5/3K4 w - - 0 29",
    "moves": [
      "c6e7",
      "g8f7",
      "e7f5"
    ],
    "rating": 624,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-009uB",
    "fen": "3br1kr/7p/4p1pQ/P5P1/1B5P/P6q/5R2/6K1 w - - 2 36",
    "moves": [
      "f2f8",
      "e8f8",
      "h6f8"
    ],
    "rating": 1081,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 2).",
    "playerColor": "w"
  },
  {
    "id": "lic-009wR",
    "fen": "1R2R3/p7/1p1k3p/1Pb5/P5p1/6P1/5r1P/7K b - - 7 41",
    "moves": [
      "f2f1",
      "h1g2",
      "f1g1"
    ],
    "rating": 1250,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-009zR",
    "fen": "3Q4/p1p2ppp/4k3/8/5P2/4P3/Prqn2PP/3R1RK1 b - - 0 22",
    "moves": [
      "d2f3",
      "g1h1",
      "c2g2"
    ],
    "rating": 1620,
    "theme": "Discovered Attack · Endgame",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Discovered Attack · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-009zS",
    "fen": "r3r1k1/1p3p1p/p1p3p1/8/6bP/Q3b1P1/PP2B3/R3K2R b KQ - 0 20",
    "moves": [
      "g4e2",
      "e1e2",
      "e3c5",
      "e2f3",
      "c5a3"
    ],
    "rating": 1434,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-00A1H",
    "fen": "2r3k1/4brp1/2p3b1/2Pp1qNp/3B3P/2P5/PP3P1K/R2Q2R1 b - - 2 31",
    "moves": [
      "f5f4",
      "h2g2",
      "e7g5"
    ],
    "rating": 2041,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-00A5m",
    "fen": "8/1p6/p1p2p2/P3b3/1PK3P1/2PB4/3k4/8 w - - 4 61",
    "moves": [
      "d3f5",
      "e5c7",
      "f5c8",
      "b7b6",
      "a5b6",
      "c7b6",
      "c8a6"
    ],
    "rating": 1965,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00A5v",
    "fen": "4r1k1/pp1qr1p1/7p/2pPR3/2P2p2/1P3P2/P2Q2PP/4R1K1 b - - 4 33",
    "moves": [
      "e7e5",
      "e1e5",
      "e8e5"
    ],
    "rating": 876,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00A8H",
    "fen": "1k6/1p3p2/p1p1p3/2P1b3/PP6/1KB5/4q3/1R1R4 w - - 2 39",
    "moves": [
      "d1d8",
      "b8a7",
      "b1e1",
      "e2e1",
      "c3e1"
    ],
    "rating": 2625,
    "theme": "Decisive Tactic · Endgame",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00A9Q",
    "fen": "2rq1rk1/1p3p1p/p1pn2p1/P1Np4/1P1PnP2/4P3/5PBP/R1Q3RK b - - 3 22",
    "moves": [
      "e4f2"
    ],
    "rating": 679,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1).",
    "playerColor": "b"
  },
  {
    "id": "lic-00AB1",
    "fen": "8/7Q/3p1kp1/1p6/2b5/2q4P/5PPK/8 w - - 0 37",
    "moves": [
      "h7h8",
      "f6e6",
      "h8c3"
    ],
    "rating": 1107,
    "theme": "Decisive Tactic · Endgame",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00AEM",
    "fen": "r2q1rk1/p4p1p/1p3Qp1/2p4P/3p4/5R2/PPP2PP1/4R1K1 w - - 1 23",
    "moves": [
      "e1e7",
      "d8e7",
      "f6e7"
    ],
    "rating": 1700,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00AFG",
    "fen": "r4rk1/5ppp/p3bp2/2q2N1Q/Ppp5/8/1PP2PPP/R2R2K1 w - - 0 22",
    "moves": [
      "f5h6",
      "g7h6",
      "h5c5"
    ],
    "rating": 1486,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-00AGs",
    "fen": "rn5Q/4kp2/2p1p1r1/1q4p1/8/8/4NPPP/3R1K1R w - - 6 24",
    "moves": [
      "h8d8"
    ],
    "rating": 898,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1).",
    "playerColor": "w"
  },
  {
    "id": "lic-00AHY",
    "fen": "r6k/3NR1p1/4n2p/5b1P/p7/6R1/8/6K1 b - - 0 43",
    "moves": [
      "a4a3",
      "g3a3",
      "a8a3",
      "e7e8",
      "h8h7"
    ],
    "rating": 1356,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00AOH",
    "fen": "6k1/8/1R2p1pp/4P3/p1N2P2/6PK/7P/1r6 b - - 0 48",
    "moves": [
      "b1b6",
      "c4b6",
      "a4a3",
      "b6d7",
      "a3a2"
    ],
    "rating": 866,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — spot the tactical shot (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00APl",
    "fen": "5k2/1p4r1/pb2qp1Q/8/8/3B1bP1/PP3P1P/2R3K1 w - - 1 30",
    "moves": [
      "d3c4",
      "f3d5",
      "c4d5",
      "e6d5",
      "h6f6"
    ],
    "rating": 2390,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-00AVR",
    "fen": "br1qkb1r/p1p2ppp/4pn2/6B1/3Qn3/5NP1/P3PPBP/RN1R2K1 w k - 0 16",
    "moves": [
      "d4a4",
      "d8d7",
      "d1d7"
    ],
    "rating": 1761,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic) from Zukertort Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-00AXb",
    "fen": "5kr1/pp3p1p/1q2pBb1/1B1p4/P7/5P2/1P5P/2Q1K1rR w K - 1 22",
    "moves": [
      "h1g1",
      "b6g1",
      "b5f1",
      "g6c2",
      "c1f4"
    ],
    "rating": 2112,
    "theme": "Winning Edge",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-00Aae",
    "fen": "1R6/1P6/4pkp1/5p2/3P4/3KP2p/8/1r6 w - - 0 44",
    "moves": [
      "b8f8",
      "f6e7",
      "b7b8q",
      "b1b8",
      "f8b8"
    ],
    "rating": 1015,
    "theme": "Decisive Tactic · Endgame",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00Aas",
    "fen": "3r1rk1/1p2q1pp/5p2/8/1P1n4/6Q1/PPBB1PPP/R4RK1 b - - 0 20",
    "moves": [
      "d4e2",
      "g1h1",
      "e2g3",
      "f2g3",
      "d8d2"
    ],
    "rating": 1111,
    "theme": "Decisive Tactic · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Tactical Fork).",
    "playerColor": "b"
  },
  {
    "id": "lic-00AbP",
    "fen": "6k1/pp3pp1/2p5/7b/4r2P/2P2N2/PP4K1/3R4 w - - 0 25",
    "moves": [
      "d1d8",
      "g8h7",
      "f3g5"
    ],
    "rating": 804,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00Ac7",
    "fen": "8/2p1pk1p/Pp4p1/8/2P2P2/p2r2P1/3PR2P/3K4 w - - 0 34",
    "moves": [
      "a6a7",
      "d3d8",
      "e2e3",
      "a3a2",
      "e3a3"
    ],
    "rating": 2099,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00AcQ",
    "fen": "8/1bpp2k1/1p5r/1P2P3/3P1P2/2P1n1K1/Q5P1/8 b - - 1 30",
    "moves": [
      "h6g6",
      "g3f2",
      "g6g2"
    ],
    "rating": 1741,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00AdI",
    "fen": "3r4/4kp1p/1PQ1p1p1/p3b3/1p2P2P/1P5K/6P1/8 b - - 2 36",
    "moves": [
      "d8d3",
      "g2g3",
      "d3g3",
      "h3h2",
      "g3c3"
    ],
    "rating": 1263,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-00Af3",
    "fen": "8/8/2B2p1p/P4Pp1/3p2P1/1b1Pb1kP/8/4K3 w - - 1 51",
    "moves": [
      "a5a6",
      "b3c4",
      "a6a7"
    ],
    "rating": 1171,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00AfZ",
    "fen": "2r3kq/Q7/8/1brpN3/5Pp1/4P1P1/6K1/1B6 w - - 0 44",
    "moves": [
      "a7f7"
    ],
    "rating": 925,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1).",
    "playerColor": "w"
  },
  {
    "id": "lic-00AhO",
    "fen": "Q1b2rk1/2q2p1p/1p2pbp1/pP6/2P5/P2B1N2/5PPP/3R1RK1 b - - 0 20",
    "moves": [
      "c8b7",
      "a8a7",
      "f8a8",
      "a7a8",
      "b7a8"
    ],
    "rating": 1229,
    "theme": "Winning Edge · Trapped Piece",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Winning Edge · Trapped Piece).",
    "playerColor": "b"
  },
  {
    "id": "lic-00Ahb",
    "fen": "1k5r/pp1r1ppp/4p2n/1Nb2q2/2Pp4/6P1/PP3P1P/R1BQR1K1 w - - 3 15",
    "moves": [
      "c1f4",
      "f5f4",
      "g3f4"
    ],
    "rating": 1123,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic) from Sicilian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-00Al5",
    "fen": "2r3k1/p2B1pbp/1p2pnp1/n2p4/3P4/1Pr1P2P/P1QB1PP1/2R2RK1 b - - 0 19",
    "moves": [
      "c3c2",
      "d7c8",
      "c2d2"
    ],
    "rating": 1654,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge) from Slav Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-00AoZ",
    "fen": "8/1R6/p1pk4/2q3bp/1QP5/P7/KP6/3r4 w - - 3 45",
    "moves": [
      "b7d7",
      "d6d7",
      "b4c5"
    ],
    "rating": 1090,
    "theme": "Winning Edge · Deflection",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Winning Edge · Deflection).",
    "playerColor": "w"
  },
  {
    "id": "lic-00Ar2",
    "fen": "r2q1r2/1n4pk/p6p/1ppN1pb1/3n1B2/P2PN2P/1PPQ1PP1/R3R1K1 b - - 1 21",
    "moves": [
      "g5f4",
      "d5f4",
      "d8g5",
      "d2d1",
      "g5f4"
    ],
    "rating": 1738,
    "theme": "Winning Edge",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-00Au2",
    "fen": "r5r1/pp1k1p2/2p5/3pQ3/3P4/2NB4/PPP2q2/1K6 w - - 2 29",
    "moves": [
      "d3f5",
      "f2f5",
      "e5f5"
    ],
    "rating": 964,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — spot the tactical shot (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00AuR",
    "fen": "8/4bkp1/R6P/4p3/Pp2P3/1P2r3/6P1/6K1 w - - 0 34",
    "moves": [
      "h6h7",
      "e3e1",
      "g1h2"
    ],
    "rating": 1675,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00Aul",
    "fen": "4r3/1p3R1p/1pb2R1B/8/6k1/8/r6P/6K1 w - - 0 34",
    "moves": [
      "f7g7",
      "g4h4",
      "h6d2",
      "e8e1",
      "d2e1"
    ],
    "rating": 2666,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00B3B",
    "fen": "2KQ4/8/5b2/p1B5/P7/3k4/6p1/8 b - - 0 77",
    "moves": [
      "f6d8",
      "c8d8",
      "d3c4"
    ],
    "rating": 1449,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00B7G",
    "fen": "1rb2r1k/4q2p/p2p4/3B1p2/1pPb4/1P2NQ2/P5PP/2R2R1K b - - 2 24",
    "moves": [
      "e7e3",
      "f3e3",
      "d4e3"
    ],
    "rating": 1666,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-00B8m",
    "fen": "3b4/3P4/pp2Pk2/5Q2/P6p/8/8/7K b - - 0 43",
    "moves": [
      "f6f5",
      "e6e7",
      "d8e7",
      "d7d8q",
      "e7d8"
    ],
    "rating": 1275,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00BCa",
    "fen": "1r6/p2kp1P1/3p4/2pP4/2P2B2/1N6/p4PK1/8 w - - 0 42",
    "moves": [
      "b3c5",
      "d6c5",
      "f4b8",
      "a2a1q",
      "g7g8q"
    ],
    "rating": 1293,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00BJm",
    "fen": "r4rk1/1Q2bppp/p1N1p3/1p1q4/2pP1n2/2P5/PP3PPP/R4RK1 w - - 2 19",
    "moves": [
      "c6e7",
      "g8h8",
      "e7d5"
    ],
    "rating": 1088,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Tactical Fork) from Queens Pawn Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-00BKa",
    "fen": "2r3k1/p1Rb1ppp/2n1pn2/8/8/2P3P1/q4PBP/1rNQK2R w K - 3 17",
    "moves": [
      "c7c8",
      "d7c8",
      "c1a2",
      "b1d1",
      "e1d1"
    ],
    "rating": 2544,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Winning Edge) from French Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-00BM8",
    "fen": "3r1rk1/pp2bppp/2ppnn2/8/N1P1P3/q1P4P/P2N2PB/R2Q1R1K w - - 1 17",
    "moves": [
      "d2b1",
      "a3a4",
      "d1a4"
    ],
    "rating": 1606,
    "theme": "Winning Edge · Trapped Piece",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Trapped Piece) from Caro-Kann Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-00BNd",
    "fen": "1rr3k1/4ppbp/3p1np1/1b1N4/P2BP3/5P2/P2R2PP/R5K1 w - - 0 22",
    "moves": [
      "d5e7",
      "g8f8",
      "e7c8"
    ],
    "rating": 1026,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Tactical Fork).",
    "playerColor": "w"
  },
  {
    "id": "lic-00BQD",
    "fen": "4r3/3R1pkp/6p1/1P6/1b6/5B2/1P1R1PPP/6K1 b - - 0 36",
    "moves": [
      "e8e1"
    ],
    "rating": 740,
    "theme": "Back Rank Mate · Endgame",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Back Rank Mate · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00BSo",
    "fen": "2r3k1/4R1pp/p1p2p2/2N5/2P5/1Pb4P/P4PP1/6K1 b - - 0 25",
    "moves": [
      "c3b4",
      "e7a7",
      "b4c5"
    ],
    "rating": 1266,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00BZ6",
    "fen": "1r1r1bk1/3n1p1p/1qp3p1/2N1p3/PpQ1P3/4BP2/4N1PP/1RR3K1 b - - 1 24",
    "moves": [
      "f8c5",
      "e3c5",
      "d7c5"
    ],
    "rating": 2367,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — uncover the master-level combination (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-00Bg0",
    "fen": "8/3k4/3P1K2/p4R2/5r2/5P2/8/8 b - - 2 57",
    "moves": [
      "f4f5",
      "f6f5",
      "a5a4",
      "f5e4",
      "a4a3",
      "e4d3",
      "a3a2"
    ],
    "rating": 1640,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00Bg4",
    "fen": "3r2k1/1q3ppp/p3p3/Qp1r4/7P/P4P2/1PP3P1/1K1R3R w - - 0 22",
    "moves": [
      "a5d8",
      "d5d8",
      "d1d8"
    ],
    "rating": 1370,
    "theme": "Back Rank Mate · Endgame",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Back Rank Mate · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00Bm8",
    "fen": "8/6kp/4b1q1/1p6/1PpPN2Q/2P1P3/r5P1/5RK1 b - - 0 34",
    "moves": [
      "g6g2"
    ],
    "rating": 1113,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-00Bn4",
    "fen": "1k6/pp6/4nNp1/P3r2p/3p4/7P/3R1PPK/8 w - - 1 41",
    "moves": [
      "f6d7",
      "b8c7",
      "d7e5"
    ],
    "rating": 689,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00wn7",
    "fen": "3rqrk1/1p1bp1bp/1N1p4/pP2n1p1/Q1PBPp2/P4P2/4B1PP/2R2RK1 b - - 6 21",
    "moves": [
      "e5f3",
      "e2f3",
      "g7d4"
    ],
    "rating": 1175,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-00woo",
    "fen": "8/r7/pkq1p1r1/RP1pPp2/R1pP1Qp1/2P3Pp/4KP1P/8 b - - 0 44",
    "moves": [
      "a6b5",
      "a5a7",
      "b5a4"
    ],
    "rating": 1006,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00wtA",
    "fen": "r4rk1/pb2qppp/1pn1p3/2p5/1nP5/1PQ1PN2/PB2BPPP/R4RK1 w - - 5 14",
    "moves": [
      "c3g7"
    ],
    "rating": 446,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1) from English Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-00wx5",
    "fen": "6k1/5p1p/6p1/8/2q5/7P/r3rPP1/Q2R2K1 w - - 0 31",
    "moves": [
      "d1d8",
      "e2e8",
      "d8e8"
    ],
    "rating": 816,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-00x3K",
    "fen": "r2qk2r/ppp2pp1/2npb2p/3np3/2B1P3/P2P1N1P/1PPQ1PP1/R3K2R w KQkq - 0 11",
    "moves": [
      "e4d5",
      "e6d5",
      "c4d5"
    ],
    "rating": 1120,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Tactical Fork) from Four Knights Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-00x47",
    "fen": "3r1k2/p6p/1p1q4/4p3/P1P1p1Qb/1PB1P3/5rPP/R5K1 w - - 2 26",
    "moves": [
      "g4h4",
      "f2f5",
      "c3b4",
      "d6b4",
      "h4d8"
    ],
    "rating": 2206,
    "theme": "Decisive Tactic · Deflection",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Deflection).",
    "playerColor": "w"
  },
  {
    "id": "lic-00x5X",
    "fen": "7r/Bp1k1ppp/b7/4P3/1b6/8/PPN2rPP/R2K3R b - - 1 19",
    "moves": [
      "f2d2",
      "d1c1",
      "h8c8",
      "h1d1",
      "c8c2"
    ],
    "rating": 1993,
    "theme": "Decisive Tactic · Pin",
    "category": "Pins & Skewers",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Pin).",
    "playerColor": "b"
  },
  {
    "id": "lic-00x6f",
    "fen": "8/3q1pkp/p5p1/1pPB2QP/1P1b4/P5P1/6K1/8 b - - 0 30",
    "moves": [
      "h7h6",
      "c5c6",
      "d7d6",
      "g5g4",
      "d6d5"
    ],
    "rating": 2205,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00xDW",
    "fen": "7k/5Bp1/3p3p/8/4P1n1/r2r4/6PP/1R1R2K1 w - - 0 37",
    "moves": [
      "d1d3",
      "a3d3",
      "f7g6"
    ],
    "rating": 1963,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00xDa",
    "fen": "R7/3kbpp1/4p3/1p1pP3/2pPb1P1/1PP1B3/1Q3P1r/6K1 b - - 0 28",
    "moves": [
      "h2h1"
    ],
    "rating": 1294,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-00xGN",
    "fen": "r2q1rk1/ppp1nppp/3b4/1B6/3QP3/2N2P2/PPP2P1P/R1B2RK1 b - - 0 10",
    "moves": [
      "d6h2",
      "g1h2",
      "d8d4"
    ],
    "rating": 967,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — spot the tactical shot (Winning Edge · Discovered Attack) from Nimzowitsch Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-00xHQ",
    "fen": "1r4k1/5p1p/3R2p1/1qN5/1r1Qp3/7P/5PPK/8 w - - 1 36",
    "moves": [
      "d6d8",
      "b8d8",
      "d4d8",
      "g8g7",
      "c5d7"
    ],
    "rating": 1703,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00xIC",
    "fen": "3rr1k1/1R3ppp/8/2p5/q1Qp1B2/6P1/P1R2P1P/6K1 b - - 4 28",
    "moves": [
      "e8e1",
      "g1g2",
      "a4c6",
      "f2f3",
      "c6b7"
    ],
    "rating": 1268,
    "theme": "Decisive Tactic · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Tactical Fork).",
    "playerColor": "b"
  },
  {
    "id": "lic-00xMV",
    "fen": "1k1r1br1/ppp5/5q2/4pP2/6P1/3Q1P1p/PPP5/3RR1K1 w - - 0 27",
    "moves": [
      "d3d8",
      "f6d8",
      "d1d8"
    ],
    "rating": 800,
    "theme": "Back Rank Mate · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Back Rank Mate · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-00xMv",
    "fen": "r3brk1/1pqnb2p/p3ppp1/2ppN2Q/5P2/1P1PP1R1/PBPN2PP/R5K1 w - - 0 16",
    "moves": [
      "e5g6",
      "e8g6",
      "g3g6",
      "h7g6",
      "h5g6"
    ],
    "rating": 1764,
    "theme": "Decisive Tactic · Sacrifice",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Sacrifice) from Bird Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-00xNH",
    "fen": "r2q2k1/p4ppp/2p2n2/3p2B1/6b1/2NQrN1P/PPP2bP1/2KR3R w - - 1 15",
    "moves": [
      "g5e3",
      "f2e3",
      "d3e3"
    ],
    "rating": 1890,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic) from Sicilian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-00xOm",
    "fen": "5rk1/7p/p2R2p1/1p2n1P1/2q1Q1P1/PBP5/Kr6/8 w - - 0 41",
    "moves": [
      "a2b2",
      "f8f2",
      "e4c2",
      "f2c2",
      "b2c2"
    ],
    "rating": 2090,
    "theme": "Winning Edge · Hanging Piece",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Hanging Piece).",
    "playerColor": "w"
  },
  {
    "id": "lic-00xWV",
    "fen": "6k1/4b3/p4pPq/1p2p2P/2p3Q1/P7/1PP5/1K6 w - - 1 39",
    "moves": [
      "g4e6",
      "g8h8",
      "e6e7"
    ],
    "rating": 1560,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00xWX",
    "fen": "5Q2/7p/6p1/7k/8/1Pq3pP/6P1/7K w - - 2 46",
    "moves": [
      "f8f3",
      "c3f3",
      "g2f3"
    ],
    "rating": 1033,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00xa4",
    "fen": "2r1k3/2p1rpp1/1p1p1b1B/p2P1P1P/P1P5/3K4/5PR1/6R1 b - - 0 30",
    "moves": [
      "g7h6",
      "g2g8",
      "e8d7",
      "g8c8",
      "d7c8"
    ],
    "rating": 991,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — spot the tactical shot (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00xgR",
    "fen": "4Q3/2B3k1/4p2p/2P3p1/3P4/4p3/6PP/4qNK1 b - - 1 34",
    "moves": [
      "e1f2",
      "g1h1",
      "f2f1"
    ],
    "rating": 1124,
    "theme": "Deflection · Endgame",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Deflection · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00xgi",
    "fen": "rnb1qrk1/pp4pp/4p3/3pNp1Q/2pPn3/2PBP1P1/PP1N1PP1/R3K2R w KQ - 2 12",
    "moves": [
      "h5h7"
    ],
    "rating": 1148,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1) from Queens Pawn Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-00xiD",
    "fen": "r4rk1/4qppp/b3p3/p2pP3/1p1P4/3Q4/PPB2PPP/R4RK1 w - - 0 18",
    "moves": [
      "d3h7"
    ],
    "rating": 559,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1) from Queens Gambit Declined.",
    "playerColor": "w"
  },
  {
    "id": "lic-00xmm",
    "fen": "r6r/ppk3pp/2pb4/4P3/8/6PQ/PP3PKP/R1Bq4 w - - 0 25",
    "moves": [
      "e5d6",
      "d1d6",
      "c1f4",
      "d6f4",
      "g3f4"
    ],
    "rating": 999,
    "theme": "Winning Edge · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — spot the tactical shot (Winning Edge · Pin).",
    "playerColor": "w"
  },
  {
    "id": "lic-00xnu",
    "fen": "2R5/p2r4/knQ3p1/4B3/Rq1Pb3/8/5PPP/6K1 b - - 0 40",
    "moves": [
      "b4a4",
      "c6a4",
      "b6a4"
    ],
    "rating": 682,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — spot the tactical shot (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-00xrk",
    "fen": "2kr4/2p2p2/p6p/1p2q1p1/2p2B2/2N4P/PPB1QPP1/6K1 b - - 0 24",
    "moves": [
      "e5e2",
      "c3e2",
      "g5f4"
    ],
    "rating": 2324,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00xsd",
    "fen": "r1bqkb1r/1p1npp1p/p2p1np1/6B1/2PN4/3BP3/PP3PPP/RN1QK2R b KQkq - 0 8",
    "moves": [
      "d8a5",
      "b1c3",
      "a5g5"
    ],
    "rating": 1191,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Tactical Fork) from Zukertort Opening.",
    "playerColor": "b"
  },
  {
    "id": "lic-00xte",
    "fen": "4rb2/4N3/P2P2k1/4K2p/4P1p1/3r4/R7/5R2 b - - 2 52",
    "moves": [
      "f8e7",
      "d6e7",
      "e8e7",
      "e5f4",
      "e7f7"
    ],
    "rating": 1337,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00xvM",
    "fen": "rn1q1b1Q/pp1k3p/2p2n2/3p4/4P1pP/2N5/PPP3B1/2KR2NR b - - 0 14",
    "moves": [
      "f8h6",
      "c1b1",
      "d8h8"
    ],
    "rating": 1184,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Discovered Attack) from Queens Pawn Game.",
    "playerColor": "b"
  },
  {
    "id": "lic-00xyk",
    "fen": "3r1rk1/1b3qn1/pp1Q2p1/2p1n1Pp/P1P1Pp1N/2P2B1P/5B1K/R4R2 w - - 2 26",
    "moves": [
      "d6e5",
      "d8e8",
      "e5d6"
    ],
    "rating": 1970,
    "theme": "Winning Edge · Hanging Piece",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Hanging Piece).",
    "playerColor": "w"
  },
  {
    "id": "lic-00y0m",
    "fen": "r5k1/2B2pp1/1P2p1p1/r2q4/3Pp3/R6P/5PP1/1R4K1 w - - 0 33",
    "moves": [
      "a3a5",
      "a8a5",
      "b6b7",
      "d5b7",
      "b1b7",
      "a5a1",
      "g1h2"
    ],
    "rating": 1643,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00y2j",
    "fen": "3B4/1p4kp/2b1Pp2/1pN2RpK/1P6/7P/6r1/8 b - - 0 34",
    "moves": [
      "c6e8"
    ],
    "rating": 1522,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-00y3g",
    "fen": "8/4Qpk1/p3p2p/1p1b3r/7P/3B4/2P3PK/3r4 w - - 5 45",
    "moves": [
      "d3e2",
      "h5h4",
      "e7h4"
    ],
    "rating": 2096,
    "theme": "Winning Edge · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00y9H",
    "fen": "r2q1rk1/1pp2ppp/8/p2pn3/P3N3/3Bb2Q/1P3PPP/R4RK1 w - - 0 18",
    "moves": [
      "e4f6",
      "g7f6",
      "h3h7"
    ],
    "rating": 1380,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 2) from Italian Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-00yHW",
    "fen": "8/6r1/pR6/6pk/8/6PP/6K1/8 w - - 0 41",
    "moves": [
      "g3g4",
      "h5h4",
      "b6h6"
    ],
    "rating": 937,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-00yIS",
    "fen": "7k/p5p1/5q1p/8/P1b5/3rQ1RP/6BK/8 w - - 7 43",
    "moves": [
      "e3e8",
      "c4g8",
      "g3d3"
    ],
    "rating": 1055,
    "theme": "Winning Edge · Deflection",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Deflection).",
    "playerColor": "w"
  },
  {
    "id": "lic-00yLn",
    "fen": "2k5/pp3b2/2p1N1p1/2P2p2/3K4/P4r2/8/R7 w - - 2 32",
    "moves": [
      "e6g5",
      "f7d5",
      "g5f3"
    ],
    "rating": 1321,
    "theme": "Endgame · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Endgame · Tactical Fork).",
    "playerColor": "w"
  },
  {
    "id": "lic-00yOA",
    "fen": "8/8/8/6KP/p7/1k6/8/8 w - - 1 51",
    "moves": [
      "h5h6",
      "a4a3",
      "h6h7",
      "b3c2",
      "h7h8q"
    ],
    "rating": 845,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00yP0",
    "fen": "2r1r1k1/2q4p/4pp1Q/p2p3R/3P4/2P4P/P4PP1/6K1 w - - 1 28",
    "moves": [
      "h6f6",
      "c7g7",
      "h5g5",
      "g7g5",
      "f6g5"
    ],
    "rating": 1412,
    "theme": "Winning Edge · Endgame",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00yPS",
    "fen": "5k2/p3pp2/7p/2Qp1P2/6q1/8/2K5/8 w - - 0 44",
    "moves": [
      "c5c8",
      "f8g7",
      "f5f6",
      "g7f6",
      "c8g4"
    ],
    "rating": 1069,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-00ySR",
    "fen": "4rk2/pprR3p/1b4p1/6B1/4p2P/1B6/PP3PP1/6K1 w - - 1 32",
    "moves": [
      "g5h6"
    ],
    "rating": 1483,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-00yTd",
    "fen": "6k1/5p2/2p3q1/3p2Q1/p1nB4/5P1P/6PK/8 w - - 6 51",
    "moves": [
      "g5d8",
      "g8h7",
      "d8h8"
    ],
    "rating": 894,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-00yTt",
    "fen": "r4rk1/1ppq1pbp/p5p1/2pPp3/P1B1Pn2/4QN2/1PP1NP2/R3RK2 b - - 5 18",
    "moves": [
      "d7h3",
      "f1g1",
      "h3g2"
    ],
    "rating": 987,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 2) from Modern Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-00yWQ",
    "fen": "8/5pk1/4b2p/8/2r1N1P1/4PK1P/5R2/8 b - - 13 51",
    "moves": [
      "e6d5",
      "f2d2",
      "d5e4"
    ],
    "rating": 1282,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00ybx",
    "fen": "6k1/p7/2p1r1bp/3p2p1/8/1PP3BP/P4P2/4RK2 b - - 1 35",
    "moves": [
      "g6d3",
      "f1g2",
      "e6e1"
    ],
    "rating": 947,
    "theme": "Decisive Tactic · Deflection",
    "category": "Sacrifices & Attack",
    "description": "Black to move — spot the tactical shot (Decisive Tactic · Deflection).",
    "playerColor": "b"
  },
  {
    "id": "lic-00yfI",
    "fen": "r1b5/1p3kpQ/p1nBpn2/3p4/3P4/P1N5/1PP1B1qP/2K2R2 b - - 0 17",
    "moves": [
      "g2f1",
      "e2f1",
      "f6h7"
    ],
    "rating": 1712,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge) from Rapport-Jobava System.",
    "playerColor": "b"
  },
  {
    "id": "lic-00yfJ",
    "fen": "r1b1k2r/p4p1p/2p1p3/1pRnPp2/q2P4/2Q2N1P/5PP1/1B3RK1 w kq - 1 20",
    "moves": [
      "c5d5",
      "c6d5",
      "c3c6"
    ],
    "rating": 1642,
    "theme": "Decisive Tactic · Sacrifice",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Sacrifice) from Queens Gambit Declined.",
    "playerColor": "w"
  },
  {
    "id": "lic-00yjj",
    "fen": "4r1rk/2pq3p/R7/1p3p2/5P2/1PP4P/1P2RQN1/6K1 b - - 0 33",
    "moves": [
      "d7d1",
      "f2f1",
      "d1e2",
      "f1e2",
      "e8e2"
    ],
    "rating": 1449,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-00ymq",
    "fen": "Q7/4ppbk/6pp/5q2/P3n3/4PNBP/1r3PP1/3R2K1 b - - 0 31",
    "moves": [
      "e4g3",
      "f2g3",
      "f5c2"
    ],
    "rating": 1528,
    "theme": "Decisive Tactic",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-00ynV",
    "fen": "3r4/1p3pk1/1q3Npr/p7/2B5/2P2Q2/1PK2PP1/8 w - - 0 31",
    "moves": [
      "f6e8",
      "g7h8",
      "f3f7",
      "d8d2",
      "c2d2"
    ],
    "rating": 1954,
    "theme": "Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00ynd",
    "fen": "6k1/4ppbp/1p1p1np1/pN1P4/2B4P/1P2B1P1/P6K/8 b - - 3 35",
    "moves": [
      "f6g4",
      "h2g2",
      "g4e3"
    ],
    "rating": 601,
    "theme": "Winning Edge · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — spot the tactical shot (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00ysx",
    "fen": "1k5r/ppq2p2/2pN4/4PBb1/2P2pp1/1P5r/P1Q3KP/3R3R b - - 6 28",
    "moves": [
      "f4f3",
      "g2f1",
      "g4g3",
      "f5h3",
      "h8h3"
    ],
    "rating": 1970,
    "theme": "Decisive Tactic · Sacrifice",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Sacrifice).",
    "playerColor": "b"
  },
  {
    "id": "lic-00yt1",
    "fen": "r3rk2/pp3pbp/6p1/4Nn2/2Qp1P2/1P5P/6P1/3R2K1 w - - 1 26",
    "moves": [
      "c4f7"
    ],
    "rating": 1117,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1).",
    "playerColor": "w"
  },
  {
    "id": "lic-00yxD",
    "fen": "3r2r1/1b3p1k/p1q2Pp1/1p6/6P1/P2BR3/1PP2R1P/6K1 w - - 0 29",
    "moves": [
      "e3h3"
    ],
    "rating": 975,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1).",
    "playerColor": "w"
  },
  {
    "id": "lic-00yyG",
    "fen": "8/4p1k1/p2p1R2/3P1p2/6r1/1P4Q1/4PP2/6K1 b - - 0 39",
    "moves": [
      "g4g3",
      "g1h2",
      "g7f6",
      "h2g3",
      "f6e5"
    ],
    "rating": 1970,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00yzd",
    "fen": "6k1/8/4p1p1/1P5p/1B2PP2/3pbK1P/2p5/4R3 b - - 3 36",
    "moves": [
      "d3d2",
      "b4d2",
      "e3d2",
      "b5b6",
      "d2e1"
    ],
    "rating": 1743,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00yzf",
    "fen": "3rk3/3N2R1/4P1pr/3pP3/2p5/8/PP4p1/2K5 w - - 0 30",
    "moves": [
      "d7f6",
      "e8f8",
      "g7f7"
    ],
    "rating": 1884,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-00z22",
    "fen": "r7/pRp2pkp/3p1pr1/4pQ2/4P3/5PB1/P1q2bPP/1R5K w - - 2 23",
    "moves": [
      "b7b2",
      "c2b2",
      "b1b2"
    ],
    "rating": 1837,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-00z3O",
    "fen": "r2qr1k1/pp3pp1/2p2n1p/4R3/3P4/3Q1b1P/PPB2PP1/4R1K1 w - - 0 24",
    "moves": [
      "e5e8",
      "d8e8",
      "e1e8"
    ],
    "rating": 1096,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-00z82",
    "fen": "r4bk1/1p1n1ppp/p2p4/q1pP4/4rP2/1P1B1Q1P/1BP3P1/5RK1 w - - 0 19",
    "moves": [
      "f3e4",
      "g7g6",
      "f4f5"
    ],
    "rating": 1592,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge) from Queens Pawn Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-00z9K",
    "fen": "4B3/1b4kp/p7/3p3R/6P1/1P6/KPrn1r2/7R w - - 3 35",
    "moves": [
      "h5h7",
      "g7f8",
      "h7b7"
    ],
    "rating": 2209,
    "theme": "Winning Edge · Skewer",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Winning Edge · Skewer).",
    "playerColor": "w"
  },
  {
    "id": "lic-00zDW",
    "fen": "1r1r3k/p3R1pp/b1p5/2pq2Q1/8/2PPR2P/PP3PP1/6K1 w - - 3 27",
    "moves": [
      "g5g7"
    ],
    "rating": 1174,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1).",
    "playerColor": "w"
  },
  {
    "id": "lic-00zDb",
    "fen": "8/1pk1q3/1n3p2/2r2Pp1/B2QP2p/P4P2/KP4P1/3R4 b - - 0 36",
    "moves": [
      "c5c4",
      "d4d3",
      "c4a4"
    ],
    "rating": 1926,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00zI4",
    "fen": "r2q1rk1/pb3ppp/1p2p3/3n4/8/PnN1PN2/1P1Q1PPP/1BR1K2R w K - 2 14",
    "moves": [
      "d2c2",
      "g7g6",
      "c2b3"
    ],
    "rating": 1911,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic) from Queens Gambit Declined.",
    "playerColor": "w"
  },
  {
    "id": "lic-00zL1",
    "fen": "rk6/1p6/p1n1b3/2Q5/7B/8/P4PPP/4qBK1 w - - 3 31",
    "moves": [
      "h4g3",
      "b8c8",
      "c5d6",
      "e1a5",
      "d6e6"
    ],
    "rating": 2155,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-00zNz",
    "fen": "r1bqk2r/pp1np1bp/2p5/3pNp2/3P1B2/4P3/PPP2PPP/R2QK2R w KQkq - 0 11",
    "moves": [
      "d1h5",
      "e8f8",
      "h5f7"
    ],
    "rating": 1121,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 2) from Queens Pawn Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-00zOQ",
    "fen": "2r3k1/p7/7p/1p4p1/6R1/3B1q1P/2P3RP/2B4K b - - 7 35",
    "moves": [
      "c8e8",
      "c1d2",
      "f3d1",
      "g2g1",
      "d1d2"
    ],
    "rating": 1925,
    "theme": "Winning Edge · Deflection",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Deflection).",
    "playerColor": "b"
  },
  {
    "id": "lic-00zQz",
    "fen": "4rrk1/pB4pp/2N2p2/2p5/6b1/1PN3P1/P1P2P1P/4RK2 b - - 0 21",
    "moves": [
      "g4h3",
      "f1g1",
      "e8e1"
    ],
    "rating": 1282,
    "theme": "Deflection · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Deflection · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-00zUZ",
    "fen": "r1q2rk1/1p1b1pbp/p2p4/2p2N2/P3Pn2/2NP2QP/1PP3BK/R7 w - - 0 21",
    "moves": [
      "g3g7"
    ],
    "rating": 989,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1).",
    "playerColor": "w"
  },
  {
    "id": "lic-00zVd",
    "fen": "3rkbnr/1pp3pp/p4p2/4N3/4R3/8/PPP2PPP/RNB3K1 b k - 0 11",
    "moves": [
      "d8d1",
      "e4e1",
      "d1e1"
    ],
    "rating": 676,
    "theme": "Back Rank Mate · Tactical Fork",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Back Rank Mate · Tactical Fork) from Ruy Lopez.",
    "playerColor": "b"
  },
  {
    "id": "lic-00zdb",
    "fen": "3qr1k1/pb3p2/1p4pp/n1rp4/P1pRnN2/2P2N1P/BPQ2PP1/3R2K1 w - - 3 21",
    "moves": [
      "d4e4",
      "d5e4",
      "d1d8"
    ],
    "rating": 1816,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-00zeF",
    "fen": "1k3b1r/1p4pp/pN2p3/8/4n1Pq/3r3P/PQ3P2/2R1K2R w K - 2 21",
    "moves": [
      "c1c8",
      "b8a7",
      "c8a8"
    ],
    "rating": 1807,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Checkmate · Mate in 2).",
    "playerColor": "w"
  },
  {
    "id": "lic-00zgl",
    "fen": "3r1rk1/1b3ppB/p1p1p3/1pqNP1b1/5P2/8/PPP1Q1PP/3R1R1K b - - 0 18",
    "moves": [
      "g8h7",
      "f4g5",
      "d8d5"
    ],
    "rating": 1852,
    "theme": "Tactical Motif",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Motif) from Sicilian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-00ziz",
    "fen": "8/p1p2k1p/Pp5b/1PPP1K2/3P4/8/8/8 w - - 0 46",
    "moves": [
      "d5d6",
      "c7d6",
      "c5b6"
    ],
    "rating": 2066,
    "theme": "Decisive Tactic · Deflection",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Deflection).",
    "playerColor": "w"
  },
  {
    "id": "lic-00zkP",
    "fen": "6k1/2R2qp1/7p/1pQ1B3/4pP2/8/4rPPP/r1R3K1 b - - 2 32",
    "moves": [
      "e2e1",
      "c1e1",
      "a1e1"
    ],
    "rating": 1459,
    "theme": "Back Rank Mate · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Back Rank Mate · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-00zmB",
    "fen": "2k4r/pp3ppp/6b1/2pQP3/8/2q5/P4PPP/R1B2K1R b - - 1 20",
    "moves": [
      "g6d3",
      "d5d3",
      "c3d3"
    ],
    "rating": 1176,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-00zqB",
    "fen": "3r1rk1/pp6/5pb1/5q2/2p5/P2P4/1PP4Q/2K3RR w - - 0 28",
    "moves": [
      "h2h7"
    ],
    "rating": 1800,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Checkmate · Mate in 1).",
    "playerColor": "w"
  },
  {
    "id": "lic-00zrq",
    "fen": "7R/6P1/p3p2P/1p2k3/8/2Ppp3/r5r1/3R3K w - - 0 41",
    "moves": [
      "g7g8q",
      "g2g8",
      "h8g8",
      "e3e2",
      "d1e1"
    ],
    "rating": 2071,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-00zu9",
    "fen": "8/1p3p2/4p1k1/P2pPpPp/1p1P3K/1P3P1P/8/8 b - - 0 43",
    "moves": [
      "f5f4",
      "a5a6",
      "f7f6",
      "e5f6",
      "b7a6"
    ],
    "rating": 2540,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-00zxV",
    "fen": "rn3k1r/pp2p2p/2p3p1/8/2B1n3/4q3/PQP3PP/RN3K1R w - - 4 15",
    "moves": [
      "b2h8"
    ],
    "rating": 636,
    "theme": "Hanging Piece · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Hanging Piece · Checkmate) from Caro-Kann Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0100g",
    "fen": "8/8/5k2/R2K4/2P4r/8/P7/8 b - - 2 43",
    "moves": [
      "h4h5",
      "d5d6",
      "h5a5"
    ],
    "rating": 873,
    "theme": "Decisive Tactic · Endgame",
    "category": "Pins & Skewers",
    "description": "Black to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-0103M",
    "fen": "2kr1b1r/pppb1p1p/1q6/4p3/1P1P4/4BN2/5PPP/R2QKB1R b KQ - 0 16",
    "moves": [
      "e5d4",
      "d1d4",
      "f8b4"
    ],
    "rating": 2176,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic) from Scandinavian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0104L",
    "fen": "6k1/pQ3pp1/7p/8/3P4/6Pb/PPR2r1P/6K1 b - - 0 25",
    "moves": [
      "f2f1"
    ],
    "rating": 1010,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-0104o",
    "fen": "6rk/2QR3p/p5q1/1p4n1/6P1/PP3P2/8/6K1 w - - 1 42",
    "moves": [
      "c7c3",
      "g6g7",
      "d7g7"
    ],
    "rating": 2073,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-0109N",
    "fen": "r2qkbnr/1p2pppp/p1n5/4N3/2BP4/8/PP3PPP/RNBb1RK1 w kq - 0 9",
    "moves": [
      "c4f7"
    ],
    "rating": 1215,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1) from Caro-Kann Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0109V",
    "fen": "r5k1/pp3ppp/2pq4/3b4/3P2n1/2PQ4/PPB2PPP/4R1K1 w - - 0 23",
    "moves": [
      "d3h7",
      "g8f8",
      "h7h8"
    ],
    "rating": 822,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 2).",
    "playerColor": "w"
  },
  {
    "id": "lic-0109Y",
    "fen": "r3r2Q/p2k1pn1/5q2/3p4/1p5P/3B1PR1/PPP2nP1/1K2R3 w - - 7 28",
    "moves": [
      "d3b5",
      "d7d6",
      "b5e8",
      "a8e8",
      "e1e8"
    ],
    "rating": 2050,
    "theme": "Winning Edge · Skewer",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Skewer).",
    "playerColor": "w"
  },
  {
    "id": "lic-010I0",
    "fen": "2kr4/pppq1p2/8/3pP3/2P2Q2/N3PRn1/PP4r1/2KR4 w - - 1 26",
    "moves": [
      "f3g3",
      "g2g3",
      "f4g3"
    ],
    "rating": 1386,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-010Jc",
    "fen": "rnb1k2r/bpqp1pp1/p3p3/7p/4P1n1/1NNB3P/PPP1QPP1/R1B2R1K b kq - 2 11",
    "moves": [
      "c7h2"
    ],
    "rating": 444,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Sicilian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-010MJ",
    "fen": "3r2k1/pR3pp1/8/5p1p/5q2/5n2/PP4R1/6QK w - - 0 30",
    "moves": [
      "g2g7",
      "g8h8",
      "g7h7",
      "h8h7",
      "b7f7",
      "h7h8",
      "g1g7"
    ],
    "rating": 1500,
    "theme": "Attraction · Endgame",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Attraction · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-039Zj",
    "fen": "8/8/8/2pPp1bR/2P1P1k1/5r1p/4K3/8 w - - 4 63",
    "moves": [
      "h5g5",
      "g4g5",
      "e2f3",
      "h3h2",
      "f3g2",
      "h2h1r",
      "g2h1"
    ],
    "rating": 1238,
    "theme": "Decisive Tactic · Deflection",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Decisive Tactic · Deflection).",
    "playerColor": "w"
  },
  {
    "id": "lic-039e3",
    "fen": "5r1k/b5p1/2p4p/p1P3N1/5R2/6P1/PP5P/7K b - - 6 36",
    "moves": [
      "f8f4",
      "g3f4",
      "h6g5"
    ],
    "rating": 1429,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-039eL",
    "fen": "r3r1k1/p4p1p/1p4pB/4p3/3nP2Q/P7/2q2PPP/R4RK1 w - - 2 22",
    "moves": [
      "a1c1",
      "c2e2",
      "h4f6",
      "d4e6",
      "c1c7"
    ],
    "rating": 2764,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-039ed",
    "fen": "4r1k1/pp2rpp1/2p3p1/3p2P1/5n1P/3PBBn1/PPP2P2/R3RK2 w - - 2 24",
    "moves": [
      "f2g3",
      "e7e3",
      "e1e3",
      "e8e3",
      "f1f2",
      "e3f3",
      "f2f3"
    ],
    "rating": 2097,
    "theme": "Decisive Tactic · Hanging Piece",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Hanging Piece).",
    "playerColor": "w"
  },
  {
    "id": "lic-039f2",
    "fen": "8/8/4k2r/3R3p/3P4/5P1P/4b1PK/8 w - - 1 52",
    "moves": [
      "d5e5",
      "e6d6",
      "e5e2"
    ],
    "rating": 938,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-039ga",
    "fen": "r2q2r1/4p2k/3p1bpB/p7/1P6/2N2P2/1PP3P1/2KR3R w - - 0 24",
    "moves": [
      "h6f8",
      "f6h4",
      "h1h4"
    ],
    "rating": 1415,
    "theme": "Discovered Attack · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Discovered Attack · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-039hh",
    "fen": "8/8/8/2b5/2r3RP/3kp3/6B1/3K4 w - - 0 58",
    "moves": [
      "g2f1",
      "e3e2",
      "f1e2"
    ],
    "rating": 1251,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-039ho",
    "fen": "r1b2k1r/1p4p1/p1nqpnQp/3p1pN1/3P4/P1P5/4BPPP/R4RK1 w - - 0 18",
    "moves": [
      "g6f7"
    ],
    "rating": 1282,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1) from Sicilian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-039kX",
    "fen": "3r3k/p6q/1p6/5QP1/1P1pp3/P7/2PB4/2K5 w - - 0 42",
    "moves": [
      "f5f6",
      "h7g7",
      "f6d8"
    ],
    "rating": 1452,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-039lE",
    "fen": "r5rk/p4b1p/1p1R4/2n3q1/1n2pN1p/4P3/PPQ1BPPP/2R4K w - - 6 29",
    "moves": [
      "c2c3",
      "g5g7",
      "c3b4"
    ],
    "rating": 1379,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Tactical Fork).",
    "playerColor": "w"
  },
  {
    "id": "lic-039q6",
    "fen": "8/4kpp1/7p/1B2PK1P/1P6/8/2n2P2/8 b - - 0 39",
    "moves": [
      "c2d4",
      "f5e4",
      "d4b5"
    ],
    "rating": 1033,
    "theme": "Winning Edge · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-039qo",
    "fen": "r2qrk2/pb2np1Q/1p3b2/2p3N1/8/P2P2P1/1P2PPBP/R4RK1 w - - 2 19",
    "moves": [
      "h7f7"
    ],
    "rating": 1192,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1) from English Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-039rW",
    "fen": "8/6k1/8/1K4pP/1R5r/P7/1P6/8 b - - 0 45",
    "moves": [
      "h4b4",
      "b5b4",
      "g5g4"
    ],
    "rating": 1591,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-039sR",
    "fen": "6k1/p2q2pp/8/4pN2/3b2P1/2pQ3P/P1P2P2/6K1 b - - 1 30",
    "moves": [
      "d4f2",
      "g1f2",
      "d7d3",
      "c2d3",
      "c3c2"
    ],
    "rating": 1020,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-039vE",
    "fen": "rn2k3/pp3p2/2pp4/4p1Q1/2P1P1b1/2NP2Pq/PP3P1N/R4R1K b q - 0 20",
    "moves": [
      "g4f3",
      "h1g1",
      "h3g2"
    ],
    "rating": 972,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 2).",
    "playerColor": "b"
  },
  {
    "id": "lic-039yf",
    "fen": "5rk1/1p2r2p/4P1p1/1p1pRP2/7n/P1P4P/1P6/5RK1 w - - 0 30",
    "moves": [
      "f5f6",
      "f8f6",
      "f1f6"
    ],
    "rating": 1315,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-039zu",
    "fen": "1R6/5k2/1p3N2/3pPp2/1P1P1r2/2P1n3/7P/7K b - - 4 49",
    "moves": [
      "f4f1"
    ],
    "rating": 399,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-03A1C",
    "fen": "4K3/1k2P2q/3Q4/8/8/8/8/8 b - - 4 55",
    "moves": [
      "h7g8",
      "e8d7",
      "g8c8"
    ],
    "rating": 1327,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-03A1J",
    "fen": "7k/1p1r2p1/p2P3p/2P5/P1P5/4B2P/1R4PK/4r3 w - - 3 38",
    "moves": [
      "b2b7",
      "d7b7",
      "c5c6"
    ],
    "rating": 2023,
    "theme": "Decisive Tactic · Endgame",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-03A3b",
    "fen": "8/1R2bk2/1Q2qnp1/pp6/2p2P2/P7/6PP/5RK1 b - - 2 32",
    "moves": [
      "e6b6",
      "b7b6",
      "e7c5",
      "g1h1",
      "c5b6"
    ],
    "rating": 1289,
    "theme": "Attraction · Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Attraction · Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-03A3f",
    "fen": "2kr3r/ppp2p2/2pbN2p/6p1/5q2/2NP3P/PPP1QPP1/R4RK1 b - - 0 15",
    "moves": [
      "f4h2"
    ],
    "rating": 731,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Ruy Lopez.",
    "playerColor": "b"
  },
  {
    "id": "lic-03A4a",
    "fen": "7k/1Q6/p6p/1q6/8/1K6/P1P5/8 w - - 3 37",
    "moves": [
      "b7b5",
      "a6b5",
      "c2c4",
      "b5c4",
      "b3c4"
    ],
    "rating": 1948,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-03A59",
    "fen": "5rk1/1bqr1ppp/pb2p3/1p2n1B1/1P2P1Q1/2P2NN1/6PP/2R2R1K w - - 13 29",
    "moves": [
      "f3e5",
      "c7e5",
      "g5f6",
      "e5f6",
      "f1f6"
    ],
    "rating": 1882,
    "theme": "Decisive Tactic · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Pin).",
    "playerColor": "w"
  },
  {
    "id": "lic-03A7b",
    "fen": "r3r1k1/pp1nqp1p/2p1p1p1/3n4/3Q2N1/1B4P1/PP2NP1P/1R4K1 w - - 2 23",
    "moves": [
      "g4h6",
      "g8f8",
      "d4h8"
    ],
    "rating": 1126,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 2).",
    "playerColor": "w"
  },
  {
    "id": "lic-03A9v",
    "fen": "8/4k3/1p4pp/3P1p2/2p2P1P/2P1K3/8/8 w - - 0 49",
    "moves": [
      "e3d4",
      "e7d7",
      "d4c4"
    ],
    "rating": 956,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — spot the tactical shot (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-03ADK",
    "fen": "8/p2n1pk1/4r1rp/4P3/7Q/3q4/P4RPP/5R1K w - - 1 29",
    "moves": [
      "f2f7",
      "g7h8",
      "h4d8",
      "g6g8",
      "d8d7",
      "d3d7",
      "f7d7"
    ],
    "rating": 1865,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-03AGC",
    "fen": "5rk1/1bq2p2/ppn1NRp1/2p4p/2P4Q/NP2P1P1/P6r/R4K2 w - - 0 21",
    "moves": [
      "e6c7",
      "h2h4",
      "g3h4"
    ],
    "rating": 2201,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-03AHv",
    "fen": "2kr3r/1ppbnp1p/p3q2p/b2pP3/3PN1PN/PB1Q3P/1P3P2/2KR3R b - - 3 19",
    "moves": [
      "d5e4",
      "b3e6",
      "e4d3"
    ],
    "rating": 1851,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-03AIM",
    "fen": "r1b2r1k/2p2p1p/p5pP/q1bpp1B1/8/1R3NQ1/P1P2PP1/6K1 w - - 0 21",
    "moves": [
      "g3e5",
      "f7f6",
      "g5f6"
    ],
    "rating": 1610,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-03ASa",
    "fen": "8/6p1/pp5p/2p5/P1P1K1Pk/1P5P/8/8 b - - 0 49",
    "moves": [
      "a6a5",
      "e4d5",
      "h4h3",
      "d5c6",
      "h3g4",
      "c6b6",
      "h6h5"
    ],
    "rating": 2663,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03AVu",
    "fen": "3rr3/3qn2k/2p4p/1p3p1Q/p7/2BP2KP/P1P5/R4R2 w - - 2 30",
    "moves": [
      "h5f7"
    ],
    "rating": 1045,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1).",
    "playerColor": "w"
  },
  {
    "id": "lic-03AWC",
    "fen": "2r1r1k1/1b3p1p/p2q1Bp1/3P2P1/1p4R1/3p3Q/PPP4P/1K6 w - - 0 24",
    "moves": [
      "h3h7",
      "g8h7",
      "g4h4",
      "h7g8",
      "h4h8"
    ],
    "rating": 1580,
    "theme": "Attraction · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Attraction · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-03AaR",
    "fen": "n5k1/1b4pp/p2p1rq1/2bNp3/2P5/3P2P1/PB3P1P/3Q1RK1 w - - 2 28",
    "moves": [
      "d5e7",
      "g8h8",
      "e7g6"
    ],
    "rating": 827,
    "theme": "Decisive Tactic · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Tactical Fork).",
    "playerColor": "w"
  },
  {
    "id": "lic-03Abe",
    "fen": "1k1r4/1pp2Q2/p7/5P2/1P1nq3/P1b1N1B1/4RKP1/8 b - - 0 35",
    "moves": [
      "d4e2",
      "f7c7",
      "b8a7",
      "c7d8",
      "e2g3"
    ],
    "rating": 1773,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-03Ac8",
    "fen": "1r2r3/1P2Q3/p2p2pk/2pPb3/7P/6p1/1P6/2K2R2 w - - 4 36",
    "moves": [
      "e7g5",
      "h6g7",
      "h4h5"
    ],
    "rating": 1284,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-03Aef",
    "fen": "7r/R4pk1/6p1/3Pp3/2P1Pq2/3B4/2P1K3/6Q1 b - - 2 36",
    "moves": [
      "h8h2",
      "g1h2",
      "f4h2"
    ],
    "rating": 955,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — spot the tactical shot (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03AhR",
    "fen": "8/8/2R5/2k4P/8/5PK1/2p3P1/8 b - - 2 59",
    "moves": [
      "c5c6",
      "h5h6",
      "c2c1q"
    ],
    "rating": 850,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03Anu",
    "fen": "1r3rk1/pPp2pp1/1b3q2/4p1N1/8/6P1/PPQB1P1P/R4BK1 b - - 2 18",
    "moves": [
      "f6f2",
      "g1h1",
      "f2g1"
    ],
    "rating": 1171,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 2) from English Opening.",
    "playerColor": "b"
  },
  {
    "id": "lic-03AoT",
    "fen": "1b3rk1/p5pb/2pqp2p/2p1N3/5P2/BP1PQ3/P1P3PP/5R1K b - - 0 23",
    "moves": [
      "d6e5",
      "e3e5",
      "b8e5"
    ],
    "rating": 1505,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-03Aq2",
    "fen": "r1b2rk1/pppn1p2/3p4/6q1/3P4/2PQP3/PP2N1P1/R3K2R w KQ - 0 18",
    "moves": [
      "d3h7"
    ],
    "rating": 630,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1) from Indian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-03AwE",
    "fen": "6rk/p3R1r1/3p1R2/1p5p/7P/1P6/5b1K/8 w - - 2 37",
    "moves": [
      "f6h6",
      "g7h7",
      "h6h7"
    ],
    "rating": 895,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-03AwK",
    "fen": "rn2kb1r/1bq2ppp/pp3n2/4p3/2PQ1B2/2N3P1/PP2PPBP/3R1RK1 w kq - 0 12",
    "moves": [
      "f4e5",
      "b8c6",
      "e5c7"
    ],
    "rating": 1538,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic) from English Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-03Ax4",
    "fen": "3r2k1/6p1/5p1p/2qPp3/2P5/3Q4/1r3PPP/2R1R1K1 b - - 0 29",
    "moves": [
      "c5f2",
      "g1h1",
      "f2g2"
    ],
    "rating": 1054,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-03Ayb",
    "fen": "r5kr/pp5p/2p1b1p1/q1b1B2Q/8/2n3P1/PPP3KP/R4R2 w - - 2 19",
    "moves": [
      "h5h6",
      "a5c7",
      "e5c7"
    ],
    "rating": 1937,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge) from Caro-Kann Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-03B3o",
    "fen": "2k4r/1p3qp1/p1p2pp1/B3b3/8/3Q3P/P1P2PP1/3R2K1 w - - 1 23",
    "moves": [
      "d3d8",
      "h8d8",
      "d1d8"
    ],
    "rating": 872,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-03B7b",
    "fen": "7k/6p1/1p5b/p4B1Q/1P3q1p/7P/5PP1/7K w - - 0 39",
    "moves": [
      "h5e8"
    ],
    "rating": 714,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-03BA9",
    "fen": "r4rk1/ppqbppbp/3p2p1/3n4/2PQ4/1P4P1/PB2PPBP/R4RK1 w - - 0 13",
    "moves": [
      "d4g7"
    ],
    "rating": 855,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1) from Kings Indian Attack.",
    "playerColor": "w"
  },
  {
    "id": "lic-03BAr",
    "fen": "2r3k1/1p3p1p/p3p1pP/3pP1q1/1P1P4/5N2/2R2PP1/6K1 w - - 0 40",
    "moves": [
      "c2c8",
      "g5d8",
      "c8d8"
    ],
    "rating": 1300,
    "theme": "Endgame · Hanging Piece",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Hanging Piece).",
    "playerColor": "w"
  },
  {
    "id": "lic-03BET",
    "fen": "5b1k/1pq4p/p4rp1/5n2/P7/BBQ2P1P/1PP2P2/3R2K1 b - - 2 27",
    "moves": [
      "c7c3",
      "b2c3",
      "f8a3"
    ],
    "rating": 1327,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-03BFA",
    "fen": "8/R7/3r4/4p1p1/4Pp1k/5P2/5K2/8 w - - 0 47",
    "moves": [
      "a7h7",
      "d6h6",
      "h7h6"
    ],
    "rating": 400,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-03BG1",
    "fen": "8/1R5p/p5pk/1pp5/5PP1/1P5K/r6P/6b1 w - - 1 42",
    "moves": [
      "g4g5",
      "h6h5",
      "b7h7"
    ],
    "rating": 923,
    "theme": "Deflection · Endgame",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Deflection · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-03BHm",
    "fen": "r2q1rk1/pp3ppp/2p1b3/2R5/2P5/3P1Q1P/P1P2PP1/R1B3K1 b - - 2 15",
    "moves": [
      "d8d4",
      "a1b1",
      "d4c5"
    ],
    "rating": 1526,
    "theme": "Winning Edge · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Tactical Fork) from Italian Game.",
    "playerColor": "b"
  },
  {
    "id": "lic-03BKg",
    "fen": "1rbq1k1r/p1p1n1pp/3bPpn1/3N4/3P4/2P2Q2/PP3PPP/R1B1R1K1 w - - 3 19",
    "moves": [
      "f3f6",
      "g7f6",
      "c1h6",
      "f8g8",
      "d5f6"
    ],
    "rating": 2398,
    "theme": "Checkmate · Mate in 3",
    "category": "Mate & Back Rank",
    "description": "White to move — uncover the master-level combination (Checkmate · Mate in 3) from Four Knights Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-03BLZ",
    "fen": "6k1/p4p1p/6p1/8/4qP2/6PQ/Pr5P/R5K1 w - - 0 27",
    "moves": [
      "h3c8",
      "g8g7",
      "c8c3",
      "g7h6",
      "c3b2"
    ],
    "rating": 1034,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-03BLg",
    "fen": "2r2r2/1q1Q1ppk/p3p1np/1p6/1P6/P3PN1P/5PP1/2RR2K1 b - - 2 24",
    "moves": [
      "b7d7",
      "d1d7",
      "c8c1"
    ],
    "rating": 1442,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-03BNm",
    "fen": "1r5k/p1p4p/2p3r1/3pR1n1/5p2/1NP2P2/PP4PP/R1B3K1 b - - 0 25",
    "moves": [
      "g5f3",
      "g1h1",
      "f3e5"
    ],
    "rating": 1016,
    "theme": "Winning Edge · Pin",
    "category": "Pins & Skewers",
    "description": "Black to move — find the winning continuation (Winning Edge · Pin).",
    "playerColor": "b"
  },
  {
    "id": "lic-03BPz",
    "fen": "8/2Q1qkpp/p7/1p1P4/1P6/7P/6PK/8 w - - 5 36",
    "moves": [
      "d5d6",
      "e7c7",
      "d6c7"
    ],
    "rating": 1275,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-03BQX",
    "fen": "5Rr1/1pkb4/3p1Q2/4p2p/2PqP2P/3Pn1r1/2B5/2R4K w - - 0 43",
    "moves": [
      "f6d8",
      "c7c6",
      "c2a4",
      "c6c5",
      "d8a5",
      "b7b5",
      "c4b5"
    ],
    "rating": 2084,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-03BSR",
    "fen": "6rk/5prn/p1p2q2/1p2p2Q/6P1/3B1P1R/PPP4P/6K1 w - - 0 28",
    "moves": [
      "h5h7",
      "g7h7",
      "h3h7"
    ],
    "rating": 903,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 2).",
    "playerColor": "w"
  },
  {
    "id": "lic-03BVD",
    "fen": "2r3k1/4q2p/p3bpp1/1p2R3/7Q/N1P5/PP1r1PPP/4R1K1 b - - 2 25",
    "moves": [
      "g6g5",
      "h4g3",
      "f6e5"
    ],
    "rating": 1826,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-03BWQ",
    "fen": "3r2k1/R5p1/2Q2p1p/6q1/8/7P/P4PP1/6K1 b - - 0 33",
    "moves": [
      "d8d1",
      "g1h2",
      "g5f4",
      "g2g3",
      "f4f2"
    ],
    "rating": 1210,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03BWU",
    "fen": "r3r1k1/p4p2/6pp/2pp4/Pp3qPP/1N1RnP2/1PP1Q3/1K2R3 w - - 0 25",
    "moves": [
      "d3e3",
      "e8e3",
      "e2e3",
      "f4e3",
      "e1e3"
    ],
    "rating": 1147,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-03BcC",
    "fen": "8/3BR3/kpq2p2/2p5/p1Pp1P2/3N2Pp/PP5P/6K1 b - - 0 33",
    "moves": [
      "c6g2"
    ],
    "rating": 906,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-03BcT",
    "fen": "6k1/2R5/1p2r2p/p4p2/3R1p2/P4KP1/1P5r/8 w - - 0 39",
    "moves": [
      "d4d8",
      "e6e8",
      "d8e8"
    ],
    "rating": 958,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-03Bce",
    "fen": "8/8/8/1p1k4/1P3Kp1/p5Pp/P6P/8 b - - 6 48",
    "moves": [
      "d5c4",
      "f4g4",
      "c4b4"
    ],
    "rating": 822,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03Bfa",
    "fen": "4q1k1/6r1/5Q1R/p2p2r1/8/2P5/PP3RPP/7K b - - 4 30",
    "moves": [
      "g5g2",
      "h6h8",
      "g8h8",
      "f6h4",
      "g7h7"
    ],
    "rating": 2337,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03BlZ",
    "fen": "3r1r2/2p2pk1/p1p4p/8/3b4/2NR3P/PP3PP1/R5K1 b - - 1 20",
    "moves": [
      "d4f2",
      "g1f2",
      "d8d3"
    ],
    "rating": 724,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — spot the tactical shot (Winning Edge · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-03Bol",
    "fen": "3q1rk1/p3ppbp/6p1/8/P4n2/Q3PN2/RPrB1PPP/4KB1R b K - 5 20",
    "moves": [
      "d8d2",
      "f3d2",
      "c2c1"
    ],
    "rating": 2148,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Checkmate · Mate in 2).",
    "playerColor": "b"
  },
  {
    "id": "lic-03BpL",
    "fen": "3k4/1K1P4/4n2p/6p1/B4pP1/5P2/7P/8 b - - 4 57",
    "moves": [
      "e6c5",
      "b7c6",
      "c5a4"
    ],
    "rating": 763,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03BrC",
    "fen": "5rk1/5ppp/2N5/2qp4/Q3b3/8/P3B1PP/4R2K b - - 0 23",
    "moves": [
      "c5f2",
      "e1g1",
      "f2e2"
    ],
    "rating": 1622,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-03Bsd",
    "fen": "Qbk4r/1pq2p1n/2p4p/6p1/8/7P/PPP1RPP1/3R2K1 b - - 5 25",
    "moves": [
      "c7h2",
      "g1f1",
      "h2h1"
    ],
    "rating": 599,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 2).",
    "playerColor": "b"
  },
  {
    "id": "lic-03Bwi",
    "fen": "2k4r/p1p3b1/Pp1p4/1P1P1b1p/4rBp1/3B2P1/5P1P/2R2RK1 b - - 2 23",
    "moves": [
      "e4f4",
      "g3f4",
      "f5d3"
    ],
    "rating": 1222,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-03ByH",
    "fen": "r3k1r1/p6p/2p2p1n/3qp3/Q2p4/N2P1P2/PP3P1P/2R2R1K b q - 3 16",
    "moves": [
      "d5f3"
    ],
    "rating": 609,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Caro-Kann Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-03Byg",
    "fen": "r1b3k1/pp3ppp/8/2q5/2B5/2b4P/P2N1PP1/4QRK1 w - - 0 21",
    "moves": [
      "e1e8",
      "c5f8",
      "c4f7",
      "g8h8",
      "e8f8"
    ],
    "rating": 1136,
    "theme": "Deflection · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Deflection · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-03BzL",
    "fen": "2r2rk1/1pq2ppp/p4n2/5b2/1P2N3/PQ2P3/4BPPP/2RR2K1 b - - 0 19",
    "moves": [
      "c7c1",
      "e4f6",
      "g7f6",
      "d1c1",
      "c8c1"
    ],
    "rating": 1315,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-03Bzk",
    "fen": "3r1bk1/1b1p1p1p/p1q1pPp1/1pB5/7Q/1BN5/PPP2PPP/R4RK1 b - - 0 19",
    "moves": [
      "c6g2"
    ],
    "rating": 451,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Sicilian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-03C3C",
    "fen": "4r1k1/5pp1/p1q1bb1p/3R4/P7/1P3Q2/2P1R1P1/7K w - - 1 31",
    "moves": [
      "d5d8",
      "c6a4",
      "b3a4"
    ],
    "rating": 1915,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-03C3g",
    "fen": "1kr4r/pp4pp/3b1p2/1N6/P2Pqp2/2Q2N1P/5PP1/2R3K1 w - - 4 25",
    "moves": [
      "c3c8",
      "h8c8",
      "c1c8",
      "b8c8",
      "b5d6",
      "c8d7",
      "d6e4"
    ],
    "rating": 1551,
    "theme": "Winning Edge · Attraction",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Attraction).",
    "playerColor": "w"
  },
  {
    "id": "lic-03C5N",
    "fen": "2r3k1/1p4pp/p3b3/4p3/1P6/3K2P1/3QB2P/q2R3R b - - 4 25",
    "moves": [
      "a1d4"
    ],
    "rating": 1680,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Checkmate · Mate in 1).",
    "playerColor": "b"
  },
  {
    "id": "lic-03C7W",
    "fen": "6k1/5pp1/5b1p/2R5/P7/2p1KP1P/3r4/1R6 b - - 3 31",
    "moves": [
      "f6d4",
      "e3e4",
      "d4c5"
    ],
    "rating": 1652,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03CBj",
    "fen": "5rk1/p4ppp/1p6/4p3/3PQP2/2PKP2q/r7/2R1R3 w - - 0 33",
    "moves": [
      "e1h1",
      "a2h2",
      "h1h2",
      "h3h2",
      "c1h1",
      "h2h1",
      "e4h1"
    ],
    "rating": 1234,
    "theme": "Decisive Tactic · Endgame",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-03CC9",
    "fen": "1rb2r1k/4bpp1/p1p1p2p/4q1Nn/2p4P/P1N1B1P1/1PQ2P2/2KR3R w - - 0 18",
    "moves": [
      "c2h7"
    ],
    "rating": 1358,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1) from Horwitz Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-03CE0",
    "fen": "6k1/3q2pp/4p3/3p2Q1/8/2B4P/p4PP1/1r3RK1 b - - 2 38",
    "moves": [
      "d5d4",
      "c3a1",
      "d4d3"
    ],
    "rating": 2465,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03CF0",
    "fen": "r2qr1k1/p1p1bpBp/2pp1n2/8/4P1bP/6Q1/PPP2PP1/RN2K2R w KQ - 2 13",
    "moves": [
      "g7f6",
      "e7f6",
      "g3g4"
    ],
    "rating": 1277,
    "theme": "Pin",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Pin).",
    "playerColor": "w"
  },
  {
    "id": "lic-03CGT",
    "fen": "r5k1/5p2/7p/4Q3/3P1Ppq/4P2P/1R4PK/8 b - - 3 43",
    "moves": [
      "g4g3",
      "h2g1",
      "a8a1",
      "b2b1",
      "a1b1"
    ],
    "rating": 1194,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-03CIU",
    "fen": "8/6pp/1Q2p1k1/2p5/P3K3/1P2P2P/5qP1/4N3 b - - 0 35",
    "moves": [
      "f2f5"
    ],
    "rating": 1088,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-03CKR",
    "fen": "8/R5pk/5r2/5P1p/5KP1/8/8/8 w - - 0 82",
    "moves": [
      "g4g5",
      "f6f8",
      "f5f6",
      "f8g8",
      "f4f5"
    ],
    "rating": 2087,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-03CLV",
    "fen": "8/7k/p1p3pp/B1PpP1p1/P2Pn1P1/4P2P/8/2q2QK1 b - - 4 30",
    "moves": [
      "c1e3",
      "g1h2",
      "e3g3",
      "h2h1",
      "e4f2",
      "f1f2",
      "g3f2"
    ],
    "rating": 1241,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03COV",
    "fen": "r4rk1/p2b1pp1/3bp2p/3pq3/2pN4/P1P1B1P1/1P1Q1P1P/R4RK1 w - - 0 21",
    "moves": [
      "e3f4",
      "e5f6",
      "f4d6"
    ],
    "rating": 1585,
    "theme": "Winning Edge · Skewer",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Winning Edge · Skewer).",
    "playerColor": "w"
  },
  {
    "id": "lic-03CVu",
    "fen": "2kr1b1r/1p2npp1/p5b1/2qp2N1/2p2PP1/P1NP4/BP3Q2/R1BR2K1 b - - 3 19",
    "moves": [
      "h8h1",
      "g1h1",
      "c5f2"
    ],
    "rating": 1309,
    "theme": "Decisive Tactic · Deflection",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Deflection).",
    "playerColor": "b"
  },
  {
    "id": "lic-03CZE",
    "fen": "r1bq1r1k/2p1b2p/p1np2p1/1p4P1/n3Pp2/P1PP1Q2/BP3P2/RNB1K2R w KQ - 0 16",
    "moves": [
      "h1h7",
      "h8h7",
      "f3h1",
      "c8h3",
      "h1h3",
      "h7g7",
      "h3h6"
    ],
    "rating": 1799,
    "theme": "Attraction · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Attraction · Checkmate) from Bishops Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-03Caw",
    "fen": "3r2k1/pp4pp/8/1PP2p2/5P2/8/P2rp1PP/R3R1K1 b - - 1 26",
    "moves": [
      "d2d1",
      "g1f2",
      "d1a1"
    ],
    "rating": 1570,
    "theme": "Decisive Tactic · Endgame",
    "category": "Pins & Skewers",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-03CcB",
    "fen": "2r5/1p1bn1k1/p2qp3/4Nrp1/3P2QP/2P5/PP3P1K/4R1R1 w - - 1 26",
    "moves": [
      "g4h5",
      "d7e8",
      "g1g5",
      "f5g5",
      "h5g5"
    ],
    "rating": 2278,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Winning Edge · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-03Cdz",
    "fen": "r1b1rnk1/p2n1p1p/1p2p1pP/3pP3/3Q1P2/2N3q1/PPPKB1P1/R6R w - - 0 19",
    "moves": [
      "e2f3",
      "c8a6",
      "h1h3",
      "g3h3",
      "g2h3"
    ],
    "rating": 2393,
    "theme": "Winning Edge · Trapped Piece",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Winning Edge · Trapped Piece) from French Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-07VjG",
    "fen": "7R/3kp3/3pnp2/5Q2/3q4/6PK/p7/8 w - - 2 56",
    "moves": [
      "f5b5",
      "d7c7",
      "b5b8",
      "c7c6",
      "b8a8",
      "c6b5",
      "h8b8"
    ],
    "rating": 2369,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Vjl",
    "fen": "8/1p4p1/p2p2k1/3Pq1Pp/2P1p2P/1P5Q/P5K1/8 w - - 3 35",
    "moves": [
      "h3e6",
      "e5e6",
      "d5e6",
      "g6f5",
      "e6e7"
    ],
    "rating": 878,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07VlN",
    "fen": "r5rk/1bp3pp/pbq2N2/np2p1N1/8/1BPP3P/PP3PP1/R1B1R1K1 w - - 0 19",
    "moves": [
      "g5f7"
    ],
    "rating": 921,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1) from Ruy Lopez.",
    "playerColor": "w"
  },
  {
    "id": "lic-07VmT",
    "fen": "4k3/pR6/2p4p/4n3/4P1b1/2N3P1/PP3b1P/7K b - - 0 29",
    "moves": [
      "g4f3"
    ],
    "rating": 901,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-07Vrw",
    "fen": "7k/p6p/3b2p1/1p6/4P3/1B1r4/P2q2NP/5Q1K w - - 6 36",
    "moves": [
      "f1f6"
    ],
    "rating": 1455,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Vwb",
    "fen": "2b2k2/1p1p1ppp/8/1p1QP3/8/5K2/r4PPP/q4B1R w - - 0 20",
    "moves": [
      "d5c5",
      "f8e8",
      "c5c8",
      "e8e7",
      "c8c5"
    ],
    "rating": 2244,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Vya",
    "fen": "2b5/p1p2p1p/8/6p1/2P5/1P1N2Pk/P6P/6K1 w - - 0 37",
    "moves": [
      "d3f2"
    ],
    "rating": 1002,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-07W2W",
    "fen": "3r1k2/2p2rq1/p5pQ/2pp4/4pB2/P1P1P3/2PK1P2/7R w - - 2 31",
    "moves": [
      "h6h8",
      "g7h8",
      "h1h8",
      "f8e7",
      "f4g5"
    ],
    "rating": 1726,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07W2i",
    "fen": "q4rk1/1b3ppp/1b6/1Q2B3/P7/1P4P1/4PP1P/2R2RK1 b - - 2 24",
    "moves": [
      "b7h1",
      "c1c6",
      "a8c6",
      "b5c6",
      "h1c6"
    ],
    "rating": 2061,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "b"
  },
  {
    "id": "lic-07W3Y",
    "fen": "6k1/pp3pp1/1q2p2p/3rP3/1n6/8/PPQ2bPP/3R1R1K w - - 2 25",
    "moves": [
      "c2c8",
      "g8h7",
      "d1d5",
      "b4d5",
      "c8c2"
    ],
    "rating": 1668,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-07W5q",
    "fen": "8/5kp1/8/R3P1PK/1r5P/8/p7/8 b - - 3 47",
    "moves": [
      "g7g6",
      "h5h6",
      "b4h4"
    ],
    "rating": 927,
    "theme": "Deflection · Endgame",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Deflection · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07W7D",
    "fen": "8/p2kr3/2Rp2p1/1P1P1p2/5Q2/q5B1/P4PPP/6K1 b - - 2 38",
    "moves": [
      "e7e1"
    ],
    "rating": 912,
    "theme": "Back Rank Mate · Endgame",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Back Rank Mate · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07W9q",
    "fen": "3q4/6k1/5p2/4p1p1/4P3/1Q2nPP1/6BK/8 b - - 4 46",
    "moves": [
      "d8d2",
      "b3e3",
      "d2e3"
    ],
    "rating": 1809,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07WFH",
    "fen": "2R5/5kpp/p5r1/1p1P4/4p3/B1P2n2/P4P1P/5K2 w - - 3 34",
    "moves": [
      "c8f8"
    ],
    "rating": 1315,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-07WGq",
    "fen": "r2k3r/ppp3p1/3b1p2/3q1NP1/3pR3/3n4/PP3PQ1/R1B3K1 w - - 0 26",
    "moves": [
      "e4e8",
      "h8e8",
      "g2d5"
    ],
    "rating": 1257,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-07WLr",
    "fen": "7r/2Q1kppp/8/2b2b2/4p3/2P1qPB1/Pr2N1PP/3RK2R b K - 0 23",
    "moves": [
      "e7f6",
      "d1d6",
      "c5d6",
      "c7d6",
      "f5e6",
      "d6d4",
      "e3d4"
    ],
    "rating": 2054,
    "theme": "Decisive Tactic",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-07WNx",
    "fen": "rnbq1bkr/pp5p/3pP1pB/2pP2Pn/2B5/2P2Q2/PP3P1P/RN2K2R w KQ - 1 16",
    "moves": [
      "f3f7"
    ],
    "rating": 1010,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1) from Petrovs Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-07WRH",
    "fen": "4rrk1/p5pp/1p1qpn2/2bp2N1/5R2/P5NP/1PQ2PP1/4R1K1 w - - 5 25",
    "moves": [
      "f4f6",
      "f8f6",
      "c2h7"
    ],
    "rating": 1563,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-07WRS",
    "fen": "r4r1k/pb3p1p/1p1pp3/2p2pq1/2PbP3/3PB1PP/PP1Q2B1/R4RK1 w - - 2 21",
    "moves": [
      "e3d4",
      "c5d4",
      "d2g5"
    ],
    "rating": 1652,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-07WSb",
    "fen": "6K1/7p/5k2/7P/8/8/8/8 b - - 2 63",
    "moves": [
      "h7h6",
      "g8f8",
      "f6g5",
      "f8e7",
      "g5h5"
    ],
    "rating": 1153,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07WU6",
    "fen": "4k3/5p2/p2Qb1r1/1p1qPp2/3p1P1p/7P/3PN2K/2R5 w - - 8 42",
    "moves": [
      "c1c8",
      "e6c8",
      "d6d5"
    ],
    "rating": 1534,
    "theme": "Decisive Tactic · Deflection",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Decisive Tactic · Deflection).",
    "playerColor": "w"
  },
  {
    "id": "lic-07WYg",
    "fen": "4r1k1/2q4p/p4Rp1/1pp5/8/2P4P/PPQ3P1/7K b - - 0 26",
    "moves": [
      "e8e1",
      "f6f1",
      "e1f1"
    ],
    "rating": 778,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-07Wce",
    "fen": "r2qr3/1p1b1pk1/p2p2pp/3n1P2/3N4/1PQ5/1P4PP/R3R1K1 w - - 0 28",
    "moves": [
      "d4e6",
      "g7g8",
      "c3g7"
    ],
    "rating": 1607,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Checkmate · Mate in 2).",
    "playerColor": "w"
  },
  {
    "id": "lic-07We9",
    "fen": "r2q2k1/pp1n2pp/2pb1pb1/3p1n2/3P2P1/2NB1N1P/PPPQ1P2/R1B1r1K1 w - - 0 16",
    "moves": [
      "d2e1",
      "f5d4",
      "f3d4"
    ],
    "rating": 1568,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge) from French Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-07WfH",
    "fen": "4r3/8/p6R/1p5n/2p1N2k/2P5/PP6/1K6 w - - 2 40",
    "moves": [
      "h6h5",
      "h4h5",
      "e4f6",
      "h5h4",
      "f6e8"
    ],
    "rating": 1389,
    "theme": "Attraction · Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Attraction · Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-07WfL",
    "fen": "1q3k2/8/3pRP2/p1pP1Ppp/1rP5/4Q3/7P/6K1 w - - 0 40",
    "moves": [
      "e3g5",
      "b4b1",
      "g1g2",
      "b8b2",
      "g2h3"
    ],
    "rating": 2444,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Wgq",
    "fen": "r1bq1rk1/p1p1bppp/1p3n2/3pP1B1/3Q1P2/2N5/PPP1B1PP/R4RK1 b - - 0 11",
    "moves": [
      "e7c5",
      "d4c5",
      "b6c5"
    ],
    "rating": 1033,
    "theme": "Winning Edge · Pin",
    "category": "Pins & Skewers",
    "description": "Black to move — find the winning continuation (Winning Edge · Pin) from Van Geet Opening.",
    "playerColor": "b"
  },
  {
    "id": "lic-07WiO",
    "fen": "r1b2rk1/ppp3pp/2np1b2/3Np3/2P1q3/4PN1P/PPK1B1P1/3R1Q1R w - - 0 16",
    "moves": [
      "e2d3",
      "c6b4",
      "d5b4"
    ],
    "rating": 1345,
    "theme": "Winning Edge",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Winning Edge) from English Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-07WlR",
    "fen": "8/8/3N2pp/8/6b1/k3K1P1/5P2/8 w - - 0 52",
    "moves": [
      "d6f7",
      "g4d1",
      "f7h6"
    ],
    "rating": 2473,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Wme",
    "fen": "4k3/8/3Pr3/1bP5/1P3K2/8/4p3/4Q3 b - - 4 73",
    "moves": [
      "e6f6",
      "f4e3",
      "f6f1",
      "e1e2",
      "b5e2"
    ],
    "rating": 1228,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07Wq3",
    "fen": "5r2/4b1pk/2n1p1q1/1ppnp2p/7P/2PPNNP1/1P2QPK1/2BR1R2 b - - 0 35",
    "moves": [
      "d5f4",
      "g2h1",
      "f4e2"
    ],
    "rating": 1776,
    "theme": "Decisive Tactic · Pin",
    "category": "Pins & Skewers",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Pin).",
    "playerColor": "b"
  },
  {
    "id": "lic-07WtO",
    "fen": "rn1q1rk1/3nb1pp/b1p1p3/6PP/3P1B2/1Qp2N2/PP3PB1/R3K2R w KQ - 0 17",
    "moves": [
      "b3e6",
      "g8h8",
      "f3h4",
      "a6d3",
      "h4g6",
      "d3g6",
      "h5g6"
    ],
    "rating": 2605,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Winning Edge) from Grob Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-07WtY",
    "fen": "6k1/6pp/p7/1pb5/3p4/P1p4P/1PP2PPK/RB2r3 w - - 0 25",
    "moves": [
      "b1a2",
      "g8f8",
      "a1e1"
    ],
    "rating": 1393,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Wua",
    "fen": "4r3/4bp2/2k5/2pbRQp1/7p/7P/r1P2PPB/6K1 b - - 3 28",
    "moves": [
      "a2a1",
      "e5e1",
      "a1e1"
    ],
    "rating": 584,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 2).",
    "playerColor": "b"
  },
  {
    "id": "lic-07Wub",
    "fen": "4n2k/p1p3pp/2p5/2B5/8/5P1b/PqP4P/RN2R1K1 w - - 0 18",
    "moves": [
      "e1e8"
    ],
    "rating": 399,
    "theme": "Back Rank Mate · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Back Rank Mate · Checkmate) from Kings Pawn Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-07WyD",
    "fen": "2kr3r/pp3pp1/4pn2/3pq3/6p1/3BP1P1/PP1N1PK1/R2Q1R2 b - - 2 16",
    "moves": [
      "h8h2",
      "g2h2",
      "e5h5",
      "h2g1",
      "d8h8"
    ],
    "rating": 2017,
    "theme": "Winning Edge · Attraction",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Attraction) from Benoni Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-07X3h",
    "fen": "rn2k2r/1b1p1pbp/pp2p3/1N1n4/4q3/1Q6/PP2NPPP/R3KB1R w KQkq - 0 13",
    "moves": [
      "b5d6",
      "e8d8",
      "d6e4"
    ],
    "rating": 1273,
    "theme": "Decisive Tactic · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic · Tactical Fork) from Indian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-07X4I",
    "fen": "6k1/2p2r2/1p5p/6p1/1P3R2/2P3NP/3n1PP1/5RK1 b - - 0 36",
    "moves": [
      "g5f4",
      "f1d1",
      "f7d7",
      "g3e4",
      "d2f3",
      "g1f1",
      "d7d1"
    ],
    "rating": 2244,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — uncover the master-level combination (Winning Edge · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-07X9J",
    "fen": "r1b2r2/ppp1k1p1/1b1p1nqp/4p3/4P3/1BPPB2P/PP3PPK/RN1Q1R2 b - - 4 14",
    "moves": [
      "f6g4",
      "h3g4",
      "c8g4",
      "e3b6",
      "g4d1"
    ],
    "rating": 2105,
    "theme": "Decisive Tactic · Sacrifice",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Sacrifice) from Italian Game.",
    "playerColor": "b"
  },
  {
    "id": "lic-07XFF",
    "fen": "r1b2rk1/3p1ppp/2p1pq2/p3b3/P7/1P1B2P1/2PB1P1P/1R1QR1K1 w - - 1 19",
    "moves": [
      "d1h5",
      "g7g6",
      "h5e5",
      "f6e5",
      "e1e5"
    ],
    "rating": 1842,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic) from Sicilian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-07XJW",
    "fen": "rnb2rk1/ppp3pp/3p4/2NPpq2/2P3p1/4P1PP/PP1B1P2/R2QK1NR b KQ - 0 12",
    "moves": [
      "f5f2"
    ],
    "rating": 591,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Indian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-07XKT",
    "fen": "7k/4q3/5p2/Q2b3p/8/4P1P1/PP3P1P/6K1 b - - 0 32",
    "moves": [
      "e7e4",
      "a5d5",
      "e4d5"
    ],
    "rating": 1195,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07XNT",
    "fen": "7k/pp4pp/2p1r3/5b2/5K2/8/PPPR2PP/8 w - - 7 28",
    "moves": [
      "d2d8",
      "e6e8",
      "d8e8"
    ],
    "rating": 399,
    "theme": "Back Rank Mate · Endgame",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Back Rank Mate · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07XXn",
    "fen": "8/2p4p/2p1Q1pk/p7/3PN3/1KP1n1P1/PP6/6q1 b - - 0 27",
    "moves": [
      "g1d1",
      "b3a3",
      "e3c2",
      "a3a4",
      "c2d4"
    ],
    "rating": 1600,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-07XZ1",
    "fen": "4r1k1/5pp1/2p1b2p/2B5/2PR4/6PP/5r2/2KR4 w - - 0 30",
    "moves": [
      "d4d8",
      "e8d8",
      "d1d8",
      "g8h7",
      "c5f2"
    ],
    "rating": 927,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — spot the tactical shot (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07XjF",
    "fen": "7k/6p1/p1qP2rp/8/8/Q4P1P/6P1/3R2K1 b - - 0 39",
    "moves": [
      "c6c2",
      "g2g4",
      "c2d1"
    ],
    "rating": 1904,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07XlL",
    "fen": "2kr3r/pppb2pp/3b4/4q3/1P1n4/P2P1NP1/1B3PBP/R2Q1RK1 b - - 0 17",
    "moves": [
      "d4e2",
      "g1h1",
      "e5b2"
    ],
    "rating": 2142,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Discovered Attack) from English Opening.",
    "playerColor": "b"
  },
  {
    "id": "lic-07XmZ",
    "fen": "r2k3r/2p5/n1P4q/4Q3/1P2Pp2/1RN3p1/6p1/5RK1 w - - 1 32",
    "moves": [
      "f1d1",
      "d8c8",
      "e5f5"
    ],
    "rating": 1642,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Xov",
    "fen": "r5rk/pp3p1p/2p1p3/4np2/8/2PQ4/Pq2NPPP/RR4K1 w - - 0 19",
    "moves": [
      "d3e3",
      "e5g4",
      "b1b2",
      "g4e3",
      "f2e3"
    ],
    "rating": 2348,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Winning Edge) from Caro-Kann Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-07Xys",
    "fen": "3r2k1/5rpq/p1n5/1p1pR3/3PnN2/P2QP3/1P4RN/7K w - - 9 34",
    "moves": [
      "e5h5",
      "e4f2",
      "g2f2",
      "h7d3",
      "f4d3",
      "f7f2",
      "d3f2"
    ],
    "rating": 1819,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Y0h",
    "fen": "8/5kpp/3p1p2/1b6/2NP4/1P5P/r3RKP1/8 b - - 1 29",
    "moves": [
      "a2e2",
      "f2e2",
      "d6d5"
    ],
    "rating": 1702,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07Y9I",
    "fen": "8/5rpk/p1QR4/1p2pq2/6p1/P1P2P2/1P4PP/7K b - - 0 32",
    "moves": [
      "f5b1",
      "d6d1",
      "b1d1"
    ],
    "rating": 748,
    "theme": "Back Rank Mate · Endgame",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Back Rank Mate · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07Y9e",
    "fen": "8/p3kp1p/1N4r1/3R4/5p2/4p3/PPP2PPP/6K1 b - - 0 26",
    "moves": [
      "e3e2",
      "d5e5",
      "g6e6",
      "e5e2",
      "e6e2"
    ],
    "rating": 1659,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07YCl",
    "fen": "5rk1/p1R3p1/1p3r1p/3q4/3P4/P1PQ3P/1P2R1P1/6K1 b - - 0 32",
    "moves": [
      "f6f1",
      "g1h2",
      "d5d6",
      "e2e5",
      "d6c7"
    ],
    "rating": 1180,
    "theme": "Winning Edge · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07YD6",
    "fen": "r4rk1/5qn1/p1p3RQ/1p2pp2/4P3/1P1P3P/1PP3P1/R5K1 w - - 2 23",
    "moves": [
      "e4f5",
      "f7a7",
      "g1h2"
    ],
    "rating": 2474,
    "theme": "Winning Edge · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Winning Edge · Pin).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YD9",
    "fen": "r5k1/1p3p1p/3Np1p1/P1n1P3/1r3P2/6PP/1P1R4/R5K1 b - - 2 27",
    "moves": [
      "c5b3",
      "d2d1",
      "b3a1"
    ],
    "rating": 1490,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07YE8",
    "fen": "3r2r1/ppq3k1/6b1/2p1p1R1/2PbP2Q/1P6/P4P1P/3R3K w - - 1 40",
    "moves": [
      "g5g6",
      "g7g6",
      "d1g1",
      "g6f7",
      "h4h7",
      "f7e6",
      "h7c7"
    ],
    "rating": 1747,
    "theme": "Winning Edge · Attraction",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Attraction).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YFf",
    "fen": "5rk1/2pb1ppp/2q1pn2/8/2p1N3/4b1PP/1PQ2PB1/R5K1 w - - 0 23",
    "moves": [
      "e4f6",
      "g7f6",
      "g2c6"
    ],
    "rating": 1153,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YGJ",
    "fen": "3r1rk1/bpq2ppp/p1p1b3/2P3N1/1P1n4/P1N3P1/2Q2PBP/R4RK1 w - - 5 19",
    "moves": [
      "c2h7"
    ],
    "rating": 583,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — spot the tactical shot (Checkmate · Mate in 1) from English Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-07YH3",
    "fen": "7k/p4p1p/4rp2/4q3/3Q4/1P6/P4PPP/3R1K2 b - - 6 28",
    "moves": [
      "e5e2",
      "f1g1",
      "e2e1",
      "d1e1",
      "e6e1"
    ],
    "rating": 1186,
    "theme": "Back Rank Mate · Endgame",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Back Rank Mate · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07YH5",
    "fen": "2r3k1/5pp1/p1Pp3p/1p2pN2/1Pn1P3/P7/5PP1/2R3K1 w - - 5 35",
    "moves": [
      "f5e7",
      "g8f8",
      "e7c8"
    ],
    "rating": 929,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YI2",
    "fen": "4r3/2R5/1p1prnk1/5Np1/p5P1/P6P/1P3P1K/8 w - - 4 49",
    "moves": [
      "c7g7"
    ],
    "rating": 1158,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YSy",
    "fen": "8/1K3p1p/3P1kp1/4b3/8/2pB4/6PP/8 w - - 0 44",
    "moves": [
      "d6d7",
      "f6e7",
      "b7c8"
    ],
    "rating": 1142,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YUL",
    "fen": "r4rk1/pbq2pp1/1ppbpn1p/8/2P2B2/P1NB4/1P1Q1PPP/4RRK1 w - - 4 17",
    "moves": [
      "f4d6",
      "c7d6",
      "d3h7",
      "g8h7",
      "d2d6"
    ],
    "rating": 1387,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic · Discovered Attack) from Slav Indian.",
    "playerColor": "w"
  },
  {
    "id": "lic-07YWL",
    "fen": "r1b2rk1/1p2npp1/p1q1p2p/4P2N/1bPPN3/3B4/5KPP/2Q4R w - - 2 23",
    "moves": [
      "e4f6",
      "g8h8",
      "h5g7"
    ],
    "rating": 1916,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YXw",
    "fen": "3rr1k1/ppq3pb/2p1pp2/4n1P1/5Q2/2P3NP/PP4B1/R3R1K1 w - - 0 25",
    "moves": [
      "g5f6",
      "g7f6",
      "g3h5",
      "e8f8",
      "h5f6"
    ],
    "rating": 2469,
    "theme": "Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YZh",
    "fen": "rn1q4/pp5p/5kp1/4pp2/2B1p3/1PP1P1Q1/5PPP/2b1K2R w K - 3 25",
    "moves": [
      "g3h4",
      "f6g7",
      "h4d8"
    ],
    "rating": 1012,
    "theme": "Decisive Tactic · Skewer",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Decisive Tactic · Skewer).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YZu",
    "fen": "8/4ppk1/3p2p1/3Pb3/5q2/5P1p/6PP/5RQK b - - 1 40",
    "moves": [
      "e5d4",
      "g1d4",
      "f4d4"
    ],
    "rating": 1717,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07Yag",
    "fen": "1k6/1p5q/p1Q5/4p2r/P1P5/3P2Pr/5P2/1R2RK2 b - - 2 34",
    "moves": [
      "h3h1",
      "f1e2",
      "h1e1",
      "e2e1",
      "h5h1",
      "e1d2",
      "h1b1"
    ],
    "rating": 2152,
    "theme": "Attraction · Decisive Tactic",
    "category": "Pins & Skewers",
    "description": "Black to move — calculate the sharpest forcing sequence (Attraction · Decisive Tactic).",
    "playerColor": "b"
  },
  {
    "id": "lic-07YcM",
    "fen": "q4rk1/6p1/p2nR2p/1p6/2p5/5PK1/PP2Q2P/4R3 b - - 5 37",
    "moves": [
      "d6f5",
      "g3g2",
      "f5d4",
      "e2e4",
      "d4e6"
    ],
    "rating": 1825,
    "theme": "Winning Edge · Endgame",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07YkY",
    "fen": "4R3/r4k2/1p3rpB/p2p3p/1p6/2b2P2/5P1P/4R1K1 w - - 6 33",
    "moves": [
      "e8f8"
    ],
    "rating": 1187,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YoN",
    "fen": "6rk/1p6/p7/3N4/3Pp3/2PnP2p/P3KRrR/8 w - - 4 40",
    "moves": [
      "h2h3",
      "h8g7",
      "f2g2"
    ],
    "rating": 1273,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Yw9",
    "fen": "5rk1/p1p4p/3p2p1/3q1n2/1P2Np2/P6P/1Q3PP1/R5K1 w - - 3 29",
    "moves": [
      "e4f6",
      "f8f6",
      "b2f6"
    ],
    "rating": 832,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-07YxS",
    "fen": "r6k/p1p2Qpp/1p1R4/4p1B1/q3b2P/2P5/1P4P1/2K2R2 b - - 0 25",
    "moves": [
      "a4c2"
    ],
    "rating": 1346,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 1).",
    "playerColor": "b"
  },
  {
    "id": "lic-07Yzu",
    "fen": "r1b3k1/pp5p/2p1p2r/2PpNp1q/3Pn1P1/5QP1/PP2PPB1/R3R1K1 b - - 0 20",
    "moves": [
      "h5h2",
      "g1f1",
      "e4d2"
    ],
    "rating": 1398,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 2).",
    "playerColor": "b"
  },
  {
    "id": "lic-07Z0P",
    "fen": "2r2rk1/1p4bp/6p1/pP1qpp2/6PP/P1n1BQ2/2B2R2/5RK1 w - - 1 29",
    "moves": [
      "f3d5",
      "c3d5",
      "c2b3",
      "g8h8",
      "b3d5"
    ],
    "rating": 1542,
    "theme": "Winning Edge · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Winning Edge · Pin).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Z26",
    "fen": "8/3pQ2p/2b3pk/8/p4pK1/3q1P2/7P/8 w - - 2 49",
    "moves": [
      "e7f8"
    ],
    "rating": 1428,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-07Z3d",
    "fen": "r3k2r/1bqp1ppp/p1nbp3/1p6/3Q1B2/7P/PPP1BPP1/RN3RK1 w kq - 4 15",
    "moves": [
      "d4d6",
      "c7d6",
      "f4d6"
    ],
    "rating": 1851,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge) from Sicilian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-07ZAn",
    "fen": "8/8/p5P1/P2kN3/2np1K2/8/8/8 b - - 1 61",
    "moves": [
      "c4e5",
      "g6g7",
      "e5g6",
      "f4f3",
      "g6e7"
    ],
    "rating": 1344,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-07ZBD",
    "fen": "r3r1k1/pp1qbpp1/3p1n1p/2pP4/2Q1NP2/5b2/PP1BP3/R3KBR1 w Q - 0 17",
    "moves": [
      "e2f3",
      "f6e4",
      "f3e4",
      "e7h4",
      "e1d1"
    ],
    "rating": 1883,
    "theme": "Winning Edge",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge) from Indian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-07ZNT",
    "fen": "r4rk1/2p1nppN/p7/1p2p3/3qP1Q1/1pN4R/PP3PPP/6K1 w - - 0 18",
    "moves": [
      "h7f6"
    ],
    "rating": 1076,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1) from Three Knights Opening.",
    "playerColor": "w"
  },
  {
    "id": "lic-07ZOF",
    "fen": "6rk/2RQ3p/pp4pq/4Q3/7b/6P1/6PK/8 b - - 1 36",
    "moves": [
      "h4f6",
      "d7h3",
      "h6h3",
      "h2h3",
      "f6e5"
    ],
    "rating": 1438,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-07ZOz",
    "fen": "8/pR4p1/3pkrb1/p1p2p2/4p2Q/2P4B/7K/q1B5 w - - 8 48",
    "moves": [
      "h4e4"
    ],
    "rating": 1563,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 1).",
    "playerColor": "w"
  },
  {
    "id": "lic-07ZS4",
    "fen": "r1bqk2r/1p3ppp/p3p3/2bpP3/3n1Pn1/2NB1N2/PPP1Q1PP/R1B1K2R w KQkq - 6 10",
    "moves": [
      "f3d4",
      "c5d4",
      "e2g4"
    ],
    "rating": 1348,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Discovered Attack) from French Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-07ZVE",
    "fen": "8/1pp5/3pBk2/p1nPp3/2P5/1PNb4/P6r/R2KR3 b - - 2 32",
    "moves": [
      "d3c2",
      "d1c1",
      "c5d3"
    ],
    "rating": 1292,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 2).",
    "playerColor": "b"
  },
  {
    "id": "lic-0FZEz",
    "fen": "5k2/pp2pp2/3p1np1/1N6/2b1P1Pp/q2R1P2/2P1B2P/1KQ4R b - - 0 22",
    "moves": [
      "a3a2"
    ],
    "rating": 991,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1).",
    "playerColor": "b"
  },
  {
    "id": "lic-0FZG0",
    "fen": "rnb2k1r/ppp2ppp/5n2/8/4p3/2N2N2/PPP1B1PP/2KR3R w - - 0 14",
    "moves": [
      "d1d8",
      "f8e7",
      "d8h8"
    ],
    "rating": 1235,
    "theme": "Decisive Tactic · Tactical Fork",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Decisive Tactic · Tactical Fork) from Kings Pawn Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-0FZGA",
    "fen": "r1b2r2/p4p1k/1p2pqpP/3p4/3P4/3B4/PP1B2Q1/1K5R w - - 2 32",
    "moves": [
      "h1f1",
      "f6e7",
      "d2b4",
      "c8a6",
      "b4e7"
    ],
    "rating": 2500,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FZKJ",
    "fen": "8/8/8/1Q4p1/2p2p2/2k5/6PK/q7 w - - 4 67",
    "moves": [
      "b5e5",
      "c3c2",
      "e5a1"
    ],
    "rating": 1072,
    "theme": "Decisive Tactic · Endgame",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FZOP",
    "fen": "8/2k5/P5p1/4K3/5P1p/8/8/8 w - - 0 50",
    "moves": [
      "e5e4",
      "c7b6",
      "e4f3",
      "h4h3",
      "f3g3",
      "b6a6",
      "g3h3"
    ],
    "rating": 1850,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FZRX",
    "fen": "r3k2r/pp2npp1/1qn1p1bp/2bpP3/8/2P2NN1/PP2BPPP/R1BQ1RK1 w kq - 2 12",
    "moves": [
      "b2b4",
      "c6b4",
      "c3b4"
    ],
    "rating": 1576,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge) from Caro-Kann Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0FZXf",
    "fen": "r3r1k1/pp3pp1/2p4p/4P3/2PB1Pnn/2N4q/PP2Q3/3R1RK1 w - - 1 21",
    "moves": [
      "d1d3",
      "g4e3",
      "d3e3"
    ],
    "rating": 1581,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FZf6",
    "fen": "5R2/p3P3/1p4k1/6p1/2p3n1/2P4K/P3R1P1/7q w - - 7 43",
    "moves": [
      "h3g4",
      "h1h5",
      "g4g3",
      "h5e2",
      "e7e8q",
      "e2e8",
      "f8e8"
    ],
    "rating": 1351,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FZie",
    "fen": "8/p1R1rk1p/1p6/5p2/3Kp2P/4P3/P4P2/8 w - - 4 31",
    "moves": [
      "c7e7",
      "f7e7",
      "d4e5"
    ],
    "rating": 1085,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FZop",
    "fen": "3rrnk1/1b3ppp/2p5/2P1q3/pPp1B3/P3Q1P1/5P1P/3R1RK1 w - - 0 23",
    "moves": [
      "d1d8",
      "e8d8",
      "e4h7",
      "f8h7",
      "e3e5"
    ],
    "rating": 1441,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FZp0",
    "fen": "3r2k1/5pp1/P6p/RN6/6b1/P5P1/5PBP/3R2K1 b - - 0 31",
    "moves": [
      "d8d1",
      "g2f1",
      "g4h3",
      "f2f3",
      "d1f1"
    ],
    "rating": 1624,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Endgame · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-0FZsB",
    "fen": "3rr1k1/pp2p2p/2p2npQ/4Nb2/3P4/8/qPP1B1P1/2KR3R w - - 4 20",
    "moves": [
      "e2c4",
      "a2c4",
      "e5c4"
    ],
    "rating": 1195,
    "theme": "Decisive Tactic · Tactical Fork",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic · Tactical Fork) from Caro-Kann Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Fa0D",
    "fen": "r4rk1/3bbppp/pRpppn2/q7/4P3/2NBBP2/P1PQ2PP/5RK1 w - - 2 16",
    "moves": [
      "c3d5",
      "f6d5",
      "d2a5"
    ],
    "rating": 1839,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge · Discovered Attack) from Sicilian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Fa0X",
    "fen": "3r4/p4p1p/2R1r1k1/5p2/2P2Q2/3P2Bq/P1P2P2/6K1 w - - 6 31",
    "moves": [
      "g3h4",
      "h3g4",
      "f4g4",
      "f5g4",
      "c6e6"
    ],
    "rating": 2131,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Fa0o",
    "fen": "r2qk2r/p1ppppbp/bp4p1/4n3/4PB2/2N2P1P/PPPQBP2/R3K2R w KQkq - 3 12",
    "moves": [
      "f4e5",
      "g7e5",
      "e2a6"
    ],
    "rating": 1789,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge) from Owen Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Fa12",
    "fen": "6r1/p5qk/2p1P3/2p5/3p1N1p/3P1Q1P/PPP5/7K w - - 4 39",
    "moves": [
      "f3h5",
      "g7h6",
      "h5f5",
      "h7h8",
      "e6e7"
    ],
    "rating": 2279,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Winning Edge · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Fa1x",
    "fen": "4r3/1R2B2p/1p2B1bk/3p2p1/3P3P/1K1n1P2/4r3/8 w - - 0 39",
    "moves": [
      "e7g5",
      "h6h5",
      "e6g4"
    ],
    "rating": 1591,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Checkmate · Mate in 2).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Fa2G",
    "fen": "5r2/pbk1q1pp/1p1p4/4p3/2BP4/2N5/PP1PQnPP/R1B3KR b - - 7 18",
    "moves": [
      "e7g5",
      "e2f2",
      "f8f2",
      "g1f2",
      "g5g2",
      "f2e1",
      "g2h1"
    ],
    "rating": 2424,
    "theme": "Winning Edge · Attraction",
    "category": "Forks & Outposts",
    "description": "Black to move — uncover the master-level combination (Winning Edge · Attraction) from Italian Game.",
    "playerColor": "b"
  },
  {
    "id": "lic-0Fa3i",
    "fen": "2k3r1/p4p1p/1pp5/4Rp2/5B2/6PB/1P3PKP/1q6 w - - 0 29",
    "moves": [
      "h3f5",
      "b1f5",
      "e5f5"
    ],
    "rating": 937,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Fa5G",
    "fen": "2B3k1/7p/2Np2p1/1Pn1p2n/2P1P3/P3Qq2/5P2/4RK2 b - - 0 28",
    "moves": [
      "h5g3",
      "f1g1",
      "f3h1"
    ],
    "rating": 1383,
    "theme": "Checkmate · Mate in 2",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 2).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Fa7s",
    "fen": "3rr1k1/1pp4p/p3R1p1/3P4/5p2/PP3P2/2P3P1/2KR4 b - - 4 25",
    "moves": [
      "e8e6",
      "d5e6",
      "d8d1"
    ],
    "rating": 1188,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-0FaAY",
    "fen": "4rrk1/2q2ppp/p2p4/1p1P3n/2pQB3/P1P1RP2/1P4PP/4R1K1 w - - 5 25",
    "moves": [
      "e4h7",
      "g8h7",
      "e3e8",
      "f8e8",
      "e1e8"
    ],
    "rating": 894,
    "theme": "Decisive Tactic · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "White to move — spot the tactical shot (Decisive Tactic · Discovered Attack).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FaBD",
    "fen": "2R5/3R4/8/8/8/8/p3k1K1/1q6 w - - 0 66",
    "moves": [
      "c8e8",
      "b1e4",
      "e8e4"
    ],
    "rating": 1209,
    "theme": "Endgame · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Endgame · Checkmate).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FaFa",
    "fen": "1k3r2/1p6/1p4bb/pP2p2p/P3p1p1/BqR3P1/4QP1P/2Rr2K1 w - - 4 29",
    "moves": [
      "e2d1",
      "b3d1",
      "c1d1"
    ],
    "rating": 1363,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FaFr",
    "fen": "8/1p4N1/3r1k2/7K/2r5/4R3/8/8 w - - 2 52",
    "moves": [
      "g7e8",
      "f6f5",
      "e8d6",
      "f5f4",
      "d6c4"
    ],
    "rating": 1188,
    "theme": "Decisive Tactic · Endgame",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FaGq",
    "fen": "7k/1r3R1p/3pP1p1/8/6P1/7P/8/7K b - - 1 40",
    "moves": [
      "b7f7",
      "e6f7",
      "h8g7",
      "f7f8b",
      "g7f8"
    ],
    "rating": 1424,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-0FaHf",
    "fen": "6k1/pp2Rrpp/2p2n2/1r6/1P2N3/P4P2/6PP/R6K w - - 7 33",
    "moves": [
      "e7f7",
      "g8f7",
      "e4d6",
      "f7e7",
      "d6b5"
    ],
    "rating": 1755,
    "theme": "Attraction · Decisive Tactic",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Attraction · Decisive Tactic).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FaHl",
    "fen": "8/7p/5kp1/1p1p1B2/1PpP1P2/4K3/6PP/8 b - - 0 34",
    "moves": [
      "f6f5",
      "e3f3",
      "h7h5"
    ],
    "rating": 2195,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-0FaIA",
    "fen": "6k1/1b4p1/pp6/3q2p1/P2p4/5r1P/1PQ1N1P1/3R2K1 w - - 0 30",
    "moves": [
      "g2f3",
      "d5f3",
      "e2d4",
      "f3g3",
      "g1f1"
    ],
    "rating": 2137,
    "theme": "Decisive Tactic · Endgame",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Decisive Tactic · Endgame).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FaKt",
    "fen": "5rk1/p6p/1p4pb/2p5/3n4/1P4P1/PB2N2P/1R1RK3 b - - 0 34",
    "moves": [
      "d4c2"
    ],
    "rating": 1169,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Checkmate · Mate in 1).",
    "playerColor": "b"
  },
  {
    "id": "lic-0FaLK",
    "fen": "r4rk1/5ppp/pR1b3q/3Q4/3P4/5N2/5PPP/R5K1 b - - 6 25",
    "moves": [
      "d6h2",
      "f3h2",
      "h6b6"
    ],
    "rating": 1449,
    "theme": "Winning Edge · Discovered Attack",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Winning Edge · Discovered Attack).",
    "playerColor": "b"
  },
  {
    "id": "lic-0FaMR",
    "fen": "r2q1rk1/1p1b4/p3pp1p/3pN1p1/4n3/1B6/PP2QPPP/2RR2K1 w - - 0 20",
    "moves": [
      "e5d7",
      "d8d7",
      "e2e4"
    ],
    "rating": 1862,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FaSm",
    "fen": "r1k4r/pbp3pp/1q6/1p2N1B1/4nP2/3Q4/PPP3PP/R3RK2 b - - 3 18",
    "moves": [
      "b6f2"
    ],
    "rating": 857,
    "theme": "Checkmate · Mate in 1",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Checkmate · Mate in 1) from Russian Game.",
    "playerColor": "b"
  },
  {
    "id": "lic-0FaVW",
    "fen": "r3r1k1/p4pp1/1b3q1p/1BnQ1b2/8/2P2N2/PP1N1PPP/R4RK1 b - - 6 16",
    "moves": [
      "a8d8",
      "d5d4",
      "d8d4"
    ],
    "rating": 2006,
    "theme": "Winning Edge",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge) from Sicilian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0FaWP",
    "fen": "5rk1/rp1R2pp/q1p5/4Pp2/1b2pP2/P7/2P2QPP/R5K1 w - - 0 21",
    "moves": [
      "f2g3",
      "a6b6",
      "g1h1",
      "b4e7",
      "d7e7"
    ],
    "rating": 1627,
    "theme": "Winning Edge",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Winning Edge).",
    "playerColor": "w"
  },
  {
    "id": "lic-0FaX9",
    "fen": "r1bqkb1r/5pp1/p1nppn1p/1pp5/Q1B1P3/2PP1N2/1P3PPP/RNB2RK1 w kq - 0 11",
    "moves": [
      "c4b5",
      "a6b5",
      "a4a8"
    ],
    "rating": 1037,
    "theme": "Winning Edge · Pin",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Winning Edge · Pin) from Sicilian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0FaZq",
    "fen": "1r6/7R/3k4/8/8/2p3P1/P4P1P/4K3 b - - 1 36",
    "moves": [
      "b8b1",
      "e1e2",
      "c3c2"
    ],
    "rating": 1728,
    "theme": "Winning Edge · Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Winning Edge · Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Facz",
    "fen": "r1b1r1k1/pppp1p1p/5bp1/6BP/8/P7/1PP1Q2P/1R2KBq1 w - - 0 18",
    "moves": [
      "e2e8",
      "g8g7",
      "h5h6"
    ],
    "rating": 1457,
    "theme": "Hanging Piece · Checkmate",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Hanging Piece · Checkmate) from Vienna Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-0FalY",
    "fen": "r1b1k2r/1p3pp1/p1n5/3BP3/5P1p/4b1P1/PPR3P1/3Q1R1K b kq - 0 20",
    "moves": [
      "h4g3",
      "d1h5",
      "h8h5"
    ],
    "rating": 948,
    "theme": "Discovered Attack · Checkmate",
    "category": "Mate & Back Rank",
    "description": "Black to move — spot the tactical shot (Discovered Attack · Checkmate).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MGx",
    "fen": "1kr4r/1p4pp/p7/2p1b2q/QP1p4/N2P2P1/P1P2P1P/R4RK1 b - - 0 25",
    "moves": [
      "c8c6",
      "a1e1",
      "c6h6",
      "h2h4",
      "h6g6",
      "e1e5",
      "h5e5"
    ],
    "rating": 2311,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MHa",
    "fen": "1r4k1/5p1p/2Q1p1pb/3pP3/3P4/3qPN1P/4RKP1/8 b - - 2 27",
    "moves": [
      "h6e3",
      "e2e3",
      "b8b2"
    ],
    "rating": 1409,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MJH",
    "fen": "b4r2/2R2pk1/p3pqp1/4P2p/2Q2P2/P1N5/7K/5R2 b - - 0 26",
    "moves": [
      "f6h4",
      "h2g1",
      "h4g3"
    ],
    "rating": 1642,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MNf",
    "fen": "8/5p1k/6p1/7r/8/P2q4/1Q2NP1P/2KR4 b - - 0 40",
    "moves": [
      "h5c5",
      "e2c3",
      "c5c3",
      "b2c3",
      "d3c3"
    ],
    "rating": 1192,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MPR",
    "fen": "rk4r1/pb3Rp1/1ppNn2p/4P3/7P/4B3/PPP3P1/6K1 w - - 0 27",
    "moves": [
      "f7b7"
    ],
    "rating": 990,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09MT0",
    "fen": "2r3k1/6bp/R5p1/P2p4/2rPp3/2P4P/3BKQPq/1R6 b - - 0 37",
    "moves": [
      "c8f8",
      "a6a8",
      "f8a8"
    ],
    "rating": 2254,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MTB",
    "fen": "2k1r3/pp4pr/8/5q2/6nb/2P1BB2/PP2K3/R4Q1R w - - 0 31",
    "moves": [
      "f3b7",
      "c8b7",
      "f1f5"
    ],
    "rating": 1593,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09MTi",
    "fen": "6r1/p1p4k/3pPQ2/3P3p/8/7P/R3qPP1/5R1K b - - 0 38",
    "moves": [
      "e2f1",
      "h1h2",
      "f1g2"
    ],
    "rating": 809,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MZ7",
    "fen": "2r4q/5pp1/4kn1p/1P1pp3/PQ6/2rBPP2/4KP1P/1R5R b - - 0 26",
    "moves": [
      "e5e4",
      "f3e4",
      "d5e4"
    ],
    "rating": 1912,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MZL",
    "fen": "r4rk1/ppp2pp1/1b1p3p/4P2n/3n3q/P1NQ1P2/1P3P1P/RBB1R1K1 w - - 1 17",
    "moves": [
      "d3h7"
    ],
    "rating": 771,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Ponziani Opening,Ponziani Opening Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-09MaL",
    "fen": "5rk1/8/2p3pp/3p3N/1P1P4/2P3QP/5rPK/2q5 w - - 0 37",
    "moves": [
      "g3g6",
      "g8h8",
      "g6g7"
    ],
    "rating": 1192,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Mbq",
    "fen": "7k/ppp2Q2/6p1/6q1/1K6/2P2P2/PPb5/R7 b - - 2 34",
    "moves": [
      "a7a5",
      "b4a3",
      "g5c5"
    ],
    "rating": 1457,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Mls",
    "fen": "8/8/p5p1/1p6/7k/1PP2K2/P7/8 w - - 3 46",
    "moves": [
      "f3e4",
      "h4h5",
      "c3c4",
      "b5c4",
      "b3c4"
    ],
    "rating": 2569,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Mmp",
    "fen": "1r1qk1r1/p4p2/bn2p1pB/3Q4/8/8/PpP2PPP/1R2R1K1 w - - 1 20",
    "moves": [
      "e1e6",
      "f7e6",
      "d5e6",
      "d8e7",
      "e6g8"
    ],
    "rating": 1578,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09MoZ",
    "fen": "5rk1/1p2pp1p/6p1/3Pq3/p2NP3/P2Q1Rb1/B5P1/7K b - - 3 29",
    "moves": [
      "e5h5",
      "h1g1",
      "h5h2",
      "g1f1",
      "h2h1",
      "f1e2",
      "h1e1"
    ],
    "rating": 1224,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Mof",
    "fen": "8/8/1p5p/p7/P5Pp/1P5P/k1K5/8 w - - 0 45",
    "moves": [
      "c2c3",
      "a2a3",
      "c3c4"
    ],
    "rating": 1329,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09MqT",
    "fen": "8/p5kp/2B3p1/2N1P3/5P2/1Pn2K2/2n4P/8 b - - 0 47",
    "moves": [
      "c2d4",
      "f3e3",
      "d4c6"
    ],
    "rating": 1170,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MrL",
    "fen": "1r5r/B1k3pp/2B1R1n1/b7/4N3/3R4/P4PPP/6K1 b - - 0 34",
    "moves": [
      "b8b1",
      "d3d1",
      "b1d1"
    ],
    "rating": 545,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MvE",
    "fen": "2kr4/1pp3p1/p1n4p/4Pbq1/2B1QN2/2P5/PP4P1/1K3R2 w - - 0 26",
    "moves": [
      "c4e6",
      "f5e6",
      "f4e6",
      "g5e5",
      "e4e5",
      "c6e5",
      "e6d8"
    ],
    "rating": 1529,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09MyB",
    "fen": "r3k2r/1B1p1pp1/p3p3/2b1P1n1/1pP4P/6p1/PP2Q3/R4R1K b kq - 0 21",
    "moves": [
      "h8h4",
      "h1g2",
      "h4h2",
      "g2g3",
      "h2e2"
    ],
    "rating": 1402,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09MyO",
    "fen": "6k1/1p3qp1/p7/2P3K1/3PR1P1/8/P3R3/8 b - - 0 45",
    "moves": [
      "f7f6",
      "g5h5",
      "f6h6"
    ],
    "rating": 1000,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Myx",
    "fen": "3n4/4kp2/r3pn2/p2pNr2/1p1P1R1Q/P1P1q3/1P4PP/5R1K w - - 6 32",
    "moves": [
      "f4f5",
      "e6f5",
      "f1e1"
    ],
    "rating": 2259,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09MzW",
    "fen": "3k4/p2P4/2K5/p6p/P4pP1/8/6PP/8 b - - 0 46",
    "moves": [
      "h5g4",
      "c6b5",
      "f4f3",
      "g2f3",
      "g4f3"
    ],
    "rating": 1384,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09N0o",
    "fen": "k7/p7/8/6p1/8/6P1/r2RK2P/8 b - - 2 44",
    "moves": [
      "a2d2",
      "e2d2",
      "g5g4"
    ],
    "rating": 2164,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09N3x",
    "fen": "8/8/r5R1/3pKp1p/p6k/P1p5/8/8 w - - 0 43",
    "moves": [
      "g6a6",
      "h4g3",
      "a6g6",
      "g3f2",
      "g6c6",
      "d5d4",
      "e5d4"
    ],
    "rating": 2798,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09NJG",
    "fen": "1k6/1p4pQ/p3p3/3pP1P1/q1pP3P/P1P5/1P1R1r2/2K5 b - - 1 30",
    "moves": [
      "f2f1",
      "d2d1",
      "f1d1"
    ],
    "rating": 851,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09NKS",
    "fen": "3rrnk1/pp3ppp/4bp2/b7/3p4/2P1BN1P/PqBQ1PP1/2R1R1K1 w - - 0 19",
    "moves": [
      "c2h7",
      "g8h7",
      "d2b2"
    ],
    "rating": 1547,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Caro-Kann Defense,Caro-Kann Defense Two Knights Attack.",
    "playerColor": "w"
  },
  {
    "id": "lic-09NOE",
    "fen": "8/4p2p/3k2p1/pK6/1p6/1P4PP/P1P5/8 b - - 1 37",
    "moves": [
      "d6d5",
      "b5a5",
      "d5c5"
    ],
    "rating": 2592,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Naa",
    "fen": "4k3/5n2/6R1/6p1/2K5/8/P7/8 b - - 1 52",
    "moves": [
      "f7e5",
      "c4d5",
      "e5g6"
    ],
    "rating": 725,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09NcC",
    "fen": "6k1/pppbq1b1/2n3p1/6r1/3pN1P1/2PB1Q2/PP6/2K4R w - - 2 25",
    "moves": [
      "d3c4",
      "d7e6",
      "c4e6",
      "e7e6",
      "e4g5"
    ],
    "rating": 2044,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Ndi",
    "fen": "8/4k3/pq2pr2/1p1pQ3/8/P7/1P3PPP/2R3K1 b - - 0 33",
    "moves": [
      "b6f2",
      "g1h1",
      "f2f1",
      "c1f1",
      "f6f1"
    ],
    "rating": 798,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Ng3",
    "fen": "3Q1rk1/pp6/2p3p1/6pp/P2QP3/2P1r2P/1P3bK1/8 b - - 0 39",
    "moves": [
      "e3g3",
      "g2h2",
      "f2d4"
    ],
    "rating": 1377,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Njm",
    "fen": "r2qn1k1/pppb3r/4pbB1/7Q/8/2N3P1/PPP2P1P/R5K1 w - - 0 21",
    "moves": [
      "h5h7",
      "g8f8",
      "h7f7"
    ],
    "rating": 1215,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Nmb",
    "fen": "r4r2/2q2pbk/1pp1b1pp/p1p1N3/P3Pn2/1PQPBN1P/2P2PP1/R4RK1 b - - 0 17",
    "moves": [
      "f4e2",
      "g1h1",
      "e2c3"
    ],
    "rating": 1162,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Sicilian Defense,Sicilian Defense Nyezhmetdinov-Rossolimo Attack.",
    "playerColor": "b"
  },
  {
    "id": "lic-09Npd",
    "fen": "8/2k5/2P3p1/pP1Kp1P1/P4p2/5P2/8/b7 w - - 1 59",
    "moves": [
      "b5b6",
      "c7b6",
      "d5d6",
      "e5e4",
      "c6c7",
      "a1e5",
      "d6e5",
      "b6c7",
      "e5e4"
    ],
    "rating": 2045,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Nq4",
    "fen": "8/5k2/N1p4p/Pp1pP2P/1P1P2p1/2K3n1/8/8 b - - 0 50",
    "moves": [
      "g3e4",
      "c3d3",
      "g4g3"
    ],
    "rating": 1623,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Nqz",
    "fen": "5rk1/4b1pp/p2p4/Qpqn4/2P1pp2/1P6/P2B1PPP/2R1N1KR b - - 0 24",
    "moves": [
      "e7h4",
      "e1d3",
      "e4d3"
    ],
    "rating": 2578,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Nsl",
    "fen": "r3k1r1/pb1p1pBp/1q2p1p1/2p5/4n3/3Q4/PPP1BPPP/2KR3R w q - 2 16",
    "moves": [
      "d3d7"
    ],
    "rating": 541,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Sicilian Defense,Sicilian Defense Four Knights Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-09Nwe",
    "fen": "6k1/p1R2R1p/3p4/r7/2P2KP1/3P4/7r/8 b - - 4 40",
    "moves": [
      "h2f2",
      "f4g3",
      "f2f7"
    ],
    "rating": 831,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Nza",
    "fen": "8/3R1p1k/3R2p1/2pPrq1p/1pP5/1P4QP/5rPK/8 w - - 1 33",
    "moves": [
      "d7f7",
      "f5f7",
      "g3e5"
    ],
    "rating": 1645,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09O0B",
    "fen": "r2qk2r/ppp1npbp/3pb1p1/4n3/2P5/1P2PN1P/PB2BPP1/RN1QK2R b KQkq - 1 9",
    "moves": [
      "e5f3",
      "e2f3",
      "g7b2"
    ],
    "rating": 1198,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Nimzo-Larsen Attack,Nimzo-Larsen Attack Modern Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-09OBL",
    "fen": "r1b2rk1/pp3ppp/4p3/2q1B3/4P1nP/2NB4/PPP3P1/R2QK2R b KQ - 0 17",
    "moves": [
      "c5f2"
    ],
    "rating": 937,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Sicilian Defense,Sicilian Defense Taimanov Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-09ODD",
    "fen": "r3k2r/ppp1bppp/5n2/3qn3/6b1/5N2/PP2BPPP/RNBQ1RK1 w kq - 0 11",
    "moves": [
      "f3e5",
      "g4e2",
      "d1e2"
    ],
    "rating": 2086,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot) from French Defense,French Defense Exchange Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-09OEZ",
    "fen": "r1b2R2/p1p2p1k/1p1p2p1/7r/5B2/3B2Pq/P1P2P1P/5RKQ b - - 1 23",
    "moves": [
      "c8b7",
      "f8f7",
      "h7g8",
      "f2f3",
      "g8f7"
    ],
    "rating": 1623,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09OHP",
    "fen": "8/8/1p6/pP6/P2pk1N1/2b3P1/4K3/8 b - - 1 45",
    "moves": [
      "d4d3",
      "e2d1",
      "e4f3",
      "g4h6",
      "f3g3"
    ],
    "rating": 1568,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09OHV",
    "fen": "6k1/p1p2r1p/1p4pB/2n1p3/2P1q3/P1P4P/5P1K/3R2R1 w - - 0 25",
    "moves": [
      "d1d8",
      "f7f8",
      "d8f8"
    ],
    "rating": 651,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09OJ5",
    "fen": "4r3/pq3pk1/5np1/4nb1p/7P/2N2P2/PPPQN1P1/2KR3R b - - 1 17",
    "moves": [
      "e5c4",
      "b2b3",
      "c4d2"
    ],
    "rating": 1335,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Indian Defense,Indian Defense Other variations.",
    "playerColor": "b"
  },
  {
    "id": "lic-09OJf",
    "fen": "8/8/6K1/3P4/4P3/6b1/6k1/1R5q w - - 0 51",
    "moves": [
      "b1h1",
      "g2h1",
      "g6f5",
      "h1g2",
      "e4e5",
      "g2f3",
      "d5d6"
    ],
    "rating": 1907,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09OLV",
    "fen": "3r1r1k/6bp/2p2np1/pb2p1B1/4P3/P4N1n/BPQN2PP/R5RK b - - 0 24",
    "moves": [
      "h3f2"
    ],
    "rating": 805,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09OLu",
    "fen": "3r2k1/p1q2pp1/1p5p/8/2p5/P4QPP/1B1R1P1K/4r3 w - - 1 30",
    "moves": [
      "f3c3",
      "f7f6",
      "d2d8",
      "c7d8",
      "c3e1"
    ],
    "rating": 2376,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09ON7",
    "fen": "7k/8/p2p4/1p4RK/6R1/7q/P4P2/8 w - - 3 46",
    "moves": [
      "h5g6",
      "h3f3",
      "g4g3"
    ],
    "rating": 2592,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09OO6",
    "fen": "4rrk1/p1q3pp/3bb3/Np1n1p2/1Ppp1P2/P2P1QNP/2PB2P1/R3R1K1 w - - 2 21",
    "moves": [
      "e1e6",
      "e8e6",
      "f3d5"
    ],
    "rating": 1289,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09OQD",
    "fen": "1k4rr/pp1R1p2/2p5/4p1p1/2P1Pn2/1P3Pq1/P2Q2B1/3R1K2 w - - 0 31",
    "moves": [
      "d2d6",
      "b8a8",
      "d7d8",
      "g8d8",
      "d6d8",
      "h8d8",
      "d1d8"
    ],
    "rating": 1793,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09ORz",
    "fen": "rr4k1/3n2pp/2Rqp3/3pNp2/3P4/4P1P1/1P1Q1P1P/5RK1 b - - 2 23",
    "moves": [
      "d7e5",
      "d4e5",
      "d6c6"
    ],
    "rating": 1502,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09OT8",
    "fen": "3rr1k1/ppp2ppp/2q1pn2/5P2/3P4/2PB4/PP2Q1PP/R4RK1 w - - 1 18",
    "moves": [
      "d3b5",
      "e6f5",
      "e2e8",
      "c6e8",
      "b5e8"
    ],
    "rating": 1887,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from French Defense,French Defense Burn Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-09OV6",
    "fen": "8/3k4/6RP/2p1p3/1pPp2P1/1r6/3K4/8 w - - 0 48",
    "moves": [
      "g6g5",
      "b3b2",
      "d2c1",
      "b2h2",
      "g5h5"
    ],
    "rating": 2458,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09OWZ",
    "fen": "2krn3/pp1R4/2p2n1p/5qp1/6P1/5PB1/PPP4P/1K2R3 w - - 0 26",
    "moves": [
      "d7d8",
      "c8d8",
      "g4f5"
    ],
    "rating": 1851,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09ObR",
    "fen": "3r1k1r/pb3pp1/1p2BP1p/2p5/5q2/2N2N2/PPP2PPP/3RR1K1 w - - 0 19",
    "moves": [
      "d1d8"
    ],
    "rating": 751,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Indian Defense,Indian Defense Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-09OdM",
    "fen": "5rk1/p3q1pp/1p3n2/2pr1p2/8/2BQPP2/PP3P1P/2KR3R w - - 0 18",
    "moves": [
      "c3f6",
      "d5d3",
      "f6e7"
    ],
    "rating": 1366,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot) from Horwitz Defense,Horwitz Defense Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-09OeR",
    "fen": "8/5q1k/p5pp/1p2Qb1P/5N2/PPP1R3/1K4P1/3r4 b - - 1 44",
    "moves": [
      "d1b1",
      "b2a2",
      "f7b3"
    ],
    "rating": 1218,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09OkS",
    "fen": "8/8/5p2/1P6/K6p/6k1/8/8 w - - 1 50",
    "moves": [
      "b5b6",
      "f6f5",
      "b6b7",
      "f5f4",
      "b7b8q"
    ],
    "rating": 434,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09OoO",
    "fen": "2r2r2/2qnbppk/p3p3/1p2P3/1B6/P4b2/1P3PPP/2RQ1RK1 w - - 0 19",
    "moves": [
      "d1d3",
      "h7g8",
      "c1c7"
    ],
    "rating": 1805,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Sicilian Defense,Sicilian Defense Delayed Alapin Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-09OpO",
    "fen": "4kbnr/pQBqpppp/8/3p1b2/8/8/PP2PPPP/n2K1BNR w k - 1 12",
    "moves": [
      "e2e3",
      "f7f6",
      "f1b5",
      "d7b5",
      "b7b5"
    ],
    "rating": 2054,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Tactical Shot) from Slav Defense,Slav Defense Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-09OqK",
    "fen": "3Q4/2R2rk1/p4p2/1p2p1pK/4b1P1/P3P2B/1P6/8 b - - 0 47",
    "moves": [
      "e4g6"
    ],
    "rating": 1051,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09OqU",
    "fen": "3rk2r/2p1bppp/p1p5/4p1B1/4n1b1/2P2N2/PP3PPP/RN2R1K1 w k - 0 12",
    "moves": [
      "g5e7",
      "e8e7",
      "f3e5"
    ],
    "rating": 2505,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot) from Ruy Lopez,Ruy Lopez Steinitz Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-09OqV",
    "fen": "r4rk1/1p3ppp/p1n2q2/3p4/2pP4/N1P2P2/PPQ2P1b/RB3R1K w - - 0 18",
    "moves": [
      "c2h7"
    ],
    "rating": 457,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from French Defense,French Defense Knight Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-09Oru",
    "fen": "8/7p/3k2p1/1b1p1p1P/1p1P1P1K/1P6/2B5/8 w - - 3 53",
    "moves": [
      "h5g6",
      "h7g6",
      "h4g5",
      "b5e2",
      "g5g6"
    ],
    "rating": 1724,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Otk",
    "fen": "2br3k/pq3Qpp/1p6/5pN1/3n4/6P1/P1P1P2P/1R4K1 w - - 6 25",
    "moves": [
      "f7b7",
      "c8b7",
      "g5f7",
      "h8g8",
      "f7d8"
    ],
    "rating": 1320,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Ouj",
    "fen": "6k1/pp4p1/4p1p1/3p4/1P4r1/P3q3/1BR4P/5Q1K w - - 4 30",
    "moves": [
      "c2c8",
      "g8h7",
      "c8h8",
      "h7h8",
      "f1f8",
      "h8h7",
      "f8g7"
    ],
    "rating": 1684,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09OvO",
    "fen": "1r1r2k1/R4pp1/4b2p/2Q1R2P/1ppP1P2/2P3P1/6BK/3q4 w - - 0 34",
    "moves": [
      "e5e6",
      "f7e6",
      "c5e5"
    ],
    "rating": 2419,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09P2R",
    "fen": "6k1/p3ppbp/1p3np1/8/Q2P4/2r1PN1P/P4PP1/2rR2K1 b - - 2 23",
    "moves": [
      "b6b5",
      "a4b5",
      "c1d1"
    ],
    "rating": 1923,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09P7R",
    "fen": "3q2k1/b4pp1/p3bN1p/1p2Q3/1P6/P5P1/4PPBP/2B3K1 b - - 0 26",
    "moves": [
      "g7f6",
      "e5a1",
      "d8d1",
      "g2f1",
      "a7d4",
      "c1b2",
      "d1a1",
      "b2a1",
      "d4a1"
    ],
    "rating": 2406,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09PBd",
    "fen": "4r1k1/5p2/pN4pb/1pP4p/1R6/3bPN1P/4R1P1/5K2 b - - 0 39",
    "moves": [
      "d3e2",
      "f1e2",
      "h6e3",
      "b6d5",
      "e3c5"
    ],
    "rating": 2633,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09PCt",
    "fen": "r2q1rk1/pp2p1bp/3p2p1/2pPnb1n/2P5/2NBBN2/PP3PPP/R2QK2R w KQ - 0 12",
    "moves": [
      "f3e5",
      "g7e5",
      "d3f5",
      "e5c3",
      "b2c3"
    ],
    "rating": 2112,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot) from Queens Pawn Game,Queens Pawn Game Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-09PFG",
    "fen": "8/7p/1p1k1pp1/p2p1p2/1P1P4/P1K1P2P/5PP1/8 w - - 1 39",
    "moves": [
      "c3b3",
      "d6c6",
      "b3a4",
      "a5b4",
      "a4b4"
    ],
    "rating": 2526,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09PG7",
    "fen": "1k2r3/ppp5/5p2/3P3Q/2P5/8/4r1PP/1R5K b - - 0 26",
    "moves": [
      "e2e1",
      "b1e1",
      "e8e1"
    ],
    "rating": 521,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09PIw",
    "fen": "5b1r/5ppp/p3pn1k/6R1/P4P2/6K1/2p1r3/6R1 w - - 0 33",
    "moves": [
      "g1h1",
      "e2h2",
      "h1h2",
      "f6h5",
      "h2h5"
    ],
    "rating": 934,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09PN3",
    "fen": "8/3bR1p1/p2k2N1/5p2/P1PK3P/1r4P1/5n2/8 w - - 2 47",
    "moves": [
      "c4c5",
      "d6c7",
      "g6e5",
      "c7c8",
      "e7d7"
    ],
    "rating": 1949,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09PO4",
    "fen": "2rr2k1/1p3pb1/p1bp1np1/4p1Bp/P3P2P/2N2P2/1qPQB1P1/3R1R1K w - - 0 19",
    "moves": [
      "d1b1",
      "b2a3",
      "b1b3",
      "a3c5",
      "g5e3"
    ],
    "rating": 1676,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Sicilian Defense,Sicilian Defense Dragon Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-09PP9",
    "fen": "5r2/p1q2rpk/2p1N2p/2P5/2Q3b1/2P5/P5PP/R4RK1 b - - 2 23",
    "moves": [
      "f7f1",
      "a1f1",
      "f8f1",
      "g1f1",
      "c7f7"
    ],
    "rating": 1412,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09PPW",
    "fen": "8/p7/1p1r4/2p1kr1R/6p1/1P6/P7/2K4R w - - 0 49",
    "moves": [
      "h1e1",
      "e5f6",
      "h5h6",
      "f6g5",
      "h6d6"
    ],
    "rating": 1435,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09PRn",
    "fen": "3rr1k1/pp1b1ppB/2p5/8/1P1P1P2/P2Q2Pq/7P/2R2RK1 b - - 0 22",
    "moves": [
      "h3h7",
      "d3h7",
      "g8h7"
    ],
    "rating": 1095,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09PWe",
    "fen": "8/8/8/4R2p/2k3p1/5rPK/8/8 w - - 0 52",
    "moves": [
      "h3h4",
      "c4d4",
      "e5h5",
      "f3f8",
      "h4g4"
    ],
    "rating": 1239,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09PWg",
    "fen": "5r1k/1R4p1/pp5p/4q3/5pQ1/2P4P/PP4PK/8 b - - 11 34",
    "moves": [
      "f4f3",
      "g4g3",
      "e5g3",
      "h2g3",
      "f3f2"
    ],
    "rating": 1235,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09PXh",
    "fen": "4rrk1/pp6/3p2pp/2pP1Q2/2B2P1b/2B1q2P/PPP5/5R1K w - - 0 26",
    "moves": [
      "f5g6"
    ],
    "rating": 779,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09PZh",
    "fen": "5Rkr/8/5pp1/5BN1/1p3P2/1P4K1/2P2Q2/3q3r b - - 6 45",
    "moves": [
      "g8f8",
      "f2c5",
      "f8g7",
      "c5e7",
      "g7h6"
    ],
    "rating": 1474,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Pcz",
    "fen": "3k4/3P4/2P1K3/5p2/7p/7P/6p1/8 w - - 0 50",
    "moves": [
      "e6d6",
      "f5f4",
      "c6c7"
    ],
    "rating": 1848,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09PgF",
    "fen": "r1b2rk1/5ppp/2p1p3/p2pP3/3q1PQ1/1PR5/P2P2PP/1RB4K b - - 0 20",
    "moves": [
      "d4e4",
      "g4d1",
      "e4b1"
    ],
    "rating": 1735,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Pir",
    "fen": "r3r3/ppq3Qp/2pbkn1N/3pp3/3P1P2/7P/PPP5/R4RK1 w - - 6 23",
    "moves": [
      "f4f5"
    ],
    "rating": 1683,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09PjX",
    "fen": "r1b1R3/6k1/2pb1q2/4N2p/1nBP1p2/pPp3P1/P3QP2/K7 w - - 0 29",
    "moves": [
      "e2h5",
      "d6f8",
      "e8c8",
      "a8c8",
      "h5g4"
    ],
    "rating": 2825,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Pji",
    "fen": "N3Q2k/pp5p/6p1/2pPb1q1/2P1pr2/7P/PP2BP1K/4RR2 b - - 3 24",
    "moves": [
      "f4f8",
      "e8e5",
      "g5e5"
    ],
    "rating": 1833,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09PmX",
    "fen": "r1b1r1k1/pp3pp1/7p/3p4/2pP1N2/2N1qP2/PPQ3PP/R3R2K b - - 0 18",
    "moves": [
      "e3e1",
      "a1e1",
      "e8e1"
    ],
    "rating": 651,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Queens Gambit Declined,Queens Gambit Declined Exchange Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-09PrL",
    "fen": "6k1/1p3ppp/p7/2P2Q2/1P3P2/P2r3P/4KRP1/q7 b - - 2 31",
    "moves": [
      "a1d1"
    ],
    "rating": 1106,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09PrP",
    "fen": "8/4bk2/4p3/Q2p4/2pPp1P1/2P5/Pr5P/6K1 b - - 0 31",
    "moves": [
      "e4e3",
      "a5c7",
      "b2b1",
      "g1g2",
      "e3e2"
    ],
    "rating": 2239,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09Ptg",
    "fen": "1k3r2/p4pp1/1p2pb1p/8/2q5/4RN2/PP3PPP/1K1Q4 w - - 0 23",
    "moves": [
      "d1d6",
      "b8b7",
      "d6f8"
    ],
    "rating": 1081,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Pxt",
    "fen": "8/8/5Qq1/p1p1Pp2/3p1k2/1P6/P4KP1/8 b - - 1 39",
    "moves": [
      "g6g3",
      "f2f1",
      "g3d3",
      "f1g1",
      "d3e3"
    ],
    "rating": 2198,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-09PzW",
    "fen": "r4rk1/pp2npp1/3qp2p/1Bbpn3/7B/P5Q1/1PP2PPP/RN3RK1 w - - 2 14",
    "moves": [
      "h4e7",
      "d6e7",
      "g3e5"
    ],
    "rating": 1369,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot) from Caro-Kann Defense,Caro-Kann Defense Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-09Q1j",
    "fen": "1r4k1/6rp/p5R1/1pR2q2/8/P4P2/1P4PP/5K2 w - - 0 38",
    "moves": [
      "g6g7",
      "g8g7",
      "c5f5"
    ],
    "rating": 1387,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Q8i",
    "fen": "4r2k/ppp3pp/3p4/4n2Q/8/2P4P/P1P1Nrq1/R2KR3 w - - 4 27",
    "moves": [
      "h5e8",
      "f2f8",
      "e8f8"
    ],
    "rating": 742,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-09Q8y",
    "fen": "8/p6p/1p2k1p1/8/P1PBK3/6P1/1b5P/8 b - - 6 33",
    "moves": [
      "b2d4",
      "e4d4",
      "e6d6",
      "c4c5",
      "b6c5"
    ],
    "rating": 1904,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DhOx",
    "fen": "1r4k1/r5p1/R2Rp1p1/1p3p2/2b5/P1P1P1P1/5PBP/6K1 b - - 5 27",
    "moves": [
      "a7a6",
      "d6a6",
      "b5b4",
      "c3b4",
      "c4a6"
    ],
    "rating": 1518,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DhU5",
    "fen": "8/p4ppk/2p3rp/3pQ3/3P3P/2q5/P4PP1/5RK1 w - - 0 29",
    "moves": [
      "e5f5",
      "c3d4",
      "h4h5"
    ],
    "rating": 1773,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DhVP",
    "fen": "r4r1k/pQp3p1/3p3p/4p3/7P/2P1q2n/PP4B1/R4R1K w - - 2 26",
    "moves": [
      "f1f3",
      "h3f2",
      "h1g1",
      "e3c5",
      "b2b4"
    ],
    "rating": 2499,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DhWs",
    "fen": "r1bq1rk1/ppp2ppp/1b1p1n2/4p3/2BNP3/P1NPB3/1PP2PPP/R2Q1RK1 b - - 0 9",
    "moves": [
      "e5d4",
      "e3g5",
      "d4c3"
    ],
    "rating": 1138,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Italian Game,Italian Game Giuoco Pianissimo.",
    "playerColor": "b"
  },
  {
    "id": "lic-0DhZa",
    "fen": "3r2k1/pR3ppp/1pN1p3/8/5q2/2Q4P/1P3PP1/6K1 b - - 0 32",
    "moves": [
      "d8d1",
      "c3e1",
      "d1e1"
    ],
    "rating": 985,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dhbz",
    "fen": "8/3B4/3b1k2/5p1n/1p1p2pp/1K1P1P1P/1P1B1P2/8 w - - 0 42",
    "moves": [
      "f3g4",
      "f5g4",
      "d7g4"
    ],
    "rating": 1986,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dhhd",
    "fen": "6R1/8/5k1p/2p1pPpP/2Bbr1P1/8/6K1/8 w - - 5 43",
    "moves": [
      "g8g6",
      "f6e7",
      "f5f6"
    ],
    "rating": 1939,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DhkQ",
    "fen": "4r2r/p4k2/1qp2p2/3p1Q2/7p/1NP5/PP3PP1/4R1K1 w - - 1 26",
    "moves": [
      "f5d7",
      "f7g6",
      "e1e8",
      "h8e8",
      "d7e8"
    ],
    "rating": 1415,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dhm5",
    "fen": "8/p7/P1p3p1/5p1p/2pk1P1P/1Pp2KP1/2P5/8 w - - 0 35",
    "moves": [
      "b3b4",
      "d4d5",
      "f3e3",
      "d5e6",
      "e3d4",
      "e6d6",
      "d4c4"
    ],
    "rating": 1763,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DhqF",
    "fen": "8/5R2/p3pB2/4PkPp/2P5/1P2b3/r5PK/8 b - - 0 46",
    "moves": [
      "f5g4",
      "g5g6",
      "a2a1"
    ],
    "rating": 2692,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DhuR",
    "fen": "4rbk1/5ppp/3p1n2/R1pP4/2P5/1P1Q4/1P1BqPPP/4N1K1 b - - 2 24",
    "moves": [
      "e2d1",
      "d3f1",
      "d1d2"
    ],
    "rating": 2332,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Di12",
    "fen": "1k1r1n1r/pP3p2/2Pb4/3p1Bp1/N2P4/4PPqp/P4QP1/R1B1R1K1 b - - 1 25",
    "moves": [
      "h3h2",
      "g1h1",
      "g3f2"
    ],
    "rating": 1792,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Di2K",
    "fen": "8/1k6/3P2R1/1P2P3/8/7p/5Kpr/8 b - - 1 60",
    "moves": [
      "h2h1",
      "e5e6",
      "h1f1"
    ],
    "rating": 1619,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Di6g",
    "fen": "2rqkbQ1/1p1bn2N/2n5/1pp2r2/3p4/3P4/PPP2PPP/R3R1K1 w - - 2 18",
    "moves": [
      "g8g6",
      "f5f7",
      "h7f6"
    ],
    "rating": 1840,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from French Defense,French Defense Two Knights Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Di7Q",
    "fen": "8/8/5p2/p1r3k1/1pR2p2/1P3P1P/1P3KP1/8 b - - 8 42",
    "moves": [
      "c5c4",
      "b3c4",
      "a5a4",
      "h3h4",
      "g5f5",
      "f2e2",
      "a4a3",
      "b2a3",
      "b4a3"
    ],
    "rating": 2279,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Di86",
    "fen": "6k1/p4pp1/2n4p/1p1P4/3Pn3/2P2N1P/P1QN1qP1/7K b - - 1 25",
    "moves": [
      "e4g3",
      "h1h2",
      "g3f1",
      "d2f1",
      "f2c2"
    ],
    "rating": 1408,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Di90",
    "fen": "8/5B2/5p2/k1p2P2/3n2Pr/1P6/8/2K3R1 b - - 0 33",
    "moves": [
      "d4e2",
      "c1d2",
      "e2g1"
    ],
    "rating": 1151,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DiBH",
    "fen": "8/p4R2/1pkP4/2p1K2p/2P5/1P6/P6r/8 w - - 1 38",
    "moves": [
      "f7c7"
    ],
    "rating": 1065,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DiEf",
    "fen": "r3r1k1/p1b2pp1/1p1q1B1p/3p3P/8/1NP2Q2/PP3PP1/R4RK1 b - - 0 20",
    "moves": [
      "d6h2"
    ],
    "rating": 1256,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DiJi",
    "fen": "8/2p4Q/1p2kp2/p7/2q5/5PKP/8/8 w - - 0 51",
    "moves": [
      "h7g8",
      "e6e5",
      "g8c4"
    ],
    "rating": 1185,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DiKy",
    "fen": "rn3rk1/pp3q1p/8/3Np1b1/2p1Q1p1/N1P3P1/PP3PP1/R3K2R b KQ - 0 21",
    "moves": [
      "f7f2",
      "e1d1",
      "f2d2"
    ],
    "rating": 1369,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DiLj",
    "fen": "8/p1r3k1/2p2R1R/1p5P/4n3/P7/1r4P1/6K1 w - - 6 36",
    "moves": [
      "f6g6",
      "g7f8",
      "h6h8",
      "f8f7",
      "h8h7"
    ],
    "rating": 1696,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DiLw",
    "fen": "2r1kb1r/5p2/1n5p/p1n1P3/1p1NP2P/8/PPPB4/1NKR3R b k - 0 24",
    "moves": [
      "c5d3"
    ],
    "rating": 1093,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DiPP",
    "fen": "6k1/ppp2pp1/6qp/8/5n2/2B5/PP3P2/3KQ2R b - - 8 29",
    "moves": [
      "g6b1",
      "d1d2",
      "b1d3",
      "d2c1",
      "f4e2",
      "e1e2",
      "d3e2"
    ],
    "rating": 2297,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DiVz",
    "fen": "r1bq1rk1/ppp3pp/4pb2/3p2N1/1n1P3P/3Q1N2/PPP2PP1/R3KB1R w KQ - 4 11",
    "moves": [
      "d3h7"
    ],
    "rating": 502,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Dutch Defense,Dutch Defense Raphael Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0DiWE",
    "fen": "7k/ppq2pp1/2pb3p/8/8/2PB1P1P/PP2QP2/6K1 w - - 0 24",
    "moves": [
      "e2e8",
      "d6f8",
      "e8f8"
    ],
    "rating": 400,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Didw",
    "fen": "8/8/8/3k3p/4pPP1/pP2K3/P7/8 b - - 0 50",
    "moves": [
      "h5h4",
      "g4g5",
      "h4h3",
      "g5g6",
      "d5e6"
    ],
    "rating": 2242,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dieq",
    "fen": "rn3rk1/4pp1p/1pPQ2p1/pP6/P1P2n2/5N1b/3PBP1P/RN4KR b - - 0 17",
    "moves": [
      "f4e2"
    ],
    "rating": 1131,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Polish Opening,Polish Opening Other variations.",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dii7",
    "fen": "4k3/3p3p/p2B4/1p4n1/8/1P3RPr/P1P5/2K5 w - - 11 38",
    "moves": [
      "f3f8"
    ],
    "rating": 531,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Diit",
    "fen": "1k4r1/3rR1P1/2qp1p1p/pp5P/3Q4/2PP4/P1Pb1P2/4R1K1 w - - 4 29",
    "moves": [
      "e7e8",
      "b8b7",
      "e8g8"
    ],
    "rating": 1448,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dim0",
    "fen": "rnb2Nk1/pp4p1/2p1p3/3p2qn/3P1P2/3Bb1B1/PPP3PP/R2Q1R1K b - - 2 16",
    "moves": [
      "h5g3",
      "h2g3",
      "g5h6",
      "d1h5",
      "h6h5"
    ],
    "rating": 1558,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot) from Horwitz Defense,Horwitz Defense Other variations.",
    "playerColor": "b"
  },
  {
    "id": "lic-0DioY",
    "fen": "5k2/1p2pp2/p1q2r2/7R/2pP2P1/N1Pb1PP1/PP3QK1/8 b - - 0 38",
    "moves": [
      "f6f3",
      "f2f3",
      "d3e4"
    ],
    "rating": 1563,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DipP",
    "fen": "r3r1k1/pp3ppp/3q4/n7/2Q5/1B3P2/PPP2P1P/2K3R1 w - - 0 19",
    "moves": [
      "c4f7",
      "g8h8",
      "f7g7"
    ],
    "rating": 1017,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Vienna Game,Vienna Game Stanley Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Disf",
    "fen": "8/1p6/4k1p1/6P1/2PK4/8/8/8 w - - 1 46",
    "moves": [
      "d4c5",
      "e6f5",
      "c5b6"
    ],
    "rating": 1668,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DitD",
    "fen": "8/8/b7/1p1p2Rp/1p2kP2/2r1PN2/P2K4/8 w - - 7 44",
    "moves": [
      "f3e1",
      "c3e3",
      "g5e5"
    ],
    "rating": 2452,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DiuB",
    "fen": "r5k1/2p2p1p/3q2p1/p7/2Pb2b1/P5P1/1PQ2P1P/R1B2RK1 b - - 0 17",
    "moves": [
      "d6c6",
      "f1e1",
      "c6f3",
      "c2e2",
      "f3e2",
      "e1e2",
      "g4e2"
    ],
    "rating": 2815,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot) from Zukertort Opening,Zukertort Opening Black Mustang Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dix9",
    "fen": "r3r1k1/4q1pp/p1pb1n2/2Np2B1/N2Q4/7P/PPb2PP1/R3R1K1 b - - 5 18",
    "moves": [
      "e7e1",
      "a1e1",
      "e8e1"
    ],
    "rating": 801,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Caro-Kann Defense,Caro-Kann Defense Exchange Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0DiyZ",
    "fen": "1r2r2k/3b2pp/p2P4/nppB4/3B4/2P3R1/P1P1q1PP/1R5K w - - 0 26",
    "moves": [
      "d4g7"
    ],
    "rating": 926,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dj7f",
    "fen": "1k4r1/1p2b2p/p3qp2/P1pr1p2/7P/1R2P1P1/4P1B1/1R2K3 w - - 0 24",
    "moves": [
      "b3b7",
      "b8c8",
      "b7b8",
      "c8d7",
      "b1b7",
      "d7d6",
      "b7b6",
      "d6e5",
      "b6e6",
      "e5e6",
      "g2d5"
    ],
    "rating": 2149,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dj8e",
    "fen": "2r1k2r/1p3ppp/p7/q3pPP1/1b1p4/2nB1P2/PPP2B1P/K1Q1R1R1 w k - 14 25",
    "moves": [
      "e1e5",
      "a5e5",
      "g1e1"
    ],
    "rating": 1840,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DjGY",
    "fen": "r1bq1r2/2p1nppk/p2p3p/1pb2N2/4PPQ1/1P3NB1/1PP3PP/R4R1K w - - 3 18",
    "moves": [
      "g4g7"
    ],
    "rating": 590,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Ruy Lopez,Ruy Lopez Cozio Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0DjHH",
    "fen": "2b2r1k/4NPp1/3n3p/8/1np5/1B3N1P/2P2PP1/b5K1 w - - 0 29",
    "moves": [
      "e7g6",
      "h8h7",
      "g6f8",
      "h7h8",
      "f8g6"
    ],
    "rating": 1098,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DjI8",
    "fen": "r1bq1r2/p2nk1b1/1p1pB1p1/2nPp1P1/4Pp1Q/2N5/PP3P2/R1B1K1NR w KQ - 4 18",
    "moves": [
      "h4h7",
      "f8f7",
      "h7g6"
    ],
    "rating": 2099,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Tactical Shot) from Kings Indian Defense,Kings Indian Defense Normal Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0DjK8",
    "fen": "6k1/ppQ2ppp/8/8/4r3/1P2qNK1/P2r2PP/R5R1 b - - 5 20",
    "moves": [
      "e3f2",
      "g3h3",
      "g7g5",
      "c7b8",
      "g8g7",
      "b8g3",
      "g5g4",
      "g3g4",
      "e4g4"
    ],
    "rating": 2466,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DjLB",
    "fen": "2b4Q/2b1k3/2B1p3/2P3q1/6n1/7p/5P2/6RK w - - 2 30",
    "moves": [
      "h8e8",
      "e7f6",
      "e8f8"
    ],
    "rating": 1974,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DjPh",
    "fen": "6k1/3n1q1p/p1N1p2B/1p1pP3/1P1P4/2P2rPK/P3Q3/R7 b - - 0 29",
    "moves": [
      "f7h5",
      "h3g2",
      "f3g3",
      "g2g3",
      "h5e2"
    ],
    "rating": 1247,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DjUC",
    "fen": "3r1rk1/pp2q1pp/2npb3/3Nnp2/1bP2B2/4PN1P/PP1QBPP1/R4RK1 b - - 1 14",
    "moves": [
      "e5f3",
      "e2f3",
      "b4d2",
      "d5e7",
      "c6e7"
    ],
    "rating": 1992,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot) from Indian Defense,Indian Defense Budapest Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0DjWu",
    "fen": "1r3rk1/3q1pp1/2ppb2p/P1b5/4P2N/3n2Q1/1B3PPP/RR5K w - - 0 23",
    "moves": [
      "g3g7"
    ],
    "rating": 947,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DjYX",
    "fen": "4r1k1/6pp/3pqp2/8/3QPn2/5P1P/6P1/B2R2K1 b - - 3 31",
    "moves": [
      "f4e2",
      "g1h1",
      "e2d4"
    ],
    "rating": 896,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Djhh",
    "fen": "1k1r1b1r/1p2nRp1/p1p1p2p/q2pP3/2nP2PP/1PNQ2N1/P1PB4/2KR4 b - - 0 18",
    "moves": [
      "a5a3",
      "c1b1",
      "a3b2"
    ],
    "rating": 1127,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Caro-Kann Defense,Caro-Kann Defense Advance Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0Djiv",
    "fen": "1k4r1/3pn3/1p1b4/1P2pp1p/2P5/2P2P2/R4P1P/R4K2 w - - 0 25",
    "moves": [
      "a2a8",
      "b8c7",
      "a1a7"
    ],
    "rating": 1229,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DjlU",
    "fen": "r1b2rk1/pp4pp/1bp1qp2/3pPN2/3P2Q1/4B3/PP3PPP/R4RK1 w - d6 0 16",
    "moves": [
      "g4g7"
    ],
    "rating": 818,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Petrovs Defense,Petrovs Defense Stafford Gambit.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Djy0",
    "fen": "8/8/6kp/6p1/1P4KP/2P2RP1/8/2r5 b - - 0 57",
    "moves": [
      "h6h5",
      "g4h3",
      "g5g4",
      "h3g2",
      "g4f3"
    ],
    "rating": 1594,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Djzu",
    "fen": "rn1qkb1r/1pp1p3/p4pp1/5b2/3Pp1n1/2N1B2P/PPP1Q1P1/R3KBNR w KQkq - 0 10",
    "moves": [
      "h3g4",
      "h8h1",
      "g4f5"
    ],
    "rating": 1313,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot) from Hippopotamus Defense,Hippopotamus Defense Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dk1n",
    "fen": "r1bq3k/p1p2Qpp/1p6/5n2/3PBb2/2N2P2/PP3P1P/R4RK1 b - - 3 18",
    "moves": [
      "d8g5",
      "g1h1",
      "c8e6",
      "f7f5",
      "e6f5"
    ],
    "rating": 2590,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot) from English Opening,English Opening Kings English Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dk6V",
    "fen": "2r3k1/5pp1/P2q3p/3r4/2B5/1PQ5/2P2PPP/R5K1 b - - 0 28",
    "moves": [
      "d5d1",
      "c3e1",
      "d1e1"
    ],
    "rating": 826,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dk99",
    "fen": "r5k1/3bqppp/2n2n2/p1Npr3/Pp2p3/1B4QP/1P1N1PP1/2R1R1K1 w - - 1 26",
    "moves": [
      "c5d7",
      "e7d7",
      "c1c6",
      "d7c6",
      "g3e5"
    ],
    "rating": 1549,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DkAt",
    "fen": "8/4q1k1/pp5p/2pBnQp1/3p4/P2P3P/1PP3PK/8 b - - 1 42",
    "moves": [
      "e7d6",
      "h2g1",
      "d6d5"
    ],
    "rating": 1708,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DkC4",
    "fen": "4r1k1/p1p3pp/1p4n1/6R1/2b2q2/5N1P/PQ4P1/5B1K w - - 0 30",
    "moves": [
      "g5g4",
      "f4g4",
      "h3g4"
    ],
    "rating": 2127,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DkEr",
    "fen": "r1b1k2r/pp1nb2p/1q2N3/3p1p2/3P1P2/6P1/PP5P/R1BQ1RK1 w kq - 0 18",
    "moves": [
      "d1h5"
    ],
    "rating": 1107,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Slav Defense,Slav Defense Exchange Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0DkGG",
    "fen": "3r3k/pp3ppp/5b2/6q1/4R3/6NP/PP2QPP1/6K1 w - - 1 28",
    "moves": [
      "e4e8",
      "d8e8",
      "e2e8"
    ],
    "rating": 682,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DkHq",
    "fen": "r2qkbnr/pp3ppp/2np4/2pQ4/2B1P3/2N2P1P/PPP2P2/R1B1K2R w KQkq - 2 10",
    "moves": [
      "d5f7"
    ],
    "rating": 1008,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Philidor Defense,Philidor Defense Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-0DkJI",
    "fen": "r2qk1r1/p4pp1/2Bp1n1p/b3n1B1/8/6Q1/PPP2PPP/2KR2NR b q - 0 15",
    "moves": [
      "e5c6",
      "d1d6",
      "d8e7"
    ],
    "rating": 2048,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot) from Center Game,Center Game Paulsen Attack Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0DkJq",
    "fen": "7k/1b3R1p/p6P/1p4N1/2q5/K7/P1r5/2r5 w - - 4 36",
    "moves": [
      "f7f8",
      "c4g8",
      "g5f7"
    ],
    "rating": 1338,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DkTR",
    "fen": "4r2k/Q5pp/5n2/2B5/2P5/5P2/P2q2PP/R5K1 b - - 0 27",
    "moves": [
      "e8e1",
      "a1e1",
      "d2e1"
    ],
    "rating": 922,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DkU5",
    "fen": "1r6/5p2/p4Pk1/b2pP3/3P1KP1/8/1P1p2P1/7R w - - 2 50",
    "moves": [
      "g4g5",
      "b8h8",
      "h1h8",
      "d2d1q",
      "h8h6"
    ],
    "rating": 1767,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DkYI",
    "fen": "3r4/1pb2pk1/p5p1/4Pp1p/5Q1P/P1q2N2/5PP1/4R1K1 w - - 0 35",
    "moves": [
      "e1c1",
      "c3a5",
      "f4g5",
      "c7e5",
      "f3e5"
    ],
    "rating": 2411,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DkaO",
    "fen": "4k2r/2p2ppp/2B1bn2/p3b3/2P5/PrN1P1P1/1B3P1P/R2R2K1 b k - 1 17",
    "moves": [
      "e8e7",
      "c3d5",
      "e6d5",
      "b2e5",
      "d5c6"
    ],
    "rating": 2116,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot) from Hungarian Opening,Hungarian Opening Indian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0DkbY",
    "fen": "r1b2r1k/1pq1Nppp/p4b2/3R3Q/2BpP3/7P/PP3PP1/R5K1 w - - 8 20",
    "moves": [
      "h5h7",
      "h8h7",
      "d5h5"
    ],
    "rating": 1426,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Sicilian Defense,Sicilian Defense Smith-Morra Gambit Accepted.",
    "playerColor": "w"
  },
  {
    "id": "lic-0DkcS",
    "fen": "r1r5/3k1p1p/3bnn2/4pN2/qp2P1P1/4BPN1/PKPQ3P/R7 w - - 0 28",
    "moves": [
      "d2d6",
      "d7e8",
      "d6e7"
    ],
    "rating": 1101,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dkg5",
    "fen": "1r3rk1/2q1bppp/4p3/4P3/p1QP4/1P2P3/P5PP/1RB2RK1 b - - 0 21",
    "moves": [
      "c7c4",
      "b3c4",
      "b8b1"
    ],
    "rating": 889,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DkhR",
    "fen": "2b5/4r2p/p4kpB/1p3p2/8/8/PbB2PPP/4R1K1 w - - 3 25",
    "moves": [
      "h6g5",
      "f6g5",
      "e1e7"
    ],
    "rating": 1448,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dkk0",
    "fen": "4r1k1/1pp1r1p1/p4b2/3Pq3/1P4Pp/P2P1B1P/2P2PK1/1R1QR3 b - - 4 27",
    "moves": [
      "e5e1",
      "d1e1",
      "e7e1",
      "b1e1",
      "e8e1"
    ],
    "rating": 1260,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DkmB",
    "fen": "rn1Bk2r/pp3ppp/8/2b1p3/2P1Knb1/5P2/PP4PP/R2Q1BNR b kq - 0 12",
    "moves": [
      "g4h5",
      "e4e5",
      "f4e6"
    ],
    "rating": 2390,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot) from Slav Defense,Slav Defense Diemer Gambit.",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dkn9",
    "fen": "8/8/1pp2k2/7p/PP3KpP/8/8/8 w - - 2 49",
    "moves": [
      "a4a5",
      "b6a5",
      "b4a5"
    ],
    "rating": 1177,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dkov",
    "fen": "4bk1r/1p3p1p/qn2pQn1/p2pP1N1/3P4/P7/1Pr2PPP/1R2R1K1 w - - 8 32",
    "moves": [
      "g5e6",
      "f8g8",
      "f6g7"
    ],
    "rating": 1505,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dkow",
    "fen": "1q1r1rk1/pp2b1pp/1n2R3/1Nnp3b/8/1Q3NPP/PB3PB1/R5K1 w - - 1 23",
    "moves": [
      "e6e7",
      "c5b3",
      "e7g7"
    ],
    "rating": 1935,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dksh",
    "fen": "8/6R1/8/7P/6k1/3K2p1/8/7r b - - 3 60",
    "moves": [
      "g4f3",
      "g7f7",
      "f3g2"
    ],
    "rating": 2028,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dkth",
    "fen": "r1bq1r2/pp6/1n2p2k/2ppP2P/6p1/3QP3/PPPN2P1/R3K2R w KQ - 0 19",
    "moves": [
      "d3g6"
    ],
    "rating": 654,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Queens Pawn Game,Queens Pawn Game Levitsky Attack.",
    "playerColor": "w"
  },
  {
    "id": "lic-0DkuZ",
    "fen": "r4rk1/pp4pp/1qB1pn2/3p4/8/4B3/PPP2KPP/RN1QR3 b - - 2 13",
    "moves": [
      "f6g4",
      "f2g1",
      "g4e3"
    ],
    "rating": 1693,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot) from Sicilian Defense,Sicilian Defense Marshall Counterattack.",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dkua",
    "fen": "3k1b1r/ppr2ppp/8/1B1p1b2/8/6P1/PP3P1P/2R1R1K1 w - - 0 21",
    "moves": [
      "e1e8"
    ],
    "rating": 813,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dkuv",
    "fen": "8/8/8/ppk1p3/3P4/PP1P4/3K4/8 b - - 0 42",
    "moves": [
      "c5d4",
      "d2c2",
      "d4e3",
      "c2c3",
      "e3f3",
      "c3d2",
      "f3f2",
      "b3b4",
      "a5a4"
    ],
    "rating": 2913,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dkvz",
    "fen": "6k1/2p3pp/p7/1p1p2b1/3P4/1BP3qP/PP4P1/5R1K w - - 4 35",
    "moves": [
      "b3d5",
      "g8h8",
      "f1f8"
    ],
    "rating": 844,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dl01",
    "fen": "8/3k4/p3p2p/1p2P1p1/1P1K2P1/7P/P7/8 w - - 1 50",
    "moves": [
      "d4c5",
      "d7c7",
      "a2a3",
      "c7b7",
      "c5d6"
    ],
    "rating": 1294,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dl0p",
    "fen": "r3r1k1/1bp3b1/ppq1pnpp/4Np2/2PP4/2N1B3/PP2BPPP/R2Q1RK1 b - - 3 17",
    "moves": [
      "c6g2"
    ],
    "rating": 761,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Horwitz Defense,Horwitz Defense Other variations.",
    "playerColor": "b"
  },
  {
    "id": "lic-0Dl4W",
    "fen": "8/5p2/4p3/pk2PpP1/2p1P2p/2K4P/8/8 w - - 0 48",
    "moves": [
      "e4f5",
      "e6f5",
      "e5e6",
      "f7e6",
      "g5g6"
    ],
    "rating": 1326,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dl4g",
    "fen": "4r2k/1p3p1p/p5pQ/3N1b2/P1p5/2P4P/4q1P1/5R1K w - - 1 29",
    "moves": [
      "d5f6",
      "g6g5",
      "f6h5",
      "e2f1",
      "h1h2",
      "f1f4",
      "h5f4"
    ],
    "rating": 2796,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dl5J",
    "fen": "3r1rk1/5pp1/p2p3p/1ppB1P2/2nnPP1q/P3B1R1/1P5P/R2Q2K1 w - - 1 27",
    "moves": [
      "e3d4",
      "h4g3",
      "h2g3"
    ],
    "rating": 1773,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DlAp",
    "fen": "r5rk/3np1q1/p2p4/1p3QNP/3P4/8/PPP5/2KR3R b - - 0 26",
    "moves": [
      "g7g5",
      "f5g5",
      "g8g5"
    ],
    "rating": 976,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DlAx",
    "fen": "4r1k1/p1p3p1/2p4p/2Rq1b2/3B1Q2/6P1/PP3P1P/6K1 b - - 7 27",
    "moves": [
      "e8e1"
    ],
    "rating": 934,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DlBP",
    "fen": "3rr1k1/pbp2p1p/1p2p1p1/5q2/7Q/2N5/PP3PPP/3RR1K1 w - - 4 21",
    "moves": [
      "d1d8",
      "e8d8",
      "h4d8"
    ],
    "rating": 857,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DlBb",
    "fen": "r6r/p2n1p2/1p1q1k2/6R1/2pPP1Q1/2P5/P4PPP/5RK1 b - - 0 25",
    "moves": [
      "d6h2"
    ],
    "rating": 543,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DlC2",
    "fen": "8/p7/7p/k1P1p2P/PR2Pp2/1K1P1r2/1P6/8 b - - 0 44",
    "moves": [
      "f3d3",
      "b3c4",
      "d3d4",
      "c4c3",
      "d4b4"
    ],
    "rating": 956,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DlDR",
    "fen": "5k2/5pp1/2B4p/8/p1r5/1b4P1/5PKP/4R3 w - - 6 38",
    "moves": [
      "e1e8"
    ],
    "rating": 528,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DlEZ",
    "fen": "3rr1k1/pp1qbppp/2nN1n2/8/4PB2/2N5/PP3PPP/R2QR1K1 b - - 0 14",
    "moves": [
      "e7d6",
      "d1d6",
      "d7d6",
      "f4d6",
      "d8d6"
    ],
    "rating": 1134,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Sicilian Defense,Sicilian Defense Canal Attack.",
    "playerColor": "b"
  },
  {
    "id": "lic-0DlFr",
    "fen": "8/8/2k5/7R/1p6/1r6/r6P/6RK w - - 2 46",
    "moves": [
      "g1g6",
      "c6d7",
      "h5h7",
      "d7e8",
      "g6g8"
    ],
    "rating": 1070,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0DlNr",
    "fen": "8/8/5p2/2K5/4Pk2/7p/8/7N b - - 8 59",
    "moves": [
      "f4f3",
      "c5d4",
      "f3g2",
      "d4e3",
      "g2h1",
      "e3f2",
      "h1h2"
    ],
    "rating": 2216,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0DlZT",
    "fen": "8/p4rk1/p2Q3p/3pnrp1/4p3/1P4B1/1P2qP2/6KR w - - 0 32",
    "moves": [
      "d6h6",
      "g7g8",
      "h6h8"
    ],
    "rating": 1792,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Dlbt",
    "fen": "rnb4r/pp1k1pbp/1q1p2p1/2pP2Bn/8/2N1QN2/PP2PPPP/R3KB1R w KQ - 8 11",
    "moves": [
      "e3e7"
    ],
    "rating": 860,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Benoni Defense,Benoni Defense Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-0DlgQ",
    "fen": "6k1/B5p1/1Np4p/p2n4/4p1P1/2Pb3P/1P3KP1/8 b - - 0 32",
    "moves": [
      "e4e3",
      "f2g3",
      "e3e2"
    ],
    "rating": 1131,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I7nY",
    "fen": "r4rk1/ppp1b1pp/2np1n2/4p2q/2P5/2NP2Pb/PP2NPBK/R1BQ1R2 w - - 0 12",
    "moves": [
      "g2h3",
      "f6g4",
      "h2g2"
    ],
    "rating": 1394,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot) from English Opening,English Opening Anglo-Dutch Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I7p7",
    "fen": "N6r/pb1pkN2/5n2/1pb1p1Qp/B2nP3/2Pq4/PP1P2PP/R1BK3R b - - 4 16",
    "moves": [
      "d3e2"
    ],
    "rating": 1026,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Vienna Game,Vienna Game Stanley Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0I7qV",
    "fen": "2r3k1/pp3ppp/4p3/3p4/3n2Q1/B1P4P/qP1N1PP1/2KR3R b - - 1 16",
    "moves": [
      "c8c3",
      "b2c3",
      "a2c2"
    ],
    "rating": 1573,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot) from Caro-Kann Defense,Caro-Kann Defense Exchange Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0I7rM",
    "fen": "8/1p1k1p1p/3pp1p1/3n2P1/2RB1PKP/r1N5/8/8 b - - 8 31",
    "moves": [
      "b7b5",
      "c3d5",
      "b5c4"
    ],
    "rating": 2113,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I7sj",
    "fen": "3r4/1bqn1rk1/2p1R1p1/1pP3b1/pP1P4/P7/2Q2PPP/4R1K1 w - - 0 23",
    "moves": [
      "c2g6",
      "g7f8",
      "g6g5",
      "c7f4",
      "g5d8"
    ],
    "rating": 1619,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I7wy",
    "fen": "4r1k1/pb1p2pp/1pr2p2/4P3/1PP2R2/P2K2P1/1B5P/4R3 w - - 1 26",
    "moves": [
      "e5f6",
      "c6d6",
      "d3c2"
    ],
    "rating": 1914,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I7zJ",
    "fen": "6k1/2R3p1/1pN2p1p/p1nP4/4r1P1/K1P5/PP6/8 b - - 0 35",
    "moves": [
      "e4a4"
    ],
    "rating": 962,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I7zw",
    "fen": "4q2r/p4R1p/1b4pk/2ppP3/6P1/B1P5/P1P1K2P/5R2 w - - 1 22",
    "moves": [
      "a3c1",
      "g6g5",
      "f1f6"
    ],
    "rating": 1635,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I807",
    "fen": "2kr2nr/pp1n1qb1/2pQ3p/3p2p1/3P1pP1/2NP1N1P/PP6/R1B2RK1 w - - 5 18",
    "moves": [
      "c3b5",
      "c6b5",
      "c1f4"
    ],
    "rating": 2100,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot) from Bishops Opening,Bishops Opening Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I82S",
    "fen": "r3r2k/1bp2p1p/pb1p2q1/1p2PN2/3P1p2/2P4P/PPB1QPP1/R3R1K1 b - - 2 23",
    "moves": [
      "g6g2"
    ],
    "rating": 1344,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I85l",
    "fen": "3n2k1/2r5/p2Np2p/1p1p1pp1/1P1P1P2/P1r1P1P1/B1R2K1P/2Q5 b - - 0 31",
    "moves": [
      "c3c2",
      "c1c2",
      "c7c2"
    ],
    "rating": 470,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I86l",
    "fen": "r1b2rk1/1pqn1pp1/p2bpnP1/2ppN2Q/3P1B1P/2N1P3/PPP2P2/R3K2R w KQ - 1 14",
    "moves": [
      "g6f7",
      "f8f7",
      "h5f7"
    ],
    "rating": 1512,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Rapport-Jobava System with e6,Rapport-Jobava System with e6 Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I89N",
    "fen": "r6k/p2Qb1pp/1p2B3/3pP3/3PpB2/1PPb1qP1/P6P/R5K1 b - - 2 22",
    "moves": [
      "e4e3",
      "e6d5",
      "f3f2",
      "g1h1",
      "e3e2"
    ],
    "rating": 1713,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I8AA",
    "fen": "4rrk1/1b6/p4bpp/qp5Q/3N4/2P4R/1P4P1/3R2K1 w - - 0 28",
    "moves": [
      "h5g6",
      "f6g7",
      "d4f5",
      "f8f5",
      "d1d7",
      "a5b6",
      "g6b6"
    ],
    "rating": 2772,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I8Af",
    "fen": "rnb1k1nr/pppp1ppp/4pq2/2b5/P3P3/N7/1PPP1PPP/R1BQKBNR b KQkq - 0 4",
    "moves": [
      "f6f2"
    ],
    "rating": 723,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Vant Kruijs Opening,Vant Kruijs Opening Other variations.",
    "playerColor": "b"
  },
  {
    "id": "lic-0I8Hx",
    "fen": "1r4k1/r4p2/5bpQ/4p3/1q1pB3/p5R1/6PP/R6K w - - 0 36",
    "moves": [
      "g3g6",
      "f7g6",
      "e4d5",
      "a7f7",
      "h6g6",
      "g8h8",
      "d5f7"
    ],
    "rating": 2326,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I8L7",
    "fen": "6k1/7p/p2Bp1pQ/1p1p4/1Pq1b1B1/P1b5/6PP/R6K b - - 3 24",
    "moves": [
      "e4g2",
      "h1g1",
      "c4d4",
      "g1g2",
      "d4g4"
    ],
    "rating": 2120,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I8Ow",
    "fen": "2k3r1/1ppq1p1p/p2p2r1/2b1p3/4P3/PB1P3P/1PP1QPRK/6R1 b - - 2 20",
    "moves": [
      "d7h3",
      "h2h3",
      "g6h6",
      "e2h5",
      "h6h5"
    ],
    "rating": 1768,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I8Pq",
    "fen": "2kr1r2/pp2p3/2p1p3/q3b2p/2N1BPnP/2P5/P1Q3P1/R1B2RK1 b - - 1 19",
    "moves": [
      "a5c5",
      "g1h1",
      "c5c4"
    ],
    "rating": 1307,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Pirc Defense,Pirc Defense Other variations.",
    "playerColor": "b"
  },
  {
    "id": "lic-0I8XT",
    "fen": "4r1k1/1p1q1pp1/p1np3p/1p1B4/1P6/P4Q1P/5PP1/4RK2 w - - 6 28",
    "moves": [
      "f3f7",
      "d7f7",
      "e1e8",
      "g8h7",
      "d5f7"
    ],
    "rating": 2006,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I8Xn",
    "fen": "r4rk1/1ppq1ppp/1p6/4p1Qb/4N2n/3P1P2/PPP3PP/R3R1K1 w - - 0 18",
    "moves": [
      "e4f6",
      "g8h8",
      "f6d7"
    ],
    "rating": 1159,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Tactical Shot) from Four Knights Game,Four Knights Game Italian Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I8b2",
    "fen": "3r1rk1/ppq2pp1/5b1p/3p1b2/8/2PB1Q2/PP3PPP/R3R1K1 w - - 0 18",
    "moves": [
      "f3f5",
      "g7g6",
      "f5f6"
    ],
    "rating": 1370,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot) from Queens Pawn Game,Queens Pawn Game Zukertort Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I8cH",
    "fen": "2kr2nr/p1p2ppp/1p2p3/2b5/1P6/P2B1b1P/2P2PP1/R1BR2K1 w - - 0 17",
    "moves": [
      "d3a6",
      "f3b7",
      "a6b7",
      "c8b7",
      "d1d8"
    ],
    "rating": 1503,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Scandinavian Defense,Scandinavian Defense Mieses-Kotroc Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I8in",
    "fen": "8/8/p5pp/1p1k3P/1P4P1/P2K4/8/8 b - - 0 45",
    "moves": [
      "g6g5",
      "d3e3",
      "d5e5"
    ],
    "rating": 2155,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I8mi",
    "fen": "r2q1bnr/pp1nk1p1/6Qp/3pPp2/3p4/2N5/PPP3PP/R1B1K2R w KQ - 0 14",
    "moves": [
      "c3d5"
    ],
    "rating": 1724,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Caro-Kann Defense,Caro-Kann Defense Advance Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I8rO",
    "fen": "5r2/5pk1/2p2qp1/pp6/7R/7P/6P1/Q6K w - - 4 47",
    "moves": [
      "h4h7",
      "g7h7",
      "a1f6"
    ],
    "rating": 1072,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I8uS",
    "fen": "5rk1/5R1p/6p1/3p4/3q4/6PQ/Pr4PP/5R1K b - - 0 28",
    "moves": [
      "f8f7",
      "h3c8",
      "g8g7",
      "f1f7",
      "g7f7"
    ],
    "rating": 1143,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I8x9",
    "fen": "1k6/pp6/8/3N1p2/2QP1P2/4PKP1/1P1q3r/4b1B1 w - - 2 39",
    "moves": [
      "c4c7",
      "b8a8",
      "c7c8"
    ],
    "rating": 948,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I8yN",
    "fen": "r2r2Q1/pp2k2B/1qp2p2/8/2P5/b3PP2/P1K5/6RQ b - - 2 33",
    "moves": [
      "b6b2"
    ],
    "rating": 837,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I8yl",
    "fen": "8/8/6p1/4kp2/1pP5/2P2P2/P7/1K6 b - - 0 57",
    "moves": [
      "g6g5",
      "b1c2",
      "g5g4",
      "f3g4",
      "f5g4"
    ],
    "rating": 2435,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I90s",
    "fen": "2r2rk1/1b1nqpp1/p3p2p/1p1pP3/5P2/2PQ1N2/PPB3PP/R4RK1 w - - 4 19",
    "moves": [
      "d3h7"
    ],
    "rating": 417,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Queens Pawn Game,Queens Pawn Game Zukertort Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I916",
    "fen": "8/7K/7P/8/5k2/8/2R1p1r1/8 b - - 0 50",
    "moves": [
      "g2f2",
      "c2e2",
      "f2e2",
      "h7g6",
      "e2e6"
    ],
    "rating": 2741,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I93a",
    "fen": "r6k/1b4r1/p1n1Q2B/1pbP4/2p4q/2P5/PP3PPP/R2R2K1 w - - 3 22",
    "moves": [
      "h6g7",
      "h8g7",
      "d5c6"
    ],
    "rating": 2037,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I93h",
    "fen": "8/8/5p2/1pk1p1p1/4P2p/PK2PP1P/8/8 b - - 2 40",
    "moves": [
      "f6f5",
      "e4f5",
      "e5e4"
    ],
    "rating": 2016,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I95t",
    "fen": "4r2k/5Rp1/p6p/1pp5/3Pp1bq/P1P3r1/1PB3P1/R4QK1 w - - 0 34",
    "moves": [
      "f7f8",
      "h8h7",
      "f8e8",
      "g4f3",
      "f1f3",
      "g3f3",
      "c2e4"
    ],
    "rating": 2242,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I979",
    "fen": "3rr1k1/pp3pp1/1q2pn1p/2n5/1P6/2b1BQ2/P1B2PPP/R3R1K1 w - - 0 20",
    "moves": [
      "e3c5",
      "b6c6",
      "f3c3"
    ],
    "rating": 1779,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9DR",
    "fen": "8/q5k1/2b1p2p/1p1p3P/1PpP2p1/r1P1b1P1/6K1/1Q3R2 w - - 0 41",
    "moves": [
      "b1g6",
      "g7h8",
      "f1f8"
    ],
    "rating": 1012,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9GF",
    "fen": "r2q1rk1/1b3ppp/1p2p3/p2pN1P1/1b1P1P2/1PnBP3/7P/1RBQ1RK1 w - - 2 17",
    "moves": [
      "d3h7",
      "g8h7",
      "d1h5",
      "h7g8",
      "f1f3"
    ],
    "rating": 2358,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot) from Bird Opening,Bird Opening Dutch Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9Gj",
    "fen": "5r2/7Q/6p1/4p1k1/4q1P1/2p2r2/2Pb2RP/R6K w - - 1 42",
    "moves": [
      "h2h4",
      "g5f4",
      "h7h6",
      "g6g5",
      "h6g5"
    ],
    "rating": 1579,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9II",
    "fen": "r3k2r/p1Q4p/b1p1p3/6p1/4P3/2N1b3/PPP1B1qP/R2K4 w kq - 0 19",
    "moves": [
      "e2h5",
      "e8f8",
      "c7f7"
    ],
    "rating": 1623,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Sicilian Defense,Sicilian Defense Accelerated Dragon.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9Ik",
    "fen": "r1b1kb1r/p4ppp/4pn2/1q1N4/8/8/PPPB1PPP/R2QK2R w KQkq - 0 12",
    "moves": [
      "d5c7",
      "e8e7",
      "c7b5"
    ],
    "rating": 826,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot) from Sicilian Defense,Sicilian Defense Open.",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9LS",
    "fen": "8/8/7p/3P4/4K3/5p2/P2r1k2/7R w - - 0 43",
    "moves": [
      "h1h2",
      "f2e1",
      "h2d2",
      "e1d2",
      "e4f3"
    ],
    "rating": 1422,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9Pf",
    "fen": "4r1k1/pp3rbp/2n3p1/8/P7/1P1QB3/2R3P1/6K1 b - - 5 32",
    "moves": [
      "e8e3",
      "d3e3",
      "g7d4",
      "e3d4",
      "c6d4"
    ],
    "rating": 1903,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I9TB",
    "fen": "2r1k2r/Qn1b1pp1/2pb1q1p/4p3/B7/2NP4/PPP2PPP/R1B1R1K1 b k - 0 17",
    "moves": [
      "d6c5",
      "c3e4",
      "c5a7",
      "e4f6",
      "g7f6"
    ],
    "rating": 1631,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot) from Italian Game,Italian Game Two Knights Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0I9TY",
    "fen": "4rrk1/p4p2/1p1p4/2nP4/2P1PQN1/P1b4q/5P2/2R2RK1 w - - 0 25",
    "moves": [
      "c1c3",
      "h3c3",
      "g4f6",
      "c3f6",
      "f4f6"
    ],
    "rating": 2145,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9Wc",
    "fen": "2r3k1/qR3ppp/4p3/p1Np4/P2P1b2/3Q3P/P4PP1/6K1 b - - 1 24",
    "moves": [
      "a7b7",
      "c5b7",
      "c8c1"
    ],
    "rating": 1615,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I9Y5",
    "fen": "8/2R2p2/3p1p2/5P2/2P1bkP1/6pP/4K3/8 b - - 0 48",
    "moves": [
      "e4d3",
      "e2d3",
      "g3g2"
    ],
    "rating": 1970,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I9Zj",
    "fen": "r1b1r1k1/pp3pbp/2nq1np1/2p1p1B1/7P/1PPBPN2/P1QN1PP1/R3K2R b KQ - 3 12",
    "moves": [
      "e5e4",
      "d3e4",
      "f6e4",
      "d2e4",
      "e8e4",
      "a1d1",
      "d6e6"
    ],
    "rating": 1930,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot) from Modern Defense,Modern Defense Other variations.",
    "playerColor": "b"
  },
  {
    "id": "lic-0I9bB",
    "fen": "1r3r2/5pkp/2p2qp1/p3n3/3Q4/1PN5/P1P2PPP/4RRK1 b - - 6 21",
    "moves": [
      "e5f3",
      "g2f3",
      "f6d4"
    ],
    "rating": 870,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I9bI",
    "fen": "5r1k/7p/p3p3/6b1/2NPQ3/PP2pq2/7P/6RK w - - 3 34",
    "moves": [
      "e4f3",
      "f8f3",
      "c4e5",
      "f3f8",
      "g1g5"
    ],
    "rating": 2237,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9dT",
    "fen": "8/8/1p4k1/p2p2p1/P2P1pPP/5K2/1P6/8 w - - 1 37",
    "moves": [
      "h4g5",
      "g6g5",
      "b2b3",
      "g5g6",
      "f3f4"
    ],
    "rating": 1931,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9f7",
    "fen": "k2rr3/pp3ppp/8/1P1qn3/3pQB2/5P2/P4P1P/2R2RK1 w - - 4 22",
    "moves": [
      "c1c8",
      "d8c8",
      "e4d5"
    ],
    "rating": 1642,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9fa",
    "fen": "4r2k/5Qpp/8/2P5/7q/7P/5PP1/6K1 w - - 0 40",
    "moves": [
      "f7e8"
    ],
    "rating": 501,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9fx",
    "fen": "2r3k1/1p3pp1/4pn1p/3p2P1/qr1P3P/2PQ1P2/1K2N3/R6R w - - 0 24",
    "moves": [
      "c3b4",
      "a4b4",
      "d3b3",
      "b4d2",
      "b2b1"
    ],
    "rating": 1920,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9kn",
    "fen": "3r3k/1q4pp/5p2/4p3/2n1P3/2P2N1P/1P3PP1/3R2K1 w - - 0 36",
    "moves": [
      "d1d8"
    ],
    "rating": 407,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9mq",
    "fen": "r4rk1/1bp2p2/p2p2n1/1p3B1Q/8/2N1b3/PPP3PP/R6K b - - 1 21",
    "moves": [
      "b7g2",
      "h1g2",
      "g6f4",
      "g2f3",
      "f4h5"
    ],
    "rating": 1273,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I9nr",
    "fen": "1r1q1rk1/1b3pbp/1p4p1/1N3n2/1P1P4/6PP/1B3PB1/1R1Q1RK1 b - - 0 21",
    "moves": [
      "b7g2",
      "g1g2",
      "d8d5",
      "d1f3",
      "d5b5"
    ],
    "rating": 1377,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I9qO",
    "fen": "k1r2r2/Pp1qb2p/1R2p1p1/3pP3/3P4/8/1Q3PPP/1R4K1 w - - 9 31",
    "moves": [
      "b6b7",
      "c8c1",
      "b2c1",
      "d7b7",
      "b1b7"
    ],
    "rating": 1818,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0I9xf",
    "fen": "2k5/1p3pp1/1Bp5/P5Pp/4Q1qP/2N2n2/1PP5/1K6 b - - 0 30",
    "moves": [
      "f3d2",
      "b1c1",
      "d2e4"
    ],
    "rating": 1064,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I9yN",
    "fen": "2k5/8/ppr5/4n3/KP1nN3/4R3/P2R3P/8 b - - 0 38",
    "moves": [
      "b6b5",
      "a4a3",
      "e5c4"
    ],
    "rating": 1402,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0I9yg",
    "fen": "1R4k1/6pp/8/p2b1P2/4r1P1/P6P/8/6BK b - - 2 40",
    "moves": [
      "e4e8",
      "h1h2",
      "e8b8"
    ],
    "rating": 1620,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IA1R",
    "fen": "8/5k2/p4p2/1pq5/2P5/7b/5Q1P/2R3K1 b - - 3 35",
    "moves": [
      "c5g5",
      "f2g3",
      "g5c1"
    ],
    "rating": 1088,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IA6I",
    "fen": "3r3k/r1p3pp/1p1p1p2/1P2p3/P2bP3/3PB3/1q2RPPP/R2Q2K1 b - - 9 30",
    "moves": [
      "b2a1",
      "d1a1",
      "d4a1"
    ],
    "rating": 1327,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IABy",
    "fen": "2r3k1/1pq1B2p/p5pQ/P3p2n/4P1b1/1N6/1nP3BP/5RK1 w - - 3 29",
    "moves": [
      "f1f8",
      "c8f8",
      "h6f8"
    ],
    "rating": 1136,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IACB",
    "fen": "3r2k1/1pQ3bp/p5p1/8/4rp2/P4q2/1P3P1P/4R1K1 w - - 0 26",
    "moves": [
      "c7d8",
      "g7f8",
      "d8d5"
    ],
    "rating": 1386,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IACu",
    "fen": "5k2/6p1/4p1P1/4P3/1R1K1P2/1p1P4/5r2/8 b - - 2 39",
    "moves": [
      "f2f4",
      "d4c3",
      "f4b4",
      "c3b4",
      "b3b2"
    ],
    "rating": 1486,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IAEA",
    "fen": "r3rqk1/1p6/2pp3P/p3npBP/6b1/2N5/PPQ2N2/2K2R2 w - - 2 26",
    "moves": [
      "f2g4",
      "e5g4",
      "f1f5"
    ],
    "rating": 1541,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IAGi",
    "fen": "2r3k1/pQ3p2/4b1p1/4N1b1/8/7P/PP4P1/7K b - - 0 31",
    "moves": [
      "c8c1",
      "h1h2",
      "g5f4"
    ],
    "rating": 844,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IAHg",
    "fen": "qk5r/1nr3pp/1Qp1pn2/3p3P/3P1P2/1NNPP3/P2K4/1R6 w - - 7 30",
    "moves": [
      "b3c5",
      "b8c8",
      "c5a6"
    ],
    "rating": 2469,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IALp",
    "fen": "8/8/8/4pK2/1p2P2p/3k1P1P/8/3Bb3 b - - 6 55",
    "moves": [
      "e1g3",
      "d1b3",
      "d3c3"
    ],
    "rating": 1978,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IAQN",
    "fen": "5b2/6kp/1p2Prp1/p1p2P2/P7/2Q3P1/1P2q3/5RK1 w - - 4 39",
    "moves": [
      "f1e1",
      "e2e1",
      "c3e1"
    ],
    "rating": 1822,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IAVX",
    "fen": "3q1rk1/3n1pp1/2pbpn1p/rp1pN3/3P1P2/P1NPPR2/3B2PP/R2Q2K1 w - - 0 15",
    "moves": [
      "e5c6",
      "d8a8",
      "c6a5"
    ],
    "rating": 1580,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Queens Pawn Game,Queens Pawn Game Mason Attack.",
    "playerColor": "w"
  },
  {
    "id": "lic-0IAnQ",
    "fen": "1kr3q1/2p2R2/1pQp4/p2Pp1rp/P1P1P3/1P6/5RPP/6K1 b - - 5 30",
    "moves": [
      "g5g2",
      "f2g2",
      "g8f7"
    ],
    "rating": 1136,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IApn",
    "fen": "3Q4/6pk/2q4p/2p2p2/1pP2Pn1/1P3QP1/4p1KP/3R4 b - - 0 45",
    "moves": [
      "g4e3",
      "g2f2",
      "c6f3",
      "f2f3",
      "e2d1q",
      "d8d1",
      "e3d1"
    ],
    "rating": 2072,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IArp",
    "fen": "2k5/p1p4b/8/2P1q3/2B2nPp/P6P/5P1K/3R1R2 w - - 5 31",
    "moves": [
      "c4a6",
      "c8b8",
      "d1d8"
    ],
    "rating": 1400,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IB5c",
    "fen": "8/1R2b1k1/7p/2p1pPP1/8/1P6/4p1r1/4K3 w - - 0 38",
    "moves": [
      "f5f6",
      "g7f7",
      "b7e7",
      "f7f8",
      "g5h6",
      "g2g6",
      "h6h7"
    ],
    "rating": 2301,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IB8w",
    "fen": "8/Q4ppk/p7/8/P2KN3/8/6q1/8 b - - 3 45",
    "moves": [
      "g2g1",
      "d4d3",
      "g1a7"
    ],
    "rating": 1366,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IBAF",
    "fen": "r1r2nk1/1p4q1/p2bpQB1/3p2P1/3P4/8/PPPB1P2/2K4R w - - 5 25",
    "moves": [
      "g6f7",
      "g7f7",
      "f6h8"
    ],
    "rating": 1769,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IBDD",
    "fen": "k1r5/pp3pb1/4q1p1/3Q2P1/2n5/PN6/1PP2P2/1KB4B w - - 1 28",
    "moves": [
      "d5b7"
    ],
    "rating": 725,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IBFd",
    "fen": "r3kb1r/1b3ppp/p7/1pn1qPB1/8/3B4/PPPQ2PP/1K1R4 w kq - 0 18",
    "moves": [
      "d3b5",
      "a6b5",
      "d2d8",
      "a8d8",
      "d1d8"
    ],
    "rating": 2073,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — uncover the master-level combination (Tactical Shot) from Sicilian Defense,Sicilian Defense Najdorf Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0IBLR",
    "fen": "8/5p2/8/4k1pp/6P1/4KP1P/8/8 b - - 0 52",
    "moves": [
      "h5h4",
      "e3e2",
      "e5f4",
      "e2f2",
      "f7f6",
      "f2e2",
      "f4g3"
    ],
    "rating": 1954,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IBMQ",
    "fen": "7k/7p/1p2p3/p5R1/8/1P6/Pr3rPP/2R3K1 w - - 0 27",
    "moves": [
      "c1c8",
      "f2f8",
      "c8f8"
    ],
    "rating": 807,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IBNE",
    "fen": "2r3k1/q4pp1/P6p/3R4/3Q4/7P/5PPK/R1r5 b - - 3 28",
    "moves": [
      "a7d4",
      "d5d4",
      "c1a1"
    ],
    "rating": 1654,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IBao",
    "fen": "3q2k1/5pbp/1p4p1/1Pn1r3/rQ2P3/4B1P1/5PBP/1R1R2K1 b - - 7 23",
    "moves": [
      "d8d1",
      "b1d1",
      "a4b4"
    ],
    "rating": 1404,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IBcL",
    "fen": "8/p7/3k4/PP1pp3/8/3P1K2/8/8 b - - 2 37",
    "moves": [
      "d6c5",
      "b5b6",
      "a7b6",
      "a5b6",
      "c5b6"
    ],
    "rating": 1538,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IBhi",
    "fen": "r1bqkbnr/1p1npppp/p7/2p5/2N5/2N5/PPPPQPPP/R1B1KB1R w KQkq - 0 8",
    "moves": [
      "c4d6"
    ],
    "rating": 905,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Scandinavian Defense,Scandinavian Defense Main Line.",
    "playerColor": "w"
  },
  {
    "id": "lic-0IBo4",
    "fen": "r7/pp1nqrbk/6pp/P3Pp2/2Pp1B2/R3NP2/6K1/2Q4R w - - 0 31",
    "moves": [
      "e3d5",
      "e7e6",
      "d5c7"
    ],
    "rating": 2341,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IBpi",
    "fen": "6rk/pppbbq1p/4p1r1/3pPp2/5P2/2PBP2Q/PP1K3R/7R w - - 0 24",
    "moves": [
      "h3h7",
      "f7h7",
      "h2h7"
    ],
    "rating": 400,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IBtS",
    "fen": "8/2rk4/5R2/p3p2p/P3p3/3bP1PP/5P2/B5K1 b - - 0 39",
    "moves": [
      "c7c1",
      "g1h2",
      "c1a1"
    ],
    "rating": 819,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IBuA",
    "fen": "r2q1rk1/1b2bpp1/p2p1n1p/8/2B5/5N1P/PB3PP1/1R1Q1RK1 w - - 2 19",
    "moves": [
      "b2f6",
      "b7f3",
      "f6e7",
      "f3d1",
      "e7d8"
    ],
    "rating": 1678,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from English Opening,English Opening Kings English Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0IByz",
    "fen": "1r1r2k1/5p1p/6p1/1P6/1R5P/4PbP1/1R2NP2/6K1 b - - 0 42",
    "moves": [
      "d8d1",
      "g1h2",
      "d1h1"
    ],
    "rating": 829,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IBz6",
    "fen": "8/pq2r1pk/1r1R2p1/2p3Pn/4P2P/1P3Q2/P1P5/1K1R4 w - - 0 31",
    "moves": [
      "d6g6",
      "h5f4",
      "g6b6"
    ],
    "rating": 2398,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IC0n",
    "fen": "r4rk1/pp3pp1/2p1pn1p/7q/3PN3/2P5/PP2QPP1/R4RK1 w - - 0 19",
    "moves": [
      "e4f6",
      "g7f6",
      "e2h5"
    ],
    "rating": 835,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot) from Caro-Kann Defense,Caro-Kann Defense Classical Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0IC3e",
    "fen": "1k1r4/pbqn4/2p2p2/2b1p3/P3P3/2Q3P1/1B1RB1PK/3R4 b - - 0 29",
    "moves": [
      "d8h8",
      "e2h5",
      "h8h5"
    ],
    "rating": 763,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IC4r",
    "fen": "r4rk1/p2p1pp1/1p6/4PNPp/7Q/2q5/6PP/4R1K1 w - - 1 31",
    "moves": [
      "f5e7",
      "g8h7",
      "h4h5"
    ],
    "rating": 937,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IC62",
    "fen": "8/pp6/1kp5/3r1R2/8/1PKP4/P7/8 w - - 5 32",
    "moves": [
      "f5d5",
      "c6d5",
      "c3d4",
      "b6c6",
      "d4e5"
    ],
    "rating": 1954,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0IC71",
    "fen": "8/3k2p1/1p3p2/1NbP1n2/4R2P/P6P/1P6/5K2 b - - 1 38",
    "moves": [
      "f5g3",
      "f1g2",
      "g3e4"
    ],
    "rating": 976,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0IC8o",
    "fen": "7r/P3r2P/KPk5/2P5/8/4pp2/6RR/8 b - - 1 76",
    "moves": [
      "f3g2",
      "h2g2",
      "e3e2",
      "g2g8",
      "e7e8"
    ],
    "rating": 2632,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0ICEP",
    "fen": "8/5p1p/p2k4/2BP4/4PKp1/5pP1/5P1P/8 b - - 0 35",
    "moves": [
      "d6c5",
      "f4g4",
      "a6a5",
      "g4f3",
      "a5a4"
    ],
    "rating": 1245,
    "theme": "Endgame",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Endgame).",
    "playerColor": "b"
  },
  {
    "id": "lic-0ICG3",
    "fen": "R7/8/8/3r1k2/P5pp/7P/6PK/8 b - - 1 51",
    "moves": [
      "g4g3",
      "h2g1",
      "d5d1"
    ],
    "rating": 849,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MVrz",
    "fen": "4k3/pp3p2/1b2p1p1/1Q1pP1N1/5qp1/1P6/P6P/6RK b - - 3 32",
    "moves": [
      "e8e7",
      "g1f1",
      "f4g5",
      "b5b4",
      "e7e8"
    ],
    "rating": 2233,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MVtK",
    "fen": "k6r/p5pp/2q5/4Q3/1P2P3/rN6/2P3PP/2KR4 b - - 0 35",
    "moves": [
      "a3b3",
      "d1d6",
      "c6c4",
      "e5d5",
      "c4d5"
    ],
    "rating": 2297,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MVvA",
    "fen": "r3k2r/pp4pp/2p2n2/4nb2/1QP1p3/2NBP3/PP1B1PPP/2KR3R b kq - 0 14",
    "moves": [
      "e5d3",
      "c1b1",
      "d3b4"
    ],
    "rating": 740,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot) from English Opening,English Opening Anglo-Dutch Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MVwk",
    "fen": "8/8/1qbkpNp1/2p1p1Pp/1P1nP3/K1QP3P/8/3B4 b - - 0 47",
    "moves": [
      "d4b5",
      "a3b2",
      "b5c3"
    ],
    "rating": 1686,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MW0b",
    "fen": "6k1/6p1/1qQ5/4N3/8/2p5/6PP/5K2 b - - 0 31",
    "moves": [
      "b6c6",
      "e5c6",
      "c3c2",
      "f1e2",
      "c2c1q"
    ],
    "rating": 1598,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MW25",
    "fen": "6k1/1p2P2r/p3N3/1q1pP1P1/6rn/2P4P/PP6/4RR1K w - - 0 35",
    "moves": [
      "f1f8"
    ],
    "rating": 1161,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MW28",
    "fen": "r2q4/pp4k1/3p2p1/2pPp1N1/3nP3/2N5/PPP2Q2/2K3Rr w - - 0 23",
    "moves": [
      "f2f7",
      "g7h8",
      "g1h1"
    ],
    "rating": 1504,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MW7S",
    "fen": "8/p5rk/1p6/4Q3/2qP1B2/5b1P/PP2RP2/5K2 b - - 9 34",
    "moves": [
      "f3e2",
      "e5e2",
      "g7g1",
      "f1g1",
      "c4e2"
    ],
    "rating": 1696,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MW9J",
    "fen": "2r2r1k/p6p/1p6/4Pp2/2q2p2/2Q4R/P5RP/7K w - - 0 31",
    "moves": [
      "h3h7",
      "h8h7",
      "c3h3"
    ],
    "rating": 1695,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MW9f",
    "fen": "r2qk2r/1pp1bppp/p2p4/3P4/3p4/3P1B1P/PPPQ1PP1/2KR3R b kq - 1 13",
    "moves": [
      "e7g5",
      "d1e1",
      "e8f8"
    ],
    "rating": 1208,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Zukertort Opening,Zukertort Opening Wade Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MWBS",
    "fen": "rb2k1r1/p1q2p1p/2n1pp2/2Pp4/3N4/P3P1PP/4QPK1/RN3R2 b q - 2 19",
    "moves": [
      "g8g3",
      "f2g3",
      "c7g3",
      "g2h1",
      "g3h3",
      "h1g1",
      "h3g3"
    ],
    "rating": 2337,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot) from Zukertort Opening,Zukertort Opening Slav Invitation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MWBU",
    "fen": "b1r2rk1/5ppp/pN2pn2/3q4/3p4/1QPN4/PP3PPP/R3R1K1 b - - 3 20",
    "moves": [
      "d5g2"
    ],
    "rating": 891,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MWDk",
    "fen": "7R/4kpp1/3rpq1p/1BB5/8/8/PP3PPK/5R2 b - - 0 24",
    "moves": [
      "f6e5",
      "h2g1",
      "e5c5"
    ],
    "rating": 1615,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MWEr",
    "fen": "rq3rk1/p1p2ppp/2p1b1n1/R7/3Q4/1P2B3/P1P2PPP/RN4K1 b - - 0 16",
    "moves": [
      "f8d8",
      "d4d8",
      "b8d8"
    ],
    "rating": 1409,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot) from Ruy Lopez,Ruy Lopez Steinitz Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MWF6",
    "fen": "8/2P1Np2/p4kp1/1p6/1P1q4/7P/P5B1/7K w - - 1 43",
    "moves": [
      "e7d5",
      "f6g7",
      "c7c8q",
      "d4a1",
      "h1h2"
    ],
    "rating": 1940,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWFn",
    "fen": "1rb2rk1/p1p2pbq/1p4p1/4p3/6P1/4PB2/PPPN4/R2Q1KR1 w - - 2 19",
    "moves": [
      "g1h1",
      "h7h1",
      "f3h1"
    ],
    "rating": 1069,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot) from East Indian Defense,East Indian Defense Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWH8",
    "fen": "r1b2r1k/4bp1p/pq1ppp2/1p2P2Q/3N1P1P/2N3P1/PPP5/1K1n1B1R w - - 0 19",
    "moves": [
      "e5f6",
      "b6d4",
      "f1d3",
      "d4d3",
      "f6e7",
      "d1c3",
      "b2c3"
    ],
    "rating": 2784,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot) from Sicilian Defense,Sicilian Defense Closed.",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWHq",
    "fen": "r4rk1/pp3p1p/1qn5/2b4Q/4n2p/2P2N1P/PPB2PP1/RN3RK1 b - - 0 16",
    "moves": [
      "c5f2",
      "f1f2",
      "b6f2"
    ],
    "rating": 1109,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot) from French Defense,French Defense Exchange Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MWKP",
    "fen": "6k1/r1q2p1p/1P4p1/2P5/4Q3/5rPP/5P1K/R1R5 b - - 0 42",
    "moves": [
      "f3f2",
      "e4g2",
      "f2g2"
    ],
    "rating": 1008,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MWLO",
    "fen": "2r3k1/p2r3p/2q1NQp1/2Pp4/P2P4/4b3/6P1/5R1K w - - 2 31",
    "moves": [
      "f6f8",
      "c8f8",
      "f1f8"
    ],
    "rating": 1144,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWM1",
    "fen": "1kr4r/1p1b1p2/p3pQpp/4P3/3q4/3B4/PP4PP/2RR3K w - - 4 28",
    "moves": [
      "d3f1",
      "d4a4",
      "b2b3"
    ],
    "rating": 2570,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWMD",
    "fen": "8/6pp/4Np1k/3r4/4K3/5PR1/8/8 b - - 8 57",
    "moves": [
      "d5e5",
      "e4f4",
      "e5e6"
    ],
    "rating": 1185,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MWOd",
    "fen": "3r1rk1/p4pb1/2p3p1/Np5P/6Bq/PP5P/2Q5/2B2R1K b - - 2 28",
    "moves": [
      "f7f5",
      "c2f2",
      "h4f2"
    ],
    "rating": 2182,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MWT6",
    "fen": "3k4/r4pR1/4pP2/P2pP3/BKpP4/8/7r/8 w - - 3 49",
    "moves": [
      "g7g8",
      "d8c7",
      "g8f8",
      "h2b2",
      "b4c3"
    ],
    "rating": 2389,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWTb",
    "fen": "8/5k2/5p2/7p/2q1BN2/5PK1/6P1/8 w - - 5 43",
    "moves": [
      "e4d5",
      "c4d5",
      "f4d5"
    ],
    "rating": 914,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWU8",
    "fen": "r1bqr1k1/pp3p1p/4pbpQ/3pN3/5P2/7R/PPP1KPPP/R7 w - - 3 17",
    "moves": [
      "h6h7",
      "g8f8",
      "h7f7"
    ],
    "rating": 1334,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Rapport-Jobava System,Rapport-Jobava System Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWam",
    "fen": "8/1p6/pn6/3PPkpp/3K4/1P5P/P5P1/8 w - - 2 41",
    "moves": [
      "g2g4",
      "h5g4",
      "h3g4",
      "f5g6",
      "d4c5"
    ],
    "rating": 2489,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWbV",
    "fen": "8/p2k1p2/3p4/P2Pp1N1/6r1/2p1K3/2B5/8 w - - 0 46",
    "moves": [
      "c2f5",
      "d7e7",
      "f5g4",
      "c3c2",
      "e3d2",
      "c2c1r",
      "d2c1"
    ],
    "rating": 1124,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWct",
    "fen": "r4rk1/3p1p1p/6pQ/1b1N1P2/pp2P3/1P6/q5P1/1RKR4 w - - 0 36",
    "moves": [
      "d5f6",
      "g8h8",
      "h6h7"
    ],
    "rating": 1347,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWd4",
    "fen": "2kr3r/2pbqp2/Np2p2p/6p1/2QPp3/P1P1n2P/1P4P1/2K5 w - - 2 26",
    "moves": [
      "c4c7"
    ],
    "rating": 585,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWde",
    "fen": "r4r2/p1b1qpk1/1p2pNp1/4P1PP/3P1B1Q/8/p3N3/2nK2R1 w - - 0 34",
    "moves": [
      "h5g6",
      "f8h8",
      "h4h6",
      "h8h6",
      "g5h6",
      "g7h8",
      "g6g7"
    ],
    "rating": 2053,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWeM",
    "fen": "8/2r2pkp/4pNp1/1p2P3/1Ppq1PQ1/6RP/1r4PK/8 w - - 2 35",
    "moves": [
      "g4h4",
      "c7c8",
      "h4h7"
    ],
    "rating": 2349,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWiW",
    "fen": "4rk2/p4p1p/1p3p2/7b/2Pn4/1P2B1PP/P4PK1/4R3 w - - 6 27",
    "moves": [
      "e3h6",
      "f8g8",
      "e1e8"
    ],
    "rating": 843,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWl8",
    "fen": "r2qkb1r/3p1ppp/p3p3/1p6/3Nn3/1QPn4/PP3PPP/RNB2RK1 w kq - 1 13",
    "moves": [
      "b3c2",
      "e4c5",
      "b2b4",
      "d3c1",
      "b4c5"
    ],
    "rating": 1877,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Sicilian Defense,Sicilian Defense OKelly Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWmQ",
    "fen": "r1q1k2r/1ppb3p/p1n1p3/3pPpb1/3P4/P1N5/1PPN2PP/R2Q1RK1 w kq - 0 15",
    "moves": [
      "d1h5",
      "e8f8",
      "h5g5"
    ],
    "rating": 1008,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot) from French Defense,French Defense La Bourdonnais Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWmV",
    "fen": "r3r2k/4qp2/2p1b1p1/3n2N1/1bBP2pP/p7/PPQ2P2/1KBR3R w - - 0 24",
    "moves": [
      "h4h5",
      "h8g7",
      "h5g6"
    ],
    "rating": 2039,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWnN",
    "fen": "r3kb1r/pp3ppp/q1n1p2n/2p1P3/3P1P2/1QP2B2/P5PP/RNB2R1K b kq - 0 12",
    "moves": [
      "a6f1"
    ],
    "rating": 591,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Sicilian Defense,Sicilian Defense McDonnell Attack.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MWoY",
    "fen": "8/1k6/6p1/7p/3P4/4K2P/8/8 w - - 0 54",
    "moves": [
      "e3f4",
      "b7c6",
      "f4g5",
      "c6d5",
      "g5g6"
    ],
    "rating": 1805,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MWwg",
    "fen": "2rk4/pQpq1rpp/B1p5/5b2/2P2n2/1P3P2/P3p1PP/RN2R1K1 w - - 2 23",
    "moves": [
      "b7c8",
      "d7c8",
      "a6c8"
    ],
    "rating": 2083,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MX1P",
    "fen": "6k1/6pp/5p2/pb2P3/8/2R1P1B1/5KPP/3r4 b - - 0 35",
    "moves": [
      "d1f1"
    ],
    "rating": 1202,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MX2U",
    "fen": "4kr2/6p1/5p2/4p2p/r6P/1P1N4/2P1R3/2K2R2 b - - 0 36",
    "moves": [
      "a4a1",
      "c1b2",
      "a1f1"
    ],
    "rating": 757,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MX3E",
    "fen": "r3k1nr/pbpB1pQp/1p4nB/4q3/8/8/PPP2PPP/RN3RK1 b kq - 0 11",
    "moves": [
      "e8d7",
      "g7e5",
      "g6e5"
    ],
    "rating": 931,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Ruy Lopez,Ruy Lopez Classical Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MX3O",
    "fen": "8/2r2ppk/Q1P2n1p/p5r1/2BpP3/3P1PqP/1R4P1/R5K1 b - - 6 38",
    "moves": [
      "f6h5",
      "a6b6",
      "h5f4"
    ],
    "rating": 2386,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MX3d",
    "fen": "2r1k1r1/8/2b1p2R/1pb1B3/p7/3B4/PPP4P/2K2R2 b - - 2 33",
    "moves": [
      "c5e3",
      "c1d1",
      "e3h6"
    ],
    "rating": 1112,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MX3p",
    "fen": "3rk2r/1p4p1/2p2p2/2P1p2p/5q2/PQ3b1P/5PP1/R2R3K w k - 0 24",
    "moves": [
      "b3e6",
      "e8f8",
      "d1d8"
    ],
    "rating": 1638,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MX4h",
    "fen": "2q5/5R2/2p1p2k/p1P2pr1/P2P4/4P1QP/7K/1R6 b - - 0 35",
    "moves": [
      "g5g3",
      "h2g3",
      "c8g8",
      "g3f2",
      "g8f7"
    ],
    "rating": 1092,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MX7U",
    "fen": "5rk1/5ppp/B3bn2/7q/1Pr2B2/P3Q1P1/5P1P/R2R2K1 b - - 0 21",
    "moves": [
      "f6g4",
      "h2h4",
      "g4e3"
    ],
    "rating": 1606,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MX8T",
    "fen": "2k5/1br2p1p/p1P5/4p3/8/1P6/P5rP/4R1BK w - - 0 38",
    "moves": [
      "c6b7",
      "c8b7",
      "h1g2"
    ],
    "rating": 1552,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MXFn",
    "fen": "r2q1rk1/bp3pp1/p1bpp3/6p1/2PPN3/3QPn2/PP2B3/2K3RR w - - 0 20",
    "moves": [
      "e4f6",
      "d8f6",
      "d3h7"
    ],
    "rating": 1570,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from English Opening,English Opening Mikenas-Carls Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0MXGX",
    "fen": "4KR2/8/4P1k1/8/p7/Pr3p2/1P6/8 b - - 6 55",
    "moves": [
      "b3b8",
      "e8d7",
      "b8f8"
    ],
    "rating": 855,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MXJc",
    "fen": "r2q1r2/5pk1/p1npp1p1/1pp3N1/4P3/2PP4/PP2Q1PP/R4RK1 w - - 0 17",
    "moves": [
      "f1f7",
      "f8f7",
      "g5e6",
      "g7h7",
      "e6d8"
    ],
    "rating": 1573,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Sicilian Defense,Sicilian Defense McDonnell Attack.",
    "playerColor": "w"
  },
  {
    "id": "lic-0MXKx",
    "fen": "rnb2rk1/1p2ppBp/1q4p1/pP1p4/P5n1/N4NP1/3PPPBP/R2QK2R b KQ - 0 11",
    "moves": [
      "b6f2"
    ],
    "rating": 982,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Hungarian Opening,Hungarian Opening Indian Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MXT5",
    "fen": "6k1/5qpp/pp6/2p5/4PP2/1Q4P1/r6P/3R2K1 w - - 2 27",
    "moves": [
      "d1d8"
    ],
    "rating": 841,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MXTi",
    "fen": "5r2/pp5k/2pqRQp1/3p1b1p/7P/8/PP3PB1/4R1K1 b - - 0 31",
    "moves": [
      "f8f6",
      "e6d6",
      "f6d6"
    ],
    "rating": 1173,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MXXc",
    "fen": "8/2p5/2K1p3/7p/2P2k2/8/P1P3P1/8 b - - 2 35",
    "moves": [
      "e6e5",
      "a2a4",
      "e5e4",
      "c6c5",
      "e4e3"
    ],
    "rating": 1785,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MXbC",
    "fen": "1r5r/2q2pbp/4pkp1/p4b2/7P/1PN2N2/PB1PPP2/R3K2R w KQ - 0 22",
    "moves": [
      "c3d5"
    ],
    "rating": 1176,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MXcI",
    "fen": "r4r1k/pbp1qp1n/7Q/1p6/4P1R1/3p3P/PPP3P1/R6K w - - 2 22",
    "moves": [
      "h6g7"
    ],
    "rating": 1155,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MXfg",
    "fen": "3b1k2/8/4p1KP/r7/p7/4P1P1/R4P2/8 w - - 1 49",
    "moves": [
      "h6h7",
      "a5g5",
      "g6h6",
      "f8f7",
      "h7h8q"
    ],
    "rating": 910,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MXg9",
    "fen": "r1b1k2r/ppp1qp2/4pnBb/1NPn3p/7B/4P2P/PPQ1NPP1/R3K2R b KQkq - 0 14",
    "moves": [
      "f7g6",
      "c2g6",
      "e7f7",
      "b5c7",
      "d5c7",
      "g6f6",
      "f7f6"
    ],
    "rating": 2171,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot) from Old Indian Defense,Old Indian Defense Other variations.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MXgd",
    "fen": "3r2k1/2q1bpp1/p2p1n1p/P4Q2/1Pp1PB2/2P4P/6P1/3R1RK1 b - - 8 34",
    "moves": [
      "c7a7",
      "g1h2",
      "g7g6",
      "f4e3",
      "a7e3"
    ],
    "rating": 2623,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MXpJ",
    "fen": "r4b1r/1Pp1kppp/p2p4/4p3/B5q1/2P3nb/PP3P1N/RNBQ1RK1 b - - 2 13",
    "moves": [
      "g3e2",
      "g1h1",
      "g4g2"
    ],
    "rating": 1367,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Ruy Lopez,Ruy Lopez Morphy Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MXxb",
    "fen": "2b5/8/1P6/2Bp4/2pP4/2k3K1/8/8 b - - 4 80",
    "moves": [
      "c3b2",
      "g3f4",
      "c4c3",
      "f4e5",
      "c3c2"
    ],
    "rating": 2555,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MY0V",
    "fen": "1k1r3r/pb1p1ppp/1p1Np3/4P1q1/1n1PQ3/8/1BP2P2/R3K2R w KQ - 2 19",
    "moves": [
      "e4b7"
    ],
    "rating": 1189,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Sicilian Defense,Sicilian Defense Wing Gambit Deferred.",
    "playerColor": "w"
  },
  {
    "id": "lic-0MY23",
    "fen": "8/3Q2pk/7p/2Pp1p1q/1P1Pp3/4BbPP/5P1K/8 b - - 1 33",
    "moves": [
      "f3g4",
      "h3h4",
      "f5f4",
      "d7g4",
      "h5g4"
    ],
    "rating": 1452,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MY3E",
    "fen": "r4rk1/p2R1ppp/2n5/4N2q/3P1b2/4N3/5PPP/3Q1RK1 b - - 6 19",
    "moves": [
      "h5h2"
    ],
    "rating": 966,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MY9v",
    "fen": "5k2/R5p1/5b1p/7r/3p1P2/2pK3P/P1R5/8 b - - 0 42",
    "moves": [
      "h5h3",
      "d3c4",
      "d4d3"
    ],
    "rating": 1004,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYBQ",
    "fen": "3q1rk1/R1b4p/6p1/1Q1p1pP1/1PpPpP1n/2P1P1KP/8/2B3N1 b - - 0 35",
    "moves": [
      "d8g5",
      "g3f2",
      "g5g2"
    ],
    "rating": 1736,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYJb",
    "fen": "4q2k/2p4p/p2p2pP/2pP2Q1/5P2/P1P5/5P2/bN4K1 w - - 0 36",
    "moves": [
      "g5f6",
      "h8g8",
      "f6g7"
    ],
    "rating": 910,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYLA",
    "fen": "3r2k1/1b3p2/pb2Np1p/1p6/1P6/4P3/r4PPP/R4RK1 w - - 0 23",
    "moves": [
      "e6d8",
      "a2a1",
      "f1a1",
      "b6d8",
      "a1d1",
      "d8e7",
      "d1d7",
      "e7b4",
      "d7b7"
    ],
    "rating": 2439,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYPM",
    "fen": "1r4k1/5p2/2n1p1p1/p5P1/R2r4/1R6/PKP5/8 w - - 2 43",
    "moves": [
      "b3b8",
      "c6b8",
      "a4d4"
    ],
    "rating": 860,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYR2",
    "fen": "5r1k/Q1R3pp/3p4/8/8/8/Pr3RPP/6K1 b - - 0 22",
    "moves": [
      "b2b1",
      "c7c1",
      "b1c1",
      "f2f1",
      "c1f1"
    ],
    "rating": 948,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYRk",
    "fen": "5r2/3k3p/R3p1p1/2R5/3P2p1/4K2P/1r2N3/8 b - - 1 56",
    "moves": [
      "f8f3",
      "e3e4",
      "b2e2"
    ],
    "rating": 1096,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYV2",
    "fen": "r5k1/p4ppp/8/2p1q3/2Q5/P1P1P3/6PP/5RK1 w - - 0 29",
    "moves": [
      "c4f7",
      "g8h8",
      "f7f8",
      "a8f8",
      "f1f8"
    ],
    "rating": 935,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYXd",
    "fen": "3r2k1/1pbr1pp1/p7/5P1p/2P4q/R2B4/1BQ2PK1/7R b - - 1 24",
    "moves": [
      "h4g4",
      "g2f1",
      "g4f3",
      "h1g1",
      "d7d3",
      "g1g7",
      "g8f8"
    ],
    "rating": 2125,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYbr",
    "fen": "2Q5/2p1r1k1/5npp/1p2q3/1P6/P1r4P/2B3P1/4RR1K b - - 3 37",
    "moves": [
      "e5e1",
      "f1e1",
      "e7e1"
    ],
    "rating": 1754,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYcV",
    "fen": "8/8/5BP1/8/1nk5/np6/8/K7 w - - 3 55",
    "moves": [
      "g6g7",
      "a3c2",
      "a1b1"
    ],
    "rating": 2114,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYey",
    "fen": "r1b2r2/pp3k1p/3p1B2/2p2p2/2P4Q/2PB1N2/2K2PP1/q7 w - - 4 25",
    "moves": [
      "h4h6",
      "f7e8",
      "h6e3",
      "e8d7",
      "e3e7"
    ],
    "rating": 2909,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYf2",
    "fen": "4R3/5p1p/pp5k/2b5/P1qB4/6N1/1PP3PP/7K w - - 5 29",
    "moves": [
      "e8g8",
      "c4c2",
      "d4g7",
      "h6g5",
      "g7e5"
    ],
    "rating": 2372,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYgy",
    "fen": "r2R1Q2/pb3ppk/1pq1p2p/8/5N2/2P3P1/PP3P1P/6K1 w - - 2 25",
    "moves": [
      "f8g8"
    ],
    "rating": 805,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYhK",
    "fen": "1k1r3r/ppp2p1p/2np3Q/8/R1Pq1p2/1PN2N2/1PK2nPP/2B4R b - - 2 18",
    "moves": [
      "d4d3"
    ],
    "rating": 940,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Kings Gambit Accepted,Kings Gambit Accepted Fischer Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYko",
    "fen": "Rbkr4/7R/2p1p1p1/8/4P3/1PP2N1P/1P3PP1/6K1 b - - 0 24",
    "moves": [
      "d8d1",
      "f3e1",
      "d1e1"
    ],
    "rating": 565,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYmc",
    "fen": "r1bq1r2/pp3pkp/2p2p2/6pP/2pPNQP1/5P1N/PPP5/2K4R w - - 0 20",
    "moves": [
      "h5h6",
      "g7h8",
      "f4f6",
      "d8f6",
      "e4f6"
    ],
    "rating": 2312,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYnJ",
    "fen": "R7/1p3pk1/4pqp1/4Q2p/8/2P4P/1r4PK/8 w - - 2 30",
    "moves": [
      "a8g8",
      "g7h7",
      "e5f6"
    ],
    "rating": 1166,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYoO",
    "fen": "r3r3/pp1qbk2/2p5/3pQ1p1/3P4/2N1P3/PP3PPP/R4RK1 b - - 0 25",
    "moves": [
      "e7d6",
      "e5g5",
      "e8h8",
      "f2f4",
      "a8g8"
    ],
    "rating": 2357,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYoe",
    "fen": "8/8/8/4R3/3k1Pp1/7p/4p1bP/6K1 b - f3 0 69",
    "moves": [
      "g2e4",
      "g1f2",
      "g4g3",
      "h2g3",
      "d4d3",
      "e5a5",
      "h3h2"
    ],
    "rating": 2823,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYtH",
    "fen": "N1bk2nr/pp1p1ppp/8/4P3/8/3BP3/nqPN1PPP/3QK2R b K - 0 13",
    "moves": [
      "a2c3",
      "d2c4",
      "c3d1",
      "c4b2",
      "d1b2"
    ],
    "rating": 1095,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Englund Gambit,Englund Gambit Other variations.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYuU",
    "fen": "3r2k1/p3nppp/1prNp3/8/2PR4/P3P1P1/6PP/R5K1 w - - 1 22",
    "moves": [
      "d6f5",
      "d8d4",
      "f5e7",
      "g8f8",
      "e7c6"
    ],
    "rating": 1916,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYvk",
    "fen": "4B2R/8/3p4/2pP2rp/P4K1k/6p1/8/8 b - - 5 63",
    "moves": [
      "g3g2",
      "e8h5",
      "g5h5",
      "h8g8",
      "h4h3",
      "f4f3",
      "h5f5"
    ],
    "rating": 1886,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYww",
    "fen": "2r3k1/3r2pp/p3p3/5p2/N1p2P2/P3P1P1/1PR1K2P/8 w - - 2 31",
    "moves": [
      "a4b6",
      "d7c7",
      "b6c8"
    ],
    "rating": 790,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYxd",
    "fen": "rn2k1nr/pp3ppp/3p2q1/2bpp1B1/4P1Q1/3P3P/PPP2P1P/R3KB1R w KQkq - 0 9",
    "moves": [
      "g4c8"
    ],
    "rating": 1118,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MYzS",
    "fen": "r5k1/1pp2ppp/p1q2n2/2Pp1p2/3Pn3/1BNQP3/PP3PPK/R4R2 b - - 0 18",
    "moves": [
      "f6g4",
      "h2g1",
      "c6h6"
    ],
    "rating": 1415,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot) from Queens Pawn Game,Queens Pawn Game Accelerated London System.",
    "playerColor": "b"
  },
  {
    "id": "lic-0MYzs",
    "fen": "1k4rr/p1p2p2/1p1p1n1p/1P2q3/4P3/Q7/1PP2PPP/R1B2RK1 b - - 1 20",
    "moves": [
      "g8g2",
      "g1g2",
      "e5e4",
      "g2g1",
      "h8g8"
    ],
    "rating": 2202,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MZ4G",
    "fen": "6k1/6p1/2R3Qp/3pP2P/2pPn2q/1p6/1P4P1/5K2 b - - 0 52",
    "moves": [
      "h4f2"
    ],
    "rating": 1236,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MZ6q",
    "fen": "2r5/1p4p1/1p4p1/1Pp1pk2/P5R1/4PPK1/6PP/8 b - - 4 31",
    "moves": [
      "c5c4",
      "g4c4",
      "c8c4"
    ],
    "rating": 1332,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MZD3",
    "fen": "3n4/1p3p2/2p5/2P1k2p/1P1bP2P/5RPK/r7/4R3 w - - 3 37",
    "moves": [
      "f3f5",
      "e5e6",
      "e1d1"
    ],
    "rating": 1904,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MZHS",
    "fen": "4r1k1/p1q5/1p4Np/4bp2/2bN2p1/B1P2p1P/PP3P2/R1Q3K1 b - - 10 33",
    "moves": [
      "e5h2",
      "g1h1",
      "g4g3"
    ],
    "rating": 1974,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MZJH",
    "fen": "8/8/P3k3/2R5/1Pp5/3p1pP1/3K2n1/8 b - - 0 45",
    "moves": [
      "f3f2",
      "c5c4",
      "f2f1q"
    ],
    "rating": 1129,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MZKe",
    "fen": "3B1rk1/1b3ppp/p1p1p3/8/8/3B3n/PPP3PP/1R1Q2RK b - - 0 19",
    "moves": [
      "h3f2"
    ],
    "rating": 784,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0MZLB",
    "fen": "1r4k1/1p1b2pp/p1p2r2/P2p4/1P1P1q2/5B1P/6P1/2RQ1R1K w - - 4 26",
    "moves": [
      "f3d5",
      "c6d5",
      "f1f4"
    ],
    "rating": 1184,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0MZLG",
    "fen": "2kr3r/pp1n1pp1/2p1p1n1/8/2PPN2b/1PB1KB1p/P6P/6RR w - - 4 23",
    "moves": [
      "e4d6",
      "c8c7",
      "d6f7"
    ],
    "rating": 1301,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qu6P",
    "fen": "r7/2BPkp2/5n1p/5Bp1/2q5/7P/5PP1/3R2K1 w - - 0 35",
    "moves": [
      "d7d8q",
      "a8d8",
      "c7d8",
      "e7e8",
      "d8f6"
    ],
    "rating": 1841,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qu8P",
    "fen": "1r1q1r1k/p1p5/5pnp/4p3/2B3P1/2N2nP1/PPPQ1P2/2K4R w - - 0 19",
    "moves": [
      "d2h6"
    ],
    "rating": 1272,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Queens Pawn Game,Queens Pawn Game Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qu9W",
    "fen": "8/7p/8/p6P/P1r2kP1/1P1p1P2/5K2/8 w - - 0 56",
    "moves": [
      "b3c4",
      "d3d2",
      "f2e2",
      "d2d1q",
      "e2d1"
    ],
    "rating": 834,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QuFa",
    "fen": "8/8/1p6/8/2k3K1/5P2/8/8 b - - 1 59",
    "moves": [
      "b6b5",
      "f3f4",
      "b5b4",
      "f4f5",
      "c4d5"
    ],
    "rating": 2320,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QuGx",
    "fen": "8/8/8/5Kpk/6n1/8/8/5Q2 b - - 5 83",
    "moves": [
      "g4e3",
      "f5e4",
      "e3f1"
    ],
    "rating": 712,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QuHI",
    "fen": "7r/p1p3p1/2p5/2N2b2/2P5/1P2k2P/P6K/4R3 b - - 1 35",
    "moves": [
      "e3f2",
      "c5d3",
      "f5d3"
    ],
    "rating": 1642,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QuKx",
    "fen": "r7/8/8/8/kp4RP/8/6K1/8 b - - 1 59",
    "moves": [
      "a4a3",
      "g2f3",
      "b4b3"
    ],
    "rating": 1827,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QuKy",
    "fen": "8/6kp/1QBr2p1/3Pbp2/4p3/6P1/q4P1P/1R4K1 w - - 1 40",
    "moves": [
      "b6c7",
      "g7h6",
      "b1b7",
      "a2a1",
      "g1g2"
    ],
    "rating": 1919,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QuLK",
    "fen": "2k3r1/pp1q3p/2n2p2/2p1pn2/2Np3P/3P1Q2/PPPB3P/R6K w - - 2 22",
    "moves": [
      "f3f5",
      "d7f5",
      "c4d6",
      "c8d7",
      "d6f5"
    ],
    "rating": 1418,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QuLW",
    "fen": "r1b2rk1/pp3ppp/2p2q2/2b1pPB1/2BnP1P1/3P1N1P/PPP5/R2QK2R b KQ - 1 12",
    "moves": [
      "d4f3",
      "d1f3",
      "f6g5"
    ],
    "rating": 1172,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Kings Gambit Declined,Kings Gambit Declined Queens Knight Defense.",
    "playerColor": "b"
  },
  {
    "id": "lic-0QuMd",
    "fen": "2kr3r/p1p1qp1p/1p2p1p1/1B6/Q7/4PnP1/PP3P2/R3K2R w KQ - 0 18",
    "moves": [
      "e1e2",
      "d8d2",
      "e2f3",
      "e7f6",
      "a4f4"
    ],
    "rating": 1942,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Queens Pawn Game,Queens Pawn Game Accelerated London System.",
    "playerColor": "w"
  },
  {
    "id": "lic-0QuMo",
    "fen": "r5k1/7p/4P1p1/1R3p2/p4P2/6PP/r7/1R5K w - - 0 41",
    "moves": [
      "b5b8",
      "a8b8",
      "b1b8",
      "g8g7",
      "e6e7"
    ],
    "rating": 963,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QuO4",
    "fen": "r4knR/1pp1qpp1/6P1/6P1/4p3/4P1N1/1KPP4/R6Q b - - 0 26",
    "moves": [
      "e7b4",
      "b2c1",
      "a8a1"
    ],
    "rating": 1230,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QuQr",
    "fen": "8/8/8/5p2/8/P7/1P4kR/2K5 b - - 0 52",
    "moves": [
      "g2h2",
      "c1c2",
      "f5f4"
    ],
    "rating": 744,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QuTN",
    "fen": "6k1/2q3pp/1pN1p3/1Pbpr3/5rQP/8/5PP1/5RK1 w - - 0 27",
    "moves": [
      "g4f4",
      "c5d6",
      "c6e5"
    ],
    "rating": 1469,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QuVO",
    "fen": "3rr1k1/pQ3ppp/8/8/4R1n1/8/P1q2PPP/4R1K1 w - - 1 22",
    "moves": [
      "e4e8",
      "d8e8",
      "e1e8"
    ],
    "rating": 943,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QuZf",
    "fen": "2r3k1/5ppp/3P4/8/4P3/1Q3R1P/3q2P1/q1r2BK1 w - - 0 33",
    "moves": [
      "b3f7",
      "g8h8",
      "f7f8",
      "c8f8",
      "f3f8"
    ],
    "rating": 916,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QugB",
    "fen": "8/p7/2K1BPR1/1P2b3/3r1kp1/P7/8/8 b - - 0 62",
    "moves": [
      "d4d6",
      "c6b7",
      "d6e6",
      "f6f7",
      "e6e7"
    ],
    "rating": 1740,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qugl",
    "fen": "8/8/6p1/4Bp1p/7P/1kP1p1n1/8/3K4 w - - 0 43",
    "moves": [
      "e5g3",
      "b3c3",
      "d1e2"
    ],
    "rating": 1486,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QuhA",
    "fen": "r7/4k3/3R2K1/4PP2/8/p5p1/8/8 w - - 5 47",
    "moves": [
      "f5f6",
      "e7e8",
      "e5e6",
      "g3g2",
      "d6d1"
    ],
    "rating": 2405,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Quii",
    "fen": "rn2r1k1/5pbn/3p1q2/2pPpPp1/1pP3Pp/pP1B1P1P/P1Q2R1N/R1B3K1 b - - 2 24",
    "moves": [
      "e5e4",
      "f3e4",
      "f6a1"
    ],
    "rating": 1128,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Quiv",
    "fen": "3R4/k1p2p2/1pB4p/2b1r1p1/6P1/5P1P/6K1/8 w - - 2 38",
    "moves": [
      "d8a8"
    ],
    "rating": 433,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QujT",
    "fen": "7k/p5pp/1p4p1/2p3P1/2P2r2/P7/6K1/3R4 w - - 0 40",
    "moves": [
      "d1d8",
      "f4f8",
      "d8f8"
    ],
    "rating": 655,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qus5",
    "fen": "k5r1/p4q2/Q1RB1P2/4p3/3p2r1/1P6/P4P1p/7K w - - 0 37",
    "moves": [
      "c6c8",
      "g8c8",
      "a6c8"
    ],
    "rating": 1127,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Quu4",
    "fen": "2rq1r2/pp1nppkp/3p2p1/3P1b2/4N1P1/7P/PPPQ1P2/2KR1BNR b - - 0 13",
    "moves": [
      "f5e4",
      "d2d4",
      "d7f6"
    ],
    "rating": 1380,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Indian Defense,Indian Defense Pawn Push Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0QuuG",
    "fen": "6k1/pbp2pp1/1p2r2p/1N6/P1P5/1P3P2/2Pr2PP/2R2RK1 b - - 2 22",
    "moves": [
      "e6e2",
      "f1d1",
      "e2g2"
    ],
    "rating": 1586,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QuvA",
    "fen": "r5k1/3b2b1/p4p2/1p1pP2Q/1P5P/2q1P1B1/P3BPPK/8 w - - 5 29",
    "moves": [
      "e5f6",
      "c3f6",
      "h5d5",
      "f6e6",
      "d5a8"
    ],
    "rating": 1527,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Quwr",
    "fen": "2R5/5pkp/3p1qp1/3P3P/3b2P1/5B2/5rQ1/7K w - - 0 39",
    "moves": [
      "g4g5",
      "f2f1",
      "g2f1"
    ],
    "rating": 2242,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QuyH",
    "fen": "5R2/3N2k1/8/5PK1/6P1/8/7b/5r2 b - - 0 54",
    "moves": [
      "h2f4",
      "g5h5",
      "f1h1"
    ],
    "rating": 1007,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qv0z",
    "fen": "3r3k/p2r2p1/1b1Np1pp/2p1Pn2/2P2PP1/7P/PP1B2K1/R2R4 b - - 0 33",
    "moves": [
      "f5d6",
      "e5d6",
      "d7d6"
    ],
    "rating": 1616,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qv3V",
    "fen": "5k2/2Q2p1p/3p2p1/1p2p3/3nP1NP/1b4PB/q7/7K w - - 6 36",
    "moves": [
      "c7d6",
      "f8g7",
      "d6e5"
    ],
    "rating": 2227,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qv3X",
    "fen": "3r2k1/1q2bppp/p3bn2/1pp5/5B2/1PP1N1Q1/P4PPP/3RR1K1 b - - 1 22",
    "moves": [
      "f6h5",
      "d1d8",
      "e7d8"
    ],
    "rating": 1934,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QvDF",
    "fen": "1nb1r1k1/2p2p1p/1pP3p1/1P6/3N1PP1/2q1P2P/2KB3R/r2R4 w - - 0 29",
    "moves": [
      "d2c3",
      "a1a2",
      "c3b2"
    ],
    "rating": 1394,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QvIU",
    "fen": "4r1k1/1p2Qbp1/2q4p/3pR3/2p5/2P3P1/P4PBP/6K1 w - - 3 30",
    "moves": [
      "e7e8",
      "f7e8",
      "g2d5",
      "c6d5",
      "e5d5"
    ],
    "rating": 2021,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QvJO",
    "fen": "4r1k1/pp3pp1/8/7p/8/6Q1/PP4RK/3q4 w - - 0 34",
    "moves": [
      "g3g7"
    ],
    "rating": 447,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QvJn",
    "fen": "2k2bnr/Qpp2ppp/8/3q4/5B2/5P2/PPP1B2P/R3R1K1 b - - 0 14",
    "moves": [
      "f8c5",
      "a7c5",
      "d5c5"
    ],
    "rating": 1143,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Kings Gambit Declined,Kings Gambit Declined Falkbeer Countergambit Accepted.",
    "playerColor": "b"
  },
  {
    "id": "lic-0QvKe",
    "fen": "2r5/3n1pkp/4p1p1/2NpP3/1p6/1P5P/2R2PP1/5K2 w - - 7 40",
    "moves": [
      "c5e6",
      "f7e6",
      "c2c8"
    ],
    "rating": 1161,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QvPS",
    "fen": "2rr2k1/ppq2pbp/1n2B1p1/8/6Q1/P1N1P3/1P4PP/2R2RK1 b - - 0 20",
    "moves": [
      "f7e6",
      "g4e6",
      "g8h8"
    ],
    "rating": 1678,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QvRE",
    "fen": "r2q2k1/ppp3pn/3p1p1p/3Pr3/1P1Q4/P2P4/2P1BPPP/R3R1K1 b - - 0 17",
    "moves": [
      "d8e7",
      "g1f1",
      "a8e8"
    ],
    "rating": 1918,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot) from Kings Pawn Game,Kings Pawn Game Leonardis Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0QvTs",
    "fen": "1k6/1pp5/p4p2/PP4n1/2P2q2/2N5/2KR4/8 w - - 1 44",
    "moves": [
      "d2d8",
      "b8a7",
      "b5b6",
      "c7b6",
      "a5b6",
      "a7b6",
      "c3d5",
      "b6c6",
      "d5f4"
    ],
    "rating": 1303,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QveA",
    "fen": "r4rk1/p5B1/b1p1R1Q1/3p4/3q4/8/P1P2PPP/4R1K1 b - - 0 24",
    "moves": [
      "d4f2",
      "g1h1",
      "f2f1",
      "e1f1",
      "f8f1"
    ],
    "rating": 1282,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qvgb",
    "fen": "6k1/p2n2pp/6r1/2b1p3/3pPp1q/5P1P/PPP3P1/R1BQ1R1K b - - 2 19",
    "moves": [
      "g6g2",
      "h1g2",
      "h4g3",
      "g2h1",
      "g3h3"
    ],
    "rating": 1714,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot) from Vienna Game,Vienna Game Stanley Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0QvkZ",
    "fen": "3r4/pkp5/1r1q3p/6p1/2Q5/1R4P1/PPP3P1/2K4R b - - 4 26",
    "moves": [
      "d6d2",
      "c1b1",
      "d2d1",
      "h1d1",
      "d8d1"
    ],
    "rating": 1130,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QvoG",
    "fen": "8/2b3k1/7p/p2pN1pP/3Pp3/6P1/PP3K2/8 b - - 2 36",
    "moves": [
      "c7e5",
      "d4e5",
      "d5d4"
    ],
    "rating": 2074,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QvsN",
    "fen": "rnb1k2r/1p1p1p1p/p3pp2/8/3NP3/2qB1K2/P4PPP/R2Q3R w kq - 0 13",
    "moves": [
      "a1c1",
      "c3d4",
      "c1c8",
      "e8e7",
      "c8h8"
    ],
    "rating": 1592,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Sicilian Defense,Sicilian Defense Kan Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qvv9",
    "fen": "r6r/kp5p/p2p1q2/3P1b2/1R4Q1/3P3P/PP4P1/2R3K1 w - - 2 23",
    "moves": [
      "b4b7",
      "a7b7",
      "g4b4",
      "b7a7",
      "c1c7"
    ],
    "rating": 1606,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qvwh",
    "fen": "3r2k1/p1R1Qp2/1p4p1/3r1p1p/1p5P/3P4/Pq2B1P1/6K1 w - - 2 38",
    "moves": [
      "e7f7",
      "g8h8",
      "f7h7"
    ],
    "rating": 1263,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QvxC",
    "fen": "2r2rk1/R2R1pp1/4N2p/1QPp2q1/1P6/4n2P/5PP1/6K1 b - - 0 31",
    "moves": [
      "g5g2"
    ],
    "rating": 756,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QvzB",
    "fen": "r4rk1/ppq2ppp/3b4/3p4/Pn1P4/4BBPb/1PQN1P1P/2R1K2R w K - 3 17",
    "moves": [
      "c2c7",
      "d6c7",
      "c1c7"
    ],
    "rating": 1061,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — find the winning continuation (Tactical Shot) from Queens Gambit Declined,Queens Gambit Declined Austrian Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qw0k",
    "fen": "5r2/7P/2R5/3p1k2/3P1p1B/2P5/2K5/7r w - - 1 43",
    "moves": [
      "c6f6",
      "f8f6",
      "h7h8q",
      "h1h4",
      "h8h4"
    ],
    "rating": 1784,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qw55",
    "fen": "8/3r4/1R2Rpkp/8/8/6P1/2r4P/6K1 b - - 2 34",
    "moves": [
      "d7d1",
      "e6e1",
      "d1e1"
    ],
    "rating": 745,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qw7q",
    "fen": "rnb1kbnr/pp4pp/1qp2p2/3pP3/7B/1P2P3/P1P2PPP/RN1QKBNR b KQkq - 0 6",
    "moves": [
      "b6b4",
      "b1d2",
      "b4h4"
    ],
    "rating": 1368,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot) from Queens Pawn Game,Queens Pawn Game Levitsky Attack.",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qw8J",
    "fen": "4r1k1/p4ppp/5n2/2q5/2b2N2/5Q2/Pr1N1PPP/3RR1K1 b - - 1 21",
    "moves": [
      "e8e1",
      "d1e1",
      "b2d2",
      "f3a8",
      "c5f8"
    ],
    "rating": 1209,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QwAN",
    "fen": "8/8/4p1k1/p1b1P3/P2BK3/8/8/8 b - - 2 46",
    "moves": [
      "c5d4",
      "e4d4",
      "g6f5"
    ],
    "rating": 803,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QwBE",
    "fen": "r5k1/1pR3bp/p5p1/3Pn3/4pqB1/7P/PP3P2/3Q1RK1 b - - 2 22",
    "moves": [
      "e5f3",
      "g4f3",
      "g7e5",
      "f1e1",
      "f4h2",
      "g1f1",
      "e4f3"
    ],
    "rating": 2774,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QwCc",
    "fen": "8/p4k1p/2pq1pp1/8/1r3PPP/8/P1P1Q3/4R1K1 w - - 7 36",
    "moves": [
      "e2e8",
      "f7g7",
      "e1e7",
      "d6e7",
      "e8e7"
    ],
    "rating": 1128,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QwDC",
    "fen": "3rn1k1/1p1r2bp/p1b1p3/2B1Pp1B/2p2P2/1P5P/P1Q4P/5RK1 b - - 1 29",
    "moves": [
      "d7d2",
      "f1d1",
      "d2c2"
    ],
    "rating": 1820,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QwEq",
    "fen": "3r2k1/p4ppp/8/q1bpP3/3N4/1Q2P1P1/P4P1P/2N3K1 w - - 1 31",
    "moves": [
      "d4c6",
      "a5d2",
      "c6d8",
      "d2c1",
      "g1g2"
    ],
    "rating": 1132,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QwGB",
    "fen": "8/5pk1/1B4p1/P3b2p/2R2P1K/r6P/6P1/8 b - - 1 46",
    "moves": [
      "e5f6"
    ],
    "rating": 1117,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QwI5",
    "fen": "8/8/8/4Qr1k/5rP1/7p/7P/5RK1 b - - 0 49",
    "moves": [
      "f4g4",
      "g1h1",
      "f5e5",
      "f1f5",
      "g4g5"
    ],
    "rating": 2112,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QwJ0",
    "fen": "1r6/3k4/2q3p1/2p5/Q2p4/1P3PP1/K7/4R3 w - - 4 42",
    "moves": [
      "e1e7",
      "d7e7",
      "a4c6"
    ],
    "rating": 1207,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QwJU",
    "fen": "6k1/3r1ppp/p3b3/1p6/1B6/PP6/2R3PP/4K3 w - - 1 30",
    "moves": [
      "c2c8",
      "d7d8",
      "c8d8"
    ],
    "rating": 568,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QwKe",
    "fen": "r3r1k1/pp4p1/4q2p/2BQ4/8/3P4/PPP3PP/5RK1 w - - 5 26",
    "moves": [
      "f1f8",
      "g8h7",
      "d5e6",
      "e8e6",
      "f8a8"
    ],
    "rating": 1435,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QwMG",
    "fen": "rnb1k2r/pp3ppp/2p5/2qPB3/4n3/1B6/PP3PPP/R2QK1NR b KQkq - 0 11",
    "moves": [
      "c5f2"
    ],
    "rating": 1274,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QwYR",
    "fen": "R7/6k1/1R6/2p1p1p1/8/2PP1bPK/2P5/2B2r2 b - - 0 44",
    "moves": [
      "f1h1"
    ],
    "rating": 740,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QwYj",
    "fen": "4r3/ppp5/3p1p2/3k1P1N/4n1R1/8/PPP2KP1/8 w - - 4 32",
    "moves": [
      "g4e4",
      "e8e4",
      "h5f6",
      "d5e5",
      "f6e4"
    ],
    "rating": 1324,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QwYm",
    "fen": "8/2p5/2pp4/p5p1/P1r2k1p/5P2/5K2/6R1 w - - 0 62",
    "moves": [
      "g1g4",
      "f4f5",
      "g4c4"
    ],
    "rating": 884,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QwZ4",
    "fen": "2r2rk1/pp1q1Bbp/6p1/2R3Bn/3P3Q/5P2/PP3P1P/2R3K1 b - - 0 23",
    "moves": [
      "g8f7",
      "h4g4",
      "d7g4",
      "f3g4",
      "c8c5"
    ],
    "rating": 2032,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QwZP",
    "fen": "8/1p6/p4p1p/P2k1Pp1/1P4P1/3K3P/8/8 w - - 2 42",
    "moves": [
      "d3c3",
      "d5c6",
      "c3c4"
    ],
    "rating": 1698,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QwaZ",
    "fen": "5rk1/1pp2p2/r1b4p/4R3/2Q2p2/1BP2PqP/PP4P1/4R2K b - - 0 37",
    "moves": [
      "c6f3",
      "c4f1",
      "g3h3",
      "h1g1",
      "a6g6"
    ],
    "rating": 2026,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qwec",
    "fen": "r5k1/p2r3p/bp2Rp2/2pn1NqQ/8/P1Pp3P/5PP1/R5K1 w - - 6 27",
    "moves": [
      "e6e8",
      "a8e8",
      "h5e8"
    ],
    "rating": 1723,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qweq",
    "fen": "r7/6pp/1RN2k2/8/4n3/8/6PP/6K1 b - - 0 40",
    "moves": [
      "a8a1",
      "b6b1",
      "a1b1"
    ],
    "rating": 518,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qwf3",
    "fen": "3Q4/pp3pk1/6p1/7p/8/3p1P1P/PP2r3/1K6 b - - 0 27",
    "moves": [
      "e2e1"
    ],
    "rating": 499,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QwfL",
    "fen": "r1b2rk1/ppp2ppp/2n1p3/8/2PPQ3/3B4/q2N1PPP/1R2K2R w K - 2 14",
    "moves": [
      "e4h7"
    ],
    "rating": 898,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Queens Gambit Declined,Queens Gambit Declined Harrwitz Attack.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qwfj",
    "fen": "8/2p5/1p1p4/p2PPK2/P1P5/2P1k3/8/8 b - - 0 40",
    "moves": [
      "d6e5",
      "f5e5",
      "e3d3",
      "e5e6",
      "d3c4"
    ],
    "rating": 1816,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qwil",
    "fen": "8/8/1p1p1k2/p1p3p1/P1P1K1P1/1P6/8/8 w - - 2 61",
    "moves": [
      "e4d5",
      "f6e7",
      "d5c6"
    ],
    "rating": 793,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qwml",
    "fen": "3r2k1/3P1pBp/8/b2Q4/8/6P1/4q2P/3R3K b - - 0 34",
    "moves": [
      "d8d7",
      "d5d7",
      "e2f3",
      "h1g1",
      "a5b6",
      "g7d4",
      "f3d1"
    ],
    "rating": 2236,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qwow",
    "fen": "rnb1k2r/pp4pp/2pbp3/3pNp2/3PnP1q/3BP2P/PPPN2P1/R1BQ1K1R b kq - 3 9",
    "moves": [
      "h4f2"
    ],
    "rating": 1181,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qwp0",
    "fen": "6k1/1b3pp1/3p2n1/q1bPp3/rpB1P2p/1Q1N3P/5PPB/1R4K1 w - - 12 40",
    "moves": [
      "d3c5",
      "a4a3",
      "b3b4",
      "a5b4",
      "b1b4",
      "a3a1",
      "c4f1"
    ],
    "rating": 1892,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QwpW",
    "fen": "8/pR3ppk/4p3/1Pq5/5PP1/7P/5RK1/8 b - - 5 38",
    "moves": [
      "c5d5",
      "g2g3",
      "d5b7"
    ],
    "rating": 1124,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qwpb",
    "fen": "r1bqr1k1/1p4pn/p1p2b2/3pN2Q/1P1P4/P1N5/5PPP/R3R1K1 w - - 0 20",
    "moves": [
      "h5f7",
      "g8h8",
      "e5g6"
    ],
    "rating": 1431,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qwsk",
    "fen": "2rq1rk1/4bpp1/p3p2p/1p1b4/3P1B2/P5P1/1P3PBP/2RQR1K1 w - - 0 18",
    "moves": [
      "c1c8",
      "d8c8",
      "g2d5"
    ],
    "rating": 1610,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from English Opening,English Opening Caro-Kann Defensive System.",
    "playerColor": "w"
  },
  {
    "id": "lic-0QwwK",
    "fen": "r4rk1/pb3qpp/1n6/3p2B1/2pNn1B1/4P3/P4PPP/1R1Q1RK1 w - - 6 21",
    "moves": [
      "g4e6",
      "e4g5",
      "e6f7"
    ],
    "rating": 867,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qwyv",
    "fen": "7k/3q2p1/3r3p/8/3n4/KPB1Q3/P1P3PP/4R3 b - - 0 29",
    "moves": [
      "d4c2",
      "a3b2",
      "c2e3"
    ],
    "rating": 1209,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Qx47",
    "fen": "8/8/3k4/1p3Pp1/1P2K2p/7P/8/8 w - - 0 38",
    "moves": [
      "f5f6",
      "d6e6",
      "f6f7",
      "e6f7",
      "e4f5",
      "g5g4",
      "f5g4"
    ],
    "rating": 2086,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Qx5Z",
    "fen": "8/8/6k1/8/5R2/6P1/3r1r1P/6RK b - - 8 42",
    "moves": [
      "f2h2"
    ],
    "rating": 961,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QxBW",
    "fen": "5r2/7p/2p5/4kp2/1bP1pN2/pP1p2PP/P4P2/4RK2 w - - 2 39",
    "moves": [
      "f4d3",
      "e5d6",
      "d3b4"
    ],
    "rating": 1133,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QxCv",
    "fen": "r2q4/1p2rR2/p1pbb1kp/8/3Pp3/1Q6/PPP3PP/5RK1 w - - 2 24",
    "moves": [
      "f1f6",
      "g6h5",
      "b3e3"
    ],
    "rating": 2308,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QxD2",
    "fen": "2k4r/ppp4q/2n1pP2/3p2b1/PP1P2Q1/3P4/N5N1/R4RK1 b - - 0 23",
    "moves": [
      "g5e3",
      "g2e3",
      "h7h2"
    ],
    "rating": 1907,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QxGv",
    "fen": "6k1/1r4p1/4p2p/4p3/4n2P/2P3P1/1pK1BP2/1R6 w - - 0 37",
    "moves": [
      "e2f3",
      "b7f7",
      "f3e4"
    ],
    "rating": 1573,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QxIl",
    "fen": "1k5r/1pRb3q/pP2N1p1/3P1pP1/4pP2/1B4K1/P2B2Q1/8 b - - 4 37",
    "moves": [
      "h7h4"
    ],
    "rating": 957,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QxKk",
    "fen": "rn3r1k/pb3pp1/1p2p3/3p4/2Pp2P1/5R2/PPQKB2P/q7 w - - 0 21",
    "moves": [
      "f3h3",
      "h8g8",
      "c2h7"
    ],
    "rating": 929,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QxMO",
    "fen": "8/R7/8/1pP5/8/pbk5/8/2K5 b - - 3 64",
    "moves": [
      "a3a2",
      "a7a3",
      "b5b4"
    ],
    "rating": 2165,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QxS0",
    "fen": "r2q1rk1/ppp2p1p/5pb1/3np3/7N/1PP1R2P/1P1Q1PP1/R1B3K1 w - - 1 19",
    "moves": [
      "h4g6",
      "f7g6",
      "e3d3",
      "c7c6",
      "c3c4"
    ],
    "rating": 1968,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Italian Game,Italian Game Two Knights Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0QxS4",
    "fen": "4r1k1/2pq1pp1/p2b4/1p1N4/3B2Q1/PP5P/1Pn2PP1/4R1K1 b - - 0 25",
    "moves": [
      "e8e1"
    ],
    "rating": 1100,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QxVS",
    "fen": "8/6p1/2k2p1p/p4p2/P1PK1PP1/7P/8/8 b - - 0 35",
    "moves": [
      "f5g4",
      "h3g4",
      "f6f5"
    ],
    "rating": 2039,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0QxWG",
    "fen": "rnbq1k1r/ppppb1pn/4p3/6NQ/5P2/8/PPP3PP/RNB1K2R w KQ - 2 9",
    "moves": [
      "h5f7"
    ],
    "rating": 874,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Bird Opening,Bird Opening Wagner-Zwitersch Gambit.",
    "playerColor": "w"
  },
  {
    "id": "lic-0QxXY",
    "fen": "rnb1r1k1/ppp2ppp/1b1p4/8/4P1nq/PNNB3P/1PP2PP1/R1BQ1RK1 w - - 1 11",
    "moves": [
      "h3g4",
      "c8g4",
      "d3e2"
    ],
    "rating": 1901,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Russian Game,Russian Game Three Knights Game.",
    "playerColor": "w"
  },
  {
    "id": "lic-0QxXi",
    "fen": "8/3R2pk/7p/1pq2p1Q/2npp3/7P/5PP1/6K1 w - - 2 45",
    "moves": [
      "h5f7",
      "c5e5",
      "d7e7",
      "e5e7",
      "f7e7"
    ],
    "rating": 1938,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0QxbH",
    "fen": "1r3rk1/3nbpp1/B3b1qp/4p3/8/1N2B2P/PPP2PPK/R1Q2R2 b - - 0 18",
    "moves": [
      "e6d5",
      "f2f3",
      "g6a6"
    ],
    "rating": 2141,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "Black to move — uncover the master-level combination (Tactical Shot) from Sicilian Defense,Sicilian Defense Najdorf Variation.",
    "playerColor": "b"
  },
  {
    "id": "lic-0VsgY",
    "fen": "8/8/P1PR4/8/r3k2p/3p4/7K/8 b - - 0 52",
    "moves": [
      "a4a6",
      "c6c7",
      "a6a2",
      "h2h3",
      "a2c2"
    ],
    "rating": 2117,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Vsju",
    "fen": "r1b2rk1/1p3p1p/pn1qpbp1/8/P2P4/1QN2N1P/1P3PP1/R3KB1R w KQ - 0 14",
    "moves": [
      "c3e4",
      "d6d8",
      "e4f6"
    ],
    "rating": 1268,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot) from Grunfeld Defense,Grunfeld Defense Stockholm Variation.",
    "playerColor": "w"
  },
  {
    "id": "lic-0VskH",
    "fen": "r4q1k/1p5p/p1n1R1p1/3Q2B1/2Bb2P1/7P/P1P2P2/6K1 b - - 1 25",
    "moves": [
      "f8f2",
      "g1h1",
      "f2g1"
    ],
    "rating": 1136,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Vsmi",
    "fen": "r1b1nrk1/pp1nb1p1/2p1p3/5qPQ/2P5/2N1B3/PP3PP1/2KR3R w - - 3 17",
    "moves": [
      "g2g4",
      "e8f6",
      "h5h8",
      "g8f7",
      "g4f5",
      "f8h8",
      "h1h8"
    ],
    "rating": 2479,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot) from Indian Defense,Indian Defense Wade-Tartakower Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0VsnJ",
    "fen": "kq6/1Nb5/PpQ1pp1p/3p4/8/8/8/5K2 w - - 3 40",
    "moves": [
      "b7d6",
      "a8a7",
      "d6b5",
      "a7a6",
      "b5c7",
      "a6a7",
      "c7b5"
    ],
    "rating": 2403,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0VsqQ",
    "fen": "3r1rk1/ppp3p1/8/3P2R1/7P/8/q1PQ2P1/6RK w - - 1 23",
    "moves": [
      "d2c3",
      "f8f7",
      "g1a1",
      "a2d5",
      "g5d5"
    ],
    "rating": 2496,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Vsqm",
    "fen": "2kr3r/1bp2p2/p2pq1p1/1p2b1P1/4P2P/2N5/PPPQ2B1/2KR3R w - - 0 19",
    "moves": [
      "g2h3",
      "c8b8",
      "h3e6"
    ],
    "rating": 1373,
    "theme": "Tactical Shot",
    "category": "Pins & Skewers",
    "description": "White to move — find the winning continuation (Tactical Shot) from Modern Defense,Modern Defense Standard Defense.",
    "playerColor": "w"
  },
  {
    "id": "lic-0Vst6",
    "fen": "3k4/1Kp3p1/4P3/5P1p/7P/8/8/8 b - - 2 42",
    "moves": [
      "c7c5",
      "b7b6",
      "c5c4",
      "b6c5",
      "c4c3"
    ],
    "rating": 1494,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0VsxD",
    "fen": "3r2k1/4qp1p/4p1pP/4P3/1pp2Q2/r2bPPP1/6K1/R3B2R w - - 0 28",
    "moves": [
      "e1b4",
      "e7b4",
      "f4f6"
    ],
    "rating": 1585,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Vsxf",
    "fen": "8/p7/P2k2pp/1Pp2p2/2Kb2P1/7P/6P1/8 w - - 0 40",
    "moves": [
      "b5b6",
      "a7b6",
      "a6a7"
    ],
    "rating": 1460,
    "theme": "Tactical Shot",
    "category": "Endgame & Defense",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Vsyf",
    "fen": "r6k/ppp1b1pp/5r2/4p3/3NPpq1/P7/1PP1QPN1/R1B2RK1 b - - 1 22",
    "moves": [
      "f4f3",
      "d4f3",
      "f6g6",
      "f3h4",
      "g4e2",
      "h4g6",
      "h7g6"
    ],
    "rating": 2428,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — uncover the master-level combination (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0Vt0Q",
    "fen": "8/6p1/5pkp/1P2p3/R2b1n2/5P2/6PP/5K2 w - - 1 37",
    "moves": [
      "a4d4",
      "e5d4",
      "b5b6",
      "d4d3",
      "f1e1"
    ],
    "rating": 1980,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Vt51",
    "fen": "1r3k2/5pp1/Q5n1/3p3p/R2Pq3/4P1PP/5P2/6K1 w - - 3 38",
    "moves": [
      "a6d6",
      "f8g8",
      "d6b8"
    ],
    "rating": 1183,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "White to move — find the winning continuation (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0Vt9g",
    "fen": "r1b2rk1/1p3ppn/p2p3q/3Pp1p1/4P3/4B1NP/PPBQ1Pn1/R3R1K1 w - - 0 20",
    "moves": [
      "g1g2",
      "h6h3",
      "g2g1"
    ],
    "rating": 1977,
    "theme": "Tactical Shot",
    "category": "Sacrifices & Attack",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot) from Ponziani Opening,Ponziani Opening Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-0VtBl",
    "fen": "r1b4k/p1q2rpp/1p6/4bR2/2B5/2PQ3K/PP6/3R4 w - - 0 28",
    "moves": [
      "d3d8",
      "c7d8",
      "d1d8",
      "f7f8",
      "d8f8"
    ],
    "rating": 1469,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "w"
  },
  {
    "id": "lic-0VtCx",
    "fen": "8/7R/2pk1p2/7p/2PK2pP/2P2r2/8/4B3 b - - 8 31",
    "moves": [
      "c6c5",
      "d4e4",
      "f6f5"
    ],
    "rating": 1411,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0VtEW",
    "fen": "r2qk2r/pp3ppp/2b1p3/2p1P3/3p4/1P1PnQ2/PBP3PP/RN3RK1 w kq - 0 13",
    "moves": [
      "f3f7"
    ],
    "rating": 821,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "White to move — find the winning continuation (Tactical Shot) from Bird Opening,Bird Opening Other variations.",
    "playerColor": "w"
  },
  {
    "id": "lic-0VtFE",
    "fen": "5rk1/ppp3pp/2pn4/8/3P1q2/2NQ3P/PPP3P1/4R1K1 b - - 0 21",
    "moves": [
      "f4f2",
      "g1h2",
      "f2e1"
    ],
    "rating": 1007,
    "theme": "Tactical Shot",
    "category": "Forks & Outposts",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0VtHO",
    "fen": "r3rb1k/pp4p1/2n2p2/q4N2/3p2Q1/3P3P/PPP2PP1/R2K1B1R b - - 4 19",
    "moves": [
      "a5e1"
    ],
    "rating": 781,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — find the winning continuation (Tactical Shot).",
    "playerColor": "b"
  },
  {
    "id": "lic-0VtHu",
    "fen": "8/p1k4p/2p5/3b1Q2/3p4/5n2/PPP3rP/4RK2 b - - 1 31",
    "moves": [
      "f3h2"
    ],
    "rating": 1573,
    "theme": "Tactical Shot",
    "category": "Mate & Back Rank",
    "description": "Black to move — calculate the sharpest forcing sequence (Tactical Shot).",
    "playerColor": "b"
  }
];
