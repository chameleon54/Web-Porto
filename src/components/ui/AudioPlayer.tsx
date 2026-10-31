"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Music2 } from "lucide-react";
import { BACKGROUND_TRACK } from "@/data/music";
import { useSpaceStore, VOLUME_KEY } from "@/store/useSpaceStore";

const FADE_MS = 2000;
const TOAST_MS = 4000;

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
  const volume = useSpaceStore((s) => s.volume);

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
      // Clamp: float rounding can land just outside [0, 1], which makes the setter throw.
      audio.volume = Math.min(1, Math.max(0, from + (target - from) * t));
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
    fadeTo(audio, useSpaceStore.getState().volume);
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

  // Restore the saved level once (in an effect, so server and client first render agree).
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(VOLUME_KEY));
      if (saved > 0 && saved <= 1) useSpaceStore.setState({ volume: saved });
    } catch {
      // Storage blocked: keep the default.
    }
  }, []);

  // Slider moved: apply it right away, cutting any fade short.
  useEffect(() => {
    const audio = audioRef.current;
    // Read mute state without depending on it, so muting/unmuting keeps its fades.
    if (audio && useSpaceStore.getState().audioEnabled && !audio.paused) {
      cancelAnimationFrame(fadeFrame.current);
      audio.volume = volume;
    }
  }, [volume]);

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
            // Bottom corner, clear of headings; on the home journey it sits above the section strip on mobile.
            className={`glass pointer-events-none fixed left-4 right-4 z-30 flex items-center gap-2 rounded-full px-4 py-2 sm:left-8 sm:right-auto sm:bottom-6 sm:max-w-md ${
              pathname === "/" ? "bottom-[5.5rem]" : "bottom-4"
            }`}
          >
            <Music2 size={16} className="shrink-0 text-aurora" aria-hidden="true" />
            <p className="min-w-0 truncate text-xs text-white">
              <span className="font-semibold text-aurora">Now playing</span> · {BACKGROUND_TRACK.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
