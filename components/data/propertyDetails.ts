import type { Property } from "@/components/card/PropertyCard";
import { newProjectProperties } from "@/components/data/properties";

export type PaymentPlanStep = {
  percentage: string;
  label: string;
};

export type PropertyFAQ = {
  question: string;
  answer: string;
};

export const FAQ_ANSWER_MAX_WORDS = 100;
export const FAQ_CARD_PREVIEW_WORDS = 10;

export function limitFaqAnswer(
  answer: string,
  maxWords: number = FAQ_ANSWER_MAX_WORDS,
): string {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, maxWords).join(" ");
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function truncateFaqPreview(
  text: string,
  maxWords: number = FAQ_CARD_PREVIEW_WORDS,
): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}...`;
}

export function exceedsPreviewLimit(
  text: string,
  maxWords: number = FAQ_CARD_PREVIEW_WORDS,
): boolean {
  return countWords(text) > maxWords;
}

function normalizeFaqs(faqs: PropertyFAQ[]): PropertyFAQ[] {
  return faqs.map((faq) => ({
    ...faq,
    answer: limitFaqAnswer(faq.answer),
  }));
}

export type PropertyDetail = Property & {
  fullTitle: string;
  overviewSummary: string;
  startingPriceLabel: string;
  areaName: string;
  heroImage: string;
  interiorImages: string[];
  paymentPlanSteps: PaymentPlanStep[];
  amenities: string[];
  access: string[];
  views: string[];
  overviewText: string;
  locationImage: string;
  mapImage: string;
  mapUrl: string;
  faqs: PropertyFAQ[];
};

const defaultPaymentPlanSteps: PaymentPlanStep[] = [
  { percentage: "20%", label: "Booking" },
  { percentage: "1%", label: "Per Month* 42 Months" },
  { percentage: "10%", label: "On 12th Month" },
  { percentage: "5%", label: "On 18th Month" },
  { percentage: "0.5%", label: "Per Month* 46 Months" },
];

const defaultAmenities = [
  "Luxury & High End Finishing",
  "GYM",
  "Central AC",
  "CCTV Cameras",
  "Beach Access",
];

const defaultViews = [
  "Community View",
  "Sea View",
  "Pool View",
  "Burj Khalifa View",
  "Burj Al Arab View",
];

const accessByArea: Record<string, string[]> = {
  "al-barari": [
    "10 mins IMG World of Adventures",
    "5 mins Dunecrest American School",
    "10 mins Global Village",
    "15 mins Dubai Miracle Garden",
    "20 mins Dubai Mall",
    "20 mins Dubai International Airport",
    "25 mins Mall of Emirates",
    "25 mins Burj Al Arab",
  ],
  "dubai-marina": [
    "5 mins Dubai Marina Mall",
    "10 mins JBR Beach",
    "15 mins Mall of Emirates",
    "20 mins Dubai Mall",
    "25 mins Dubai International Airport",
    "15 mins Ibn Battuta Mall",
    "10 mins Metro Station",
    "20 mins Burj Al Arab",
  ],
  "dubai-creek-harbour": [
    "10 mins Dubai Festival City",
    "15 mins Dubai International Airport",
    "20 mins Downtown Dubai",
    "15 mins Ras Al Khor Wildlife Sanctuary",
    "25 mins Dubai Mall",
    "10 mins Creek Metro Station",
    "20 mins Business Bay",
    "30 mins Burj Khalifa",
  ],
  downtown: [
    "5 mins Dubai Mall",
    "5 mins Burj Khalifa",
    "10 mins Dubai Opera",
    "15 mins Business Bay",
    "20 mins Dubai International Airport",
    "10 mins DIFC",
    "15 mins City Walk",
    "25 mins Dubai Marina",
  ],
};

const propertyDetailOverrides: Record<
  string,
  Partial<
    Omit<PropertyDetail, keyof Property> & {
      overviewText?: string;
    }
  >
> = {
  "barari-avenue": {
    fullTitle: "Barari Heights at Al Barari Dubai",
    overviewSummary:
      "Invest in the future. A high return property combining prime location, modern design, and world class amenities. Secure yours today!",
    startingPriceLabel: "1.1M",
    areaName: "Al Barari",
    overviewText:
      "Barari Heights rises gracefully within the lush green enclave of Al Barari, Dubai's premier eco-conscious community, where modern living intertwines with nature's serenity. As a testament to refined urban elegance, Barari Heights offers residents a harmonious balance of sophistication, wellness, and immersive greenery just moments from the city's vibrant pulse. Each residence at Barari Heights is meticulously designed to embrace natural light, scenic views, and contemporary comfort. Offering a collection of stylish studios, one, two, and three-bedroom apartments, every home is a sanctuary where thoughtful architecture meets everyday practicality, catering to those who seek a lifestyle infused with tranquility and elegance.",
    faqs: [
      {
        question: "Where is Barari Heights located in Dubai?",
        answer:
          "Barari Heights is located in the Al Barari community, a premium and eco-friendly residential area in Dubai, known for its lush greenery, landscaped gardens, and luxurious lifestyle offerings.",
      },
      {
        question: "What unit types are available at Barari Heights?",
        answer:
          "Barari Heights offers studios, one-bedroom, two-bedroom, and three-bedroom apartments designed with contemporary finishes and generous natural light throughout.",
      },
      {
        question: "What is the payment plan for Barari Heights?",
        answer:
          "The project features a flexible payment plan starting with 20% on booking, followed by 1% monthly installments over 42 months, with additional milestone payments on the 12th and 18th months.",
      },
      {
        question: "What amenities does Barari Heights offer?",
        answer:
          "Residents enjoy luxury finishing, a fully equipped gym, central air conditioning, 24/7 CCTV security, and convenient beach access within the Al Barari master community.",
      },
    ],
  },
  "marina-heights": {
    fullTitle: "Marina Heights at Dubai Marina",
    overviewSummary:
      "Waterfront living at its finest. Experience panoramic marina views, premium amenities, and unbeatable connectivity in Dubai's most vibrant district.",
    startingPriceLabel: "1.2M",
    areaName: "Dubai Marina",
    overviewText:
      "Marina Heights stands as a beacon of contemporary waterfront living in the heart of Dubai Marina. With sweeping views of the yacht-filled harbour and the glittering skyline, this residential tower offers an unparalleled urban lifestyle. Each apartment is crafted with premium materials and floor-to-ceiling windows that frame the marina's ever-changing panorama. From world-class dining and retail at your doorstep to the beach just minutes away, Marina Heights places you at the centre of Dubai's most sought-after neighbourhood.",
    amenities: [
      "Infinity Pool",
      "State-of-the-Art GYM",
      "Central AC",
      "24/7 Concierge",
      "Marina Walk Access",
    ],
    views: ["Marina View", "Sea View", "City Skyline", "Yacht Harbour View"],
    faqs: [
      {
        question: "Where is Marina Heights located?",
        answer:
          "Marina Heights is situated in Dubai Marina, one of Dubai's most popular waterfront communities, offering direct access to the marina promenade, beaches, and metro connectivity.",
      },
      {
        question: "What views can residents expect?",
        answer:
          "Apartments offer stunning marina views, sea views, and panoramic city skyline vistas, with select units overlooking the yacht harbour.",
      },
      {
        question: "Is Marina Heights close to public transport?",
        answer:
          "Yes, Dubai Marina Metro Station is approximately 10 minutes away, providing easy access to Downtown Dubai, DIFC, and Dubai International Airport.",
      },
      {
        question: "What is the starting price for Marina Heights?",
        answer:
          "One-bedroom apartments start from AED 1,200,000 with a flexible 20/80 payment plan available for qualified buyers.",
      },
    ],
  },
  "creek-residence": {
    fullTitle: "Creek Residence at Dubai Creek Harbour",
    overviewSummary:
      "Redefine waterfront living along Dubai Creek. A master-planned community with iconic views of the Dubai skyline and Ras Al Khor sanctuary.",
    startingPriceLabel: "1.85M",
    areaName: "Dubai Creek Harbour",
    overviewText:
      "Creek Residence captures the essence of modern waterfront living along the historic Dubai Creek. Nestled within the visionary Dubai Creek Harbour masterplan, this development offers residents a front-row seat to the city's most ambitious urban transformation. With the iconic Dubai Creek Tower on the horizon and the tranquil Ras Al Khor Wildlife Sanctuary nearby, Creek Residence blends metropolitan convenience with natural serenity. Spacious two-bedroom apartments feature open-plan layouts, premium finishes, and balconies designed for sunset views over the creek.",
    amenities: [
      "Waterfront Promenade",
      "Swimming Pool",
      "Fitness Centre",
      "Children's Play Area",
      "Landscaped Gardens",
    ],
    views: ["Creek View", "Skyline View", "Park View", "Sanctuary View"],
    faqs: [
      {
        question: "What makes Dubai Creek Harbour special?",
        answer:
          "Dubai Creek Harbour is a mega-development featuring the Dubai Creek Tower, extensive waterfront promenades, retail districts, and proximity to the Ras Al Khor Wildlife Sanctuary.",
      },
      {
        question: "What unit sizes are available at Creek Residence?",
        answer:
          "Creek Residence primarily offers spacious two-bedroom apartments, with select units featuring study rooms and larger balcony configurations.",
      },
      {
        question: "How far is Creek Residence from Downtown Dubai?",
        answer:
          "Downtown Dubai and the Burj Khalifa are approximately 20 minutes away by car, with planned metro connectivity enhancing future accessibility.",
      },
      {
        question: "Who is the developer of Creek Residence?",
        answer:
          "Creek Residence is developed by Sobha Realty, known for their commitment to quality construction and timely project delivery across the UAE.",
      },
    ],
  },
  "palm-vista": {
    fullTitle: "Palm Vista at Downtown Dubai",
    overviewSummary:
      "Live in the shadow of icons. Premium studios and apartments in the world's most prestigious address with Burj Khalifa views.",
    startingPriceLabel: "890K",
    areaName: "Downtown Dubai",
    overviewText:
      "Palm Vista places you at the epicentre of Dubai's most iconic neighbourhood. Steps from the Dubai Mall, Burj Khalifa, and the Dubai Fountain, this development offers an urban lifestyle unmatched anywhere in the region. Compact yet luxurious studios and one-bedroom apartments are designed for young professionals and investors seeking maximum rental yield in a prime location. Premium finishes, smart home features, and a rooftop pool with Burj Khalifa views define the Palm Vista experience.",
    faqs: [
      {
        question: "Is Palm Vista walking distance to Dubai Mall?",
        answer:
          "Yes, Dubai Mall is approximately 5 minutes away on foot, making Palm Vista one of the most centrally located residential options in Downtown Dubai.",
      },
      {
        question: "Are studios available at Palm Vista?",
        answer:
          "Yes, Palm Vista offers elegantly designed studios starting from AED 890,000, ideal for first-time buyers and buy-to-let investors.",
      },
      {
        question: "What attractions are nearby?",
        answer:
          "Residents enjoy immediate access to Burj Khalifa, Dubai Opera, Dubai Fountain shows, DIFC dining, and the extensive retail and entertainment options of Downtown Dubai.",
      },
      {
        question: "What is the expected handover date?",
        answer:
          "Handover is anticipated within 24 months of booking, subject to construction progress. Contact our team for the latest timeline updates.",
      },
    ],
  },
  "harbour-gate": {
    fullTitle: "Harbour Gate at Dubai Marina",
    overviewSummary:
      "Premium commercial offices in Dubai Marina's business corridor. Ideal for corporate headquarters and professional services firms.",
    startingPriceLabel: "1.45M",
    areaName: "Dubai Marina",
    overviewText:
      "Harbour Gate offers premium Grade-A office spaces in the thriving commercial corridor of Dubai Marina. Designed for businesses that demand a prestigious address, these offices feature high ceilings, flexible floor plates, and floor-to-ceiling glazing with marina views. The development includes dedicated parking, high-speed elevators, and a business centre, making it the ideal choice for corporate headquarters, law firms, and financial services companies seeking a Dubai Marina presence.",
    amenities: [
      "Grade-A Office Fit-Out",
      "Dedicated Parking",
      "High-Speed Elevators",
      "Business Centre",
      "24/7 Security",
    ],
    views: ["Marina View", "City View", "Harbour View"],
    faqs: [
      {
        question: "What type of commercial space does Harbour Gate offer?",
        answer:
          "Harbour Gate provides premium office units suitable for corporate headquarters, professional services, and boutique firms, with flexible floor plate configurations.",
      },
      {
        question: "Is Harbour Gate freehold for international buyers?",
        answer:
          "Yes, Harbour Gate offices are available on a freehold basis, allowing full ownership for both UAE nationals and international investors.",
      },
      {
        question: "What is the payment plan for commercial units?",
        answer:
          "A 30/70 payment plan is available, with 30% payable during construction and the remaining 70% on handover.",
      },
      {
        question: "Are there retail options within Harbour Gate?",
        answer:
          "The ground floor features select retail and F&B outlets, providing convenience for tenants and visitors to the building.",
      },
    ],
  },
  "green-oasis": {
    fullTitle: "Green Oasis Villas at Al Barari",
    overviewSummary:
      "Luxury villa living surrounded by nature. Spacious 3-bedroom homes in Dubai's greenest community with private gardens and lagoon views.",
    startingPriceLabel: "2.6M",
    areaName: "Al Barari",
    overviewText:
      "Green Oasis Villas redefine family living within the verdant landscapes of Al Barari. These three-bedroom villas are set among mature trees, flowing waterways, and meticulously landscaped gardens that create a resort-like atmosphere year-round. Each villa features a private garden, double-height living spaces, and premium European finishes throughout. The Al Barari community offers farm-to-table dining, nature trails, and a lifestyle centred on wellness and outdoor living.",
    amenities: [
      "Private Garden",
      "Private Pool Option",
      "Smart Home System",
      "Maid's Room",
      "Covered Parking",
    ],
    views: ["Garden View", "Lagoon View", "Greenery View", "Community View"],
    faqs: [
      {
        question: "How many bedrooms do Green Oasis Villas have?",
        answer:
          "Green Oasis Villas feature three spacious bedrooms with en-suite bathrooms, a maid's room, and generous living and dining areas.",
      },
      {
        question: "Does each villa have a private garden?",
        answer:
          "Yes, every villa at Green Oasis includes a private landscaped garden, with select units offering optional private pool installation.",
      },
      {
        question: "What schools are near Al Barari?",
        answer:
          "Dunecrest American School is 5 minutes away, with several other international schools within a 15-minute drive.",
      },
      {
        question: "Is Green Oasis suitable for families?",
        answer:
          "Absolutely. Al Barari is one of Dubai's most family-friendly communities, with parks, nature trails, community pools, and a safe, gated environment.",
      },
    ],
  },
  "skyline-residences": {
    fullTitle: "Skyline Residences at Downtown Dubai",
    overviewSummary:
      "Elevated living with breathtaking skyline views. Modern one-bedroom apartments in the heart of Downtown with world-class amenities.",
    startingPriceLabel: "1.05M",
    areaName: "Downtown Dubai",
    overviewText:
      "Skyline Residences offers a collection of thoughtfully designed one-bedroom apartments that maximise views of Downtown Dubai's iconic skyline. Developed by Binghatti, known for their distinctive architectural style, this tower features signature design elements, smart home integration, and a comprehensive amenity package. Residents enjoy a rooftop infinity pool, co-working spaces, and direct access to the vibrant dining and entertainment scene that defines Downtown Dubai.",
    faqs: [
      {
        question: "Who is the developer of Skyline Residences?",
        answer:
          "Skyline Residences is developed by Binghatti, one of Dubai's fastest-growing developers known for distinctive architecture and competitive pricing.",
      },
      {
        question: "What amenities are included?",
        answer:
          "The building features a rooftop infinity pool, fully equipped gym, co-working lounge, children's play area, and 24/7 security with concierge services.",
      },
      {
        question: "What is the starting price?",
        answer:
          "One-bedroom apartments start from AED 1,050,000 with a 20/80 payment plan available.",
      },
      {
        question: "Is there a metro station nearby?",
        answer:
          "The Burj Khalifa/Dubai Mall Metro Station is approximately 10 minutes away, providing seamless connectivity across Dubai.",
      },
    ],
  },
  "creek-villas": {
    fullTitle: "Creek Villas at Dubai Creek Harbour",
    overviewSummary:
      "Spacious four-bedroom townhouses along the creek. Family homes with private terraces and community parks in a master-planned waterfront district.",
    startingPriceLabel: "3.2M",
    areaName: "Dubai Creek Harbour",
    overviewText:
      "Creek Villas offer generous four-bedroom townhouses designed for families who value space, privacy, and waterfront proximity. Each townhouse spans three floors with a private terrace, double garage, and open-plan living areas that flow seamlessly to outdoor spaces. Set within Dubai Creek Harbour's family-oriented district, residents enjoy community parks, cycling tracks, schools, and retail—all within a short stroll of the creek promenade.",
    amenities: [
      "Private Terrace",
      "Double Garage",
      "Community Parks",
      "Cycling Tracks",
      "BBQ Areas",
    ],
    views: ["Creek View", "Park View", "Community View", "Skyline View"],
    faqs: [
      {
        question: "How many bedrooms do Creek Villas have?",
        answer:
          "Creek Villas feature four spacious bedrooms with en-suite bathrooms, a maid's room, a study, and a double garage.",
      },
      {
        question: "Are Creek Villas freehold?",
        answer:
          "Yes, Creek Villas are available on a freehold basis for all nationalities, developed by Sobha Realty with their signature quality standards.",
      },
      {
        question: "What community facilities are available?",
        answer:
          "The community includes landscaped parks, children's play areas, cycling and jogging tracks, retail outlets, and a creek-side promenade.",
      },
      {
        question: "What is the payment plan?",
        answer:
          "A 20/80 payment plan is available with 20% during construction and 80% on handover, with milestone-based installments.",
      },
    ],
  },
  "marina-suites": {
    fullTitle: "Marina Suites at Dubai Marina",
    overviewSummary:
      "Sophisticated two-bedroom suites with marina views. Premium finishes and resort-style amenities in Dubai's waterfront hub.",
    startingPriceLabel: "1.65M",
    areaName: "Dubai Marina",
    overviewText:
      "Marina Suites delivers refined two-bedroom living in the heart of Dubai Marina. Developed by Azizi, each suite features open-plan layouts, premium kitchen appliances, and balconies oriented to capture marina and sea views. The building's amenity deck includes an infinity pool, sun deck, and landscaped gardens, creating a resort atmosphere above the bustling marina below. With Dubai Marina Walk, JBR Beach, and the metro all within easy reach, Marina Suites is ideal for professionals and families alike.",
    faqs: [
      {
        question: "What size are the apartments at Marina Suites?",
        answer:
          "Marina Suites offers two-bedroom apartments ranging from 1,100 to 1,400 square feet, with spacious balconies and open-plan living areas.",
      },
      {
        question: "Is there a swimming pool?",
        answer:
          "Yes, residents enjoy access to an infinity pool on the amenity deck with sun loungers and marina views.",
      },
      {
        question: "How far is JBR Beach?",
        answer:
          "JBR Beach and The Walk are approximately 10 minutes away on foot, offering dining, retail, and beach access.",
      },
      {
        question: "What is the handover timeline?",
        answer:
          "Expected handover is within 18–24 months. Contact our sales team for the most current construction update.",
      },
    ],
  },
  "azure-heights": {
    fullTitle: "Azure Heights at Downtown Dubai",
    overviewSummary:
      "Affordable luxury in Downtown Dubai. One-bedroom apartments with smart layouts and premium amenities at an accessible price point.",
    startingPriceLabel: "980K",
    areaName: "Downtown Dubai",
    overviewText:
      "Azure Heights makes Downtown Dubai living accessible without compromising on quality. These one-bedroom apartments by Damac feature efficient layouts, quality finishes, and access to a full suite of building amenities including a pool, gym, and landscaped podium deck. Located within minutes of the Dubai Mall and Burj Khalifa, Azure Heights represents exceptional value in one of the world's most prestigious postcodes.",
    faqs: [
      {
        question: "Why is Azure Heights considered good value?",
        answer:
          "With one-bedroom units starting from AED 980,000 in Downtown Dubai, Azure Heights offers one of the most competitive entry points to this prime location.",
      },
      {
        question: "Who is the developer?",
        answer:
          "Azure Heights is developed by Damac Properties, one of the UAE's largest and most established real estate developers.",
      },
      {
        question: "What amenities does the building offer?",
        answer:
          "Residents enjoy a swimming pool, gymnasium, children's play area, landscaped gardens, and 24/7 security with CCTV coverage.",
      },
      {
        question: "Is Azure Heights suitable for investors?",
        answer:
          "Yes, Downtown Dubai consistently delivers strong rental yields and capital appreciation, making Azure Heights an attractive investment opportunity.",
      },
    ],
  },
  "lagoon-villas": {
    fullTitle: "Lagoon Villas at Al Barari",
    overviewSummary:
      "Ultra-luxury five-bedroom villas on private lagoons. The pinnacle of Al Barari living with bespoke finishes and expansive plots.",
    startingPriceLabel: "4.1M",
    areaName: "Al Barari",
    overviewText:
      "Lagoon Villas represent the ultimate expression of luxury living in Al Barari. These five-bedroom estates sit on generous plots overlooking private lagoons, with architecture that blends contemporary elegance and natural harmony. Interiors feature imported marble, bespoke joinery, and smart home automation throughout. Private pools, outdoor entertainment areas, and direct lagoon access create a resort-like lifestyle within one of Dubai's most exclusive communities.",
    amenities: [
      "Private Pool",
      "Lagoon Access",
      "Smart Home Automation",
      "Private Elevator",
      "Wine Cellar",
    ],
    views: ["Lagoon View", "Garden View", "Greenery View", "Waterfront View"],
    faqs: [
      {
        question: "How many bedrooms do Lagoon Villas have?",
        answer:
          "Lagoon Villas feature five en-suite bedrooms, a maid's quarters, a driver's room, a study, and multiple living and entertainment areas.",
      },
      {
        question: "What makes Lagoon Villas unique in Al Barari?",
        answer:
          "These are among the largest villas in Al Barari, with direct lagoon frontage, private pools, and plot sizes exceeding 10,000 square feet.",
      },
      {
        question: "Are the villas customisable?",
        answer:
          "Select finishing packages and layout modifications are available during the pre-construction phase. Contact us for customisation options.",
      },
      {
        question: "What is the starting price?",
        answer:
          "Five-bedroom Lagoon Villas start from AED 4,100,000 with a 20/80 payment plan available for qualified buyers.",
      },
    ],
  },
  "business-bay-tower": {
    fullTitle: "Business Bay Tower at Downtown Dubai",
    overviewSummary:
      "Prime retail and commercial spaces in the Business Bay corridor. High-footfall locations ideal for flagship stores and F&B concepts.",
    startingPriceLabel: "2.3M",
    areaName: "Downtown Dubai",
    overviewText:
      "Business Bay Tower offers premium retail units in one of Dubai's highest footfall commercial corridors. These ground and podium-level spaces are designed for flagship retail, restaurants, and service businesses seeking maximum visibility. With direct access to Business Bay Metro Station and proximity to Downtown Dubai, DIFC, and the Dubai Canal, this development provides an unmatched commercial address for brands looking to establish a presence in Dubai's business heart.",
    amenities: [
      "High Footfall Location",
      "Metro Access",
      "Dedicated Loading Bay",
      "Signage Rights",
      "24/7 Security",
    ],
    views: ["Canal View", "City View", "Street View"],
    faqs: [
      {
        question: "What type of retail units are available?",
        answer:
          "Business Bay Tower offers ground-floor and podium-level retail units ranging from 800 to 2,500 square feet, suitable for F&B, fashion, and services.",
      },
      {
        question: "Is the location suitable for restaurants?",
        answer:
          "Yes, the high footfall corridor and outdoor terrace options make it ideal for restaurant and café concepts, subject to authority approvals.",
      },
      {
        question: "What is the payment plan for retail units?",
        answer:
          "A 30/70 payment plan is available, with 30% payable during construction and 70% on handover.",
      },
      {
        question: "How close is the metro?",
        answer:
          "Business Bay Metro Station is within walking distance, providing direct connectivity to Dubai Mall, DIFC, and the airport.",
      },
    ],
  },
};

function extractPriceLabel(price: string): string {
  const match = price.match(/AED\s*([\d,.]+[KMB]?)/i);
  if (!match) return "—";
  const raw = match[1].replace(/,/g, "");
  const num = parseFloat(raw);
  if (raw.endsWith("K") || num < 10000) return raw.replace(/K$/i, "K");
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (num >= 1_000) return `${Math.round(num / 1_000)}K`;
  return raw;
}

function extractAreaName(location: string): string {
  return location.replace(/\s+Dubai$/i, "").trim();
}

function buildPropertyDetail(property: Property): PropertyDetail {
  const overrides = propertyDetailOverrides[property.id] ?? {};
  const areaAccess =
    accessByArea[property.areaSlug] ?? accessByArea["downtown"];

  const interiorImages = overrides.interiorImages ?? [
    property.image,
    property.image,
    property.image,
    property.image,
    property.image,
    property.image,
    property.image,
  ];

  return {
    ...property,
    fullTitle:
      overrides.fullTitle ?? `${property.title} at ${property.location}`,
    overviewSummary:
      overrides.overviewSummary ??
      `Discover ${property.title} — a premium ${property.propertyType.toLowerCase()} development by ${property.developer} in ${property.location}.`,
    startingPriceLabel:
      overrides.startingPriceLabel ?? extractPriceLabel(property.price),
    areaName: overrides.areaName ?? extractAreaName(property.location),
    heroImage: overrides.heroImage ?? property.image,
    interiorImages,
    paymentPlanSteps: overrides.paymentPlanSteps ?? defaultPaymentPlanSteps,
    amenities: overrides.amenities ?? defaultAmenities,
    access: overrides.access ?? areaAccess,
    views: overrides.views ?? defaultViews,
    overviewText:
      overrides.overviewText ??
      `${property.title} is a distinguished ${property.propertyType.toLowerCase()} development by ${property.developer}, located in the sought-after ${property.location} district. Designed for discerning buyers and investors, the project combines prime positioning with modern architecture and a comprehensive amenity offering. With ${property.paymentPlan}, acquiring your dream property has never been more accessible.`,
    locationImage: overrides.locationImage ?? property.image,
    mapImage: overrides.mapImage ?? "/new proprty/Map.svg",
    mapUrl:
      overrides.mapUrl ??
      `https://maps.google.com/?q=${encodeURIComponent(property.location)}`,
    faqs: normalizeFaqs(
      overrides.faqs ?? [
        {
          question: `Where is ${property.title} located?`,
          answer: `${property.title} is located in ${property.location}, developed by ${property.developer}.`,
        },
        {
          question: `What is the starting price?`,
          answer: `Units start from ${property.price} with ${property.paymentPlan}.`,
        },
        {
          question: `What type of property is ${property.title}?`,
          answer: `${property.title} is a ${property.propertyType} development offering premium living and investment opportunities.`,
        },
      ],
    ),
  };
}

const propertyDetailsMap = new Map<string, PropertyDetail>(
  newProjectProperties.map((property) => [
    property.id,
    buildPropertyDetail(property),
  ]),
);

export function getPropertyDetailById(id: string): PropertyDetail | undefined {
  return propertyDetailsMap.get(id);
}

export function getAllPropertyIds(): string[] {
  return [...propertyDetailsMap.keys()];
}
