"use client";

import { useCallback, useEffect, useId } from "react";
import { LuX } from "react-icons/lu";
import type { PropertyFAQ } from "@/components/data/propertyDetails";

type PropertyFAQModalProps = {
  faq: PropertyFAQ | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function PropertyFAQModal({
  faq,
  isOpen,
  onClose,
}: PropertyFAQModalProps) {
  const titleId = useId();

  const dismiss = useCallback(() => {
    onClose();
  }, [onClose]);

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

  if (!isOpen || !faq) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close FAQ"
        className="fixed inset-0 cursor-pointer bg-black/60 backdrop-blur-[2px]"
        onClick={dismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 isolate w-full max-w-[530px] overflow-hidden rounded-3xl border border-accent-light p-6 sm:p-8"
        style={{ background: "var(--gradient-dark-metallic)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-primary"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 -top-48 h-[757px] w-20 rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-44 -top-5 h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
        />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <h2
              id={titleId}
              className="font-heading text-xl font-bold leading-snug text-white sm:text-2xl"
            >
              {faq.question}
            </h2>
            <button
              type="button"
              aria-label="Close FAQ popup"
              onClick={dismiss}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-80"
            >
              <LuX className="size-7" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className="border-t border-accent-light pt-4">
            <p className="font-sans text-base leading-[150%] text-white/80 sm:text-lg">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
