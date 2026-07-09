"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getDashboardPageTitle } from "@/components/data/dashboardNav";

export default function Navbar() {
  const pathname = usePathname();
  const pageTitle = getDashboardPageTitle(pathname);
  const [profileImageError, setProfileImageError] = useState(false);
  const { user } = useAuth();

  const displayName = user?.fullName ?? "Admin";
  const displayRole = user?.role ?? "Dashboard User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-[70px] shrink-0 flex-col items-start justify-center gap-2.5 self-stretch border-b-[1.5px] border-[#669BBC] px-8 py-2.5">
      <div className="flex w-full items-center justify-between gap-6">
        <h1 className="flex flex-1 items-center font-[family-name:var(--font-sandena)] text-[32px] font-bold leading-[44px] text-[#003049]">
          {pageTitle}
        </h1>

        <div className="flex shrink-0 items-center gap-6">
          <Link
            href="/notifications"
            className="relative flex h-[26px] w-[26px] items-center justify-center rounded-[10.5px]"
            aria-label="Notifications"
          >
            <Icon icon="mdi:bell" width={26} height={26} color="#333333" />
            <span
              className="absolute right-0 top-0 h-[8px] w-[8px] rounded-full border-[0.5px] border-[#669BBC] bg-[#003049]"
              aria-hidden="true"
            />
          </Link>

          <span
            className="h-[18.5px] w-0 border-l-2 border-[#669BBC]"
            aria-hidden="true"
          />

          <Link
            href="/settings"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            aria-label="Open settings"
          >
            <div className="relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full border-[1.5px] border-[#669BBC] bg-[#E8F1F6]">
              {user?.profilePicture && !profileImageError ? (
                <Image
                  src={user.profilePicture}
                  alt={displayName}
                  width={50}
                  height={50}
                  className="h-full w-full object-cover"
                  onError={() => setProfileImageError(true)}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
                  {initials}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-[3px]">
              <span className="font-[family-name:var(--font-sandena)] text-xs font-medium leading-4 text-[#003049]">
                {displayName}
              </span>
              <span className="font-[family-name:Helvetica,Arial,sans-serif] text-[11px] leading-[15px] text-black/60">
                {displayRole}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
