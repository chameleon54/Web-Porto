"use client";

import { Component, type ReactNode } from "react";
import { useSpaceStore } from "@/store/useSpaceStore";

/**
 * Catches a failed WebGL context (old phones, blocked GPU) so the page keeps its
 * star background and UI instead of showing the framework error screen. The
 * splash waits on loading progress that the canvas never reports, so mark it done.
 */
export class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    useSpaceStore.getState().setLoading({ progress: 100, total: 1, active: false });
  }

  render() {
    return this.state.failed ? <div className="star-bg absolute inset-0" /> : this.props.children;
  }
}
