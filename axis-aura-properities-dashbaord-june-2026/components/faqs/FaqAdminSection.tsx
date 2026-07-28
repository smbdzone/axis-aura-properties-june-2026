"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  fetchFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  type ApiFaq,
} from "@/lib/api/faqs";
import { ApiError } from "@/lib/api/client";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import PermissionGate from "@/components/auth/PermissionGate";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-[#669BBC] bg-white px-4 py-3 font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049] outline-none placeholder:text-black/40";

type DeleteDialogState = { id: string; label: string } | null;

export default function FaqAdminSection() {
  const [items, setItems] = useState<ApiFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(null);
  const [deleting, setDeleting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const loadFaqs = async () => {
    setLoading(true);
    setError("");
    try {
      const faqs = await fetchFaqs();
      setItems(faqs);
    } catch {
      setError("Failed to load FAQs.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFaqs();
  }, []);

  const categorySuggestions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category?.trim()) set.add(item.category.trim());
    });
    return Array.from(set);
  }, [items]);

  const isEditing = Boolean(editingId);

  const resetForm = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setCategory("");
  };

  const startEdit = (faq: ApiFaq) => {
    setEditingId(faq._id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category ?? "");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }

    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim() || "General",
    };

    setSaving(true);
    const toastId = toast.loading(isEditing ? "Updating FAQ..." : "Adding FAQ...");
    try {
      if (isEditing && editingId) {
        await updateFaq(editingId, payload);
        toast.success("FAQ updated successfully.", { id: toastId });
      } else {
        await createFaq(payload);
        toast.success("FAQ added successfully.", { id: toastId });
      }
      resetForm();
      await loadFaqs();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to save FAQ.";
      toast.error(message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog) return;
    setDeleting(true);
    try {
      await deleteFaq(deleteDialog.id);
      toast.success("FAQ deleted successfully.");
      if (editingId === deleteDialog.id) resetForm();
      await loadFaqs();
    } catch {
      toast.error("Failed to delete FAQ. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteDialog(null);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={deleteDialog !== null}
        title="Delete FAQ"
        message={`Are you sure you want to delete this FAQ${
          deleteDialog?.label ? `: "${deleteDialog.label}"` : ""
        }? This action cannot be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => {
          if (!deleting) setDeleteDialog(null);
        }}
      />

      <section className="mx-auto flex w-full flex-col gap-8 px-8 py-8">
        <PermissionGate permission="faqs" level="edit">
        <div
          ref={formRef}
          className="flex w-full flex-col gap-4 rounded-2xl border-[1.5px] border-accent-light p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-sandena)] text-2xl font-bold text-primary">
              {isEditing ? "Edit FAQ" : "Add a FAQ"}
            </h2>
            {isEditing ? (
              <button
                type="button"
                onClick={resetForm}
                className="font-[family-name:var(--font-sandena)] text-sm font-medium text-primary underline"
              >
                Cancel edit
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
                Category
              </label>
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="e.g. Property Related"
                list="faq-category-suggestions"
                className={inputClass}
              />
              <datalist id="faq-category-suggestions">
                {categorySuggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
                Question
              </label>
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Write the question"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
                Answer
              </label>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write the answer"
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleSave()}
                className="flex h-[46px] items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-metallic-dark px-8 font-[family-name:var(--font-sandena)] text-base font-medium text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : isEditing ? "Update FAQ" : "Add FAQ"}
              </button>
            </div>
          </div>
        </div>
        </PermissionGate>

        <div className="flex w-full flex-col gap-3 rounded-2xl border-[1.5px] border-accent-light p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-sandena)] text-2xl font-bold text-primary">
              All FAQs
            </h2>
            <span className="font-[family-name:var(--font-sandena)] text-sm font-medium text-black/60">
              {items.length} total
            </span>
          </div>

          {loading ? (
            <p className="py-6 text-sm text-black/60">Loading FAQs...</p>
          ) : error ? (
            <p className="py-6 text-sm text-red-600">{error}</p>
          ) : items.length === 0 ? (
            <p className="py-6 text-sm text-black/60">No FAQs yet. Add your first one above.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((faq, index) => (
                <div
                  key={faq._id}
                  className="flex items-start justify-between gap-4 rounded-xl border-[1.5px] border-accent-light px-5 py-4"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-[family-name:var(--font-sandena)] text-xs font-medium text-black/50">
                        #{index + 1}
                      </span>
                      {faq.category ? (
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-[family-name:var(--font-sandena)] text-[11px] font-medium text-primary">
                          {faq.category}
                        </span>
                      ) : null}
                    </div>
                    <p className="font-[family-name:var(--font-sandena)] text-sm font-bold text-primary">
                      {faq.question}
                    </p>
                    <p className="font-[family-name:var(--font-sandena)] text-xs font-medium leading-5 text-[rgba(0,48,73,0.75)]">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 pt-1 text-primary">
                    <button
                      type="button"
                      aria-label={`Edit FAQ: ${faq.question}`}
                      onClick={() => startEdit(faq)}
                      className="cursor-pointer"
                    >
                      <Icon icon="basil:edit-outline" width={18} height={18} />
                    </button>
                    <span
                      className="h-[14px] w-0 border-l-2 border-accent-light"
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      aria-label={`Delete FAQ: ${faq.question}`}
                      onClick={() => setDeleteDialog({ id: faq._id, label: faq.question })}
                      className="cursor-pointer"
                    >
                      <Icon icon="fluent:delete-16-regular" width={18} height={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
