import Image from "next/image";
import SectionDivider from "@/components/SectionDivider";
import { developersHero } from "@/components/data/developers";

export default function DevelopersHero() {
  const { image, imageAlt, title, description } = developersHero;

  return (
    <section
      aria-labelledby="developers-hero-heading"
      className="relative w-full"
    >
      <div className="relative h-[755px] w-full overflow-hidden">
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
              "linear-gradient(78.69deg, rgba(0, 0, 0, 0.5) 35.92%, rgba(0, 0, 0, 0) 78.19%)",
          }}
          aria-hidden="true"
        />

        <div className="absolute left-6 top-[235px] z-10 flex max-w-[651px] flex-col gap-8 lg:left-24">
          <div className="flex flex-col gap-4">
            <h1
              id="developers-hero-heading"
              className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[60px] text-white lg:text-[56px]"
            >
              {title}
            </h1>

            <p className="max-w-[682px] font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium capitalize leading-[150%] text-white/60">
              {description}
            </p>
          </div>
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
