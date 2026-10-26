"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSpaceStore } from "@/store/useSpaceStore";

/**
 * Re-mounts on every navigation and fades the new page in from dark. The fade
 * is a sibling overlay (never a wrapper), so it cannot break position:fixed
 * children or the home page's pinned scroll.
 *
 * It only plays when the intro has already finished, i.e. on later navigations.
 * The decision is made once per mount from the store (never by mutating
 * anything during render), so the server and first client render both skip it
 * and hydration stays consistent, including under React strict mode.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [afterIntro] = useState(() => useSpaceStore.getState().introPhase === "done");
  const play = afterIntro && !reduceMotion;

  return (
    <>
      {children}
      {play && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[60] bg-void"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      )}
    </>
  );
}
