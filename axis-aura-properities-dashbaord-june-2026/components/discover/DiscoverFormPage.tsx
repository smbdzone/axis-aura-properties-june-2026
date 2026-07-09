"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createDiscover,
  fetchDiscoverById,
  updateDiscover,
} from "@/lib/api/discover";
import { ApiError } from "@/lib/api/client";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-[#669BBC] bg-white px-4 py-3 font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049] outline-none placeholder:text-black/40";

const MAX_VIDEO_BYTES = 150 * 1024 * 1024; // 150MB

export default function DiscoverFormPage({
  discoverId,
}: {
  discoverId?: string;
}) {
  const router = useRouter();
  const isEditing = Boolean(discoverId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingItem, setLoadingItem] = useState(Boolean(discoverId));

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!discoverId) return;
    let active = true;

    async function loadItem(id: string) {
      setLoadingItem(true);
      try {
        const item = await fetchDiscoverById(id);
        if (!active) return;
        setTitle(item.title ?? "");
        setDescription(item.description ?? "");
        setVideoUrl(item.videoUrl ?? "");
        setThumbnailUrl(item.thumbnailUrl ?? "");
      } catch {
        if (active) toast.error("Failed to load video.");
      } finally {
        if (active) setLoadingItem(false);
      }
    }

    void loadItem(discoverId);
    return () => {
      active = false;
    };
  }, [discoverId]);

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file && !file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      event.target.value = "";
      return;
    }
    if (file && file.size > MAX_VIDEO_BYTES) {
      toast.error("Video is too large. Maximum size is 150MB.");
      event.target.value = "";
      return;
    }
    setVideoFile(file);
  };

  const handleThumbFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file for the thumbnail.");
      event.target.value = "";
      return;
    }
    setThumbnailFile(file);
  };

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    const hasVideo = Boolean(videoFile) || Boolean(videoUrl.trim());
    if (!isEditing && !hasVideo) {
      toast.error("Upload a video file or paste a video URL.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (videoFile) {
      formData.append("video", videoFile);
    } else if (videoUrl.trim()) {
      formData.append("videoUrl", videoUrl.trim());
    }
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    } else {
      formData.append("thumbnailUrl", thumbnailUrl.trim());
    }

    setSaving(true);
    const uploading = Boolean(videoFile) || Boolean(thumbnailFile);
    const toastId = toast.loading(
      uploading
        ? "Uploading video to Cloudinary..."
        : isEditing
          ? "Updating video..."
          : "Adding video...",
    );
    try {
      if (isEditing && discoverId) {
        await updateDiscover(discoverId, formData);
        toast.success("Discover video updated successfully.", { id: toastId });
      } else {
        await createDiscover(formData);
        toast.success("Discover video added successfully.", { id: toastId });
      }
      router.push("/discover");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to save Discover video.";
      toast.error(message, { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  if (loadingItem) {
    return (
      <section className="mx-auto flex w-full flex-col items-center gap-4 px-8 py-8">
        <p className="self-start font-[family-name:var(--font-sandena)] text-sm font-medium text-black/60">
          Loading video...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full flex-col gap-6 px-8 py-8">
      <Link
        href="/discover"
        className="flex w-fit items-center gap-2 font-[family-name:var(--font-sandena)] text-base font-medium leading-[21px] text-[#003049] transition-opacity hover:opacity-80"
      >
        <Image src="/arrow/left.svg" alt="" width={24} height={24} aria-hidden="true" />
        Back to Discover
      </Link>

      <div className="flex w-full max-w-[760px] flex-col gap-4 rounded-2xl border-[1.5px] border-accent-light p-6">
        <h2 className="font-[family-name:var(--font-sandena)] text-2xl font-bold text-primary">
          {isEditing ? "Edit Discover Video" : "Add a Discover Video"}
        </h2>

        <div className="flex flex-col gap-1">
          <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Discover Downtown Dubai"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-[family-name:var(--font-sandena)] text-sm font-medium text-[#003049]">
            Description
          </label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short description shown next to the video"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex flex-col gap-2 rounded-xl border-[1.5px] border-accent-light/70 p-4">
          <label className="font-[family-name:var(--font-sandena)] text-sm font-bold text-[#003049]">
            Video {isEditing ? "" : <span className="text-red-500">*</span>}
          </label>
          <p className="font-[family-name:var(--font-sandena)] text-xs text-black/50">
            Upload a video file (saved to Cloudinary, max 150MB) or paste a video URL.
          </p>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoFileChange}
            className="font-[family-name:var(--font-sandena)] text-sm text-[#003049] file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
          />
          {videoFile ? (
            <p className="font-[family-name:var(--font-sandena)] text-xs font-medium text-primary">
              Selected: {videoFile.name}
            </p>
          ) : (
            <input
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://... (video URL)"
              className={inputClass}
            />
          )}
        </div>

        <div className="flex flex-col gap-2 rounded-xl border-[1.5px] border-accent-light/70 p-4">
          <label className="font-[family-name:var(--font-sandena)] text-sm font-bold text-[#003049]">
            Thumbnail (optional)
          </label>
          <p className="font-[family-name:var(--font-sandena)] text-xs text-black/50">
            A poster image shown before the video plays. Upload an image or paste an image URL.
          </p>
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbFileChange}
            className="font-[family-name:var(--font-sandena)] text-sm text-[#003049] file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
          />
          {thumbnailFile ? (
            <p className="font-[family-name:var(--font-sandena)] text-xs font-medium text-primary">
              Selected: {thumbnailFile.name}
            </p>
          ) : (
            <input
              value={thumbnailUrl}
              onChange={(event) => setThumbnailUrl(event.target.value)}
              placeholder="https://... (thumbnail image URL)"
              className={inputClass}
            />
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="flex h-[46px] items-center justify-center rounded-xl border-[1.5px] border-[#669BBC] bg-metallic-dark px-8 font-[family-name:var(--font-sandena)] text-base font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : isEditing ? "Update Video" : "Add Video"}
          </button>
        </div>
      </div>
    </section>
  );
}
