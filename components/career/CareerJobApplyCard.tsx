"use client";

import { FormEvent, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { LuUpload } from "react-icons/lu";
import { toast } from "sonner";
import EnquiryDropdown from "@/components/EnquiryDropdown";
import {
  CAREER_APPLY_ROLE_EVENT,
  type CareerApplyRoleDetail,
} from "@/components/career/careerApplyEvents";
import { careerApplySection } from "@/components/data/careerApply";
import { countries, defaultCountryCode, getCountryByCode } from "@/components/data/countries";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";

const PHONE_MAX_LENGTH = 12;
const MAX_CV_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB

const fieldInputClass =
  "w-full bg-transparent font-heading text-[15px] font-medium leading-none text-primary outline-none placeholder:font-heading placeholder:text-[15px] placeholder:font-medium placeholder:text-primary/60";

const fieldBoxClass =
  "flex min-h-[51px] items-center rounded-xl border-[1.5px] border-accent-light bg-white px-[15px] py-3";

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="font-heading text-[15px] font-medium leading-none text-primary">
      {children}
    </span>
  );
}

function RequiredLabel({ children }: { children: string }) {
  return (
    <span className="flex items-center gap-0.5 font-heading text-[15px] font-medium leading-none text-primary">
      {children}
      <span aria-hidden="true" className="text-xl leading-none">
        *
      </span>
    </span>
  );
}

function FieldGroup({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      {required ? <RequiredLabel>{label}</RequiredLabel> : <FieldLabel>{label}</FieldLabel>}
      {children}
    </div>
  );
}

export default function CareerJobApplyCard() {
  const { requirements, form } = careerApplySection;
  const formRef = useRef<HTMLFormElement>(null);

  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [submitting, setSubmitting] = useState(false);

  const countryId = useId();
  const roleId = useId();
  const cvInputId = useId();

  const selectedCountry = getCountryByCode(countryCode);

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.code,
        label: country.shortLabel,
      })),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadRoles() {
      try {
        const response = await fetch("/api/careers", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as {
          positions: { id: string; title: string }[];
        };
        if (isMounted) {
          setRoleOptions(
            data.positions.map((position) => ({
              value: position.id,
              label: position.title,
            })),
          );
        }
      } catch {
        // roles remain empty; the dropdown will simply show no options
      }
    }

    void loadRoles();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleApplyRole = (event: Event) => {
      const { roleId } = (event as CustomEvent<CareerApplyRoleDetail>).detail;
      if (roleOptions.some((option) => option.value === roleId)) {
        setRole(roleId);
      }
    };

    window.addEventListener(CAREER_APPLY_ROLE_EVENT, handleApplyRole);

    return () => {
      window.removeEventListener(CAREER_APPLY_ROLE_EVENT, handleApplyRole);
    };
  }, [roleOptions]);

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setCvFile(null);
      setCvFileName("");
      return;
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      event.target.value = "";
      setCvFile(null);
      setCvFileName("");
      toast.error("Only PDF files are allowed for the resume.");
      return;
    }

    if (file.size > MAX_CV_SIZE_BYTES) {
      event.target.value = "";
      setCvFile(null);
      setCvFileName("");
      toast.error("Resume must be 3 MB or smaller.");
      return;
    }

    const toastId = toast.loading("Uploading resume...");
    // Give quick visual feedback that the file is attached and valid.
    window.setTimeout(() => {
      setCvFile(file);
      setCvFileName(file.name);
      toast.success("Resume uploaded successfully.", { id: toastId });
    }, 600);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    const fullName = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();

    if (!fullName || !email || !phoneNumber.trim() || !role) {
      toast.error("Please fill in your name, email, phone and role.");
      return;
    }

    const roleLabel =
      roleOptions.find((option) => option.value === role)?.label ?? role;

    const payload = new FormData();
    payload.append("fullName", fullName);
    payload.append("email", email);
    payload.append("phone", `${selectedCountry.dialCode} ${phoneNumber.trim()}`);
    payload.append("position", roleLabel);
    payload.append("description", description);
    if (cvFile) payload.append("resume", cvFile);

    setSubmitting(true);
    const toastId = toast.loading("Submitting your application...");
    try {
      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(result.error ?? "Failed to submit application.");
      }

      toast.success("Your application has been submitted successfully.", {
        id: toastId,
      });
      formElement.reset();
      setPhoneNumber("");
      setRole("");
      setCvFileName("");
      setCvFile(null);
      setCountryCode(defaultCountryCode);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit application right now.",
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`${PRIMARY_SHINE_SURFACE_CLASS} relative isolate flex w-full flex-col items-center gap-8 rounded-3xl px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:pb-16 lg:pt-8`}
    >
      <PrimaryShineBackdrop className="rounded-3xl" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[213px] -top-[206px] h-[1072px] w-[94px] rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[134px] -top-[155px] h-[1018px] w-[127px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[514px] -top-[172px] h-[1018px] w-[127px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[879px] -top-[92px] h-[1018px] w-[127px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />
      <PrimaryShineAccents size="card" />

      {/* <h3 className="relative z-[1] text-center font-sans text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.5] text-white">
        {applyTitle}
      </h3> */}

      <div className="relative z-[2] flex w-full flex-col items-stretch justify-between gap-8 rounded-2xl border-[1.5px] border-accent-light bg-white/60 p-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:p-8 lg:flex-row lg:items-center lg:gap-8 lg:px-[88px] lg:py-8">
        <div className="mx-auto flex w-full max-w-[422px] flex-col items-center gap-6 rounded-xl border-[1.5px] border-accent-light p-4">
          <div className="flex w-full flex-col gap-4">
            <h4 className="font-sans text-[clamp(1.5rem,3vw,2rem)] font-normal capitalize leading-[1.5] text-primary">
              {requirements.title}
            </h4>
            <p className="font-sans text-[clamp(1rem,2vw,1.5rem)] font-normal capitalize leading-[1.5] text-black/60">
              {requirements.description}
            </p>
          </div>

          <button
            type="submit"
            form="career-apply-form"
            disabled={submitting}
            className={`${PRIMARY_SHINE_SURFACE_CLASS} inline-flex h-[63px] min-w-[278px] cursor-pointer items-center justify-center rounded-3xl px-8 py-4 font-heading text-2xl font-medium leading-[31px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70`}
          >
            <PrimaryShineBackdrop className="rounded-3xl" />
            <PrimaryShineAccents size="button" />
            <span className="relative z-10">
              {submitting ? "Submitting..." : requirements.ctaLabel}
            </span>
          </button>
        </div>

        <form
          id="career-apply-form"
          ref={formRef}
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-[392px] flex-col gap-2"
        >
          <FieldGroup label={form.fullNameLabel} required>
            <div className={fieldBoxClass}>
              <input
                type="text"
                name="fullName"
                required
                aria-label={form.fullNameLabel}
                className={fieldInputClass}
              />
            </div>
          </FieldGroup>

          <FieldGroup label={form.phoneLabel} required>
            <div className="flex gap-3">
              <EnquiryDropdown
                id={countryId}
                label="Country"
                value={countryCode}
                onChange={setCountryCode}
                options={countryOptions}
                variant="light"
                className="w-[93px] shrink-0"
              />
              <div className={`${fieldBoxClass} min-w-0 flex-1 gap-3`}>
                <span className="shrink-0 font-heading text-[15px] font-medium text-primary/60">
                  {selectedCountry.dialCode}
                </span>
                <span
                  className="h-3 w-px shrink-0 bg-primary/30"
                  aria-hidden="true"
                />
                <input
                  type="tel"
                  required
                  aria-label={form.phoneLabel}
                  inputMode="numeric"
                  maxLength={PHONE_MAX_LENGTH}
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(
                      event.target.value.replace(/\D/g, "").slice(0, PHONE_MAX_LENGTH),
                    )
                  }
                  className={`min-w-0 flex-1 ${fieldInputClass}`}
                />
              </div>
            </div>
          </FieldGroup>

          <FieldGroup label={form.emailLabel} required>
            <div className={fieldBoxClass}>
              <input
                type="email"
                name="email"
                required
                aria-label={form.emailLabel}
                className={fieldInputClass}
              />
            </div>
          </FieldGroup>

          <EnquiryDropdown
            id={roleId}
            label={form.roleLabel}
            value={role}
            onChange={setRole}
            options={roleOptions}
            required
            variant="light"
            labelPosition="above"
            placeholder="Select role"
            className="w-full"
          />

          <FieldGroup label={form.descriptionLabel}>
            <div className={`${fieldBoxClass} h-auto min-h-[131px] items-start`}>
              <textarea
                id="career-description"
                name="description"
                rows={3}
                aria-label={form.descriptionLabel}
                className={`min-h-[72px] resize-none ${fieldInputClass}`}
              />
            </div>
          </FieldGroup>

          <FieldGroup label={form.cvUploadLabel}>
            <div className={`${fieldBoxClass} h-auto min-h-[131px] p-0`}>
              <label
                htmlFor={cvInputId}
                className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-accent-light px-4 py-6"
              >
                <LuUpload className="size-8 text-primary" aria-hidden="true" />
                <span className="text-center font-heading text-[15px] font-medium leading-none text-primary/60">
                  {cvFileName || "Drag and Drop or browse"}
                </span>
                <span className="text-center font-heading text-xs font-medium leading-none text-primary/40">
                  PDF only, max 3 MB
                </span>
                <input
                  id={cvInputId}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="sr-only"
                  onChange={handleCvChange}
                />
              </label>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
