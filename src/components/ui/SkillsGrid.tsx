"use client";

import { SKILLS_DATA, SKILL_CATEGORY_LABELS, type SkillCategoryKey } from "@/data/skills";
import { SectionShell } from "./SectionShell";
import { SectionHeading } from "./SectionHeading";

const CATEGORY_KEYS = Object.keys(SKILLS_DATA) as SkillCategoryKey[];

export function SkillsGrid() {
  return (
    <SectionShell index={2} label="Technical skills">
      <div className="pointer-events-auto mx-auto max-h-full w-full max-w-5xl touch-pan-y overflow-y-auto overflow-x-hidden no-scrollbar">
        <SectionHeading title="Technical Skills" subtitle="The toolkit orbiting my work." />

        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_KEYS.map((key) => (
            <li key={key} className="glass rounded-2xl p-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-aurora">
                {SKILL_CATEGORY_LABELS[key]}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SKILLS_DATA[key].map((skill) => (
                  <li key={skill} className="rounded-full bg-white/10 px-3 py-1 text-xs sm:text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
