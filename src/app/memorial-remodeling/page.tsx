import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import ImageTextSection from "@/components/shared/ImageTextSection";
import PageFAQ from "@/components/shared/PageFAQ";
import { IMAGES } from "@/data/images";
import { OPEN_GRAPH_DEFAULTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Memorial Remodeling | Home Renovation Planning in Memorial",
  description:
    "Planning a renovation in Memorial Houston — wooded lots, home vintages, flood plain considerations, and what to know before hiring a remodeling professional.",
  alternates: { canonical: "/memorial-remodeling" },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/memorial-remodeling" },
};

const FAQS = [
  {
    question: "Is Memorial part of the City of Houston, or a separate municipality?",
    answer:
      "It depends on the specific area. Much of Memorial along and near Memorial Drive is unincorporated Harris County or part of the City of Houston, while several of the Memorial Villages — including Piney Point Village, Bunker Hill Village, and Hedwig Village — are separately incorporated municipalities with their own permitting departments. Confirming which jurisdiction a specific property falls under is one of the first steps in planning a renovation there.",
  },
  {
    question: "Should flood risk factor into renovation planning in Memorial?",
    answer:
      "For many properties, yes. Parts of Memorial sit near Buffalo Bayou and the Addicks and Barker reservoirs, and flood risk in portions of the area became widely documented after Hurricane Harvey. Checking a property's current FEMA flood zone status and discussing elevation and drainage with your professional early is worth doing before finalizing a renovation or addition's design.",
  },
  {
    question: "Why are so many Memorial homes being renovated rather than replaced?",
    answer:
      "Memorial's large, wooded lots and mature tree canopy are difficult to replicate, which gives many existing homes real value even when the structure itself is dated. A well-planned whole-home renovation or addition can update a 1960s–1990s home for contemporary living while preserving the lot's mature landscaping — an advantage a full teardown and rebuild can disrupt or lose.",
  },
] as const;

export default function MemorialRemodelingPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Houston", href: "/houston" },
          { label: "Memorial Remodeling", href: "/memorial-remodeling" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Memorial Remodeling</p>
          <h1 className="text-4xl md:text-5xl leading-tight">Home Renovation Planning in Memorial</h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            Memorial's wooded, private lots and architecturally diverse housing stock make it one
            of Houston's most frequent settings for whole-home renovations and significant
            additions. Its jurisdictional patchwork and proximity to Buffalo Bayou also make early
            planning more important here than in most Houston neighborhoods.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="memorial_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="character"
        eyebrow="Character & Housing Stock"
        title="Mature Lots and a Mix of Architectural Eras"
        imageUrl={IMAGES.livingTransitional.url}
        imageAlt={IMAGES.livingTransitional.alt}
      >
        <p>
          Memorial is known for spacious, heavily wooded lots and a genuinely diverse mix of
          architectural styles, with a large share of homes built between the 1960s and 1990s
          alongside newer construction. That vintage range is precisely why whole-home renovations
          are so common here: many homes have sound bones and desirable lots but interior layouts,
          kitchens, and mechanical systems that no longer match how families want to live.
        </p>
        <p>
          The tree canopy that defines Memorial is also a genuine planning constraint — additions
          and outdoor living projects need to account for root zones and canopy protection, which
          can shape where new construction is feasible on a given lot.
        </p>
      </ImageTextSection>

      <ImageTextSection
        id="jurisdiction-flood"
        eyebrow="Planning Considerations"
        title="Jurisdiction and Flood Plain Awareness"
        imageUrl={IMAGES.indoorOutdoorLiving.url}
        imageAlt={IMAGES.indoorOutdoorLiving.alt}
        imageSide="left"
      >
        <p>
          "Memorial" covers a mix of jurisdictions. Some areas fall under the City of Houston or
          unincorporated Harris County, while several Memorial Villages are their own incorporated
          cities with independent permitting departments and, in some cases, different building
          requirements. Confirming which authority governs a specific address is a necessary first
          step, not a formality.
        </p>
        <p>
          Because parts of Memorial sit near Buffalo Bayou and the Addicks and Barker reservoirs,
          flood plain status is worth checking against current FEMA maps for any property under
          consideration, particularly before finalizing an addition's footprint or a renovation
          that changes finished floor elevation. A qualified professional or civil engineer can
          confirm what applies to your specific address.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Common Project Types</p>
          <h2 className="text-3xl md:text-4xl mb-8">What Homeowners in Memorial Typically Renovate</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              Given the age of much of Memorial's housing stock,{" "}
              <a href="/whole-home-remodeling-houston" className="underline hover:text-bronze-dark">
                whole-home renovations
              </a>{" "}
              that address layout, electrical capacity, and mechanical systems together are common,
              often paired with a{" "}
              <a href="/home-additions-houston" className="underline hover:text-bronze-dark">
                home addition
              </a>{" "}
              to add space that older floor plans don't provide.
            </p>
            <p>
              Memorial's large lots also lend themselves well to{" "}
              <a href="/luxury-outdoor-living-houston" className="underline hover:text-bronze-dark">
                outdoor living projects
              </a>{" "}
              that take advantage of mature trees and privacy from neighboring properties.
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CTASection
        title="Planning a Renovation in Memorial?"
        description="Tell us about your home and project and we'll help determine the right next step."
        location="memorial_final_cta"
      />
    </>
  );
}
