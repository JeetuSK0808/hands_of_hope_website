"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Pillar = {
  number: string;
  title: string;
  italic?: string;
  body: string;
  cta: { label: string; href: string };
  image: string;
  alt: string;
};

const PILLARS: Pillar[] = [
  {
    number: "01",
    title: "Ripple for Change",
    italic: "Event",
    body:
      "A night of stories, art, and momentum. Students, families, and partners gather to share what one small act of service can start, and what it can build.",
    cta: { label: "Learn about the event", href: "/about#ripple" },
    image: "/general/first-kit-packing.jpg",
    alt: "Volunteers packing the first kits at the Ripple for Change event",
  },
  {
    number: "02",
    title: "Chapter",
    italic: "Network",
    body:
      "School-based chapters for high school students, each shaped by the people who run it, with verified service hours recognized beyond school.",
    cta: { label: "Find or start a chapter", href: "/about#branches" },
    image: "/general/canadian-chapter.jpg",
    alt: "Hands of Hope Canadian chapter event",
  },
  {
    number: "03",
    title: "STEM",
    italic: "Buddies",
    body:
      "A dedicated branch providing hands-on, accessible STEM learning to disabled children, built around joy, agency, and discovery.",
    cta: { label: "Volunteer with the program", href: "/contact" },
    image: "/general/stem-buddies.jpg",
    alt: "STEM Buddies session with students and mentors",
  },
  {
    number: "04",
    title: "Awards",
    italic: "Ceremony",
    body:
      "An annual evening dedicated to the students whose service hours, leadership, and steady presence reshape the communities around them.",
    cta: { label: "About the ceremony", href: "/about#awards" },
    image: "/general/service-line.jpg",
    alt: "Volunteers serving the community in a long line of effort",
  },
];

export function PillarsSection() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".pillar").forEach((el) => {
        gsap.fromTo(
          el.querySelector(".pillar-content"),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 70%" },
          }
        );
        gsap.fromTo(
          el.querySelector("img"),
          { scale: 1.08 },
          {
            scale: 1,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 80%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative w-full">
      {PILLARS.map((p) => (
        <article
          key={p.number}
          className="pillar relative isolate flex min-h-[85svh] w-full items-end overflow-hidden border-t border-border"
        >
          <Image
            src={p.image}
            alt={p.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="tint-overlay" aria-hidden />

          <div className="pillar-content relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-24 pt-24 on-image">
            <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:items-end">
              <div className="font-display text-7xl md:text-9xl font-light italic leading-none text-white/90 flex items-baseline gap-3">
                <span>{p.number}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.65_0.16_350)]" aria-hidden />
              </div>
              <div>
                <h3 className="editorial-display text-[clamp(2.75rem,6vw,5.5rem)] text-white">
                  {p.title}{" "}
                  {p.italic && (
                    <span className="italic">{p.italic}</span>
                  )}
                </h3>
                <p className="mt-8 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
                  {p.body}
                </p>
                <Link
                  href={p.cta.href}
                  className="mt-10 inline-flex items-center border-b border-white/80 pb-1 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-70"
                >
                  {p.cta.label}
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
