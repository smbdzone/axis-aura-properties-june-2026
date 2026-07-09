import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      budget?: string;
      type?: string;
    };

    if (
      !body.firstName?.trim() ||
      !body.phone?.trim() ||
      !body.email?.trim() ||
      !body.budget?.trim() ||
      !body.type?.trim()
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message ?? "Unable to submit your enquiry right now." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: "Enquiry submitted successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit your enquiry right now. Please try again." },
      { status: 502 },
    );
  }
}
