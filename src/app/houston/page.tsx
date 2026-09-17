import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import { NEIGHBORHOODS } from "@/lib/constants";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "Houston Areas We Serve | River Oaks, Memorial, Tanglewood, West University",
  description:
    "Houston Luxury Remodeling currently focuses on River Oaks, Memorial, Tanglewood, and West University — neighborhoods where significant home renovations are common.",
  alternates: { canonical: "/houston" },
};

// Phase 2 note: each neighborhood below is intentionally structured as a
// single, addressable section (id + full NEIGHBORHOODS record in
// src/lib/constants.ts) so it can be promoted to its own route at
// /houston/[slug]/page.tsx without changing the underlying data model.
const NEIGHBORHOOD_IMAGES = [
  IMAGES.livingTransitional,
  IMAGES.exteriorEntrance,
  IMAGES.livingFormal,
  IMAGES.wholeHomeDining,
];

export default function HoustonAreasPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Houston", href: "/houston" }]} />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Areas We Serve</p>
          <h1 className="text-4xl md:text-5xl leading-tight">Houston Neighborhoods</h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            We're focused initially on the Houston neighborhoods where significant renovation
            projects are most common. This list will grow as the service expands.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-charcoal-light">
            Planning a project in one of these areas? See our{" "}
            <a href="/luxury-remodeling-houston" className="underline hover:text-bronze-dark">
              guide to luxury remodeling in Houston
            </a>{" "}
            for project types, budget considerations, and how to choose a professional.
          </p>
        </div>
      </header>

      {NEIGHBORHOODS.map((neighborhood, i) => (
        <section
          key={neighborhood.slug}
          id={neighborhood.slug}
          className="py-16 md:py-20 border-t border-stone-200 scroll-mt-24"
        >
          <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <h2 className="text-3xl md:text-4xl mb-5">{neighborhood.name}</h2>
              <p className="text-base leading-relaxed text-charcoal-light">
                {neighborhood.description}
              </p>
              <p className="mt-5 text-xs uppercase tracking-widest2 text-bronze-dark">
                Serving ZIP codes {neighborhood.zipPrefixes.join(", ")}
              </p>
            </div>
            <div
              className={`relative aspect-[4/5] lg:aspect-[3/4] ${
                i % 2 === 1 ? "lg:order-1" : ""
              }`}
            >
              <Image
                src={NEIGHBORHOOD_IMAGES[i].url}
                alt={NEIGHBORHOOD_IMAGES[i].alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      ))}

      <CTASection
        title="Planning a Renovation in One of These Areas?"
        description="Tell us about your project and we'll help determine the right next step."
        location="houston_page_final_cta"
      />
    </>
  );
}
