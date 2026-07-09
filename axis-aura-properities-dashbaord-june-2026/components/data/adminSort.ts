export const nameSortOptions = ["A-Z", "Z-A"] as const;
export type NameSortOption = (typeof nameSortOptions)[number];

export const datedNameSortOptions = ["A-Z", "Z-A", "Newest", "Oldest"] as const;
export type DatedNameSortOption = (typeof datedNameSortOptions)[number];

export const developerSortOptions = [
  "A-Z",
  "Z-A",
  "Properties: Low to High",
  "Properties: High to Low",
] as const;
export type DeveloperSortOption = (typeof developerSortOptions)[number];

function sortByName<T>(items: T[], getName: (item: T) => string, sortBy: "A-Z" | "Z-A") {
  const sorted = [...items];
  if (sortBy === "A-Z") {
    return sorted.sort((a, b) => getName(a).localeCompare(getName(b)));
  }
  return sorted.sort((a, b) => getName(b).localeCompare(getName(a)));
}

function sortByDate<T>(items: T[], getDate: (item: T) => string, sortBy: "Newest" | "Oldest") {
  const sorted = [...items];
  const toTime = (value: string) => new Date(value).getTime();

  if (sortBy === "Newest") {
    return sorted.sort((a, b) => toTime(getDate(b)) - toTime(getDate(a)));
  }
  return sorted.sort((a, b) => toTime(getDate(a)) - toTime(getDate(b)));
}

export function applyNameSort<T>(
  items: T[],
  sortBy: NameSortOption,
  getName: (item: T) => string,
) {
  return sortByName(items, getName, sortBy);
}

export function applyDatedNameSort<T>(
  items: T[],
  sortBy: DatedNameSortOption,
  getName: (item: T) => string,
  getDate: (item: T) => string,
) {
  switch (sortBy) {
    case "A-Z":
    case "Z-A":
      return sortByName(items, getName, sortBy);
    case "Newest":
    case "Oldest":
      return sortByDate(items, getDate, sortBy);
    default:
      return items;
  }
}

export function applyDeveloperSort<T extends { title: string; propertyCount: number }>(
  items: T[],
  sortBy: DeveloperSortOption,
) {
  const sorted = [...items];

  switch (sortBy) {
    case "A-Z":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "Z-A":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "Properties: Low to High":
      return sorted.sort((a, b) => a.propertyCount - b.propertyCount);
    case "Properties: High to Low":
      return sorted.sort((a, b) => b.propertyCount - a.propertyCount);
    default:
      return sorted;
  }
}
