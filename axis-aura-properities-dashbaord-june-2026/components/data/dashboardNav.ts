export type DashboardNavSubItem = {
  label: string;
  href: string;
  icon: string;
};

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: string;
  hasChevron?: boolean;
  mutedIcon?: boolean;
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
  { label: "Dashboard", href: "/", icon: "ri:dashboard-fill" },
  {
    label: "Properties",
    href: "/properties",
    icon: "lsicon:house-filled",
  },
  {
    label: "News & Regulations",
    href: "/news-and-regulations",
    icon: "fluent:news-16-filled",
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
      },
      {
        label: "Newsletters",
        href: "/client-manager/newsletter",
        icon: "mdi:email-newsletter",
      },
      {
        label: "Jobs List",
        href: "/client-manager/jobs-list",
        icon: "majesticons:suitcase",
      },
      {
        label: "Contact Us",
        href: "/client-manager/contacts",
        icon: "mdi:message-text",
      },
      {
        label: "Comments",
        href: "/client-manager/comments",
        icon: "mdi:comment-multiple",
      },
    ],
  },
  {
    label: "Developers",
    href: "/developers",
    icon: "mingcute:building-6-fill",
  },
  { label: "Careers", href: "/careers", icon: "majesticons:suitcase" },
  { label: "FAQs", href: "/faqs", icon: "mdi:frequently-asked-questions" },
  { label: "Discover", href: "/discover", icon: "mdi:play-box-multiple" },
];

export const dashboardBottomNavItems: DashboardNavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: "material-symbols:settings-rounded",
    mutedIcon: true,
  },
];

export const dashboardAllNavItems: DashboardNavItem[] = [
  ...dashboardMainNavItems,
  ...dashboardBottomNavItems,
];

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
