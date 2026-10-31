# Master AI Agent Blueprint: Space-Themed Interactive Portfolio

This file serves as the main instruction entry point for AI Coding Agents working on this repository.

## 1. Documentation Index

Read and adhere strictly to the specialized documentation files located in `.ai-docs/`:

* `00_CORE_RULES.md`: Security, Planning Mode, Language, & Guardrails.\
  - Security, Language, Mobile-First rules, and AI Tooling guidelines (\*\*Context7\*\*, \*\*Serena\*\*, \*\*Graphify\*\*).

* `01_TECH_STACK.md`: Allowed libraries, R3F specs, & setup rules.

* `02_3D_SCENE_PIPELINE.md`: 3D waypoints, GSAP scroll triggers, & camera state machine.

* `03_CONTENT_DATA.md`: English translated content schemas for Projects, Skills, Achievements, and Bio.

## 2. Page & Routing Architecture

```
src/
├── app/
│   ├── layout.tsx             # Root layout with Canvas background provider
│   ├── page.tsx               # Main 3D Scroll Journey (Intro -> Projects -> Skills -> Achievements -> About Preview)
│   ├── projects/
│   │   └── page.tsx           # All-Projects Grid Page (Scrollable catalog with category filtering)
│   └── about/
│       └── page.tsx           # Full Bio & Work Experience Timeline Page
├── components/
│   ├── 3d/
│   │   ├── SpaceCanvas.tsx    # R3F Main Canvas & Post-Processing
│   │   ├── Gargantua.tsx      # Black Hole Shader Mesh
│   │   ├── Galaxies.tsx      # Milky Way & Andromeda Particle Clouds
│   │   ├── SolarSystem.tsx    # Planetary Orbits
│   │   └── EarthMoon.tsx      # Earth & Moon Focus
│   ├── ui/
│   │   ├── Navigation.tsx     # Floating Header & Audio Toggle
│   │   ├── ProjectCarousel.tsx# Horizontal project viewer with "View All" button
│   │   ├── SkillsGrid.tsx     # Interactive skills showcase
│   │   ├── Achievements.tsx   # Certificates & Publication cards
│   │   └── AboutPreview.tsx   # Call-to-action to enter full /about route
│   └── modals/
│       └── ProjectModal.tsx   # Detailed project view modal
└── store/
    └── useSpaceStore.ts       # Zustand store tracking camera waypoint & current section

```

## 3. Immediate Implementation Steps for AI Agent

1. Verify `.ai-docs/00_CORE_RULES.md` before executing any command.

2. Initialize the Next.js TypeScript project with Tailwind CSS.

3. Construct `useSpaceStore.ts` to coordinate section indices `[0..4]`.

4. Build `SpaceCanvas.tsx` containing camera controls and procedural placeholder meshes for all 5 cosmic waypoints.

5. Implement GSAP `ScrollTrigger` snap-scrolling tied to section state updates.

6. Overlay 2D UI layers with Framer Motion transitions calibrated for mobile viewports (320px+).

\---

\## 🚀 Execution Workflow for AI Agent

1\. \*\*Context Initialization:\*\*

   - Load \`.ai-docs/\` using \*\*Context7\*\* to establish complete domain knowledge.

2\. \*\*Dependency & Architecture Mapping:\*\*

   - Analyze component structures and state flow using \*\*Graphify\*\* before creating new modules.

3\. \*\*Planning:\*\*

   - Draft the execution steps in \`TASK_PLAN.md\`.

4\. \*\*Development & Validation:\*\*

   - Implement code adhering strictly to \`00_CORE_RULES.md\` and test workflows using \*\*Serena\*\*.