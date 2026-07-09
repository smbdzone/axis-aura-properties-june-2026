"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { IoPlay } from "react-icons/io5";
import type { DiscoverVideo } from "@/components/data/discoverDubai";
import {
  PRIMARY_SHINE_SURFACE_CLASS,
  PrimaryShineLayers,
} from "@/components/ui/PrimaryShine";

function CarouselButton({
  direction,
  onClick,
  className = "",
}: {
  direction: "previous" | "next";
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === "previous" ? LuChevronLeft : LuChevronRight;
  const label =
    direction === "previous" ? "Previous discover slide" : "Next discover slide";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-13 w-13 items-center justify-center rounded-full border border-primary transition-opacity hover:opacity-90 ${className}`}
    >
      <span className="flex h-13 w-13 items-center justify-center rounded-full border border-primary">
        <Icon className="size-7 text-primary" aria-hidden="true" />
      </span>
    </button>
  );
}

export default function DiscoverDubai() {
  const [items, setItems] = useState<DiscoverVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/discover")
      .then((response) => response.json())
      .then((data: { items?: DiscoverVideo[] }) => {
        if (cancelled) return;
        setItems(data.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const total = items.length;
  const slide = items[activeIndex];

  const selectIndex = (index: number) => {
    setActiveIndex(index);
    setIsPlaying(false);
  };

  const goToPrevious = () => {
    selectIndex(activeIndex === 0 ? total - 1 : activeIndex - 1);
  };

  const goToNext = () => {
    selectIndex(activeIndex === total - 1 ? 0 : activeIndex + 1);
  };

  if (!isLoading && total === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="discover-dubai-heading"
      className="flex w-full flex-col items-center gap-6 px-6 py-12 lg:gap-8 lg:px-24 lg:py-16"
    >
      <header className="relative isolate mx-auto flex w-full max-w-7xl items-center px-0">
        <h2
          id="discover-dubai-heading"
          className="font-heading text-4xl font-bold text-primary"
        >
          Discover
          <span className="block font-heading text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.25]">
            Dubai with Us
          </span>
        </h2>

        {total > 1 ? (
          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-3 lg:flex">
            <CarouselButton direction="previous" onClick={goToPrevious} />
            <CarouselButton direction="next" onClick={goToNext} />
          </div>
        ) : null}
      </header>

      {isLoading || !slide ? (
        <p className="mx-auto w-full max-w-7xl py-10 text-center font-heading text-xl text-black/50">
          Loading videos...
        </p>
      ) : (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center">
            <div className="relative aspect-video w-full overflow-hidden rounded-[18px] border-[1.5px] border-accent-light bg-black">
              {isPlaying ? (
                <video
                  key={slide.id}
                  src={slide.videoUrl}
                  poster={slide.thumbnailUrl || undefined}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <track kind="captions" />
                </video>
              ) : (
                <>
                  {slide.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slide.thumbnailUrl}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/80 to-accent-light/40" />
                  )}
                  <div
                    className="absolute inset-0 bg-black/30"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    aria-label={`Play video: ${slide.title}`}
                    className="absolute left-1/2 top-1/2 flex size-[64px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFFFF0]/35 transition-transform hover:scale-105"
                  >
                    <IoPlay
                      className="size-8 translate-x-0.5 text-[#FFFFF0]"
                      aria-hidden="true"
                    />
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-col justify-center gap-5">
              <h3 className="font-heading text-2xl font-bold capitalize leading-tight text-primary sm:text-3xl">
                {slide.title}
              </h3>
              {slide.description ? (
                <p className="max-w-[560px] font-heading text-lg font-medium capitalize leading-relaxed text-black/60 sm:text-xl">
                  {slide.description}
                </p>
              ) : null}

              <div
                className="h-0 w-[70%] border-t-[1.5px] border-accent-light"
                aria-hidden="true"
              />

              <Link
                href="/contact"
                className={`${PRIMARY_SHINE_SURFACE_CLASS} flex h-[57px] w-full max-w-[215px] items-center justify-center rounded-3xl px-12 py-3 font-heading text-2xl font-bold text-[#EEF0F2] transition-opacity hover:opacity-90`}
              >
                <PrimaryShineLayers accentSize="button" roundedClass="rounded-3xl" />
                <span className="relative z-10">Book Now</span>
              </Link>
            </div>
          </div>

          {total > 1 ? (
            <div className="flex w-full gap-4 overflow-x-auto pb-2">
              {items.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectIndex(index)}
                    aria-label={`Show ${item.title}`}
                    aria-current={isActive}
                    className={`group relative h-[86px] w-[150px] shrink-0 overflow-hidden rounded-xl border-[1.5px] transition-all ${
                      isActive
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-accent-light opacity-80 hover:opacity-100"
                    }`}
                  >
                    {item.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/80 to-accent-light/40" />
                    )}
                    <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
                    <span className="absolute inset-x-1 bottom-1 line-clamp-2 text-left font-heading text-[11px] font-semibold leading-tight text-white">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {total > 1 ? (
            <div className="flex items-center justify-center gap-6 lg:hidden">
              <CarouselButton direction="previous" onClick={goToPrevious} />
              <p className="font-sans text-sm text-black/50" aria-live="polite">
                {activeIndex + 1} / {total}
              </p>
              <CarouselButton direction="next" onClick={goToNext} />
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
