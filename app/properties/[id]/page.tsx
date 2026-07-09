import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyDetailView from "@/components/property-detail/PropertyDetailView";
import { fetchPropertyDetail } from "@/components/data/fetchPropertyDetail";

export const dynamic = "force-dynamic";

type PropertyPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await fetchPropertyDetail(id);

  if (!property) {
    return { title: "Property Not Found | Axis Aura Real Estate" };
  }

  return {
    title: `${property.fullTitle} | Axis Aura Real Estate`,
    description: property.overviewSummary,
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await fetchPropertyDetail(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailView property={property} />;
}
