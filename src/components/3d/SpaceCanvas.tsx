"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { WAYPOINTS } from "@/lib/waypoints";
import { CameraRig } from "./CameraRig";
import { GalaxyModel } from "./GalaxyModel";
import { Gargantua } from "./Gargantua";
import { LoadingReporter } from "./LoadingReporter";
import { PostFX } from "./PostFX";
import { SolarSystem } from "./SolarSystem";
import { StarField } from "./StarField";
import { WarpEffect } from "./WarpEffect";
import { useSpaceStore } from "@/store/useSpaceStore";

// Loaded client-only (dynamic ssr:false), so window is safe.
const IS_TOUCH = window.matchMedia("(pointer: coarse)").matches;
const TOUCH_FPS = 60;

/**
 * Phones run 90-120 Hz screens, and the page would render a frame on every refresh, doubling the
 * GPU work for no visible gain. Only used with frameloop="demand": asks for a frame at most TOUCH_FPS times a second.
 * shortcut: even cadence, so a 100 Hz screen gets 50 fps rather than an uneven 60; fine at 60/120 Hz.
 */
function FrameLimiter() {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const interval = 1000 / TOUCH_FPS;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - last < interval - 1) return;
      last = now;
      invalidate();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [invalidate]);

  return null;
}

export default function SpaceCanvas() {
  const start = WAYPOINTS[0];
  // A modal covers the scene; stop rendering behind it to save battery.
  const modalOpen = useSpaceStore((s) => s.activeProjectId !== null || s.activeAchievementId !== null);

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={modalOpen ? "never" : IS_TOUCH ? "demand" : "always"}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ fov: 55, near: 0.1, far: 2000, position: [...start.position] }}
      aria-hidden="true"
    >
      <color attach="background" args={["#02030a"]} />
      <ambientLight intensity={0.15} />
      <AdaptiveDpr pixelated />
      {IS_TOUCH && <FrameLimiter />}
      <LoadingReporter />
      <CameraRig />
      <StarField />
      <Gargantua />
      <Suspense fallback={null}>
        <GalaxyModel />
      </Suspense>
      <SolarSystem />
      <WarpEffect />
      <PostFX />
      {/* Compiles shaders and uploads buffers for hidden sections up front, so warps don't hitch. */}
      <Preload all />
    </Canvas>
  );
}
