export type DeviceBarDatum = {
  label: string;
  value: number;
  color: string;
};

export const deviceBarChartYLabels = ["5", "4", "3", "2", "1"];
export const deviceBarChartMaxValue = 5;

export const deviceBarChartPeriodFilters = [
  "Today",
  "Yesterday",
  "Monthly",
] as const;

export type DeviceBarChartPeriodFilter =
  (typeof deviceBarChartPeriodFilters)[number];

export const deviceBarChartData: DeviceBarDatum[] = [
  { label: "Mobile", value: 2.9, color: "#CD9E47" },
  { label: "Desktop", value: 4.2, color: "#F5DEB3" },
  { label: "Tablet", value: 3.5, color: "#3C3C3C" },
  { label: "Smart TV", value: 5, color: "#579CFF" },
  { label: "Wearable", value: 1.6, color: "#3AD526" },
  { label: "Other", value: 2.7, color: "#94E9B8" },
];
