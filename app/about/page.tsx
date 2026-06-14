import { AboutHero } from "@/components/site/about-hero";
import { InternationalSection } from "@/components/site/international-section";
import { BranchesShowcase } from "@/components/site/branches-showcase";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata = {
  title: "About · Hands of Hope",
  description:
    "Founded by Daksh Shah, Hands of Hope connects high school students with the communities just outside their classroom, through chapters, STEM Buddies, and the annual Awards Ceremony.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <BranchesShowcase />
      <InternationalSection />
      <FollowUs />
      <SiteFooter />
    </>
  );
}
