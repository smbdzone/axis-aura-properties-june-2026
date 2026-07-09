import { apiFormRequest, apiRequest } from "@/lib/api/client";

export type ApiDiscover = {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchDiscoverItems() {
  return apiRequest<ApiDiscover[]>("/api/discover");
}

export async function fetchDiscoverById(id: string) {
  return apiRequest<ApiDiscover>(`/api/discover/${id}`);
}

export async function createDiscover(formData: FormData) {
  return apiFormRequest<ApiDiscover>("/api/discover", formData, "POST");
}

export async function updateDiscover(id: string, formData: FormData) {
  return apiFormRequest<ApiDiscover>(`/api/discover/${id}`, formData, "PUT");
}

export async function deleteDiscover(id: string) {
  return apiRequest<{ message: string }>(`/api/discover/${id}`, {
    method: "DELETE",
  });
}
