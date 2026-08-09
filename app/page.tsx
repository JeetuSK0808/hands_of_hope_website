import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { StatsSection } from "@/components/site/stats-section";
import { MissionVision } from "@/components/site/mission-vision";
import { MomentsGallery } from "@/components/site/moments-gallery";
import { PartnersSection } from "@/components/site/partners-section";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";

const SITE_URL = "https://handsofhopeoutreach.org";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Hands of Hope Outreach?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hands of Hope Outreach is a student-led 501(c)(3) nonprofit based in Atlanta. High school chapters across the US, Canada, Chile, and Denmark run STEM Together, the spring Ripple for Change kit-packing assembly, and the winter Awards Ceremony.",
      },
    },
    {
      "@type": "Question",
      name: "Is Hands of Hope a registered 501(c)(3)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hands of Hope Outreach is a registered 501(c)(3) nonprofit, fiscally sponsored by The Hack Foundation (Hack Club). Donations are tax-deductible.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Hands of Hope Outreach based?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The organization was founded in Atlanta, Georgia, with active high school chapters across the United States, Canada, Chile, and Denmark.",
      },
    },
    {
      "@type": "Question",
      name: "How do I start a Hands of Hope chapter at my high school?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Email info@handsofhopeoutreach.org or use the contact form at handsofhopeoutreach.org/contact. The executive team will walk you through the chapter application, on-boarding, and the projects your school can adopt.",
      },
    },
    {
      "@type": "Question",
      name: "What programs does Hands of Hope Outreach run?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Programs include STEM Together (accessible, hands-on STEM with special-needs schools, now running at multiple chapters), Ripple for Change (the annual spring kit-packing assembly every chapter takes part in), and the winter Awards Ceremony recognizing top student volunteers.",
      },
    },
    {
      "@type": "Question",
      name: "How can I donate to Hands of Hope Outreach?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Donations are accepted at handsofhopeoutreach.org/donate. Every gift is tax-deductible under our 501(c)(3) status via our fiscal sponsor, Hack Club.",
      },
    },
  ],
};

const homeBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Hands of Hope Outreach",
      item: SITE_URL,
    },
  ],
};

const homeWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: "Hands of Hope Outreach · Student-led 501(c)(3) nonprofit · Atlanta",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}/general/award-ceremony-hi.jpg`,
  },
  inLanguage: "en-US",
  description:
    "Official website of Hands of Hope Outreach — student-led 501(c)(3) nonprofit based in Atlanta, running high school chapters across the US, Canada, Chile, and Denmark.",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "p"],
  },
  significantLink: [
    `${SITE_URL}/about`,
    `${SITE_URL}/team`,
    `${SITE_URL}/annual-events`,
    `${SITE_URL}/donate`,
    `${SITE_URL}/contact`,
  ],
};

export const metadata: Metadata = {
  title: {
    absolute:
      "Hands of Hope Outreach · Student-led 501(c)(3) nonprofit · Atlanta",
  },
  description:
    "Hands of Hope Outreach is a student-led 501(c)(3) nonprofit based in Atlanta. High school chapters across the US, Canada, Chile, and Denmark run STEM Together, the spring Ripple for Change kit-packing assembly, and the winter Awards Ceremony.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "https://handsofhopeoutreach.org/",
    title: "Hands of Hope Outreach · Student-led 501(c)(3) nonprofit",
    description:
      "Student-led 501(c)(3) nonprofit connecting high schoolers with the communities just outside their classroom. Chapters in Atlanta, US, Canada, Chile, and Denmark.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeBreadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeWebPageJsonLd) }}
      />
    </>
  );
}
