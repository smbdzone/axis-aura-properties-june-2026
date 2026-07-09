export type ProjectCategory = "Villa" | "Residential" | "Commercial";

export type Project = {
  id: string;
  developerId: string;
  location: string;
  developer: string;
  propertyType: string;
  category: ProjectCategory;
  paymentPlan: string;
  priceAmount: string;
  image: string;
};

export const projectCategories: ProjectCategory[] = [
  "Villa",
  "Residential",
  "Commercial",
];

const areaLocationPatterns: Record<string, string[]> = {
  "al-barari": ["Al Barari"],
  "dubai-marina": ["Dubai Marina"],
  "dubai-creek-harbour": ["Dubai Creek Harbour", "Creek Harbour"],
  downtown: ["Downtown Dubai"],
};

function projectMatchesArea(location: string, area: string): boolean {
  if (area === "all") return true;

  const patterns = areaLocationPatterns[area];
  if (!patterns) return false;

  return patterns.some((pattern) => location.includes(pattern));
}

function projectMatchesPropertyType(
  project: Project,
  propertyType: string,
): boolean {
  if (propertyType === "all") return true;

  if (propertyType.startsWith("commercial-")) {
    return project.category === "Commercial";
  }

  if (propertyType === "residential-villa") {
    return project.category === "Villa" || project.propertyType === "Villa";
  }

  if (propertyType === "residential-townhouse") {
    return project.propertyType === "Townhouse";
  }

  if (propertyType === "residential-apartment") {
    return project.category === "Residential";
  }

  return true;
}

export function filterProjects(
  projects: Project[],
  filters: {
    propertyType: string;
    area: string;
    searchQuery: string;
  },
): Project[] {
  const search = filters.searchQuery.trim().toLowerCase();

  return projects.filter((project) => {
    if (!projectMatchesPropertyType(project, filters.propertyType)) {
      return false;
    }

    if (!projectMatchesArea(project.location, filters.area)) {
      return false;
    }

    if (search && !project.location.toLowerCase().includes(search)) {
      return false;
    }

    return true;
  });
}
