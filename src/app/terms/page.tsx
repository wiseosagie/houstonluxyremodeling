import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of the Houston Luxury Remodeling website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Terms of Use", href: "/terms" }]} />
      <article className="container-page max-w-3xl py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl mb-8">Terms of Use</h1>
        <p className="text-sm text-charcoal-light mb-10">Last updated: September 2026</p>

        <div className="space-y-8 text-base leading-relaxed text-charcoal-light">
          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">Acceptance of Terms</h2>
            <p>
              By using this website, you agree to these Terms of Use. If you do not agree, please
              do not use this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">Nature of the Service</h2>
            <p>
              Houston Luxury Remodeling is a matching and referral service. We do not perform
              construction, design, or remodeling services, and we do not employ contractors,
              designers, or architects. See our{" "}
              <a href="/matching-service-disclosure" className="underline hover:text-bronze-dark">
                Matching Service Disclosure
              </a>{" "}
              for full detail.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">No Guarantee of Introduction or Outcome</h2>
            <p>
              Submitting information through this website does not guarantee that you will be
              introduced to a professional, or that any professional you are introduced to will
              accept, bid on, or satisfactorily complete any project. Any engagement you enter into
              with a professional is solely between you and that professional, governed by whatever
              contract you agree to with them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">Accuracy of Information</h2>
            <p>
              You agree to provide accurate information when submitting a consultation request. We
              reserve the right to decline to act on any submission we believe to be inaccurate,
              incomplete, or submitted in bad faith.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">Intellectual Property</h2>
            <p>
              The content of this website, including text, graphics, and the Houston Luxury
              Remodeling name and wordmark, is the property of Houston Luxury Remodeling or its
              licensors and may not be reproduced without permission. Photography on this site is
              licensed stock/editorial imagery used for illustrative purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">Limitation of Liability</h2>
            <p>
              This website and the matching service are provided "as is." To the fullest extent
              permitted by law, Houston Luxury Remodeling disclaims liability for any damages
              arising from your use of this website, any introduction made through it, or any work
              performed by any professional, whether or not introduced through this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">Changes to These Terms</h2>
            <p>
              We may update these Terms of Use from time to time. Continued use of this website
              after changes are posted constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>

        <p className="text-sm italic border-t border-stone-200 pt-6 mt-8">
          These terms are provided for transparency and do not constitute legal advice. Attorney
          review is recommended before this page is relied upon as a binding agreement — see the
          README "Known Limitations" section for detail.
        </p>
      </article>
    </>
  );
}
