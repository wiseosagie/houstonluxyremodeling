import { NEIGHBORHOODS } from "./constants";

// Single registry of every public, indexable route. The sitemap is generated
// from it and test/seo.test.ts checks it against the page files on disk, so a
// new page must be added here to be submitted to search engines.

export const SERVICES_HUB = { href: "/luxury-remodeling-houston", label: "Services" } as const;

export const SERVICE_PAGES = [
  {
    href: "/whole-home-remodeling-houston",
    name: "Whole-Home Remodeling",
    summary: "Coordinated renovation of the entire residence.",
  },
  {
    href: "/luxury-kitchen-remodeling-houston",
    name: "Kitchen Remodeling",
    summary: "Layout, custom cabinetry, stone, and appliances.",
  },
  {
    href: "/luxury-bathroom-remodeling-houston",
    name: "Bathroom Remodeling",
    summary: "Layout, plumbing, waterproofing, and finishes.",
  },
  {
    href: "/primary-suite-remodeling-houston",
    name: "Primary Suite Remodeling",
    summary: "Bedroom, bath, and closet planned as one retreat.",
  },
  {
    href: "/home-additions-houston",
    name: "Home Additions",
    summary: "Second stories and new square footage.",
  },
  {
    href: "/luxury-outdoor-living-houston",
    name: "Outdoor Living",
    summary: "Covered living space, outdoor kitchens, and drainage.",
  },
] as const;

export const LOCATION_PAGES = NEIGHBORHOODS.map((n) => ({
  href: `/${n.slug}-remodeling`,
  name: n.name,
}));

export const GUIDE_PAGES = [
  "/guides/home-remodeling-cost-houston",
  "/guides/whole-home-remodel-cost-houston",
  "/guides/kitchen-remodel-cost-houston",
  "/guides/bathroom-remodel-cost-houston",
  "/guides/how-to-choose-remodeling-contractor-houston",
  "/guides/remodel-or-rebuild-houston",
] as const;

export const INDEXABLE_ROUTES: readonly string[] = [
  "/",
  SERVICES_HUB.href,
  ...SERVICE_PAGES.map((s) => s.href),
  "/houston",
  ...LOCATION_PAGES.map((l) => l.href),
  "/guides",
  ...GUIDE_PAGES,
  "/how-it-works",
  "/consultation",
  "/contact",
  "/matching-service-disclosure",
  "/privacy",
  "/terms",
];
