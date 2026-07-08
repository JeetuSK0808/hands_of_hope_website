const SITE_URL = "https://www.handsofhopeoutreach.com";

type Crumb = { name: string; path: string };

export function SeoBreadcrumb({ trail }: { trail: Crumb[] }) {
  const full: Crumb[] = [
    { name: "Hands of Hope Outreach", path: "/" },
    ...trail,
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: full.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path === "/" ? "" : c.path}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
