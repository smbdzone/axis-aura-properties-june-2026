import Image from "next/image";
import type { BlogPost } from "@/components/data/blogs";
import ReadMoreLink, { BlogCardBlur } from "@/components/card/blogShared";

type FeaturedBlogCardProps = {
  post: BlogPost;
};

export default function FeaturedBlogCard({ post }: FeaturedBlogCardProps) {
  const { date, title, excerpt, image, href } = post;

  return (
    <article className="relative isolate flex min-h-[696px] w-full max-w-[506px] flex-col items-start gap-3 overflow-hidden rounded-3xl border-[1.5px] border-accent-light bg-primary p-8">
      <div
        className="absolute inset-0 rounded-3xl bg-primary"
        aria-hidden="true"
      />
      <BlogCardBlur variant="featured" />

      <div className="relative z-10 h-[281px] w-full max-w-[442px] overflow-hidden rounded-[20px] border-[1.5px] border-accent-light">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 442px"
        />
      </div>

      <time
        dateTime={date}
        className="relative z-10 font-sans text-base leading-[22px] text-white"
      >
        {date}
      </time>

      <h3 className="relative z-10 max-w-[420px] font-heading text-xl font-medium leading-[26px] text-accent-light">
        {title}
      </h3>

      <p className="relative z-10 line-clamp-8 max-w-[442px] font-sans text-base leading-[150%] text-white">
        {excerpt}
      </p>

      <ReadMoreLink href={href} className="relative z-10" />
    </article>
  );
}
