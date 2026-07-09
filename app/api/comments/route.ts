import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

type BackendComment = {
  _id: string;
  username?: string;
  content?: string;
  likes?: number;
  replies?: number;
  createdAt?: string;
};

export type PublicComment = {
  id: string;
  author: string;
  date: string;
  body: string;
  likes: string;
  replies: string;
};

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mapComment(comment: BackendComment): PublicComment {
  return {
    id: comment._id,
    author: comment.username?.trim() || "Anonymous",
    date: formatDate(comment.createdAt),
    body: comment.content ?? "",
    likes: String(comment.likes ?? 0),
    replies: String(comment.replies ?? 0),
  };
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/comments/approved`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to load comments");
    }
    const comments = (await response.json()) as BackendComment[];
    return NextResponse.json({ comments: comments.map(mapComment) });
  } catch {
    return NextResponse.json(
      { error: "Unable to load comments right now.", comments: [] },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      email?: string;
      content?: string;
      articleId?: string;
    };

    if (!body.username?.trim() || !body.email?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "Please provide your name, email, and comment." },
        { status: 400 },
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: body.username.trim(),
        email: body.email.trim(),
        content: body.content.trim(),
        ...(body.articleId ? { articleId: body.articleId } : {}),
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message ?? "Unable to submit your comment right now." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: data?.message ?? "Comment submitted for admin approval.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit your comment right now. Please try again." },
      { status: 502 },
    );
  }
}
