# SEO Implementation

**Site:** https://houstonluxuryremodeling.com
**Stack:** Next.js 15 (App Router) on Azure Static Web Apps. All 27 public pages are statically prerendered, and the only dynamic route is `/api/leads`.
**Date:** 2026-09-30

This document covers the indexing-focused SEO pass. It builds on the earlier work recorded in [SEO_FIX_IMPLEMENTATION_REPORT.md](SEO_FIX_IMPLEMENTATION_REPORT.md) and [FINAL_SEO_PREDEPLOYMENT_REVIEW.md](FINAL_SEO_PREDEPLOYMENT_REVIEW.md), which fixed per-page `og:url`, placeholder phone and verification values, and orphaned pages.

None of these changes guarantee indexing. Google decides which eligible pages it indexes. The changes remove technical obstacles and make each page's purpose and relationships clearer.

---

## 1. Original Search Console problem

The Search Console coverage export dated 2026-09-30 showed:

- **Known pages:** 11
- **Indexed pages:** 0
- **"Discovered – currently not indexed":** 9 pages
- **"Crawled – currently not indexed":** 2 pages
- **Impressions:** 0

The sitemap lists 27 URLs, so Google had not yet processed most of the site. On a new domain, "Discovered – currently not indexed" usually means Google is still deciding whether the site is worth crawling. It is rarely caused by a single blocking directive. Several things raise the site's chances:

- clean technical signals
- strong internal linking
- clearly differentiated content

## 2. Technical issues discovered

**Blockers checked and found clean:**
- No `noindex` or `nofollow` directives, and no `X-Robots-Tag` headers.
- robots.txt does not block pages or rendering assets.
- No canonicals point to other pages.
- No redirect chains.
- No duplicate routes.
- All pages render on the server.

**Issues found:**

| # | Issue | Impact |
|---|---|---|
| 1 | The root layout forced `robots: index, follow` on every page. On the 404 page this produced **two conflicting robots tags** (`noindex` from Next.js plus `index, follow`). | A mixed signal on error pages. The tag is redundant everywhere else, because indexing is the default. |
| 2 | The sitemap gave **every URL the same hard-coded `lastmod`** (`2026-09-20`). | A fabricated freshness signal. Google learns to ignore `lastmod` from sites that misuse it. |
| 3 | `SITE_URL` used `NEXT_PUBLIC_SITE_URL` **without validation**. | A trailing slash, `www`, `http`, localhost or `*.azurestaticapps.net` value in that build variable would corrupt every canonical, `og:url`, sitemap `<loc>` and JSON-LD URL at once. |
| 4 | **Service pages did not link to each other.** Kitchen and bathroom linked to no other service, and outdoor living linked only to whole-home. The footer had no service links. | Service pages relied on the homepage and services hub for discovery, so link equity between related topics was weak. |
| 5 | **No `WebSite` schema.** Per-page `Service` and `Article` nodes repeated the Organization inline with no `@id`. | Entities were less clearly connected. |
| 6 | Service-page **titles were around 85 characters** and repeated "Houston" three times. For example: "Kitchen Remodeling Houston \| Luxury & Custom Kitchen Guide \| Houston Luxury Remodeling". | They are truncated in search results and read as keyword-heavy. |
| 7 | `/contact` had a 44-character generic description. | A weak snippet. |
| 8 | The **404 page linked only to Home and Consultation**. | It was a dead end for users and crawlers. |
| 9 | `npm run lint` opened an interactive prompt because there was **no ESLint config**. | The linter could not run in CI or in validation. |
| 10 | There were **no automated SEO tests**. The sitemap route list was a hand-maintained array with no check against the page files. | A new page could ship without being added to the sitemap, or the reverse. |

**Checked and acceptable as-is:**
- **Trailing slashes.** `/path/` returns a 308 redirect to `/path`, which is the Next.js default.
- **Query strings.** `?utm_*` variants canonicalize to the clean URL.
- **Unknown URLs** return a real HTTP 404.
- **Images.** All images use `next/image` (AVIF/WebP, responsive `sizes`), with descriptive alt text. The hero image is `priority`, and images below the fold load lazily.
- **Semantic structure.** Pages use `<header>`, `<nav>`, `<main>` and `<footer>`, with exactly one H1 per page.
- **`www` to apex.** Handled with a 308 redirect in `src/middleware.ts`. The matching rule in `next.config.mjs` stays as a harmless fallback.

## 3. Changes implemented

| File | Change |
|---|---|
| `src/lib/routes.ts` (new) | A single registry of indexable routes: `SERVICE_PAGES`, `LOCATION_PAGES`, `GUIDE_PAGES` and `INDEXABLE_ROUTES`. The sitemap, footer, related-services block, 404 page and tests all read from it. |
| `src/lib/constants.ts` | Added `PRODUCTION_ORIGIN` and `resolveSiteUrl()`, which accepts an override only if it is a bare `https` origin that is not a preview host. Added `ORGANIZATION_ID`. |
| `src/app/sitemap.ts` | Built from `INDEXABLE_ROUTES`. Removed the fabricated `lastModified`, along with `changeFrequency` and `priority`, which Google ignores. |
| `src/app/layout.tsx` | Removed the redundant `robots` metadata. JSON-LD is now an `@graph` of `Organization` (with `@id`) and `WebSite`. |
| Six service pages | New concise titles, such as "Kitchen Remodeling in Houston, TX \| Houston Luxury Remodeling". Added a `<RelatedServices>` block. The breadcrumb hub label is now "Services", matching the navigation. |
| `src/app/luxury-remodeling-houston/page.tsx`, six guides | The Service `provider` and Article `author`/`publisher` now reference `ORGANIZATION_ID`. |
| `src/components/shared/RelatedServices.tsx` (new) | Crawlable links to the other five service pages, plus How It Works, Guides and Areas We Serve. |
| `src/components/layout/Footer.tsx` | New **Services** column with the six service pages. The Areas column is driven by `LOCATION_PAGES`. |
| `src/app/not-found.tsx` | Added a "Site sections" nav linking to the services hub, every service, areas, guides, How It Works and Contact. |
| `src/app/contact/page.tsx` | Replaced the description with an accurate, specific one. |
| `.eslintrc.json` (new) | Extends `next/core-web-vitals`. Turns off `react/no-unescaped-entities`, a stylistic rule that fired 137 times on existing copy. React escapes text safely either way. |
| `test/seo.test.ts` (new) | 10 source-level SEO tests (see §9). |
| `scripts/verify-production-seo.mjs` | Added checks for meta description, `og:title`, JSON-LD parsing, duplicate titles and descriptions, broken or unlisted internal links, and real 404 status. |

## 4. Sitemap

- **Location:** `https://houstonluxuryremodeling.com/sitemap.xml`, generated by `src/app/sitemap.ts`.
- **Contents:** the 27 URLs in `INDEXABLE_ROUTES`. All are absolute apex HTTPS URLs, unique, without query strings or trailing slashes (the homepage is the bare origin), and without API routes.
- **`lastmod`** is deliberately omitted until real per-page modification dates exist. Do not add a single site-wide date.
- **Adding a page:** add its route to `src/lib/routes.ts`. `npm test` fails if a `page.tsx` exists without a registry entry, or the reverse.

## 5. robots.txt behavior

```
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://houstonluxuryremodeling.com/sitemap.xml
```

- Generated by `src/app/robots.ts`. This file did not need changes.
- `/_next/` (CSS, JS and images) is not blocked.
- The site has no admin, login, account or internal-search routes to exclude.

## 6. Canonical strategy

- **Origin:** `https://houstonluxuryremodeling.com` (apex, HTTPS, no trailing slash).
- Every page sets `alternates.canonical` to its own path. `metadataBase` resolves it against `SITE_URL`, and `og:url` always equals the canonical.
- **`SITE_URL` cannot be overridden** by a `www`, `http`, localhost, IP, `*.azurestaticapps.net`, path or query-string value. Any of those falls back to the production origin. Preview deployments therefore canonicalize to production.
- **Duplicates are handled in three ways:**
  - `www` returns a 308 redirect to the apex.
  - `/path/` returns a 308 redirect to `/path`.
  - Query-string variants keep the clean canonical.

## 7. Structured data

| Where | Types | Notes |
|---|---|---|
| Every page (root layout) | `Organization` (`@id …/#organization`) and `WebSite` (`@id …/#website`) | Declared as `Organization`, **not** `LocalBusiness` or `HomeAndConstructionBusiness`: the business is a referral service with no published address, and it does not perform construction. `areaServed` lists Houston and the five neighborhoods the site says it focuses on. `contactPoint` appears only when a real phone number is configured. |
| Services hub and the 6 service pages | `Service` | `serviceType` describes *matching*, which is accurate. `provider` references the Organization `@id`. |
| 6 guides | `Article` | `datePublished` is 2026-09-20, the real date the content was committed. `author` and `publisher` reference the Organization. |
| All non-home pages | `BreadcrumbList` | Generated by `Breadcrumbs.tsx`, which also renders the visible trail. |

Deliberately **not** added:
- review or rating schema (no qualifying reviews exist)
- address, telephone, `sameAs` or logo variants (not established in the repository)
- `FAQPage` on service pages (FAQ rich results are limited to government and health sites)

## 8. Internal-linking improvements

- **Header:** Services hub, Areas We Serve, How It Works, Consultation.
- **Footer, on every page:**
  - **Explore:** the header links plus Guides.
  - **Services:** new; the six service pages.
  - **Areas We Serve:** the five neighborhoods.
  - **Company:** Contact, Disclosure, Privacy, Terms.
- **Service pages** now link to every other service page, How It Works, Guides and Areas, in addition to their existing guide and consultation links.
- **The 404 page** links to every major section.
- All links are plain `<a href>` elements, rendered by `next/link` in server HTML, with varied, descriptive anchor text.
- **Result:** every service page is one click from every page on the site, and no page is deeper than two clicks from the homepage.

## 9. Content and metadata improvements

- **Six service titles** now follow "<Service> in Houston, TX | Houston Luxury Remodeling" and match their H1s.
- **`/contact`** has a specific description.
- **Existing content was reviewed, not rewritten.** The service pages are already differentiated:
  - kitchen: layout, cabinetry and stone
  - bathroom: waterproofing and Houston humidity
  - additions: foundation and drainage
  - and so on for the rest
- **The five neighborhood pages were reviewed against the doorway-page guardrail.** Each contains real location-specific planning content: incorporated-village permitting, flood-plain and Buffalo Bayou considerations, deed restrictions, and tree canopy. They were kept and not expanded. No new location pages were created.
- **No projects, testimonials, prices, credentials or business facts were added.** The repository contains no portfolio or project data, so no project or case-study pages were built. See §10.

**SEO tests (`npm test`, `test/seo.test.ts`):**
- The canonical origin is the production apex, and `resolveSiteUrl` rejects 9 bad override values.
- The sitemap contains exactly the indexable routes: absolute, apex, unique, no query strings, trailing slashes or `/api`, and no fabricated `lastmod`.
- Every indexable route has a `page.tsx`, and every `page.tsx` is registered.
- robots allows `/`, disallows only `/api/` and declares the production sitemap.
- Every page has a title, a description of at least 50 characters, a self-canonical, `og:url` equal to the canonical, no `noindex`, and exactly one H1. Titles and descriptions are unique.
- No source file contains `noindex` or a localhost or preview URL.
- Every literal internal `href` points to a registered route.
- Every service page renders `RelatedServices`.

**Rendered checks:** run `node scripts/verify-production-seo.mjs <origin>` against a running build or production.

## 10. Remaining manual tasks

**Business information** (see [OWNER_INFORMATION_NEEDED.md](OWNER_INFORMATION_NEEDED.md)):
- **About page facts:** operator identity, how professionals are vetted, and how the service is paid. An `/about` page would be the strongest trust signal the site is missing.
- **Real phone number:** set it in `NEXT_PUBLIC_CONTACT_PHONE`, or delete that variable. Today the GitHub variable is `"."`, which the code safely ignores.
- **Brand-domain mailbox:** confirm it exists, then fix `NEXT_PUBLIC_CONTACT_EMAIL`.
- **Social profiles:** if any exist, add them as `sameAs` on the Organization.

**Real content:**
- Completed project photos and descriptions that the business has the rights to publish, with each project's actual neighborhood and service. With that data, a `/projects/[slug]` template linked to service and neighborhood pages would add real value. Without it, nothing was built.
- Genuine client testimonials, only if they exist and can be published.

**Hosting** (see [PRE_DEPLOYMENT_MANUAL_CHECKLIST.md](PRE_DEPLOYMENT_MANUAL_CHECKLIST.md)):
- In Azure Static Web Apps, set `houstonluxuryremodeling.com` as the default domain. The `www` and `*.azurestaticapps.net` hosts can return 200 from Azure's edge cache before middleware runs. Canonicals still point to the apex, but redirects are cleaner.
- The GitHub variable `NEXT_PUBLIC_GSC_VERIFICATION` is `"."`. Set the real token, or delete it if ownership is verified by DNS or a Domain property.

**Google Business Profile:** create one only if the business qualifies under Google's guidelines. A referral service with no staffed location or in-person customer contact may not qualify.

**Optional cleanup:** `next lint` is deprecated in Next 16. Migrate with `npx @next/codemod@canary next-lint-to-eslint-cli .` when upgrading.

## 11. Search Console post-deployment procedure

Run the checklist below after the deploy. To verify production in one step:

```sh
node scripts/verify-production-seo.mjs        # expect exit 0
```

## Post-Deployment Google Search Console Checklist

1. **Deploy** the production changes, from a push to `main` via GitHub Actions.
2. **Confirm production pages return HTTP 200.** Run `node scripts/verify-production-seo.mjs`, or `curl -sI https://houstonluxuryremodeling.com/luxury-kitchen-remodeling-houston`.
3. **Open `/robots.txt`.** Confirm `Allow: /`, `Disallow: /api/` and the apex `Sitemap:` line.
4. **Open `/sitemap.xml`.** Confirm 27 apex HTTPS URLs and no `www`, `azurestaticapps` or `lastmod` entries.
5. **Validate the important canonical URLs.** View source on the homepage and each service page, and confirm that `<link rel="canonical">` is the page's own apex URL.
6. **Submit or resubmit the sitemap** in Search Console: Sitemaps → `https://houstonluxuryremodeling.com/sitemap.xml`. A Domain property is preferred.
7. **Inspect the homepage** with URL Inspection, then run Test Live URL. Confirm "URL is available to Google" and that the rendered HTML includes the content.
8. **Inspect every primary service page** (see Priority URLs below) with Test Live URL.
9. **Request indexing** once for the highest-value corrected URLs, where appropriate: the homepage, the services hub, and the six service pages.
10. **Monitor "Discovered – currently not indexed."** Expect it to shrink over several weeks as Google crawls.
11. **Monitor "Crawled – currently not indexed."** If pages stay there, treat it as a content-quality signal. Improve those pages with real information; do not re-request indexing.
12. **Track the indexed page count** across later crawls in Pages → Indexed, weekly.
13. **Investigate canonical differences.** In URL Inspection, compare "Google-selected canonical" with "User-declared canonical". A mismatch usually points to a `www` or Azure host duplicate (see §10, Hosting).
14. **Do not request indexing repeatedly** without fixing the underlying issue. Repeated requests do not speed up indexing.

### Priority URLs

- https://houstonluxuryremodeling.com
- https://houstonluxuryremodeling.com/luxury-remodeling-houston
- https://houstonluxuryremodeling.com/whole-home-remodeling-houston
- https://houstonluxuryremodeling.com/luxury-kitchen-remodeling-houston
- https://houstonluxuryremodeling.com/luxury-bathroom-remodeling-houston
- https://houstonluxuryremodeling.com/primary-suite-remodeling-houston
- https://houstonluxuryremodeling.com/home-additions-houston
- https://houstonluxuryremodeling.com/luxury-outdoor-living-houston
- https://houstonluxuryremodeling.com/how-it-works
- https://houstonluxuryremodeling.com/houston
- https://houstonluxuryremodeling.com/guides
