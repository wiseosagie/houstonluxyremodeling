type Props = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export default function OptionCard({ label, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full text-left px-6 py-5 border text-base transition-colors duration-400 min-h-[3.25rem] ${
        selected
          ? "border-charcoal bg-charcoal text-white"
          : "border-stone-300 text-charcoal hover:border-bronze-dark"
      }`}
    >
      {label}
    </button>
  );
}
