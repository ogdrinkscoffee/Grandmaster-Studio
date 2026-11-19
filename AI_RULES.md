# AI Rules & Project Conventions

## Tech Stack
- **Frontend Framework:** React 19 with TypeScript (`tsconfig.json`, JSX transform `react-jsx`).
- **Build & PWA Tooling:** Vite 8 (`vite.config.ts`) with `@vitejs/plugin-react` and `vite-plugin-pwa` for offline/standalone PWA support.
- **Styling & Theming:** Tailwind CSS v4 (`@tailwindcss/vite`) configured in `src/index.css` with CSS custom properties (`--gm-*`, `--square-*`) managed by `src/context/ThemeContext.tsx` and `src/theme/themes.ts`.
- **Backend Server:** Express (`server.ts`) run via `tsx` (`npm run dev` / `npm start`), serving API routes and the Vite/static frontend.
- **Chess & Engine Logic:** `chess.js` combined with custom engine modules, Web Workers (`src/engine/engine.worker.ts`), and Stockfish integration (`src/engine/stockfishClient.ts`) in `src/engine/`.
- **AI Integration:** `@google/genai` (Google Gemini) used server-side in `server.ts` for AI coaching and analysis endpoints.
- **UI, Data Viz & Motion:** `lucide-react` for icons, `recharts` for charts/analytics, `motion` for animations, and `canvas-confetti` for milestone/achievement celebrations.
- **Testing & Type Checking:** TypeScript checks (`npm run lint` / `tsc --noEmit`) and Node test runner via `tsx --test` (`npm test`).

## Library Usage Rules
- **Chess Rules, FEN/PGN & Variants:** Always use `chess.js` and the existing helpers in `src/engine/` (`chessEngine.ts`, `customVariantEngine.ts`, `pgnImport.ts`, `variants.ts`) for move generation, validation, and PGN/FEN parsing. Do not reimplement standard chess rules in UI components.
- **Engine Evaluation & Bot Play:** Route heavy search and evaluation through `src/engine/engineClient.ts` / `engine.worker.ts` or `stockfishClient.ts` so calculations stay off the main UI thread.
- **AI Features (`@google/genai`):** Keep `@google/genai` calls and API keys strictly on the server in `server.ts`. Client components (such as `CoachView.tsx`) must call backend endpoints rather than importing or initializing the Gemini SDK in the browser.
- **Styling & Themes:** Use Tailwind CSS v4 utility classes together with the existing `--gm-*` and `--square-*` CSS variables for colors, surfaces, and board themes so all themes in `src/theme/themes.ts` continue to work. Avoid hardcoding theme-breaking colors.
- **Icons:** Use `lucide-react` for all UI icons. Keep custom SVGs limited to chess pieces (`src/components/ChessPieces.tsx`, `pieceShapes.tsx`) or app/brand icons.
- **Charts & Metrics:** Use `recharts` for graphs, rating/progress charts, and evaluation plots.
- **Animations & Feedback:** Use `motion` (`motion/react`) for UI transitions and `canvas-confetti` for celebratory effects (e.g., achievements or puzzle streaks).
- **Sound & Crypto Utilities:** Use `src/utils/sound.ts` for audio feedback and `src/utils/crypto.ts` for client-side encryption/sync helpers.

## Project Structure
- `src/App.tsx`: Top-level application shell and view switching.
- `src/components/`: Feature views and reusable UI components.
- `src/engine/`: Chess engine, variants, puzzles, openings, bot logic, and Web Worker clients.
- `src/context/` & `src/hooks/`: React contexts (e.g., `ThemeContext`) and custom hooks (`useOnlineStatus`, `usePWAInstall`).
- `src/types/`: Shared TypeScript types (`chess.ts`).
- `server.ts`: Express server, security middleware, rate limiting, and Gemini API routes.
