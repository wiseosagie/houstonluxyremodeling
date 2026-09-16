import Link from "next/link";
import PrimaryCta from "@/components/shared/PrimaryCta";

export default function NotFound() {
  return (
    <div className="container-page py-24 md:py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="text-3xl md:text-5xl mb-6">This Page Could Not Be Found</h1>
      <p className="max-w-md mx-auto text-base leading-relaxed text-charcoal-light mb-10">
        The page you're looking for may have moved. Explore our services or begin a private
        consultation.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <PrimaryCta href="/" label="Return to Homepage" location="404_page" />
        <Link href="/consultation" className="btn-secondary">
          Request a Consultation
        </Link>
      </div>
    </div>
  );
}
