"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { Vector2 } from "three";
import { useSpaceStore } from "@/store/useSpaceStore";

/** Bloom everywhere; chromatic aberration (driven by warp) on desktop only. */
export function PostFX() {
  const isMobile = useThree((s) => s.size.width < 768);
  const offset = useMemo(() => new Vector2(0, 0), []);

  useFrame(() => {
    const warp = useSpaceStore.getState().warp;
    offset.set(warp * 0.006, warp * 0.004);
  });

  if (isMobile) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.9} luminanceThreshold={0.6} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={1.1} luminanceThreshold={0.55} luminanceSmoothing={0.2} mipmapBlur />
      <ChromaticAberration
        offset={offset}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}
