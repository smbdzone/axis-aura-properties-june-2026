"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { IoPlay } from "react-icons/io5";
import { discoverSlides } from "@/components/data/discoverDubai";
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
      <span
        className="flex h-13 w-13 items-center justify-center rounded-full border border-primary "
        // style={{ background: "var(--gradient-metallic)" }}
      >
        <Icon className="size-7 text-primary" aria-hidden="true" />
      </span>
    </button>
  );
}

export default function DiscoverDubai() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = discoverSlides.length;
  const slide = discoverSlides[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((index) => (index === 0 ? total - 1 : index - 1));
  };

  const goToNext = () => {
    setActiveIndex((index) => (index === total - 1 ? 0 : index + 1));
  };

  return (
    <section
      aria-labelledby="discover-dubai-heading"
      className="flex w-full flex-col items-center gap-6 px-6 py-12 lg:gap-6 lg:px-24 lg:py-16"
    >
      <header className="relative isolate mx-auto flex w-full max-w-7xl items-center px-0 lg:min-h-[132px]">
        <h2
          id="discover-dubai-heading"
          className="font-heading  text-4xl font-bold text-primary"
        >
          Discover
          <span className="block font-heading text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.25] ">Dubai with Us</span>
        </h2>

        <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-3 lg:flex">
          <CarouselButton direction="previous" onClick={goToPrevious} />
          <CarouselButton direction="next" onClick={goToNext} />
        </div>
      </header>

      <div className="relative mx-auto hidden h-[454px] w-full max-w-[1248px] lg:block">
        <p className="absolute left-[424px] top-[3px] z-10 max-w-[824px] font-heading text-2xl font-medium capitalize leading-[31px] text-black/60">
          {slide.description}
        </p>

        <div
          className="absolute left-[424px] top-[110px] z-10 h-0 w-[609px] border-t-[1.5px] border-accent-light"
          aria-hidden="true"
        />
        <div
          className="absolute left-[424px] top-[120px] z-10 h-0 w-[486px] border-t-[1.5px] border-accent-light"
          aria-hidden="true"
        />
        <div
          className="absolute left-[424px] top-[130px] z-10 h-0 w-[375px] border-t-[1.5px] border-accent-light"
          aria-hidden="true"
        />

        <Link
          href="#contact"
          className={`${PRIMARY_SHINE_SURFACE_CLASS} absolute left-[1033px] top-[133px] z-10 flex h-[57px] w-[215px] items-center justify-center rounded-3xl px-12 py-3 font-heading text-2xl font-bold text-[#EEF0F2] transition-opacity hover:opacity-90`}
        >
          <PrimaryShineLayers accentSize="button" roundedClass="rounded-3xl" />
          <span className="relative z-10">Book Now</span>
        </Link>

        <div className="absolute left-0 top-0 h-[454px] w-[400px] overflow-hidden rounded-[18px] border-[1.5px] border-accent-light">
          <Image
            src={slide.images[0]}
            alt=""
            fill
            className="object-cover"
            sizes="400px"
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
          <button
            type="button"
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 flex size-[45px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFFFF0]/35 transition-opacity hover:opacity-90"
          >
            <IoPlay className="size-7 text-[#FFFFF0]" aria-hidden="true" />
          </button>
        </div>

        <div className="absolute left-[424px] top-[190px] h-[264px] w-[400px] overflow-hidden rounded-[18px] border-[1.5px] border-accent-light">
          <Image
            src={slide.images[1]}
            alt=""
            fill
            className="object-cover"
            sizes="400px"
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        </div>

        <div className="absolute left-[848px] top-[217px] h-[237px] w-[400px] overflow-hidden rounded-[18px] border-[1.5px] border-accent-light">
          <Image
            src={slide.images[2]}
            alt=""
            fill
            className="object-cover"
            sizes="400px"
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:hidden">
        <p className="font-heading text-lg font-medium capitalize leading-relaxed text-black/60 sm:text-xl sm:leading-8">
          {slide.description}
        </p>

        <div className="relative aspect-[400/454] w-full overflow-hidden rounded-[18px] border-[1.5px] border-accent-light">
          <Image
            src={slide.images[0]}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
          <button
            type="button"
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 flex size-[45px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFFFF0]/35 transition-opacity hover:opacity-90"
          >
            <IoPlay className="size-7 text-[#FFFFF0]" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[400/264] overflow-hidden rounded-[18px] border-[1.5px] border-accent-light">
            <Image
              src={slide.images[1]}
              alt=""
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
          </div>
          <div className="relative aspect-[400/237] overflow-hidden rounded-[18px] border-[1.5px] border-accent-light">
            <Image
              src={slide.images[2]}
              alt=""
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
          </div>
        </div>

        <Link
          href="#contact"
          className={`${PRIMARY_SHINE_SURFACE_CLASS} flex h-[57px] w-full items-center justify-center rounded-3xl px-12 py-3 font-heading text-2xl font-bold text-[#EEF0F2] transition-opacity hover:opacity-90 sm:w-[215px]`}
        >
          <PrimaryShineLayers accentSize="button" roundedClass="rounded-3xl" />
          <span className="relative z-10">Book Now</span>
        </Link>

        <div className="flex items-center justify-center gap-6">
          <CarouselButton direction="previous" onClick={goToPrevious} />
          <p className="font-sans text-sm text-black/50" aria-live="polite">
            {activeIndex + 1} / {total}
          </p>
          <CarouselButton direction="next" onClick={goToNext} />
        </div>
      </div>
    </section>
  );
}
