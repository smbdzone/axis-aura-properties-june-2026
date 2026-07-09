import type { Metadata } from "next";
import { faqCategories, type FaqCategory } from "@/components/data/faqCategories";
import FaqCategorySection from "@/components/faq/FaqCategorySection";
import HeroBarFAQ from "@/components/faq/HeroBarFAQ";
import SectionDivider from "@/components/SectionDivider";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export const metadata: Metadata = {
  title: "FAQs | Axis-Aura Properties",
  description:
    "Find answers to frequently asked questions about buying, selling, and investing in Dubai real estate with Axis Aura.",
};

type BackendFaq = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
};

async function getFaqCategories(): Promise<FaqCategory[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/faqs`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to load FAQs");

    const faqs = (await response.json()) as BackendFaq[];
    if (!Array.isArray(faqs) || faqs.length === 0) return faqCategories;

    const grouped: FaqCategory[] = [];
    const indexByTitle = new Map<string, number>();

    for (const faq of faqs) {
      if (!faq.question || !faq.answer) continue;
      const title = faq.category?.trim() || "General";
      let index = indexByTitle.get(title);
      if (index === undefined) {
        index = grouped.length;
        indexByTitle.set(title, index);
        grouped.push({ title, items: [] });
      }
      grouped[index].items.push({ question: faq.question, answer: faq.answer });
    }

    return grouped.length > 0 ? grouped : faqCategories;
  } catch {
    return faqCategories;
  }
}

export default async function FaqPage() {
  const categories = await getFaqCategories();

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
        {categories.map((category) => (
          <FaqCategorySection key={category.title} category={category} />
        ))}
      </div>
    </main>
  );
}
