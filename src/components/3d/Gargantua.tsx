"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide, ShaderMaterial } from "three";
import { OBJECT_POSITIONS } from "@/lib/waypoints";
import { useSectionVisibility } from "./useSectionVisibility";

const DISK_INNER = 7.5;
const DISK_OUTER = 17;

const vertexShader = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uInner;
  uniform float uOuter;
  varying vec3 vPos;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }

  void main() {
    float r = length(vPos.xy);
    float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
    float angle = atan(vPos.y, vPos.x);

    // Differential rotation: inner gas orbits faster than outer gas.
    float swirl = angle + uTime * (1.6 / (0.4 + t * 2.0));
    float bands = noise(vec2(swirl * 3.0, r * 1.4)) * 0.6
                + noise(vec2(swirl * 9.0, r * 3.2)) * 0.4;

    vec3 hot = vec3(1.0, 0.92, 0.7);
    vec3 mid = vec3(1.0, 0.5, 0.12);
    vec3 cool = vec3(0.45, 0.1, 0.04);
    vec3 col = mix(hot, mid, smoothstep(0.0, 0.45, t));
    col = mix(col, cool, smoothstep(0.4, 1.0, t));

    // Doppler beaming: one side of the disk is brighter.
    float doppler = 0.65 + 0.55 * sin(angle + 1.2);
    float fade = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.7, 1.0, t));
    float intensity = (0.35 + bands) * doppler * fade * 2.2;

    gl_FragColor = vec4(col * intensity, intensity);
  }
`;

export function Gargantua() {
  const ref = useSectionVisibility(0, 1.2);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uInner: { value: DISK_INNER },
          uOuter: { value: DISK_OUTER },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
        toneMapped: false,
      }),
    [],
  );

  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });

  return (
    <group ref={ref} position={OBJECT_POSITIONS.gargantua} rotation={[0, 0, 0.12]}>
      {/* Event horizon */}
      <mesh>
        <sphereGeometry args={[DISK_INNER * 0.82, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Photon ring */}
      <mesh>
        <ringGeometry args={[DISK_INNER * 0.82, DISK_INNER * 0.9, 96]} />
        <meshBasicMaterial color="#ffd9a0" toneMapped={false} side={DoubleSide} />
      </mesh>

      {/* Equatorial accretion disk, seen near edge-on */}
      <mesh rotation={[-Math.PI / 2 + 0.22, 0, 0]} material={material}>
        <ringGeometry args={[DISK_INNER, DISK_OUTER, 160, 1]} />
      </mesh>

      {/* Lensed image of the far side of the disk, bent over the shadow */}
      <mesh rotation={[0, 0, 0]} scale={0.78} material={material}>
        <ringGeometry args={[DISK_INNER, DISK_OUTER * 0.7, 160, 1]} />
      </mesh>

      <pointLight color="#ff9a3c" intensity={400} distance={120} />
    </group>
  );
}
