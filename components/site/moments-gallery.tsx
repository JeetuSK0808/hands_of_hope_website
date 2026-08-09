"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Moment = {
  src: string;
  alt: string;
  eyebrow: string;
  caption: string;
  /** Tailwind grid placement classes (12-col grid, 6-row grid). */
  area: string;
  /** Parallax shift (px) on scroll. Controls vertical drift speed. */
  parallax: number;
  /** Initial entry direction. */
  from: "left" | "right" | "up" | "down";
  accent?: string;
};

const MOMENTS: Moment[] = [
  {
    src: "/general/ripple-for-change-hi.jpg",
    alt: "Hands of Hope students at the Ripple for Change event",
    eyebrow: "I. Ripple for Change",
    caption: "The night the room held everyone we'd worked for.",
    area: "md:col-span-7 md:row-span-3",
    parallax: -40,
    from: "left",
    accent: "var(--brand-rose)",
  },
  {
    src: "/general/canadian-chapter.jpg",
    alt: "Hands of Hope Canadian chapter event in motion",
    eyebrow: "II. Chapter Network",
    caption: "Canadian chapter, mid-project.",
    area: "md:col-span-5 md:row-span-2",
    parallax: 28,
    from: "right",
    accent: "var(--brand-navy)",
  },
  {
    src: "/general/stem-buddies.jpg",
    alt: "STEM Together session, hands-on activity in progress",
    eyebrow: "III. STEM Together",
    caption: "Where curiosity sets the pace.",
    area: "md:col-span-5 md:row-span-2",
    parallax: 36,
    from: "right",
    accent: "var(--brand-rose-soft)",
  },
  {
    src: "/general/general-photo.jpg",
    alt: "Hands of Hope volunteers gathered for a project",
    eyebrow: "IV. Service hours",
    caption: "Quiet weekday work, the kind that adds up.",
    area: "md:col-span-4 md:row-span-2",
    parallax: -28,
    from: "up",
    accent: "var(--brand-navy-soft)",
  },
  {
    src: "/general/ripple-for-change-2.jpg",
    alt: "Ripple for Change attendees taking in the program",
    eyebrow: "V. Audiences",
    caption: "Families, partners, and the room they built.",
    area: "md:col-span-4 md:row-span-2",
    parallax: 22,
    from: "down",
    accent: "var(--brand-rose)",
  },
  {
    src: "/general/bins-group.jpg",
    alt: "Group of Hands of Hope volunteers behind organized supply bins",
    eyebrow: "VI. Drives",
    caption: "Logistics, before they become deliveries.",
    area: "md:col-span-4 md:row-span-2",
    parallax: -34,
    from: "up",
    accent: "var(--brand-navy)",
  },
];

export function MomentsGallery() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // Headline rise + connector draw
      gsap.utils.toArray<HTMLElement>(".moments-rise").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 26, opacity: 0 },
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

      gsap.fromTo(
        ".moments-connector",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".moments-grid",
            start: "top 80%",
            end: "top 30%",
            scrub: 0.6,
          },
        }
      );

      // Each cell: parallax + animated reveal
      gsap.utils.toArray<HTMLElement>(".moment-cell").forEach((cell) => {
        const img = cell.querySelector<HTMLElement>(".moment-img");
        const inner = cell.querySelector<HTMLElement>(".moment-inner");
        const caption = cell.querySelector<HTMLElement>(".moment-caption");
        const px = Number(cell.dataset.parallax || "0");
        const from = cell.dataset.from || "up";

        // Initial cell entry
        const fromVars: gsap.TweenVars = { opacity: 0, scale: 0.92 };
        if (from === "left") fromVars.xPercent = -8;
        if (from === "right") fromVars.xPercent = 8;
        if (from === "up") fromVars.yPercent = 8;
        if (from === "down") fromVars.yPercent = -8;

        if (inner) {
          gsap.fromTo(inner, fromVars, {
            opacity: 1,
            scale: 1,
            xPercent: 0,
            yPercent: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: cell, start: "top 88%" },
          });
        }

        if (caption) {
          gsap.fromTo(
            caption,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              delay: 0.2,
              scrollTrigger: { trigger: cell, start: "top 85%" },
            }
          );
        }

        // Parallax & gentle ken-burns on the image while in view
        if (img) {
          gsap.fromTo(
            img,
            { y: 0, scale: 1.08 },
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

      // Slow rotating ornament
      gsap.to(".moments-ornament", {
        rotation: 360,
        duration: 120,
        ease: "none",
        repeat: -1,
      });

      // Closing marquee
      gsap.to(".moments-marquee-track", {
        xPercent: -50,
        duration: 60,
        ease: "none",
        repeat: -1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden border-t border-border"
    >
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 20%, oklch(0.45 0.13 350 / 0.05), transparent 70%), radial-gradient(60% 50% at 90% 80%, oklch(0.28 0.075 255 / 0.05), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="moments-ornament absolute -right-40 top-32 hidden md:block opacity-[0.05]"
        >
          <svg width="640" height="640" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--brand-navy)" strokeWidth="0.18" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="var(--brand-rose)" strokeWidth="0.18" strokeDasharray="0.6 1.4" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="var(--brand-navy)" strokeWidth="0.16" />
          </svg>
        </div>
      </div>

      <div className="relative px-6 md:px-12 py-28 md:py-40">
        <div className="mx-auto w-full max-w-[88rem]">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <div className="moments-rise editorial-rule editorial-eyebrow text-muted-foreground inline-flex items-center gap-3">
                <span>Moments · 2026</span>
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--brand-rose)" }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full animate-ping-soft"
                    style={{ background: "var(--brand-rose)" }}
                  />
                </span>
              </div>
              <h2 className="moments-rise mt-8 editorial-display leading-[1.04] pb-2 text-[clamp(2.5rem,7vw,6rem)] max-w-3xl">
                What 5,000 hours{" "}
                <span className="italic" style={{ color: "var(--brand-rose)" }}>
                  look like.
                </span>
              </h2>
            </div>
            <p className="moments-rise max-w-md text-muted-foreground md:text-right md:self-end leading-relaxed">
              A few photos from the past year. Students showed up, packed kits,
              taught, listened, and stayed late.
            </p>
          </div>

          {/* Subtle connector line above the grid */}
          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />
            <div
              className="moments-connector absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 origin-left"
              style={{ background: "var(--brand-rose)" }}
            />
            <div className="relative flex justify-between">
              {MOMENTS.map((_, i) => (
                <span
                  key={i}
                  className="block h-2 w-2 rounded-full border border-border"
                  style={{ background: "var(--background)" }}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          {/* Asymmetric bento gallery */}
          <div
            className="moments-grid mt-16 grid auto-rows-[18vh] grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[16vh] md:gap-5"
            style={{ minHeight: "60vh" }}
          >
            {MOMENTS.map((m, i) => (
              <article
                key={m.src}
                data-parallax={m.parallax}
                data-from={m.from}
                className={`moment-cell group relative overflow-hidden ${m.area}`}
              >
                <div className="moment-inner relative h-full w-full overflow-hidden">
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="moment-img object-cover will-change-transform"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.12 0.012 60 / 0.05) 0%, oklch(0.10 0.012 60 / 0.55) 100%)",
                    }}
                  />

                  {/* Numeral badge */}
                  <span
                    aria-hidden
                    className="absolute right-4 top-4 inline-flex items-center gap-2 border border-white/40 bg-foreground/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-white backdrop-blur-sm"
                  >
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{ background: m.accent || "var(--brand-rose)" }}
                    />
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Caption */}
                  <div className="moment-caption absolute inset-x-0 bottom-0 p-5 md:p-6 on-image">
                    <div className="editorial-eyebrow text-white/85">
                      {m.eyebrow}
                    </div>
                    <div className="mt-2 font-display text-base md:text-lg italic text-white">
                      {m.caption}
                    </div>
                    <div
                      aria-hidden
                      className="mt-3 h-px w-10 transition-[width] duration-500 group-hover:w-20"
                      style={{ background: m.accent || "var(--brand-rose)" }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Footnote */}
          <div className="mt-14 flex justify-end border-t border-border pt-8">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span aria-hidden className="h-px w-8" style={{ background: "var(--brand-rose)" }} />
              <span className="editorial-eyebrow">More on Instagram</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layered closing marquee */}
      <div className="relative border-t border-border bg-background py-7 overflow-hidden marquee-mask">
        <div className="moments-marquee-track flex w-max items-center gap-12 whitespace-nowrap font-display text-2xl md:text-3xl italic font-light text-foreground/45">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            [
              "Receipts",
              "Hours logged",
              "Kits packed",
              "Rooms built",
              "Stories shared",
              "And counting",
            ].map((w) => (
              <span key={`${k}-${w}`} className="flex items-center gap-12">
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
