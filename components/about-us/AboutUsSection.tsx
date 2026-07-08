import Image from "next/image";
import Link from "next/link";
import { aboutUsSection } from "@/components/data/aboutUs";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";

export default function AboutUsSection() {
  const {
    bannerTitle,
    image,
    imageAlt,
    cardTitle,
    description,
    contactLabel,
    contactHref,
    exploreLabel,
    exploreHref,
  } = aboutUsSection;

  return (
    <section
      id="about-us"
      aria-labelledby="about-us-heading"
      className="flex w-full flex-col mt-23"
    >
      {/* <div
        className="relative isolate flex min-h-[100px] w-full items-center justify-center overflow-hidden border-b-[1.5px] border-accent-light px-6 pb-12  mt-34 shadow-[0_0_40px_rgba(0,0,0,0.25)] sm:min-h-[100px] lg:min-h-[104px] "
        style={{ background: "var(--gradient-dark-metallic)" }}
      >
        <h2
          id="about-us-heading"
          className="relative z-10 text-center font-heading text-5xl font-bold leading-tight text-white"
        >
          {bannerTitle}
        </h2>
      </div> */}

      <div className="flex w-full justify-center px-6 py-12 lg:px-24 lg:py-16">
        <div className="flex w-full max-w-[1248px] flex-col items-center gap-8 lg:flex-row lg:items-end lg:gap-0 lg:py-16">
          <div className="relative h-[min(606px,70vw)] w-full max-w-[655px] shrink-0 overflow-hidden rounded-3xl border-[1.5px] border-accent-light lg:-mr-[121px] lg:h-[606px]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 655px"
            />
          </div>

          <div className="relative z-10 flex w-full max-w-[714px] flex-col gap-2.5 py-0 lg:py-6">
            <div className="flex flex-col gap-8 rounded-2xl border-[1.5px] border-accent-light bg-white p-4 lg:gap-8 lg:p-4">
              <h3 className="gradient-dark-metallic-text font-heading text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.5]">
                {cardTitle}
              </h3>

              <p className="font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium leading-[1.5] text-black/60">
                {description}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                <Link
                  href={contactHref}
                  className={`${PRIMARY_SHINE_SURFACE_CLASS} inline-flex h-[62px] min-w-[222px] items-center justify-center rounded-3xl border border-accent-light px-8 py-2.5 font-heading text-[clamp(1.25rem,2vw,2rem)] font-medium leading-[42px] text-white transition-opacity hover:opacity-90`}
                >
                  <PrimaryShineBackdrop className="rounded-3xl" />
                  <PrimaryShineAccents size="button" />
                  <span className="relative z-10">{contactLabel}</span>
                </Link>

                <Link
                  href={exploreHref}
                  className="inline-flex h-[62px] min-w-[222px] items-center justify-center rounded-3xl border border-accent-light px-8 py-2.5 font-heading text-[clamp(1.25rem,2vw,2rem)] font-medium leading-[42px] text-primary transition-opacity hover:opacity-90"
                >
                  {exploreLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
