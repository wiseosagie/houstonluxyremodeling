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

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/consultation" ? 0.9 : 0.7,
  }));
}
