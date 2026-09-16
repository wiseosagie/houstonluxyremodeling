import type { Metadata } from "next";
import ConsultationForm from "@/components/consultation/ConsultationForm";

export const metadata: Metadata = {
  title: "Request a Private Consultation",
  description:
    "Tell us about your Houston renovation project — private, complimentary, and no obligation.",
  alternates: { canonical: "/consultation" },
  robots: { index: true, follow: true },
};

export default function ConsultationPage() {
  return (
    <section className="min-h-[80vh] bg-warmwhite">
      <div className="container-page py-14 md:py-20 max-w-2xl mx-auto">
        <ConsultationForm />
      </div>
    </section>
  );
}
