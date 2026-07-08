import type { Metadata } from "next";
import PropertyListingsSection from "@/components/PropertyListingsSection";
import ResidentialHero from "@/components/residential/ResidentialHero";
import NewsletterSection from "@/components/NewsletterSection";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "Residential | Suits & Sand Real Estate",
  description:
    "Discover stunning residential homes across Dubai, from luxury villas to sleek apartments.",
};

export default function ResidentialPage() {
  return (
    <main className="flex flex-1 flex-col">
      <ResidentialHero />
      <PropertyListingsSection variant="residential" />
      <SectionDivider />
      <NewsletterSection />
    </main>
  );
}
