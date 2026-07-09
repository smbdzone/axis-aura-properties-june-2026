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
  positions: [] as CareerPosition[],
};
