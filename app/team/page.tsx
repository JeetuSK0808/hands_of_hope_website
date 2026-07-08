import type { Metadata } from "next";
import { TeamHero } from "@/components/site/team-hero";
import { TeamRoster } from "@/components/site/team-roster";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";
import { SeoBreadcrumb } from "@/components/site/seo-breadcrumb";

export const metadata: Metadata = {
  title: "Meet the Team — Founders & Executive Board",
  description:
    "The founders and executive board behind Hands of Hope Outreach, the student-led 501(c)(3) nonprofit based in Atlanta running chapters across the US, Canada, Chile, and Denmark.",
  alternates: { canonical: "/team" },
  openGraph: {
    url: "https://www.handsofhopeoutreach.com/team",
    title: "Meet the Team · Hands of Hope Outreach",
    description:
      "The founders and executive board behind Hands of Hope Outreach.",
  },
};

export default function TeamPage() {
  return (
    <>
      <TeamHero />
      <TeamRoster />
      <FollowUs />
      <SiteFooter />
      <SeoBreadcrumb trail={[{ name: "Meet the Team", path: "/team" }]} />
    </>
  );
}
