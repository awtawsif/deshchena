# Bangladesh 64 (দেশ চেনা)

> *Can you find all 64?*

A fast, interactive, educational Bangladesh geography web game built with React, TypeScript, Tailwind CSS, and GeoJSON/SVG.

## Features (MVP)
- Interactive Bangladesh map covering all 64 districts and 8 divisions.
- Bilingual: English and Bangla (বাংলা) district and division names.
- Deterministic game engine: Headless state machine, scoring, speed/streak bonuses, timer.
- Practice Mistakes mode: Immediate targeted practice on incorrect answers.
- 100% Client-side and offline-capable.

## Project Structure
```text
deshchena/
├── .agents/                 # Role definitions for agentic workflows
├── docs/                    # Architecture, Product, Game Design, and Data specs
├── data/
│   ├── geo/                 # Bangladesh GeoJSON data + source provenance
│   ├── divisions.json       # Canonical 8 divisions
│   └── districts.json       # Canonical 64 districts
├── scripts/                 # Validation & build scripts
├── src/
│   ├── components/          # Reusable UI components
│   ├── game/                # Headless game engine (scoring, state, generator)
│   ├── map/                 # SVG map renderer and semantic interaction states
│   └── pages/               # Game screens (Home, Play, Results)
```

## Getting Started

### Install
```bash
npm install
```

### Run Dev Server
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
