type QA = { question: string; answer: string };

type Props = {
  title?: string;
  eyebrow?: string;
  items: readonly QA[];
};

export default function PageFAQ({ title = "Questions Homeowners Ask", eyebrow = "Frequently Asked", items }: Props) {
  return (
    <section className="py-16 md:py-20 border-t border-stone-200">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="text-3xl md:text-4xl">{title}</h2>
        </div>

        <div className="mt-12 max-w-3xl divide-y divide-stone-200 border-t border-b border-stone-200">
          {items.map((faq) => (
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
