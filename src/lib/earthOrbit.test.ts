import { describe, expect, it } from "vitest";
import { earthAngle } from "./earthOrbit";

const TAU = 2 * Math.PI;
/** Smallest signed difference between two angles: whole turns do not move Earth. */
const gap = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

describe("earthAngle", () => {
  it("never jumps while the scroll sweeps through the pin range", () => {
    // A warp takes ~1.2 s, during which the free orbit keeps moving. Start times are
    // dense enough that the shortest-path direction flips mid-sweep for some of them.
    for (let start = 0; start < 60; start += 0.05) {
      earthAngle(start, 2); // at rest before the warp
      let previous = earthAngle(start, 2.1);
      for (let step = 1; step <= 80; step++) {
        const angle = earthAngle(start + (step / 80) * 1.2, 2.1 + step * 0.01);
        expect(Math.abs(gap(angle, previous))).toBeLessThan(0.5);
        previous = angle;
      }
    }
  });

  it("lands on the front angle once pinned", () => {
    const angle = earthAngle(12.3, 3);
    expect((((angle - -1.2) % TAU) + TAU) % TAU).toBeCloseTo(0, 6);
  });
});
