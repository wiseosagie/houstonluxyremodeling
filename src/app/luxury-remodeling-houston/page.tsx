import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import { IMAGES } from "@/data/images";
import { PROJECT_CATEGORIES, NEIGHBORHOODS, SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Luxury Remodeling in Houston | Whole-Home, Kitchen & More",
  description:
    "A guide to planning a significant Houston home renovation — whole-home remodels, luxury kitchens, primary suites, additions, and outdoor living — plus how to choose the right professional.",
  alternates: { canonical: "/luxury-remodeling-houston" },
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

function Section({
  id,
  eyebrow,
  title,
  imageUrl,
  imageAlt,
  imageSide = "right",
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  imageSide?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-16 md:py-20 border-t border-stone-200 scroll-mt-24">
      <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className={imageSide === "left" ? "lg:order-2" : ""}>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="text-3xl md:text-4xl mb-6">{title}</h2>
          <div className="space-y-4 text-base leading-relaxed text-charcoal-light">
            {children}
          </div>
        </div>
        <div className={`relative aspect-[4/5] lg:aspect-[3/4] ${imageSide === "left" ? "lg:order-1" : ""}`}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

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

      <Section
        id="whole-home"
        eyebrow="Whole-Home Renovation"
        title="Whole-Home Renovation"
        imageUrl={IMAGES.livingFormal.url}
        imageAlt={IMAGES.livingFormal.alt}
      >
        <p>
          A whole-home renovation reconsiders the residence as a single, coordinated project —
          layout, structure, systems, and interiors developed together rather than room by room.
          For many Houston homeowners, this is driven by a home that no longer suits how the
          family lives: closed-off floor plans from an earlier era, insufficient natural light, or
          mechanical, electrical, and plumbing systems reaching the end of their service life.
        </p>
        <p>
          Whole-home projects typically require closer coordination between design and
          construction than single-room remodels, since structural, HVAC, and electrical decisions
          in one area affect the rest of the house. Homeowners considering this scope should expect
          a longer planning phase up front, generally in exchange for fewer surprises during
          construction.
        </p>
      </Section>

      <Section
        id="kitchen"
        eyebrow="Luxury Kitchen Renovation"
        title="Luxury Kitchen Renovation"
        imageUrl={IMAGES.kitchenIsland.url}
        imageAlt={IMAGES.kitchenIsland.alt}
        imageSide="left"
      >
        <p>
          The kitchen is the room most frequently renovated on its own, and the one where layout
          decisions carry outsized weight. Island proportions, appliance placement, pantry
          circulation, and sightlines into adjacent living space typically matter more to daily
          use than any single finish choice.
        </p>
        <p>
          Natural stone, custom cabinetry, and integrated appliance panels are common in this
          price range, and each comes with its own lead time — slab selection and cabinetry
          fabrication in particular are frequently the pacing items on a kitchen renovation
          schedule, not the construction itself.
        </p>
      </Section>

      <Section
        id="primary-suite"
        eyebrow="Primary Suite Renovation"
        title="Primary Suite Renovation"
        imageUrl={IMAGES.spaBathroom.url}
        imageAlt={IMAGES.spaBathroom.alt}
      >
        <p>
          Primary suite renovations typically combine a bedroom refresh with a more substantial
          bathroom and closet reconfiguration. Plumbing relocation, waterproofing detail at wet
          areas, and ventilation are the technical considerations that most affect both cost and
          long-term performance.
        </p>
        <p>
          Because the primary suite is used daily and privately, homeowners in this category often
          prioritize a quieter, more restrained material palette than in more public rooms of the
          home — a distinction worth raising early with any professional you're evaluating.
        </p>
      </Section>

      <Section
        id="home-addition"
        eyebrow="Home Additions"
        title="Home Additions"
        imageUrl={IMAGES.indoorOutdoorLiving.url}
        imageAlt={IMAGES.indoorOutdoorLiving.alt}
        imageSide="left"
      >
        <p>
          Additions add square footage — a primary suite wing, a second story, expanded living
          space — while ideally reading as original to the home rather than appended to it. That
          requires early attention to roofline, setback, and exterior material matching, in
          addition to the structural work itself.
        </p>
        <p>
          In much of Houston, additions also raise foundation and drainage questions specific to
          the site: many neighborhoods sit on expansive clay soils, and some parcels fall within or
          near a flood plain, which can affect elevation requirements and permitting. These are
          questions worth raising with any professional before finalizing scope.
        </p>
      </Section>

      <Section
        id="outdoor-living"
        eyebrow="Outdoor Living"
        title="Outdoor Living"
        imageUrl={IMAGES.poolOutdoorLiving.url}
        imageAlt={IMAGES.poolOutdoorLiving.alt}
      >
        <p>
          Given Houston's climate, outdoor living space functions as usable square footage for
          much of the year. Covered living areas, outdoor kitchens, and pools are frequently
          planned together with interior renovations so that indoor and outdoor spaces read as one
          continuous design, particularly where disappearing glass walls connect the two.
        </p>
        <p>
          Drainage and grading are especially important for outdoor projects in this region —
          decisions made here affect not only the new construction but how water moves around the
          existing house.
        </p>
      </Section>

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
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-stone-200">
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
              you through this service, we encourage every homeowner to independently verify:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Current Texas business registration and appropriate licensing or trade certifications</li>
              <li>General liability insurance and workers' compensation coverage</li>
              <li>References from projects of comparable scope, ideally completed in the last two years</li>
              <li>A clear, written contract with a defined scope, payment schedule, and change-order process</li>
            </ul>
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
