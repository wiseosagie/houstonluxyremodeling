# SEO Metadata Summary

## Per-page metadata

| Route | Title | Meta Description | Canonical |
|---|---|---|---|
| `/` | Private Renovation Consultation for Houston Homes | Houston Luxury Remodeling connects homeowners planning $100,000+ residential renovations with experienced Houston remodeling and design-build professionals. Private, complimentary, no obligation. | `/` |
| `/luxury-remodeling-houston` | Luxury Remodeling in Houston \| Whole-Home, Kitchen & More | A guide to planning a significant Houston home renovation — whole-home remodels, luxury kitchens, primary suites, additions, and outdoor living — plus how to choose the right professional. | `/luxury-remodeling-houston` |
| `/houston` | Houston Areas We Serve \| River Oaks, Memorial, Tanglewood, West University | Houston Luxury Remodeling currently focuses on River Oaks, Memorial, Tanglewood, and West University — neighborhoods where significant home renovations are common. | `/houston` |
| `/how-it-works` | How It Works \| A Private, Three-Step Process | How Houston Luxury Remodeling works: tell us about your home, we review your project, and qualified projects may be introduced to a participating remodeling professional. | `/how-it-works` |
| `/consultation` | Request a Private Consultation | Tell us about your Houston renovation project — private, complimentary, and no obligation. | `/consultation` |
| `/privacy` | Privacy Policy | How Houston Luxury Remodeling collects, uses, and shares information. | `/privacy` |
| `/terms` | Terms of Use | Terms governing the use of the Houston Luxury Remodeling website. | `/terms` |
| `/contact` | Contact | Get in touch with Houston Luxury Remodeling. | `/contact` |
| `/matching-service-disclosure` | Matching Service Disclosure | Houston Luxury Remodeling operates as a homeowner-to-professional matching and referral service. Read what that means before you submit a project. | `/matching-service-disclosure` |

All titles use the `%s \| Houston Luxury Remodeling` template defined in
`src/app/layout.tsx`, so the brand name is never duplicated or keyword-stuffed.

## Structured data (JSON-LD)

| Type | Where | Notes |
|---|---|---|
| `Organization` | Every page (root layout) | Name, URL, description only — deliberately **no `LocalBusiness`/address**, since there is no physical office to disclose (per brief, section 19). |
| `FAQPage` | Homepage | Mirrors the visible FAQ accordion exactly — no hidden or exaggerated content. |
| `BreadcrumbList` | Every page using `<Breadcrumbs>` (service, locations, legal pages) | Matches the visible breadcrumb trail. |

## Technical SEO

- `src/app/sitemap.ts` — dynamic `sitemap.xml` covering all public routes.
- `src/app/robots.ts` — allows all crawling except `/api/*`, points to the sitemap.
- `src/app/opengraph-image.tsx` — a generated 1200×630 OG image (typographic wordmark) used
  site-wide by default; page-specific `openGraph`/`twitter` metadata inherits it.
- `src/app/icon.tsx` — a generated favicon (no static image asset needed).
- Canonical URLs set per-page via `alternates.canonical`.
- Semantic HTML: one `<h1>` per page, `<h2>`/`<h3>` used hierarchically within sections.
- All images have descriptive, specific `alt` text (see `docs/IMAGE_INVENTORY.md`).
- `NEXT_PUBLIC_GSC_VERIFICATION` env var wires up Search Console's HTML-tag verification
  method via `metadata.verification.google` — no file upload needed.

## Known limitation

Google Search Console verification and any GA4 configuration require real credentials that
weren't provided — see README "Known Limitations."
