import Image from "next/image";
import type { Project, ProjectCategory } from "@/data/projects";

const CATEGORY_GRADIENTS: Record<ProjectCategory, string> = {
  "Web Development": "from-indigo-500/60 to-cyan-400/30",
  "Game Development": "from-fuchsia-500/60 to-orange-400/30",
  "Mobile / Cross-Platform": "from-emerald-500/60 to-sky-400/30",
  "Database System": "from-amber-500/60 to-rose-400/30",
};

interface ProjectCardProps {
  project: Project;
  onOpen: (id: string) => void;
  className?: string;
}

export function ProjectCard({ project, onOpen, className = "" }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project.id)}
      className={`glass group flex flex-col overflow-hidden rounded-2xl text-left transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula ${className}`}
      aria-label={`View details for ${project.title}`}
    >
      <div
        className={`relative flex h-28 items-end overflow-hidden bg-gradient-to-br ${CATEGORY_GRADIENTS[project.category]} p-3 sm:h-32`}
      >
        {project.image && (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 640px) 78vw, 320px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <span className="relative rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium">
          {project.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-semibold leading-snug">{project.title}</h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-white/70">
          {project.shortDescription}
        </p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.techStack.slice(0, 3).map((tech) => (
            <li key={tech} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}
