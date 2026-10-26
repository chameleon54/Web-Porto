"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { AdditiveBlending, BufferGeometry, Group, Points, Vector3 } from "three";
import { OBJECT_POSITIONS } from "@/lib/waypoints";
import { useSectionVisibility } from "./useSectionVisibility";

const MODEL_URL = "/models/galaxy.glb";

/** On-screen radius (world units) that should contain ~95% of the points. */
const TARGET_RADIUS = 55;
const TILT: readonly [number, number, number] = [0.5, 0, 0.25];
const SPIN_SPEED = 0.015;

interface Fitted {
  geometry: BufferGeometry;
  centroid: Vector3;
  scale: number;
}

/**
 * Centers the cloud on its centroid and sizes it by the 95th-percentile
 * radius, so a few stray outlier points cannot shrink the whole galaxy.
 */
function fitGeometry(geometry: BufferGeometry): Fitted {
  const positions = geometry.getAttribute("position");
  const count = positions.count;

  const centroid = new Vector3();
  for (let i = 0; i < count; i++) {
    centroid.x += positions.getX(i);
    centroid.y += positions.getY(i);
    centroid.z += positions.getZ(i);
  }
  centroid.divideScalar(count);

  const distances = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    distances[i] = Math.hypot(
      positions.getX(i) - centroid.x,
      positions.getY(i) - centroid.y,
      positions.getZ(i) - centroid.z,
    );
  }
  distances.sort();
  const p95 = distances[Math.floor(count * 0.95)] || 1;

  return { geometry, centroid, scale: TARGET_RADIUS / p95 };
}

/**
 * Galaxy loaded from public/models/galaxy.glb (a 50k-point cloud with vertex
 * colors, authored Z-up). Replaces the procedural <Galaxies /> component, which
 * is kept in the repo so it can be switched back in SpaceCanvas.
 */
export function GalaxyModel() {
  const group = useSectionVisibility(1, 1.3);
  const spin = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  const fitted = useMemo<Fitted | null>(() => {
    let source: BufferGeometry | null = null;
    scene.traverse((object) => {
      if (!source && (object as Points).isPoints) source = (object as Points).geometry;
    });
    return source ? fitGeometry(source) : null;
  }, [scene]);

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * SPIN_SPEED;
  });

  if (!fitted) return null;
  const { geometry, centroid, scale } = fitted;

  return (
    <group ref={group} position={OBJECT_POSITIONS.galaxy} rotation={TILT as [number, number, number]}>
      <group ref={spin}>
        {/* Model is Z-up; rotate it so the disk lies in the XZ plane. */}
        <group rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
          <points geometry={geometry} position={[-centroid.x, -centroid.y, -centroid.z]}>
            <pointsMaterial
              size={0.5}
              sizeAttenuation
              vertexColors
              transparent
              opacity={0.55}
              depthWrite={false}
              blending={AdditiveBlending}
              toneMapped={false}
            />
          </points>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
