"use client";

import { useState } from "react";

type Props = {
  value: string;
  onContinue: (value: string) => void;
  onBack: () => void;
};

export default function StepLocation({ value, onContinue, onBack }: Props) {
  const [zip, setZip] = useState(value);
  const [touched, setTouched] = useState(false);

  const isValid = /^\d{5}$/.test(zip);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl mb-2">Where is the property located?</h1>
      <p className="text-sm text-charcoal-light mb-8">Enter the property's ZIP code.</p>

      <label htmlFor="zip" className="sr-only">
        ZIP code
      </label>
      <input
        id="zip"
        name="zip"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={5}
        autoComplete="postal-code"
        placeholder="e.g. 77019"
        value={zip}
        onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
        onBlur={() => setTouched(true)}
        className="w-full border border-stone-300 px-5 py-4 text-lg tracking-wide focus:border-bronze-dark focus:outline-none"
      />
      {touched && !isValid && (
        <p className="mt-2 text-sm text-red-700">Enter a valid 5-digit ZIP code.</p>
      )}

      <div className="mt-10 flex items-center gap-6">
        <button
          type="button"
          disabled={!isValid}
          onClick={() => onContinue(zip)}
          className="btn-primary disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue
        </button>
        <button type="button" onClick={onBack} className="btn-ghost">
          ← Back
        </button>
      </div>
    </div>
  );
}
