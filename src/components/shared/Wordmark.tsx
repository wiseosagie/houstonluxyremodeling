import Link from "next/link";

export default function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex flex-col leading-none group"
      aria-label="Houston Luxury Remodeling — home"
    >
      <span
        className={`font-serif text-[0.95rem] md:text-base tracking-[0.14em] ${
          dark ? "text-warmwhite" : "text-charcoal"
        }`}
      >
        HOUSTON
      </span>
      <span
        className={`font-sans text-[0.58rem] md:text-[0.62rem] tracking-widest2 mt-0.5 ${
          dark ? "text-stone-200" : "text-bronze-dark"
        }`}
      >
        LUXURY REMODELING
      </span>
    </Link>
  );
}
