"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  monochrome?: "light" | "dark";
};

export function AnimatedLogo({
  className,
  showWordmark = true,
  size = 40,
  monochrome,
}: Props) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className="relative inline-block overflow-hidden shrink-0 rounded-full ring-1 ring-border bg-background"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <Image
          src="/brand/logo.png"
          alt="Hands of Hope"
          fill
          sizes={`${size}px`}
          className="object-contain"
          priority
        />
      </span>
      {showWordmark && (
        <span
          className={cn(
            "flex flex-col leading-none transition-colors",
            monochrome === "light" ? "text-[oklch(0.99_0.004_80)]" : "text-foreground"
          )}
        >
          <span className="font-display text-[1.05rem] font-normal italic tracking-tight">
            Hands of Hope
          </span>
          <span
            className={cn(
              "mt-1 text-[0.62rem] font-medium uppercase tracking-[0.32em]",
              monochrome === "light"
                ? "text-[oklch(0.99_0.004_80_/_0.7)]"
                : "text-muted-foreground"
            )}
          >
            Outreach · est. Atlanta
          </span>
        </span>
      )}
    </span>
  );
}
