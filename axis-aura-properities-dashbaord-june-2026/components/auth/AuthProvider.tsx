"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  type AuthUser,
} from "@/lib/api/auth";
import {
  hasPermission,
  SUPER_ADMIN_ROLE,
  type PermissionKey,
  type PermissionLevel,
} from "@/lib/permissions";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isSuperAdmin: boolean;
  /** Mirrors the API guard — use it to hide controls that would 403. */
  can: (key: PermissionKey, level?: PermissionLevel) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await fetchCurrentUser();
      setUser(profile);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      await loginRequest(email, password);
      // Re-read the profile so permissions are present; the login response
      // deliberately carries no token and no matrix.
      await refreshUser();
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    router.push("/login");
  }, [router]);

  const can = useCallback(
    (key: PermissionKey, level: PermissionLevel = "view") =>
      hasPermission(user?.role, user?.permissions, key, level),
    [user],
  );

  const isSuperAdmin = user?.role === SUPER_ADMIN_ROLE;

  const value = useMemo(
    () => ({ user, loading, isSuperAdmin, can, login, logout, refreshUser }),
    [user, loading, isSuperAdmin, can, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
