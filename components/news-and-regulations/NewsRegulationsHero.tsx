import Image from "next/image";
import Link from "next/link";
import { newsRegulationsHero } from "@/components/data/newsRegulations";
import {
  PRIMARY_SHINE_SURFACE_CLASS,
  PrimaryShineLayers,
} from "@/components/ui/PrimaryShine";

export default function NewsRegulationsHero() {
  const { titleLine1, titleLine2, description, image, imageAlt, contactHref } =
    newsRegulationsHero;

  return (
    <section
      aria-labelledby="news-regulations-hero-heading"
      className="flex w-full flex-col items-start gap-2.5 px-5 py-10 max-lg:items-center sm:px-6 sm:py-12 lg:px-24 lg:py-16"
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-8 max-lg:gap-8 sm:gap-10 lg:flex-row lg:items-center lg:gap-[82px]">
        <div className="flex w-full max-w-[636px] flex-col items-start gap-5 max-lg:items-center max-lg:text-center sm:gap-6">
          <div className="flex w-full flex-col items-start gap-4 max-lg:items-center">
            <div className="flex w-full flex-col items-start max-lg:items-center">
              <h1
                id="news-regulations-hero-heading"
                className="font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.15] tracking-[-0.04em] text-primary"
              >
                {titleLine1}
              </h1>
              <p className="font-heading text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium leading-[1.3] tracking-[-0.04em] text-primary">
                {titleLine2}
              </p>
            </div>

            <p className="font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium capitalize leading-[31px] text-black/60 max-lg:max-w-[540px] max-lg:leading-relaxed">
              {description}
            </p>
          </div>

          <Link
            href={contactHref}
            className={`${PRIMARY_SHINE_SURFACE_CLASS} inline-flex h-[62px] min-w-[222px] items-center justify-center rounded-3xl px-8 py-2.5 font-heading text-[clamp(1.5rem,2.5vw,2rem)] font-medium leading-[42px] text-white transition-opacity hover:opacity-90 max-lg:h-[54px] max-lg:w-full max-lg:max-w-[300px]`}
          >
            <PrimaryShineLayers accentSize="button" roundedClass="rounded-3xl" />
            <span className="relative z-10">Contact Us</span>
          </Link>
        </div>

        <div className="relative h-[280px] w-full max-w-[532px] shrink-0 overflow-hidden rounded-[24px] border-[1.5px] border-accent-light max-lg:rounded-2xl sm:h-[420px] lg:h-[583px] lg:w-[532px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 532px"
          />
        </div>
      </div>
    </section>
  );
}
