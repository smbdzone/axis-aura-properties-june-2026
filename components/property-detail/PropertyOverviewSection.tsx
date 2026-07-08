"use client";

import { useState } from "react";
import type { PropertyDetail } from "@/components/data/propertyDetails";

type PropertyOverviewSectionProps = {
  property: PropertyDetail;
};

const TRUNCATE_LENGTH = 280;

export default function PropertyOverviewSection({
  property,
}: PropertyOverviewSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = property.overviewText.length > TRUNCATE_LENGTH;
  const displayText =
    expanded || !needsTruncation
      ? property.overviewText
      : `${property.overviewText.slice(0, TRUNCATE_LENGTH).trim()}...`;

  return (
    <section
      aria-labelledby="overview-heading"
      className="w-full px-6 py-12 lg:px-24"
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6">
        <h2
          id="overview-heading"
          className="text-center font-heading text-[clamp(2rem,3vw,3rem)] font-bold leading-tight text-black"
        >
          OverView
        </h2>

        <p className="text-center font-sans text-[clamp(1rem,2vw,1.5rem)] leading-[150%] text-black/60">
          {displayText}
          {needsTruncation && !expanded && (
            <>
              {" "}
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="cursor-pointer font-sans text-black/60 underline transition-opacity hover:opacity-80"
              >
                Read More...
              </button>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
