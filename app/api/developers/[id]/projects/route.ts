import { NextResponse } from "next/server";
import type { Project, ProjectCategory } from "@/components/data/projects";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveImageUrl(url?: string) {
  if (!url) return "/projects/project.svg";
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function resolveCategory(property: BackendProperty): ProjectCategory {
  const typeHaystack = `${property.type ?? ""} ${property.layoutType ?? ""}`.toLowerCase();
  if (typeHaystack.includes("commercial")) return "Commercial";

  const titleHaystack = `${property.title} ${property.type ?? ""}`.toLowerCase();
  if (/villa|mansion|town\s?house/.test(titleHaystack)) return "Villa";

  return "Residential";
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

function shortPrice(price?: string) {
  if (!price) return "On request";
  const match = price.match(/[\d,.]+/);
  if (!match) return price;

  const value = Number(match[0].replace(/,/g, ""));
  if (!value || Number.isNaN(value)) return price;

  if (value >= 1_000_000) {
    return `${parseFloat((value / 1_000_000).toFixed(2))}M`;
  }
  if (value >= 1_000) {
    return `${parseFloat((value / 1_000).toFixed(0))}K`;
  }
  return String(value);
}

function mapProject(property: BackendProperty): Project {
  const developer = property.developer || "Axis Aura";
  return {
    id: property._id,
    developerId: slugify(developer),
    location: property.location || property.area || "Dubai, UAE",
    developer,
    propertyType: property.type || "Residential",
    category: resolveCategory(property),
    paymentPlan: resolvePaymentPlan(property),
    priceAmount: shortPrice(property.price),
    image: resolveImageUrl(property.images?.[0]),
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const [developerResponse, propertiesResponse] = await Promise.all([
      fetch(`${BACKEND_URL}/api/developers/${id}`, { cache: "no-store" }),
      fetch(`${BACKEND_URL}/api/properties`, { cache: "no-store" }),
    ]);

    const developerName = developerResponse.ok
      ? ((await developerResponse.json()) as { title?: string }).title ?? ""
      : "";

    if (!propertiesResponse.ok) {
      throw new Error("Failed to load properties");
    }

    const properties = (await propertiesResponse.json()) as BackendProperty[];
    const developerSlug = slugify(developerName);

    const projects = properties
      .filter((property) => property.status !== "inactive")
      .filter(
        (property) =>
          developerSlug !== "" && slugify(property.developer || "") === developerSlug,
      )
      .map(mapProject);

    return NextResponse.json({
      developer: { id, name: developerName },
      projects,
    });
  } catch {
    return NextResponse.json(
      { developer: { id, name: "" }, projects: [] },
      { status: 502 },
    );
  }
}
