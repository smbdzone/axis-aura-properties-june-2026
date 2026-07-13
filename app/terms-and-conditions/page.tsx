import type { Metadata } from "next";
import SectionDivider from "@/components/SectionDivider";
import TermsAndConditionsContent from "@/components/terms-and-conditions/TermsAndConditionsContent";
import TermsAndConditionsHero from "@/components/terms-and-conditions/TermsAndConditionsHero";
import { getTermsAndConditionsSections } from "@/lib/termsContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms & Conditions | Axis Aura Real Estate",
  description:
    "Read the Axis Aura Real Estate terms and conditions governing use of our property platform, listings, enquiries, and related services in the UAE.",
};

export default async function TermsAndConditionsPage() {
  let sections: Awaited<ReturnType<typeof getTermsAndConditionsSections>> = [];

  try {
    sections = await getTermsAndConditionsSections();
  } catch {
    sections = [];
  }

  return (
    <main className="flex flex-1 flex-col gap-13 pt-[124px]">
      <TermsAndConditionsHero />

      <section
        aria-label="Terms and conditions introduction"
        className="flex w-full items-center justify-center gap-2.5 px-6 lg:px-24"
      >
        <p className="w-full max-w-[1248px] text-center font-heading text-[clamp(1.25rem,2.5vw,2rem)] font-medium capitalize leading-[120%] text-[#333333]/70">
          Clear guidelines for using our platform with confidence.
        </p>
      </section>

      <SectionDivider />
      <TermsAndConditionsContent sections={sections} />
    </main>
  );
}
