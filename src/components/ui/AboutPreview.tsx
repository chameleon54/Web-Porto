"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { CONTACT } from "@/lib/contact";
import { SectionShell } from "./SectionShell";

export function AboutPreview() {
  return (
    <SectionShell index={4} label="About me">
      {/* Glass panel: the copy sits over the bright Earth and needs a surface, not just a shadow. */}
      <div className="glass pointer-events-auto mx-auto w-full max-w-2xl rounded-2xl p-5 text-center sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-aurora">Entering Earth&apos;s atmosphere</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">About Me</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">{PROFILE.bio[0]}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition-transform hover:scale-105"
          >
            Land on Earth: read my story <ArrowRight size={16} />
          </Link>
          <a
            href={CONTACT.emailHref}
            className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula"
          >
            <Mail size={16} aria-hidden="true" /> Email me
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
