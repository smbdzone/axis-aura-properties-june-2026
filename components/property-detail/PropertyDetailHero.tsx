"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LuExpand, LuMail, LuPlay } from "react-icons/lu";
import type { PropertyDetail } from "@/components/data/propertyDetails";
import PropertyNavArrow from "@/components/property-detail/PropertyNavArrow";
import {
  PRIMARY_SHINE_SURFACE_CLASS,
  PrimaryShineLayers,
} from "@/components/ui/PrimaryShine";

type PropertyDetailHeroProps = {
  property: PropertyDetail;
};

export default function PropertyDetailHero({
  property,
}: PropertyDetailHeroProps) {
  const [activeImage, setActiveImage] = useState(0);
  const images = [property.heroImage, ...property.interiorImages];

  const goToPrevious = () => {
    setActiveImage((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const goToNext = () => {
    setActiveImage((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  return (
    <section
      aria-labelledby="property-detail-heading"
      className="relative w-full px-6 pt-[140px] lg:px-24"
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-4">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-[104px]">
          <div className="relative w-full shrink-0 lg:max-w-[506px]">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-[1.5px] border-accent-light">
              <Image
                src={images[activeImage]}
                alt={property.fullTitle}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 506px"
              />

              <button
                type="button"
                aria-label="Play property video"
                className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFFFF0]/35 transition-opacity hover:opacity-90"
              >
                <LuPlay
                  className="ml-1 size-12 text-[#FFFFF0]"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                aria-label="View large image"
                className="absolute bottom-4 left-4 flex size-[50px] items-center justify-center rounded-lg border border-accent-light"
                style={{ background: "var(--gradient-metallic)" }}
              >
                <LuExpand className="size-7 text-white" aria-hidden="true" />
              </button>
            </div>

            <PropertyNavArrow
              direction="left"
              label="Previous image"
              onClick={goToPrevious}
              className="absolute -left-14 top-[443px] hidden lg:flex"
            />

            <PropertyNavArrow
              direction="right"
              label="Next image"
              onClick={goToNext}
              className="absolute -right-14 top-[443px] hidden lg:flex"
            />
          </div>

          <div className="flex flex-1 flex-col justify-between gap-8 lg:min-h-[506px]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1
                  id="property-detail-heading"
                  className="font-heading text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.15] text-primary"
                >
                  {property.fullTitle}
                </h1>

                <div className="flex flex-col gap-0">
                  <span className="gradient-price-text font-heading text-[clamp(1.5rem,2.5vw,2rem)] font-medium leading-[42px]">
                    Overview
                  </span>
                  <p className="font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium leading-7 text-black/60">
                    {property.overviewSummary}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="font-heading text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium leading-tight text-primary">
                  Starting Price
                </p>
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="font-heading text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium text-black/60">
                    AED:
                  </span>
                  <span className="font-heading text-[clamp(2.5rem,4vw,3.125rem)] font-bold leading-tight text-primary underline">
                    {property.startingPriceLabel}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="font-heading text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium text-black/60">
                    Area:
                  </span>
                  <span className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-medium leading-tight text-primary">
                    {property.areaName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
              <Link
                href="/contact"
                className={`${PRIMARY_SHINE_SURFACE_CLASS} inline-flex h-14 items-center justify-center gap-2.5 rounded-3xl px-8 font-heading text-[clamp(1.25rem,2vw,2rem)] font-medium text-white transition-opacity hover:opacity-90`}
              >
                <PrimaryShineLayers accentSize="button" roundedClass="rounded-3xl" />
                <span className="relative z-10 flex items-center gap-2.5">
                  Contact Us
                  <LuMail className="size-9 shrink-0" aria-hidden="true" />
                </span>
              </Link>

              <a
                href="#brochure"
                className="inline-flex h-14 items-center justify-center rounded-[36px] border-[1.5px] border-accent-light bg-white px-8 font-heading text-[clamp(1.25rem,2vw,2rem)] font-medium text-black transition-opacity hover:opacity-80"
              >
                Download Brochure
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-[clamp(2rem,3vw,3rem)] font-bold leading-tight text-primary">
            Interior
          </h2>
          <div className="flex gap-[33px] overflow-x-auto pb-2">
            {property.interiorImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(index + 1)}
                className={[
                  "relative size-[120px] shrink-0 overflow-hidden rounded-3xl sm:size-[150px]",
                  activeImage === index + 1
                    ? "border-[1.5px] border-accent-light"
                    : "border border-transparent",
                ].join(" ")}
                aria-label={`View interior image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
