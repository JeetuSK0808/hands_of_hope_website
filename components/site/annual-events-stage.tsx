"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Season = "winter" | "summer";

type AnnualEvent = {
  id: "awards" | "ripple";
  numeral: string;
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
    eyebrow: "Winter formal · Black tie optional",
    title: "Hands of Hope",
    italic: "Awards Ceremony",
    body: "Every winter we gather in a single ballroom to honor the students whose service hours, leadership, and quiet consistency carried the year. An emcee, a printed program, the trophy presentation, dinner, and a closing dance. The night belongs to the people who showed up.",
    image: "/general/award-ceremony-hi.jpg",
    alt: "Hands of Hope Awards Ceremony, students gathered in formalwear under stage light",
    accent: "var(--brand-navy)",
    season: "winter",
    meta: [
      { k: "When", v: "Annually · Every winter" },
      { k: "Format", v: "Black tie awards gala" },
      { k: "Open to", v: "Honorees · Families · Partners" },
    ],
    highlights: [
      { label: "Presentations", detail: "Award categories announced from the stage with printed program" },
      { label: "Honors", detail: "Service hours, leadership, and Founder's Award trophies" },
      { label: "Evening", detail: "Three-course dinner, live music, formal photographs" },
    ],
  },
  {
    id: "ripple",
    numeral: "II.",
    eyebrow: "Summer assembly · All hands welcome",
    title: "Ripple",
    italic: "for Change",
    body: "Every summer, students, volunteers, and partner families converge for one long afternoon of kit assembly. Long tables, color-coded supplies, music in the background, lunch on the house. Together we pack thousands of kits in a single sitting and ship them directly to community partners by week's end.",
    image: "/general/first-kit-packing.jpg",
    alt: "Hands of Hope volunteers packing kits at long tables during Ripple for Change",
    accent: "var(--brand-rose)",
    season: "summer",
    meta: [
      { k: "When", v: "Annually · Every summer" },
      { k: "Format", v: "All-day kit-packing assembly" },
      { k: "Open to", v: "Students · Families · Partners" },
    ],
    highlights: [
      { label: "Assembly", detail: "Long tables, supply stations, color-coded packing flow" },
      { label: "Output", detail: "Thousands of kits packed in a single sitting" },
      { label: "Delivery", detail: "Shipped to partner shelters and schools within the week" },
    ],
  },
];

function WinterMotif({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <g
        fill="none"
        stroke={accent}
        strokeWidth="0.45"
        strokeLinecap="round"
        className="ae-motif-stroke"
      >
        <line x1="50" y1="6" x2="50" y2="94" />
        <line x1="6" y1="50" x2="94" y2="50" />
        <line x1="18" y1="18" x2="82" y2="82" />
        <line x1="82" y1="18" x2="18" y2="82" />
        <line x1="50" y1="14" x2="42" y2="22" />
        <line x1="50" y1="14" x2="58" y2="22" />
        <line x1="50" y1="86" x2="42" y2="78" />
        <line x1="50" y1="86" x2="58" y2="78" />
        <line x1="14" y1="50" x2="22" y2="42" />
        <line x1="14" y1="50" x2="22" y2="58" />
        <line x1="86" y1="50" x2="78" y2="42" />
        <line x1="86" y1="50" x2="78" y2="58" />
        <circle cx="50" cy="50" r="6" />
      </g>
    </svg>
  );
}

function SummerMotif({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <g fill="none" stroke={accent} strokeWidth="0.45" className="ae-motif-stroke">
        <circle cx="50" cy="50" r="8" />
        <circle cx="50" cy="50" r="18" strokeDasharray="0.8 1.2" />
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="42" strokeDasharray="0.4 1.6" />
      </g>
      <g stroke={accent} strokeWidth="0.5" strokeLinecap="round" className="ae-motif-stroke">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          const x1 = 50 + Math.cos(angle) * 46;
          const y1 = 50 + Math.sin(angle) * 46;
          const x2 = 50 + Math.cos(angle) * 50;
          const y2 = 50 + Math.sin(angle) * 50;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          );
        })}
      </g>
    </svg>
  );
}

export function AnnualEventsStage() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".ae-rise").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            delay: i * 0.05,
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".ae-headline-word").forEach((el, i) => {
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

      gsap.utils.toArray<HTMLElement>(".ae-scene").forEach((scene, sceneIdx) => {
        const image = scene.querySelector<HTMLImageElement>(".ae-scene-image img");
        const cover = scene.querySelector<HTMLElement>(".ae-scene-cover");
        const numeral = scene.querySelectorAll<HTMLElement>(".ae-numeral-char");
        const eyebrow = scene.querySelector<HTMLElement>(".ae-scene-eyebrow");
        const titleWords = scene.querySelectorAll<HTMLElement>(".ae-title-word");
        const body = scene.querySelector<HTMLElement>(".ae-body");
        const metaItems = scene.querySelectorAll<HTMLElement>(".ae-meta-item");
        const highlightRows = scene.querySelectorAll<HTMLElement>(".ae-highlight");
        const corners = scene.querySelectorAll<HTMLElement>(".ae-corner");
        const motif = scene.querySelector<HTMLElement>(".ae-motif");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        });

        if (cover) {
          tl.fromTo(
            cover,
            { scaleX: 1, transformOrigin: sceneIdx % 2 === 0 ? "right center" : "left center" },
            { scaleX: 0, duration: 1.05, ease: "power3.inOut" }
          );
        }

        if (image) {
          tl.fromTo(
            image,
            { scale: 1.22, filter: "blur(10px)" },
            { scale: 1, filter: "blur(0px)", duration: 1.6, ease: "power3.out" },
            "-=0.85"
          );
        }

        if (corners.length) {
          tl.fromTo(
            corners,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              stagger: 0.06,
              ease: "back.out(1.8)",
            },
            "-=0.95"
          );
        }

        if (numeral.length) {
          tl.fromTo(
            numeral,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=0.7"
          );
        }

        if (eyebrow) {
          tl.fromTo(
            eyebrow,
            { x: -28, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            "-=0.85"
          );
        }

        if (titleWords.length) {
          tl.fromTo(
            titleWords,
            { yPercent: 120 },
            { yPercent: 0, duration: 1.1, stagger: 0.09, ease: "power3.out" },
            "-=0.75"
          );
        }

        if (body) {
          tl.fromTo(
            body,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
            "-=0.6"
          );
        }

        if (metaItems.length) {
          tl.fromTo(
            metaItems,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.09,
              ease: "power3.out",
            },
            "-=0.55"
          );
        }

        if (highlightRows.length) {
          tl.fromTo(
            highlightRows,
            { x: -18, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.6"
          );
        }

        if (motif) {
          const strokes = motif.querySelectorAll<SVGElement>(".ae-motif-stroke");
          strokes.forEach((g) => {
            const paths = g.querySelectorAll<SVGGeometryElement>("circle, line");
            paths.forEach((p) => {
              const len =
                typeof p.getTotalLength === "function" ? p.getTotalLength() : 200;
              p.style.strokeDasharray = String(len);
              p.style.strokeDashoffset = String(len);
            });
            tl.to(
              g.querySelectorAll("circle, line"),
              {
                strokeDashoffset: 0,
                duration: 1.6,
                stagger: 0.04,
                ease: "power3.out",
              },
              "-=1.4"
            );
          });
          tl.to(
            motif,
            { rotation: 12, duration: 4, ease: "power1.out" },
            "-=1.6"
          );
        }
      });

      gsap.fromTo(
        ".ae-spine",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.6,
          },
        }
      );

      gsap.to(".ae-marquee-track", {
        xPercent: -50,
        duration: 60,
        ease: "none",
        repeat: -1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="stage"
      ref={rootRef}
      className="relative w-full overflow-hidden border-t border-border"
    >
      {/* Section heading */}
      <div className="relative mx-auto w-full max-w-[88rem] px-6 md:px-12 pt-28 md:pt-40 pb-10">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <div className="ae-rise editorial-rule editorial-eyebrow text-muted-foreground inline-flex items-center gap-3">
              <span>The calendar</span>
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--brand-rose)" }}
              />
              <span className="text-muted-foreground/70 normal-case tracking-normal text-[0.65rem] italic font-display">
                · two seasons, two stages
              </span>
            </div>
            <h2 className="mt-8 editorial-display text-[clamp(2.5rem,7vw,6rem)] max-w-4xl">
              <span className="impact-headline-mask">
                <span className="ae-headline-word inline-block">A</span>
              </span>{" "}
              <span className="impact-headline-mask">
                <span className="ae-headline-word inline-block italic" style={{ color: "var(--brand-navy)" }}>
                  winter
                </span>
              </span>{" "}
              <span className="impact-headline-mask">
                <span className="ae-headline-word inline-block">for</span>
              </span>{" "}
              <span className="impact-headline-mask">
                <span className="ae-headline-word inline-block">the</span>
              </span>{" "}
              <span className="impact-headline-mask">
                <span className="ae-headline-word inline-block">honor.</span>
              </span>
              <br />
              <span className="impact-headline-mask">
                <span className="ae-headline-word inline-block">A</span>
              </span>{" "}
              <span className="impact-headline-mask">
                <span className="ae-headline-word inline-block italic" style={{ color: "var(--brand-rose)" }}>
                  summer
                </span>
              </span>{" "}
              <span className="impact-headline-mask">
                <span className="ae-headline-word inline-block">for</span>
              </span>{" "}
              <span className="impact-headline-mask">
                <span className="ae-headline-word inline-block">the</span>
              </span>{" "}
              <span className="impact-headline-mask">
                <span className="ae-headline-word inline-block">work.</span>
              </span>
            </h2>
          </div>
          <p className="ae-rise max-w-md text-muted-foreground md:text-right md:self-end leading-relaxed">
            One night a year we step back and recognize. One day a year we
            roll up our sleeves and pack. The rest of the calendar follows
            from these two anchors.
          </p>
        </div>
      </div>

      {/* Vertical spine connecting the two scenes */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[clamp(28rem,40vh,46rem)] hidden h-[calc(100%-32rem)] w-px -translate-x-1/2 lg:block"
        style={{ background: "var(--border)" }}
      />
      <div
        aria-hidden
        className="ae-spine pointer-events-none absolute left-1/2 top-[clamp(28rem,40vh,46rem)] hidden h-[calc(100%-32rem)] w-px -translate-x-1/2 origin-top lg:block"
        style={{ background: "var(--foreground)", opacity: 0.25 }}
      />

      <div className="relative mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-28">
        <div className="flex flex-col gap-24 md:gap-40">
          {EVENTS.map((ev, idx) => (
            <article
              key={ev.id}
              className="ae-scene relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:items-center"
              data-season={ev.season}
            >
              {/* Image column */}
              <div
                className={
                  "ae-scene-image relative isolate aspect-[4/5] w-full overflow-hidden " +
                  (idx % 2 === 0 ? "lg:order-1" : "lg:order-2")
                }
              >
                <Image
                  src={ev.image}
                  alt={ev.alt}
                  fill
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover"
                />
                <div className="tint-overlay" aria-hidden />
                <div
                  aria-hidden
                  className="absolute inset-0 mix-blend-soft-light"
                  style={{
                    background: `radial-gradient(ellipse at 30% 70%, ${ev.accent} 0%, transparent 60%)`,
                    opacity: 0.55,
                  }}
                />
                <div
                  className="ae-scene-cover pointer-events-none absolute inset-0 z-10"
                  style={{ background: "var(--background)", transform: "scaleX(1)", transformOrigin: idx % 2 === 0 ? "right center" : "left center" }}
                  aria-hidden
                />

                <span className="ae-corner pointer-events-none absolute left-5 top-5 z-20 h-8 w-8 border-l border-t border-white/65" aria-hidden />
                <span className="ae-corner pointer-events-none absolute right-5 top-5 z-20 h-8 w-8 border-r border-t border-white/65" aria-hidden />
                <span className="ae-corner pointer-events-none absolute left-5 bottom-5 z-20 h-8 w-8 border-l border-b border-white/65" aria-hidden />
                <span className="ae-corner pointer-events-none absolute right-5 bottom-5 z-20 h-8 w-8 border-r border-b border-white/65" aria-hidden />

                <div className="absolute bottom-6 left-6 z-20 inline-flex items-center gap-3 border border-white/40 bg-foreground/30 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.32em] text-white backdrop-blur-sm">
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full"
                    style={{ background: ev.accent }}
                  />
                  {ev.season === "winter" ? "Winter" : "Summer"}
                </div>

                {/* Seasonal motif overlay */}
                <div
                  className="ae-motif pointer-events-none absolute -right-12 -bottom-12 z-20 h-48 w-48 opacity-80"
                  style={{ willChange: "transform" }}
                  aria-hidden
                >
                  {ev.season === "winter" ? (
                    <WinterMotif accent="#ffffff" />
                  ) : (
                    <SummerMotif accent="#ffffff" />
                  )}
                </div>
              </div>

              {/* Content column */}
              <div className={idx % 2 === 0 ? "lg:order-2" : "lg:order-1"}>
                <div
                  className="ae-scene-eyebrow editorial-rule editorial-eyebrow text-muted-foreground inline-flex items-center gap-3"
                >
                  {ev.eyebrow}
                </div>

                <div className="mt-8 flex font-display text-7xl md:text-8xl font-light italic leading-none text-foreground/70">
                  {ev.numeral.split("").map((c, i) => (
                    <span
                      key={i}
                      className="inline-block overflow-hidden align-bottom"
                    >
                      <span className="ae-numeral-char inline-block" style={{ color: ev.accent }}>
                        {c}
                      </span>
                    </span>
                  ))}
                </div>

                <h3 className="mt-6 editorial-display leading-[1.04] pb-2 text-[clamp(2.5rem,5.5vw,4.75rem)]">
                  {ev.title.split(" ").map((w, i, arr) => (
                    <span key={i} className="inline-block overflow-hidden align-bottom">
                      <span className="ae-title-word inline-block">
                        {w}
                        {i < arr.length - 1 ? " " : ""}
                      </span>
                    </span>
                  ))}{" "}
                  <span className="inline-block overflow-hidden align-bottom">
                    <span className="ae-title-word inline-block italic" style={{ color: ev.accent }}>
                      {ev.italic}
                    </span>
                  </span>
                </h3>

                <p className="ae-body mt-8 max-w-xl text-base md:text-lg text-foreground/80 leading-relaxed">
                  {ev.body}
                </p>

                <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-3 max-w-xl text-sm">
                  {ev.meta.map((m) => (
                    <div key={m.k} className="ae-meta-item">
                      <dt className="editorial-eyebrow text-muted-foreground">
                        {m.k}
                      </dt>
                      <dd className="mt-2 text-foreground">{m.v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-10 max-w-xl border-t border-border pt-8">
                  <div className="editorial-eyebrow text-muted-foreground">
                    What the night looks like
                  </div>
                  <ul className="mt-5 space-y-4">
                    {ev.highlights.map((h, i) => (
                      <li
                        key={h.label}
                        className="ae-highlight flex items-start gap-5"
                      >
                        <span
                          className="font-display text-xl italic shrink-0"
                          style={{ color: ev.accent }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className="font-medium text-foreground">
                            {h.label}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {h.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Closing marquee */}
      <div className="relative border-t border-border bg-background py-7 overflow-hidden marquee-mask">
        <div className="ae-marquee-track flex w-max items-center gap-12 whitespace-nowrap font-display text-2xl md:text-3xl italic font-light text-foreground/45">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            [
              "Winter awards",
              "Summer assembly",
              "Service honored",
              "Kits packed",
              "Partners welcomed",
              "Hands of Hope",
            ].map((w) => (
              <span key={`${k}-${w}`} className="flex items-center gap-12">
                {w}
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
