import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/luxury-remodeling-houston",
    "/houston",
    "/how-it-works",
    "/consultation",
    "/privacy",
    "/terms",
    "/contact",
    "/matching-service-disclosure",
  ];

  // Static build-time date rather than `new Date()`: recomputing "now" on
  // every request makes every page look freshly modified on every crawl,
  // which is misleading to search engines and provides no signal at all.
  // Bump this when page content actually changes.
  const lastModified = new Date("2026-09-16");

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/consultation" ? 0.9 : 0.7,
  }));
}
