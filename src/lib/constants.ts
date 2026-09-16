export const SITE_NAME = "Houston Luxury Remodeling";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.houstonluxuryremodeling.com";

export const NAV_LINKS = [
  { href: "/luxury-remodeling-houston", label: "Services" },
  { href: "/houston", label: "Areas We Serve" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/consultation", label: "Consultation" },
] as const;

export const PROJECT_CATEGORIES = [
  {
    slug: "whole-home",
    name: "Whole Home",
    formLabel: "Whole-home renovation",
    description:
      "A coordinated, top-to-bottom reimagining of the home — architecture, interiors, and systems working as one.",
  },
  {
    slug: "kitchen",
    name: "Kitchen",
    formLabel: "Kitchen",
    description:
      "The heart of the home, reconsidered: layout, custom cabinetry, natural stone, and appliances built for how you live.",
  },
  {
    slug: "primary-suite",
    name: "Primary Suite",
    formLabel: "Primary suite",
    description:
      "A private retreat — spa-inspired bathrooms, considered closets, and a bedroom designed for calm.",
  },
  {
    slug: "home-addition",
    name: "Home Addition",
    formLabel: "Home addition",
    description:
      "Thoughtful square footage that reads as original to the home, not appended to it.",
  },
  {
    slug: "outdoor-living",
    name: "Outdoor Living",
    formLabel: "Outdoor living",
    description:
      "Pools, kitchens, and living spaces that extend the home into Houston's climate, year-round.",
  },
] as const;

export const NEIGHBORHOODS = [
  {
    slug: "river-oaks",
    name: "River Oaks",
    zipPrefixes: ["77019", "77027", "77098"],
    description:
      "Houston's most established address for architectural significance, where renovations are held to the standard of the neighborhood's original craftsmanship.",
  },
  {
    slug: "memorial",
    name: "Memorial",
    zipPrefixes: ["77024", "77079", "77094"],
    description:
      "Wooded, private lots and a mix of architectural styles make Memorial a frequent setting for whole-home renovations and significant additions.",
  },
  {
    slug: "tanglewood",
    name: "Tanglewood",
    zipPrefixes: ["77056", "77063"],
    description:
      "Tanglewood's mid-century and transitional homes are frequently reimagined for contemporary family life while preserving neighborhood character.",
  },
  {
    slug: "west-university",
    name: "West University",
    zipPrefixes: ["77005"],
    description:
      "A walkable, tightly-knit community where thoughtful additions and full renovations allow homeowners to stay rather than relocate.",
  },
] as const;

export const BUDGET_OPTIONS = [
  { value: "under_50k", label: "Under $50,000" },
  { value: "50k_100k", label: "$50,000–$100,000" },
  { value: "100k_250k", label: "$100,000–$250,000" },
  { value: "250k_500k", label: "$250,000–$500,000" },
  { value: "500k_1m", label: "$500,000–$1 million" },
  { value: "1m_plus", label: "$1 million+" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "immediately", label: "Immediately" },
  { value: "1_3_months", label: "1–3 months" },
  { value: "3_6_months", label: "3–6 months" },
  { value: "6_12_months", label: "6–12 months" },
  { value: "researching", label: "Researching" },
] as const;

export const DESIGN_STATUS_OPTIONS = [
  { value: "need_design_and_construction", label: "Need design + construction" },
  { value: "working_with_designer", label: "Working with a designer" },
  { value: "plans_completed", label: "Architectural plans completed" },
  { value: "need_contractor_only", label: "Need contractor only" },
  { value: "not_sure", label: "Not sure" },
] as const;

export const PROJECT_TYPE_OPTIONS = [
  ...PROJECT_CATEGORIES.map((c) => ({ value: c.slug, label: c.formLabel })),
  { value: "other", label: "Other" },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Tell Us About Your Home",
    description:
      "Share your project type, ZIP code, investment range, timeline, and where you are in the design process.",
  },
  {
    number: "02",
    title: "We Review Your Project",
    description:
      "Your project is reviewed to understand its scope and to determine the appropriate type of remodeling or design-build professional.",
  },
  {
    number: "03",
    title: "Meet Your Match",
    description:
      "Qualified projects may be introduced to an appropriate participating professional for further discussion.",
  },
] as const;

export const FAQS = [
  {
    question: "Is Houston Luxury Remodeling a construction company?",
    answer:
      "No. We are a matching and referral service. We do not perform construction, and we do not employ contractors or designers. We help Houston homeowners planning significant renovations connect with experienced, independent remodeling and design-build professionals.",
  },
  {
    question: "Is there a cost to use this service?",
    answer:
      "There is no cost to submit your project information or request a consultation. We ask a few questions so we can understand your project before any introduction is made.",
  },
  {
    question: "What size of project is this service designed for?",
    answer:
      "We focus primarily on residential renovation projects of $100,000 and above, including whole-home renovations, luxury kitchens, primary suites, additions, and outdoor living. Smaller projects are welcome to submit as well.",
  },
  {
    question: "Will I definitely be matched with a professional?",
    answer:
      "Not every submission results in an introduction. Each project is reviewed individually, and we make introductions only when we believe there is an appropriate fit. We encourage every homeowner to conduct their own due diligence before hiring any professional.",
  },
  {
    question: "What happens after I submit my consultation request?",
    answer:
      "Your information is reviewed to understand the scope, location, and timeline of your project. If appropriate, we will reach out to discuss next steps or facilitate an introduction to a participating professional.",
  },
  {
    question: "Is my information kept private?",
    answer:
      "Yes. We take the privacy of your project details seriously. Information you submit is used to evaluate your project and, with appropriate care, may be shared with a relevant participating professional. See our Privacy Policy for full detail.",
  },
] as const;
