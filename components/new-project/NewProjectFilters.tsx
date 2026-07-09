"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LuChevronDown, LuChevronLeft, LuSearch } from "react-icons/lu";
import {
  areaFilterOptions,
  commercialPropertyTypeOptions,
  developerFilterOptions,
  FILTER_TRIGGER_CLASS,
  getPropertyTypeLabel,
  propertyTypeCategories,
  residentialPropertyTypeOptions,
  type NewProjectFilterOption,
  type PropertyFilterValues,
  type PropertyFilterVariant,
} from "@/components/data/newProjectFilters";
import { PrimaryShineAccents } from "@/components/ui/PrimaryShine";

type NewProjectFilterSelectProps = {
  label: string;
  options: NewProjectFilterOption[];
  value: string;
  onChange: (value: string) => void;
};

const FILTER_DROPDOWN_LIST_CLASS =
  "enquiry-dropdown-scroll absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-[220px] overflow-y-auto rounded-xl border-[1.5px] border-accent-light bg-white py-1 shadow-[0_8px_20px_rgba(0,0,0,0.25)]";

const filterDropdownItemClass = (isSelected: boolean) =>
  [
    "flex w-full cursor-pointer px-3 py-2.5 text-left font-heading text-base transition-colors",
    isSelected
      ? "bg-primary text-white"
      : "bg-white text-primary hover:bg-primary hover:text-white",
  ].join(" ");

const filterDropdownNavItemClass =
  "flex w-full cursor-pointer bg-white px-3 py-2.5 text-left font-heading text-base text-primary transition-colors hover:bg-primary hover:text-white";

function FilterBlurAccents() {
  return <PrimaryShineAccents size="compact" />;
}

function LockedDeveloperField({ label }: { label: string }) {
  return (
    <div className="flex w-[150px] max-[700px]:w-full flex-col gap-1">
      <span className="font-heading text-xl font-medium leading-[120%] text-black">
        Developer
      </span>
      <div
        className={`${FILTER_TRIGGER_CLASS} cursor-default`}
        aria-readonly="true"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl bg-primary"
        />
        <FilterBlurAccents />
        <span className="relative z-10 truncate">{label}</span>
      </div>
    </div>
  );
}

function NewProjectFilterSelect({
  label,
  options,
  value,
  onChange,
  getSelectedLabel,
}: NewProjectFilterSelectProps & {
  getSelectedLabel?: (value: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const triggerId = useId();

  const selected =
    options.find((option) => option.value === value) ?? options[0];
  const selectedLabel = getSelectedLabel?.(value) ?? selected.label;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="flex w-[150px] max-[700px]:w-full flex-col gap-1">
      <span className="font-heading text-xl font-medium leading-[120%] text-black">
        {label}
      </span>

      <div className="relative">
        <button
          id={triggerId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((current) => !current)}
          className={FILTER_TRIGGER_CLASS}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl bg-primary"
          />
          <FilterBlurAccents />
          <span className="relative z-10 truncate">{selectedLabel}</span>
          <LuChevronDown
            className={[
              "relative z-10 size-3 shrink-0 text-white transition-transform",
              open ? "rotate-180" : "",
            ].join(" ")}
            aria-hidden="true"
          />
        </button>

        {open ? (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={triggerId}
            className={FILTER_DROPDOWN_LIST_CLASS}
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={filterDropdownItemClass(isSelected)}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

type PropertyTypeMenuView = "root" | "commercial" | "residential";

function PropertyTypeFilterSelect({
  value,
  onChange,
  variant = "all",
}: {
  value: string;
  onChange: (value: string) => void;
  variant?: PropertyFilterVariant;
}) {
  if (variant === "residential" || variant === "commercial") {
    const options =
      variant === "residential"
        ? residentialPropertyTypeOptions
        : commercialPropertyTypeOptions;

    return (
      <NewProjectFilterSelect
        label="Property Type"
        options={options}
        value={value}
        onChange={onChange}
        getSelectedLabel={(selectedValue) =>
          getPropertyTypeLabel(selectedValue, variant)
        }
      />
    );
  }

  return (
    <NestedPropertyTypeFilterSelect value={value} onChange={onChange} />
  );
}

function NestedPropertyTypeFilterSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [menuView, setMenuView] = useState<PropertyTypeMenuView>("root");
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const triggerId = useId();

  const activeCategory = propertyTypeCategories.find(
    (category) => category.value === menuView,
  );

  useEffect(() => {
    if (!open) {
      setMenuView("root");
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="flex w-[150px] max-[700px]:w-full flex-col gap-1">
      <span className="font-heading text-xl font-medium leading-[120%] text-black">
        Property Type
      </span>

      <div className="relative">
        <button
          id={triggerId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((current) => !current)}
          className={FILTER_TRIGGER_CLASS}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl bg-primary"
          />
          <FilterBlurAccents />
          <span className="relative z-10 truncate">{getPropertyTypeLabel(value)}</span>
          <LuChevronDown
            className={[
              "relative z-10 size-3 shrink-0 text-white transition-transform",
              open ? "rotate-180" : "",
            ].join(" ")}
            aria-hidden="true"
          />
        </button>

        {open ? (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={triggerId}
            className={FILTER_DROPDOWN_LIST_CLASS}
          >
            {menuView === "root" ? (
              <>
                <li role="option" aria-selected={value === "all"}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange("all");
                      setOpen(false);
                    }}
                    className={filterDropdownItemClass(value === "all")}
                  >
                    All
                  </button>
                </li>
                {propertyTypeCategories
                  .filter((category) => category.subOptions)
                  .map((category) => (
                    <li key={category.value} role="presentation">
                      <button
                        type="button"
                        onClick={() =>
                          setMenuView(category.value as PropertyTypeMenuView)
                        }
                        className={`${filterDropdownNavItemClass} items-center justify-between`}
                      >
                        <span>{category.label}</span>
                        <LuChevronDown
                          className="-rotate-90 size-3 shrink-0"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  ))}
              </>
            ) : (
              <>
                <li role="presentation">
                  <button
                    type="button"
                    onClick={() => setMenuView("root")}
                    className={`${filterDropdownNavItemClass} items-center gap-2`}
                  >
                    <LuChevronLeft className="size-3 shrink-0" aria-hidden="true" />
                    {activeCategory?.label}
                  </button>
                </li>
                {activeCategory?.subOptions?.map((option) => {
                  const isSelected = value === option.value;

                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onChange(option.value);
                          setOpen(false);
                        }}
                        className={filterDropdownItemClass(isSelected)}
                      >
                        {option.label}
                      </button>
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default function NewProjectFilters({
  variant = "all",
  headingId = "new-project-properties-heading",
  filters,
  onFiltersChange,
  lockedDeveloper,
  showHeading = true,
  sectionId,
  areaOptions = areaFilterOptions,
  developerOptions = developerFilterOptions,
}: {
  variant?: PropertyFilterVariant;
  headingId?: string;
  filters: PropertyFilterValues;
  onFiltersChange: (filters: PropertyFilterValues) => void;
  lockedDeveloper?: {
    id: string;
    label: string;
  };
  showHeading?: boolean;
  sectionId?: string;
  areaOptions?: NewProjectFilterOption[];
  developerOptions?: NewProjectFilterOption[];
}) {
  const updateFilters = (patch: Partial<PropertyFilterValues>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  return (
    <section
      id={sectionId}
      aria-labelledby={showHeading ? headingId : undefined}
      aria-label={showHeading ? undefined : "Property filters"}
      className="flex my-12 w-full flex-col items-start gap-2.5 px-4 min-[701px]:px-6 lg:px-24 max-[700px]:my-8"
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-2.5">
        {showHeading ? (
          <h2
            id={headingId}
            className="w-full text-center font-heading text-[clamp(2rem,3vw,3rem)] font-bold uppercase leading-[63px] text-primary max-[700px]:leading-tight"
          >
            Properties
          </h2>
        ) : null}

        <div className="flex w-full flex-col items-start justify-between gap-6 max-[700px]:gap-4 lg:flex-row lg:items-end lg:gap-[392px]">
          <div className="flex w-full flex-wrap items-end gap-4 max-[700px]:grid max-[700px]:grid-cols-2 max-[700px]:gap-3">
            <PropertyTypeFilterSelect
              variant={variant}
              value={filters.propertyType}
              onChange={(propertyType) => updateFilters({ propertyType })}
            />
            <NewProjectFilterSelect
              label="Area"
              options={areaOptions}
              value={filters.area}
              onChange={(area) => updateFilters({ area })}
            />
            {lockedDeveloper ? (
              <LockedDeveloperField label={lockedDeveloper.label} />
            ) : (
              <NewProjectFilterSelect
                label="Developer"
                options={developerOptions}
                value={filters.developer}
                onChange={(developer) => updateFilters({ developer })}
              />
            )}
          </div>

          <label className="relative isolate flex h-11 w-full max-w-[339px] max-[700px]:max-w-none items-center justify-between gap-2.5 overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-primary py-2 pl-6 pr-2 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-xl bg-primary"
            />
            <FilterBlurAccents />
            <span className="sr-only">Search by area</span>
            <input
              type="search"
              value={filters.searchQuery}
              onChange={(event) =>
                updateFilters({ searchQuery: event.target.value })
              }
              placeholder="Search by area"
              className="relative z-10 min-w-0 flex-1 bg-transparent font-sans text-base leading-[22px] text-white outline-none placeholder:text-white"
            />
            <span
              aria-hidden="true"
              className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-accent-light bg-white"
            >
              <LuSearch className="size-5 text-primary" strokeWidth={1.5} />
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}
