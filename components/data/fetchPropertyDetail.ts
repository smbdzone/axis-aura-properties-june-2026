import type { Property } from "@/components/card/PropertyCard";
import {
  limitFaqAnswer,
  type PaymentPlanStep,
  type PropertyDetail,
  type PropertyFAQ,
} from "@/components/data/propertyDetails";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

const FALLBACK_IMAGE = "/properties/properties.svg";

type BackendFeature = {
  id?: string;
  icon?: string;
  iconName?: string;
  title?: string;
  isSelected?: boolean;
};

type BackendPaymentEntry = { heading?: string; subText?: string };

type BackendFaq = { question?: string; answer?: string };

type BackendProperty = {
  _id: string;
  title: string;
  slug?: string;
  area?: string;
  price?: string;
  developer?: string;
  type?: string;
  location?: string;
  layoutType?: string;
  images?: string[];
  paymentPlans?: Record<string, BackendPaymentEntry[]>;
  faqs?: BackendFaq[];
  amenities?: BackendFeature[];
  access?: BackendFeature[];
  views?: BackendFeature[];
  description?: string;
  overview?: string;
  mapUrl?: string;
  longitude?: string;
  latitude?: string;
  quarter?: string;
  year?: string;
  status?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveImageUrl(url?: string) {
  if (!url) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function stripHtml(value?: string) {
  if (!value) return "";
  return value
    .replace(/<\s*br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveCategory(
  property: BackendProperty,
): "residential" | "commercial" {
  const haystack = `${property.type ?? ""} ${property.layoutType ?? ""}`.toLowerCase();
  return haystack.includes("commercial") ? "commercial" : "residential";
}

function resolveSubType(
  property: BackendProperty,
  category: "residential" | "commercial",
): Property["subType"] {
  const haystack = `${property.title} ${property.type ?? ""}`.toLowerCase();
  if (category === "commercial") {
    if (/retail|mall|plaza|shop|store/.test(haystack)) return "retail";
    return "office";
  }
  if (/town\s?house/.test(haystack)) return "townhouse";
  if (/villa|mansion/.test(haystack)) return "villa";
  return "apartment";
}

function paymentEntries(property: BackendProperty): BackendPaymentEntry[] {
  const groups = property.paymentPlans
    ? Object.values(property.paymentPlans)
    : [];
  return (
    groups.find((group) => Array.isArray(group) && group.length > 0) ?? []
  );
}

function resolvePaymentPlanLabel(property: BackendProperty) {
  const entries = paymentEntries(property);
  if (entries.length >= 2) {
    return `${entries[0].heading} / ${entries[1].heading} Payment Plan`;
  }
  if (entries.length === 1) {
    return `${entries[0].heading} Payment Plan`;
  }
  return "Flexible Payment Plan";
}

function resolvePaymentPlanSteps(property: BackendProperty): PaymentPlanStep[] {
  const entries = paymentEntries(property);
  const steps = entries
    .filter((entry) => entry.heading || entry.subText)
    .map((entry) => ({
      percentage: entry.heading ?? "",
      label: entry.subText ?? "",
    }));
  if (steps.length > 0) return steps;
  return [
    { percentage: "20%", label: "Booking" },
    { percentage: "40%", label: "During Construction" },
    { percentage: "40%", label: "On Handover" },
  ];
}

function featureTitles(features?: BackendFeature[]): string[] {
  if (!features || features.length === 0) return [];
  const selected = features.filter((feature) => feature.isSelected);
  const source = selected.length > 0 ? selected : features;
  return source
    .map((feature) => (feature.title ?? "").trim())
    .filter((title) => title.length > 0);
}

function extractPriceLabel(price: string): string {
  const match = price.match(/([\d,.]+)\s*([KMB])?/i);
  if (!match) return price || "—";
  const raw = match[1].replace(/,/g, "");
  const suffix = (match[2] ?? "").toUpperCase();
  if (suffix) return `${raw}${suffix}`;
  const num = parseFloat(raw);
  if (Number.isNaN(num)) return price;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (num >= 1_000) return `${Math.round(num / 1_000)}K`;
  return raw;
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
}

function mapToPropertyDetail(property: BackendProperty): PropertyDetail {
  const category = resolveCategory(property);
  const subType = resolveSubType(property, category);
  const area = property.area || property.location || "Dubai";
  const location = property.location || property.area || "Dubai, UAE";
  const developer = property.developer || "Axis Aura";
  const propertyType =
    property.type || (category === "commercial" ? "Commercial" : "Residential");
  const price = property.price || "Price on request";

  const resolvedImages = (property.images ?? [])
    .map(resolveImageUrl)
    .filter(Boolean);
  const heroImage = resolvedImages[0] ?? FALLBACK_IMAGE;
  const interiorImages =
    resolvedImages.length > 1 ? resolvedImages.slice(1) : [heroImage];

  const overviewText =
    stripHtml(property.overview) ||
    stripHtml(property.description) ||
    `${property.title} is a distinguished ${propertyType.toLowerCase()} development by ${developer}, located in ${location}.`;

  const overviewSummary = truncate(
    stripHtml(property.overview) ||
      stripHtml(property.description) ||
      `Discover ${property.title} by ${developer} in ${location}.`,
    180,
  );

  const backendFaqs: PropertyFAQ[] = (property.faqs ?? [])
    .filter((faq) => faq.question && faq.answer)
    .map((faq) => ({
      question: faq.question as string,
      answer: limitFaqAnswer(faq.answer as string),
    }));

  const faqs =
    backendFaqs.length > 0
      ? backendFaqs
      : [
          {
            question: `Where is ${property.title} located?`,
            answer: `${property.title} is located in ${location}, developed by ${developer}.`,
          },
          {
            question: "What is the starting price?",
            answer: `Units start from ${price} with ${resolvePaymentPlanLabel(property)}.`,
          },
          {
            question: `What type of property is ${property.title}?`,
            answer: `${property.title} is a ${propertyType} development offering premium living and investment opportunities.`,
          },
        ];

  const mapUrl =
    property.mapUrl ||
    (property.latitude && property.longitude
      ? `https://maps.google.com/?q=${property.latitude},${property.longitude}`
      : `https://maps.google.com/?q=${encodeURIComponent(location)}`);

  return {
    id: property._id,
    title: property.title,
    location,
    developer,
    propertyType,
    category,
    subType,
    areaSlug: slugify(area),
    developerSlug: slugify(developer),
    paymentPlan: resolvePaymentPlanLabel(property),
    price,
    image: heroImage,
    fullTitle: property.title,
    overviewSummary,
    startingPriceLabel: extractPriceLabel(price),
    areaName: area,
    heroImage,
    interiorImages,
    paymentPlanSteps: resolvePaymentPlanSteps(property),
    amenities: featureTitles(property.amenities),
    access: featureTitles(property.access),
    views: featureTitles(property.views),
    overviewText,
    locationImage: heroImage,
    mapImage: "/new proprty/Map.svg",
    mapUrl,
    faqs,
  };
}

export async function fetchPropertyDetail(
  id: string,
): Promise<PropertyDetail | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/properties/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const property = (await response.json()) as BackendProperty | null;
    if (!property || !property._id) return null;
    if (property.status === "inactive") return null;
    return mapToPropertyDetail(property);
  } catch {
    return null;
  }
}
