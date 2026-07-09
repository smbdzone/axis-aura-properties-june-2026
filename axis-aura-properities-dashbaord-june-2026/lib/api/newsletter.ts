import { apiRequest } from "@/lib/api/client";

export type ApiNewsletterSubscriber = {
  id: string;
  email: string;
  date: string;
};

export async function fetchNewsletterSubscribers() {
  return apiRequest<ApiNewsletterSubscriber[]>("/api/newsletter");
}

export async function deleteNewsletterSubscriber(id: string) {
  return apiRequest<{ message: string }>(`/api/newsletter/${id}`, {
    method: "DELETE",
  });
}

export async function bulkDeleteNewsletterSubscribers(ids: string[]) {
  return apiRequest<{ message: string }>("/api/newsletter/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}
