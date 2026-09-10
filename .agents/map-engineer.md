# Role: Map Engineer

## Responsibilities
- Manage GeoJSON parsing, geographic projection (e.g. d3-geo / Mercator or preprojected SVG path data), and SVG coordinate systems.
- Build high-performance interactive SVG map renderer.
- Implement district semantic visual states:
  - `default`
  - `hover`
  - `active`
  - `correct`
  - `incorrect`
  - `disabled`
- Ensure map interaction works flawlessly across touch, mouse, and keyboard navigation.
- Optimize rendering performance: ensure district state updates do not cause expensive full map re-projections or re-renders (<100ms interaction latency).
- Guarantee geographic boundary accuracy and validate GeoJSON geometry.
