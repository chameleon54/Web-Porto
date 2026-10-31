# TASK_PLAN.md — Space Portfolio, Phase 1 (Scaffold + Scroll Journey)

Status: Steps 1-5 implemented (scaffold, data, store, 3D scene, scroll, UI, routes). `tsc`, `next lint`, `next build` pass; all 3 routes return 200.
NOT yet verified: visual/WebGL output (shader compile, camera framing), real-device 320px layout, 60 FPS. Step 6 (tuning, perf) is open.
Known issue: Next 14.2.35 has open npm-audit advisories; fixed only in Next 16 (React 19, incompatible with R3F v8). Decision pending.

## 0. Findings & decisions needed before coding

| # | Finding | Proposed resolution |
| :-: | :--- | :--- |
| 1 | Docs live in `ai-docs/` (no dot); `mcp.json` and the prompt reference `.ai-docs/`. | Keep `ai-docs/`; fix `CONTEXT7_DOCS_PATH` to `./ai-docs` (or rename folder). |
| 2 | `01_TECH_STACK` pins `@react-three/fiber ^8` + drei `^9`, which need **React 18**, but declares `next/react: latest` (React 19). Peer-dependency conflict. | Pin **Next 14.2.x + React 18.3** (App Router, stable with R3F 8). |
| 3 | Certificate images are in `public/assets/certificates/` with spaces in names; `03_CONTENT_DATA` expects `/images/achievements/English_certificate.png` etc. | Copy/rename to `public/images/achievements/{English_certificate,WebVR_workshop,diagram_metode_terstruktur_workshop}.png`. |
| 4 | `public/images/projects/*.png` do not exist. | Gradient/placeholder fallback in the carousel until real images are supplied. |
| 5 | Context7 / Serena / Graphify MCP servers are not exposed in this session (only configured in `mcp.json`; package names such as `@context7/mcp-server` are unverified). | Do the dependency mapping by hand (section 3 below), validate with `tsc`, `eslint`, `next build`, and browser checks. Restart Claude Code with the MCP servers loaded if you want those tools used. |
| 6 | `00_CORE_RULES` forbids hardcoded emails/secrets. Contact must use `.env.local` (`NEXT_PUBLIC_CONTACT_SERVICE_ID`). | Contact link reads env vars; ship `.env.example` only. |
| 7 | Doc spec: `setupSpaceScroll` pins a container with `scrub: 1` + `snap`. A pinned scrub with a hidden camera timeline is the right fit for the camera rig. | Adopt as specified (section 4). |

## 1. Target files

Create (all under `src/`):

```
app/layout.tsx, app/globals.css, app/page.tsx
app/projects/page.tsx          # catalog + category filter
app/about/page.tsx             # bio + experience timeline
components/3d/SpaceCanvas.tsx  # Canvas, CameraRig, postprocessing
components/3d/CameraRig.tsx    # reads store progress -> camera
components/3d/Gargantua.tsx    # lensing shader + accretion disk
components/3d/Galaxies.tsx     # log-spiral Points (Milky Way, Andromeda)
components/3d/SolarSystem.tsx  # sun + orbiting spheres
components/3d/EarthMoon.tsx    # Earth + atmosphere shader + Moon + clouds
components/3d/WarpEffect.tsx   # speed lines + chromatic aberration driver
components/ui/Navigation.tsx, ProjectCarousel.tsx, SkillsGrid.tsx,
              Achievements.tsx, AboutPreview.tsx, SectionShell.tsx
components/modals/ProjectModal.tsx
hooks/useSpaceScroll.ts        # wraps setupSpaceScroll lifecycle
lib/spaceScroll.ts             # setupSpaceScroll (from 02 doc)
lib/waypoints.ts               # camera waypoint constants (single source of truth)
store/useSpaceStore.ts
data/projects.ts, skills.ts, achievements.ts, experience.ts   # from 03 doc
```

Also: `.env.example`, `tailwind.config.ts`, `tsconfig.json` (strict), `next.config.mjs` (transpile three if needed).

## 2. Zustand flow (`useSpaceStore.ts`)

```ts
interface SpaceState {
  sectionIndex: 0|1|2|3|4;      // committed section (UI + a11y)
  progress: number;             // 0..1 continuous scroll (camera)
  warp: number;                 // 0..1 warp intensity (post-FX)
  activeProjectId: string | null; // modal
  audioEnabled: boolean;        // default false (autoplay policy)
  setSection(i), setProgress(p), setWarp(w), openProject(id|null), toggleAudio()
}
```

- **Writers:** only `spaceScroll.ts` (progress, section, warp) and UI (`openProject`, `toggleAudio`, Navigation jump).
- **Readers:** UI uses selector subscriptions (`useSpaceStore(s => s.sectionIndex)`). R3F components read `progress`/`warp` **imperatively via `useSpaceStore.getState()` inside `useFrame`**, so scrolling causes zero React re-renders in the canvas.
- Navigation "jump to section" calls `gsap.to(window, {scrollTo})` equivalent via `ScrollTrigger.scroll()` (no extra plugin) — store is updated by the trigger, not directly, so there is one source of truth.
- `progress` is the single scalar that drives the camera; `warp = |d progress/dt|` smoothed, so speed lines appear only while travelling.

## 3. Dependency map (manual Graphify substitute)

```
data/*  ─────────────────────────────► components/ui/*, app/projects, app/about
lib/waypoints ─► components/3d/CameraRig
store ◄── lib/spaceScroll (write)   ──► components/ui/* (read, selectors)
store ──► components/3d/* (getState in useFrame)
components/3d/*  ✗ never import components/ui/*   (one-way: ui → store ← 3d)
lib/*, data/*, store/* import nothing from components/*
```

Rules that prevent cycles/prop drilling: components communicate **only through the store**; 3D and UI trees never import each other; `data/` and `lib/` are leaf layers. Verify with `npx madge --circular src` (dev-only tool, not shipped) or an ESLint `import/no-cycle` check — will ask before adding either since they're outside the approved list.

## 4. R3F scene + GSAP timeline coordinates

Scene layout (world units; each waypoint is ~200 apart on -Z so objects don't overlap in the frustum). Camera `fov 55`, lookAt target shown.

| Idx | Section | Camera position | lookAt | Object at target |
| :-: | :--- | :--- | :--- | :--- |
| 0 | Intro | `(0, 2, 30)` | `(0, 0, 0)` | Gargantua at origin, radius 6, disk radius 14 |
| 1 | Projects | `(0, 20, -140)` | `(0, 0, -200)` | Milky Way `(-35,0,-200)`, Andromeda `(40,6,-210)` |
| 2 | Skills | `(0, 8, -330)` | `(0, 0, -380)` | Sun `(0,0,-380)`, 6 planets, orbit radii 8–40 |
| 3 | Achievements | `(6, 2, -520)` | `(0, 0, -560)` | Earth r=5 `(0,0,-560)`, Moon r=1.4 orbiting at 14 |
| 4 | About | `(0, 0.5, -548)` | `(0, -2, -560)` | Earth surface/cloud entry, atmosphere in front |

- `CameraRig` interpolates between waypoints with `CatmullRomCurve3` for position and lerped lookAt, sampled at `progress`.
- **Placeholder reconciliation:** the 5 positions are tuning values and live only in `lib/waypoints.ts`; expect to adjust after a visual pass.

GSAP (`lib/spaceScroll.ts`, per `02` doc):
- `ScrollTrigger` on `#viewport-container`, `pin: true`, `end: +=${n*100}%`, `scrub: 1`.
- `snap: { snapTo: 1/(n-1), duration {0.8,1.2}, delay 0.1, ease 'power3.inOut' }` → 5 snap stops at progress `0, .25, .5, .75, 1`.
- `onUpdate`: `setProgress(self.progress)`, `setSection(round(progress*4))`, `setWarp(clamp(|self.getVelocity()|/k))`.
- Cleanup: `trigger.kill()` on unmount (React strict-mode safe); `ScrollTrigger.refresh()` on resize.
- Reduced motion: `prefers-reduced-motion` → shorter snap, warp effect off.

Post-processing (`@react-three/postprocessing`): Bloom (always), ChromaticAberration offset = `warp * 0.004`; mobile tier disables aberration and lowers bloom `mipmapBlur`/resolution.

## 5. 2D UI layers (Framer Motion)

Each section is an absolutely positioned `.space-section` overlay; only the active one is shown via `AnimatePresence` (fade + 24px translate, ≤0.5s).

- **Section 0** Hero: name, role, "Scroll to begin" hint.
- **Section 1** `ProjectCarousel`: horizontal scroll-snap, drag on touch, "View All" → `/projects`; card click → `ProjectModal`.
- **Section 2** `SkillsGrid`: categories from `SKILLS_DATA`, 1-col at 320px → 2/3-col up.
- **Section 3** `Achievements`: cards with type badge; certificate images lazy-loaded.
- **Section 4** `AboutPreview`: CTA → `/about`.
- `Navigation`: floating header, section dots, audio toggle (Zustand `audioEnabled`).

Audio: BGM + whoosh via `HTMLAudioElement`, started only after user gesture. Audio files are not provided, so the toggle ships wired up but silent until assets are added to `public/audio/`.

## 6. Performance budget (60 FPS)

- DPR clamp `[1, 1.5]` mobile / `[1, 2]` desktop via `<Canvas dpr>` and `PerformanceMonitor` (drei) to step quality down.
- Particles in one `Points` per galaxy (≤ 20k desktop / 6k mobile), shared geometry, no per-frame allocations.
- Only render the object for the current ±1 section (`visible` toggled from store) to cut draw calls.
- Shaders: single-pass, no loops > 32 iterations in Gargantua lensing.
- Dynamic import `SpaceCanvas` with `ssr: false`; static UI renders first.
- No image textures (all procedural).

## 7. Mobile-first checklist (320px+)

- [ ] Body/headings use fluid `clamp()` type; min body 14px, tap targets ≥ 44px.
- [ ] No horizontal overflow at 320px (test 320, 375, 768, 1280).
- [ ] Carousel card width `min(86vw, 22rem)`; modal is full-screen sheet < 640px, scrollable inside.
- [ ] Skills grid 1 column at 320px; achievements stacked.
- [ ] Use `100svh`/`dvh` for pinned container (mobile URL bar).
- [ ] Touch: wheel + swipe both advance snap (native scroll drives ScrollTrigger).
- [ ] Particle count and postprocessing reduced on narrow/low-power devices.
- [ ] `prefers-reduced-motion` honored; all buttons have English `aria-label`s.
- [ ] Text contrast over the canvas ≥ 4.5:1 (semi-transparent backdrop panels).

## 8. Security & language checklist

- [ ] No keys/emails in source; `.env.example` lists `NEXT_PUBLIC_CONTACT_SERVICE_ID` only; `.env*.local` in `.gitignore`.
- [ ] All UI strings and `aria-label`s in English (Indonesian source content already translated in `03`).
- [ ] No third-party UI kits; `lucide-react` is the only icon dependency (listed in `01`).

## 9. Execution order & validation

1. Scaffold Next 14 + TS + Tailwind; install the approved deps only. → `tsc --noEmit`
2. `data/*`, `store/useSpaceStore.ts`, `lib/waypoints.ts`. → type-check
3. `SpaceCanvas` + `CameraRig` + 5 placeholder meshes (Gargantua shader, Galaxies, SolarSystem, EarthMoon). → run dev server, screenshot each waypoint
4. `lib/spaceScroll.ts` + hook, wire to store. → verify 5 snap stops and section index
5. UI layers + Framer Motion + modal + `/projects` + `/about`. → check at 320/375/768/1280 widths
6. Post-FX warp, perf tuning, `next build` + `eslint`.

Each step ends with a runnable state; I'll report issues rather than skipping failing checks.
