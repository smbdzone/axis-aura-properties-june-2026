import type { Metadata } from "next";
import CareerHero from "@/components/career/CareerHero";
import CareerOpenPositionsSection from "@/components/career/CareerOpenPositionsSection";
import CareerWhyJoinSection from "@/components/career/CareerWhyJoinSection";
import NewsletterSection from "@/components/NewsletterSection";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "Careers | Suits & Sand Real Estate",
  description:
    "Join Suits & Sand Real Estate and build your career in Dubai's premium property market.",
};

export default function CareerPage() {
  return (
    <main className="flex flex-1 flex-col">
      <CareerHero />
      <SectionDivider />
      <CareerOpenPositionsSection />
      <SectionDivider />
      <CareerWhyJoinSection />
      <SectionDivider />
      <div className="mt-20">
      <NewsletterSection  />
      </div>
    </main>
  );
}
