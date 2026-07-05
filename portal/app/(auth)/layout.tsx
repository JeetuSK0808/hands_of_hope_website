import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <aside
        className="hidden md:flex flex-col justify-between p-12 text-white"
        style={{ background: "var(--hoh-purple)" }}
      >
        <div>
          <div className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>
            Hands of Hope Outreach
          </div>
          <div className="mt-4 text-4xl font-light">
            Volunteer<br /> Portal.
          </div>
        </div>
        <div>
          <div className="text-5xl font-light italic leading-tight">
            Compassion,<br /> in action.
          </div>
          <div className="mt-8 text-sm text-white/70">
            <Link href="https://www.handsofhopeoutreach.com" className="underline underline-offset-4">
              ← Back to handsofhopeoutreach.com
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
