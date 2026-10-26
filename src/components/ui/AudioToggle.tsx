"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSpaceStore } from "@/store/useSpaceStore";

/** Mute / unmute button for the background music. `data-audio-toggle` lets the player ignore it as a start gesture. */
export function AudioToggle({ className = "" }: { className?: string }) {
  const audioEnabled = useSpaceStore((s) => s.audioEnabled);
  const toggleAudio = useSpaceStore((s) => s.toggleAudio);

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-label={audioEnabled ? "Mute ambient audio" : "Unmute ambient audio"}
      aria-pressed={audioEnabled}
      data-audio-toggle
      className={`glass pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full ${className}`}
    >
      {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
