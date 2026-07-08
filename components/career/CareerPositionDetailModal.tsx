"use client";

import Image from "next/image";
import { useCallback, useEffect, useId } from "react";
import { LuX } from "react-icons/lu";
import { scrollToCareerApply } from "@/components/career/careerApplyEvents";
import type { CareerPosition } from "@/components/data/careerPositions";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";

type CareerPositionDetailModalProps = {
  position: CareerPosition | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function CareerPositionDetailModal({
  position,
  isOpen,
  onClose,
}: CareerPositionDetailModalProps) {
  const titleId = useId();

  const dismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleApply = useCallback(() => {
    if (!position) return;
    dismiss();
    scrollToCareerApply(position.id);
  }, [dismiss, position]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dismiss]);

  if (!isOpen || !position) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close position details"
        className="fixed inset-0 cursor-pointer bg-black/60 backdrop-blur-[2px]"
        onClick={dismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 isolate flex max-h-[min(90vh,820px)] w-full max-w-[720px] flex-col overflow-hidden rounded-3xl border border-accent-light shadow-[0_0_40px_rgba(0,0,0,0.25)]"
      >
        <PrimaryShineBackdrop className="rounded-3xl" />
        <PrimaryShineAccents size="card" />

        <div className="relative z-10 flex max-h-full flex-col overflow-y-auto">
          <div className="relative h-[220px] w-full shrink-0 overflow-hidden border-b border-accent-light sm:h-[260px]">
            <Image
              src={position.image}
              alt={position.imageAlt}
              fill
              className="object-cover object-center"
              sizes="720px"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-transparent from-[40%] to-primary/90"
            />
            <button
              type="button"
              aria-label="Close position details popup"
              onClick={dismiss}
              className="absolute right-4 top-4 flex size-10 cursor-pointer items-center justify-center rounded-full border border-accent-light bg-primary/70 text-white transition-opacity hover:opacity-80"
            >
              <LuX className="size-6" strokeWidth={2} aria-hidden="true" />
            </button>
            <h2
              id={titleId}
              className="absolute inset-x-6 bottom-5 font-heading text-[clamp(1.75rem,4vw,2.25rem)] font-bold leading-tight capitalize text-white"
            >
              {position.title}
            </h2>
          </div>

          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
              <p className="flex min-w-0 items-center gap-2 font-heading text-base font-medium text-accent-light">
                <span>{position.salaryLabel}</span>
                <span className="text-xl text-white">{position.salaryValue}</span>
              </p>
              <p className="flex min-w-0 items-center gap-2 font-heading text-base font-medium text-accent-light">
                <span>{position.levelLabel}</span>
                <span className="text-xl text-white">{position.levelValue}</span>
              </p>
            </div>

            <p className="font-sans text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              {position.fullDescription}
            </p>

            <button
              type="button"
              onClick={handleApply}
              className={`${PRIMARY_SHINE_SURFACE_CLASS} inline-flex h-[62px] w-full items-center justify-center rounded-3xl border border-accent-light px-8 font-heading text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[42px] text-white transition-opacity hover:opacity-90 sm:w-auto sm:min-w-[222px]`}
            >
              <PrimaryShineBackdrop className="rounded-3xl" />
              <PrimaryShineAccents size="button" />
              <span className="relative z-10">Apply Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
