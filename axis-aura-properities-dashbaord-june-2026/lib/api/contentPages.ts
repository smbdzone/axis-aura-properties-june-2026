import { apiRequest } from "@/lib/api/client";

export type ContentPageSlug = "privacy-policy" | "terms-and-conditions";

export type ContentPageSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ContentPageHero = {
  title: string;
  image: string;
  imageAlt: string;
};

export type ApiContentPage = {
  _id: string;
  slug: ContentPageSlug;
  introText: string;
  hero: ContentPageHero;
  sections: ContentPageSection[];
  createdAt?: string;
  updatedAt?: string;
};

export type ContentPagePayload = {
  introText?: string;
  hero?: ContentPageHero;
  sections: ContentPageSection[];
};

export async function fetchContentPage(slug: ContentPageSlug) {
  return apiRequest<ApiContentPage>(`/api/content-pages/${slug}`);
}

export async function updateContentPage(slug: ContentPageSlug, payload: ContentPagePayload) {
  return apiRequest<ApiContentPage>(`/api/content-pages/${slug}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
