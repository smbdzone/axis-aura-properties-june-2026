import { NextResponse } from "next/server";
import type { LuxuryProperty } from "@/components/data/luxuryProperties";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

type BackendProperty = {
  _id: string;
  title: string;
  type?: string;
  price?: string;
  overview?: string;
  description?: string;
  images?: string[];
  status?: string;
  mostLuxurious?: boolean;
};

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveImageUrl(url?: string) {
  if (!url) return "/extra/pinnacle.svg";
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function mapLuxury(property: BackendProperty): LuxuryProperty {
  const description = stripHtml(property.overview || property.description || "");
  return {
    id: property._id,
    title: property.title,
    propertyType: property.type || "Luxury Residence",
    description:
      description.length > 320 ? `${description.slice(0, 317)}...` : description,
    rating: 5.0,
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
    const luxury = properties.filter(
      (property) => property.mostLuxurious && property.status !== "inactive",
    );

    return NextResponse.json({ properties: luxury.map(mapLuxury) });
  } catch {
    return NextResponse.json(
      { error: "Unable to load luxury properties right now.", properties: [] },
      { status: 502 },
    );
  }
}
