"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Stat = {
  prefix?: string;
  value: number;
  suffix?: string;
  format: "comma" | "money" | "plain";
  label: string;
  italic?: string;
  caption: string;
  accent: string;
};

const STATS: Stat[] = [
  {
    value: 5000,
    suffix: "+",
    format: "comma",
    label: "Volunteer",
    italic: "hours",
    caption: "Hours our students gave this year.",
    accent: "var(--brand-rose)",
  },
  {
    prefix: "$",
    value: 20000,
    format: "money",
    label: "Raised",
    italic: "for community",
    caption: "Dollars routed to partners and programs.",
    accent: "var(--brand-navy)",
  },
  {
    value: 250,
    suffix: "+",
    format: "plain",
    label: "Students",
    italic: "empowered",
    caption: "Leading projects in their cities, every semester.",
    accent: "var(--brand-rose-soft)",
  },
];

function formatNumber(n: number, fmt: Stat["format"]) {
  if (fmt === "comma" || fmt === "money") return Math.round(n).toLocaleString("en-US");
  return Math.round(n).toString();
}

export function StatsSection() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // Headline: word-by-word fade + rise, with the eyebrow rule drawing in
      gsap.utils.toArray<HTMLElement>(".impact-rise").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            delay: i * 0.06,
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".impact-headline-word").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.1 + i * 0.08,
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      // Stat cells: activate ripples + drop, rise the number, count up, reveal label
      gsap.utils.toArray<HTMLElement>(".stat-cell").forEach((cell, i) => {
        const numEl = cell.querySelector<HTMLElement>(".stat-num");
        const numWrap = cell.querySelector<HTMLElement>(".stat-num-wrap");
        const label = cell.querySelector<HTMLElement>(".stat-meta");
        const rule = cell.querySelector<HTMLElement>(".stat-rule");
        const ripples = cell.querySelector<HTMLElement>(".ripple-stack");

        ScrollTrigger.create({
          trigger: cell,
          start: "top 82%",
          once: true,
          onEnter: () => {
            if (ripples) ripples.classList.add("is-active");

            if (numWrap) {
              gsap.fromTo(
                numWrap,
                { y: 40, opacity: 0, scale: 0.94, filter: "blur(8px)" },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 1.4,
                  ease: "power3.out",
                  delay: i * 0.14,
                }
              );
            }

            if (numEl) {
              const target = Number(numEl.dataset.value);
              const fmt = (numEl.dataset.fmt || "plain") as Stat["format"];
              const obj = { v: 0 };
              gsap.to(obj, {
                v: target,
                duration: 2.8,
                ease: "power3.out",
                delay: 0.25 + i * 0.14,
                onUpdate: () => {
                  numEl.textContent = formatNumber(obj.v, fmt);
                },
              });
            }

            if (rule) {
              gsap.fromTo(
                rule,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  duration: 1.1,
                  ease: "power3.out",
                  delay: 0.55 + i * 0.14,
                  transformOrigin: "center center",
                }
              );
            }

            if (label) {
              gsap.fromTo(
                label,
                { y: 22, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 1,
                  ease: "power3.out",
                  delay: 0.75 + i * 0.14,
                }
              );
            }
          },
        });
      });

      // Connecting sine wave draws across as you scroll
      gsap.fromTo(
        ".impact-wave-path",
        { strokeDashoffset: 2400 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".impact-cells",
            start: "top 80%",
            end: "bottom 50%",
            scrub: 0.8,
          },
        }
      );

      // Slow gentle parallax on the photographic backdrop
      gsap.to(".impact-bg-photo", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Marquee
      gsap.to(".stats-marquee-track", {
        xPercent: -50,
        duration: 50,
        ease: "none",
        repeat: -1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="impact"
      ref={rootRef}
      className="relative w-full overflow-hidden border-t border-border"
    >
      {/* Photographic backdrop with heavy tint, parallaxed gently */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="impact-bg-photo absolute inset-0 will-change-transform">
          <Image
            src="/general/assembly-team.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.16]"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--background) 0%, oklch(0.965 0.006 80 / 0.85) 30%, oklch(0.965 0.006 80 / 0.85) 70%, var(--background) 100%)",
          }}
        />
      </div>

      <div className="relative px-6 md:px-12 pt-32 md:pt-44 pb-24 md:pb-32">
        {/* Editorial ornament */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-24 hidden md:block opacity-[0.07] rotate-very-slow"
        >
          <svg width="320" height="320" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--brand-navy)" strokeWidth="0.3" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="var(--brand-rose)" strokeWidth="0.3" strokeDasharray="0.5 1.5" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="var(--brand-navy)" strokeWidth="0.25" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-[88rem]">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
            <div>
              <div className="impact-rise editorial-rule editorial-eyebrow text-muted-foreground inline-flex items-center gap-3">
                <span>Impact · 2026</span>
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
                <span className="text-muted-foreground/70 normal-case tracking-normal text-[0.65rem] italic font-display">
                  · still counting
                </span>
              </div>
              <h2 className="mt-8 editorial-display text-[clamp(2.5rem,7vw,6rem)] max-w-4xl">
                <span className="impact-headline-mask">
                  <span className="impact-headline-word inline-block">Numbers</span>
                </span>{" "}
                <span className="impact-headline-mask">
                  <span className="impact-headline-word inline-block">that</span>
                </span>{" "}
                <span className="impact-headline-mask">
                  <span className="impact-headline-word inline-block">moved</span>
                </span>{" "}
                <span className="impact-headline-mask">
                  <span
                    className="impact-headline-word inline-block italic"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    people.
                  </span>
                </span>
              </h2>
            </div>
            <p className="impact-rise max-w-md text-muted-foreground md:text-right md:self-end leading-relaxed">
              Hours, dollars, students. The work, by the numbers.
            </p>
          </div>

          {/* Stat cells with continuous ripple emanation behind each number */}
          <div className="impact-cells relative mt-24 md:mt-32">
            <div className="grid gap-y-28 gap-x-8 md:grid-cols-3">
              {STATS.map((s, i) => (
                <article
                  key={i}
                  className="stat-cell relative flex flex-col items-center text-center"
                >
                  {/* Ripple stack: 4 concentric rings emitting from a center drop */}
                  <div
                    aria-hidden
                    className="ripple-stack pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(30rem,90vw)] -translate-x-1/2 -translate-y-[60%]"
                  >
                    {[0, 1, 2, 3].map((r) => (
                      <span
                        key={r}
                        className="ripple-ring absolute inset-0 rounded-full"
                        style={{
                          borderColor: s.accent,
                          animationDelay: `${r * 1.4}s`,
                        }}
                      />
                    ))}
                    {/* Center "drop" */}
                    <span
                      className="ripple-drop absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                      style={{
                        background: s.accent,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>

                  {/* Index marker */}
                  <div className="relative z-10 mb-6 flex items-center gap-3">
                    <span
                      aria-hidden
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{ background: s.accent }}
                    />
                    <span className="editorial-eyebrow text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} · of 03
                    </span>
                  </div>

                  {/* Massive number — the hero */}
                  <div className="stat-num-wrap relative z-10 flex items-baseline justify-center font-display font-light leading-none tracking-tight text-[clamp(4.5rem,12vw,9rem)]">
                    {s.prefix && <span>{s.prefix}</span>}
                    <span
                      className="stat-num"
                      data-value={s.value}
                      data-fmt={s.format}
                    >
                      0
                    </span>
                    {s.suffix && <span>{s.suffix}</span>}
                  </div>

                  {/* Hairline accent */}
                  <span
                    aria-hidden
                    className="stat-rule mt-8 block h-px w-16 origin-center"
                    style={{ background: s.accent }}
                  />

                  {/* Label + caption */}
                  <div className="stat-meta relative z-10 mt-8">
                    <div className="font-display text-2xl md:text-3xl font-normal">
                      {s.label}{" "}
                      {s.italic && (
                        <span
                          className="italic"
                          style={{ color: s.accent }}
                        >
                          {s.italic}
                        </span>
                      )}
                    </div>
                    <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
                      {s.caption}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Sine wave connecting all three stats — draws on scroll */}
            <svg
              aria-hidden
              viewBox="0 0 1200 80"
              preserveAspectRatio="none"
              className="pointer-events-none mt-20 hidden md:block h-16 w-full"
            >
              <path
                d="M 0 40 Q 100 0, 200 40 T 400 40 T 600 40 T 800 40 T 1000 40 T 1200 40"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1"
              />
              <path
                className="impact-wave-path"
                d="M 0 40 Q 100 0, 200 40 T 400 40 T 600 40 T 800 40 T 1000 40 T 1200 40"
                fill="none"
                stroke="var(--brand-rose)"
                strokeWidth="1.2"
                strokeDasharray="2400"
                strokeDashoffset="2400"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Marquee strip closing the section */}
      <div className="relative border-t border-border bg-background py-7 overflow-hidden marquee-mask">
        <div className="stats-marquee-track flex w-max items-center gap-10 whitespace-nowrap font-display text-2xl md:text-3xl italic font-light text-foreground/45">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            [
              "Five thousand hours",
              "Twenty thousand raised",
              "Two hundred fifty students",
              "And counting",
              "Hands of Hope",
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
