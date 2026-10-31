import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SECTION_COUNT, useSpaceStore, type SectionIndex } from "@/store/useSpaceStore";

gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

let goTo: (index: number) => void = () => {};

/** True when the gesture's target sits in a scroller that can still move that way. */
function innerCanScroll(target: EventTarget | null, dy: 1 | -1) {
  for (let el = target as HTMLElement | null; el && el !== document.body; el = el.parentElement) {
    if (el.scrollHeight <= el.clientHeight + 1) continue;
    if (!/(auto|scroll)/.test(getComputedStyle(el).overflowY)) continue;
    if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
  }
  return false;
}

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

  // One gesture = one section. Native page scroll is off; we tween it ourselves
  // and drop all input until the tween (plus the inertia tail) is done.
  let current: number = resumeIndex;
  let locked = false;
  let unlock: gsap.core.Tween | undefined;
  const yFor = (i: number) => trigger.start + (trigger.end - trigger.start) * (i / (SECTION_COUNT - 1));

  goTo = (i) => {
    const next = Math.max(0, Math.min(SECTION_COUNT - 1, i));
    if (locked || next === current) return;
    const hops = Math.abs(next - current);
    current = next;
    locked = true;
    gsap.to(window, {
      scrollTo: yFor(next),
      duration: reduceMotion ? 0.3 : 1.1 + 0.3 * (hops - 1),
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        unlock = gsap.delayedCall(0.15, () => (locked = false)); // swallows trackpad inertia
      },
    });
  };

  const html = document.documentElement;
  html.classList.add("space-scroll"); // a class, so Splash's inline overflow restore can't undo it

  const step = (dir: 1 | -1, e: Event) => {
    // The dim backdrop sits outside [role=dialog], so gestures there must not move the scene.
    if (document.querySelector("[role=dialog]")) return;
    if (innerCanScroll(e.target, dir)) return;
    goTo(current + dir);
  };
  const observer = Observer.create({
    type: "wheel,touch",
    wheelSpeed: -1,
    tolerance: 30,
    ignore: "[role=dialog]",
    onUp: (self) => step(1, self.event),
    onDown: (self) => step(-1, self.event),
  });

  const keys: Record<string, number> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };
  const onKey = (e: KeyboardEvent) => {
    if (document.querySelector("[role=dialog]")) return;
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select, [contenteditable]")) return;
    const isSpace = e.key === " " && !t.closest("button, a");
    const dir = isSpace ? (e.shiftKey ? -1 : 1) : keys[e.key];
    if (e.key === "Home" || e.key === "End") goTo(e.key === "Home" ? 0 : SECTION_COUNT - 1);
    else if (dir) goTo(current + dir);
    else return;
    e.preventDefault();
  };
  window.addEventListener("keydown", onKey);

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
    observer.kill();
    window.removeEventListener("keydown", onKey);
    unlock?.kill();
    gsap.killTweensOf(window);
    html.classList.remove("space-scroll");
    goTo = () => {};
    trigger.kill();
    setWarp(0);
  };
}

/** Jumps to a section with the same tween and input lock as wheel/swipe. */
export function scrollToSection(index: number) {
  goTo(index);
}
