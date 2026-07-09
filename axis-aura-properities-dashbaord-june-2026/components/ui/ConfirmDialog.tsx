"use client";

import { useEffect } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function DialogBlurBackground() {
  return (
    <>
      <span
        className="pointer-events-none absolute -left-[80px] -top-[120px] h-[267px] w-[41px] rotate-[-150deg] bg-accent-light/50 blur-[23px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute left-[90px] -top-[160px] h-[353px] w-[36px] rotate-[-150deg] bg-accent-light/50 blur-[23px]"
        aria-hidden="true"
      />
    </>
  );
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/30 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="relative isolate w-full max-w-[340px] overflow-hidden rounded-2xl border-[1.5px] border-accent-light bg-white p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 border-b border-accent-light pb-3">
            <h2
              id="confirm-dialog-title"
              className="font-sans text-xl font-bold leading-[27px] text-primary"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-message"
              className="font-sans text-sm font-medium leading-[19px] text-black/60"
            >
              {message}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer rounded-lg border-[1.5px] border-accent-light px-4 py-2 font-sans text-sm font-medium leading-[19px] text-primary transition-colors hover:bg-accent-light/10"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="relative isolate cursor-pointer overflow-hidden rounded-lg border-[1.5px] border-accent-light px-4 py-2"
            >
              <span
                className="absolute inset-0 bg-primary"
                aria-hidden="true"
              />
              <DialogBlurBackground />
              <span className="relative z-[1] font-sans text-sm font-bold leading-[19px] text-white">
                {confirmLabel}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
