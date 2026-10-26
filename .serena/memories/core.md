# web-porto core

Space-themed scroll portfolio: Next.js 14 App Router (static export) + R3F 8 + GSAP ScrollTrigger + Zustand + Framer Motion.
Spec lives in `ai-docs/` (blueprint.md, 00_CORE_RULES..03_CONTENT_DATA, TASK_PLAN.md). Read `00_CORE_RULES.md` before changes; update `TASK_PLAN.md` before multi-component work.

## Source map (src/)
- `app/page.tsx`: home, pins `#viewport-container`, calls `setupSpaceScroll()`. `app/template.tsx`: route-change iris overlay (sibling, never a wrapper; wrapping breaks pinned/fixed children).
- `components/3d/`: R3F scene. `CameraRig` samples CatmullRom splines from `lib/waypoints.ts` at store `progress`.
- `components/ui/`: 2D overlays, each wrapped in `SectionShell(index)`; only the active section is mounted.
- `store/useSpaceStore.ts`: sole cross-tree channel. `lib/spaceScroll.ts`: only writer of progress/section/warp.
- `data/*`: English content (projects, skills, achievements, experience, profile).

## Invariants
- Layering (verified with Graphify, no cycles): `data`, `lib`, `store` import no components; `3d` and `ui` never import each other; they communicate only via the store.
- 3D reads store with `useSpaceStore.getState()` inside `useFrame` (no React re-renders on scroll). UI uses selectors.
- Waypoint/object coordinates live only in `lib/waypoints.ts`.
- UI text English only; no secrets or emails in source (`.env.local`, see `.env.example`).
- Approved libraries only (see `mem:tech_stack`); no third-party UI kits.
- Static export: no server features (API routes, Server Actions, rewrites, image optimizer).

See `mem:suggested_commands`, `mem:conventions`, `mem:task_completion`.
