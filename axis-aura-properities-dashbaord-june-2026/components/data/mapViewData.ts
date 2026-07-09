export type MapVisitorCountry = {
  code: string;
  name: string;
  percentage: number;
  visitors: number;
};

export const mapViewUserFilters = ["Active User", "All Users"] as const;
export const mapViewPeriodFilters = ["Today", "Yesterday", "Monthly"] as const;

export type MapViewUserFilter = (typeof mapViewUserFilters)[number];
export type MapViewPeriodFilter = (typeof mapViewPeriodFilters)[number];

export const mapVisitorCountries: MapVisitorCountry[] = [
  { code: "US", name: "USA", percentage: 50, visitors: 1250 },
  { code: "AE", name: "United Arab Emirates", percentage: 73, visitors: 890 },
  { code: "PK", name: "Pakistan", percentage: 82, visitors: 720 },
  { code: "GB", name: "United Kingdom", percentage: 56, visitors: 640 },
  { code: "IN", name: "India", percentage: 83, visitors: 580 },
  { code: "CN", name: "China", percentage: 50, visitors: 510 },
  { code: "DE", name: "Germany", percentage: 45, visitors: 420 },
  { code: "SA", name: "Saudi Arabia", percentage: 41, visitors: 390 },
  { code: "RU", name: "Russia", percentage: 38, visitors: 350 },
  { code: "FR", name: "France", percentage: 34, visitors: 310 },
];

export const topMapVisitorCountries = [...mapVisitorCountries]
  .sort((a, b) => b.visitors - a.visitors)
  .slice(0, 10);

export const mapVisitorCountryCodes = mapVisitorCountries.map(
  (country) => country.code,
);

export function getCountryByCode(code: string) {
  return mapVisitorCountries.find((country) => country.code === code);
}
