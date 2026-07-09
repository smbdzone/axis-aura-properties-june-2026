import {
  createEmptyLayoutFormData,
  createEmptySpecificationFormData,
  type PropertyFormData,
} from "@/components/data/propertyFormData";
import type { PropertyRow } from "@/components/data/propertyData";

function clonePropertyFormData(data: PropertyFormData): PropertyFormData {
  return JSON.parse(JSON.stringify(data)) as PropertyFormData;
}

function withApartmentSelection(
  layout: PropertyFormData["layout"],
  selectedIds: string[],
): PropertyFormData["layout"] {
  return {
    ...layout,
    apartments: layout.apartments.map((apartment) => ({
      ...apartment,
      selected: selectedIds.includes(apartment.id),
    })),
  };
}

function withSpecificationSelection(
  specification: PropertyFormData["specification"],
  selections: {
    amenities: string[];
    access: string[];
    views: string[];
  },
): PropertyFormData["specification"] {
  const selectItems = (
    items: PropertyFormData["specification"]["amenities"],
    ids: string[],
  ) =>
    items.map((item) => ({
      ...item,
      selected: ids.includes(item.id),
    }));

  return {
    amenities: selectItems(specification.amenities, selections.amenities),
    access: selectItems(specification.access, selections.access),
    views: selectItems(specification.views, selections.views),
  };
}

export const dummyProperties: PropertyFormData[] = (
  [
  {
    id: "1",
    details: {
      propertyTitle: "Barari Heights",
      area: "Al Barari",
      price: "AED 750,000",
      type: "Residential",
      developer: "Samana",
      location: "55.3012, 25.1024",
      overview:
        "Barari Heights offers luxury apartments surrounded by lush greenery in Al Barari, with premium finishes and family-friendly amenities.",
    },
    specification: withSpecificationSelection(createEmptySpecificationFormData(), {
      amenities: ["luxury-finishing", "gym", "central-ac", "cctv"],
      access: ["dunecrest-school", "dxb-airport", "dubai-mall"],
      views: ["community-view", "pool-view"],
    }),
    layout: withApartmentSelection(
      { ...createEmptyLayoutFormData(), layoutType: "Residential", floors: "5" },
      ["studio", "1bhk", "2bhk"],
    ),
    paymentPlan: [
      {
        id: "step-1",
        stepNumber: 1,
        paymentShare: "20%",
        releaseMilestone: "On Booking",
      },
      {
        id: "step-2",
        stepNumber: 2,
        paymentShare: "30%",
        releaseMilestone: "On Construction 50%",
      },
      {
        id: "step-3",
        stepNumber: 3,
        paymentShare: "50%",
        releaseMilestone: "On Handover",
      },
    ],
    faq: [
      {
        id: "faq-1",
        question: "What is the starting price for Barari Heights?",
        answer: "Units start from AED 750,000 depending on layout and floor.",
      },
      {
        id: "faq-2",
        question: "Is there a payment plan available?",
        answer: "Yes, a flexible 3-step payment plan is available on booking.",
      },
    ],
    seo: {
      title: "Barari Heights | Al Barari Residential by Samana",
      description:
        "Discover Barari Heights in Al Barari — luxury residential apartments by Samana with green community living.",
      canonicalUrl: "https://suitsandsand.com/properties/barari-heights",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "ApartmentComplex",
          name: "Barari Heights",
          address: "Al Barari, Dubai",
        },
        null,
        2,
      ),
    },
    meta: { status: "active", featured: true, mostLuxurious: false },
  },
  {
    id: "2",
    details: {
      propertyTitle: "Marina Crest Tower",
      area: "Dubai Marina",
      price: "AED 1.2 M",
      type: "Residential",
      developer: "Emaar",
      location: "55.1403, 25.0805",
      overview:
        "Marina Crest Tower delivers waterfront living in Dubai Marina with panoramic sea views, concierge services, and direct marina access.",
    },
    specification: withSpecificationSelection(createEmptySpecificationFormData(), {
      amenities: ["luxury-finishing", "gym", "beach-access", "cinema", "cctv"],
      access: ["dubai-mall", "mall-emirates", "burj-al-arab"],
      views: ["sea-view", "pool-view"],
    }),
    layout: withApartmentSelection(
      { ...createEmptyLayoutFormData(), layoutType: "Residential", floors: "6+" },
      ["1bhk", "2bhk", "2bhk-duplex"],
    ),
    paymentPlan: [
      {
        id: "step-1",
        stepNumber: 1,
        paymentShare: "10%",
        releaseMilestone: "On Booking",
      },
      {
        id: "step-2",
        stepNumber: 2,
        paymentShare: "40%",
        releaseMilestone: "During Construction",
      },
      {
        id: "step-3",
        stepNumber: 3,
        paymentShare: "50%",
        releaseMilestone: "On Handover",
      },
    ],
    faq: [
      {
        id: "faq-1",
        question: "Does Marina Crest Tower have sea views?",
        answer: "Select units offer full sea and marina views from mid to high floors.",
      },
    ],
    seo: {
      title: "Marina Crest Tower | Dubai Marina by Emaar",
      description:
        "Explore Marina Crest Tower — premium waterfront residences in Dubai Marina by Emaar.",
      canonicalUrl: "https://suitsandsand.com/properties/marina-crest-tower",
      schema: "",
    },
    meta: { status: "active", featured: true, mostLuxurious: true },
  },
  {
    id: "3",
    details: {
      propertyTitle: "Business Bay Central",
      area: "Business Bay",
      price: "AED 980,000",
      type: "Commercial",
      developer: "Damac",
      location: "55.2635, 25.1851",
      overview:
        "Business Bay Central offers modern commercial spaces ideal for offices and retail, located in the heart of Business Bay.",
    },
    specification: withSpecificationSelection(createEmptySpecificationFormData(), {
      amenities: ["central-ac", "cctv", "luxury-finishing"],
      access: ["dubai-mall", "dxb-airport"],
      views: ["szr-view", "burj-khalifa-view"],
    }),
    layout: withApartmentSelection(
      { ...createEmptyLayoutFormData(), layoutType: "Commercial", floors: "4" },
      ["studio", "1bhk"],
    ),
    paymentPlan: [
      {
        id: "step-1",
        stepNumber: 1,
        paymentShare: "25%",
        releaseMilestone: "On Booking",
      },
      {
        id: "step-2",
        stepNumber: 2,
        paymentShare: "75%",
        releaseMilestone: "On Handover",
      },
    ],
    faq: [
      {
        id: "faq-1",
        question: "Is this suitable for office use?",
        answer: "Yes, layouts are designed for commercial and office use cases.",
      },
    ],
    seo: {
      title: "Business Bay Central | Commercial by Damac",
      description:
        "Business Bay Central commercial property by Damac in the centre of Business Bay.",
      canonicalUrl: "https://suitsandsand.com/properties/business-bay-central",
      schema: "",
    },
    meta: { status: "active", featured: false, mostLuxurious: false },
  },
  {
    id: "4",
    details: {
      propertyTitle: "Palm Vista Residences",
      area: "Palm Jumeirah",
      price: "AED 2.5 M",
      type: "Residential",
      developer: "Nakheel",
      location: "55.1167, 25.1124",
      overview:
        "Palm Vista Residences on Palm Jumeirah features exclusive beachfront living with private beach access and resort-style amenities.",
    },
    specification: withSpecificationSelection(createEmptySpecificationFormData(), {
      amenities: ["luxury-finishing", "beach-access", "bbq", "gym", "cinema"],
      access: ["burj-al-arab", "mall-emirates", "dubai-mall"],
      views: ["sea-view", "burj-ul-arab-view"],
    }),
    layout: withApartmentSelection(
      { ...createEmptyLayoutFormData(), layoutType: "Residential", floors: "6+" },
      ["2bhk", "2bhk-duplex", "3bhk"],
    ),
    paymentPlan: [
      {
        id: "step-1",
        stepNumber: 1,
        paymentShare: "20%",
        releaseMilestone: "On Booking",
      },
      {
        id: "step-2",
        stepNumber: 2,
        paymentShare: "20%",
        releaseMilestone: "On 30% Construction",
      },
      {
        id: "step-3",
        stepNumber: 3,
        paymentShare: "20%",
        releaseMilestone: "On 60% Construction",
      },
      {
        id: "step-4",
        stepNumber: 4,
        paymentShare: "40%",
        releaseMilestone: "On Handover",
      },
    ],
    faq: [
      {
        id: "faq-1",
        question: "Is beach access included?",
        answer: "Yes, residents enjoy private beach access as part of the community.",
      },
      {
        id: "faq-2",
        question: "What layouts are available?",
        answer: "2 BHK, 2 BHK Duplex, and 3 BHK layouts are available.",
      },
    ],
    seo: {
      title: "Palm Vista Residences | Palm Jumeirah by Nakheel",
      description:
        "Luxury beachfront residences at Palm Vista on Palm Jumeirah by Nakheel.",
      canonicalUrl: "https://suitsandsand.com/properties/palm-vista-residences",
      schema: "",
    },
    meta: { status: "inactive", featured: true, mostLuxurious: true },
  },
  {
    id: "5",
    details: {
      propertyTitle: "Creek Horizon Suites",
      area: "Dubai Creek Harbour",
      price: "AED 1.1 M",
      type: "Mixed Use",
      developer: "Emaar",
      location: "55.3461, 25.1952",
      overview:
        "Creek Horizon Suites combines residential and retail in Dubai Creek Harbour with views of the creek and Downtown skyline.",
    },
    specification: withSpecificationSelection(createEmptySpecificationFormData(), {
      amenities: ["gym", "playground", "central-ac", "cctv"],
      access: ["dubai-mall", "img-world", "miracle-garden"],
      views: ["burj-khalifa-view", "community-view"],
    }),
    layout: withApartmentSelection(
      { ...createEmptyLayoutFormData(), layoutType: "Mixed Use", floors: "5" },
      ["studio", "1bhk", "2bhk"],
    ),
    paymentPlan: [
      {
        id: "step-1",
        stepNumber: 1,
        paymentShare: "15%",
        releaseMilestone: "On Booking",
      },
      {
        id: "step-2",
        stepNumber: 2,
        paymentShare: "35%",
        releaseMilestone: "On Construction",
      },
      {
        id: "step-3",
        stepNumber: 3,
        paymentShare: "50%",
        releaseMilestone: "On Handover",
      },
    ],
    faq: [
      {
        id: "faq-1",
        question: "What views are available at Creek Horizon?",
        answer: "Units offer creek, community, and Burj Khalifa skyline views.",
      },
    ],
    seo: {
      title: "Creek Horizon Suites | Dubai Creek Harbour",
      description:
        "Mixed-use living at Creek Horizon Suites in Dubai Creek Harbour by Emaar.",
      canonicalUrl: "https://suitsandsand.com/properties/creek-horizon-suites",
      schema: "",
    },
    meta: { status: "active" as const, featured: false, mostLuxurious: false },
  },
  ] as PropertyFormData[]
).map((property) => clonePropertyFormData(property));

export function getDummyPropertyById(id: string): PropertyFormData | undefined {
  return dummyProperties.find((property) => property.id === id);
}

export function propertyFormDataToTableRow(property: PropertyFormData): PropertyRow {
  return {
    id: property.id!,
    name: property.details.propertyTitle,
    type: property.details.type,
    area: property.details.area,
    developer: property.details.developer,
    startingPrice: property.details.price,
  };
}

export function getDummyPropertyTableRows(): PropertyRow[] {
  return dummyProperties.map(propertyFormDataToTableRow);
}

export const dummyPropertyTotalCount = dummyProperties.length;
