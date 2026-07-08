import type { Metadata } from "next";
import DevelopersGridSection from "@/components/developers/DevelopersGridSection";
import DevelopersHero from "@/components/developers/DevelopersHero";
import DevelopersIntroSection from "@/components/developers/DevelopersIntroSection";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "Developers | Suits & Sand Real Estate",
  description:
    "Discover Dubai's leading real estate developers. Connect with trusted names for luxury homes, iconic towers, and high-yield investments.",
};

export default function DevelopersPage() {
  return (
    <main className="flex flex-1 flex-col">
      <DevelopersHero />
      <DevelopersIntroSection />
      <SectionDivider />
      <DevelopersGridSection />
    </main>
  );
}
