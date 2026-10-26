"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { AdditiveBlending, BackSide, Color, ShaderMaterial } from "three";

const coronaVertex = /* glsl */ `
  varying vec3 vNormalV;
  void main() {
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coronaFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vNormalV;
  void main() {
    float rim = pow(max(0.78 - dot(vNormalV, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
    float pulse = 1.0 + 0.12 * sin(uTime * 1.3) + 0.06 * sin(uTime * 3.1);
    gl_FragColor = vec4(uColor * rim * 2.4 * pulse, rim);
  }
`;

const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float falloff = pow(clamp(1.0 - d, 0.0, 1.0), 2.6);
    float pulse = 1.0 + 0.1 * sin(uTime * 0.9);
    gl_FragColor = vec4(uColor * falloff * 1.6 * pulse, falloff);
  }
`;

interface SunProps {
  radius: number;
}

/**
 * Glowing sun: an over-bright core (drives the bloom pass), a fresnel corona
 * and a soft billboard halo, all gently pulsing.
 */
export function Sun({ radius }: SunProps) {
  const { corona, halo, coreColor } = useMemo(() => {
    const makeMaterial = (vertexShader: string, fragmentShader: string, color: string, backSide = false) =>
      new ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uColor: { value: new Color(color) } },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: backSide ? BackSide : undefined,
        toneMapped: false,
      });

    return {
      corona: makeMaterial(coronaVertex, coronaFragment, "#ff9a2e", true),
      halo: makeMaterial(haloVertex, haloFragment, "#ffb04a"),
      // Values above 1 push the core well past the bloom threshold.
      coreColor: new Color("#ffb347").multiplyScalar(3.2),
    };
  }, []);

  useFrame((_, delta) => {
    corona.uniforms.uTime.value += delta;
    halo.uniforms.uTime.value += delta;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color={coreColor} toneMapped={false} />
      </mesh>
      <mesh material={corona} scale={1.45}>
        <sphereGeometry args={[radius, 48, 48]} />
      </mesh>
      <Billboard>
        <mesh material={halo}>
          <planeGeometry args={[radius * 9, radius * 9]} />
        </mesh>
      </Billboard>
    </group>
  );
}
