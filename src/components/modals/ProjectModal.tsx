"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { PROJECTS_DATA } from "@/data/projects";
import { useSpaceStore } from "@/store/useSpaceStore";
import { ProjectGallery } from "./ProjectGallery";

export function ProjectModal() {
  const activeId = useSpaceStore((s) => s.activeProjectId);
  const openProject = useSpaceStore((s) => s.openProject);
  const project = PROJECTS_DATA.find((p) => p.id === activeId);

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );
    // The close button is the first focusable; start there so keyboard users land inside the dialog.
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return openProject(null);
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      // Keep Tab inside the dialog: wrap at the ends and pull stray focus back in.
      if (!dialogRef.current?.contains(active) || (e.shiftKey ? active === first : active === last)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [project, openProject]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => openProject(null)}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="glass relative max-h-[100svh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-3xl p-5 sm:max-h-[85svh] sm:rounded-3xl sm:p-8"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => openProject(null)}
              aria-label="Close project details"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula"
            >
              <X size={18} />
            </button>

            {project.gallery && project.gallery.length > 0 && (
              <ProjectGallery key={project.id} title={project.title} images={project.gallery} />
            )}

            <span className="rounded-full bg-nebula/30 px-2.5 py-1 text-xs">{project.category}</span>
            <h2 id="project-modal-title" className="mt-3 pr-10 font-display text-2xl font-bold">
              {project.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{project.fullDescription}</p>

            <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-aurora">Tech stack</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <li key={tech} className="rounded-md bg-white/10 px-2.5 py-1 text-xs">
                  {tech}
                </li>
              ))}
            </ul>

            {(project.demoUrl || project.repoUrl) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black"
                  >
                    Live demo <ExternalLink size={14} />
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium"
                  >
                    Source code <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
