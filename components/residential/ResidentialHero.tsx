import Image from "next/image";
import SectionDivider from "@/components/SectionDivider";
import { residentialHero } from "@/components/data/residential";

export default function ResidentialHero() {
  const { image, imageAlt, title, description } = residentialHero;

  return (
    <section
      aria-labelledby="residential-hero-heading"
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
              "linear-gradient(76.98deg, rgba(0, 0, 0, 0.5) 31.48%, rgba(0, 0, 0, 0) 52.85%)",
          }}
          aria-hidden="true"
        />

        <div className="absolute left-6 top-[235px] z-10 flex max-w-[651px] flex-col gap-8 lg:left-24">
          <div className="flex flex-col gap-4">
            <h1
              id="residential-hero-heading"
              className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[60px] text-white"
            >
              {title}
            </h1>

            <p className="max-w-[651px] font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium leading-[150%] text-white">
              {description}
            </p>
          </div>
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
