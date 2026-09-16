import Link from "next/link";
import { SITE_URL } from "@/lib/constants";

type Crumb = { label: string; href: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="container-page pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap gap-2 text-xs text-charcoal-light">
        {trail.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden>/</span>}
            {index === trail.length - 1 ? (
              <span className="text-charcoal">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-bronze-dark">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
