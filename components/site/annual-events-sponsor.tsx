"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type TierId = "droplet" | "ripple" | "wave-maker" | "tide-turner";

type Tier = {
  id: TierId;
  ordinal: string;
  prefix: string;
  italic: string;
  position: string;
  range: string;
  blurb: string;
  callout: string;
  benefits: string[];
  accent: string;
};

const TIERS: Tier[] = [
  {
    id: "droplet",
    ordinal: "I.",
    prefix: "The",
    italic: "Droplet",
    position: "Local partner",
    range: "Suggested · $500",
    blurb:
      "Where it starts. One name on the program, one seat held at the winter table, and a steady line back to the work for the rest of the year.",
    callout: "One event. One name. A foothold in the room.",
    benefits: [
      "Logo placement on the printed program and lobby signage at one event",
      "Sponsor acknowledgement from the stage during opening remarks",
      "Two reserved seats at the Awards Ceremony with a host for the evening",
      "Quarterly impact note from the founders on what your name made possible this season",
      "Welcome packet with lapel pin, signed thank-you card, and the season program",
    ],
    accent: "var(--brand-navy-soft)",
  },
  {
    id: "ripple",
    ordinal: "II.",
    prefix: "The",
    italic: "Ripple",
    position: "Presenting sponsor",
    range: "Suggested · $1,000",
    blurb:
      "Your name spreads outward. Lead billing on one of the two dates, a short film cut from the season, and rings of recognition that reach every partner family in the network.",
    callout: "One date, top billing. A story that travels.",
    benefits: [
      "Lead naming on one of the two annual dates: “Presented by [Your Name]”",
      "Full-page placement in the printed program and primary banner on the event page",
      "A bespoke sixty-second social film, produced during the campaign window",
      "Eight reserved seats and a curated table at the ceremony",
      "A named award category announced and presented from the stage",
      "Private tour of an active kit-packing line with the operations team",
    ],
    accent: "var(--brand-rose)",
  },
  {
    id: "wave-maker",
    ordinal: "III.",
    prefix: "The",
    italic: "Wave Maker",
    position: "Title sponsor",
    range: "Suggested · $3,000",
    blurb:
      "The room turns. Top billing across both dates, a year of co-authored storytelling, and a kit drive that ships under your name to the communities you choose.",
    callout: "Both dates. A film. A drive shipped under your name.",
    benefits: [
      "Top billing across both annual dates: “In partnership with [Your Name]”",
      "Marquee placement on the save-the-date, outdoor placements, and the full press kit",
      "A co-produced three-minute documentary short, released across the season",
      "Sixteen reserved seats and a private suite at the ceremony",
      "Founders’ table at both events, plus a dinner with the executive team",
      "Year-round inclusion on every press release and on the partner masthead",
      "A named spring kit drive: choose the community, and we ship under your banner",
    ],
    accent: "var(--brand-navy)",
  },
  {
    id: "tide-turner",
    ordinal: "IV.",
    prefix: "The",
    italic: "Tide Turner",
    position: "Founding benefactor",
    range: "Suggested · $10,000",
    blurb:
      "The water level itself moves. At this depth a sponsorship stops funding events and starts funding branches: new schools onboarded, new causes taken up, students who would never otherwise have had a way in.",
    callout: "Not a night. A year, and the branches it opens.",
    benefits: [
      "Everything in The Wave Maker, held across a full multi-year commitment",
      "A named branch cohort: new chapters onboarded under your name, with their causes chosen by the students who run them",
      "Founding benefactor listing on the organization masthead and in the annual report",
      "A named endowment line for the STEM Together program across every branch that runs it",
      "Seat at the annual planning session where the Ripple for Change theme is set",
      "Two documentary films, one on the season and one on a branch you help open",
      "Standing invitation to every event in the calendar, for your whole team",
    ],
    accent: "var(--brand-rose)",
  },
];

const NARRATIVE = [
  {
    n: "01",
    color: "var(--brand-navy-soft)",
    title: "The drop lands.",
    body: "A sponsor signs. A logo finds its place on the printed program. A student, somewhere in the network, is handed a folder with your name pressed onto the back of it.",
  },
  {
    n: "02",
    color: "var(--brand-rose)",
    title: "The ripple spreads.",
    body: "Two dates move through the year. A short film tours the region. Thousands of kits ship out with a thank-you card that carries your name into kitchens, classrooms, and quiet weekends.",
  },
  {
    n: "03",
    color: "var(--brand-navy)",
    title: "The wave builds.",
    body: "A branch that could not afford supplies runs its full year. A second school asks how to start one. The work stops depending on whether a given month went well.",
  },
  {
    n: "04",
    color: "var(--brand-rose)",
    title: "The tide turns.",
    body: "Years later, an alum mentions your company on a panel. A grant gets approved because we listed you. A volunteer chooses a career because of a card she still has. The first drop is still moving.",
  },
];

/* ── Tier motifs, escalating with the water ───────────────────────── */

function DropletMotif() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <line
        x1="12"
        y1="70"
        x2="88"
        y2="70"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.4"
        strokeDasharray="0.8 1.4"
      />
      <g fill="none" stroke="currentColor" strokeWidth="0.55">
        <circle cx="50" cy="70" r="1" data-motif-drop-ring opacity="0" />
        <circle cx="50" cy="70" r="1" data-motif-drop-ring opacity="0" />
      </g>
      <path
        d="M 50 18 Q 46 32 50 40 Q 54 32 50 18 Z"
        fill="currentColor"
        data-motif-drop
        opacity="0"
      />
      <circle cx="50" cy="70" r="1.4" fill="currentColor" />
    </svg>
  );
}

function RippleMotif() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <g fill="none" strokeWidth="0.6" stroke="currentColor">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx="50" cy="50" r="1" data-motif-ripple-ring opacity="0" />
        ))}
      </g>
      <circle cx="50" cy="50" r="1.6" fill="currentColor" />
    </svg>
  );
}

function WaveMakerMotif() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        className="absolute inset-y-0 left-0 h-full w-[200%]"
        data-motif-wave
      >
        {[
          { y: 34, w: 0.9, o: 0.9 },
          { y: 54, w: 0.7, o: 0.6 },
          { y: 74, w: 0.5, o: 0.38 },
        ].map((l) => (
          <path
            key={l.y}
            d={`M0 ${l.y} Q12.5 ${l.y - 16} 25 ${l.y} T50 ${l.y} T75 ${l.y} T100 ${l.y} T125 ${l.y} T150 ${l.y} T175 ${l.y} T200 ${l.y}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={l.w}
            opacity={l.o}
          />
        ))}
      </svg>
    </div>
  );
}

function TideTurnerMotif() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        {/* Low-water and high-water marks */}
        <line
          x1="6"
          y1="74"
          x2="94"
          y2="74"
          stroke="currentColor"
          strokeWidth="0.35"
          opacity="0.3"
          strokeDasharray="1 1.6"
        />
        <line
          x1="6"
          y1="34"
          x2="94"
          y2="34"
          stroke="currentColor"
          strokeWidth="0.35"
          opacity="0.3"
          strokeDasharray="1 1.6"
        />
        {/* The lunar pull */}
        <path
          d="M 18 26 A 34 34 0 0 1 82 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.45"
          data-motif-tide-arc
        />
        <circle cx="50" cy="14" r="2.6" fill="currentColor" opacity="0.6" data-motif-tide-moon />
        {/* The water body, which rises between the two marks */}
        <g data-motif-tide-body>
          <path
            d="M0 74 Q12.5 68 25 74 T50 74 T75 74 T100 74 L100 100 L0 100 Z"
            fill="currentColor"
            opacity="0.16"
          />
          <path
            d="M0 74 Q12.5 68 25 74 T50 74 T75 74 T100 74"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.8"
          />
        </g>
      </svg>
    </div>
  );
}

function PondIllustration({
  pondRef,
}: {
  pondRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={pondRef}
      className="sp-rise relative aspect-[5/4] w-full max-w-lg overflow-hidden border border-border"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.985 0.004 80) 0%, oklch(0.92 0.022 250 / 0.55) 100%)",
      }}
    >
      <svg viewBox="0 0 200 160" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="pondGlow" cx="50%" cy="58%" r="58%">
            <stop offset="0%" stopColor="var(--brand-rose)" stopOpacity="0.16" />
            <stop offset="65%" stopColor="var(--brand-rose)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="160" fill="url(#pondGlow)" />

        <line
          x1="0"
          y1="90"
          x2="200"
          y2="90"
          stroke="var(--brand-navy)"
          strokeWidth="0.25"
          opacity="0.4"
          strokeDasharray="0.8 1.6"
        />

        <g fill="none" strokeWidth="0.22" transform="translate(100 90)" opacity="0.2">
          {[20, 40, 60, 80].map((r) => (
            <circle key={r} r={r} stroke="var(--brand-navy)" />
          ))}
        </g>

        <g fill="none" strokeWidth="0.6" transform="translate(100 90)">
          <circle r="1" stroke="var(--brand-navy)" data-pond-ring opacity="0" />
          <circle r="1" stroke="var(--brand-rose)" data-pond-ring opacity="0" />
          <circle r="1" stroke="var(--brand-navy)" data-pond-ring opacity="0" />
          <circle r="1" stroke="var(--brand-rose-soft)" data-pond-ring opacity="0" />
          <circle r="1" stroke="var(--brand-navy-soft)" data-pond-ring opacity="0" />
        </g>

        <circle cx="100" cy="90" r="1.4" fill="var(--brand-navy)" />
        <circle cx="100" cy="90" r="0.5" fill="var(--brand-rose)" />

        <path
          d="M 100 14 Q 96 28 100 36 Q 104 28 100 14 Z"
          fill="var(--brand-rose)"
          data-pond-drop
          opacity="0"
        />

        <g fill="var(--brand-navy)" opacity="0.3">
          <circle cx="32" cy="118" r="0.5" />
          <circle cx="172" cy="120" r="0.4" />
          <circle cx="44" cy="138" r="0.3" />
          <circle cx="158" cy="142" r="0.5" />
        </g>
      </svg>

      <span aria-hidden className="absolute left-3 top-3 h-5 w-5 border-l border-t border-foreground/40" />
      <span aria-hidden className="absolute right-3 top-3 h-5 w-5 border-r border-t border-foreground/40" />
      <span aria-hidden className="absolute left-3 bottom-3 h-5 w-5 border-l border-b border-foreground/40" />
      <span aria-hidden className="absolute right-3 bottom-3 h-5 w-5 border-r border-b border-foreground/40" />

      <div className="absolute left-4 top-4">
        <div className="editorial-eyebrow text-foreground/55">Figure 01</div>
      </div>
      <div className="absolute right-4 bottom-4 text-right">
        <div className="font-display italic text-sm text-foreground/65">
          A name in still water
        </div>
      </div>
    </div>
  );
}

/**
 * Act III: sponsorship, as four depths of the same water.
 *
 * The tier stack is threaded by a scroll-scrubbed drop that grows as it
 * descends past each marker, so the reader physically watches a droplet become
 * a tide over the length of the section.
 */
export function AnnualEventsSponsor() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const tierStackRef = React.useRef<HTMLDivElement>(null);
  const dropRef = React.useRef<HTMLDivElement>(null);
  const pondRef = React.useRef<HTMLDivElement>(null);
  const [notice, setNotice] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(
          ".sp-rise, .sp-step, .tier-meta, .tier-title-word, .tier-body, .tier-callout, .tier-benefit, .tier-marker, .tier-motif",
          { clearProps: "all", autoAlpha: 1, y: 0, x: 0, yPercent: 0, scale: 1 },
        );
        gsap.set(".tier-callout-rule", { scaleX: 1 });
        return;
      }

      // ── Rise reveals ───
      gsap.utils.toArray<HTMLElement>(".sp-rise").forEach((el, i) => {
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
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".sp-headline-word").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.08 + i * 0.07,
            scrollTrigger: { trigger: el, start: "top 92%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".sp-step").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: "top 90%" },
          },
        );
      });

      // ── Pond illustration loop ───
      const pond = pondRef.current;
      if (pond) {
        const pondDrop = pond.querySelector<SVGElement>("[data-pond-drop]");
        const pondRings =
          pond.querySelectorAll<SVGCircleElement>("[data-pond-ring]");

        if (pondDrop) {
          gsap
            .timeline({ repeat: -1 })
            .set(pondDrop, { y: 0, opacity: 0 })
            .to(pondDrop, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.4)
            .to(pondDrop, { y: 56, duration: 1.0, ease: "power2.in" }, "<0.05")
            .to(pondDrop, { opacity: 0, duration: 0.15 })
            .to({}, { duration: 2.5 });
        }

        pondRings.forEach((ring, i) => {
          gsap
            .timeline({ repeat: -1, delay: i * 0.8 + 1.45 })
            .set(ring, { attr: { r: 1 }, opacity: 0 })
            .to(ring, { opacity: 0.65, duration: 0.3, ease: "power2.out" })
            .to(
              ring,
              { attr: { r: 92 }, opacity: 0, duration: 3.6, ease: "power2.out" },
              "<",
            );
        });
      }

      // ── Tier motif loops ───
      gsap.utils.toArray<HTMLElement>(".tier-card").forEach((card) => {
        const tierId = card.dataset.tier as TierId | undefined;

        if (tierId === "droplet") {
          const md = card.querySelector<SVGElement>("[data-motif-drop]");
          const mr = card.querySelectorAll<SVGCircleElement>(
            "[data-motif-drop-ring]",
          );
          if (md) {
            gsap
              .timeline({ repeat: -1 })
              .set(md, { y: 0, opacity: 0 })
              .to(md, { opacity: 1, duration: 0.25 }, 0.4)
              .to(md, { y: 24, duration: 0.9, ease: "power2.in" }, "<0.05")
              .to(md, { opacity: 0, duration: 0.15 })
              .to({}, { duration: 1.8 });
          }
          mr.forEach((ring, i) => {
            gsap
              .timeline({ repeat: -1, delay: 1.45 + i * 0.4 })
              .set(ring, { attr: { r: 1 }, opacity: 0 })
              .to(ring, { opacity: 0.65, duration: 0.25 })
              .to(
                ring,
                { attr: { r: 26 }, opacity: 0, duration: 2.2, ease: "power2.out" },
                "<",
              );
          });
        } else if (tierId === "ripple") {
          card
            .querySelectorAll<SVGCircleElement>("[data-motif-ripple-ring]")
            .forEach((ring, i) => {
              gsap
                .timeline({ repeat: -1, delay: i * 0.7 })
                .set(ring, { attr: { r: 1 }, opacity: 0 })
                .to(ring, { opacity: 0.7, duration: 0.3 })
                .to(
                  ring,
                  {
                    attr: { r: 42 },
                    opacity: 0,
                    duration: 3.2,
                    ease: "power2.out",
                  },
                  "<",
                );
            });
        } else if (tierId === "wave-maker") {
          const mw = card.querySelector<SVGElement>("[data-motif-wave]");
          if (mw) {
            gsap.to(mw, { xPercent: -50, duration: 14, ease: "none", repeat: -1 });
          }
        } else if (tierId === "tide-turner") {
          const body = card.querySelector<SVGElement>("[data-motif-tide-body]");
          const moon = card.querySelector<SVGElement>("[data-motif-tide-moon]");
          const arc = card.querySelector<SVGElement>("[data-motif-tide-arc]");
          // The whole water body rises to the high-water mark and falls back.
          if (body) {
            gsap.fromTo(
              body,
              { y: 0 },
              {
                y: -40,
                duration: 6,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              },
            );
          }
          if (moon) {
            gsap.fromTo(
              moon,
              { opacity: 0.35 },
              { opacity: 0.85, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 },
            );
          }
          if (arc) {
            const len =
              typeof (arc as unknown as SVGGeometryElement).getTotalLength ===
              "function"
                ? (arc as unknown as SVGGeometryElement).getTotalLength()
                : 200;
            gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(arc, {
              strokeDashoffset: 0,
              duration: 2.4,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 80%" },
            });
          }
        }
      });

      // ── Tier card reveals ───
      gsap.utils.toArray<HTMLElement>(".tier-card").forEach((card) => {
        const motif = card.querySelector<HTMLElement>(".tier-motif");
        const meta = card.querySelectorAll<HTMLElement>(".tier-meta");
        const title = card.querySelectorAll<HTMLElement>(".tier-title-word");
        const body = card.querySelector<HTMLElement>(".tier-body");
        const callout = card.querySelector<HTMLElement>(".tier-callout");
        const calloutRule = card.querySelector<HTMLElement>(".tier-callout-rule");
        const benefits = card.querySelectorAll<HTMLElement>(".tier-benefit");
        const marker = card.querySelector<HTMLElement>(".tier-marker");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        });

        if (marker)
          tl.fromTo(
            marker,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.8)" },
            0,
          );
        if (motif)
          tl.fromTo(
            motif,
            { scale: 0.6, opacity: 0, rotate: -6 },
            { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: "back.out(1.4)" },
            "-=0.55",
          );
        if (meta.length)
          tl.fromTo(
            meta,
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.06 },
            "-=0.75",
          );
        if (title.length)
          tl.fromTo(
            title,
            { yPercent: 120 },
            { yPercent: 0, duration: 1, ease: "power3.out", stagger: 0.08 },
            "-=0.65",
          );
        if (body)
          tl.fromTo(
            body,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
            "-=0.65",
          );
        if (calloutRule)
          tl.fromTo(
            calloutRule,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.8, ease: "power3.out" },
            "-=0.7",
          );
        if (callout)
          tl.fromTo(callout, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.6");
        if (benefits.length)
          tl.fromTo(
            benefits,
            { x: -16, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" },
            "-=0.5",
          );
      });

      // ── The drop that grows into a tide as it travels the stack ───
      const stack = tierStackRef.current;
      const drop = dropRef.current;
      if (stack && drop) {
        gsap.set(drop, { y: 0, scale: 0.7 });
        gsap.to(drop, {
          y: () => stack.offsetHeight - 28,
          scale: 1.9,
          ease: "none",
          scrollTrigger: {
            trigger: stack,
            start: "top 72%",
            end: "bottom 70%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // The water level itself rises up behind the stack on the same
        // journey, so by the time the reader reaches Tide Turner, the whole
        // ladder is standing in water.
        gsap.fromTo(
          ".ae-tide-water",
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: stack,
              start: "top 62%",
              end: "bottom 78%",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [prefersReduced]);

  React.useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleSponsorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setNotice(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setNotice(false), 6000);
  };

  return (
    <section
      id="sponsor"
      ref={rootRef}
      className="relative w-full overflow-hidden border-t border-border bg-card/40"
    >
      {/* Section heading */}
      <div className="relative mx-auto w-full max-w-[88rem] px-6 md:px-12 pt-28 md:pt-40 pb-10 md:pb-14">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr] md:items-end">
          <div>
            <div className="sp-rise editorial-rule editorial-eyebrow text-muted-foreground inline-flex items-center gap-3">
              <span>Become a sponsor</span>
              <span aria-hidden className="relative inline-flex h-1.5 w-1.5">
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--brand-navy)" }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full animate-ping-soft"
                  style={{ background: "var(--brand-navy)" }}
                />
              </span>
              <span className="text-muted-foreground/70 normal-case tracking-normal text-[0.65rem] italic font-display">
                · four depths, one current
              </span>
            </div>

            <h2 className="mt-8 editorial-display leading-[1.02] pb-2 text-[clamp(2.75rem,7.2vw,6.5rem)] max-w-[18ch]">
              <span className="impact-headline-mask">
                <span className="sp-headline-word inline-block">
                  A&nbsp;name&nbsp;dropped
                </span>
              </span>
              <br />
              <span className="impact-headline-mask">
                <span
                  className="sp-headline-word inline-block italic"
                  style={{ color: "var(--brand-navy)" }}
                >
                  in&nbsp;still&nbsp;water
                </span>
              </span>
              <br />
              <span className="impact-headline-mask">
                <span className="sp-headline-word inline-block">travels</span>
              </span>{" "}
              <span className="impact-headline-mask">
                <span
                  className="sp-headline-word inline-block italic"
                  style={{ color: "var(--brand-rose)" }}
                >
                  far.
                </span>
              </span>
            </h2>
          </div>
          <p className="sp-rise max-w-md text-muted-foreground md:text-right md:self-end leading-relaxed">
            Sponsorship is not signage. It is a small, deliberate disturbance, a
            name placed in still water, that becomes a ring, then a wave, then
            the level everything else sits at.
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-28 md:pb-36">
        <div className="grid gap-16 lg:grid-cols-[0.92fr_1.18fr] lg:gap-24">
          {/* Left column: pond + narrative + CTA */}
          <div className="relative">
            <PondIllustration pondRef={pondRef} />

            <div className="mt-14">
              <div className="sp-rise editorial-eyebrow text-muted-foreground">
                The reach of a single name
              </div>
              <ol className="mt-8 grid gap-9 max-w-md">
                {NARRATIVE.map((step) => (
                  <li
                    key={step.n}
                    className="sp-step grid grid-cols-[auto_1fr] gap-6 items-baseline"
                  >
                    <span
                      className="font-display text-3xl italic shrink-0 leading-none"
                      style={{ color: step.color }}
                    >
                      {step.n}
                    </span>
                    <div>
                      <div className="font-medium text-foreground text-lg">
                        {step.title}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* What the money is actually in the room for */}
            <figure className="sp-rise mt-14 max-w-md">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/general/michael.jpg"
                  alt="A Hands of Hope student raising the Ripple for Change banner above the venue"
                  fill
                  sizes="(min-width: 1024px) 32vw, 90vw"
                  className="object-cover"
                />
                {/* No scrim here: nothing is set over this photograph, and the
                    shot is already backlit, so the shared tint would crush the
                    banner into the roofline. A light vignette is enough to keep
                    the corner brackets legible. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.12 0.012 60 / 0.12) 0%, transparent 32%, transparent 70%, oklch(0.12 0.012 60 / 0.22) 100%)",
                  }}
                />
                <span aria-hidden className="absolute left-4 top-4 h-5 w-5 border-l border-t border-white/60" />
                <span aria-hidden className="absolute right-4 top-4 h-5 w-5 border-r border-t border-white/60" />
                <span aria-hidden className="absolute left-4 bottom-4 h-5 w-5 border-l border-b border-white/60" />
                <span aria-hidden className="absolute right-4 bottom-4 h-5 w-5 border-r border-b border-white/60" />
              </div>
              <figcaption className="mt-4 text-sm text-muted-foreground leading-relaxed">
                This is what a sponsorship buys: the room, the tables, and the
                students who fill both.
              </figcaption>
            </figure>

            <div className="sp-rise mt-14 flex flex-wrap items-center gap-7">
              <button
                type="button"
                onClick={handleSponsorClick}
                className="group inline-flex items-center gap-3 bg-foreground px-7 py-3.5 text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-90"
              >
                <span>Download the sponsorship packet</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="transition-transform duration-500 group-hover:translate-y-0.5"
                >
                  <path
                    d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <a
                href="mailto:info@handsofhopeoutreach.org?subject=Sponsorship%20inquiry"
                className="inline-flex items-center border-b border-foreground pb-1 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
              >
                Or email the team
              </a>
            </div>

            <div
              role="status"
              aria-live="polite"
              className={
                "mt-6 max-w-md border border-border bg-background px-5 py-4 text-sm leading-relaxed transition-all duration-500 " +
                (notice
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 -translate-y-2")
              }
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full"
                  style={{ background: "var(--brand-rose)" }}
                />
                <div>
                  <div className="font-medium text-foreground">
                    The sponsorship packet is in progress.
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    We are finalizing tiers and benefits. The PDF will appear
                    here as soon as it is ready. In the meantime, the team can
                    talk you through current options by email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: tier stack with the growing drop */}
          <div className="relative">
            <div ref={tierStackRef} className="relative pl-10 md:pl-14">
              {/* The rising tide. Sits behind everything in the stack;
                  translateY keeps the surface hairline crisp while the body
                  slides up inside the clipped wrapper. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-5 bottom-0 top-0 -z-10 overflow-hidden md:-inset-x-8"
              >
                <div
                  className="ae-tide-water absolute inset-0 will-change-transform"
                  style={{ transform: "translateY(100%)" }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: "var(--brand-rose)", opacity: 0.3 }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.28 0.075 255 / 0.055) 0%, oklch(0.28 0.075 255 / 0.02) 100%)",
                    }}
                  />
                </div>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 bottom-0 w-px"
                style={{ background: "var(--border)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-32 w-px"
                style={{ background: "var(--brand-navy)", opacity: 0.45 }}
              />

              <div
                ref={dropRef}
                aria-hidden
                className="pointer-events-none absolute z-10 will-change-transform"
                style={{ left: "-7px", top: "-12px" }}
              >
                <svg width="16" height="24" viewBox="0 0 16 24">
                  <defs>
                    <radialGradient id="dropGrad" cx="50%" cy="65%" r="55%">
                      <stop offset="0%" stopColor="var(--brand-rose)" stopOpacity="1" />
                      <stop offset="100%" stopColor="var(--brand-rose)" stopOpacity="0.55" />
                    </radialGradient>
                  </defs>
                  <path d="M 8 0 Q 2 14 8 22 Q 14 14 8 0 Z" fill="url(#dropGrad)" />
                </svg>
              </div>

              <div className="grid gap-20 md:gap-28">
                {TIERS.map((tier) => (
                  <article
                    key={tier.id}
                    className="tier-card relative"
                    data-tier={tier.id}
                  >
                    <span
                      aria-hidden
                      className="tier-marker pointer-events-none absolute top-7 -left-10 md:-left-14 inline-flex h-2.5 w-2.5 rotate-45"
                      style={{ marginLeft: "-5px", background: tier.accent }}
                    />

                    <header className="grid grid-cols-[auto_1fr] items-start gap-6 md:gap-8">
                      <div
                        className="tier-motif relative h-24 w-24 md:h-28 md:w-28 shrink-0 overflow-hidden border border-border"
                        style={{
                          background: "oklch(0.985 0.004 80)",
                          color: tier.accent,
                        }}
                      >
                        {tier.id === "droplet" && <DropletMotif />}
                        {tier.id === "ripple" && <RippleMotif />}
                        {tier.id === "wave-maker" && <WaveMakerMotif />}
                        {tier.id === "tide-turner" && <TideTurnerMotif />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                          <span className="tier-meta font-display text-3xl md:text-4xl italic text-foreground/40 leading-none">
                            {tier.ordinal}
                          </span>
                          <span className="tier-meta editorial-eyebrow text-muted-foreground">
                            {tier.position}
                          </span>
                          <span aria-hidden className="tier-meta text-muted-foreground/50">
                            ·
                          </span>
                          <span className="tier-meta editorial-eyebrow text-foreground/55">
                            {tier.range}
                          </span>
                        </div>
                        <h3 className="mt-4 editorial-display leading-[1.02] pb-1 text-[clamp(2.25rem,4.4vw,4rem)]">
                          <span className="inline-block overflow-hidden align-bottom">
                            <span className="tier-title-word inline-block">
                              {tier.prefix}
                            </span>
                          </span>{" "}
                          <span className="inline-block overflow-hidden align-bottom">
                            <span
                              className="tier-title-word inline-block italic"
                              style={{ color: tier.accent }}
                            >
                              {tier.italic}
                            </span>
                          </span>
                        </h3>
                      </div>
                    </header>

                    <p className="tier-body mt-7 max-w-2xl text-base md:text-lg text-foreground/80 leading-relaxed">
                      {tier.blurb}
                    </p>

                    <div className="tier-callout mt-8 flex items-center gap-5">
                      <span
                        aria-hidden
                        className="tier-callout-rule h-px w-14 block"
                        style={{ background: tier.accent }}
                      />
                      <span className="font-display text-lg md:text-xl italic text-foreground/75">
                        &ldquo;{tier.callout}&rdquo;
                      </span>
                    </div>

                    <ul className="mt-10 grid gap-5">
                      {tier.benefits.map((b, i) => (
                        <li
                          key={b}
                          className="tier-benefit grid grid-cols-[auto_1fr] items-baseline gap-5 text-sm md:text-base"
                        >
                          <span
                            className="font-display text-base md:text-lg italic shrink-0 leading-none"
                            style={{ color: tier.accent }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-foreground/85 leading-relaxed">
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
