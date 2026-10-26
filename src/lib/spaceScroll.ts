import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_COUNT, useSpaceStore, type SectionIndex } from "@/store/useSpaceStore";

gsap.registerPlugin(ScrollTrigger);

const WARP_VELOCITY_REF = 3200; // px/s of scroll that equals full warp

/**
 * Pins #viewport-container and maps scroll to camera progress with snap stops
 * at every section. Returns a cleanup function.
 */
export function setupSpaceScroll(): () => void {
  const { setProgress, setSection, setWarp } = useSpaceStore.getState();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The store outlives this page: coming back from /projects or /about, resume
  // on the section the visitor left from instead of the very beginning.
  const resumeIndex = useSpaceStore.getState().sectionIndex;

  const trigger = ScrollTrigger.create({
    trigger: "#viewport-container",
    start: "top top",
    end: `+=${(SECTION_COUNT - 1) * 100}%`,
    pin: true,
    scrub: reduceMotion ? true : 1,
    snap: {
      snapTo: 1 / (SECTION_COUNT - 1),
      duration: reduceMotion ? { min: 0.2, max: 0.4 } : { min: 0.8, max: 1.2 },
      delay: 0.3, // lets the section UI fade out before the warp starts
      ease: "power3.inOut",
    },
    onUpdate: (self) => {
      setProgress(self.progress);
      setSection(Math.round(self.progress * (SECTION_COUNT - 1)) as SectionIndex);
    },
  });

  if (resumeIndex > 0) {
    const progress = resumeIndex / (SECTION_COUNT - 1);
    window.scrollTo(0, trigger.start + (trigger.end - trigger.start) * progress);
    setProgress(progress);
    setSection(resumeIndex);
    trigger.update();
  }

  // onUpdate stops firing when scrolling stops, so decay warp on the ticker.
  const tick = () => {
    if (reduceMotion) return;
    const target = Math.min(1, Math.abs(trigger.getVelocity()) / WARP_VELOCITY_REF);
    const current = useSpaceStore.getState().warp;
    const next = current + (target - current) * 0.12;
    setWarp(next < 0.005 ? 0 : next);
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    trigger.kill();
    setWarp(0);
  };
}

/** Scrolls to a section's snap position; the trigger then updates the store. */
export function scrollToSection(index: number) {
  const st = ScrollTrigger.getAll().find((t) => t.pin);
  if (!st) return;
  const y = st.start + (st.end - st.start) * (index / (SECTION_COUNT - 1));
  window.scrollTo({ top: y, behavior: "smooth" });
}
