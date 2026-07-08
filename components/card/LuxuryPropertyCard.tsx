import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import type { LuxuryProperty } from "@/components/data/luxuryProperties";
import {
  PRIMARY_SHINE_SURFACE_CLASS,
  PrimaryShineLayers,
} from "@/components/ui/PrimaryShine";

type LuxuryPropertyCardProps = {
  property: LuxuryProperty;
};

export default function LuxuryPropertyCard({
  property,
}: LuxuryPropertyCardProps) {
  const { title, propertyType, description, rating, price, image } = property;

  return (
    <article className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      <div className="relative aspect-[560/635] w-full shrink-0 overflow-hidden rounded-3xl border-2 border-accent-light lg:max-w-[560px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 560px"
        />
      </div>

      <div className="flex flex-1 flex-col gap-8 lg:gap-9">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-2xl font-bold capitalize leading-tight text-primary sm:text-3xl lg:text-4xl lg:leading-snug">
              {title}
            </h3>

            <p className="flex flex-wrap items-center gap-3 font-sans text-lg capitalize text-black sm:text-xl">
              <span>Property Type:</span>
              <span className="font-heading text-xl font-bold text-black/60 sm:text-2xl lg:text-3xl">
                {propertyType}
              </span>
            </p>
          </div>

          <p className="font-heading text-lg font-medium capitalize leading-relaxed text-black/60 sm:text-xl sm:leading-8">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <FaStar
                  key={index}
                  className="size-6 text-[#D4AF37] sm:size-7"
                />
              ))}
            </span>
            <span className="font-sans text-2xl capitalize text-black sm:text-3xl">
              ({rating.toFixed(1)})
            </span>
          </div>

          <p className="font-heading text-3xl font-bold capitalize text-primary sm:text-4xl lg:text-5xl">
            {price}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="#contact"
            className={`${PRIMARY_SHINE_SURFACE_CLASS} flex items-center justify-center rounded-3xl px-8 py-3 font-heading text-xl font-bold text-white transition-opacity hover:opacity-90 sm:text-2xl lg:px-12 lg:py-3.5`}
          >
            <PrimaryShineLayers accentSize="button" roundedClass="rounded-3xl" />
            <span className="relative z-10">Contact Us</span>
          </Link>

          <Link
            href="#buy"
            className="flex items-center justify-center rounded-3xl border-2 border-accent-light px-8 py-3 font-heading text-xl font-bold text-primary transition-opacity hover:opacity-80 sm:text-2xl lg:px-12 lg:py-3.5"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </article>
  );
}
