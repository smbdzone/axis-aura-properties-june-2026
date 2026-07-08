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

const defaultDeveloperDescription =
  "Discover Dubai's leading developers crafting luxury homes, landmark towers, and vibrant communities.";

export const developerCards: DeveloperCardData[] = [
  {
    id: "samana",
    name: "Samana Developers",
    description: defaultDeveloperDescription,
    logo: "/Developer/samana.svg",
    logoWidth: 291,
    logoHeight: 108,
    projects: "120 Projects",
    handedOver: "200 Projects Handed Over",
  },
  {
    id: "arada",
    name: "Arada",
    description: defaultDeveloperDescription,
    logo: "/Developer/arada.svg",
    logoWidth: 255,
    logoHeight: 38,
    projects: "45 Projects",
    handedOver: "90 Projects Handed Over",
  },
  {
    id: "sobha",
    name: "Sobha Realty",
    description: defaultDeveloperDescription,
    logo: "/Developer/sobha.svg",
    logoWidth: 205,
    logoHeight: 74,
    projects: "95 Projects",
    handedOver: "180 Projects Handed Over",
  },
  {
    id: "damac",
    name: "Damac",
    description: defaultDeveloperDescription,
    logo: "/Developer/damac.svg",
    logoWidth: 216,
    logoHeight: 30,
    projects: "110 Projects",
    handedOver: "210 Projects Handed Over",
  },
  {
    id: "danube",
    name: "Danube Properties",
    description: defaultDeveloperDescription,
    logo: "/Developer/danube.svg",
    logoWidth: 310,
    logoHeight: 74,
    projects: "70 Projects",
    handedOver: "130 Projects Handed Over",
  },
  {
    id: "binghatti",
    name: "Binghatti",
    description: defaultDeveloperDescription,
    logo: "/Developer/binghati.svg",
    logoWidth: 94,
    logoHeight: 81,
    projects: "65 Projects",
    handedOver: "120 Projects Handed Over",
  },
  {
    id: "azizi",
    name: "Azizi",
    description: defaultDeveloperDescription,
    logo: "/Developer/azizi.svg",
    logoWidth: 190,
    logoHeight: 111,
    projects: "100 Projects",
    handedOver: "175 Projects Handed Over",
  },
];

export const developerDetailHero = {
  image: "/Developer/developer details.svg",
  imageAlt: "Developer project showcase",
  ctaLabel: "View Projects",
  ctaHref: "#developer-projects",
};

export function getDeveloperById(id: string): DeveloperCardData | undefined {
  return developerCards.find((developer) => developer.id === id);
}

export function getAllDeveloperIds(): string[] {
  return developerCards.map((developer) => developer.id);
}
