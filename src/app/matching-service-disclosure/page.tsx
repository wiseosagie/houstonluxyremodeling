import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Matching Service Disclosure",
  description:
    "Houston Luxury Remodeling operates as a homeowner-to-professional matching and referral service. Read what that means before you submit a project.",
  alternates: { canonical: "/matching-service-disclosure" },
};

export default function MatchingServiceDisclosurePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Matching Service Disclosure", href: "/matching-service-disclosure" }]} />
      <article className="container-page max-w-3xl py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl mb-8">Matching Service Disclosure</h1>
        <p className="text-sm text-charcoal-light mb-10">Last updated: September 2026</p>

        <div className="space-y-8 text-base leading-relaxed text-charcoal-light">
          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">What Houston Luxury Remodeling Is</h2>
            <p>
              Houston Luxury Remodeling ("HLR," "we," "us") operates a website and referral
              process that connects Houston homeowners considering significant residential
              renovations with independent remodeling and design-build professionals
              ("participating professionals"). HLR is a matching and referral service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">What Houston Luxury Remodeling Is Not</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>HLR does not perform construction, design, or remodeling work of any kind.</li>
              <li>HLR does not employ contractors, designers, architects, or tradespeople.</li>
              <li>HLR does not hold, and does not claim to hold, any construction or contracting license.</li>
              <li>
                HLR is not a party to any contract, proposal, or agreement between a homeowner
                and a participating professional.
              </li>
              <li>
                Photography shown on this site is licensed editorial/stock imagery used for
                inspiration and is not a portfolio of work completed by HLR or by any specific
                participating professional unless explicitly labeled otherwise.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">How Matching Works</h2>
            <p>
              When you submit a consultation request, we review the information you provide —
              project type, location, investment range, timeline, and design status — to
              understand your renovation. If we believe your project is an appropriate fit, we may
              introduce you to one or more participating professionals. Submitting a request does
              not guarantee an introduction, and receiving an introduction does not guarantee that
              the professional will accept, bid on, or complete your project.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">No Endorsement or Warranty</h2>
            <p>
              HLR does not warrant or guarantee the work, licensing, insurance, pricing, timeline,
              or conduct of any participating professional. Any agreement you reach with a
              professional is solely between you and that professional. We encourage every
              homeowner to independently verify licensing, insurance, references, and contract
              terms before engaging any professional, regardless of how the introduction was made.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">How Your Information Is Shared</h2>
            <p>
              With your consent, information you submit through the consultation form may be
              shared with a relevant participating professional for the purpose of discussing your
              project. See our{" "}
              <a href="/privacy" className="underline hover:text-bronze-dark">
                Privacy Policy
              </a>{" "}
              for full detail on how your information is collected, used, and shared.
            </p>
          </section>

          <p className="text-sm italic border-t border-stone-200 pt-6">
            This page is provided for transparency and does not constitute legal advice. Attorney
            review is recommended before this page is relied upon as a binding disclosure — see
            the README for details.
          </p>
        </div>
      </article>
    </>
  );
}
