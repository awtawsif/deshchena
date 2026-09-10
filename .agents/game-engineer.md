# Role: Game Engineer

## Responsibilities
- Implement headless, 100% deterministic game logic in `src/game/`.
- Manage `GameState`:
  - Question sequencing and progression
  - Active question selection via deterministic / seeded `QuestionGenerator`
  - Scoring rules (base points, speed bonus, streak bonus)
  - Timer and streak tracking
  - Mistake logging and mistake-practice session creation
  - End-game completion calculations (accuracy, total time)
- Ensure the game engine has zero dependencies on React or browser DOM so it can be thoroughly unit-tested in isolation.
- Support pluggable `GameMode` interface for future expansion (Divisions, Multiple Choice, Timed).
