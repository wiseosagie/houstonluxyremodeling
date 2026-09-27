import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import ImageTextSection from "@/components/shared/ImageTextSection";
import PageFAQ from "@/components/shared/PageFAQ";
import { IMAGES } from "@/data/images";
import { OPEN_GRAPH_DEFAULTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "River Oaks Remodeling | Renovation Planning for River Oaks",
  description:
    "Planning a renovation in River Oaks — architectural character, deed restrictions, and what homeowners should know before hiring a remodeling professional.",
  alternates: { canonical: "/river-oaks-remodeling" },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/river-oaks-remodeling" },
};

const FAQS = [
  {
    question: "Does River Oaks have its own approval process for exterior renovations?",
    answer:
      "River Oaks is inside the City of Houston, so renovations go through the standard City of Houston permitting process. Many properties also carry deed restrictions enforced by a neighborhood property owners' association, which can separately govern setbacks, height, and exterior changes — homeowners should check both before finalizing a design.",
  },
  {
    question: "How old are homes in River Oaks, and does that affect renovation scope?",
    answer:
      "River Oaks homes span roughly a century, from 1920s-era construction to contemporary builds, which means renovation scope varies enormously by property. Older homes more often involve foundation evaluation, electrical service upgrades, and plumbing replacement alongside cosmetic and layout work.",
  },
  {
    question: "Do renovations in River Oaks need to preserve the home's original architectural style?",
    answer:
      "There's no blanket requirement to match original style, but many River Oaks homes carry real architectural pedigree, and homeowners renovating them often choose to work within or in dialogue with the original design rather than departing from it — both for the home's character and for long-term value.",
  },
] as const;

export default function RiverOaksRemodelingPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Houston", href: "/houston" },
          { label: "River Oaks Remodeling", href: "/river-oaks-remodeling" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">River Oaks Remodeling</p>
          <h1 className="text-4xl md:text-5xl leading-tight">Renovation Planning for River Oaks</h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            River Oaks is Houston's most established address for architectural significance, with
            a housing stock that spans roughly a century of construction. Renovating here means
            working within a neighborhood held to the standard of its original craftsmanship —
            and navigating both city and neighborhood-level review.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="river_oaks_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="character"
        eyebrow="Architectural Character"
        title="A Century of Houses, One Standard of Craftsmanship"
        imageUrl={IMAGES.livingFormal.url}
        imageAlt={IMAGES.livingFormal.alt}
      >
        <p>
          Developed beginning in the 1920s, River Oaks contains everything from early cottages
          near the neighborhood's shopping center to grand estates along its most prominent
          streets, including work attributed to noted historical architects. That range means two
          neighboring properties can call for very different renovation approaches — one may need
          little more than a sensitive interior update, while another requires a full structural
          and systems overhaul behind a preserved facade.
        </p>
        <p>
          Because of that architectural pedigree, renovations in River Oaks are frequently
          approached as a dialogue with the existing design rather than a departure from it,
          particularly for street-facing changes and additions.
        </p>
      </ImageTextSection>

      <ImageTextSection
        id="considerations"
        eyebrow="Planning Considerations"
        title="Deed Restrictions, Discretion, and the Approval Path"
        imageUrl={IMAGES.exteriorEntrance.url}
        imageAlt={IMAGES.exteriorEntrance.alt}
        imageSide="left"
      >
        <p>
          River Oaks sits within the City of Houston, so structural, electrical, plumbing, and
          addition work goes through the standard City of Houston permitting process. Many
          properties also carry deed restrictions enforced by a neighborhood property owners'
          association, which can separately address setbacks, height, and exterior material
          changes — worth confirming early, since it runs alongside, not instead of, city
          permitting.
        </p>
        <p>
          Privacy is also a practical consideration for renovation logistics in River Oaks —
          from managing construction traffic on narrower, curving streets to coordinating work
          discreetly around a household's schedule. An experienced professional familiar with the
          neighborhood will typically have a plan for both.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Common Project Types</p>
          <h2 className="text-3xl md:text-4xl mb-8">What Homeowners in River Oaks Typically Renovate</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              Given the scale of many River Oaks homes,{" "}
              <a href="/whole-home-remodeling-houston" className="underline hover:text-bronze-dark">
                whole-home renovations
              </a>{" "}
              and{" "}
              <a href="/luxury-kitchen-remodeling-houston" className="underline hover:text-bronze-dark">
                luxury kitchen renovations
              </a>{" "}
              are both common, particularly in homes where the kitchen was originally designed as
              a closed-off service space rather than the open, family-facing room most homeowners
              want today. Primary{" "}
              <a href="/luxury-bathroom-remodeling-houston" className="underline hover:text-bronze-dark">
                bathroom renovations
              </a>{" "}
              are frequently part of the same project.
            </p>
            <p>
              On larger, established lots,{" "}
              <a href="/luxury-outdoor-living-houston" className="underline hover:text-bronze-dark">
                outdoor living renovations
              </a>{" "}
              — pool-adjacent living space, outdoor kitchens, and covered entertaining areas —
              are also frequently planned alongside interior work rather than as an afterthought.
            </p>
            <p>
              For cost expectations at this scale, see our{" "}
              <a href="/guides/whole-home-remodel-cost-houston" className="underline hover:text-bronze-dark">
                whole-home remodel cost guide
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CTASection
        title="Planning a Renovation in River Oaks?"
        description="Tell us about your home and project and we'll help determine the right next step."
        location="river_oaks_final_cta"
      />
    </>
  );
}
