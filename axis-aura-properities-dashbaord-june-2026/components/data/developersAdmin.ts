export type DeveloperItem = {
  id: string;
  title: string;
  propertyCount: number;
  logoLabel: string;
  logoUrl?: string;
};

export const developersAdminItems: DeveloperItem[] = [
  { id: "1", title: "Arada", propertyCount: 200, logoLabel: "ARADA" },
  { id: "2", title: "Azizi", propertyCount: 150, logoLabel: "AZIZI" },
  { id: "3", title: "Binghatti", propertyCount: 87, logoLabel: "BINGHATTI" },
  { id: "4", title: "Damac", propertyCount: 54, logoLabel: "DAMAC" },
  { id: "5", title: "Danube Properties", propertyCount: 200, logoLabel: "DANUBE" },
  { id: "6", title: "Object 1", propertyCount: 150, logoLabel: "OBJECT1" },
  { id: "7", title: "Sobha Reality", propertyCount: 44, logoLabel: "SOBHA" },
  { id: "8", title: "Samana Developers", propertyCount: 200, logoLabel: "SAMANA" },
];
