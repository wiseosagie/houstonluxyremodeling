"use client";

import { useState } from "react";

export type ContactValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: boolean;
};

type Props = {
  value: ContactValues;
  onSubmit: (value: ContactValues, website: string) => void;
  onBack: () => void;
  submitting: boolean;
  submitError: string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()+.-]{7,20}$/;

export default function StepContact({ value, onSubmit, onBack, submitting, submitError }: Props) {
  const [form, setForm] = useState(value);
  const [touched, setTouched] = useState(false);
  // Honeypot: a hidden field a real visitor never sees, tabs to, or fills.
  // Bots that auto-fill every input on the form populate it, which the API
  // uses to silently discard the submission. See src/app/api/leads/route.ts.
  const [website, setWebsite] = useState("");

  const errors = {
    firstName: form.firstName.trim().length === 0,
    lastName: form.lastName.trim().length === 0,
    email: !EMAIL_RE.test(form.email.trim()),
    phone: !PHONE_RE.test(form.phone.trim()),
    consent: !form.consent,
  };
  const isValid = !Object.values(errors).some(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isValid) onSubmit(form, website);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="text-2xl md:text-3xl mb-2">How can we reach you?</h1>
      <p className="text-sm text-charcoal-light mb-8">
        Your information is kept private. See our Privacy Policy for detail.
      </p>

      {/* Honeypot — visually hidden and unreachable by keyboard/screen reader
          for real visitors; only a bot filling every field will populate it. */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-xs uppercase tracking-widest2 text-charcoal-light mb-2">
            First name
          </label>
          <input
            id="firstName"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full border border-stone-300 px-5 py-4 text-base focus:border-bronze-dark focus:outline-none"
          />
          {touched && errors.firstName && <p className="mt-1 text-sm text-red-700">Required</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-xs uppercase tracking-widest2 text-charcoal-light mb-2">
            Last name
          </label>
          <input
            id="lastName"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full border border-stone-300 px-5 py-4 text-base focus:border-bronze-dark focus:outline-none"
          />
          {touched && errors.lastName && <p className="mt-1 text-sm text-red-700">Required</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-widest2 text-charcoal-light mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-stone-300 px-5 py-4 text-base focus:border-bronze-dark focus:outline-none"
          />
          {touched && errors.email && <p className="mt-1 text-sm text-red-700">Enter a valid email</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-widest2 text-charcoal-light mb-2">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-stone-300 px-5 py-4 text-base focus:border-bronze-dark focus:outline-none"
          />
          {touched && errors.phone && <p className="mt-1 text-sm text-red-700">Enter a valid phone number</p>}
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-charcoal-light">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          className="mt-1 h-4 w-4 shrink-0"
        />
        <span>
          I consent to Houston Luxury Remodeling contacting me about my project by phone, text, or
          email, and to my information being shared with a relevant participating professional in
          accordance with the{" "}
          <a href="/privacy" target="_blank" className="underline hover:text-bronze-dark">
            Privacy Policy
          </a>
          .
        </span>
      </label>
      {touched && errors.consent && (
        <p className="mt-1 text-sm text-red-700">Consent is required to submit this form</p>
      )}

      {submitError && (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      <div className="mt-10 flex items-center gap-6">
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
          {submitting ? "Submitting…" : "Request My Private Consultation"}
        </button>
        <button type="button" onClick={onBack} disabled={submitting} className="btn-ghost">
          ← Back
        </button>
      </div>
    </form>
  );
}
