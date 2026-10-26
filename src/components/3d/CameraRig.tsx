"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector3 } from "three";
import { getEarthFrame } from "@/lib/earthOrbit";
import { WAYPOINTS } from "@/lib/waypoints";
import { useSpaceStore } from "@/store/useSpaceStore";

const BASE_FOV = 55;

/** Extra FOV (degrees) at the instant the splash opens, easing back to normal. */
const INTRO_FOV_PUNCH = 32;
const INTRO_FOV_PUNCH_MS = 2200;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const UP = new Vector3(0, 1, 0);

/** A curve control point that is rewritten every frame to track the orbiting Earth. */
interface FollowPoint {
  target: Vector3;
  /** [right, up, toward-sun] offset from Earth. */
  offset: Vector3;
}

/**
 * Samples a spline through the waypoints at the current scroll progress.
 * CatmullRomCurve3.getPoint(i / (n - 1)) passes exactly through point i,
 * so the ScrollTrigger snap stops land on the authored waypoints.
 */
export function CameraRig() {
  const { positionCurve, lookAtCurve, sectionToCurve, follows } = useMemo(() => {
    const positions: Vector3[] = [];
    const lookAts: Vector3[] = [];
    const waypointIndex: number[] = [];
    const viaIndex: (number | null)[] = [];
    const follows: FollowPoint[] = [];

    WAYPOINTS.forEach((w) => {
      waypointIndex.push(positions.length);
      const position = new Vector3(...w.position);
      const lookAt = new Vector3(...w.lookAt);
      positions.push(position);
      lookAts.push(lookAt);
      if (w.follow === "earth") {
        follows.push({ target: position, offset: position.clone() });
        follows.push({ target: lookAt, offset: lookAt.clone() });
      }
      if (w.via) {
        viaIndex.push(positions.length);
        positions.push(new Vector3(...w.via.position));
        lookAts.push(new Vector3(...w.via.lookAt));
      } else {
        viaIndex.push(null);
      }
    });

    const last = WAYPOINTS.length - 1;
    const total = positions.length - 1;

    /** Maps scroll position (0..last, whole numbers are snap stops) to a curve parameter. */
    const sectionToCurve = (p: number) => {
      const i = Math.min(Math.floor(p), last - 1);
      const f = p - i;
      const from = waypointIndex[i];
      const to = waypointIndex[i + 1];
      const via = viaIndex[i];
      const at = WAYPOINTS[i].via?.at ?? 0;
      const u =
        via === null
          ? from + f * (to - from)
          : f < at
            ? from + (f / at) * (via - from)
            : via + ((f - at) / (1 - at)) * (to - via);
      return u / total;
    };

    return {
      positionCurve: new CatmullRomCurve3(positions, false, "catmullrom", 0.4),
      lookAtCurve: new CatmullRomCurve3(lookAts, false, "catmullrom", 0.4),
      sectionToCurve,
      follows,
    };
  }, []);

  const smoothed = useRef(0);
  const initialized = useRef(false);
  const position = useRef(new Vector3());
  const target = useRef(new Vector3());
  const earth = useRef(new Vector3());
  const sunDirection = useRef(new Vector3());
  const right = useRef(new Vector3());

  useFrame(({ camera, size, clock }, delta) => {
    // On portrait screens widen the FOV so wide scenes (the galaxy) still fit.
    const aspect = size.width / size.height;
    const fitFov = aspect >= 1 ? BASE_FOV : MathUtils.clamp(BASE_FOV + (1 - aspect) * 45, BASE_FOV, 78);

    // The camera "activates" when the splash opens: a wide-angle rush that settles.
    const { introDoneAt } = useSpaceStore.getState();
    const punchProgress = introDoneAt === null ? 1 : (performance.now() - introDoneAt) / INTRO_FOV_PUNCH_MS;
    const punch = punchProgress >= 1 ? 0 : INTRO_FOV_PUNCH * (1 - easeOutCubic(Math.max(0, punchProgress)));
    const fov = fitFov + punch;
    if (camera instanceof PerspectiveCamera && Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    const { progress } = useSpaceStore.getState();

    // Re-aim the Earth waypoints at the planet's current position and sun-facing frame.
    if (follows.length > 0) {
      getEarthFrame(clock.elapsedTime, progress * (WAYPOINTS.length - 1), earth.current, sunDirection.current);
      right.current.crossVectors(UP, sunDirection.current).normalize();
      for (const { target: point, offset } of follows) {
        point
          .copy(earth.current)
          .addScaledVector(right.current, offset.x)
          .addScaledVector(UP, offset.y)
          .addScaledVector(sunDirection.current, offset.z);
      }
    }

    if (!initialized.current) {
      // First frame: jump straight to the stored position (e.g. returning from /about).
      smoothed.current = progress;
      initialized.current = true;
    }
    smoothed.current = MathUtils.damp(smoothed.current, progress, 6, delta);
    const t = sectionToCurve(MathUtils.clamp(smoothed.current, 0, 1) * (WAYPOINTS.length - 1));

    positionCurve.getPoint(t, position.current);
    lookAtCurve.getPoint(t, target.current);

    camera.position.copy(position.current);
    camera.lookAt(target.current);
  });

  return null;
}
