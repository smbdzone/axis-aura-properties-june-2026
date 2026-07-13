import type { Metadata } from "next";
import PrivacyPolicyContent from "@/components/privacy-policy/PrivacyPolicyContent";
import PrivacyPolicyHero from "@/components/privacy-policy/PrivacyPolicyHero";
import SectionDivider from "@/components/SectionDivider";
import { getPrivacyPolicySections } from "@/lib/contentPages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy | Axis Aura Real Estate",
  description:
    "Read the Axis Aura Real Estate privacy policy to understand how we collect, use, and protect your personal information across our property platform.",
};

export default async function PrivacyPolicyPage() {
  let sections: Awaited<ReturnType<typeof getPrivacyPolicySections>> = [];

  try {
    sections = await getPrivacyPolicySections();
  } catch {
    sections = [];
  }

  return (
    <main className="flex flex-1 flex-col gap-13 pt-[124px]">
      <PrivacyPolicyHero />

      <section
        aria-label="Privacy policy introduction"
        className="flex w-full items-center justify-center gap-2.5 px-6 lg:px-24"
      >
        <p className="w-full max-w-[1248px] text-center font-heading text-[clamp(1.25rem,2.5vw,2rem)] font-medium capitalize leading-[120%] text-[#333333]/70">
          Transparent practices for your data and peace of mind.
        </p>
      </section>

      <SectionDivider />
      <PrivacyPolicyContent sections={sections} />
    </main>
  );
}
