"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  cta: { label: string; href: string };
};

const SHOWCASES: Showcase[] = [
  {
    numeral: "I.",
    eyebrow: "Branch · School-based",
    title: "Chapter",
    italic: "Network",
    body:
      "Any high school student attending one of our school chapters can register through their school. Each chapter is shaped by the students who run it, with verified service hours that travel beyond the classroom.",
    image: "/general/canadian-chapters-hi.jpg",
    alt: "Hands of Hope Canadian chapter event with students gathered",
    meta: [
      { k: "Setting", v: "School-based · Across the globe" },
      { k: "Recognition", v: "Verified service hours" },
    ],
    cta: { label: "Find your school", href: "/contact" },
  },
  {
    numeral: "II.",
    eyebrow: "Branch · Inclusive education",
    title: "STEM",
    italic: "Together",
    body:
      "Students run hands-on, accessible STEM sessions with MDE School and other special-needs schools. Built around joy, agency, and discovery, never around curriculum compliance. It started at the founding branch and now runs at more than one.",
    image: "/general/stem-buddies-hi.jpg",
    alt: "STEM Together session with students and mentors collaborating on a project",
    meta: [
      { k: "Built with", v: "Special-needs schools" },
      { k: "Running at", v: "Multiple branches" },
    ],
    cta: { label: "Volunteer with the program", href: "/contact" },
  },
  {
    numeral: "III.",
    eyebrow: "Branch · Student-led, anywhere",
    title: "Start a",
    italic: "Chapter",
    body:
      "No chapter at your school? Start one. We'll send the chapter starter kit and pair you with a founder mentor within 48 hours, anywhere a student wants to build something for the people around them.",
    image: "/general/mentor-student.jpg",
    alt: "Hands of Hope mentor working with a student to plan a project",
    meta: [
      { k: "Where", v: "Anywhere · U.S. & abroad" },
      { k: "Onboarding", v: "Starter kit · 48-hour mentor pair" },
    ],
    cta: { label: "Begin the form", href: "/contact" },
  },
];

export function BranchesShowcase() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".showcase-card").forEach((el) => {
        const content = el.querySelector<HTMLElement>(".showcase-content");
        const image = el.querySelector<HTMLImageElement>("img");
        const numeral = el.querySelector<HTMLElement>(".showcase-numeral");
        const meta = el.querySelectorAll<HTMLElement>(".showcase-meta-item");

        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.12 },
            {
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { y: 36, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 70%" },
            }
          );
        }

        if (numeral) {
          gsap.fromTo(
            numeral,
            { y: 26, opacity: 0, letterSpacing: "0.1em" },
            {
              y: 0,
              opacity: 1,
              letterSpacing: "-0.04em",
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 75%" },
            }
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
            }
          );
        }
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} aria-label="Programs">
      {SHOWCASES.map((s, idx) => (
        <article
          key={s.title + s.italic}
          className="showcase-card relative isolate flex min-h-[85svh] w-full items-end overflow-hidden border-t border-border"
        >
          <Image
            src={s.image}
            alt={s.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={idx === 0}
          />
          <div className="tint-overlay" aria-hidden />

          {/* Soft accent corner ornaments */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-6 top-24 hidden md:block opacity-30"
          >
            <svg width="86" height="86" viewBox="0 0 100 100" className="rotate-very-slow">
              <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.4" strokeDasharray="0.6 1.6" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="var(--brand-rose)" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="showcase-content relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-24 pt-24 on-image">
            <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:items-end">
              <div>
                <div className="editorial-rule editorial-eyebrow text-white/85">
                  {s.eyebrow}
                </div>
                <div
                  className="showcase-numeral mt-12 font-display text-7xl md:text-9xl font-light italic leading-none text-white/85"
                  style={{ willChange: "transform, letter-spacing" }}
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
                <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 max-w-md text-sm">
                  {s.meta.map((m) => (
                    <div key={m.k} className="showcase-meta-item">
                      <dt className="editorial-eyebrow text-white/70">{m.k}</dt>
                      <dd className="mt-2 text-white">{m.v}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href={s.cta.href}
                  className="mt-12 inline-flex items-center gap-3 border-b border-white/80 pb-1 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-70"
                >
                  {s.cta.label}
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
