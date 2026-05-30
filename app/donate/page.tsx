import Image from "next/image";
import { DonatePanel } from "@/components/site/donate-panel";
import { ImpactBand } from "@/components/site/impact-band";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata = {
  title: "Donate · Hands of Hope",
  description:
    "Support Hands of Hope. Every gift is tax-deductible and directed to student-led service across Atlanta and beyond. 501(c)(3), fiscally sponsored by Hack Club.",
};

const ALLOCATION = [
  {
    pct: "72%",
    label: "Programs",
    body: "STEM Buddies kits, chapter projects, and the supplies that go straight to community partners.",
    accent: "var(--brand-rose)",
  },
  {
    pct: "18%",
    label: "Awards & events",
    body: "Two nights a year: the Awards Ceremony and Ripple for Change. Where the work gets seen.",
    accent: "var(--brand-navy)",
  },
  {
    pct: "10%",
    label: "Operations",
    body: "Insurance, supplies, and the fiscal sponsorship fee. The bare minimum to keep us compliant.",
    accent: "var(--brand-rose-soft)",
  },
];

const OTHER_WAYS = [
  {
    title: "In-kind giving",
    body: "Books, kits, food, and supplies are placed directly into chapter projects.",
    cta: { label: "Email the team", href: "mailto:info@handsofhopeoutreach.com?subject=In-kind%20donation" },
  },
  {
    title: "Partner with us",
    body: "Mission-aligned orgs, foundations, and family funds. Let's find the overlap.",
    cta: { label: "Start a conversation", href: "/contact" },
  },
  {
    title: "Host a drive",
    body: "Run a fundraiser or supply drive at your school, business, or community group.",
    cta: { label: "Get the drive kit", href: "mailto:info@handsofhopeoutreach.com?subject=Hosting%20a%20drive" },
  },
];

export default function DonatePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[78svh] w-full flex-col justify-end overflow-hidden">
        <Image
          src="/general/first-kit-packing.jpg"
          alt="Hands of Hope volunteers packing the first kits for the community"
          fill
          priority
          sizes="100vw"
          className="object-cover animate-ken-burns"
        />
        <div className="tint-overlay-strong" aria-hidden />

        <div className="relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-20 md:pb-24 pt-40 on-image">
          <div className="animate-fade-up [animation-delay:120ms]">
            <span className="editorial-rule editorial-eyebrow">
              Donate · 501(c)(3)
            </span>
          </div>
          <h1 className="mt-10 editorial-display leading-[1.04] pb-2 text-[clamp(3rem,8.5vw,8.5rem)] max-w-[18ch] animate-fade-up [animation-delay:280ms]">
            Fund the next{" "}
            <span className="italic">ripple.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed animate-fade-up [animation-delay:440ms]">
            Hands of Hope is a 501(c)(3) nonprofit, fiscally sponsored by Hack
            Club. Every dollar moves through to underserved partners and the
            student-led programs that keep the work going.
          </p>

          <div className="mt-12 flex flex-wrap gap-6 animate-fade-up [animation-delay:600ms]">
            <a
              href="https://hcb.hackclub.com/donations/start/hands-of-hope"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-white px-6 py-3 text-sm font-medium tracking-wide text-foreground transition-opacity hover:opacity-90"
            >
              <span>Donate via HCB</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-0.5"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7v9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#give"
              className="inline-flex items-center border-b border-white/80 pb-1 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-70"
            >
              Pick an amount first
            </a>
            <a
              href="#allocation"
              className="inline-flex items-center border-b border-white/40 pb-1 text-sm font-medium tracking-wide text-white/80 transition-opacity hover:opacity-100"
            >
              Where it goes
            </a>
          </div>
        </div>
      </section>

      {/* Donate panel */}
      <div id="give" />
      <DonatePanel />

      {/* Service in motion: photo band */}
      <ImpactBand />

      {/* Where it goes */}
      <section
        id="allocation"
        className="relative w-full px-6 md:px-12 py-24 md:py-32 border-t border-border"
      >
        <div className="mx-auto w-full max-w-[88rem]">
          <div className="grid gap-8 md:grid-cols-[1.6fr_1fr] md:items-end">
            <div>
              <div className="editorial-rule editorial-eyebrow text-muted-foreground">
                Where it goes
              </div>
              <h2 className="mt-8 editorial-display leading-[1.08] pb-2 text-[clamp(2.25rem,5.5vw,4.5rem)] max-w-2xl">
                Mostly to the{" "}
                <span className="italic" style={{ color: "var(--brand-navy)" }}>
                  ground.
                </span>
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground leading-relaxed md:text-right md:self-end">
              <span className="text-foreground font-medium">72¢ of every dollar</span>{" "}
              goes straight into programs. The rest covers the nights that
              honor the work, and the paperwork that keeps the lights on.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3 md:divide-x md:divide-border">
            {ALLOCATION.map((a, i) => (
              <article
                key={a.label}
                className="relative md:px-10 first:md:pl-0 last:md:pr-0"
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-display text-6xl md:text-7xl font-light italic leading-none"
                    style={{ color: a.accent }}
                  >
                    {a.pct}
                  </span>
                  <span className="editorial-eyebrow text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} / 03
                  </span>
                </div>
                <div className="mt-6 font-display text-2xl font-normal">
                  {a.label}
                </div>
                <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
                  {a.body}
                </p>
              </article>
            ))}
          </div>

          {/* Allocation bar */}
          <div className="mt-16 flex h-2 w-full overflow-hidden border border-border">
            {ALLOCATION.map((a) => (
              <span
                key={a.label}
                aria-hidden
                className="block h-full"
                style={{
                  width: a.pct,
                  background: a.accent,
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>Each dollar</span>
            <span>$1</span>
          </div>
        </div>
      </section>

      {/* Other ways to give */}
      <section className="relative w-full px-6 md:px-12 py-24 md:py-32 border-t border-border bg-card/40">
        <div className="mx-auto w-full max-w-[88rem]">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-end">
            <div>
              <div className="editorial-rule editorial-eyebrow text-muted-foreground">
                Other ways to give
              </div>
              <h2 className="mt-8 editorial-display leading-[1.08] pb-2 text-[clamp(2.25rem,5.5vw,4.5rem)] max-w-xl">
                Money is not the only{" "}
                <span className="italic" style={{ color: "var(--brand-rose)" }}>
                  way in.
                </span>
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground leading-relaxed md:justify-self-end">
              Books, drives, partnerships, time. The work runs on more than
              dollars. Here&apos;s how else you can step into it.
            </p>
          </div>

          <div className="mt-16 grid gap-px bg-border md:grid-cols-3">
            {OTHER_WAYS.map((w, i) => (
              <article
                key={w.title}
                className="relative flex flex-col bg-background p-8 md:p-10"
              >
                <span className="editorial-eyebrow text-muted-foreground/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-3xl font-normal">
                  {w.title}
                </h3>
                <p className="mt-4 flex-1 text-sm text-muted-foreground leading-relaxed">
                  {w.body}
                </p>
                <a
                  href={w.cta.href}
                  className="mt-8 inline-flex items-center gap-3 self-start border-b border-foreground pb-1 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
                >
                  {w.cta.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M7 17L17 7M17 7H8M17 7v9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / fine print */}
      <section className="relative w-full px-6 md:px-12 py-20 border-t border-border">
        <div className="mx-auto w-full max-w-[88rem] grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div>
            <div className="editorial-eyebrow text-muted-foreground">
              Fiscally sponsored by Hack Club
            </div>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
              Hands of Hope is a registered 501(c)(3) nonprofit, fiscally
              sponsored by Hack Club. Donations are processed securely on{" "}
              <a
                href="https://hcb.hackclub.com/donations/start/hands-of-hope"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                Hack Club Bank
              </a>{" "}
              and are tax-deductible to the extent permitted by law. A receipt
              is issued automatically.
            </p>
          </div>
          <div className="md:text-right">
            <div className="editorial-eyebrow text-muted-foreground">
              Questions
            </div>
            <a
              href="mailto:info@handsofhopeoutreach.com"
              className="mt-3 inline-block font-display text-xl italic text-foreground transition-opacity hover:opacity-70"
            >
              info@handsofhopeoutreach.com
            </a>
          </div>
        </div>
      </section>

      <FollowUs />
      <SiteFooter />
    </>
  );
}
