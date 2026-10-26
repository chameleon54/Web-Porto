"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { AchievementModal } from "@/components/modals/AchievementModal";
import { ProjectModal } from "@/components/modals/ProjectModal";
import { AboutPreview } from "@/components/ui/AboutPreview";
import { Achievements } from "@/components/ui/Achievements";
import { Hero } from "@/components/ui/Hero";
import { Navigation } from "@/components/ui/Navigation";
import { ProjectCarousel } from "@/components/ui/ProjectCarousel";
import { SkillsGrid } from "@/components/ui/SkillsGrid";
import { Splash } from "@/components/ui/Splash";
import { setupSpaceScroll } from "@/lib/spaceScroll";

const SpaceCanvas = dynamic(() => import("@/components/3d/SpaceCanvas"), {
  ssr: false,
  loading: () => <div className="star-bg absolute inset-0" />,
});

export default function HomePage() {
  useEffect(() => setupSpaceScroll(), []);

  return (
    <main>
      <div id="viewport-container" className="relative h-[100svh] w-full overflow-hidden bg-void">
        <SpaceCanvas />
        <Navigation />
        <Hero />
        <ProjectCarousel />
        <SkillsGrid />
        <Achievements />
        <AboutPreview />
      </div>
      <ProjectModal />
      <AchievementModal />
      <Splash />
    </main>
  );
}
