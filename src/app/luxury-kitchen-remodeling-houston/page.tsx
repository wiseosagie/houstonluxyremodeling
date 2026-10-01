import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import ImageTextSection from "@/components/shared/ImageTextSection";
import PageFAQ from "@/components/shared/PageFAQ";
import RelatedServices from "@/components/shared/RelatedServices";
import { IMAGES } from "@/data/images";
import { ORGANIZATION_ID, SITE_NAME, SITE_URL, NEIGHBORHOODS, OPEN_GRAPH_DEFAULTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kitchen Remodeling in Houston, TX",
  description:
    "A planning guide to kitchen remodeling and renovation in Houston — layout, custom cabinetry, natural stone, and appliance decisions for a substantial luxury kitchen.",
  alternates: { canonical: "/luxury-kitchen-remodeling-houston" },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/luxury-kitchen-remodeling-houston" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Luxury kitchen remodeling matching",
  name: `Luxury Kitchen Remodeling in Houston | ${SITE_NAME}`,
  provider: { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL },
  areaServed: NEIGHBORHOODS.map((n) => ({ "@type": "Place", name: n.name })),
  description:
    "Matching Houston homeowners planning a luxury or custom kitchen renovation with experienced remodeling and design-build professionals.",
};

const FAQS = [
  {
    question: "What makes a kitchen remodel 'luxury' versus a standard renovation?",
    answer:
      "Scope and specification, not just budget. Luxury kitchen projects typically involve layout changes (moved walls, relocated plumbing or gas lines), custom or semi-custom cabinetry built to the room rather than stock cabinets, natural stone or quartzite surfaces, and integrated or professional-grade appliances — as opposed to a like-for-like swap of cabinets, counters, and appliances in the existing footprint.",
  },
  {
    question: "What takes the longest to arrive on a custom kitchen project?",
    answer:
      "Custom cabinetry and natural stone are usually the pacing items. Cabinetry fabrication and slab selection, fabrication, and installation frequently take longer than the construction and installation work itself, so many homeowners begin those selections early in design rather than waiting until permits are pulled.",
  },
  {
    question: "Does a kitchen remodel in Houston require a permit?",
    answer:
      "If the project relocates plumbing, gas, or electrical circuits, or changes the room's structure (removing or moving walls), it generally requires a permit from the City of Houston or the applicable municipality. A like-for-like refresh with no layout or systems changes may not. Your remodeling professional or architect can confirm what applies to your specific scope.",
  },
  {
    question: "Should the kitchen be renovated on its own or as part of a larger project?",
    answer:
      "If the kitchen opens to other living space, or if its systems (electrical, plumbing) are shared with adjacent rooms you also plan to renovate eventually, coordinating the work as a single project can reduce cost and disruption compared to two separate renovations a few years apart.",
  },
] as const;

export default function LuxuryKitchenRemodelingHoustonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Services", href: "/luxury-remodeling-houston" },
          { label: "Kitchen Remodeling", href: "/luxury-kitchen-remodeling-houston" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Kitchen Remodeling Houston</p>
          <h1 className="text-4xl md:text-5xl leading-tight">
            Kitchen Remodeling in Houston
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            The kitchen is the room most often renovated on its own — and the one where a handful
            of early layout decisions matter more to daily life than any single finish choice.
            This guide focuses on substantial kitchen renovations: layout changes, custom
            cabinetry, and integrated appliances, not a cosmetic cabinet-and-counter refresh.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="kitchen_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="layout"
        eyebrow="Layout First"
        title="Why Layout Decides More Than Finishes"
        imageUrl={IMAGES.kitchenIsland.url}
        imageAlt={IMAGES.kitchenIsland.alt}
      >
        <p>
          Island proportions, the distance between prep and cooking zones, pantry circulation, and
          sightlines into adjacent living space typically matter more to how a kitchen actually
          functions than any individual material choice. Getting the layout right — often the
          reason for a wall coming down or plumbing moving — is worth resolving before cabinetry
          design begins, not alongside it.
        </p>
        <p>
          In open-plan Houston homes, the kitchen also functions as the visual center of the main
          living area. Sightlines from the family room and dining space, and how the island reads
          from those vantage points, are frequently a bigger design driver than they would be in a
          fully enclosed kitchen.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Materials & Specification</p>
          <h2 className="text-3xl md:text-4xl mb-8">Cabinetry, Stone, and Appliances</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              <strong className="text-charcoal">Cabinetry.</strong> Custom cabinetry is built to
              the room's exact dimensions and can accommodate integrated appliance panels,
              specialty storage, and unusual layouts. Semi-custom lines offer more configuration
              than stock cabinets at a shorter lead time. Stock cabinetry can still read as
              high-end when paired with the right hardware and stone, but has less flexibility for
              an unusual footprint.
            </p>
            <p>
              <strong className="text-charcoal">Natural stone and quartzite.</strong> Slab
              selection typically happens in person, since natural stone varies piece to piece.
              Waterfall edges and full-height backsplashes use more of a given slab and affect how
              many slabs a project requires — a detail worth pricing early if book-matching across
              the island and backsplash matters to you.
            </p>
            <p>
              <strong className="text-charcoal">Appliances.</strong> Professional-grade ranges,
              integrated refrigeration, and dual dishwashers are common at this scope, and each has
              its own rough-in requirements — gas line capacity, ventilation, and electrical —
              that need to be finalized before framing and rough MEP, not after cabinets are
              ordered.
            </p>
          </div>
        </div>
      </section>

      <ImageTextSection
        id="planning-considerations"
        eyebrow="Planning Considerations"
        title="Sequencing a Kitchen Renovation"
        imageUrl={IMAGES.livingOpenPlan.url}
        imageAlt={IMAGES.livingOpenPlan.alt}
        imageSide="left"
      >
        <p>
          Because cabinetry fabrication and stone fabrication are frequently the longest lead
          items on a kitchen project, many homeowners finalize those selections during design,
          well before demolition, so the materials are ready when the space is.
        </p>
        <p>
          If the kitchen is part of an open living area, expect the project boundary to extend
          slightly beyond the kitchen itself — flooring transitions, ceiling treatments, and
          lighting in adjacent space are often addressed together so the finished kitchen reads as
          continuous with the rest of the home rather than a visibly separate renovation.
        </p>
        <p>
          For a detailed look at what drives kitchen renovation cost in Houston specifically —
          including the difference between a refresh, a mid-range remodel, and a full custom
          kitchen — see our{" "}
          <a href="/guides/kitchen-remodel-cost-houston" className="underline hover:text-bronze-dark">
            kitchen remodel cost guide
          </a>
          . And before hiring, our{" "}
          <a href="/guides/how-to-choose-remodeling-contractor-houston" className="underline hover:text-bronze-dark">
            guide to choosing a remodeling contractor
          </a>{" "}
          covers what to verify.
        </p>
      </ImageTextSection>

      <PageFAQ items={FAQS} />

      <RelatedServices current="/luxury-kitchen-remodeling-houston" />

      <CTASection
        title="Planning a Kitchen Renovation?"
        description="Tell us about your kitchen project and we'll help determine the right next step."
        location="kitchen_final_cta"
      />
    </>
  );
}
