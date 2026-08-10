import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/site/nav-bar";
import { Chatbot } from "@/components/site/chatbot";
import { HashScrollFix } from "@/components/site/hash-scroll-fix";

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

const SITE_URL = "https://handsofhopeoutreach.org";
const SITE_NAME = "Hands of Hope Outreach";
const DEFAULT_TITLE =
  "Hands of Hope Outreach · Student-led 501(c)(3) nonprofit · Atlanta";
const DEFAULT_DESCRIPTION =
  "Hands of Hope Outreach is a student-led 501(c)(3) nonprofit based in Atlanta. High school chapters across the US, Canada, Chile, and Denmark run STEM Together, the spring Ripple for Change kit-packing assembly, and the winter Awards Ceremony.";
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
    "STEM Together",
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
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ??
      "xm8B9f8HWc5LK2KaYC_Evpd4uGVLX1oxnQWRDeDwUxA",
  },
};

const FOUNDER_DAKSH = {
  "@type": "Person",
  "@id": `${SITE_URL}/team#daksh-shah`,
  name: "Daksh Shah",
  jobTitle: "Co-founder",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  image: `${SITE_URL}/team/daksh-shah.jpg`,
  url: `${SITE_URL}/team`,
};

const FOUNDER_SHUBHAM = {
  "@type": "Person",
  "@id": `${SITE_URL}/team#shubham-trivedi`,
  name: "Shubham Trivedi",
  jobTitle: "Co-founder",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  image: `${SITE_URL}/team/shubham-trivedi.jpg`,
  url: `${SITE_URL}/team`,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["NGO", "EducationalOrganization"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: "Hands of Hope Outreach",
  alternateName: [
    "Hands of Hope",
    "HoH",
    "HOH",
    "HOH Outreach",
    "Hands of Hope Nonprofit",
    "Hands of Hope Atlanta",
    "Hands of Hope 501c3",
    "Hands of Hope student nonprofit",
    "handsofhopeoutreach",
  ],
  url: SITE_URL,
  mainEntityOfPage: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/brand/logo.png`,
    width: 512,
    height: 512,
    caption: "Hands of Hope Outreach logo",
  },
  image: OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
  slogan: "Compassion, in action.",
  email: "info@handsofhopeoutreach.org",
  foundingDate: "2023",
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
    "volunteer hour tracking",
    "chapter starter kits",
  ],
  keywords:
    "Hands of Hope, Hands of Hope Outreach, student nonprofit, Atlanta, 501(c)(3), STEM Together, Ripple for Change, high school volunteering",
  nonprofitStatus: "Nonprofit501c3",
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "Tax status",
    name: "IRS 501(c)(3) — via fiscal sponsor The Hack Foundation",
  },
  founder: [FOUNDER_DAKSH, FOUNDER_SHUBHAM],
  founders: [FOUNDER_DAKSH, FOUNDER_SHUBHAM],
  member: [FOUNDER_DAKSH, FOUNDER_SHUBHAM],
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
      email: "info@handsofhopeoutreach.org",
      availableLanguage: ["English"],
      areaServed: ["US", "CA", "CL", "DK"],
    },
    {
      "@type": "ContactPoint",
      contactType: "Chapter applications",
      email: "info@handsofhopeoutreach.org",
      availableLanguage: ["English"],
      areaServed: ["US", "CA", "CL", "DK"],
    },
  ],
  subjectOf: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/about`,
    name: "About Hands of Hope Outreach",
    url: `${SITE_URL}/about`,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: [
    "Hands of Hope",
    "HoH",
    "HOH Outreach",
    "Hands of Hope Nonprofit",
    "Hands of Hope Atlanta",
  ],
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

// Site-wide sitelinks searchbox hint: helps Google surface the brand's own
// primary CTAs (Donate, Contact, Team, Annual Events) as sitelinks under the
// main "Hands of Hope Outreach" result.
const siteNavJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#sitelinks`,
  name: `${SITE_NAME} — key pages`,
  itemListElement: [
    { "@type": "SiteNavigationElement", name: "About", url: `${SITE_URL}/about` },
    { "@type": "SiteNavigationElement", name: "Meet the Team", url: `${SITE_URL}/team` },
    { "@type": "SiteNavigationElement", name: "Annual Events", url: `${SITE_URL}/annual-events` },
    { "@type": "SiteNavigationElement", name: "Donate", url: `${SITE_URL}/donate` },
    { "@type": "SiteNavigationElement", name: "Contact", url: `${SITE_URL}/contact` },
  ].map((el, i) => ({ ...el, position: i + 1 })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        {/* Consolidate the legacy .com origin under the .org so link equity flows to a single canonical host. */}
        <link rel="alternate" hrefLang="en" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        {/* Warm the connection to storage/CDN origins used on interactive pages. */}
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Identity confirmation for Google Knowledge Graph via rel="me". */}
        <link rel="me" href="https://www.instagram.com/handsofhope_outreach/" />
        <link rel="me" href="https://linkedin.com/company/handsofhopeoutreach" />
        <link rel="me" href="mailto:info@handsofhopeoutreach.org" />
        <meta name="theme-color" content="#f7f5ef" />
        <meta name="application-name" content="Hands of Hope Outreach" />
        <meta name="apple-mobile-web-app-title" content="Hands of Hope Outreach" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <NavBar />
        <main className="flex-1">{children}</main>
        <HashScrollFix />
        <Chatbot />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavJsonLd) }}
        />
      </body>
    </html>
  );
}
