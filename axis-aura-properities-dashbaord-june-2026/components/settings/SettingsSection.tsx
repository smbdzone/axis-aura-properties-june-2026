"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <span className="font-[family-name:var(--font-sandena)] text-sm font-medium leading-[18px] text-black/60">
        {label}
      </span>
      <div className="flex h-[46px] w-full items-center rounded-xl border-[1.5px] border-[#669BBC] bg-white px-4">
        <span className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function SettingsSection() {
  const { user } = useAuth();
  const [profileImageError, setProfileImageError] = useState(false);

  const displayName = user?.fullName ?? "Admin";
  const displayEmail = user?.email ?? "";
  const displayPhone = user?.phone ?? "—";
  const displayRole = user?.role ?? "Dashboard User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="mx-auto flex w-full  flex-col gap-8 px-8 py-8">
      <div className="flex w-full flex-col items-center gap-6 rounded-2xl border-[1.5px] border-[#669BBC] p-8">
        <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full border-[1.5px] border-[#669BBC] bg-[#E8F1F6]">
          {user?.profilePicture && !profileImageError ? (
            <Image
              src={user.profilePicture}
              alt={displayName}
              width={120}
              height={120}
              className="h-full w-full object-cover"
              onError={() => setProfileImageError(true)}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-sandena)] text-3xl font-medium text-[#003049]">
              {initials}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="font-[family-name:var(--font-sandena)] text-2xl font-bold leading-[33px] text-[#003049]">
            {displayName}
          </h2>
          <span className="font-[family-name:Helvetica,Arial,sans-serif] text-sm leading-[19px] text-black/60">
            {displayRole}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 rounded-2xl border-[1.5px] border-[#669BBC] p-6">
        <h3 className="font-[family-name:var(--font-sandena)] text-xl font-bold leading-[27px] text-[#003049]">
          Account Details
        </h3>

        <ProfileField label="Full Name" value={displayName} />
        <ProfileField label="Email" value={displayEmail} />
        <ProfileField label="Phone Number" value={displayPhone} />
        <ProfileField label="Role" value={displayRole} />
      </div>
    </section>
  );
}
