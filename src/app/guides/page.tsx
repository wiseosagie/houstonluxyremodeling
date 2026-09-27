import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import { OPEN_GRAPH_DEFAULTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Houston Remodeling Guides | Cost & Planning Resources",
  description:
    "Planning and cost guides for Houston homeowners considering a significant renovation — budgeting, contractor selection, and remodel-vs-rebuild decisions.",
  alternates: { canonical: "/guides" },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/guides" },
};

const GUIDES = [
  {
    title: "Home Remodeling Cost Houston",
    description:
      "What drives renovation cost in Houston, and how national, Texas, and local estimates differ.",
    href: "/guides/home-remodeling-cost-houston",
  },
  {
    title: "Whole Home Remodel Cost Houston",
    description:
      "Cost factors specific to whole-home renovations — structure, systems, finishes, and permitting.",
    href: "/guides/whole-home-remodel-cost-houston",
  },
  {
    title: "Kitchen Remodel Cost Houston",
    description: "Cosmetic refresh vs. major renovation vs. luxury custom kitchen — and what separates them.",
    href: "/guides/kitchen-remodel-cost-houston",
  },
  {
    title: "Bathroom Remodel Cost Houston",
    description: "Cosmetic refresh vs. standard renovation vs. full luxury transformation — and what separates them.",
    href: "/guides/bathroom-remodel-cost-houston",
  },
  {
    title: "How to Choose a Remodeling Contractor in Houston",
    description: "Licensing, insurance, references, contracts, and the questions worth asking before you hire.",
    href: "/guides/how-to-choose-remodeling-contractor-houston",
  },
  {
    title: "Remodel vs. Rebuild in Houston",
    description: "How to weigh a major renovation against demolition and new construction.",
    href: "/guides/remodel-or-rebuild-houston",
  },
] as const;

export default function GuidesIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Guides", href: "/guides" }]} />

      <header className="container-page pt-8 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Guides</p>
          <h1 className="text-4xl md:text-5xl leading-tight">Renovation Planning Guides</h1>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-light">
            Practical, plainly written resources for homeowners planning a significant Houston
            renovation — cost expectations, contractor selection, and the decisions worth making
            before design begins.
          </p>
        </div>
      </header>

      <section className="pb-20 md:pb-28 border-t border-stone-200">
        <div className="container-page grid grid-cols-1 md:grid-cols-2 gap-6 pt-16">
          {GUIDES.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group block border border-stone-200 p-8 hover:border-bronze-dark transition-colors duration-400"
            >
              <h2 className="text-2xl font-serif text-charcoal group-hover:text-bronze-dark">
                {guide.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal-light">{guide.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <CTASection
        title="Have a Project Already in Mind?"
        description="Skip ahead — tell us about your renovation and we'll help determine the right next step."
        location="guides_index_final_cta"
      />
    </>
  );
}
