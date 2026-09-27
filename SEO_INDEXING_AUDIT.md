# EXECUTIVE DIAGNOSIS

**Audit date:** 2026-09-26 · **Domain:** https://houstonluxuryremodeling.com · **Method:** local source inspection plus a live crawl of production using a Googlebot user-agent (27 URLs, all host and slash variants tested). No site files were modified.

**Search Console input (supplied, not verified here):** 11 known URLs, 0 indexed, 9 "Discovered – currently not indexed", 2 "Crawled – currently not indexed", 0 impressions. We were not given which URLs these are, so no per-URL Search Console status appears in this report.

### 1. Is there a confirmed technical blocker preventing Google indexing?

**No.** All 27 production URLs:
- return **HTTP 200** over HTTPS
- carry `meta robots: index, follow` and no `X-Robots-Tag`
- have a **self-referencing, absolute, HTTPS, apex canonical**
- are **in a valid sitemap**
- are **fully server-rendered**: title, description, canonical, H1, body copy and `<a href>` navigation are all in the raw HTML

`robots.txt` only disallows `/api/`. There are no 5xx errors, no redirect loops and no slow responses (TTFB about 0.1–0.4 s).

We did confirm several **signal-quality problems**, but none of them prevents indexing:
- the `www` host and the `*.azurestaticapps.net` host serve 200 duplicates
- the site used conflicting canonical hosts during its first days
- a placeholder `"."` verification tag and phone number are live on every page

### 2. Why are the 9 discovered URLs probably not being crawled or indexed?

- **HIGHLY LIKELY: the site is very new.** The first commit was 2026-09-15 and the first Azure deploy 2026-09-16. The current 27-URL sitemap only went live on 2026-09-20, six days before this report.
- **The domain has no authority yet.** "Discovered – currently not indexed" is Google's normal queue state for a brand-new domain with no external links. Google knows the URLs exist but has not yet decided to spend crawl resources on them.
- **Google is probably working from an old snapshot.** It reports 11 known URLs while the live sitemap has 27. The pre-2026-09-20 sitemap had 9 URLs, and all of them pointed at `https://www.` (commit `e0d03b4`).
- **HIGHLY LIKELY (contributing): the canonical host changed on 2026-09-20 and is still not enforced.** Canonicals and sitemap switched from `www` to the apex that day. However, `www` still returns 200 because the Azure edge cache bypasses the Next.js middleware redirect. Some of the 11 known URLs are plausibly `www` URLs whose canonical target has since moved.
- **POSSIBLE: weak internal prominence for part of the site.**
  - `/guides` sits at click depth 3 and is not in the header, footer or homepage.
  - `/luxury-bathroom-remodeling-houston` is not linked from the homepage.

### 3. Why are the 2 crawled URLs probably not being indexed?

We cannot tell which two URLs these are. The most plausible explanations:

- **HIGHLY LIKELY: low site-level trust or value on a new lead-generation site.** The site is a referral service and currently has:
  - no About page and no named operator, address or working phone
  - a visible broken footer phone link (`<a href="tel:">.</a>`) on every page
  - a contact email on a domain unrelated to the brand
  - stock imagery only

  Google indexes new sites of this kind selectively.
- **POSSIBLE: thin utility pages.** If the two crawled URLs include `/consultation` (about 26 words of server-rendered main content) or `/contact` (about 59 words), thinness is a direct explanation.
- **POSSIBLE: crawled under the old `www` canonical.** If they were crawled before 2026-09-20 under the `www` canonical, Google may be holding them while host signals settle.
- **UNLIKELY: duplication or soft-404.** No near-duplicate content was found (maximum 5-gram Jaccard similarity between any two pages is 0.11), and 404s return a real 404 status.

### 4. Five highest-priority fixes

1. **Enforce one host (P1).** In the Azure Portal, set `houstonluxuryremodeling.com` as the Static Web App's **default domain**. `www` and `gray-tree-00f55e310.4.azurestaticapps.net` will then 301 to the apex. The middleware redirect cannot do this because cached pages bypass it.
2. **Remove the `"."` placeholders (P1).** Fix or delete the GitHub repository variables `NEXT_PUBLIC_GSC_VERIFICATION` and `NEXT_PUBLIC_CONTACT_PHONE`. This removes the broken footer phone link and the invalid JSON-LD telephone.
3. **Set up Search Console properly (P1).** Add a **Domain property** (DNS TXT), resubmit `sitemap.xml`, and confirm it reports "Success" with 27 URLs discovered.
4. **Surface the content cluster (P1).** Add **Guides** to the header and footer navigation, add a homepage guides section, and link the bathroom page from the homepage and the services hub.
5. **Add real trust signals (P1).**
   - Add a truthful **About** page: who operates the service and how professionals are selected.
   - Use a brand-domain contact email.
   - Earn a handful of genuine external links, for example from participating professionals or local associations.

### 5. What to do in Google Search Console after the fixes are deployed

1. Add a **Domain property** covering the apex, `www` and http variants. Check Settings → Ownership verification to confirm how the current property is verified. If it was the HTML tag, it is now at risk because the live tag content is `"."`.
2. In **Sitemaps**, resubmit `https://houstonluxuryremodeling.com/sitemap.xml`. Confirm the status is *Success* and *Discovered pages: 27*, and remove any old `www` sitemap submission.
3. In **Page indexing**, open each "not indexed" reason, click **Examples**, and **export the URL list**. This shows which 11 URLs Google knows about and whether any are `www` URLs.
4. Run **URL Inspection → Test live URL** on the homepage. Confirm "URL is available to Google" and check the rendered HTML and the user-declared canonical, then click **Request indexing**. Repeat for at most about 8–10 key pages over a few days, not repeatedly: `/luxury-remodeling-houston`, the six service pages, `/houston` and `/guides`.
5. For a `www` URL, confirm URL Inspection reports "Page with redirect".
6. Check **Settings → Crawl stats** after 1–2 weeks to confirm Googlebot is fetching pages and receiving 200s and 301s.
7. Allow **2–6 weeks**. Judge progress by movement from "Discovered" to "Crawled" to "Indexed", not by daily checks.

---

## 1. Technology stack

| Item | Finding |
|---|---|
| Framework | **Next.js 15.5.25** (App Router), React 19, TypeScript, Tailwind |
| Rendering | Static prerender (SSG) for every public page. The only dynamic handler is `POST /api/leads`. Live headers show `x-nextjs-prerender: 1,1`, `x-nextjs-cache: HIT` and `x-ms-nextjs-render: cache`. |
| Build | `next build`, run by `Azure/static-web-apps-deploy@v1` in [.github/workflows/azure-static-web-apps-gray-tree-00f55e310.yml](.github/workflows/azure-static-web-apps-gray-tree-00f55e310.yml) |
| Hosting | **Azure Static Web Apps**, hybrid Next.js hosting. Default host `gray-tree-00f55e310.4.azurestaticapps.net`; the apex resolves to `20.69.69.104` and `www` is a CNAME to the SWA host. |
| Routing | File-system App Router under `src/app/`. No dynamic segments. |
| SEO packages | None. Uses the native Next.js Metadata API and inline JSON-LD. |
| Sitemap | [src/app/sitemap.ts](src/app/sitemap.ts): a hard-coded list of 27 routes, all with `lastModified` 2026-09-20 |
| robots.txt | [src/app/robots.ts](src/app/robots.ts) |
| Host redirect | [src/middleware.ts](src/middleware.ts) (www → apex) and [next.config.mjs:18-27](next.config.mjs#L18-L27). **Neither is effective in production** (see §3). |
| Config files absent | `public/`, `vercel.json`, `netlify.toml`, `staticwebapp.config.json`, `Dockerfile`, nginx, `.htaccess` |

## 2. Public page inventory

| URL | Source file | Purpose | Index? | Reason |
|---|---|---|---|---|
| `/` | [src/app/page.tsx](src/app/page.tsx) | Homepage | Yes | Primary entry |
| `/luxury-remodeling-houston` | [page.tsx](src/app/luxury-remodeling-houston/page.tsx) | Services hub | Yes | Core commercial page |
| `/whole-home-remodeling-houston` | [page.tsx](src/app/whole-home-remodeling-houston/page.tsx) | Service | Yes | Unique |
| `/luxury-kitchen-remodeling-houston` | [page.tsx](src/app/luxury-kitchen-remodeling-houston/page.tsx) | Service | Yes | Unique |
| `/luxury-bathroom-remodeling-houston` | [page.tsx](src/app/luxury-bathroom-remodeling-houston/page.tsx) | Service | Yes | Unique; some overlap with the primary-suite page |
| `/primary-suite-remodeling-houston` | [page.tsx](src/app/primary-suite-remodeling-houston/page.tsx) | Service | Yes | Unique |
| `/home-additions-houston` | [page.tsx](src/app/home-additions-houston/page.tsx) | Service | Yes | Unique |
| `/luxury-outdoor-living-houston` | [page.tsx](src/app/luxury-outdoor-living-houston/page.tsx) | Service | Yes | Unique |
| `/houston` | [page.tsx](src/app/houston/page.tsx) | Areas hub | Yes | Hub |
| `/river-oaks-remodeling` | [page.tsx](src/app/river-oaks-remodeling/page.tsx) | Neighborhood | Yes | Distinct local content |
| `/memorial-remodeling` | [page.tsx](src/app/memorial-remodeling/page.tsx) | Neighborhood | Yes | Distinct |
| `/tanglewood-remodeling` | [page.tsx](src/app/tanglewood-remodeling/page.tsx) | Neighborhood | Yes | Distinct |
| `/west-university-remodeling` | [page.tsx](src/app/west-university-remodeling/page.tsx) | Neighborhood | Yes | Distinct |
| `/afton-oaks-remodeling` | [page.tsx](src/app/afton-oaks-remodeling/page.tsx) | Neighborhood | Yes | Distinct |
| `/guides` | [page.tsx](src/app/guides/page.tsx) | Guides hub | Yes | Hub |
| `/guides/home-remodeling-cost-houston` | [page.tsx](src/app/guides/home-remodeling-cost-houston/page.tsx) | Article | Yes | Unique |
| `/guides/whole-home-remodel-cost-houston` | [page.tsx](src/app/guides/whole-home-remodel-cost-houston/page.tsx) | Article | Yes | Unique |
| `/guides/kitchen-remodel-cost-houston` | [page.tsx](src/app/guides/kitchen-remodel-cost-houston/page.tsx) | Article | Yes | Unique |
| `/guides/bathroom-remodel-cost-houston` | [page.tsx](src/app/guides/bathroom-remodel-cost-houston/page.tsx) | Article | Yes | Unique |
| `/guides/how-to-choose-remodeling-contractor-houston` | [page.tsx](src/app/guides/how-to-choose-remodeling-contractor-houston/page.tsx) | Article | Yes | Unique |
| `/guides/remodel-or-rebuild-houston` | [page.tsx](src/app/guides/remodel-or-rebuild-houston/page.tsx) | Article | Yes | Unique |
| `/how-it-works` | [page.tsx](src/app/how-it-works/page.tsx) | Process | Yes | Supporting |
| `/consultation` | [page.tsx](src/app/consultation/page.tsx) | Lead form | Yes (low value) | Thin in HTML; conversion page |
| `/contact` | [page.tsx](src/app/contact/page.tsx) | Contact | Yes (low value) | Thin |
| `/matching-service-disclosure` | [page.tsx](src/app/matching-service-disclosure/page.tsx) | Disclosure | Yes | Trust page |
| `/privacy`, `/terms` | [privacy](src/app/privacy/page.tsx), [terms](src/app/terms/page.tsx) | Legal | Yes (or leave as is) | Boilerplate |

**Should not be indexed, and correctly are not indexable or are canonicalized:**

| URL | Behavior |
|---|---|
| `/api/leads` | Disallowed in robots.txt; GET returns 405 |
| `/opengraph-image`, `/icon` | Image routes (200) |
| `www.*` host | 200 duplicate; canonical points to apex |
| `*.azurestaticapps.net` | 200 duplicate; canonical points to apex |
| `/path/` (trailing slash) | 200 duplicate; canonical points to the no-slash URL |
| `?utm_*` | Canonical points to the clean URL |
| Unknown paths | Real 404 with `noindex` |

There are no auth, staging, test or dynamic parameter pages.

## 3. Live production tests

All 27 URLs: 200, HTTPS, no redirect chain, no `X-Robots-Tag`, `index, follow`, self-canonical, and title, description and H1 present in the raw HTML. Per-URL data is in [seo-audit-results.json](seo-audit-results.json).

| Variant | Result | Assessment |
|---|---|---|
| `http://houstonluxuryremodeling.com/` | 301 → `https://houstonluxuryremodeling.com/` | OK |
| `http://www.houstonluxuryremodeling.com/` | 301 → `https://www.…/`, then **200** | ❌ Never reaches the apex |
| `https://www.houstonluxuryremodeling.com/houston` | **200**, canonical → apex | ❌ **CONFIRMED duplicate host.** Middleware redirect not executing. |
| `https://gray-tree-00f55e310.4.azurestaticapps.net/houston` | **200**, `index,follow`, canonical → apex | ❌ **CONFIRMED duplicate host** |
| `https://houstonluxuryremodeling.com/houston/` | **200**, same ETag, canonical → `/houston` | ⚠️ Duplicate (mitigated) |
| `/HOUSTON` | 404 | OK |
| `/?utm_source=x` | 200, canonical → root | OK |
| `/this-does-not-exist` | 404 + `noindex` | OK (no soft 404) |

**Why the www redirect fails (CONFIRMED by headers).** The `www`, trailing-slash and azurestaticapps responses all show `x-ms-nextjs-render: cache`, `Cache-Control: s-maxage=31536000` and the same ETag as the apex page. Azure SWA serves the prerendered HTML from its cache layer without invoking [src/middleware.ts](src/middleware.ts). Commit `957849c` assumed the middleware would run on every request, but on SWA it does not for cached pages.

## 4. robots.txt

```
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://houstonluxuryremodeling.com/sitemap.xml
```

- 200, `text/plain`.
- No `Disallow: /`, and `/_next/` assets are **not** blocked, so rendering resources are crawlable.
- The sitemap reference is correct: absolute, HTTPS and apex.
- `www` and the azurestaticapps host serve the same file. **No issue.**

## 5. Sitemap

`/sitemap.xml`: 200, `application/xml`, valid XML, **27 URLs**. `/sitemap_index.xml` returns 404, which is expected because there is no index file.

| Check | Result |
|---|---|
| Duplicates | 0 |
| Redirected URLs | 0 |
| Non-200 URLs | 0 |
| Noindex URLs | 0 |
| http:// URLs | 0 |
| www URLs | 0 |
| Trailing-slash URLs | 0 |
| Non-canonical URLs | 0 (homepage `<loc>` has no slash and the canonical has no slash; consistent) |
| `lastmod` | Identical (2026-09-20) on all 27. Acceptable. |

**Source routes vs live URLs vs sitemap URLs:** 27 source routes, 27 live 200 URLs, 27 sitemap URLs. They match exactly. The crawl found no URL outside the sitemap and no sitemap URL missing from source.

**Historical discrepancy (from git):**

| Date | Commit | Sitemap state |
|---|---|---|
| 2026-09-15 / 16 | `548bd1e`, `1566652` | 9 routes, all with `https://www.` origin |
| 2026-09-20 | `e0d03b4` | Origin changed to apex |
| 2026-09-20 | `83e7488` | Grew to 27 routes |

GSC's figure of "11 known URLs" is consistent with Google having processed only the older state so far.

## 6. Canonical audit

- Every page has one `<link rel="canonical">`: absolute, HTTPS, apex, and self-referencing.
- No page canonicalizes to the homepage.
- No canonical points to a redirect or a 404.

Issues:

| Issue | Evidence | Status |
|---|---|---|
| Duplicate hosts compete (www, azurestaticapps) | 200 responses on both | CONFIRMED. Mitigated by canonicals, but a 301 is a much stronger signal. |
| Canonical host flip on 2026-09-20 | [src/lib/constants.ts:2-3](src/lib/constants.ts#L2-L3), commit `e0d03b4` | CONFIRMED history. Google's first crawl saw www canonicals. |
| `og:url` equals the homepage on all 27 pages | [src/app/layout.tsx:33-38](src/app/layout.tsx#L33-L38) sets `openGraph.url: SITE_URL`; no page overrides it | CONFIRMED. Weak conflicting signal. |
| Trailing-slash variants return 200 | `/houston/` | CONFIRMED. Canonical mitigates. |

## 7. Indexing directives in the codebase

| File:line | Code | Impact |
|---|---|---|
| [src/app/layout.tsx:41-44](src/app/layout.tsx#L41-L44) | `robots: { index: true, follow: true }` | Site-wide `index, follow`. Correct. It also causes a second robots meta tag on the 404 page (see below). |
| [src/app/consultation/page.tsx:9](src/app/consultation/page.tsx#L9) | `robots: { index: true, follow: true }` | Redundant. Harmless. |
| [src/app/robots.ts:10](src/app/robots.ts#L10) | `disallow: ["/api/"]` | Correct |
| [src/app/layout.tsx:46-48](src/app/layout.tsx#L46-L48) | `verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? …` | Live value is `"."`. The tag is useless and could break HTML-tag verification. |
| Next.js built-in `not-found` | Emits `<meta name="robots" content="noindex">` | The 404 page therefore has both `noindex` and `index, follow`. Google applies the most restrictive rule, and the status is 404 anyway. Cleanup only. |

No `X-Robots-Tag` is set anywhere: not in [next.config.mjs](next.config.mjs) `headers()`, not in middleware, and not in production responses. There are no `nofollow` or `googlebot` directives and no environment-dependent `noindex`.

## 8. Rendering audit

The raw production HTML (no JavaScript) for every URL contains:
- `<title>`, meta description and canonical
- `<h1>` and all H2s
- the full body copy (for example about 950 words in `<main>` on `/whole-home-remodeling-houston`)
- header and footer navigation as real `<a href>` links
- JSON-LD

**Every page contains one `BAILOUT_TO_CLIENT_SIDE_RENDERING` marker.** It comes from `useSearchParams()` in `PageviewTracker` ([src/components/analytics/GoogleAnalytics.tsx:8-19](src/components/analytics/GoogleAnalytics.tsx#L8-L19)), which is wrapped in `<Suspense fallback={null}>` and renders `null`. **No content depends on it.** Not an issue.

**Exception: `/consultation`.** The multi-step form is a client component. The server HTML contains the first step with its H1 "What are you considering?" and option cards, about 26 words in total. This is expected for a form, but it gives Google little to index.

The mobile menu is rendered only after a click (`{open && …}` in [Header.tsx](src/components/layout/Header.tsx)). The desktop `<nav>` links are always present in the HTML, so crawlability is not affected.

## 9. Internal linking

The links present on every page (header and footer) are: `/`, `/luxury-remodeling-houston`, `/houston`, `/how-it-works`, `/consultation`, the five neighborhood pages, `/contact`, `/matching-service-disclosure`, `/privacy` and `/terms`.

| URL | Contextual inbound links (excl. header/footer) | Outbound | Depth | On home? | Orphan |
|---|---|---|---|---|---|
| `/` | 25 (breadcrumbs) | 19 | 0 | n/a | No |
| `/luxury-remodeling-houston` | 8 | 21 | 1 | nav | No |
| `/whole-home-remodeling-houston` | 11 | 17 | 1 | Yes | No |
| `/luxury-kitchen-remodeling-houston` | 6 | 17 | 1 | Yes | No |
| `/primary-suite-remodeling-houston` | 4 | 17 | 1 | Yes | No |
| `/home-additions-houston` | 6 | 15 | 1 | Yes | No |
| `/luxury-outdoor-living-houston` | 5 | 16 | 1 | Yes | No |
| `/luxury-bathroom-remodeling-houston` | 4 | 17 | **2** | **No** | No |
| `/houston` | 7 | 14 | 1 | Yes | No |
| Neighborhood pages (×5) | 2–3 each (plus footer) | 17–19 | 1 | footer | No |
| `/guides` | 6 (only from its own articles) | 21 | **3** | **No** | No |
| `/guides/whole-home-remodel-cost-houston` | 6 | 19 | 2 | No | No |
| `/guides/how-to-choose-remodeling-contractor-houston` | 5 | 16 | 2 | No | No |
| `/guides/kitchen-remodel-cost-houston` | 4 | 17 | 2 | No | No |
| `/guides/bathroom-remodel-cost-houston` | 3 | 19 | **3** | No | No |
| `/guides/home-remodeling-cost-houston` | 2 | 19 | 2 | No | No |
| `/guides/remodel-or-rebuild-houston` | 2 | 18 | 2 | No | No |
| `/how-it-works` | 1 | 14 | 1 | Yes | No |
| `/contact`, `/privacy` | 1 each | 14 | 1 | footer | No |
| `/terms` | 0 | 14 | 1 | footer | No |

What the table shows:
- **No orphans and no broken internal links.** All navigation uses `next/link`, which renders as `<a href>`.
- **Weak spots:**
  - The **guides cluster**: 7 URLs, hub at depth 3, not in navigation or on the homepage.
  - **The bathroom service page**, which is missing from the homepage `CategoryGrid` ([src/components/home/CategoryGrid.tsx](src/components/home/CategoryGrid.tsx)).
  - **The 6 service pages**, which are not in the header or footer.
- Every URL is in both the sitemap and the link graph. None is sitemap-only.

## 10. Content and indexability

- **Duplication check.** We compared 5-word shingles across the `<main>` text of all 27 pages. The highest pairwise Jaccard similarity is **0.11** (`/` vs `/houston`); every other pair is below 0.08. **No near-duplicate pages.**
- **Metadata.** No repeated titles, H1s or meta descriptions.
- **Neighborhood pages are not doorway pages.** They share a section skeleton ("What Homeowners in X Typically Renovate", "Questions Homeowners Ask"), but each has distinct substantive sections, for example:
  - River Oaks: deed restrictions and the approval path
  - Memorial: jurisdiction and flood plain
  - West U: its separate city permitting process
  - Tanglewood: civic association guidelines
  - Afton Oaks: architectural review
- **Service and guide pages** each run about 600–950 words of topic-specific planning content.
- **Weaker pages:**
  - `/consultation`: about 26 words; a form.
  - `/contact`: about 59 words.
  - `/houston`: about 241 words; a hub.
  - `/privacy` and `/terms`: boilerplate.
- **Intent overlap (POSSIBLE, minor):**
  - `/primary-suite-remodeling-houston` vs `/luxury-bathroom-remodeling-houston`
  - `/luxury-remodeling-houston` vs the homepage
  - Each service page vs its cost guide. These target different intents (planning vs cost), so this is fine.
- **Site-level quality signals (the most important content factor):**
  - The business is honestly described as a **matching/referral service** that does not perform construction.
  - There is no About page, no named operator, no address and no working phone.
  - The public contact email on `/contact` uses a domain unrelated to the brand.
  - All imagery is stock (Unsplash).
  - None of this breaks rules, but for a new domain competing for "remodeling Houston" queries it gives Google little reason to prioritize indexing. This is the most plausible driver of "Crawled – currently not indexed".

## 11. Houston local SEO structure

- **Coverage.** Dedicated pages exist for the six categories the business actually handles: whole-home, kitchen, bathroom, primary suite, additions and outdoor living. There is also a luxury hub and five neighborhood pages. The structure fits what the business offers, and we see no missing service to recommend.
- **Location pages are distinct, not doorway-style.** The risk to manage is wording, not structure. Titles such as "Kitchen Remodeling Houston" are appropriate only because the copy and the `Service` schema clearly frame the offering as matching. Keep that framing.
- **Google Business Profile.** A referral service without in-person customer contact is generally not eligible, so we do not recommend a profile or `LocalBusiness` address markup unless a real, eligible location exists.

## 12. Structured data

| Type | Pages | Findings |
|---|---|---|
| `Organization` | All | Valid JSON. **`contactPoint.telephone` is `"."`** (invalid; P1). `logo` points to the 1200×630 OG image (P3; a square logo is preferred). `areaServed` lists Houston and the neighborhoods, which is fine. |
| `FAQPage` | `/` (and pages using `PageFAQ`) | Valid. The questions are visible on the page. FAQ rich results are restricted to authoritative government and health sites, so there is no rich-result benefit, but no harm either. |
| `Service` | 7 service pages | Valid. `serviceType` honestly says "…matching" and `provider` is the Organization. `name` includes "\| Houston Luxury Remodeling" (P3 cosmetic). `areaServed` uses bare `Place` names; consider adding a `containedInPlace` Houston city (P3). |
| `Article` | 6 guides | Valid: headline, dates, author and publisher present. `image` is missing (recommended; P3). |
| `BreadcrumbList` | All except `/` and `/consultation` | Valid; the item URLs are absolute apex URLs. |

No JSON parse errors and no conflicting duplicate entities. Nothing should be added for ratings, reviews or credentials that do not exist.

## 13. Performance and crawl reliability

- 27/27 URLs returned 200.
- Repeated fetches of `/guides` were consistently 200 at 0.24–0.27 s.
- No 5xx responses, timeouts or redirect loops.
- DNS resolves; HTTPS with HSTS is in place.
- 9 JavaScript chunks on the homepage, about 156 KB decoded.
- HTML size is 25–93 KB.

**No performance-related indexing cause.**

## 14. Source search: suspicious findings

The following were searched in `src/`, the config files, the docs and the workflow: `noindex`, `nofollow`, `Disallow`, `canonical`, `robots`, `googlebot`, `sitemap`, `localhost`, `127.0.0.1`, `staging`, `http://`, `example.com`, and development domains.

| File:line | Code | SEO impact |
|---|---|---|
| [src/middleware.ts:7-15](src/middleware.ts#L7-L15) | `if (host.startsWith("www.houstonluxuryremodeling.com")) … redirect(url, 308)` | **Ineffective in production.** Cached pages bypass it and www returns 200. |
| [next.config.mjs:18-27](next.config.mjs#L18-L27) | `redirects()` with a `has: host` condition | Not applied by Azure SWA (documented in commit `957849c`). Dead config. |
| [src/lib/constants.ts:2-3](src/lib/constants.ts#L2-L3) | `SITE_URL = process.env.NEXT_PUBLIC_SITE_URL \|\| "https://houstonluxuryremodeling.com"` | Correct now. It was `www` before 2026-09-20. |
| [src/lib/constants.ts:8-9](src/lib/constants.ts#L8-L9) | `CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL \|\| …` | The production override uses a domain unrelated to the brand. Trust consistency issue. |
| [src/app/layout.tsx:36](src/app/layout.tsx#L36) | `openGraph: { url: SITE_URL }` | `og:url` is the homepage on all pages |
| [src/app/layout.tsx:46-48](src/app/layout.tsx#L46-L48) | `verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }` | Live content is `"."` |
| [src/app/layout.tsx:64-73](src/app/layout.tsx#L64-L73) and [src/components/shared/PhoneLink.tsx:6-7](src/components/shared/PhoneLink.tsx#L6-L7) | `telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE` | Live value `"."` produces invalid JSON-LD and a visible `<a href="tel:">.</a>` in the footer on every page |
| [.github/workflows/…yml:26-31](.github/workflows/azure-static-web-apps-gray-tree-00f55e310.yml#L26-L31) | `NEXT_PUBLIC_*: ${{ vars.* }}` | Source of the placeholder values. The actual values are not shown here; only their rendered public output was observed. |
| `README.md:48`, `test/*.ts` | `localhost`, `example.com` | Dev and tests only. No impact. |

We found no `staging` or dev domains, no stray `http://` URLs and no `noindex` in the application code.

## 15. Search Console status diagnosis

**9 × Discovered – currently not indexed**

| Cause | Classification |
|---|---|
| Brand-new domain (about 10 days live) with no external links. Google has not scheduled the crawl yet. | **HIGHLY LIKELY (primary)** |
| Google has not yet processed the 27-URL sitemap (6 days old); known URLs reflect the old 9-URL, www-based sitemap | **HIGHLY LIKELY** |
| Host ambiguity: www served 200 with www canonicals until 2026-09-20 and still serves 200 | **HIGHLY LIKELY (contributing)** |
| Weak internal prominence for guides and the bathroom page | POSSIBLE (would only affect those URLs) |
| robots.txt, noindex, server errors or rendering | **UNLIKELY. Ruled out by evidence.** |

**2 × Crawled – currently not indexed**

| Cause | Classification |
|---|---|
| Low site-level trust for a new lead-gen/referral site (no About page, broken "." phone, email on an unrelated domain, stock images) | **HIGHLY LIKELY** |
| The crawled URLs are thin utility pages (`/consultation`, `/contact`) | POSSIBLE (needs the Search Console "Examples" list) |
| Crawled as www URLs under the old canonical, so Google is holding them for canonical re-evaluation | POSSIBLE |
| Duplicate content or soft-404 | **UNLIKELY**. No near-duplicates, and real 404s are returned. |

## 16. URL-by-URL audit

For every row below: **HTTP** 200 · **Indexable?** Yes · **Canonical** self (apex, HTTPS) · **Robots** index, follow · **Sitemap** Yes. Only the varying fields are shown.

| URL | Internal links (ctx in / depth) | Content assessment | Problem | Recommended action | Priority |
|---|---|---|---|---|---|
| `/` | 25 / 0 | Substantive, unique | No link to guides or bathroom; site-wide host and trust issues | Add guides and bathroom links; fix host; request indexing | P1 |
| `/luxury-remodeling-houston` | 8 / 1 | Substantive | Some intent overlap with home | Keep; request indexing | P2 |
| `/whole-home-remodeling-houston` | 11 / 1 | Substantive (~950 words) | Site-wide only | Add to footer "Services" | P2 |
| `/luxury-kitchen-remodeling-houston` | 6 / 1 | Substantive | Site-wide only | Add to footer "Services" | P2 |
| `/luxury-bathroom-remodeling-houston` | 4 / **2** | Substantive | Not on homepage; overlaps with primary suite | Link from homepage and hub; differentiate | P2 |
| `/primary-suite-remodeling-houston` | 4 / 1 | Substantive | Overlap with bathroom | Cross-link and differentiate | P2 |
| `/home-additions-houston` | 6 / 1 | Substantive | Site-wide only | Footer "Services" | P2 |
| `/luxury-outdoor-living-houston` | 5 / 1 | Substantive | Site-wide only | Footer "Services" | P2 |
| `/houston` | 7 / 1 | Moderate (~241 words) | Somewhat thin hub | Expand the neighborhood intros | P3 |
| `/river-oaks-remodeling` | 2 / 1 | Distinct local content | Few contextual links | Link from relevant service pages | P2 |
| `/memorial-remodeling` | 2 / 1 | Distinct | Same | Same | P2 |
| `/tanglewood-remodeling` | 2 / 1 | Distinct | Same | Same | P2 |
| `/west-university-remodeling` | 3 / 1 | Distinct | Same | Same | P2 |
| `/afton-oaks-remodeling` | 2 / 1 | Distinct | Same | Same | P2 |
| `/guides` | 6 / **3** | Hub (~172 words) | Not in nav or homepage | Add to header, footer and homepage | **P1** |
| `/guides/home-remodeling-cost-houston` | 2 / 2 | Substantive | Few inbound links | Homepage guides section | P2 |
| `/guides/whole-home-remodel-cost-houston` | 6 / 2 | Substantive | None | Same | P2 |
| `/guides/kitchen-remodel-cost-houston` | 4 / 2 | Substantive | None | Same | P2 |
| `/guides/bathroom-remodel-cost-houston` | 3 / **3** | Substantive | Deep | Same | P2 |
| `/guides/how-to-choose-remodeling-contractor-houston` | 5 / 2 | Substantive | None | Same | P2 |
| `/guides/remodel-or-rebuild-houston` | 2 / 2 | Substantive | Few inbound links | Same | P2 |
| `/how-it-works` | 1 / 1 | Moderate (~251 words) | None | Keep | P3 |
| `/consultation` | 23 / 1 | **Thin in HTML (~26 words)** | Low indexable value | Add a server-rendered intro | P2 |
| `/contact` | 1 / 1 | **Thin (~59 words)**; off-brand email | Trust | Brand email and real details | P2 |
| `/matching-service-disclosure` | 4 / 1 | Useful trust page | None | Keep | P3 |
| `/privacy` | 1 / 1 | Boilerplate | None | Keep | P3 |
| `/terms` | 0 / 1 | Boilerplate | None | Keep | P3 |
| `https://www.…/*` (host) | n/a | Duplicate | **200 instead of 301** | Set the SWA default domain | **P1** |
| `https://gray-tree-00f55e310.4.azurestaticapps.net/*` | n/a | Duplicate | 200, indexable | Same fix | P2 |

## 17. Implementation plan

### PHASE 1: Indexing blockers and host consolidation

No true P0 blocker exists. These are the P1 items that most affect how Google reads the site.

**1.1 Enforce the apex host**
- **Where:** Azure Portal, not code. Static Web App → **Custom domains** → select `houstonluxuryremodeling.com` → **Set default**.
- **Current behavior:** `www` and `gray-tree-00f55e310.4.azurestaticapps.net` return 200 from the cache layer; the middleware never runs.
- **Change:** With a default domain set, SWA issues 301 redirects from all other custom domains and the generated hostname to the default domain.
- **Verify:**
  ```sh
  curl -sI https://www.houstonluxuryremodeling.com/houston            # expect 301 → https://houstonluxuryremodeling.com/houston
  curl -sI https://gray-tree-00f55e310.4.azurestaticapps.net/houston  # expect 301
  ```
- **Fallback:** If the portal option is unavailable on the current plan, do the www → apex 301 at the DNS or proxy layer, for example with a redirect service or a CDN rule. Keep [src/middleware.ts](src/middleware.ts) as defense in depth.

**1.2 Remove the `"."` placeholder variables**
- **Where:** GitHub → repository Settings → Variables: `NEXT_PUBLIC_GSC_VERIFICATION` and `NEXT_PUBLIC_CONTACT_PHONE`.
- **Current behavior:** `<meta name="google-site-verification" content=".">`, `"telephone": "."` in JSON-LD, and `<a href="tel:">.</a>` in the footer.
- **Change:** Set the real values, or delete the variables so the code omits these elements. Then harden the code:
  ```diff
  // src/app/layout.tsx:46
  - verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
  + verification: (process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "").length > 10
  ```
  ```diff
  // src/components/shared/PhoneLink.tsx:7  (and the same guard at layout.tsx:64)
  - if (!phone) return null;
  + if (!phone || phone.replace(/\D/g, "").length < 10) return null;
  ```

**1.3 Search Console setup:** Domain property, sitemap resubmission and URL Inspection, as described in Executive Diagnosis §5.

### PHASE 2: Crawl and discovery improvements

**2.1 Add Guides to global navigation**
- **File:** [src/lib/constants.ts:11-16](src/lib/constants.ts#L11-L16)
- **Current:** `NAV_LINKS` contains Services, Areas, How It Works and Consultation.
- **Change:**
  ```diff
    { href: "/how-it-works", label: "How It Works" },
  + { href: "/guides", label: "Guides" },
    { href: "/consultation", label: "Consultation" },
  ```
  This covers both the header and the footer "Explore" list.

**2.2 Add a footer "Services" column**
- **File:** [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)
- **Current:** The footer has no service links.
- **Change:** Add a column listing all 6 service pages, including bathroom. Use `grid-cols-5`, or merge it into "Explore".

**2.3 Add a homepage guides section and the bathroom card**
- **Files:** [src/app/page.tsx](src/app/page.tsx) and [src/components/home/CategoryGrid.tsx](src/components/home/CategoryGrid.tsx)
- **Current:** The homepage links 5 of the 6 service pages and 0 guides.
- **Change:** Add a "Bathroom" card, or a text link beneath the grid, and a "Planning Guides" section linking `/guides` and 3–6 guide articles.

**2.4 Earn legitimate external links (off-site)**
Examples:
- a profile or link from participating professionals' sites
- local business associations the operator actually belongs to
- the brand's social profiles
- outreach for the cost guides

Do not buy links.

### PHASE 3: Content and canonical improvements

**3.1 Fix `og:url`**
- **File:** [src/app/layout.tsx:36](src/app/layout.tsx#L36)
- **Current:** `og:url` is the homepage on every page.
- **Change:** Delete `url: SITE_URL` from the root `openGraph`, or set `openGraph: { url: "/path" }` in each page's metadata alongside `alternates.canonical`.

**3.2 Add an About page**
- **File:** new `src/app/about/page.tsx`, added to [sitemap.ts](src/app/sitemap.ts) and the footer
- **Change:** A truthful page covering who operates the service, how professionals are identified and reviewed, how the service is paid (if applicable), and the Houston connection. Include only verifiable facts.

**3.3 Make `/contact` consistent and useful**
- **Current:** About 59 words; the email is on an unrelated domain.
- **Change:** Use a brand-domain inbox via the `NEXT_PUBLIC_CONTACT_EMAIL` variable. Add response expectations and the service area, and link to `/consultation` and `/matching-service-disclosure`.

**3.4 Add server-rendered content to `/consultation`**
- **File:** [src/app/consultation/page.tsx](src/app/consultation/page.tsx)
- **Current:** About 26 words of server HTML.
- **Change:** Add a short server-rendered intro above `<ConsultationForm />`: what happens after submitting, privacy, and that the service is complimentary.

**3.5 Differentiate bathroom and primary suite**
Make `/luxury-bathroom-remodeling-houston` about bathrooms (including secondary and guest baths) and `/primary-suite-remodeling-houston` about the whole bedroom, bath and closet suite. Cross-link them explicitly.

### PHASE 4: Local SEO enhancements
- **Service schema.** Add `{"@type":"City","name":"Houston","containedInPlace":{"@type":"State","name":"Texas"}}` to `areaServed` on service pages, and nest the neighborhoods with `containedInPlace` Houston.
- **Contextual links.** Link each service page to the 2–3 neighborhood pages where that project type is discussed, and the reverse. The neighborhood pages already link out to services, but services rarely link back.
- **Do not add** `LocalBusiness` or `GeneralContractor` markup with an address, or `aggregateRating`, unless a real eligible location or genuine reviews exist.
- **Imagery.** Add real project photography only where the rights and attribution are genuine.

### PHASE 5: Performance and cleanup
- **Titles.** Shorten them to 60 characters or fewer. Either drop the middle segment, or set `title: { absolute: … }` where the brand is already implied. Example: "Luxury Remodeling in Houston | Houston Luxury Remodeling".
- **Organization logo.** In [src/app/layout.tsx:56-57](src/app/layout.tsx#L56-L57), point `logo` to a square logo asset.
- **Robots metadata.** Remove the explicit `robots` from the root layout ([layout.tsx:41-44](src/app/layout.tsx#L41-L44)) and from [consultation/page.tsx:9](src/app/consultation/page.tsx#L9). `index, follow` is the default, and removing it eliminates the double robots tag on the 404 page.
- **Dead redirect config.** Remove the ineffective `redirects()` block in [next.config.mjs:18-27](next.config.mjs#L18-L27) once 1.1 is live, or keep it with a comment noting it is not applied on SWA.
- **Article schema.** Add an `image` property.
- **Sitemap `lastmod`.** Optionally set it per page once pages change independently.
- **GA bailout.** No action needed on the `useSearchParams` CSR bailout; it is benign.

---

*Supporting files:*
- [seo-audit-results.json](seo-audit-results.json): per-URL data (status, headers, robots, canonical, og:url, title, description, H1/H2, word counts, links in and out, depth, JSON-LD types), plus issues and actions.
- [discovered_urls.txt](discovered_urls.txt): the 27 canonical production URLs.
