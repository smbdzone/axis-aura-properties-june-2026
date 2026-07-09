import { apiRequest } from "@/lib/api/client";

export type ApiEnquiry = {
  _id: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email: string;
  budget: string;
  type: string;
  date?: string;
  createdAt?: string;
};

export async function fetchEnquiries() {
  return apiRequest<ApiEnquiry[]>("/api/enquiries");
}

export async function deleteEnquiry(id: string) {
  return apiRequest<{ message: string }>(`/api/enquiries/${id}`, {
    method: "DELETE",
  });
}

export async function bulkDeleteEnquiries(ids: string[]) {
  return apiRequest<{ message: string }>("/api/enquiries/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}
