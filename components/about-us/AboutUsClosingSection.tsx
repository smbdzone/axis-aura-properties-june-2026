import Image from "next/image";
import { aboutUsClosingSection } from "@/components/data/aboutUsClosing";
import {
  PRIMARY_SHINE_SURFACE_CLASS,
  PrimaryShineLayers,
} from "@/components/ui/PrimaryShine";

export default function AboutUsClosingSection() {
  const { message, tagline, logoSrc, logoAlt } = aboutUsClosingSection;

  return (
    <section
      aria-labelledby="about-us-closing-heading"
      className="flex w-full justify-center  px-6 py-12 lg:px-24 lg:py-16"
    >
      <h2 id="about-us-closing-heading" className="sr-only">
        A message from our CEO
      </h2>

      <div className="flex w-full max-w-[1500px] flex-col items-center gap-10  lg:flex-row lg:items-end lg:justify-between lg:gap-[179px]">
        <p className="w-full max-w-[619px]  whitespace-pre-line font-heading text-xl font-medium leading-[1.6] text-[#333333]/60">
          {message}
        </p>

        <div
          className={`${PRIMARY_SHINE_SURFACE_CLASS} relative isolate flex h-[330px] w-full max-w-[758px] flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl px-8 py-10`}
        >
          <PrimaryShineLayers accentSize="card" roundedClass="rounded-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={387}
              height={374}
              className="h-47 w-[min(387px,70vw)] max-w-[387px] object-contain"
              sizes="(max-width: 1024px) 70vw, 387px"
            />

            <p className="max-w-[571px] whitespace-nowrap text-center font-heading text-[clamp(1.125rem,2.5vw,1.5rem)] font-bold capitalize leading-[33px] text-white">
              {tagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
