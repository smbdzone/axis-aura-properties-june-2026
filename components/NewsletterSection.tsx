"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Subscribing to the newsletter...");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to subscribe right now.");
      }

      toast.success("You're subscribed! Check your inbox for updates.", {
        id: toastId,
      });
      setEmail("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now. Please try again.",
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative isolate mb-8 flex w-full items-center justify-center overflow-hidden px-4 py-10 max-[700px]:min-h-0 min-[701px]:mb-12 min-[701px]:min-h-[411px] min-[701px]:px-6 lg:px-24"
      style={{
        background:
          "radial-gradient(44.31% 147.98% at 50% 50%,rgb(152, 150, 150) 0%, #669BBC 50%, #003049 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[52px] -top-[357px] hidden h-[955px] w-[103px] rotate-[29.59deg] min-[701px]:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[213px] -top-[217px] hidden h-[948px] w-[88px] rotate-[29.96deg] min-[701px]:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[510px] -top-[75px] hidden h-[948px] w-[88px] rotate-[29.96deg] min-[701px]:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[941px] -top-[172px] hidden h-[948px] w-[88px] rotate-[29.96deg] min-[701px]:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-15px] hidden h-[272px] w-[596px] -translate-x-1/2 min-[701px]:block"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-6 rounded-3xl border-[1.5px] border-accent-light bg-white/10 px-4 py-5 max-[700px]:gap-5 min-[701px]:gap-8 min-[701px]:rounded-[36px] min-[701px]:px-6 min-[701px]:py-6 lg:px-8">
        <div className="flex w-full flex-col items-center gap-3 text-center">
          <div className="flex max-w-[756px] flex-col items-center gap-1">
            <h2
              id="newsletter-heading"
              className="font-heading text-[clamp(1.5rem,6vw,3rem)] font-bold leading-tight text-white"
            >
              Find your Dream Home Today
            </h2>
            <p className="font-heading text-[clamp(1.375rem,5.5vw,3rem)] font-bold leading-tight text-white">
              Subscribe to our newsletter
            </p>
          </div>

          <p className="max-w-[856px] font-heading text-[clamp(0.9375rem,3.5vw,1.5rem)] font-medium capitalize leading-snug text-white/90 min-[701px]:leading-[31px]">
            Subscribe to our newsletters to get the latest updates, design
            insights, and exclusive offers delivered straight to your inbox.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[577px] flex-col gap-3 rounded-2xl border-[1.5px] border-accent-light bg-primary p-3 backdrop-blur-sm min-[701px]:flex-row min-[701px]:items-center min-[701px]:justify-between min-[701px]:gap-4 min-[701px]:rounded-full min-[701px]:py-2 min-[701px]:pl-4 min-[701px]:pr-2"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email..."
            className="min-w-0 flex-1 bg-transparent px-2 font-sans text-sm leading-[18px] text-white outline-none placeholder:text-white min-[701px]:px-0 min-[701px]:text-[13px]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent-light bg-white px-6 py-2 font-sans text-sm leading-4 text-[#0A0049] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60 min-[701px]:h-[37px] min-[701px]:w-auto min-[701px]:text-xs"
          >
            {submitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
