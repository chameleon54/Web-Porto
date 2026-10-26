"use client";

import { useEffect, useRef } from "react";

/** Deterministic PRNG so the sky is the same on every visit. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Tint = readonly [number, number, number];
const TINTS: readonly Tint[] = [
  [255, 255, 255],
  [200, 220, 255],
  [255, 238, 210],
  [190, 205, 255],
];

interface Star {
  x: number; // 0..1 of the viewport
  y: number;
  radius: number; // CSS px
  alpha: number; // resting brightness 0..1
  tint: Tint;
  /** Slow shimmer: amplitude 0 = steady. */
  shimmer: number;
  shimmerSpeed: number;
  phase: number;
  /** Blinkers flash once or twice every so often. */
  blinker: boolean;
  nextBlinkAt: number; // seconds
  blinksLeft: number;
  blinkStart: number; // seconds, -1 when idle
}

const BLINK_DURATION = 0.42;
const BLINK_GAP = 0.2;

function createStars(width: number, height: number): Star[] {
  const rand = mulberry32(20261011);
  const count = Math.round(Math.min(280, Math.max(110, (width * height) / 8500)));
  const stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    const roll = rand();
    // ~72% faint, ~21% medium, ~7% bright
    const tier = roll < 0.72 ? 0 : roll < 0.93 ? 1 : 2;
    const radius = tier === 0 ? 0.35 + rand() * 0.45 : tier === 1 ? 0.85 + rand() * 0.5 : 1.45 + rand() * 0.8;
    const alpha = tier === 0 ? 0.28 + rand() * 0.32 : tier === 1 ? 0.6 + rand() * 0.25 : 0.9 + rand() * 0.1;
    const shimmers = rand() < (tier === 0 ? 0.18 : 0.55);

    stars.push({
      x: rand(),
      y: rand(),
      radius,
      alpha,
      tint: TINTS[Math.floor(rand() * TINTS.length)],
      shimmer: shimmers ? 0.25 + rand() * 0.4 : 0,
      shimmerSpeed: 0.6 + rand() * 1.8,
      phase: rand() * Math.PI * 2,
      blinker: false,
      nextBlinkAt: 0,
      blinksLeft: 0,
      blinkStart: -1,
    });
  }

  // A handful of medium/bright stars blink: once or twice, then rest for a while.
  const candidates = stars.filter((s) => s.radius > 0.85);
  const blinkerCount = Math.min(candidates.length, Math.max(6, Math.round(count / 24)));
  for (let i = 0; i < blinkerCount; i++) {
    const star = candidates[Math.floor(rand() * candidates.length)];
    star.blinker = true;
    star.nextBlinkAt = 1 + rand() * 9;
  }
  return stars;
}

/** Soft round glow, pre-rendered once and reused for every bright star. */
function createGlowSprite() {
  const size = 64;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const ctx = sprite.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.35)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return sprite;
}

/**
 * Fixed night-sky background for routes without the WebGL scene. Stars vary in
 * size and brightness, some shimmer slowly, and a few blink once or twice at
 * random intervals. Static (no animation) when reduced motion is requested.
 */
export function StarBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glow = createGlowSprite();
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    // Blink timers are relative to mount, not page load, so they never all fire at once.
    const origin = performance.now() / 1000;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(width, height);
      if (reduceMotion) draw(0);
    };

    /** 0..1 brightness boost for a blinking star at time t (seconds). */
    const blinkAmount = (star: Star, t: number) => {
      if (!star.blinker) return 0;

      if (star.blinkStart < 0) {
        if (t >= star.nextBlinkAt) {
          star.blinkStart = t;
          star.blinksLeft = Math.random() < 0.5 ? 1 : 2;
        }
        return 0;
      }

      const elapsed = t - star.blinkStart;
      const flashLength = BLINK_DURATION + BLINK_GAP;
      const flashIndex = Math.floor(elapsed / flashLength);
      if (flashIndex >= star.blinksLeft) {
        star.blinkStart = -1;
        star.nextBlinkAt = t + 5 + Math.random() * 11;
        return 0;
      }
      const within = elapsed - flashIndex * flashLength;
      return within < BLINK_DURATION ? Math.sin((within / BLINK_DURATION) * Math.PI) : 0;
    };

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);

      for (const star of stars) {
        const shimmer = star.shimmer ? 1 - star.shimmer * (0.5 + 0.5 * Math.sin(t * star.shimmerSpeed + star.phase)) : 1;
        const blink = reduceMotion ? 0 : blinkAmount(star, t);
        const alpha = Math.min(1, star.alpha * shimmer + blink * 0.7);
        const radius = star.radius * (1 + blink * 0.9);
        const [r, g, b] = star.tint;
        const x = star.x * width;
        const y = star.y * height;

        // Brighter stars get a glow; a blink swells it.
        if (star.radius > 0.85) {
          const glowSize = radius * (6 + blink * 8);
          ctx!.globalAlpha = Math.min(1, alpha * (0.35 + blink * 0.5));
          ctx!.drawImage(glow, x - glowSize / 2, y - glowSize / 2, glowSize, glowSize);
        }

        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = `rgb(${r},${g},${b})`;
        ctx!.beginPath();
        ctx!.arc(x, y, radius, 0, Math.PI * 2);
        ctx!.fill();

        // Four-point sparkle while blinking or at peak shimmer on bright stars.
        const sparkle = blink > 0.05 ? blink : star.radius > 1.4 ? Math.max(0, shimmer - 0.85) * 4 : 0;
        if (sparkle > 0.05) {
          const length = radius * (5 + sparkle * 7);
          ctx!.globalAlpha = Math.min(1, sparkle * 0.8);
          ctx!.fillRect(x - length, y - 0.4, length * 2, 0.8);
          ctx!.fillRect(x - 0.4, y - length, 0.8, length * 2);
        }
      }
      ctx!.globalAlpha = 1;
    }

    const loop = (now: number) => {
      draw(now / 1000 - origin);
      frame = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduceMotion) frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
