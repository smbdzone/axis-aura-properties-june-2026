import { apiRequest } from "@/lib/api/client";
import { normalizePermissions, type PermissionMap } from "@/lib/permissions";

export type AuthUser = {
  fullName: string;
  email: string;
  role: string;
  profilePicture?: string;
  phone?: string;
  permissions?: PermissionMap;
};

type LoginResponse = {
  success: boolean;
  role: string;
  user: AuthUser;
};

type MeResponse = {
  user: Omit<AuthUser, "permissions"> & {
    permissions?: Record<string, unknown>;
    status?: string;
  };
};

export async function login(email: string, password: string) {
  // The session cookie is set by the API response; nothing is stored client-side.
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  await apiRequest("/api/auth/logout", { method: "POST" });
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const data = await apiRequest<MeResponse>("/api/auth/me");
  return { ...data.user, permissions: normalizePermissions(data.user.permissions) };
}
