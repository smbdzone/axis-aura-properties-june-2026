import type { Metadata } from "next";
import PropertyListingsSection from "@/components/PropertyListingsSection";
import CommercialHero from "@/components/commercial/CommercialHero";
import NewsletterSection from "@/components/NewsletterSection";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "Commercial | Suits & Sand Real Estate",
  description:
    "Explore prime commercial spaces in Dubai's leading business districts for offices, retail, and investment.",
};

export default function CommercialPage() {
  return (
    <main className="flex flex-1 flex-col">
      <CommercialHero />
      <PropertyListingsSection variant="commercial" />
      <SectionDivider />
      <NewsletterSection />
    </main>
  );
}
