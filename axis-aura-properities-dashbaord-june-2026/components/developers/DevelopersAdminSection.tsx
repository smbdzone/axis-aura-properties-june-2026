"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { type DeveloperItem } from "@/components/data/developersAdmin";
import { fetchDevelopers, deleteDeveloper } from "@/lib/api/developers";
import { mapDeveloperToItem } from "@/lib/api/mappers";
import {
  applyDeveloperSort,
  developerSortOptions,
  type DeveloperSortOption,
} from "@/components/data/adminSort";
import SortDataDropdown from "@/components/ui/SortDataDropdown";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

const PAGE_SIZE = 6;

type DeleteDialogState =
  | { type: "single"; id: string; label: string }
  | { type: "bulk"; count: number }
  | null;

const developersTableGridClassName =
  "grid w-full grid-cols-[78px_80px_minmax(0,1fr)_72px_96px] items-center gap-10";

const checkboxClassName =
  "size-[23px] appearance-none rounded-lg border border-[#669BBC] bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)] checked:border-[#003049] checked:bg-[#003049]";

function DeveloperLogo({ label, logoUrl }: { label: string; logoUrl?: string }) {
  if (logoUrl) {
    return (
      <div className="relative h-[50px] w-20 shrink-0 overflow-hidden rounded border-[1.5px] border-[#669BBC] bg-white">
        <Image src={logoUrl} alt={label} fill className="object-contain p-1" unoptimized />
      </div>
    );
  }

  return (
    <div className="flex h-[50px] w-20 shrink-0 items-center justify-center rounded border-[1.5px] border-[#669BBC] bg-white px-1">
      <span className="text-center font-[family-name:var(--font-sandena)] text-[9px] font-bold leading-tight tracking-wide text-[#003049]">
        {label}
      </span>
    </div>
  );
}

function DeveloperTableRow({
  item,
  displayNumber,
  checked,
  onToggle,
  onDelete,
}: {
  item: DeveloperItem;
  displayNumber: number;
  checked: boolean;
  onToggle: (itemId: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className={`${developersTableGridClassName} rounded-xl border-[1.5px] border-[#669BBC] px-6 py-3`}>
      <div className="flex items-center gap-[15px]">
        <input
          type="checkbox"
          aria-label={`Select row ${item.id}`}
          checked={checked}
          onChange={() => onToggle(item.id)}
          className={checkboxClassName}
        />
        <span className="font-[family-name:var(--font-sandena)] text-xs font-medium text-[#003049]">
          {displayNumber}
        </span>
      </div>

      <DeveloperLogo label={item.logoLabel} logoUrl={item.logoUrl} />

      <p className="min-w-0 font-[family-name:var(--font-sandena)] text-sm font-medium leading-[18px] text-[#003049]">
        {item.title}
      </p>

      <span className="text-center font-[family-name:var(--font-sandena)] text-xs font-medium text-[#003049]">
        {item.propertyCount}
      </span>

      <div className="flex items-center gap-2 text-[#003049]">
        <Link href={`/developers/view/${item.id}`} className="cursor-pointer" aria-label={`View ${item.title}`}>
          <Icon icon="lsicon:view-outline" width={16} height={16} />
        </Link>
        <span className="h-[7.5px] w-0 border-l-2 border-[#669BBC]" aria-hidden="true" />
        <Link href={`/developers/edit/${item.id}`} className="cursor-pointer" aria-label={`Edit ${item.title}`}>
          <Icon icon="basil:edit-outline" width={16} height={16} />
        </Link>
        <span className="h-[7.5px] w-0 border-l-2 border-[#669BBC]" aria-hidden="true" />
        <button type="button" className="cursor-pointer" aria-label={`Delete ${item.title}`} onClick={onDelete}>
          <Icon icon="fluent:delete-16-regular" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

export default function DevelopersAdminSection() {
  const [items, setItems] = useState<DeveloperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<DeveloperSortOption>("A-Z");
  const selectAllRef = useRef<HTMLInputElement>(null);

  const loadDevelopers = async () => {
    setLoading(true);
    setError("");
    try {
      const developers = await fetchDevelopers();
      setItems(developers.map(mapDeveloperToItem));
    } catch {
      setError("Failed to load developers.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDevelopers();
  }, []);

  const sortedItems = useMemo(
    () => applyDeveloperSort(items, sortBy),
    [items, sortBy],
  );
  const totalCount = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const paginatedItems = useMemo(
    () => sortedItems.slice(startIdx, startIdx + PAGE_SIZE),
    [sortedItems, startIdx],
  );
  const startIndex = totalCount === 0 ? 0 : startIdx + 1;
  const endIndex = startIdx + paginatedItems.length;
  const canGoPrev = safePage > 1;
  const canGoNext = safePage < totalPages;
  const pageIds = paginatedItems.map((item) => item.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedRowIds.includes(id));
  const hasSomePageSelected = pageIds.some((id) => selectedRowIds.includes(id)) && !allPageSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = hasSomePageSelected;
    }
  }, [hasSomePageSelected]);

  const toggleSingleRow = (itemId: string) => {
    setSelectedRowIds((current) =>
      current.includes(itemId)
        ? current.filter((selectedId) => selectedId !== itemId)
        : [...current, itemId],
    );
  };

  const toggleSelectAll = () => {
    setSelectedRowIds((current) => {
      if (allPageSelected) {
        return current.filter((id) => !pageIds.includes(id));
      }
      return [...new Set([...current, ...pageIds])];
    });
  };

  const handleSortChange = (value: DeveloperSortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const requestDeleteSelected = () => {
    if (!selectedRowIds.length) {
      toast.error("Select at least one developer to delete.");
      return;
    }
    setDeleteDialog({ type: "bulk", count: selectedRowIds.length });
  };

  const requestDeleteOne = (id: string, label: string) => {
    setDeleteDialog({ type: "single", id, label });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog) return;

    setDeleting(true);
    try {
      if (deleteDialog.type === "single") {
        await deleteDeveloper(deleteDialog.id);
        setSelectedRowIds((current) => current.filter((rowId) => rowId !== deleteDialog.id));
        toast.success(`"${deleteDialog.label}" deleted successfully.`);
      } else {
        await Promise.all(selectedRowIds.map((id) => deleteDeveloper(id)));
        setSelectedRowIds([]);
        toast.success(`${deleteDialog.count} developer(s) deleted successfully.`);
      }
      await loadDevelopers();
    } catch {
      toast.error("Failed to delete developer(s). Please try again.");
    } finally {
      setDeleting(false);
      setDeleteDialog(null);
    }
  };

  const deleteDialogTitle =
    deleteDialog?.type === "single" ? "Delete Developer" : "Delete Developers";

  const deleteDialogMessage =
    deleteDialog?.type === "single"
      ? `Are you sure you want to delete "${deleteDialog.label}"? This action cannot be undone.`
      : `Are you sure you want to delete ${deleteDialog?.count ?? 0} selected developer(s)? This action cannot be undone.`;

  return (
    <>
      <ConfirmDialog
        open={deleteDialog !== null}
        title={deleteDialogTitle}
        message={deleteDialogMessage}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => {
          if (!deleting) setDeleteDialog(null);
        }}
      />

      <section className="mx-auto flex w-full  flex-col items-center gap-8 px-8 py-8">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex h-[46px] w-full items-center justify-end gap-5">
            <Link
              href="/developers/add"
              className="relative isolate flex h-[46px] w-[184px] items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-[#669BBC] bg-[#003049] px-5"
            >
              <span className="font-[family-name:var(--font-sandena)] text-base font-bold text-white">
                Add a Developer
              </span>
            </Link>
          </div>

          <div className="flex w-full flex-col gap-6 rounded-2xl border-[1.5px] border-[#669BBC] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-sandena)] text-2xl font-bold leading-[33px] text-[#003049]">
                A-Z
              </h2>
              <div className="flex items-center gap-4">
                <button type="button" aria-label="Delete selected" onClick={requestDeleteSelected}>
                  <Icon icon="fluent:delete-16-regular" width={20} height={20} color="#003049" />
                </button>
                <span className="h-7 w-0 border-l-2 border-[#669BBC]" aria-hidden="true" />
                <SortDataDropdown
                  value={sortBy}
                  options={developerSortOptions}
                  onChange={handleSortChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className={`${developersTableGridClassName} border-b border-[#669BBC] px-6 pb-4`}>
                <div className="flex items-center gap-[15px]">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    aria-label="Select all"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    className={checkboxClassName}
                  />
                  <span className="text-xs text-black/60">#</span>
                </div>
                <span className="text-xs text-black/60">Logo</span>
                <span className="text-xs text-black/60">Title</span>
                <span className="text-center text-xs text-black/60">No: of Properties</span>
                <span className="text-xs text-black/60">Action</span>
              </div>

              <div className="flex flex-col gap-1">
                {loading ? (
                  <p className="px-6 py-4 text-sm text-black/60">Loading developers...</p>
                ) : error ? (
                  <p className="px-6 py-4 text-sm text-red-600">{error}</p>
                ) : paginatedItems.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-black/60">No developers yet.</p>
                ) : (
                  paginatedItems.map((item, index) => (
                    <DeveloperTableRow
                      key={item.id}
                      item={item}
                      displayNumber={startIdx + index + 1}
                      checked={selectedRowIds.includes(item.id)}
                      onToggle={toggleSingleRow}
                      onDelete={() => requestDeleteOne(item.id, item.title)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between px-4">
          <p className="flex items-end gap-1 font-[family-name:var(--font-sandena)]">
            <span className="text-2xl font-medium leading-[31px] text-[#003049]">
              {startIndex} - {endIndex}
            </span>
            <span className="pb-0.5 text-base font-medium leading-[21px] text-black/60">
              of {totalCount}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={!canGoPrev}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="flex h-[33px] w-6 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Image src="/arrow/left.svg" alt="" width={24} height={33} aria-hidden="true" />
            </button>
            <span className="h-[14px] w-0 border-l-2 border-[#669BBC]" aria-hidden="true" />
            <button
              type="button"
              aria-label="Next page"
              disabled={!canGoNext}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="flex h-[33px] w-6 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Image src="/arrow/right.svg" alt="" width={24} height={33} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
