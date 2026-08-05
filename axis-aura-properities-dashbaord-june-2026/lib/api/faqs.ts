import { apiRequest, apiList } from "@/lib/api/client";

export type ApiFaq = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FaqPayload = {
  question: string;
  answer: string;
  category?: string;
};

export async function fetchFaqs() {
  return (await apiList<ApiFaq>("/api/faqs")).items;
}

export async function createFaq(payload: FaqPayload) {
  return apiRequest<ApiFaq>("/api/faqs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateFaq(id: string, payload: FaqPayload) {
  return apiRequest<ApiFaq>(`/api/faqs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteFaq(id: string) {
  return apiRequest<{ message: string }>(`/api/faqs/${id}`, {
    method: "DELETE",
  });
}
