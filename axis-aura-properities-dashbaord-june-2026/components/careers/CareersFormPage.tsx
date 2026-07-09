"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/ui/RichTextEditor";
import FormSelectDropdown from "@/components/ui/FormSelectDropdown";
import {
  createJob,
  updateJob,
  fetchJobById,
  type JobLevel,
  type SalaryPeriod,
} from "@/lib/api/jobs";
import { ApiError } from "@/lib/api/client";
import { toast } from "sonner";

const TITLE_MAX_LENGTH = 80;

const jobLevelOptions: readonly JobLevel[] = [
  "Entry",
  "Mid Level",
  "Senior",
  "Expert",
];

const salaryPeriodOptions: readonly { value: SalaryPeriod; label: string }[] = [
  { value: "day", label: "Per Day" },
  { value: "month", label: "Per Month" },
  { value: "annual", label: "Annual" },
];

const checkboxClassName =
  "size-[23px] shrink-0 appearance-none rounded-lg border border-[#669BBC] bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)] checked:border-[#003049] checked:bg-[#003049]";

function WhiteTextInput({
  value,
  onChange,
  placeholder,
  rightText,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rightText?: string;
}) {
  return (
    <div className="relative isolate flex h-[46px] w-full items-center justify-between overflow-hidden rounded-xl border-[1.5px] border-[#669BBC] bg-white px-4">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049] placeholder:text-black/60 outline-none"
      />
      {rightText ? (
        <span className="font-[family-name:var(--font-sandena)] text-sm font-medium text-black/60">
          {rightText}
        </span>
      ) : null}
    </div>
  );
}

function RemunerationField({
  label,
  placeholder,
  checked,
  onCheckedChange,
  value,
  onChange,
  rightText,
}: {
  label: string;
  placeholder: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  rightText?: string;
}) {
  return (
    <div className="flex w-[496px] flex-col gap-1">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className={checkboxClassName}
        />
        <span className="font-[family-name:var(--font-sandena)] text-xl font-medium leading-[26px] text-[#003049]">
          {label}
        </span>
      </label>
      <WhiteTextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rightText={rightText}
      />
    </div>
  );
}

export default function CareersFormPage({ jobId }: { jobId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(jobId);
  const [jobTitle, setJobTitle] = useState("");
  const [useCommission, setUseCommission] = useState(false);
  const [useSalary, setUseSalary] = useState(false);
  const [commission, setCommission] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>("month");
  const [level, setLevel] = useState<JobLevel>("Entry");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!jobId) return;
    let active = true;

    async function loadJob() {
      setLoading(true);
      try {
        const job = await fetchJobById(jobId as string);
        if (!active) return;
        setJobTitle(job.title ?? "");
        setDescription(job.description ?? "");
        setLevel(job.level ?? "Entry");
        if (job.remunerationType === "commission") {
          setUseCommission(true);
          setCommission(job.commission ?? "");
        } else {
          setUseSalary(true);
          setSalary(job.salary ?? "");
          setSalaryPeriod(job.salaryPeriod ?? "month");
        }
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

  async function handleSave() {
    setError("");

    if (!jobTitle.trim() || !description.trim()) {
      toast.error("Job title and description are required.");
      return;
    }

    if (!useCommission && !useSalary) {
      toast.error("Select Commission or Salary.");
      return;
    }

    const remunerationType = useCommission ? "commission" : "salary";
    const commissionValue = useCommission ? commission.trim() : "";
    const salaryValue = useSalary ? salary.trim() : "";

    if (remunerationType === "commission" && !commissionValue) {
      toast.error("Commission value is required.");
      return;
    }
    if (remunerationType === "salary" && !salaryValue) {
      toast.error("Salary value is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", jobTitle.trim());
    formData.append("description", description);
    formData.append("remunerationType", remunerationType);
    formData.append("level", level);
    if (commissionValue) formData.append("commission", commissionValue);
    if (salaryValue) {
      formData.append("salary", salaryValue);
      formData.append("salaryPeriod", salaryPeriod);
    }

    setSaving(true);
    try {
      if (isEdit && jobId) {
        await updateJob(jobId, formData);
        toast.success("Job updated successfully.");
      } else {
        await createJob(formData);
        toast.success("Job posted successfully.");
      }
      router.push("/careers");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to save job.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto flex w-full flex-col gap-6 px-8 py-8">
        <p className="text-sm text-black/60">Loading job details...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full  flex-col gap-6 px-8 py-8">
      <Link
        href="/careers"
        className="flex w-fit items-center gap-2 font-[family-name:var(--font-sandena)] text-base font-medium leading-[21px] text-[#003049] transition-opacity hover:opacity-80"
      >
        <Image src="/arrow/left.svg" alt="" width={24} height={24} aria-hidden="true" />
        Back to Careers
      </Link>

      <div className="flex w-[496px] flex-col gap-1">
        <h2 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
          Job Title
        </h2>
        <WhiteTextInput
          value={jobTitle}
          onChange={(value) => setJobTitle(value.slice(0, TITLE_MAX_LENGTH))}
          placeholder="Write Title"
          rightText={String(TITLE_MAX_LENGTH)}
        />
      </div>

      <div className="flex w-[496px] flex-col gap-1">
        <h2 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
          Level
        </h2>
        <FormSelectDropdown
          value={level}
          options={jobLevelOptions}
          onChange={setLevel}
          ariaLabel="Job level"
          className="w-full"
        />
      </div>

      <div className="flex w-full flex-col gap-4">
        <h2 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
          Remuneration
        </h2>
        <div className="flex flex-wrap items-start gap-8">
          <RemunerationField
            label="Commission"
            placeholder="Write Commission"
            checked={useCommission}
            onCheckedChange={setUseCommission}
            value={commission}
            onChange={setCommission}
            rightText="AED"
          />
          <RemunerationField
            label="Salary"
            placeholder="Write Salary"
            checked={useSalary}
            onCheckedChange={setUseSalary}
            value={salary}
            onChange={setSalary}
            rightText="AED"
          />
        </div>

        {useSalary ? (
          <div className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-sandena)] text-base font-medium text-[#003049]">
              Salary Period
            </span>
            <div className="flex flex-wrap items-center gap-6">
              {salaryPeriodOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={salaryPeriod === option.value}
                    onChange={() => setSalaryPeriod(option.value)}
                    className={checkboxClassName}
                  />
                  <span className="font-[family-name:var(--font-sandena)] text-base font-medium leading-[26px] text-[#003049]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="w-full">
        <RichTextEditor
          label="Job Description"
          value={description}
          onChange={setDescription}
          placeholder="Write Description"
          minHeightClass="min-h-[200px]"
        />
      </div>

      <div className="flex w-full flex-col items-end gap-3">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="flex h-[46px] items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-metallic-dark px-8 font-[family-name:var(--font-sandena)] text-base font-medium text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Update" : "Save"}
        </button>
      </div>
    </section>
  );
}
