import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import ImageTextSection from "@/components/shared/ImageTextSection";
import PageFAQ from "@/components/shared/PageFAQ";
import { IMAGES } from "@/data/images";
import { SITE_NAME, SITE_URL, NEIGHBORHOODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Bathroom Remodeling Houston | Luxury & Custom Bathroom Guide",
  description:
    "Planning a bathroom renovation in Houston — from a standard remodel to a full luxury transformation. Layout, plumbing, materials, and what separates each tier.",
  alternates: { canonical: "/luxury-bathroom-remodeling-houston" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Bathroom remodeling matching",
  name: `Bathroom Remodeling in Houston | ${SITE_NAME}`,
  provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  areaServed: NEIGHBORHOODS.map((n) => ({ "@type": "Place", name: n.name })),
  description:
    "Matching Houston homeowners planning a substantial bathroom renovation with experienced remodeling and design-build professionals.",
};

const FAQS = [
  {
    question: "What's the difference between this and your primary suite remodeling guide?",
    answer:
      "This guide covers bathroom renovations generally — a primary bathroom, a secondary bathroom, or a powder room, considered on its own. Our primary suite guide covers the broader project of renovating the bedroom, closet, and bathroom together as one connected suite. If your project is the full suite, start there; if it's a bathroom by itself, this guide is the better starting point.",
  },
  {
    question: "Do I need a permit to remodel a bathroom in Houston?",
    answer:
      "If the project relocates plumbing or electrical, changes the room's layout, or involves structural work, it generally requires a permit from the City of Houston or the applicable municipality. A like-for-like fixture and finish swap with no plumbing or layout changes may not. Confirm with your professional based on your specific scope.",
  },
  {
    question: "How long does a full bathroom renovation typically take?",
    answer:
      "A single bathroom taken down to the studs, with new plumbing, waterproofing, tile, and cabinetry, commonly runs several weeks to a few months once construction starts — longer if custom cabinetry or special-order tile and fixtures are part of the plan. Design, material selection, and permitting typically add more time up front than the construction itself.",
  },
  {
    question: "Should a guest bathroom be renovated to the same standard as the primary bathroom?",
    answer:
      "Not necessarily. Many homeowners renovate secondary and guest bathrooms to a clean, well-built standard while reserving the most custom materials and fixtures — freestanding tubs, natural stone, designer tile — for the primary bathroom. The right level of investment in each room depends on how it's used and by whom.",
  },
] as const;

export default function LuxuryBathroomRemodelingHoustonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Luxury Remodeling Houston", href: "/luxury-remodeling-houston" },
          { label: "Bathroom Remodeling", href: "/luxury-bathroom-remodeling-houston" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Bathroom Remodeling Houston</p>
          <h1 className="text-4xl md:text-5xl leading-tight">Bathroom Remodeling in Houston</h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            Bathrooms are renovated more often, and more independently, than almost any other
            room in the house. This guide covers substantial bathroom renovations — new layout,
            custom cabinetry and tile, quality fixtures — rather than one-day tub-liner or acrylic
            conversion installations, which are a different product entirely from what a
            remodeling or design-build professional delivers.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="bathroom_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="layout-plumbing"
        eyebrow="What Drives the Project"
        title="Layout, Plumbing, and Waterproofing"
        imageUrl={IMAGES.spaBathroom.url}
        imageAlt={IMAGES.spaBathroom.alt}
      >
        <p>
          Moving a toilet, sink, or shower drain is usually the single decision that most affects
          a bathroom renovation's cost and timeline, since it touches plumbing beneath the floor
          or inside the walls. Renovations that keep fixtures in their existing locations are
          simpler and faster; renovations that reconfigure the room for a better layout — a larger
          shower, a repositioned vanity — cost more but often deliver a meaningfully better result
          for how the room is actually used.
        </p>
        <p>
          Waterproofing behind tile and around the shower or tub is the detail that determines how
          well a bathroom performs over the following decade, not just how it looks on completion
          day. It's worth confirming with any professional that a proper waterproofing membrane,
          not just cement board, is part of the specification.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Scope & Tiers</p>
          <h2 className="text-3xl md:text-4xl mb-8">Cosmetic Refresh, Standard Renovation, or Full Transformation</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              <strong className="text-charcoal">Cosmetic refresh.</strong> Fixtures, countertop,
              and finishes are updated within the room's existing layout and plumbing locations.
              The fastest and least disruptive option, and a reasonable choice for a bathroom
              that's structurally sound but visually dated.
            </p>
            <p>
              <strong className="text-charcoal">Standard renovation.</strong> New tile, vanity,
              and fixtures throughout, often with a modest layout adjustment — a larger shower in
              place of a tub-shower combo, for instance — while keeping most plumbing in its
              existing footprint.
            </p>
            <p>
              <strong className="text-charcoal">Full transformation.</strong> Layout, plumbing,
              and finishes are reconsidered together: freestanding tubs, curbless showers,
              full-height natural stone or tile, custom cabinetry, and heated flooring are common
              at this tier. For a detailed cost breakdown across these three tiers, see our{" "}
              <a href="/guides/bathroom-remodel-cost-houston" className="underline hover:text-bronze-dark">
                bathroom remodel cost guide
              </a>
              . Before hiring, see our{" "}
              <a href="/guides/how-to-choose-remodeling-contractor-houston" className="underline hover:text-bronze-dark">
                guide to choosing a remodeling contractor in Houston
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-stone-200">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Houston Considerations</p>
          <h2 className="text-3xl md:text-4xl mb-8">Humidity, Ventilation, and Older Plumbing</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              <strong className="text-charcoal">Ventilation.</strong> Houston's humidity makes a
              properly sized exhaust fan, vented to the exterior rather than into an attic space,
              more important than it would be in a drier climate. Undersized or improperly vented
              exhaust is a common, avoidable cause of long-term moisture problems behind tile and
              in ceiling framing.
            </p>
            <p>
              <strong className="text-charcoal">Older plumbing.</strong> Many Houston homes built
              before the 1960s were plumbed with galvanized steel or cast iron supply and drain
              lines, which can be significantly corroded by the time a bathroom is renovated.
              Replacing these lines during a renovation — rather than working around them — is
              usually more cost-effective in the long run, even though it adds to the upfront
              scope.
            </p>
            <p>
              <strong className="text-charcoal">Foundation movement.</strong> On homes with slab
              foundations affected by Houston's expansive clay soils, hairline cracking in tile or
              grout over time is common and worth discussing with your professional — proper
              movement joints in the tile installation can reduce this risk.
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CTASection
        title="Planning a Bathroom Renovation?"
        description="Tell us about your project and we'll help determine the right next step."
        location="bathroom_final_cta"
      />
    </>
  );
}
