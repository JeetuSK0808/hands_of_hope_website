import { AnnualEventsHero } from "@/components/site/annual-events-hero";
import { AnnualEventsStage } from "@/components/site/annual-events-stage";
import { AnnualEventsSponsor } from "@/components/site/annual-events-sponsor";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata = {
  title: "Annual Events · Hands of Hope",
  description:
    "Two nights a year carry the weight of every quiet hour in between. The Hands of Hope Awards Ceremony every winter, and the Ripple for Change kit-packing assembly every summer.",
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
