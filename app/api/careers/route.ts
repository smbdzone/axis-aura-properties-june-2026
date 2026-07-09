import { NextResponse } from "next/server";
import type { CareerPosition } from "@/components/data/careerPositions";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

const fallbackImages = [
  "/career/job1.svg",
  "/career/job2.svg",
  "/career/job3.svg",
  "/career/job4.svg",
];

type BackendJob = {
  _id: string;
  title: string;
  description: string;
  remunerationType: "commission" | "salary";
  commission?: string;
  salary?: string;
  salaryPeriod?: "day" | "month" | "annual";
  level?: string;
  imageUrl?: string;
};

const salaryPeriodLabels: Record<string, string> = {
  day: "/ day",
  month: "/ month",
  annual: "/ year",
};

function resolveImageUrl(imageUrl?: string) {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${BACKEND_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapJobToPosition(job: BackendJob, index: number): CareerPosition {
  let salaryValue: string;
  if (job.remunerationType === "commission") {
    salaryValue = job.commission || "Commission based";
  } else {
    const base = job.salary || "Competitive";
    const period = job.salaryPeriod ? salaryPeriodLabels[job.salaryPeriod] : "";
    salaryValue = period ? `${base} AED ${period}` : base;
  }
  const plainDescription = stripHtml(job.description || "");
  const uploadedImage = resolveImageUrl(job.imageUrl);

  return {
    id: job._id,
    title: job.title,
    salaryLabel: "Salary:",
    salaryValue,
    levelLabel: "Level:",
    levelValue: job.level || "Entry",
    description: plainDescription,
    fullDescription: plainDescription,
    image: uploadedImage ?? fallbackImages[index % fallbackImages.length],
    imageAlt: job.title,
  };
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/jobs`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load jobs");
    }

    const jobs = (await response.json()) as BackendJob[];
    const positions = jobs.map(mapJobToPosition);

    return NextResponse.json({ positions });
  } catch {
    return NextResponse.json(
      { error: "Unable to load open positions right now.", positions: [] },
      { status: 502 },
    );
  }
}
