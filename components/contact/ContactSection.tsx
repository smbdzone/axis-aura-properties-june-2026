"use client";

import { FormEvent, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  FaEnvelope,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";
import EnquiryDropdown from "@/components/EnquiryDropdown";
import {
  countries,
  defaultCountryCode,
  getCountryByCode,
} from "@/components/data/countries";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";

const fieldInputClass =
  "w-full bg-transparent font-heading text-[15px] font-medium leading-none text-primary outline-none placeholder:font-heading placeholder:text-[15px] placeholder:font-medium placeholder:text-primary/60";

const fieldBoxClass =
  "flex min-h-[51px] items-center rounded-xl border-[1.5px] border-accent-light bg-white px-[15px] py-3";

const PHONE_MAX_LENGTH = 15;

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <span className="flex items-center gap-0.5 font-heading text-[15px] font-medium leading-none text-primary">
      {children}
      {required ? (
        <span aria-hidden="true" className="text-xl leading-none">
          *
        </span>
      ) : null}
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
      <FieldLabel required={required}>{label}</FieldLabel>
      {children}
    </div>
  );
}

const contactDetails = [
  { Icon: FaPhone, label: "+971 123 123 123", href: "tel:+971123123123" },
  { Icon: FaEnvelope, label: "info@axisaura.com", href: "mailto:info@axisaura.com" },
  { Icon: FaLocationDot, label: "Dubai, Barari Lagoons, Example city, 1234" },
];

export default function ContactSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedCountry = getCountryByCode(countryCode);
  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.code,
        label: country.shortLabel,
      })),
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Sending your message...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() ? `${selectedCountry.dialCode} ${phone.trim()}` : "",
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to send your message right now.");
      }

      toast.success("Thanks for reaching out! We'll get back to you soon.", {
        id: toastId,
      });
      setFullName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send your message right now. Please try again.",
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="contact-heading"
      className="flex w-full justify-center px-4 py-12 sm:px-6 lg:px-24 lg:py-16"
    >
      <div className="flex w-full max-w-[1100px] flex-col gap-8 lg:flex-row lg:items-stretch">
        <div
          className={`${PRIMARY_SHINE_SURFACE_CLASS} relative flex w-full flex-col gap-8 rounded-3xl p-8 lg:max-w-[380px]`}
        >
          <PrimaryShineAccents size="card" />
          <div className="relative z-10 flex flex-col gap-4">
            <h1
              id="contact-heading"
              className="font-heading text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-white"
            >
              Contact Us
            </h1>
            <p className="font-heading text-base font-medium leading-relaxed text-white/70">
              Have a question about a property, a project, or working with us?
              Send us a message and our team will get back to you shortly.
            </p>
          </div>

          <ul className="relative z-10 flex flex-col gap-5">
            {contactDetails.map(({ Icon, label, href }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent-light text-white">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {href ? (
                  <a
                    href={href}
                    className="font-sans text-sm leading-5 text-white transition-opacity hover:opacity-80"
                  >
                    {label}
                  </a>
                ) : (
                  <span className="font-sans text-sm leading-5 text-white">{label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-1 flex-col gap-4 rounded-3xl border-[1.5px] border-accent-light bg-white/60 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.12)] sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <FieldGroup label="Full Name" required className="min-w-0 flex-1">
              <div className={fieldBoxClass}>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your full name"
                  className={fieldInputClass}
                />
              </div>
            </FieldGroup>
            <FieldGroup label="Email" required className="min-w-0 flex-1">
              <div className={fieldBoxClass}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={fieldInputClass}
                />
              </div>
            </FieldGroup>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <FieldGroup label="Phone Number" className="min-w-0 flex-1">
              <div className="flex gap-3">
                <EnquiryDropdown
                  id="contact-country"
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
                  <span className="h-3 w-px shrink-0 bg-primary/30" aria-hidden="true" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    maxLength={PHONE_MAX_LENGTH}
                    onChange={(event) =>
                      setPhone(event.target.value.replace(/\D/g, "").slice(0, PHONE_MAX_LENGTH))
                    }
                    placeholder="123 123 123"
                    className={`min-w-0 flex-1 ${fieldInputClass}`}
                  />
                </div>
              </div>
            </FieldGroup>
            <FieldGroup label="Subject" className="min-w-0 flex-1">
              <div className={fieldBoxClass}>
                <input
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="How can we help?"
                  className={fieldInputClass}
                />
              </div>
            </FieldGroup>
          </div>

          <FieldGroup label="Message" required>
            <div className={`${fieldBoxClass} min-h-[140px] items-start`}>
              <textarea
                required
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your message..."
                rows={5}
                className={`${fieldInputClass} resize-none leading-relaxed`}
              />
            </div>
          </FieldGroup>

          <button
            type="submit"
            disabled={submitting}
            className={`${PRIMARY_SHINE_SURFACE_CLASS} mt-2 flex h-[52px] w-full shrink-0 cursor-pointer items-center justify-center rounded-3xl font-heading text-xl font-medium leading-none text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <PrimaryShineBackdrop className="rounded-3xl" />
            <PrimaryShineAccents size="button" />
            <span className="relative z-10">{submitting ? "Sending..." : "Send Message"}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
