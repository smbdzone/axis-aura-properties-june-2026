import { apiRequest, apiList } from "@/lib/api/client";

export type ApiComment = {
  _id: string;
  username: string;
  email: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  articleId?: string | null;
  likes?: number;
  replies?: number;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchComments() {
  return (await apiList<ApiComment>("/api/comments")).items;
}

export async function approveComment(id: string) {
  return apiRequest<ApiComment>(`/api/comments/${id}/approve`, {
    method: "PATCH",
  });
}

export async function deleteComment(id: string) {
  return apiRequest<{ message: string }>(`/api/comments/${id}`, {
    method: "DELETE",
  });
}
