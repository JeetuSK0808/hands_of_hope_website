import type { Metadata } from "next";
import { AnnualEventsHero } from "@/components/site/annual-events-hero";
import { AnnualEventsStage } from "@/components/site/annual-events-stage";
import { AnnualEventsSponsor } from "@/components/site/annual-events-sponsor";
import { AnnualEventsRail } from "@/components/site/annual-events-rail";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";
import { SeoBreadcrumb } from "@/components/site/seo-breadcrumb";

export const metadata: Metadata = {
  title: "Annual Events — Awards Ceremony & Ripple for Change",
  description:
    "Hands of Hope Outreach runs two flagship events every year: the winter Awards Ceremony and the spring Ripple for Change kit-packing assembly. Sponsorship info, tickets, and volunteer sign-up.",
  alternates: { canonical: "/annual-events" },
  openGraph: {
    url: "https://handsofhopeoutreach.org/annual-events",
    title: "Annual Events · Hands of Hope Outreach",
    description:
      "The Awards Ceremony every winter and the Ripple for Change kit-packing assembly every spring.",
  },
};

export default function AnnualEventsPage() {
  return (
    <>
      <AnnualEventsRail />
      <AnnualEventsHero />
      <AnnualEventsStage />
      <AnnualEventsSponsor />
      <FollowUs />
      <SiteFooter />
      <SeoBreadcrumb
        trail={[{ name: "Annual Events", path: "/annual-events" }]}
      />
    </>
  );
}
