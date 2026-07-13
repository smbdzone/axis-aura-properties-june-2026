import type { TermsSection } from "@/components/data/termsAndConditions";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export async function getTermsAndConditionsSections(): Promise<TermsSection[]> {
  const response = await fetch(
    `${BACKEND_URL}/api/content-pages/terms-and-conditions`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load terms and conditions");
  }

  const data = await response.json();

  if (!Array.isArray(data.sections) || data.sections.length === 0) {
    throw new Error("Terms and conditions content is empty");
  }

  return data.sections;
}
