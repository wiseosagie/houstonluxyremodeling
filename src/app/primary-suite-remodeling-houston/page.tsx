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
  title: "Primary Suite Remodeling in Houston, TX",
  description:
    "Planning a primary suite remodel in Houston — bathroom layout, closet reconfiguration, waterproofing, and how to sequence a bedroom-and-bath renovation.",
  alternates: { canonical: "/primary-suite-remodeling-houston" },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/primary-suite-remodeling-houston" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Primary suite remodeling matching",
  name: `Primary Suite Remodeling in Houston | ${SITE_NAME}`,
  provider: { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL },
  areaServed: NEIGHBORHOODS.map((n) => ({ "@type": "Place", name: n.name })),
  description:
    "Matching Houston homeowners planning a primary suite, primary bathroom, or bedroom renovation with experienced remodeling professionals.",
};

const FAQS = [
  {
    question: "What's typically included in a primary suite remodel?",
    answer:
      "Most primary suite projects combine a bathroom renovation with a closet reconfiguration and, less often, changes to the bedroom itself. The bathroom and closet usually carry most of the cost and complexity, since they involve plumbing, waterproofing, and built-in cabinetry, while the bedroom portion is often closer to a finish-level refresh.",
  },
  {
    question: "Why does a primary bathroom cost more per square foot than other rooms?",
    answer:
      "Bathrooms concentrate plumbing, waterproofing, ventilation, tile work, and often custom cabinetry into a small footprint. A freestanding tub, a curbless shower, and full-height tile all add labor and material cost relative to their size in a way that a similarly sized bedroom does not.",
  },
  {
    question: "Can the primary suite be remodeled without touching the rest of the house?",
    answer:
      "In most cases, yes — a primary suite remodel can be scoped as its own project if its plumbing and electrical systems don't require work in adjacent rooms. It's worth confirming this with your professional early, since older homes sometimes share a plumbing stack or electrical circuit between the primary suite and a neighboring room.",
  },
  {
    question: "How important is ventilation in a Houston primary bathroom remodel?",
    answer:
      "More than in drier climates. Houston's humidity makes proper exhaust ventilation and moisture-resistant materials behind tile and around the shower and tub especially important for preventing long-term moisture problems — a detail worth confirming is specified correctly rather than assumed.",
  },
] as const;

export default function PrimarySuiteRemodelingHoustonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Services", href: "/luxury-remodeling-houston" },
          { label: "Primary Suite Remodeling", href: "/primary-suite-remodeling-houston" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Primary Suite Remodeling Houston</p>
          <h1 className="text-4xl md:text-5xl leading-tight">
            Primary Suite Remodeling in Houston
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            A primary suite renovation typically combines a bedroom refresh with a more
            substantial bathroom and closet reconfiguration. Because the suite is used daily and
            privately, the planning priorities are different from a kitchen or living space —
            quieter materials, more deliberate storage, and careful attention to plumbing and
            waterproofing.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="primary_suite_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="bathroom"
        eyebrow="The Primary Bathroom"
        title="Where Most of the Project Lives"
        imageUrl={IMAGES.spaBathroom.url}
        imageAlt={IMAGES.spaBathroom.alt}
      >
        <p>
          The primary bathroom is usually where a suite renovation's budget and technical
          complexity concentrate. Plumbing relocation, waterproofing at the shower and tub,
          exhaust ventilation, and heated floors or towel bars are the decisions that most affect
          both day-to-day comfort and how well the room performs over time.
        </p>
        <p>
          Freestanding tubs, curbless showers, and full-height tile are common at this scope, and
          each has downstream requirements — floor structure and slope for a curbless shower,
          for instance — that are easier to plan for during design than to retrofit once framing
          is complete.
        </p>
        <p>
          Renovating the bathroom on its own, without the bedroom and closet as part of a combined
          suite? See our{" "}
          <a href="/luxury-bathroom-remodeling-houston" className="underline hover:text-bronze-dark">
            bathroom remodeling guide
          </a>{" "}
          instead.
        </p>
      </ImageTextSection>

      <ImageTextSection
        id="closet-bedroom"
        eyebrow="Closet & Bedroom"
        title="Closet Reconfiguration and the Bedroom Itself"
        imageUrl={IMAGES.primarySuiteBedroom.url}
        imageAlt={IMAGES.primarySuiteBedroom.alt}
        imageSide="left"
      >
        <p>
          Custom closet systems are one of the most requested elements of a primary suite project.
          Reconfiguring an existing closet — or, on larger lots, expanding it into an adjacent
          space — is usually more cost-effective than it sounds relative to the daily-use value it
          adds, and it's often coordinated with the bathroom's cabinetry and finish palette.
        </p>
        <p>
          The bedroom portion of the suite is typically the lightest-touch part of the project:
          flooring, paint, lighting, and window treatments, occasionally alongside a fireplace or
          built-in millwork. Homeowners in this category often choose a quieter, more restrained
          material palette here than in more public rooms of the home.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Scope & Sequencing</p>
          <h2 className="text-3xl md:text-4xl mb-8">Standalone Project or Part of Something Larger</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              A primary suite remodel can usually be scoped as a standalone project, separate from
              the rest of the house, since it typically has its own plumbing and electrical runs.
              It's worth confirming this early — in some older homes, the primary bath shares a
              plumbing stack or circuit with an adjacent room, which can widen the project's actual
              footprint.
            </p>
            <p>
              Homeowners planning a broader renovation sometimes choose to include the primary
              suite in a{" "}
              <a href="/whole-home-remodeling-houston" className="underline hover:text-bronze-dark">
                whole-home remodel
              </a>{" "}
              rather than as a separate phase, particularly when the suite sits above or adjacent
              to other areas already being opened up for structural or mechanical work.
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <RelatedServices current="/primary-suite-remodeling-houston" />

      <CTASection
        title="Planning a Primary Suite Renovation?"
        description="Tell us about your project and we'll help determine the right next step."
        location="primary_suite_final_cta"
      />
    </>
  );
}
