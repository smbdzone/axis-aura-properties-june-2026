import { apiFormRequest, apiRequest } from "@/lib/api/client";

export type ApiDeveloper = {
  _id: string;
  title: string;
  description: string;
  logoUrl: string;
  numberOfProjects?: number;
  projectsHandedOver?: number;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchDevelopers() {
  return apiRequest<ApiDeveloper[]>("/api/developers");
}

export async function fetchDeveloperById(id: string) {
  return apiRequest<ApiDeveloper>(`/api/developers/${id}`);
}

export async function createDeveloper(formData: FormData) {
  return apiFormRequest<ApiDeveloper>("/api/developers", formData, "POST");
}

export async function updateDeveloper(id: string, formData: FormData) {
  return apiFormRequest<ApiDeveloper>(`/api/developers/${id}`, formData, "PUT");
}

export async function deleteDeveloper(id: string) {
  return apiRequest<{ message: string }>(`/api/developers/${id}`, {
    method: "DELETE",
  });
}
