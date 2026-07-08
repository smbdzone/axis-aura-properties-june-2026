"use client";

import { useState } from "react";
import { newsCategoryBlogs } from "@/components/data/newsCategoryBlogs";
import type { NewsCategoryBlogPost } from "@/components/data/newsCategoryBlogs";
import ArticlePopUpModal from "@/components/news-and-regulations/ArticlePopUpModal";
import NewsCategoryBlogCard from "@/components/news-and-regulations/NewsCategoryBlogCard";

export default function NewsCategoryBlogs() {
  const [selectedPost, setSelectedPost] = useState<NewsCategoryBlogPost | null>(
    null,
  );

  return (
    <>
      <ArticlePopUpModal
        post={selectedPost}
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
      />

      <section
        aria-labelledby="news-category-blogs-heading"
        className="flex w-full flex-col items-center px-5 py-10 max-lg:gap-10 lg:px-24 lg:py-16"
      >
        <h2 id="news-category-blogs-heading" className="sr-only">
          News by category
        </h2>

        <div className="mx-auto flex w-full max-w-[1084px] flex-col gap-10 lg:gap-16">
          {newsCategoryBlogs.map((post) => (
            <NewsCategoryBlogCard
              key={post.id}
              post={post}
              onOpen={() => setSelectedPost(post)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
