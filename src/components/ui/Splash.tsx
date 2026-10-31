"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimate,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useSpaceStore } from "@/store/useSpaceStore";

/** The percentage never finishes faster than this, even if everything is cached. */
const MIN_LOAD_MS = 2400;
/** Give up waiting for stragglers and open anyway. */
const MAX_LOAD_MS = 9000;
/** Loading must read "complete" this long before we trust it (assets arrive in waves). */
const STABLE_MS = 500;

/** The Skip button appears after this delay so the first beat still lands. */
const SKIP_AFTER_MS = 1000;
const SEEN_KEY = "intro-seen";

const PULSE_MS = 1800;
const BLACKOUT_MS = 280;
const SHOCKWAVE_S = 1.7;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Framer's playback controls are thenable but not full Promises. */
const finishedOf = (controls: { then: (onResolve: () => void) => unknown }) =>
  new Promise<void>((resolve) => {
    controls.then(() => resolve());
  });

/**
 * Splash: a singularity (pure white point inside a slowly rotating ring) while
 * the scene loads. When loading completes the point breathes, collapses into
 * black, and a circular blur shockwave opens the screen onto the black hole.
 */
export function Splash() {
  const setIntroPhase = useSpaceStore((s) => s.setIntroPhase);
  const reduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();

  // Returning from another route: the intro already played.
  const [finished, setFinished] = useState(() => useSpaceStore.getState().introPhase === "done");

  // Real loading progress from the three.js loaders (galaxy model, Earth textures),
  // published by <LoadingReporter /> inside the 3D canvas.
  const loading = useSpaceStore((s) => s.loading);
  const loadRef = useRef(loading);
  useEffect(() => {
    loadRef.current = loading;
  }, [loading]);

  const [canSkip, setCanSkip] = useState(false);
  const skipRequested = useRef(false);
  const skipNow = useRef<() => void>(() => {});

  const percent = useMotionValue(0);
  const percentLabel = useTransform(percent, (v) => `${Math.round(v)}%`);

  // Radius of the opening, as a % of the distance to the farthest screen corner.
  const radius = useMotionValue(-24);
  const radiusFeather = useTransform(radius, (r) => r + 18);
  const ringStart = useTransform(radius, (r) => r - 4);
  const ringMid = useTransform(radius, (r) => r + 5);
  const ringEnd = useTransform(radius, (r) => r + 16);
  const lineStart = useTransform(radius, (r) => r + 2);
  const lineMid = useTransform(radius, (r) => r + 4);
  const lineEnd = useTransform(radius, (r) => r + 7);

  const coverMask = useMotionTemplate`radial-gradient(circle farthest-corner at 50% 50%, transparent ${radius}%, #000 ${radiusFeather}%)`;
  const blurMask = useMotionTemplate`radial-gradient(circle farthest-corner at 50% 50%, transparent ${ringStart}%, #000 ${ringMid}%, transparent ${ringEnd}%)`;
  const shockLine = useMotionTemplate`radial-gradient(circle farthest-corner at 50% 50%, transparent ${lineStart}%, rgba(210,225,255,0.85) ${lineMid}%, transparent ${lineEnd}%)`;

  useEffect(() => {
    if (finished) return;

    let cancelled = false;
    let frame = 0;
    // Repeat visit in this tab: skip the show, but still wait for the real load.
    let seenBefore = false;
    try {
      seenBefore = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage blocked: behave like a first visit.
    }
    window.scrollTo(0, 0);
    const skipTimer = window.setTimeout(() => setCanSkip(true), SKIP_AFTER_MS);

    // Lock scrolling until the sequence is completely over. Overflow alone is not
    // enough: globals.css also clips <html>, which makes browsers ignore a
    // body-only lock, so wheel, touch and scroll keys are blocked explicitly too.
    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const blockScroll = (event: Event) => event.preventDefault();
    const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
    const blockScrollKeys = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) event.preventDefault();
    };
    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", blockScrollKeys);

    let unlocked = false;
    const unlockScroll = () => {
      if (unlocked) return;
      unlocked = true;
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", blockScrollKeys);
    };

    /** Smoothly counts up to the real progress, never faster than MIN_LOAD_MS allows. */
    const waitForLoad = () =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        let last = start;
        let shown = 0;
        let completeSince: number | null = null;

        const tick = (now: number) => {
          if (cancelled) return;
          const { progress: real, total: items, active: busy } = loadRef.current;
          const elapsed = now - start;

          const looksComplete = items > 0 && !busy && real >= 100;
          completeSince = looksComplete ? (completeSince ?? now) : null;
          const loaded =
            (completeSince !== null && now - completeSince >= STABLE_MS) || elapsed >= MAX_LOAD_MS;

          const target = Math.min(
            loaded ? 100 : Math.min(real, 96),
            seenBefore ? 100 : (elapsed / MIN_LOAD_MS) * 100,
          );
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          shown += (target - shown) * (1 - Math.exp(-6 * dt));
          if (target >= 100 && 100 - shown < 0.4) shown = 100;

          percent.set(shown);
          if (shown >= 100) resolve();
          else frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      });

    const open = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Storage blocked: the intro will replay next load.
      }
      unlockScroll();
      setFinished(true);
    };

    // Plain fade instead of the full sequence: reduced motion, skip, and repeat visits.
    const quickOpen = async () => {
      setIntroPhase("done");
      await finishedOf(animate('[data-s="cover"]', { opacity: 0 }, { duration: 0.5 }));
      open();
    };

    // Resolves when the visitor presses Skip, so any awaited step can be cut short.
    const skipped = new Promise<void>((resolve) => {
      skipNow.current = resolve;
    });
    const until = (step: Promise<void>) => Promise.race([step, skipped]);

    const run = async () => {
      try {
        await until(waitForLoad());
        if (cancelled) return;

        if (reduceMotion || skipRequested.current || seenBefore) {
          await quickOpen();
          return;
        }

        // Loaded: the singularity breathes, and the loading text steps aside.
        void animate('[data-s="label"]', { opacity: 0 }, { duration: 0.5 });
        await until(
          finishedOf(
            animate(
              '[data-s="point"]',
              { scale: [1, 1.7, 1, 1.9, 1] },
              { duration: PULSE_MS / 1000, ease: "easeInOut" },
            ),
          ),
        );
        if (cancelled) return;
        if (skipRequested.current) return await quickOpen();

        // Collapse: it snaps into blackness, taking the ring with it.
        void animate('[data-s="ring"]', { opacity: 0, scale: 0.5 }, { duration: 0.18 });
        await finishedOf(
          animate('[data-s="point"]', { scale: 0, opacity: 0 }, { duration: 0.09, ease: "easeIn" }),
        );
        await until(wait(BLACKOUT_MS));
        if (cancelled) return;
        if (skipRequested.current) return await quickOpen();

        // Shockwave: a blur ring sweeps outward and the screen opens behind it.
        // The camera push-in, hero text and music all start from this moment.
        setIntroPhase("done");
        await until(
          finishedOf(animate(radius, 124, { duration: SHOCKWAVE_S, ease: [0.22, 1, 0.36, 1] })),
        );
        open();
      } catch {
        // Animations are cancelled on unmount; nothing to recover.
      }
    };

    void run();

    return () => {
      cancelled = true;
      window.clearTimeout(skipTimer);
      cancelAnimationFrame(frame);
      unlockScroll();
    };
  }, [finished, animate, percent, radius, reduceMotion, setIntroPhase]);

  if (finished) return null;

  return (
    <div
      ref={scope}
      role="status"
      aria-label="Loading the portfolio"
      className="fixed inset-0 z-[70] overflow-hidden"
    >
      {/* Black cover; the expanding mask is the opening onto the scene. */}
      <motion.div
        data-s="cover"
        className="absolute inset-0 bg-black"
        style={{ maskImage: coverMask, WebkitMaskImage: coverMask }}
      >
        {/* Ring: a thin full circle plus one bright arc that rotates slowly. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            data-s="ring"
            aria-hidden="true"
            className="relative"
            style={{ width: "min(46vw, 168px)", height: "min(46vw, 168px)" }}
          >
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div
              className="absolute inset-0 animate-spin rounded-full [animation-duration:9s]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, transparent 62%, rgba(255,255,255,0.85) 100%)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
              }}
            />
          </div>
        </div>

        {/* Singularity: an over-bright, pure white point. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            data-s="point"
            aria-hidden="true"
            className="h-[7px] w-[7px] rounded-full bg-white"
            style={{
              boxShadow:
                "0 0 6px 2px #fff, 0 0 22px 8px rgba(255,255,255,0.95), 0 0 60px 22px rgba(255,255,255,0.55), 0 0 140px 55px rgba(170,190,255,0.3)",
            }}
          />
        </div>

        {/* Loading text */}
        <div
          data-s="label"
          className="absolute inset-x-0 flex flex-col items-center gap-1.5 px-4 text-center"
          style={{ top: "calc(50% + min(23vw, 84px) + 44px)" }}
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/55 sm:text-xs sm:tracking-[0.28em]">
            Calibrating Cosmic Coordinates...
          </p>
          <motion.span
            aria-hidden="true"
            className="text-xs tabular-nums tracking-[0.2em] text-white/80 sm:text-sm"
          >
            {percentLabel}
          </motion.span>
        </div>
      </motion.div>

      {canSkip && (
        <button
          type="button"
          onClick={() => {
            skipRequested.current = true;
            setCanSkip(false);
            skipNow.current();
          }}
          className="glass absolute bottom-6 left-1/2 min-h-11 -translate-x-1/2 rounded-full px-5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula"
        >
          Skip intro
        </button>
      )}

      {/* Shockwave: a ring that blurs whatever it passes over. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backdropFilter: "blur(10px) brightness(1.15)",
          WebkitBackdropFilter: "blur(10px) brightness(1.15)",
          maskImage: blurMask,
          WebkitMaskImage: blurMask,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: shockLine }}
      />
    </div>
  );
}
