"use client";

import Image from "next/image";
import Link from "next/link";
import {
  aboutUsDeveloperLogos,
  aboutUsDevelopersSection,
} from "@/components/data/aboutUsDevelopers";
import {
  PrimaryShineAccents,
  PrimaryShineBackdrop,
  PRIMARY_SHINE_SURFACE_CLASS,
} from "@/components/ui/PrimaryShine";

function DeveloperLogoCard({
  src,
  alt,
  width,
  height,
}: (typeof aboutUsDeveloperLogos)[number]) {
  return (
    <div className="box-border flex h-[108px] w-[min(291px,70vw)] shrink-0 items-center justify-center border-2 border-white px-4 sm:w-[291px]">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto max-h-20 w-auto max-w-full object-contain"
      />
    </div>
  );
}

export default function AboutUsDevelopersSection() {
  const { description, ctaLabel, ctaHref } = aboutUsDevelopersSection;
  const marqueeLogos = [...aboutUsDeveloperLogos, ...aboutUsDeveloperLogos];

  return (
    <section
      aria-labelledby="about-us-developers-heading"
      className="flex w-full flex-col items-center gap-[25px] py-8 lg:py-12"
    >
      <h2 id="about-us-developers-heading" className="sr-only">
        Trusted developer partners
      </h2>

      <div className="relative isolate flex w-full flex-col items-center justify-center overflow-hidden bg-primary py-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/2 h-72 w-48 -translate-y-1/2 rotate-[29.59deg] bg-accent-light/50 blur-[180px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/3 top-0 h-64 w-44 rotate-[29.96deg] bg-accent-light/50 blur-[180px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 z-[3] h-[150px] w-[min(368px,30vw)] -translate-y-1/2 bg-[linear-gradient(90deg,#FFFFFF_33.56%,rgba(255,255,255,0)_87.5%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 z-[3] h-[150px] w-[min(368px,30vw)] -translate-y-1/2 bg-[linear-gradient(90deg,rgba(255,255,255,0)_12.5%,#FFFFFF_66.44%)]"
        />

        <div className="relative z-[1] w-full overflow-hidden px-4 sm:px-6">
          <div className="logo-marquee-track flex w-max items-center gap-4 sm:gap-8">
            {marqueeLogos.map((logo, index) => (
              <DeveloperLogoCard key={`${logo.alt}-${index}`} {...logo} />
            ))}
          </div>
        </div>
      </div>

      <p className="max-w-[954px] px-6 text-center font-heading text-[clamp(1.125rem,2.5vw,1.5rem)] font-medium leading-[1.2] text-black/60">
        {description}
      </p>

      <Link
        href={ctaHref}
        className={`${PRIMARY_SHINE_SURFACE_CLASS} inline-flex h-[62px] w-[min(338px,100%-3rem)] items-center justify-center rounded-3xl border border-accent-light px-8 py-2.5 font-heading text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[42px] text-white transition-opacity hover:opacity-90`}
      >
        <PrimaryShineBackdrop className="rounded-3xl" />
        <PrimaryShineAccents size="button" />
        <span className="relative z-10 text-2xl">{ctaLabel}</span>
      </Link>
    </section>
  );
}
