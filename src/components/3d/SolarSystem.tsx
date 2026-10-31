"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, type Group, type PointLight } from "three";
import {
  EARTH_ORBIT_RADIUS,
  EARTH_SYSTEM_SCALE,
  SOLAR_TILT,
  earthAngle,
  planetAngle,
} from "@/lib/earthOrbit";
import { OBJECT_POSITIONS } from "@/lib/waypoints";
import { SECTION_COUNT, useSpaceStore } from "@/store/useSpaceStore";
import { EarthMoon } from "./EarthMoon";
import { Sun } from "./Sun";
import { useSectionSpan } from "./useSectionVisibility";

interface PlanetSpec {
  name: string;
  orbit: number;
  size: number;
  speed: number;
  color: string;
  phase: number;
}

const PLANETS: readonly PlanetSpec[] = [
  { name: "Mercury", orbit: 8, size: 0.5, speed: 1.6, color: "#a8a29a", phase: 0.3 },
  { name: "Venus", orbit: 12, size: 0.9, speed: 1.2, color: "#e8c98a", phase: 2.1 },
  { name: "Earth", orbit: EARTH_ORBIT_RADIUS, size: 1, speed: 1.0, color: "#4b8bff", phase: 4.0 },
  { name: "Mars", orbit: 22, size: 0.7, speed: 0.8, color: "#d4623a", phase: 1.2 },
  { name: "Jupiter", orbit: 31, size: 2.6, speed: 0.45, color: "#d9b38c", phase: 5.2 },
  { name: "Saturn", orbit: 40, size: 2.2, speed: 0.33, color: "#ead7a4", phase: 3.3 },
];

function Planet({ spec }: { spec: PlanetSpec }) {
  const pivot = useRef<Group>(null);
  const isEarth = spec.name === "Earth";

  // Angles are pure functions of time (and scroll, for Earth), so the camera
  // rig can compute exactly where Earth is without reading this mesh.
  useFrame(({ clock }) => {
    if (!pivot.current) return;
    pivot.current.rotation.y = isEarth
      ? earthAngle(clock.elapsedTime, useSpaceStore.getState().progress * (SECTION_COUNT - 1))
      : planetAngle(spec.phase, spec.speed, clock.elapsedTime);
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[spec.orbit - 0.04, spec.orbit + 0.04, 128]} />
        <meshBasicMaterial color="#6f7bb8" transparent opacity={0.28} />
      </mesh>
      <group ref={pivot} rotation={[0, spec.phase, 0]}>
        {isEarth ? (
          // The same Earth the camera warps into, at planet scale (radius 1).
          <group position={[spec.orbit, 0, 0]} scale={EARTH_SYSTEM_SCALE}>
            <EarthMoon />
          </group>
        ) : (
          <mesh position={[spec.orbit, 0, 0]}>
            <sphereGeometry args={[spec.size, 32, 32]} />
            <meshStandardMaterial color={spec.color} roughness={0.85} />
          </mesh>
        )}
        {spec.name === "Saturn" && (
          <mesh position={[spec.orbit, 0, 0]} rotation={[-Math.PI / 2 + 0.4, 0, 0]}>
            <ringGeometry args={[spec.size * 1.5, spec.size * 2.4, 64]} />
            <meshBasicMaterial color="#c9b78a" transparent opacity={0.6} side={DoubleSide} />
          </mesh>
        )}
      </group>
    </group>
  );
}

const SUN_RADIUS = 4.5;
const SUN_LIGHT_INTENSITY = 900;

export function SolarSystem() {
  // Grows in as the warp arrives (1.5 -> 2) and stays through the Earth sections.
  const group = useSectionSpan(1.5, SECTION_COUNT - 1, 0.5);
  const light = useRef<PointLight>(null);

  // Dim instead of hiding: a changing light count recompiles lit materials mid-warp.
  useFrame(() => {
    if (light.current) light.current.intensity = group.current?.visible ? SUN_LIGHT_INTENSITY : 0;
  });

  return (
    <>
      <group ref={group} position={OBJECT_POSITIONS.sun} rotation={SOLAR_TILT}>
        <Sun radius={SUN_RADIUS} />
        {PLANETS.map((spec) => (
          <Planet key={spec.name} spec={spec} />
        ))}
      </group>
      <pointLight
        ref={light}
        color="#ffd9a0"
        intensity={0}
        distance={160}
        decay={1.6}
        position={OBJECT_POSITIONS.sun}
      />
    </>
  );
}
