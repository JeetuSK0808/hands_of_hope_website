"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** One sine line, drawn twice as wide as the viewport so it can drift seamlessly. */
function WavePath({ y, amp, width, opacity }: { y: number; amp: number; width: number; opacity: number }) {
  // Q-curve sine across a 0–2400 span (two viewport widths at viewBox 1200).
  const seg = 75;
  let d = `M 0 ${y}`;
  for (let x = 0; x < 2400; x += seg * 2) {
    d += ` Q ${x + seg / 2} ${y - amp} ${x + seg} ${y} T ${x + seg * 2} ${y}`;
  }
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      opacity={opacity}
      className="ae-divider-wave"
    />
  );
}

const BUBBLES = [
  { left: "16%", size: 5, delay: 0 },
  { left: "31%", size: 3, delay: 0.18 },
  { left: "52%", size: 6, delay: 0.08 },
  { left: "68%", size: 3, delay: 0.3 },
  { left: "83%", size: 4, delay: 0.14 },
];

/**
 * The water between the acts.
 *
 * A wordless bridge: three sine lines draw themselves across the page as the
 * reader scrolls through, then keep drifting sideways at different speeds,
 * the moment the two dates become the same body of water the sponsorship act
 * asks people to step into. Small air bubbles rise through on scrub.
 */
export function AnnualEventsDivider() {
  const rootRef = React.useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReduced) return;

    const ctx = gsap.context(() => {
      // Each line draws in with scrub…
      gsap.utils.toArray<SVGPathElement>(".ae-divider-wave").forEach((path, i) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 92%",
            end: "top 30%",
            scrub: 0.6 + i * 0.2,
          },
        });
      });

      // …then the whole sheets drift sideways forever, each at its own pace.
      gsap.utils.toArray<HTMLElement>(".ae-divider-sheet").forEach((sheet, i) => {
        gsap.to(sheet, {
          xPercent: -50,
          duration: 26 + i * 9,
          ease: "none",
          repeat: -1,
        });
      });

      // Air bubbles ride the scroll upward through the waves.
      gsap.utils.toArray<HTMLElement>(".ae-divider-bubble").forEach((b, i) => {
        gsap.fromTo(
          b,
          { y: 46, autoAlpha: 0 },
          {
            y: -46,
            autoAlpha: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: `top ${94 - i * 3}%`,
              end: "bottom 20%",
              scrub: 0.8,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={rootRef}
      aria-hidden
      className="relative w-full overflow-hidden border-t border-border bg-background"
    >
      <div className="relative mx-auto h-[38vh] min-h-[15rem] w-full max-w-[110rem]">
        {/* Three drifting wave sheets, staggered depths */}
        {[
          { top: "34%", color: "var(--brand-navy)", amp: 13, width: 1.1, opacity: 0.5, dur: 0 },
          { top: "52%", color: "var(--brand-rose)", amp: 17, width: 0.9, opacity: 0.4, dur: 1 },
          { top: "70%", color: "var(--brand-navy)", amp: 10, width: 0.7, opacity: 0.25, dur: 2 },
        ].map((w, i) => (
          <div
            key={i}
            className="ae-divider-sheet absolute left-0 w-[200%] will-change-transform"
            style={{ top: w.top, color: w.color, height: "80px", marginTop: "-40px" }}
          >
            <svg viewBox="0 0 2400 80" preserveAspectRatio="none" className="h-full w-full">
              <WavePath y={40} amp={w.amp} width={w.width} opacity={w.opacity} />
            </svg>
          </div>
        ))}

        {/* Rising air bubbles */}
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className="ae-divider-bubble absolute top-1/2 block rounded-full border opacity-0"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              borderColor: "var(--brand-navy)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
