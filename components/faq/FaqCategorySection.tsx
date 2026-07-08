"use client";

import Image from "next/image";
import { useState } from "react";
import type { FaqCategory } from "@/components/data/faqCategories";

const FAQ_ARROW_SRC = "/New folder/right.svg";

type FaqCategorySectionProps = {
  category: FaqCategory;
};

export default function FaqCategorySection({
  category,
}: FaqCategorySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = category.items[activeIndex];

  return (
    <section
      aria-labelledby={`faq-category-${category.title.replace(/\s+/g, "-").toLowerCase()}`}
      className="flex w-full justify-center px-6 lg:px-24"
    >
      <div className="flex w-full max-w-[1248px] flex-col gap-4">
        <h2
          id={`faq-category-${category.title.replace(/\s+/g, "-").toLowerCase()}`}
          className="font-heading text-[clamp(2rem,4vw,3rem)] font-bold capitalize leading-[120%] text-black"
        >
          {category.title}
        </h2>

        <div className="flex flex-col items-stretch gap-6 lg:flex-row">
          <div className="flex w-full flex-col gap-4 lg:max-w-[718px] lg:flex-1">
            {category.items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={`${item.question}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={isActive}
                  className={`relative isolate flex h-[100px] w-full items-center justify-between gap-4 rounded-2xl border-[1.5px] border-accent-light px-8 py-4 text-left shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-opacity hover:opacity-95 ${isActive ? "ring-2 ring-accent-light/80 ring-offset-2" : ""
                    }`}
                  style={{ background: "var(--gradient-dark-metallic)" }}
                >
                  <span className="min-w-0 flex-1 font-heading text-lg font-medium leading-6 text-white">
                    {item.question}
                  </span>

                  <Image
                    src={FAQ_ARROW_SRC}
                    alt=""
                    width={28}
                    height={38}
                    className="h-[34px] w-[28px] shrink-0 brightness-0 invert"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div className="relative isolate flex min-h-[448px] w-full flex-col rounded-2xl border-[1.5px] border-accent-light bg-white p-3 shadow-[0_0_40px_rgba(0,0,0,0.15)] lg:w-[506px] lg:shrink-0">
            <div className="flex min-h-[129px] flex-col items-center justify-center border-b-[1.5px] border-accent-light px-3 py-4">
              <h3 className="w-full text-justify font-heading text-2xl font-medium leading-[31px] text-primary">
                {activeItem.question}
              </h3>
            </div>

            <p className="mt-2.5 w-full px-3 text-justify font-sans text-xl font-normal leading-[200%] text-[#333333]/80">
              {activeItem.answer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
