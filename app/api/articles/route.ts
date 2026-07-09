import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

type BackendArticle = {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  status?: string;
  bannerUrl?: string;
  description?: string;
  seoImageUrl?: string;
  createdAt?: string;
};

const FALLBACK_IMAGES = [
  "/blogs/blog3.svg",
  "/blogs/blog2.svg",
  "/blogs/blog4.svg",
];

const CATEGORY_CYCLE = ["buyer", "seller", "investor"] as const;

function resolveUrl(url?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs)) return "";

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function htmlToText(html?: string) {
  if (!html) return "";
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function makeExcerpt(description?: string) {
  const text = htmlToText(description).replace(/\s+/g, " ").trim();
  if (text.length <= 220) return text;
  return `${text.slice(0, 220).trimEnd()}...`;
}

// Article content is authored by Super Admins only, but we still strip anything
// executable/unsafe before rendering it as HTML on the public site.
function sanitizeHtml(html?: string) {
  if (!html) return "";
  return html
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*\/?\s*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*"\s*javascript:[^"]*"/gi, '$1="#"')
    .replace(/(href|src)\s*=\s*'\s*javascript:[^']*'/gi, "$1='#'")
    .trim();
}

function mapArticle(article: BackendArticle, index: number) {
  const category = article.category ?? "News";
  const image =
    resolveUrl(article.bannerUrl) ||
    resolveUrl(article.seoImageUrl) ||
    FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return {
    id: article._id,
    category: CATEGORY_CYCLE[index % CATEGORY_CYCLE.length],
    categoryLabel: `${category}:`,
    title: article.title,
    timeAgo: timeAgo(article.createdAt),
    excerpt: makeExcerpt(article.description),
    image,
    imagePosition: index % 2 === 0 ? "left" : "right",
    categoryMeta: category,
    article: {
      overview: {
        heading: "Overview",
        bodyHtml: sanitizeHtml(article.description),
      },
      pros: { heading: "" },
      cons: { heading: "" },
      takeaway: { heading: "" },
    },
  };
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/articles`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load articles");
    }

    const articles = (await response.json()) as BackendArticle[];
    const posts = articles
      .filter((article) => article.status !== "inactive")
      .map(mapArticle);

    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json(
      { error: "Unable to load articles right now.", posts: [] },
      { status: 502 },
    );
  }
}
