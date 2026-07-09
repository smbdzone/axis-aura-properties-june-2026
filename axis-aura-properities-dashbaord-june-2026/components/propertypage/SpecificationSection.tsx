"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import {
  specificationGroups,
  type SpecificationGroupConfig,
  type SpecificationItem,
} from "@/components/data/specificationData";
import type { SpecificationFormData } from "@/components/data/propertyFormData";
import { createEmptySpecificationFormData } from "@/components/data/propertyFormData";

const INPUT_MAX_LENGTH = 35;

const chipCheckboxClassName =
  "flex size-4 shrink-0 items-center justify-center rounded border border-accent-light bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)]";

function MetallicButton({
  children,
  onClick,
  square,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  square?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative isolate flex shrink-0 items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-metallic-dark ${
        square ? "size-[46px]" : "h-[46px] px-8"
      }`}
    >
      {children}
    </button>
  );
}

function SpecInputField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex h-[46px] min-w-0 flex-1 items-center justify-between rounded-xl border-[1.5px] border-accent-light bg-white px-4 py-2.5">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={INPUT_MAX_LENGTH}
        className="w-full bg-transparent font-sans text-sm font-medium leading-[18px] text-primary placeholder:text-primary/60 focus:outline-none"
      />
      <span className="shrink-0 font-sans text-sm font-medium leading-[18px] text-primary/60">
        {INPUT_MAX_LENGTH}
      </span>
    </div>
  );
}

function RecommendedChip({
  item,
  highlighted,
  onToggle,
  onDelete,
}: {
  item: SpecificationItem;
  highlighted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`rounded-lg border p-1 ${
        highlighted ? "border-accent-light" : "border-accent-light/60"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-accent-light">
            <Icon icon={item.icon} width={14} height={14} className="text-primary" />
          </span>
          <span className="line-clamp-2 font-sans text-[10.25px] font-medium leading-[13px] text-primary">
            {item.label}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label={`Toggle ${item.label}`}
            onClick={onToggle}
            className={chipCheckboxClassName}
          >
            {item.selected && (
              <Icon icon="hugeicons:tick-01" width={10} height={10} className="text-primary" />
            )}
          </button>
          <button
            type="button"
            aria-label={`Delete ${item.label}`}
            onClick={onDelete}
            className="cursor-pointer text-primary"
          >
            <Icon icon="material-symbols:delete-rounded" width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SpecificationGroupBlock({
  config,
  items,
  onItemsChange,
}: {
  config: SpecificationGroupConfig;
  items: SpecificationItem[];
  onItemsChange: (items: SpecificationItem[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  function handleSave() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    onItemsChange([
      ...items,
      {
        id: `${config.title}-${Date.now()}`,
        label: trimmed,
        icon: "mdi:plus",
        selected: true,
      },
    ]);
    setInputValue("");
  }

  function toggleItem(id: string) {
    onItemsChange(
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  }

  function deleteItem(id: string) {
    onItemsChange(items.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5">
          <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
            {config.title}
          </h3>
          <span className="font-sans text-base font-medium leading-[21px] text-black/60">
            {config.subtitle}
          </span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-1">
              <MetallicButton square onClick={() => setInputValue("")}>
                <Icon icon="mdi:plus" width={24} height={24} className="text-white" />
              </MetallicButton>
              <span className="font-sans text-base font-medium leading-[21px] text-black">
                Add Icon
              </span>
            </div>

            <SpecInputField
              value={inputValue}
              onChange={setInputValue}
              placeholder={config.placeholder}
            />
          </div>

          <MetallicButton onClick={handleSave}>
            <span className="font-sans text-base font-medium leading-[21px] text-white">Save</span>
          </MetallicButton>
        </div>
      </div>

      <h4 className="font-sans text-xl font-medium leading-[26px] text-primary">Recommended</h4>

      <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-4">
        {items.map((item) => (
          <RecommendedChip
            key={item.id}
            item={item}
            highlighted={item.selected}
            onToggle={() => toggleItem(item.id)}
            onDelete={() => deleteItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function SpecificationSection({
  initialData = createEmptySpecificationFormData(),
  onChange,
}: {
  initialData?: SpecificationFormData;
  onChange?: (data: SpecificationFormData) => void;
}) {
  const [data, setData] = useState<SpecificationFormData>(initialData);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current?.(data);
  }, [data]);

  const groupKeyByTitle: Record<string, keyof SpecificationFormData> = {
    Amenities: "amenities",
    Access: "access",
    Views: "views",
  };

  return (
    <div className="flex flex-col gap-12">
      {specificationGroups.map((group) => {
        const key = groupKeyByTitle[group.title];
        return (
          <SpecificationGroupBlock
            key={group.title}
            config={group}
            items={data[key]}
            onItemsChange={(items) =>
              setData((current) => ({ ...current, [key]: items }))
            }
          />
        );
      })}
    </div>
  );
}
