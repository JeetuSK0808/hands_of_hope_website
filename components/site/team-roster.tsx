"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Member = {
  name: string;
  role: string;
  photo: string;
  /** Vertical focus of the portrait crop, 0 to 100. Defaults to 35 (slightly upper). */
  focusY?: number;
  accent?: "rose" | "navy";
};

const FOUNDERS: Member[] = [
  {
    name: "Daksh Shah",
    role: "Co-founder",
    photo: "/team/daksh-shah.jpg",
    focusY: 30,
    accent: "rose",
  },
  {
    name: "Shubham Trivedi",
    role: "Co-founder",
    photo: "/team/shubham-trivedi.jpg",
    focusY: 30,
    accent: "navy",
  },
];

const EXECUTIVES: Member[] = [
  {
    name: "Michael V.",
    role: "Chief Operating Officer",
    photo: "/team/michael-v.jpg",
    focusY: 30,
    accent: "navy",
  },
  {
    name: "Arthur Crawford",
    role: "Chief Marketing Officer",
    photo: "/team/arthur-crawford.jpg",
    focusY: 30,
    accent: "rose",
  },
  {
    name: "Satyajeeth Suresh Kannan",
    role: "Chief Technology Officer · U.S. Region Leader",
    photo: "/team/satyajeeth-suresh-kannan.jpg",
    focusY: 28,
    accent: "navy",
  },
];

function PortraitCard({
  m,
  size = "md",
  index = 0,
}: {
  m: Member;
  size?: "xl" | "lg" | "md" | "sm";
  index?: number;
}) {
  const aspect =
    size === "xl"
      ? "aspect-[4/5]"
      : size === "lg"
        ? "aspect-[4/5]"
        : size === "md"
          ? "aspect-[3/4]"
          : "aspect-[3/4]";

  const nameClass =
    size === "xl"
      ? "text-4xl md:text-5xl"
      : size === "lg"
        ? "text-3xl"
        : size === "md"
          ? "text-2xl"
          : "text-xl";

  const accentColor =
    m.accent === "navy" ? "var(--brand-navy)" : "var(--brand-rose)";

  return (
    <article
      className="member-card group relative"
      data-accent={accentColor}
    >
      {/* Frame: offset accent rule that animates on hover */}
      <div className="member-frame relative">
        <div
          aria-hidden
          className="member-accent pointer-events-none absolute -left-2 -top-2 h-10 w-px md:h-14"
          style={{ background: accentColor }}
        />
        <div
          aria-hidden
          className="member-accent pointer-events-none absolute -left-2 -top-2 h-px w-10 md:w-14"
          style={{ background: accentColor }}
        />

        <div
          className={`member-photo relative ${aspect} w-full overflow-hidden bg-muted`}
        >
          <div className="member-photo-inner absolute inset-0">
            <Image
              src={m.photo}
              alt={`Portrait of ${m.name}`}
              fill
              sizes={
                size === "xl"
                  ? "(min-width: 1024px) 44vw, 90vw"
                  : size === "lg"
                    ? "(min-width: 1024px) 32vw, 90vw"
                    : size === "md"
                      ? "(min-width: 1024px) 28vw, 45vw"
                      : "(min-width: 1024px) 22vw, 50vw"
              }
              className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.045]"
              style={{ objectPosition: `50% ${m.focusY ?? 35}%` }}
              priority={index < 2}
            />
          </div>

          {/* Inner hairline border */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-3 border border-white/15 transition-colors duration-700 group-hover:border-white/35"
          />

          {/* Slow editorial tint that lifts on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-0"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.12 0.012 60 / 0.10) 0%, oklch(0.10 0.012 60 / 0.28) 100%)",
            }}
          />

          {/* Corner brackets */}
          <span
            aria-hidden
            className="absolute left-3 top-3 h-3 w-3 border-l border-t border-white/55"
          />
          <span
            aria-hidden
            className="absolute right-3 top-3 h-3 w-3 border-r border-t border-white/55"
          />
          <span
            aria-hidden
            className="absolute left-3 bottom-3 h-3 w-3 border-l border-b border-white/55"
          />
          <span
            aria-hidden
            className="absolute right-3 bottom-3 h-3 w-3 border-r border-b border-white/55"
          />

          {/* Accent dot top-right */}
          <span
            aria-hidden
            className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full"
            style={{ background: accentColor }}
          />

          {/* Sweep highlight on hover (subtle) */}
          <div
            aria-hidden
            className="member-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, oklch(1 0 0 / 0.10) 50%, transparent 100%)",
            }}
          />
        </div>
      </div>

      <div className="member-meta mt-6 flex items-start justify-between gap-4">
        <div>
          <div
            className={`font-display ${nameClass} font-normal italic leading-[1.05]`}
          >
            {m.name}
          </div>
          <div className="mt-2 text-sm md:text-[0.95rem] text-muted-foreground">
            {m.role}
          </div>
        </div>
        <div className="shrink-0 pt-2">
          <span
            aria-hidden
            className="block h-px w-10"
            style={{ background: accentColor, opacity: 0.7 }}
          />
        </div>
      </div>
    </article>
  );
}

function GroupHeader({
  eyebrow,
  index,
  total,
  caption,
}: {
  eyebrow: string;
  index: string;
  total: string;
  caption?: string;
}) {
  return (
    <div className="roster-group-header">
      <div className="flex items-baseline justify-between gap-6">
        <div className="roster-eyebrow editorial-rule editorial-eyebrow text-muted-foreground">
          {eyebrow}
        </div>
        <div className="roster-eyebrow editorial-eyebrow text-muted-foreground/70 hidden sm:block">
          {index} / {total}
        </div>
      </div>
      {caption && (
        <p className="roster-caption mt-6 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
          {caption}
        </p>
      )}
      <div className="roster-rule draw-rule mt-8" />
    </div>
  );
}

export function TeamRoster() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Group header reveal: eyebrow + caption + draw-rule
      gsap.utils.toArray<HTMLElement>(".roster-group-header").forEach((header) => {
        const eyebrows = header.querySelectorAll<HTMLElement>(".roster-eyebrow");
        const caption = header.querySelector<HTMLElement>(".roster-caption");
        const rule = header.querySelector<HTMLElement>(".roster-rule");

        gsap.fromTo(
          eyebrows,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: header, start: "top 88%" },
          }
        );
        if (caption) {
          gsap.fromTo(
            caption,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              delay: 0.1,
              scrollTrigger: { trigger: header, start: "top 88%" },
            }
          );
        }
        if (rule) {
          ScrollTrigger.create({
            trigger: rule,
            start: "top 90%",
            once: true,
            onEnter: () => rule.classList.add("is-in"),
          });
        }
      });

      // Portrait card reveal: photo reveals via clipPath, meta fades up,
      // accent hairlines draw in.
      gsap.utils.toArray<HTMLElement>(".member-card").forEach((card, i) => {
        const inner = card.querySelector<HTMLElement>(".member-photo-inner");
        const meta = card.querySelector<HTMLElement>(".member-meta");
        const accents = card.querySelectorAll<HTMLElement>(".member-accent");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 86%" },
          defaults: { ease: "power3.out" },
          delay: prefersReduced ? 0 : (i % 3) * 0.08,
        });

        if (prefersReduced) {
          tl.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.6 });
        } else {
          tl.fromTo(
            card,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
            0
          );

          if (inner) {
            tl.fromTo(
              inner,
              {
                clipPath: "inset(0% 0% 100% 0%)",
                scale: 1.12,
              },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.25,
                ease: "power4.out",
              },
              0.05
            );
          }

          if (accents.length) {
            tl.fromTo(
              accents,
              { scaleX: 0, scaleY: 0, transformOrigin: "left top" },
              {
                scaleX: 1,
                scaleY: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: "power2.out",
              },
              0.45
            );
          }

          if (meta) {
            tl.fromTo(
              meta,
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8 },
              0.35
            );
          }
        }
      });

      // Parallax: light, only on larger screens
      if (!prefersReduced && window.matchMedia("(min-width: 768px)").matches) {
        gsap.utils.toArray<HTMLElement>(".member-photo-inner").forEach((el) => {
          gsap.to(el, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }

      // Subtle floating index numeral on the founders panel
      gsap.fromTo(
        ".roster-floating",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".roster-floating",
            start: "top 92%",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full px-6 md:px-12 py-24 md:py-32 border-b border-border overflow-hidden"
    >
      {/* Ambient editorial ornament */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-32 hidden lg:block opacity-[0.08] rotate-very-slow"
      >
        <svg width="520" height="520" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="var(--brand-rose)"
            strokeWidth="0.2"
          />
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="var(--brand-navy)"
            strokeWidth="0.18"
            strokeDasharray="0.6 1.6"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="var(--brand-rose)"
            strokeWidth="0.18"
          />
        </svg>
      </div>

      <div className="relative mx-auto w-full max-w-[88rem]">
        {/* ───────────── Co-founders ───────────── */}
        <GroupHeader
          eyebrow="Co-founders"
          index="01"
          total="02"
          caption="Two students who started Hands of Hope with one stubborn question, what does showing up actually look like, and have spent every year since answering it."
        />

        <div className="relative mt-14">
          <div className="roster-floating pointer-events-none absolute -top-10 right-0 hidden md:block">
            <span className="font-display italic text-7xl text-foreground/[0.06] leading-none">
              01
            </span>
          </div>

          <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
            {FOUNDERS.map((m, i) => (
              <PortraitCard key={m.name} m={m} size="xl" index={i} />
            ))}
          </div>
        </div>

        {/* ───────────── Executives ───────────── */}
        <div className="mt-32 md:mt-40">
          <GroupHeader
            eyebrow="Executive Team"
            index="02"
            total="02"
            caption="The leadership team running operations, marketing, and technology across every chapter."
          />
        </div>

        <div className="relative mt-14">
          <div className="roster-floating pointer-events-none absolute -top-10 right-0 hidden md:block">
            <span className="font-display italic text-7xl text-foreground/[0.06] leading-none">
              02
            </span>
          </div>

          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {EXECUTIVES.map((m, i) => (
              <PortraitCard key={m.name} m={m} size="md" index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
