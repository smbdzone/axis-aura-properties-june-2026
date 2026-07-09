export const developersHero = {
  image: "/Developer/Image.svg",
  imageAlt: "Dubai skyline and leading real estate developers",
  title: "Leading Real Estate Developers in Dubai",
  description:
    "Discover Dubai's top developers with Suits & Sand. We connect you to luxury homes, iconic towers, and high-yield investments across prime locations",
  ctaLabel: "Explore Developer",
  ctaHref: "#developer-cards",
};

export const developersIntro = {
  title: "Developers",
  description:
    "Partnering with Dubai's most trusted builders to bring you world-class developments and premium investment opportunities.",
};

export type DeveloperCardData = {
  id: string;
  name: string;
  description: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  projects: string;
  handedOver: string;
};

export const developerDetailHero = {
  image: "/Developer/developer details.svg",
  imageAlt: "Developer project showcase",
  ctaLabel: "View Projects",
  ctaHref: "#developer-projects",
};
