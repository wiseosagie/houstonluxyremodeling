import Image from "next/image";
import PrimaryCta from "@/components/shared/PrimaryCta";
import { IMAGES } from "@/data/images";

export default function Hero() {
  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-charcoal">
      <Image
        src={IMAGES.heroExterior.url}
        alt={IMAGES.heroExterior.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-charcoal/20" />

      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="container-page pb-16 md:pb-24">
          <p className="eyebrow text-stone-200 mb-6">Houston, Texas</p>
          <h1 className="max-w-3xl text-4xl md:text-6xl font-serif text-white leading-[1.08]">
            Exceptional Houston Homes Deserve Exceptional Renovations
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-stone-100 leading-relaxed">
            Connect with experienced Houston remodeling and design-build professionals for
            significant residential renovations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <PrimaryCta
              href="/consultation"
              label="Request a Private Consultation"
              location="hero"
              variant="primary"
              className="!bg-white !text-charcoal hover:!bg-bronze-light hover:!text-white"
            />
            <PrimaryCta
              href="/how-it-works"
              label="Find My Remodeling Partner"
              location="hero"
              variant="secondary"
              className="!border-white !text-white hover:!border-bronze-light hover:!text-bronze-light"
            />
          </div>

          <p className="mt-6 text-xs uppercase tracking-widest2 text-stone-300">
            Private &nbsp;•&nbsp; Complimentary &nbsp;•&nbsp; No Obligation
          </p>
        </div>
      </div>
    </section>
  );
}
