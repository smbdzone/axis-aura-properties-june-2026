"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { toast } from "sonner";
import {
  buildPropertyFormData,
  createEmptyPropertyFormData,
  type PropertyDetailsFormData,
  type PropertyFormData,
  type SpecificationFormData,
  type LayoutFormData,
} from "@/components/data/propertyFormData";
import type { FaqItem } from "@/components/data/faqData";
import type { PaymentStep } from "@/components/data/paymentPlanData";
import type { SeoFormData } from "@/components/data/seoData";
import {
  propertyFormSections,
  type PropertyFormSectionId,
} from "@/components/data/dashboardNav";
import { ApiError } from "@/lib/api/client";
import { createProperty, updateProperty } from "@/lib/api/properties";
import FaqSection from "./FaqSection";
import LayoutSection, { type LayoutPayload } from "./LayoutSection";
import PaymentPlanSection from "./PaymentPlanSection";
import PropertyDetailsSection, {
  type PropertyDetailsPayload,
} from "./PropertyDetailsSection";
import SeoSection, { type SeoPayload } from "./SeoSection";
import SpecificationSection from "./SpecificationSection";

function PropertyFormAccordion({
  sectionId,
  label,
  open,
  onToggle,
  children,
}: {
  sectionId: PropertyFormSectionId;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col gap-1">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`property-section-${sectionId}`}
        onClick={onToggle}
        className="group relative isolate flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border-[1.5px] border-accent-light bg-primary px-4 py-3 text-left transition-colors duration-300 hover:bg-primary"
      >
        <span className="relative z-[1] font-sans text-xl font-medium leading-[27px] text-white transition-colors">
          {label}
        </span>
        <IoChevronDown
          size={20}
          className={`relative z-[1] shrink-0 text-white transition-all duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            id={`property-section-${sectionId}`}
            aria-hidden={!open}
            className={`rounded-xl border-[1.5px] border-accent-light p-6 transition-[opacity,transform] duration-300 ease-in-out ${
              open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

type PropertyFormPageProps = {
  mode: "add" | "edit";
  propertyId?: string;
  initialData?: PropertyFormData;
};

export default function PropertyFormPage({
  mode,
  propertyId,
  initialData = createEmptyPropertyFormData(),
}: PropertyFormPageProps) {
  const router = useRouter();

  const [openSections, setOpenSections] = useState<Record<PropertyFormSectionId, boolean>>(
    () =>
      propertyFormSections.reduce(
        (acc, section) => {
          acc[section.id] = section.defaultOpen;
          return acc;
        },
        {} as Record<PropertyFormSectionId, boolean>,
      ),
  );

  const [details, setDetails] = useState<PropertyDetailsFormData>(initialData.details);
  const [videoUrl, setVideoUrl] = useState(initialData.videoUrl ?? "");
  const [images, setImages] = useState<File[]>([]);
  const [specification, setSpecification] = useState<SpecificationFormData>(
    initialData.specification,
  );
  const [layout, setLayout] = useState<LayoutFormData>(initialData.layout);
  const [brochure, setBrochure] = useState<File | null>(null);
  const [unitLayout, setUnitLayout] = useState<File | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<PaymentStep[]>(initialData.paymentPlan);
  const [faq, setFaq] = useState<FaqItem[]>(initialData.faq);
  const [seo, setSeo] = useState<SeoFormData>(initialData.seo);
  const [seoImage, setSeoImage] = useState<File | null>(null);

  const [status, setStatus] = useState<"active" | "inactive">(initialData.meta.status);
  const [featured, setFeatured] = useState(initialData.meta.featured);
  const [mostLuxurious, setMostLuxurious] = useState(initialData.meta.mostLuxurious);
  const [saving, setSaving] = useState(false);

  const footerCheckboxClassName =
    "size-[23px] shrink-0 appearance-none rounded-lg border border-accent-light bg-white shadow-[inset_-2px_2px_1px_rgba(0,0,0,0.16),inset_2px_-2px_1px_rgba(0,0,0,0.16),inset_2px_2px_1px_rgba(0,0,0,0.16),inset_-2px_-2px_1px_rgba(0,0,0,0.16)] checked:border-primary checked:bg-primary";

  const isEdit = mode === "edit";
  const submitLabel = isEdit ? "Update" : "Publish";

  function toggleSection(id: PropertyFormSectionId) {
    setOpenSections((current) => ({ ...current, [id]: !current[id] }));
  }

  function handleDetailsChange(payload: PropertyDetailsPayload) {
    setDetails(payload.details);
    setVideoUrl(payload.videoUrl);
    setImages(payload.images);
  }

  function handleLayoutChange(payload: LayoutPayload) {
    setLayout(payload.layout);
    setBrochure(payload.brochure);
    setUnitLayout(payload.unitLayout);
  }

  function handleSeoChange(payload: SeoPayload) {
    setSeo(payload.seo);
    setSeoImage(payload.seoImage);
  }

  async function handleSubmit() {
    if (saving) return;

    const missing: string[] = [];
    if (!details.propertyTitle.trim()) missing.push("Title");
    if (!details.area.trim()) missing.push("Area");
    if (!details.price.trim()) missing.push("Price");
    if (!details.type.trim()) missing.push("Type");
    if (!details.developer.trim()) missing.push("Developer");

    if (missing.length > 0) {
      toast.error(`Please fill required field(s): ${missing.join(", ")}.`);
      if (!openSections["property-details"]) {
        setOpenSections((current) => ({ ...current, "property-details": true }));
      }
      return;
    }

    const form: PropertyFormData = {
      id: propertyId,
      details,
      specification,
      layout,
      paymentPlan,
      faq,
      seo,
      meta: { status, featured, mostLuxurious },
    };

    const formData = buildPropertyFormData(form, videoUrl, {
      images,
      brochure,
      unitLayout,
      seoImage,
    });

    setSaving(true);
    const toastId = toast.loading(isEdit ? "Updating property..." : "Publishing property...");
    try {
      if (isEdit && propertyId) {
        await updateProperty(propertyId, formData);
        toast.success("Property updated successfully.", { id: toastId });
      } else {
        await createProperty(formData);
        toast.success("Property published successfully.", { id: toastId });
      }
      router.push("/properties");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to save property. Please try again.";
      toast.error(message, { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  function renderSectionContent(id: PropertyFormSectionId) {
    switch (id) {
      case "property-details":
        return (
          <PropertyDetailsSection
            initialData={initialData.details}
            initialVideoUrl={initialData.videoUrl}
            onChange={handleDetailsChange}
          />
        );
      case "specification":
        return (
          <SpecificationSection
            initialData={initialData.specification}
            onChange={setSpecification}
          />
        );
      case "layout":
        return (
          <LayoutSection initialData={initialData.layout} onChange={handleLayoutChange} />
        );
      case "payment-plan":
        return (
          <PaymentPlanSection initialData={initialData.paymentPlan} onChange={setPaymentPlan} />
        );
      case "faq":
        return <FaqSection initialData={initialData.faq} onChange={setFaq} />;
      case "seo":
        return <SeoSection initialData={initialData.seo} onChange={handleSeoChange} />;
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto mt-10 flex w-full flex-col gap-6 px-8 pb-8">
      <Link
        href="/properties"
        className="flex w-fit items-center gap-2 font-sans text-base font-medium leading-[21px] text-primary transition-opacity hover:opacity-80"
      >
        <Image
          src="/arrow/left.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
        />
        Back to Properties
      </Link>

      {propertyFormSections.map((section) => (
        <PropertyFormAccordion
          key={section.id}
          sectionId={section.id}
          label={section.label}
          open={openSections[section.id]}
          onToggle={() => toggleSection(section.id)}
        >
          {renderSectionContent(section.id)}
        </PropertyFormAccordion>
      ))}

      <div className="flex flex-col gap-6 border-t-[1.5px] border-accent-light pt-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-sans text-base font-medium leading-[21px] text-primary">
              Status
            </span>
            <div className="flex overflow-hidden rounded-xl border-[1.5px] border-accent-light">
              <button
                type="button"
                onClick={() => setStatus("active")}
                className={`px-5 py-2.5 font-sans text-base font-medium leading-[21px] transition-colors ${
                  status === "active"
                    ? "bg-primary text-white"
                    : "bg-white text-primary hover:bg-accent-light/10"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus("inactive")}
                className={`border-l-[1.5px] border-accent-light px-5 py-2.5 font-sans text-base font-medium leading-[21px] transition-colors ${
                  status === "inactive"
                    ? "bg-primary text-white"
                    : "bg-white text-primary hover:bg-accent-light/10"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className={footerCheckboxClassName}
            />
            <span className="font-sans text-base font-medium leading-[21px] text-primary">
              Featured
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={mostLuxurious}
              onChange={(event) => setMostLuxurious(event.target.checked)}
              className={footerCheckboxClassName}
            />
            <span className="font-sans text-base font-medium leading-[21px] text-primary">
              Most Luxurious
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-4">
          <Link
            href="/properties"
            className="flex h-[46px] items-center justify-center rounded-xl border-[1.5px] border-accent-light bg-white px-8 font-sans text-base font-medium leading-[21px] text-primary transition-colors hover:bg-accent-light/10"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="relative isolate flex h-[46px] items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-metallic-dark px-8 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="font-sans text-base font-medium leading-[21px] text-white">
              {saving ? "Saving..." : submitLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
