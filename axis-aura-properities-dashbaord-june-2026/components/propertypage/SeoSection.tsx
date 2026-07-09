"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { emptySeoFormData, type SeoFormData } from "@/components/data/seoData";
import RichTextEditor from "@/components/ui/RichTextEditor";

export type SeoPayload = {
  seo: SeoFormData;
  seoImage: File | null;
};

function SeoInputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[28px] font-medium leading-[37px] text-primary">
        {label}
      </label>
      <div className="flex h-[46px] items-center rounded-xl border-[1.5px] border-accent-light bg-white px-4 py-2.5">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent font-sans text-sm font-medium leading-[18px] text-primary placeholder:text-primary/60 focus:outline-none"
        />
      </div>
    </div>
  );
}

function SeoTextareaField({
  label,
  value,
  placeholder,
  onChange,
  minHeightClass = "min-h-[120px]",
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  minHeightClass?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[28px] font-medium leading-[37px] text-primary">
        {label}
      </label>
      <div className="rounded-xl border-[1.5px] border-accent-light bg-white p-4">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full resize-none bg-transparent font-sans text-sm font-medium leading-[18px] text-primary placeholder:text-primary/60 focus:outline-none ${minHeightClass}`}
        />
      </div>
    </div>
  );
}

function SeoImageUpload({
  file,
  onFile,
}: {
  file: File | null;
  onFile: (file: File | null) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">Image</h3>
      <label className="relative isolate flex h-[200px] cursor-pointer flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-white p-4">
        <div
          className="pointer-events-none absolute inset-4 rounded-lg border border-dashed border-accent-light"
          aria-hidden="true"
        />
        <Icon
          icon="material-symbols:upload"
          width={56}
          height={56}
          className="relative z-[1] text-primary"
          aria-hidden
        />
        <div className="relative z-[1] flex flex-col items-center text-center">
          <span className="font-sans text-xs font-bold leading-4 text-primary/60">
            {file ? "Selected:" : "Recommendation:"}
          </span>
          <span className="max-w-[240px] truncate font-sans text-[10px] font-medium leading-[13px] text-primary/60">
            {file ? file.name : "Recommend high Quality Images (Max Size 5MB)"}
          </span>
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => onFile(event.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>
    </div>
  );
}

export default function SeoSection({
  initialData = emptySeoFormData,
  onChange,
}: {
  initialData?: SeoFormData;
  onChange?: (payload: SeoPayload) => void;
}) {
  const [form, setForm] = useState<SeoFormData>(initialData);
  const [seoImage, setSeoImage] = useState<File | null>(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current?.({ seo: form, seoImage });
  }, [form, seoImage]);

  function updateField<K extends keyof SeoFormData>(field: K, value: SeoFormData[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
        SEO Field
      </h3>

      <div className="flex flex-col gap-6">
        <SeoInputField
          label="Title"
          value={form.title}
          placeholder="Enter SEO Title"
          onChange={(value) => updateField("title", value)}
        />

        <RichTextEditor
          label="Description"
          value={form.description}
          placeholder="Write SEO Description"
          onChange={(value) => updateField("description", value)}
        />

        <SeoInputField
          label="Canonical URL"
          value={form.canonicalUrl}
          placeholder="Enter Canonical URL"
          onChange={(value) => updateField("canonicalUrl", value)}
        />

        <SeoTextareaField
          label="Schema"
          value={form.schema}
          placeholder="Paste JSON-LD Schema"
          onChange={(value) => updateField("schema", value)}
          minHeightClass="min-h-[160px]"
        />

        <SeoImageUpload file={seoImage} onFile={setSeoImage} />
      </div>
    </div>
  );
}
