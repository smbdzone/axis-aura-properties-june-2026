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

export const hotProjects: Project[] = [
  {
    id: "al-barari-samana",
    developerId: "samana",
    location: "Al Barari Dubai",
    developer: "Samana",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "8.8M",
    image: "/projects/project.svg",
  },
  {
    id: "marina-heights-damac",
    developerId: "damac",
    location: "Dubai Marina",
    developer: "Damac",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "6.2M",
    image: "/properties/properties.svg",
  },
  {
    id: "creek-harbour-sobha",
    developerId: "sobha",
    location: "Dubai Creek Harbour",
    developer: "Sobha",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "9.5M",
    image: "/extra/Discover2.svg",
  },
  {
    id: "palm-jumeirah-villa",
    developerId: "nakheel",
    location: "Palm Jumeirah",
    developer: "Nakheel",
    propertyType: "Villa",
    category: "Villa",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "24M",
    image: "/extra/pinnacle.svg",
  },
  {
    id: "arabian-ranches-villa",
    developerId: "emaar",
    location: "Arabian Ranches",
    developer: "Emaar",
    propertyType: "Villa",
    category: "Villa",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "12.4M",
    image: "/extra/Discover3.svg",
  },
  {
    id: "business-bay-tower",
    developerId: "binghatti",
    location: "Business Bay",
    developer: "Binghatti",
    propertyType: "Commercial",
    category: "Commercial",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "4.1M",
    image: "/projects/project.svg",
  },
  {
    id: "jlt-commercial",
    developerId: "azizi",
    location: "Jumeirah Lake Towers",
    developer: "Azizi",
    propertyType: "Commercial",
    category: "Commercial",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "3.6M",
    image: "/properties/properties.svg",
  },
  {
    id: "downtown-commercial",
    developerId: "damac",
    location: "Downtown Dubai",
    developer: "Damac",
    propertyType: "Commercial",
    category: "Commercial",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "7.8M",
    image: "/extra/Discover2.svg",
  },
  {
    id: "emaar-beach-villa",
    developerId: "emaar",
    location: "Emaar Beachfront",
    developer: "Emaar",
    propertyType: "Villa",
    category: "Villa",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "18.2M",
    image: "/Image.svg",
  },
  {
    id: "samana-park-views",
    developerId: "samana",
    location: "Dubai Production City",
    developer: "Samana",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "1.2M",
    image: "/projects/project.svg",
  },
  {
    id: "samana-golf-views",
    developerId: "samana",
    location: "Dubai Sports City",
    developer: "Samana",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "30 / 70 Payment Plan",
    priceAmount: "1.5M",
    image: "/properties/properties.svg",
  },
  {
    id: "arada-aljada",
    developerId: "arada",
    location: "Aljada Sharjah",
    developer: "Arada",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "2.1M",
    image: "/extra/Discover2.svg",
  },
  {
    id: "arada-masaar",
    developerId: "arada",
    location: "Masaar Sharjah",
    developer: "Arada",
    propertyType: "Villa",
    category: "Villa",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "3.8M",
    image: "/extra/Discover3.svg",
  },
  {
    id: "sobha-hartland",
    developerId: "sobha",
    location: "Mohammed Bin Rashid City",
    developer: "Sobha",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "2.4M",
    image: "/projects/project.svg",
  },
  {
    id: "sobha-seahaven",
    developerId: "sobha",
    location: "Dubai Harbour",
    developer: "Sobha",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "5.2M",
    image: "/extra/pinnacle.svg",
  },
  {
    id: "damac-lagoons",
    developerId: "damac",
    location: "Damac Lagoons",
    developer: "Damac",
    propertyType: "Villa",
    category: "Villa",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "3.1M",
    image: "/extra/Discover3.svg",
  },
  {
    id: "danube-bayz",
    developerId: "danube",
    location: "Business Bay",
    developer: "Danube",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "1.8M",
    image: "/projects/project.svg",
  },
  {
    id: "danube-glitz",
    developerId: "danube",
    location: "Dubai Studio City",
    developer: "Danube",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "950K",
    image: "/properties/properties.svg",
  },
  {
    id: "danube-bayz-101",
    developerId: "danube",
    location: "Business Bay",
    developer: "Danube",
    propertyType: "Commercial",
    category: "Commercial",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "2.6M",
    image: "/extra/Discover2.svg",
  },
  {
    id: "binghatti-avenue",
    developerId: "binghatti",
    location: "Al Jaddaf",
    developer: "Binghatti",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "1.4M",
    image: "/extra/Discover2.svg",
  },
  {
    id: "binghatti-ghost",
    developerId: "binghatti",
    location: "Al Jaddaf",
    developer: "Binghatti",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "1.9M",
    image: "/projects/project.svg",
  },
  {
    id: "azizi-riviera",
    developerId: "azizi",
    location: "Mohammed Bin Rashid City",
    developer: "Azizi",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "1.6M",
    image: "/extra/Discover3.svg",
  },
  {
    id: "azizi-venice",
    developerId: "azizi",
    location: "Dubai South",
    developer: "Azizi",
    propertyType: "Residential",
    category: "Residential",
    paymentPlan: "20 / 80 Payment Plan",
    priceAmount: "1.1M",
    image: "/Image.svg",
  },
];

export function getProjectsByDeveloperId(developerId: string): Project[] {
  return hotProjects.filter((project) => project.developerId === developerId);
}

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
