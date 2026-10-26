# Code conventions

- Files: PascalCase components, `useX` hooks/stores, named exports; only `page.tsx`/`template.tsx`/`layout.tsx` and `SpaceCanvas` (dynamic-imported, `ssr: false`) use default exports.
- Client components start with `"use client"`. R3F components must stay client-only.
- Per-frame code: no allocations in `useFrame`; reuse refs/vectors; read store imperatively.
- Section visibility in 3D via `useSectionVisibility(index, reach)`; each scene object also needs its own visibility reach.
- Shaders are inline GLSL template strings with `/* glsl */` tag; uniforms updated in `useFrame`.
- Mobile tier: `useThree(s => s.size.width < 768)` lowers particle counts and drops chromatic aberration.
- Styling: Tailwind utilities + `.glass`, `.star-bg`, `.no-scrollbar` in `globals.css`; design tokens (`void`, `nebula`, `ember`, `aurora`) in `tailwind.config.ts`.
- Tap targets >= 44px (`min-h-11`), readable at 320px; all aria-labels in English.
- Overlay `pointer-events-none` on sections, `pointer-events-auto` on interactive content.
- Content edits go in `src/data/*` (typed); personal name/bio in `data/profile.ts`.
