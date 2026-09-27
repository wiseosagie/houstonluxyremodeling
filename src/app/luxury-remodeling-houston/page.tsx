import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import ServiceCard from "@/components/shared/ServiceCard";
import { IMAGES } from "@/data/images";
import { PROJECT_CATEGORIES, NEIGHBORHOODS, SITE_NAME, SITE_URL, OPEN_GRAPH_DEFAULTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Luxury Remodeling in Houston | Whole-Home, Kitchen & More",
  description:
    "A guide to planning a significant Houston home renovation — whole-home remodels, luxury kitchens, primary suites, additions, and outdoor living — plus how to choose the right professional.",
  alternates: { canonical: "/luxury-remodeling-houston" },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/luxury-remodeling-houston" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Residential remodeling and design-build matching",
  name: `Luxury Home Remodeling in Houston | ${SITE_NAME}`,
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: NEIGHBORHOODS.map((n) => ({ "@type": "Place", name: n.name })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Renovation Project Categories",
    itemListElement: PROJECT_CATEGORIES.map((c) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: c.name,
        description: c.description,
      },
    })),
  },
};

const CATEGORY_LINKS = [
  {
    name: "Whole-Home Renovation",
    description: "A coordinated, top-to-bottom reimagining of the home — structure, systems, and interiors together.",
    image: IMAGES.wholeHomeDining,
    href: "/whole-home-remodeling-houston",
  },
  {
    name: "Luxury Kitchen Renovation",
    description: "Layout, custom cabinetry, natural stone, and appliances built for how you live.",
    image: IMAGES.kitchenIsland,
    href: "/luxury-kitchen-remodeling-houston",
  },
  {
    name: "Primary Suite Renovation",
    description: "A spa-inspired bathroom, reconfigured closet, and a quieter bedroom palette.",
    image: IMAGES.spaBathroom,
    href: "/primary-suite-remodeling-houston",
  },
  {
    name: "Home Additions",
    description: "New square footage that reads as original to the home, not appended to it.",
    image: IMAGES.indoorOutdoorLiving,
    href: "/home-additions-houston",
  },
  {
    name: "Luxury Outdoor Living",
    description: "Outdoor kitchens and covered living space built for Houston's climate, year-round.",
    image: IMAGES.poolOutdoorLiving,
    href: "/luxury-outdoor-living-houston",
  },
] as const;

export default function LuxuryRemodelingHoustonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Breadcrumbs items={[{ label: "Luxury Remodeling Houston", href: "/luxury-remodeling-houston" }]} />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Luxury Home Remodeling Houston</p>
          <h1 className="text-4xl md:text-5xl leading-tight">
            Planning a Significant Renovation in Houston
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            High-end home renovation in Houston involves more than selecting finishes. Foundation
            type, drainage, deed restrictions, and permitting timelines all shape what is possible
            on a given lot. This page covers the project categories we're consulted on most often
            and the considerations that matter for a renovation of $100,000 or more.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="service_page_header" />
          </div>
        </div>
      </header>

      <section id="categories" className="py-16 md:py-20 border-t border-stone-200 scroll-mt-24">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Project Categories</p>
            <h2 className="text-3xl md:text-4xl">Renovations We're Most Often Consulted On</h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-light">
              Each category below has its own dedicated guide covering scope, sequencing, and the
              planning considerations specific to that type of project.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-12">
            {CATEGORY_LINKS.map((card) => (
              <ServiceCard
                key={card.name}
                name={card.name}
                description={card.description}
                imageUrl={card.image.url}
                imageAlt={card.image.alt}
                href={card.href}
              />
            ))}
          </div>
          <p className="mt-12 max-w-2xl text-sm leading-relaxed text-charcoal-light">
            Renovating a bathroom on its own rather than the full primary suite? Our{" "}
            <a href="/luxury-bathroom-remodeling-houston" className="underline hover:text-bronze-dark">
              bathroom remodeling guide
            </a>{" "}
            covers that project.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Planning Considerations</p>
          <h2 className="text-3xl md:text-4xl mb-8">What Shapes a Houston Renovation Budget</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              <strong className="text-charcoal">Foundation and soil.</strong> Much of Houston sits
              on expansive clay soil, and older homes are a mix of slab and pier-and-beam
              foundations. Foundation condition can materially change the cost and sequencing of a
              renovation, and it's worth having evaluated before scope is finalized.
            </p>
            <p>
              <strong className="text-charcoal">Flood plain and drainage.</strong> Some Houston
              neighborhoods include properties in or near mapped flood plains. Depending on
              location, this can affect elevation requirements for additions and the permitting
              timeline. A qualified professional should be able to speak to this for your specific
              address.
            </p>
            <p>
              <strong className="text-charcoal">Deed restrictions and neighborhood character.</strong>{" "}
              Established neighborhoods such as{" "}
              <a href="/houston" className="underline hover:text-bronze-dark">
                River Oaks, Memorial, Tanglewood, and West University
              </a>{" "}
              often carry deed restrictions or civic association guidelines that affect setbacks,
              height, and exterior materials. These should be reviewed early, not after design is
              underway.
            </p>
            <p>
              <strong className="text-charcoal">Permitting timelines.</strong> The City of Houston's
              permitting process, and any applicable HOA or civic association review, both take
              time. Renovations that involve structural changes, additions, or new plumbing/electrical
              circuits typically require permits — budget realistic time for this in your project
              timeline.
            </p>
            <p>
              For a fuller breakdown of what drives renovation cost in Houston specifically, see
              our{" "}
              <a href="/guides/home-remodeling-cost-houston" className="underline hover:text-bronze-dark">
                Houston home remodeling cost guide
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="design-build" className="py-16 md:py-20 border-t border-stone-200 scroll-mt-24">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Design-Build Considerations</p>
          <h2 className="text-3xl md:text-4xl mb-8">Design-Build, Architect-Led, or General Contractor</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              There is no universally correct structure for a renovation team — the right choice
              depends on project complexity, how much design input you want, and how you prefer to
              manage risk.
            </p>
            <p>
              <strong className="text-charcoal">Design-build</strong> firms manage both design and
              construction under one contract, which can simplify communication and accountability
              for a project of this size, particularly for whole-home renovations and additions.
            </p>
            <p>
              <strong className="text-charcoal">Architect-led</strong> projects separate design from
              construction, which can allow for more independent design oversight, generally at the
              cost of coordinating two separate contracts.
            </p>
            <p>
              <strong className="text-charcoal">General contractor only</strong> arrangements suit
              homeowners who already have completed architectural or design plans and need
              construction expertise to execute them.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Choosing a Professional</p>
          <h2 className="text-3xl md:text-4xl mb-8">Due Diligence Before You Hire</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              Whichever structure you choose, and whether or not a professional is introduced to
              you through this service, we encourage every homeowner to independently verify
              licensing, insurance, references, and contract terms before signing anything. Our{" "}
              <a href="/guides/how-to-choose-remodeling-contractor-houston" className="underline hover:text-bronze-dark">
                guide to choosing a remodeling contractor in Houston
              </a>{" "}
              walks through what to check and what to ask.
            </p>
            <p>
              Houston Luxury Remodeling helps connect homeowners with participating professionals
              but does not perform construction, employ contractors, or guarantee the performance of
              any professional. See our{" "}
              <a href="/matching-service-disclosure" className="underline hover:text-bronze-dark">
                Matching Service Disclosure
              </a>{" "}
              for full detail.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="Discuss Your Project With Us"
        description="A short, private questionnaire helps us understand your renovation before any introduction is made."
        location="service_page_final_cta"
      />
    </>
  );
}
