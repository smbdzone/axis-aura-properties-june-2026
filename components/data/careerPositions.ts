export type CareerPosition = {
  id: string;
  title: string;
  salaryLabel: string;
  salaryValue: string;
  levelLabel: string;
  levelValue: string;
  description: string;
  fullDescription: string;
  image: string;
  imageAlt: string;
};

export const careerOpenPositions = {
  title: "Currently Open Positions",
  viewAllLabel: "View All",
  viewAllHref: "#positions",
  positions: [
    {
      id: "real-estate-agent",
      title: "Real Estate Agent",
      salaryLabel: "Salary:",
      salaryValue: "60% Comm. Rate",
      levelLabel: "Level:",
      levelValue: "Expert",
      description:
        "Responsible for helping clients buy, sell, or rent properties. This role includes conducting property showings, negotiating deals, and providing market insights to deliver exceptional client outcomes.",
      fullDescription:
        "As a Real Estate Agent at Suits & Sand, you will be the front line of our client experience. You will guide buyers, sellers, and tenants through every stage of the transaction — from initial consultation and property shortlisting to negotiations, documentation, and handover. You are expected to maintain deep knowledge of Dubai communities, developer offerings, and market trends while building long-term client relationships. Success in this role requires strong communication skills, confidence in deal-making, and a commitment to transparent, professional service.",
      image: "/career/job1.svg",
      imageAlt: "Real estate agent meeting with clients",
    },
    {
      id: "property-manager",
      title: "Property Manager",
      salaryLabel: "Salary:",
      salaryValue: "AED 7k + 0.5% CR",
      levelLabel: "Level:",
      levelValue: "Intermediate",
      description:
        "Oversees the daily operations of rental properties, including tenant relations, rent collection, maintenance coordination, and ensuring each asset meets quality and compliance standards.",
      fullDescription:
        "The Property Manager role oversees the end-to-end operational performance of assigned assets. You will coordinate tenant onboarding, rent collection, service requests, and vendor management while ensuring properties remain well-maintained and compliant with building regulations. You will work closely with owners, tenants, and internal teams to resolve issues quickly and protect asset value. This position suits professionals who are organized, responsive, and comfortable managing multiple stakeholders in a fast-paced environment.",
      image: "/career/job2.svg",
      imageAlt: "Property manager reviewing building operations",
    },
    {
      id: "compliance-executive",
      title: "Compliance Executive",
      salaryLabel: "Salary:",
      salaryValue: "AED 8k",
      levelLabel: "Level:",
      levelValue: "Expert",
      description:
        "Ensures all brokerage activities align with regulatory requirements, internal policies, and industry best practices while supporting teams with documentation, audits, and risk mitigation.",
      fullDescription:
        "The Compliance Executive ensures that all brokerage activities meet Dubai Land Department (DLD) requirements and internal governance standards. You will review contracts, monitor licensing obligations, support audit readiness, and advise teams on regulatory updates that affect day-to-day operations. Strong operational knowledge of DLD rules and systems is essential. This role is ideal for detail-oriented professionals who can balance risk management with practical business support.",
      image: "/career/job3.svg",
      imageAlt: "Compliance executive reviewing documents",
    },
    {
      id: "marketing-executive",
      title: "Marketing Executive",
      salaryLabel: "Salary:",
      salaryValue: "AED 5k",
      levelLabel: "Level:",
      levelValue: "Specialist",
      description:
        "Develops and executes marketing campaigns across digital and offline channels to promote listings, strengthen brand visibility, and generate qualified leads for the sales team.",
      fullDescription:
        "As a Marketing Executive, you will plan and execute campaigns that elevate Suits & Sand's brand and drive qualified leads for our sales team. Responsibilities include content creation, social media management, campaign reporting, listing promotion, and collaboration with agents to showcase properties effectively. You should be creative, data-aware, and comfortable working across digital and offline channels. Experience in real estate or luxury marketing is a strong advantage.",
      image: "/career/job4.svg",
      imageAlt: "Marketing executive presenting campaign strategy",
    },
  ] satisfies CareerPosition[],
};
