"use client";

import * as React from "react";
import Image from "next/image";

export function TeamHero() {
  return (
    <section className="relative isolate w-full overflow-hidden border-b border-border">
      {/* Background photograph sits behind the headline that used to be empty white space */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/general/img_9568.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover animate-ken-burns"
        />
        <div className="tint-overlay-strong" aria-hidden />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 80%, oklch(0.12 0.012 60 / 0.55) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Subtle ornamental rosette, scoped to the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -bottom-24 hidden md:block opacity-[0.12] rotate-very-slow"
      >
        <svg width="420" height="420" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="var(--brand-rose)" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="var(--brand-navy)" strokeWidth="0.2" strokeDasharray="0.6 1.4" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="var(--brand-rose)" strokeWidth="0.2" />
        </svg>
      </div>

      {/* Corner brackets kept from the previous cover treatment */}
      <div aria-hidden className="absolute left-4 top-24 h-6 w-6 border-l border-t border-white/45" />
      <div aria-hidden className="absolute right-4 top-24 h-6 w-6 border-r border-t border-white/45" />
      <div aria-hidden className="absolute left-4 bottom-4 h-6 w-6 border-l border-b border-white/45" />
      <div aria-hidden className="absolute right-4 bottom-4 h-6 w-6 border-r border-b border-white/45" />

      <div className="relative mx-auto w-full max-w-[88rem] px-6 md:px-12 pt-40 pb-24 md:pb-32 on-image">
        <div className="editorial-rule editorial-eyebrow animate-fade-up">
          Meet the Team
        </div>
        <h1 className="mt-10 editorial-display text-[clamp(3rem,8vw,8rem)] max-w-[18ch] animate-fade-up [animation-delay:200ms]">
          Built by the people who <span className="italic" style={{ color: "var(--brand-rose-soft)" }}>show up.</span>
        </h1>
        <p className="mt-10 max-w-2xl text-base md:text-lg text-white/80 leading-relaxed animate-fade-up [animation-delay:380ms]">
          A small group of students stewarding the work behind Hands of Hope.
          Founders, executives, and the changemakers who make any of it real.
          Their portraits follow.
        </p>

        <div className="mt-16 flex items-center justify-between gap-8 animate-fade-up [animation-delay:560ms]">
          <span className="editorial-eyebrow">
            The team · Hands of Hope
          </span>
          <span className="font-display italic text-base text-white/75">
            № 01
          </span>
        </div>
      </div>
    </section>
  );
}
