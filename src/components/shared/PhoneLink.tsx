"use client";

import { trackEvent } from "@/lib/gtag";
import { CONTACT_PHONE } from "@/lib/constants";

export default function PhoneLink({ className }: { className?: string }) {
  const phone = CONTACT_PHONE;
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
