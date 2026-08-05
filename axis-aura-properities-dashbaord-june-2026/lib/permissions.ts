/**
 * Mirrors the API's permission matrix (see backend `requirePermission`).
 *
 * This drives what the UI shows. It is NOT the security boundary — the API
 * re-checks every request against the database — but it keeps users from being
 * shown controls that would only return 403.
 */

export const PERMISSION_KEYS = [
  "dashboard",
  "properties",
  "newsAndRegulations",
  "developers",
  "careers",
  "jobApplications",
  "comments",
  "faqs",
  "manageUsers",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];
export type PermissionLevel = "view" | "edit";
export type Access = { view: boolean; edit: boolean };
export type PermissionMap = Partial<Record<PermissionKey, Access>>;

export const SUPER_ADMIN_ROLE = "Super Admin";

/** Normalizes whatever the API returned into a strict boolean map. */
export function normalizePermissions(input: unknown): PermissionMap {
  const result: PermissionMap = {};
  if (!input || typeof input !== "object") return result;

  const source = input as Record<string, unknown>;
  for (const key of PERMISSION_KEYS) {
    const access = source[key];
    if (access && typeof access === "object") {
      const { view, edit } = access as { view?: unknown; edit?: unknown };
      result[key] = { view: view === true, edit: edit === true };
    }
  }
  return result;
}

/** Super Admin passes everything; everyone else needs the explicit flag. */
export function hasPermission(
  role: string | undefined,
  permissions: PermissionMap | undefined,
  key: PermissionKey,
  level: PermissionLevel = "view",
): boolean {
  if (role === SUPER_ADMIN_ROLE) return true;
  return permissions?.[key]?.[level] === true;
}

/**
 * Maps a dashboard route to the permission that gates it. Routes with no entry
 * are Super-Admin-only on the API side, so they're gated by role instead.
 */
const ROUTE_PERMISSIONS: { prefix: string; permission: PermissionKey }[] = [
  { prefix: "/properties", permission: "properties" },
  { prefix: "/news-and-regulations", permission: "newsAndRegulations" },
  { prefix: "/developers", permission: "developers" },
  { prefix: "/careers", permission: "careers" },
  { prefix: "/client-manager/jobs-list", permission: "jobApplications" },
  { prefix: "/client-manager/comments", permission: "comments" },
  { prefix: "/content-management/faqs", permission: "faqs" },
  { prefix: "/faqs", permission: "faqs" },
];

/** Routes the API restricts to Super Admin because they have no matrix key. */
const SUPER_ADMIN_ROUTES = [
  "/client-manager/enquire",
  "/client-manager/newsletter",
  "/client-manager/contacts",
  "/content-management/privacy-policy",
  "/content-management/terms-and-conditions",
  "/discover",
  "/notifications",
  "/settings",
];

export type RouteAccess =
  | { kind: "permission"; permission: PermissionKey }
  | { kind: "superAdmin" }
  | { kind: "open" };

export function getRouteAccess(pathname: string): RouteAccess {
  if (pathname === "/") return { kind: "permission", permission: "dashboard" };

  const superAdminMatch = SUPER_ADMIN_ROUTES.find(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  if (superAdminMatch) return { kind: "superAdmin" };

  // Longest prefix wins so /client-manager/comments beats a shorter match.
  const match = [...ROUTE_PERMISSIONS]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  return match ? { kind: "permission", permission: match.permission } : { kind: "open" };
}

/** Add/edit routes require `edit`; everything else only needs `view`. */
export function getRouteLevel(pathname: string): PermissionLevel {
  return /\/(add|edit)(\/|$)/.test(pathname) ? "edit" : "view";
}
