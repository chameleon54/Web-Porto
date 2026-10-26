export type Vec3 = readonly [number, number, number];

/** Extra control point between a waypoint and the next, for flying through something. */
export interface ViaPoint {
  position: Vec3;
  lookAt: Vec3;
  /** Where along the scroll segment (0..1) the camera reaches this point. */
  at: number;
}

export interface Waypoint {
  name: string;
  /** World position, or an offset from the followed body (see `follow`). */
  position: Vec3;
  lookAt: Vec3;
  via?: ViaPoint;
  /**
   * "earth": position and lookAt are offsets from the orbiting Earth, in a frame
   * of [right, up, toward-sun] (units of the Earth planet, radius 1).
   */
  follow?: "earth";
}

/**
 * How far apart the scenes sit along Z. Raising this makes every warp
 * between sections cover more distance in the same snap duration, so the
 * jump feels faster. Camera offsets below are relative to each scene, so
 * objects keep their on-screen size when this changes.
 */
export const DISTANCE_SCALE = 2;

/** Galaxy -> Solar System gap, shorter than the Gargantua -> Galaxy one. */
const GALAXY_TO_SOLAR = 120 * DISTANCE_SCALE;

const GALAXIES_Z = -200 * DISTANCE_SCALE;
const SOLAR_Z = GALAXIES_Z - GALAXY_TO_SOLAR;

const SCENE_Z = {
  gargantua: 0,
  galaxies: GALAXIES_Z,
  solar: SOLAR_Z,
} as const;

/** Single source of truth for the camera journey. Tune values here only. */
export const WAYPOINTS: readonly Waypoint[] = [
  { name: "Gargantua", position: [0, 2, SCENE_Z.gargantua + 30], lookAt: [0, 0, SCENE_Z.gargantua] },
  {
    name: "Galaxies",
    position: [0, 55, SCENE_Z.galaxies + 125],
    lookAt: [0, 0, SCENE_Z.galaxies],
    // The dive to the Solar System passes straight through the galaxy's core.
    via: { position: [0, 3, SCENE_Z.galaxies], lookAt: [0, 0, SCENE_Z.galaxies - 100], at: 0.4 },
  },
  { name: "Solar System", position: [0, 8, SCENE_Z.solar + 50], lookAt: [0, 0, SCENE_Z.solar] },
  // Earth lives inside the Solar System: the camera warps to the real, orbiting planet.
  { name: "Earth & Moon", position: [7, 1.6, 3.2], lookAt: [0, 0, 0], follow: "earth" },
  { name: "Earth Entry", position: [2.1, 0.4, 0.9], lookAt: [0, -0.3, 0], follow: "earth" },
];

export const OBJECT_POSITIONS = {
  gargantua: [0, 0, SCENE_Z.gargantua],
  /** Single galaxy model (public/models/galaxy.glb), centered on the galaxy scene. */
  galaxy: [0, 0, SCENE_Z.galaxies],
  milkyWay: [-35, 0, SCENE_Z.galaxies],
  andromeda: [40, 6, SCENE_Z.galaxies - 10],
  sun: [0, 0, SCENE_Z.solar],
} as const satisfies Record<string, Vec3>;
