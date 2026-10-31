"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSpaceStore } from "@/store/useSpaceStore";

const MOUNT_DELAY_MS = 180;

interface SectionShellProps {
  index: number;
  label: string;
  children: React.ReactNode;
}

/**
 * Overlay for one scroll section. Only the active section is mounted, so
 * offscreen UI never costs layout or accessibility-tree space.
 */
export function SectionShell({ index, label, children }: SectionShellProps) {
  const here = useSpaceStore((s) => s.sectionIndex === index && s.settled);
  // Mount a beat after the camera lands, so the render doesn't compete with the end of the warp.
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!here) return setActive(false);
    const timer = setTimeout(() => setActive(true), MOUNT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [here]);

  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.section
          key={index}
          aria-label={label}
          className="space-section pointer-events-none absolute inset-0 flex flex-col justify-end px-4 pb-20 pt-20 sm:px-8 sm:pb-24 md:justify-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.25, ease: "easeOut" } }}
          exit={{ opacity: 0, y: -16, transition: { duration: 0.28, ease: "easeIn" } }}
        >
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
