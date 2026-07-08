"use client";

import { useEffect, useMemo, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import PropertyCard from "@/components/card/PropertyCard";
import type { PropertyFilterValues } from "@/components/data/newProjectFilters";
import {
  filterProperties,
  newProjectProperties,
  recentProperties,
} from "@/components/data/properties";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";

const PROPERTIES_BATCH_SIZE = 3;
const PROPERTIES_PER_PAGE = 9;

type RecentPropertiesProps = {
  showHeader?: boolean;
  showViewMore?: boolean;
  category?: "residential" | "commercial";
  filters?: PropertyFilterValues;
  sectionId?: string;
};

function PropertyPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav
      aria-label="Property pages"
      className="flex flex-wrap items-center justify-center gap-3"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex size-11 cursor-pointer items-center justify-center rounded-full border-2 border-accent-light bg-white text-primary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <LuChevronLeft className="size-5" aria-hidden="true" />
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex size-11 cursor-pointer items-center justify-center rounded-full border-2 font-heading text-lg font-medium transition-opacity hover:opacity-90",
              isActive
                ? "border-accent-light bg-primary text-white"
                : "border-accent-light bg-white text-primary",
            ].join(" ")}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex size-11 cursor-pointer items-center justify-center rounded-full border-2 border-accent-light bg-white text-primary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <LuChevronRight className="size-5" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default function RecentProperties({
  showHeader = true,
  showViewMore = false,
  category,
  filters,
  sectionId,
}: RecentPropertiesProps) {
  const sourceProperties = showViewMore ? newProjectProperties : recentProperties;
  const properties = useMemo(
    () =>
      filters
        ? filterProperties(sourceProperties, filters, category)
        : category
          ? filterProperties(
            sourceProperties,
            {
              propertyType: "all",
              area: "all",
              developer: "all",
              searchQuery: "",
            },
            category,
          )
          : sourceProperties,
    [sourceProperties, filters, category],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCountOnPage, setVisibleCountOnPage] = useState(
    PROPERTIES_BATCH_SIZE,
  );

  const totalPages = Math.ceil(properties.length / PROPERTIES_PER_PAGE);
  const pageStart = (currentPage - 1) * PROPERTIES_PER_PAGE;
  const pageProperties = showViewMore
    ? properties.slice(pageStart, pageStart + PROPERTIES_PER_PAGE)
    : properties;
  const maxVisibleOnPage = Math.min(
    PROPERTIES_PER_PAGE,
    pageProperties.length,
  );
  const visibleProperties = showViewMore
    ? pageProperties.slice(0, visibleCountOnPage)
    : properties;

  const hasMoreOnPage =
    showViewMore && visibleCountOnPage < maxVisibleOnPage;
  const showPagination =
    showViewMore &&
    totalPages > 1 &&
    visibleCountOnPage >= maxVisibleOnPage;

  const mobileCarouselProperties = properties;
  const mobileCarouselTotal = mobileCarouselProperties.length;

  const goToPrevious = () => {
    setActiveIndex((index) =>
      index === 0 ? mobileCarouselTotal - 1 : index - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((index) =>
      index === mobileCarouselTotal - 1 ? 0 : index + 1,
    );
  };

  const handleViewMore = () => {
    setVisibleCountOnPage((current) =>
      Math.min(current + PROPERTIES_BATCH_SIZE, maxVisibleOnPage),
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setVisibleCountOnPage(PROPERTIES_BATCH_SIZE);
  };

  useEffect(() => {
    setCurrentPage(1);
    setVisibleCountOnPage(PROPERTIES_BATCH_SIZE);
    setActiveIndex(0);
  }, [filters, category]);

  useEffect(() => {
    setActiveIndex(0);
  }, [currentPage, visibleCountOnPage]);

  useEffect(() => {
    setActiveIndex((index) => {
      const maxIndex = Math.max(properties.length - 1, 0);
      return Math.min(index, maxIndex);
    });
  }, [properties.length]);

  return (
    <section
      id={sectionId}
      aria-labelledby={showHeader ? "recent-properties-heading" : undefined}
      aria-label={showHeader ? undefined : "Property listings"}
      className="flex w-full flex-col items-center gap-10 px-4 py-10 min-[701px]:px-6 min-[701px]:py-12 lg:gap-12 lg:px-24 lg:py-16"
    >
      {showHeader ? (
        <header className="mx-auto flex w-full max-w-7xl flex-col gap-2.5">
          <h2
            id="recent-properties-heading"
            className=" font-heading  text-4xl font-bold text-primary "
          >
            Our Recent
            <span className="block font-heading text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.25] ">
              Properties in UAE
            </span>
          </h2>
          <p className="max-w-4xl font-sans text-lg capitalize leading-relaxed text-black/60 sm:text-xl sm:leading-8">
            UAE Real estate is hitting record highs. With high retal yields,
            tax-free returns, and premium new launchers, it&apos;s the perfect
            time to secure you next high-ROI property.
          </p>
        </header>
      ) : null}

      <div
        className={[
          "mx-auto w-full max-w-7xl gap-6",
          showViewMore
            ? "hidden min-[701px]:grid min-[701px]:grid-cols-2 lg:grid-cols-3"
            : "hidden lg:grid lg:grid-cols-3",
        ].join(" ")}
      >
        {visibleProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {showViewMore && properties.length === 0 ? (
        <p className="font-heading text-xl text-black/60">
          No properties match your filters. Try adjusting your search.
        </p>
      ) : null}

      {showViewMore && properties.length > 0 ? (
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 min-[701px]:hidden">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous property"
              className="flex size-11 items-center justify-center rounded-full border-2 border-accent-light bg-white text-primary transition-opacity hover:opacity-80"
            >
              <LuChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next property"
              className="flex size-11 items-center justify-center rounded-full border-2 border-accent-light bg-white text-primary transition-opacity hover:opacity-80"
            >
              <LuChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <PropertyCard property={mobileCarouselProperties[activeIndex]} />

          <p className="font-sans text-sm text-black/50" aria-live="polite">
            {activeIndex + 1} / {mobileCarouselTotal}
          </p>
        </div>
      ) : null}

      {!showViewMore ? (
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 lg:hidden">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous property"
              className="flex size-11 items-center justify-center rounded-full border-2 border-accent-light bg-white text-primary transition-opacity hover:opacity-80"
            >
              <LuChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next property"
              className="flex size-11 items-center justify-center rounded-full border-2 border-accent-light bg-white text-primary transition-opacity hover:opacity-80"
            >
              <LuChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <PropertyCard property={mobileCarouselProperties[activeIndex]} />

          <p className="font-sans text-sm text-black/50" aria-live="polite">
            {activeIndex + 1} / {mobileCarouselTotal}
          </p>
        </div>
      ) : null}

      {hasMoreOnPage ? (
        <button
          type="button"
          onClick={handleViewMore}
          className={`${PRIMARY_SHINE_SURFACE_CLASS} hidden min-[701px]:inline-flex h-[63px] min-w-[278px] cursor-pointer items-center justify-center rounded-3xl px-8 py-4 font-heading text-2xl font-medium leading-[31px] text-white transition-opacity hover:opacity-90`}
        >
          <PrimaryShineBackdrop className="rounded-3xl" />
          <PrimaryShineAccents size="button" />
          <span className="relative z-10">View More</span>
        </button>
      ) : null}

      {showPagination ? (
        <div className="hidden min-[701px]:block">
          <PropertyPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </section>
  );
}
