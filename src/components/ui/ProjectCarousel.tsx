"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROJECTS_DATA } from "@/data/projects";
import { useSpaceStore } from "@/store/useSpaceStore";
import { ProjectCard } from "./ProjectCard";
import { SectionShell } from "./SectionShell";
import { SectionHeading } from "./SectionHeading";

export function ProjectCarousel() {
  const openProject = useSpaceStore((s) => s.openProject);
  const featured = PROJECTS_DATA.filter((p) => p.featured);

  return (
    <SectionShell index={1} label="Projects">
      <div className="pointer-events-auto mx-auto w-full max-w-5xl">
        <SectionHeading
          title="Featured Projects"
          subtitle="The work behind the galaxies."
        />

        <div
          className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:mx-0 sm:px-0"
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
          className="glass mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium"
        >
          View all projects <ArrowRight size={16} />
        </Link>
      </div>
    </SectionShell>
  );
}
