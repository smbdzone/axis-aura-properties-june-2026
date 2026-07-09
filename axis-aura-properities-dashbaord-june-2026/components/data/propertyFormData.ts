import { createInitialFaqItems, type FaqItem } from "@/components/data/faqData";
import { apartmentTypes, type ApartmentType } from "@/components/data/layoutData";
import { createInitialPaymentSteps, type PaymentStep } from "@/components/data/paymentPlanData";
import {
  accessGroup,
  amenitiesGroup,
  viewsGroup,
  type SpecificationItem,
} from "@/components/data/specificationData";
import { emptySeoFormData, type SeoFormData } from "@/components/data/seoData";
import type { ApiFeature, ApiProperty } from "@/lib/api/properties";

export type PropertyDetailsFormData = {
  propertyTitle: string;
  area: string;
  price: string;
  type: string;
  developer: string;
  location: string;
  overview: string;
};

export type SpecificationFormData = {
  amenities: SpecificationItem[];
  access: SpecificationItem[];
  views: SpecificationItem[];
};

export type LayoutFormData = {
  layoutType: string;
  floors: string;
  apartments: ApartmentType[];
};

export type PropertyFormMeta = {
  status: "active" | "inactive";
  featured: boolean;
  mostLuxurious: boolean;
};

export type PropertyFormData = {
  id?: string;
  details: PropertyDetailsFormData;
  videoUrl?: string;
  specification: SpecificationFormData;
  layout: LayoutFormData;
  paymentPlan: PaymentStep[];
  faq: FaqItem[];
  seo: SeoFormData;
  meta: PropertyFormMeta;
};

export function createEmptyPropertyDetails(): PropertyDetailsFormData {
  return {
    propertyTitle: "",
    area: "",
    price: "",
    type: "",
    developer: "",
    location: "",
    overview: "",
  };
}

export function createEmptySpecificationFormData(): SpecificationFormData {
  const unselectedItems = (items: SpecificationItem[]) =>
    items.map((item) => ({ ...item, selected: false }));

  return {
    amenities: unselectedItems(amenitiesGroup.items),
    access: unselectedItems(accessGroup.items),
    views: unselectedItems(viewsGroup.items),
  };
}

export function createEmptyLayoutFormData(): LayoutFormData {
  return {
    layoutType: "",
    floors: "",
    apartments: apartmentTypes.map((item) => ({ ...item, selected: false })),
  };
}

export function createEmptyPropertyFormData(): PropertyFormData {
  return {
    details: createEmptyPropertyDetails(),
    specification: createEmptySpecificationFormData(),
    layout: createEmptyLayoutFormData(),
    paymentPlan: createInitialPaymentSteps(),
    faq: createInitialFaqItems(),
    seo: { ...emptySeoFormData },
    meta: {
      status: "active",
      featured: false,
      mostLuxurious: false,
    },
  };
}

// -------------------------------------------------------------------------
// Backend <-> form mapping helpers
// -------------------------------------------------------------------------

const PAYMENT_PLAN_KEY = "Payment Plan";

function mergeSpecificationItems(
  defaults: SpecificationItem[],
  apiItems?: ApiFeature[],
): SpecificationItem[] {
  const result = defaults.map((item) => ({ ...item, selected: false }));
  if (!apiItems || apiItems.length === 0) return result;

  for (const feature of apiItems) {
    const title = (feature.title || "").trim();
    if (!title) continue;

    const existing = result.find(
      (item) => item.label.toLowerCase() === title.toLowerCase(),
    );

    if (existing) {
      existing.selected = feature.isSelected !== false;
      if (feature.icon) existing.icon = feature.icon;
    } else {
      result.push({
        id: feature.id || `${title}-${result.length}`,
        label: title,
        icon: feature.icon || "mdi:plus",
        selected: feature.isSelected !== false,
      });
    }
  }

  return result;
}

export function mapApiPropertyToFormData(api: ApiProperty): PropertyFormData {
  const planGroups = api.paymentPlans ? Object.values(api.paymentPlans) : [];
  const firstPlan =
    planGroups.find((group) => Array.isArray(group) && group.length > 0) ?? [];
  const paymentPlan: PaymentStep[] =
    firstPlan.length > 0
      ? firstPlan.map((entry, index) => ({
          id: `step-${index + 1}`,
          stepNumber: index + 1,
          paymentShare: entry.heading || "",
          releaseMilestone: entry.subText || "",
        }))
      : createInitialPaymentSteps();

  const faq: FaqItem[] =
    api.faqs && api.faqs.length > 0
      ? api.faqs.map((item, index) => ({
          id: `faq-${index + 1}`,
          question: item.question || "",
          answer: item.answer || "",
        }))
      : createInitialFaqItems();

  const selectedUnitTypes = api.floors?.["0"]?.selectedUnitTypes ?? [];
  const apartments = apartmentTypes.map((item) => ({
    ...item,
    selected: selectedUnitTypes.some(
      (unit) => unit.toLowerCase() === item.label.toLowerCase(),
    ),
  }));

  return {
    id: api._id,
    details: {
      propertyTitle: api.title || "",
      area: api.area || "",
      price: api.price || "",
      type: api.type || "",
      developer: api.developer || "",
      location: api.location || "",
      overview: api.overview || api.description || "",
    },
    videoUrl: api.mainVideoUrl || "",
    specification: {
      amenities: mergeSpecificationItems(amenitiesGroup.items, api.amenities),
      access: mergeSpecificationItems(accessGroup.items, api.access),
      views: mergeSpecificationItems(viewsGroup.items, api.views),
    },
    layout: {
      layoutType: api.layoutType || "",
      floors: api.numFloors ? String(api.numFloors) : "",
      apartments,
    },
    paymentPlan,
    faq,
    seo: {
      title: api.seoTitle || "",
      description: api.seoDescription || "",
      canonicalUrl: api.canonicalUrl || "",
      schema: api.seoSchema || "",
    },
    meta: {
      status: api.status === "inactive" ? "inactive" : "active",
      featured: Boolean(api.featured),
      mostLuxurious: Boolean(api.mostLuxurious),
    },
  };
}

export type PropertySubmitFiles = {
  images: File[];
  brochure: File | null;
  unitLayout: File | null;
  seoImage: File | null;
};

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveNumFloors(floors: string): number {
  if (floors === "6+") return 6;
  const parsed = parseInt(floors, 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

function specToFeatures(items: SpecificationItem[]) {
  return items
    .filter((item) => item.selected)
    .map((item) => ({
      id: item.id,
      icon: item.icon,
      iconName: item.icon,
      title: item.label,
      isSelected: true,
    }));
}

export function buildPropertyFormData(
  form: PropertyFormData,
  videoUrl: string,
  files: PropertySubmitFiles,
): FormData {
  const data = new FormData();
  const { details, specification, layout, paymentPlan, faq, seo, meta } = form;

  data.append("title", details.propertyTitle.trim());
  data.append("slug", toSlug(details.propertyTitle));
  data.append("area", details.area.trim());
  data.append("price", details.price.trim());
  data.append("type", details.type.trim());
  data.append("developer", details.developer.trim());
  data.append("location", details.location.trim());
  data.append("mainVideoUrl", videoUrl.trim());
  data.append("layoutType", layout.layoutType);
  data.append("description", details.overview);
  data.append("overview", details.overview);

  data.append("amenities", JSON.stringify(specToFeatures(specification.amenities)));
  data.append("access", JSON.stringify(specToFeatures(specification.access)));
  data.append("views", JSON.stringify(specToFeatures(specification.views)));

  const faqs = faq
    .filter((item) => item.question.trim() || item.answer.trim())
    .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }));
  data.append("faqs", JSON.stringify(faqs));

  const planEntries = paymentPlan
    .filter((step) => step.paymentShare.trim() || step.releaseMilestone.trim())
    .map((step) => ({
      heading: step.paymentShare.trim(),
      subText: step.releaseMilestone.trim(),
    }));
  data.append(
    "paymentPlans",
    JSON.stringify(planEntries.length > 0 ? { [PAYMENT_PLAN_KEY]: planEntries } : {}),
  );

  data.append("seoTitle", seo.title);
  data.append("seoDescription", seo.description);
  data.append("seoschema", seo.schema);
  data.append("canonicalUrl", seo.canonicalUrl);

  data.append("status", meta.status);
  data.append("featured", String(meta.featured));
  data.append("mostLuxurious", String(meta.mostLuxurious));

  const numFloors = resolveNumFloors(layout.floors);
  data.append("numFloors", String(numFloors));

  const selectedUnitTypes = layout.apartments
    .filter((item) => item.selected)
    .map((item) => item.label);
  for (let i = 0; i < numFloors; i += 1) {
    data.append(`floor_${i}_selectedUnitTypes`, JSON.stringify(selectedUnitTypes));
  }

  files.images.forEach((image) => data.append("propertyImages", image));
  if (files.brochure) data.append("brochureFile", files.brochure);
  if (files.seoImage) data.append("seoimage", files.seoImage);
  if (files.unitLayout) data.append("floor_0_defaultLayout", files.unitLayout);

  return data;
}
