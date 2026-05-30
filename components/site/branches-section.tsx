"use client";

import * as React from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const BRANCHES = [
  {
    number: "I.",
    name: "Chapter Network",
    location: "School-based · Across the globe",
    description:
      "Any high school student attending one of our school chapters can register through their school. Each chapter is shaped by the students who run it.",
    cta: { label: "Find your school", href: "/contact" },
  },
  {
    number: "II.",
    name: "STEM Buddies",
    location: "Inclusive education · Hands-on",
    description:
      "A dedicated branch providing hands-on, accessible STEM learning to disabled children, built around joy, agency, and discovery.",
    cta: { label: "Volunteer with the program", href: "/contact" },
  },
  {
    number: "III.",
    name: "Start a Chapter",
    location: "Anywhere · Student-led",
    description:
      "No chapter at your school? Start one. We'll send the chapter starter kit and pair you with a founder mentor within 48 hours.",
    cta: { label: "Begin the form", href: "/contact" },
  },
];

export function BranchesSection() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-line").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: i * 0.05,
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="branches"
      ref={rootRef}
      className="relative w-full px-6 md:px-12 py-32 md:py-44 border-t border-border"
    >
      <div className="mx-auto max-w-[88rem]">
        <div className="reveal-line editorial-rule editorial-eyebrow text-muted-foreground">
          Our branches
        </div>
        <h2 className="reveal-line mt-8 editorial-display text-[clamp(2.5rem,6.5vw,5.5rem)] max-w-3xl">
          Every branch is <span className="italic" style={{ color: "var(--brand-rose)" }}>different.</span>
        </h2>
        <p className="reveal-line mt-6 max-w-xl text-muted-foreground">
          Every Hands of Hope branch is different because every community is
          different. Branches are student-led and built around local needs, so
          no two look the same.
        </p>

        <div className="reveal-line mt-20 divide-y divide-border border-y border-border">
          {BRANCHES.map((b) => (
            <article
              key={b.name}
              className="grid gap-8 py-12 md:grid-cols-[5rem_1fr_1.6fr_auto] md:items-baseline md:py-16"
            >
              <div className="font-display text-4xl font-light italic" style={{ color: "var(--brand-navy)" }}>
                {b.number}
              </div>
              <div>
                <h3 className="font-display text-3xl md:text-4xl font-normal tracking-tight">
                  {b.name}
                </h3>
                <div className="mt-2 editorial-eyebrow text-muted-foreground">
                  {b.location}
                </div>
              </div>
              <p className="max-w-xl text-base text-foreground/80 leading-relaxed">
                {b.description}
              </p>
              <Link
                href={b.cta.href}
                className="inline-flex items-center border-b border-foreground pb-1 text-sm font-medium text-foreground transition-opacity hover:opacity-70 self-start md:self-baseline whitespace-nowrap"
              >
                {b.cta.label}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
