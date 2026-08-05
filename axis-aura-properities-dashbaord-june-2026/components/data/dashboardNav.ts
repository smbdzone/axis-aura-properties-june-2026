import type { PermissionKey } from "@/lib/permissions";

/**
 * `permission` / `superAdminOnly` mirror what the API enforces for each area,
 * so the sidebar only shows destinations the user can actually open.
 */
export type DashboardNavSubItem = {
  label: string;
  href: string;
  icon: string;
  permission?: PermissionKey;
  superAdminOnly?: boolean;
};

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: string;
  hasChevron?: boolean;
  mutedIcon?: boolean;
  permission?: PermissionKey;
  superAdminOnly?: boolean;
  subItems?: DashboardNavSubItem[];
};

export const propertyFormSections = [
  { id: "property-details", label: "Property Details", defaultOpen: true },
  { id: "specification", label: "Specification", defaultOpen: false },
  { id: "layout", label: "Layout", defaultOpen: false },
  { id: "payment-plan", label: "Payment Plan", defaultOpen: false },
  { id: "faq", label: "FAQ", defaultOpen: false },
  { id: "seo", label: "SEO Field", defaultOpen: false },
] as const;

export type PropertyFormSectionId = (typeof propertyFormSections)[number]["id"];

export const dashboardMainNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/", icon: "ri:dashboard-fill", permission: "dashboard" },
  {
    label: "Properties",
    href: "/properties",
    icon: "lsicon:house-filled",
    permission: "properties",
  },
  {
    label: "News & Regulations",
    href: "/news-and-regulations",
    icon: "fluent:news-16-filled",
    permission: "newsAndRegulations",
  },
  {
    label: "Client Manager",
    href: "/client-manager",
    icon: "ion:people",
    hasChevron: true,
    subItems: [
      {
        label: "Enquiries",
        href: "/client-manager/enquire",
        icon: "ic:round-task",
        superAdminOnly: true,
      },
      {
        label: "Newsletters",
        href: "/client-manager/newsletter",
        icon: "mdi:email-newsletter",
        superAdminOnly: true,
      },
      {
        label: "Jobs List",
        href: "/client-manager/jobs-list",
        icon: "majesticons:suitcase",
        permission: "jobApplications",
      },
      {
        label: "Contact Us",
        href: "/client-manager/contacts",
        icon: "mdi:message-text",
        superAdminOnly: true,
      },
      {
        label: "Comments",
        href: "/client-manager/comments",
        icon: "mdi:comment-multiple",
        permission: "comments",
      },
    ],
  },
  {
    label: "Developers",
    href: "/developers",
    icon: "mingcute:building-6-fill",
    permission: "developers",
  },
  {
    label: "Careers",
    href: "/careers",
    icon: "majesticons:suitcase",
    permission: "careers",
  },
  {
    label: "Content",
    href: "/content-management",
    icon: "mdi:file-document-edit-outline",
    hasChevron: true,
    subItems: [
      {
        label: "FAQs",
        href: "/content-management/faqs",
        icon: "mdi:frequently-asked-questions",
        permission: "faqs",
      },
      {
        label: "Privacy Policy",
        href: "/content-management/privacy-policy",
        icon: "mdi:shield-lock-outline",
        superAdminOnly: true,
      },
      {
        label: "Terms & Conditions",
        href: "/content-management/terms-and-conditions",
        icon: "mdi:file-sign",
        superAdminOnly: true,
      },
    ],
  },
  {
    label: "Discover",
    href: "/discover",
    icon: "mdi:play-box-multiple",
    superAdminOnly: true,
  },
];

export const dashboardBottomNavItems: DashboardNavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: "material-symbols:settings-rounded",
    mutedIcon: true,
    superAdminOnly: true,
  },
];

export const dashboardAllNavItems: DashboardNavItem[] = [
  ...dashboardMainNavItems,
  ...dashboardBottomNavItems,
];

type NavAccessCheck = {
  can: (key: PermissionKey, level?: "view" | "edit") => boolean;
  isSuperAdmin: boolean;
};

function isNavEntryVisible(
  entry: { permission?: PermissionKey; superAdminOnly?: boolean },
  { can, isSuperAdmin }: NavAccessCheck,
) {
  if (entry.superAdminOnly) return isSuperAdmin;
  if (entry.permission) return can(entry.permission, "view");
  return true;
}

/**
 * Drops nav entries the user can't open. A dropdown whose children are all
 * hidden is dropped too, so no empty menus are left behind.
 */
export function filterNavItems(
  items: DashboardNavItem[],
  access: NavAccessCheck,
): DashboardNavItem[] {
  return items.reduce<DashboardNavItem[]>((visible, item) => {
    if (item.subItems) {
      const subItems = item.subItems.filter((subItem) => isNavEntryVisible(subItem, access));
      if (subItems.length > 0) visible.push({ ...item, subItems });
      return visible;
    }

    if (isNavEntryVisible(item, access)) visible.push(item);
    return visible;
  }, []);
}

export function isDashboardNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isDashboardNavSubItemActive(pathname: string, href: string) {
  if (href === "/properties") return pathname === "/properties";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getDashboardPageTitle(pathname: string): string {
  if (pathname === "/properties/add") return "Add a Properties";
  if (pathname.startsWith("/properties/edit/")) return "Edit Property";
  if (pathname === "/news-and-regulations/add") return "Add a News & Regulation";
  if (pathname.startsWith("/news-and-regulations/edit/")) return "Edit News & Regulation";
  if (pathname.startsWith("/news-and-regulations/view/")) return "View News & Regulation";
  if (pathname === "/developers/add") return "Add a Developers";
  if (pathname === "/careers/add") return "Post a Job";
  if (pathname === "/discover/add") return "Add a Discover Video";
  if (pathname.startsWith("/discover/edit/")) return "Edit Discover Video";
  if (pathname === "/content-management/faqs") return "FAQs";
  if (pathname === "/content-management/privacy-policy") return "Privacy Policy";
  if (pathname === "/content-management/terms-and-conditions") return "Terms & Conditions";
  if (pathname === "/notifications") return "Notifications";

  for (const item of dashboardAllNavItems) {
    const subMatch = item.subItems
      ?.sort((a, b) => b.href.length - a.href.length)
      .find((subItem) => isDashboardNavSubItemActive(pathname, subItem.href));
    if (subMatch) return subMatch.label;
  }

  const match = dashboardAllNavItems
    .filter((item) => item.href !== "/")
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => isDashboardNavActive(pathname, item.href));

  if (match) return match.label;
  if (pathname === "/") return "Dashboard";

  return "Dashboard";
}
