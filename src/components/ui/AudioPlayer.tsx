"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Music2 } from "lucide-react";
import { BACKGROUND_TRACK } from "@/data/music";
import { useSpaceStore } from "@/store/useSpaceStore";

const TARGET_VOLUME = 0.35;
const FADE_MS = 2000;
const TOAST_MS = 6500;

/**
 * Background music. Starts when the splash ends and announces the full track
 * title. Browsers block autoplay before a user gesture, so if the first
 * attempt is rejected, playback starts on the first tap, click or key press.
 */
export function AudioPlayer() {
  const pathname = usePathname();
  const introDone = useSpaceStore((s) => s.introPhase === "done");
  // On the home page, wait for the splash; on other routes there is no splash to wait for.
  const mayPlay = introDone || pathname !== "/";
  const audioEnabled = useSpaceStore((s) => s.audioEnabled);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrame = useRef<number>(0);
  const announced = useRef(false);
  const [showTitle, setShowTitle] = useState(false);

  const fadeTo = useCallback((audio: HTMLAudioElement, target: number, onDone?: () => void) => {
    cancelAnimationFrame(fadeFrame.current);
    const from = audio.volume;
    const startedAt = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / FADE_MS);
      audio.volume = from + (target - from) * t;
      if (t < 1) fadeFrame.current = requestAnimationFrame(step);
      else onDone?.();
    };
    fadeFrame.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      audio.volume = 0;
      await audio.play();
    } catch {
      return false; // autoplay blocked until a user gesture
    }
    fadeTo(audio, TARGET_VOLUME);
    if (!announced.current) {
      announced.current = true;
      setShowTitle(true);
    }
    return true;
  }, [fadeTo]);

  // Start (or resume) once the splash is over and sound is enabled.
  useEffect(() => {
    if (!mayPlay || !audioEnabled) return;
    let cancelled = false;
    const events = ["pointerdown", "keydown", "touchend"] as const;

    const onGesture = (event: Event) => {
      // Let the mute button manage itself instead of racing it.
      if (event.target instanceof Element && event.target.closest("[data-audio-toggle]")) return;
      void play().then((ok) => {
        if (ok) cleanup();
      });
    };
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, onGesture));

    void play().then((ok) => {
      if (!ok && !cancelled) events.forEach((e) => window.addEventListener(e, onGesture));
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [mayPlay, audioEnabled, play]);

  // Fade out and pause when muted.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || audioEnabled) return;
    fadeTo(audio, 0, () => audio.pause());
  }, [audioEnabled, fadeTo]);

  useEffect(() => {
    if (!showTitle) return;
    const timer = setTimeout(() => setShowTitle(false), TOAST_MS);
    return () => clearTimeout(timer);
  }, [showTitle]);

  useEffect(() => () => cancelAnimationFrame(fadeFrame.current), []);

  return (
    <>
      <audio ref={audioRef} src={encodeURI(BACKGROUND_TRACK.src)} loop preload="none" />
      <AnimatePresence>
        {showTitle && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass pointer-events-none fixed left-4 right-16 top-[4.5rem] z-30 flex items-start gap-3 rounded-2xl px-4 py-3 sm:left-8 sm:right-auto sm:max-w-md"
          >
            <Music2 size={18} className="mt-0.5 shrink-0 text-aurora" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-aurora">
                Now playing
              </p>
              <p className="mt-0.5 break-words text-sm leading-snug text-white">
                {BACKGROUND_TRACK.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
