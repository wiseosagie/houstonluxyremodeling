# SEO Fix Implementation Report

**Date:** 2026-09-26
**Scope:** Confirmed issues from [SEO_INDEXING_AUDIT.md](SEO_INDEXING_AUDIT.md) that can be fixed safely in code
**State:** Uncommitted, not pushed, not deployed. The owner will review before committing.

## Executive Summary

**Fixed in code:**
1. **og:url.** Every public page now outputs its own canonical URL as `og:url`; before this change all 27 pages used the homepage. Verified on all 27 routes: `og:url == canonical`.
2. **Placeholder `"."` values.** The build-time values for phone and Search Console verification are now validated before use. A blank, missing or placeholder value (such as `"."`) now produces:
   - no footer `tel:` link and no visible "." text
   - no `contactPoint.telephone` in the Organization JSON-LD
   - no `<meta name="google-site-verification">` tag
3. **Internal linking.**
   - `/guides` is now linked from the site-wide footer and from the homepage. Click depth went from 3 to 1.
   - `/luxury-bathroom-remodeling-houston` is now linked from the homepage and from the Services hub. Depth went from 2 to 1.
   - Every commercially important URL is now within 2 clicks of the homepage.
4. **Thin utility pages, improved modestly with existing truthful content only:**
   - `/consultation`: added a "What Happens Next" section below the form, reusing the site's existing three-step process copy and matching-service disclaimer.
   - `/contact`: added one sentence stating the current service area, with links to Areas We Serve and How It Works.

**Not changed:** canonical logic (all 27 `alternates.canonical` lines are untouched), URLs, `robots.txt`, `sitemap.ts`, the header navigation, and the visual design system.

**Remaining manual work** (see [Manual Actions Required](#manual-actions-required)):
- setting the Azure default domain (the www duplicate-host problem)
- the GitHub repository variables for phone, verification token and contact email
- the Search Console Domain property and sitemap resubmission
- business information for a future About page (see [OWNER_INFORMATION_NEEDED.md](OWNER_INFORMATION_NEEDED.md))

**Did any change introduce errors?**
- Typecheck, the tests and the production build all pass.
- One regression appeared during implementation and was **caught and fixed before finishing**. Adding a page-level `openGraph` object dropped the inherited `og:image` and `twitter:image` on nested pages. We fixed it by including the existing `/opengraph-image` in the shared Open Graph defaults, and verified it on every page.
- Lint could not run through `npm run lint`, and running ESLint directly shows 142 older errors. Both are explained in [Tests & Build](#tests--build).

---

## Code Changes

### 1. `src/lib/constants.ts`

**Lines 1–2, added:**
```ts
import type { Metadata } from "next";
```
**Reason:** Needed to type `OPEN_GRAPH_DEFAULTS`. This is a type-only import and is safe in the client components that also import this file.

**Lines 13–40, added** (inserted after `CONTACT_EMAIL`):
```ts
function realPhone(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.replace(/\D/g, "").length >= 10 ? trimmed : undefined;
}
function realVerificationToken(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  // Revised in the pre-deployment review (see FINAL_SEO_PREDEPLOYMENT_REVIEW.md):
  return trimmed && trimmed.length >= 10 && /[A-Za-z0-9]/.test(trimmed) && !/s/.test(trimmed)
    ? trimmed
    : undefined;
}
export const CONTACT_PHONE = realPhone(process.env.NEXT_PUBLIC_CONTACT_PHONE);
export const GSC_VERIFICATION = realVerificationToken(process.env.NEXT_PUBLIC_GSC_VERIFICATION);

export const OPEN_GRAPH_DEFAULTS: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  siteName: SITE_NAME,
  locale: "en_US",
  images: [{ url: "/opengraph-image", width: 1200, height: 630, type: "image/png" }],
};
```
**Reason:**
- The sanitizers are the single place where the two placeholder-prone variables enter the app. `"."`, `""`, whitespace and an unset variable all resolve to `undefined`. A value with at least 10 digits, or a real-format token, passes through unchanged. We verified this by importing the module under four environment combinations.
- `OPEN_GRAPH_DEFAULTS` holds the layout's former Open Graph fields plus the existing generated image. It is needed because Next.js **replaces** the parent `openGraph` object rather than merging it when a page defines its own.

### 2. `src/app/layout.tsx`

| Lines | Before | After | Reason |
|---|---|---|---|
| 8–15 | `import { SITE_NAME, SITE_URL, NEIGHBORHOODS } from "@/lib/constants";` | Adds `CONTACT_PHONE, GSC_VERIFICATION, OPEN_GRAPH_DEFAULTS` to the import | Use the sanitized values |
| 40–42 | `openGraph: { type: "website", siteName: SITE_NAME, url: SITE_URL, locale: "en_US" }` | `openGraph: { ...OPEN_GRAPH_DEFAULTS }` with a comment explaining why `url` is omitted | **Root cause of the og:url bug.** `url: SITE_URL` was inherited by every page. The 404 page now emits no `og:url` at all, which is correct. |
| 50 | `verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined` | `verification: GSC_VERIFICATION ? { google: GSC_VERIFICATION } : undefined` | Prevents `content="."` |
| 66, 70 | `...(process.env.NEXT_PUBLIC_CONTACT_PHONE ? { contactPoint: { telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE, … } } : {})` | The same structure using `CONTACT_PHONE` | Prevents `"telephone": "."`. The whole `contactPoint` is omitted when there is no real phone. |

### 3. `src/components/shared/PhoneLink.tsx`

| Lines | Before | After | Reason |
|---|---|---|---|
| 4 | (none) | `import { CONTACT_PHONE } from "@/lib/constants";` | |
| 7 | `const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;` | `const phone = CONTACT_PHONE;` | The existing `if (!phone) return null;` now also covers `"."`, removing the visible "." and the `href="tel:"` link in the footer and on `/contact`. |

### 4. Per-page `og:url`: 27 page files

Each page received **one added line**, directly below its existing, unchanged canonical line. Each file also gained the `OPEN_GRAPH_DEFAULTS` import, either as a new import line or added to an existing `@/lib/constants` import.

```diff
   alternates: { canonical: "/luxury-kitchen-remodeling-houston" },
+  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/luxury-kitchen-remodeling-houston" },
```

The `url` value is copied verbatim from each page's own canonical string, so the two cannot diverge. No routes were invented.

| File | Added line |
|---|---|
| `src/app/page.tsx` | 18 |
| `src/app/luxury-remodeling-houston/page.tsx` | 14 |
| `src/app/houston/page.tsx` | 13 |
| `src/app/how-it-works/page.tsx` | 14 |
| `src/app/consultation/page.tsx` | 12 |
| `src/app/privacy/page.tsx` | 9 |
| `src/app/terms/page.tsx` | 9 |
| `src/app/contact/page.tsx` | 12 |
| `src/app/matching-service-disclosure/page.tsx` | 10 |
| `src/app/whole-home-remodeling-houston/page.tsx` | 15 |
| `src/app/luxury-kitchen-remodeling-houston/page.tsx` | 15 |
| `src/app/primary-suite-remodeling-houston/page.tsx` | 15 |
| `src/app/home-additions-houston/page.tsx` | 15 |
| `src/app/luxury-outdoor-living-houston/page.tsx` | 15 |
| `src/app/luxury-bathroom-remodeling-houston/page.tsx` | 15 |
| `src/app/river-oaks-remodeling/page.tsx` | 15 |
| `src/app/memorial-remodeling/page.tsx` | 15 |
| `src/app/tanglewood-remodeling/page.tsx` | 15 |
| `src/app/west-university-remodeling/page.tsx` | 15 |
| `src/app/afton-oaks-remodeling/page.tsx` | 15 |
| `src/app/guides/page.tsx` | 12 |
| `src/app/guides/home-remodeling-cost-houston/page.tsx` | 13 |
| `src/app/guides/whole-home-remodel-cost-houston/page.tsx` | 13 |
| `src/app/guides/kitchen-remodel-cost-houston/page.tsx` | 13 |
| `src/app/guides/bathroom-remodel-cost-houston/page.tsx` | 13 |
| `src/app/guides/how-to-choose-remodeling-contractor-houston/page.tsx` | 12 |
| `src/app/guides/remodel-or-rebuild-houston/page.tsx` | 12 |

**Reason:** Audit issue META-01 (`og:url` was the homepage on every page).

### 5. `src/components/layout/Footer.tsx`

**Lines 28–32, added** (at the end of the "Explore" list):
```tsx
<li>
  <Link href="/guides" className="hover:text-white">
    Guides
  </Link>
</li>
```
**Reason:** A site-wide, crawlable `<a href="/guides">`. We chose the footer over the header deliberately. The header already fits four links plus a wide CTA at the `lg` (1024 px) breakpoint, and a fifth item risked crowding it. **The header is unchanged.**

### 6. `src/components/home/CategoryGrid.tsx`

**Line 1, added:** `import Link from "next/link";`

**Lines 59–70, added** (below the 5-card grid):
```tsx
<p className="mt-12 max-w-2xl text-sm leading-relaxed text-charcoal-light">
  Renovating a bathroom on its own? See our{" "}
  <Link href="/luxury-bathroom-remodeling-houston" …>bathroom remodeling guide</Link>
  . For budgets and choosing a professional, browse our{" "}
  <Link href="/guides" …>planning and cost guides</Link>.
</p>
```
**Reason:** Homepage links to the bathroom service and `/guides`. We used a text line, not a sixth card, because the grid is fixed at `lg:grid-cols-5` and a sixth card would leave an orphan on its own row. The wording mirrors the bathroom page's own FAQ, which distinguishes a standalone bathroom from a primary suite.

### 7. `src/app/luxury-remodeling-houston/page.tsx` (Services hub)

**Lines 124–130, added** (below the category grid):
```tsx
<p className="mt-12 max-w-2xl text-sm leading-relaxed text-charcoal-light">
  Renovating a bathroom on its own rather than the full primary suite? Our{" "}
  <a href="/luxury-bathroom-remodeling-houston" …>bathroom remodeling guide</a>{" "}
  covers that project.
</p>
```
**Reason:** The header's "Services" link points to this hub, which previously did not link to the bathroom page. This uses the same `<a>` and class style as the other inline links in this file.

### 8. `src/app/consultation/page.tsx`

**Before:**
```tsx
<section className="min-h-[80vh] bg-warmwhite">…<ConsultationForm />…</section>
```

**After (lines 17–45):** the same form section, followed by a second section:

```tsx
<section className="py-14 md:py-20 border-t border-stone-200 bg-stone-50">
  <p className="eyebrow mb-4">After You Submit</p>
  <h2 className="text-2xl md:text-3xl">What Happens Next</h2>
  <ProcessSteps compact />
  <p>Houston Luxury Remodeling is a matching and referral service. We do not perform construction and do not employ contractors. See our <Link href="/matching-service-disclosure">…</Link> for details.</p>
</section>
```

**Reason:** The page had about 26 words of server-rendered content. It now has about 122. All added copy already existed on the site:
- `ProcessSteps` renders `HOW_IT_WORKS_STEPS`, which the homepage and `/how-it-works` already use.
- The disclaimer sentence is the footer's existing wording.

The section tells visitors what happens to their information before they give it, and it sits below the form so the form flow is not affected.

### 9. `src/app/contact/page.tsx`

**Lines 5–6:** added `import Link from "next/link";` and added `NEIGHBORHOODS` to the constants import.

**Lines 28–38, added** (below the CTA):
```tsx
<p className="mt-8 text-sm leading-relaxed text-charcoal-light">
  We currently focus on <Link href="/houston">River Oaks, Memorial, Tanglewood, West University, Afton Oaks</Link>
  . To see what happens after you submit a project, read <Link href="/how-it-works">How It Works</Link>.
</p>
```
**Reason:** The page now states the service area, generated from the existing `NEIGHBORHOODS` constant and matching the `/houston` page's stated focus. Word count went from about 59 to 85. The page is intentionally still short, and **the email address was not changed** (see Manual Actions).

### Files deliberately not touched

These files already had uncommitted changes of yours before this work began, and we did not edit them:
- `src/app/api/leads/route.ts`
- `src/lib/email.ts`
- `src/lib/db.ts`
- `test/leads-api.test.ts`
- `.env.example`, `.gitignore`, `README.md`
- `docs/*`
- the staged deletion of `data/app.db`

Also unchanged: `robots.ts`, `sitemap.ts`, `middleware.ts` and `next.config.mjs`.

---

## Tests & Build

| Command | Result |
|---|---|
| `npm run typecheck` (`tsc --noEmit`) | ✅ Pass, 0 errors |
| `npm test` (10 tests) | ✅ 10/10 pass |
| `npm run build`, run with `NEXT_PUBLIC_CONTACT_PHONE="." NEXT_PUBLIC_GSC_VERIFICATION="."` to reproduce production's placeholders | ✅ Pass. 35 routes generated; all 27 content routes are static. |
| `npm run lint` (`next lint`) | ⚠️ **Could not run.** The repository has no ESLint config file, so `next lint` stops at an interactive setup prompt. This predates these changes; we did not create a config. |
| `npx eslint` run directly, with the installed `eslint-config-next/core-web-vitals` from a temporary config outside the repo | ⚠️ 142 errors, **all** `react/no-unescaped-entities` (apostrophes and quotes in existing page copy). **None are on lines added in this change**, and the new copy contains no apostrophes or quotes. These predate this work and were not fixed, to keep the diff focused. |

**Local crawl:** we ran `next start` on the production build and crawled it with a Googlebot user-agent.
- Starting from `/` and `/sitemap.xml`, the crawler reached the same 27 URLs as production. No new or broken URLs.
- Each page was checked for HTTP status, canonical (exactly one, equal to the production URL), `og:url == canonical`, meta robots, a single H1, a parseable JSON-LD block, sitemap inclusion, no verification tag, and no `tel:` link.
- Title, description, H1 and canonical were compared against the **live production crawl**. They are unchanged on all 27 pages.
- The full set of `og:` and `twitter:` tags was compared against live: identical except `og:url`, which is now correct. The image URL also dropped the `?hash` cache-buster query string, but it is the same `/opengraph-image` route and returns 200 `image/png`.

---

## URL Verification

We crawled the local production build. Canonical and og:url values are shown relative to `https://houstonluxuryremodeling.com`. **(root)** means `https://houstonluxuryremodeling.com`: Next.js renders the `/` canonical without a trailing slash, and the sitemap `<loc>` uses the same form, so all three agree.

"Inbound total" includes header and footer links. "Contextual" counts links from page body content only.

| URL | HTTP | Canonical | og:url | Indexable | Sitemap | Inbound (total / contextual) | Click depth (before → after) | Status |
|---|---|---|---|---|---|---|---|---|
| `/` | 200 | (root) ✓ | (root) ✓ | Yes | Yes | 26 / 25 | 0 | PASS |
| `/luxury-remodeling-houston` | 200 | /luxury-remodeling-houston ✓ | /luxury-remodeling-houston ✓ | Yes | Yes | 26 / 8 | 1 | PASS |
| `/houston` | 200 | /houston ✓ | /houston ✓ | Yes | Yes | 26 / 8 | 1 | PASS |
| `/how-it-works` | 200 | /how-it-works ✓ | /how-it-works ✓ | Yes | Yes | 26 / 2 | 1 | PASS |
| `/consultation` | 200 | /consultation ✓ | /consultation ✓ | Yes | Yes | 26 / 23 | 1 | PASS |
| `/privacy` | 200 | /privacy ✓ | /privacy ✓ | Yes | Yes | 26 / 1 | 1 | PASS |
| `/terms` | 200 | /terms ✓ | /terms ✓ | Yes | Yes | 26 / 0 | 1 | PASS |
| `/contact` | 200 | /contact ✓ | /contact ✓ | Yes | Yes | 26 / 1 | 1 | PASS |
| `/matching-service-disclosure` | 200 | /matching-service-disclosure ✓ | /matching-service-disclosure ✓ | Yes | Yes | 26 / 5 | 1 | PASS |
| `/whole-home-remodeling-houston` | 200 | /whole-home-remodeling-houston ✓ | /whole-home-remodeling-houston ✓ | Yes | Yes | 11 / 11 | 1 | PASS |
| `/luxury-kitchen-remodeling-houston` | 200 | /luxury-kitchen-remodeling-houston ✓ | /luxury-kitchen-remodeling-houston ✓ | Yes | Yes | 6 / 6 | 1 | PASS |
| `/primary-suite-remodeling-houston` | 200 | /primary-suite-remodeling-houston ✓ | /primary-suite-remodeling-houston ✓ | Yes | Yes | 4 / 4 | 1 | PASS |
| `/home-additions-houston` | 200 | /home-additions-houston ✓ | /home-additions-houston ✓ | Yes | Yes | 6 / 6 | 1 | PASS |
| `/luxury-outdoor-living-houston` | 200 | /luxury-outdoor-living-houston ✓ | /luxury-outdoor-living-houston ✓ | Yes | Yes | 5 / 5 | 1 | PASS |
| `/luxury-bathroom-remodeling-houston` | 200 | /luxury-bathroom-remodeling-houston ✓ | /luxury-bathroom-remodeling-houston ✓ | Yes | Yes | 6 / 6 | 2 → **1** | PASS |
| `/river-oaks-remodeling` | 200 | /river-oaks-remodeling ✓ | /river-oaks-remodeling ✓ | Yes | Yes | 26 / 2 | 1 | PASS |
| `/memorial-remodeling` | 200 | /memorial-remodeling ✓ | /memorial-remodeling ✓ | Yes | Yes | 26 / 2 | 1 | PASS |
| `/tanglewood-remodeling` | 200 | /tanglewood-remodeling ✓ | /tanglewood-remodeling ✓ | Yes | Yes | 26 / 2 | 1 | PASS |
| `/west-university-remodeling` | 200 | /west-university-remodeling ✓ | /west-university-remodeling ✓ | Yes | Yes | 26 / 3 | 1 | PASS |
| `/afton-oaks-remodeling` | 200 | /afton-oaks-remodeling ✓ | /afton-oaks-remodeling ✓ | Yes | Yes | 26 / 2 | 1 | PASS |
| `/guides` | 200 | /guides ✓ | /guides ✓ | Yes | Yes | 26 / 7 | 3 → **1** | PASS |
| `/guides/home-remodeling-cost-houston` | 200 | /guides/home-remodeling-cost-houston ✓ | /guides/home-remodeling-cost-houston ✓ | Yes | Yes | 2 / 2 | 2 | PASS |
| `/guides/whole-home-remodel-cost-houston` | 200 | /guides/whole-home-remodel-cost-houston ✓ | /guides/whole-home-remodel-cost-houston ✓ | Yes | Yes | 6 / 6 | 2 | PASS |
| `/guides/kitchen-remodel-cost-houston` | 200 | /guides/kitchen-remodel-cost-houston ✓ | /guides/kitchen-remodel-cost-houston ✓ | Yes | Yes | 4 / 4 | 2 | PASS |
| `/guides/bathroom-remodel-cost-houston` | 200 | /guides/bathroom-remodel-cost-houston ✓ | /guides/bathroom-remodel-cost-houston ✓ | Yes | Yes | 3 / 3 | 3 → **2** | PASS |
| `/guides/how-to-choose-remodeling-contractor-houston` | 200 | /guides/how-to-choose-remodeling-contractor-houston ✓ | /guides/how-to-choose-remodeling-contractor-houston ✓ | Yes | Yes | 5 / 5 | 2 | PASS |
| `/guides/remodel-or-rebuild-houston` | 200 | /guides/remodel-or-rebuild-houston ✓ | /guides/remodel-or-rebuild-houston ✓ | Yes | Yes | 2 / 2 | 2 | PASS |

**Click depth:**
- No URL is deeper than 2 clicks. The maximum was 3 before.
- **All seven service pages, the services hub, `/houston`, the five neighborhood pages and `/guides` are at depth 1.**
- The six guide articles are at depth 2, reached through `/guides` or their related service page. That is appropriate for supporting content.

**Canonical exceptions:** none. Every page has exactly one canonical, and it is absolute, HTTPS and on the apex domain.

**Every page also has:**
- `meta robots: index, follow`
- no `X-Robots-Tag`
- exactly one H1
- no `google-site-verification` tag (with the `"."` placeholder in effect)
- no `tel:` link (with the `"."` placeholder in effect)

### Structured data re-audit

| Check | Result |
|---|---|
| JSON syntax | All JSON-LD blocks on all 27 pages parse |
| URLs | Every URL in every block uses `https://houstonluxuryremodeling.com` (plus `https://schema.org` as `@context`) |
| Telephone | **Removed while invalid.** `Organization.contactPoint` is omitted until a real phone is configured; nothing is invented. |
| Email | No email property exists in any schema, and none was added (the current public email is on an unrelated domain) |
| Business name | "Houston Luxury Remodeling", consistent everywhere |
| Types | `Organization` on every page, `FAQPage` on the homepage, `Service` on 7 service pages, `Article` on 6 guides, `BreadcrumbList` on 25 pages. All unchanged and legitimate. |
| Duplicates or conflicts | None |
| Fabricated data | None. No reviews, ratings, prices, address, hours, awards or credentials. |

### Sitemap (after changes)

`/sitemap.xml` returns 200 with 27 `<loc>` entries, identical to the source routes and the crawl results. Every entry:
- uses HTTPS on the apex domain
- has no `www` or `azurestaticapps.net` host
- returns 200 with no redirect
- is canonical and self-referencing
- is not `noindex`

The sitemap was intentionally **not** reduced to the 11 URLs Search Console knows about.

### robots.txt (after changes)

Unchanged and correct:

```
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://houstonluxuryremodeling.com/sitemap.xml
```

- No page is blocked.
- `/_next/` (CSS and JS) is not blocked.
- The sitemap declaration uses the production apex domain.

---

## Manual Actions Required

### 1. Azure: set the apex as the default domain (HIGH PRIORITY)

**Why this can't be fixed in code:**
- Production headers show that `www.houstonluxuryremodeling.com`, `/path/` variants and `gray-tree-00f55e310.4.azurestaticapps.net` are all served from Azure's cache layer (`x-ms-nextjs-render: cache`), with the same ETag as the apex page.
- That layer answers before `src/middleware.ts` runs, which is why commit `957849c`'s middleware redirect never fires on production.
- Adding more middleware or `next.config` logic cannot change this, so no further workaround was attempted.

**Steps:**
1. Azure Portal → your Static Web App → **Settings → Custom domains**.
2. Confirm both `houstonluxuryremodeling.com` and `www.houstonluxuryremodeling.com` are listed with status **Ready**.
3. Select `houstonluxuryremodeling.com` → **Set default**.

**What Azure does:** Once a default domain is set, Azure Static Web Apps redirects requests on the app's *other* custom domains, and on its generated `*.azurestaticapps.net` hostname, to the default domain with a permanent redirect that preserves the path.
- **Preview-environment hostnames** for pull requests (`gray-tree-00f55e310-<n>.4.azurestaticapps.net`) are separate environments and are **not** redirected. They still point Google at the apex through their canonical tags, and they are removed when the pull request closes.
- If the portal does not offer **Set default** on your plan, redirect `www` → apex at the DNS or proxy layer instead, for example with a CDN or DNS-provider redirect rule.

**How to verify:**
```sh
# Expected: HTTP 301 (or 308) and Location: https://houstonluxuryremodeling.com/houston
curl -sI https://www.houstonluxuryremodeling.com/houston | grep -iE "^HTTP|^location"

# Expected: 301 → https://www.… is acceptable only if the next hop goes to the apex; ideally a single hop to the apex
curl -sIL http://www.houstonluxuryremodeling.com/houston | grep -iE "^HTTP|^location"

# Expected: 301/308 to https://houstonluxuryremodeling.com/houston
curl -sI https://gray-tree-00f55e310.4.azurestaticapps.net/houston | grep -iE "^HTTP|^location"

# Expected: HTTP 200, no Location (the apex must NOT redirect)
curl -sI https://houstonluxuryremodeling.com/houston | grep -iE "^HTTP|^location"
```

If the `azurestaticapps.net` host still returns 200 afterwards, it is not critical: every page on that host already declares the apex as canonical.

### 2. GitHub repository variables

Go to GitHub → repository → **Settings → Secrets and variables → Actions → Variables** (these are Variables, not Secrets):

| Variable | Current effective value | Action |
|---|---|---|
| `NEXT_PUBLIC_CONTACT_PHONE` | `"."` | Set a real, monitored number, or **delete** the variable. The code now omits the phone either way. |
| `NEXT_PUBLIC_GSC_VERIFICATION` | `"."` | Set the real HTML-tag token (only the `content` value), or **delete** it if you verify through DNS or a Domain property |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@wizzytechnologies.com` (observed on the live `/contact` page) | After confirming the `hello@houstonluxuryremodeling.com` inbox exists, set the variable to it or delete it; the code fallback is that address |
| `NEXT_PUBLIC_SITE_URL` | Produces apex URLs (correct) | Leave it, or confirm it is exactly `https://houstonluxuryremodeling.com` with no trailing slash and no `www` |

These are baked in at build time, so a **new deployment** (a push to `main`) is required after changing them.

### 3. Google Search Console Domain property
1. In Search Console, click **Add property → Domain** and enter `houstonluxuryremodeling.com`.
2. Add the TXT record it gives you at your DNS provider, then verify.

A Domain property covers the apex, `www`, and http and https together, so reports won't split across properties.

### 4. Sitemap resubmission
In the new Domain property, go to **Sitemaps** and submit `https://houstonluxuryremodeling.com/sitemap.xml`.
- Expected: Status **Success**, Discovered pages **27**.
- If an old `https://www.houstonluxuryremodeling.com/sitemap.xml` submission exists in any property, remove it.

### 5. Business phone
See [OWNER_INFORMATION_NEEDED.md §2](OWNER_INFORMATION_NEEDED.md). Nothing is shown until a real number is supplied.

### 6. Business email

| | |
|---|---|
| **Where it's displayed** | `src/app/contact/page.tsx:46-49` |
| **Where it's defined** | `src/lib/constants.ts:10-11`, with fallback `hello@houstonluxuryremodeling.com` |
| **Current production value** | `hello@wizzytechnologies.com`, set by the GitHub variable passed at `.github/workflows/azure-static-web-apps-gray-tree-00f55e310.yml:30` |

The repository documents `hello@houstonluxuryremodeling.com` as the intended address (`README.md:78`, `README.md:221`, `.env.local`), but also records that the inbox is unconfirmed (`docs/TESTING_CHECKLIST.md:53`). Confirm the inbox before switching. See [OWNER_INFORMATION_NEEDED.md §3](OWNER_INFORMATION_NEEDED.md).

### 7. About page and business information
Not created, because it would have required invented details. What is needed is listed in [OWNER_INFORMATION_NEEDED.md §1](OWNER_INFORMATION_NEEDED.md).

---

## Search Console Procedure (after deployment)

Do these steps in order. Do **not** request indexing for all URLs at once.

1. **Verify the production deployment.** Confirm the GitHub Action for the commit succeeded, then check that a changed page is live:
   `curl -s https://houstonluxuryremodeling.com/luxury-kitchen-remodeling-houston | grep -o '<meta property="og:url"[^>]*>'` should show the kitchen URL, not the homepage.
2. **Verify apex and www behavior** with the curl commands in Manual Action 1.
3. **Verify robots.txt:** `curl -s https://houstonluxuryremodeling.com/robots.txt` should show `Allow: /`, `Disallow: /api/` and the apex sitemap line.
4. **Verify the sitemap:** `curl -s https://houstonluxuryremodeling.com/sitemap.xml | grep -c "<loc>"` should print `27`.
5. **Submit or resubmit the sitemap** in the Domain property.
6. **URL Inspection** on `https://houstonluxuryremodeling.com/`.
7. Click **Test Live URL**. Confirm "URL is available to Google", then view the tested page and check that the HTML contains the content and the user-declared canonical is the apex root.
8. Click **Request indexing** for the homepage, once.
9. **Inspect a small number of high-value pages**, for example `/luxury-remodeling-houston`, `/whole-home-remodeling-houston` and `/luxury-kitchen-remodeling-houston`. Run Test Live URL on each; request indexing once for a few of the most important. This is a one-time nudge, not a routine: the sitemap and internal links are the discovery mechanism for the rest.
10. **Export the Examples lists.** Go to Page indexing → *Discovered – currently not indexed* → Examples → Export, and do the same for *Crawled – currently not indexed*. Paste those URLs into the `GSC_URL` and `GSC_STATUS` columns of [GSC_URL_COMPARISON.csv](GSC_URL_COMPARISON.csv), matching on `CURRENT_URL` or `OLD_WWW_URL`. This shows which of the 11 known URLs are old `www` URLs.

Then allow 2–6 weeks. Judge progress by URLs moving from Discovered to Crawled to Indexed, not by daily checks. Do not repeatedly re-request indexing.

---

## Deliverables

| File | Status |
|---|---|
| `SEO_FIX_IMPLEMENTATION_REPORT.md` | Created (this file) |
| `OWNER_INFORMATION_NEEDED.md` | Created |
| `GSC_URL_COMPARISON.csv` | Created: 27 rows, `GSC_URL` and `GSC_STATUS` left blank for the Search Console export. The 9 URLs from the pre-2026-09-20 `www` sitemap are flagged in `NOTES`. |
| `SEO_INDEXING_AUDIT.md`, `seo-audit-results.json`, `discovered_urls.txt` | Unchanged (created by the earlier audit) |

## Assumptions

- **Placeholder detection.** A phone number needs at least 10 digits, which fits US numbers. A verification token must be at least 10 characters, contain a letter or digit, and contain no whitespace (revised from a stricter character-set rule in the pre-deployment review, so that no legitimate token is silently dropped). If you use a different format, adjust `realPhone` or `realVerificationToken` in `src/lib/constants.ts`.
- **Homepage URL form.** The homepage `og:url` renders as `https://houstonluxuryremodeling.com`, without a trailing slash, to match the existing canonical and sitemap `<loc>` exactly. For the site root, this is equivalent to the trailing-slash form.
- **Azure redirect behavior.** The default-domain redirect behavior is described from Azure's documented feature and has **not** been exercised on this app. Verify it with the curl commands after making the change.
- **Build environment.** The local build used `.env.local` plus the injected `"."` placeholders. Production builds use the GitHub variables.
