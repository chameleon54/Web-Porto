# Chairul Khuldan Hermansyah | Space Portfolio

An interactive, space-themed portfolio. Scrolling flies a camera through a 3D universe, from the **Gargantua black hole** through a **galaxy** and the **Solar System** down to **Earth**. Each stop reveals a section of the portfolio: projects, technical skills, achievements and an About preview.

**Live site:** https://chairulkhuldanhermansyah-dev.vercel.app/

The site is already deployed on [Vercel](https://vercel.com) from this repository, so you can view it without running anything.

## Features

- **Splash screen** with a real loading percentage, a pulsing singularity, and a shockwave that opens onto the black hole.
- **Scroll journey**: one wheel or swipe moves to the next section. The camera warps between five 3D scenes, with speed lines and chromatic aberration during the jump.
- **3D scene**: a shader-based black hole with an accretion disk, a point-cloud galaxy model, an orbiting Solar System with a glowing sun, and an Earth with a day-side satellite texture and procedurally generated city lights on the night side.
- **Content**: featured projects with screenshot galleries, a skills grid, clickable achievements that open the full certificate, and a full `/projects` catalogue with category filters.
- **About page** with a framed portrait, contact links and a work-experience timeline.
- **Background music** that keeps playing across pages, with a mute button and a "Now playing" card.
- **Mobile first**: usable down to a 320 px wide screen, with lighter particle counts and effects on phones.
- **Accessibility**: respects `prefers-reduced-motion`, keyboard-navigable controls and English labels throughout.

## Tech stack

| Area | Technology |
| :--- | :--- |
| Framework | Next.js 14 (App Router) with React 18 and TypeScript |
| Styling | Tailwind CSS, custom components (no UI kit) |
| UI motion | Framer Motion |
| 3D | Three.js, React Three Fiber, `@react-three/drei`, `@react-three/postprocessing` |
| Scroll engine | GSAP + ScrollTrigger |
| State | Zustand |
| Icons | lucide-react |
| Hosting | Vercel, as a static export |

Next.js 14 and React 18 are pinned on purpose. React Three Fiber v8 and drei v9 require React 18, so moving to Next.js 15+ (React 19) would also mean migrating the 3D libraries.

## Requirements

- **Node.js 18.17 or newer** (developed on Node 22)
- **npm** (comes with Node.js)
- A browser with **WebGL 2** support

## Run it locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Then open http://localhost:3000.

### Other scripts

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build. Writes a static site to `out/` |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | TypeScript check without emitting files |

The site is built with `output: "export"`, so `npm run build` produces plain static files in `out/`. To preview that build locally, serve the folder, for example with `npx serve out`. `npm start` does not apply to a static export.

If the build ever fails with `PageNotFoundError: /_document` after switching between dev and build, delete the `.next` and `out` folders and build again.

## Deploying

The project deploys to Vercel with no special configuration. Import the repository in Vercel, keep the **Next.js** framework preset, and deploy. There are no required environment variables.

## How it is built

### Project structure

```
src/
├── app/                  # Routes: home journey, /projects, /about, layout, page transition
├── components/
│   ├── 3d/               # React Three Fiber scene (canvas, camera rig, black hole, galaxy, Solar System, Earth)
│   ├── ui/               # 2D overlays: splash, hero, navigation, section content, audio player
│   └── modals/           # Project and achievement detail windows
├── data/                 # All content: projects, skills, achievements, experience, profile, music
├── lib/                  # Camera waypoints, Earth orbit maths, GSAP scroll setup, contact links
└── store/                # Zustand store shared by the 3D and 2D layers
public/                   # Images, textures, 3D models, background music
ai-docs/                  # Project specification and the task plan used during development
```

### How the pieces fit together

1. **One scroll, one camera path.** GSAP ScrollTrigger pins the viewport and snaps to five stops. The scroll progress is written to the Zustand store, and a camera rig reads it each frame and moves the camera along a spline through the waypoints defined in `src/lib/waypoints.ts`.
2. **3D and 2D never import each other.** The 3D scene and the HTML overlays communicate only through the store. The 3D code reads the store inside the render loop, so scrolling doesn't cause React re-renders.
3. **Procedural first.** Stars, the black hole, the sun and the atmosphere are generated with shaders, so there are few downloads. Only the galaxy and Earth use external assets.
4. **UI waits for the warp.** Each section's content fades out when you leave a stop and fades in when the camera arrives.
5. **Earth is part of the Solar System.** The camera warps to the real orbiting Earth. Its orbit is a pure function of time and scroll, shared by the camera and the planet so they always agree.

### Editing the content

Everything shown on the site comes from `src/data/`:

- `profile.ts`: name, role, bio, contact details and social links
- `projects.ts`: project descriptions, tech stacks and screenshots
- `achievements.ts`, `skills.ts`, `experience.ts`
- `music.ts`: the background track

Images go in `public/images/`.

### Development workflow

The project was planned and built with the help of an AI coding assistant (Claude Code). The specification the assistant worked from is in [`ai-docs/`](ai-docs/), including the rules, tech-stack limits, 3D scene pipeline, content schemas and the task plan. The assistant used the Context7, Serena and Graphify MCP tools for library documentation, code navigation and dependency mapping.

## Credits and licences

- The source code in this repository is the author's own work.
- **Galaxy model:** ["Need some space?"](https://sketchfab.com/3d-models/need-some-space-d6521362b37b48e3a82bce4911409303) by [Loïc Norgeot](https://sketchfab.com/norgeotloic), licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/). Changes: recentered and rescaled, and rendered with custom glow and blending.
- **Earth:** ["Earth"](https://sketchfab.com/3d-models/earth-41fc80d85dfd480281f21b74b2de2faa) by [Akshat](https://sketchfab.com/shooter24994), licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/). Changes: the texture was extracted and re-lit with a custom day/night shader, and generated city lights were added to the night side.
- **Background music:** "Hans Zimmer (Interstellar Main Theme) - Space 4k - no copyright Interstaller inspired Music" by [PowerStanik](https://youtu.be/LpGx4uqtvgs) on YouTube. The theme itself is by Hans Zimmer. The uploader's "no copyright" label is not a licence; check the rights before commercial use.
- **Fonts:** Space Grotesk and Inter, via `next/font/google`.

## Contact

See the [About page](https://chairulkhuldanhermansyah-dev.vercel.app/about) on the live site for email, WhatsApp, GitHub, LinkedIn and Instagram.
