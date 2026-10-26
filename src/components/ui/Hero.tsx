"use client";

import { motion } from "framer-motion";
import { ChevronsDown } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { useSpaceStore } from "@/store/useSpaceStore";
import { SectionShell } from "./SectionShell";

const TEXT_SHADOW = "[text-shadow:0_2px_28px_rgba(0,0,0,0.95),0_0_3px_rgba(0,0,0,0.9)]";

export function Hero() {
  const introDone = useSpaceStore((s) => s.introPhase === "done");

  return (
    <SectionShell index={0} label="Introduction">
      {/* isolate keeps the scrim behind the text but above the canvas */}
      <div className="pointer-events-none relative isolate mx-auto w-full max-w-4xl text-center">
        {/* Dark scrim so text stays readable over the bright accretion disk */}
        <div
          aria-hidden="true"
          className="absolute -inset-x-4 -inset-y-12 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(2,3,10,0.85)_0%,rgba(2,3,10,0.62)_45%,transparent_72%)] sm:-inset-x-16"
        />

        <motion.p
          initial={false}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-xs font-semibold uppercase tracking-[0.3em] text-ember sm:text-sm ${TEXT_SHADOW}`}
        >
          {PROFILE.role}
        </motion.p>

        <motion.h1
          initial={false}
          animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 12 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className={`mt-3 text-balance font-display font-extrabold leading-tight text-white ${TEXT_SHADOW}`}
          style={{ fontSize: "clamp(1.9rem, 6.5vw, 4.5rem)" }}
        >
          {PROFILE.name}
        </motion.h1>

        <motion.p
          initial={false}
          animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 10 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className={`mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-white sm:text-base ${TEXT_SHADOW}`}
        >
          {PROFILE.tagline}
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className={`mt-8 flex flex-col items-center gap-1 text-xs text-white/80 ${TEXT_SHADOW}`}
          aria-hidden="true"
        >
          <span>Scroll to begin the journey</span>
          <ChevronsDown className="animate-bounce" size={20} />
        </motion.div>
      </div>
    </SectionShell>
  );
}
