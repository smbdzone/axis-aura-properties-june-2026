"use client";

import { useState } from "react";
import {
  countWords,
  type PropertyDetail,
  type PropertyFAQ,
} from "@/components/data/propertyDetails";
import PropertyFAQModal from "@/components/property-detail/PropertyFAQModal";
import PropertyNavArrow from "@/components/property-detail/PropertyNavArrow";

type PropertyFAQSectionProps = {
  property: PropertyDetail;
};

type FAQCardSize = "large" | "medium" | "small";

const cardSizes: Record<
  FAQCardSize,
  {
    width: string;
    height: string;
    padding: string;
    radius: string;
    gap: string;
    question: string;
    answer: string;
  }
> = {
  large: {
    width: "w-[530px] max-w-full",
    height: "h-[249px]",
    padding: "p-8",
    radius: "rounded-3xl",
    gap: "gap-8",
    question: "text-2xl leading-[33px]",
    answer: "text-xl leading-[150%]",
  },
  medium: {
    width: "w-[430px]",
    height: "h-[201px]",
    padding: "p-6",
    radius: "rounded-[19px]",
    gap: "gap-6",
    question: "text-[19px] leading-[27px]",
    answer: "text-base leading-[150%]",
  },
  small: {
    width: "w-[330px]",
    height: "h-[156px]",
    padding: "p-5",
    radius: "rounded-[15px]",
    gap: "gap-5",
    question: "text-[15px] leading-5",
    answer: "text-[12.5px] leading-[150%]",
  },
};

function FAQCard({
  question,
  answer,
  size,
  onReadMore,
}: {
  question: string;
  answer: string;
  size: FAQCardSize;
  onReadMore: (faq: PropertyFAQ) => void;
}) {
  const config = cardSizes[size];
  const isActiveCard = size === "large";
  const showReadMore = isActiveCard && countWords(answer) > 6;

  return (
    <div
      className={`relative isolate flex shrink-0 flex-col overflow-hidden border border-accent-light ${config.width} ${config.height} ${config.padding} ${config.radius}`}
      style={{ background: "var(--gradient-dark-metallic)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-primary"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-48 h-[757px] w-20 rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-44 -top-5 h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />

      <div
        className={`relative z-10 flex h-full min-h-0 flex-col ${config.gap}`}
      >
        <h3
          className={`shrink-0 border-b border-accent-light pb-2 font-heading font-bold text-white ${config.question}`}
        >
          {question}
        </h3>
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <p
            className={[
              "overflow-hidden font-sans text-white/80",
              isActiveCard ? "line-clamp-1" : "line-clamp-2",
              config.answer,
            ].join(" ")}
          >
            {answer}
          </p>
          {showReadMore && (
            <button
              type="button"
              onClick={() => onReadMore({ question, answer })}
              className="mt-auto ml-auto w-fit cursor-pointer self-end font-sans text-sm text-white underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              Read More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PropertyFAQSection({
  property,
}: PropertyFAQSectionProps) {
  const { faqs } = property;
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedFaq, setSelectedFaq] = useState<PropertyFAQ | null>(null);

  if (faqs.length === 0) return null;

  const faqTitle = `${property.title} FAQ's`;

  const goToPrevious = () => {
    setActiveIndex((index) => (index === 0 ? faqs.length - 1 : index - 1));
  };

  const goToNext = () => {
    setActiveIndex((index) => (index === faqs.length - 1 ? 0 : index + 1));
  };

  const getFaqAt = (offset: number) => {
    const index = (activeIndex + offset + faqs.length) % faqs.length;
    return faqs[index];
  };

  const activeFaq = faqs[activeIndex];
  const secondFaq = faqs.length > 1 ? getFaqAt(1) : null;
  const thirdFaq = faqs.length > 2 ? getFaqAt(2) : null;

  const openReadMore = (faq: PropertyFAQ) => {
    setSelectedFaq(faq);
  };

  const closeReadMore = () => {
    setSelectedFaq(null);
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="relative w-full px-6 py-12 lg:px-24"
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-8">
        <h2
          id="faq-heading"
          className="w-full text-center font-heading text-[clamp(2rem,3vw,3rem)] font-bold leading-tight text-black"
        >
          {faqTitle}
        </h2>

        <div className="relative flex w-full items-center justify-center">
          <PropertyNavArrow
            direction="left"
            label="Previous FAQ"
            onClick={goToPrevious}
            className="absolute left-0 z-20 hidden -translate-x-full lg:flex"
          />

          <div className="relative mx-auto hidden h-[249px] w-full max-w-[1098px] lg:block">
            <div className="absolute left-0 top-0 z-30">
              <FAQCard
                question={activeFaq.question}
                answer={activeFaq.answer}
                size="large"
                onReadMore={openReadMore}
              />
            </div>

            {secondFaq && (
              <div className="absolute left-[384px] top-[23px] z-20">
                <FAQCard
                  question={secondFaq.question}
                  answer={secondFaq.answer}
                  size="medium"
                  onReadMore={openReadMore}
                />
              </div>
            )}

            {thirdFaq && (
              <div className="absolute left-[768px] top-[47px] z-10">
                <FAQCard
                  question={thirdFaq.question}
                  answer={thirdFaq.answer}
                  size="small"
                  onReadMore={openReadMore}
                />
              </div>
            )}
          </div>

          <div className="w-full max-w-[530px] lg:hidden">
            <FAQCard
              question={activeFaq.question}
              answer={activeFaq.answer}
              size="large"
              onReadMore={openReadMore}
            />
          </div>

          <PropertyNavArrow
            direction="right"
            label="Next FAQ"
            onClick={goToNext}
            className="absolute right-0 z-20 hidden translate-x-full lg:flex"
          />
        </div>

        <div className="flex items-center gap-4 lg:hidden">
          <PropertyNavArrow
            direction="left"
            label="Previous FAQ"
            onClick={goToPrevious}
          />
          <span className="font-sans text-sm text-black/60">
            {activeIndex + 1} / {faqs.length}
          </span>
          <PropertyNavArrow
            direction="right"
            label="Next FAQ"
            onClick={goToNext}
          />
        </div>
      </div>

      <PropertyFAQModal
        faq={selectedFaq}
        isOpen={selectedFaq !== null}
        onClose={closeReadMore}
      />
    </section>
  );
}
