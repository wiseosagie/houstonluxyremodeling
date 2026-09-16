import { FAQS } from "@/lib/constants";

function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FAQ() {
  return (
    <section className="py-20 md:py-28">
      <FaqJsonLd />
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Frequently Asked</p>
          <h2 className="text-3xl md:text-4xl">Questions Homeowners Ask</h2>
        </div>

        <div className="mt-14 max-w-3xl divide-y divide-stone-200 border-t border-b border-stone-200">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-base md:text-lg font-serif list-none">
                {faq.question}
                <span className="shrink-0 text-bronze-dark transition-transform duration-400 group-open:rotate-45 text-xl">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-charcoal-light">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
