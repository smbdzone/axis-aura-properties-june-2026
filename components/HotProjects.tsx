"use client";

import { useEffect, useMemo, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ProjectCard from "@/components/card/ProjectCard";
import {
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/components/data/projects";
import {
  PRIMARY_SHINE_SURFACE_CLASS,
  PrimaryShineLayers,
} from "@/components/ui/PrimaryShine";

const PAGE_SIZE = 3;

function CarouselButton({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? LuChevronLeft : LuChevronRight;
  const label =
    direction === "previous" ? "Previous projects" : "Next projects";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-13 w-13 items-center justify-center rounded-full border border-primary transition-opacity hover:opacity-90"
    >
      <span className="flex h-13 w-13 items-center justify-center rounded-full border border-primary">
        <Icon className="size-7 text-primary" aria-hidden="true" />
      </span>
    </button>
  );
}

export default function HotProjects() {
  const [activeCategory, setActiveCategory] =
    useState<ProjectCategory>("Residential");
  const [activePage, setActivePage] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/properties/projects")
      .then((response) => response.json())
      .then((data: { projects?: Project[] }) => {
        if (cancelled) return;
        setProjects(data.projects ?? []);
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.category === activeCategory),
    [projects, activeCategory],
  );

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));

  const visibleProjects = filteredProjects.slice(
    activePage * PAGE_SIZE,
    activePage * PAGE_SIZE + PAGE_SIZE,
  );

  const handleCategoryChange = (category: ProjectCategory) => {
    setActiveCategory(category);
    setActivePage(0);
  };

  const goToPrevious = () => {
    setActivePage((page) => (page === 0 ? totalPages - 1 : page - 1));
  };

  const goToNext = () => {
    setActivePage((page) => (page === totalPages - 1 ? 0 : page + 1));
  };

  return (
    <section
      aria-labelledby="hot-projects-heading"
      className="relative isolate flex w-full flex-col items-start gap-2.5 px-6 py-12 lg:px-24 lg:py-16"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex w-full flex-col items-start gap-0">
          <div className="relative isolate flex w-full items-center lg:min-h-[77px]">
            <h2
              id="hot-projects-heading"
              className="font-heading text-4xl font-bold leading-tight text-[#253237] sm:text-5xl sm:leading-[77px] lg:text-[56px]"
            >
              Dubai&apos;s Hottest Projects Right Now
            </h2>

            <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-3 lg:flex">
              <CarouselButton direction="previous" onClick={goToPrevious} />
              <CarouselButton direction="next" onClick={goToNext} />
            </div>
          </div>

          <div
            className={`${PRIMARY_SHINE_SURFACE_CLASS} relative mt-5 flex h-14 items-center justify-center rounded-full px-16 py-1`}
            role="tablist"
            aria-label="Project category"
          >
            <PrimaryShineLayers accentSize="button" roundedClass="rounded-full" />
            <div className="relative z-10 flex items-center gap-4">
              {projectCategories.map((category) => {
                const isActive = category === activeCategory;

                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleCategoryChange(category)}
                    className={
                      isActive
                        ? `${PRIMARY_SHINE_SURFACE_CLASS} rounded-full border-2 border-white px-4 py-2 font-sans text-sm leading-normal text-[#E0FBFC] transition-opacity hover:opacity-90`
                        : "px-1 font-sans text-lg leading-normal text-white transition-opacity hover:opacity-90"
                    }
                  >
                    {isActive ? (
                      <>
                        <PrimaryShineLayers
                          accentSize="compact"
                          roundedClass="rounded-full"
                        />
                        <span className="relative z-10">{category}</span>
                      </>
                    ) : (
                      category
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <div className="relative w-full">
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            aria-live="polite"
          >
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 lg:hidden">
            <CarouselButton direction="previous" onClick={goToPrevious} />
            <p className="font-sans text-sm text-black/50">
              {activePage + 1} / {totalPages}
            </p>
            <CarouselButton direction="next" onClick={goToNext} />
          </div>
        </div>
      </div>
    </section>
  );
}
