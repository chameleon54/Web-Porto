"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, LineBasicMaterial } from "three";
import { useSpaceStore } from "@/store/useSpaceStore";

const LINE_COUNT = 220;

/**
 * Speed lines parented to the camera. Each line is a unit-length segment
 * along -Z; scaling the group's Z by the warp value stretches them all
 * without touching the geometry.
 */
export function WarpEffect() {
  const group = useRef<Group>(null);
  const isMobile = useThree((s) => s.size.width < 768);
  const count = isMobile ? 90 : LINE_COUNT;

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 10;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const start = -Math.random();
      positions.set([x, y, start, x, y, start - 0.12 - Math.random() * 0.2], i * 6);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    const m = new LineBasicMaterial({
      color: "#9fc4ff",
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    return { geometry: g, material: m };
  }, [count]);

  useFrame(({ camera }) => {
    const warp = useSpaceStore.getState().warp;
    const g = group.current;
    if (!g) return;
    g.visible = warp > 0.02;
    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);
    g.scale.set(1, 1, 8 + warp * 90);
    material.opacity = Math.min(1, warp * 1.3);
  });

  return (
    <group ref={group} visible={false}>
      <lineSegments geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
