import { apiRequest } from "@/lib/api/client";

export type ApiJobApplication = {
  _id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  position: string;
  experience?: string;
  coverLetter?: string;
  resume?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchApplications() {
  return apiRequest<ApiJobApplication[]>("/api/jobApplication");
}

export async function deleteApplication(id: string) {
  return apiRequest<{ message: string }>(`/api/jobApplication/${id}`, {
    method: "DELETE",
  });
}

export async function bulkDeleteApplications(ids: string[]) {
  return apiRequest<{ message: string }>("/api/jobApplication/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}
