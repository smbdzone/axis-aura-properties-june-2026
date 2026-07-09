import { NextResponse } from "next/server";
import type { DeveloperCardData } from "@/components/data/developers";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

type BackendDeveloper = {
  _id: string;
  title: string;
  description?: string;
  logoUrl?: string;
  numberOfProjects?: number;
  projectsHandedOver?: number;
};

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveLogoUrl(url?: string) {
  if (!url) return "/Logo.svg";
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function mapDeveloper(developer: BackendDeveloper): DeveloperCardData {
  return {
    id: developer._id,
    name: developer.title,
    description: stripHtml(developer.description || ""),
    logo: resolveLogoUrl(developer.logoUrl),
    logoWidth: 291,
    logoHeight: 108,
    projects: `${developer.numberOfProjects ?? 0} Projects`,
    handedOver: `${developer.projectsHandedOver ?? 0} Projects Handed Over`,
  };
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/developers`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load developers");
    }

    const developers = (await response.json()) as BackendDeveloper[];
    return NextResponse.json({ developers: developers.map(mapDeveloper) });
  } catch {
    return NextResponse.json(
      { error: "Unable to load developers right now.", developers: [] },
      { status: 502 },
    );
  }
}
