"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import type { Group } from "three";

/** Procedural stars that follow the camera so the sky never runs out. */
export function StarField() {
  const group = useRef<Group>(null);
  const isMobile = useThree((s) => s.size.width < 768);

  useFrame(({ camera }) => {
    group.current?.position.copy(camera.position);
  });

  return (
    <group ref={group}>
      <Stars
        radius={400}
        depth={120}
        count={isMobile ? 2500 : 6000}
        factor={5}
        saturation={0}
        fade
        speed={0.4}
      />
    </group>
  );
}
