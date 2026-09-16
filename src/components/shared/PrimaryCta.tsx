"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/gtag";

type Props = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  location: string;
  className?: string;
};

export default function PrimaryCta({ href, label, variant = "primary", location, className }: Props) {
  const base =
    variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "btn-ghost";

  return (
    <Link
      href={href}
      className={`${base} ${className ?? ""}`}
      onClick={() => trackEvent("primary_cta_clicked", { cta_label: label, cta_location: location })}
    >
      {label}
    </Link>
  );
}
