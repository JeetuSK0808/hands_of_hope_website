import type { Metadata } from "next";
import { TeamHero } from "@/components/site/team-hero";
import { TeamRoster } from "@/components/site/team-roster";
import { FollowUs } from "@/components/site/follow-us";
import { SiteFooter } from "@/components/site/site-footer";
import { SeoBreadcrumb } from "@/components/site/seo-breadcrumb";

const SITE_URL = "https://handsofhopeoutreach.org";

export const metadata: Metadata = {
  title: "Meet the Team · Founders & Executive Board",
  description:
    "The founders and executive board behind Hands of Hope Outreach, the student-led 501(c)(3) nonprofit based in Atlanta running chapters across the US, Canada, Chile, and Denmark.",
  alternates: { canonical: "/team" },
  openGraph: {
    url: "https://handsofhopeoutreach.org/team",
    title: "Meet the Team · Hands of Hope Outreach",
    description:
      "The founders and executive board behind Hands of Hope Outreach.",
  },
};

const TEAM = [
  {
    id: "daksh-shah",
    name: "Daksh Shah",
    role: "Co-founder",
    photo: "/team/daksh-shah.jpg",
    founder: true,
  },
  {
    id: "shubham-trivedi",
    name: "Shubham Trivedi",
    role: "Co-founder",
    photo: "/team/shubham-trivedi.jpg",
    founder: true,
  },
  {
    id: "michael-v",
    name: "Michael V.",
    role: "Chief Operating Officer",
    photo: "/team/michael-v.jpg",
    founder: false,
  },
  {
    id: "arthur-crawford",
    name: "Arthur Crawford",
    role: "Chief Marketing Officer",
    photo: "/team/arthur-crawford.jpg",
    founder: false,
  },
  {
    id: "satyajeeth-suresh-kannan",
    name: "Satyajeeth Suresh Kannan",
    role: "Chief Technology Officer · U.S. Region Leader",
    photo: "/team/satyajeeth-suresh-kannan.jpg",
    founder: false,
  },
];

const personJsonLd = TEAM.map((m) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/team#${m.id}`,
  name: m.name,
  jobTitle: m.role,
  image: `${SITE_URL}${m.photo}`,
  url: `${SITE_URL}/team`,
  worksFor: {
    "@type": "NGO",
    "@id": `${SITE_URL}/#organization`,
    name: "Hands of Hope Outreach",
    url: SITE_URL,
  },
  ...(m.founder ? { additionalName: "Co-founder" } : {}),
}));

const teamCollectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/team#collection`,
  url: `${SITE_URL}/team`,
  name: "Meet the Team · Hands of Hope Outreach",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: TEAM.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@id": `${SITE_URL}/team#${m.id}` },
    })),
  },
};

export default function TeamPage() {
  return (
    <>
      <TeamHero />
      <TeamRoster />
      <FollowUs />
      <SiteFooter />
      <SeoBreadcrumb trail={[{ name: "Meet the Team", path: "/team" }]} />
      {personJsonLd.map((ld) => (
        <script
          key={ld["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamCollectionJsonLd) }}
      />
    </>
  );
}
