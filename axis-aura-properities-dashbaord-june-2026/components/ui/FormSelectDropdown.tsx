"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

type FormSelectDropdownProps<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
};

export default function FormSelectDropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className = "w-[280px]",
}: FormSelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className={`relative z-50 ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        className="flex h-[46px] w-full cursor-pointer items-center justify-between gap-3 rounded-xl border-[1.5px] border-[#669BBC] bg-white px-4"
      >
        <span className="truncate font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
          {value}
        </span>
        <IoChevronDown
          size={16}
          className={`shrink-0 text-[#003049] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full overflow-hidden rounded-xl border-[1.5px] border-[#669BBC] bg-white py-1 shadow-lg">
          <div id={listboxId} role="listbox" aria-label={ariaLabel} className="flex flex-col">
            {options.map((option) => {
              const selected = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`cursor-pointer px-4 py-2.5 text-left font-[family-name:var(--font-sandena)] text-sm font-medium ${selected
                      ? "bg-[#003049] text-white"
                      : "text-[#003049] hover:bg-[#669BBC]/15"
                    }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
