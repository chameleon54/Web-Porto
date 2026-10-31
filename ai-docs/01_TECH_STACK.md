# Tech Stack Specifications & Constraints

## 1. Core Stack Summary
| Category | Technology | Usage |
| :--- | :--- | :--- |
| Framework | Next.js (React) | Application framework, App Router, SSR/SSG balance |
| Language | TypeScript | Strict type safety for 3D state, props, and project schemas |
| Styling | Tailwind CSS | Utility-first styling for 2D UI layers |
| Motion UI | Framer Motion | Smooth 2D animations, modals, side menus, text reveals |
| 3D & Graphics | Three.js / R3F / Drei | WebGL canvas, camera rig, procedural stars, shaders |
| Shaders / Post FX | `@react-three/postprocessing` | Bloom, Chromatic Aberration, Warp Speed distortion |
| Scroll Engine | GSAP + ScrollTrigger | Section-snapping logic & camera waypoint timeline control |
| Global State | Zustand | Managing active section index, modal states, audio levels |

## 2. Dependencies Declaration (`package.json` standard)
```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.90.0",
    "@react-three/postprocessing": "^2.16.0",
    "gsap": "^3.12.0",
    "framer-motion": "^11.0.0",
    "zustand": "^4.5.0",
    "lucide-react": "^0.300.0"
  }
}
```

## 3. WebGL & Shader Guidelines
- **Procedural Space Assets**:
  - Starfields generated using `@react-three/drei` `<Stars />` or custom `instancedMesh` point clouds to prevent heavy image texture downloads.
  - Black Hole (Gargantua) rendered via custom fragment shader (gravitational lensing effect + glowing accretion disk geometry).
  - Galaxies (Milky Way & Andromeda) built using logarithmic spiral particle systems with vertex color gradients.
  - Solar System & Earth: Procedural spheres with atmospheric glow shaders, seamlessly upgradable to GLTF/GLB models in future iterations.