import Link from "next/link";

export default function ConfirmationScreen({ firstName }: { firstName: string }) {
  return (
    <div className="text-center py-8">
      <p className="eyebrow mb-4">Thank You{firstName ? `, ${firstName}` : ""}</p>
      <h1 className="text-3xl md:text-4xl mb-6">Your Project Information Has Been Received</h1>
      <p className="max-w-xl mx-auto text-base leading-relaxed text-charcoal-light">
        We'll review the details of your project to determine the appropriate next step. If your
        renovation is a fit for the service, we'll follow up by phone or email.
      </p>
      <p className="max-w-xl mx-auto mt-4 text-sm text-charcoal-light">
        In the meantime, feel free to explore ideas for your home or learn more about how the
        process works.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="btn-primary">
          Return to Homepage
        </Link>
        <Link href="/luxury-remodeling-houston" className="btn-secondary">
          Explore Design Inspiration
        </Link>
      </div>
    </div>
  );
}
