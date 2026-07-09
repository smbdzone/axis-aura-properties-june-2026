"use client";

import { useEffect, useMemo, useState } from "react";
import type { Property } from "@/components/card/PropertyCard";
import NewProjectFilters from "@/components/new-project/NewProjectFilters";
import RecentProperties from "@/components/RecentProperties";
import SectionDivider from "@/components/SectionDivider";
import {
  areaFilterOptions,
  defaultPropertyFilters,
  developerFilterOptions,
  type NewProjectFilterOption,
  type PropertyFilterVariant,
} from "@/components/data/newProjectFilters";

type PropertyListingsSectionProps = {
  variant?: PropertyFilterVariant;
  headingId?: string;
};

function buildOptions(
  properties: Property[],
  getSlug: (property: Property) => string,
  getLabel: (property: Property) => string,
): NewProjectFilterOption[] {
  const seen = new Map<string, string>();
  for (const property of properties) {
    const slug = getSlug(property);
    const label = getLabel(property);
    if (slug && !seen.has(slug)) {
      seen.set(slug, label);
    }
  }

  const options = Array.from(seen.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return [{ value: "all", label: "All" }, ...options];
}

export default function PropertyListingsSection({
  variant = "all",
  headingId,
}: PropertyListingsSectionProps) {
  const [filters, setFilters] = useState(defaultPropertyFilters);
  const [properties, setProperties] = useState<Property[] | null>(null);

  useEffect(() => {
    const searchParam = new URLSearchParams(window.location.search).get("search");
    if (searchParam) {
      setFilters((current) => ({ ...current, searchQuery: searchParam }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/properties")
      .then((response) => response.json())
      .then((data: { properties?: Property[] }) => {
        if (!cancelled) setProperties(data.properties ?? []);
      })
      .catch(() => {
        if (!cancelled) setProperties([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const scopedProperties = useMemo(() => {
    if (!properties) return [];
    if (variant === "all") return properties;
    return properties.filter((property) => property.category === variant);
  }, [properties, variant]);

  const areaOptions = useMemo(
    () =>
      scopedProperties.length > 0
        ? buildOptions(scopedProperties, (p) => p.areaSlug, (p) => p.location)
        : areaFilterOptions,
    [scopedProperties],
  );

  const developerOptions = useMemo(
    () =>
      scopedProperties.length > 0
        ? buildOptions(scopedProperties, (p) => p.developerSlug, (p) => p.developer)
        : developerFilterOptions,
    [scopedProperties],
  );

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
        areaOptions={areaOptions}
        developerOptions={developerOptions}
      />
      <SectionDivider />
      <RecentProperties
        showHeader={false}
        showViewMore
        category={variant === "all" ? undefined : variant}
        filters={filters}
        sectionId={resolvedHeadingId}
        initialProperties={properties ?? undefined}
      />
    </>
  );
}
