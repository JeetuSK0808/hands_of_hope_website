import { TeamHero } from "@/components/site/team-hero";
import { TeamRoster } from "@/components/site/team-roster";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata = {
  title: "Meet the Team · Hands of Hope",
  description:
    "Founders and executives behind Hands of Hope.",
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
