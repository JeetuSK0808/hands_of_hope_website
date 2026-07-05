import type { Metadata } from "next";
import { TeamHero } from "@/components/site/team-hero";
import { TeamRoster } from "@/components/site/team-roster";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Meet the Team",
  description:
    "The founders and executive team behind Hands of Hope Outreach — a student-led 501(c)(3) nonprofit based in Atlanta.",
  alternates: { canonical: "/team" },
  openGraph: {
    url: "https://www.handsofhopeoutreach.com/team",
    title: "Meet the Team · Hands of Hope Outreach",
    description:
      "The founders and executives behind Hands of Hope Outreach.",
  },
};

export default function TeamPage() {
  return (
    <>
      <TeamHero />
      <TeamRoster />
      <FollowUs />
      <SiteFooter />
    </>
  );
}
