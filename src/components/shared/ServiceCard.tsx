import Image from "next/image";
import Link from "next/link";

type Props = {
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
};

export default function ServiceCard({ name, description, imageUrl, imageAlt, href }: Props) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-5 text-lg font-serif text-charcoal group-hover:text-bronze-dark">
        {name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{description}</p>
    </Link>
  );
}
