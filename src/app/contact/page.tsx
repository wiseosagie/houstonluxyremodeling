import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import PrimaryCta from "@/components/shared/PrimaryCta";
import PhoneLink from "@/components/shared/PhoneLink";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Houston Luxury Remodeling.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      <div className="container-page max-w-2xl py-12 md:py-20">
        <p className="eyebrow mb-4">Contact</p>
        <h1 className="text-4xl md:text-5xl mb-8">Get in Touch</h1>
        <p className="text-base leading-relaxed text-charcoal-light mb-8">
          If you're ready to discuss a specific renovation, the fastest path is our private
          consultation form — it takes just a few minutes and ensures your project reaches the
          right internal review.
        </p>
        <PrimaryCta href="/consultation" label="Request a Private Consultation" location="contact_page" />

        <div className="mt-14 border-t border-stone-200 pt-10">
          <h2 className="text-2xl font-serif mb-4">General Inquiries</h2>
          <p className="text-base text-charcoal-light">
            For press, partnership, or general questions unrelated to a specific renovation project:
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 inline-block text-lg text-bronze-dark hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          <div className="mt-2">
            <PhoneLink className="text-lg text-bronze-dark hover:underline" />
          </div>
        </div>
      </div>
    </>
  );
}
