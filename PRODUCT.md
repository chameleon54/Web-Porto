# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers evaluating a web developer. They are screening quickly and want to judge skill and credibility, then reach the owner. The job: decide whether to get in touch, and do it in one step (email, WhatsApp or LinkedIn on `/about`).

## Product Purpose

Personal portfolio of Chairul Khuldan Hermansyah, Web Developer & Creative Technologist. It presents featured projects, skills, achievements, an About page and work experience. Success: the visitor reaches the About page and contacts him.

## Positioning

The site itself is the proof of skill. A scroll journey through a shader-based 3D universe (Gargantua black hole, galaxy, Solar System, Earth) demonstrates real WebGL ability, alongside genuine B2B and full-stack projects. A typical template portfolio cannot truthfully claim this.

## Operating Context

Static export hosted on Vercel (https://chairulkhuldanhermansyah-dev.vercel.app/). Routes: `/` (five snapped scroll stops), `/projects` (catalogue with category filters), `/about`. Background music plays across pages with a mute control.

## Capabilities and Constraints

- English-only UI copy and aria-labels.
- Custom Tailwind CSS and Framer Motion components; no third-party UI kits; approved libraries only (see `ai-docs/00_CORE_RULES.md`).
- Readable and usable down to 320px width; 60 FPS target on the canvas; `prefers-reduced-motion` honoured.
- `output: "export"`: no server handlers. Next.js 14 and React 18 are pinned because React Three Fiber v8 and drei v9 require React 18.
- Public contact details live in `src/data/profile.ts`; no secrets in source.
- Undecided: the background track (Interstellar theme) is a placeholder with an uncleared licence.

## Brand Commitments

Name, role and tagline come from `src/data/profile.ts`. The space theme is the established identity.

## Evidence on Hand

Real projects with screenshot galleries (`src/data/projects.ts`, `public/images/projects/`), certificates (`src/data/achievements.ts`), a work-experience timeline, and a portrait. The galaxy and Earth models are CC BY 4.0 and credited in the README. No testimonials, client logos or metrics exist; do not fabricate them.

## Product Principles

1. The site is the proof: the experience must demonstrate the skill it claims.
2. A contact path is always one step away.
3. Performance and mobile usability are part of the pitch, not afterthoughts.
4. Show only real evidence; never invent proof.

## Accessibility & Inclusion

Respect reduced-motion preferences, keep controls keyboard-navigable, and label everything in English.
