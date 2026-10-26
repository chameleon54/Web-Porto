# Tech stack and pins

- next 14.2.35 + react/react-dom 18.3.1 are pinned on purpose: `@react-three/fiber` ^8 and drei ^9 need React 18. Next 15/16 need React 19 and break R3F 8; do not bump without migrating R3F to v9.
- three ^0.160, `@react-three/postprocessing` ^2.16, gsap ^3.12 (ScrollTrigger), framer-motion ^11, zustand ^4.5, lucide-react, Tailwind 3.4, TypeScript strict, ESLint 8 (`next/core-web-vitals`).
- `next.config.mjs`: `output: "export"`, `images.unoptimized`, `transpilePackages: ["three"]`. Build output is `out/`.
- `npm audit` reports Next advisories that only affect self-hosted servers; accepted because of static export.
- Path alias `@/*` -> `src/*`.
- Do not import the `postprocessing` package directly (transitive dep); use `@react-three/postprocessing` exports.
- Context7 MCP for library docs; R3F docs on Context7 default to v10, so verify API against v8.
