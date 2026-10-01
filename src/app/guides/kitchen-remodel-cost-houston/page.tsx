import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import CTASection from "@/components/shared/CTASection";
import CostTable from "@/components/shared/CostTable";
import PageFAQ from "@/components/shared/PageFAQ";
import { ORGANIZATION_ID, SITE_NAME, SITE_URL, OPEN_GRAPH_DEFAULTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kitchen Remodel Cost Houston (2026) | By Renovation Tier",
  description:
    "Kitchen remodel cost in Houston, broken down by tier — cosmetic refresh, mid-range renovation, and luxury custom kitchen — with what separates each.",
  alternates: { canonical: "/guides/kitchen-remodel-cost-houston" },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, url: "/guides/kitchen-remodel-cost-houston" },
};

const PUBLISHED = "2026-09-20";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Kitchen Remodel Cost Houston: By Renovation Tier",
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  author: { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL },
  publisher: { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL },
  mainEntityOfPage: `${SITE_URL}/guides/kitchen-remodel-cost-houston`,
};

const TIER_ROWS = [
  {
    label: "Cosmetic refresh",
    value: "Roughly $20,000–$45,000",
    note: "Cabinet refacing or paint, new countertops, and updated fixtures within the existing layout. National/regional published estimate.",
  },
  {
    label: "Mid-range renovation",
    value: "Roughly $45,000–$80,000",
    note: "New cabinetry, stone counters, and appliances, with modest layout adjustments. National/regional published estimate.",
  },
  {
    label: "Luxury / custom kitchen",
    value: "Roughly $80,000–$150,000+",
    note: "Layout changes, custom or semi-custom cabinetry, natural stone, and professional-grade or integrated appliances. Published contractor and industry estimates; projects with extensive structural change or premium material selections can run well above this range.",
  },
] as const;

const FAQS = [
  {
    question: "What separates a mid-range kitchen remodel from a luxury one?",
    answer:
      "Layout change is the clearest dividing line. A mid-range remodel typically keeps the kitchen's existing footprint and plumbing/electrical locations, updating cabinets, counters, and appliances in place. A luxury remodel more often relocates walls, plumbing, or gas lines, uses custom-built cabinetry, and specifies natural stone and professional-grade appliances — each of which adds cost beyond materials alone.",
  },
  {
    question: "Why do professional-grade appliances add so much to the budget?",
    answer:
      "Beyond the appliances' own cost, professional-grade ranges and integrated refrigeration often require upgraded gas line capacity, dedicated ventilation, and additional electrical circuits — infrastructure costs that a standard appliance package doesn't require.",
  },
  {
    question: "Is it worth getting multiple bids for a kitchen remodel?",
    answer:
      "Yes, and it's worth confirming each bid covers the same scope before comparing numbers. Two bids for 'a kitchen remodel' can vary enormously if one assumes stock cabinetry and laminate counters and the other assumes custom cabinetry and natural stone — the scope, not just the price, needs to match before a comparison is meaningful.",
  },
] as const;

export default function KitchenRemodelCostHoustonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          { label: "Kitchen Remodel Cost Houston", href: "/guides/kitchen-remodel-cost-houston" },
        ]}
      />

      <article className="container-page max-w-3xl pt-8 pb-20 md:pb-28">
        <p className="eyebrow mb-4">Kitchen Remodel Cost Houston</p>
        <h1 className="text-4xl md:text-5xl leading-tight mb-6">
          Kitchen Remodel Cost, By Renovation Tier
        </h1>
        <p className="text-sm text-charcoal-light mb-10">Published: September 2026</p>

        <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
          <p>
            "Kitchen remodel cost" spans an unusually wide range because a kitchen renovation can
            mean anything from refacing existing cabinets to a full layout change with custom
            cabinetry and natural stone. The tier below the project falls into matters more to
            cost than square footage.
          </p>
          <p>
            Published estimates vary by source and change over time; treat these as reference
            points for planning conversations, not as a quote for your specific kitchen.
          </p>
        </div>

        <CostTable rows={TIER_ROWS} caption="Figures reflect widely published national and regional contractor estimates as of 2026, not proprietary Houston-specific data. Actual bids depend on layout, material selections, and appliance package." />

        <h2 className="text-3xl mt-14 mb-4">Cosmetic Refresh vs. Major Renovation vs. Luxury Custom Kitchen</h2>
        <div className="space-y-6 text-base leading-relaxed text-charcoal-light">
          <p>
            <strong className="text-charcoal">Cosmetic refresh.</strong> The layout, plumbing, and
            electrical stay where they are. New paint or cabinet refacing, countertops, a
            backsplash, and fixtures update the room's appearance without touching its bones. This
            is the fastest and least disruptive tier, and the one where cost estimates are most
            consistent across sources.
          </p>
          <p>
            <strong className="text-charcoal">Mid-range renovation.</strong> New cabinetry and
            stone counters, updated appliances, and possibly a modest layout adjustment — moving
            an island or reconfiguring a pantry — without a full gut of the space. Most of the
            room's existing plumbing and electrical infrastructure is reused.
          </p>
          <p>
            <strong className="text-charcoal">Luxury / custom kitchen.</strong> Layout changes are
            common — removed walls, relocated plumbing or gas lines — alongside custom or
            semi-custom cabinetry built to the room, natural stone or quartzite surfaces, and
            integrated or professional-grade appliances. This tier is covered in more depth in our{" "}
            <a href="/luxury-kitchen-remodeling-houston" className="underline hover:text-bronze-dark">
              luxury kitchen remodeling guide
            </a>
            .
          </p>
        </div>

        <h2 className="text-3xl mt-14 mb-4">Why Scope Matters More Than a Single Number</h2>
        <p className="text-base leading-relaxed text-charcoal-light">
          The biggest mistake in kitchen budgeting isn't picking the wrong number — it's not
          knowing which tier a quoted number describes. Before comparing estimates from different
          sources or contractors, confirm whether each figure assumes a layout change, the
          cabinetry type, and the appliance tier. Those three variables explain most of the
          difference between a $30,000 kitchen and a $150,000 one.
        </p>
      </article>

      <PageFAQ items={FAQS} />

      <CTASection
        title="Ready to Scope Your Kitchen Project?"
        description="A short, private questionnaire helps us understand your kitchen renovation before any introduction is made."
        location="kitchen_cost_final_cta"
      />
    </>
  );
}
