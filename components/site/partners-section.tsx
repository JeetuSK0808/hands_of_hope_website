"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Partner = {
  name: string;
  src: string;
  accent: string;
};

const PARTNERS: Partner[] = [
  { name: "Atlanta Mission",              src: "/partners/atlanta-mission.png", accent: "var(--brand-rose)" },
  { name: "Open Hand Atlanta",            src: "/partners/open-hand.png",       accent: "var(--brand-navy)" },
  { name: "Atlanta Community Food Bank",  src: "/partners/facfb.png",           accent: "var(--brand-rose-soft)" },
  { name: "MDE School",                   src: "/partners/mde.jpeg",            accent: "var(--brand-navy-soft)" },
  { name: "Aiwyn",                        src: "/partners/aiwyn.jpg",           accent: "var(--brand-rose)" },
  { name: "Jukebox Print",                src: "/partners/jukebox.png",         accent: "var(--brand-navy)" },
  { name: "Chatpatti",                    src: "/partners/chatpatti.png",       accent: "var(--brand-rose-soft)" },
  { name: "Hooch Foundation",             src: "/partners/hooch.png",           accent: "var(--brand-navy-soft)" },
  { name: "Alpha Foundation",             src: "/partners/alpha.png",           accent: "var(--brand-rose)" },
  { name: "Camp Foundation",              src: "/partners/camp.png",            accent: "var(--brand-navy)" },
  { name: "MHS",                          src: "/partners/mhs.png",             accent: "var(--brand-rose-soft)" },
  { name: "IAF",                          src: "/partners/iaf.png",             accent: "var(--brand-navy-soft)" },
  { name: "COLC",                         src: "/partners/colc.png",            accent: "var(--brand-rose)" },
  { name: "GG",                           src: "/partners/gg.png",              accent: "var(--brand-navy)" },
  { name: "ABC",                          src: "/partners/abc.png",             accent: "var(--brand-rose-soft)" },
];

const OUTER = PARTNERS.slice(0, 8);
const INNER = PARTNERS.slice(8);

const OUTER_RADIUS_PCT = 42;
const INNER_RADIUS_PCT = 25;
const OUTER_DURATION = 90;
const INNER_DURATION = 110;

function Chip({
  p,
  size,
  counterClass,
}: {
  p: Partner;
  size: number;
  counterClass: string;
}) {
  return (
    <div
      className={`${counterClass} orbit-chip flex flex-col items-center`}
    >
      {/* Logo card */}
      <div
        title={p.name}
        className="group relative flex items-center justify-center rounded-full border border-border bg-card/95 shadow-[0_8px_24px_-12px_oklch(0.18_0.012_60_/_0.18)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-500 hover:scale-110 hover:border-foreground/35 hover:shadow-[0_18px_40px_-18px_oklch(0.18_0.012_60_/_0.32)]"
        style={{ height: size, width: size }}
      >
        <Image
          src={p.src}
          alt={p.name}
          width={size}
          height={size}
          unoptimized
          className="pointer-events-none select-none object-contain"
          style={{ width: size * 0.7, height: size * 0.7 }}
        />

        {/* Accent ring on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1.5 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: `0 0 0 1px ${p.accent}` }}
        />

        {/* Soft colored glow on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle, ${p.accent}, transparent 70%)`,
            filter: "blur(8px)",
            opacity: 0.18,
          }}
        />
      </div>

      {/* Classy label below the chip */}
      <div
        className="orbit-label mt-3 max-w-[110px] text-center font-display text-[11px] italic leading-tight tracking-tight text-foreground/80"
      >
        {p.name}
      </div>
    </div>
  );
}

export function PartnersSection() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const outerRingRef = React.useRef<HTMLDivElement>(null);
  const innerRingRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".partners-rise").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            delay: i * 0.05,
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      // Continuous orbital rotation. Counter-rotation on each whole chip+label
      // wrapper keeps logos and labels upright at all times.
      if (outerRingRef.current) {
        gsap.to(outerRingRef.current, {
          rotation: 360,
          duration: OUTER_DURATION,
          ease: "none",
          repeat: -1,
        });
      }
      if (innerRingRef.current) {
        gsap.to(innerRingRef.current, {
          rotation: -360,
          duration: INNER_DURATION,
          ease: "none",
          repeat: -1,
        });
      }
      gsap.to(".outer-counter", {
        rotation: -360,
        duration: OUTER_DURATION,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".inner-counter", {
        rotation: 360,
        duration: INNER_DURATION,
        ease: "none",
        repeat: -1,
      });

      gsap.fromTo(
        ".orbit-chip",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: "back.out(1.4)",
          stagger: { each: 0.05, from: "random" },
          scrollTrigger: { trigger: ".partners-orbit", start: "top 70%" },
        }
      );

      gsap.utils.toArray<HTMLElement>(".pulse-ring").forEach((ring, i) => {
        gsap.set(ring, { scale: 0.6, opacity: 0.5 });
        gsap.to(ring, {
          scale: 3,
          opacity: 0,
          duration: 4.2,
          ease: "power2.out",
          repeat: -1,
          delay: i * 1.4,
        });
      });

      gsap.fromTo(
        ".partners-orbit",
        { scale: 0.94 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".partners-orbit",
            start: "top 90%",
            end: "top 30%",
            scrub: 0.8,
          },
        }
      );

      gsap.to(".partners-marquee-track", {
        xPercent: -50,
        duration: 70,
        ease: "none",
        repeat: -1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="partners"
      ref={rootRef}
      className="relative w-full overflow-hidden border-t border-border"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 30%, oklch(0.45 0.13 350 / 0.05), transparent 70%), radial-gradient(45% 50% at 90% 90%, oklch(0.28 0.075 255 / 0.05), transparent 70%)",
          }}
        />
        <div className="absolute -left-32 top-32 hidden md:block opacity-[0.05] rotate-very-slow">
          <svg width="520" height="520" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--brand-navy)" strokeWidth="0.25" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="var(--brand-rose)" strokeWidth="0.25" strokeDasharray="0.6 1.4" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="var(--brand-navy)" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="12" fill="none" stroke="var(--brand-rose)" strokeWidth="0.2" />
          </svg>
        </div>
      </div>

      <div className="relative px-6 md:px-12 py-32 md:py-44">
        <div className="mx-auto max-w-[88rem]">
          <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-end">
            <div>
              <div className="partners-rise editorial-rule editorial-eyebrow text-muted-foreground">
                Our circle
              </div>
              <h2 className="partners-rise mt-8 editorial-display text-[clamp(2.5rem,6.5vw,5.5rem)] max-w-2xl">
                Better,{" "}
                <span className="italic" style={{ color: "var(--brand-rose)" }}>
                  together.
                </span>
              </h2>
            </div>
            <div className="partners-rise md:justify-self-end max-w-md">
              <p className="text-muted-foreground leading-relaxed">
                We collaborate with mission-aligned organizations across Atlanta:
                shelters, schools, food banks, and foundations, so every student
                project lands where it counts.
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span aria-hidden className="h-px w-8" style={{ background: "var(--brand-rose)" }} />
                <span className="editorial-eyebrow">
                  {PARTNERS.length} partners · & growing
                </span>
              </div>
            </div>
          </div>

          {/* Orbital constellation, the focal animation */}
          <div className="partners-orbit relative mx-auto mt-24 md:mt-32 aspect-square w-full max-w-[52rem]">
            {/* Concentric guide circles */}
            <div aria-hidden className="absolute inset-[6%] rounded-full border border-border/80" />
            <div aria-hidden className="absolute inset-[24%] rounded-full border border-dashed border-border/70" />
            <div aria-hidden className="absolute inset-[42%] rounded-full border border-border/60" />

            {[0, 1, 2].map((i) => (
              <div
                key={i}
                aria-hidden
                className="pulse-ring absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{ borderColor: "var(--brand-rose)" }}
              />
            ))}

            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.45 0.13 350 / 0.10), transparent 70%)",
              }}
            />

            <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center">
              <div className="editorial-eyebrow text-muted-foreground">
                Hands of
              </div>
              <div className="font-display text-3xl md:text-5xl font-light italic tracking-tight">
                Hope
              </div>
              <div
                aria-hidden
                className="mt-3 h-px w-10"
                style={{ background: "var(--brand-rose)" }}
              />
            </div>

            <div ref={outerRingRef} className="absolute inset-0 z-20">
              {OUTER.map((p, i) => {
                const angleDeg = (i / OUTER.length) * 360 - 90;
                const rad = (angleDeg * Math.PI) / 180;
                const cx = Number((50 + Math.cos(rad) * OUTER_RADIUS_PCT).toFixed(4));
                const cy = Number((50 + Math.sin(rad) * OUTER_RADIUS_PCT).toFixed(4));
                return (
                  <div
                    key={p.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${cx}%`, top: `${cy}%` }}
                  >
                    <Chip p={p} size={76} counterClass="outer-counter" />
                  </div>
                );
              })}
            </div>

            <div ref={innerRingRef} className="absolute inset-0 z-20">
              {INNER.map((p, i) => {
                const angleDeg =
                  (i / INNER.length) * 360 + 360 / (INNER.length * 2) - 90;
                const rad = (angleDeg * Math.PI) / 180;
                const cx = Number((50 + Math.cos(rad) * INNER_RADIUS_PCT).toFixed(4));
                const cy = Number((50 + Math.sin(rad) * INNER_RADIUS_PCT).toFixed(4));
                return (
                  <div
                    key={p.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${cx}%`, top: `${cy}%` }}
                  >
                    <Chip p={p} size={60} counterClass="inner-counter" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Closing marquee with partner names */}
      <div className="relative border-t border-border bg-background py-6 overflow-hidden marquee-mask">
        <div className="partners-marquee-track flex w-max items-center gap-12 whitespace-nowrap font-display text-xl md:text-2xl italic font-light text-foreground/45">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            PARTNERS.map((p) => (
              <span key={`${k}-${p.name}`} className="flex items-center gap-12">
                {p.name}
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
