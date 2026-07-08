import Image from "next/image";
import type { NewsCategoryBlogPost } from "@/components/data/newsCategoryBlogs";

type NewsCategoryBlogCardProps = {
  post: NewsCategoryBlogPost;
  onOpen: () => void;
};

function CategoryBlurAccents() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[127px] -top-[128px] h-[757px] w-[78px] rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[231px] -top-[69px] h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[569px] -top-[78px] h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />
    </>
  );
}

function DesktopCardContent({
  post,
  onOpen,
}: {
  post: NewsCategoryBlogPost;
  onOpen: () => void;
}) {
  return (
    <div className="relative z-10 flex flex-col gap-2">
      <div className="relative flex flex-col gap-2 pr-0 sm:pr-28">
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:gap-1">
          <span className="shrink-0 font-heading text-[clamp(1.25rem,2vw,1.75rem)] font-bold leading-[150%] text-accent-light">
            Title:
          </span>
          <h3 className="font-heading text-[clamp(1.125rem,2vw,1.75rem)] font-medium leading-[37px] text-white">
            {post.title}
          </h3>
        </div>
        <time className="font-sans text-base leading-[200%] text-white sm:absolute sm:right-0 sm:top-3.5 sm:text-xl">
          {post.timeAgo}
        </time>
      </div>

      <p className="font-heading text-[clamp(1rem,1.75vw,1.5rem)] font-medium leading-[150%] text-white/80">
        {post.excerpt}
      </p>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
        className="inline-flex h-[38px] w-[128px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border-[1.5px] border-accent-light bg-white px-6 py-2 font-sans text-base leading-[22px] text-primary transition-opacity hover:opacity-80"
      >
        Read More
      </button>
    </div>
  );
}

function MobileCardContent({
  post,
  onOpen,
}: {
  post: NewsCategoryBlogPost;
  onOpen: () => void;
}) {
  return (
    <div className="relative z-10 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-base font-bold leading-[150%] text-accent-light">
            Title:
          </span>
          <h3 className="font-heading text-[clamp(1rem,4vw,1.25rem)] font-medium leading-snug text-white">
            {post.title}
          </h3>
        </div>
        <time className="font-sans text-sm text-white/80">{post.timeAgo}</time>
      </div>

      <p className="font-heading text-[clamp(0.9375rem,3.5vw,1.125rem)] font-medium leading-[150%] text-white/80">
        {post.excerpt}
      </p>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
        className="inline-flex h-[38px] w-full cursor-pointer items-center justify-center rounded-full border-[1.5px] border-accent-light bg-white px-6 font-sans text-base leading-[22px] text-primary transition-opacity hover:opacity-80"
      >
        Read More
      </button>
    </div>
  );
}

export default function NewsCategoryBlogCard({
  post,
  onOpen,
}: NewsCategoryBlogCardProps) {
  const imageLeft = post.imagePosition === "left";

  const categoryLabelPosition = {
    buyer: "left-[598px]",
    seller: "left-[258px]",
    investor: "left-[595px]",
  }[post.category];

  return (
    <article
      className="relative mx-auto w-full max-w-[1084px] cursor-pointer"
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Read article: ${post.title}`}
    >
      <div className="flex flex-col gap-4 lg:hidden">
        <p className="font-heading text-[clamp(1.375rem,5vw,1.75rem)] font-bold leading-tight text-primary">
          {post.categoryLabel}
        </p>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-[1.5px] border-accent-light">
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div
          className="relative isolate overflow-hidden rounded-2xl border border-accent-light p-5"
          style={{ background: "var(--gradient-dark-metallic)" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl bg-primary"
          />
          <CategoryBlurAccents />
          <MobileCardContent post={post} onOpen={onOpen} />
        </div>
      </div>

      <div className="relative mx-auto hidden min-h-[520px] w-full cursor-pointer lg:block lg:h-[475px]">
        <p
          className={`relative z-20 mb-4 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[200%] text-primary lg:absolute lg:top-[35px] lg:mb-0 ${categoryLabelPosition}`}
        >
          {post.categoryLabel}
        </p>

        <div
          className={[
            "absolute top-[72px] z-0 h-[240px] w-[240px] overflow-hidden border-[1.5px] border-accent-light sm:top-[80px] sm:h-[300px] sm:w-[300px] lg:top-0 lg:h-[400px] lg:w-[400px]",
            imageLeft ? "left-0 rounded-[20px]" : "right-0 rounded-[15px]",
          ].join(" ")}
        >
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 60vw, 400px"
          />
        </div>

        <div
          className={[
            "absolute top-[200px] z-10 w-[calc(100%-1rem)] sm:top-[220px] lg:top-[152px] lg:w-[824px]",
            imageLeft ? "left-4 sm:left-8 lg:left-[260px]" : "left-0",
          ].join(" ")}
        >
          <div
            className="relative isolate min-h-[280px] overflow-hidden rounded-[24px] border border-accent-light p-6 lg:min-h-[323px]"
            style={{ background: "var(--gradient-dark-metallic)" }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[24px] bg-primary"
            />
            <CategoryBlurAccents />
            <DesktopCardContent post={post} onOpen={onOpen} />
          </div>
        </div>
      </div>
    </article>
  );
}
