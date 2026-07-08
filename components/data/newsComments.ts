export type NewsComment = {
  id: string;
  author: string;
  date: string;
  body: string;
  likes: string;
  replies: string;
};

export const newsEngagement = {
  likes: "20k",
  comments: "468",
};

export const currentCommentUser = {
  name: "Simo Berrada",
  initials: "SB",
};

export const newsComments: NewsComment[] = [
  {
    id: "comment-1",
    author: "Simo Berrada",
    date: "29 Apr, 2025",
    body: "Very nice article, im amazed and my life has changed. im going to share this with my friends so they can learn some things too.",
    likes: "20k",
    replies: "468",
  },
  {
    id: "comment-2",
    author: "Nouman Fakhar",
    date: "29 Apr, 2025",
    body: "Very nice article, im amazed and my life has changed. im going to share this with my friends so they can learn some things too.",
    likes: "20k",
    replies: "468",
  },
  {
    id: "comment-3",
    author: "Arooj",
    date: "29 Apr, 2025",
    body: "Very nice article, im amazed and my life has changed. im going to share this with my friends so they can learn some things too.",
    likes: "20k",
    replies: "468",
  },
  {
    id: "comment-4",
    author: "Sarah Khan",
    date: "28 Apr, 2025",
    body: "Great insights on the market. This helped me understand how rate changes affect my mortgage options in Dubai.",
    likes: "12k",
    replies: "214",
  },
  {
    id: "comment-5",
    author: "Ahmed Hassan",
    date: "28 Apr, 2025",
    body: "As a seller, this article explained exactly why listings are taking longer. Very practical advice for pricing strategy.",
    likes: "8.4k",
    replies: "156",
  },
  {
    id: "comment-6",
    author: "Maria Lopez",
    date: "27 Apr, 2025",
    body: "Investor perspective was spot on. Cash buyers definitely have an edge in this environment.",
    likes: "6.1k",
    replies: "98",
  },
  {
    id: "comment-7",
    author: "James Wilson",
    date: "27 Apr, 2025",
    body: "Clear and easy to follow. Shared it with my agent and we had a much better conversation about next steps.",
    likes: "4.2k",
    replies: "72",
  },
  {
    id: "comment-8",
    author: "Fatima Ali",
    date: "26 Apr, 2025",
    body: "The Dubai market context makes this especially useful. Would love more articles like this on regulations too.",
    likes: "3.8k",
    replies: "61",
  },
  {
    id: "comment-9",
    author: "Omar Siddiqui",
    date: "26 Apr, 2025",
    body: "Bookmarked for future reference. The buyer section alone saved me hours of research.",
    likes: "2.9k",
    replies: "44",
  },
];
