import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/site/nav-bar";
import { Chatbot } from "@/components/site/chatbot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://www.handsofhopeoutreach.com";
const SITE_NAME = "Hands of Hope Outreach";
const DEFAULT_TITLE =
  "Hands of Hope Outreach · Student-led 501(c)(3) nonprofit · Atlanta";
const DEFAULT_DESCRIPTION =
  "Hands of Hope Outreach is a student-led 501(c)(3) nonprofit based in Atlanta. High school chapters across the US, Canada, Chile, and Denmark run STEM Buddies mentoring, the Ripple for Change kit-packing assembly, and the annual Awards Ceremony.";
const OG_IMAGE = `${SITE_URL}/general/award-ceremony-hi.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    // Brand front-loaded so "Hands of Hope Outreach" is always the first token
    // in the SERP title link — strengthens brand-name recognition ranking.
    template: "Hands of Hope Outreach · %s",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Hands of Hope",
    "Hands of Hope Outreach",
    "handsofhope",
    "handsofhopeoutreach",
    "handsofhope outreach",
    "hands of hope nonprofit",
    "hands of hope atlanta",
    "hands of hope 501c3",
    "hands of hope high school",
    "hands of hope student nonprofit",
    "student nonprofit Atlanta",
    "high school volunteer nonprofit",
    "STEM Buddies",
    "Ripple for Change",
    "youth-led 501c3",
    "Atlanta youth service",
    "chapter-based volunteer network",
    "Hack Club fiscally sponsored",
  ],
  authors: [
    { name: "Hands of Hope Outreach", url: SITE_URL },
  ],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "nonprofit",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 1600,
        height: 900,
        alt: "Hands of Hope Outreach — Awards Ceremony",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@handsofhope_outreach",
    site: "@handsofhope_outreach",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION ?? "",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: "Hands of Hope Outreach",
  alternateName: [
    "Hands of Hope",
    "HoH",
    "HOH",
    "HOH Outreach",
    "Hands of Hope Nonprofit",
  ],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/brand/logo.png`,
    width: 512,
    height: 512,
  },
  image: OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
  slogan: "Compassion, in action.",
  email: "info@handsofhopeoutreach.com",
  foundingLocation: {
    "@type": "Place",
    name: "Atlanta, Georgia, United States",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Atlanta",
      addressRegion: "GA",
      addressCountry: "US",
    },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Atlanta",
    addressRegion: "GA",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Atlanta, Georgia" },
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "Chile" },
    { "@type": "Country", name: "Denmark" },
  ],
  knowsAbout: [
    "student-led community service",
    "STEM mentoring for elementary students",
    "high school volunteer chapters",
    "youth-run nonprofit programs",
    "kit-packing service events",
  ],
  keywords:
    "Hands of Hope, Hands of Hope Outreach, student nonprofit, Atlanta, 501(c)(3), STEM Buddies, Ripple for Change, high school volunteering",
  nonprofitStatus: "Nonprofit501c3",
  parentOrganization: {
    "@type": "Organization",
    name: "The Hack Foundation (Hack Club)",
    url: "https://hackclub.com",
    description: "Fiscal sponsor",
  },
  sameAs: [
    "https://www.instagram.com/handsofhope_outreach/",
    "https://linkedin.com/company/handsofhopeoutreach",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "General",
      email: "info@handsofhopeoutreach.com",
      availableLanguage: ["English"],
      areaServed: ["US", "CA", "CL", "DK"],
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: ["Hands of Hope", "HoH", "HOH Outreach"],
  url: SITE_URL,
  inLanguage: "en-US",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Chatbot />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
