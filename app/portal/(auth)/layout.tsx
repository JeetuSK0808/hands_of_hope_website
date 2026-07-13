import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function PortalAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <aside
        className="relative isolate hidden md:flex flex-col justify-between p-12 overflow-hidden"
        style={{ color: "var(--background)" }}
      >
        <Image
          src="/general/tracker-bg.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover -z-20 select-none pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, oklch(0 0 0 / 0.62) 0%, oklch(0 0 0 / 0.72) 55%, oklch(0 0 0 / 0.82) 100%)",
          }}
        />

        <Link href="/" className="relative inline-flex items-center gap-3">
          <Image
            src="/brand/logo.png"
            alt="Hands of Hope Outreach"
            width={44}
            height={44}
            className="rounded-sm"
            style={{ background: "var(--background)", padding: "4px" }}
            priority
          />
          <span className="portal-eyebrow" style={{ color: "var(--background)", opacity: 0.75 }}>
            Hands of Hope · Outreach
          </span>
        </Link>

        <div className="relative">
          <div
            className="portal-display italic"
            style={{ fontSize: "clamp(2.75rem, 3vw, 4rem)", lineHeight: 1.02 }}
          >
            Compassion,
            <br /> in action.
          </div>
          <p className="mt-6 text-sm opacity-80 max-w-xs">
            The volunteer portal for every Hands of Hope chapter. Log service hours, get approvals,
            and export records for grants and awards.
          </p>
        </div>

        <div className="relative text-xs opacity-70">
          <Link href="/" className="underline underline-offset-4">
            ← Back to handsofhopeoutreach.org
          </Link>
        </div>
      </aside>

      <main className="flex items-center justify-center p-8 md:p-16 bg-background">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 flex items-center gap-3">
            <Image src="/brand/logo.png" alt="Hands of Hope" width={36} height={36} />
            <span className="portal-eyebrow">Volunteer Portal</span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
