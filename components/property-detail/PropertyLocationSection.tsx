import Image from "next/image";
import type { PropertyDetail } from "@/components/data/propertyDetails";

type PropertyLocationSectionProps = {
  property: PropertyDetail;
};

export default function PropertyLocationSection({
  property,
}: PropertyLocationSectionProps) {
  return (
    <section
      aria-labelledby="location-heading"
      className="w-full px-6 py-12 lg:px-24"
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8">
        <h2
          id="location-heading"
          className="text-center font-heading text-[clamp(2rem,3vw,3rem)] font-bold leading-tight text-black"
        >
          Location
        </h2>

        <div className="flex flex-col gap-[30px] lg:flex-row lg:items-center">
          <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-3xl border-[1.5px] border-accent-light lg:max-w-[500px]">
            <Image
              src={property.locationImage}
              alt={`${property.fullTitle} location`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 500px"
            />
          </div>

          <div className="relative aspect-[718/500] w-full overflow-hidden rounded-3xl border-[1.5px] border-accent-light lg:flex-1">
            <Image
              src={property.mapImage}
              alt={`Map showing ${property.fullTitle}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 718px"
            />

            <p className="absolute left-7 top-8 max-w-[384px] font-heading text-[clamp(1.25rem,2vw,2rem)] font-bold leading-8 text-primary">
              {property.fullTitle}
            </p>

            <a
              href={property.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 right-6 inline-flex h-[62px] items-center justify-center rounded-2xl border border-accent-light px-8 font-heading text-[clamp(1.25rem,2vw,2rem)] font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--gradient-dark-metallic)" }}
            >
              View On Map
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
