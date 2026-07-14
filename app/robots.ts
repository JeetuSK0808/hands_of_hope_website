import type { MetadataRoute } from "next";

const SITE_URL = "https://handsofhopeoutreach.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/portal/", "/admin/", "/api/", "/merch/success"],
      },
      // Explicitly welcome Googlebot's image crawler so photos surface in
      // Google Images searches for "Hands of Hope Outreach".
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/portal/", "/admin/"],
      },
      // Some AI training crawlers ignore Disallow: /portal — leave the site
      // fully open to search crawlers and only block portal for everyone else.
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/portal/", "/admin/", "/api/", "/merch/success"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
