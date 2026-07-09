import type { ApiArticle } from "@/lib/api/articles";
import type { ApiDeveloper } from "@/lib/api/developers";
import type { ApiJob } from "@/lib/api/jobs";
import type { ApiProperty } from "@/lib/api/properties";
import type { CareerItem } from "@/components/data/careersAdmin";
import type { DeveloperItem } from "@/components/data/developersAdmin";
import type { NewsRegulationItem } from "@/components/data/newsRegulationsAdmin";
import type { PropertyRow } from "@/components/data/propertyData";
import { getApiBaseUrl } from "@/lib/api/client";

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function resolveAssetUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${getApiBaseUrl()}${url.startsWith("/") ? url : `/${url}`}`;
}

export function mapJobToCareerItem(job: ApiJob): CareerItem {
  const offering =
    job.remunerationType === "commission"
      ? job.commission || "Commission"
      : job.salary || "Salary";

  return {
    id: job._id,
    jobTitle: job.title,
    jobDescription: stripHtml(job.description),
    offering,
  };
}

export function mapDeveloperToItem(developer: ApiDeveloper): DeveloperItem {
  const logoLabel = developer.title.slice(0, 8).toUpperCase();
  return {
    id: developer._id,
    title: developer.title,
    propertyCount: developer.numberOfProjects ?? 0,
    logoLabel,
    logoUrl: resolveAssetUrl(developer.logoUrl),
  };
}

export function mapArticleToNewsItem(article: ApiArticle, index: number): NewsRegulationItem {
  return {
    id: article._id,
    title: article.title,
    publishedAt: formatDate(article.createdAt),
    thumbnailLabel: `NEWS ${String(index + 1).padStart(2, "0")}`,
    bannerUrl: resolveAssetUrl(article.bannerUrl),
  };
}

export function mapPropertyToRow(property: ApiProperty): PropertyRow {
  return {
    id: property._id,
    name: property.title,
    type: property.type || "—",
    area: property.area || "—",
    developer: property.developer || "—",
    startingPrice: property.price || "—",
  };
}
