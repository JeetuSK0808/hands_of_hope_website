"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * The organization's operating model, straight from the internal reference doc.
 *
 * Voice rule that governs every string in this file: students, leadership
 * included, are the subject of the verb. Never "Hands of Hope empowers
 * students to…". See hands-of-hope-how-we-work-2.md.
 */

const GOALS = [
  {
    n: "01",
    label: "Global impact",
    accent: "var(--brand-navy)",
    body: "Communities around the world get real, sustained support, not a single visit and a photo.",
  },
  {
    n: "02",
    label: "Student growth",
    accent: "var(--brand-rose)",
    body: "High schoolers turn compassion into leadership experience and hands-on action they actually own.",
  },
];

/** Relative plumb depths for the branch-system gauge, 0 to 1. */
const PROBES = [
  {
    label: "A typical single-cause nonprofit",
    sub: "One cause, and that is the whole organization",
    depth: 0.3,
    color: "var(--muted-foreground)",
    strands: 1,
  },
  {
    label: "One Hands of Hope branch",
    sub: "The same cause, taken all the way down",
    depth: 1,
    color: "var(--brand-rose)",
    strands: 1,
  },
  {
    label: "The network",
    sub: "Every branch, every cause, at that depth",
    depth: 1,
    color: "var(--brand-navy)",
    strands: 7,
  },
];

export function HowWeWork() {
  const rootRef = React.useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([".hww-rise", ".hww-goal"], { clearProps: "all", opacity: 1, y: 0 });
        gsap.set(".hww-stream", { strokeDashoffset: 0 });
        gsap.set(".hww-junction, .hww-junction-ring", { autoAlpha: 1, scale: 1 });
        gsap.set(".hww-plumb", { scaleY: 1 });
        gsap.set(".hww-plumb-tip", { autoAlpha: 1 });
        gsap.set(".hww-surface", { scaleX: 1 });
        return;
      }

      gsap.utils.toArray<HTMLElement>(".hww-rise").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.05,
            scrollTrigger: { trigger: el, start: "top 90%" },
          },
        );
      });

      // ── Two-goal confluence ──────────────────────────────────────
      // The goals arrive from opposite sides, then two streams draw down
      // and meet at a single point. The copy says the first goal is what
      // happens when enough branches do the second one well; the diagram
      // is that sentence.
      gsap.utils.toArray<HTMLElement>(".hww-goal").forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: i === 0 ? -7 : 7, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          },
        );
      });

      gsap.utils.toArray<SVGPathElement>(".hww-stream").forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".hww-confluence",
            start: "top 88%",
            end: "bottom 68%",
            scrub: 0.7,
          },
        });
      });

      // The junction only exists once both streams have arrived.
      // svgOrigin pins the scale to the confluence point in user-space
      // coordinates; a percentage origin resolves against each shape's own
      // bounding box, which throws the rings off-centre from the dot.
      const CONFLUENCE = "480 186";

      gsap.fromTo(
        ".hww-junction",
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          svgOrigin: CONFLUENCE,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".hww-confluence",
            start: "bottom 76%",
            end: "bottom 62%",
            scrub: 0.6,
          },
        },
      );
      gsap.utils.toArray<SVGElement>(".hww-junction-ring").forEach((ring, i) => {
        gsap.fromTo(
          ring,
          { scale: 0.05, autoAlpha: 0.8, svgOrigin: CONFLUENCE },
          {
            scale: 1,
            autoAlpha: 0,
            svgOrigin: CONFLUENCE,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".hww-confluence",
              start: `bottom ${74 - i * 4}%`,
              end: "bottom 40%",
              scrub: 0.8,
            },
          },
        );
      });

      // ── Depth gauge ──────────────────────────────────────────────
      // Same treatment: the surface draws across, then every plumb line
      // descends from it on scrub. Breadth is what you see across the top;
      // depth is the only thing that moves.
      gsap.fromTo(
        ".hww-surface",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: ".hww-gauge",
            start: "top 86%",
            end: "top 52%",
            scrub: 0.6,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".hww-probe").forEach((probe, i) => {
        const plumbs = probe.querySelectorAll<HTMLElement>(".hww-plumb");
        const tip = probe.querySelectorAll<HTMLElement>(".hww-plumb-tip");
        gsap.fromTo(
          plumbs,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            stagger: 0.04,
            scrollTrigger: {
              trigger: ".hww-gauge",
              start: `top ${78 - i * 5}%`,
              end: "bottom 62%",
              scrub: 0.75,
            },
          },
        );
        gsap.fromTo(
          tip,
          { autoAlpha: 0, scale: 0.4 },
          {
            autoAlpha: 1,
            scale: 1,
            ease: "power2.out",
            stagger: 0.04,
            scrollTrigger: {
              trigger: ".hww-gauge",
              start: `top ${58 - i * 4}%`,
              end: "bottom 58%",
              scrub: 0.7,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      id="how-we-work"
      ref={rootRef}
      className="relative w-full overflow-hidden border-t border-border"
    >
      <div className="mx-auto w-full max-w-[88rem] px-6 md:px-12 pt-28 md:pt-40 pb-28 md:pb-36">
        {/* ── Heading ─────────────────────────────────────────────── */}
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <div className="hww-rise editorial-rule editorial-eyebrow text-muted-foreground">
              How we work
            </div>
            <h2 className="hww-rise mt-8 editorial-display leading-[1.04] pb-2 text-[clamp(2.5rem,7vw,6rem)] max-w-4xl">
              Depth,{" "}
              <span className="italic" style={{ color: "var(--brand-rose)" }}>
                not breadth.
              </span>
            </h2>
          </div>
          <p className="hww-rise max-w-md text-muted-foreground md:text-right md:self-end leading-relaxed">
            Hands of Hope does not scale by launching global initiatives. It
            scales one branch, one student, at a time.
          </p>
        </div>

        {/* ── Two-goal confluence ─────────────────────────────────── */}
        <div className="relative mt-24 md:mt-32">
          <div className="hww-rise editorial-eyebrow text-muted-foreground">
            Everything serves two goals at once
          </div>

          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-24">
            {GOALS.map((g) => (
              <div key={g.n} className="hww-goal">
                <div className="flex items-baseline gap-5">
                  <span
                    className="font-display text-5xl md:text-6xl italic leading-none"
                    style={{ color: g.accent }}
                  >
                    {g.n}
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl italic leading-none">
                    {g.label}
                  </h3>
                </div>
                <p className="mt-6 max-w-md text-base text-foreground/80 leading-relaxed">
                  {g.body}
                </p>
              </div>
            ))}
          </div>

          {/* Two streams drawing down into one.
              Everything lives inside the SVG so the junction cannot drift away
              from where the curves actually meet, and the stroke scales with
              the path: a non-scaling stroke under non-uniform scaling makes the
              dash length disagree with getTotalLength and the line renders in
              fragments. */}
          <div className="hww-confluence relative mx-auto mt-10 hidden h-44 w-full max-w-3xl md:block">
            <svg
              viewBox="0 0 960 220"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 h-full w-full overflow-visible"
              aria-hidden
            >
              <path
                className="hww-stream"
                d="M 180 0 C 180 104, 480 84, 480 186"
                fill="none"
                stroke="var(--brand-navy)"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.5"
              />
              <path
                className="hww-stream"
                d="M 780 0 C 780 104, 480 84, 480 186"
                fill="none"
                stroke="var(--brand-rose)"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.5"
              />

              {/* Impact rings at the confluence */}
              {[0, 1, 2].map((i) => (
                <circle
                  key={i}
                  className="hww-junction-ring"
                  cx="480"
                  cy="186"
                  r="46"
                  fill="none"
                  stroke="var(--brand-rose)"
                  strokeWidth="1.2"
                  opacity="0"
                />
              ))}
              <circle
                className="hww-junction"
                cx="480"
                cy="186"
                r="5"
                fill="var(--foreground)"
                opacity="0"
              />
            </svg>
          </div>

          <p className="hww-rise mx-auto mt-10 max-w-2xl text-center font-display text-xl md:text-2xl italic leading-relaxed text-foreground/75">
            These aren&apos;t two programs. The first is what happens when
            enough branches do the second one well.
          </p>
        </div>

        {/* ── The branch system ───────────────────────────────────── */}
        <div className="mt-28 md:mt-36 border-t border-border pt-16">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            <div>
              <div className="hww-rise editorial-eyebrow text-muted-foreground">
                The branch system
              </div>
              <h3 className="hww-rise mt-7 editorial-display leading-[1.06] pb-1 text-[clamp(1.9rem,3.6vw,3rem)] max-w-lg">
                One branch.{" "}
                <span className="italic" style={{ color: "var(--brand-navy)" }}>
                  One cause. Mastered.
                </span>
              </h3>
              <p className="hww-rise mt-7 max-w-lg text-base text-foreground/80 leading-relaxed">
                Each branch is based at a school or in a community and goes deep
                on a single cause instead of spreading thin across many. Branches
                pick their own cause, their own community partners, and their own
                programming. The autonomy is real, not nominal.
              </p>
              <p className="hww-rise mt-6 max-w-lg text-base text-foreground/80 leading-relaxed">
                Innovation Academy, the founding branch, is the one exception:
                two specialized sides running as one. STEM Together volunteers
                with MDE School and other special-needs schools. Atlanta Mission
                helps sustain the day-to-day operations of an understaffed local
                organization. STEM Together now runs at more than one branch.
              </p>
            </div>

            {/* Depth gauge */}
            <div className="hww-gauge self-center">
              {/* The waterline every probe descends from */}
              <div className="relative h-px w-full bg-border">
                <span
                  className="hww-surface absolute inset-0 block h-px origin-left"
                  style={{ background: "var(--foreground)", opacity: 0.28 }}
                  aria-hidden
                />
              </div>

              <div className="mt-0 grid grid-cols-3 gap-5">
                {PROBES.map((p) => (
                  <div key={p.label} className="hww-probe">
                    {/* Plumb lines hang from the surface */}
                    <div className="flex h-52 items-start justify-center gap-[3px]">
                      {Array.from({ length: p.strands }).map((_, s) => (
                        <div
                          key={s}
                          className="relative flex flex-col items-center"
                          style={{ height: `${p.depth * 100}%` }}
                        >
                          <span
                            className="hww-plumb block w-px flex-1 origin-top"
                            style={{ background: p.color, opacity: 0.75 }}
                            aria-hidden
                          />
                          <span
                            className="hww-plumb-tip block h-[5px] w-[5px] shrink-0 rounded-full opacity-0"
                            style={{ background: p.color }}
                            aria-hidden
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 border-t border-border pt-3">
                      <div className="text-sm font-medium leading-snug text-foreground">
                        {p.label}
                      </div>
                      <div className="mt-1 text-xs leading-snug text-muted-foreground">
                        {p.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="hww-rise mt-8 text-sm text-muted-foreground leading-relaxed">
                What another organization treats as its whole mission is, here,
                one branch&apos;s full-time focus.
              </p>
            </div>
          </div>
        </div>

        {/* ── Leadership does the work ────────────────────────────── */}
        <div className="mt-28 md:mt-36 border-t border-border pt-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
            <div>
              <div className="hww-rise editorial-eyebrow text-muted-foreground">
                One more thing
              </div>
              <h3 className="hww-rise mt-7 editorial-display leading-[1.05] pb-1 text-[clamp(2rem,4.4vw,3.5rem)]">
                Leadership does the{" "}
                <span className="italic" style={{ color: "var(--brand-rose)" }}>
                  work too.
                </span>
              </h3>
            </div>
            <div className="self-center">
              <p className="hww-rise text-base md:text-lg text-foreground/80 leading-relaxed">
                Co-founders, executives, and branch leaders are not
                administrators positioned above the volunteer work. They are the
                volunteers. Founders pack kits at Ripple for Change. Branch
                leaders run their programming with their own hands instead of
                delegating it away.
              </p>
              <p className="hww-rise mt-6 text-base text-foreground/80 leading-relaxed">
                The org chart is a division of hands-on responsibility, not a
                management hierarchy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
