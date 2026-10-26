"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ProjectModal } from "@/components/modals/ProjectModal";
import { AudioToggle } from "@/components/ui/AudioToggle";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { StarBackdrop } from "@/components/ui/StarBackdrop";
import { PROJECTS_DATA, type ProjectCategory } from "@/data/projects";
import { useSpaceStore } from "@/store/useSpaceStore";

const CATEGORIES: ("All" | ProjectCategory)[] = [
  "All",
  "Web Development",
  "Game Development",
  "Mobile / Cross-Platform",
  "Database System",
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");
  const openProject = useSpaceStore((s) => s.openProject);
  const visible = PROJECTS_DATA.filter((p) => filter === "All" || p.category === filter);

  return (
    <main className="space-bg relative isolate min-h-[100svh] px-4 py-6 sm:px-8">
      <StarBackdrop />
      <AudioToggle className="fixed right-4 top-4 z-30 sm:right-8" />
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm"
        >
          <ArrowLeft size={16} /> Back to the journey
        </Link>

        <h1 className="mt-6 font-display text-3xl font-bold sm:text-5xl">All Projects</h1>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={`min-h-11 rounded-full px-4 text-sm transition-colors ${
                filter === category ? "bg-white text-black" : "glass text-white/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={openProject} />
          ))}
        </div>
      </div>
      <ProjectModal />
    </main>
  );
}
