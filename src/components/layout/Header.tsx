"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import Wordmark from "@/components/shared/Wordmark";
import PrimaryCta from "@/components/shared/PrimaryCta";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-warmwhite/95 backdrop-blur border-b border-stone-100">
      <div className="container-page flex h-20 items-center justify-between">
        <Wordmark />

        <nav className="hidden lg:flex items-center gap-10" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide ${
                pathname === link.href
                  ? "text-bronze-dark"
                  : "text-charcoal-light hover:text-bronze-dark"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <PrimaryCta
            href="/consultation"
            label="Request a Private Consultation"
            location="header"
            className="!py-3 !px-5 text-xs"
          />
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex flex-col justify-center gap-1.5 h-10 w-10"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-px w-6 bg-charcoal transition-transform duration-400 ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-charcoal transition-transform duration-400 ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="lg:hidden border-t border-stone-100 bg-warmwhite">
          <nav className="container-page flex flex-col py-6 gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base border-b border-stone-100 last:border-none"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-5">
              <PrimaryCta
                href="/consultation"
                label="Request a Private Consultation"
                location="mobile_menu"
                className="w-full"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
