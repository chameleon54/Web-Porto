"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useSpaceStore } from "@/store/useSpaceStore";

/**
 * Mute button with a volume slider. Desktop: hover or keyboard focus reveals the
 * slider and a click mutes. Touch (no hover): a tap opens a panel holding the
 * slider and its own mute button. `data-audio-toggle` lets the player ignore the
 * mute buttons as a start gesture; the slider itself counts as one.
 */
export function AudioToggle({ className = "" }: { className?: string }) {
  const audioEnabled = useSpaceStore((s) => s.audioEnabled);
  const volume = useSpaceStore((s) => s.volume);
  const toggleAudio = useSpaceStore((s) => s.toggleAudio);
  const setVolume = useSpaceStore((s) => s.setVolume);

  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  // Tap outside closes the touch panel.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  const shown = audioEnabled ? volume : 0;
  const percent = Math.round(shown * 100);
  const Icon = audioEnabled ? Volume2 : VolumeX;
  const muteLabel = audioEnabled ? "Mute ambient audio" : "Unmute ambient audio";

  return (
    // Callers may pass their own positioning (e.g. `fixed` on /about); otherwise `relative` anchors the panel.
    <div ref={wrapper} className={`group pointer-events-auto ${className || "relative"}`}>
      <button
        type="button"
        onClick={() =>
          window.matchMedia("(hover: none)").matches ? setOpen((o) => !o) : toggleAudio()
        }
        aria-label={muteLabel}
        aria-pressed={audioEnabled}
        aria-expanded={open}
        data-audio-toggle
        className="glass flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula"
      >
        <Icon size={18} />
      </button>

      {/* pt-2 bridges the gap so the hover doesn't drop on the way down to the slider. */}
      <div
        className={`absolute left-1/2 top-full z-40 -translate-x-1/2 pt-2 ${
          open ? "block" : "hidden group-focus-within:block group-hover:block"
        }`}
      >
        <div className="glass flex flex-col items-center gap-2 rounded-full px-1.5 py-3">
          <input
            type="range"
            min={0}
            max={100}
            value={percent}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            aria-label="Music volume"
            aria-valuetext={`${percent}%`}
            className="volume-range"
            style={{ "--fill": `${percent}%` } as React.CSSProperties}
          />
          {open && (
            <button
              type="button"
              onClick={toggleAudio}
              aria-label={muteLabel}
              aria-pressed={audioEnabled}
              data-audio-toggle
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula"
            >
              <Icon size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
