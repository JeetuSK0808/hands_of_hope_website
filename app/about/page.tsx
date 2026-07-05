import type { Metadata } from "next";
import { AboutHero } from "@/components/site/about-hero";
import { InternationalSection } from "@/components/site/international-section";
import { BranchesShowcase } from "@/components/site/branches-showcase";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "About Hands of Hope Outreach",
  description:
    "Hands of Hope Outreach was founded in Atlanta by high school students. The 501(c)(3) network runs chapters, STEM Buddies mentoring, and the annual Awards Ceremony across the US, Canada, Chile, and Denmark.",
  alternates: { canonical: "/about" },
  openGraph: {
    url: "https://www.handsofhopeoutreach.com/about",
    title: "About Hands of Hope Outreach",
    description:
      "Student-led 501(c)(3) network of high school chapters — Atlanta, US, Canada, Chile, Denmark.",
  },
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
