import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Volunteer Portal · Hands of Hope Outreach",
  description:
    "Log service hours, track approvals, and export volunteer records for Hands of Hope Outreach chapters worldwide.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f5ef",
};

export default function PortalRootLayout({ children }: { children: ReactNode }) {
  return <div className="portal-shell min-h-screen">{children}</div>;
}
