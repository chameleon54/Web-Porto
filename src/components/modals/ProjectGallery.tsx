"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGalleryProps {
  title: string;
  images: string[];
}

const SWIPE_DISTANCE = 60;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "40%" : "-40%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? "-40%" : "40%", opacity: 0 }),
};

/**
 * Shows one screenshot at a time with previous/next buttons, dots, arrow keys
 * and touch swipe. Controls are hidden when there is only one image.
 */
export function ProjectGallery({ title, images }: ProjectGalleryProps) {
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  const count = images.length;
  const hasMany = count > 1;

  const paginate = useCallback(
    (step: number) => setPage(([current]) => [(current + step + count) % count, step]),
    [count],
  );

  const goTo = (target: number) => setPage(([current]) => [target, target > current ? 1 : -1]);

  useEffect(() => {
    if (!hasMany) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") paginate(1);
      if (event.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasMany, paginate]);

  return (
    <section aria-roledescription="carousel" aria-label={`${title} screenshots`} className="mb-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black/50">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            drag={hasMany ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_DISTANCE) paginate(1);
              else if (info.offset.x > SWIPE_DISTANCE) paginate(-1);
            }}
            className="absolute inset-0 touch-pan-y"
          >
            <Image
              src={images[index]}
              alt={`${title} screenshot ${index + 1} of ${count}`}
              fill
              sizes="(max-width: 640px) 92vw, 640px"
              className="pointer-events-none select-none object-contain"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous screenshot"
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next screenshot"
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
            >
              <ChevronRight size={22} />
            </button>
            <span className="absolute bottom-2 right-3 z-10 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-white/90">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {hasMany && (
        <div className="mt-2 flex justify-center" role="group" aria-label="Choose screenshot">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="flex h-8 w-8 items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all ${
                  i === index ? "h-2.5 w-2.5 bg-white" : "h-2 w-2 bg-white/35"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
