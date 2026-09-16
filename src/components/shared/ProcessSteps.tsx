import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export default function ProcessSteps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 ${compact ? "gap-10" : "gap-14"}`}>
      {HOW_IT_WORKS_STEPS.map((step) => (
        <div key={step.number} className="border-t border-stone-300 pt-6">
          <span className="font-serif text-3xl text-bronze-dark">{step.number}</span>
          <h3 className="mt-4 text-xl">{step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-charcoal-light">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
