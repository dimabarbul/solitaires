# Copilot instructions for Solitaires (improved)

Purpose: short, exact guidance for Copilot CLI sessions. Include commands, high-level architecture, and repo-specific patterns.

---

## Build, test, and lint (commands)

- Install deps: `npm install`
- Build: `npm run build` (webpack → outputs to wwwroot/dist/)
- Watch builds: `npm run watch`
- Run all tests (Vitest): `npm test`
- Run tests in watch mode: `npm run test:watch`
- Run a single test file (path):
  - `npm test -- tests/bisley/domain/Game.spec.ts`
- Run tests matching pattern (grep):
  - `npm test -- --grep "pattern"`
- Lint: `npm run lint` (runs ESLint on `src/` and `tests/`)
- Auto-fix lint: `npm run lint:fix`

Notes:
- Vitest is configured (see `vitest.config.ts`). Use full path to a spec file for single-file runs.
- Tests use `chai` for assertions.

---

## High-level architecture (big picture)

- Three-layer architecture per game:
  1. Domain (`src/{game}/domain/`) — pure rules, invariants, events (e.g., CardMovedEvent). Domain answers "can this move be done?" and performs state changes.
  2. Application (`src/{game}/application/`) — maps UI actions to domain calls, orchestrates multi-step operations (e.g., moveCardToCard → get stack → domain). Holds application-level state (undo/redo via History, auto-build, order-violation tracking). Exposes GameService API.
  3. UI (`src/{game}/ui-{framework}/`) — framework-specific (jQuery widgets or React components). Responsible for rendering, animations, and user interactions. Calls GameService for validation and execution.

- Shared kernel: `src/shared/` contains domain primitives (Card, Deck, CardStack), UI helpers, and cross-game libs (History, Commands).
- Entry points: HTML under `wwwroot/` (`index.html`, `besieged-fortress-jquery.html`, `bisley-react.html`) — useful for manual QA and smoke checks after build.
- Assets: card images in `wwwroot/images/cards/` and SASS styles in `styles/` per game.

---

## Key conventions (repo-specific)

- Domain purity: Domain layer must not depend on UI or application utilities. Side-effects limited to emitting domain events.
- Application layer responsibilities:
  - Translate UI-level operations (move-to-card) into domain-level stack operations.
  - Provide undo/redo via `src/shared/libs/History.ts` and expose via GameService.
  - Contain optional features (order-violations detection, auto-build) that are part of app state, not domain.
- Event flow: Domain → Application (re-emits) → UI. UI depends on application events for rendering.
- Tests:
  - Location: `tests/` or `tests/{game}/...` alongside domain tests.
  - Use `tests/utils.ts` test builders and random helpers.
  - Spec filenames use `.spec.ts` suffix; run specific file by passing path to `npm test -- <path>`.
- TypeScript & ESLint conventions (enforced by project):
  - Interfaces prefixed `I` (IGameState).
  - Explicit return types on functions and explicit accessibility on members.
  - `Type[]` arrays, `as` assertions, `_` prefix for intentionally unused params.
  - Member ordering: static fields → instance fields → constructor → static methods → instance methods.

---

## Developer shortcuts & helpful paths

- GameService examples: `src/bisley/application/GameService.ts`, `src/besieged-fortress/application/GameService.ts`.
- Domain samples: `src/bisley/domain/`, `src/besieged-fortress/domain/`.
- Shared domain primitives: `src/shared/domain/` (Card, Deck, CardStack, DTOs).
- UI React entry: `src/bisley/ui-react/index.tsx`.
- jQuery UI entry: `src/besieged-fortress/ui-jquery/index.ts`.
- Tests entry: `tests/` and `tests/bisley/domain/*`

---

## Editor / LSP guidance

- Repo includes `.github/lsp.json` for TypeScript language-server start options. If using workspace LSP, prefer `npx typescript-language-server --stdio` as configured.

---

## What Copilot sessions should do first

- Run `npm install` then `npm test` to verify baseline.
- Use `npm run build` and open `wwwroot/index.html` for quick manual smoke.
- For code navigation: open `src/shared/domain/`, `src/{game}/application/` and `src/{game}/domain/` to understand move-flow and event usage.

---

If any of these commands differ from local environment, check `package.json`, `vitest.config.ts` and `webpack.config.js` before proceeding.
