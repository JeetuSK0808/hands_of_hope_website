"use client";

import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** The server has no media queries; assume motion is fine and let the client
 *  snapshot correct it on hydration. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Tracks the OS "reduce motion" setting.
 *
 * `useSyncExternalStore` rather than state-in-an-effect: the media query is an
 * external store, and this way the correct value is available on the first
 * client render instead of after a second pass.
 */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
