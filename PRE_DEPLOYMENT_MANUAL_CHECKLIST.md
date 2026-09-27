# Pre-Deployment Manual Checklist

These actions cannot be done in code. Nothing here has been changed remotely.

## Order of operations

1. Review the code changes and commit them, following `SEO_COMMIT_SCOPE.txt`.
2. Update the GitHub variables (section B).
3. Push and deploy. This is a single build, so the new code and the new variable values ship together.
4. Change the Azure domain setting (section A). This can be done before or after the deploy.
5. Run the post-deployment check, then the Search Console steps (section C).

---

## A. Azure: make the apex the default domain (HIGH PRIORITY)

**Why this is manual:** On production today, `https://www.houstonluxuryremodeling.com/*` returns **200**, and so does `https://gray-tree-00f55e310.4.azurestaticapps.net/*`. Both are served from Azure's cache (`x-ms-nextjs-render: cache`) before Next.js middleware runs. Code changes, including the recent `src/middleware.ts` edit, cannot redirect cached pages.

**Steps:**
- [ ] Azure Portal → Static Web App → **Settings → Custom domains**.
- [ ] Confirm `houstonluxuryremodeling.com` and `www.houstonluxuryremodeling.com` both show **Ready**.
- [ ] Select `houstonluxuryremodeling.com` → **Set default**. If this option isn't available on your plan, set up a permanent www → apex redirect at your DNS or CDN provider instead.

**Verify afterwards:**
```sh
curl -sI https://www.houstonluxuryremodeling.com/
curl -sI https://www.houstonluxuryremodeling.com/houston
curl -sI https://www.houstonluxuryremodeling.com/guides
```

| Request | Expected |
|---|---|
| `https://www.houstonluxuryremodeling.com/` | A **permanent** redirect status (301 or 308, whichever Azure returns; either is fine) with `Location: https://houstonluxuryremodeling.com/` |
| `https://www.houstonluxuryremodeling.com/houston` | Permanent redirect, `Location: https://houstonluxuryremodeling.com/houston` (path preserved) |
| `https://www.houstonluxuryremodeling.com/guides` | Permanent redirect, `Location: https://houstonluxuryremodeling.com/guides` |
| `https://houstonluxuryremodeling.com/houston` | **200** with no `Location` header. The apex must not redirect. |

A temporary status (302 or 307) is **not** the goal. If you see one, the redirect is coming from somewhere other than the default-domain setting.

**The Azure-generated hostname:**
```sh
curl -sI https://gray-tree-00f55e310.4.azurestaticapps.net/houston
```
- **Expected:** Azure's default-domain feature redirects the generated `*.azurestaticapps.net` hostname to the default domain as well.
- **If it still returns 200:** this is acceptable and not an indexing risk. Every page it serves already declares `https://houstonluxuryremodeling.com/...` as canonical.
- **Pull-request preview hostnames** (`gray-tree-00f55e310-<n>.4.azurestaticapps.net`) are separate environments. The setting does not affect them, and they also declare the apex canonical.

---

## B. GitHub repository variables

Location: GitHub → repository → **Settings → Secrets and variables → Actions → Variables**. The workflow reads them at build time (`.github/workflows/azure-static-web-apps-gray-tree-00f55e310.yml:26-30`).

| Variable | Current observed value | Recommended action | Redeploy required? |
|---|---|---|---|
| `NEXT_PUBLIC_CONTACT_PHONE` | `.` (the live footer shows a "." link with an empty `tel:`) | If the business has a real, monitored phone number, set it; any common format works, e.g. `(713) 555-1234` or `+17135551234`. Otherwise **delete** the variable. The new code hides the "." either way. | **Yes.** The value is compiled in at build time. |
| `NEXT_PUBLIC_GSC_VERIFICATION` | `.` (live output: `<meta name="google-site-verification" content=".">`) | If the Search Console property was verified by **HTML tag**, set the real token (only the `content="…"` value). If verification uses DNS, Google Analytics, or a Domain property, **delete** the variable. The new code hides the "." either way. **First check in Search Console → Settings → Ownership verification which method is active**, so verification isn't lost. | **Yes** |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@wizzytechnologies.com` (shown on the live `/contact` page) | **Do not change it until the owner confirms** that a brand-domain mailbox (e.g. `hello@houstonluxuryremodeling.com`) exists and receives mail. After confirmation, set it to that address. The repo documents that address as intended but also records it as unconfirmed (`docs/TESTING_CHECKLIST.md:53`). | **Yes**, when changed |

---

## C. Search Console (after a successful production deployment)

- [ ] **1. Verify the production homepage.** It should return 200 and show the new build:
  ```sh
  curl -s https://houstonluxuryremodeling.com/luxury-kitchen-remodeling-houston | grep -o '<meta property="og:url"[^>]*>'
  ```
  This should print the kitchen URL, not the homepage URL.
- [ ] **2. Verify www redirect behavior.** Use the curl table in section A.
- [ ] **3. Verify the sitemap.** `curl -s https://houstonluxuryremodeling.com/sitemap.xml | grep -c "<loc>"` should print **27**.
- [ ] **4. Verify robots.txt.** `curl -s https://houstonluxuryremodeling.com/robots.txt` should show `Allow: /`, `Disallow: /api/` and `Sitemap: https://houstonluxuryremodeling.com/sitemap.xml`.
- [ ] **5. Verify the Search Console Domain property.** If you don't have one yet, add property → **Domain** → `houstonluxuryremodeling.com` → add the DNS TXT record → verify. It covers the apex, `www`, http and https in one property.
- [ ] **6. Submit or resubmit the sitemap** `https://houstonluxuryremodeling.com/sitemap.xml`. Expect *Success* and *27 discovered*. Remove any old `www` sitemap submission.
- [ ] **7. URL Inspection** on `https://houstonluxuryremodeling.com/`.
- [ ] **8. Test Live URL.** It should say "URL is available to Google", and the user-declared canonical should be the apex root.
- [ ] **9. Request indexing** for the homepage, once.
- [ ] **10. Inspect a small number of important service pages**, e.g. `/luxury-remodeling-houston`, `/whole-home-remodeling-houston` and `/luxury-kitchen-remodeling-houston`. Test Live URL confirms each is fine; requesting indexing once for these is optional. This is a **one-time check, not a routine**. The sitemap and internal links are how Google discovers the other pages.
- [ ] **11. Export Examples** from Page indexing:
  - *Discovered – currently not indexed* → Examples → Export
  - *Crawled – currently not indexed* → Examples → Export

  Put the URLs and statuses into `GSC_URL_COMPARISON.csv` (the `GSC_URL` and `GSC_STATUS` columns). Any `www` URLs among them should show "Page with redirect" after section A is done.

Then wait: expect 2–6 weeks on a 10-day-old domain. Don't repeatedly re-request indexing, and don't make further code changes in response to indexing status alone.

---

## D. Automated post-deploy check

```sh
node scripts/verify-production-seo.mjs
```
- **Exits 0** when all 27 sitemap URLs return 200, are indexable, and have a single apex canonical equal to their sitemap URL and to their `og:url`.
- **Prints warnings** while `www` still returns 200. The warnings clear once section A is done.
- **Before this deploy**, it exits **1**: current production has the old `og:url` on 26 pages.
