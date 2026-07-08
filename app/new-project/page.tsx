import type { Metadata } from "next";
import PropertyListingsSection from "@/components/PropertyListingsSection";
import NewProjectHero from "@/components/new-project/NewProjectHero";
import SectionDivider from "@/components/SectionDivider";
import MostLuxury from "@/components/MostLuxury";
import NewsletterSection from "@/components/NewsletterSection";

export const metadata: Metadata = {
  title: "New Projects | Suits & Sand Real Estate",
  description:
    "Explore the latest new property launches and premium developments across the UAE.",
};

export default function NewProjectPage() {
  return (
    <main className="flex flex-1 flex-col">
      <NewProjectHero />
      <PropertyListingsSection />
      <SectionDivider />
      <MostLuxury variant="centered" />
      <NewsletterSection />
    </main>
  );
}
