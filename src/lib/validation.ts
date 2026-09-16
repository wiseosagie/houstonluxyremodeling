import { z } from "zod";
import {
  BUDGET_OPTIONS,
  DESIGN_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  TIMELINE_OPTIONS,
} from "./constants";

const valuesOf = <T extends readonly { value: string }[]>(options: T) =>
  options.map((o) => o.value) as [string, ...string[]];

export const leadSubmissionSchema = z.object({
  projectType: z.enum(valuesOf(PROJECT_TYPE_OPTIONS)),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code"),
  budgetRange: z.enum(valuesOf(BUDGET_OPTIONS)),
  timeline: z.enum(valuesOf(TIMELINE_OPTIONS)),
  designStatus: z.enum(valuesOf(DESIGN_STATUS_OPTIONS)),
  projectDescription: z.string().trim().max(2000).optional().default(""),
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+.-]{7,20}$/, "Enter a valid phone number"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to submit this form" }),
  }),

  // Attribution — all optional, populated client-side from the URL/session.
  source: z.string().trim().max(200).optional().default(""),
  medium: z.string().trim().max(200).optional().default(""),
  campaign: z.string().trim().max(200).optional().default(""),
  content: z.string().trim().max(200).optional().default(""),
  term: z.string().trim().max(200).optional().default(""),
  landingPage: z.string().trim().max(500).optional().default(""),
  referrer: z.string().trim().max(500).optional().default(""),

  // Spam protection.
  website: z.string().max(0).optional().default(""), // honeypot — must stay empty
  formStartedAt: z.number().optional(),
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;
