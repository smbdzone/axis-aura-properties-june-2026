import {
  dummyPropertyTotalCount,
  getDummyPropertyTableRows,
} from "@/components/data/dummyProperties";

export type PropertyRow = {
  id: string;
  name: string;
  type: string;
  area: string;
  developer: string;
  startingPrice: string;
};

export const propertyTableColumns = [
  { key: "number", label: "#" },
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "area", label: "Area" },
  { key: "developer", label: "Developer" },
  { key: "startingPrice", label: "Starting Price" },
  { key: "action", label: "Action" },
] as const;

export const propertyRows: PropertyRow[] = getDummyPropertyTableRows();

export const propertyTotalCount = dummyPropertyTotalCount;

export const propertySortOptions = [
  "A-Z",
  "Z-A",
  "Price: Low to High",
  "Price: High to Low",
  "Type",
] as const;

export type PropertySortOption = (typeof propertySortOptions)[number];

function parseStartingPrice(price: string) {
  const cleaned = price.replace(/AED\s*/i, "").trim();

  if (cleaned.endsWith("M")) {
    return parseFloat(cleaned.replace("M", "").trim()) * 1_000_000;
  }

  return Number(cleaned.replace(/,/g, ""));
}

export function sortPropertyRows(
  rows: PropertyRow[],
  sortBy: PropertySortOption,
) {
  const sorted = [...rows];

  switch (sortBy) {
    case "A-Z":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "Z-A":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "Price: Low to High":
      return sorted.sort(
        (a, b) =>
          parseStartingPrice(a.startingPrice) - parseStartingPrice(b.startingPrice),
      );
    case "Price: High to Low":
      return sorted.sort(
        (a, b) =>
          parseStartingPrice(b.startingPrice) - parseStartingPrice(a.startingPrice),
      );
    case "Type":
      return sorted.sort((a, b) => a.type.localeCompare(b.type));
    default:
      return sorted;
  }
}
