"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * The organization's operating model, straight from the internal reference doc.
 *
 * Voice rule that governs every string in this file: students — leadership
 * included — are the subject of the verb. Never "Hands of Hope empowers
 * students to…". See hands-of-hope-how-we-work-2.md.
 */

const GOALS = [
  {
    n: "01",
    label: "Global impact",
    accent: "var(--brand-navy)",
    body: "Communities around the world get real, sustained support — not a single visit and a photo.",
  },
  {
    n: "02",
    label: "Student growth",
    accent: "var(--brand-rose)",
    body: "High schoolers turn compassion into leadership experience and hands-on action they actually own.",
  },
];

const UNITERS = [
  {
    season: "Spring",
    name: "Ripple for Change",
    accent: "var(--brand-rose)",
    body: "Once a year every branch packs thousands of care kits around a single theme. The theme is not a guess: branches spend the year tracking what the communities they serve say they need most, tally the answers, and build that year's kits around whatever comes out on top.",
    tag: "Many branches become visibly one organization.",
  },
  {
    season: "Winter",
    name: "Awards Ceremony",
    accent: "var(--brand-navy)",
    body: "The night the year gets read back out loud — branches and individual members recognized for the work they carried, in front of the families and partners who watched them carry it.",
    tag: "The people who showed up get named.",
  },
];

export function HowWeWork() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(
          [".hww-rise", ".hww-goal", ".hww-uniter", ".hww-depth-row"],
          { clearProps: "all", opacity: 1, y: 0 },
        );
        gsap.set(".hww-converge", { scaleY: 1 });
        gsap.set(".hww-depth-fill", { scaleX: 1 });
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

      // The two goals arrive from opposite sides, then a hairline draws down
      // between them — the point being that they are one mechanism, not two.
      gsap.utils.toArray<HTMLElement>(".hww-goal").forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: i === 0 ? -6 : 6, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          },
        );
      });

      gsap.fromTo(
        ".hww-converge",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: ".hww-goals",
            start: "top 78%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        },
      );

      // Depth-over-breadth bars fill left to right as the comparison enters.
      gsap.utils.toArray<HTMLElement>(".hww-depth-row").forEach((row, i) => {
        const fill = row.querySelector<HTMLElement>(".hww-depth-fill");
        gsap.fromTo(
          row,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: row, start: "top 90%" },
          },
        );
        if (fill) {
          gsap.fromTo(
            fill,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.4,
              ease: "power3.out",
              delay: 0.2 + i * 0.1,
              transformOrigin: "left center",
              scrollTrigger: { trigger: row, start: "top 88%" },
            },
          );
        }
      });

      gsap.utils.toArray<HTMLElement>(".hww-uniter").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
    }, rootRef);

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

        {/* ── Two-goal model ──────────────────────────────────────── */}
        <div className="hww-goals relative mt-24 md:mt-32">
          <div className="hww-rise editorial-eyebrow text-muted-foreground">
            Everything serves two goals at once
          </div>

          {/* Converging hairline, desktop only */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-24 hidden h-[calc(100%-6rem)] w-px -translate-x-1/2 md:block"
            style={{ background: "var(--border)" }}
          />
          <div
            aria-hidden
            className="hww-converge pointer-events-none absolute left-1/2 top-24 hidden h-[calc(100%-6rem)] w-px -translate-x-1/2 origin-top md:block"
            style={{ background: "var(--foreground)", opacity: 0.22 }}
          />

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

          <p className="hww-rise mx-auto mt-16 max-w-2xl text-center font-display text-xl md:text-2xl italic leading-relaxed text-foreground/75">
            These aren&apos;t two programs. The first is what happens when
            enough branches do the second one well.
          </p>
        </div>

        {/* ── Depth over breadth ──────────────────────────────────── */}
        <div className="mt-28 md:mt-36 border-t border-border pt-16">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
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
                Innovation Academy — the founding branch — is the one exception:
                two specialized sides running as one. STEM Together volunteers
                with MDE School and other special-needs schools. Atlanta Mission
                helps sustain the day-to-day operations of an understaffed local
                organization. STEM Together now runs at more than one branch.
              </p>
            </div>

            {/* Comparison bars */}
            <div className="self-center">
              <div className="grid gap-9">
                {[
                  {
                    label: "A typical single-cause nonprofit",
                    sub: "Entire organization",
                    width: "34%",
                    color: "var(--muted-foreground)",
                    opacity: 0.4,
                  },
                  {
                    label: "One Hands of Hope branch",
                    sub: "Full-time focus of a few students",
                    width: "34%",
                    color: "var(--brand-rose)",
                    opacity: 1,
                  },
                  {
                    label: "The network",
                    sub: "Every branch, every cause, at once",
                    width: "100%",
                    color: "var(--brand-navy)",
                    opacity: 1,
                  },
                ].map((row) => (
                  <div key={row.label} className="hww-depth-row">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <span className="text-sm font-medium text-foreground">
                        {row.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {row.sub}
                      </span>
                    </div>
                    <div className="relative mt-3 h-px w-full bg-border">
                      <span
                        className="hww-depth-fill absolute left-0 top-0 block h-[3px] -translate-y-px"
                        style={{
                          width: row.width,
                          background: row.color,
                          opacity: row.opacity,
                        }}
                        aria-hidden
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="hww-rise mt-9 text-sm text-muted-foreground leading-relaxed">
                What another organization treats as its whole mission is, here,
                one branch&apos;s full-time focus.
              </p>
            </div>
          </div>
        </div>

        {/* ── What unites the branches ────────────────────────────── */}
        <div className="mt-28 md:mt-36 border-t border-border pt-16">
          <div className="hww-rise editorial-eyebrow text-muted-foreground">
            Twice a year, the whole network is in one room
          </div>

          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
            {UNITERS.map((u) => (
              <article
                key={u.name}
                className="hww-uniter border-t-2 pt-8"
                style={{ borderTopColor: u.accent }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="editorial-eyebrow" style={{ color: u.accent }}>
                    {u.season}
                  </span>
                </div>
                <h3 className="mt-5 editorial-display leading-[1.06] pb-1 text-[clamp(1.9rem,3.4vw,2.75rem)]">
                  {u.name}
                </h3>
                <p className="mt-6 text-base text-foreground/80 leading-relaxed">
                  {u.body}
                </p>
                <p className="mt-6 font-display text-lg italic text-foreground/70">
                  {u.tag}
                </p>
              </article>
            ))}
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
