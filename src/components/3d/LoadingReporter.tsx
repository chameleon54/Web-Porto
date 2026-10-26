"use client";

import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { useSpaceStore } from "@/store/useSpaceStore";

/**
 * Publishes the three.js loading progress (galaxy model, Earth textures) to the
 * store so the splash can show a real percentage. Lives in the 3D chunk because
 * importing drei from the splash would pull all of drei into the main bundle.
 */
export function LoadingReporter() {
  const { progress, total, active } = useProgress();
  const setLoading = useSpaceStore((s) => s.setLoading);

  useEffect(() => {
    setLoading({ progress, total, active });
  }, [progress, total, active, setLoading]);

  return null;
}
