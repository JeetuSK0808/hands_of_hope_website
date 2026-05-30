"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, GraduationCap, HandHeart, Users } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    icon: HandHeart,
    title: "Service projects",
    body: "Student-led, community-specific service that responds to what each neighborhood actually needs.",
  },
  {
    icon: GraduationCap,
    title: "STEM Buddies",
    body: "Hands-on, inclusive STEM mentorship for disabled children, built around accessibility and joy.",
  },
  {
    icon: Users,
    title: "Chapters",
    body: "School-based chapters for high school students, with verified hours recognized beyond school.",
  },
  {
    icon: Heart,
    title: "Awards Ceremony",
    body: "Annual recognition celebrating exceptional service hours, leadership, and lasting community impact.",
  },
];

export function WhatWeDo() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".wwd-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.07,
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full px-6 md:px-10 py-32 md:py-40 bg-card/40"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          What we do
        </div>
        <h2 className="mt-4 max-w-3xl text-stroke-hero text-[clamp(2.5rem,6vw,5rem)]">
          Four ways we put{" "}
          <span
            className="italic"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.78 0.16 5), oklch(0.62 0.16 5))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            hope
          </span>{" "}
          in motion.
        </h2>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            return (
              <article
                key={it.title}
                className="wwd-card group relative overflow-hidden rounded-3xl border border-border bg-background p-7 transition-transform hover:-translate-y-1"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.95_0.05_5)] to-[oklch(0.95_0.04_195)] text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium tracking-tight">
                  {it.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {it.body}
                </p>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
