"use client";

import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import {
  floorOptions,
  layoutTypeOptions,
  type ApartmentType,
} from "@/components/data/layoutData";
import {
  createEmptyLayoutFormData,
  type LayoutFormData,
} from "@/components/data/propertyFormData";

const apartmentCheckboxClassName =
  "flex size-5 shrink-0 items-center justify-center rounded-md border border-accent-light bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)]";

export type LayoutPayload = {
  layout: LayoutFormData;
  brochure: File | null;
  unitLayout: File | null;
};

function LayoutSelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[28px] font-medium leading-[37px] text-primary">
        {label}
      </label>
      <div className="relative flex h-[46px] items-center rounded-xl border-[1.5px] border-accent-light bg-white px-4 py-2.5">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-full w-full cursor-pointer appearance-none bg-transparent pr-6 font-sans text-sm font-medium leading-[18px] focus:outline-none ${value ? "text-primary" : "text-primary/60"
            }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <IoChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary"
          aria-hidden
        />
      </div>
    </div>
  );
}

function ApartmentChip({
  item,
  onToggle,
}: {
  item: ApartmentType;
  onToggle: () => void;
}) {
  return (
    <div
      className={`flex h-[43px] min-w-[155px] items-center justify-between rounded-[10px] border py-1.5 pl-2.5 pr-1.5 ${item.selected ? "border-accent-light" : "border-accent-light/60"
        }`}
    >
      <span className="font-sans text-[13px] font-medium leading-[17px] text-primary">
        {item.label}
      </span>
      <button
        type="button"
        aria-label={`Toggle ${item.label}`}
        aria-pressed={item.selected}
        onClick={onToggle}
        className={apartmentCheckboxClassName}
      >
        {item.selected && (
          <Icon icon="hugeicons:tick-01" width={13} height={13} className="text-primary" />
        )}
      </button>
    </div>
  );
}

function LargeUploadArea({
  title,
  recommendation,
  accept,
  file,
  onFile,
  heightClass = "h-[235px]",
}: {
  title: string;
  recommendation: string;
  accept: string;
  file: File | null;
  onFile: (file: File | null) => void;
  heightClass?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">{title}</h3>
      <label
        className={`relative isolate flex ${heightClass} cursor-pointer flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-white p-4`}
      >
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
            {file ? file.name : recommendation}
          </span>
        </div>
        <input
          type="file"
          accept={accept}
          onChange={(event) => onFile(event.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>
    </div>
  );
}

function CompactUnitUploadCard({ title }: { title: string }) {
  return (
    <div className="flex w-[155px] flex-col items-center gap-2.5">
      <span className="text-center font-sans text-base font-medium leading-[21px] text-primary">
        {title}
      </span>
      <div className="relative isolate flex size-[155px] flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-white p-2">
        <div
          className="pointer-events-none absolute inset-2 rounded-lg border border-dashed border-accent-light"
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
          <span className="font-sans text-xs font-bold leading-4 text-black/60">
            Recommendation:
          </span>
          <span className="max-w-[140px] font-sans text-[10px] font-medium leading-[13px] text-primary/60">
            Recommend high Quality Images (Max Size 5MB)
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LayoutSection({
  initialData = createEmptyLayoutFormData(),
  onChange,
}: {
  initialData?: LayoutFormData;
  onChange?: (payload: LayoutPayload) => void;
}) {
  const [layoutType, setLayoutType] = useState(initialData.layoutType);
  const [floors, setFloors] = useState(initialData.floors);
  const [apartments, setApartments] = useState<ApartmentType[]>(initialData.apartments);
  const [brochure, setBrochure] = useState<File | null>(null);
  const [unitLayout, setUnitLayout] = useState<File | null>(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current?.({
      layout: { layoutType, floors, apartments },
      brochure,
      unitLayout,
    });
  }, [layoutType, floors, apartments, brochure, unitLayout]);

  const selectedApartments = useMemo(
    () => apartments.filter((item) => item.selected),
    [apartments],
  );

  function toggleApartment(id: string) {
    setApartments((current) =>
      current.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <LayoutSelectField
          label="Layout"
          value={layoutType}
          placeholder="Select Layout Type"
          options={layoutTypeOptions}
          onChange={setLayoutType}
        />
        <LayoutSelectField
          label="No: of Floors"
          value={floors}
          placeholder="Select No: of Floors"
          options={floorOptions}
          onChange={setFloors}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
          Available Apartment
        </h3>
        <div className="flex flex-wrap gap-[19px]">
          {apartments.map((item) => (
            <ApartmentChip
              key={item.id}
              item={item}
              onToggle={() => toggleApartment(item.id)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <LargeUploadArea
          title="Unit Layout"
          recommendation="Recommend high Quality Images (Max Size 5MB)"
          accept="image/jpeg,image/png,image/webp"
          file={unitLayout}
          onFile={setUnitLayout}
        />
        <LargeUploadArea
          title="Upload Brochure"
          recommendation="Recommend high Quality PDF Brochure (Max Size 200MB)"
          accept="application/pdf,.pdf,.docx"
          file={brochure}
          onFile={setBrochure}
        />
      </div>

      {selectedApartments.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
            Available Apartment Layout
          </h3>
          <div className="flex flex-wrap gap-[19px]">
            {selectedApartments.map((item) => (
              <CompactUnitUploadCard key={item.id} title={item.layoutLabel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
