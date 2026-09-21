import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import ImageTextSection from "@/components/shared/ImageTextSection";
import PageFAQ from "@/components/shared/PageFAQ";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "West University Remodeling | Renovation Planning Guide",
  description:
    "Planning a renovation in West University Place — tight lots, tree protection rules, and how the city's own permitting process shapes a West U renovation or addition.",
  alternates: { canonical: "/west-university-remodeling" },
};

const FAQS = [
  {
    question: "Does West University Place have its own building department?",
    answer:
      "Yes. West University Place is a separately incorporated city, not a City of Houston neighborhood, and it operates its own building and permitting department. Plan review, inspections, tree protection, and right-of-way requirements are all handled by the City of West University Place rather than the City of Houston.",
  },
  {
    question: "Why do so many West U properties see teardowns instead of renovations?",
    answer:
      "West University's small, valuable lots make new construction economically attractive for some buyers, which is why teardown-and-rebuild is common in the area. That said, many existing homes — particularly those already updated or in good structural condition — are strong renovation or addition candidates rather than teardown candidates, and a renovation is often the faster and less disruptive path.",
  },
  {
    question: "What lot-specific rules affect additions in West University Place?",
    answer:
      "Lot coverage limits, setback requirements, and height restrictions all shape what's buildable on a West U lot, and they're enforced independently of City of Houston rules. Tree protection requirements can also affect where an addition's footprint can go, especially on lots with established mature trees close to the house.",
  },
] as const;

export default function WestUniversityRemodelingPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Houston", href: "/houston" },
          { label: "West University Remodeling", href: "/west-university-remodeling" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">West University Remodeling</p>
          <h1 className="text-4xl md:text-5xl leading-tight">
            Renovation Planning for West University Place
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            West University Place is a walkable, tightly-knit, and independently incorporated
            city inside Houston's Inner Loop. Its small lots and strict local review process make
            thoughtful renovations and additions — allowing homeowners to stay rather than
            relocate — a common alternative to buying elsewhere.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="west_university_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="character"
        eyebrow="Character & Lots"
        title="Small Lots, Close Neighbors, Real Constraints"
        imageUrl={IMAGES.heroExterior.url}
        imageAlt={IMAGES.heroExterior.alt}
      >
        <p>
          West University Place is known for tight lots, mature trees, and homes built in close
          proximity to one another — a setting that rewards careful planning more than almost any
          other neighborhood in this guide. Many original homes date to the 1930s through 1960s,
          and lot sizes leave less margin for error on setbacks, drainage, and construction
          logistics than larger-lot neighborhoods like Memorial or Tanglewood.
        </p>
        <p>
          Because usable lot area is limited, additions in West U are frequently vertical —
          second-story additions or attic conversions — rather than horizontal expansions, and
          layout efficiency tends to matter more here than in neighborhoods with more room to
          spread out.
        </p>
      </ImageTextSection>

      <ImageTextSection
        id="jurisdiction"
        eyebrow="Planning Considerations"
        title="A Separate City, a Separate Permitting Process"
        imageUrl={IMAGES.livingOpenPlan.url}
        imageAlt={IMAGES.livingOpenPlan.alt}
        imageSide="left"
      >
        <p>
          West University Place is its own incorporated municipality, distinct from the City of
          Houston, with its own plan review, inspections, and permitting department. Homeowners
          renovating here work directly with the City of West University Place rather than
          Houston's Permitting Center — a detail worth confirming with your professional, since
          the process, timeline, and requirements differ from Houston's.
        </p>
        <p>
          Tree protection and right-of-way rules are enforced closely given the neighborhood's
          mature tree canopy and narrow streets, and lot coverage, setback, and height limits are
          strictly applied given how little margin most lots have. Construction logistics —
          parking, staging, and neighbor coordination — also deserve more upfront planning here
          than on larger properties.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Common Project Types</p>
          <h2 className="text-3xl md:text-4xl mb-8">What Homeowners in West University Typically Renovate</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              Given the area's lot constraints,{" "}
              <a href="/home-additions-houston" className="underline hover:text-bronze-dark">
                second-story additions
              </a>{" "}
              are especially common in West University, often paired with a{" "}
              <a href="/primary-suite-remodeling-houston" className="underline hover:text-bronze-dark">
                primary suite renovation
              </a>{" "}
              on the new upper floor.
            </p>
            <p>
              For homeowners who've outgrown their current layout but value the neighborhood's
              walkability and schools, a{" "}
              <a href="/whole-home-remodeling-houston" className="underline hover:text-bronze-dark">
                whole-home renovation
              </a>{" "}
              is frequently evaluated directly against a teardown-and-rebuild — a comparison
              covered in our{" "}
              <a href="/guides/remodel-or-rebuild-houston" className="underline hover:text-bronze-dark">
                remodel vs. rebuild guide
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CTASection
        title="Planning a Renovation in West University?"
        description="Tell us about your home and project and we'll help determine the right next step."
        location="west_university_final_cta"
      />
    </>
  );
}
