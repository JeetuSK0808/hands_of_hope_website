import { Hero } from "@/components/site/hero";
import { StatsSection } from "@/components/site/stats-section";
import { MissionVision } from "@/components/site/mission-vision";
import { MomentsGallery } from "@/components/site/moments-gallery";
import { PartnersSection } from "@/components/site/partners-section";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionVision />
      <StatsSection />
      <MomentsGallery />
      <PartnersSection />
      <FollowUs />
      <SiteFooter />
    </>
  );
}
