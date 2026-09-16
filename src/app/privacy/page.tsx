import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Houston Luxury Remodeling collects, uses, and shares information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy" }]} />
      <article className="container-page max-w-3xl py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl mb-8">Privacy Policy</h1>
        <p className="text-sm text-charcoal-light mb-10">Last updated: September 2026</p>

        <div className="space-y-8 text-base leading-relaxed text-charcoal-light">
          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">Information We Collect</h2>
            <p>When you submit a consultation request, we collect the information you provide, which may include:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Contact information: first name, last name, email address, phone number</li>
              <li>Property information: ZIP code and, where determinable, neighborhood</li>
              <li>Project information: project type, investment range, timeline, design status, and any project description you provide</li>
              <li>
                Technical and attribution information: pages visited, the page that referred you,
                and marketing campaign parameters (UTM source, medium, campaign, content, and term)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">How We Use Information</h2>
            <p>We use the information you provide to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Evaluate and respond to your consultation request</li>
              <li>Determine whether, and to which participating professional, an introduction may be appropriate</li>
              <li>Communicate with you about your project by phone, text, or email</li>
              <li>Understand how visitors use this website in aggregate, for the purpose of improving it</li>
              <li>Maintain the security of this website and prevent fraudulent or automated submissions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">How We Share Information</h2>
            <p>
              With your consent, we may share your project and contact information with a
              participating remodeling or design-build professional we believe may be an
              appropriate fit for your project. We do not sell your personal information to third
              parties. We may share information with service providers who help us operate this
              website (such as our database and email delivery providers), who are only permitted
              to use it to provide those services to us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">Analytics</h2>
            <p>
              We use Google Analytics to understand website usage. Google Analytics may use
              cookies or similar technologies to collect information about your visit. You can
              learn more about Google's practices at{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-bronze-dark"
              >
                policies.google.com/privacy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">Data Retention and Security</h2>
            <p>
              We retain consultation request information for as long as reasonably necessary to
              evaluate your project, facilitate an introduction, and maintain business records. We
              use reasonable administrative and technical safeguards, including access controls on
              our database, to protect the information you provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal mb-3">Your Choices</h2>
            <p>
              You may contact us at any time to ask what information we hold about you, to request
              corrections, or to request deletion, subject to legitimate business and legal
              recordkeeping needs. See our{" "}
              <a href="/contact" className="underline hover:text-bronze-dark">
                Contact
              </a>{" "}
              page.
            </p>
          </section>

          <p className="text-sm italic border-t border-stone-200 pt-6">
            This policy is provided for transparency and does not constitute legal advice. It has
            not yet been reviewed by an attorney and should be reviewed prior to launch — see the
            README "Known Limitations" section for detail, and update this policy if Texas or
            applicable state/federal privacy law requires additional disclosures.
          </p>
        </div>
      </article>
    </>
  );
}
