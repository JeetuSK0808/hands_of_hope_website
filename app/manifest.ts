import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hands of Hope Outreach",
    short_name: "Hands of Hope",
    description:
      "Hands of Hope Outreach, a student-led 501(c)(3) nonprofit based in Atlanta. Chapters in the US, Canada, Chile, and Denmark.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f3ea",
    theme_color: "#111111",
    lang: "en-US",
    orientation: "portrait",
    categories: ["education", "nonprofit", "social"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
