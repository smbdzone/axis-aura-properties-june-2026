"use client";

import { useEffect, useState } from "react";
import CareerPositionCard from "@/components/career/CareerPositionCard";
import CareerPositionDetailModal from "@/components/career/CareerPositionDetailModal";
import { scrollToCareerApply } from "@/components/career/careerApplyEvents";
import {
  careerOpenPositions,
  type CareerPosition,
} from "@/components/data/careerPositions";

const VISIBLE_LIMIT = 4;

export default function CareerOpenPositionsSection() {
  const { title } = careerOpenPositions;
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<CareerPosition | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPositions() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/careers", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load open positions");
        }

        const data = (await response.json()) as { positions: CareerPosition[] };
        if (isMounted) {
          setPositions(data.positions);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load open positions right now. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPositions();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const visiblePositions = showAll
    ? positions
    : positions.slice(0, VISIBLE_LIMIT);
  const hasMore = positions.length > VISIBLE_LIMIT;

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

          {isLoading ? (
            <p className="py-12 text-center font-sans text-lg text-white/70">
              Loading open positions...
            </p>
          ) : error ? (
            <p className="py-12 text-center font-sans text-lg text-white/70">
              {error}
            </p>
          ) : positions.length === 0 ? (
            <p className="py-12 text-center font-sans text-lg text-white/70">
              There are no open positions at the moment. Please check back soon.
            </p>
          ) : (
            <ul className="grid w-full grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-[38px]">
              {visiblePositions.map((position) => (
                <li key={position.id} className="flex w-full max-w-[320px] justify-center">
                  <CareerPositionCard
                    position={position}
                    onViewDetails={openDetails}
                    onApplyNow={handleApplyNow}
                  />
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="inline-flex h-[62px] min-w-[185px] cursor-pointer items-center justify-center rounded-3xl border border-accent-light px-8 font-heading text-[clamp(1.5rem,2.5vw,2rem)] font-medium leading-[42px] text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--gradient-dark-metallic)" }}
            >
              {showAll ? "View Less" : "View More"}
            </button>
          )}
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
