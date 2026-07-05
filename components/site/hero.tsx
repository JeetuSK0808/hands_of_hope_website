"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] w-full flex-col justify-end overflow-hidden">
      {/* Background image */}
      <Image
        src="/general/ripple-banner-group.jpg"
        alt="Hands of Hope Outreach students gathered behind the Ripple for Change banner"
        fill
        priority
        sizes="100vw"
        className="object-cover animate-ken-burns"
      />

      {/* Dark tint */}
      <div className="tint-overlay-strong" aria-hidden />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-28 pt-40 on-image">
        <div className="animate-fade-up [animation-delay:120ms]">
          <span className="editorial-rule editorial-eyebrow">
            Hands of Hope
          </span>
        </div>

        <h1 className="mt-10 editorial-display text-[clamp(3.25rem,9vw,9.5rem)] max-w-[20ch]">
          <span className="block animate-fade-up [animation-delay:240ms]">
            Compassion,
          </span>
          <span className="block italic animate-fade-up [animation-delay:380ms]">
            in action.
          </span>
        </h1>

        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-xl text-base md:text-lg text-white/80 leading-relaxed animate-fade-up [animation-delay:520ms]">
            Hands of Hope Outreach ignites compassion by connecting high
            school students with the real world, turning empathy into meaningful
            action across Atlanta and beyond.
          </p>

          <div className="flex flex-wrap gap-8 animate-fade-up [animation-delay:680ms]">
            <Link
              href="/about"
              className="inline-flex items-center border-b border-white/80 pb-1 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-70"
            >
              Discover our mission
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border-b border-white/40 pb-1 text-sm font-medium tracking-wide text-white/80 transition-opacity hover:opacity-100"
            >
              Start a chapter
            </Link>
          </div>
        </div>
      </div>

      {/* Quiet scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/60">
        <span>Scroll</span>
        <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.2} />
      </div>
    </section>
  );
}
