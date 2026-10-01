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
  title: "Whole-Home Remodeling in Houston, TX",
  description:
    "Planning a whole-home remodel in Houston? A practical guide to scope, phasing, structural and MEP considerations, and budgeting for a full-house renovation.",
  alternates: { canonical: "/whole-home-remodeling-houston" },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/whole-home-remodeling-houston" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Whole-home renovation matching",
  name: `Whole Home Remodeling in Houston | ${SITE_NAME}`,
  provider: { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL },
  areaServed: NEIGHBORHOODS.map((n) => ({ "@type": "Place", name: n.name })),
  description:
    "Matching Houston homeowners planning a whole-home renovation with experienced design-build and remodeling professionals.",
};

const FAQS = [
  {
    question: "How long does a whole-home remodel take in Houston?",
    answer:
      "Most whole-home renovations run nine months to two years from initial design through move-back-in, depending on the home's size, how much structural or foundation work is involved, and material lead times. Projects that also require a second-story addition or full mechanical replacement tend toward the longer end.",
  },
  {
    question: "Do we need to move out during a whole-home renovation?",
    answer:
      "It depends on scope. A renovation that keeps at least one bathroom and a kitchen functional, or that's phased by wing, can sometimes be lived through. A full gut down to studs — common when foundation, electrical, or plumbing systems are being fully replaced — usually isn't livable and most homeowners relocate temporarily.",
  },
  {
    question: "What's the difference between a whole-home remodel and a gut renovation?",
    answer:
      "A gut renovation strips a home to its structural frame and rebuilds everything inside it — a subset of whole-home remodeling reserved for homes with outdated or failing systems. A whole-home remodel is the broader category; it can be a full gut, or it can preserve existing systems and finishes in good condition while reconfiguring layout and updating the rest.",
  },
  {
    question: "Is a whole-home remodel or a series of single-room remodels the better approach?",
    answer:
      "If a home's floor plan, mechanical systems, or structure need to change, coordinating the work as one whole-home project usually costs less and disrupts the household less than remodeling room by room over several years, since design, permitting, and trade scheduling happen once rather than repeatedly.",
  },
] as const;

export default function WholeHomeRemodelingHoustonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Services", href: "/luxury-remodeling-houston" },
          { label: "Whole Home Remodeling", href: "/whole-home-remodeling-houston" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Whole Home Remodeling Houston</p>
          <h1 className="text-4xl md:text-5xl leading-tight">
            Whole-Home Remodeling in Houston
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            A whole-home remodel treats the entire house as one coordinated project rather than a
            sequence of separate rooms. For Houston homeowners in established neighborhoods with
            homes built decades ago, that usually means resolving floor plan, structural, and
            mechanical issues at the same time — not just refreshing finishes.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="whole_home_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="what-counts"
        eyebrow="Defining the Scope"
        title="What Counts as a Whole-Home Remodel"
        imageUrl={IMAGES.livingFormal.url}
        imageAlt={IMAGES.livingFormal.alt}
      >
        <p>
          A whole-home remodel touches most or all of the house's habitable space in a single,
          coordinated design and construction effort. That can range from a comprehensive
          reconfiguration of layout and finishes while retaining sound structure and systems, to a
          full gut renovation that removes interior walls, flooring, mechanical, electrical, and
          plumbing systems down to the frame.
        </p>
        <p>
          The distinguishing feature isn't square footage — it's coordination. Decisions about
          where a wall moves, where a new HVAC zone runs, or where plumbing gets relocated all
          affect the rest of the house, so they're planned together rather than one room at a
          time.
        </p>
      </ImageTextSection>

      <ImageTextSection
        id="phasing"
        eyebrow="Project Sequence"
        title="How a Whole-Home Project Is Phased"
        imageUrl={IMAGES.livingOpenPlan.url}
        imageAlt={IMAGES.livingOpenPlan.alt}
        imageSide="left"
      >
        <p>
          Whole-home projects front-load planning. Design development, structural and MEP
          engineering, and permitting typically take longer than the equivalent phase on a
          single-room remodel, because every trade's scope depends on a finished, coordinated set
          of drawings before demolition starts.
        </p>
        <p>
          Once construction begins, the general sequence is consistent: selective demolition,
          structural and framing changes, rough mechanical/electrical/plumbing, insulation and
          drywall, then finishes and fixtures — cabinetry, flooring, tile, and millwork among the
          last items installed. Long-lead items like custom cabinetry, natural stone, and
          special-order windows are usually ordered during the design phase so they arrive when
          the schedule needs them.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Structure & Systems</p>
          <h2 className="text-3xl md:text-4xl mb-8">What Houston's Housing Stock Adds to the Equation</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              Many of the homes being renovated in Houston's established close-in neighborhoods
              were built between the 1930s and 1990s, and a whole-home scope is where their age
              tends to surface as real decisions rather than cosmetic ones.
            </p>
            <p>
              <strong className="text-charcoal">Foundation.</strong> Houston sits largely on
              expansive clay soils, and older homes are a mix of slab-on-grade and pier-and-beam
              construction. A foundation assessment early in design tells you whether the existing
              foundation can support layout or structural changes as-is, or whether remediation
              should be budgeted before interior work begins.
            </p>
            <p>
              <strong className="text-charcoal">Electrical capacity.</strong> A whole-home remodel
              that adds a larger kitchen, expanded HVAC, and modern appliance loads often exceeds
              what a decades-old electrical panel and service were sized for, making a panel
              upgrade a common, if unglamorous, line item.
            </p>
            <p>
              <strong className="text-charcoal">Moisture and humidity.</strong> Houston's climate
              makes vapor barriers, drainage planes, and HVAC dehumidification more consequential
              than in drier regions — details worth confirming are addressed in the mechanical and
              building-envelope design, not left to the framing crew's judgment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-stone-200">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Living Through It</p>
          <h2 className="text-3xl md:text-4xl mb-8">Staying in the Home vs. Relocating Temporarily</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              Whether a household can stay in the home during a whole-home remodel depends on how
              much of the house is affected at once. A phased renovation — one wing or floor at a
              time, with at least one working kitchen and bathroom maintained — can sometimes be
              livable, though it extends the overall timeline.
            </p>
            <p>
              A full gut renovation, where mechanical systems are disconnected and most interior
              walls come out, is rarely livable. Most homeowners in this situation plan for
              temporary housing and build that cost and logistics into the overall project budget
              from the start rather than deciding mid-construction.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Budget & Team</p>
          <h2 className="text-3xl md:text-4xl mb-8">Budgeting and Choosing a Delivery Method</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              Whole-home renovations span a wide range depending on square footage, the extent of
              structural change, and finish level. For a detailed breakdown of what drives cost at
              this scope, see our{" "}
              <a href="/guides/whole-home-remodel-cost-houston" className="underline hover:text-bronze-dark">
                whole-home remodel cost guide for Houston
              </a>
              .
            </p>
            <p>
              Because a whole-home project touches architecture, structure, and every trade, the
              choice between a design-build firm, an architect-led team, and a general
              contractor-only arrangement matters more here than on a single-room remodel. We
              cover the tradeoffs of each in our{" "}
              <a href="/luxury-remodeling-houston#design-build" className="underline hover:text-bronze-dark">
                design-build overview
              </a>{" "}
              and in{" "}
              <a href="/guides/how-to-choose-remodeling-contractor-houston" className="underline hover:text-bronze-dark">
                how to choose a remodeling professional in Houston
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <RelatedServices current="/whole-home-remodeling-houston" />

      <CTASection
        title="Planning a Whole-Home Renovation?"
        description="Tell us about your home and scope. A short, private questionnaire is the first step."
        location="whole_home_final_cta"
      />
    </>
  );
}
