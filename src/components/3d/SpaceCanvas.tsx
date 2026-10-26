"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { WAYPOINTS } from "@/lib/waypoints";
import { CameraRig } from "./CameraRig";
import { GalaxyModel } from "./GalaxyModel";
import { Galaxies } from "./Galaxies";
import { Gargantua } from "./Gargantua";
import { LoadingReporter } from "./LoadingReporter";
import { PostFX } from "./PostFX";
import { SolarSystem } from "./SolarSystem";
import { StarField } from "./StarField";
import { WarpEffect } from "./WarpEffect";

/**
 * true: single galaxy loaded from public/models/galaxy.glb.
 * false: the original procedural Milky Way + Andromeda particle systems.
 */
const USE_GALAXY_MODEL = true;

export default function SpaceCanvas() {
  const start = WAYPOINTS[0];

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ fov: 55, near: 0.1, far: 2000, position: [...start.position] }}
      aria-hidden="true"
    >
      <color attach="background" args={["#02030a"]} />
      <ambientLight intensity={0.15} />
      <AdaptiveDpr pixelated />
      <LoadingReporter />
      <CameraRig />
      <StarField />
      <Gargantua />
      {USE_GALAXY_MODEL ? (
        <Suspense fallback={null}>
          <GalaxyModel />
        </Suspense>
      ) : (
        <Galaxies />
      )}
      <SolarSystem />
      <WarpEffect />
      <PostFX />
    </Canvas>
  );
}
