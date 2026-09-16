const PILLARS = [
  {
    title: "Considered Matching",
    description:
      "Every project is reviewed individually before any introduction is made — not distributed to a list of contractors.",
  },
  {
    title: "Discretion",
    description:
      "Your project details are treated as private. We ask only what is necessary to understand your renovation.",
  },
  {
    title: "Project Seriousness",
    description:
      "Our process is built around significant renovations — the questions we ask reflect that scope.",
  },
  {
    title: "No Obligation",
    description:
      "Requesting a consultation does not commit you to any professional, timeline, or next step.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Why Homeowners Use This Service</p>
          <h2 className="text-3xl md:text-4xl">A More Considered Way to Begin a Renovation</h2>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {PILLARS.map((pillar) => (
            <div key={pillar.title}>
              <h3 className="text-lg font-serif">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
