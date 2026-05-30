"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  {
    label: "Instagram",
    handle: "@handsofhope_outreach",
    href: "https://www.instagram.com/handsofhope_outreach/",
    accent: "var(--brand-rose)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    handle: "company/hands-of-hope-outreach",
    href: "https://www.linkedin.com/company/hands-of-hope-outreach/posts/",
    accent: "var(--brand-navy)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 10v7M7 7v.01M11 17v-4.5a2.5 2.5 0 015 0V17M11 10v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function FollowUs() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".follow-rise").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            ease: "power3.out",
            delay: i * 0.06,
            clearProps: "transform,filter",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".follow-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power3.out",
            delay: 0.15 + i * 0.08,
            scrollTrigger: { trigger: card, start: "top 92%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden border-t border-border"
    >
      {/* Soft ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 30% 30%, oklch(0.45 0.13 350 / 0.06), transparent 70%), radial-gradient(60% 50% at 80% 80%, oklch(0.28 0.075 255 / 0.06), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -right-32 -top-24 hidden md:block opacity-[0.06] rotate-very-slow"
        >
          <svg width="380" height="380" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="var(--brand-rose)" strokeWidth="0.25" />
            <circle cx="50" cy="50" r="36" fill="none" stroke="var(--brand-navy)" strokeWidth="0.25" strokeDasharray="0.6 1.4" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="var(--brand-rose)" strokeWidth="0.2" />
          </svg>
        </div>
      </div>

      <div className="relative px-6 md:px-12 py-28 md:py-36">
        <div className="mx-auto grid max-w-[88rem] gap-16 md:grid-cols-[1fr_1.1fr] md:items-end">
          <div>
            <div className="follow-rise editorial-rule editorial-eyebrow text-muted-foreground">
              Stay close
            </div>
            <h2 className="follow-rise mt-8 editorial-display leading-[1.08] pb-2 text-[clamp(2.5rem,6.5vw,5.5rem)] max-w-3xl">
              Follow us on our{" "}
              <span className="italic" style={{ color: "var(--brand-rose)" }}>
                journey.
              </span>
            </h2>
            <p className="follow-rise mt-8 max-w-xl text-muted-foreground leading-relaxed">
              The work is mostly quiet. Students showing up week after week.
              The loud parts live on Instagram and LinkedIn. Come along and
              see what your neighbors are building.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SOCIALS.map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="follow-card group relative isolate flex flex-col justify-between overflow-hidden border border-border bg-card/60 p-8 backdrop-blur-[1px] transition-all duration-500 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[0_30px_60px_-30px_oklch(0.18_0.012_60_/_0.25)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground/85"
                    style={{
                      background: `linear-gradient(135deg, ${s.accent} 0%, transparent 70%)`,
                    }}
                  >
                    <span className="opacity-90">{s.icon}</span>
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground/70">
                    {String(i + 1).padStart(2, "0")} · social
                  </span>
                </div>

                <div className="mt-12">
                  <div
                    className="font-display text-3xl md:text-4xl font-light italic"
                    style={{ color: "inherit" }}
                  >
                    {s.label}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {s.handle}
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-between gap-4 text-xs">
                  <span className="editorial-eyebrow text-muted-foreground transition-colors group-hover:text-foreground">
                    Follow along
                  </span>
                  <span className="inline-flex items-center gap-2 text-foreground transition-transform duration-500 group-hover:translate-x-1">
                    <span
                      aria-hidden
                      className="h-px w-6 transition-[width] duration-500 group-hover:w-10"
                      style={{ background: s.accent }}
                    />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M7 17L17 7M17 7H8M17 7v9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>

                <span
                  aria-hidden
                  className="pointer-events-none absolute right-0 top-0 h-20 w-20 origin-top-right scale-0 transition-transform duration-500 group-hover:scale-100"
                  style={{
                    background: `linear-gradient(225deg, ${s.accent}, transparent 70%)`,
                    opacity: 0.16,
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
