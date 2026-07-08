import Image from "next/image";
import Link from "next/link";
import { careerHero } from "@/components/data/career";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";

export default function CareerHero() {
  const {
    image,
    imageAlt,
    meetTitle,
    founderTitle,
    name,
    role,
    description,
    ctaLabel,
    ctaHref,
  } = careerHero;

  return (
    <section
      aria-labelledby="career-hero-heading"
      className="flex w-full justify-center px-6 pt-[140px] lg:px-24"
    >
      <div className="relative flex w-full max-w-[1248px] min-h-[652px] flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-0">
        <div className="relative w-full max-w-[669px]  shrink-0 lg:h-[652px]">
          <Image
            src={image}
            alt={imageAlt}
            width={670}
            height={652}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="relative flex w-full max-w-[669px] flex-col gap-8 max-lg:mx-auto lg:ml-auto lg:pt-5 lg:right-35">
          <div className="relative flex w-full flex-co ">
            <h1
              id="career-hero-heading"
              className="flex w-full flex-col capitalize"
            >
              <span className="font-heading pl-10 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.15] text-primary">
                {meetTitle}
              </span>
              <span
                className="relative mt-[-10px]  inline-flex h-[83px] w-full max-w-full items-center font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.15] text-white sm:w-fit sm:max-w-none lg:w-[min(100%,462px)] lg:pl-10 lg:pr-6"
                style={{
                  textShadow: "0 1px 12px rgba(0, 48, 73, 0.35)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 -skew-x-[18deg] rounded-sm border-[1.5px] border-accent-light lg:hidden"
                  style={{ background: "var(--gradient-dark-metallic)" }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 hidden rounded-sm border-[1.5px] border-accent-light lg:block"
                  style={{
                    background:
                      "linear-gradient(132.46deg, rgba(0, 48, 73, 0.8) 26.66%, rgba(0, 76, 115, 0.8) 64.32%, rgba(0, 48, 73, 0.8) 85.79%, rgba(0, 76, 115, 0.8) 115.14%)",
                    boxShadow:
                      "3px 9px 20px rgba(13, 120, 201, 0.1), 12px 34px 36px rgba(13, 120, 201, 0.09), 27px 77px 49px rgba(13, 120, 201, 0.05), 49px 137px 58px rgba(13, 120, 201, 0.01)",
                    clipPath: "polygon(19px 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                />
                {founderTitle}
              </span>
            </h1>
          </div>

          <div className="flex flex-col gap-5 pl-12 ">
            <div className="flex flex-col gap-4 ">
              <div className="flex flex-col gap-2.5">
                <p className="gradient-dark-metallic-text font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.15]">
                  {name}
                </p>
                <p className="font-heading text-[clamp(1.25rem,2vw,1.75rem)] font-medium capitalize leading-[37px] text-accent-light">
                  {role}
                </p>
              </div>

              <p className="font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium capitalize leading-[31px] text-black/60">
                {description}
              </p>
            </div>

            <Link
              href={ctaHref}
              className={`${PRIMARY_SHINE_SURFACE_CLASS} inline-flex h-[62px] w-[230px] shrink-0 items-center justify-center whitespace-nowrap rounded-3xl px-8 py-2.5 font-heading text-[clamp(1.25rem,2vw,2rem)] font-medium leading-[42px] text-white transition-opacity hover:opacity-90`}
            >
              <PrimaryShineBackdrop className="rounded-3xl" />
              <PrimaryShineAccents size="button" />
              <span className="relative z-10">{ctaLabel}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
