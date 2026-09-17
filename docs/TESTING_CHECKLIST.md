# Testing Checklist

## Verified during the launch-readiness pass (GA4 / GSC / email / honeypot / mobile QA)

- [x] `npm test` (`node --test`, no framework dependency) against the live `POST /api/leads`
      handler: normal submission, honeypot filled (silently discarded, generic success, no
      validation details leaked, `leadId: null`), a genuinely invalid field still returns a
      normal 400, timing heuristic, lead-score correctness, rate limiting (6th rapid request
      from one IP → 429; a different IP unaffected) — all 7 pass. See
      [`test/leads-api.test.ts`](../test/leads-api.test.ts).
- [x] Fixed the honeypot bug: the Zod schema (`website: z.string().max(0)`) rejected any
      filled honeypot with a 400 *before* the route's honeypot check could run, so a bot
      that filled it got told validation failed instead of being silently absorbed. Also
      wired the honeypot up to an actual hidden form field (it didn't exist before — the
      client always sent `website: ""`), and added a `leadId: null` vs real `leadId`
      distinction so the client never fires `consultation_submitted` for a caught bot.
- [x] `npm run build` (production) compiles clean; `npm run typecheck` clean.
- [x] Lighthouse (desktop preset) against the production build on localhost:
      Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 0.7s, CLS 0. Local/
      unthrottled — treat as a ceiling, not a guarantee of real-world Vercel/CDN numbers.
- [x] GA4 script + `google-site-verification` meta tag confirmed present in rendered HTML when
      `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GSC_VERIFICATION` are set, and confirmed
      absent when unset.
- [x] `sitemap.xml` lists exactly the 9 public pages (no API routes); `robots.txt` disallows
      `/api/` and references the sitemap; `/this-page-does-not-exist` returns a real 404;
      Organization + FAQPage JSON-LD both present on the homepage.
- [x] Visual mobile QA via Playwright/Chromium at 375/390/430/768/1440px across every primary
      page and all 7 consultation funnel steps (progress indicator, option cards, ZIP/email/
      phone keyboard hints, validation states, back-button state preservation, honeypot
      field's off-screen positioning) — no horizontal scroll, no console errors at any
      viewport/page.
- [x] **Found and fixed a real contrast bug** (not mobile-specific — present at every
      viewport): `CTASection`'s dark variant heading had no explicit text color, so it
      inherited the global `h2 { color: text-charcoal }` base style instead of white,
      rendering the headline invisible against the charcoal background. Affected the
      mid-page CTA on `/`, and the closing CTA on `/luxury-remodeling-houston`,
      `/how-it-works`, and `/houston`. Fixed in `src/components/shared/CTASection.tsx`.
- [x] **Found and fixed a UX bug**: advancing/going back through funnel steps, or landing on
      the confirmation screen, didn't reset scroll position — a user who'd scrolled down
      while filling a long step (e.g. the vision textarea) could land on the confirmation
      screen looking at the footer, with the actual "Thank You" message above the fold.
      Fixed by scrolling the funnel container into view on every step/submission-state
      change (`src/components/consultation/ConsultationForm.tsx`).
- [x] Added the "About 2 minutes · 7 short steps" reassurance line above the progress
      indicator on step 1 of the consultation funnel.
- [x] Centralized the public contact email into `CONTACT_EMAIL` in `src/lib/constants.ts`;
      `/contact` now imports it instead of duplicating the literal string.

## Verified during Phase 1 build (automated, earlier session)

Using `next build` (production build) and a headless-Chromium (Playwright) smoke pass across
every page at desktop (1440px) and mobile (375–390px) viewports:

- [x] Production build compiles with zero TypeScript errors and zero build warnings
- [x] Every page returns HTTP 200 (desktop + mobile): `/`, `/luxury-remodeling-houston`,
      `/houston`, `/how-it-works`, `/consultation`, `/privacy`, `/terms`, `/contact`,
      `/matching-service-disclosure`
- [x] `/this-page-does-not-exist` returns HTTP 404 and renders the custom 404 page
- [x] Zero browser console errors on any page (other than the expected 404 resource log)
- [x] Zero failed network requests on any page
- [x] No horizontal scroll at 375px on any page
- [x] All images eventually load (see note below on a false-positive during testing)
- [x] Full 7-step consultation funnel walked end-to-end via scripted interaction:
      project type → ZIP → budget → timeline → design status → vision → contact → submit
- [x] Back-navigation from step 5→4 and step 4→3 confirmed to retain the previously selected
      value (re-rendered with the correct option still marked selected)
- [x] ZIP step client-side validation confirmed (Continue disabled until 5 digits entered)
- [x] Contact step validation confirmed (name/email/phone/consent all required before submit
      is enabled)
- [x] `POST /api/leads` exercised live against local SQLite (no external credentials needed)
      — successful submissions store a row and return `201`; a forced DB failure returns
      `500` with a user-facing error message, and the UI displays that error inline without
      losing any of the homeowner's entered data (they can retry without re-entering the
      whole funnel)
- [x] UTM parameters (`utm_source=google&utm_medium=cpc&utm_campaign=test`) attached to the
      `/consultation` URL were confirmed to be captured and included in the submitted payload
- [x] `npm audit`: reduced from 5 vulnerabilities (1 critical, 4 high) on the initially
      scaffolded dependency versions to 2 (1 moderate, 1 high, both inside Next.js's own
      bundled build-time `postcss`, not runtime-reachable) by pinning `next@15.5.25`
      (patched) and React 19

**Testing note:** during the first smoke pass, several below-the-fold gallery images
intermittently reported as "not loaded" in a scripted check that ran immediately after page
load. Investigating directly (server logs showed no errors; the same URLs returned instantly
on a follow-up request) confirmed this is standard Next.js **dev-server** cold-cache latency
the first time a given image size is transformed — not a broken asset. All images render
successfully in production builds and on any subsequent request. `deviceSizes` was still
tightened in `next.config.mjs` as a genuine improvement (the initial config allowed
unnecessarily large 2048–3840px transforms for images that never render wider than ~700px).

## Requires manual verification before launch (no live credentials in this environment)

- [ ] GA4: once a real `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, confirm all events in
      `docs/ANALYTICS_EVENTS.md` appear in GA4 DebugView (script/meta-tag presence is already
      verified above — this step confirms the *real* property receives them)
- [ ] Google Search Console: verify ownership via `NEXT_PUBLIC_GSC_VERIFICATION` once a
      property is created for the live domain (meta-tag rendering is already verified above)
- [ ] Confirm the `hello@houstonluxuryremodeling.com` inbox exists, is monitored, and can
      receive mail — the code is correct and centralized, but mailbox existence can't be
      verified from this repo
- [ ] Cross-browser pass on Safari/iOS (this round's testing was Chromium-only)
- [ ] Real screen reader pass (VoiceOver/NVDA) through the consultation funnel
- [ ] Lighthouse / PageSpeed Insights run against the *deployed* (not local) production
      build, since real-world Core Web Vitals depend on the host's edge network and CDN
      caching — the local production-build run above (100/100/100/100) is a ceiling, not a
      guarantee
- [ ] If deploying somewhere with an ephemeral filesystem, confirm `SQLITE_DB_PATH` points at
      a persistent volume before relying on it for real leads
