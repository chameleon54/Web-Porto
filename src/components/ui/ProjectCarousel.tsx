"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PROJECTS_DATA } from "@/data/projects";
import { useSpaceStore } from "@/store/useSpaceStore";
import { ProjectCard } from "./ProjectCard";
import { SectionShell } from "./SectionShell";
import { SectionHeading } from "./SectionHeading";

export function ProjectCarousel() {
  const openProject = useSpaceStore((s) => s.openProject);
  const featured = PROJECTS_DATA.filter((p) => p.featured);
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const isEnd = current === featured.length;
  const go = (i: number) => {
    setDir(i > current ? 1 : -1);
    setCurrent(i);
  };

  return (
    <SectionShell index={1} label="Projects">
      <div className="pointer-events-auto mx-auto w-full max-w-5xl">
        <SectionHeading
          title="Featured Projects"
          subtitle="The work behind the galaxies."
        />

        {/* Portrait mobile: one slide at a time; the last slide links to all projects */}
        <div className="mt-4 sm:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous project"
              disabled={current === 0}
              onClick={() => go(current - 1)}
              className="glass flex size-11 shrink-0 items-center justify-center rounded-full disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="min-w-0 flex-1 overflow-hidden" aria-live="polite">
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div
                  key={current}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ x: d * 60, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d * -60, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  {isEnd ? (
                    <Link
                      href="/projects"
                      className="glass flex min-h-48 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center font-medium"
                    >
                      View all projects <ArrowRight size={20} />
                    </Link>
                  ) : (
                    <ProjectCard
                      project={featured[current]}
                      onOpen={openProject}
                      className="w-full"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              type="button"
              aria-label="Next project"
              disabled={isEnd}
              onClick={() => go(current + 1)}
              className="glass flex size-11 shrink-0 items-center justify-center rounded-full disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="mt-2 flex justify-center">
            {Array.from({ length: featured.length + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={i === featured.length ? "View all projects" : `Project ${i + 1}`}
                aria-current={i === current}
                onClick={() => go(i)}
                className="flex size-11 items-center justify-center"
              >
                <span
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-5 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div
          className="no-scrollbar mt-4 hidden snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 sm:flex"
          role="list"
          aria-label="Featured projects"
        >
          {featured.map((project) => (
            <div key={project.id} role="listitem" className="flex snap-start">
              <ProjectCard
                project={project}
                onOpen={openProject}
                className="w-[min(78vw,20rem)] shrink-0"
              />
            </div>
          ))}
        </div>

        <Link
          href="/projects"
          className="glass mt-4 hidden min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium sm:inline-flex"
        >
          View all projects <ArrowRight size={16} />
        </Link>
      </div>
    </SectionShell>
  );
}
