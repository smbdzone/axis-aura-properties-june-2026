"use client";

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
  } = position;

  return (
    <article className="group relative isolate mx-auto flex min-h-[420px] w-full max-w-[320px] flex-col overflow-hidden rounded-3xl border-[1.5px] border-accent-light shadow-[0_0_40px_rgba(0,0,0,0.25)]">
      <PrimaryShineBackdrop className="rounded-3xl" />
      <PrimaryShineAccents size="card" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(150deg, #012235 0%, #003049 48%, #0a4d73 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 85% 8%, rgba(102,155,188,0.55) 0%, rgba(102,155,188,0) 45%), radial-gradient(90% 80% at 12% 100%, rgba(2,18,30,0.85) 0%, rgba(2,18,30,0) 55%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1.4px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-10 -left-1/3 z-[1] w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/12 to-transparent blur-md transition-transform duration-700 ease-out group-hover:translate-x-[260%]"
      />

      <div className="relative z-[2] flex flex-1 flex-col px-6 pb-6 pt-7">
        <div className="mb-5 shrink-0">
          <h3
            className="font-heading text-[26px] font-bold leading-[32px] capitalize text-white line-clamp-3"
            title={title}
          >
            {title}
          </h3>
          <span
            aria-hidden="true"
            className="mt-3 block h-[3px] w-12 rounded-full bg-accent-light"
          />
        </div>

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

        <div className="mt-auto flex shrink-0 flex-col gap-2 pt-[20px]">
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
