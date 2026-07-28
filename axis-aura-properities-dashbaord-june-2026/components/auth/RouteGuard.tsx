"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getRouteAccess, getRouteLevel } from "@/lib/permissions";

function AccessDenied({ detail }: { detail: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-sans text-2xl font-semibold text-primary">
        You don&apos;t have access to this page
      </h1>
      <p className="max-w-md font-sans text-base text-[#555555]">{detail}</p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-primary px-5 py-2 font-sans text-base font-medium text-white transition-opacity hover:opacity-90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

/**
 * Blocks a page the user can't access, so they get a clear message instead of a
 * screen full of failed requests. The API is still the enforcement point.
 */
export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, can, isSuperAdmin } = useAuth();

  // While the profile loads, or when signed out (middleware handles the
  // redirect), render normally rather than flashing a denial.
  if (loading || !user) return <>{children}</>;

  const access = getRouteAccess(pathname);

  if (access.kind === "superAdmin" && !isSuperAdmin) {
    return <AccessDenied detail="This section is restricted to Super Admin accounts." />;
  }

  if (access.kind === "permission") {
    const level = getRouteLevel(pathname);
    if (!can(access.permission, level)) {
      return (
        <AccessDenied
          detail={`Your account doesn't have ${level} permission for this section. Ask a Super Admin to update your access in Settings.`}
        />
      );
    }
  }

  return <>{children}</>;
}
