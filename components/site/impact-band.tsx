"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Frame = {
  src: string;
  alt: string;
  label: string;
  body: string;
  accent: string;
  /** vertical parallax speed (px) */
  parallax: number;
};

const FRAMES: Frame[] = [
  {
    src: "/general/assembly-overhead.jpg",
    alt: "Overhead shot of Hands of Hope volunteers assembling kits",
    label: "Assembly",
    body: "Kits sorted, labelled, and routed to partner sites, the unglamorous half of every fundraiser.",
    accent: "var(--brand-rose)",
    parallax: -36,
  },
  {
    src: "/general/assembly-line.jpg",
    alt: "Hands of Hope volunteers in an assembly line",
    label: "The line",
    body: "Students moving in rhythm. Most of the hours we count look exactly like this.",
    accent: "var(--brand-navy)",
    parallax: 28,
  },
  {
    src: "/general/ripple-tables-wide.jpg",
    alt: "Wide view of Ripple for Change tables and attendees",
    label: "The room",
    body: "Ripple for Change: partners and families in the same room, hearing what your gift built.",
    accent: "var(--brand-rose-soft)",
    parallax: -22,
  },
  {
    src: "/general/volunteer-portrait.jpg",
    alt: "Portrait of a Hands of Hope volunteer mid-project",
    label: "The people",
    body: "One of the 250+ students leading projects in their city, every semester.",
    accent: "var(--brand-navy-soft)",
    parallax: 34,
  },
];

export function ImpactBand() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".band-rise").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.06,
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".band-frame").forEach((cell, i) => {
        const img = cell.querySelector<HTMLImageElement>("img");
        const inner = cell.querySelector<HTMLElement>(".band-inner");
        const caption = cell.querySelector<HTMLElement>(".band-caption");
        const px = Number(cell.dataset.parallax || "0");

        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: 8, opacity: 0, scale: 0.94 },
            {
              yPercent: 0,
              opacity: 1,
              scale: 1,
              duration: 1.1,
              ease: "power3.out",
              delay: (i % 4) * 0.07,
              scrollTrigger: { trigger: cell, start: "top 88%" },
            }
          );
        }
        if (caption) {
          gsap.fromTo(
            caption,
            { y: 12, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.15 + (i % 4) * 0.07,
              scrollTrigger: { trigger: cell, start: "top 85%" },
            }
          );
        }

        if (img) {
          gsap.fromTo(
            img,
            { y: 0, scale: 1.1 },
            {
              y: px,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: cell,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1,
              },
            }
          );
        }
      });

      gsap.to(".band-marquee-track", {
        xPercent: -50,
        duration: 55,
        ease: "none",
        repeat: -1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden border-t border-border bg-card/40"
    >
      <div className="relative px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto w-full max-w-[88rem]">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
            <div>
              <div className="band-rise editorial-rule editorial-eyebrow text-muted-foreground">
                Service in motion
              </div>
              <h2 className="band-rise mt-8 editorial-display leading-[1.06] pb-2 text-[clamp(2.25rem,6vw,5rem)] max-w-3xl">
                What your gift{" "}
                <span className="italic" style={{ color: "var(--brand-rose)" }}>
                  steps into.
                </span>
              </h2>
            </div>
            <p className="band-rise max-w-md text-muted-foreground md:text-right md:self-end leading-relaxed">
              Four still frames from the week. No staged shots, no styling,
              just the part of the work that happens whether you&apos;re
              watching or not.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FRAMES.map((f, i) => (
              <article
                key={f.src}
                data-parallax={f.parallax}
                className="band-frame group relative aspect-[3/4] overflow-hidden"
              >
                <div className="band-inner relative h-full w-full overflow-hidden">
                  <Image
                    src={f.src}
                    alt={f.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover will-change-transform"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.10 0.012 60 / 0.05) 0%, oklch(0.10 0.012 60 / 0.65) 60%, oklch(0.08 0.012 60 / 0.85) 100%)",
                    }}
                  />

                  <span
                    aria-hidden
                    className="absolute right-4 top-4 inline-flex items-center gap-2 border border-white/40 bg-foreground/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-white backdrop-blur-sm"
                  >
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{ background: f.accent }}
                    />
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="band-caption absolute inset-x-0 bottom-0 p-5 md:p-6 on-image">
                    <div className="editorial-eyebrow text-white/85">
                      {f.label}
                    </div>
                    <p className="mt-2 text-sm md:text-base text-white/90 leading-snug">
                      {f.body}
                    </p>
                    <div
                      aria-hidden
                      className="mt-3 h-px w-10 transition-[width] duration-500 group-hover:w-20"
                      style={{ background: f.accent }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Closing marquee */}
      <div className="relative border-t border-border bg-background py-6 overflow-hidden marquee-mask">
        <div className="band-marquee-track flex w-max items-center gap-10 whitespace-nowrap font-display text-xl md:text-2xl italic font-light text-foreground/45">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            [
              "Every dollar",
              "becomes",
              "a kit",
              "a meal",
              "a session",
              "a starter",
              "a chapter",
              "a story",
            ].map((w) => (
              <span key={`${k}-${w}`} className="flex items-center gap-10">
                {w}
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--brand-rose)" }}
                />
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
