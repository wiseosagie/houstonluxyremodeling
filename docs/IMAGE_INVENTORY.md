# Image Inventory

## Sourcing note (read this first)

The brief asked for imagery to be sourced via the Canva connector. In this environment, the
Canva MCP connector's tools are oriented around **creating and editing Canva designs**
(documents, presentations, whiteboards, brand templates) — there is no tool exposed for
browsing or licensing standalone stock photography for use as arbitrary `<img>` assets on an
external website. It isn't the right tool for "find me 12 licensed photos to hotlink into a
Next.js site."

Given that, Phase 1 imagery is sourced directly from **Unsplash**
(https://unsplash.com), under the [Unsplash License](https://unsplash.com/license): free for
commercial use, no permission or attribution required. Each photo ID below was individually
fetched and visually reviewed (not batch-guessed) before being added to the site. All images
are:

- Editorial/architectural photography, not dominated by people
- Free of construction workers, hard hats, or tools
- Labeled throughout the site as "Design Inspiration" / "Ideas for Your Home" / "Renovation
  Inspiration" — never "Our Work" or "Our Projects"

**Before launch:** if a real Canva Pro/Enterprise stock library or licensed photography
becomes available, swap the URLs in `src/data/images.ts` — every page imports images from
that single file, so no page-level code needs to change.

## Inventory

All images are defined in [`src/data/images.ts`](../src/data/images.ts). Source: Unsplash,
served via `images.unsplash.com` and optimized on-demand by Next.js `<Image>`.

| Key | Unsplash Photo ID | Subject | Used On |
|---|---|---|---|
| `heroExterior` | `1600585154340-be6161a56a0c` | Contemporary home exterior, dusk | Homepage hero, default Open Graph fallback context |
| `exteriorEntrance` | `1600585154526-990dced4db0d` | Dramatic modern entrance, dusk | `/houston` hero, Areas Served |
| `exteriorDaylight` | `1600607688969-a5bfcd646154` | Contemporary exterior, daylight | `/luxury-remodeling-houston` hero, Whole Home card |
| `kitchenIsland` | `1600566752229-250ed79470f8` | Marble waterfall island, black fixtures | Homepage Kitchen card, service page Kitchen section, gallery |
| `primarySuiteBedroom` | `1616594039964-ae9021a400a0` | Primary bedroom, dark accent wall | Homepage Primary Suite card, service page Primary Suite section |
| `spaBathroom` | `1600566752355-35792bedcfea` | Spa bathroom, freestanding tub | Service page Primary Suite section, gallery, How It Works step 3 |
| `poolOutdoorLiving` | `1613977257363-707ba9348227` | Contemporary home with pool | Homepage Outdoor Living card, service page Outdoor Living section, gallery |
| `indoorOutdoorLiving` | `1600585152915-d208bec867a1` | Living room to covered patio/outdoor kitchen | Homepage Home Addition card, service page Outdoor Living & Home Addition sections |
| `wholeHomeDining` | `1600607687920-4e2a09cf159d` | Open dining + stair + kitchen | Homepage Whole Home card, How It Works step 1 |
| `livingOpenPlan` | `1600607687939-ce8a6c25118c` | Open living/kitchen, walnut accent wall | Service page Whole-Home section, gallery, How It Works step 2 |
| `livingTransitional` | `1600210491892-03d54c0aaf87` | Transitional living room, wood beams, arches | Gallery, `/houston` neighborhood imagery |
| `livingFormal` | `1598928506311-c55ded91a20c` | Formal living room, coffered ceiling | Gallery, service page Whole-Home section |

## Technical handling

- Served via `next/image` with `remotePatterns` allow-listing `images.unsplash.com`
  (`next.config.mjs`).
- `deviceSizes` / `imageSizes` are capped below Next's defaults (max 1920px wide) since no
  layout on this site renders an image larger than that — keeps on-demand transform time and
  cache storage down.
- Above-the-fold images (hero) use `priority`; everything else uses `loading="lazy"`.
- Every image has descriptive, specific alt text (see the `alt` field per entry above) —
  never generic alt text like "image" or "photo".
