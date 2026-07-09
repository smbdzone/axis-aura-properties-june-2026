import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

type BackendDiscover = {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  order?: number;
};

export type DiscoverVideo = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
};

function resolveUrl(url?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function mapItem(item: BackendDiscover): DiscoverVideo {
  return {
    id: item._id,
    title: item.title,
    description: item.description ?? "",
    videoUrl: resolveUrl(item.videoUrl),
    thumbnailUrl: resolveUrl(item.thumbnailUrl),
  };
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/discover`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load discover videos");
    }

    const items = (await response.json()) as BackendDiscover[];
    return NextResponse.json({ items: items.map(mapItem) });
  } catch {
    return NextResponse.json(
      { error: "Unable to load discover videos right now.", items: [] },
      { status: 502 },
    );
  }
}
