# Grandmaster Studio

Offline-capable chess workstation and Progressive Web App featuring Stockfish 19 WASM analysis, 36 chess variants, a Custom Variant Studio, 1,000+ tactical puzzles, interactive opening & endgame training, optional server-side Gemini coaching, and E2EE cloud sync.

## Features

- **Play Arena**: Timed Bullet, Blitz, Rapid, and Classical games against adaptive AI bots (100–3600 Elo), Coach Mode, or Pass & Play, with premoves, keyboard control, and notation input.
- **Stockfish 19 WASM + Built-in Engine**: Client-side Web Worker Stockfish 19 (for standard-rule and Chess960/Transcendental start-FEN games) paired with a Web Worker heuristic/minimax engine for rule-changing variants and instant offline responsiveness.
- **36 Chess Variants + Custom Variant Studio**:
  - Historical & fairy variants (`Chaturanga`, `Shatranj`, `Capablanca 10x8`, `Grand Chess`, `Los Alamos 6x6`, `Gardner 5x5`, `Cannon Siege`, `Amazon Chess`).
  - Rule variants (`Fog of War`, `Crazyhouse`, `Duck Chess`, `Horde`, `Atomic`, `Antichess`, `Giveaway`, `Racing Kings`, `Extinction`, `Checkless`, `Anti-Queen`, `Gladiator`, `Absorption`, `Knightmare`, `Upside-Down`).
  - Design custom boards up to 10×10, pick fairy pieces, toggle rule flags, and play immediately or save locally.
- **Puzzles & Training**: 1,000+ verified puzzles with Adaptive Rated mode, Puzzle Rush (`3:00`, `5:00`, `Survival`), Spaced Review deck, plus Opening Repertoire and Endgame Drills.
- **Post-Game Review & Strategy Coach**: Centipawn accuracy grading (`Best`, `Great`, `Brilliant`, `Inaccuracy`, `Mistake`, `Blunder`), real per-game Opening/Middlegame/Endgame phase tracking, and optional server-side Gemini coaching (`/api/coach/*`) with an explicit offline heuristic fallback (`/api/coach/offline`).
- **E2EE Cloud Sync & Local Vaults**: Client-side AES-GCM 256 encryption with SHA-256 vault access-token verification backed by `.data/sync-vaults.json`, plus `.gmchess` export/import.
- **Installable PWA**: Service worker precaching via `vite-plugin-pwa`, standalone app manifest, and in-app install prompt.

## Scripts

- `npm run dev` — Start Express + Vite dev server on port `3000`.
- `npm run build` — Build production bundle + PWA service worker into `dist/`.
- `npm run start` — Serve production build with `tsx server.ts` (`NODE_ENV=production`).
- `npm run lint` — Run TypeScript typechecking (`tsc --noEmit`).
- `npm test` — Run unit tests (`tsx --test src/engine/chessEngine.test.ts`).

## Environment Variables

See `.env.example`:

- `GEMINI_API_KEY`: Optional server-side Google Gemini API key for live AI Coach endpoints (`/api/coach/analyze` and `/api/coach/explain-move`). When absent or failing, the server returns explicit error statuses and the UI lets you opt into local heuristics via `/api/coach/offline`.
- `APP_URL`: Hosted application URL.
