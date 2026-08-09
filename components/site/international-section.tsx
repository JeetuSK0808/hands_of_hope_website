"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const REGIONS = [
  { code: "US", label: "United States", note: "Founded in Atlanta · branches across multiple states" },
  { code: "INTL", label: "Canada · Chile · Denmark", note: "Branches running their own causes abroad" },
  { code: "501c3", label: "501(c)(3)", note: "Fiscally sponsored · tax-deductible" },
];

export function InternationalSection() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const wordRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const word = wordRef.current;
      if (!word) return;

      if (prefersReduced) {
        gsap.set([word, ".intl-row", ".intl-eyebrow", ".intl-caption"], {
          opacity: 1,
          scale: 1,
          y: 0,
        });
        return;
      }

      // Transform + opacity only — scrubbing `letter-spacing` and a blur on a
      // 16rem word relayouts and repaints the section on every frame.
      gsap.fromTo(
        word,
        { scale: 0.74, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
            end: "top 18%",
            scrub: 0.8,
          },
        }
      );

      gsap.to(word, {
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 18%",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.utils.toArray<HTMLElement>(".intl-row").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.fromTo(
        ".intl-eyebrow",
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".intl-caption",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 60%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={rootRef}
      className="relative isolate w-full overflow-hidden border-t border-border bg-background"
    >
      {/* Slow rotating globe behind the word */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.09]"
      >
        <svg
          width="min(72vmin, 880px)"
          height="min(72vmin, 880px)"
          viewBox="0 0 100 100"
          className="rotate-very-slow"
        >
          <circle cx="50" cy="50" r="48" fill="none" stroke="var(--brand-navy)" strokeWidth="0.25" />
          <ellipse cx="50" cy="50" rx="48" ry="20" fill="none" stroke="var(--brand-rose)" strokeWidth="0.18" />
          <ellipse cx="50" cy="50" rx="48" ry="36" fill="none" stroke="var(--brand-navy)" strokeWidth="0.18" />
          <ellipse cx="50" cy="50" rx="20" ry="48" fill="none" stroke="var(--brand-rose)" strokeWidth="0.18" />
          <ellipse cx="50" cy="50" rx="36" ry="48" fill="none" stroke="var(--brand-navy)" strokeWidth="0.18" />
          <line x1="50" y1="2" x2="50" y2="98" stroke="var(--brand-navy)" strokeWidth="0.15" />
          <line x1="2" y1="50" x2="98" y2="50" stroke="var(--brand-navy)" strokeWidth="0.15" />
        </svg>
      </div>

      <div className="relative mx-auto w-full max-w-[88rem] px-6 md:px-12 pt-32 md:pt-44 pb-32 md:pb-44">
        <div className="intl-eyebrow editorial-rule editorial-eyebrow text-muted-foreground">
          Where we stand
        </div>

        <div
          ref={wordRef}
          aria-label="International"
          className="relative mt-14 select-none font-display font-light italic leading-[0.85] text-[clamp(4.5rem,18vw,16rem)] text-foreground"
          style={{ willChange: "transform, opacity" }}
        >
          International
          <span
            aria-hidden
            className="ml-3 inline-block align-top text-[0.2em] not-italic translate-y-[0.6em]"
            style={{ color: "var(--brand-rose)" }}
          >
            ●
          </span>
        </div>

        <div className="intl-caption mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <p className="max-w-2xl text-base md:text-lg text-foreground/80 leading-relaxed">
            Hands of Hope started in Atlanta. Students now run branches across
            multiple U.S. states and in Canada, Chile, and Denmark — each one
            picking its own cause and its own community partners. Wherever a
            student wants to build something for the people around them, there
            should be a branch.
          </p>
          <div className="text-sm text-muted-foreground md:text-right">
            <div className="editorial-eyebrow text-muted-foreground">
              Status
            </div>
            <div className="mt-2 font-display text-xl italic text-foreground">
              Registered 501(c)(3)
            </div>
            <div className="mt-1">
              Fiscally sponsored by Hack Club. Donations are tax-deductible.
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3 border-t border-border pt-10">
          {REGIONS.map((r) => (
            <div key={r.code} className="intl-row flex items-baseline gap-5">
              <div
                className="font-display text-3xl font-light italic"
                style={{ color: "var(--brand-navy)" }}
              >
                {r.code}
              </div>
              <div>
                <div className="font-medium text-foreground">{r.label}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {r.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
