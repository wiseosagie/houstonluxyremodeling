import Link from "next/link";
import Wordmark from "@/components/shared/Wordmark";
import PhoneLink from "@/components/shared/PhoneLink";
import { NEIGHBORHOODS, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-stone-200">
      <div className="container-page py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <Wordmark dark />
          <p className="mt-5 text-sm leading-relaxed text-stone-300 max-w-xs">
            A private matching service connecting Houston homeowners with experienced
            remodeling and design-build professionals.
          </p>
        </div>

        <div>
          <p className="eyebrow text-stone-400 mb-4">Explore</p>
          <ul className="space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-stone-400 mb-4">Areas We Serve</p>
          <ul className="space-y-3 text-sm">
            {NEIGHBORHOODS.map((n) => (
              <li key={n.slug}>
                <Link href={`/houston#${n.slug}`} className="hover:text-white">
                  {n.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-stone-400 mb-4">Company</p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/matching-service-disclosure" className="hover:text-white">
                Matching Service Disclosure
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms of Use
              </Link>
            </li>
          </ul>
          <PhoneLink className="mt-4 inline-block text-sm hover:text-white" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-stone-400">
          <p>
            © {new Date().getFullYear()} Houston Luxury Remodeling. All rights reserved.
          </p>
          <p className="max-w-2xl">
            Houston Luxury Remodeling is a matching and referral service. We do not perform
            construction and do not employ contractors. See our{" "}
            <Link href="/matching-service-disclosure" className="underline hover:text-white">
              Matching Service Disclosure
            </Link>{" "}
            for details.
          </p>
        </div>
      </div>
    </footer>
  );
}
