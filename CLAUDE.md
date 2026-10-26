# Space-Themed Interactive Portfolio

Before any work, read `ai-docs/blueprint.md` and the files it indexes
(`00_CORE_RULES.md`, `01_TECH_STACK.md`, `02_3D_SCENE_PIPELINE.md`, `03_CONTENT_DATA.md`).
The active execution plan is `ai-docs/TASK_PLAN.md`.

Key rules (details in `00_CORE_RULES.md`):
- UI text in English only; no hardcoded secrets or tokens (use `.env.local`); public contact details live in `src/data/profile.ts`.
- Approved libraries only; no third-party UI kits.
- Mobile-first, readable down to 320px; target 60 FPS on the canvas.
- Write/update TASK_PLAN.md before multi-component changes.

Tooling: use Context7 for library docs (Next.js, R3F, drei, GSAP, Framer Motion),
Serena for symbol-level code navigation/edits, Graphify for dependency mapping.
