import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import ImageTextSection from "@/components/shared/ImageTextSection";
import PageFAQ from "@/components/shared/PageFAQ";
import { IMAGES } from "@/data/images";
import { SITE_NAME, SITE_URL, NEIGHBORHOODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Home Additions Houston | Second-Story & Room Addition Guide",
  description:
    "Planning a home addition in Houston — second-story additions, primary suite wings, and the foundation, drainage, and permitting factors that shape what's possible.",
  alternates: { canonical: "/home-additions-houston" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Home addition matching",
  name: `Home Additions in Houston | ${SITE_NAME}`,
  provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  areaServed: NEIGHBORHOODS.map((n) => ({ "@type": "Place", name: n.name })),
  description:
    "Matching Houston homeowners planning a significant home addition with experienced remodeling and design-build professionals.",
};

const FAQS = [
  {
    question: "Should we add a second story or build out instead?",
    answer:
      "It depends on the lot. Building out is usually less expensive per square foot but requires available lot coverage and adequate setbacks from property lines. On smaller or more restricted lots — common in West University and parts of Tanglewood — a second story is often the only way to add meaningful square footage, at the cost of foundation and framing reinforcement to carry the added load.",
  },
  {
    question: "Will an addition require foundation work even if we're only building up?",
    answer:
      "Often, yes. A second-story addition adds load to the existing foundation and first-floor framing, and on Houston's expansive clay soils, that typically means an engineer needs to evaluate whether the existing foundation can carry the new load or needs reinforcement before framing begins.",
  },
  {
    question: "Do additions in Houston need to match the existing roofline and exterior materials?",
    answer:
      "Not by code in most cases, but it's the detail that determines whether an addition reads as original to the home or as a visibly appended box. Matching roof pitch, siding, window proportions, and trim details takes more planning upfront but is usually worth it for resale value and how the finished home presents.",
  },
  {
    question: "How does a flood plain affect an addition?",
    answer:
      "If a property falls within or near a mapped flood plain, an addition may trigger elevation requirements or additional review through the City of Houston's floodplain management process. This varies by parcel, so it's worth confirming your property's flood plain status early, before design assumes a particular finished floor elevation.",
  },
] as const;

export default function HomeAdditionsHoustonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Luxury Remodeling Houston", href: "/luxury-remodeling-houston" },
          { label: "Home Additions", href: "/home-additions-houston" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Home Additions Houston</p>
          <h1 className="text-4xl md:text-5xl leading-tight">Home Additions in Houston</h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            An addition adds meaningful square footage — a primary suite wing, a second story,
            expanded living space — while ideally reading as original to the home rather than
            appended to it. Getting there means resolving structural, drainage, and permitting
            questions before design goes very far.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="additions_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="out-vs-up"
        eyebrow="Building Out vs. Building Up"
        title="Choosing the Right Type of Addition"
        imageUrl={IMAGES.indoorOutdoorLiving.url}
        imageAlt={IMAGES.indoorOutdoorLiving.alt}
      >
        <p>
          Ground-floor additions extend the home's footprint and are generally more
          straightforward structurally, but they require available lot coverage and adequate
          setback from property lines and, in many established neighborhoods, from deed
          restriction or civic association guidelines as well.
        </p>
        <p>
          Second-story additions add space without expanding the footprint, which makes them the
          more common route on smaller or more tightly built lots. The tradeoff is structural:
          the existing foundation and first-floor framing need to be evaluated, and often
          reinforced, to safely carry the additional load — a step that adds engineering time and
          cost that a ground-floor addition typically doesn't require.
        </p>
      </ImageTextSection>

      <ImageTextSection
        id="foundation-drainage"
        eyebrow="Site & Structure"
        title="Foundation and Drainage Considerations"
        imageUrl={IMAGES.exteriorDaylight.url}
        imageAlt={IMAGES.exteriorDaylight.alt}
        imageSide="left"
      >
        <p>
          Much of Houston sits on expansive clay soils that shift with moisture, which is part of
          why a structural engineer's evaluation is a standard early step for any addition —
          ground-floor or second-story. The engineer's findings shape both the foundation design
          for a new footprint and whether the existing foundation needs reinforcement to carry
          added weight above it.
        </p>
        <p>
          Drainage is the other site-specific factor. Adding roof and hardscape area changes how
          water moves around the property, and some parcels fall within or near a mapped flood
          plain, which can affect required elevation and permitting. These are questions worth
          raising with a professional and, where relevant, a civil engineer before finalizing the
          addition's footprint.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Design Continuity</p>
          <h2 className="text-3xl md:text-4xl mb-8">Making an Addition Look Original to the Home</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              The additions that read best are the ones where roofline pitch, exterior siding or
              masonry, window proportions, and trim details all continue from the existing house
              rather than shifting at the seam. That level of matching takes more time in design —
              sourcing materials that align with the original construction, and sometimes
              adjusting the addition's massing so the roofline resolves cleanly — but it's a
              primary driver of how well the finished home holds together, both for daily living
              and for resale.
            </p>
            <p>
              In neighborhoods with deed restrictions or civic association design review — common
              across{" "}
              <a href="/river-oaks-remodeling" className="underline hover:text-bronze-dark">
                River Oaks
              </a>
              ,{" "}
              <a href="/memorial-remodeling" className="underline hover:text-bronze-dark">
                Memorial
              </a>
              ,{" "}
              <a href="/tanglewood-remodeling" className="underline hover:text-bronze-dark">
                Tanglewood
              </a>
              , and{" "}
              <a href="/west-university-remodeling" className="underline hover:text-bronze-dark">
                West University
              </a>
              , and{" "}
              <a href="/afton-oaks-remodeling" className="underline hover:text-bronze-dark">
                Afton Oaks
              </a>{" "}
              — exterior changes from an addition may need review before permitting, which is
              worth building into the project timeline.
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CTASection
        title="Planning a Home Addition?"
        description="Tell us about your lot and goals and we'll help determine the right next step."
        location="additions_final_cta"
      />
    </>
  );
}
