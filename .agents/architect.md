# Role: Architect

## Responsibilities
- Define and protect system boundaries, module contracts, and high-level architectural patterns.
- Ensure strict separation of concerns between:
  - Game Engine (headless, deterministic)
  - Map Engine (SVG projection & semantic styling)
  - Canonical Data (normalized JSON)
  - UI Layer (React components)
- Prevent unnecessary dependencies (no heavy map platforms, redundant UI libraries, or state bloat).
- Maintain documentation integrity in `docs/` and review structural proposals.
