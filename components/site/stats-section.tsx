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
  fill: number; // 0..1
  accent: string;
  ticks: number; // count of decorative tally marks behind the ring
};

const STATS: Stat[] = [
  {
    value: 5000,
    suffix: "+",
    format: "comma",
    label: "Volunteer",
    italic: "hours",
    caption: "logged across our chapters in 2026",
    fill: 0.78,
    accent: "var(--brand-rose)",
    ticks: 24,
  },
  {
    prefix: "$",
    value: 20000,
    format: "money",
    label: "Raised",
    italic: "for community",
    caption: "directed to underserved partners and programs",
    fill: 0.62,
    accent: "var(--brand-navy)",
    ticks: 24,
  },
  {
    value: 250,
    suffix: "+",
    format: "plain",
    label: "Students",
    italic: "empowered",
    caption: "leading projects in their cities, every semester",
    fill: 0.91,
    accent: "var(--brand-rose-soft)",
    ticks: 24,
  },
];

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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

      // Connector line that draws across all three stats as you scroll
      gsap.fromTo(
        ".impact-connector",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".impact-cells",
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );
      gsap.utils.toArray<HTMLElement>(".impact-connector-dot").forEach((dot, i) => {
        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: { trigger: dot, start: "top 80%" },
            delay: i * 0.08,
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".stat-cell").forEach((cell, i) => {
        const numEl = cell.querySelector<HTMLElement>(".stat-num");
        const ruleEl = cell.querySelector<HTMLElement>(".draw-rule");
        const ringFg = cell.querySelector<SVGCircleElement>(".ring-fg");
        const ringTrail = cell.querySelector<SVGCircleElement>(".ring-trail");
        const fill = Number(cell.dataset.fill || "0.7");
        const ticks = cell.querySelectorAll<SVGLineElement>(".tally-tick");
        const totalTicks = ticks.length;
        const litTicks = Math.round(totalTicks * fill);

        ScrollTrigger.create({
          trigger: cell,
          start: "top 82%",
          once: true,
          onEnter: () => {
            ruleEl?.classList.add("is-in");

            if (ringFg) {
              gsap.fromTo(
                ringFg,
                { strokeDashoffset: CIRCUMFERENCE },
                {
                  strokeDashoffset: CIRCUMFERENCE * (1 - fill),
                  duration: 2.4,
                  ease: "power3.out",
                  delay: 0.05 + i * 0.08,
                }
              );
            }
            if (ringTrail) {
              gsap.fromTo(
                ringTrail,
                { opacity: 0 },
                {
                  opacity: 0.35,
                  duration: 1.2,
                  ease: "power2.out",
                  delay: 0.4 + i * 0.08,
                }
              );
            }

            ticks.forEach((tick, t) => {
              if (t < litTicks) {
                gsap.fromTo(
                  tick,
                  { opacity: 0, scaleY: 0.4 },
                  {
                    opacity: 1,
                    scaleY: 1,
                    transformOrigin: "center",
                    duration: 0.5,
                    ease: "power2.out",
                    delay: 0.4 + i * 0.08 + t * 0.025,
                  }
                );
              }
            });

            if (numEl) {
              const target = Number(numEl.dataset.value);
              const fmt = (numEl.dataset.fmt || "plain") as Stat["format"];
              const obj = { v: 0 };
              gsap.to(obj, {
                v: target,
                duration: 2.4,
                ease: "power3.out",
                delay: 0.05 + i * 0.08,
                onUpdate: () => {
                  numEl.textContent = formatNumber(obj.v, fmt);
                },
              });
            }

            gsap.fromTo(
              cell.querySelector(".stat-meta"),
              { y: 14, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                delay: 0.6 + i * 0.08,
              }
            );

            gsap.fromTo(
              cell.querySelector(".stat-pulse"),
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(2)",
                delay: 1.4 + i * 0.08,
              }
            );
          },
        });
      });

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

      <div className="relative px-6 md:px-12 pt-32 md:pt-44 pb-20 md:pb-28">
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
              Every hour, every dollar, every student is a ripple. Together,
              they become the wave we&apos;re building.
            </p>
          </div>

          {/* Connector line: draws across the section as you scroll */}
          <div className="relative mt-20 hidden md:block h-2">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />
            <div
              className="impact-connector absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 origin-left"
              style={{ background: "var(--brand-rose)" }}
            />
          </div>

          <div className="impact-cells mt-16 grid gap-y-20 gap-x-10 md:grid-cols-3 md:divide-x md:divide-border">
            {STATS.map((s, i) => (
              <article
                key={i}
                className="stat-cell group relative md:px-10 first:md:pl-0 last:md:pr-0"
                data-fill={s.fill}
              >
                <div className="flex items-center justify-between">
                  <div className="editorial-eyebrow text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} · of 03
                  </div>
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: s.accent }}
                  />
                </div>

                {/* Square wrapper sized to the ring; number is centered inside */}
                <div className="relative mx-auto mt-8 aspect-square w-full max-w-[20rem]">
                  {/* Tally ticks behind the ring (vertical marks fanning around) */}
                  <svg
                    aria-hidden
                    viewBox="0 0 200 200"
                    className="absolute inset-0 h-full w-full overflow-visible"
                  >
                    {Array.from({ length: s.ticks }).map((_, t) => {
                      const angle = (t / s.ticks) * 360 - 90;
                      const rad = (angle * Math.PI) / 180;
                      const r1 = 96;
                      const r2 = 102;
                      const x1 = Number((100 + r1 * Math.cos(rad)).toFixed(4));
                      const y1 = Number((100 + r1 * Math.sin(rad)).toFixed(4));
                      const x2 = Number((100 + r2 * Math.cos(rad)).toFixed(4));
                      const y2 = Number((100 + r2 * Math.sin(rad)).toFixed(4));
                      return (
                        <line
                          key={t}
                          className="tally-tick"
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={s.accent}
                          strokeWidth="0.9"
                          opacity="0"
                        />
                      );
                    })}
                  </svg>

                  {/* Animated ring */}
                  <svg
                    aria-hidden
                    viewBox="0 0 200 200"
                    className="absolute inset-0 h-full w-full -rotate-90"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="1.2"
                    />
                    <circle
                      className="ring-trail"
                      cx="100"
                      cy="100"
                      r={RADIUS - 6}
                      fill="none"
                      stroke={s.accent}
                      strokeWidth="0.6"
                      strokeDasharray="0.8 2.4"
                      opacity="0"
                    />
                    <circle
                      className="ring-fg"
                      cx="100"
                      cy="100"
                      r={RADIUS}
                      fill="none"
                      stroke={s.accent}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={CIRCUMFERENCE}
                    />
                  </svg>

                  {/* Number sized to fit comfortably inside the ring */}
                  <div className="absolute inset-0 flex items-center justify-center px-6">
                    <div className="flex items-baseline justify-center font-display text-[clamp(2.25rem,6vw,4.25rem)] font-light leading-none tracking-tight">
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
                  </div>

                  {/* Pulse near the ring's top-right edge */}
                  <span
                    aria-hidden
                    className="stat-pulse pointer-events-none absolute right-[14%] top-[12%] inline-flex h-2 w-2"
                    style={{ opacity: 0 }}
                  >
                    <span
                      className="absolute inset-0 rounded-full animate-ping-soft"
                      style={{ background: s.accent }}
                    />
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ background: s.accent }}
                    />
                  </span>
                </div>

                <div className="mt-8 draw-rule" />

                <div className="stat-meta mt-7">
                  <div className="font-display text-2xl font-normal">
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
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {s.caption}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Pull-quote band */}
          <div className="impact-rise mt-28 md:mt-36 grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
            <div className="font-display text-7xl md:text-9xl font-light italic leading-none text-foreground/15 select-none">
              &ldquo;
            </div>
            <blockquote className="font-display text-2xl md:text-3xl font-light italic leading-snug max-w-3xl text-foreground/85">
              We don&apos;t measure success in hours alone. We measure it in the
              <span style={{ color: "var(--brand-rose)" }}> students</span>,
              <span style={{ color: "var(--brand-navy)" }}> partners</span>,
              and <span style={{ color: "var(--brand-rose-soft)" }}>neighbors</span>{" "}
              who keep showing up.
            </blockquote>
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
