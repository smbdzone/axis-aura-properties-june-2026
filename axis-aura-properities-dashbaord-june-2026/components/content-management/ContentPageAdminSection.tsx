"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { ApiError } from "@/lib/api/client";
import {
  bulletsArrayToHtml,
  htmlToBulletsArray,
} from "@/lib/contentPageBullets";
import {
  fetchContentPage,
  updateContentPage,
  type ApiContentPage,
  type ContentPageSection,
  type ContentPageSlug,
} from "@/lib/api/contentPages";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-[#669BBC] bg-white px-4 py-3 font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049] outline-none placeholder:text-black/40";

type EditableSection = {
  title: string;
  paragraphsText: string;
  bulletsHtml: string;
};

type ContentPageAdminSectionProps = {
  slug: ContentPageSlug;
  pageLabel: string;
  staticHeader?: boolean;
};

function toEditableSections(sections: ContentPageSection[]): EditableSection[] {
  return sections.map((section) => ({
    title: section.title,
    paragraphsText: section.paragraphs.join("\n\n"),
    bulletsHtml: bulletsArrayToHtml(section.bullets ?? []),
  }));
}

function fromEditableSections(sections: EditableSection[]): ContentPageSection[] {
  return sections
    .map((section) => {
      const title = section.title.trim();
      const paragraphs = section.paragraphsText
        .split(/\n{2,}/)
        .map((item) => item.trim())
        .filter(Boolean);
      const bullets = htmlToBulletsArray(section.bulletsHtml);

      if (!title) return null;

      return {
        title,
        paragraphs,
        ...(bullets.length > 0 ? { bullets } : {}),
      };
    })
    .filter((section): section is ContentPageSection => section !== null);
}

export default function ContentPageAdminSection({
  slug,
  pageLabel,
  staticHeader = false,
}: ContentPageAdminSectionProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [introText, setIntroText] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroImageAlt, setHeroImageAlt] = useState("");
  const [sections, setSections] = useState<EditableSection[]>([]);
  const [scrollToSectionIndex, setScrollToSectionIndex] = useState<number | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const applyPage = (page: ApiContentPage) => {
    setIntroText(page.introText ?? "");
    setHeroTitle(page.hero?.title ?? "");
    setHeroImage(page.hero?.image ?? "");
    setHeroImageAlt(page.hero?.imageAlt ?? "");
    setSections(toEditableSections(page.sections ?? []));
  };

  const loadPage = async () => {
    setLoading(true);
    setError("");
    try {
      const page = await fetchContentPage(slug);
      applyPage(page);
    } catch {
      setError(`Failed to load ${pageLabel}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (scrollToSectionIndex === null) return;

    const targetSection = sectionRefs.current[scrollToSectionIndex];
    if (!targetSection) return;

    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setScrollToSectionIndex(null);
  }, [sections, scrollToSectionIndex]);

  const updateSection = (index: number, patch: Partial<EditableSection>) => {
    setSections((current) =>
      current.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, ...patch } : section,
      ),
    );
  };

  const addSection = () => {
    setSections((current) => {
      const next = [...current, { title: "", paragraphsText: "", bulletsHtml: "" }];
      setScrollToSectionIndex(next.length - 1);
      return next;
    });
  };

  const removeSection = (index: number) => {
    setSections((current) => current.filter((_, sectionIndex) => sectionIndex !== index));
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    setSections((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  };

  const handleSave = async () => {
    const normalizedSections = fromEditableSections(sections);
    if (normalizedSections.length === 0) {
      toast.error("Add at least one section with a title.");
      return;
    }

    if (!staticHeader && !heroTitle.trim()) {
      toast.error("Hero title is required.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(`Saving ${pageLabel}...`);
    try {
      const page = await updateContentPage(slug, {
        ...(staticHeader
          ? {}
          : {
            introText: introText.trim(),
            hero: {
              title: heroTitle.trim(),
              image: heroImage.trim(),
              imageAlt: heroImageAlt.trim(),
            },
          }),
        sections: normalizedSections,
      });
      applyPage(page);
      toast.success(`${pageLabel} saved successfully.`, { id: toastId });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : `Failed to save ${pageLabel}.`;
      toast.error(message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto flex w-full flex-col gap-8 px-8 py-8">
        <p className="text-sm text-black/60">Loading {pageLabel}...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto flex w-full flex-col gap-8 px-8 py-8">
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full flex-col gap-8 px-8 py-8">
      <div className="flex w-full flex-col gap-4 rounded-2xl border-[1.5px] border-accent-light p-6">
        <h2 className="font-[family-name:var(--font-sandena)] text-2xl font-bold text-primary">
          {pageLabel}
        </h2>

        {staticHeader ? (
          <p className="font-[family-name:var(--font-sandena)] text-sm leading-6 text-black/60">
            The page hero and intro banner are fixed on the website. You can edit
            the content sections below.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
                Intro Text
              </label>
              <textarea
                value={introText}
                onChange={(event) => setIntroText(event.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
                  Hero Title
                </label>
                <input
                  value={heroTitle}
                  onChange={(event) => setHeroTitle(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
                  Hero Image Path
                </label>
                <input
                  value={heroImage}
                  onChange={(event) => setHeroImage(event.target.value)}
                  placeholder="/Aboutus/main.svg"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
                  Hero Image Alt
                </label>
                <input
                  value={heroImageAlt}
                  onChange={(event) => setHeroImageAlt(event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-4 rounded-2xl border-[1.5px] border-accent-light p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-sandena)] text-xl font-bold text-primary">
            Sections
          </h3>
          <button
            type="button"
            onClick={addSection}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-[#669BBC] px-4 font-[family-name:var(--font-sandena)] text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            <Icon icon="mdi:plus" width={16} height={16} />
            Add Section
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <div
              key={`section-${index}`}
              ref={(element) => {
                sectionRefs.current[index] = element;
              }}
              className="flex scroll-mt-28 flex-col gap-4 rounded-xl border-[1.5px] border-accent-light p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-[family-name:var(--font-sandena)] text-sm font-bold text-primary">
                  Section {index + 1}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Move section up"
                    onClick={() => moveSection(index, -1)}
                    className="cursor-pointer text-primary"
                  >
                    <Icon icon="mdi:arrow-up" width={18} height={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move section down"
                    onClick={() => moveSection(index, 1)}
                    className="cursor-pointer text-primary"
                  >
                    <Icon icon="mdi:arrow-down" width={18} height={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove section"
                    onClick={() => removeSection(index)}
                    className="cursor-pointer text-primary"
                  >
                    <Icon icon="fluent:delete-16-regular" width={18} height={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
                  Section Title
                </label>
                <input
                  value={section.title}
                  onChange={(event) => updateSection(index, { title: event.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
                  Paragraphs
                </label>
                <textarea
                  value={section.paragraphsText}
                  onChange={(event) =>
                    updateSection(index, { paragraphsText: event.target.value })
                  }
                  rows={5}
                  placeholder="Separate paragraphs with a blank line"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <RichTextEditor
                label="Bullet Points (optional)"
                labelClassName="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]"
                value={section.bulletsHtml}
                onChange={(value) => updateSection(index, { bulletsHtml: value })}
                placeholder="Use the bullet list button to add points"
                minHeightClass="min-h-[160px]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="flex h-[46px] cursor-pointer items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-metallic-dark px-8 font-[family-name:var(--font-sandena)] text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : `Save ${pageLabel}`}
        </button>
      </div>
    </section>
  );
}
