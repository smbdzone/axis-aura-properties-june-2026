"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

type FilterDropdownProps<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

export default function FilterDropdown<T extends string>({
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
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
    <div ref={rootRef} className="relative z-50 w-[206px] shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className="relative isolate flex h-[47px] w-full items-center overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-primary px-4 py-2"
      >
        <span
          className="pointer-events-none absolute -left-[57px] -top-[105px] h-[267px] w-[41px] rotate-[-150deg] bg-accent-light/50 blur-[23px]"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute left-[83px] -top-[182px] h-[353px] w-[36px] rotate-[-150deg] bg-accent-light/50 blur-[23px]"
          aria-hidden="true"
        />

        <span className="relative z-[1] flex w-full items-center gap-2">
          <span className="flex-1 truncate text-left font-sans text-base font-medium leading-[21px] text-white">
            {value}
          </span>
          <IoChevronDown
            size={16}
            className={`shrink-0 text-white transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+2px)] isolate z-50 w-full overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-primary p-2.5 shadow-lg">
          <span
            className="pointer-events-none absolute -left-[211px] -top-[202px] h-[757px] w-[78px] rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute left-[147px] top-[81px] h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
            aria-hidden="true"
          />

          <div
            id={listboxId}
            role="listbox"
            aria-label="Filter options"
            className="relative z-[1] flex flex-col gap-1"
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
                  className={`flex h-[29px] w-full cursor-pointer items-center rounded-lg px-3 py-1 text-left font-sans text-base font-medium leading-[21px] transition-colors duration-300 hover:bg-primary hover:text-white ${selected ? "bg-white text-primary" : "text-white"
                    }`}
                >
                  <span className="truncate">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
