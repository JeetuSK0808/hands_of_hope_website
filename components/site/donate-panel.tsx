"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Tier = {
  amount: number;
  label: string;
  impact: string;
};

const TIERS: Tier[] = [
  {
    amount: 25,
    label: "A start",
    impact: "Stocks the materials for a STEM Together session: paper, kits, snacks for a room of kids.",
  },
  {
    amount: 50,
    label: "A drive",
    impact: "Powers a single chapter service project, from drive collection to delivery.",
  },
  {
    amount: 100,
    label: "A starter",
    impact: "Sends the Start-a-Chapter kit to a new high school and pairs the lead with a founder mentor.",
  },
  {
    amount: 250,
    label: "A semester",
    impact: "Underwrites an entire chapter's operations for a full semester.",
  },
  {
    amount: 500,
    label: "A program",
    impact: "Sponsors a full year of STEM Together at one partner school.",
  },
];

type Frequency = "once" | "monthly";
type Method = "card" | "bank";

const HCB_DONATE_URL = "https://hcb.hackclub.com/donations/start/hands-of-hope";
const ROUTING_NUMBER = "121145307";
const BANK_NAME = "Column N.A. (via Hack Club Bank)";
const BENEFICIARY = "Hack Club Bank · Hands of Hope";

function buildHcbUrl(amount: number | null, frequency: Frequency) {
  const params = new URLSearchParams();
  // HCB / Stripe expects the amount in cents, so multiply by 100.
  if (amount && amount > 0) params.set("amount", String(amount * 100));
  if (frequency === "monthly") params.set("recurring", "true");
  const qs = params.toString();
  return qs ? `${HCB_DONATE_URL}?${qs}` : HCB_DONATE_URL;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* ignore */
        }
      }}
      aria-label={`Copy ${label}`}
      className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" strokeWidth={1.5} />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" strokeWidth={1.5} />
          Copy
        </>
      )}
    </button>
  );
}

export function DonatePanel() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [frequency, setFrequency] = React.useState<Frequency>("once");
  const [method, setMethod] = React.useState<Method>("card");
  const [selectedAmount, setSelectedAmount] = React.useState<number>(100);
  const [customAmount, setCustomAmount] = React.useState<string>("");
  const [isCustom, setIsCustom] = React.useState<boolean>(false);

  const parsedCustom = Number.parseInt(customAmount.replace(/[^0-9]/g, ""), 10);
  const validCustom =
    Number.isFinite(parsedCustom) && parsedCustom > 0 ? parsedCustom : null;
  const effectiveAmount = isCustom ? validCustom : selectedAmount;
  const canContinue = effectiveAmount !== null && effectiveAmount > 0;

  const activeTier = React.useMemo(() => {
    if (!effectiveAmount) return null;
    const sorted = [...TIERS].sort((a, b) => a.amount - b.amount);
    let match: Tier = sorted[0];
    for (const t of sorted) {
      if (effectiveAmount >= t.amount) match = t;
    }
    return match;
  }, [effectiveAmount]);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".donate-rise").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power3.out",
            delay: i * 0.06,
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const methodPanelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!methodPanelRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".method-panel-content",
        { opacity: 0, y: 14, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".method-panel-row",
        { x: -10, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.1,
        }
      );
    }, methodPanelRef);
    return () => ctx.revert();
  }, [method]);

  const donateHref = buildHcbUrl(effectiveAmount, frequency);

  return (
    <section
      ref={rootRef}
      className="relative w-full px-6 md:px-12 py-24 md:py-32 border-t border-border"
    >
      <div className="mx-auto w-full max-w-[88rem]">
        <div className="donate-rise editorial-rule editorial-eyebrow text-muted-foreground">
          Make a gift
        </div>
        <h2 className="donate-rise mt-8 editorial-display leading-[1.08] pb-2 text-[clamp(2.5rem,6.5vw,5.5rem)] max-w-3xl">
          Choose your{" "}
          <span className="italic" style={{ color: "var(--brand-rose)" }}>
            ripple.
          </span>
        </h2>
        <p className="donate-rise mt-6 max-w-xl text-muted-foreground leading-relaxed">
          Every gift is directed to underserved partners and student-led
          programs. Pick an amount and a method that fits.
        </p>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* Left: amount + method selectors */}
          <div className="donate-rise border border-border bg-card/60 p-6 md:p-10">
            {/* Frequency toggle */}
            <div
              role="tablist"
              aria-label="Donation frequency"
              className="relative inline-flex items-center border border-border bg-background p-1"
            >
              {(["once", "monthly"] as const).map((f) => {
                const active = frequency === f;
                return (
                  <button
                    key={f}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFrequency(f)}
                    className={
                      "relative z-10 px-5 py-2 text-xs font-medium tracking-[0.18em] uppercase transition-colors " +
                      (active
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    {f === "once" ? "One-time" : "Monthly"}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-0 -z-10"
                        style={{ background: "var(--foreground)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tier grid */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TIERS.map((t) => {
                const active = !isCustom && selectedAmount === t.amount;
                return (
                  <button
                    key={t.amount}
                    type="button"
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedAmount(t.amount);
                    }}
                    className={
                      "group relative flex flex-col items-start gap-2 border p-5 text-left transition-colors " +
                      (active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background hover:border-foreground/60")
                    }
                  >
                    <span className="editorial-eyebrow opacity-80">
                      {t.label}
                    </span>
                    <span className="font-display text-3xl font-light">
                      ${t.amount}
                    </span>
                    {active && (
                      <span
                        aria-hidden
                        className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--brand-rose)" }}
                      />
                    )}
                  </button>
                );
              })}

              {/* Custom amount cell */}
              <label
                className={
                  "group relative flex flex-col items-start gap-2 border p-5 text-left transition-colors " +
                  (isCustom
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background hover:border-foreground/60")
                }
              >
                <span className="editorial-eyebrow opacity-80">Other</span>
                <span className="flex items-baseline gap-1 font-display text-3xl font-light">
                  <span>$</span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    value={customAmount}
                    onFocus={() => setIsCustom(true)}
                    onChange={(e) => {
                      setIsCustom(true);
                      setCustomAmount(e.target.value);
                    }}
                    className={
                      "w-full bg-transparent font-display text-3xl font-light outline-none placeholder:opacity-50 " +
                      (isCustom ? "text-background" : "text-foreground")
                    }
                  />
                </span>
              </label>
            </div>

            {/* Method picker */}
            <div className="mt-12 border-t border-border pt-8">
              <div className="editorial-eyebrow text-muted-foreground">
                Pick a method
              </div>
              <div
                role="tablist"
                aria-label="Payment method"
                className="mt-5 grid grid-cols-2 gap-3"
              >
                {(
                  [
                    {
                      key: "card",
                      title: "Card",
                      sub: "Online · via HCB",
                    },
                    {
                      key: "bank",
                      title: "Bank transfer",
                      sub: "ACH · no fees",
                    },
                  ] as const
                ).map((m) => {
                  const active = method === m.key;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setMethod(m.key)}
                      className={
                        "relative flex flex-col items-start gap-1 border p-4 text-left transition-colors " +
                        (active
                          ? "border-foreground bg-foreground/[0.04]"
                          : "border-border bg-background hover:border-foreground/60")
                      }
                    >
                      <span className="editorial-eyebrow opacity-80">
                        {m.sub}
                      </span>
                      <span className="font-display text-xl">{m.title}</span>
                      <span
                        aria-hidden
                        className="absolute left-0 right-0 bottom-0 h-[2px] origin-left transition-transform duration-500"
                        style={{
                          background: "var(--brand-rose)",
                          transform: active ? "scaleX(1)" : "scaleX(0)",
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Method panel */}
              <div ref={methodPanelRef} className="relative mt-6 min-h-[10rem]">
                {method === "card" && (
                  <div className="method-panel-content">
                    <p className="method-panel-row text-sm text-muted-foreground leading-relaxed max-w-md">
                      We process card gifts securely through{" "}
                      <span className="text-foreground">Hack Club Bank</span>,
                      our fiscal sponsor. You&apos;ll get a tax-deductible
                      receipt automatically.
                    </p>
                    <div className="method-panel-row mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <a
                        href={donateHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={!canContinue}
                        tabIndex={canContinue ? 0 : -1}
                        onClick={(e) => {
                          if (!canContinue) e.preventDefault();
                        }}
                        className={
                          "group/cta inline-flex items-center justify-center gap-3 px-6 py-3 text-sm font-medium tracking-wide transition-all " +
                          (canContinue
                            ? "bg-foreground text-background hover:opacity-85"
                            : "bg-muted text-muted-foreground cursor-not-allowed")
                        }
                      >
                        <span>
                          Donate{" "}
                          {canContinue && (
                            <>
                              ${effectiveAmount}
                              {frequency === "monthly" ? "/mo" : ""}
                            </>
                          )}
                          {canContinue && (
                            <span className="opacity-60"> · via HCB</span>
                          )}
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                          className="transition-transform duration-500 group-hover/cta:translate-x-0.5"
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
                        href={HCB_DONATE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/skip inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span className="editorial-eyebrow">
                          Or skip to HCB directly
                        </span>
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                          className="transition-transform duration-500 group-hover/skip:translate-x-0.5"
                        >
                          <path
                            d="M5 12h14M13 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}

                {method === "bank" && (
                  <div className="method-panel-content">
                    <p className="method-panel-row text-sm text-muted-foreground leading-relaxed max-w-md">
                      Send an ACH transfer or wire directly to our Hack Club
                      Bank account. Zero processing fees, every dollar lands in
                      the program.
                    </p>
                    <div className="method-panel-row mt-6 grid gap-px bg-border border border-border sm:grid-cols-2">
                      <div className="bg-background p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="editorial-eyebrow text-muted-foreground">
                            Routing number
                          </span>
                          <CopyButton value={ROUTING_NUMBER} label="routing number" />
                        </div>
                        <div className="mt-2 font-display text-2xl tracking-wider">
                          {ROUTING_NUMBER}
                        </div>
                      </div>
                      <div className="bg-background p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="editorial-eyebrow text-muted-foreground">
                            Beneficiary
                          </span>
                          <CopyButton value={BENEFICIARY} label="beneficiary" />
                        </div>
                        <div className="mt-2 font-display text-base leading-snug">
                          {BENEFICIARY}
                        </div>
                      </div>
                      <div className="bg-background p-4 sm:col-span-2">
                        <span className="editorial-eyebrow text-muted-foreground">
                          Bank
                        </span>
                        <div className="mt-2 font-display text-base">
                          {BANK_NAME}
                        </div>
                      </div>
                      <div className="bg-background p-4 sm:col-span-2">
                        <span className="editorial-eyebrow text-muted-foreground">
                          Reference (memo)
                        </span>
                        <div className="mt-2 text-sm leading-relaxed">
                          Include &ldquo;Hands of Hope · {frequency === "monthly" ? "monthly" : "one-time"} · ${effectiveAmount ?? 0}&rdquo;
                          and your name so we can issue your receipt.
                        </div>
                      </div>
                    </div>
                    <div className="method-panel-row mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <a
                        href={`mailto:info@handsofhopeoutreach.org?subject=ACH%20donation%20%C2%B7%20%24${effectiveAmount ?? 0}&body=Hi%2C%20I%20just%20initiated%20an%20ACH%20transfer%20for%20%24${effectiveAmount ?? 0}.%20Please%20send%20the%20account%20number%20%2F%20wire%20details%20and%20I%27ll%20reply%20with%20my%20transfer%20confirmation%20for%20a%20receipt.`}
                        className="inline-flex items-center gap-3 bg-foreground px-6 py-3 text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-85"
                      >
                        <span>Request account number</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </a>
                      <span className="text-xs text-muted-foreground max-w-[14rem]">
                        We share the full account number on request to prevent
                        spam, then mail a tax receipt.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: live impact preview */}
          <aside className="donate-rise relative border border-border bg-background p-6 md:p-10">
            <div className="editorial-eyebrow text-muted-foreground">
              Your impact
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-6xl md:text-7xl font-light leading-none">
                ${effectiveAmount ?? 0}
              </span>
              <span className="font-display text-xl italic text-muted-foreground">
                {frequency === "monthly" ? "/ month" : "one-time"}
              </span>
            </div>

            <div
              className="mt-8 h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--brand-rose), transparent)",
              }}
              aria-hidden
            />

            <div className="mt-8">
              <div className="editorial-eyebrow text-muted-foreground">
                What this funds
              </div>
              <p className="mt-3 text-base text-foreground/85 leading-relaxed">
                {activeTier?.impact ??
                  "Enter an amount to see what your gift can build."}
              </p>
            </div>

            {frequency === "monthly" && effectiveAmount && (
              <div className="mt-8 border-t border-border pt-6">
                <div className="editorial-eyebrow text-muted-foreground">
                  Over a year
                </div>
                <div className="mt-2 font-display text-2xl italic">
                  ${effectiveAmount * 12} toward Hands of Hope programs.
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-6"
                  style={{ background: "var(--brand-navy)" }}
                />
                <span className="editorial-eyebrow">
                  Tax-deductible · 501(c)(3)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-6"
                  style={{ background: "var(--brand-rose)" }}
                />
                <span className="editorial-eyebrow">
                  Processed by Hack Club Bank
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
