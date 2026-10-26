"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BackSide, Group, ShaderMaterial, Vector3 } from "three";
import { getEarthFrame } from "@/lib/earthOrbit";
import { SECTION_COUNT, useSpaceStore } from "@/store/useSpaceStore";
import { EarthSurfaceModel } from "./EarthSurfaceModel";
import { noiseGlsl } from "./glsl";

const EARTH_RADIUS = 5;
const MOON_ORBIT = 14;
/** World-space unit vector from Earth toward the sun; refreshed every frame. */
const SUN_DIRECTION = new Vector3(0, 0, -1);
const earthWorld = new Vector3();

/**
 * true: Earth texture (extracted from public/models/earth.glb) with procedural city lights on the night side.
 * false: the original fully procedural Earth. The procedural Earth also shows while the model loads.
 */
const USE_EARTH_MODEL = true;

const surfaceVertex = /* glsl */ `
  varying vec3 vObjPos;
  varying vec3 vNormalW;
  void main() {
    vObjPos = normalize(position);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragment = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vObjPos;
  varying vec3 vNormalW;
  ${noiseGlsl}
  void main() {
    float h = fbm(vObjPos * 2.6);
    float land = smoothstep(0.52, 0.56, h);
    float lat = abs(vObjPos.y);
    vec3 ocean = mix(vec3(0.02, 0.1, 0.32), vec3(0.05, 0.28, 0.55), smoothstep(0.3, 0.52, h));
    vec3 ground = mix(vec3(0.12, 0.34, 0.14), vec3(0.45, 0.38, 0.22), smoothstep(0.56, 0.72, h));
    vec3 col = mix(ocean, ground, land);
    col = mix(col, vec3(0.92, 0.95, 1.0), smoothstep(0.8, 0.92, lat + (h - 0.5) * 0.2));
    float diffuse = clamp(dot(normalize(vNormalW), uSun), 0.0, 1.0);
    float night = 1.0 - smoothstep(0.0, 0.25, diffuse);
    vec3 lit = col * (0.04 + diffuse);
    lit += vec3(1.0, 0.8, 0.45) * land * night * step(0.62, fbm(vObjPos * 14.0)) * 0.7;
    gl_FragColor = vec4(lit, 1.0);
  }
`;

const cloudFragment = /* glsl */ `
  uniform vec3 uSun;
  uniform float uTime;
  varying vec3 vObjPos;
  varying vec3 vNormalW;
  ${noiseGlsl}
  void main() {
    float c = fbm(vObjPos * 4.0 + vec3(uTime * 0.02, 0.0, 0.0));
    float a = smoothstep(0.5, 0.78, c);
    float diffuse = clamp(dot(normalize(vNormalW), uSun), 0.0, 1.0);
    gl_FragColor = vec4(vec3(1.0) * (0.08 + diffuse), a * 0.85);
  }
`;

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormalV;
  void main() {
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = /* glsl */ `
  varying vec3 vNormalV;
  void main() {
    float rim = pow(max(0.72 - dot(vNormalV, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
    gl_FragColor = vec4(0.25, 0.55, 1.0, 1.0) * clamp(rim, 0.0, 1.0) * 1.6;
  }
`;

export function EarthMoon() {
  const moonPivot = useRef<Group>(null);
  const earth = useRef<Group>(null);

  const earthMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uSun: { value: SUN_DIRECTION } },
        vertexShader: surfaceVertex,
        fragmentShader: earthFragment,
      }),
    [],
  );
  const cloudMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uSun: { value: SUN_DIRECTION }, uTime: { value: 0 } },
        vertexShader: surfaceVertex,
        fragmentShader: cloudFragment,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  const atmosphereMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        side: BackSide,
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  useFrame(({ clock }, delta) => {
    // Light the planet from the real sun, wherever Earth is on its orbit.
    getEarthFrame(
      clock.elapsedTime,
      useSpaceStore.getState().progress * (SECTION_COUNT - 1),
      earthWorld,
      SUN_DIRECTION,
    );
    if (earth.current) earth.current.rotation.y += delta * 0.05;
    if (moonPivot.current) moonPivot.current.rotation.y += delta * 0.08;
    cloudMaterial.uniforms.uTime.value += delta;
  });

  const proceduralSurface = (
    <>
      <mesh material={earthMaterial}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
      </mesh>
      <mesh material={cloudMaterial} scale={1.02}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
      </mesh>
    </>
  );

  return (
    <group>
      <group ref={earth} rotation={[0.41, 0, 0]}>
        {USE_EARTH_MODEL ? (
          <Suspense fallback={proceduralSurface}>
            <EarthSurfaceModel radius={EARTH_RADIUS} sunDirection={SUN_DIRECTION} />
          </Suspense>
        ) : (
          proceduralSurface
        )}
      </group>
      <mesh material={atmosphereMaterial} scale={1.16}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
      </mesh>

      <group ref={moonPivot} rotation={[0.09, 1.2, 0]}>
        <mesh position={[MOON_ORBIT, 0, 0]}>
          <sphereGeometry args={[1.4, 48, 48]} />
          <meshStandardMaterial color="#b9b6b0" roughness={1} />
        </mesh>
      </group>
    </group>
  );
}
