import { apiRequest, apiList } from "@/lib/api/client";

export type ApiContact = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  date?: string;
  createdAt?: string;
};

export async function fetchContacts() {
  return (await apiList<ApiContact>("/api/contacts")).items;
}

export async function deleteContact(id: string) {
  return apiRequest<{ message: string }>(`/api/contacts/${id}`, {
    method: "DELETE",
  });
}

export async function bulkDeleteContacts(ids: string[]) {
  return apiRequest<{ message: string }>("/api/contacts/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}
