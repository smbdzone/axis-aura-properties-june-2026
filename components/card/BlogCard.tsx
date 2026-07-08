import Image from "next/image";
import type { BlogPost } from "@/components/data/blogs";
import ReadMoreLink, { BlogCardBlur } from "@/components/card/blogShared";

type BlogCardProps = {
  post: BlogPost;
  muted?: boolean;
};

export default function BlogCard({ post, muted = false }: BlogCardProps) {
  const { date, title, excerpt, image, href } = post;
  const textColor = muted ? "text-white/70" : "text-white";

  return (
    <article className="relative isolate flex min-h-[216px] w-full max-w-[708px] flex-col items-center gap-5 overflow-hidden rounded-3xl border-[1.5px] border-accent-light bg-primary px-8 py-4 sm:flex-row sm:gap-7">
      <div
        className="absolute inset-0 rounded-3xl bg-primary"
        aria-hidden="true"
      />
      <BlogCardBlur variant="compact" />

      <div className="relative z-10 h-[184px] w-full max-w-[289px] shrink-0 overflow-hidden rounded-[20px] border-[1.5px] border-accent-light sm:h-[184px]">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 40vw, 289px"
        />
      </div>

      <div className="relative z-10 flex min-h-[154px] flex-1 flex-col justify-between py-2">
        <div className="flex flex-col gap-2">
          <time
            dateTime={date}
            className={`font-sans text-xs leading-[17px] ${textColor}`}
          >
            {date}
          </time>

          <h3 className="max-w-[304px] font-heading text-[15px] font-medium leading-5 text-accent-light">
            {title}
          </h3>

          <p
            className={`line-clamp-2 max-w-[322px] font-sans text-xs leading-[17px] ${textColor}`}
          >
            {excerpt}
          </p>
        </div>

        <ReadMoreLink href={href} className="mt-3 self-start" />
      </div>
    </article>
  );
}
