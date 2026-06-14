"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function AnnualEventsSponsor() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [notice, setNotice] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".sponsor-rise").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: i * 0.07,
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.fromTo(
        ".sponsor-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.out",
          transformOrigin: "left center",
          scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
        }
      );
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
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -bottom-32 hidden md:block opacity-[0.06]"
      >
        <svg width="520" height="520" viewBox="0 0 100 100" className="rotate-very-slow">
          <circle cx="50" cy="50" r="48" fill="none" stroke="var(--brand-navy)" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="var(--brand-rose)" strokeWidth="0.25" strokeDasharray="0.5 1.5" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="var(--brand-navy)" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="relative mx-auto w-full max-w-[88rem] px-6 md:px-12 py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <div className="sponsor-rise editorial-rule editorial-eyebrow text-muted-foreground inline-flex items-center gap-3">
              Become a sponsor
              <span
                aria-hidden
                className="relative inline-flex h-1.5 w-1.5"
              >
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--brand-rose)" }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full animate-ping-soft"
                  style={{ background: "var(--brand-rose)" }}
                />
              </span>
            </div>

            <h2 className="sponsor-rise mt-8 editorial-display leading-[1.04] pb-2 text-[clamp(2.5rem,6.5vw,5.5rem)]">
              Stand beside the{" "}
              <span className="italic" style={{ color: "var(--brand-rose)" }}>
                room.
              </span>
            </h2>

            <div
              className="sponsor-rule mt-10 h-px w-32"
              style={{ background: "var(--brand-navy)" }}
              aria-hidden
            />

            <p className="sponsor-rise mt-10 max-w-xl text-base md:text-lg text-foreground/80 leading-relaxed">
              Sponsors keep the lights on, the tables full, and the kits
              moving. Underwrite the awards night, fund a summer kit drive,
              or back a single chapter for a year. Tiers run from local
              partner to title sponsor.
            </p>

            <ul className="sponsor-rise mt-10 grid gap-3 text-sm text-foreground/85">
              <li className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--brand-rose)" }}
                />
                <span>Logo placement on programs, signage, and live screens.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--brand-navy)" }}
                />
                <span>Named recognition in the printed program and from the stage.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--brand-rose-soft)" }}
                />
                <span>Reserved seating for partner staff and family.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--brand-navy-soft)" }}
                />
                <span>A post-event report with photos and impact numbers.</span>
              </li>
            </ul>

            <div className="sponsor-rise mt-12 flex flex-wrap items-center gap-6">
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
                    here as soon as it is ready. In the meantime, the team
                    can talk you through current options by email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="sponsor-rise relative">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden border border-border bg-background p-8"
              style={{
                background:
                  "linear-gradient(160deg, oklch(0.985 0.004 80) 0%, oklch(0.93 0.012 25 / 0.6) 100%)",
              }}
            >
              <div className="editorial-eyebrow text-muted-foreground">
                Sponsor tiers · indicative
              </div>
              <div className="mt-10 space-y-8">
                {[
                  { tier: "Title sponsor", note: "Top billing across both nights", accent: "var(--brand-navy)" },
                  { tier: "Presenting sponsor", note: "Lead naming on one event", accent: "var(--brand-rose)" },
                  { tier: "Community partner", note: "Section sponsor or named award", accent: "var(--brand-navy-soft)" },
                  { tier: "Friend of Hands of Hope", note: "Listed support, reserved seating", accent: "var(--brand-rose-soft)" },
                ].map((t) => (
                  <div key={t.tier} className="grid grid-cols-[auto_1fr] items-baseline gap-5">
                    <span
                      aria-hidden
                      className="block h-2 w-8"
                      style={{ background: t.accent }}
                    />
                    <div>
                      <div className="font-display text-2xl italic">
                        {t.tier}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {t.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute right-6 bottom-6 text-right">
                <div className="editorial-eyebrow text-muted-foreground">Reference</div>
                <div className="mt-1 font-display text-xl italic">2026 season</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
