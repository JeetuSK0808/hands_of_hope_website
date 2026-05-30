"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Event = {
  id: "awards" | "ripple";
  number: string;
  numberDisplay: string;
  eyebrow: string;
  title: string;
  italic: string;
  body: string;
  image: string;
  alt: string;
  accent: string;
  meta: { k: string; v: string }[];
};

const EVENTS: Event[] = [
  {
    id: "awards",
    number: "01",
    numberDisplay: "I.",
    eyebrow: "Annual evening · Spring",
    title: "Hands of Hope",
    italic: "Awards Ceremony",
    body: "Every year we pause to celebrate the students whose service hours, leadership, and steady presence reshape the communities around them. Recognition includes meaningful service hours, national honors, and a night dedicated to the people who showed up.",
    image: "/general/award-ceremony-hi.jpg",
    alt: "Students gathered at the Hands of Hope Awards Ceremony",
    accent: "var(--brand-rose)",
    meta: [
      { k: "When", v: "Annually · Spring" },
      { k: "Honors", v: "Service · Leadership · Impact" },
      { k: "Format", v: "Awards · Dinner · Live music" },
    ],
  },
  {
    id: "ripple",
    number: "02",
    numberDisplay: "II.",
    eyebrow: "Signature evening · 2026",
    title: "Ripple",
    italic: "for Change",
    body: "A night of stories, art, and momentum. Students, families, and partners gather to share what one small act of service can start, and what it can build. Every gift to Hands of Hope is felt here first.",
    image: "/general/first-kit-packing.jpg",
    alt: "Hands of Hope volunteers packing the first kits at Ripple for Change",
    accent: "var(--brand-navy)",
    meta: [
      { k: "When", v: "Details forthcoming · 2026" },
      { k: "Format", v: "Stories · Art · Music" },
      { k: "Open to", v: "Students · Families · Partners" },
    ],
  },
];

export function SignatureEvents() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<Event["id"]>("awards");
  const activeIndex = EVENTS.findIndex((e) => e.id === active);
  const activeEvent = EVENTS[activeIndex];

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".sig-rise").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            delay: i * 0.06,
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      gsap.fromTo(
        ".sig-tab-bar-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".sig-tabs",
            start: "top 80%",
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    if (!stageRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".sig-image-cover",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.55,
          ease: "power3.inOut",
        }
      )
        .set(".sig-stage-image, .sig-stage-content", { autoAlpha: 0 })
        .call(() => {
          /* image swap happens at this point via React state */
        })
        .to(
          ".sig-image-cover",
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.65,
            ease: "power3.inOut",
          },
          "+=0.05"
        )
        .to(
          ".sig-stage-image",
          { autoAlpha: 1, duration: 0.7, ease: "power2.out" },
          "-=0.55"
        )
        .fromTo(
          ".sig-stage-image img",
          { scale: 1.18, filter: "blur(8px)" },
          { scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out" },
          "-=0.7"
        )
        .to(
          ".sig-stage-content",
          { autoAlpha: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          ".sig-numeral-char",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .fromTo(
          ".sig-eyebrow",
          { x: -24, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.65"
        )
        .fromTo(
          ".sig-title-word",
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .fromTo(
          ".sig-body",
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.55"
        )
        .fromTo(
          ".sig-meta-item",
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.55"
        )
        .fromTo(
          ".sig-corner",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(2)",
          },
          "-=0.7"
        );
    }, stageRef);
    return () => ctx.revert();
  }, [active]);

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden border-t border-border"
    >
      {/* Decorative slow-rotating ornament */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -bottom-32 hidden md:block opacity-[0.05]"
      >
        <svg
          width="520"
          height="520"
          viewBox="0 0 100 100"
          className="rotate-very-slow"
        >
          <circle cx="50" cy="50" r="48" fill="none" stroke="var(--brand-navy)" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="var(--brand-rose)" strokeWidth="0.25" strokeDasharray="0.5 1.5" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="var(--brand-navy)" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="relative mx-auto w-full max-w-[88rem] px-6 md:px-12 pt-28 md:pt-40 pb-20 md:pb-28">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <div className="sig-rise editorial-rule editorial-eyebrow text-muted-foreground inline-flex items-center gap-3">
              <span>Signature events</span>
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--brand-rose)" }}
              />
              <span className="text-muted-foreground/70 normal-case tracking-normal text-[0.65rem] italic font-display">
                · two nights a year
              </span>
            </div>
            <h2 className="sig-rise mt-8 editorial-display text-[clamp(2.5rem,7vw,6rem)] max-w-4xl">
              The nights when the{" "}
              <span className="italic" style={{ color: "var(--brand-rose)" }}>
                work
              </span>{" "}
              steps into the{" "}
              <span className="italic" style={{ color: "var(--brand-navy)" }}>
                room.
              </span>
            </h2>
          </div>
          <p className="sig-rise max-w-md text-muted-foreground md:text-right md:self-end leading-relaxed">
            Two evenings each year carry the weight of every quiet hour
            in between. One honors the students. One opens the doors.
          </p>
        </div>

        {/* Tab bar */}
        <div className="sig-tabs sig-rise mt-16 md:mt-24 relative">
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px bg-border"
          />
          <div
            className="sig-tab-bar-rule absolute inset-x-0 bottom-0 h-px origin-left"
            style={{ background: "var(--foreground)", opacity: 0.18 }}
          />
          <div
            role="tablist"
            aria-label="Signature events"
            className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex gap-8 sm:gap-12">
              {EVENTS.map((ev, i) => {
                const isActive = ev.id === active;
                return (
                  <button
                    key={ev.id}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => setActive(ev.id)}
                    className="group relative pb-5 text-left"
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className="editorial-eyebrow"
                        style={{
                          color: isActive
                            ? "var(--foreground)"
                            : "var(--muted-foreground)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={
                          "font-display text-2xl md:text-3xl tracking-tight transition-colors " +
                          (isActive
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground/80")
                        }
                      >
                        {ev.title}{" "}
                        <span className="italic">{ev.italic}</span>
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="absolute left-0 right-0 bottom-0 h-[2px] origin-left transition-transform duration-700 ease-out"
                      style={{
                        background: ev.accent,
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                  </button>
                );
              })}
            </div>
            <div className="hidden sm:flex items-center gap-3 pb-5">
              <span
                aria-hidden
                className="h-px w-8"
                style={{ background: activeEvent.accent }}
              />
              <span className="editorial-eyebrow text-muted-foreground">
                {String(activeIndex + 1).padStart(2, "0")} / 0{EVENTS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Stage */}
        <div ref={stageRef} className="relative mt-12 md:mt-16">
          <article
            key={active}
            className="relative isolate min-h-[78svh] w-full overflow-hidden bg-foreground/[0.04]"
          >
            {/* Image */}
            <div className="sig-stage-image absolute inset-0">
              <Image
                src={activeEvent.image}
                alt={activeEvent.alt}
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
              <div className="tint-overlay-strong" aria-hidden />
              {/* Soft accent vignette tinted to event */}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-soft-light"
                style={{
                  background: `radial-gradient(ellipse at 20% 80%, ${activeEvent.accent} 0%, transparent 55%)`,
                  opacity: 0.45,
                }}
              />
            </div>

            {/* Reveal cover that wipes during transition */}
            <div
              className="sig-image-cover pointer-events-none absolute inset-0 z-20"
              style={{ background: "var(--background)", transform: "scaleX(0)" }}
              aria-hidden
            />

            {/* Corner brackets */}
            <span
              className="sig-corner pointer-events-none absolute left-5 top-5 z-30 h-7 w-7 border-l border-t border-white/65"
              aria-hidden
            />
            <span
              className="sig-corner pointer-events-none absolute right-5 top-5 z-30 h-7 w-7 border-r border-t border-white/65"
              aria-hidden
            />
            <span
              className="sig-corner pointer-events-none absolute left-5 bottom-5 z-30 h-7 w-7 border-l border-b border-white/65"
              aria-hidden
            />
            <span
              className="sig-corner pointer-events-none absolute right-5 bottom-5 z-30 h-7 w-7 border-r border-b border-white/65"
              aria-hidden
            />

            {/* Content */}
            <div className="sig-stage-content relative z-10 mx-auto flex h-full min-h-[78svh] w-full max-w-[88rem] flex-col justify-end px-6 md:px-12 pb-16 md:pb-20 pt-24 on-image">
              <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:items-end">
                <div>
                  <div
                    className="sig-eyebrow editorial-rule editorial-eyebrow text-white/85"
                    style={{ willChange: "transform, opacity" }}
                  >
                    {activeEvent.eyebrow}
                  </div>
                  <div className="mt-10 flex font-display text-7xl md:text-9xl font-light italic leading-none text-white/85">
                    {activeEvent.numberDisplay.split("").map((c, i) => (
                      <span
                        key={`${active}-${i}`}
                        className="sig-numeral-char inline-block overflow-hidden align-bottom"
                      >
                        <span className="inline-block">{c}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="editorial-display leading-[1.04] pb-2 text-[clamp(2.75rem,6.5vw,5.5rem)] text-white">
                    {activeEvent.title.split(" ").map((w, i) => (
                      <span
                        key={`${active}-t-${i}`}
                        className="inline-block overflow-hidden align-bottom"
                      >
                        <span className="sig-title-word inline-block">
                          {w}
                          {i < activeEvent.title.split(" ").length - 1 ? " " : ""}
                        </span>
                      </span>
                    ))}{" "}
                    <span className="inline-block overflow-hidden align-bottom">
                      <span className="sig-title-word inline-block italic">
                        {activeEvent.italic}
                      </span>
                    </span>
                  </h3>
                  <p className="sig-body mt-8 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
                    {activeEvent.body}
                  </p>
                  <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 max-w-lg text-sm sm:grid-cols-3">
                    {activeEvent.meta.map((m) => (
                      <div key={m.k} className="sig-meta-item">
                        <dt className="editorial-eyebrow text-white/70">
                          {m.k}
                        </dt>
                        <dd className="mt-2 text-white">{m.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            {/* Bottom progress bar */}
            <div
              aria-hidden
              className="absolute left-0 right-0 bottom-0 z-30 h-[2px] bg-white/15"
            >
              <div
                className="h-full transition-[width] duration-700 ease-out"
                style={{
                  background: activeEvent.accent,
                  width: `${((activeIndex + 1) / EVENTS.length) * 100}%`,
                }}
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
