export type OverviewStat = {
  value: string | number;
  label: string;
  change?: string;
  trend?: "up" | "down" | "none";
};

export const overviewStats: OverviewStat[] = [
  {
    value: 8,
    label: "Total Number of Developer",
  },
  {
    value: 3,
    label: "Total Numbers of Active Jobs",
  },
  {
    value: 200,
    label: "Total Enquiry Data",
    change: "+11.01%",
    trend: "up",
  },
  {
    value: 200,
    label: "Total Newsletter Data",
    change: "+11.01%",
    trend: "up",
  },
];
