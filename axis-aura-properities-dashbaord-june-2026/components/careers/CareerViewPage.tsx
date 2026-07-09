"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchJobById, type ApiJob } from "@/lib/api/jobs";
import { toast } from "sonner";

const salaryPeriodLabels: Record<string, string> = {
  day: "per day",
  month: "per month",
  annual: "per year",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-[family-name:var(--font-sandena)] text-base font-medium text-black/60">
        {label}
      </span>
      <div className="font-[family-name:var(--font-sandena)] text-lg font-medium text-[#003049]">
        {children}
      </div>
    </div>
  );
}

export default function CareerViewPage({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<ApiJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadJob() {
      setLoading(true);
      try {
        const data = await fetchJobById(jobId);
        if (active) setJob(data);
      } catch {
        if (active) toast.error("Failed to load job details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadJob();
    return () => {
      active = false;
    };
  }, [jobId]);

  const offering =
    job?.remunerationType === "commission"
      ? `${job.commission || "—"} (Commission)`
      : job?.remunerationType === "salary"
        ? `${job.salary || "—"} AED ${
            job.salaryPeriod ? salaryPeriodLabels[job.salaryPeriod] ?? "" : ""
          }`.trim()
        : "—";

  return (
    <section className="mx-auto flex w-full flex-col gap-6 px-8 py-8">
      <Link
        href="/careers"
        className="flex w-fit items-center gap-2 font-[family-name:var(--font-sandena)] text-base font-medium leading-[21px] text-[#003049] transition-opacity hover:opacity-80"
      >
        <Image src="/arrow/left.svg" alt="" width={24} height={24} aria-hidden="true" />
        Back to Careers
      </Link>

      {loading ? (
        <p className="text-sm text-black/60">Loading job details...</p>
      ) : !job ? (
        <p className="text-sm text-red-600">Job not found.</p>
      ) : (
        <div className="flex w-full max-w-[760px] flex-col gap-6 rounded-2xl border-[1.5px] border-[#669BBC] p-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-[family-name:var(--font-sandena)] text-[28px] font-bold leading-[37px] text-[#003049]">
              {job.title}
            </h1>
            <Link
              href={`/careers/edit/${job._id}`}
              className="flex h-[40px] shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-[#003049] px-5 font-[family-name:var(--font-sandena)] text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Edit
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Level">{job.level || "Entry"}</Field>
            <Field label="Remuneration">{offering}</Field>
          </div>

          <Field label="Job Description">
            <div
              className="prose prose-sm max-w-none text-[#003049]"
              dangerouslySetInnerHTML={{ __html: job.description || "" }}
            />
          </Field>
        </div>
      )}
    </section>
  );
}
