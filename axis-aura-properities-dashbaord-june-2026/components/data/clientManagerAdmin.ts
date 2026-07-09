export type EnquireItem = {
  id: number;
  name: string;
  email: string;
  date: string;
  phone: string;
  budget: string;
  type: string;
};

export type NewsletterSubscriberItem = {
  id: number;
  name: string;
  email: string;
  date: string;
  emailUnderlined?: boolean;
};

export const enquireAdminItems: EnquireItem[] = [
  {
    id: 1,
    name: "Uzair SJ",
    email: "uzairsarwar@gmail.com",
    date: "7 May, 2025",
    phone: "+971 123 1233 123",
    budget: "AED 750K - 1M",
    type: "Commercial",
  },
  {
    id: 2,
    name: "Simo Berrada",
    email: "simob@smbdigitalzone.com",
    date: "7 May, 2025",
    phone: "+971 123 1233 123",
    budget: "AED 1M - 2M",
    type: "Residential",
  },
  {
    id: 3,
    name: "Simo123",
    email: "s.berrada75@gmail.com",
    date: "7 Oct, 2025",
    phone: "+971 123 1233 123",
    budget: "AED 2M - 4M",
    type: "Commercial",
  },
  {
    id: 4,
    name: "Satyam Kumar",
    email: "weeshare2@gmail.com",
    date: "7 May, 2025",
    phone: "+971 123 1233 123",
    budget: "AED 750K - 1M",
    type: "Residential",
  },
  {
    id: 5,
    name: "Nouman Fakhar",
    email: "satyamkumar@gmail.com",
    date: "7 Dec, 2025",
    phone: "+971 123 1233 123",
    budget: "AED 1M - 2M",
    type: "Commercial",
  },
  {
    id: 6,
    name: "Satyam Kumar",
    email: "weeshare2@gmail.com",
    date: "7 Sep, 2025",
    phone: "+971 123 1233 123",
    budget: "AED 750K - 1M",
    type: "Residential",
  },
  {
    id: 7,
    name: "Nouman Fakhar",
    email: "satyamkumar@gmail.com",
    date: "7 May, 2025",
    phone: "+971 123 1233 123",
    budget: "AED 2M - 4M",
    type: "Commercial",
  },
  {
    id: 8,
    name: "Satyam Kumar",
    email: "weeshare2@gmail.comb",
    date: "7 May, 2025",
    phone: "+971 123 1233 123",
    budget: "AED 750K - 1M",
    type: "Residential",
  },
];

export const newsletterAdminItems: NewsletterSubscriberItem[] = [
  {
    id: 1,
    name: "Uzair SJ",
    email: "uzairsarwar@gmail.com",
    date: "7 May, 2025",
    emailUnderlined: true,
  },
  {
    id: 2,
    name: "Simo Berrada",
    email: "simob@smbdigitalzone.com",
    date: "7 May, 2025",
  },
  {
    id: 3,
    name: "Simo123",
    email: "s.berrada75@gmail.com",
    date: "7 May, 2025",
  },
  {
    id: 4,
    name: "Satyam Kumar",
    email: "weeshare2@gmail.com",
    date: "7 May, 2025",
  },
  {
    id: 5,
    name: "Nouman Fakhar",
    email: "satyamkumar@gmail.com",
    date: "7 May, 2025",
  },
  {
    id: 6,
    name: "Satyam Kumar",
    email: "weeshare2@gmail.com",
    date: "7 May, 2025",
  },
  {
    id: 7,
    name: "Nouman Fakhar",
    email: "satyamkumar@gmail.com",
    date: "7 May, 2025",
  },
  {
    id: 8,
    name: "Satyam Kumar",
    email: "weeshare2@gmail.comb",
    date: "7 May, 2025",
  },
];
