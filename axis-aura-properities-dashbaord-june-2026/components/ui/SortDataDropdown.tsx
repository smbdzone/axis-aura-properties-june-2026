"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

type SortDataDropdownProps<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

export default function SortDataDropdown<T extends string>({
  value,
  options,
  onChange,
}: SortDataDropdownProps<T>) {
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
    <div ref={rootRef} className="relative z-50">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className="flex h-[39px] cursor-pointer items-center gap-2.5 rounded-lg border-[1.5px] border-accent-light px-3 py-1"
      >
        <span className="font-sans text-base font-medium leading-[21px] text-primary">
          Sort Data
        </span>
        <IoChevronDown
          size={16}
          className={`shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[180px] overflow-hidden rounded-lg border-[1.5px] border-accent-light bg-white py-1 shadow-lg">
          <div
            id={listboxId}
            role="listbox"
            aria-label="Sort options"
            className="flex flex-col"
          >
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
                  className={`cursor-pointer px-3 py-2 text-left font-sans text-base font-medium leading-[21px] ${
                    selected
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-accent-light/20"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
