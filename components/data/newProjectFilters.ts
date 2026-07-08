export type NewProjectFilterOption = {
  value: string;
  label: string;
};

export type PropertyTypeCategory = {
  value: string;
  label: string;
  subOptions?: NewProjectFilterOption[];
};

export const residentialPropertyTypeOptions: NewProjectFilterOption[] = [
  { value: "all", label: "All" },
  { value: "residential-apartment", label: "Apartment" },
  { value: "residential-villa", label: "Villa" },
  { value: "residential-townhouse", label: "Townhouse" },
];

export const commercialPropertyTypeOptions: NewProjectFilterOption[] = [
  { value: "all", label: "All" },
  { value: "commercial-office", label: "Office" },
  { value: "commercial-retail", label: "Retail" },
];

export const propertyTypeCategories: PropertyTypeCategory[] = [
  {
    value: "commercial",
    label: "Commercial",
    subOptions: [
      { value: "commercial-office", label: "Office" },
      { value: "commercial-retail", label: "Retail" },
    ],
  },
  {
    value: "residential",
    label: "Residential",
    subOptions: [
      { value: "residential-apartment", label: "Apartment" },
      { value: "residential-villa", label: "Villa" },
      { value: "residential-townhouse", label: "Townhouse" },
    ],
  },
];

export type PropertyFilterValues = {
  propertyType: string;
  area: string;
  developer: string;
  searchQuery: string;
};

export const defaultPropertyFilters: PropertyFilterValues = {
  propertyType: "all",
  area: "all",
  developer: "all",
  searchQuery: "",
};

export type PropertyFilterVariant = "all" | "residential" | "commercial";

export function getPropertyTypeLabel(
  value: string,
  variant: PropertyFilterVariant = "all",
): string {
  if (value === "all") return "All";

  const flatOptions =
    variant === "residential"
      ? residentialPropertyTypeOptions
      : variant === "commercial"
        ? commercialPropertyTypeOptions
        : [];

  const flatMatch = flatOptions.find((option) => option.value === value);
  if (flatMatch) return flatMatch.label;

  for (const category of propertyTypeCategories) {
    const subOption = category.subOptions?.find((option) => option.value === value);
    if (subOption) return subOption.label;

    if (category.value === value) return category.label;
  }

  return "All";
}

export const areaFilterOptions: NewProjectFilterOption[] = [
  { value: "all", label: "All" },
  { value: "al-barari", label: "Al Barari Dubai" },
  { value: "dubai-marina", label: "Dubai Marina" },
  { value: "dubai-creek-harbour", label: "Dubai Creek Harbour" },
  { value: "downtown", label: "Downtown Dubai" },
];

export const developerFilterOptions: NewProjectFilterOption[] = [
  { value: "all", label: "All" },
  { value: "samana", label: "Samana" },
  { value: "damac", label: "Damac" },
  { value: "sobha", label: "Sobha" },
  { value: "azizi", label: "Azizi" },
  { value: "binghatti", label: "Binghatti" },
];

const FILTER_TRIGGER_CLASS =
  "relative isolate flex h-11 w-[150px] cursor-pointer items-center justify-between overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-primary px-5 py-3 font-heading text-base font-medium leading-[120%] text-white shadow-[0_0_40px_rgba(0,0,0,0.25)]";

export { FILTER_TRIGGER_CLASS };
