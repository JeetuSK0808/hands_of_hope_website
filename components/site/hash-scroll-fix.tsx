"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Re-scrolls to the URL hash after GSAP pins have inflated the page.
 *
 * The browser performs its native anchor jump at hydration, and only then do
 * the pinned sections (mission/vision on the home page) insert their
 * pin-spacers — growing the document by several viewport heights above the
 * target and leaving the reader stranded mid-pin. One corrective scroll after
 * the triggers have laid out puts them where the link promised.
 *
 * Hash-only changes on the same route keep the browser's native jump: the
 * pin-spacers already exist by then, so the native math is right, and
 * usePathname doesn't change — this effect stays out of the way.
 */
export function HashScrollFix() {
  const pathname = usePathname();

  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const timer = window.setTimeout(() => {
      const el = document.getElementById(hash);
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
