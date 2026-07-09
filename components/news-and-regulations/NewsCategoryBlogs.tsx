"use client";

import { useEffect, useMemo, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { NewsCategoryBlogPost } from "@/components/data/newsCategoryBlogs";
import ArticlePopUpModal from "@/components/news-and-regulations/ArticlePopUpModal";
import NewsCategoryBlogCard from "@/components/news-and-regulations/NewsCategoryBlogCard";

const POSTS_PER_PAGE = 3;

function NewsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav
      aria-label="Article pages"
      className="flex flex-wrap items-center justify-center gap-3"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex size-11 cursor-pointer items-center justify-center rounded-full border-2 border-accent-light bg-white text-primary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <LuChevronLeft className="size-5" aria-hidden="true" />
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex size-11 cursor-pointer items-center justify-center rounded-full border-2 font-heading text-lg font-medium transition-opacity hover:opacity-90",
              isActive
                ? "border-accent-light bg-primary text-white"
                : "border-accent-light bg-white text-primary",
            ].join(" ")}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex size-11 cursor-pointer items-center justify-center rounded-full border-2 border-accent-light bg-white text-primary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <LuChevronRight className="size-5" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default function NewsCategoryBlogs() {
  const [posts, setPosts] = useState<NewsCategoryBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<NewsCategoryBlogPost | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/articles")
      .then((response) => response.json())
      .then((data: { posts?: NewsCategoryBlogPost[] }) => {
        if (!cancelled) {
          setPosts(data.posts ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

  const visiblePosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return posts.slice(start, start + POSTS_PER_PAGE);
  }, [posts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

        {isLoading ? (
          <p className="font-heading text-lg font-medium text-black/50">
            Loading articles...
          </p>
        ) : posts.length === 0 ? (
          <p className="font-heading text-lg font-medium text-black/50">
            No articles have been published yet.
          </p>
        ) : (
          <div className="mx-auto flex w-full max-w-[1084px] flex-col gap-10 lg:gap-16">
            {visiblePosts.map((post) => (
              <NewsCategoryBlogCard
                key={post.id}
                post={post}
                onOpen={() => setSelectedPost(post)}
              />
            ))}

            {totalPages > 1 ? (
              <div className="mt-2 flex w-full justify-center lg:mt-4">
                <NewsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : null}
          </div>
        )}
      </section>
    </>
  );
}
