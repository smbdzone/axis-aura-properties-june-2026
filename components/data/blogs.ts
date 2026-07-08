export type BlogPost = {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  href: string;
};

export const featuredBlog: BlogPost = {
  id: "interest-rate-hike",
  date: "29 Apr, 2025",
  title:
    "Real Estate Market Reacts to Interest Rate Hike: What Buyers & Sellers Should Know",
  excerpt:
    "The recent increase in interest rates by central banks has led to a slowdown in property sales, impacting affordability for first-time buyers while sellers adjust pricing strategies. Industry experts recommend monitoring mortgage trends and exploring fixed-rate financing options before making major investment decisions in the current climate.",
  image: "/blogs/blog1.svg",
  href: "#",
};

export const blogPosts: BlogPost[] = [
  {
    id: "visa-incentives-2025",
    date: "29 Apr, 2025",
    title: "Dubai Announces New Visa Incentives for Real Estate Investors in 2025",
    excerpt:
      "The UAE expands its Golden Visa program to attract long-term investors through minimum property investment thresholds and streamlined application processes.",
    image: "/blogs/blog2.svg",
    href: "#",
  },
  {
    id: "rera-compliance-rules",
    date: "29 Apr, 2025",
    title: "RERA Rolls Out Stricter Compliance Rules for Off-Plan Property Sales",
    excerpt:
      "Dubai's Real Estate Regulatory Agency (RERA) introduces new measures to protect buyers and ensure developer accountability across off-plan transactions.",
    image: "/blogs/blog3.svg",
    href: "#",
  },
  {
    id: "market-boom-foreign-investment",
    date: "29 Apr, 2025",
    title:
      "Dubai Property Market Booms Amid Surge in Foreign Investment and Residency Reforms",
    excerpt:
      "Real estate transactions hit record highs as Dubai continues to attract global investors with flexible ownership structures and residency reforms.",
    image: "/blogs/blog4.svg",
    href: "#",
  },
];
