"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Points } from "three";
import { OBJECT_POSITIONS } from "@/lib/waypoints";
import { useSectionVisibility } from "./useSectionVisibility";

interface GalaxyProps {
  position: readonly [number, number, number];
  count: number;
  radius: number;
  arms: number;
  twist: number;
  inner: string;
  outer: string;
  tilt: readonly [number, number, number];
  spin: number;
}

/** Deterministic PRNG so server/client and re-mounts produce the same galaxy. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGalaxyGeometry(
  { count, radius, arms, twist, inner, outer }: GalaxyProps,
  seed: number,
) {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const innerColor = new Color(inner);
  const outerColor = new Color(outer);
  const mixed = new Color();

  for (let i = 0; i < count; i++) {
    const r = Math.pow(rand(), 1.6) * radius;
    // Logarithmic spiral: angle grows with ln(r).
    const arm = (i % arms) * ((Math.PI * 2) / arms);
    const angle = arm + twist * Math.log(1 + r);
    const spread = (0.25 + (r / radius) * 0.9) * (rand() - 0.5) * 6;

    positions[i * 3] = Math.cos(angle) * r + spread;
    positions[i * 3 + 1] = (rand() - 0.5) * (1.2 + (1 - r / radius) * 5);
    positions[i * 3 + 2] = Math.sin(angle) * r + spread;

    mixed.copy(innerColor).lerp(outerColor, r / radius);
    colors.set([mixed.r, mixed.g, mixed.b], i * 3);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return geometry;
}

function Galaxy(props: GalaxyProps & { seed: number }) {
  const { position, tilt, spin, seed } = props;
  const points = useRef<Points>(null);
  const geometry = useMemo(() => buildGalaxyGeometry(props, seed), [props, seed]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * spin;
  });

  return (
    <points ref={points} position={position} rotation={tilt as [number, number, number]} geometry={geometry}>
      <pointsMaterial
        size={0.55}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

export function Galaxies() {
  const group = useSectionVisibility(1, 1.3);
  const isMobile = useThree((s) => s.size.width < 768);
  const count = isMobile ? 6000 : 18000;

  const milkyWay = useMemo<GalaxyProps>(
    () => ({
      position: OBJECT_POSITIONS.milkyWay,
      count,
      radius: 38,
      arms: 4,
      twist: 2.4,
      inner: "#ffe2a8",
      outer: "#5a7bff",
      tilt: [0.5, 0, 0.25],
      spin: 0.02,
    }),
    [count],
  );
  const andromeda = useMemo<GalaxyProps>(
    () => ({
      position: OBJECT_POSITIONS.andromeda,
      count,
      radius: 44,
      arms: 2,
      twist: 2.0,
      inner: "#ffd0f0",
      outer: "#7a4dff",
      tilt: [-0.9, 0.3, 0.6],
      spin: -0.015,
    }),
    [count],
  );

  return (
    <group ref={group}>
      <Galaxy {...milkyWay} seed={1337} />
      <Galaxy {...andromeda} seed={4242} />
    </group>
  );
}
