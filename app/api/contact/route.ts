import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
    };

    if (!body.fullName?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { error: "Please provide your name, email, and message." },
        { status: 400 },
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message ?? "Unable to send your message right now." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: data?.message ?? "Message sent successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again." },
      { status: 502 },
    );
  }
}
