"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function AwardsAndRipple() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".event-block").forEach((el) => {
        gsap.fromTo(
          el.querySelector(".event-content"),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 78%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative w-full">
      {/* Awards Ceremony, full bleed */}
      <article
        id="awards"
        className="event-block relative isolate flex min-h-[80svh] w-full items-end overflow-hidden border-t border-border"
      >
        <Image
          src="/general/award-ceremony-hi.jpg"
          alt="Students gathered at the Hands of Hope Awards Ceremony"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="tint-overlay" aria-hidden />

        <div className="event-content relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-24 pt-24 on-image">
          <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:items-end">
            <div>
              <div className="editorial-rule editorial-eyebrow text-white/80">
                Annual evening
              </div>
              <div className="mt-12 font-display text-7xl md:text-9xl font-light italic leading-none text-white/85">
                I.
              </div>
            </div>
            <div>
              <h3 className="editorial-display leading-[1.04] pb-2 text-[clamp(2.75rem,6vw,5rem)] text-white">
                Hands of Hope <span className="italic">Awards Ceremony</span>
              </h3>
              <p className="mt-8 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
                Every year we pause to celebrate the students whose service
                hours, leadership, and steady presence reshape the communities
                around them. Recognition includes meaningful service hours,
                national honors, and a night dedicated to the people who showed up.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 max-w-md text-sm">
                <div>
                  <div className="editorial-eyebrow text-white/70">When</div>
                  <div className="mt-2 text-white">Annually · Spring</div>
                </div>
                <div>
                  <div className="editorial-eyebrow text-white/70">Honors</div>
                  <div className="mt-2 text-white">
                    Service · Leadership · Impact
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Ripple for Change, full bleed */}
      <article
        id="ripple"
        className="event-block relative isolate flex min-h-[80svh] w-full items-end overflow-hidden border-t border-border"
      >
        <Image
          src="/general/ripple-for-change-new.jpg"
          alt="Hands of Hope students and families at Ripple for Change"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="tint-overlay" aria-hidden />

        <div className="event-content relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-24 pt-24 on-image">
          <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:items-end">
            <div>
              <div className="editorial-rule editorial-eyebrow text-white/80">
                Signature event
              </div>
              <div className="mt-12 font-display text-7xl md:text-9xl font-light italic leading-none text-white/85">
                II.
              </div>
            </div>
            <div>
              <h3 className="editorial-display leading-[1.04] pb-2 text-[clamp(2.75rem,6vw,5rem)] text-white">
                Ripple <span className="italic">for Change</span>
              </h3>
              <p className="mt-8 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
                A night of stories, art, and momentum. Students, families, and
                partners gather to share what one small act of service can
                start, and what it can build.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 max-w-md text-sm">
                <div>
                  <div className="editorial-eyebrow text-white/70">When</div>
                  <div className="mt-2 text-white">Details forthcoming · 2026</div>
                </div>
                <div>
                  <div className="editorial-eyebrow text-white/70">Format</div>
                  <div className="mt-2 text-white">Stories · Art · Music</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
