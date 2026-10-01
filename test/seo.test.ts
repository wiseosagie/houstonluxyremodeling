// Source-level SEO checks: sitemap, robots, canonical origin, per-page
// metadata, and internal links. These run without a build. Rendered-HTML
// checks (JSON-LD parsing, final <title>/<h1>, real 404 status) are covered
// by scripts/verify-production-seo.mjs against a running `next start`.
//
// Run with: npm test

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const { default: sitemap } = await import("@/app/sitemap.ts");
const { default: robots } = await import("@/app/robots.ts");
const { SITE_URL, PRODUCTION_ORIGIN, resolveSiteUrl } = await import("@/lib/constants.ts");
const { INDEXABLE_ROUTES, SERVICE_PAGES } = await import("@/lib/routes.ts");

const APP_DIR = join(import.meta.dirname, "..", "src", "app");
const SRC_DIR = join(import.meta.dirname, "..", "src");

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function pageFileFor(route: string): string {
  return join(APP_DIR, ...route.split("/").filter(Boolean), "page.tsx");
}

// Route of every page.tsx under src/app (route groups and API excluded).
const pageRoutes = walk(APP_DIR)
  .filter((f) => f.endsWith(`${sep}page.tsx`))
  .map((f) => "/" + relative(APP_DIR, f).split(sep).slice(0, -1).join("/"));

test("canonical origin is the production apex", () => {
  assert.equal(PRODUCTION_ORIGIN, "https://houstonluxuryremodeling.com");
  assert.equal(SITE_URL, PRODUCTION_ORIGIN);
});

test("resolveSiteUrl rejects preview, insecure, and malformed origins", () => {
  for (const bad of [
    undefined,
    "",
    ".",
    "http://houstonluxuryremodeling.com",
    "https://www.houstonluxuryremodeling.com",
    "https://gray-tree-00f55e310.4.azurestaticapps.net",
    "http://localhost:3000",
    "https://127.0.0.1",
    "https://houstonluxuryremodeling.com/some/path",
  ]) {
    assert.equal(resolveSiteUrl(bad), PRODUCTION_ORIGIN, String(bad));
  }
  assert.equal(resolveSiteUrl("https://houstonluxuryremodeling.com/"), PRODUCTION_ORIGIN);
  assert.equal(resolveSiteUrl(" https://houstonluxuryremodeling.com "), PRODUCTION_ORIGIN);
});

test("sitemap lists exactly the indexable routes as absolute canonical URLs", () => {
  const urls = sitemap().map((entry) => entry.url);
  assert.equal(urls.length, INDEXABLE_ROUTES.length);
  assert.equal(new Set(urls).size, urls.length, "duplicate sitemap URLs");
  assert.ok(urls.includes(PRODUCTION_ORIGIN), "homepage missing");

  for (const url of urls) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, PRODUCTION_ORIGIN, url);
    assert.equal(parsed.search, "", `query string in ${url}`);
    assert.ok(!url.endsWith("/"), `trailing slash in ${url}`);
    assert.ok(!parsed.pathname.startsWith("/api"), `API route in sitemap: ${url}`);
  }
});

test("sitemap does not invent lastmod dates", () => {
  for (const entry of sitemap()) {
    assert.equal(entry.lastModified, undefined, entry.url);
  }
});

test("every indexable route has a page, and every page is indexable", () => {
  for (const route of INDEXABLE_ROUTES) {
    assert.ok(existsSync(pageFileFor(route)), `no page file for ${route}`);
  }
  for (const route of pageRoutes) {
    assert.ok(INDEXABLE_ROUTES.includes(route), `${route} has a page but is not in INDEXABLE_ROUTES`);
  }
});

test("robots.txt allows crawling, blocks only the API, and declares the sitemap", () => {
  const config = robots();
  const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
  assert.equal(config.sitemap, `${PRODUCTION_ORIGIN}/sitemap.xml`);

  const all = rules.find((r) => r.userAgent === "*");
  assert.ok(all, "no rule for *");
  assert.equal(all.allow, "/");
  const disallow = ([] as string[]).concat(all.disallow ?? []);
  assert.deepEqual(disallow, ["/api/"]);
  for (const path of disallow) {
    assert.ok(!path.startsWith("/_next"), "rendering assets must not be blocked");
  }
});

// H1s rendered by a component rather than the page file itself.
const COMPONENT_H1 = new Map([
  ["/", "components/home/Hero.tsx"],
  ["/consultation", "components/consultation/steps/StepSingleChoice.tsx"],
]);

test("every indexable page declares title, description, self-canonical, og:url, and an H1", () => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const route of INDEXABLE_ROUTES) {
    const source = readFileSync(pageFileFor(route), "utf8");
    const title = source.match(/^\s{2}title: "([^"]+)"/m)?.[1];
    const description = source.match(/^\s{2}description:\s*"([^"]+)"/m)?.[1];

    assert.ok(title, `${route}: missing title`);
    assert.ok(description, `${route}: missing description`);
    assert.ok(description.length >= 50, `${route}: description is too thin`);
    assert.ok(!titles.has(title), `${route}: title duplicates ${titles.get(title)}`);
    assert.ok(!descriptions.has(description), `${route}: description duplicates ${descriptions.get(description)}`);
    titles.set(title, route);
    descriptions.set(description, route);

    assert.ok(source.includes(`canonical: "${route}"`), `${route}: canonical is not self-referencing`);
    assert.ok(source.includes(`OPEN_GRAPH_DEFAULTS, url: "${route}"`), `${route}: og:url does not match canonical`);
    assert.ok(!/noindex|nofollow/.test(source), `${route}: contains noindex/nofollow`);

    const h1Source = COMPONENT_H1.has(route)
      ? readFileSync(join(SRC_DIR, COMPONENT_H1.get(route)!), "utf8")
      : source;
    assert.equal((h1Source.match(/<h1\b/g) ?? []).length, 1, `${route}: expected exactly one <h1>`);
  }
});

test("no source file forces noindex or points metadata at a non-production host", () => {
  for (const file of walk(SRC_DIR).filter((f) => /\.(ts|tsx)$/.test(f))) {
    const source = readFileSync(file, "utf8");
    assert.ok(!/index:\s*false|["']noindex["']/.test(source), `${file}: noindex`);
    assert.ok(!/https?:\/\/(localhost|127\.0\.0\.1|[\w-]+\.azurestaticapps\.net)/.test(source), `${file}: dev/preview URL`);
  }
});

test("internal links point at indexable routes", () => {
  const known = new Set(INDEXABLE_ROUTES);
  for (const file of walk(SRC_DIR).filter((f) => f.endsWith(".tsx") || f.endsWith("routes.ts") || f.endsWith("constants.ts"))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/href[=:]\s*\{?["'](\/[^"'#?]*)/g)) {
      assert.ok(known.has(match[1]), `${relative(SRC_DIR, file)} links to unknown route ${match[1]}`);
    }
  }
});

test("each service page links to the other service pages", () => {
  for (const service of SERVICE_PAGES) {
    const source = readFileSync(pageFileFor(service.href), "utf8");
    assert.ok(
      source.includes(`<RelatedServices current="${service.href}"`),
      `${service.href}: missing RelatedServices`,
    );
  }
});
