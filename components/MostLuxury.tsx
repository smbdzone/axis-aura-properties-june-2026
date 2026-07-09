"use client";

import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import LuxuryPropertyCard from "@/components/card/LuxuryPropertyCard";
import type { LuxuryProperty } from "@/components/data/luxuryProperties";

type MostLuxuryProps = {
  variant?: "default" | "centered";
};

export default function MostLuxury({ variant = "default" }: MostLuxuryProps) {
  const isCentered = variant === "centered";
  const [activeIndex, setActiveIndex] = useState(0);
  const [luxuryProperties, setLuxuryProperties] = useState<LuxuryProperty[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/properties/luxury")
      .then((response) => response.json())
      .then((data: { properties?: LuxuryProperty[] }) => {
        if (cancelled) return;
        setLuxuryProperties(data.properties ?? []);
        setActiveIndex(0);
      })
      .catch(() => {
        if (!cancelled) setLuxuryProperties([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const total = luxuryProperties.length;

  const goToPrevious = () => {
    setActiveIndex((index) => (index === 0 ? total - 1 : index - 1));
  };

  const goToNext = () => {
    setActiveIndex((index) => (index === total - 1 ? 0 : index + 1));
  };

  return (
    <section
      aria-labelledby="most-luxury-heading"
      className="flex w-full flex-col gap-10 px-4 py-10 min-[701px]:gap-12 min-[701px]:px-6 min-[701px]:py-12 lg:gap-16 lg:px-24 lg:py-16"
    >
      <header
        className={[
          "mx-auto flex w-full max-w-7xl flex-col gap-2.5",
          isCentered ? "items-center text-center" : "",
        ].join(" ")}
      >
        <div
          className={[
            "flex w-full items-center gap-4",
            isCentered ? "justify-center" : "justify-between",
          ].join(" ")}
        >
          <h2
            id="most-luxury-heading"
            className="font-heading text-[clamp(2rem,5vw,3.75rem)] font-bold leading-tight text-primary min-[701px]:text-4xl sm:text-5xl lg:text-6xl"
          >
            Most Luxury
          </h2>

          {!isCentered ? (
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Previous luxury property"
                className="flex items-center justify-center rounded-full border border-primary p-2.5 transition-opacity hover:opacity-90"
              >
                <LuChevronLeft className="size-7 text-primary" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next luxury property"
                className="flex items-center justify-center rounded-full border border-primary p-2.5 transition-opacity hover:opacity-90"
              >
                <LuChevronRight className="size-7 text-primary" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
        <p
          className={[
            "font-heading text-[clamp(1.25rem,4vw,1.5rem)] font-bold capitalize min-[701px]:text-2xl sm:text-3xl lg:text-4xl",
            isCentered ? "text-primary/60" : "text-primary",
          ].join(" ")}
        >
          The pinnacle of luxury in the UAE.
        </p>
        <p className="max-w-7xl font-heading text-[clamp(0.9375rem,3.5vw,1.125rem)] font-medium capitalize leading-relaxed text-black/60 min-[701px]:text-lg sm:text-xl sm:leading-8">
          Expensive ultra luxury living with the UAE&apos;s most exclusive branded
          residences and elite waterfront villas. Designed for the global elite,
          these premier properties offer unmatched architectural masterpiece,
          private amenities, and a legendary lifestyle.
        </p>

        {isCentered ? (
          <div className="mt-2 hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous luxury property"
              className="flex items-center justify-center rounded-full border border-primary p-2.5 transition-opacity hover:opacity-90"
            >
              <LuChevronLeft className="size-7 text-primary" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next luxury property"
              className="flex items-center justify-center rounded-full border border-primary p-2.5 transition-opacity hover:opacity-90"
            >
              <LuChevronRight className="size-7 text-primary" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </header>

      {total === 0 ? (
        <p className="mx-auto w-full max-w-7xl py-12 text-center font-heading text-xl text-black/50">
          No luxury properties to show yet. Please check back soon.
        </p>
      ) : (
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-6">
        <div className="hidden min-[701px]:block w-full">
          <LuxuryPropertyCard property={luxuryProperties[activeIndex]} />
        </div>

        <div className="flex w-full max-w-sm flex-col items-center gap-6 min-[701px]:hidden">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous luxury property"
              className="flex size-11 items-center justify-center rounded-lg border border-primary transition-opacity hover:opacity-90"
              style={{ background: "var(--gradient-metallic)" }}
            >
              <LuChevronLeft className="size-5 text-white" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next luxury property"
              className="flex size-11 items-center justify-center rounded-lg border border-primary transition-opacity hover:opacity-90"
              style={{ background: "var(--gradient-metallic)" }}
            >
              <LuChevronRight className="size-5 text-white" aria-hidden="true" />
            </button>
          </div>

          <LuxuryPropertyCard property={luxuryProperties[activeIndex]} />

          <p className="font-sans text-sm text-black/50" aria-live="polite">
            {activeIndex + 1} / {total}
          </p>
        </div>

        <div className="mt-2 hidden items-center justify-center gap-6 min-[701px]:mt-8 min-[701px]:flex lg:hidden">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous luxury property"
            className="flex size-11 items-center justify-center rounded-lg border border-primary transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-metallic)" }}
          >
            <LuChevronLeft className="size-5 text-white" aria-hidden="true" />
          </button>
          <p className="font-sans text-sm text-black/50" aria-live="polite">
            {activeIndex + 1} / {total}
          </p>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next luxury property"
            className="flex size-11 items-center justify-center rounded-lg border border-primary transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-metallic)" }}
          >
            <LuChevronRight className="size-5 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
      )}
    </section>
  );
}
