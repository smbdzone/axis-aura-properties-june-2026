"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { PropertyFormData } from "@/components/data/propertyFormData";
import {
  fetchPropertyById,
  PropertyNotFoundError,
} from "@/services/propertyService";
import PropertyFormPage from "./PropertyFormPage";

export default function EditPropertyPage() {
  const params = useParams();
  const propertyId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [initialData, setInitialData] = useState<PropertyFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProperty() {
      if (!propertyId) {
        setError("Invalid property ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchPropertyById(propertyId);
        if (!cancelled) {
          setInitialData(data);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof PropertyNotFoundError) {
            setError("Property not found.");
          } else {
            setError("Failed to load property. Please try again.");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProperty();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 px-8 py-16">
        <div className="size-8 animate-spin rounded-full border-2 border-accent-light border-t-primary" />
        <p className="font-sans text-base font-medium leading-[21px] text-primary">
          Loading property...
        </p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="mx-auto flex min-h-[40vh] w-full flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <p className="font-sans text-xl font-bold leading-[27px] text-primary">
          {error ?? "Property not found."}
        </p>
        <Link
          href="/properties"
          className="font-sans text-base font-medium leading-[21px] text-primary underline"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <PropertyFormPage
      key={propertyId}
      mode="edit"
      propertyId={propertyId}
      initialData={initialData}
    />
  );
}
