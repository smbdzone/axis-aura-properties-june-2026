import { apiFormRequest, apiRequest } from "@/lib/api/client";

export type ApiFeature = {
  id?: string;
  icon?: string;
  iconName?: string;
  title?: string;
  isSelected?: boolean;
};

export type ApiPropertyFaq = {
  question: string;
  answer: string;
};

export type ApiPaymentPlanEntry = {
  heading: string;
  subText: string;
};

export type ApiPropertyFloor = {
  defaultLayout?: string;
  selectedUnitTypes?: string[];
};

export type ApiProperty = {
  _id: string;
  title: string;
  slug?: string;
  area?: string;
  price?: string;
  mainVideoUrl?: string;
  developer?: string;
  type?: string;
  location?: string;
  layoutType?: string;
  images?: string[];
  brochureFile?: string;
  description?: string;
  overview?: string;
  numFloors?: number;
  quarter?: string;
  year?: string;
  paymentPlans?: Record<string, ApiPaymentPlanEntry[]>;
  faqs?: ApiPropertyFaq[];
  amenities?: ApiFeature[];
  access?: ApiFeature[];
  views?: ApiFeature[];
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  seoSchema?: string;
  canonicalUrl?: string;
  status?: string;
  featured?: boolean;
  mostLuxurious?: boolean;
  floors?: Record<string, ApiPropertyFloor>;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchProperties() {
  return apiRequest<ApiProperty[]>("/api/properties");
}

export async function fetchPropertyById(id: string) {
  return apiRequest<ApiProperty>(`/api/properties/${id}`);
}

export async function createProperty(formData: FormData) {
  return apiFormRequest<ApiProperty>("/api/properties", formData, "POST");
}

export async function updateProperty(id: string, formData: FormData) {
  return apiFormRequest<ApiProperty>(`/api/properties/${id}`, formData, "PUT");
}

export async function deleteProperty(id: string) {
  return apiRequest<{ message: string }>(`/api/properties/${id}`, {
    method: "DELETE",
  });
}

export async function bulkDeleteProperties(ids: string[]) {
  return apiRequest<{ message: string }>("/api/properties/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}
