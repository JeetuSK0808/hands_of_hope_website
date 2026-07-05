import type { Metadata } from "next";
import { AnnualEventsHero } from "@/components/site/annual-events-hero";
import { AnnualEventsStage } from "@/components/site/annual-events-stage";
import { AnnualEventsSponsor } from "@/components/site/annual-events-sponsor";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Annual Events — Awards Ceremony & Ripple for Change",
  description:
    "The two flagship Hands of Hope Outreach events: the winter Awards Ceremony and the summer Ripple for Change kit-packing assembly. Sponsorship, tickets, and volunteer sign-up.",
  alternates: { canonical: "/annual-events" },
  openGraph: {
    url: "https://www.handsofhopeoutreach.com/annual-events",
    title: "Annual Events · Hands of Hope Outreach",
    description:
      "The Awards Ceremony every winter and the Ripple for Change kit-packing assembly every summer.",
  },
};

export default function AnnualEventsPage() {
  return (
    <>
      <AnnualEventsHero />
      <AnnualEventsStage />
      <AnnualEventsSponsor />
      <FollowUs />
      <SiteFooter />
    </>
  );
}
