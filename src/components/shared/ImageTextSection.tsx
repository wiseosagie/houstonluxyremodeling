import Image from "next/image";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  imageSide?: "left" | "right";
  children: React.ReactNode;
};

export default function ImageTextSection({
  id,
  eyebrow,
  title,
  imageUrl,
  imageAlt,
  imageSide = "right",
  children,
}: Props) {
  return (
    <section id={id} className="py-16 md:py-20 border-t border-stone-200 scroll-mt-24">
      <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className={imageSide === "left" ? "lg:order-2" : ""}>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="text-3xl md:text-4xl mb-6">{title}</h2>
          <div className="space-y-4 text-base leading-relaxed text-charcoal-light">
            {children}
          </div>
        </div>
        <div className={`relative aspect-[4/5] lg:aspect-[3/4] ${imageSide === "left" ? "lg:order-1" : ""}`}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
