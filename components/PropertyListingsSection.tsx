"use client";

import { useState } from "react";
import NewProjectFilters from "@/components/new-project/NewProjectFilters";
import RecentProperties from "@/components/RecentProperties";
import SectionDivider from "@/components/SectionDivider";
import {
  defaultPropertyFilters,
  type PropertyFilterVariant,
} from "@/components/data/newProjectFilters";

type PropertyListingsSectionProps = {
  variant?: PropertyFilterVariant;
  headingId?: string;
};

export default function PropertyListingsSection({
  variant = "all",
  headingId,
}: PropertyListingsSectionProps) {
  const [filters, setFilters] = useState(defaultPropertyFilters);
  const resolvedHeadingId =
    headingId ??
    (variant === "residential"
      ? "residential-properties"
      : variant === "commercial"
        ? "commercial-properties"
        : "new-project-properties-heading");

  return (
    <>
      <NewProjectFilters
        variant={variant}
        headingId={resolvedHeadingId}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <SectionDivider />
      <RecentProperties
        showHeader={false}
        showViewMore
        category={variant === "all" ? undefined : variant}
        filters={filters}
        sectionId={resolvedHeadingId}
      />
    </>
  );
}
