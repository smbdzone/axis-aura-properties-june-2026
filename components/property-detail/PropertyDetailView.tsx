import SectionDivider from "@/components/SectionDivider";
import type { PropertyDetail } from "@/components/data/propertyDetails";
import PropertyDetailHero from "@/components/property-detail/PropertyDetailHero";
import PropertyFAQSection from "@/components/property-detail/PropertyFAQSection";
import PropertyFeatureCards from "@/components/property-detail/PropertyFeatureCards";
import PropertyLocationSection from "@/components/property-detail/PropertyLocationSection";
import PropertyOverviewSection from "@/components/property-detail/PropertyOverviewSection";
import PropertyPaymentPlan from "@/components/property-detail/PropertyPaymentPlan";

type PropertyDetailViewProps = {
  property: PropertyDetail;
};

export default function PropertyDetailView({
  property,
}: PropertyDetailViewProps) {
  return (
    <main className="relative flex flex-1 flex-col gap-16 overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[564px] top-[1024px] size-[928px] rounded-full bg-accent-light/50 blur-[250px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[1086px] top-[2780px] size-[928px] rounded-full bg-accent-light/50 blur-[250px]"
      />

      <PropertyDetailHero property={property} />

      <SectionDivider />

      <PropertyPaymentPlan property={property} />

      <PropertyFeatureCards property={property} />

      <SectionDivider />

      <PropertyOverviewSection property={property} />

      <PropertyLocationSection property={property} />

      <SectionDivider />

      <PropertyFAQSection property={property} />
    </main>
  );
}
