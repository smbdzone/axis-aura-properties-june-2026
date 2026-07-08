import type { Property } from "@/components/card/PropertyCard";

export const recentProperties: Property[] = [
  {
    id: "barari-avenue",
    title: "Barari Avenue",
    location: "Al Barari Dubai",
    developer: "Samana",
    propertyType: "Commercial",
    category: "commercial",
    subType: "office",
    areaSlug: "al-barari",
    developerSlug: "samana",
    paymentPlan: "20 / 80 Payment Plan",
    price: "Studio from AED 750,000",
    image: "/properties/properties.svg",
  },
  {
    id: "marina-heights",
    title: "Marina Heights",
    location: "Dubai Marina",
    developer: "Damac",
    propertyType: "Residential",
    category: "residential",
    subType: "apartment",
    areaSlug: "dubai-marina",
    developerSlug: "damac",
    paymentPlan: "20 / 80 Payment Plan",
    price: "1 Bed from AED 1,200,000",
    image: "/properties/properties.svg",
  },
  {
    id: "creek-residence",
    title: "Creek Residence",
    location: "Dubai Creek Harbour",
    developer: "Sobha",
    propertyType: "Residential",
    category: "residential",
    subType: "apartment",
    areaSlug: "dubai-creek-harbour",
    developerSlug: "sobha",
    paymentPlan: "20 / 80 Payment Plan",
    price: "2 Bed from AED 1,850,000",
    image: "/properties/properties.svg",
  },
];

export const newProjectProperties: Property[] = [
  ...recentProperties,
  {
    id: "palm-vista",
    title: "Palm Vista",
    location: "Downtown Dubai",
    developer: "Azizi",
    propertyType: "Residential",
    category: "residential",
    subType: "apartment",
    areaSlug: "downtown",
    developerSlug: "azizi",
    paymentPlan: "20 / 80 Payment Plan",
    price: "Studio from AED 890,000",
    image: "/properties/properties.svg",
  },
  {
    id: "harbour-gate",
    title: "Harbour Gate",
    location: "Dubai Marina",
    developer: "Damac",
    propertyType: "Commercial",
    category: "commercial",
    subType: "office",
    areaSlug: "dubai-marina",
    developerSlug: "damac",
    paymentPlan: "30 / 70 Payment Plan",
    price: "Office from AED 1,450,000",
    image: "/properties/properties.svg",
  },
  {
    id: "green-oasis",
    title: "Green Oasis",
    location: "Al Barari Dubai",
    developer: "Samana",
    propertyType: "Villa",
    category: "residential",
    subType: "villa",
    areaSlug: "al-barari",
    developerSlug: "samana",
    paymentPlan: "20 / 80 Payment Plan",
    price: "3 Bed from AED 2,600,000",
    image: "/properties/properties.svg",
  },
  {
    id: "skyline-residences",
    title: "Skyline Residences",
    location: "Downtown Dubai",
    developer: "Binghatti",
    propertyType: "Residential",
    category: "residential",
    subType: "apartment",
    areaSlug: "downtown",
    developerSlug: "binghatti",
    paymentPlan: "20 / 80 Payment Plan",
    price: "1 Bed from AED 1,050,000",
    image: "/properties/properties.svg",
  },
  {
    id: "creek-villas",
    title: "Creek Villas",
    location: "Dubai Creek Harbour",
    developer: "Sobha",
    propertyType: "Townhouse",
    category: "residential",
    subType: "townhouse",
    areaSlug: "dubai-creek-harbour",
    developerSlug: "sobha",
    paymentPlan: "20 / 80 Payment Plan",
    price: "4 Bed from AED 3,200,000",
    image: "/properties/properties.svg",
  },
  {
    id: "marina-suites",
    title: "Marina Suites",
    location: "Dubai Marina",
    developer: "Azizi",
    propertyType: "Residential",
    category: "residential",
    subType: "apartment",
    areaSlug: "dubai-marina",
    developerSlug: "azizi",
    paymentPlan: "20 / 80 Payment Plan",
    price: "2 Bed from AED 1,650,000",
    image: "/properties/properties.svg",
  },
  {
    id: "azure-heights",
    title: "Azure Heights",
    location: "Downtown Dubai",
    developer: "Damac",
    propertyType: "Residential",
    category: "residential",
    subType: "apartment",
    areaSlug: "downtown",
    developerSlug: "damac",
    paymentPlan: "20 / 80 Payment Plan",
    price: "1 Bed from AED 980,000",
    image: "/properties/properties.svg",
  },
  {
    id: "lagoon-villas",
    title: "Lagoon Villas",
    location: "Al Barari Dubai",
    developer: "Sobha",
    propertyType: "Villa",
    category: "residential",
    subType: "villa",
    areaSlug: "al-barari",
    developerSlug: "sobha",
    paymentPlan: "20 / 80 Payment Plan",
    price: "5 Bed from AED 4,100,000",
    image: "/properties/properties.svg",
  },
  {
    id: "business-bay-tower",
    title: "Business Bay Tower",
    location: "Downtown Dubai",
    developer: "Binghatti",
    propertyType: "Commercial",
    category: "commercial",
    subType: "retail",
    areaSlug: "downtown",
    developerSlug: "binghatti",
    paymentPlan: "30 / 70 Payment Plan",
    price: "Retail from AED 2,300,000",
    image: "/properties/properties.svg",
  },
];

export function getPropertyFilterKey(property: Property): string {
  return `${property.category}-${property.subType}`;
}

export function filterProperties(
  properties: Property[],
  filters: {
    propertyType: string;
    area: string;
    developer: string;
    searchQuery: string;
  },
  category?: "residential" | "commercial",
): Property[] {
  const search = filters.searchQuery.trim().toLowerCase();

  return properties.filter((property) => {
    if (category && property.category !== category) {
      return false;
    }

    if (
      filters.propertyType !== "all" &&
      getPropertyFilterKey(property) !== filters.propertyType
    ) {
      return false;
    }

    if (filters.area !== "all" && property.areaSlug !== filters.area) {
      return false;
    }

    if (
      filters.developer !== "all" &&
      property.developerSlug !== filters.developer
    ) {
      return false;
    }

    if (search && !property.location.toLowerCase().includes(search)) {
      return false;
    }

    return true;
  });
}
