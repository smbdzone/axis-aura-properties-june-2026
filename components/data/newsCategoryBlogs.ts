export type NewsCategory = "buyer" | "seller" | "investor";

export type ArticleBullet = {
  label: string;
  text: string;
};

export type ArticleSection = {
  heading: string;
  intro?: string;
  bullets?: ArticleBullet[];
  body?: string;
};

export type NewsCategoryBlogPost = {
  id: string;
  category: NewsCategory;
  categoryLabel: string;
  title: string;
  timeAgo: string;
  excerpt: string;
  image: string;
  imagePosition: "left" | "right";
  categoryMeta: string;
  article: {
    overview: ArticleSection;
    pros: ArticleSection;
    cons: ArticleSection;
    takeaway: ArticleSection;
  };
};

const buyerArticle = {
  overview: {
    heading: "Overview",
    body: "Affordability Crunch for Buyers: With rising interest rates already inflating monthly mortgage payments, buyers are facing diminished purchasing power. Adjusting budgets or settling for smaller properties is becoming the new norm.",
  },
  pros: {
    heading: "The Benefits: Why This Matters (Pros)",
    intro:
      "These stricter rules are designed to create a more secure and resilient real estate ecosystem. Here is how they benefit the market:",
    bullets: [
      {
        label: "Maximum Investor Protection:",
        text: "Tightened escrow account rules ensure developer transparency and protect your money.",
      },
      {
        label: "Fewer Project Delays:",
        text: "Higher financial benchmarks for developers mean projects are much more likely to finish on time.",
      },
      {
        label: "Higher Market Confidence:",
        text: "Local and global buyers can invest safely, knowing risky developers are filtered out.",
      },
    ],
  },
  cons: {
    heading: "The Wrongs: Market Challenges & Impact (Cons)",
    intro:
      "While the rules bring safety, the current economic climate combined with strict regulations introduces significant challenges for both buyers and developers:",
    bullets: [
      {
        label: "Affordability Crunch:",
        text: "Rising interest rates mean higher monthly costs, forcing buyers to shrink their budgets or delay decisions.",
      },
      {
        label: "Stricter Entry for Developers:",
        text: "Smaller firms might struggle with compliance costs, potentially slowing down new project launches.",
      },
      {
        label: "Market Wait-and-See:",
        text: "Buyers are taking longer to lock in deals, waiting for interest rates to stabilize.",
      },
    ],
  },
  takeaway: {
    heading: "Strategic Takeaway for Buyers",
    body: "While rising mortgage rates demand careful budget planning, RERA's new rules make off-plan investing safer than ever. To secure your asset, strictly choose fully verified developers.",
  },
};

export const newsCategoryBlogs: NewsCategoryBlogPost[] = [
  {
    id: "buyers-rate-hike",
    category: "buyer",
    categoryLabel: "For Buyers:",
    title: "RERA Rolls Out Stricter Compliance Rules for Off-Plan Property Sales",
    timeAgo: "7 hours ago",
    excerpt:
      "Rising interest rates translate into higher mortgage payments, reducing affordability and purchasing power. Potential buyers may need to adjust budgets or consider smaller properties to keep monthly costs manageable. Many delay their decisions, waiting for signs",
    image: "/blogs/blog3.svg",
    imagePosition: "left",
    categoryMeta: "Real Estate Regulatory Updates",
    article: buyerArticle,
  },
  {
    id: "sellers-rate-hike",
    category: "seller",
    categoryLabel: "For Seller:",
    title: "Dubai Announces New Visa Incentives for Real Estate Investors in 2025",
    timeAgo: "7 hours ago",
    excerpt:
      "Sellers face challenges in attracting buyers during rate hikes. With fewer buyers qualifying for loans, listings may stay on the market longer. To remain competitive, sellers are often encouraged to lower asking prices or offer incentives such as closing cost coverage.",
    image: "/blogs/blog2.svg",
    imagePosition: "right",
    categoryMeta: "Visa & Residency Policy",
    article: {
      overview: {
        heading: "Overview",
        body: "New visa incentives linked to property investment are reshaping how sellers market to international buyers. Higher residency appeal can shorten listing times, but sellers must align pricing and documentation with updated eligibility thresholds.",
      },
      pros: {
        heading: "The Benefits: Why This Matters (Pros)",
        intro:
          "Visa-linked incentives create fresh demand channels for sellers who position listings correctly:",
        bullets: [
          {
            label: "Broader Buyer Pool:",
            text: "Overseas investors gain stronger residency pathways, increasing qualified demand for mid- and upper-tier listings.",
          },
          {
            label: "Faster Absorption:",
            text: "Properties marketed with clear visa eligibility often attract faster offers from relocation-minded buyers.",
          },
          {
            label: "Premium Positioning:",
            text: "Sellers can highlight lifestyle and long-term residency value alongside square footage and amenities.",
          },
        ],
      },
      cons: {
        heading: "The Wrongs: Market Challenges & Impact (Cons)",
        intro:
          "Not every listing benefits equally. Sellers should plan for these friction points:",
        bullets: [
          {
            label: "Price Sensitivity:",
            text: "Buyers weigh visa benefits against total cost of ownership, pressuring sellers on pricing and incentives.",
          },
          {
            label: "Documentation Overhead:",
            text: "Compliance and eligibility paperwork can delay closings if listings are not pre-verified.",
          },
          {
            label: "Segment Mismatch:",
            text: "Lower-value units may see limited visa-driven uplift compared with investment-grade stock.",
          },
        ],
      },
      takeaway: {
        heading: "Strategic Takeaway for Sellers",
        body: "Package your listing with transparent visa eligibility, verified documentation, and competitive pricing. Sellers who lead with residency value—not just floor plans—are best placed to convert international interest into closed deals.",
      },
    },
  },
  {
    id: "investors-rate-hike",
    category: "investor",
    categoryLabel: "For Investors:",
    title:
      "Dubai Property Market Booms Amid Surge in Foreign Investment and Residency Reforms",
    timeAgo: "7 hours ago",
    excerpt:
      "Rate hikes reshape strategies for seasoned investors. Cash-rich investors often seize opportunities, targeting properties with strong potential for returns. Dubai's luxury property segment continues to attract foreign investors who are less impacted by local borrowing costs.",
    image: "/blogs/blog4.svg",
    imagePosition: "left",
    categoryMeta: "Market Trends & Investment",
    article: {
      overview: {
        heading: "Overview",
        body: "Foreign capital continues to flow into Dubai as residency reforms and tax advantages reinforce the emirate's appeal. Investors are recalibrating yield targets and hold periods as financing costs rise in other markets.",
      },
      pros: {
        heading: "The Benefits: Why This Matters (Pros)",
        intro:
          "The current cycle offers distinct advantages for well-capitalized investors:",
        bullets: [
          {
            label: "Strong Rental Demand:",
            text: "Population growth and corporate relocations support occupancy across core and emerging districts.",
          },
          {
            label: "Currency Diversification:",
            text: "AED-linked assets give international portfolios exposure outside traditional Western markets.",
          },
          {
            label: "Developer Pipeline Quality:",
            text: "Tier-one launches with escrow protection reduce delivery risk for off-plan allocations.",
          },
        ],
      },
      cons: {
        heading: "The Wrongs: Market Challenges & Impact (Cons)",
        intro:
          "Investors should weigh macro headwinds alongside local momentum:",
        bullets: [
          {
            label: "Yield Compression:",
            text: "Premium segments may see tighter net yields as acquisition prices climb faster than rents.",
          },
          {
            label: "Global Rate Spillover:",
            text: "Higher borrowing costs abroad can temper cross-border appetite even when local demand stays firm.",
          },
          {
            label: "Concentration Risk:",
            text: "Heavy exposure to a single sub-market or developer increases vulnerability to localized slowdowns.",
          },
        ],
      },
      takeaway: {
        heading: "Strategic Takeaway for Investors",
        body: "Prioritize verified developers, diversify across districts, and stress-test returns against higher holding costs. Dubai remains compelling for patient capital—but discipline on entry price and exit timing matters more than ever.",
      },
    },
  },
];
