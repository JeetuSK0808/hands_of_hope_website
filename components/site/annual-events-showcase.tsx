"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Showcase = {
  numeral: string;
  eyebrow: string;
  title: string;
  italic: string;
  body: string;
  image: string;
  alt: string;
  meta: { k: string; v: string }[];
  cta: string;
};

/**
 * The two dates that pull the whole network into one room, given the same
 * full-bleed treatment as the branch programs rather than a paragraph of
 * text. Both cards lead to the annual events page.
 */
const SHOWCASES: Showcase[] = [
  {
    numeral: "IV.",
    eyebrow: "Annual event · Winter",
    title: "Awards",
    italic: "Ceremony",
    body:
      "Once a year the whole network stops moving and looks at what it did. Branches and individual members are recognized from the stage for the work they carried, in front of the families, partners, and classmates who watched them carry it.",
    image: "/general/awards-ceremony.jpg",
    alt: "Hands of Hope Awards Ceremony, the room full of students, families, and partners",
    meta: [
      { k: "When", v: "Annually · Every winter" },
      { k: "Honors", v: "Branches and individual members" },
    ],
    cta: "See the ceremony",
  },
  {
    numeral: "V.",
    eyebrow: "Annual event · Spring",
    title: "Ripple",
    italic: "for Change",
    body:
      "Branches spend the year tallying what the communities they serve say they need most, and whatever comes out on top becomes the theme. Then every branch converges on the same tables and packs thousands of care kits around it. The day many branches become visibly one organization.",
    image: "/general/ripple-for-change-new.jpg",
    alt: "Hands of Hope students packing care kits together at Ripple for Change",
    meta: [
      { k: "When", v: "Annually · Every spring" },
      { k: "Theme", v: "Chosen by the communities served" },
    ],
    cta: "See the assembly",
  },
];

export function AnnualEventsShowcase() {
  const rootRef = React.useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".aes-card").forEach((el) => {
        const content = el.querySelector<HTMLElement>(".aes-content");
        const image = el.querySelector<HTMLImageElement>("img");
        const numeral = el.querySelector<HTMLElement>(".aes-numeral");
        const meta = el.querySelectorAll<HTMLElement>(".aes-meta-item");

        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.14 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            },
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { y: 38, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 70%" },
            },
          );
        }

        if (numeral) {
          gsap.fromTo(
            numeral,
            { y: 26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 75%" },
            },
          );
        }

        if (meta.length) {
          gsap.fromTo(
            meta,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 65%" },
            },
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section ref={rootRef} aria-label="Annual events">
      {SHOWCASES.map((s) => (
        <article
          key={s.title + s.italic}
          className="aes-card relative isolate flex min-h-[85svh] w-full items-end overflow-hidden border-t border-border"
        >
          <Image
            src={s.image}
            alt={s.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="tint-overlay" aria-hidden />

          {/* Ripple ornament, the mark this pair of dates shares */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-6 top-24 hidden md:block opacity-30"
          >
            <svg width="86" height="86" viewBox="0 0 100 100" className="rotate-very-slow">
              <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.4" strokeDasharray="0.6 1.6" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="var(--brand-rose)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="0.4" />
            </svg>
          </div>

          <div className="aes-content relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-24 pt-24 on-image">
            <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:items-end">
              <div>
                <div className="editorial-rule editorial-eyebrow text-white/85">
                  {s.eyebrow}
                </div>
                <div
                  className="aes-numeral mt-12 font-display text-7xl md:text-9xl font-light italic leading-none text-white/85"
                  style={{ willChange: "transform" }}
                >
                  {s.numeral}
                </div>
              </div>
              <div>
                <h3 className="editorial-display leading-[1.04] pb-2 text-[clamp(2.75rem,6.5vw,5.5rem)] text-white">
                  {s.title} <span className="italic">{s.italic}</span>
                </h3>
                <p className="mt-8 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
                  {s.body}
                </p>
                <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 max-w-lg text-sm">
                  {s.meta.map((m) => (
                    <div key={m.k} className="aes-meta-item">
                      <dt className="editorial-eyebrow text-white/70">{m.k}</dt>
                      <dd className="mt-2 text-white">{m.v}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href="/annual-events"
                  className="mt-12 inline-flex items-center gap-3 border-b border-white/80 pb-1 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-70"
                >
                  {s.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M7 17L17 7M17 7H8M17 7v9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
