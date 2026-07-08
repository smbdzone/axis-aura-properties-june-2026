export type DiscoverSlide = {
  id: string;
  images: [string, string, string];
  description: string;
};

export const discoverSlides: DiscoverSlide[] = [
  {
    id: "dubai-skyline",
    images: ["/Image.svg", "/extra/Discover2.svg", "/extra/Discover3.svg"],
    description:
      "Explore the world's most dynamic city. From iconic skyline penthouses to high yield investment properties, we connect you with dubai's most exclusive addresses and trusted developers.",
  },
  {
    id: "waterfront-living",
    images: ["/extra/Discover2.svg", "/extra/Discover3.svg", "/extra/pinnacle.svg"],
    description:
      "Experience waterfront living at its finest. Discover marina residences, beachfront villas, and branded towers crafted by the region's most trusted developers.",
  },
  {
    id: "investment-opportunities",
    images: ["/extra/Discover3.svg", "/extra/pinnacle.svg", "/projects/project.svg"],
    description:
      "Unlock high-yield investment opportunities across Dubai's fastest-growing districts. Expert guidance connects you with premier off-plan launches and ready properties.",
  },
];
