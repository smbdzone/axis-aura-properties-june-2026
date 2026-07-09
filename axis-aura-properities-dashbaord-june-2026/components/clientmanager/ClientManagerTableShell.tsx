"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import SortDataDropdown from "@/components/ui/SortDataDropdown";

export const clientManagerCheckboxClassName =
  "size-[23px] appearance-none rounded-lg border border-accent-light bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)] checked:border-primary checked:bg-primary";

export function ClientManagerToolbar() {
  return (
    <div className="flex h-[46px] w-full items-center gap-5">
      <button
        type="button"
        className="relative isolate flex h-[46px] w-[458px] items-center justify-between overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-primary px-4"
      >
        <span className="font-sans text-sm font-medium leading-[18px] text-white/60">Search</span>
        <Icon icon="bitcoin-icons:search-filled" width={24} height={24} color="rgba(255,255,255,0.6)" />
      </button>
    </div>
  );
}

export function ClientManagerTableHeader<T extends string>({
  children,
  sortValue,
  sortOptions,
  onSortChange,
  onDeleteSelected,
}: {
  children: React.ReactNode;
  sortValue: T;
  sortOptions: readonly T[];
  onSortChange: (value: T) => void;
  onDeleteSelected?: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border-[1.5px] border-accent-light p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-2xl font-bold leading-[33px] text-primary">A-Z</h2>
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Delete selected" onClick={onDeleteSelected}>
            <Icon icon="fluent:delete-16-regular" width={20} height={20} color="#003049" />
          </button>
          <span className="h-7 w-0 border-l-2 border-accent-light" aria-hidden="true" />
          <SortDataDropdown value={sortValue} options={sortOptions} onChange={onSortChange} />
        </div>
      </div>

      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function ClientManagerPagination() {
  return (
    <div className="flex w-full items-center justify-between px-4">
      <p className="flex items-end gap-1 font-sans">
        <span className="text-2xl font-medium leading-[31px] text-primary">1 - 8</span>
        <span className="pb-0.5 text-base font-medium leading-[21px] text-black/60">of 45</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled
          className="flex h-[33px] w-6 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Image src="/arrow/left.svg" alt="" width={24} height={33} aria-hidden="true" />
        </button>
        <span className="h-[14px] w-0 border-l-2 border-accent-light" aria-hidden="true" />
        <button
          type="button"
          aria-label="Next page"
          className="flex h-[33px] w-6 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Image src="/arrow/right.svg" alt="" width={24} height={33} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
