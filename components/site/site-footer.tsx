"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatedLogo } from "./animated-logo";

const NAV = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/about#branches" },
  { label: "Impact", href: "/#impact" },
  { label: "Partners", href: "/#partners" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
];

const RESOURCES = [
  { label: "Awards Ceremony", href: "/about#awards" },
  { label: "Ripple for Change", href: "/about#ripple" },
  { label: "Start a Chapter", href: "/contact" },
  { label: "STEM Buddies", href: "/about#branches" },
];

export function SiteFooter() {
  return (
    <footer
      className="relative w-full border-t border-border"
      style={{ background: "oklch(0.9 0.004 80)" }}
    >
      <div className="mx-auto max-w-[88rem] px-6 md:px-12 pt-24 pb-10">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <AnimatedLogo size={36} />
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Hands of Hope is a 501(c)(3) student-led nonprofit fiscally
              sponsored by Hack Club. We connect high school students with the
              communities just outside their classroom.
            </p>
          </div>

          <FooterColumn title="Site" links={NAV} />
          <FooterColumn title="Programs" links={RESOURCES} />

          <div>
            <div className="editorial-eyebrow text-muted-foreground">
              Contact
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@handsofhopeoutreach.com"
                  className="text-foreground hover:opacity-70 transition-opacity"
                >
                  info@handsofhopeoutreach.com
                </a>
              </li>
              <li className="text-muted-foreground">Atlanta, GA</li>
              <li className="flex gap-6 pt-2">
                <a
                  href="https://www.instagram.com/handsofhope_outreach/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:opacity-70 transition-opacity"
                >
                  Instagram
                </a>
                <a
                  href="https://linkedin.com/company/handsofhopeoutreach"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:opacity-70 transition-opacity"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <div className="editorial-eyebrow text-muted-foreground">
            © 2026 Hands of Hope · 501(c)(3)
          </div>
          <div className="text-xs text-muted-foreground">
            Fiscally sponsored by Hack Club
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="editorial-eyebrow text-muted-foreground">{title}</div>
      <ul className="mt-6 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-foreground hover:opacity-70 transition-opacity"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
