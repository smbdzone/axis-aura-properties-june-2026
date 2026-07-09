export type NotificationItem = {
  id: number;
  message: string;
  timeAgo: string;
  unread: boolean;
  avatarLabel: string;
};

export const notificationItems: NotificationItem[] = [
  {
    id: 1,
    message:
      "John has made a comment on the news and regulations Real Estate Market Reacts to Interest Rate Hike: What Buyers & Sellers Should Know",
    timeAgo: "3 Hours ago",
    unread: true,
    avatarLabel: "J",
  },
  {
    id: 2,
    message: "Sheraz wants to get in contact for Barari Heights at Al Barari Dubai.",
    timeAgo: "1 Day ago",
    unread: true,
    avatarLabel: "S",
  },
  {
    id: 3,
    message: "Osama wants to apply for the real estate agent position.",
    timeAgo: "1 Week ago",
    unread: false,
    avatarLabel: "O",
  },
  {
    id: 4,
    message: "Fatima submitted a new query via the general contact form.",
    timeAgo: "8 Day ago",
    unread: true,
    avatarLabel: "F",
  },
  {
    id: 5,
    message: "Zayan requested a callback for Marina Shores Penthouse in Dunai Marina.",
    timeAgo: "10 Day ago",
    unread: false,
    avatarLabel: "Z",
  },
  {
    id: 6,
    message: "Hamza updated his application and CV for the Senior Real Estate Broker Position.",
    timeAgo: "1 Month ago",
    unread: false,
    avatarLabel: "H",
  },
  {
    id: 7,
    message:
      "Ayesha Karim wants to get in touch regarding a bulk corporate booking query for Barari Heights at Al Barari Dubai and asked for the structural brochure.",
    timeAgo: "1 Month ago",
    unread: true,
    avatarLabel: "A",
  },
];
