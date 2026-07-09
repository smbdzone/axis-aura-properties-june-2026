export type AnalyticsStat = {
  value: string | number;
  label: string;
  change?: string;
  trend?: "up" | "down" | "none";
  live?: boolean;
};

export const analyticsStats: AnalyticsStat[] = [
  {
    value: 8,
    label: "Active Visitor",
    live: true,
  },
  {
    value: 345,
    label: "Sessions",
    change: "+11.01%",
    trend: "up",
  },
  {
    value: "10.00%",
    label: "Bonus Rate",
    change: "+11.01%",
    trend: "up",
  },
  {
    value: 54,
    label: "New Sessions",
    change: "+11.01%",
    trend: "up",
  },
];
