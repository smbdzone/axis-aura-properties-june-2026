"use client";

import Image from "next/image";
import { useCallback, useEffect, useId } from "react";
import { LuX } from "react-icons/lu";
import type {
  ArticleBullet,
  ArticleSection,
  NewsCategoryBlogPost,
} from "@/components/data/newsCategoryBlogs";
import NewsEngagementBar from "@/components/news-and-regulations/NewsEngagementBar";

type ArticlePopUpModalProps = {
  post: NewsCategoryBlogPost | null;
  isOpen: boolean;
  onClose: () => void;
};

function ArticleBlurAccents() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[703px] -top-[1042px] h-[3391px] w-[348px] rotate-[29.59deg] bg-accent-light/50 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[495px] -top-[643px] h-[4270px] w-[535px] rotate-[29.96deg] bg-accent-light/50 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[775px] top-[944px] h-[2313px] w-[535px] rotate-[29.96deg] bg-accent-light/50 blur-[150px]"
      />
    </>
  );
}

function ArticleBullets({ bullets }: { bullets: ArticleBullet[] }) {
  return (
    <ul className="flex w-full flex-col gap-2.5">
      {bullets.map((bullet) => (
        <li key={bullet.label} className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="mt-2 size-[15px] shrink-0 rounded-full bg-primary"
          />
          <p className="font-heading text-[clamp(1.125rem,2vw,1.75rem)] font-bold leading-[120%] text-primary">
            {bullet.label} {bullet.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

function ArticleContentSection({ section }: { section: ArticleSection }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <h3 className="text-center font-heading text-[clamp(1.5rem,2.5vw,2rem)] font-bold leading-[120%] text-black">
        {section.heading}
      </h3>
      {section.intro ? (
        <p className="font-heading text-[clamp(1.125rem,2vw,1.75rem)] font-medium leading-[120%] text-black/60">
          {section.intro}
        </p>
      ) : null}
      {section.body ? (
        <p className="whitespace-pre-line font-heading text-[clamp(1.125rem,2vw,1.75rem)] font-medium leading-[120%] text-black/60">
          {section.body}
        </p>
      ) : null}
      {section.bodyHtml ? (
        <div
          className="font-heading text-[clamp(1.125rem,2vw,1.75rem)] font-medium leading-[150%] text-black/60 [&_a]:text-primary [&_a]:underline [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_li]:mb-2 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
        />
      ) : null}
      {section.bullets ? <ArticleBullets bullets={section.bullets} /> : null}
    </div>
  );
}

export default function ArticlePopUpModal({
  post,
  isOpen,
  onClose,
}: ArticlePopUpModalProps) {
  const titleId = useId();

  const dismiss = useCallback(() => {
    onClose();
  }, [onClose]);

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

  if (!isOpen || !post) return null;

  const { article } = post;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 max-lg:p-3 sm:p-6 lg:p-8"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close article"
        className="fixed inset-0 cursor-pointer bg-black/60 backdrop-blur-[2px]"
        onClick={dismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 isolate my-4 flex w-full max-w-[1248px] shrink-0 flex-col items-center gap-3 overflow-hidden rounded-[24px] border-[1.5px] border-accent-light bg-primary p-4 max-lg:my-2 max-lg:rounded-2xl sm:p-8 lg:p-12"
      >
        <ArticleBlurAccents />

        <div className="relative z-10 flex w-full max-w-[1152px] items-center justify-between gap-3">
          <p className="font-heading text-[clamp(1.75rem,4vw,3.5rem)] font-bold leading-[200%] text-white max-lg:leading-tight">
            {post.categoryLabel}
          </p>
          <button
            type="button"
            aria-label="Close article popup"
            onClick={dismiss}
            className="flex size-16 shrink-0 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-80 max-lg:size-10 sm:size-24"
          >
            <LuX className="size-10 max-lg:size-7 sm:size-14" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div className="relative flex w-full max-w-[1152px] flex-col items-center">
          <div className="relative z-0 w-full overflow-hidden rounded-[20px] border-[1.5px] border-accent-light">
            <div className="relative aspect-[1152/649] w-full">
              <Image
                src={post.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1248px) 100vw, 1152px"
                priority
              />
            </div>
          </div>

          <div className="relative z-10 -mt-10 flex w-full max-w-[1078px] flex-col items-center gap-8 rounded-[24px] border-[1.5px] border-accent-light bg-white p-6 max-lg:-mt-6 max-lg:gap-6 max-lg:p-4 sm:-mt-16 sm:p-10 lg:gap-8 lg:p-16">
            <h2
              id={titleId}
              className="w-full font-heading text-[clamp(1.75rem,4vw,3.5rem)] font-bold leading-[120%] text-primary"
            >
              {post.title}
            </h2>

            <div className="flex w-full flex-wrap items-center gap-2.5 font-heading text-[clamp(1rem,2vw,1.5rem)] font-medium leading-[120%] text-black/60">
              <span>Published: {post.timeAgo}</span>
              <span
                aria-hidden="true"
                className="h-6 w-0 border-l-4 border-primary"
              />
              <span>Category: {post.categoryMeta}</span>
            </div>

            <div className="flex w-full flex-col gap-8">
              {[article.overview, article.pros, article.cons, article.takeaway]
                .filter(
                  (section) =>
                    section &&
                    (section.intro ||
                      section.body ||
                      section.bodyHtml ||
                      (section.bullets && section.bullets.length > 0)),
                )
                .map((section, index) => (
                  <ArticleContentSection key={index} section={section} />
                ))}
            </div>

            <NewsEngagementBar variant="page" />
          </div>
        </div>
      </div>
    </div>
  );
}
