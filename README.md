# Bangladesh 64 (দেশ চেনা)

> *Can you find all 64?*

A fast, interactive, educational Bangladesh geography quiz game. Locate all 64 districts on an interactive SVG map under time pressure. Built with React, TypeScript, Tailwind CSS, and GeoJSON.

## Features

- **Interactive SVG Map** — All 64 districts of Bangladesh with zoom (1x–4x), pan, pinch-to-zoom on touch, and hover badges showing district names.
- **3 Difficulty Modes**
  - **Relaxed** — No timer, division hints available, constant speed bonus.
  - **Normal** — 15-second timer per question, decaying speed bonus.
  - **Hard** — 5-second timer, district labels hidden, aggressive speed decay.
- **Scoring System** — Base points + speed bonus + streak bonus (up to +50 at 5+ streak). Streak indicator with visual pulse at 3+.
- **Practice Mistakes** — After a game ends, replay only the districts you missed.
- **Bilingual** — English and Bangla (বাংলা) district and division names with a language toggle. Preference persisted in localStorage.
- **Sound Effects** — Synthesized via Web Audio API (no audio files). Correct chime, incorrect buzz, click, victory arpeggio. Mute toggle persisted in localStorage.
- **Zero Runtime AI** — All game logic is deterministic. No backend, no database, fully offline-capable.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 3 |
| Build | Vite 5 |
| Map Projection | d3-geo (Mercator, pre-projected at build time) |
| Icons | Lucide React |
| Testing | Vitest + Testing Library + Puppeteer (QA) |
| CI | GitHub Actions |

## Project Structure

```text
deshchena/
├── .agents/                      # Role definitions for agentic workflows
├── .github/workflows/ci.yml      # CI pipeline: validate, test, build
├── docs/                         # Architecture, Product, Game Design, Data specs
├── data/
│   ├── geo/                      # Bangladesh GeoJSON + source provenance
│   ├── divisions.json            # Canonical 8 divisions (DIV-*)
│   └── districts.json            # Canonical 64 districts (BD-*)
├── public/
│   ├── favicon.svg
│   └── maps/                     # GeoJSON served at runtime
├── scripts/
│   ├── prepare-data.ts           # Normalizes raw GeoJSON → canonical JSON
│   ├── validate-data.ts          # Validates data integrity (8 divs, 64 dists)
│   ├── generate-paths.ts         # d3-geo → pre-projected SVG path strings
│   ├── qa-browser.ts             # Puppeteer cross-viewport QA audit
│   └── qa-deep-audit.ts          # Puppeteer a11y & flow verification
├── src/
│   ├── components/               # Header, QuestionCard, ScoreBoard, FeedbackBanner
│   ├── pages/                    # HomeScreen, GameScreen, ResultsScreen
│   ├── game/                     # Headless engine, scoring calculator, question generator
│   ├── map/                      # BangladeshMap, DistrictPath, pre-projected paths
│   ├── data/                     # Typed data layer with O(1) lookups
│   └── utils/audio.ts            # Web Audio API sound effects manager
├── qa-screenshots/               # Puppeteer-generated QA screenshots
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### Validate Geographic Data

```bash
npm run validate:data
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

The project has 23+ test cases across 4 files:

| Suite | Coverage |
|---|---|
| `src/data/data.test.ts` | Data loading, district/division lookups |
| `src/game/game.test.ts` | Scoring calculator, question generator, game engine state machine |
| `src/map/map.test.tsx` | Map rendering, click/keyboard handlers, visual states, zoom controls |
| `src/App.test.tsx` | Full app flow: home → game → results → practice mistakes |

Additionally, `scripts/qa-browser.ts` and `scripts/qa-deep-audit.ts` run Puppeteer-based cross-viewport and accessibility audits.

## Data Provenance

Geographic boundaries sourced from UN OCHA/HDX, verified against geoBoundaries. Licensed under CC BY-IGO 3.0. See `data/geo/source.md` for full provenance details.

## License

MIT
