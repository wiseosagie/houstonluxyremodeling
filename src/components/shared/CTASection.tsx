import PrimaryCta from "@/components/shared/PrimaryCta";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  location: string;
  dark?: boolean;
};

export default function CTASection({
  eyebrow = "Private Consultation",
  title,
  description,
  ctaLabel = "Request a Private Consultation",
  location,
  dark = true,
}: Props) {
  return (
    <section className={dark ? "bg-charcoal text-white" : "bg-stone-50 text-charcoal"}>
      <div className="container-page py-20 md:py-24 text-center">
        <p className={`eyebrow mb-4 ${dark ? "text-stone-300" : ""}`}>{eyebrow}</p>
        <h2 className={`text-3xl md:text-4xl max-w-2xl mx-auto ${dark ? "text-white" : ""}`}>{title}</h2>
        {description && (
          <p
            className={`mt-5 max-w-xl mx-auto text-base leading-relaxed ${
              dark ? "text-stone-200" : "text-charcoal-light"
            }`}
          >
            {description}
          </p>
        )}
        <div className="mt-10 flex justify-center">
          <PrimaryCta
            href="/consultation"
            label={ctaLabel}
            location={location}
            className={
              dark ? "!bg-white !text-charcoal hover:!bg-bronze-light hover:!text-white" : ""
            }
          />
        </div>
        <p className={`mt-5 text-xs uppercase tracking-widest2 ${dark ? "text-stone-400" : "text-charcoal-light"}`}>
          Private &nbsp;•&nbsp; Complimentary &nbsp;•&nbsp; No Obligation
        </p>
      </div>
    </section>
  );
}
