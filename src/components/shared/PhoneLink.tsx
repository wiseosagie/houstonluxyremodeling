"use client";

import { trackEvent } from "@/lib/gtag";

export default function PhoneLink({ className }: { className?: string }) {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  if (!phone) return null;

  return (
    <a
      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
      className={className}
      onClick={() => trackEvent("phone_clicked", { phone })}
    >
      {phone}
    </a>
  );
}
