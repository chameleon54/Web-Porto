import { create } from "zustand";

export type SectionIndex = 0 | 1 | 2 | 3 | 4;

export const SECTION_COUNT = 5;

export type IntroPhase = "splash" | "done";

export interface LoadingState {
  /** 0..100 across all three.js loaders. */
  progress: number;
  /** Items registered so far; 0 until the 3D chunk starts loading. */
  total: number;
  active: boolean;
}

/** Within this many sections of a snap stop, the camera counts as "arrived". */
const SETTLE_EPSILON = 0.04;

interface SpaceState {
  /** Committed section, drives UI visibility. */
  sectionIndex: SectionIndex;
  /** Continuous scroll progress 0..1, drives the camera. */
  progress: number;
  /** True while the camera rests on a section; false during a warp. UI hides when false. */
  settled: boolean;
  /** Warp intensity 0..1, drives post-processing. */
  warp: number;
  activeProjectId: string | null;
  activeAchievementId: string | null;
  audioEnabled: boolean;
  /** Splash screen state; the hero, music and camera push-in start at "done". */
  introPhase: IntroPhase;
  /** performance.now() when the splash opened, for the camera push-in; null before. */
  introDoneAt: number | null;
  /** Real asset loading progress, reported from inside the 3D canvas. */
  loading: LoadingState;

  setSection: (index: SectionIndex) => void;
  setProgress: (progress: number) => void;
  setWarp: (warp: number) => void;
  openProject: (id: string | null) => void;
  openAchievement: (id: string | null) => void;
  toggleAudio: () => void;
  setIntroPhase: (phase: IntroPhase) => void;
  setLoading: (loading: LoadingState) => void;
}

export const useSpaceStore = create<SpaceState>((set) => ({
  sectionIndex: 0,
  progress: 0,
  settled: true,
  warp: 0,
  activeProjectId: null,
  activeAchievementId: null,
  audioEnabled: true,
  introPhase: "splash",
  introDoneAt: null,
  loading: { progress: 0, total: 0, active: false },

  setSection: (sectionIndex) => set((s) => (s.sectionIndex === sectionIndex ? s : { sectionIndex })),
  setProgress: (progress) =>
    set((s) => {
      const position = progress * (SECTION_COUNT - 1);
      const settled = Math.abs(position - Math.round(position)) < SETTLE_EPSILON;
      return s.settled === settled ? { progress } : { progress, settled };
    }),
  setWarp: (warp) => set({ warp }),
  openProject: (activeProjectId) => set({ activeProjectId }),
  openAchievement: (activeAchievementId) => set({ activeAchievementId }),
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  setLoading: (loading) => set({ loading }),
  setIntroPhase: (introPhase) =>
    set({ introPhase, introDoneAt: introPhase === "done" ? performance.now() : null }),
}));
