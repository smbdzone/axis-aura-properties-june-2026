"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { LuX } from "react-icons/lu";
import { toast } from "sonner";
import EnquiryDropdown from "@/components/EnquiryDropdown";
import { countries, defaultCountryCode, getCountryByCode } from "@/components/data/countries";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";

const STORAGE_KEY = "suits-sand-enquiry-dismissed";

const budgetOptions = [
  "Under AED 1M",
  "AED 1M – 3M",
  "AED 3M – 5M",
  "AED 5M+",
];

const typeOptions = ["Apartment", "Villa", "Townhouse", "Commercial"];

const PHONE_MAX_LENGTH = 12;

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
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      {required ? <RequiredLabel>{label}</RequiredLabel> : <FieldLabel>{label}</FieldLabel>}
      {children}
    </div>
  );
}

export default function EnquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const titleId = useId();
  const countryId = useId();
  const budgetId = useId();
  const typeId = useId();
  const selectedCountry = getCountryByCode(countryCode);

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.code,
        label: country.shortLabel,
      })),
    [],
  );

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dismiss]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName.trim() || !phoneNumber.trim() || !email.trim()) {
      toast.error("Please fill in your name, phone, and email.");
      return;
    }
    if (!budget) {
      toast.error("Please select your budget.");
      return;
    }
    if (!propertyType) {
      toast.error("Please select a property type.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting your enquiry...");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: `${selectedCountry.dialCode} ${phoneNumber.trim()}`,
          email: email.trim(),
          budget,
          type: propertyType,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to submit your enquiry right now.");
      }

      toast.success("Thanks! Your enquiry has been submitted. We'll be in touch soon.", {
        id: toastId,
      });
      dismiss();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit your enquiry right now. Please try again.",
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close enquiry form"
        className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-[2px]"
        onClick={dismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative isolate w-full max-w-[800px] overflow-visible rounded-[24px] border-[1.5px] border-accent-light bg-primary p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] sm:p-8"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute -right-3 -top-3 z-30 flex size-10 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-accent-light bg-primary text-white shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-opacity hover:opacity-90 sm:-right-4 sm:-top-4"
        >
          <LuX className="size-5 shrink-0 stroke-[2.5]" aria-hidden="true" />
        </button>

        <div className="relative overflow-visible rounded-[24px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[170px] -top-[131px] h-[899px] w-[78px] rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-16 -top-[117px] h-[1056px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[382px] -top-[99px] h-[1056px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
          />

          <div className="relative z-10 flex flex-col items-center gap-8 sm:flex-row sm:items-stretch sm:justify-between">
            <div className="flex w-full max-w-[352px] shrink-0 flex-col gap-4 sm:h-[520px] sm:w-[352px]">
              <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-2xl border-[1.5px] border-accent-light sm:min-h-0">
                <Image
                  src="/Inquiry.svg"
                  alt=""
                  fill
                  className="scale-105 object-cover blur-xs"
                  sizes="(max-width: 640px) 100vw, 352px"
                  priority
                />
                <div
                  className="absolute inset-0 bg-black/20"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(211.11deg, rgba(0, 0, 0, 0) 9.28%, #000000 158.46%)",
                  }}
                  aria-hidden="true"
                />

                <div className="absolute inset-x-4 top-5 z-10 flex flex-col gap-2 sm:inset-x-5 sm:top-6">
                  <p className="font-heading text-xl font-bold leading-snug text-white sm:text-5xl">
                    Privacy Note
                  </p>
                  <p className="font-heading text-sm font-medium leading-[150%] text-white/90 sm:text-xl">
                    By clicking submit, you consent to Axis Aura contacting you
                    via phone, email, or WhatsApp regarding our products and
                    services. You can opt out at any time. For more details, view
                    our{" "}
                    <Link
                      href="#"
                      className="cursor-pointer text-white underline underline-offset-2 transition-opacity hover:opacity-80"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <button
                type="submit"
                form="enquiry-form"
                disabled={submitting}
                className={`${PRIMARY_SHINE_SURFACE_CLASS} flex h-[49px] w-full shrink-0 cursor-pointer items-center justify-center rounded-3xl border border-accent-light font-heading text-2xl font-medium leading-none text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <PrimaryShineBackdrop className="rounded-3xl" />
                <PrimaryShineAccents size="button" />
                <span className="relative z-10">{submitting ? "Submitting..." : "Submit"}</span>
              </button>
            </div>

            <form
              id="enquiry-form"
              onSubmit={handleSubmit}
              className="relative flex w-full max-w-[352px] shrink-0 flex-col gap-3 overflow-visible rounded-2xl border-[1.5px] border-accent-light bg-white/60 p-4 shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:min-h-[468px] sm:w-[352px] sm:p-5"
            >
              <h3
                id={titleId}
                className="text-center font-heading text-[1.75rem] font-medium leading-tight text-primary"
              >
                Submit An Enquiry
              </h3>

              <div className="flex flex-col gap-3 overflow-visible">
                <div className="flex gap-3">
                  <FieldGroup label="First Name" required className="min-w-0 flex-1">
                    <div className={fieldBoxClass}>
                      <input
                        type="text"
                        required
                        aria-label="First name"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        className={fieldInputClass}
                      />
                    </div>
                  </FieldGroup>
                  <FieldGroup label="Last Name" required className="min-w-0 flex-1">
                    <div className={fieldBoxClass}>
                      <input
                        type="text"
                        required
                        aria-label="Last name"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        className={fieldInputClass}
                      />
                    </div>
                  </FieldGroup>
                </div>

                <FieldGroup label="Phone Number" required>
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
                        aria-label="Phone number"
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

                <FieldGroup label="Email" required>
                  <div className={fieldBoxClass}>
                    <input
                      type="email"
                      required
                      aria-label="Email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={fieldInputClass}
                    />
                  </div>
                </FieldGroup>

                <div className="flex flex-col gap-2 overflow-visible">
                  <EnquiryDropdown
                    id={budgetId}
                    label="Select Budget"
                    value={budget}
                    onChange={setBudget}
                    options={budgetOptions.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    required
                    variant="light"
                    labelPosition="above"
                    placeholder="Select budget"
                    className="w-full"
                  />
                  <EnquiryDropdown
                    id={typeId}
                    label="Type"
                    value={propertyType}
                    onChange={setPropertyType}
                    options={typeOptions.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    required
                    variant="light"
                    labelPosition="above"
                    placeholder="Select type"
                    placement="top"
                    className="w-full"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
