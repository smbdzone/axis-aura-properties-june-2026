"use client";

import { useState } from "react";
import Link from "next/link";
import CareerPositionCard from "@/components/career/CareerPositionCard";
import CareerPositionDetailModal from "@/components/career/CareerPositionDetailModal";
import { scrollToCareerApply } from "@/components/career/careerApplyEvents";
import {
  careerOpenPositions,
  type CareerPosition,
} from "@/components/data/careerPositions";

export default function CareerOpenPositionsSection() {
  const { title, viewAllLabel, viewAllHref, positions } = careerOpenPositions;
  const [selectedPosition, setSelectedPosition] = useState<CareerPosition | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openDetails = (position: CareerPosition) => {
    setSelectedPosition(position);
    setIsDetailOpen(true);
  };

  const closeDetails = () => {
    setIsDetailOpen(false);
  };

  const handleApplyNow = (position: CareerPosition) => {
    scrollToCareerApply(position.id);
  };

  return (
    <>
      <section
        id="positions"
        aria-labelledby="career-open-positions-heading"
        className="flex w-full justify-center px-6 py-12 lg:px-24 lg:py-16"
      >
        <div className="flex w-full max-w-[1394px] flex-col items-center gap-8">
          <h2
            id="career-open-positions-heading"
            className="w-full text-center font-heading text-[clamp(2rem,5vw,4rem)] font-bold capitalize leading-[1.15] text-primary lg:leading-[88px]"
          >
            {title}
          </h2>

          <ul className="grid w-full grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-[38px]">
            {positions.map((position) => (
              <li key={position.id} className="flex w-full max-w-[320px] justify-center">
                <CareerPositionCard
                  position={position}
                  onViewDetails={openDetails}
                  onApplyNow={handleApplyNow}
                />
              </li>
            ))}
          </ul>

          <Link
            href={viewAllHref}
            className="inline-flex h-[62px] min-w-[185px] items-center justify-center rounded-3xl border border-accent-light px-8 font-heading text-[clamp(1.5rem,2.5vw,2rem)] font-medium leading-[42px] text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-dark-metallic)" }}
          >
            {viewAllLabel}
          </Link>
        </div>
      </section>

      <CareerPositionDetailModal
        position={selectedPosition}
        isOpen={isDetailOpen}
        onClose={closeDetails}
      />
    </>
  );
}
