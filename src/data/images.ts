// -----------------------------------------------------------------------------
// Design inspiration image library
//
// All imagery is sourced from Unsplash (https://unsplash.com) under the
// Unsplash License (free to use, commercial use permitted, no permission or
// attribution required — https://unsplash.com/license). These are editorial /
// stock photographs, not photographs of work performed by Houston Luxury
// Remodeling or its participating professionals. They are labeled throughout
// the site as "Design Inspiration" / "Renovation Inspiration" and must never
// be presented as completed HLR projects. See README.md "Canva / imagery"
// section for sourcing notes.
// -----------------------------------------------------------------------------

export type InspirationImage = {
  id: string;
  url: string;
  alt: string;
  category: "exterior" | "kitchen" | "living" | "primary-suite" | "outdoor-living" | "whole-home";
  usedOn: string[];
};

function unsplash(photoId: string, params = "auto=format&fit=crop&q=80") {
  return `https://images.unsplash.com/photo-${photoId}?${params}`;
}

export const IMAGES = {
  heroExterior: {
    id: "1600585154340-be6161a56a0c",
    url: unsplash("1600585154340-be6161a56a0c"),
    alt: "Contemporary Houston-style home exterior with glass walls and warm wood siding at dusk",
    category: "exterior",
    usedOn: ["Homepage hero", "Open Graph image"],
  },
  exteriorEntrance: {
    id: "1600585154526-990dced4db0d",
    url: unsplash("1600585154526-990dced4db0d"),
    alt: "Dramatic contemporary home entrance with warm interior lighting at dusk",
    category: "exterior",
    usedOn: ["/houston hero", "Areas Served section"],
  },
  exteriorDaylight: {
    id: "1600607688969-a5bfcd646154",
    url: unsplash("1600607688969-a5bfcd646154"),
    alt: "Contemporary home exterior with expansive lawn and mature tree canopy, daylight",
    category: "exterior",
    usedOn: ["/luxury-remodeling-houston hero", "Whole Home category card"],
  },
  kitchenIsland: {
    id: "1600566752229-250ed79470f8",
    url: unsplash("1600566752229-250ed79470f8"),
    alt: "Luxury kitchen with waterfall marble island, matte black fixtures, and black pendant light",
    category: "kitchen",
    usedOn: ["Homepage Kitchen category card", "Kitchen section of service page", "Inspiration gallery"],
  },
  primarySuiteBedroom: {
    id: "1616594039964-ae9021a400a0",
    url: unsplash("1616594039964-ae9021a400a0"),
    alt: "Primary bedroom suite with charcoal accent wall, upholstered bed, and skyline view",
    category: "primary-suite",
    usedOn: ["Homepage Primary Suite category card", "Primary suite section of service page"],
  },
  spaBathroom: {
    id: "1600566752355-35792bedcfea",
    url: unsplash("1600566752355-35792bedcfea"),
    alt: "Spa-style primary bathroom with freestanding soaking tub and dark tile",
    category: "primary-suite",
    usedOn: ["Primary suite section of service page", "Inspiration gallery"],
  },
  poolOutdoorLiving: {
    id: "1613977257363-707ba9348227",
    url: unsplash("1613977257363-707ba9348227"),
    alt: "Contemporary home with covered outdoor living area and swimming pool",
    category: "outdoor-living",
    usedOn: ["Homepage Outdoor Living category card", "Outdoor living section of service page", "Inspiration gallery"],
  },
  indoorOutdoorLiving: {
    id: "1600585152915-d208bec867a1",
    url: unsplash("1600585152915-d208bec867a1"),
    alt: "Living room opening onto a covered patio and outdoor kitchen through disappearing glass doors",
    category: "outdoor-living",
    usedOn: ["Outdoor living section of service page", "Home addition category card"],
  },
  wholeHomeDining: {
    id: "1600607687920-4e2a09cf159d",
    url: unsplash("1600607687920-4e2a09cf159d"),
    alt: "Open dining area with floating staircase and kitchen beyond in a renovated home",
    category: "whole-home",
    usedOn: ["Homepage Whole Home category card", "How It Works page"],
  },
  livingOpenPlan: {
    id: "1600607687939-ce8a6c25118c",
    url: unsplash("1600607687939-ce8a6c25118c"),
    alt: "Open-plan living room and kitchen with walnut accent wall and glass walls to a garden",
    category: "living",
    usedOn: ["Whole-home renovation section of service page", "Inspiration gallery"],
  },
  livingTransitional: {
    id: "1600210491892-03d54c0aaf87",
    url: unsplash("1600210491892-03d54c0aaf87"),
    alt: "Transitional living room with exposed wood beams, arched windows, and a limestone fireplace",
    category: "living",
    usedOn: ["Inspiration gallery", "/houston River Oaks & Memorial context imagery"],
  },
  livingFormal: {
    id: "1598928506311-c55ded91a20c",
    url: unsplash("1598928506311-c55ded91a20c"),
    alt: "Formal living room with coffered ceiling, marble fireplace surround, and built-in cabinetry",
    category: "living",
    usedOn: ["Inspiration gallery", "Whole-home renovation section of service page"],
  },
} as const;

export const INSPIRATION_GALLERY = [
  IMAGES.kitchenIsland,
  IMAGES.spaBathroom,
  IMAGES.poolOutdoorLiving,
  IMAGES.livingTransitional,
  IMAGES.livingFormal,
  IMAGES.livingOpenPlan,
];
