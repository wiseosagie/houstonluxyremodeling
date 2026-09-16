import Image from "next/image";
import { INSPIRATION_GALLERY } from "@/data/images";

export default function InspirationGallery({
  eyebrow = "Design Inspiration",
  title = "Ideas for Your Home",
}: {
  eyebrow?: string;
  title?: string;
}) {
  return (
    <section className="py-20 md:py-28 bg-stone-50">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="text-3xl md:text-4xl">{title}</h2>
          <p className="mt-4 text-sm text-charcoal-light">
            Editorial imagery for inspiration only — not a portfolio of completed Houston
            Luxury Remodeling projects.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {INSPIRATION_GALLERY.map((image, i) => (
            <div
              key={image.id}
              className={`relative overflow-hidden bg-stone-200 ${
                i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/5]"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                loading="lazy"
                sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
