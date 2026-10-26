"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { ShaderMaterial, SRGBColorSpace, Vector3 } from "three";
import { noiseGlsl } from "./glsl";

/**
 * Textures extracted from public/models/earth.glb. The GLB itself is not
 * loaded: its material uses KHR_materials_pbrSpecularGlossiness, which this
 * three.js loader no longer supports, so the texture was dropped and the
 * planet rendered black. The model is a plain UV sphere, so a sphere geometry
 * with the same texture is equivalent and downloads ~4x less.
 */
const TEXTURE_4K = "/textures/earth-day-4k.jpg";
const TEXTURE_2K = "/textures/earth-day-2k.jpg";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vObjPos;
  varying vec3 vNormalW;
  void main() {
    // The source image is stored vertically flipped (south at the top).
    vUv = vec2(uv.x, 1.0 - uv.y);
    vObjPos = normalize(position);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Day side: the satellite texture, lit by the sun.
 * Night side: procedural city lights, placed only where the texture shows land
 * (not ocean, ice or cloud) and clustered with noise, so the dark half of the
 * planet glows with settlements even though there is no night-time map.
 */
const fragmentShader = /* glsl */ `
  uniform sampler2D uDayMap;
  uniform vec3 uSun;
  varying vec2 vUv;
  varying vec3 vObjPos;
  varying vec3 vNormalW;
  ${noiseGlsl}

  void main() {
    vec3 day = texture2D(uDayMap, vUv).rgb;
    vec3 n = normalize(vNormalW);
    float s = dot(n, uSun);

    float dayAmount = smoothstep(-0.08, 0.32, s);
    float night = 1.0 - smoothstep(-0.18, 0.12, s);

    // Land mask read from the texture itself: ocean is blue-dominant, ice and
    // cloud are bright and neutral.
    float blueDominance = day.b - max(day.r, day.g);
    float land = 1.0 - smoothstep(0.02, 0.14, blueDominance);
    float whiteness = min(min(day.r, day.g), day.b);
    float coldOrCloud = smoothstep(0.58, 0.85, whiteness);
    float poleFade = 1.0 - smoothstep(0.6, 0.82, abs(vUv.y - 0.5) * 2.0);

    // Settlements: broad population clusters carrying fine point lights.
    float population = smoothstep(0.46, 0.74, fbm(vObjPos * 3.6));
    float specks = smoothstep(0.72, 0.9, vnoise(vObjPos * 90.0));
    float metros = smoothstep(0.82, 0.95, vnoise(vObjPos * 34.0)) * population;
    float lightMask = land * (1.0 - coldOrCloud) * poleFade * night;
    vec3 cityColor = vec3(1.0, 0.74, 0.4);
    vec3 lights = cityColor * (specks * population * 2.4 + metros * 1.6 + population * 0.1) * lightMask;

    // Day shading with a faint warm band along the terminator.
    float twilight = exp(-pow(s * 7.0, 2.0));
    vec3 lit = day * (0.035 + 1.2 * dayAmount) + vec3(1.0, 0.45, 0.2) * twilight * 0.1 * land;

    gl_FragColor = vec4(lit + lights, 1.0);
  }
`;

interface EarthSurfaceModelProps {
  radius: number;
  /** World-space unit vector toward the sun; the caller mutates it every frame. */
  sunDirection: Vector3;
}

/** Earth surface: hybrid day texture + procedural night-side city lights. */
export function EarthSurfaceModel({ radius, sunDirection }: EarthSurfaceModelProps) {
  const isMobile = useThree((s) => s.size.width < 768);
  const dayMap = useTexture(isMobile ? TEXTURE_2K : TEXTURE_4K);

  const material = useMemo(() => {
    dayMap.colorSpace = SRGBColorSpace;
    dayMap.anisotropy = 8;
    return new ShaderMaterial({
      uniforms: { uDayMap: { value: dayMap }, uSun: { value: sunDirection } },
      vertexShader,
      fragmentShader,
    });
  }, [dayMap, sunDirection]);

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, 128, 96]} />
    </mesh>
  );
}

