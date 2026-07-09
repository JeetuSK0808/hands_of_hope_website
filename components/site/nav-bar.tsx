"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatedLogo } from "./animated-logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Meet the Team", href: "/team" },
  { label: "Annual Events", href: "/annual-events" },
  { label: "Shop", href: "/merch" },
  { label: "Impact", href: "/#impact" },
  { label: "Partners", href: "/#partners" },
  { label: "Donate", href: "/donate" },
];

export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const inPortal = pathname?.startsWith("/portal");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (inPortal) return null;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-border/70 bg-background/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="mx-auto flex w-full max-w-[88rem] items-center justify-between gap-6 px-6 py-5 md:px-12">
          <Link
            href="/"
            className="group"
            aria-label="Hands of Hope Outreach — Home"
            title="Hands of Hope Outreach"
          >
            <AnimatedLogo size={34} monochrome={scrolled ? "dark" : "light"} />
          </Link>

          <ul className="hidden md:flex items-center gap-5 lg:gap-7">
            {NAV_LINKS.map((l) => {
              const active =
                l.href === "/"
                  ? pathname === "/"
                  : pathname === l.href ||
                    (l.href.startsWith("/") && !l.href.includes("#") &&
                      pathname?.startsWith(l.href + "/"));
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "relative text-sm font-medium transition-colors duration-500",
                      scrolled
                        ? active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                        : active
                          ? "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
                          : "text-white/80 hover:text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
                    )}
                  >
                    {l.label}
                    {active && (
                      <span className="absolute -bottom-1.5 left-0 right-0 mx-auto h-px w-4 bg-[var(--brand-rose)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:flex items-center gap-5">
            <a
              href="/portal"
              className={cn(
                "inline-flex items-center border-b pb-0.5 text-sm font-medium transition-colors duration-500 hover:opacity-70",
                scrolled
                  ? "border-foreground text-foreground"
                  : "border-white text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
              )}
            >
              Volunteer Portal
            </a>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className={cn(
              "md:hidden inline-flex h-10 w-10 items-center justify-center transition-colors duration-500",
              scrolled ? "text-foreground" : "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
            )}
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-500",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-[88vw] max-w-sm overflow-hidden bg-background border-l border-border transition-transform duration-500",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <AnimatedLogo size={32} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center text-foreground"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <ul className="flex flex-col px-2 py-6">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block px-6 py-4 font-display text-3xl font-light italic tracking-tight text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-4 px-6 flex flex-col gap-3">
              <a
                href="/portal"
                className="inline-block self-start border-b border-foreground pb-1 text-sm font-medium text-foreground"
              >
                Volunteer Portal
              </a>
            </li>
          </ul>
          <div className="absolute bottom-6 left-6 right-6 editorial-eyebrow text-muted-foreground">
            Atlanta · 501(c)(3)
          </div>
        </div>
      </div>
    </>
  );
}
