"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import FormSelectDropdown from "@/components/ui/FormSelectDropdown";
import {
  createArticle,
  fetchArticleById,
  updateArticle,
} from "@/lib/api/articles";
import { ApiError } from "@/lib/api/client";
import { toast } from "sonner";

const newsCategoryOptions = ["Properties", "General News", "Regulations"] as const;
type NewsCategory = (typeof newsCategoryOptions)[number];

function StyledInput({
  placeholder,
  rightText,
  withChevron = false,
  value,
  onChange,
  readOnly = false,
}: {
  placeholder: string;
  rightText?: string;
  withChevron?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="relative isolate flex h-[46px] w-full items-center justify-between overflow-hidden rounded-xl border-[1.5px] border-[#669BBC] bg-white px-4">
      <input
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className="w-full bg-transparent font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049] placeholder:text-black/60 outline-none"
      />
      <div className="flex items-center gap-3">
        {rightText ? (
          <span className="font-[family-name:var(--font-sandena)] text-sm font-medium text-black/60">
            {rightText}
          </span>
        ) : null}
        {withChevron ? (
          <Icon icon="mynaui:chevron-down-solid" width={16} height={16} color="#003049" />
        ) : null}
      </div>
    </div>
  );
}

function FormAccordion({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col gap-1">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-xl border-[1.5px] border-[#669BBC] bg-[#003049] px-4 py-3"
      >
        <span className="font-[family-name:var(--font-sandena)] text-2xl font-medium leading-8 text-white">
          {label}
        </span>
        <Icon
          icon="mynaui:chevron-down-solid"
          width={18}
          height={18}
          color="#FFFFFF"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function NewsRegulationsFormPage({
  articleId,
}: {
  articleId?: string;
}) {
  const router = useRouter();
  const isEditing = Boolean(articleId);
  const [category, setCategory] = useState<NewsCategory>("Properties");
  const [title, setTitle] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [description, setDescription] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [seoSchema, setSeoSchema] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [seoImageFile, setSeoImageFile] = useState<File | null>(null);
  const [existingBannerUrl, setExistingBannerUrl] = useState("");
  const [existingSeoImageUrl, setExistingSeoImageUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(Boolean(articleId));
  const [openSections, setOpenSections] = useState({
    blogDetails: true,
    seoDetails: false,
  });

  useEffect(() => {
    if (!articleId) return;
    let active = true;

    async function loadArticle(id: string) {
      setLoadingArticle(true);
      try {
        const article = await fetchArticleById(id);
        if (!active) return;
        const nextCategory = newsCategoryOptions.includes(
          article.category as NewsCategory,
        )
          ? (article.category as NewsCategory)
          : "Properties";
        setCategory(nextCategory);
        setTitle(article.title ?? "");
        setSeoTitle(article.seoTitle ?? "");
        setAltText(article.imageAlt ?? "");
        setDescription(article.description ?? "");
        setSeoDescription(article.seoDescription ?? "");
        setCanonicalUrl(article.canonicalUrl ?? "");
        setSeoSchema(
          article.articleSchemas && article.articleSchemas.length > 0
            ? JSON.stringify(article.articleSchemas, null, 2)
            : "",
        );
        setIsActive(article.status !== "inactive");
        setExistingBannerUrl(article.bannerUrl ?? "");
        setExistingSeoImageUrl(article.seoImageUrl ?? "");
      } catch {
        if (active) toast.error("Failed to load article.");
      } finally {
        if (active) setLoadingArticle(false);
      }
    }

    void loadArticle(articleId);
    return () => {
      active = false;
    };
  }, [articleId]);

  const autoSlug = useMemo(
    () =>
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
    [title],
  );

  const statusCheckboxClassName =
    "size-[23px] shrink-0 appearance-none rounded-lg border border-[#669BBC] bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)] checked:border-[#003049] checked:bg-[#003049]";

  async function handleSave() {
    setError("");

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("slug", autoSlug);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("imageAlt", altText.trim() || title.trim());
    formData.append("seoTitle", seoTitle.trim() || title.trim());
    formData.append("seoDescription", seoDescription.trim() || description);
    formData.append("canonicalUrl", canonicalUrl.trim());
    formData.append("status", isActive ? "active" : "inactive");
    formData.append("articleSchemas", seoSchema.trim() || "[]");
    if (bannerFile) formData.append("banner", bannerFile);
    if (seoImageFile) formData.append("seoImage", seoImageFile);

    setSaving(true);
    try {
      if (isEditing && articleId) {
        await updateArticle(articleId, formData);
        toast.success("Article updated successfully.");
      } else {
        await createArticle(formData);
        toast.success("Article published successfully.");
      }
      router.push("/news-and-regulations");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to save article.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loadingArticle) {
    return (
      <section className="mx-auto flex w-full flex-col items-center gap-4 px-8 py-8">
        <p className="self-start font-[family-name:var(--font-sandena)] text-sm font-medium text-black/60">
          Loading article...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full  flex-col items-center gap-4 px-0 py-0">
      <Link
        href="/news-and-regulations"
        className="flex w-fit items-center gap-2 self-start px-8 pt-8 font-[family-name:var(--font-sandena)] text-base font-medium leading-[21px] text-[#003049] transition-opacity hover:opacity-80"
      >
        <Image src="/arrow/left.svg" alt="" width={24} height={24} aria-hidden="true" />
        Back to News & Regulations
      </Link>

      <div className="flex w-full flex-col items-start gap-2 px-8">
        <h2 className="font-[family-name:var(--font-sandena)] text-base font-medium leading-[21px] text-[#003049]">
          Category
        </h2>
        <FormSelectDropdown
          value={category}
          options={newsCategoryOptions}
          onChange={setCategory}
          ariaLabel="Blog category"
          className="w-[240px]"
        />
      </div>

      <div className="flex w-full flex-1 flex-col justify-between gap-6 border-t-[1.5px] border-[#669BBC] px-8 pb-0 pt-8">
        <div className="flex flex-col gap-8">
          <FormAccordion
            label="Blog Details"
            open={openSections.blogDetails}
            onToggle={() =>
              setOpenSections((current) => ({ ...current, blogDetails: !current.blogDetails }))
            }
          >
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-1">
                <h3 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
                  Title
                </h3>
                <StyledInput placeholder="Write Title" rightText="80" value={title} onChange={setTitle} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
                  Slug
                </h3>
                <StyledInput
                  placeholder="Auto Slug"
                  value={autoSlug}
                  readOnly
                />
              </div>
            </div>

            <div className="mt-8 w-[496px]">
              <div className="flex flex-col gap-4">
                <h3 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
                  Upload Banner
                </h3>
                <label className="relative flex h-[235px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[1.5px] border-[#669BBC] bg-white">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,.svg"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(event) => setBannerFile(event.target.files?.[0] ?? null)}
                  />
                  <div className="pointer-events-none absolute inset-4 rounded-lg border border-dashed border-[#669BBC]" />
                  <Icon icon="material-symbols:upload" width={56} height={56} color="#000000" />
                  <div className="relative z-[1] flex flex-col items-center">
                    <span className="font-[family-name:var(--font-sandena)] text-xs font-bold text-black/60">
                      {bannerFile
                        ? bannerFile.name
                        : existingBannerUrl
                          ? "Current banner set — upload to replace"
                          : "Recommendation:"}
                    </span>
                    <span className="font-[family-name:var(--font-sandena)] text-[10px] font-medium text-black/60">
                      Recommend high Quality Images (Max Size 5MB)
                    </span>
                  </div>
                </label>

                <div className="flex flex-col gap-1">
                  <h3 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
                    Image Alt Text
                  </h3>
                  <StyledInput
                    placeholder="Write Alt Text"
                    rightText="80"
                    value={altText}
                    onChange={setAltText}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 w-full">
              <RichTextEditor
                label="Description"
                value={description}
                onChange={setDescription}
                placeholder="Write Description"
              />
            </div>
          </FormAccordion>

          <FormAccordion
            label="SEO Details"
            open={openSections.seoDetails}
            onToggle={() =>
              setOpenSections((current) => ({ ...current, seoDetails: !current.seoDetails }))
            }
          >
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-1">
                <h3 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
                  SEO Title
                </h3>
                <StyledInput
                  placeholder="Write SEO Title"
                  rightText="30"
                  value={seoTitle}
                  onChange={setSeoTitle}
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
                  Canonical URL
                </h3>
                <StyledInput
                  placeholder="https://example.com/blog/my-post"
                  value={canonicalUrl}
                  onChange={setCanonicalUrl}
                />
              </div>
            </div>

            <div className="mt-8 w-full">
              <RichTextEditor
                label="SEO Description"
                value={seoDescription}
                onChange={setSeoDescription}
                placeholder="Write SEO Description"
              />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-1">
                <h3 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
                  SEO Image
                </h3>
                <label className="relative flex h-[200px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[1.5px] border-[#669BBC] bg-white">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,.svg"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(event) => setSeoImageFile(event.target.files?.[0] ?? null)}
                  />
                  <div className="pointer-events-none absolute inset-4 rounded-lg border border-dashed border-[#669BBC]" />
                  <Icon icon="material-symbols:upload" width={56} height={56} color="#000000" />
                  <div className="relative z-[1] flex flex-col items-center">
                    <span className="font-[family-name:var(--font-sandena)] text-xs font-bold text-black/60">
                      {seoImageFile
                        ? seoImageFile.name
                        : existingSeoImageUrl
                          ? "Current SEO image set — upload to replace"
                          : "SEO Image"}
                    </span>
                    <span className="font-[family-name:var(--font-sandena)] text-[10px] font-medium text-black/60">
                      Upload image for social previews
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
                  Schema
                </h3>
                <textarea
                  value={seoSchema}
                  onChange={(event) => setSeoSchema(event.target.value)}
                  placeholder='Paste JSON-LD schema, e.g. {"@context":"https://schema.org"}'
                  className="h-[200px] resize-none rounded-xl border-[1.5px] border-[#669BBC] bg-white p-4 font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049] placeholder:text-black/60 outline-none"
                />
              </div>
            </div>
          </FormAccordion>
        </div>

        <div className="flex flex-col gap-6 border-t-[1.5px] border-[#669BBC] pt-6">
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(true)}
                className={statusCheckboxClassName}
              />
              <span className="font-[family-name:var(--font-sandena)] text-base font-medium leading-[21px] text-[#003049]">
                Active
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={!isActive}
                onChange={() => setIsActive(false)}
                className={statusCheckboxClassName}
              />
              <span className="font-[family-name:var(--font-sandena)] text-base font-medium leading-[21px] text-[#003049]">
                Inactive
              </span>
            </label>
          </div>

          <div className="flex w-full flex-col items-end gap-3 pb-0">
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSave()}
              className="flex h-[46px] items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-metallic-dark px-8 font-[family-name:var(--font-sandena)] text-base font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
