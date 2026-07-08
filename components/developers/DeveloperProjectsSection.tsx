"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectCard from "@/components/card/ProjectCard";
import { filterProjects } from "@/components/data/projects";
import type { Project } from "@/components/data/projects";
import {
  defaultPropertyFilters,
  type PropertyFilterValues,
} from "@/components/data/newProjectFilters";
import NewProjectFilters from "@/components/new-project/NewProjectFilters";
import SectionDivider from "@/components/SectionDivider";

type DeveloperProjectsSectionProps = {
  developerId: string;
  developerName: string;
};

type ProjectsResponse = {
  developer: {
    id: string;
    name: string;
  };
  projects: Project[];
};

export default function DeveloperProjectsSection({
  developerId,
  developerName,
}: DeveloperProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilterValues>({
    ...defaultPropertyFilters,
    developer: developerId,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchDeveloperProjects() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/developers/${developerId}/projects`);

        if (!response.ok) {
          throw new Error("Failed to load developer projects");
        }

        const data = (await response.json()) as ProjectsResponse;

        if (isMounted) {
          setProjects(data.projects);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load projects right now. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDeveloperProjects();

    return () => {
      isMounted = false;
    };
  }, [developerId]);

  const filteredProjects = useMemo(
    () => filterProjects(projects, filters),
    [projects, filters],
  );

  return (
    <>
      <NewProjectFilters
        sectionId="developer-projects"
        headingId="developer-projects-heading"
        filters={filters}
        onFiltersChange={setFilters}
        showHeading={false}
        lockedDeveloper={{
          id: developerId,
          label: developerName,
        }}
      />
      <SectionDivider />

      <section
        aria-label={`${developerName} projects`}
        className="flex w-full justify-center px-6 py-12 lg:px-24"
      >
        <div className="flex w-full max-w-[1248px] flex-col gap-8">
          {isLoading ? (
            <p className="text-center font-sans text-lg text-black/50">
              Loading projects...
            </p>
          ) : null}

          {error ? (
            <p className="text-center font-sans text-lg text-red-600">{error}</p>
          ) : null}

          {!isLoading && !error && filteredProjects.length === 0 ? (
            <p className="text-center font-sans text-lg text-black/50">
              No projects match your filters. Try adjusting area or property
              type.
            </p>
          ) : null}

          {!isLoading && !error && filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
