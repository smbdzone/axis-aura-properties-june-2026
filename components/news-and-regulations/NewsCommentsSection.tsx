"use client";

import { FormEvent, useState } from "react";
import {
  currentCommentUser,
  newsComments,
  type NewsComment,
} from "@/components/data/newsComments";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";
import NewsEngagementBar from "@/components/news-and-regulations/NewsEngagementBar";
import CommentThankYouModal from "@/components/news-and-regulations/CommentThankYouModal";

const COMMENTS_BATCH_SIZE = 3;

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
  const [visibleCount, setVisibleCount] = useState(COMMENTS_BATCH_SIZE);
  const [draft, setDraft] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const visibleComments = newsComments.slice(0, visibleCount);
  const hasMoreComments = visibleCount < newsComments.length;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    setDraft("");
    setShowThankYou(true);
  };

  const handleViewMore = () => {
    setVisibleCount((current) =>
      Math.min(current + COMMENTS_BATCH_SIZE, newsComments.length),
    );
  };

  return (
    <>
      <CommentThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
      />

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
              <div className="mb-4 flex items-center gap-1">
                <CommentAvatar name={currentCommentUser.name} />
                <span className="font-sans text-xl leading-7 text-[#333333]">
                  {currentCommentUser.name}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-[600px]">
                <label htmlFor="comment-draft" className="sr-only">
                  Write a comment
                </label>
                <div
                  className={`${PRIMARY_SHINE_SURFACE_CLASS} relative min-h-[180px] w-full rounded-[24px]`}
                >
                  <PrimaryShineBackdrop className="rounded-[24px]" />
                  <PrimaryShineAccents size="button" />
                  <textarea
                    id="comment-draft"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="what’s on your mind?"
                    className="relative z-10 min-h-[180px] w-full resize-none rounded-[24px] bg-transparent p-6 pb-16 font-sans text-base leading-[22px] text-white outline-none placeholder:text-white/60"
                  />
                  <button
                    type="submit"
                    className="absolute bottom-5 right-5 z-10 inline-flex h-[49px] min-w-[109px] cursor-pointer items-center justify-center rounded-2xl border-[1.5px] border-accent-light bg-white px-8 py-3 font-heading text-2xl font-medium leading-[31px] text-primary transition-opacity hover:opacity-90"
                  >
                    Post
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
