"use client";

import Image from "next/image";
import { ACHIEVEMENTS_DATA } from "@/data/achievements";
import { useSpaceStore } from "@/store/useSpaceStore";
import { SectionHeading } from "./SectionHeading";
import { SectionShell } from "./SectionShell";

export function Achievements() {
  const openAchievement = useSpaceStore((s) => s.openAchievement);

  return (
    <SectionShell index={3} label="Achievements">
      <div className="pointer-events-auto mx-auto max-h-full w-full max-w-5xl touch-pan-y overflow-y-auto overflow-x-hidden no-scrollbar">
        <SectionHeading
          title="Achievements"
          subtitle="Tap an achievement to see the full details."
        />

        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {ACHIEVEMENTS_DATA.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => openAchievement(item.id)}
                aria-label={`View details for ${item.title}`}
                className="glass group flex h-full w-full gap-3 rounded-2xl p-4 text-left transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula"
              >
                {item.image && (
                  <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-white/5 min-[400px]:block">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="rounded-full bg-nebula/30 px-2 py-0.5 text-xs font-medium">
                    {item.type}
                  </span>
                  <h3 className="mt-1.5 font-display text-sm font-semibold leading-snug sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/60">
                    {item.issuer} · {item.date}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                    {item.description}
                  </p>
                  <span className="mt-2 inline-block text-xs font-medium text-aurora">
                    {item.image ? "View certificate" : "View details"} →
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
