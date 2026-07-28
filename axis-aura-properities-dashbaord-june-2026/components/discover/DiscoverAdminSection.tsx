"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  fetchDiscoverItems,
  deleteDiscover,
  type ApiDiscover,
} from "@/lib/api/discover";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import PermissionGate from "@/components/auth/PermissionGate";

type DeleteDialogState = { id: string; label: string } | null;

export default function DiscoverAdminSection() {
  const [items, setItems] = useState<ApiDiscover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(null);
  const [deleting, setDeleting] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDiscoverItems();
      setItems(data);
    } catch {
      setError("Failed to load Discover videos.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteDialog) return;
    setDeleting(true);
    try {
      await deleteDiscover(deleteDialog.id);
      toast.success("Discover video deleted successfully.");
      await loadItems();
    } catch {
      toast.error("Failed to delete Discover video. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteDialog(null);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={deleteDialog !== null}
        title="Delete Discover video"
        message={`Are you sure you want to delete this video${deleteDialog?.label ? `: "${deleteDialog.label}"` : ""
          }? This action cannot be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => {
          if (!deleting) setDeleteDialog(null);
        }}
      />

      <section className="mx-auto flex w-full flex-col items-center gap-8 px-8 py-8">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex h-[46px] w-full items-center justify-end gap-5">
            <PermissionGate superAdminOnly>
            <Link
              href="/discover/add"
              className="relative isolate flex h-[46px] w-[220px] items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-[#669BBC] bg-[#003049] px-5"
            >
              <span className="font-[family-name:var(--font-sandena)] text-base font-bold text-white">
                Add a Video
              </span>
            </Link>
            </PermissionGate>
          </div>

          <div className="flex w-full flex-col gap-4 rounded-2xl border-[1.5px] border-[#669BBC] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-sandena)] text-2xl font-bold leading-[33px] text-[#003049]">
                Discover Videos
              </h2>
              <span className="font-[family-name:var(--font-sandena)] text-sm font-medium text-black/60">
                {items.length} total
              </span>
            </div>

            <div className="flex items-center gap-6 border-b border-[#669BBC] px-2 pb-3">
              <span className="w-[110px] text-xs text-black/60">Thumbnail</span>
              <span className="min-w-0 flex-1 text-xs text-black/60">Title</span>
              <span className="w-[104px] text-right text-xs text-black/60">Action</span>
            </div>

            {loading ? (
              <p className="px-2 py-4 text-sm text-black/60">Loading videos...</p>
            ) : error ? (
              <p className="px-2 py-4 text-sm text-red-600">{error}</p>
            ) : items.length === 0 ? (
              <p className="px-2 py-4 text-sm text-black/60">
                No Discover videos yet. Add your first one above.
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-6 rounded-xl border-[1.5px] border-[#669BBC] px-2 py-3"
                  >
                    <div className="relative h-[64px] w-[110px] shrink-0 overflow-hidden rounded-lg border border-accent-light bg-black/5">
                      {item.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-primary/60">
                          <Icon icon="mdi:video" width={26} height={26} />
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="truncate font-[family-name:var(--font-sandena)] text-sm font-bold text-[#003049]">
                        {item.title}
                      </p>
                      {item.description ? (
                        <p className="line-clamp-1 font-[family-name:var(--font-sandena)] text-xs font-medium text-[rgba(0,48,73,0.75)]">
                          {item.description}
                        </p>
                      ) : null}
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate font-[family-name:var(--font-sandena)] text-xs font-medium text-[#669BBC] underline"
                      >
                        {item.videoUrl}
                      </a>
                    </div>

                    <div className="flex w-[104px] shrink-0 items-center justify-end gap-2 text-[#003049]">
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer"
                        aria-label={`View video: ${item.title}`}
                      >
                        <Icon icon="lsicon:view-outline" width={16} height={16} />
                      </a>
                      <span className="h-[7.5px] w-0 border-l-2 border-[#669BBC]" aria-hidden="true" />
                      <Link
                        href={`/discover/edit/${item._id}`}
                        className="cursor-pointer"
                        aria-label={`Edit video: ${item.title}`}
                      >
                        <Icon icon="basil:edit-outline" width={16} height={16} />
                      </Link>
                      <span className="h-[7.5px] w-0 border-l-2 border-[#669BBC]" aria-hidden="true" />
                      <button
                        type="button"
                        className="cursor-pointer"
                        aria-label={`Delete video: ${item.title}`}
                        onClick={() => setDeleteDialog({ id: item._id, label: item.title })}
                      >
                        <Icon icon="fluent:delete-16-regular" width={16} height={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
