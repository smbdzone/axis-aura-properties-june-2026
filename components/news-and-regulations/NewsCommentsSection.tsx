"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { type NewsComment } from "@/components/data/newsComments";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";
import NewsEngagementBar from "@/components/news-and-regulations/NewsEngagementBar";

const COMMENTS_BATCH_SIZE = 3;

const commentInputClass =
  "w-full rounded-xl border-[1.5px] border-accent-light bg-white px-4 py-3 font-sans text-base leading-[22px] text-primary outline-none placeholder:text-primary/50";

function CommentAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent-light bg-primary/10 font-sans text-sm font-medium text-primary"
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function CommentItem({ comment }: { comment: NewsComment }) {
  return (
    <article className="relative w-full pb-6 pt-2">
      <div className="relative z-10 border-b-2 border-l-2 border-primary/60 bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <CommentAvatar name={comment.author} />
          <div className="flex flex-col">
            <p className="font-heading text-xl font-bold leading-[27px] text-[#333333]">
              {comment.author}
            </p>
            <time className="font-sans text-sm leading-[19px] text-[#333333]/50">
              {comment.date}
            </time>
          </div>
        </div>

        <div className="mt-4 pl-0 sm:pl-[52px]">
          <p className="font-sans text-[clamp(1rem,2vw,1.5rem)] leading-[26px] text-black/60">
            {comment.body}
          </p>
          <div className="mt-4">
            <NewsEngagementBar
              variant="comment"
              showReply
              likes={comment.likes}
              comments={comment.replies}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NewsCommentsSection() {
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_BATCH_SIZE);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/comments")
      .then((response) => response.json())
      .then((data: { comments?: NewsComment[] }) => {
        if (!cancelled) setComments(data.comments ?? []);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleComments = comments.slice(0, visibleCount);
  const hasMoreComments = visibleCount < comments.length;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !draft.trim()) {
      toast.error("Please add your name, email, and comment.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Sending your comment...");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name.trim(),
          email: email.trim(),
          content: draft.trim(),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to submit your comment right now.");
      }

      toast.success("Your comment has been sent to the super admin for approval.", {
        id: toastId,
      });
      setDraft("");
      setName("");
      setEmail("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit your comment right now. Please try again.",
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewMore = () => {
    setVisibleCount((current) =>
      Math.min(current + COMMENTS_BATCH_SIZE, comments.length),
    );
  };

  return (
    <>
      <section
        aria-label="Article engagement"
        className="flex w-full flex-col items-center px-5 pb-8 pt-2.5 max-lg:px-5 lg:px-24 lg:pb-12"
      >
        <div className="mx-auto w-full max-w-[1248px]">
          <NewsEngagementBar variant="page" />
        </div>
      </section>

      <div className="w-full px-5 max-lg:px-5 lg:px-24" aria-hidden="true">
        <div className="mx-auto w-full max-w-[1248px]">
          <div className="h-0.5 w-full bg-primary" />
          <div className="h-1 w-full bg-accent-light" />
        </div>
      </div>

      <section
        aria-labelledby="reviews-comments-heading"
        className="flex w-full flex-col items-center px-5 py-10 max-lg:gap-8 lg:px-24 lg:py-16"
      >
        <div className="mx-auto flex w-full max-w-[883px] flex-col items-center gap-12 lg:gap-16">
          <h2
            id="reviews-comments-heading"
            className="w-full text-center font-heading text-[clamp(2rem,4vw,3rem)] font-medium text-primary max-lg:leading-tight lg:leading-[63px]"
          >
            Reviews and Comments
          </h2>

          <div className="flex w-full flex-col items-center gap-10 max-lg:gap-8 lg:gap-16">
            <div className="relative w-full">
              <form onSubmit={handleSubmit} className="relative mx-auto flex w-full max-w-[600px] flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="comment-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="comment-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className={commentInputClass}
                  />
                  <label htmlFor="comment-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="comment-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className={commentInputClass}
                  />
                </div>

                <label htmlFor="comment-draft" className="sr-only">
                  Write a comment
                </label>
                <div className="relative min-h-[180px] w-full rounded-[24px] border-[1.5px] border-accent-light bg-white">
                  <textarea
                    id="comment-draft"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="what’s on your mind?"
                    className="relative z-10 min-h-[180px] w-full resize-none rounded-[24px] bg-transparent p-6 pb-16 font-sans text-base leading-[22px] text-primary outline-none placeholder:text-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="absolute bottom-5 right-5 z-10 inline-flex h-[49px] min-w-[109px] cursor-pointer items-center justify-center rounded-2xl border-[1.5px] border-accent-light bg-primary px-8 py-3 font-heading text-2xl font-medium leading-[31px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex w-full flex-col gap-4">
              {visibleComments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>

            {hasMoreComments ? (
              <button
                type="button"
                onClick={handleViewMore}
                className={`${PRIMARY_SHINE_SURFACE_CLASS} inline-flex h-[63px] min-w-[278px] cursor-pointer items-center justify-center rounded-3xl px-8 py-4 font-heading text-2xl font-medium leading-[31px] text-white transition-opacity hover:opacity-90 max-lg:h-[54px] max-lg:w-full max-lg:max-w-[300px] max-lg:text-xl`}
              >
                <PrimaryShineBackdrop className="rounded-3xl" />
                <PrimaryShineAccents size="button" />
                <span className="relative z-10">View More</span>
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
