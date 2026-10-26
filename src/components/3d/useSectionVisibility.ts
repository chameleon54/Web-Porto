import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { useSpaceStore, SECTION_COUNT } from "@/store/useSpaceStore";

/**
 * Hides a group when the camera is more than `reach` sections away from
 * `index`, keeping off-screen draw calls out of the render loop.
 *
 * With `arrival: true` the group also grows from nothing as the camera closes
 * in, so a scene only appears once the warp is bringing the camera there.
 */
export function useSectionVisibility(index: number, reach = 1.6, arrival = false) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    const group = ref.current;
    if (!group) return;
    const position = useSpaceStore.getState().progress * (SECTION_COUNT - 1);
    const distance = Math.abs(position - index);
    group.visible = distance <= reach;

    if (arrival) {
      // 0 at the edge of `reach`, full size once within 40% of it.
      const t = MathUtils.clamp((reach - distance) / (reach * 0.6), 0, 1);
      group.scale.setScalar(Math.max(0.001, MathUtils.smoothstep(t, 0, 1)));
    }
  });

  return ref;
}

/**
 * Visible from scroll position `start` through `end` (in sections), growing in
 * over `ramp` sections after `start`. For scenes that stay on screen for
 * several sections, like the Solar System that Earth lives in.
 */
export function useSectionSpan(start: number, end: number, ramp: number) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    const group = ref.current;
    if (!group) return;
    const position = useSpaceStore.getState().progress * (SECTION_COUNT - 1);
    group.visible = position >= start && position <= end;
    group.scale.setScalar(Math.max(0.001, MathUtils.smoothstep(position, start, start + ramp)));
  });

  return ref;
}
