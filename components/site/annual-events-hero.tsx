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
 * Enters on load, then scroll takes over: the room recedes behind a deepening
 * veil, the copy separates into depth layers and lifts away at different
 * rates, and a single drop falls to a rising water line. On impact the drop
 * throws rings and a small crown splash, and the surface line then sinks to
 * the bottom edge of the frame — handing the page to Act II.
 *
 * IMPORTANT: the pin target is the INNER wrapper (pinRef), never the
 * <section> itself. Pinning a route-level node makes ScrollTrigger wrap it in
 * a pin-spacer, and React then crashes with removeChild on client-side
 * navigation away from the page, blanking the whole app.
 */
export function AnnualEventsHero() {
  const rootRef = React.useRef<HTMLElement>(null);
  const pinRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin || prefersReduced) return;

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
        { isDesktop: "(min-width: 1024px)" },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: isDesktop ? "+=130%" : "bottom top",
              scrub: 0.7,
              pin: isDesktop ? pin : false,
              anticipatePin: isDesktop ? 1 : 0,
              invalidateOnRefresh: true,
            },
          });

          // The room recedes. Scale + a deepening veil — no scrubbed blur,
          // which repaints a full-viewport image on every frame.
          tl.to(".ah-photo", { scale: 1.22, ease: "none" }, 0)
            .to(".ah-veil", { opacity: 1, ease: "none" }, 0)
            // Copy layers leave at different rates — parallax depth, not a
            // single block sliding off.
            .to(".ah-eyebrow", { yPercent: -260, autoAlpha: 0, ease: "none" }, 0)
            .to(".ah-line-1", { yPercent: -170, autoAlpha: 0, ease: "none" }, 0)
            .to(".ah-line-2", { yPercent: -105, autoAlpha: 0, ease: "none" }, 0.04)
            .to(".ah-body", { yPercent: -65, autoAlpha: 0, ease: "none" }, 0.07)
            .to(".ah-ctas", { yPercent: -45, autoAlpha: 0, ease: "none" }, 0.03)
            .to(".ah-cue", { autoAlpha: 0, ease: "none" }, 0)

            // The drop falls, swaying slightly as real water does.
            .fromTo(
              ".ah-drop",
              { yPercent: -240, autoAlpha: 0, scale: 0.45 },
              { yPercent: 0, autoAlpha: 1, scale: 1, ease: "power2.in", duration: 0.34 },
              0.16,
            )
            .fromTo(
              ".ah-drop",
              { x: -8 },
              { x: 4, ease: "sine.inOut", duration: 0.34 },
              0.16,
            )
            // The surface rises to meet it.
            .fromTo(
              ".ah-surface",
              { scaleX: 0, opacity: 0.9 },
              { scaleX: 1, ease: "power2.out", duration: 0.26 },
              0.3,
            )
            // Impact: the drop squashes flat…
            .to(".ah-drop", { scaleY: 0.25, scaleX: 1.6, autoAlpha: 0, ease: "power2.in", duration: 0.08 }, 0.5)
            // …throws rings…
            .fromTo(
              ".ah-ring",
              { scale: 0.04, autoAlpha: 0.9 },
              { scale: 1, autoAlpha: 0, ease: "power2.out", stagger: 0.06, duration: 0.42 },
              0.5,
            )
            // …and a small crown splash, two droplets up and back down.
            .fromTo(
              ".ah-splash-l",
              { x: 0, y: 0, autoAlpha: 0.95, scale: 0.7 },
              { x: -46, y: -58, autoAlpha: 0.6, ease: "power2.out", duration: 0.14 },
              0.5,
            )
            .to(".ah-splash-l", { y: 26, autoAlpha: 0, ease: "power2.in", duration: 0.16 }, 0.64)
            .fromTo(
              ".ah-splash-r",
              { x: 0, y: 0, autoAlpha: 0.95, scale: 0.55 },
              { x: 52, y: -44, autoAlpha: 0.6, ease: "power2.out", duration: 0.13 },
              0.51,
            )
            .to(".ah-splash-r", { y: 22, autoAlpha: 0, ease: "power2.in", duration: 0.15 }, 0.64)

            // The water settles and sinks to the bottom edge — handing the
            // scroll to the next act.
            .to(
              ".ah-water-event",
              { y: () => pin.offsetHeight * 0.44, ease: "power1.inOut", duration: 0.34 },
              0.62,
            )
            .to(".ah-surface", { opacity: 0.25, ease: "none", duration: 0.3 }, 0.66);
        },
      );
    }, root);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section ref={rootRef}>
      <div
        ref={pinRef}
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
              "linear-gradient(180deg, oklch(0.16 0.012 60 / 0.55) 0%, oklch(0.16 0.012 60 / 0.92) 100%)",
          }}
        />

        {/* ── Water event, centred in the viewport ─────────────────────── */}
        <div
          aria-hidden
          className="ah-water-event pointer-events-none absolute inset-x-0 top-[52%] z-[5] flex justify-center will-change-transform"
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
                <path d="M 8 1 Q 2 14 8 22 Q 14 14 8 1 Z" fill="var(--brand-rose)" />
              </svg>
            </span>
            {/* Crown-splash droplets */}
            {(["l", "r"] as const).map((side) => (
              <span
                key={side}
                className={`ah-splash-${side} absolute left-1/2 top-0 block h-3 w-2 -translate-x-1/2 opacity-0`}
              >
                <svg viewBox="0 0 16 24" className="h-full w-full">
                  <path d="M 8 1 Q 2 14 8 22 Q 14 14 8 1 Z" fill="var(--brand-rose)" />
                </svg>
              </span>
            ))}
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
      </div>
    </section>
  );
}
