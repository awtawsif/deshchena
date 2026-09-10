# Bangladesh 64 (Deshchena) — Agent Guidelines & Rules

## 1. Core Architectural Invariant: Deterministic Runtime
- **Zero Runtime LLM Dependencies**: The game engine, boundary calculations, scoring, question generation, timer, streak, and answer validation MUST be completely deterministic code.
- AI agents operate solely in the development, research, and content validation pipeline. The in-game player experience never queries an AI model.

## 2. Geographic & Factual Data Invariants
- **NEVER**:
  - Ask an LLM to invent coordinates or manually approximate district boundaries.
  - Silently modify geographic geometry.
  - Use display names (English or Bangla) as internal identifiers.
- **MUST**:
  - Obtain geographic boundaries from verified, attributed GeoJSON sources.
  - Maintain canonical metadata (`districts.json`, `divisions.json`) decoupled from GeoJSON geometry.
  - Assign stable identifiers (e.g., `BD-DHK`, `BD-GAZ`).
  - Run automated data validation verifying 8 divisions, 64 districts, no orphans, and valid GeoJSON.

## 3. Scope & MVP Guardrails (Explicit Non-Goals)
Do NOT implement the following during MVP unless explicitly requested:
- User accounts / authentication
- Backend server / database
- Multiplayer or chat
- AI chatbots or procedurally generated geography
- Social networking, payments, ads, or complex achievement systems

## 4. Separation of Concerns
- **Game Engine** (`src/game/`): Headless, framework-agnostic TypeScript logic (`GameState`, `QuestionGenerator`, `Scoring`, `Timer`, `Mistakes`). Must be 100% testable without rendering React.
- **Map Engine** (`src/map/`): SVG + GeoJSON projection, rendering, and semantic interaction states (`default`, `hover`, `active`, `correct`, `incorrect`, `disabled`).
- **Data Layer** (`data/`, `src/data/`): Canonical data separated from raw GeoJSON.
- **UI Layer** (`src/components/`, `src/pages/`): React components that observe game/map state and render accessible UI.

## 5. Milestone-Driven Execution
Development proceeds incrementally across defined milestones:
1. Bootstrap project (Vite + React + TS + testing + linting)
2. Acquire & validate geographic data (GeoJSON + canonical JSON + validator)
3. Build interactive SVG map renderer
4. Build headless game engine with full unit tests
5. Wire UI with Game Engine & Map
6. Results & Practice Mistakes mode
7. Responsive mobile & accessibility polish
8. Integration & E2E tests
9. Final QA & Review

Always verify tests and build before concluding a milestone, and commit changes cleanly.
