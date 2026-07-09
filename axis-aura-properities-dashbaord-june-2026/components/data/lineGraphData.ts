export const lineGraphSectionTabs = ["Report", "Traffic Type"] as const;

export const lineGraphPeriodTabs = ["Today", "Montly", "Yearly"] as const;

export type LineGraphSectionTab = (typeof lineGraphSectionTabs)[number];
export type LineGraphPeriodTab = (typeof lineGraphPeriodTabs)[number];

export const lineGraphYLabels = ["4", "3", "2", "1"];

export const lineGraphXLabels = ["1", "2", "3", "4", "5", "6", "7"];

/** Chart values (y-axis 1–4) aligned with Figma dot positions */
export const lineGraphTodayData = [2.0, 1.5, 2.2, 3.5, 3.8, 3.2, 3.3];

export const lineGraphYesterdayData = [1.8, 1.7, 2.0, 3.0, 3.4, 2.9, 3.0];
