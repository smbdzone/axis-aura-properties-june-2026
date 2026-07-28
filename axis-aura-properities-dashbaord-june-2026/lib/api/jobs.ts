import { apiRequest, apiFormRequest, apiList } from "@/lib/api/client";

export type JobLevel = "Entry" | "Mid Level" | "Senior" | "Expert";

export type SalaryPeriod = "day" | "month" | "annual";

export type ApiJob = {
  _id: string;
  title: string;
  description: string;
  remunerationType: "commission" | "salary";
  commission?: string;
  salary?: string;
  salaryPeriod?: SalaryPeriod;
  level?: JobLevel;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchJobs() {
  return (await apiList<ApiJob>("/api/jobs")).items;
}

export async function fetchJobById(id: string) {
  return apiRequest<ApiJob>(`/api/jobs/${id}`);
}

export async function createJob(formData: FormData) {
  return apiFormRequest<ApiJob>("/api/jobs", formData, "POST");
}

export async function updateJob(id: string, formData: FormData) {
  return apiFormRequest<ApiJob>(`/api/jobs/${id}`, formData, "PUT");
}

export async function deleteJob(id: string) {
  return apiRequest<{ message: string }>(`/api/jobs/${id}`, {
    method: "DELETE",
  });
}
