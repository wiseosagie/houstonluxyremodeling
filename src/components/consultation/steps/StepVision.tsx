"use client";

import { useState } from "react";

type Props = {
  value: string;
  onContinue: (value: string) => void;
  onBack: () => void;
};

export default function StepVision({ value, onContinue, onBack }: Props) {
  const [text, setText] = useState(value);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl mb-2">Tell us about your vision.</h1>
      <p className="text-sm text-charcoal-light mb-8">
        Optional. Tell us what you would like to change, add, improve, or completely reimagine.
      </p>

      <label htmlFor="vision" className="sr-only">
        Project vision
      </label>
      <textarea
        id="vision"
        name="vision"
        rows={6}
        maxLength={2000}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share as much or as little as you'd like..."
        className="w-full border border-stone-300 px-5 py-4 text-base leading-relaxed focus:border-bronze-dark focus:outline-none resize-none"
      />

      <div className="mt-10 flex items-center gap-6">
        <button type="button" onClick={() => onContinue(text)} className="btn-primary">
          Continue
        </button>
        <button type="button" onClick={onBack} className="btn-ghost">
          ← Back
        </button>
      </div>
    </div>
  );
}
