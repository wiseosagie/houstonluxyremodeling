import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { INDEXABLE_ROUTES } from "@/lib/routes";

// `lastModified` is deliberately omitted: there is no reliable per-page
// modification date in the repository, and a single hard-coded date on every
// URL tells search engines nothing. Add it per route only when it can be
// sourced from real content dates.
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => ({
    url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
  }));
}
