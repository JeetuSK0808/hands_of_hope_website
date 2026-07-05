import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hands of Hope Outreach — Volunteer Portal",
  description:
    "Log service hours, track approvals, and export volunteer records for Hands of Hope Outreach chapters worldwide.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
