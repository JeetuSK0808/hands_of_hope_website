"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PARTNERS = [
  { name: "Atlanta Mission", short: "AM" },
  { name: "Open Hand", short: "OH" },
  { name: "Hooch Foundation", short: "HF" },
  { name: "Alpha Foundation", short: "AF" },
  { name: "Camp Foundation", short: "CF" },
  { name: "MDE School", short: "MDE" },
  { name: "Aiwyn", short: "AI" },
  { name: "Chatpatti", short: "CP" },
  { name: "FACFB", short: "FB" },
  { name: "Jukebox Print", short: "JP" },
  { name: "MHS", short: "MHS" },
  { name: "IAF", short: "IAF" },
  { name: "COLC", short: "CO" },
  { name: "GG", short: "GG" },
  { name: "ABC", short: "ABC" },
];

const INNER_RING = PARTNERS.slice(0, 8);
const OUTER_RING = PARTNERS.slice(8);

function Chip({ name, short }: { name: string; short: string }) {
  return (
    <div className="group flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-md shadow-sm transition-all hover:scale-110 hover:border-foreground/40">
      <div className="text-center leading-tight">
        <div className="font-display text-lg md:text-xl font-medium tracking-tight">
          {short}
        </div>
        <div className="mt-0.5 text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {name.length > 12 ? name.split(" ")[0] : name}
        </div>
      </div>
    </div>
  );
}

export function PartnersWheel() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="partners"
      className="relative w-full overflow-hidden px-6 md:px-10 py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Our circle
            </div>
            <h2 className="mt-4 text-stroke-hero text-[clamp(2.5rem,6vw,5rem)]">
              Better,{" "}
              <span
                className="italic"
                style={{
                  background:
                    "linear-gradient(180deg, oklch(0.72 0.13 195), oklch(0.45 0.12 200))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                together.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              We collaborate with mission-aligned organizations across Atlanta:
              shelters, schools, food banks, foundations, so every student
              project lands where it counts.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {PARTNERS.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <span className="h-1 w-1 rounded-full bg-[oklch(0.78_0.16_5)]" />
                  {p.name}
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={rootRef}
            className="relative aspect-square w-full max-w-[34rem] mx-auto"
          >
            {/* Center disc */}
            <div className="absolute inset-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full bg-foreground text-background shadow-[0_30px_60px_-15px_oklch(0.18_0.01_270_/_0.4)]">
              <div className="text-center">
                <div className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] opacity-70">
                  Hands of
                </div>
                <div className="font-display text-2xl md:text-3xl font-medium">
                  Hope
                </div>
              </div>
            </div>

            {/* Soft halo */}
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 md:h-96 md:w-96 rounded-full bg-[radial-gradient(circle,oklch(0.78_0.16_5_/_0.18),transparent_70%)] blur-3xl" />

            {/* Inner ring (clockwise) */}
            <div className="absolute inset-[14%] animate-spin-slow">
              {INNER_RING.map((p, i) => {
                const angle = (i / INNER_RING.length) * Math.PI * 2;
                const x = 50 + 50 * Math.cos(angle);
                const y = 50 + 50 * Math.sin(angle);
                return (
                  <div
                    key={p.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2 animate-spin-slower"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <Chip {...p} />
                  </div>
                );
              })}
            </div>

            {/* Outer ring (counter-clockwise) */}
            <div className="absolute inset-0 animate-spin-slower">
              {OUTER_RING.map((p, i) => {
                const angle = (i / OUTER_RING.length) * Math.PI * 2 + Math.PI / OUTER_RING.length;
                const x = 50 + 50 * Math.cos(angle);
                const y = 50 + 50 * Math.sin(angle);
                return (
                  <div
                    key={p.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2 animate-spin-slow"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <Chip {...p} />
                  </div>
                );
              })}
            </div>

            {/* Concentric guides */}
            <div className="pointer-events-none absolute inset-[14%] rounded-full border border-dashed border-border/50" />
            <div className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-border/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
