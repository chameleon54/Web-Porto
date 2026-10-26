"use client";

import Link from "next/link";
import { scrollToSection } from "@/lib/spaceScroll";
import { useSpaceStore } from "@/store/useSpaceStore";
import { AudioToggle } from "./AudioToggle";

export const SECTION_LABELS = ["Intro", "Projects", "Skills", "Achievements", "About"] as const;

export function Navigation() {
  const sectionIndex = useSpaceStore((s) => s.sectionIndex);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-8">
      <Link
        href="/"
        className="glass pointer-events-auto rounded-full px-4 py-2 font-display text-sm font-semibold tracking-wide"
        aria-label="Go to home"
      >
        Portfolio
      </Link>

      <nav aria-label="Section navigation" className="pointer-events-auto hidden items-center gap-1 sm:flex">
        {SECTION_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => scrollToSection(i)}
            aria-current={sectionIndex === i ? "true" : undefined}
            className={`rounded-full px-3 py-2 text-xs transition-colors ${
              sectionIndex === i ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <AudioToggle />

      {/* Mobile dot navigation */}
      <nav
        aria-label="Section navigation"
        className="pointer-events-auto absolute right-2 top-1/2 flex -translate-y-1/2 flex-col sm:hidden"
      >
        {SECTION_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => scrollToSection(i)}
            aria-label={`Go to ${label}`}
            aria-current={sectionIndex === i ? "true" : undefined}
            className="flex h-11 w-8 items-center justify-center"
          >
            <span
              className={`block rounded-full transition-all ${
                sectionIndex === i ? "h-3 w-3 bg-white" : "h-2 w-2 bg-white/40"
              }`}
            />
          </button>
        ))}
      </nav>
    </header>
  );
}
