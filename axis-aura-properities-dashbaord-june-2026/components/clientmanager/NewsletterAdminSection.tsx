"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import {
  fetchNewsletterSubscribers,
  deleteNewsletterSubscriber,
  bulkDeleteNewsletterSubscribers,
  type ApiNewsletterSubscriber,
} from "@/lib/api/newsletter";
import {
  applyDatedNameSort,
  datedNameSortOptions,
  type DatedNameSortOption,
} from "@/components/data/adminSort";
import {
  ClientManagerTableHeader,
  clientManagerCheckboxClassName,
} from "@/components/clientmanager/ClientManagerTableShell";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

const PAGE_SIZE = 8;

const gridClassName =
  "grid w-full grid-cols-[43px_140px_minmax(160px,1fr)_120px_60px] items-center gap-8";

type DeleteDialogState =
  | { type: "single"; id: string; label: string }
  | { type: "bulk"; count: number }
  | null;

function getDisplayName(item: ApiNewsletterSubscriber) {
  const localPart = item.email?.split("@")[0]?.trim();
  return localPart || item.email || "—";
}

function NewsletterTableRow({
  item,
  displayNumber,
  checked,
  onToggle,
  onDelete,
}: {
  item: ApiNewsletterSubscriber;
  displayNumber: number;
  checked: boolean;
  onToggle: (id: string) => void;
  onDelete: () => void;
}) {
  const displayName = getDisplayName(item);

  return (
    <div className="flex items-center rounded-xl border-[1.5px] border-accent-light px-6 py-3">
      <div className={gridClassName}>
        <div className="flex items-center gap-[15px]">
          <input
            type="checkbox"
            aria-label={`Select ${displayName}`}
            checked={checked}
            onChange={() => onToggle(item.id)}
            className={clientManagerCheckboxClassName}
          />
          <span className="font-sans text-xs font-medium text-black">{displayNumber}</span>
        </div>
        <span className="truncate font-sans text-xs font-bold capitalize text-primary">
          {displayName}
        </span>
        <span className="truncate font-sans text-xs font-medium text-[rgba(0,48,73,0.8)]">
          {item.email}
        </span>
        <span className="font-sans text-xs font-medium text-[rgba(0,48,73,0.8)]">
          {item.date}
        </span>
        <button
          type="button"
          aria-label={`Delete subscriber ${item.email}`}
          onClick={onDelete}
          className="flex items-center justify-center text-primary"
        >
          <Icon icon="fluent:delete-16-regular" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

export default function NewsletterAdminSection() {
  const [items, setItems] = useState<ApiNewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(null);
  const [deleting, setDeleting] = useState(false);
  const [sortBy, setSortBy] = useState<DatedNameSortOption>("A-Z");
  const [currentPage, setCurrentPage] = useState(1);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const loadSubscribers = async () => {
    setLoading(true);
    setError("");
    try {
      const subscribers = await fetchNewsletterSubscribers();
      setItems(subscribers);
    } catch {
      setError("Failed to load newsletter subscribers.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSubscribers();
  }, []);

  const sortedItems = useMemo(
    () =>
      applyDatedNameSort(
        items,
        sortBy,
        (item) => getDisplayName(item),
        (item) => item.date ?? "",
      ),
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

  const toggleSingleRow = (id: string) => {
    setSelectedRowIds((current) =>
      current.includes(id) ? current.filter((rowId) => rowId !== id) : [...current, id],
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

  const handleSortChange = (value: DatedNameSortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const requestDeleteSelected = () => {
    if (!selectedRowIds.length) {
      toast.error("Select at least one subscriber to delete.");
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
        await deleteNewsletterSubscriber(deleteDialog.id);
        setSelectedRowIds((current) => current.filter((rowId) => rowId !== deleteDialog.id));
        toast.success(`Subscriber "${deleteDialog.label}" deleted.`);
      } else {
        await bulkDeleteNewsletterSubscribers(selectedRowIds);
        setSelectedRowIds([]);
        toast.success(`${deleteDialog.count} subscriber(s) deleted.`);
      }
      await loadSubscribers();
    } catch {
      toast.error("Failed to delete subscriber(s). Please try again.");
    } finally {
      setDeleting(false);
      setDeleteDialog(null);
    }
  };

  const deleteDialogTitle =
    deleteDialog?.type === "single" ? "Delete Subscriber" : "Delete Subscribers";
  const deleteDialogMessage =
    deleteDialog?.type === "single"
      ? `Are you sure you want to delete the subscriber "${deleteDialog.label}"? This action cannot be undone.`
      : `Are you sure you want to delete ${deleteDialog?.count ?? 0} selected subscriber(s)? This action cannot be undone.`;

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

      <section className="mx-auto flex w-full flex-col items-center gap-8 px-8 py-8">
        <div className="flex w-full flex-col items-center gap-6">
          <ClientManagerTableHeader
            sortValue={sortBy}
            sortOptions={datedNameSortOptions}
            onSortChange={handleSortChange}
            onDeleteSelected={requestDeleteSelected}
          >
            <div className="border-b-[1.5px] border-accent-light px-6 pb-4">
              <div className={gridClassName}>
                <div className="flex items-center gap-[15px]">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    aria-label="Select all"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    className={clientManagerCheckboxClassName}
                  />
                  <span className="text-xs text-black/60">#</span>
                </div>
                <span className="text-xs text-black/60">Name</span>
                <span className="text-xs text-black/60">Emails</span>
                <span className="text-xs text-black/60">Date</span>
                <span className="text-xs text-black/60">Action</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {loading ? (
                <p className="px-6 py-4 text-sm text-black/60">Loading subscribers...</p>
              ) : error ? (
                <p className="px-6 py-4 text-sm text-red-600">{error}</p>
              ) : paginatedItems.length === 0 ? (
                <p className="px-6 py-4 text-sm text-black/60">No newsletter subscribers yet.</p>
              ) : (
                paginatedItems.map((item, index) => (
                  <NewsletterTableRow
                    key={item.id}
                    item={item}
                    displayNumber={startIdx + index + 1}
                    checked={selectedRowIds.includes(item.id)}
                    onToggle={toggleSingleRow}
                    onDelete={() => requestDeleteOne(item.id, getDisplayName(item))}
                  />
                ))
              )}
            </div>
          </ClientManagerTableHeader>
        </div>

        <div className="flex w-full items-center justify-between px-4">
          <p className="flex items-end gap-1 font-sans">
            <span className="text-2xl font-medium leading-[31px] text-primary">
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
            <span className="h-[14px] w-0 border-l-2 border-accent-light" aria-hidden="true" />
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
