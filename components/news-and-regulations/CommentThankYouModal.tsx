"use client";

import { useCallback, useEffect, useId } from "react";

type CommentThankYouModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CommentThankYouModal({
  isOpen,
  onClose,
}: CommentThankYouModalProps) {
  const titleId = useId();
  const descriptionId = useId();

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close thank you message"
        className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-[2px]"
        onClick={dismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative isolate flex w-full max-w-[496px] flex-col items-center gap-3 overflow-hidden rounded-[24px] border-[1.5px] border-accent-light bg-primary px-4 py-8 sm:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[135px] -top-[69px] h-[757px] w-[78px] rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[147px] top-[81px] h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
        />

        <h2
          id={titleId}
          className="relative z-10 text-center font-heading text-2xl font-black leading-[34px] text-white"
        >
          Thank you for your comment!
        </h2>

        <p
          id={descriptionId}
          className="relative z-10 max-w-[427px] text-center font-sans text-sm leading-5 text-white/60"
        >
          Your comment has been submitted and is awaiting approval from our
          moderators. We review all comments before they appear on the site to
          ensure a respectful and engaging discussion. Once approved, your
          comment will be visible to others.
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="relative z-10 inline-flex h-[38px] min-w-[128px] cursor-pointer items-center justify-center rounded-full border-[1.5px] border-accent-light bg-white px-6 py-2 font-sans text-base leading-[22px] text-primary transition-opacity hover:opacity-90"
        >
          Okay
        </button>
      </div>
    </div>
  );
}
