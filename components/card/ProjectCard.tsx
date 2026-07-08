import Image from "next/image";
import { LuBuilding2, LuMapPin, LuUser } from "react-icons/lu";
import type { Project } from "@/components/data/projects";
import {
  PRIMARY_SHINE_SURFACE_CLASS,
  PrimaryShineLayers,
} from "@/components/ui/PrimaryShine";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const {
    location,
    developer,
    propertyType,
    paymentPlan,
    priceAmount,
    image,
  } = project;

  return (
    <article className="relative isolate flex h-[506px] w-full max-w-[400px] flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-accent-light p-4">
      <div
        className="absolute inset-0 rounded-3xl bg-primary"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[135px] -top-[69px] h-[757px] w-[78px] rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[147px] top-[81px] h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />

      <div className="relative z-10 h-[295px] w-full max-w-[368px] shrink-0 overflow-hidden rounded-[20px] border-[1.5px] border-accent-light">
        <Image
          src={image}
          alt={`${location} by ${developer}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 368px"
        />
        <span
          className={`${PRIMARY_SHINE_SURFACE_CLASS} absolute left-3 top-3.5 rounded-full px-5 py-1.5 font-sans text-sm font-bold leading-4 text-white`}
        >
          <PrimaryShineLayers accentSize="compact" roundedClass="rounded-full" />
          <span className="relative z-10">{paymentPlan}</span>
        </span>
      </div>

      <div className="relative z-10 flex w-full max-w-[368px] flex-col">
        <div className="flex items-baseline gap-3">
          <span className="shrink-0 font-heading text-base font-medium leading-[21px] text-accent-light">
            From AED
          </span>
          <span className="gradient-price-text font-heading text-5xl font-medium leading-[63px]">
            {priceAmount}
          </span>
        </div>

        <ul className="mt-2 flex flex-col gap-2 font-sans text-xl leading-7 text-white">
          <li className="flex items-center gap-2">
            <LuMapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {location}
          </li>
          <li className="flex items-center gap-2">
            <LuUser className="size-3.5 shrink-0" aria-hidden="true" />
            {developer}
          </li>
          <li className="flex items-center gap-2">
            <LuBuilding2 className="size-3.5 shrink-0" aria-hidden="true" />
            {propertyType}
          </li>
        </ul>
      </div>
    </article>
  );
}
