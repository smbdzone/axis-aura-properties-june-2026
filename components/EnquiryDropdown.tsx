"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

export type EnquiryDropdownOption = {
  value: string;
  label: string;
};

type EnquiryDropdownProps = {
  id?: string;
  label: string;
  options: EnquiryDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  variant?: "dark" | "light";
  labelPosition?: "inside" | "above";
  placeholder?: string;
  placement?: "bottom" | "top";
  className?: string;
};

export default function EnquiryDropdown({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
  variant = "dark",
  labelPosition = "inside",
  placeholder = "Select...",
  placement = "bottom",
  className = "",
}: EnquiryDropdownProps) {
  const isLight = variant === "light";
  const labelAbove = labelPosition === "above";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const generatedId = useId();
  const triggerId = id ?? generatedId;

  const selected = options.find((option) => option.value === value);
  const hasValue = Boolean(selected);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopImmediatePropagation();
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`relative ${labelAbove ? "flex flex-col gap-2" : ""} ${className}`}
    >
      {required ? (
        <input
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          value={value}
          required
          onChange={() => undefined}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
      ) : null}

      {labelAbove ? (
        <span className="flex items-center gap-0.5 font-heading text-[15px] font-medium leading-none text-primary">
          {label}
          {required ? (
            <span aria-hidden="true" className="text-xl leading-none">
              *
            </span>
          ) : null}
        </span>
      ) : null}

      <button
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={[
          "group flex w-full cursor-pointer items-center justify-between border-[1.5px] border-accent-light text-left",
          isLight
            ? "min-h-[51px] rounded-xl px-[15px] py-3 font-heading text-[15px] font-medium"
            : "h-[44px] rounded px-3 py-2.5 font-sans text-sm",
          isLight ? "bg-white" : "bg-primary",
          isLight
            ? hasValue
              ? "text-primary"
              : "text-primary/60"
            : hasValue
              ? "text-white"
              : "text-white/60",
        ].join(" ")}
      >
        <span className="truncate pr-2">
          {selected?.label ?? (labelAbove ? placeholder : label)}
        </span>
        <LuChevronDown
          className={[
            "size-4 shrink-0 transition-transform",
            isLight ? "text-primary/60" : "text-white/60",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={triggerId}
          className={[
            "enquiry-dropdown-scroll absolute left-0 right-0 z-[100] max-h-[160px] overflow-y-auto border-[1.5px] border-accent-light py-1 shadow-[0_8px_20px_rgba(0,0,0,0.25)]",
            placement === "top"
              ? "bottom-[calc(100%+4px)] top-auto"
              : "top-[calc(100%+4px)]",
            isLight ? "rounded-xl bg-white" : "rounded bg-primary",
          ].join(" ")}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full cursor-pointer px-3 py-2 text-left transition-colors",
                    isLight
                      ? "font-heading text-[15px] font-medium"
                      : "font-sans text-sm",
                    isLight
                      ? isSelected
                        ? "bg-primary text-white"
                        : "text-primary hover:bg-primary hover:text-white"
                      : isSelected
                        ? "bg-white text-primary"
                        : "text-white/80 hover:bg-white hover:text-primary",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
