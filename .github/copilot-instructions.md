# Copilot Instructions for Solitaires Project

## Overview

This is a collection of solitaire card games built with a layered architecture. Currently supports two games: Besieged Fortress (jQuery UI) and Bisley (React). Each game follows a shared domain-driven design pattern with three architectural layers.

## Build, Test, and Lint

### Installation
```bash
npm install
```

### Build
```bash
npm run build
```
Compiles TypeScript and bundles assets with Webpack. Outputs to `wwwroot/dist/`.

### Watch mode (for development)
```bash
npm run watch
```
Continuously rebuilds on file changes.

### Run all tests
```bash
npm test
```
Uses Mocha to run all `.ts` test files in `tests/` directory. Tests use `chai` for assertions.

### Run a single test file
```bash
npm test -- tests/bisley/domain/Game.spec.ts
```

### Run tests matching a pattern
```bash
npm test -- --grep "constructor"
```

### Lint
```bash
npm run lint
```
Runs ESLint on `src/` and `tests/`.

### Lint with auto-fix
```bash
npm run lint:fix
```

## Architecture

### Three-Layer Design

1. **Domain Layer** (`src/{game}/domain/`)
   - Pure game logic with strict invariants
   - No UI or application concerns
   - Classes like `Game`, `Card`, foundations, and card stacks
   - Events (e.g., `CardMovedEvent`) for change notifications
   - Domain logic answers "can I do this move?" and enforces rules

2. **Application Layer** (`src/{game}/application/`)
   - Orchestrates domain operations
   - Provides methods that don't map 1:1 to domain methods
   - Example: `canMoveCardToCard()` translates to `canMoveCardToStack()` calls
   - Handles UI-agnostic features like undo/redo using `History`
   - Exposes `GameService` as the main API
   - Publishes domain events to UI layer

3. **UI Layer** (`src/{game}/ui-{framework}/`)
   - Framework-specific implementations (jQuery or React)
   - Handles user interaction and rendering
   - Calls application layer to validate and execute moves
   - Listens for domain events and updates the view
   - jQuery UI: uses widgets; React: uses components

### Application State vs Domain State

The Application layer maintains **application state** that extends beyond domain state. This includes:
- UI-specific state (e.g., which card is selected, animation state)
- Features outside the domain scope (undo/redo history, order-violations detection, auto-build features)
- The domain model remains pure; application orchestrates domain operations plus these extra features

### Shared Code

`src/shared/domain/` contains reusable domain classes:
- `Card`, `CardValue`, `CardSuit`
- `Deck` (full 52-card deck or short 36-card deck)
- Base classes and utilities

`src/shared/ui-{framework}/` has shared UI utilities for each framework.

### Data Flow Example

A drag-and-drop move (Besieged Fortress):
1. User drags card on UI
2. UI asks `GameService.canMove(card)` → Application → Domain
3. User drops; UI asks `GameService.canMoveCardToStack(card, stack)` → Domain
4. Domain returns true/false; Application publishes `CardMovedEvent`
5. UI listens to event and animates/redraws accordingly

## Key Conventions

### TypeScript & Linting Rules

- **Interfaces**: PascalCase with `I` prefix (e.g., `IGameState`)
- **Type parameters**: PascalCase with `T` prefix (e.g., `<TCard>`)
- **Member ordering**: Static fields → instance fields → constructors → static methods → instance methods (enforced by ESLint)
- **Functions**: Must have explicit return types (e.g., `private getName(): string`)
- **Members**: Must have explicit accessibility (public/private/protected)
- **Type assertions**: Use `as` syntax, not angle brackets (except in interfaces)
- **Unused parameters**: Prefix with `_` if intentionally unused (e.g., `_event`)
- **Enums**: Use named enums, always initialize members
- **Booleans**: Use strict boolean expressions (no truthy/falsy coercion)
- **Nullish coalescing**: Prefer `??` over `||` for null checks
- **Arrays**: Use `Type[]` syntax, not `Array<Type>`

### Testing Patterns

- Test files: `{ClassName}.spec.ts` alongside or in `tests/{layer}/`
- Use `chai` for assertions
- Test builders like `DeckBuilder` in `tests/utils.ts` for setup
- Random test utilities in `tests/utils.ts` (e.g., `random.getRandomSuit()`)
- Override ESLint rules in `*.spec.ts` if needed (see `.eslintrc.json`)

### File Structure

Games are isolated under `src/{gameName}/`:
- `domain/`: Game logic
- `application/`: `GameService` (main API)
- `ui-jquery/` or `ui-react/`: UI implementation

Each game shares domain concepts but is independently implemented.

### Event System

Domain events (in `domain/events/`) are published by the domain and consumed by the application, which then publishes them to the UI. Example: `CardMovedEvent` is emitted when a card moves, allowing UI to react without tight coupling.

## Running the Applications

To test locally, open `wwwroot/index.html` in a browser after running `npm run build`. The HTML file contains links to both games.

**Besieged Fortress:**
- Uses jQuery UI with drag-and-drop interaction
- 36-card deck
- Goal: place all cards on bases (Aces through Kings) of the same suit
- Double-click to auto-move to foundation

**Bisley:**
- Uses React with click-based selection
- 52-card deck
- Goal: complete ace and king foundations by suit
- Click a card to select, then click destination (another card or empty column)
- Double-click to auto-move to foundation

## Project Setup

- **TypeScript**: ES5 target, CommonJS modules, strict null checks
- **Bundler**: Webpack (webpack.config.js defines entry points for each game)
- **Styles**: Sass files in `styles/{game}/` compiled to CSS
- **Test runner**: Mocha with ts-node for TypeScript execution
