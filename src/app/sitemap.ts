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
    "/whole-home-remodeling-houston",
    "/luxury-kitchen-remodeling-houston",
    "/primary-suite-remodeling-houston",
    "/home-additions-houston",
    "/luxury-outdoor-living-houston",
    "/luxury-bathroom-remodeling-houston",
    "/river-oaks-remodeling",
    "/memorial-remodeling",
    "/tanglewood-remodeling",
    "/west-university-remodeling",
    "/afton-oaks-remodeling",
    "/guides",
    "/guides/home-remodeling-cost-houston",
    "/guides/whole-home-remodel-cost-houston",
    "/guides/kitchen-remodel-cost-houston",
    "/guides/bathroom-remodel-cost-houston",
    "/guides/how-to-choose-remodeling-contractor-houston",
    "/guides/remodel-or-rebuild-houston",
  ];

  // Static build-time date rather than `new Date()`: recomputing "now" on
  // every request makes every page look freshly modified on every crawl,
  // which is misleading to search engines and provides no signal at all.
  // Bump this when page content actually changes.
  const lastModified = new Date("2026-09-20");

  const highPriorityRoutes = new Set([
    "/luxury-remodeling-houston",
    "/whole-home-remodeling-houston",
    "/luxury-kitchen-remodeling-houston",
    "/primary-suite-remodeling-houston",
    "/home-additions-houston",
    "/luxury-outdoor-living-houston",
    "/luxury-bathroom-remodeling-houston",
  ]);

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/consultation"
          ? 0.9
          : highPriorityRoutes.has(route)
            ? 0.8
            : 0.7,
  }));
}
