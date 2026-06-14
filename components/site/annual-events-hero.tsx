"use client";

import * as React from "react";
import Image from "next/image";

export function AnnualEventsHero() {
  return (
    <section className="relative isolate flex min-h-[88svh] w-full flex-col justify-end overflow-hidden">
      <Image
        src="/general/awards-ceremony.jpg"
        alt="Hands of Hope annual gathering, room filled with students and partners"
        fill
        priority
        sizes="100vw"
        className="object-cover animate-ken-burns"
      />
      <div className="tint-overlay-strong" aria-hidden />

      <div
        aria-hidden
        className="pointer-events-none absolute right-[6vw] top-[18vh] hidden md:block opacity-[0.18]"
      >
        <svg width="280" height="280" viewBox="0 0 100 100" className="rotate-very-slow">
          <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="white" strokeWidth="0.18" strokeDasharray="0.6 1.4" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="white" strokeWidth="0.18" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-28 pt-40 on-image">
        <div className="animate-fade-up [animation-delay:120ms]">
          <span className="editorial-rule editorial-eyebrow">
            Annual events · 2026
          </span>
        </div>
        <h1 className="mt-10 editorial-display leading-[1.02] pb-2 text-[clamp(3.25rem,9vw,9.5rem)] max-w-[20ch]">
          <span className="block animate-fade-up [animation-delay:240ms]">
            Two nights
          </span>
          <span className="block italic animate-fade-up [animation-delay:380ms]">
            a year matter most.
          </span>
        </h1>

        <p className="mt-12 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed animate-fade-up [animation-delay:520ms]">
          Every winter we recognize the students whose service hours and
          leadership shape their cities. Every summer we open the doors and
          pack thousands of kits beside the families who count on us. Both
          live here.
        </p>

        <div className="mt-10 flex flex-wrap gap-8 animate-fade-up [animation-delay:680ms]">
          <a
            href="#stage"
            className="inline-flex items-center border-b border-white/80 pb-1 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-70"
          >
            See both events
          </a>
          <a
            href="#sponsor"
            className="inline-flex items-center border-b border-white/40 pb-1 text-sm font-medium tracking-wide text-white/80 transition-opacity hover:opacity-100"
          >
            Become a sponsor
          </a>
        </div>
      </div>
    </section>
  );
}
