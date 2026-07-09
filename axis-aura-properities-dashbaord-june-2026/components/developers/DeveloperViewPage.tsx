"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchDeveloperById, type ApiDeveloper } from "@/lib/api/developers";
import { getApiBaseUrl } from "@/lib/api/client";
import { toast } from "sonner";

function resolveAssetUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${getApiBaseUrl()}${url.startsWith("/") ? url : `/${url}`}`;
}

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

export default function DeveloperViewPage({ developerId }: { developerId: string }) {
  const [developer, setDeveloper] = useState<ApiDeveloper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDeveloper() {
      setLoading(true);
      try {
        const data = await fetchDeveloperById(developerId);
        if (active) setDeveloper(data);
      } catch {
        if (active) toast.error("Failed to load developer details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDeveloper();
    return () => {
      active = false;
    };
  }, [developerId]);

  const logoUrl = resolveAssetUrl(developer?.logoUrl);

  return (
    <section className="mx-auto flex w-full flex-col gap-6 px-8 py-8">
      <Link
        href="/developers"
        className="flex w-fit items-center gap-2 font-[family-name:var(--font-sandena)] text-base font-medium leading-[21px] text-[#003049] transition-opacity hover:opacity-80"
      >
        <Image src="/arrow/left.svg" alt="" width={24} height={24} aria-hidden="true" />
        Back to Developers
      </Link>

      {loading ? (
        <p className="text-sm text-black/60">Loading developer details...</p>
      ) : !developer ? (
        <p className="text-sm text-red-600">Developer not found.</p>
      ) : (
        <div className="flex w-full max-w-[760px] flex-col gap-6 rounded-2xl border-[1.5px] border-[#669BBC] p-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-[family-name:var(--font-sandena)] text-[28px] font-bold leading-[37px] text-[#003049]">
              {developer.title}
            </h1>
            <Link
              href={`/developers/edit/${developer._id}`}
              className="flex h-[40px] shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-[#003049] px-5 font-[family-name:var(--font-sandena)] text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Edit
            </Link>
          </div>

          {logoUrl ? (
            <Field label="Logo">
              <div className="flex h-[90px] w-[220px] items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-white p-2">
                <Image
                  src={logoUrl}
                  alt={developer.title}
                  width={200}
                  height={75}
                  unoptimized
                  className="max-h-[74px] w-auto object-contain"
                />
              </div>
            </Field>
          ) : null}

          <Field label="Number of Projects">{developer.numberOfProjects ?? 0}</Field>

          <Field label="Description">
            <div
              className="prose prose-sm max-w-none text-[#003049]"
              dangerouslySetInnerHTML={{ __html: developer.description || "" }}
            />
          </Field>
        </div>
      )}
    </section>
  );
}
