import { NextResponse } from "next/server";
import type { Property } from "@/components/card/PropertyCard";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

type BackendPaymentEntry = { heading?: string; subText?: string };

type BackendProperty = {
  _id: string;
  title: string;
  area?: string;
  price?: string;
  developer?: string;
  type?: string;
  location?: string;
  layoutType?: string;
  images?: string[];
  paymentPlans?: Record<string, BackendPaymentEntry[]>;
  status?: string;
  createdAt?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveImageUrl(url?: string) {
  if (!url) return "/properties/properties.svg";
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function resolveCategory(property: BackendProperty): "residential" | "commercial" {
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

function resolvePaymentPlan(property: BackendProperty) {
  const groups = property.paymentPlans ? Object.values(property.paymentPlans) : [];
  const entries = groups.find((group) => Array.isArray(group) && group.length > 0);
  if (entries && entries.length >= 2) {
    return `${entries[0].heading} / ${entries[1].heading} Payment Plan`;
  }
  if (entries && entries.length === 1) {
    return `${entries[0].heading} Payment Plan`;
  }
  return "Flexible Payment Plan";
}

function mapProperty(property: BackendProperty): Property {
  const category = resolveCategory(property);
  const subType = resolveSubType(property, category);
  const area = property.area || property.location || "Dubai";
  const developer = property.developer || "Axis Aura";

  return {
    id: property._id,
    title: property.title,
    location: property.location || property.area || "Dubai, UAE",
    developer,
    propertyType: property.type || (category === "commercial" ? "Commercial" : "Residential"),
    category,
    subType,
    areaSlug: slugify(area),
    developerSlug: slugify(developer),
    paymentPlan: resolvePaymentPlan(property),
    price: property.price || "Price on request",
    image: resolveImageUrl(property.images?.[0]),
  };
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/properties`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load properties");
    }

    const properties = (await response.json()) as BackendProperty[];
    const active = properties.filter((property) => property.status !== "inactive");

    return NextResponse.json({ properties: active.map(mapProperty) });
  } catch {
    return NextResponse.json(
      { error: "Unable to load properties right now.", properties: [] },
      { status: 502 },
    );
  }
}
