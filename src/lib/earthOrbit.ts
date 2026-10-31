import { Euler, MathUtils, Vector3 } from "three";
import { OBJECT_POSITIONS } from "./waypoints";

/**
 * Earth's orbit, computed from time and scroll position only. The camera rig
 * and the Solar System mesh both call this, so the camera lands on exactly
 * the planet that is drawn (no one-frame lag between the two).
 */

/** The Solar System group is tilted slightly, as in SolarSystem.tsx. */
export const SOLAR_TILT = new Euler(0.18, 0, 0);

export const EARTH_ORBIT_RADIUS = 17;
/** Earth + Moon are authored at radius 5; this shrinks them to planet scale (radius 1). */
export const EARTH_SYSTEM_SCALE = 0.2;

const EARTH_ORBIT_SPEED = 0.25; // rad/s
const EARTH_ORBIT_PHASE = 4.0;
/** Orbit angle where Earth sits in front of the sun, facing the arriving camera. */
const FRONT_ANGLE = -1.2;
/** Scroll positions (in sections) over which Earth swings into its front spot. */
const PIN_START = 2.1;
const PIN_END = 2.9;

const SUN_POSITION = new Vector3(...OBJECT_POSITIONS.sun);

/** Angle of an ordinary planet; Earth uses `earthAngle` instead. */
export const planetAngle = (phase: number, speed: number, elapsed: number) =>
  phase + elapsed * speed * 0.25;

/** Whole turns added to FRONT_ANGLE so the pin target sits within half a turn of the free orbit. */
let pinTurns = 0;

/**
 * Earth orbits freely while the Solar System is on screen, then eases into
 * FRONT_ANGLE as the camera warps in, so the dive never crosses the sun.
 */
export function earthAngle(elapsed: number, scrollPosition: number) {
  const free = EARTH_ORBIT_PHASE + elapsed * EARTH_ORBIT_SPEED;
  const pinned = MathUtils.smoothstep(scrollPosition, PIN_START, PIN_END);
  // Re-pick the nearest turn only at rest (pinned 0 or 1). Mid-warp it stays fixed, so the
  // angle never jumps by a full turn when the shortest path would flip direction.
  if (pinned === 0 || pinned === 1) pinTurns = Math.round((free - FRONT_ANGLE) / (2 * Math.PI));
  return free + (FRONT_ANGLE + 2 * Math.PI * pinTurns - free) * pinned;
}

/** Writes Earth's world position and the unit vector from Earth toward the sun. */
export function getEarthFrame(
  elapsed: number,
  scrollPosition: number,
  outEarth: Vector3,
  outSunDirection: Vector3,
) {
  const angle = earthAngle(elapsed, scrollPosition);
  outEarth
    .set(Math.cos(angle) * EARTH_ORBIT_RADIUS, 0, -Math.sin(angle) * EARTH_ORBIT_RADIUS)
    .applyEuler(SOLAR_TILT)
    .add(SUN_POSITION);
  outSunDirection.copy(SUN_POSITION).sub(outEarth).normalize();
}
