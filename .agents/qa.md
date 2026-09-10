# Role: QA Engineer

## Responsibilities
- Implement and maintain data validation scripts (`npm run validate:data`):
  - Exactly 8 divisions and 64 districts
  - Unique IDs, no null or missing values
  - Complete division mapping for all districts
  - Complete GeoJSON feature mapping without orphans
- Write unit and integration tests with Vitest + Testing Library:
  - Game engine state transitions, scoring, streaks, mistakes, timer
  - Seeded/deterministic question generator
  - Map interactions and state styling
- Maintain End-to-End (E2E) automated game completion verification.
- Guard against regressions before any milestone is marked complete.
