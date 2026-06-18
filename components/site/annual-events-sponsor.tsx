"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Tier = {
  id: "drop" | "ripple" | "wave";
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
    id: "drop",
    ordinal: "I.",
    prefix: "The",
    italic: "Drop",
    position: "Local partner",
    range: "Suggested · $2,500",
    blurb:
      "Where every chapter begins. One name on the program, one seat held at the winter table, and a steady line back to the work for the rest of the year.",
    callout: "One event. One name. A foothold in the room.",
    benefits: [
      "Logo placement on the printed program and lobby signage at one event",
      "Sponsor acknowledgement from the stage during opening remarks",
      "Two reserved seats at the Awards Ceremony with a dedicated host for the evening",
      "Quarterly impact note from the founders — what your name made possible this season",
      "Welcome packet with lapel pin, signed thank-you card, and the season program",
    ],
    accent: "var(--brand-navy)",
  },
  {
    id: "ripple",
    ordinal: "II.",
    prefix: "The",
    italic: "Ripple",
    position: "Presenting sponsor",
    range: "Suggested · $10,000",
    blurb:
      "Your name spreads outward. Lead billing on one of the two nights, a short film cut from the season, and rings of recognition that reach every partner family in the network.",
    callout: "One night, top billing. A story that travels.",
    benefits: [
      "Lead naming on one of the two annual nights — “Presented by [Your Name]”",
      "Full-page placement in the printed program and primary banner on the event microsite",
      "A bespoke sixty-second social film, produced during the campaign window",
      "Eight reserved seats and a curated table at the gala, hosted by a board member",
      "A named scholarship category announced and presented from the stage",
      "Private tour of an active kit-packing line with the operations team",
    ],
    accent: "var(--brand-rose)",
  },
  {
    id: "wave",
    ordinal: "III.",
    prefix: "The",
    italic: "Wave Maker",
    position: "Title sponsor",
    range: "Suggested · $35,000+",
    blurb:
      "The room turns. Top billing across both nights, a year of co-authored storytelling, and a kit drive that ships under your name to the communities you choose.",
    callout: "Both nights. A film. A drive shipped under your name.",
    benefits: [
      "Top billing across both annual nights — “In partnership with [Your Name]”",
      "Marquee placement on the save-the-date, citywide outdoor placements, and the full press kit",
      "A co-produced three-minute documentary short, released across the season",
      "Sixteen reserved seats and a private after-party suite at the gala",
      "Founders’ table at both events, plus a quiet dinner with the executive team",
      "Year-round inclusion on every press release and on the partner masthead",
      "A named summer kit drive — choose the community, we ship under your banner",
    ],
    accent: "var(--brand-navy)",
  },
];

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

function DropMotif({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <line
        x1="14"
        y1="68"
        x2="86"
        y2="68"
        stroke={accent}
        strokeWidth="0.5"
        opacity="0.45"
        strokeDasharray="0.8 1.4"
      />
      <g fill="none" stroke={accent} strokeWidth="0.55">
        <circle cx="50" cy="68" r="1" data-motif-drop-ring opacity="0" />
        <circle cx="50" cy="68" r="1" data-motif-drop-ring opacity="0" />
      </g>
      <path
        d="M 50 18 Q 46 32 50 40 Q 54 32 50 18 Z"
        fill={accent}
        data-motif-drop
        opacity="0"
      />
      <circle cx="50" cy="68" r="1.4" fill={accent} />
    </svg>
  );
}

function RippleMotif({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <g fill="none" strokeWidth="0.6">
        <circle cx="50" cy="50" r="1" stroke={accent} data-motif-ripple-ring opacity="0" />
        <circle cx="50" cy="50" r="1" stroke="var(--brand-navy)" data-motif-ripple-ring opacity="0" />
        <circle cx="50" cy="50" r="1" stroke={accent} data-motif-ripple-ring opacity="0" />
        <circle cx="50" cy="50" r="1" stroke="var(--brand-navy-soft)" data-motif-ripple-ring opacity="0" />
      </g>
      <circle cx="50" cy="50" r="1.6" fill={accent} />
    </svg>
  );
}

function WaveMotif({ accent }: { accent: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        className="absolute inset-y-0 left-0 h-full w-[200%]"
        data-motif-wave
      >
        <path
          d="M0 36 Q12.5 20 25 36 T50 36 T75 36 T100 36 T125 36 T150 36 T175 36 T200 36"
          fill="none"
          stroke={accent}
          strokeWidth="0.9"
          opacity="0.85"
        />
        <path
          d="M0 56 Q12.5 40 25 56 T50 56 T75 56 T100 56 T125 56 T150 56 T175 56 T200 56"
          fill="none"
          stroke={accent}
          strokeWidth="0.7"
          opacity="0.55"
        />
        <path
          d="M0 76 Q12.5 60 25 76 T50 76 T75 76 T100 76 T125 76 T150 76 T175 76 T200 76"
          fill="none"
          stroke={accent}
          strokeWidth="0.5"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}

const NARRATIVE = [
  {
    n: "01",
    color: "var(--brand-navy)",
    title: "The drop lands.",
    body:
      "A sponsor signs. A logo finds its place on the printed program. A student, somewhere across the chapter network, is handed a folder with your name pressed onto the back of it.",
  },
  {
    n: "02",
    color: "var(--brand-rose)",
    title: "The ripple spreads.",
    body:
      "Two nights move through the year. A short film tours the region. Three thousand kits ship out with a thank-you card that carries your name into kitchens, classrooms, and quiet weekends.",
  },
  {
    n: "03",
    color: "var(--brand-navy)",
    title: "The wave returns.",
    body:
      "Years later, an alum mentions your company on a panel. A grant gets approved because we listed you. A volunteer chooses a career because of a card she still has. The first drop is still moving.",
  },
];

export function AnnualEventsSponsor() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const tierStackRef = React.useRef<HTMLDivElement>(null);
  const dropRef = React.useRef<HTMLDivElement>(null);
  const pondRef = React.useRef<HTMLDivElement>(null);
  const [notice, setNotice] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // ─── Rise reveals ───
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
          }
        );
      });

      // ─── Headline word reveal ───
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
          }
        );
      });

      // ─── Narrative step reveals ───
      gsap.utils.toArray<HTMLElement>(".sp-step").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      // ─── Pond illustration loop ───
      const pond = pondRef.current;
      if (pond) {
        const pondDrop = pond.querySelector<SVGElement>("[data-pond-drop]");
        const pondRings = pond.querySelectorAll<SVGCircleElement>(
          "[data-pond-ring]"
        );

        if (pondDrop) {
          gsap
            .timeline({ repeat: -1 })
            .set(pondDrop, { y: 0, opacity: 0 })
            .to(pondDrop, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.4)
            .to(
              pondDrop,
              { y: 56, duration: 1.0, ease: "power2.in" },
              "<0.05"
            )
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
              "<"
            );
        });
      }

      // ─── Tier motif loops ───
      gsap.utils.toArray<HTMLElement>(".tier-card").forEach((card) => {
        const tierId = card.dataset.tier;
        if (tierId === "drop") {
          const md = card.querySelector<SVGElement>("[data-motif-drop]");
          const mr = card.querySelectorAll<SVGCircleElement>(
            "[data-motif-drop-ring]"
          );
          if (md) {
            gsap
              .timeline({ repeat: -1 })
              .set(md, { y: 0, opacity: 0 })
              .to(md, { opacity: 1, duration: 0.25 }, 0.4)
              .to(md, { y: 22, duration: 0.9, ease: "power2.in" }, "<0.05")
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
                "<"
              );
          });
        } else if (tierId === "ripple") {
          const mr = card.querySelectorAll<SVGCircleElement>(
            "[data-motif-ripple-ring]"
          );
          mr.forEach((ring, i) => {
            gsap
              .timeline({ repeat: -1, delay: i * 0.7 })
              .set(ring, { attr: { r: 1 }, opacity: 0 })
              .to(ring, { opacity: 0.7, duration: 0.3 })
              .to(
                ring,
                { attr: { r: 42 }, opacity: 0, duration: 3.2, ease: "power2.out" },
                "<"
              );
          });
        } else if (tierId === "wave") {
          const mw = card.querySelector<SVGElement>("[data-motif-wave]");
          if (mw) {
            gsap.to(mw, {
              xPercent: -50,
              duration: 14,
              ease: "none",
              repeat: -1,
            });
          }
        }
      });

      // ─── Tier card reveals on scroll ───
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
            0
          );
        if (motif)
          tl.fromTo(
            motif,
            { scale: 0.6, opacity: 0, rotate: -6 },
            { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: "back.out(1.4)" },
            "-=0.55"
          );
        if (meta.length)
          tl.fromTo(
            meta,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.06,
            },
            "-=0.75"
          );
        if (title.length)
          tl.fromTo(
            title,
            { yPercent: 120 },
            {
              yPercent: 0,
              duration: 1,
              ease: "power3.out",
              stagger: 0.08,
            },
            "-=0.65"
          );
        if (body)
          tl.fromTo(
            body,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
            "-=0.65"
          );
        if (calloutRule)
          tl.fromTo(
            calloutRule,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.8, ease: "power3.out" },
            "-=0.7"
          );
        if (callout)
          tl.fromTo(
            callout,
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
            "-=0.6"
          );
        if (benefits.length)
          tl.fromTo(
            benefits,
            { x: -16, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.07,
              ease: "power3.out",
            },
            "-=0.5"
          );
      });

      // ─── Spine drop scroll-driven travel ───
      const stack = tierStackRef.current;
      const drop = dropRef.current;
      if (stack && drop) {
        gsap.set(drop, { y: 0, scale: 0.85 });
        gsap.to(drop, {
          y: () => stack.offsetHeight - 28,
          scale: 1.45,
          ease: "none",
          scrollTrigger: {
            trigger: stack,
            start: "top 72%",
            end: "bottom 70%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

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
                · three depths, one current
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
            Sponsorship is not signage. It is a small, deliberate
            disturbance — a name placed in still water — that becomes a
            ring, then a wave, that reaches students you will never meet
            by name.
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
                href="mailto:info@handsofhopeoutreach.com?subject=Sponsorship%20inquiry"
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

          {/* Right column: tier stack with traveling drop */}
          <div className="relative">
            <div ref={tierStackRef} className="relative pl-10 md:pl-14">
              {/* Spine line */}
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

              {/* Traveling drop */}
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

              {/* Tier cards */}
              <div className="grid gap-20 md:gap-28">
                {TIERS.map((tier) => (
                  <article
                    key={tier.id}
                    className="tier-card relative"
                    data-tier={tier.id}
                  >
                    {/* Spine marker — sits on the vertical line at the container's left edge */}
                    <span
                      aria-hidden
                      className="tier-marker pointer-events-none absolute top-7 -left-10 md:-left-14 inline-flex h-2.5 w-2.5 rotate-45"
                      style={{
                        marginLeft: "-5px",
                        background: tier.accent,
                      }}
                    />

                    {/* Header */}
                    <header className="grid grid-cols-[auto_1fr] items-start gap-6 md:gap-8">
                      <div
                        className="tier-motif relative h-24 w-24 md:h-28 md:w-28 shrink-0 overflow-hidden border border-border"
                        style={{ background: "oklch(0.985 0.004 80)" }}
                      >
                        {tier.id === "drop" && <DropMotif accent={tier.accent} />}
                        {tier.id === "ripple" && <RippleMotif accent={tier.accent} />}
                        {tier.id === "wave" && <WaveMotif accent={tier.accent} />}
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
