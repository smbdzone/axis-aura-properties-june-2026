"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import {
  createDeveloper,
  updateDeveloper,
  fetchDeveloperById,
} from "@/lib/api/developers";
import { ApiError, getApiBaseUrl } from "@/lib/api/client";
import { toast } from "sonner";

function resolveAssetUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${getApiBaseUrl()}${url.startsWith("/") ? url : `/${url}`}`;
}

const TITLE_MAX_LENGTH = 80;

function TitleInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative isolate flex h-[46px] w-full items-center justify-between overflow-hidden rounded-xl border-[1.5px] border-[#669BBC] bg-white px-4">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, TITLE_MAX_LENGTH))}
        placeholder="Write Title"
        className="w-full bg-transparent font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049] placeholder:text-black/60 outline-none"
      />
      <span className="font-[family-name:var(--font-sandena)] text-sm font-medium text-black/60">
        {TITLE_MAX_LENGTH}
      </span>
    </div>
  );
}

export default function DevelopersFormPage({ developerId }: { developerId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(developerId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!developerId) return;
    let active = true;

    async function loadDeveloper() {
      setLoading(true);
      try {
        const developer = await fetchDeveloperById(developerId as string);
        if (!active) return;
        setTitle(developer.title ?? "");
        setDescription(developer.description ?? "");
        setExistingLogoUrl(resolveAssetUrl(developer.logoUrl));
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

  async function handleSave() {
    setError("");

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    if (!isEdit && !logoFile) {
      toast.error("Logo image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description);
    if (logoFile) formData.append("logo", logoFile);
    formData.append("numberOfProjects", "0");
    formData.append("projectsHandedOver", "0");

    setSaving(true);
    const toastId = toast.loading(
      logoFile ? "Uploading logo to Cloudinary..." : "Saving developer...",
    );
    try {
      if (isEdit && developerId) {
        await updateDeveloper(developerId, formData);
        toast.success("Developer updated successfully.", { id: toastId });
      } else {
        await createDeveloper(formData);
        toast.success("Developer added successfully.", { id: toastId });
      }
      router.push("/developers");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to save developer.";
      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto flex w-full flex-col gap-6 px-8 py-8">
        <p className="text-sm text-black/60">Loading developer details...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full flex-col gap-6 px-8 py-8">
      <Link
        href="/developers"
        className="flex w-fit items-center gap-2 font-[family-name:var(--font-sandena)] text-base font-medium leading-[21px] text-[#003049] transition-opacity hover:opacity-80"
      >
        <Image src="/arrow/left.svg" alt="" width={24} height={24} aria-hidden="true" />
        Back to Developers
      </Link>

      <div className="flex w-full flex-col gap-4">
        <div className="flex w-[496px] flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
              Title
            </h2>
            <TitleInput value={title} onChange={setTitle} />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-[family-name:var(--font-sandena)] text-[28px] font-medium leading-[37px] text-[#003049]">
                Upload Logo
              </h2>
              <span className="font-[family-name:var(--font-sandena)] text-base font-medium text-black/60">
                (upto 250 * 75)
              </span>
            </div>
            <label className="relative flex h-[235px] w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-[#669BBC] bg-white p-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,.svg"
                disabled={saving}
                className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
              />
              {saving ? (
                <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 rounded-xl bg-white/85 backdrop-blur-sm">
                  <Icon
                    icon="line-md:loading-twotone-loop"
                    width={44}
                    height={44}
                    color="#003049"
                  />
                  <span className="font-[family-name:var(--font-sandena)] text-sm font-bold text-[#003049]">
                    {logoFile ? "Uploading logo..." : "Saving..."}
                  </span>
                </div>
              ) : null}
              <div className="pointer-events-none absolute inset-4 rounded-lg border border-dashed border-[#669BBC]" />
              {!logoFile && existingLogoUrl ? (
                <Image
                  src={existingLogoUrl}
                  alt="Current logo"
                  width={200}
                  height={75}
                  unoptimized
                  className="pointer-events-none relative z-[1] max-h-[120px] w-auto object-contain"
                />
              ) : (
                <Icon icon="material-symbols:upload" width={56} height={56} color="#000000" />
              )}
              <div className="relative z-[1] flex flex-col items-center">
                <span className="font-[family-name:var(--font-sandena)] text-xs font-bold text-black/60">
                  {logoFile
                    ? logoFile.name
                    : existingLogoUrl
                      ? "Click to replace logo"
                      : "Recommendation:"}
                </span>
                <span className="font-[family-name:var(--font-sandena)] text-[10px] font-medium text-black/60">
                  Recommend high Quality Images (Max Size 5MB)
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="w-full">
          <RichTextEditor
            label="Description"
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
      </div>
    </section>
  );
}
