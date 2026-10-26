"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { ACHIEVEMENTS_DATA } from "@/data/achievements";
import { useSpaceStore } from "@/store/useSpaceStore";

export function AchievementModal() {
  const activeId = useSpaceStore((s) => s.activeAchievementId);
  const openAchievement = useSpaceStore((s) => s.openAchievement);
  const achievement = ACHIEVEMENTS_DATA.find((a) => a.id === activeId);

  useEffect(() => {
    if (!achievement) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && openAchievement(null);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [achievement, openAchievement]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => openAchievement(null)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievement-modal-title"
            className="glass relative max-h-[100svh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-3xl p-5 sm:max-h-[90svh] sm:rounded-3xl sm:p-8"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => openAchievement(null)}
              aria-label="Close achievement details"
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10"
            >
              <X size={18} />
            </button>

            {achievement.image && (
              // Certificates come in portrait and landscape: show the whole image, never cropped.
              <div className="mb-4 flex justify-center rounded-xl bg-black/50 p-2">
                <Image
                  src={achievement.image}
                  alt={`Certificate: ${achievement.title}`}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 92vw, 640px"
                  className="h-auto w-auto max-w-full rounded-lg object-contain"
                  style={{ maxHeight: "58svh" }}
                />
              </div>
            )}

            <span className="rounded-full bg-nebula/30 px-2.5 py-1 text-xs">{achievement.type}</span>
            <h2 id="achievement-modal-title" className="mt-3 pr-10 font-display text-2xl font-bold">
              {achievement.title}
            </h2>
            <p className="mt-1 text-sm text-white/60">
              {achievement.issuer} · {achievement.date}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{achievement.description}</p>

            {achievement.link && (
              <a
                href={achievement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black"
              >
                Read publication <ExternalLink size={14} />
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
