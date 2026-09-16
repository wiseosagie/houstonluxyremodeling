import OptionCard from "@/components/consultation/OptionCard";

type Option = { value: string; label: string };

type Props = {
  question: string;
  helperText?: string;
  options: readonly Option[];
  value: string;
  onSelect: (value: string) => void;
  onBack?: () => void;
};

export default function StepSingleChoice({
  question,
  helperText,
  options,
  value,
  onSelect,
  onBack,
}: Props) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl mb-2">{question}</h1>
      {helperText && <p className="text-sm text-charcoal-light mb-8">{helperText}</p>}
      {!helperText && <div className="mb-8" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            selected={value === option.value}
            onSelect={() => onSelect(option.value)}
          />
        ))}
      </div>

      {onBack && (
        <button type="button" onClick={onBack} className="btn-ghost mt-10">
          ← Back
        </button>
      )}
    </div>
  );
}
