import Link from "next/link";
import LocationCard from "@/components/shared/LocationCard";
import { NEIGHBORHOODS } from "@/lib/constants";

export default function AreasServed() {
  return (
    <section className="py-20 md:py-28 bg-stone-50">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Areas We Serve</p>
          <h2 className="text-3xl md:text-4xl">Beginning With Houston's Most Established Neighborhoods</h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {NEIGHBORHOODS.map((n) => (
            <LocationCard key={n.slug} name={n.name} description={n.description} />
          ))}
        </div>

        <Link href="/houston" className="btn-ghost mt-10 inline-flex">
          View All Areas We Serve →
        </Link>
      </div>
    </section>
  );
}
