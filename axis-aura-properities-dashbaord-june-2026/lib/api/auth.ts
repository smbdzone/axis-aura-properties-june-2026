import { apiRequest, setAuthToken } from "@/lib/api/client";

export type AuthUser = {
  fullName: string;
  email: string;
  role: string;
  profilePicture?: string;
  phone?: string;
};

type LoginResponse = {
  success: boolean;
  token: string;
  role: string;
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser & { permissions?: Record<string, unknown>; status?: string };
};

export async function login(email: string, password: string) {
  const data = await apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.token);
  return data;
}

export async function logout() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } finally {
    setAuthToken(null);
  }
}

export async function fetchCurrentUser() {
  const data = await apiRequest<MeResponse>("/api/auth/me");
  return data.user;
}
