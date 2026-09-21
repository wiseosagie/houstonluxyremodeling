import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import PrimaryCta from "@/components/shared/PrimaryCta";
import ImageTextSection from "@/components/shared/ImageTextSection";
import PageFAQ from "@/components/shared/PageFAQ";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "Afton Oaks Remodeling | Renovation Planning Guide",
  description:
    "Planning a renovation in Afton Oaks — deed restrictions, architectural review, and what homeowners in this Inner Loop, Galleria-area neighborhood should know.",
  alternates: { canonical: "/afton-oaks-remodeling" },
};

const FAQS = [
  {
    question: "Does Afton Oaks require approval before starting a renovation or addition?",
    answer:
      "Afton Oaks is a deed-restricted neighborhood, and the Afton Oaks Civic Club's Architectural Review Committee reviews exterior additions, renovations, and new construction for compliance with the neighborhood's deed restrictions, alongside standard City of Houston permitting. Confirming what applies to your specific lot — restrictions are recorded by section — is a necessary early step, not a formality.",
  },
  {
    question: "Are most Afton Oaks homes original construction or already renovated?",
    answer:
      "It's a genuine mix. Afton Oaks was developed in the 1950s, and the neighborhood today includes original ranch homes, homes that have been substantially renovated over the years, and newer custom construction built on cleared lots — so renovation scope varies significantly from one property to the next.",
  },
  {
    question: "How does Afton Oaks compare to River Oaks or Tanglewood for a renovation project?",
    answer:
      "The underlying considerations are similar — deed-restricted, tree-canopied, inside-the-Loop lots with an active civic association reviewing exterior changes — but Afton Oaks lots and homes generally run smaller than River Oaks estates, and the neighborhood's proximity to the Galleria and Highland Village gives it a more urban, walkable character than the larger-lot feel of Memorial or Tanglewood.",
  },
] as const;

export default function AftonOaksRemodelingPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Houston", href: "/houston" },
          { label: "Afton Oaks Remodeling", href: "/afton-oaks-remodeling" },
        ]}
      />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Afton Oaks Remodeling</p>
          <h1 className="text-4xl md:text-5xl leading-tight">Renovation Planning for Afton Oaks</h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            Afton Oaks is a deed-restricted, oak-canopied neighborhood inside Loop 610, tucked
            between Westheimer and the Southwest Freeway near the Galleria and Highland Village.
            Renovating here means working within an established civic association review process
            on a mix of original mid-century homes and newer custom construction.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/consultation" label="Request a Private Consultation" location="afton_oaks_header" />
          </div>
        </div>
      </header>

      <ImageTextSection
        id="character"
        eyebrow="Character & Housing Stock"
        title="Mid-Century Ranch Homes Alongside New Construction"
        imageUrl={IMAGES.exteriorDaylight.url}
        imageAlt={IMAGES.exteriorDaylight.alt}
      >
        <p>
          Developed in the 1950s, Afton Oaks is a compact, roughly 525-home neighborhood defined
          by mature live oak trees, brick walkways, and a genuine mix of housing vintages —
          original ranch-style homes, homes that have been substantially renovated over the
          decades, and newer custom construction built where earlier homes were replaced.
        </p>
        <p>
          That mix means renovation scope varies widely from lot to lot. A homeowner in an
          untouched 1950s ranch is often looking at a whole-home renovation addressing layout,
          electrical capacity, and plumbing together, while a home already updated in the past
          decade may only need a kitchen or bathroom refresh to bring it current.
        </p>
      </ImageTextSection>

      <ImageTextSection
        id="considerations"
        eyebrow="Planning Considerations"
        title="Deed Restrictions and Architectural Review"
        imageUrl={IMAGES.livingFormal.url}
        imageAlt={IMAGES.livingFormal.alt}
        imageSide="left"
      >
        <p>
          Afton Oaks sits within the City of Houston, so structural, electrical, plumbing, and
          addition work goes through the standard City of Houston permitting process. The
          neighborhood has also maintained deed restrictions since its original development, and
          the Afton Oaks Civic Club's Architectural Review Committee reviews exterior additions,
          renovations, and new construction for compliance — a step that runs alongside, not
          instead of, city permitting.
        </p>
        <p>
          Because deed restrictions are recorded by section and lot, and were last substantively
          amended in 2000, it's worth confirming exactly what applies to a specific property
          before finalizing an exterior design, rather than assuming the same rules apply
          neighborhood-wide.
        </p>
      </ImageTextSection>

      <section className="py-16 md:py-20 border-t border-stone-200 bg-stone-50">
        <div className="container-page max-w-3xl">
          <p className="eyebrow mb-4">Common Project Types</p>
          <h2 className="text-3xl md:text-4xl mb-8">What Homeowners in Afton Oaks Typically Renovate</h2>
          <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
            <p>
              Homeowners in original 1950s homes most often pursue{" "}
              <a href="/whole-home-remodeling-houston" className="underline hover:text-bronze-dark">
                whole-home renovations
              </a>{" "}
              that update layout and systems together, frequently centered on a{" "}
              <a href="/luxury-kitchen-remodeling-houston" className="underline hover:text-bronze-dark">
                kitchen renovation
              </a>{" "}
              or a{" "}
              <a href="/luxury-bathroom-remodeling-houston" className="underline hover:text-bronze-dark">
                bathroom renovation
              </a>{" "}
              as the centerpiece.
            </p>
            <p>
              Given the neighborhood's proximity to the Galleria and its smaller, more urban lots
              relative to Memorial or Tanglewood,{" "}
              <a href="/home-additions-houston" className="underline hover:text-bronze-dark">
                second-story additions
              </a>{" "}
              are a common way to add space without expanding the home's footprint.
            </p>
          </div>
        </div>
      </section>

      <PageFAQ items={FAQS} />

      <CTASection
        title="Planning a Renovation in Afton Oaks?"
        description="Tell us about your home and project and we'll help determine the right next step."
        location="afton_oaks_final_cta"
      />
    </>
  );
}
