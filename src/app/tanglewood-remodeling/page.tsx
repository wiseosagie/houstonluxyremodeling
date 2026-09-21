import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import ImageTextSection from "@/components/shared/ImageTextSection";
import PageFAQ from "@/components/shared/PageFAQ";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "Tanglewood Remodeling | Home Renovation Planning Guide",
  description:
    "Planning a renovation in Tanglewood, Houston — mid-century housing stock, civic association guidelines, and what shapes a renovation on Tanglewood's wooded lots.",
  alternates: { canonical: "/tanglewood-remodeling" },
};

const FAQS = [
  {
    question: "Does Tanglewood have its own permitting process?",
    answer:
      "Tanglewood is within the City of Houston, so construction permits go through the standard City of Houston process. In addition, many Tanglewood properties are subject to deed restrictions administered by a neighborhood civic association, which can separately govern setbacks, height, and exterior changes — both should be checked before design is finalized.",
  },
  {
    question: "Why do so many Tanglewood renovations involve opening up the floor plan?",
    answer:
      "A large share of Tanglewood's original housing stock consists of Ranch-style and Tudor-style homes built with the more compartmentalized floor plans typical of their era. Removing or relocating interior walls to create open kitchen-to-living sightlines is one of the most common whole-home renovation goals in the neighborhood.",
  },
  {
    question: "Do mature trees affect renovation or addition planning in Tanglewood?",
    answer:
      "Often, yes. Tanglewood's tree canopy is one of the neighborhood's defining features, and additions or outdoor living projects need to plan around root protection zones for large, established oaks — which can influence where new construction is feasible on a given lot.",
  },
] as const;

export default function TanglewoodRemodelingPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Houston", href: "/houston" },
          { label: "Tanglewood Remodeling", href: "/tanglewood-remodeling" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Tanglewood Remodeling</p>
          <h1 className="text-4xl md:text-5xl leading-tight">Home Renovation Planning in Tanglewood</h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            Tanglewood's mid-century and transitional homes, set on large, tree-lined lots between
            the 610 Loop and Beltway 8, are frequently reimagined for contemporary family life —
            while preserving the wooded character that defines the neighborhood.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="tanglewood_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="character"
        eyebrow="Character & Housing Stock"
        title="A Wooded, Mid-Century Neighborhood"
        imageUrl={IMAGES.exteriorDaylight.url}
        imageAlt={IMAGES.exteriorDaylight.alt}
      >
        <p>
          Developed beginning in the 1930s, Tanglewood is built around large, mature-oak-lined
          lots — a defining feature that continues to draw homeowners today. Much of the original
          housing stock is Ranch-style and Tudor-style construction, and a significant share of
          those homes have either been substantially renovated or replaced entirely over the past
          two decades to suit contemporary family life.
        </p>
        <p>
          For homes that remain in their original form, whole-home renovations are common — most
          often to open up compartmentalized floor plans, update mechanical systems, and add
          amenities like wine storage, media rooms, and outdoor kitchens that weren't part of the
          original design.
        </p>
      </ImageTextSection>

      <ImageTextSection
        id="considerations"
        eyebrow="Planning Considerations"
        title="City Permitting and Civic Association Guidelines"
        imageUrl={IMAGES.livingFormal.url}
        imageAlt={IMAGES.livingFormal.alt}
        imageSide="left"
      >
        <p>
          Tanglewood sits within the City of Houston, so structural, electrical, plumbing, and
          addition work is permitted through the City's standard process. Many properties are also
          subject to deed restrictions administered through a neighborhood civic association,
          which homeowners navigate alongside — not instead of — city permitting.
        </p>
        <p>
          Because much of Tanglewood's character comes from its mature tree canopy, additions and
          larger outdoor living projects typically require early coordination around root
          protection zones, which can meaningfully affect where new construction is feasible on a
          given lot.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Common Project Types</p>
          <h2 className="text-3xl md:text-4xl mb-8">What Homeowners in Tanglewood Typically Renovate</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              <a href="/whole-home-remodeling-houston" className="underline hover:text-bronze-dark">
                Whole-home renovations
              </a>{" "}
              that open up original floor plans are among the most common projects in Tanglewood,
              frequently paired with a{" "}
              <a href="/luxury-kitchen-remodeling-houston" className="underline hover:text-bronze-dark">
                kitchen renovation
              </a>{" "}
              at the center of the new open layout.
            </p>
            <p>
              Given the neighborhood's mature, private lots,{" "}
              <a href="/luxury-outdoor-living-houston" className="underline hover:text-bronze-dark">
                outdoor living projects
              </a>{" "}
              — outdoor kitchens, covered patios, and pools — are also frequently planned as part
              of a broader renovation.
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CTASection
        title="Planning a Renovation in Tanglewood?"
        description="Tell us about your home and project and we'll help determine the right next step."
        location="tanglewood_final_cta"
      />
    </>
  );
}
