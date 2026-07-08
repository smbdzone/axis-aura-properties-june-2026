import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyDetailView from "@/components/property-detail/PropertyDetailView";
import {
  getAllPropertyIds,
  getPropertyDetailById,
} from "@/components/data/propertyDetails";

type PropertyPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllPropertyIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = getPropertyDetailById(id);

  if (!property) {
    return { title: "Property Not Found | Suits & Sand Real Estate" };
  }

  return {
    title: `${property.fullTitle} | Suits & Sand Real Estate`,
    description: property.overviewSummary,
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = getPropertyDetailById(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailView property={property} />;
}
