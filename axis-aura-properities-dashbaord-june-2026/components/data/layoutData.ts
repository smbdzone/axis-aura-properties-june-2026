export type ApartmentType = {
  id: string;
  label: string;
  layoutLabel: string;
  selected: boolean;
};

export const layoutTypeOptions = [
  "Residential",
  "Commercial",
  "Mixed Use",
] as const;

export const floorOptions = ["1", "2", "3", "4", "5", "6+"] as const;

export const apartmentTypes: ApartmentType[] = [
  {
    id: "studio",
    label: "Studio",
    layoutLabel: "Studio-Unit Layout",
    selected: true,
  },
  {
    id: "1bhk",
    label: "1 BHK",
    layoutLabel: "1 BHK-Unit Layout",
    selected: true,
  },
  {
    id: "2bhk",
    label: "2 BHK",
    layoutLabel: "2 BHK-Unit Layout",
    selected: false,
  },
  {
    id: "2bhk-duplex",
    label: "2 BHK Duplex",
    layoutLabel: "2BHK D-Unit Layout",
    selected: false,
  },
  {
    id: "3bhk-duplex",
    label: "3 BHK Duplex",
    layoutLabel: "3BHK D-Unit Layout",
    selected: false,
  },
  {
    id: "penthouse",
    label: "Penthouse",
    layoutLabel: "P.house-Unit Layout",
    selected: false,
  },
];
