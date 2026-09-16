const TOTAL_STEPS = 7;

const STEP_LABELS = [
  "Project",
  "Location",
  "Investment",
  "Timeline",
  "Design Status",
  "Vision",
  "Contact",
];

export default function FormProgress({ step }: { step: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest2 text-bronze-dark">
          Step {step} of {TOTAL_STEPS}
        </p>
        <p className="text-xs uppercase tracking-widest2 text-charcoal-light">
          {STEP_LABELS[step - 1]}
        </p>
      </div>
      <div className="flex gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 ${i < step ? "bg-bronze-dark" : "bg-stone-200"}`}
          />
        ))}
      </div>
    </div>
  );
}
