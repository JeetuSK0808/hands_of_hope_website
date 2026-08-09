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
    body: "Once a year the whole network stops moving and looks at what it did. Branches and individual members are recognized from the stage for the work they carried — in front of the families, partners, and classmates who watched them carry it. The night belongs to the people who showed up.",
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
    body: "Every branch spends the year listening to the community it serves and tallying what those people say they need most. Whatever comes out on top becomes the theme. Then, once a year, every branch converges on the same tables and packs thousands of care kits around it — the day many branches become visibly one organization.",
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
        detail: "Not chosen for us — tallied from what communities said they needed",
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
 * Act II — the two dates.
 *
 * On desktop this is one pinned stage that the page scrubs through: the winter
 * scene settles, then a water line sweeps down the viewport and hands the frame
 * to spring. Below the pin breakpoint the same markup falls back to two stacked
 * scenes with ordinary reveals, because pinning a viewport on a phone is a good
 * way to make a page feel broken.
 */
export function AnnualEventsStage() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const pinRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(".ae-scene", { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
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
        gsap.set(".ae-scene", { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
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

        // Scene 1 starts open; scene 2 starts clipped shut from the bottom.
        gsap.set(scenes[0], { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(scenes[1], { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" });

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

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(self.progress > 0.52 ? 1 : 0),
          },
        });

        const settle = (scene: HTMLElement) => {
          const bits = scene.querySelectorAll<HTMLElement>(
            ".ae-eyebrow, .ae-numeral, .ae-title-word, .ae-body, .ae-meta-item, .ae-highlight",
          );
          tl.to(bits, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.07 }, "<");
          tl.to(
            scene.querySelectorAll(".ae-motif"),
            { autoAlpha: 0.85, scale: 1, rotate: 0, duration: 1.4 },
            "<+0.15",
          );
          tl.to(
            scene.querySelectorAll<HTMLElement>(".ae-photo"),
            { scale: 1, duration: 2.4, ease: "power2.out" },
            "<-0.4",
          );
        };

        // Winter settles in.
        settle(scenes[0]);
        tl.to({}, { duration: 1.4 });

        // The water line sweeps down and swaps the frame underneath it.
        tl.fromTo(
          ".ae-sweep",
          { yPercent: -102, autoAlpha: 1 },
          { yPercent: 102, duration: 1.6, ease: "power2.inOut" },
          "sweep",
        )
          .to(
            scenes[1],
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power2.inOut" },
            "sweep",
          )
          .to(
            scenes[0].querySelectorAll<HTMLElement>(".ae-copy"),
            { yPercent: -12, autoAlpha: 0, duration: 1.1, ease: "power2.in" },
            "sweep",
          )
          .to(".ae-sweep", { autoAlpha: 0, duration: 0.2 }, "sweep+=1.5");

        // Spring settles in.
        settle(scenes[1]);
        tl.to({}, { duration: 1.6 });
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      id="stage"
      ref={rootRef}
      className="relative w-full border-t border-border bg-background"
    >
      <div
        ref={pinRef}
        className="relative isolate w-full overflow-hidden lg:h-svh"
      >
        {/* The sweeping water line that carries the transition */}
        <div
          aria-hidden
          className="ae-sweep pointer-events-none absolute inset-x-0 top-0 z-30 hidden opacity-0 lg:block"
        >
          <div
            className="h-px w-full"
            style={{ background: "var(--brand-rose)" }}
          />
          <div
            className="h-24 w-full"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.45 0.13 350 / 0.18) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Season counter, fixed inside the pinned frame */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 mx-auto hidden w-full max-w-[88rem] px-12 pt-10 lg:block">
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
                      <span
                        className="font-display text-lg italic"
                        style={{ color: "#ffffff" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="mt-1.5 font-medium text-white">
                        {h.label}
                      </div>
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
