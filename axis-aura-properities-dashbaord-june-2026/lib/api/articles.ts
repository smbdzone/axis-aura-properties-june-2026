import { apiFormRequest, apiRequest, apiList } from "@/lib/api/client";

export type ApiArticle = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  status?: "active" | "inactive";
  canonicalUrl?: string;
  bannerUrl?: string;
  description: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImageUrl?: string;
  articleSchemas?: unknown[];
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchArticles() {
  return (await apiList<ApiArticle>("/api/articles")).items;
}

export async function fetchArticleById(id: string) {
  return apiRequest<ApiArticle>(`/api/articles/${id}`);
}

export async function createArticle(formData: FormData) {
  return apiFormRequest<ApiArticle>("/api/articles", formData, "POST");
}

export async function updateArticle(id: string, formData: FormData) {
  return apiFormRequest<ApiArticle>(`/api/articles/${id}`, formData, "PUT");
}

export async function deleteArticle(id: string) {
  return apiRequest<{ message: string }>(`/api/articles/${id}`, {
    method: "DELETE",
  });
}

export async function bulkDeleteArticles(ids: string[]) {
  return apiRequest<{ message: string }>("/api/articles/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}
