import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Please provide an email." },
        { status: 400 },
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message ?? "Unable to subscribe right now." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: data?.message ?? "Subscribed successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to subscribe right now. Please try again." },
      { status: 502 },
    );
  }
}
