import Image from "next/image";
import Link from "next/link";
import SectionDivider from "@/components/SectionDivider";
import type { DeveloperCardData } from "@/components/data/developers";
import { developerDetailHero } from "@/components/data/developers";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";

type DeveloperDetailHeroProps = {
  developer: DeveloperCardData;
};

export default function DeveloperDetailHero({
  developer,
}: DeveloperDetailHeroProps) {
  const { image, imageAlt, ctaLabel, ctaHref } = developerDetailHero;

  return (
    <section
      aria-labelledby="developer-detail-hero-heading"
      className="relative w-full"
    >
      <div className="relative h-[750px] w-full overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(78.99deg, rgba(0, 0, 0, 0.5) 36.51%, rgba(0, 0, 0, 0) 74.37%)",
          }}
          aria-hidden="true"
        />

        <div className="absolute left-6 top-[235px] z-10 flex max-w-[651px] flex-col gap-8 lg:left-24">
          <div className="flex flex-col gap-4">
            <h1
              id="developer-detail-hero-heading"
              className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[60px] text-white lg:text-[56px]"
            >
              {developer.name}
            </h1>

            <p className="max-w-[682px] font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium capitalize leading-[150%] text-white/60">
              {developer.description}
            </p>
          </div>

          <Link
            href={ctaHref}
            className={`${PRIMARY_SHINE_SURFACE_CLASS} inline-flex h-[62px] w-full max-w-[324px] shrink-0 items-center justify-center whitespace-nowrap rounded-3xl px-8 py-2.5 font-heading text-[clamp(1.25rem,2vw,2rem)] font-medium leading-[42px] text-white transition-opacity hover:opacity-90`}
          >
            <PrimaryShineBackdrop className="rounded-3xl" />
            <PrimaryShineAccents size="button" />
            <span className="relative z-10">{ctaLabel}</span>
          </Link>
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
