import BlogCard from "@/components/card/BlogCard";
import FeaturedBlogCard from "@/components/card/FeaturedBlogCard";
import { blogPosts, featuredBlog } from "@/components/data/blogs";

export default function RealEstateNews() {
  return (
    <section
      aria-labelledby="real-estate-news-heading"
      className="flex w-full flex-col items-start gap-2.5 px-6 py-12 lg:px-14 lg:py-16"
    >
      <div className="mx-auto flex w-full max-w-[1328px] flex-col gap-[34px]">
        <header className="flex flex-col items-start gap-3">
          <h2
            id="real-estate-news-heading"
            className="font-heading  text-4xl font-bold text-primary"
          >
            Real Estate 
            <span className="block font-heading text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.25] ">News &amp; Regulations</span>
          </h2>
          <p className="max-w-[704px] font-heading text-2xl font-medium capitalize leading-[31px] text-black/60">
            Stay updated with the latest real estate news. Explore to make
            informed decisions for your next move!
          </p>
        </header>

        <div className="flex w-full flex-col gap-4 xl:flex-row xl:justify-between xl:gap-[115px]">
          <FeaturedBlogCard post={featuredBlog} />

          <div className="flex w-full max-w-[708px] flex-col justify-between gap-4 xl:gap-4">
            {blogPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                muted={index === blogPosts.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
