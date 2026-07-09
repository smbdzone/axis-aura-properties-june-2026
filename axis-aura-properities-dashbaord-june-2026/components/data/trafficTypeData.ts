export type TrafficTypeSegment = {
  label: string;
  value: number;
  color: string;
};

export const trafficTypeSegments: TrafficTypeSegment[] = [
  { label: "Sessions", value: 35, color: "#003049" },
  { label: "New Sessions", value: 28, color: "#669BBC" },
  { label: "Bounce Rate", value: 22, color: "#3A75FF" },
  { label: "Reach", value: 15, color: "#3AC7FF" },
];
