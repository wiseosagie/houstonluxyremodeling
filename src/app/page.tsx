import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import AreasServed from "@/components/home/AreasServed";
import ProcessSteps from "@/components/shared/ProcessSteps";
import TrustSection from "@/components/shared/TrustSection";
import InspirationGallery from "@/components/shared/InspirationGallery";
import CTASection from "@/components/shared/CTASection";
import FAQ from "@/components/shared/FAQ";
import PrimaryCta from "@/components/shared/PrimaryCta";

export const metadata: Metadata = {
  title: "Private Renovation Consultation for Houston Homes",
  description:
    "Houston Luxury Remodeling connects homeowners planning $100,000+ residential renovations with experienced Houston remodeling and design-build professionals. Private, complimentary, no obligation.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <CategoryGrid />

      <section className="py-20 md:py-28 bg-stone-50">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">How It Works</p>
            <h2 className="text-3xl md:text-4xl">A Simple, Considered Process</h2>
          </div>
          <div className="mt-14">
            <ProcessSteps />
          </div>
          <div className="mt-12">
            <PrimaryCta href="/how-it-works" label="Learn More About the Process" variant="ghost" location="homepage_how_it_works" />
          </div>
        </div>
      </section>

      <AreasServed />

      <TrustSection />

      <InspirationGallery />

      <CTASection
        title="Begin With a Private Conversation About Your Project"
        description="A short set of questions helps us understand your renovation before any introduction is made."
        location="homepage_mid_cta"
      />

      <FAQ />

      <CTASection
        eyebrow="Ready When You Are"
        title="Find the Right Remodeling Partner for Your Home"
        ctaLabel="Find My Remodeling Partner"
        location="homepage_final_cta"
        dark={false}
      />
    </>
  );
}
