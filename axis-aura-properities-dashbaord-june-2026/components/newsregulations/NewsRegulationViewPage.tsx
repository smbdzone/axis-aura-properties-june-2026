"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchArticleById, type ApiArticle } from "@/lib/api/articles";
import { getApiBaseUrl } from "@/lib/api/client";
import { toast } from "sonner";

function resolveAssetUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${getApiBaseUrl()}${url.startsWith("/") ? url : `/${url}`}`;
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-[family-name:var(--font-sandena)] text-base font-medium text-black/60">
        {label}
      </span>
      <div className="font-[family-name:var(--font-sandena)] text-lg font-medium text-[#003049]">
        {children}
      </div>
    </div>
  );
}

export default function NewsRegulationViewPage({
  articleId,
}: {
  articleId: string;
}) {
  const [article, setArticle] = useState<ApiArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadArticle() {
      setLoading(true);
      try {
        const data = await fetchArticleById(articleId);
        if (active) setArticle(data);
      } catch {
        if (active) toast.error("Failed to load article details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadArticle();
    return () => {
      active = false;
    };
  }, [articleId]);

  const bannerUrl = resolveAssetUrl(article?.bannerUrl);

  return (
    <section className="mx-auto flex w-full flex-col gap-6 px-8 py-8">
      <Link
        href="/news-and-regulations"
        className="flex w-fit items-center gap-2 font-[family-name:var(--font-sandena)] text-base font-medium leading-[21px] text-[#003049] transition-opacity hover:opacity-80"
      >
        <Image src="/arrow/left.svg" alt="" width={24} height={24} aria-hidden="true" />
        Back to News & Regulations
      </Link>

      {loading ? (
        <p className="text-sm text-black/60">Loading article details...</p>
      ) : !article ? (
        <p className="text-sm text-red-600">Article not found.</p>
      ) : (
        <div className="flex w-full max-w-[860px] flex-col gap-6 rounded-2xl border-[1.5px] border-[#669BBC] p-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-[family-name:var(--font-sandena)] text-[28px] font-bold leading-[37px] text-[#003049]">
              {article.title}
            </h1>
            <Link
              href={`/news-and-regulations/edit/${article._id}`}
              className="flex h-[40px] shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-[#003049] px-5 font-[family-name:var(--font-sandena)] text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Edit
            </Link>
          </div>

          {bannerUrl ? (
            <div className="relative h-[280px] w-full overflow-hidden rounded-xl border-[1.5px] border-[#669BBC]">
              <Image
                src={bannerUrl}
                alt={article.imageAlt || article.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Category">{article.category || "—"}</Field>
            <Field label="Status">
              <span
                className={
                  article.status === "inactive" ? "text-red-600" : "text-green-700"
                }
              >
                {article.status === "inactive" ? "Inactive" : "Active"}
              </span>
            </Field>
            <Field label="Created">{formatDate(article.createdAt)}</Field>
          </div>

          <Field label="Slug">{article.slug || "—"}</Field>

          <Field label="Description">
            <div
              className="prose prose-sm max-w-none text-[#003049]"
              dangerouslySetInnerHTML={{ __html: article.description || "" }}
            />
          </Field>

          <div className="flex flex-col gap-5 border-t-[1.5px] border-[#669BBC] pt-5">
            <Field label="SEO Title">{article.seoTitle || "—"}</Field>
            <Field label="SEO Description">
              <div
                className="prose prose-sm max-w-none text-[#003049]"
                dangerouslySetInnerHTML={{ __html: article.seoDescription || "—" }}
              />
            </Field>
            <Field label="Canonical URL">
              {article.canonicalUrl ? (
                <a
                  href={article.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#669BBC] underline"
                >
                  {article.canonicalUrl}
                </a>
              ) : (
                "—"
              )}
            </Field>
          </div>
        </div>
      )}
    </section>
  );
}
