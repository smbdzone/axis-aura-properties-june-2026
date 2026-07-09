import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const response = await fetch(`${BACKEND_URL}/api/jobApplication`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: (data as { error?: string }).error ?? "Failed to submit application." },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: "Application submitted successfully." });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit application right now. Please try again." },
      { status: 502 },
    );
  }
}
