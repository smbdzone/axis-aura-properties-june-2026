"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { type CareerItem } from "@/components/data/careersAdmin";
import { fetchJobs, deleteJob } from "@/lib/api/jobs";
import { mapJobToCareerItem } from "@/lib/api/mappers";
import {
  applyNameSort,
  nameSortOptions,
  type NameSortOption,
} from "@/components/data/adminSort";
import SortDataDropdown from "@/components/ui/SortDataDropdown";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

const PAGE_SIZE = 6;

type DeleteDialogState =
  | { type: "single"; id: string; label: string }
  | { type: "bulk"; count: number }
  | null;

const careersTableGridClassName =
  "grid w-full grid-cols-[78px_140px_minmax(0,1fr)_minmax(130px,auto)_104px] items-center gap-6";

const checkboxClassName =
  "size-[23px] appearance-none rounded-lg border border-[#669BBC] bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)] checked:border-[#003049] checked:bg-[#003049]";

function CareerTableRow({
  item,
  displayNumber,
  checked,
  onToggle,
  onDelete,
}: {
  item: CareerItem;
  displayNumber: number;
  checked: boolean;
  onToggle: (itemId: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className={`${careersTableGridClassName} rounded-xl border-[1.5px] border-[#669BBC] px-6 py-3`}>
      <div className="flex items-center gap-[15px]">
        <input
          type="checkbox"
          aria-label={`Select row ${item.id}`}
          checked={checked}
          onChange={() => onToggle(item.id)}
          className={checkboxClassName}
        />
        <span className="font-[family-name:var(--font-sandena)] text-xs font-medium text-black">
          {displayNumber}
        </span>
      </div>

      <p className="font-[family-name:var(--font-sandena)] text-xs font-bold text-[#003049]">
        {item.jobTitle}
      </p>

      <p className="line-clamp-2 font-[family-name:Helvetica,Arial,sans-serif] text-sm leading-[150%] text-black/60">
        {item.jobDescription}
      </p>

      <span className="whitespace-nowrap font-[family-name:var(--font-sandena)] text-xs font-medium text-[rgba(0,48,73,0.8)]">
        {item.offering}
      </span>

      <div className="flex items-center gap-2 text-[#003049]">
        <Link href={`/careers/view/${item.id}`} className="cursor-pointer" aria-label={`View ${item.jobTitle}`}>
          <Icon icon="lsicon:view-outline" width={16} height={16} />
        </Link>
        <span className="h-[7.5px] w-0 border-l-2 border-[#669BBC]" aria-hidden="true" />
        <Link href={`/careers/edit/${item.id}`} className="cursor-pointer" aria-label={`Edit ${item.jobTitle}`}>
          <Icon icon="lucide:pencil" width={16} height={16} />
        </Link>
        <span className="h-[7.5px] w-0 border-l-2 border-[#669BBC]" aria-hidden="true" />
        <button type="button" className="cursor-pointer" aria-label={`Delete ${item.jobTitle}`} onClick={onDelete}>
          <Icon icon="fluent:delete-16-regular" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

export default function CareersAdminSection() {
  const [items, setItems] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<NameSortOption>("A-Z");
  const selectAllRef = useRef<HTMLInputElement>(null);

  const loadJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const jobs = await fetchJobs();
      setItems(jobs.map(mapJobToCareerItem));
    } catch {
      setError("Failed to load careers.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
  }, []);

  const sortedItems = useMemo(
    () => applyNameSort(items, sortBy, (item) => item.jobTitle),
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

  const handleSortChange = (value: NameSortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const requestDeleteSelected = () => {
    if (!selectedRowIds.length) {
      toast.error("Select at least one job to delete.");
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
        await deleteJob(deleteDialog.id);
        setSelectedRowIds((current) => current.filter((rowId) => rowId !== deleteDialog.id));
        toast.success(`"${deleteDialog.label}" deleted successfully.`);
      } else {
        await Promise.all(selectedRowIds.map((id) => deleteJob(id)));
        setSelectedRowIds([]);
        toast.success(`${deleteDialog.count} job(s) deleted successfully.`);
      }
      await loadJobs();
    } catch {
      toast.error("Failed to delete job(s). Please try again.");
    } finally {
      setDeleting(false);
      setDeleteDialog(null);
    }
  };

  const deleteDialogTitle =
    deleteDialog?.type === "single" ? "Delete Job" : "Delete Jobs";

  const deleteDialogMessage =
    deleteDialog?.type === "single"
      ? `Are you sure you want to delete "${deleteDialog.label}"? This action cannot be undone.`
      : `Are you sure you want to delete ${deleteDialog?.count ?? 0} selected job(s)? This action cannot be undone.`;

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
              href="/careers/add"
              className="relative isolate flex h-[46px] w-[118px] items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-[#669BBC] bg-[#003049] px-5"
            >
              <span className="font-[family-name:var(--font-sandena)] text-base font-bold text-white">
                Post a Job
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
                  options={nameSortOptions}
                  onChange={handleSortChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className={`${careersTableGridClassName} border-b-2 border-[#669BBC] px-6 pb-4`}>
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
                <span className="text-xs text-black/60">Job Title</span>
                <span className="text-xs text-black/60">Job Description</span>
                <span className="text-xs text-black/60">Offering</span>
                <span className="text-xs text-black/60">Action</span>
              </div>

              <div className="flex flex-col gap-1">
                {loading ? (
                  <p className="px-6 py-4 text-sm text-black/60">Loading careers...</p>
                ) : error ? (
                  <p className="px-6 py-4 text-sm text-red-600">{error}</p>
                ) : paginatedItems.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-black/60">No jobs posted yet.</p>
                ) : (
                  paginatedItems.map((item, index) => (
                    <CareerTableRow
                      key={item.id}
                      item={item}
                      displayNumber={startIdx + index + 1}
                      checked={selectedRowIds.includes(item.id)}
                      onToggle={toggleSingleRow}
                      onDelete={() => requestDeleteOne(item.id, item.jobTitle)}
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
