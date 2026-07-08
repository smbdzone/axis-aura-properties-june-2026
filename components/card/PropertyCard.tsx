import Image from "next/image";
import Link from "next/link";
import { LuBuilding2, LuMapPin, LuUser } from "react-icons/lu";
import {
  PRIMARY_SHINE_SURFACE_CLASS,
  PrimaryShineLayers,
} from "@/components/ui/PrimaryShine";

export type Property = {
  id: string;
  title: string;
  location: string;
  developer: string;
  propertyType: string;
  category: "residential" | "commercial";
  subType: "apartment" | "villa" | "townhouse" | "office" | "retail";
  areaSlug: string;
  developerSlug: string;
  paymentPlan: string;
  price: string;
  image: string;
};

type PropertyCardProps = {
  property: Property;
};

function CardBlurAccents() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 -top-16 h-[757px] w-20 rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-36 top-20 h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />
    </>
  );
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    title,
    location,
    developer,
    propertyType,
    paymentPlan,
    price,
    image,
  } = property;

  return (
    <Link
      href={`/properties/${id}`}
      className="relative isolate flex w-full max-w-sm flex-col gap-4 overflow-hidden rounded-3xl border-[1.5px] border-accent-light bg-primary p-4 shadow-[0_0_40px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-95"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl bg-primary"
      />
      <CardBlurAccents />

      <div className="relative z-10 aspect-[368/295] w-full overflow-hidden rounded-3xl border-[1.5px] border-accent-light">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 400px"
        />
        <span
          className={`${PRIMARY_SHINE_SURFACE_CLASS} absolute left-5 top-6 rounded-full px-3 py-1.5 font-sans text-xs font-bold leading-none text-white sm:text-sm`}
        >
          <PrimaryShineLayers accentSize="compact" roundedClass="rounded-full" />
          <span className="relative z-10">{paymentPlan}</span>
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <h3 className="font-sans text-lg font-bold leading-tight text-accent-light sm:text-xl">
          {title}
        </h3>

        <ul className="flex flex-col gap-2 font-sans text-base leading-7 text-[#EEF0F2] sm:text-lg sm:leading-7">
          <li className="flex items-center gap-2">
            <LuMapPin className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
            {location}
          </li>
          <li className="flex items-center gap-2">
            <LuUser className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
            {developer}
          </li>
          <li className="flex items-center gap-2">
            <LuBuilding2 className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
            {propertyType}
          </li>
        </ul>

        <p className="flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-center font-heading text-sm font-bold leading-snug text-primary sm:text-base">
          {price}
        </p>
      </div>
    </Link>
  );
}
