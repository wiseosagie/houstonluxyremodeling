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
  title: "Outdoor Living Spaces in Houston, TX",
  description:
    "Planning outdoor living space in Houston — covered patios, outdoor kitchens, and pool-adjacent renovations designed around the region's climate and drainage.",
  alternates: { canonical: "/luxury-outdoor-living-houston" },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/luxury-outdoor-living-houston" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Outdoor living renovation matching",
  name: `Luxury Outdoor Living in Houston | ${SITE_NAME}`,
  provider: { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL },
  areaServed: NEIGHBORHOODS.map((n) => ({ "@type": "Place", name: n.name })),
  description:
    "Matching Houston homeowners planning outdoor kitchens, covered living areas, and pool-adjacent renovations with experienced professionals.",
};

const FAQS = [
  {
    question: "How much of the year can Houston homeowners actually use outdoor living space?",
    answer:
      "Most of it. Houston's mild winters mean covered outdoor space with heating elements — string lighting aside, gas heaters or a fireplace — is usable well beyond the warmer months. Summer heat and humidity are the bigger design constraint, which is why shade, airflow, and misting or fan systems get as much attention as the heating side.",
  },
  {
    question: "Do outdoor kitchens need to be covered in Houston?",
    answer:
      "Not strictly, but most homeowners choose to cover them. A roof or pergola over the cooking and prep area protects appliances and cabinetry from sun and rain, extends how often the space gets used, and is one of the more cost-effective additions relative to how much it improves day-to-day usability.",
  },
  {
    question: "What should we plan for around drainage before building an outdoor living space?",
    answer:
      "New hardscape, roof structures, and pools all change how water moves around the property. Grading and drainage should be part of the design conversation from the start, not addressed after the fact, since incorrect grading can direct water toward the house's foundation rather than away from it.",
  },
  {
    question: "Should outdoor living be planned together with an interior renovation?",
    answer:
      "When the two spaces connect — through a wall of disappearing glass doors, for example — planning them together usually produces a better result than treating them as separate projects, since sightlines, flooring transitions, and ceiling heights need to align across the threshold.",
  },
] as const;

export default function LuxuryOutdoorLivingHoustonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Services", href: "/luxury-remodeling-houston" },
          { label: "Luxury Outdoor Living", href: "/luxury-outdoor-living-houston" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Luxury Outdoor Living Houston</p>
          <h1 className="text-4xl md:text-5xl leading-tight">Luxury Outdoor Living in Houston</h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            Given Houston's climate, outdoor living space functions as usable square footage for
            much of the year rather than an occasional-use amenity. Covered living areas, outdoor
            kitchens, and pool-adjacent renovations are most successful when planned around how
            the space will actually be used through Houston's heat, humidity, and rain.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="outdoor_living_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="climate-design"
        eyebrow="Designing for the Climate"
        title="Shade, Airflow, and Coverage"
        imageUrl={IMAGES.poolOutdoorLiving.url}
        imageAlt={IMAGES.poolOutdoorLiving.alt}
      >
        <p>
          Covered structures — solid roofs, louvered pergolas, or deep overhangs — do more for
          usability in Houston than almost any other single design decision, since they protect
          against both intense summer sun and Houston's frequent rain. Ceiling fans, misting
          systems, and orientation relative to prevailing breezes all extend the number of hours
          the space is comfortable during warmer months.
        </p>
        <p>
          Because Houston's winters are mild, outdoor spaces with a fireplace, gas heaters, or
          even well-placed string lighting tend to see use across most of the year rather than
          just a short summer season — worth factoring into how much of the budget goes toward
          heating and lighting versus purely warm-weather features.
        </p>
      </ImageTextSection>

      <ImageTextSection
        id="outdoor-kitchen"
        eyebrow="Outdoor Kitchens"
        title="What an Outdoor Kitchen Typically Involves"
        imageUrl={IMAGES.indoorOutdoorLiving.url}
        imageAlt={IMAGES.indoorOutdoorLiving.alt}
        imageSide="left"
      >
        <p>
          A well-planned outdoor kitchen includes a grill, refrigeration, storage, and a durable
          countertop material such as concrete, granite, or quartzite that can tolerate sun and
          moisture without degrading. Gas and electrical rough-in needs to reach the location
          before hardscape goes in, so the kitchen's placement is usually one of the first
          decisions finalized in design, not something adjusted later.
        </p>
        <p>
          Positioning the outdoor kitchen under or adjacent to a covered structure protects both
          the equipment and the people using it, and is one of the more common reasons homeowners
          combine a patio cover and outdoor kitchen into a single phase rather than building them
          separately.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Site Considerations</p>
          <h2 className="text-3xl md:text-4xl mb-8">Drainage, Grading, and Indoor-Outdoor Connections</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              Drainage and grading carry more weight on outdoor projects than they're often given
              credit for. New patios, pools, and roof structures all change how rainwater moves
              around the property, and getting the grading wrong can direct water toward the
              house's foundation rather than away from it — a costly mistake to discover after
              construction is complete.
            </p>
            <p>
              Where an interior renovation is happening at the same time, indoor-outdoor
              connections — disappearing glass walls, matched flooring materials, and consistent
              ceiling heights across the threshold — read best when the two spaces are designed
              together. If you're also renovating interior living space, see our{" "}
              <a href="/whole-home-remodeling-houston" className="underline hover:text-bronze-dark">
                whole-home remodeling guide
              </a>{" "}
              for how the two scopes typically get coordinated.
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <RelatedServices current="/luxury-outdoor-living-houston" />

      <CTASection
        title="Planning an Outdoor Living Project?"
        description="Tell us about your outdoor space and we'll help determine the right next step."
        location="outdoor_living_final_cta"
      />
    </>
  );
}
