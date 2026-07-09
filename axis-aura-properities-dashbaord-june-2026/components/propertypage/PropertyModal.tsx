"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import type { PropertyFormData } from "@/components/data/propertyFormData";
import { fetchPropertyById } from "@/services/propertyService";

type PropertyModalProps = {
  open: boolean;
  propertyId: string | null;
  onClose: () => void;
};

function ViewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-sm font-medium leading-[19px] text-primary">
        {label}
      </span>
      <div className="flex min-h-[46px] items-center rounded-xl border-[1.5px] border-accent-light bg-white px-4 py-2.5">
        <span className="font-sans text-sm font-medium leading-[18px] text-primary">
          {value || "—"}
        </span>
      </div>
    </div>
  );
}

function ViewTextarea({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-sm font-medium leading-[19px] text-primary">
        {label}
      </span>
      <div className="min-h-[100px] rounded-xl border-[1.5px] border-accent-light bg-white p-4">
        <p className="whitespace-pre-wrap font-sans text-sm font-medium leading-[18px] text-primary">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border-[1.5px] border-accent-light p-5">
      <h3 className="font-sans text-lg font-bold leading-6 text-primary">{title}</h3>
      {children}
    </section>
  );
}

function ChipList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <span className="font-sans text-sm font-medium leading-[18px] text-primary/60">
        None selected
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-lg border border-accent-light bg-white px-3 py-1.5 font-sans text-xs font-medium leading-4 text-primary"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function PropertyFullView({ property }: { property: PropertyFormData }) {
  const selectedAmenities = property.specification.amenities
    .filter((item) => item.selected)
    .map((item) => item.label);
  const selectedAccess = property.specification.access
    .filter((item) => item.selected)
    .map((item) => item.label);
  const selectedViews = property.specification.views
    .filter((item) => item.selected)
    .map((item) => item.label);
  const selectedApartments = property.layout.apartments
    .filter((item) => item.selected)
    .map((item) => item.label);

  return (
    <div className="flex flex-col gap-5">
      <SectionBlock title="Property Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ViewField label="Property Title" value={property.details.propertyTitle} />
          <ViewField label="Area" value={property.details.area} />
          <ViewField label="Price" value={property.details.price} />
          <ViewField label="Type" value={property.details.type} />
          <ViewField label="Developer" value={property.details.developer} />
          <ViewField label="Location" value={property.details.location} />
        </div>
        <ViewTextarea label="Overview" value={property.details.overview} />
      </SectionBlock>

      <SectionBlock title="Specification">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm font-bold leading-[19px] text-primary">
              Amenities
            </span>
            <ChipList items={selectedAmenities} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm font-bold leading-[19px] text-primary">
              Access
            </span>
            <ChipList items={selectedAccess} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-sm font-bold leading-[19px] text-primary">
              Views
            </span>
            <ChipList items={selectedViews} />
          </div>
        </div>
      </SectionBlock>

      <SectionBlock title="Layout">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ViewField label="Layout Type" value={property.layout.layoutType} />
          <ViewField label="No: of Floors" value={property.layout.floors} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-sans text-sm font-bold leading-[19px] text-primary">
            Available Apartments
          </span>
          <ChipList items={selectedApartments} />
        </div>
      </SectionBlock>

      <SectionBlock title="Payment Plan">
        {property.paymentPlan.length === 0 ? (
          <span className="font-sans text-sm font-medium text-primary/60">No steps added</span>
        ) : (
          <div className="flex flex-col gap-3">
            {property.paymentPlan.map((step, index) => (
              <div
                key={step.id}
                className="grid grid-cols-1 gap-3 rounded-lg border border-accent-light bg-white p-4 md:grid-cols-2"
              >
                <ViewField
                  label={`Step ${index + 1} — Payment Share`}
                  value={step.paymentShare}
                />
                <ViewField
                  label={`Step ${index + 1} — Release Milestone`}
                  value={step.releaseMilestone}
                />
              </div>
            ))}
          </div>
        )}
      </SectionBlock>

      <SectionBlock title="FAQ's">
        {property.faq.length === 0 ? (
          <span className="font-sans text-sm font-medium text-primary/60">No FAQs added</span>
        ) : (
          <div className="flex flex-col gap-4">
            {property.faq.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-lg border border-accent-light bg-white p-4">
                <ViewField label={`Question ${index + 1}`} value={item.question} />
                <ViewField label={`Answer ${index + 1}`} value={item.answer} />
              </div>
            ))}
          </div>
        )}
      </SectionBlock>

      <SectionBlock title="SEO Field">
        <div className="flex flex-col gap-4">
          <ViewField label="Title" value={property.seo.title} />
          <ViewTextarea label="Description" value={property.seo.description} />
          <ViewField label="Canonical URL" value={property.seo.canonicalUrl} />
          <ViewTextarea label="Schema" value={property.seo.schema} />
        </div>
      </SectionBlock>

      <SectionBlock title="Publishing">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ViewField
            label="Status"
            value={property.meta.status === "active" ? "Active" : "Inactive"}
          />
          <ViewField label="Featured" value={property.meta.featured ? "Yes" : "No"} />
          <ViewField
            label="Most Luxurious"
            value={property.meta.mostLuxurious ? "Yes" : "No"}
          />
        </div>
      </SectionBlock>
    </div>
  );
}

export default function PropertyModal({
  open,
  propertyId,
  onClose,
}: PropertyModalProps) {
  const [property, setProperty] = useState<PropertyFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || propertyId === null) {
      setProperty(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPropertyById(propertyId!);
        if (!cancelled) setProperty(data);
      } catch {
        if (!cancelled) setError("Failed to load property details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [open, propertyId]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || propertyId === null) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 p-4 md:p-8"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-modal-title"
        className="relative isolate flex max-h-[92vh] w-full max-w-[960px] flex-col overflow-hidden rounded-2xl border-[1.5px] border-accent-light bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-accent-light px-6 py-5">
          <div className="flex flex-col gap-1">
            <h2
              id="property-modal-title"
              className="font-sans text-2xl font-bold leading-[33px] text-primary"
            >
              {property?.details.propertyTitle ?? "View Property"}
            </h2>
            <p className="font-sans text-sm font-medium leading-[19px] text-black/60">
              Full property overview — all form sections
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-accent-light text-primary transition-colors hover:bg-accent-light/10"
          >
            <Icon icon="mdi:close" width={20} height={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="size-8 animate-spin rounded-full border-2 border-accent-light border-t-primary" />
              <p className="font-sans text-sm font-medium text-primary">Loading property...</p>
            </div>
          )}

          {error && (
            <p className="py-16 text-center font-sans text-sm font-medium text-primary">
              {error}
            </p>
          )}

          {!loading && !error && property && <PropertyFullView property={property} />}
        </div>

        <div className="flex shrink-0 items-center justify-end border-t border-accent-light px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border-[1.5px] border-accent-light px-6 py-2.5 font-sans text-sm font-medium leading-[19px] text-primary transition-colors hover:bg-accent-light/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
