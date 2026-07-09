"use client";

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
        className="relative z-10 isolate flex max-h-[min(90vh,760px)] w-full max-w-[640px] flex-col overflow-hidden rounded-3xl border border-accent-light shadow-[0_0_40px_rgba(0,0,0,0.25)]"
      >
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
              "radial-gradient(120% 70% at 85% 0%, rgba(102,155,188,0.5) 0%, rgba(102,155,188,0) 45%), radial-gradient(90% 70% at 10% 100%, rgba(2,18,30,0.85) 0%, rgba(2,18,30,0) 55%)",
          }}
        />

        <button
          type="button"
          aria-label="Close position details popup"
          onClick={dismiss}
          className="absolute right-5 top-5 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full border border-accent-light bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <LuX className="size-5" strokeWidth={2} aria-hidden="true" />
        </button>

        <div className="relative z-10 flex max-h-full flex-col overflow-y-auto p-7 sm:p-10">
          <div className="flex flex-col gap-3 pr-10">
            <span className="w-fit rounded-full border border-accent-light/60 bg-white/10 px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wide text-accent-light">
              {position.levelValue}
            </span>
            <h2
              id={titleId}
              className="font-heading text-[clamp(1.75rem,4vw,2.25rem)] font-bold leading-tight capitalize text-white"
            >
              {position.title}
            </h2>
            <span
              aria-hidden="true"
              className="mt-1 block h-[3px] w-16 rounded-full bg-accent-light"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-accent-light/40 bg-white/5 px-4 py-3">
              <p className="font-heading text-sm font-medium text-accent-light">
                {position.salaryLabel}
              </p>
              <p className="mt-0.5 font-heading text-lg font-semibold text-white">
                {position.salaryValue}
              </p>
            </div>
            <div className="rounded-2xl border border-accent-light/40 bg-white/5 px-4 py-3">
              <p className="font-heading text-sm font-medium text-accent-light">
                {position.levelLabel}
              </p>
              <p className="mt-0.5 font-heading text-lg font-semibold text-white">
                {position.levelValue}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <h3 className="font-heading text-base font-semibold text-accent-light">
              About the role
            </h3>
            <p className="font-sans text-base leading-7 text-white/80 sm:leading-8">
              {position.fullDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className={`${PRIMARY_SHINE_SURFACE_CLASS} mt-8 inline-flex h-[60px] w-full items-center justify-center rounded-3xl border border-accent-light px-8 font-heading text-[clamp(1.15rem,2vw,1.5rem)] font-medium leading-none text-white transition-opacity hover:opacity-90`}
          >
            <PrimaryShineBackdrop className="rounded-3xl" />
            <PrimaryShineAccents size="button" />
            <span className="relative z-10">Apply Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
