"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Season = "winter" | "spring";

type AnnualEvent = {
  id: "awards" | "ripple";
  numeral: string;
  seasonLabel: string;
  eyebrow: string;
  title: string;
  italic: string;
  body: string;
  image: string;
  alt: string;
  accent: string;
  season: Season;
  meta: { k: string; v: string }[];
  highlights: { label: string; detail: string }[];
};

const EVENTS: AnnualEvent[] = [
  {
    id: "awards",
    numeral: "I.",
    seasonLabel: "Winter",
    eyebrow: "Winter · The year read back out loud",
    title: "Awards",
    italic: "Ceremony",
    body: "Once a year the whole network stops moving and looks at what it did. Branches and individual members are recognized from the stage for the work they carried, in front of the families, partners, and classmates who watched them carry it. The night belongs to the people who showed up.",
    image: "/general/award-ceremony-hi.jpg",
    alt: "Hands of Hope Awards Ceremony, students gathered in formalwear under stage light",
    accent: "var(--brand-navy)",
    season: "winter",
    meta: [
      { k: "When", v: "Annually · Every winter" },
      { k: "Format", v: "Awards evening" },
      { k: "Open to", v: "Honorees · Families · Partners" },
    ],
    highlights: [
      {
        label: "Branch honors",
        detail: "Each branch recognized for the cause it spent the year mastering",
      },
      {
        label: "Individual honors",
        detail: "Service hours, leadership, and the members who quietly carried more",
      },
      {
        label: "The room",
        detail: "Printed program, presentations from the stage, the families in the seats",
      },
    ],
  },
  {
    id: "ripple",
    numeral: "II.",
    seasonLabel: "Spring",
    eyebrow: "Spring · Every branch, one set of tables",
    title: "Ripple",
    italic: "for Change",
    body: "Every branch spends the year listening to the community it serves and tallying what those people say they need most. Whatever comes out on top becomes the theme. Then, once a year, every branch converges on the same tables and packs thousands of care kits around it, the day many branches become visibly one organization.",
    image: "/general/first-kit-packing.jpg",
    alt: "Hands of Hope volunteers packing kits at long tables during Ripple for Change",
    accent: "var(--brand-rose)",
    season: "spring",
    meta: [
      { k: "When", v: "Annually · Every spring" },
      { k: "Format", v: "All-day kit-packing assembly" },
      { k: "Open to", v: "Students · Families · Partners" },
    ],
    highlights: [
      {
        label: "The theme",
        detail: "Not chosen for us, but tallied from what communities said they needed",
      },
      {
        label: "The assembly",
        detail: "Long tables, supply stations, thousands of kits in a single sitting",
      },
      {
        label: "The delivery",
        detail: "Shipped to partner shelters and schools within the week",
      },
    ],
  },
];

/** Where the ripple wipe originates, as CSS percentages of the frame. */
const WIPE_ORIGIN = { x: 34, y: 58 };

function WinterMotif() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinecap="round"
        className="ae-motif-stroke"
      >
        <line x1="50" y1="8" x2="50" y2="92" />
        <line x1="8" y1="50" x2="92" y2="50" />
        <line x1="20" y1="20" x2="80" y2="80" />
        <line x1="80" y1="20" x2="20" y2="80" />
        <line x1="50" y1="16" x2="43" y2="23" />
        <line x1="50" y1="16" x2="57" y2="23" />
        <line x1="50" y1="84" x2="43" y2="77" />
        <line x1="50" y1="84" x2="57" y2="77" />
        <line x1="16" y1="50" x2="23" y2="43" />
        <line x1="16" y1="50" x2="23" y2="57" />
        <line x1="84" y1="50" x2="77" y2="43" />
        <line x1="84" y1="50" x2="77" y2="57" />
        <circle cx="50" cy="50" r="6" />
      </g>
    </svg>
  );
}

function SpringMotif() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="0.4" className="ae-motif-stroke">
        <circle cx="50" cy="50" r="8" />
        <circle cx="50" cy="50" r="18" strokeDasharray="0.8 1.2" />
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="42" strokeDasharray="0.4 1.6" />
      </g>
      <g stroke="currentColor" strokeWidth="0.45" strokeLinecap="round" className="ae-motif-stroke">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={50 + Math.cos(angle) * 46}
              y1={50 + Math.sin(angle) * 46}
              x2={50 + Math.cos(angle) * 50}
              y2={50 + Math.sin(angle) * 50}
            />
          );
        })}
      </g>
    </svg>
  );
}

/**
 * Act II: the two dates.
 *
 * One pinned stage the page scrubs through. Winter settles in piece by piece,
 * then spring is revealed through a circular ripple wipe: a drop lands low in
 * the frame and the new season expands outward from the point of impact, two
 * ring strokes riding the wipe edge. Both photographs drift slowly the whole
 * time so the frame is never inert.
 *
 * Below the pin breakpoint the same markup falls back to two stacked scenes
 * with ordinary reveals, because pinning a viewport on a phone reads as broken.
 */
export function AnnualEventsStage() {
  const rootRef = React.useRef<HTMLElement>(null);
  const pinRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(".ae-scene", { autoAlpha: 1, clipPath: "none" });
        gsap.set(
          ".ae-eyebrow, .ae-numeral, .ae-title-word, .ae-body, .ae-meta-item, .ae-highlight",
          { autoAlpha: 1, y: 0, yPercent: 0 },
        );
        gsap.set(".ae-motif", { autoAlpha: 0.85 });
        return;
      }

      const mm = gsap.matchMedia();

      // ── Below the pin breakpoint: plain, well-behaved reveals ──────
      mm.add("(max-width: 1023px)", () => {
        gsap.set(".ae-scene", { autoAlpha: 1, clipPath: "none" });
        gsap.utils.toArray<HTMLElement>(".ae-scene").forEach((scene) => {
          const bits = scene.querySelectorAll<HTMLElement>(
            ".ae-eyebrow, .ae-numeral, .ae-title-word, .ae-body, .ae-meta-item, .ae-highlight",
          );
          gsap.fromTo(
            bits,
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.05,
              scrollTrigger: { trigger: scene, start: "top 80%" },
            },
          );
          gsap.set(scene.querySelectorAll(".ae-motif"), { autoAlpha: 0.8 });
        });
      });

      // ── Desktop: the pinned stage ──────────────────────────────────
      mm.add("(min-width: 1024px)", () => {
        const scenes = gsap.utils.toArray<HTMLElement>(".ae-scene");
        const origin = `${WIPE_ORIGIN.x}% ${WIPE_ORIGIN.y}%`;

        // Scene 1 starts open; scene 2 starts as an unopened drop.
        gsap.set(scenes[0], { autoAlpha: 1, clipPath: "none" });
        gsap.set(scenes[1], { autoAlpha: 1, clipPath: `circle(0% at ${origin})` });

        scenes.forEach((scene, i) => {
          const bits = scene.querySelectorAll<HTMLElement>(
            ".ae-eyebrow, .ae-numeral, .ae-title-word, .ae-body, .ae-meta-item, .ae-highlight",
          );
          gsap.set(bits, { y: i === 0 ? 26 : 34, autoAlpha: 0 });
          gsap.set(scene.querySelectorAll(".ae-motif"), {
            autoAlpha: 0,
            scale: 0.82,
            rotate: -8,
          });
        });

        // One fixed 10-unit score, every beat placed explicitly. Scrub maps
        // the 280% pin distance onto it linearly, so beat positions read as
        // fractions of the reader's scroll through the act.
        const T = 10;
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=280%",
            pin: pin,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(self.progress > 0.48 ? 1 : 0),
          },
        });

        const settle = (scene: HTMLElement, at: number) => {
          const bits = scene.querySelectorAll<HTMLElement>(
            ".ae-eyebrow, .ae-numeral, .ae-title-word, .ae-body, .ae-meta-item, .ae-highlight",
          );
          tl.to(bits, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08 }, at);
          tl.to(
            scene.querySelectorAll(".ae-motif"),
            { autoAlpha: 0.85, scale: 1, rotate: 0, duration: 1.5 },
            at + 0.2,
          );
        };

        // Both photographs drift for the entire pinned span, so the frame is
        // alive even while the reader lingers on copy.
        scenes.forEach((scene) => {
          const photo = scene.querySelector<HTMLElement>(".ae-photo");
          if (photo) {
            tl.fromTo(
              photo,
              { yPercent: -2.5, scale: 1.12 },
              { yPercent: 2.5, scale: 1.06, ease: "none", duration: T },
              0,
            );
          }
        });

        // Winter settles in and holds until ~40%.
        settle(scenes[0], 0.2);

        // ── The ripple wipe, 40% → 66% of the act ────────────────────
        // A drop lands low in the frame; spring expands outward from the
        // impact point while two ring strokes ride the wipe edge.
        const WIPE = 4.0;
        tl.fromTo(
          ".ae-wipe-drop",
          { yPercent: -900, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: "power2.in", duration: 0.5 },
          WIPE,
        )
          .to(".ae-wipe-drop", { autoAlpha: 0, scaleY: 0.3, duration: 0.08 }, WIPE + 0.5)
          .to(
            scenes[0].querySelectorAll<HTMLElement>(".ae-copy"),
            { yPercent: -10, autoAlpha: 0, duration: 1.0, ease: "power2.in" },
            WIPE + 0.35,
          )
          .fromTo(
            scenes[1],
            { clipPath: `circle(0% at ${origin})` },
            { clipPath: `circle(142% at ${origin})`, duration: 2.0, ease: "power2.inOut" },
            WIPE + 0.58,
          );

        // Ring strokes riding the wipe.
        gsap.utils.toArray<HTMLElement>(".ae-wipe-ring").forEach((ring, i) => {
          tl.fromTo(
            ring,
            { scale: 0.02, autoAlpha: 0.85 },
            { scale: 1, autoAlpha: 0, ease: "power2.out", duration: 1.8 },
            WIPE + 0.58 + i * 0.15,
          );
        });

        // Spring settles at ~68% and holds to the end of the act.
        settle(scenes[1], 6.8);
        tl.to({}, { duration: 0.01 }, T - 0.01);
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section ref={rootRef} id="stage" className="relative w-full border-t border-border bg-background">
      <div ref={pinRef} className="relative isolate w-full overflow-hidden lg:h-svh">
        {/* The drop that triggers the seasonal wipe */}
        <span
          aria-hidden
          className="ae-wipe-drop pointer-events-none absolute z-30 hidden h-10 w-7 -translate-x-1/2 opacity-0 will-change-transform lg:block"
          style={{ left: `${WIPE_ORIGIN.x}%`, top: `calc(${WIPE_ORIGIN.y}% - 2.5rem)` }}
        >
          <svg viewBox="0 0 16 24" className="h-full w-full">
            <path d="M 8 1 Q 2 14 8 22 Q 14 14 8 1 Z" fill="var(--brand-rose)" />
          </svg>
        </span>

        {/* Rings riding the wipe edge */}
        {[0, 1].map((i) => (
          <span
            key={i}
            aria-hidden
            className="ae-wipe-ring pointer-events-none absolute z-30 hidden rounded-full border opacity-0 lg:block"
            style={{
              left: `${WIPE_ORIGIN.x}%`,
              top: `${WIPE_ORIGIN.y}%`,
              width: "160vmax",
              height: "160vmax",
              marginLeft: "-80vmax",
              marginTop: "-80vmax",
              borderColor: i === 0 ? "var(--brand-rose)" : "rgba(255,255,255,0.65)",
              borderWidth: i === 0 ? 1.5 : 1,
            }}
          />
        ))}

        {/* Season counter, fixed inside the pinned frame. pt clears the
            sticky nav, which otherwise sits exactly on top of it. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 mx-auto hidden w-full max-w-[88rem] px-12 pt-28 lg:block">
          <div className="flex items-center justify-between">
            <span className="editorial-eyebrow text-white/70">The calendar</span>
            <div className="flex items-center gap-5">
              {EVENTS.map((ev, i) => (
                <span
                  key={ev.id}
                  className="editorial-eyebrow transition-colors duration-500"
                  style={{
                    color: active === i ? "#ffffff" : "rgba(255,255,255,0.38)",
                  }}
                >
                  {ev.seasonLabel}
                </span>
              ))}
              <span className="block h-px w-16 bg-white/25" aria-hidden>
                <span
                  className="block h-px transition-all duration-700"
                  style={{
                    width: active === 0 ? "50%" : "100%",
                    background: EVENTS[active].accent,
                  }}
                />
              </span>
            </div>
          </div>
        </div>

        {/* ── Scenes ────────────────────────────────────────────────── */}
        {EVENTS.map((ev, idx) => (
          <article
            key={ev.id}
            className="ae-scene relative w-full overflow-hidden lg:absolute lg:inset-0 lg:h-full"
            style={{ zIndex: 10 + idx }}
          >
            <div className="ae-photo absolute inset-0 will-change-transform">
              <Image
                src={ev.image}
                alt={ev.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover"
                style={{ transform: "scale(1.12)" }}
              />
            </div>
            <div className="tint-overlay" aria-hidden />
            <div
              aria-hidden
              className="absolute inset-0 mix-blend-soft-light"
              style={{
                background: `radial-gradient(ellipse at 25% 75%, ${ev.accent} 0%, transparent 62%)`,
                opacity: 0.6,
              }}
            />

            {/* Seasonal motif, oversized and quiet behind the type */}
            <div
              aria-hidden
              className="ae-motif pointer-events-none absolute -right-[8vw] top-1/2 hidden h-[62vh] w-[62vh] -translate-y-1/2 text-white/45 opacity-0 lg:block"
            >
              {ev.season === "winter" ? <WinterMotif /> : <SpringMotif />}
            </div>

            <div className="ae-copy relative z-10 mx-auto flex h-full w-full max-w-[88rem] flex-col justify-end px-6 pb-16 pt-28 md:px-12 lg:justify-center lg:pb-0 lg:pt-0 on-image">
              <div className="max-w-3xl">
                <div className="ae-eyebrow editorial-rule editorial-eyebrow">
                  {ev.eyebrow}
                </div>

                <div
                  className="ae-numeral mt-7 font-display text-6xl md:text-7xl font-light italic leading-none"
                  style={{ color: ev.accent }}
                >
                  {ev.numeral}
                </div>

                <h2 className="mt-5 editorial-display leading-[1.02] pb-2 text-[clamp(2.75rem,6.4vw,5.5rem)] text-white">
                  <span className="ae-title-word inline-block">{ev.title}</span>{" "}
                  <span className="ae-title-word inline-block italic">
                    {ev.italic}
                  </span>
                </h2>

                <p className="ae-body mt-7 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
                  {ev.body}
                </p>

                <dl className="mt-9 grid max-w-2xl grid-cols-1 gap-x-10 gap-y-5 text-sm sm:grid-cols-3">
                  {ev.meta.map((m) => (
                    <div key={m.k} className="ae-meta-item">
                      <dt className="editorial-eyebrow text-white/65">{m.k}</dt>
                      <dd className="mt-2 text-white">{m.v}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-9 grid max-w-3xl gap-4 border-t border-white/20 pt-7 sm:grid-cols-3">
                  {ev.highlights.map((h, i) => (
                    <li key={h.label} className="ae-highlight">
                      <span className="font-display text-lg italic text-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="mt-1.5 font-medium text-white">{h.label}</div>
                      <p className="mt-1 text-sm text-white/70 leading-relaxed">
                        {h.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
