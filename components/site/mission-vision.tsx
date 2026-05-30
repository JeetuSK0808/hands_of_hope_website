"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    numeral: "I.",
    label: "Mission",
    accent: "var(--brand-rose)",
    lead: "Ignite compassion by connecting high school students with the real world, inspiring them to take",
    italicTail: "meaningful action.",
    meta: [
      { k: "Operating since", v: "2023" },
      { k: "Built around", v: "Local need" },
    ],
  },
  {
    numeral: "II.",
    label: "Vision",
    accent: "var(--brand-navy)",
    lead: "Bridge the gap between high school students and communities in need through",
    italicTail: "youth-led action that lasts.",
    meta: [
      { k: "Reach", v: "U.S. & abroad" },
      { k: "Driven by", v: "Students, locally" },
    ],
  },
];

export function MissionVision() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const pinRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current || !pinRef.current) return;
    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>(".mv-scene");

      // Set initial state of every scene: invisible, scaled small, blurred,
      // letters spaced wide. Scene 0 will be animated in by the timeline.
      gsap.set(scenes, {
        autoAlpha: 0,
        scale: 0.62,
        filter: "blur(14px)",
        letterSpacing: "0.22em",
      });
      gsap.set(".mv-scene .mv-copy-line", { yPercent: 110, opacity: 0 });
      gsap.set(".mv-scene .mv-meta-item", { y: 14, opacity: 0 });
      gsap.set(".mv-scene .mv-rule", { scaleX: 0, transformOrigin: "left" });
      gsap.set(".mv-scene .mv-numeral", { yPercent: 30, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        },
      });

      const enter = (sel: string) => {
        tl.to(
          sel,
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            letterSpacing: "-0.045em",
            duration: 1.1,
          },
          "<"
        )
          .to(
            `${sel} .mv-numeral`,
            { yPercent: 0, opacity: 1, duration: 0.7 },
            "<+0.1"
          )
          .to(
            `${sel} .mv-rule`,
            { scaleX: 1, duration: 0.9 },
            "<"
          )
          .to(
            `${sel} .mv-copy-line`,
            { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
            "<+0.1"
          )
          .to(
            `${sel} .mv-meta-item`,
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
            "<+0.2"
          );
      };

      const hold = (duration: number) => tl.to({}, { duration });

      const exit = (sel: string) => {
        tl.to(
          sel,
          {
            autoAlpha: 0,
            scale: 1.18,
            filter: "blur(12px)",
            letterSpacing: "0.04em",
            duration: 0.9,
            ease: "power2.in",
          },
          "<"
        );
      };

      // Scene 1 in, hold, out, Scene 2 in, hold (no out)
      enter(".mv-scene-1");
      hold(1.1);
      exit(".mv-scene-1");
      enter(".mv-scene-2");
      hold(1.4);

      // Persistent progress meter ticks across the whole pinned timeline
      gsap.to(".mv-progress-bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=260%",
          scrub: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="mission"
      ref={rootRef}
      className="relative w-full border-t border-border bg-background"
    >
      <div
        ref={pinRef}
        className="relative isolate flex h-svh w-full items-center justify-center overflow-hidden"
      >
        {/* Soft photographic backdrop. Sits behind everything, including the rosette.
            The picture is meant to read clearly while the foreground type stays primary. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/general/volunteer-focused.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-60"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, var(--background) 0%, oklch(0.965 0.006 80 / 0.42) 30%, oklch(0.965 0.006 80 / 0.42) 70%, var(--background) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 50% 50%, transparent 0%, oklch(0.965 0.006 80 / 0.55) 100%)",
            }}
          />
        </div>

        {/* Ambient rosette behind the type */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
        >
          <svg
            width="min(78vmin, 980px)"
            height="min(78vmin, 980px)"
            viewBox="0 0 100 100"
            className="rotate-very-slow"
          >
            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--brand-rose)" strokeWidth="0.22" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--brand-navy)" strokeWidth="0.18" strokeDasharray="0.8 1.4" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="var(--brand-rose)" strokeWidth="0.18" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="var(--brand-navy)" strokeWidth="0.18" />
            <line x1="50" y1="2" x2="50" y2="98" stroke="var(--brand-navy)" strokeWidth="0.14" />
            <line x1="2" y1="50" x2="98" y2="50" stroke="var(--brand-navy)" strokeWidth="0.14" />
          </svg>
        </div>

        {/* Eyebrow + progress meter, fixed inside the pinned viewport */}
        <div className="pointer-events-none absolute left-0 right-0 top-[max(5rem,11vh)] mx-auto w-full max-w-[88rem] px-6 md:px-12">
          <div className="flex items-center justify-between gap-6">
            <div className="editorial-rule editorial-eyebrow text-muted-foreground">
              What drives us
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="editorial-eyebrow tracking-[0.22em]">
                01 / 02
              </span>
              <span className="relative inline-block h-px w-24 overflow-hidden bg-border">
                <span
                  className="mv-progress-bar absolute inset-0 origin-left scale-x-0"
                  style={{ background: "var(--brand-rose)" }}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Stacked scenes: each absolutely positioned over the same canvas */}
        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12">
          {SCENES.map((s, i) => (
            <div
              key={s.label}
              className={`mv-scene mv-scene-${i + 1} absolute inset-0 flex flex-col items-center justify-center text-center`}
              style={{ willChange: "transform, filter, opacity, letter-spacing" }}
            >
              <div className="overflow-hidden">
                <div
                  className="mv-numeral font-display text-5xl md:text-6xl font-light italic"
                  style={{ color: s.accent }}
                >
                  {s.numeral}
                </div>
              </div>

              <h2
                aria-label={s.label}
                className="mt-6 select-none font-display font-light italic leading-[0.82] text-[clamp(5rem,19vw,18rem)]"
              >
                {s.label}
              </h2>

              <div
                className="mv-rule mt-8 h-px w-[min(28rem,60vw)]"
                style={{ background: s.accent }}
                aria-hidden
              />

              <div className="mt-8 max-w-3xl text-[clamp(1.05rem,1.6vw,1.4rem)] leading-[1.45] text-foreground/80">
                <span className="block overflow-hidden">
                  <span className="mv-copy-line block">{s.lead}</span>
                </span>
                <span className="mt-2 block overflow-hidden">
                  <span className="mv-copy-line block italic" style={{ color: s.accent }}>
                    {s.italicTail}
                  </span>
                </span>
              </div>

              <dl className="mt-12 flex items-start gap-12 md:gap-20 text-left text-sm">
                {s.meta.map((m) => (
                  <div key={m.k} className="mv-meta-item">
                    <dt className="editorial-eyebrow text-muted-foreground">
                      {m.k}
                    </dt>
                    <dd className="mt-2 text-foreground">{m.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        {/* Scroll cue, lives at the bottom of the pinned viewport */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-muted-foreground/70">
          Scroll
        </div>
      </div>
    </section>
  );
}
