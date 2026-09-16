"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

// Mounted once in the root layout so UTM parameters are captured on the very
// first page a visitor lands on, not only when they reach /consultation.
export default function AttributionInit() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
