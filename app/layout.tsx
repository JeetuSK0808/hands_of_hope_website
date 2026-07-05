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
const DEFAULT_DESCRIPTION =
  "Hands of Hope Outreach is a student-led 501(c)(3) nonprofit based in Atlanta connecting high school students with the communities just outside their classroom, through chapters, STEM Buddies, the annual Awards Ceremony, and the Ripple for Change kit-packing assembly.";
const OG_IMAGE = `${SITE_URL}/general/award-ceremony-hi.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hands of Hope Outreach · Student-led nonprofit in Atlanta",
    template: "%s · Hands of Hope Outreach",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Hands of Hope Outreach",
    "Hands of Hope",
    "handsofhopeoutreach",
    "student nonprofit Atlanta",
    "high school volunteer nonprofit",
    "STEM Buddies",
    "Ripple for Change",
    "youth-led 501c3",
    "Atlanta youth service",
    "chapter-based volunteer network",
  ],
  authors: [{ name: "Hands of Hope Outreach" }],
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
    title: "Hands of Hope Outreach · Student-led nonprofit in Atlanta",
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
    title: "Hands of Hope Outreach · Student-led nonprofit in Atlanta",
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
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
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: SITE_NAME,
  alternateName: ["Hands of Hope", "HOH"],
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  image: OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
  email: "info@handsofhopeoutreach.com",
  foundingLocation: {
    "@type": "Place",
    name: "Atlanta, Georgia, United States",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Atlanta, Georgia" },
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "Chile" },
    { "@type": "Country", name: "Denmark" },
  ],
  nonprofitStatus: "Nonprofit501c3",
  sameAs: ["https://www.instagram.com/handsofhope_outreach/"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "General",
      email: "info@handsofhopeoutreach.com",
      availableLanguage: ["English"],
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Hands of Hope",
  url: SITE_URL,
  inLanguage: "en-US",
  publisher: { "@type": "NGO", name: SITE_NAME, url: SITE_URL },
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
