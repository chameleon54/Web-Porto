---
name: Space Portfolio
description: A dark, instrument-panel UI floating over a shader-built journey from a black hole to Earth.
colors:
  void: "#02030a"
  void-glow: "#1b1250"
  nebula: "#7c5cff"
  ember: "#ff9f43"
  aurora: "#4de3c1"
  starlight: "#e8ecff"
  glass-fill: "rgba(6, 8, 24, 0.62)"
  glass-border: "rgba(160, 180, 255, 0.16)"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 6.5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.25
  headline:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
  title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.3em"
rounded:
  md: "6px"
  lg: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  card-glass:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.lg}"
    padding: "16px"
  button-cta:
    backgroundColor: "#ffffff"
    textColor: "#000000"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "44px"
  chip-skill:
    backgroundColor: "rgba(255, 255, 255, 0.10)"
    textColor: "{colors.starlight}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: Space Portfolio

## Overview

**Creative North Star: "The Observatory Deck"**

The interface is a quiet instrument panel. The 3D universe is the show; the 2D layer is dark glass and small, precise readouts floating in front of it. Text never competes with the scene: it sits on translucent panels or on a soft dark scrim, and the camera's warp between stops does the dramatic work.

Density is low and centred. One idea per stop, a single heading, a single set of cards, a single call to action. Colour is a near-black void with three signal accents used as labels, never as fills.

**Key Characteristics:**
- Near-black canvas, light text, always `color-scheme: dark`.
- Three signal accents (violet, amber, mint), each with one job.
- Flat translucent glass over the live scene; no drop shadows.
- Readability over bright 3D (accretion disk, sun, Earth) is solved with scrims and text-shadow, not by dimming the scene.
- Motion is short fades and small translates; `prefers-reduced-motion` collapses it.

## Colors

Deep-space dark with three signal accents.

### Primary
- **Nebula Violet** (#7c5cff): interaction colour. Focus outlines on cards and controls.

### Secondary
- **Ember Amber** (#ff9f43): the eyebrow line above the hero name (the role).

### Tertiary
- **Aurora Mint** (#4de3c1): section and category labels (skill group titles, "Entering Earth's atmosphere").

### Neutral
- **Void** (#02030a): page and canvas background, theme-color.
- **Void Glow** (#1b1250): the deep-indigo horizon in the radial backdrop used on routes without the WebGL canvas.
- **Starlight** (#e8ecff): default body text.
- **Glass Fill** (rgba(6, 8, 24, 0.62)) and **Glass Border** (rgba(160, 180, 255, 0.16)): the panel surface.
- Project-card headers use per-category gradients (indigo, fuchsia, emerald, amber with cyan/orange/sky/rose) at 30-60% opacity as a fallback behind screenshots.

### Named Rules
**The Signal Accent Rule.** Violet, amber and mint are labels and focus rings, not surfaces. If an accent fills a large area, it is wrong.

**The White CTA Rule.** The single primary action on a stop is solid white with black text, the only fully opaque light element in the system.

## Typography

**Display Font:** Space Grotesk (with system-ui, sans-serif)
**Body Font:** Inter (with system-ui, sans-serif)

**Character:** A geometric, slightly technical display face over a neutral reading face; the pairing reads as instrument labelling rather than editorial.

### Hierarchy
- **Display** (800, clamp(1.9rem, 6.5vw, 4.5rem), 1.25): hero name only.
- **Headline** (700, 1.5rem rising to 2.25rem at sm, and 3rem for the About stop): section titles.
- **Title** (600, 1rem, 1.375): card titles.
- **Body** (400, 0.875rem rising to 1rem at sm, 1.625): descriptions at 70-80% white; keep to roughly 65ch.
- **Label** (600, 0.75rem, 0.3em tracking, uppercase): eyebrows such as the role line; smaller 0.875rem with 0.05em tracking for skill-group titles.

### Named Rules
**The Fluid Display Rule.** Only the hero name scales fluidly; everything else steps at the `sm` breakpoint so 320px stays legible.

## Layout

Each section is an absolutely positioned overlay on top of the pinned canvas, one active at a time. Content is centred or left-aligned in a max-width column (2xl for About, 4xl for the hero, 5xl for grids) with `mx-auto` and generous outer padding. Grids are mobile-first: one column at 320px, two from `sm`, three from `lg`, with 12px gaps. Tap targets are at least 44px (`min-h-11`). Panels that can overflow scroll internally (`overflow-y-auto`, hidden scrollbar) so the pinned viewport never scrolls the page.

## Elevation & Depth

No shadows. Depth is tonal: translucent glass with a 10px backdrop blur and a hairline border separates content from the live scene behind it. The only "lift" is a 4px upward translate on card hover. Legibility over bright scenes uses a radial dark scrim and a layered text-shadow on headings, not a stronger panel.

### Named Rules
**The Flat Glass Rule.** Surfaces stay flat at rest. Hover may translate or scale; it never adds a shadow.

## Shapes

Soft, rounded forms against a hard, dark void. Panels and cards use 16px corners (`rounded-2xl`); tags and tech chips use 6px (`rounded-md`); pills, category badges, skill chips and the CTA are fully round. Borders are 1px hairlines in low-opacity blue-white. No sharp corners and no heavy outlines.

## Components

### Buttons
- **Shape:** full pill (9999px), minimum height 44px.
- **Primary:** solid white, black text, semibold, 24px horizontal padding, trailing arrow icon.
- **Hover / Focus:** scales to 105%; focus uses a 2px violet outline.

### Chips
- **Style:** `white/10` background, `white/80` text, 11-14px. Skill chips are pills; project tech chips use 6px corners.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Glass Fill with backdrop blur.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px Glass Border.
- **Internal Padding:** 16px.

### Project Card (signature)
Glass card with a 112-128px header: category gradient behind a top-cropped screenshot that zooms 5% on hover, with a black/60 category pill at the bottom-left. Below: display-font title, three-line-clamped description, up to three tech chips pinned to the bottom.

### Section Heading (signature)
Display-font title with a one-line subtitle, over a left-anchored radial scrim and heavy text-shadow so it reads over bright 3D.

### Volume Slider
Quiet instrument control under the speaker button. A slim vertical glass pill drops below the button on hover or keyboard focus (desktop) or on tap (touch, where the panel also carries its own mute button). Hairline track (2px, white/15), Aurora Mint fill from the bottom, 12px white dot thumb, violet focus ring. No glow. Dragging to 0 mutes; the volume is remembered across visits.

### Scrollbar
Transparent track, slim (8px) rounded glass thumb in Glass Border blue-white at 22%, turning Aurora Mint on hover. Firefox gets the thin width and colours only.

## Do's and Don'ts

### Do:
- **Do** keep text on glass panels or a dark scrim whenever it overlays the canvas.
- **Do** use mint for labels, amber for the role eyebrow, violet for focus.
- **Do** keep touch targets at least 44px and layouts clean at 320px.
- **Do** keep motion to short fades and small translates, and honour `prefers-reduced-motion`.

### Don't:
- **Don't** add shadows, neon glows or gradient fills to panels.
- **Don't** fill large areas with an accent colour.
- **Don't** put body text directly on the canvas without a scrim.
- **Don't** introduce a third typeface or a third level of panel treatment.
