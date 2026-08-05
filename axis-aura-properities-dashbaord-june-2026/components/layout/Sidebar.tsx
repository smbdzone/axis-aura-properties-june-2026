"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { useAuth } from "@/components/auth/AuthProvider";
import { useMemo } from "react";
import {
  dashboardBottomNavItems,
  dashboardMainNavItems,
  filterNavItems,
  isDashboardNavActive,
  isDashboardNavSubItemActive,
  type DashboardNavItem,
  type DashboardNavSubItem,
} from "@/components/data/dashboardNav";

function ActiveBlurBackground() {
  return (
    <>
      <span
        className="pointer-events-none absolute -left-[75px] -top-[105px] h-[267px] w-[41px] rotate-[-150deg] bg-[rgba(102,155,188,0.5)] blur-[23px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute left-[65px] -top-[182px] h-[353px] w-[36px] rotate-[-150deg] bg-[rgba(102,155,188,0.5)] blur-[23px]"
        aria-hidden="true"
      />
    </>
  );
}

function SubmenuBlurBackground() {
  return (
    <>
      <span
        className="pointer-events-none absolute -left-[211px] -top-[202px] h-[757px] w-[78px] rotate-[29.59deg] bg-[rgba(102,155,188,0.5)] blur-[50px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute left-[147px] top-[81px] h-[573px] w-[88px] rotate-[29.96deg] bg-[rgba(102,155,188,0.5)] blur-[50px]"
        aria-hidden="true"
      />
    </>
  );
}

function PropertyDetailIcon() {
  return (
    <span className="relative inline-flex size-[18px] shrink-0 text-primary group-hover:text-white">
      <Icon icon="lsicon:house-filled" width={18} height={18} color="currentColor" />
      <span
        className="absolute -right-0.5 -top-0.5 size-1.5 rounded-sm bg-primary group-hover:bg-white"
        aria-hidden="true"
      />
    </span>
  );
}

function SidebarSubNavItem({
  subItem,
  active,
  isPropertyDetail,
}: {
  subItem: DashboardNavSubItem;
  active: boolean;
  isPropertyDetail: boolean;
}) {
  const itemClassName = isPropertyDetail
    ? "bg-white text-primary"
    : active
      ? "bg-white text-primary"
      : "text-white";

  return (
    <Link
      href={subItem.href}
      className={`group flex h-[29px] w-full cursor-pointer items-center gap-2 rounded-lg border-b border-accent-light px-3 py-1 transition-colors duration-300 hover:bg-primary hover:text-white ${itemClassName}`}
    >
      {isPropertyDetail ? (
        <PropertyDetailIcon />
      ) : (
        <span
          className={`transition-colors ${active ? "text-primary group-hover:text-white" : "text-white"
            }`}
        >
          <Icon icon={subItem.icon} width={18} height={18} color="currentColor" />
        </span>
      )}

      <span
        className={`h-[11px] w-0 border-l-2 transition-colors ${isPropertyDetail || active
            ? "border-primary group-hover:border-white"
            : "border-accent-light group-hover:border-white"
          }`}
        aria-hidden="true"
      />

      <span className="font-sans text-base font-medium leading-[21px]">
        {subItem.label}
      </span>
    </Link>
  );
}

function SidebarNavDropdown({
  item,
  pathname,
}: {
  item: DashboardNavItem;
  pathname: string;
}) {
  const isParentActive = isDashboardNavActive(pathname, item.href);
  const [open, setOpen] = useState(isParentActive);

  useEffect(() => {
    if (isParentActive) setOpen(true);
  }, [isParentActive]);

  const subItems = item.subItems ?? [];
  const propertyDetailItem = subItems.find((subItem) => subItem.href === "/properties");
  const otherSubItems = subItems.filter((subItem) => subItem.href !== "/properties");
  const showActiveHeader = isParentActive || open;

  return (
    <div className="flex w-full flex-col items-center gap-0.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`group relative isolate flex h-[47px] w-full cursor-pointer items-center overflow-hidden rounded-xl px-4 py-2 transition-colors duration-300 ${showActiveHeader
            ? "border-[1.5px] border-accent-light bg-primary text-white"
            : "bg-transparent text-primary hover:border-[1.5px] hover:border-accent-light hover:bg-primary hover:text-white"
          }`}
      >
        <span
          className={`transition-opacity duration-300 ${showActiveHeader ? "opacity-100" : "hidden"}`}
          aria-hidden={!showActiveHeader}
        >
          <ActiveBlurBackground />
        </span>

        <span className="relative z-[1] flex items-center">
          <Icon icon={item.icon} width={18} height={18} color="currentColor" />

          <span
            className="mx-[8.5px] h-[11px] w-0 border-l-2 border-accent-light"
            aria-hidden="true"
          />

          <span className="flex items-center gap-1 whitespace-nowrap font-sans text-2xl font-medium leading-[31px]">
            {item.label}
            <IoChevronDown
              size={16}
              className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              color="currentColor"
              aria-hidden
            />
          </span>
        </span>
      </button>

      {open && (
        <div className="relative isolate w-full overflow-hidden rounded-xl border-[1.5px] border-accent-light p-2.5">
          <span className="absolute inset-0 bg-primary" aria-hidden="true" />
          <SubmenuBlurBackground />

          <div className="relative z-[1] flex flex-col gap-1">
            {propertyDetailItem && (
              <SidebarSubNavItem
                subItem={propertyDetailItem}
                active={isDashboardNavSubItemActive(pathname, propertyDetailItem.href)}
                isPropertyDetail
              />
            )}

            <div className="flex max-h-[148px] flex-col gap-1 overflow-y-auto pr-1 [scrollbar-color:#669BBC_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent-light [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
              {otherSubItems.map((subItem) => (
                <SidebarSubNavItem
                  key={subItem.label}
                  subItem={subItem}
                  active={isDashboardNavSubItemActive(pathname, subItem.href)}
                  isPropertyDetail={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarNavItem({
  item,
  active,
}: {
  item: DashboardNavItem;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`group relative isolate flex h-[47px] w-full max-w-full cursor-pointer items-center rounded-xl px-4 py-2 transition-colors duration-300 ${active
          ? "border-[1.5px] border-[#669BBC] bg-[#003049] text-white"
          : "bg-transparent text-primary hover:border-[1.5px] hover:border-accent-light hover:bg-primary hover:text-white"
        }`}
    >
      <span
        className={`transition-opacity duration-300 ${active ? "opacity-100" : "hidden"}`}
        aria-hidden={!active}
      >
        <ActiveBlurBackground />
      </span>

      <span
        className={`relative z-[1] flex items-center gap-0 ${active
            ? "text-white"
            : item.mutedIcon
              ? "text-[#333333] group-hover:text-white"
              : "text-primary group-hover:text-white"
          }`}
      >
        <Icon icon={item.icon} width={18} height={18} color="currentColor" />

        <span
          className="mx-[8.5px] h-[11px] w-0 border-l-2 border-[#669BBC]"
          aria-hidden="true"
        />

        <span className="flex items-center gap-1 whitespace-nowrap font-[family-name:var(--font-sandena)] text-2xl font-medium leading-[31px]">
          {item.label}
          {item.hasChevron && (
            <IoChevronDown
              size={16}
              className="shrink-0"
              color="currentColor"
              aria-hidden
            />
          )}
        </span>
      </span>
    </Link>
  );
}

function SidebarLogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className="group relative isolate flex h-[47px] w-full max-w-full cursor-pointer items-center rounded-xl bg-transparent px-4 py-2 text-primary transition-colors duration-300 hover:border-[1.5px] hover:border-accent-light hover:bg-primary hover:text-white"
    >
      <span className="relative z-[1] flex items-center text-primary group-hover:text-white">
        <Icon icon="mdi:logout" width={18} height={18} color="currentColor" />

        <span
          className="mx-[8.5px] h-[11px] w-0 border-l-2 border-[#669BBC]"
          aria-hidden="true"
        />

        <span className="flex items-center gap-1 whitespace-nowrap font-[family-name:var(--font-sandena)] text-2xl font-medium leading-[31px]">
          Logout
        </span>
      </span>
    </button>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, can, isSuperAdmin, loading } = useAuth();

  // Hide destinations the user can't open. While the profile is still loading
  // show nothing rather than the full menu, so items don't disappear on load.
  const mainNavItems = useMemo(
    () => (loading ? [] : filterNavItems(dashboardMainNavItems, { can, isSuperAdmin })),
    [loading, can, isSuperAdmin],
  );
  const bottomNavItems = useMemo(
    () => (loading ? [] : filterNavItems(dashboardBottomNavItems, { can, isSuperAdmin })),
    [loading, can, isSuperAdmin],
  );

  return (
    <aside className="flex min-h-screen w-[352px] shrink-0 flex-col items-center justify-between border-r-[1.5px] border-[#669BBC] bg-white px-8 py-8">
      <div className="mx-auto flex w-[288px] flex-col items-center gap-4">
        <Link
          href="/"
          className="relative isolate flex h-[150px] w-[288px] items-center justify-center overflow-hidden rounded-3xl bg-primary"
        >
          <span
            className="pointer-events-none absolute h-[545px] w-[56px] -left-[97px] -top-[50px] rotate-[29.59deg] bg-[rgba(102,155,188,0.5)] blur-[50px]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute left-[106px] top-[58px] h-[412px] w-[64px] rotate-[29.96deg] bg-[rgba(102,155,188,0.5)] blur-[50px]"
            aria-hidden="true"
          />
          <Image
            src="/Logo.svg"
            alt="Suits & Sand Real Estate"
            width={230}
            height={230}
            priority
            className="relative z-10 h-[230px] w-[230px] object-contain"
          />
        </Link>

        <nav
          aria-label="Dashboard navigation"
          className="flex w-full flex-col items-start gap-3"
        >
          {mainNavItems.map((item) =>
            item.subItems ? (
              <SidebarNavDropdown
                key={item.label}
                item={item}
                pathname={pathname}
              />
            ) : (
              <SidebarNavItem
                key={item.label}
                item={item}
                active={isDashboardNavActive(pathname, item.href)}
              />
            ),
          )}
        </nav>
      </div>

      <nav
        aria-label="Account navigation"
        className="mx-auto flex w-[288px] flex-col items-start gap-3"
      >
        {bottomNavItems.map((item) => (
          <SidebarNavItem
            key={item.label}
            item={item}
            active={isDashboardNavActive(pathname, item.href)}
          />
        ))}

        <SidebarLogoutButton onLogout={() => void logout()} />
      </nav>
    </aside>
  );
}
