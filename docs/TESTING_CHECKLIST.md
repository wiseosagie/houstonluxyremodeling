# Testing Checklist

This file lists only what has actually been executed against the current codebase, and when.
Earlier versions of this document claimed Lighthouse scores and a Playwright-based mobile QA
pass — neither `lighthouse` nor `playwright` is a dependency anywhere in this repository, so
those results could not be reproduced and were removed. Do not add a claim here unless it was
actually run and its output observed.

## Verified during the SQLite persistence fix (this session)

- [x] `npm test` (`node --test`) — 10/10 pass against `POST /api/leads` using an in-memory
      SQLite database (`SQLITE_DB_PATH=":memory:"`). Covers: a normal submission (stored, real
      ID returned), the honeypot filled (fake success, nothing stored, no details leaked), the
      timing heuristic (fake success, nothing stored), a genuinely invalid field (400, nothing
      stored), rate limiting (6th rapid request from one IP → 429; a different IP unaffected),
      submission succeeding with no Resend credentials configured, submission succeeding when
      a configured Resend call fails (simulated network error), full UTM attribution stored
      correctly on the row, and lead score/classification correct through the complete
      API → database path. See [`test/leads-api.test.ts`](../test/leads-api.test.ts).
- [x] `npx tsc --noEmit` — clean, no errors.
- [x] `npm run build` (production) — compiles clean, all 17 routes generated, `/api/leads`
      correctly identified as a dynamic route.
- [x] Live end-to-end test against a running `npm run dev` instance (not just the automated
      suite): submitted a real lead through `POST /api/leads` with full UTM parameters and no
      Resend credentials configured, then queried `data/app.db` directly with `node:sqlite`.
      Confirmed every field — lead ID, timestamps, neighborhood resolution, all 7 attribution
      fields, `lead_score` (70) and `lead_classification` (`PRIORITY`) matching the
      independently-calculated expected values, and `status = 'NEW'`.
- [x] Live test with honeypot filled and with a too-fast `formStartedAt`: both returned a
      normal-looking `201 { success: true, leadId: null }`, and the row count in `data/app.db`
      was confirmed unchanged before/after.
- [x] Live test with a real (invalid) `RESEND_API_KEY` configured against the actual Resend
      API: the request received a genuine `401` from Resend, the failure was logged
      (`resend_401`), and the lead was still stored and returned `201` with a real `leadId`.
- [x] Confirmed `data/app.db` was tracked in git with no `.gitignore` entry, and contained
      several rows from prior manual testing (a few with non-`example.com` email addresses).
      Untracked the file (`git rm --cached`) and added `/data/*.db*` to `.gitignore`. The file
      itself was left in place locally; git history still contains the old blob until/unless
      it is explicitly purged — see README/Owner Actions.

## Requires manual verification before launch (not run in this session)

- [ ] Submit a real test lead against the **deployed** Azure Static Web Apps URL and confirm
      it is actually persisted (query the deployed database or check server logs) — this
      session only verified the local dev server and the production **build**, not a live
      Azure deployment. See "Production deployment" in README.md.
- [ ] Confirm the Azure Static Web Apps plan/tier gives the app persistent, writable local
      disk across deploys/restarts (required for SQLite to hold leads reliably).
- [ ] GA4: once a real `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in production, confirm events
      appear in GA4 DebugView.
- [ ] Google Search Console: verify ownership via `NEXT_PUBLIC_GSC_VERIFICATION` once a
      property exists for the live domain.
- [ ] Confirm the `hello@houstonluxuryremodeling.com` inbox exists, is monitored, and can
      receive mail.
- [ ] Cross-browser pass (Safari/iOS) and a real screen-reader pass (VoiceOver/NVDA).
- [ ] Lighthouse / PageSpeed Insights against the deployed production build.
- [ ] Visual mobile QA at common breakpoints (375/390/430/768/1440px) across all primary pages
      and the full consultation funnel — no tooling for this is currently in the repository.
