import type { Metadata } from "next";
import { AboutHero } from "@/components/site/about-hero";
import { HowWeWork } from "@/components/site/how-we-work";
import { InternationalSection } from "@/components/site/international-section";
import { BranchesShowcase } from "@/components/site/branches-showcase";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";
import { SeoBreadcrumb } from "@/components/site/seo-breadcrumb";

export const metadata: Metadata = {
  title: "About · Student-led 501(c)(3) nonprofit in Atlanta",
  description:
    "Hands of Hope Outreach is a student-led 501(c)(3) nonprofit founded by high school students in Atlanta. Chapters and STEM Together programs run across the US, Canada, Chile, and Denmark. Learn who we are, what we do, and how to start a Hands of Hope chapter.",
  alternates: { canonical: "/about" },
  openGraph: {
    url: "https://handsofhopeoutreach.org/about",
    title: "About Hands of Hope Outreach — Student-led 501(c)(3)",
    description:
      "Student-led 501(c)(3) network of high school chapters — Atlanta, US, Canada, Chile, Denmark.",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <HowWeWork />
      <BranchesShowcase />
      <InternationalSection />
      <FollowUs />
      <SiteFooter />
      <SeoBreadcrumb trail={[{ name: "About", path: "/about" }]} />
    </>
  );
}
