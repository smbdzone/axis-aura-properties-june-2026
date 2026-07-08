import type { ReactNode } from "react";
import {
  LuAirVent,
  LuBuilding2,
  LuCctv,
  LuDumbbell,
  LuGem,
  LuTreePalm,
  LuWaves,
} from "react-icons/lu";
import DetailCard from "@/components/property-detail/DetailCard";
import type { PropertyDetail } from "@/components/data/propertyDetails";

type PropertyFeatureCardsProps = {
  property: PropertyDetail;
};

function FeatureRow({
  icon,
  label,
  compact = false,
  twoLine = false,
}: {
  icon: ReactNode;
  label: string;
  compact?: boolean;
  twoLine?: boolean;
}) {
  return (
    <li
      className={[
        "flex min-w-0 gap-2",
        twoLine ? "items-center" : "items-start",
      ].join(" ")}
    >
      <span className="shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span
        className={[
          "min-w-0 font-heading font-medium text-white",
          twoLine
            ? "line-clamp-2 text-sm leading-[26px]"
            : compact
              ? "text-sm leading-[26px] sm:text-base"
              : "text-base leading-[26px] sm:text-xl",
        ].join(" ")}
      >
        {label}
      </span>
    </li>
  );
}

const amenityIcons = [
  <LuGem key="gem" className="size-5 text-white" />,
  <LuDumbbell key="gym" className="size-5 text-white" />,
  <LuAirVent key="ac" className="size-5 text-white" />,
  <LuCctv key="cctv" className="size-5 text-white" />,
  <LuTreePalm key="beach" className="size-5 text-white" />,
];

export default function PropertyFeatureCards({
  property,
}: PropertyFeatureCardsProps) {
  return (
    <section
      aria-label="Property features"
      className="w-full px-6 py-8 lg:px-24"
    >
      {/* Desktop: side by side with spacing */}
      <div className="mx-auto hidden w-full max-w-[1248px] items-center justify-center gap-6 lg:flex">
        <DetailCard title="Amenities" size="side">
          <ul className="flex w-full flex-col gap-2.5">
            {property.amenities.map((amenity, index) => (
              <FeatureRow
                key={amenity}
                compact
                icon={amenityIcons[index % amenityIcons.length]}
                label={amenity}
              />
            ))}
          </ul>
        </DetailCard>

        <DetailCard title="Access" size="center">
          <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-3">
            {property.access.map((item) => (
              <FeatureRow
                key={item}
                compact
                twoLine
                icon={<LuBuilding2 className="size-5 text-white" />}
                label={item}
              />
            ))}
          </ul>
        </DetailCard>

        <DetailCard title="Views" size="side">
          <ul className="flex w-full flex-col gap-2.5">
            {property.views.map((view) => (
              <FeatureRow
                key={view}
                compact
                icon={<LuWaves className="size-5 text-white" />}
                label={view}
              />
            ))}
          </ul>
        </DetailCard>
      </div>

      {/* Mobile: stacked */}
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6 lg:hidden">
        <DetailCard title="Amenities" size="side">
          <ul className="flex w-full flex-col gap-3">
            {property.amenities.map((amenity, index) => (
              <FeatureRow
                key={amenity}
                icon={amenityIcons[index % amenityIcons.length]}
                label={amenity}
              />
            ))}
          </ul>
        </DetailCard>

        <DetailCard title="Access" size="center">
          <ul className="grid w-full grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
            {property.access.map((item) => (
              <FeatureRow
                key={item}
                compact
                twoLine
                icon={<LuBuilding2 className="size-5 text-white" />}
                label={item}
              />
            ))}
          </ul>
        </DetailCard>

        <DetailCard title="Views" size="side">
          <ul className="flex w-full flex-col gap-3">
            {property.views.map((view) => (
              <FeatureRow
                key={view}
                icon={<LuWaves className="size-5 text-white" />}
                label={view}
              />
            ))}
          </ul>
        </DetailCard>
      </div>
    </section>
  );
}
