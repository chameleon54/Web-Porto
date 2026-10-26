"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { SectionShell } from "./SectionShell";

export function AboutPreview() {
  return (
    <SectionShell index={4} label="About me">
      <div className="pointer-events-auto mx-auto w-full max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-aurora">Entering Earth&apos;s atmosphere</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">About Me</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">{PROFILE.bio[0]}</p>
        <Link
          href="/about"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition-transform hover:scale-105"
        >
          Land on Earth: read my story <ArrowRight size={16} />
        </Link>
      </div>
    </SectionShell>
  );
}
