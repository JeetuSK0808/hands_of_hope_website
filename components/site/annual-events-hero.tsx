"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Act I.
 *
 * The hero enters on load, then hands the page over to scroll: the room pushes
 * back and blurs, the headline separates into depth layers and lifts away, and
 * a single drop falls to a rising water line. The impact ring it throws is the
 * same rose hairline that runs the rest of the page.
 */
export function AnnualEventsHero() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Ambient drift on the photograph before any scrolling happens.
      gsap.to(".ah-photo", {
        scale: 1.07,
        duration: 22,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: isDesktop ? "+=110%" : "bottom top",
              scrub: 0.7,
              pin: isDesktop,
              anticipatePin: isDesktop ? 1 : 0,
              invalidateOnRefresh: true,
            },
          });

          // The room recedes.
          tl.to(
            ".ah-photo",
            { scale: 1.24, filter: "blur(7px)", ease: "none" },
            0,
          )
            .to(".ah-veil", { opacity: 1, ease: "none" }, 0)
            // Copy layers leave at different rates — parallax depth, not a
            // single block sliding off.
            .to(".ah-eyebrow", { yPercent: -220, autoAlpha: 0, ease: "none" }, 0)
            .to(".ah-line-1", { yPercent: -150, autoAlpha: 0, ease: "none" }, 0)
            .to(
              ".ah-line-2",
              { yPercent: -95, autoAlpha: 0, ease: "none" },
              0.04,
            )
            .to(".ah-body", { yPercent: -60, autoAlpha: 0, ease: "none" }, 0.06)
            .to(".ah-ctas", { yPercent: -40, autoAlpha: 0, ease: "none" }, 0.02)
            .to(".ah-cue", { autoAlpha: 0, ease: "none" }, 0)
            // The drop falls to the rising surface.
            .fromTo(
              ".ah-drop",
              { yPercent: -180, autoAlpha: 0, scale: 0.5 },
              { yPercent: 0, autoAlpha: 1, scale: 1, ease: "power2.in" },
              0.18,
            )
            .fromTo(
              ".ah-surface",
              { scaleX: 0 },
              { scaleX: 1, ease: "power2.out" },
              0.34,
            )
            .to(".ah-drop", { autoAlpha: 0, scaleY: 0.3, ease: "power2.in" }, 0.62)
            // Impact.
            .fromTo(
              ".ah-ring",
              { scale: 0.05, autoAlpha: 0.85 },
              {
                scale: 1,
                autoAlpha: 0,
                ease: "power2.out",
                stagger: 0.07,
              },
              0.62,
            );
        },
      );
    }, root);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[100svh] w-full flex-col justify-end overflow-hidden"
    >
      <div className="ah-photo absolute inset-0 will-change-transform">
        <Image
          src="/general/awards-ceremony.jpg"
          alt="Hands of Hope annual gathering, room filled with students and partners"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="tint-overlay-strong" aria-hidden />
      {/* Deepens as the section is scrolled through, easing into the ivory page. */}
      <div
        aria-hidden
        className="ah-veil pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.012 60 / 0.55) 0%, oklch(0.16 0.012 60 / 0.9) 100%)",
        }}
      />

      {/* ── Water event, centred in the viewport ─────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[52%] z-[5] flex justify-center"
      >
        <div className="relative h-0 w-full max-w-[46rem]">
          {/* Rising surface line */}
          <span
            className="ah-surface absolute inset-x-0 top-0 block h-px origin-center scale-x-0"
            style={{ background: "var(--brand-rose)", opacity: 0.85 }}
          />
          {/* Impact rings */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="ah-ring absolute left-1/2 top-0 block h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-0"
              style={{ borderColor: "var(--brand-rose)" }}
            />
          ))}
          {/* The drop */}
          <span className="ah-drop absolute left-1/2 top-0 block h-9 w-6 -translate-x-1/2 -translate-y-full opacity-0">
            <svg viewBox="0 0 16 24" className="h-full w-full">
              <path
                d="M 8 1 Q 2 14 8 22 Q 14 14 8 1 Z"
                fill="var(--brand-rose)"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Copy ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-28 pt-40 on-image">
        <div className="ah-eyebrow animate-fade-up [animation-delay:120ms]">
          <span className="editorial-rule editorial-eyebrow">
            Annual events · Winter &amp; spring
          </span>
        </div>

        <h1 className="mt-10 editorial-display leading-[1.02] pb-2 text-[clamp(3.25rem,9vw,9.5rem)] max-w-[20ch]">
          <span className="ah-line-1 block animate-fade-up [animation-delay:240ms]">
            Two dates
          </span>
          <span className="ah-line-2 block italic animate-fade-up [animation-delay:380ms]">
            a year matter most.
          </span>
        </h1>

        <p className="ah-body mt-12 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed animate-fade-up [animation-delay:520ms]">
          Every winter the network stops to name the students whose service and
          leadership carried the year. Every spring every branch shows up at the
          same tables and packs thousands of care kits in a single sitting. Both
          live here.
        </p>

        <div className="ah-ctas mt-10 flex flex-wrap gap-8 animate-fade-up [animation-delay:680ms]">
          <a
            href="#stage"
            className="inline-flex items-center border-b border-white/80 pb-1 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-70"
          >
            See both events
          </a>
          <a
            href="#sponsor"
            className="inline-flex items-center border-b border-white/40 pb-1 text-sm font-medium tracking-wide text-white/80 transition-opacity hover:opacity-100"
          >
            Become a sponsor
          </a>
        </div>
      </div>

      <div className="ah-cue pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/60">
        <span>Scroll</span>
        <span aria-hidden className="block h-8 w-px bg-white/40" />
      </div>
    </section>
  );
}
