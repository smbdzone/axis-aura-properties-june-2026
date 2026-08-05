"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import type { PermissionKey, PermissionLevel } from "@/lib/permissions";

/**
 * Renders children only when the signed-in user holds the permission.
 *
 * Presentation only — the API enforces the same rule on every request, so a
 * user who bypasses this still gets a 403.
 */
export default function PermissionGate({
  permission,
  level = "view",
  superAdminOnly = false,
  fallback = null,
  children,
}: {
  permission?: PermissionKey;
  level?: PermissionLevel;
  superAdminOnly?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { can, isSuperAdmin, loading } = useAuth();

  // Don't flash controls before the profile resolves.
  if (loading) return <>{fallback}</>;

  if (superAdminOnly) {
    return <>{isSuperAdmin ? children : fallback}</>;
  }

  if (permission && !can(permission, level)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
