import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import AttributionInit from "@/components/analytics/AttributionInit";
import {
  SITE_NAME,
  SITE_URL,
  NEIGHBORHOODS,
  CONTACT_PHONE,
  GSC_VERIFICATION,
  OPEN_GRAPH_DEFAULTS,
} from "@/lib/constants";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Private Houston Renovation Consultation`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Houston Luxury Remodeling connects homeowners planning significant residential renovations with experienced Houston remodeling and design-build professionals.",
  // No `url` here: it would be inherited as og:url by every page that doesn't
  // override it. Pages set their own og:url to match their canonical.
  openGraph: { ...OPEN_GRAPH_DEFAULTS },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: GSC_VERIFICATION ? { google: GSC_VERIFICATION } : undefined,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  logo: `${SITE_URL}/opengraph-image`,
  description:
    "A matching and referral service connecting Houston homeowners with independent remodeling and design-build professionals.",
  areaServed: [
    { "@type": "City", name: "Houston, TX" },
    ...NEIGHBORHOODS.map((n) => ({ "@type": "Place", name: n.name })),
  ],
  ...(CONTACT_PHONE
    ? {
        contactPoint: {
          "@type": "ContactPoint",
          telephone: CONTACT_PHONE,
          contactType: "customer service",
          areaServed: "US",
        },
      }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <GoogleAnalytics />
        <AttributionInit />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-charcoal focus:text-white focus:px-4 focus:py-3"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
