# Bangladesh 64 (Deshchena) — Architecture Specification

## 1. System Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│                      UI Layer                          │
│        React Components, Tailwind CSS, Sound/Haptics   │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌───────────────────────────┐  ┌─────────────────────────┐
│     Map Renderer Engine   │  │   Headless Game Engine  │
│   - SVG Vector Rendering  │  │   - GameState machine   │
│   - Semantic State Model  │  │   - Question Generator  │
│   - Touch/Mouse/A11y      │  │   - Scoring & Streaks   │
│   - Projection Transform  │  │   - Mistake Logging     │
└──────────────▲────────────┘  └───────────▲─────────────┘
               │                           │
               └─────────────┬─────────────┘
                             │
               ┌─────────────▼─────────────┐
               │    Canonical Data Store   │
               │   - data/divisions.json   │
               │   - data/districts.json   │
               │   - data/geo/*.geojson    │
               └───────────────────────────┘
```

---

## 2. Decoupled Core Modules

### 2.1 Headless Game Engine (`src/game/`)
- Pure TypeScript, zero React/DOM imports.
- Completely testable via Vitest.
- Interfaces:
  - `GameMode`: Contract for quiz modes (`find-district`, `multiple-choice`, etc.).
  - `GameState`: Reactive or reducer-driven state object.
  - `QuestionGenerator`: Deterministic question sequence generator (supports PRNG seed for reproducible testing).
  - `Scoring`: Transparent calculation isolated from UI components.

### 2.2 Map Engine (`src/map/`)
- SVG-based district path rendering.
- Maps each district to a semantic state:
  ```ts
  type DistrictVisualState = 'default' | 'hover' | 'active' | 'correct' | 'incorrect' | 'disabled';
  ```
- The game engine only sets district state (e.g. `districtStates.set("BD-GAZ", "correct")`); the renderer maps state to styling and visual transitions.

### 2.3 Canonical Data (`data/` and `src/data/`)
- Decoupled from GeoJSON properties. GeoJSON contains boundaries and a foreign key `id`.
- Canonical metadata contains English name, Bangla name, division ID, and URL slug.

---

## 3. Technology Stack
- **Frontend Framework**: React 18 / 19 + TypeScript (Strict Mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (lightweight utility styling) + CSS variables for theme tokens
- **Map Rendering**: Direct SVG with d3-geo projection or pre-projected GeoJSON coordinates
- **Unit & Integration Testing**: Vitest + React Testing Library
- **Linting & Code Style**: ESLint + Prettier
