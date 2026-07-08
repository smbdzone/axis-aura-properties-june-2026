"use client";

import Image from "next/image";

const developerLogos = [
  { src: "/slider/azizi.svg", alt: "Azizi", width: 190, height: 111 },
  { src: "/slider/sobha.svg", alt: "Sobha", width: 205, height: 74 },
  { src: "/slider/damac.svg", alt: "Damac", width: 216, height: 30 },
  { src: "/slider/samana.svg", alt: "Samana", width: 291, height: 108 },
  { src: "/slider/binghatti.svg", alt: "Binghatti", width: 94, height: 81 },
] as const;

const MARQUEE_LOGO_THRESHOLD = 4;

function LogoCard({
  src,
  alt,
  width,
  height,
}: (typeof developerLogos)[number]) {
  return (
    <div className="box-border flex h-28 w-72 shrink-0 items-center justify-center rounded-sm border-2 border-white bg-primary px-4 sm:px-6">
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

export default function LogoSlider() {
  const shouldMarquee = developerLogos.length > MARQUEE_LOGO_THRESHOLD;
  const visibleLogos = shouldMarquee
    ? [...developerLogos, ...developerLogos]
    : developerLogos;

  return (
    <section
      aria-label="Developer partners"
      className="relative isolate flex w-full flex-col items-center justify-center gap-2.5 overflow-hidden bg-primary py-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/2 h-72 w-48 -translate-y-1/2 rotate-[30deg] bg-accent-light/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-0 h-64 w-44 rotate-[30deg] bg-accent-light/50 blur-3xl"
      />

      <div className="relative z-10 w-full overflow-hidden px-4 sm:px-6">
        <div
          className={[
            "flex w-max items-center gap-4 sm:gap-20",
            shouldMarquee ? "logo-marquee-track" : "mx-auto",
          ].join(" ")}
        >
          {visibleLogos.map((logo, index) => (
            <LogoCard key={`${logo.alt}-${index}`} {...logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
