"use client";

import { useEffect, useRef, useState } from "react";
import FormProgress from "@/components/consultation/FormProgress";
import StepSingleChoice from "@/components/consultation/steps/StepSingleChoice";
import StepLocation from "@/components/consultation/steps/StepLocation";
import StepVision from "@/components/consultation/steps/StepVision";
import StepContact, { ContactValues } from "@/components/consultation/steps/StepContact";
import ConfirmationScreen from "@/components/consultation/ConfirmationScreen";
import {
  BUDGET_OPTIONS,
  DESIGN_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/lib/constants";
import { trackEvent } from "@/lib/gtag";
import { captureAttribution } from "@/lib/attribution";

type FormState = {
  projectType: string;
  zipCode: string;
  budgetRange: string;
  timeline: string;
  designStatus: string;
  projectDescription: string;
  contact: ContactValues;
};

const INITIAL_STATE: FormState = {
  projectType: "",
  zipCode: "",
  budgetRange: "",
  timeline: "",
  designStatus: "",
  projectDescription: "",
  contact: { firstName: "", lastName: "", email: "", phone: "", consent: false },
};

const STEP_NAMES = [
  "project_type",
  "location",
  "budget",
  "timeline",
  "design_status",
  "vision",
  "contact",
];

export default function ConsultationForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const formStartedAt = useRef<number>(0);
  const started = useRef(false);

  useEffect(() => {
    formStartedAt.current = Date.now();
    captureAttribution();
    if (!started.current) {
      started.current = true;
      trackEvent("consultation_started");
    }
  }, []);

  function completeStep(stepNumber: number) {
    trackEvent("consultation_step_completed", {
      step_number: stepNumber,
      step_name: STEP_NAMES[stepNumber - 1],
    });
    setStep(stepNumber + 1);
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit(contact: ContactValues) {
    setSubmitting(true);
    setSubmitError(null);

    const attribution = captureAttribution();

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType: form.projectType,
          zipCode: form.zipCode,
          budgetRange: form.budgetRange,
          timeline: form.timeline,
          designStatus: form.designStatus,
          projectDescription: form.projectDescription,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          consent: contact.consent,
          source: attribution.source,
          medium: attribution.medium,
          campaign: attribution.campaign,
          content: attribution.content,
          term: attribution.term,
          landingPage: attribution.landingPage,
          referrer: attribution.referrer,
          website: "",
          formStartedAt: formStartedAt.current,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }

      setForm((f) => ({ ...f, contact }));
      trackEvent("consultation_submitted", {
        project_type: form.projectType,
        budget_range: form.budgetRange,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We were unable to submit your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <ConfirmationScreen firstName={form.contact.firstName} />;
  }

  return (
    <div>
      <FormProgress step={step} />

      {step === 1 && (
        <StepSingleChoice
          question="What are you considering?"
          options={PROJECT_TYPE_OPTIONS}
          value={form.projectType}
          onSelect={(v) => {
            setForm({ ...form, projectType: v });
            completeStep(1);
          }}
        />
      )}

      {step === 2 && (
        <StepLocation
          value={form.zipCode}
          onContinue={(v) => {
            setForm({ ...form, zipCode: v });
            completeStep(2);
          }}
          onBack={goBack}
        />
      )}

      {step === 3 && (
        <StepSingleChoice
          question="What level of investment are you considering?"
          helperText="This helps us match your project with an appropriately experienced professional."
          options={BUDGET_OPTIONS}
          value={form.budgetRange}
          onSelect={(v) => {
            setForm({ ...form, budgetRange: v });
            completeStep(3);
          }}
          onBack={goBack}
        />
      )}

      {step === 4 && (
        <StepSingleChoice
          question="When would you like to begin?"
          options={TIMELINE_OPTIONS}
          value={form.timeline}
          onSelect={(v) => {
            setForm({ ...form, timeline: v });
            completeStep(4);
          }}
          onBack={goBack}
        />
      )}

      {step === 5 && (
        <StepSingleChoice
          question="Where are you in the design process?"
          options={DESIGN_STATUS_OPTIONS}
          value={form.designStatus}
          onSelect={(v) => {
            setForm({ ...form, designStatus: v });
            completeStep(5);
          }}
          onBack={goBack}
        />
      )}

      {step === 6 && (
        <StepVision
          value={form.projectDescription}
          onContinue={(v) => {
            setForm({ ...form, projectDescription: v });
            completeStep(6);
          }}
          onBack={goBack}
        />
      )}

      {step === 7 && (
        <StepContact
          value={form.contact}
          onSubmit={handleSubmit}
          onBack={goBack}
          submitting={submitting}
          submitError={submitError}
        />
      )}
    </div>
  );
}
