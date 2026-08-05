"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  propertySortOptions,
  propertyTableColumns,
  sortPropertyRows,
  type PropertyRow,
  type PropertySortOption,
} from "@/components/data/propertyData";
import { bulkDeleteProperties, deleteProperty, fetchProperties } from "@/lib/api/properties";
import { mapPropertyToRow } from "@/lib/api/mappers";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SortDataDropdown from "@/components/ui/SortDataDropdown";
import { toast } from "sonner";
import PropertyModal from "./PropertyModal";
import PermissionGate from "@/components/auth/PermissionGate";

const PAGE_SIZE = 6;

type DialogState =
  | { type: "single"; row: PropertyRow }
  | { type: "bulk"; count: number }
  | null;

type PropertyModalState = { propertyId: string } | null;

const checkboxClassName =
  "size-[23px] shrink-0 appearance-none rounded-lg border border-accent-light bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)] checked:border-primary checked:bg-primary";

const tableGridClassName =
  "grid w-full grid-cols-[78px_minmax(0,1.1fr)_minmax(0,0.75fr)_minmax(0,0.7fr)_minmax(0,0.75fr)_minmax(0,0.95fr)_96px] items-center gap-4";

function BlurredButtonBackground() {
  return (
    <>
      <span
        className="pointer-events-none absolute -left-[166px] -top-[230px] h-[757px] w-[78px] rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute left-[120px] -top-[129px] h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
        aria-hidden="true"
      />
    </>
  );
}

function PropertyTableRow({
  row,
  displayNumber,
  selected,
  onSelectChange,
  onView,
  onDelete,
}: {
  row: PropertyRow;
  displayNumber: number;
  selected: boolean;
  onSelectChange: (checked: boolean) => void;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`${tableGridClassName} h-16 rounded-xl border-[1.5px] border-accent-light px-6 py-3`}>
      <div className="flex items-center gap-[15px]">
        <input
          type="checkbox"
          aria-label={`Select ${row.name}`}
          checked={selected}
          onChange={(event) => onSelectChange(event.target.checked)}
          className={checkboxClassName}
        />
        <span className="font-sans text-xs font-medium leading-4 text-black">
          {displayNumber}
        </span>
      </div>

      <span className="truncate font-sans text-xs font-bold leading-4 text-primary">
        {row.name}
      </span>

      <span className="font-sans text-xs font-medium leading-4 text-[rgba(0,48,73,0.8)]">
        {row.type}
      </span>

      <span className="font-sans text-xs font-medium leading-4 text-[rgba(0,48,73,0.8)]">
        {row.area}
      </span>

      <span className="font-sans text-xs font-medium leading-4 text-[rgba(0,48,73,0.8)]">
        {row.developer}
      </span>

      <span className="font-sans text-xs font-medium leading-4 text-[rgba(0,48,73,0.8)]">
        {row.startingPrice}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`View ${row.name}`}
          onClick={onView}
          className="cursor-pointer text-primary"
        >
          <Icon icon="lsicon:view-outline" width={16} height={16} />
        </button>
        <span
          className="h-[7.5px] w-0 border-l-2 border-accent-light"
          aria-hidden="true"
        />
        <Link
          href={`/properties/edit/${row.id}`}
          aria-label={`Edit ${row.name}`}
          className="cursor-pointer text-primary"
        >
          <Icon icon="mdi:pencil-outline" width={16} height={16} />
        </Link>
        <span
          className="h-[7.5px] w-0 border-l-2 border-accent-light"
          aria-hidden="true"
        />
        <button
          type="button"
          aria-label={`Delete ${row.name}`}
          onClick={onDelete}
          className="cursor-pointer text-primary"
        >
          <Icon icon="fluent:delete-16-regular" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

export default function PropertyPage() {
  const [rows, setRows] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [deleting, setDeleting] = useState(false);
  const [propertyModal, setPropertyModal] = useState<PropertyModalState>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<PropertySortOption>("A-Z");

  const loadProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const properties = await fetchProperties();
      setRows(properties.map(mapPropertyToRow));
    } catch {
      setError("Failed to load properties.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProperties();
  }, []);

  const sortedRows = useMemo(() => sortPropertyRows(rows, sortBy), [rows, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const paginatedRows = sortedRows.slice(startIdx, startIdx + PAGE_SIZE);
  const startIndex = sortedRows.length === 0 ? 0 : startIdx + 1;
  const endIndex = startIdx + paginatedRows.length;
  const canGoPrev = safePage > 1;
  const canGoNext = safePage < totalPages;
  const pageIds = paginatedRows.map((row) => row.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const somePageSelected =
    pageIds.some((id) => selectedIds.includes(id)) && !allPageSelected;

  function handleSortChange(value: PropertySortOption) {
    setSortBy(value);
    setCurrentPage(1);
  }

  function handleSelect(id: string, checked: boolean) {
    setSelectedIds((current) =>
      checked ? [...current, id] : current.filter((selectedId) => selectedId !== id),
    );
  }

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds((current) => [...new Set([...current, ...pageIds])]);
      return;
    }

    setSelectedIds((current) =>
      current.filter((id) => !pageIds.includes(id)),
    );
  }

  async function handleConfirmDelete() {
    if (!dialog) return;

    setDeleting(true);
    try {
      if (dialog.type === "single") {
        await deleteProperty(dialog.row.id);
        toast.success(`"${dialog.row.name}" deleted successfully.`);
      } else {
        await bulkDeleteProperties(selectedIds);
        toast.success(`${dialog.count} propert${dialog.count === 1 ? "y" : "ies"} deleted successfully.`);
      }
      await loadProperties();
      setSelectedIds([]);
    } catch {
      toast.error("Failed to delete property. Please try again.");
    } finally {
      setDeleting(false);
      setDialog(null);
    }
  }

  function requestBulkDelete() {
    if (!selectedIds.length) {
      toast.error("Select at least one property to delete.");
      return;
    }
    setDialog({ type: "bulk", count: selectedIds.length });
  }

  const dialogTitle =
    dialog?.type === "single" ? "Delete Property" : "Delete Properties";

  const dialogMessage =
    dialog?.type === "single"
      ? `Are you sure you want to delete "${dialog.row.name}"? This action cannot be undone.`
      : `Are you sure you want to delete ${dialog?.count ?? 0} selected properties? This action cannot be undone.`;

  return (
    <>
      <ConfirmDialog
        open={dialog !== null}
        title={dialogTitle}
        message={dialogMessage}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => {
          if (!deleting) setDialog(null);
        }}
      />

      <PropertyModal
        open={propertyModal !== null}
        propertyId={propertyModal?.propertyId ?? null}
        onClose={() => setPropertyModal(null)}
      />

      <div className="mx-auto flex w-full flex-col gap-8 p-8">
        <div className="flex flex-wrap items-center justify-end gap-4">
          <PermissionGate permission="properties" level="edit">
          <Link
            href="/properties/add"
            className="relative isolate flex h-[46px] w-[189px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-accent-light px-5 py-3"
          >
            <BlurredButtonBackground />
            <span className="absolute inset-0 -z-[1] rounded-xl bg-primary" aria-hidden="true" />
            <span className="relative z-[1] font-sans text-base font-bold leading-[22px] text-white">
              Add a Property
            </span>
          </Link>
          </PermissionGate>
        </div>

        <div className="flex w-full flex-col gap-6 rounded-2xl border-[1.5px] border-accent-light p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-sans text-2xl font-bold leading-[33px] text-primary">
              {sortBy}
            </h1>

            <div className="flex items-center gap-4">
              <PermissionGate permission="properties" level="edit">
              <button
                type="button"
                aria-label="Delete selected properties"
                onClick={requestBulkDelete}
                className="cursor-pointer text-primary"
              >
                <Icon icon="fluent:delete-16-regular" width={20} height={20} />
              </button>
              </PermissionGate>

              <span
                className="h-7 w-0 border-l-2 border-accent-light"
                aria-hidden="true"
              />

              <SortDataDropdown
                value={sortBy}
                options={propertySortOptions}
                onChange={handleSortChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="border-b-2 border-accent-light pb-4">
              <div className={`${tableGridClassName} px-6`}>
                {propertyTableColumns.map((column) =>
                  column.key === "number" ? (
                    <div
                      key={column.key}
                      className="flex items-center gap-[15px]"
                    >
                      <input
                        type="checkbox"
                        aria-label="Select all on this page"
                        checked={allPageSelected}
                        ref={(element) => {
                          if (element) {
                            element.indeterminate = somePageSelected;
                          }
                        }}
                        onChange={(event) =>
                          handleSelectAll(event.target.checked)
                        }
                        className={checkboxClassName}
                      />
                      <span className="font-sans text-xs font-medium leading-4 text-black/60">
                        {column.label}
                      </span>
                    </div>
                  ) : (
                    <span
                      key={column.key}
                      className="font-sans text-xs font-medium leading-4 text-black/60"
                    >
                      {column.label}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {loading ? (
                <p className="px-6 py-4 text-sm text-black/60">Loading properties...</p>
              ) : error ? (
                <p className="px-6 py-4 text-sm text-red-600">{error}</p>
              ) : paginatedRows.length === 0 ? (
                <p className="px-6 py-4 text-sm text-black/60">No properties yet.</p>
              ) : (
                paginatedRows.map((row, index) => (
                  <PropertyTableRow
                    key={row.id}
                    row={row}
                    displayNumber={startIdx + index + 1}
                    selected={selectedIds.includes(row.id)}
                    onSelectChange={(checked) => handleSelect(row.id, checked)}
                    onView={() => setPropertyModal({ propertyId: row.id })}
                    onDelete={() => setDialog({ type: "single", row })}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4">
          <p className="flex items-end gap-1 font-sans">
            <span className="text-2xl font-medium leading-[31px] text-primary">
              {startIndex} - {endIndex}
            </span>
            <span className="pb-0.5 text-base font-medium leading-[21px] text-black/60">
              of {sortedRows.length}
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
              <Image
                src="/arrow/left.svg"
                alt=""
                width={24}
                height={33}
                aria-hidden="true"
              />
            </button>

            <span
              className="h-3.5 w-0 border-l-2 border-accent-light"
              aria-hidden="true"
            />

            <button
              type="button"
              aria-label="Next page"
              disabled={!canGoNext}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="flex h-[33px] w-6 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Image
                src="/arrow/right.svg"
                alt=""
                width={24}
                height={33}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
