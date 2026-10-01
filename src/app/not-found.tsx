import Link from "next/link";
import PrimaryCta from "@/components/shared/PrimaryCta";
import { SERVICES_HUB, SERVICE_PAGES } from "@/lib/routes";

const SECTION_LINKS = [
  { href: SERVICES_HUB.href, label: "All Services" },
  { href: "/houston", label: "Areas We Serve" },
  { href: "/guides", label: "Remodeling Guides" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
] as const;

export default function NotFound() {
  return (
    <div className="container-page py-24 md:py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="text-3xl md:text-5xl mb-6">This Page Could Not Be Found</h1>
      <p className="max-w-md mx-auto text-base leading-relaxed text-charcoal-light mb-10">
        The page you're looking for may have moved. Explore our services or begin a private
        consultation.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <PrimaryCta href="/" label="Return to Homepage" location="404_page" />
        <Link href="/consultation" className="btn-secondary">
          Request a Consultation
        </Link>
      </div>

      <nav aria-label="Site sections" className="mt-16 w-full max-w-3xl">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
          {[...SECTION_LINKS, ...SERVICE_PAGES.map((s) => ({ href: s.href, label: s.name }))].map(
            (link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-charcoal-light underline hover:text-bronze-dark">
                  {link.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );
}
