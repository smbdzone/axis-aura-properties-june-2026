export type SessionTableRow = {
  id: string;
  country: string;
  sessions: number;
  clicks: number;
  reach: number;
};

export const sessionTableTitle = "By Country";

export const sessionTableColumns = [
  { key: "country", label: "Country" },
  { key: "sessions", label: "Sessions" },
  { key: "clicks", label: "Clicks" },
  { key: "reach", label: "Reach" },
] as const;

export const sessionTableRows: SessionTableRow[] = [
  {
    id: "uae",
    country: "United Arab Emirates",
    sessions: 456,
    clicks: 387,
    reach: 2345,
  },
  {
    id: "pakistan",
    country: "Pakistan",
    sessions: 456,
    clicks: 387,
    reach: 2345,
  },
  {
    id: "benin",
    country: "Benin",
    sessions: 456,
    clicks: 387,
    reach: 2345,
  },
  {
    id: "bulgaria",
    country: "Bulgaria",
    sessions: 456,
    clicks: 387,
    reach: 2345,
  },
  {
    id: "china",
    country: "China",
    sessions: 456,
    clicks: 387,
    reach: 2345,
  },
];
