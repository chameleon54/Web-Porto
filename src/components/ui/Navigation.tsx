"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
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
            className={`rounded-full px-3 py-2 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula ${
              sectionIndex === i ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="pointer-events-auto flex items-center gap-2">
        <Link
          href="/about#contact"
          aria-label="Contact me"
          className="glass flex h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula sm:px-4"
        >
          <Mail size={18} aria-hidden="true" />
          <span className="hidden sm:inline">Contact</span>
        </Link>
        <AudioToggle />
      </div>

      {/* Mobile dot navigation: a bottom strip in the thumb zone, clear of the header */}
      <nav
        aria-label="Section navigation"
        className="pointer-events-auto fixed inset-x-0 bottom-2 flex flex-col items-center sm:hidden"
      >
        <div className="glass flex flex-col items-center rounded-2xl px-1 pt-1.5">
          <span aria-hidden="true" className="text-xs text-white/85">
            {sectionIndex + 1}/{SECTION_LABELS.length} · {SECTION_LABELS[sectionIndex]}
          </span>
          <div className="flex">
            {SECTION_LABELS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => scrollToSection(i)}
                aria-label={`Go to ${label}`}
                aria-current={sectionIndex === i ? "true" : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula"
              >
                <span
                  className={`block rounded-full transition-all ${
                    sectionIndex === i ? "h-3 w-3 bg-white" : "h-2 w-2 bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
