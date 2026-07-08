import type { Metadata } from "next";
import { faqCategories } from "@/components/data/faqCategories";
import FaqCategorySection from "@/components/faq/FaqCategorySection";
import HeroBarFAQ from "@/components/faq/HeroBarFAQ";
import SectionDivider from "@/components/SectionDivider";

export const metadata: Metadata = {
  title: "FAQs | Axis-Aura Properties",
  description:
    "Find answers to frequently asked questions about buying, selling, and investing in Dubai real estate with Suits & Sand.",
};

export default function FaqPage() {
  return (
    <main className="flex flex-1 flex-col gap-13 pt-[124px]">
      <HeroBarFAQ />

      <section
        aria-label="FAQ introduction"
        className="flex w-full items-center justify-center gap-2.5 px-6 lg:px-24"
      >
        <p className="w-full max-w-[1248px] text-center font-heading text-[clamp(1.25rem,2.5vw,2rem)] font-medium capitalize leading-[120%] text-[#333333]/70">
          Need help? Check out our most asked questions.
        </p>
      </section>
      <SectionDivider />

      <div className="flex flex-col gap-10 mb-20">
        {faqCategories.map((category) => (
          <FaqCategorySection key={category.title} category={category} />
        ))}
      </div>
    </main>
  );
}
