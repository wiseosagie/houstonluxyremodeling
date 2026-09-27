#!/usr/bin/env node
// Read-only SEO smoke check for a deployed (or locally started) build.
//
//   node scripts/verify-production-seo.mjs                      # production
//   node scripts/verify-production-seo.mjs http://localhost:3000 # local `next start`
//
// Fetches robots.txt and sitemap.xml from ORIGIN, then every sitemap URL (by
// path, against ORIGIN), and checks canonical / og:url / robots against the
// preferred production origin. Only issues GET/HEAD requests; submits nothing
// anywhere. Exits 1 on any critical failure.

const PREFERRED_ORIGIN = "https://houstonluxuryremodeling.com";
const origin = (process.argv[2] || PREFERRED_ORIGIN).replace(/\/+$/, "");
const canonicalOrigin = (process.argv[3] || PREFERRED_ORIGIN).replace(/\/+$/, "");
const UA = "Mozilla/5.0 (compatible; SEO-verify/1.0; +https://houstonluxuryremodeling.com)";

const critical = [];
const warnings = [];

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[2] ?? m[3]) : null;
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map((m) => m[0]);
}

// Compare URLs structurally so "https://x.com" and "https://x.com/" (the same
// root resource) are equal, while a stray trailing slash on a subpath is not.
function sameUrl(a, b) {
  try {
    return new URL(a).href === new URL(b).href;
  } catch {
    return false;
  }
}

async function get(url, { redirect = "follow" } = {}) {
  const started = Date.now();
  const res = await fetch(url, { redirect, headers: { "user-agent": UA } });
  const body = redirect === "manual" ? "" : await res.text();
  return { res, body, ms: Date.now() - started };
}

function checkPage(expectedUrl, fetchedUrl, res, html) {
  const row = { url: expectedUrl, status: res.status, problems: [] };
  const fail = (msg) => { row.problems.push(msg); critical.push(`${expectedUrl}: ${msg}`); };
  const warn = (msg) => { row.problems.push(`(warn) ${msg}`); warnings.push(`${expectedUrl}: ${msg}`); };

  if (res.status !== 200) fail(`HTTP ${res.status}`);
  if (res.redirected || !sameUrl(res.url, fetchedUrl)) fail(`redirected to ${res.url}`);

  const xRobots = res.headers.get("x-robots-tag");
  if (xRobots && /noindex/i.test(xRobots)) fail(`X-Robots-Tag: ${xRobots}`);

  const head = html.split(/<\/head>/i)[0];
  const metas = tags(head, "meta");
  const robots = metas.filter((m) => /name\s*=\s*["'](robots|googlebot)["']/i.test(m)).map((m) => attr(m, "content") || "");
  if (robots.some((r) => /noindex/i.test(r))) fail(`meta robots: ${robots.join(" | ")}`);

  const canonicals = tags(head, "link").filter((l) => /rel\s*=\s*["']canonical["']/i.test(l)).map((l) => attr(l, "href"));
  row.canonical = canonicals[0] ?? null;
  if (canonicals.length === 0) fail("missing canonical");
  else if (canonicals.length > 1) fail(`${canonicals.length} canonical tags`);
  else {
    let host = null;
    try { host = new URL(row.canonical).origin; } catch { fail(`unparseable canonical ${row.canonical}`); }
    if (host && host !== canonicalOrigin) fail(`canonical on wrong host: ${row.canonical}`);
    if (host && !sameUrl(row.canonical, expectedUrl)) fail(`canonical ${row.canonical} != sitemap URL`);
  }

  const ogUrl = metas.find((m) => /property\s*=\s*["']og:url["']/i.test(m));
  row.ogUrl = ogUrl ? attr(ogUrl, "content") : null;
  if (!row.ogUrl) warn("missing og:url");
  else if (row.canonical && !sameUrl(row.ogUrl, row.canonical)) fail(`og:url ${row.ogUrl} != canonical`);

  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  row.title = title ? decode(title[1]).trim() : null;
  if (!row.title) warn("missing <title>");

  const body = html.slice(head.length).replace(/<script[\s\S]*?<\/script>/gi, "");
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")).trim());
  row.h1 = h1s[0] ?? null;
  if (h1s.length === 0) warn("missing <h1>");
  else if (h1s.length > 1) warn(`${h1s.length} <h1> elements`);

  return row;
}

async function main() {
  console.log(`Origin checked:     ${origin}`);
  console.log(`Expected canonical: ${canonicalOrigin}\n`);

  // Homepage
  const home = await get(`${origin}/`);
  if (home.res.status !== 200) critical.push(`homepage: HTTP ${home.res.status}`);

  // robots.txt
  const robots = await get(`${origin}/robots.txt`);
  if (robots.res.status !== 200) critical.push(`robots.txt: HTTP ${robots.res.status}`);
  else {
    const lines = robots.body.split(/\r?\n/).map((l) => l.trim());
    if (lines.some((l) => /^disallow:\s*\/\s*$/i.test(l))) critical.push("robots.txt: contains 'Disallow: /'");
    const sitemapLines = lines.filter((l) => /^sitemap:/i.test(l)).map((l) => l.replace(/^sitemap:\s*/i, ""));
    if (!sitemapLines.some((s) => sameUrl(s, `${canonicalOrigin}/sitemap.xml`)))
      critical.push(`robots.txt: no 'Sitemap: ${canonicalOrigin}/sitemap.xml' (found: ${sitemapLines.join(", ") || "none"})`);
    console.log(`robots.txt   ${robots.res.status}  sitemap line: ${sitemapLines.join(", ") || "none"}`);
  }

  // sitemap.xml
  const sitemap = await get(`${origin}/sitemap.xml`);
  if (sitemap.res.status !== 200) {
    critical.push(`sitemap.xml: HTTP ${sitemap.res.status}`);
    return report([]);
  }
  const locs = [...sitemap.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => decode(m[1]));
  const dupes = locs.filter((u, i) => locs.indexOf(u) !== i);
  if (dupes.length) critical.push(`sitemap.xml: duplicate URLs ${[...new Set(dupes)].join(", ")}`);
  for (const loc of locs) {
    const u = new URL(loc);
    if (u.origin !== canonicalOrigin) critical.push(`sitemap.xml: ${loc} is not on ${canonicalOrigin}`);
    if (u.pathname.startsWith("/api/")) critical.push(`sitemap.xml: API URL listed ${loc}`);
  }
  console.log(`sitemap.xml  ${sitemap.res.status}  ${locs.length} URLs\n`);

  // Each sitemap URL, fetched by path against the origin under test.
  const rows = [];
  for (const loc of locs) {
    const u = new URL(loc);
    const fetchUrl = `${origin}${u.pathname}${u.search}`;
    try {
      const { res, body } = await get(fetchUrl);
      rows.push(checkPage(loc, fetchUrl, res, body));
    } catch (err) {
      critical.push(`${loc}: fetch failed (${err.message})`);
      rows.push({ url: loc, status: "ERR", problems: [err.message] });
    }
  }

  // Duplicate-host check (informational): only meaningful against production.
  if (origin === PREFERRED_ORIGIN) {
    const apex = new URL(PREFERRED_ORIGIN);
    for (const path of ["/", "/houston", "/guides"]) {
      const www = `${apex.protocol}//www.${apex.host}${path}`;
      try {
        const { res } = await get(www, { redirect: "manual" });
        const loc = res.headers.get("location");
        const target = loc ? new URL(loc, www).href : null;
        if (res.status >= 300 && res.status < 400 && target && sameUrl(target, `${PREFERRED_ORIGIN}${path}`)) {
          console.log(`www check    ${path.padEnd(9)} ${res.status} -> ${target}  OK`);
        } else {
          warnings.push(`www${path}: expected permanent redirect to apex, got ${res.status}${target ? ` -> ${target}` : ""}`);
          console.log(`www check    ${path.padEnd(9)} ${res.status}${target ? ` -> ${target}` : " (no redirect)"}  WARN`);
        }
      } catch (err) {
        warnings.push(`www${path}: ${err.message}`);
      }
    }
    console.log("");
  }

  report(rows);
}

function report(rows) {
  for (const r of rows) {
    const path = new URL(r.url).pathname;
    const flag = r.problems.some((p) => !p.startsWith("(warn)")) ? "FAIL" : r.problems.length ? "WARN" : "OK  ";
    console.log(`${flag} ${String(r.status).padEnd(4)} ${path}${r.problems.length ? `  — ${r.problems.join("; ")}` : ""}`);
  }
  console.log(`\nPages checked: ${rows.length}   Critical: ${critical.length}   Warnings: ${warnings.length}`);
  if (critical.length) {
    console.log("\nCRITICAL:");
    for (const c of critical) console.log(`  - ${c}`);
  }
  if (warnings.length) {
    console.log("\nWARNINGS:");
    for (const w of warnings) console.log(`  - ${w}`);
  }
  process.exitCode = critical.length ? 1 : 0;
}

main().catch((err) => {
  console.error(`verify-production-seo: ${err.stack || err}`);
  process.exitCode = 1;
});
