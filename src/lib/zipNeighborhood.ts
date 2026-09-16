import { NEIGHBORHOODS } from "./constants";

// Best-effort ZIP -> focus neighborhood lookup. This is a convenience for
// lead scoring and internal notes only — it intentionally is not a hard
// dependency for form submission (a ZIP outside these prefixes simply scores
// as "Other Houston area" and still submits normally).
export function neighborhoodFromZip(zip: string): { slug: string; name: string } | null {
  const trimmed = zip.trim();
  for (const neighborhood of NEIGHBORHOODS) {
    if (neighborhood.zipPrefixes.some((prefix) => trimmed.startsWith(prefix))) {
      return { slug: neighborhood.slug, name: neighborhood.name };
    }
  }
  return null;
}
