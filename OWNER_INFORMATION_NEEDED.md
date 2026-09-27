# Owner Information Needed

We need these facts from the business owner before we can make certain site changes.

**Nothing on this list has been invented.** Where information was missing, we either left the element out (phone) or did not build the page (About). Supply only information that is true and verifiable.

---

## 1. About page (not created)

**Why it wasn't created:** The repository holds enough truthful material to describe *what the service does*:
- it is a matching and referral service
- it does not perform construction
- it has a three-step review process
- it focuses on River Oaks, Memorial, Tanglewood, West University and Afton Oaks
- it concentrates on project types of $100,000 and above

That material already appears on `/how-it-works`, `/matching-service-disclosure`, `/houston` and the homepage FAQ. An About page built only from it would repeat those pages. It would not add the thing the SEO audit identified as missing: **who operates the service**.

**Useful information, all optional. Provide only what is true and you are comfortable publishing:**

| Item | Why it helps |
|---|---|
| Legal business name and entity type (e.g. "Houston Luxury Remodeling is a service of Example LLC") | Identifies the operator; supports Organization schema `legalName` |
| Name(s) and role(s) of the people who run the service, if they choose to be named | Real people behind a referral service are a key trust signal |
| Their relevant background (for example prior work in real estate, design or construction) | Explains why homeowners should trust the introductions |
| When the service started operating | Only if accurate; "launched in 2026" is fine |
| How participating professionals are selected: the criteria actually used (license or insurance checks, references, portfolio review, etc.) | Currently described only generally ("experienced, independent professionals") |
| Whether and how the service is paid (by professionals, by referral fee, etc.) | Transparency. `/matching-service-disclosure` may need the same detail. |
| Mailing address, if one exists and can be published | Only if it is a real business address |
| Houston connection (e.g. operator lives or works in Houston) | Only if true |

After you provide this, an About page can be added at `/about`, linked from the footer "Company" column, and added to `src/app/sitemap.ts`.

---

## 2. Business phone

**Current state:** The GitHub repository variable `NEXT_PUBLIC_CONTACT_PHONE` resolves to `"."` in production. Because of that, every page showed a footer link reading "." with an empty `tel:` target, and the Organization JSON-LD had `"telephone": "."`.

**What the code now does:** It ignores any value with fewer than 10 digits. The phone link and the JSON-LD `contactPoint` are omitted until a real number is set.

**Needed:** A real, monitored phone number, or confirmation that the site should not show one.
- **Have a number:** set `NEXT_PUBLIC_CONTACT_PHONE` to it (for example `(713) 555-xxxx` format).
- **No number:** delete the variable.

---

## 3. Public contact email

| | |
|---|---|
| **Where it's displayed** | `src/app/contact/page.tsx:46-49` (the `mailto:` link), using `CONTACT_EMAIL` from `src/lib/constants.ts:10-11` |
| **Where the value comes from** | GitHub repository variable `NEXT_PUBLIC_CONTACT_EMAIL`, passed to the build at `.github/workflows/azure-static-web-apps-gray-tree-00f55e310.yml:30` |
| **Current production value (observed on the live site)** | `hello@wizzytechnologies.com`, a domain unrelated to the brand |
| **Value the repository says is intended** | `hello@houstonluxuryremodeling.com`: the code fallback (`src/lib/constants.ts:11`), `.env.local`, `README.md:78` and `README.md:221` |

`docs/TESTING_CHECKLIST.md:53` notes that the `hello@houstonluxuryremodeling.com` inbox has **not yet been confirmed to exist**, so we did not change anything in code.

**Needed:** Confirm that `hello@houstonluxuryremodeling.com` (or another brand-domain address) exists and receives mail. Then either:
- set the GitHub variable `NEXT_PUBLIC_CONTACT_EMAIL` to it, or
- delete the variable so the code fallback `hello@houstonluxuryremodeling.com` is used.

---

## 4. Search Console verification token

**Current state:** The GitHub repository variable `NEXT_PUBLIC_GSC_VERIFICATION` resolves to `"."`, and production outputs `<meta name="google-site-verification" content=".">`.

**What the code now does:** It omits the tag when the value is blank, shorter than 10 characters, has no letters or digits (e.g. `"."`), or contains whitespace (e.g. a pasted full `<meta>` tag).

**Needed:** One of the following.
- **Verifying by HTML tag:** copy only the `content="…"` value from Search Console → Settings → Ownership verification → HTML tag, and set it as `NEXT_PUBLIC_GSC_VERIFICATION`.
- **Verified another way** (DNS, Google Analytics, or a Domain property, which is recommended): delete the variable.

---

## 5. Optional, if available: real project photography

The site uses only Unsplash stock images. If participating professionals provide photographs of completed Houston projects **that you have the rights to publish**, they would make the service and neighborhood pages more credible. Do not use images of projects not connected to the service.
