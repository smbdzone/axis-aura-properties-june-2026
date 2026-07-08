"use client";

import Image from "next/image";
import type { CareerPosition } from "@/components/data/careerPositions";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
} from "@/components/ui/PrimaryShine";

type CareerPositionCardProps = {
  position: CareerPosition;
  onViewDetails: (position: CareerPosition) => void;
  onApplyNow: (position: CareerPosition) => void;
};

export default function CareerPositionCard({
  position,
  onViewDetails,
  onApplyNow,
}: CareerPositionCardProps) {
  const {
    title,
    salaryLabel,
    salaryValue,
    levelLabel,
    levelValue,
    description,
    image,
    imageAlt,
  } = position;

  return (
    <article className="relative isolate mx-auto flex h-[500px] w-full max-w-[320px] flex-col overflow-hidden rounded-3xl border-[1.5px] border-accent-light shadow-[0_0_40px_rgba(0,0,0,0.25)]">
      <PrimaryShineBackdrop className="rounded-3xl" />
      <PrimaryShineAccents size="card" />

      <div className="relative z-[1] h-[205px] w-full shrink-0 overflow-hidden rounded-t-2xl border-[1.5px] border-accent-light">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="320px"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent from-[53.9%] to-black"
        />

        <h3
          className="absolute inset-x-4 bottom-3 z-10 h-[44px] truncate font-heading text-[26px] font-bold leading-[44px] capitalize text-white"
          title={title}
        >
          {title}
        </h3>
      </div>

      <div className="relative z-[2] -mt-[57px] flex flex-1 flex-col px-4 pb-4 pt-[70px]">
        <div className="flex shrink-0 flex-col">
          <p className="flex h-[30px] min-w-0 items-center gap-1 whitespace-nowrap">
            <span className="shrink-0 font-heading text-base font-medium leading-6 text-accent-light">
              {salaryLabel}
            </span>
            <span className="truncate font-heading text-xl font-medium leading-[30px] text-accent-light">
              {salaryValue}
            </span>
          </p>
          <p className="flex h-[30px] min-w-0 items-center gap-3 whitespace-nowrap">
            <span className="shrink-0 font-heading text-base font-medium leading-6 text-accent-light">
              {levelLabel}
            </span>
            <span className="truncate font-heading text-xl font-medium leading-[30px] text-accent-light">
              {levelValue}
            </span>
          </p>
        </div>

        <p className="mt-[10px] h-[72px] shrink-0 line-clamp-3 font-sans text-base leading-6 text-white/60">
          {description}
        </p>

        <div className="flex shrink-0 flex-col gap-2 pt-[20px]">
          <button
            type="button"
            onClick={() => onViewDetails(position)}
            className="inline-flex h-[47px] w-full shrink-0 cursor-pointer items-center justify-center rounded-[11px] bg-white px-6 font-heading text-base font-bold leading-[22px] text-primary transition-opacity hover:opacity-90"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onApplyNow(position)}
            className="inline-flex h-[47px] w-full shrink-0 cursor-pointer items-center justify-center rounded-[11px] bg-white px-6 font-heading text-base font-bold leading-[22px] text-primary transition-opacity hover:opacity-90"
          >
            Apply Now
          </button>
        </div>
      </div>
    </article>
  );
}
