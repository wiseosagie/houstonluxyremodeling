import Link from "next/link";
import { SERVICE_PAGES } from "@/lib/routes";

// Crawlable cross-links between service pages, plus the process, guides, and
// areas hubs, so each service page is reachable from every other one rather
// than only through the services hub.
export default function RelatedServices({ current }: { current: string }) {
  const others = SERVICE_PAGES.filter((s) => s.href !== current);

  return (
    <section className="py-16 md:py-20 border-t border-stone-200">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Related Projects</p>
          <h2 className="text-3xl md:text-4xl">Other Renovations Homeowners Plan</h2>
        </div>

        <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-stone-200 border border-stone-200">
          {others.map((service) => (
            <li key={service.href} className="bg-warmwhite">
              <Link
                href={service.href}
                className="group block h-full p-6 transition-colors duration-400 hover:bg-stone-50"
              >
                <span className="block font-serif text-lg group-hover:text-bronze-dark">
                  {service.name}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-charcoal-light">
                  {service.summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm leading-relaxed text-charcoal-light">
          See{" "}
          <Link href="/how-it-works" className="underline hover:text-bronze-dark">
            how the consultation process works
          </Link>
          , browse our{" "}
          <Link href="/guides" className="underline hover:text-bronze-dark">
            cost and planning guides
          </Link>
          , or view the{" "}
          <Link href="/houston" className="underline hover:text-bronze-dark">
            Houston neighborhoods we serve
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
