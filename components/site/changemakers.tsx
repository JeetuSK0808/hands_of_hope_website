"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const SLOTS = Array.from({ length: 8 });

export function Changemakers() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cm-eyebrow, .cm-headline, .cm-body",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
        }
      );

      gsap.utils.toArray<HTMLElement>(".cm-slot").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 22, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            delay: (i % 4) * 0.06 + Math.floor(i / 4) * 0.12,
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      // Counterpunctal marquee tracks: large headline drifts left, smaller
      // eyebrow row drifts right, ornament band drifts left slowly.
      gsap.to(".cm-marquee-headline", {
        xPercent: -50,
        duration: 60,
        ease: "none",
        repeat: -1,
      });
      gsap.fromTo(
        ".cm-marquee-eyebrow",
        { xPercent: -50 },
        {
          xPercent: 0,
          duration: 42,
          ease: "none",
          repeat: -1,
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden border-b border-border"
    >
      <div className="relative mx-auto w-full max-w-[88rem] px-6 md:px-12 py-24 md:py-32">
        <div className="cm-eyebrow editorial-rule editorial-eyebrow text-muted-foreground">
          Changemakers
        </div>
        <h2 className="cm-headline mt-10 editorial-display text-[clamp(2.5rem,6.5vw,5.5rem)] max-w-3xl">
          The hard workers who make any of this{" "}
          <span className="italic" style={{ color: "var(--brand-rose)" }}>
            real.
          </span>
        </h2>
        <p className="cm-body mt-8 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          Founders set direction. Executives run the work. But Hands of Hope is
          really built by the volunteers, chapter leads, and quiet engines who
          keep showing up. This is where we&apos;ll feature them.
        </p>

        <div className="mt-16 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
          {SLOTS.map((_, i) => (
            <article key={i} className="cm-slot group">
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <div
                  aria-hidden
                  className="absolute inset-2 border border-border/60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-5xl font-light italic text-foreground/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div
                  aria-hidden
                  className="absolute bottom-2 left-2 h-px w-6"
                  style={{
                    background:
                      i % 2 === 0 ? "var(--brand-rose)" : "var(--brand-navy)",
                  }}
                />
              </div>
              <div className="mt-3 editorial-eyebrow text-muted-foreground/80">
                Featured soon
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 max-w-xl text-sm text-muted-foreground">
          Are you, or do you know, a Hands of Hope volunteer who deserves to be
          here? Email{" "}
          <a
            href="mailto:info@handsofhopeoutreach.com"
            className="text-foreground underline-offset-4 hover:underline"
          >
            info@handsofhopeoutreach.com
          </a>
          .
        </div>
      </div>

      {/* Layered editorial marquee, section closer */}
      <div className="relative border-t border-border bg-background overflow-hidden">
        {/* Hairline frame top */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--brand-rose) 30%, var(--brand-navy) 70%, transparent)",
            opacity: 0.45,
          }}
        />

        {/* Headline row: massive italic, alternating filled & outlined */}
        <div className="marquee-mask relative py-10 md:py-14">
          <div className="cm-marquee-headline flex w-max items-center whitespace-nowrap leading-[0.9]">
            {Array.from({ length: 2 }).flatMap((_, k) => {
              const words = [
                "Volunteers",
                "Mentors",
                "Organizers",
                "Chapter leads",
                "Allies",
                "Friends",
                "Quiet engines",
                "Showed up",
              ];
              return words.map((w, i) => {
                const outlined = i % 2 === 1;
                const accentRose = i % 4 === 0;
                return (
                  <span
                    key={`hl-${k}-${w}`}
                    className="flex items-center"
                  >
                    <span
                      className={`font-display italic font-light text-[clamp(3.5rem,9vw,8rem)] ${
                        outlined ? "text-outline" : ""
                      }`}
                      style={
                        !outlined && accentRose
                          ? { color: "var(--brand-rose)" }
                          : undefined
                      }
                    >
                      {w}
                    </span>
                    <span
                      aria-hidden
                      className="mx-10 md:mx-14 inline-flex items-center"
                    >
                      <svg width="22" height="22" viewBox="0 0 22 22" className="opacity-80">
                        <g
                          stroke={
                            i % 2 === 0
                              ? "var(--brand-rose)"
                              : "var(--brand-navy)"
                          }
                          strokeWidth="1"
                          fill="none"
                        >
                          <line x1="11" y1="3" x2="11" y2="19" />
                          <line x1="3" y1="11" x2="19" y2="11" />
                          <line x1="5.3" y1="5.3" x2="16.7" y2="16.7" />
                          <line x1="16.7" y1="5.3" x2="5.3" y2="16.7" />
                        </g>
                      </svg>
                    </span>
                  </span>
                );
              });
            })}
          </div>
        </div>

        {/* Eyebrow counter-row, opposite direction, contrasting style */}
        <div className="marquee-mask relative border-t border-border/70 bg-foreground/[0.02]">
          <div className="cm-marquee-eyebrow flex w-max items-center whitespace-nowrap py-5">
            {Array.from({ length: 2 }).flatMap((_, k) => {
              const phrases = [
                "Who showed up",
                "Who led",
                "Who stayed late",
                "Who built it",
                "Who believed first",
                "Who pushed",
                "Who answered",
                "Who carried it",
              ];
              return phrases.map((p, i) => (
                <span
                  key={`eb-${k}-${p}`}
                  className="flex items-center text-muted-foreground"
                >
                  <span className="editorial-eyebrow">{p}</span>
                  <span
                    aria-hidden
                    className="mx-6 inline-block h-1 w-1 rounded-full"
                    style={{
                      background:
                        i % 2 === 0
                          ? "var(--brand-rose)"
                          : "var(--brand-navy)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="mr-6 inline-block h-px w-10 bg-border"
                  />
                </span>
              ));
            })}
          </div>
        </div>

        {/* Hairline frame bottom */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-border"
        />
      </div>
    </section>
  );
}
