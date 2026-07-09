"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import RichTextEditor from "@/components/ui/RichTextEditor";
import {
  createEmptyPropertyDetails,
  type PropertyDetailsFormData,
} from "@/components/data/propertyFormData";

const MAX_IMAGES = 10;

export type PropertyDetailsPayload = {
  details: PropertyDetailsFormData;
  videoUrl: string;
  images: File[];
};

function FormInputField({
  label,
  placeholder,
  maxLength,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  maxLength?: number;
  type?: "text" | "select";
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[28px] font-medium leading-[37px] text-primary">
        {label}
      </label>
      <div className="relative isolate flex h-[46px] items-center justify-between overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-white px-4 py-2.5">
        {type === "select" ? (
          <>
            <select
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className={`h-full w-full cursor-pointer appearance-none bg-transparent font-sans text-sm font-medium leading-[18px] focus:outline-none ${value ? "text-primary" : "text-primary/60"
                }`}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              <option value={value}>{value || placeholder}</option>
            </select>
            <IoChevronDown
              size={16}
              className="pointer-events-none shrink-0 text-primary"
              aria-hidden
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder={placeholder}
              maxLength={maxLength}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="w-full bg-transparent font-sans text-sm font-medium leading-[18px] text-primary placeholder:text-primary/60 focus:outline-none"
            />
            {maxLength !== undefined && (
              <span className="shrink-0 font-sans text-sm font-medium leading-[18px] text-primary/60">
                {maxLength}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ImagesUploadArea({
  images,
  onChange,
}: {
  images: File[];
  onChange: (images: File[]) => void;
}) {
  function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length === 0) return;
    const merged = [...images, ...selected].slice(0, MAX_IMAGES);
    onChange(merged);
    event.target.value = "";
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
          Upload Images
        </h3>
        <span className="font-sans text-base font-medium leading-[21px] text-primary/60">
          (upto {MAX_IMAGES} images)
        </span>
      </div>

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
            {images.length > 0 ? `${images.length} image(s) selected` : "Recommendation:"}
          </span>
          <span className="font-sans text-[10px] font-medium leading-[13px] text-primary/60">
            Recommend high Quality Images (Max Size 5MB)
          </span>
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleSelect}
          className="hidden"
        />
      </label>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {images.map((image, index) => (
            <span
              key={`${image.name}-${index}`}
              className="flex items-center gap-1.5 rounded-lg border border-accent-light bg-white px-2.5 py-1 font-sans text-xs font-medium text-primary"
            >
              <span className="max-w-[140px] truncate">{image.name}</span>
              <button
                type="button"
                aria-label={`Remove ${image.name}`}
                onClick={() => removeImage(index)}
                className="cursor-pointer text-primary/70 hover:text-primary"
              >
                <Icon icon="mdi:close" width={14} height={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertyDetailsSection({
  initialData = createEmptyPropertyDetails(),
  initialVideoUrl = "",
  onChange,
}: {
  initialData?: PropertyDetailsFormData;
  initialVideoUrl?: string;
  onChange?: (payload: PropertyDetailsPayload) => void;
}) {
  const [form, setForm] = useState<PropertyDetailsFormData>(initialData);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [images, setImages] = useState<File[]>([]);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current?.({ details: form, videoUrl, images });
  }, [form, videoUrl, images]);

  function updateField<K extends keyof PropertyDetailsFormData>(
    field: K,
    value: PropertyDetailsFormData[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8 md:gap-y-4">
        <FormInputField
          label="Property Title"
          placeholder="Title"
          maxLength={80}
          value={form.propertyTitle}
          onChange={(value) => updateField("propertyTitle", value)}
        />
        <FormInputField
          label="Area"
          placeholder="Enter Area"
          maxLength={30}
          value={form.area}
          onChange={(value) => updateField("area", value)}
        />
        <FormInputField
          label="Price"
          placeholder="Enter Price in AED"
          value={form.price}
          onChange={(value) => updateField("price", value)}
        />
        <FormInputField
          label="Type"
          placeholder="e.g. Apartment, Villa"
          value={form.type}
          onChange={(value) => updateField("type", value)}
        />
        <FormInputField
          label="Developer"
          placeholder="Enter Developer"
          value={form.developer}
          onChange={(value) => updateField("developer", value)}
        />
        <FormInputField
          label="Location"
          placeholder="Enter Location"
          value={form.location}
          onChange={(value) => updateField("location", value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
              Video URL
            </h3>
            <span className="font-sans text-base font-medium leading-[21px] text-primary/60">
              (optional)
            </span>
          </div>
          <div className="flex h-[46px] items-center rounded-xl border-[1.5px] border-accent-light bg-white px-4 py-2.5">
            <input
              type="text"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="Paste video URL (YouTube, Vimeo, etc.)"
              className="w-full bg-transparent font-sans text-sm font-medium leading-[18px] text-primary placeholder:text-primary/60 focus:outline-none"
            />
          </div>
        </div>

        <ImagesUploadArea images={images} onChange={setImages} />
      </div>

      <RichTextEditor
        label="Overview"
        value={form.overview}
        onChange={(value) => updateField("overview", value)}
        placeholder="Write Description"
      />
    </div>
  );
}
