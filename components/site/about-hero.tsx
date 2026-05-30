"use client";

import * as React from "react";
import Image from "next/image";

export function AboutHero() {
  return (
    <section className="relative isolate flex min-h-[80svh] w-full flex-col justify-end overflow-hidden">
      <Image
        src="/general/event-banner-wide.jpg"
        alt="Hands of Hope Ripple for Change event in full swing"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="tint-overlay-strong" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-24 pt-40 on-image">
        <div className="animate-fade-up [animation-delay:120ms]">
          <span className="editorial-rule editorial-eyebrow">
            About / our story
          </span>
        </div>
        <h1 className="mt-10 editorial-display text-[clamp(3rem,8vw,8rem)] max-w-[18ch] animate-fade-up [animation-delay:280ms]">
          We grew out of a simple <span className="italic">question.</span>
        </h1>
        <p className="mt-12 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed animate-fade-up [animation-delay:440ms]">
          What if every high schooler had a way to turn what they care about
          into something real for someone else? Daksh Shah founded Hands of
          Hope in Atlanta to answer that, connecting students with the
          communities just outside their classroom, and giving them the
          structure, recognition, and trust to lead.
        </p>
      </div>
    </section>
  );
}
