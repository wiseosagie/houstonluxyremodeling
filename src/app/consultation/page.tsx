import type { Metadata } from "next";
import Link from "next/link";
import ConsultationForm from "@/components/consultation/ConsultationForm";
import ProcessSteps from "@/components/shared/ProcessSteps";
import { OPEN_GRAPH_DEFAULTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Request a Private Consultation",
  description:
    "Tell us about your Houston renovation project — private, complimentary, and no obligation.",
  alternates: { canonical: "/consultation" },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/consultation" },
  robots: { index: true, follow: true },
};

export default function ConsultationPage() {
  return (
    <>
      <section className="min-h-[80vh] bg-warmwhite">
        <div className="container-page py-14 md:py-20 max-w-2xl mx-auto">
          <ConsultationForm />
        </div>
      </section>

      <section className="py-14 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">After You Submit</p>
            <h2 className="text-2xl md:text-3xl">What Happens Next</h2>
          </div>
          <div className="mt-10">
            <ProcessSteps compact />
          </div>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-charcoal-light">
            Houston Luxury Remodeling is a matching and referral service. We do not perform
            construction and do not employ contractors. See our{" "}
            <Link href="/matching-service-disclosure" className="underline hover:text-bronze-dark">
              Matching Service Disclosure
            </Link>{" "}
            for details.
          </p>
        </div>
      </section>
    </>
  );
}
