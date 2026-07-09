"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError } from "@/lib/api/client";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      const from = searchParams.get("from") || "/";
      router.replace(from);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#E8F1F6_0%,#FFFFFF_50%,#E8F1F6_100%)] px-4">
      <div className="w-full max-w-md rounded-2xl border-[1.5px] border-[#669BBC] bg-white p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/Logo.svg" alt="Axis Aura" width={64} height={64} />
          <h1 className="font-[family-name:var(--font-sandena)] text-2xl font-bold text-[#003049]">
            Admin Dashboard
          </h1>
          <p className="text-center text-sm text-black/60">
            Sign in to manage properties, careers, developers, and news.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-[46px] rounded-xl border-[1.5px] border-[#669BBC] px-4 font-[family-name:var(--font-sandena)] text-sm text-[#003049] outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-[46px] rounded-xl border-[1.5px] border-[#669BBC] px-4 font-[family-name:var(--font-sandena)] text-sm text-[#003049] outline-none"
              placeholder="Enter your password"
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex h-[46px] items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-[#003049] font-[family-name:var(--font-sandena)] text-base font-bold text-white disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
