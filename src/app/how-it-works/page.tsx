import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "How It Works | A Private, Three-Step Process",
  description:
    "How Houston Luxury Remodeling works: tell us about your home, we review your project, and qualified projects may be introduced to a participating remodeling professional.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "How It Works", href: "/how-it-works" }]} />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">How It Works</p>
          <h1 className="text-4xl md:text-5xl leading-tight">A Simple, Considered Process</h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            We designed this process to respect both your time and the seriousness of your
            project. Three steps, each with a clear purpose.
          </p>
        </div>
      </header>

      <section id="step-1" className="py-16 border-t border-stone-200 scroll-mt-24">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="font-serif text-4xl text-bronze-dark">01</span>
            <h2 className="mt-4 text-3xl md:text-4xl">Tell Us About Your Home</h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-light">
              A short, private questionnaire asks about your project type, ZIP code, investment
              range, timeline, and where you are in the design process — whether you're starting
              from scratch or already have architectural plans completed.
            </p>
            <p className="mt-4 text-base leading-relaxed text-charcoal-light">
              This typically takes a few minutes and can be completed comfortably from a phone.
            </p>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-[3/4]">
            <Image
              src={IMAGES.wholeHomeDining.url}
              alt={IMAGES.wholeHomeDining.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="step-2" className="py-16 border-t border-stone-200 scroll-mt-24">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="lg:order-2">
            <span className="font-serif text-4xl text-bronze-dark">02</span>
            <h2 className="mt-4 text-3xl md:text-4xl">We Review Your Project</h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-light">
              Your submission is reviewed to understand the scope, location, budget, and timeline
              of your renovation, and to determine the type of remodeling or design-build
              professional best suited to it.
            </p>
            <p className="mt-4 text-base leading-relaxed text-charcoal-light">
              Not every project results in an introduction. We aim to make introductions only when
              we believe there's an appropriate fit.
            </p>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-[3/4] lg:order-1">
            <Image
              src={IMAGES.livingOpenPlan.url}
              alt={IMAGES.livingOpenPlan.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="step-3" className="py-16 border-t border-stone-200 scroll-mt-24">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="font-serif text-4xl text-bronze-dark">03</span>
            <h2 className="mt-4 text-3xl md:text-4xl">Meet Your Match</h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-light">
              Qualified projects may be introduced to an appropriate participating professional for
              further discussion. From there, the relationship — proposal, contract, and
              construction — is between you and that professional.
            </p>
            <div className="mt-6 border border-stone-300 bg-stone-50 p-6 text-sm leading-relaxed text-charcoal-light">
              <p>
                <strong className="text-charcoal">Please note:</strong> Houston Luxury Remodeling
                does not guarantee that every submission will result in a contractor introduction,
                and does not guarantee the performance, licensing, or availability of any
                professional. We encourage every homeowner to independently verify credentials,
                insurance, and references before hiring any professional. See our{" "}
                <a href="/matching-service-disclosure" className="underline hover:text-bronze-dark">
                  Matching Service Disclosure
                </a>
                .
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-[3/4]">
            <Image
              src={IMAGES.primarySuiteBedroom.url}
              alt={IMAGES.primarySuiteBedroom.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="container-page py-4">
        <PrimaryCta href="/consultation" label="Request a Private Consultation" location="how_it_works_inline" />
      </div>

      <CTASection
        title="Ready to Start the Conversation?"
        description="Private, complimentary, and no obligation."
        location="how_it_works_final_cta"
      />
    </>
  );
}
