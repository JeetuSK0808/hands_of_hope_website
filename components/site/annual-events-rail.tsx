"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const ACTS = [
  { id: "top", label: "The drop" },
  { id: "stage", label: "Two dates" },
  { id: "sponsor", label: "The reach" },
];

/**
 * Page-wide through-line for /annual-events.
 *
 * A single drop of water enters at the top of the page and rides a hairline
 * rail all the way to the footer, filling it behind itself. It is the one
 * element that persists across every act, which is what makes the page read as
 * a single scroll rather than three stacked sections.
 *
 * Desktop only, and only when the visitor has not asked for reduced motion:
 * on a phone the rail would crowd the copy and earn nothing.
 */
export function AnnualEventsRail() {
  const railRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [activeAct, setActiveAct] = React.useState(0);

  React.useEffect(() => {
    if (prefersReduced) return;
    const rail = railRef.current;
    if (!rail) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const fill = rail.querySelector<HTMLElement>(".rail-fill");
        const drop = rail.querySelector<HTMLElement>(".rail-drop");

        // Fade the whole rail in once the hero has started to move, so it is
        // not competing with the headline on first paint.
        gsap.fromTo(
          rail,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: document.body, start: "top -12%" },
          },
        );

        const scrubbed = gsap.timeline({
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        if (fill) scrubbed.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0);
        if (drop)
          scrubbed.fromTo(
            drop,
            { yPercent: 0 },
            { yPercent: 100 * 9, ease: "none" },
            0,
          );

        // Highlight whichever act the viewport is centred on.
        ACTS.forEach((act, i) => {
          const el =
            act.id === "top"
              ? document.body
              : document.getElementById(act.id);
          if (!el) return;
          ScrollTrigger.create({
            trigger: el,
            start: act.id === "top" ? "top top" : "top 55%",
            end: act.id === "top" ? "top 55%" : "bottom 45%",
            onToggle: (self) => {
              if (self.isActive) setActiveAct(i);
            },
          });
        });
      });
    }, railRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={railRef}
      aria-hidden
      className="pointer-events-none fixed right-7 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:right-10"
      style={{ opacity: 0 }}
    >
      <div className="flex items-center gap-5">
        {/* Act labels, rotated to run with the rail */}
        <div className="flex flex-col items-end gap-12">
          {ACTS.map((a, i) => (
            <span
              key={a.id}
              className="editorial-eyebrow whitespace-nowrap text-[0.55rem] tracking-[0.3em] transition-colors duration-500"
              style={{
                writingMode: "vertical-rl",
                color:
                  activeAct === i
                    ? "var(--foreground)"
                    : "color-mix(in oklch, var(--muted-foreground) 55%, transparent)",
              }}
            >
              {a.label}
            </span>
          ))}
        </div>

        {/* The rail itself */}
        <div className="relative h-[42vh] w-px bg-border">
          <span
            className="rail-fill absolute inset-x-0 top-0 block h-full origin-top"
            style={{ background: "var(--brand-rose)", opacity: 0.75 }}
          />
          {/* Drop rides the top edge of the fill. Its own height is 10% of the
              rail, so travelling 900% of itself lands it exactly at the end. */}
          <span className="rail-drop absolute -left-[5px] top-0 block h-[4.2vh] w-[11px]">
            <svg viewBox="0 0 16 24" className="h-full w-full">
              <path
                d="M 8 1 Q 2 14 8 22 Q 14 14 8 1 Z"
                fill="var(--brand-rose)"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
