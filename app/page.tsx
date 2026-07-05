import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { StatsSection } from "@/components/site/stats-section";
import { MissionVision } from "@/components/site/mission-vision";
import { MomentsGallery } from "@/components/site/moments-gallery";
import { PartnersSection } from "@/components/site/partners-section";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: {
    absolute: "Hands of Hope Outreach · Student-led nonprofit in Atlanta",
  },
  description:
    "Hands of Hope Outreach is a student-led 501(c)(3) nonprofit based in Atlanta. High school chapters run STEM Buddies mentoring, the annual Awards Ceremony, and the Ripple for Change kit-packing assembly.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "https://www.handsofhopeoutreach.com/",
    title: "Hands of Hope Outreach · Student-led nonprofit in Atlanta",
    description:
      "Student-led 501(c)(3) nonprofit connecting high schoolers with the communities just outside their classroom.",
  },
};

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
