import ServiceCard from "@/components/shared/ServiceCard";
import { IMAGES } from "@/data/images";

const CATEGORY_CARDS = [
  {
    name: "Whole Home",
    description: "A coordinated renovation of the entire residence.",
    image: IMAGES.wholeHomeDining,
    href: "/luxury-remodeling-houston#whole-home",
  },
  {
    name: "Kitchen",
    description: "Layout, cabinetry, and stone built for how you live.",
    image: IMAGES.kitchenIsland,
    href: "/luxury-remodeling-houston#kitchen",
  },
  {
    name: "Primary Suite",
    description: "A private, spa-inspired retreat within the home.",
    image: IMAGES.primarySuiteBedroom,
    href: "/luxury-remodeling-houston#primary-suite",
  },
  {
    name: "Home Addition",
    description: "New square footage that feels original to the home.",
    image: IMAGES.indoorOutdoorLiving,
    href: "/luxury-remodeling-houston#home-addition",
  },
  {
    name: "Outdoor Living",
    description: "Pools, kitchens, and living space for Houston's climate.",
    image: IMAGES.poolOutdoorLiving,
    href: "/luxury-remodeling-houston#outdoor-living",
  },
] as const;

export default function CategoryGrid() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Project Categories</p>
          <h2 className="text-3xl md:text-4xl">Renovations We're Most Often Consulted On</h2>
        </div>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-12">
          {CATEGORY_CARDS.map((card) => (
            <ServiceCard
              key={card.name}
              name={card.name}
              description={card.description}
              imageUrl={card.image.url}
              imageAlt={card.image.alt}
              href={card.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
