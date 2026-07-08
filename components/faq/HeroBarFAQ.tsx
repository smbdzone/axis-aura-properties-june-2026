import Image from "next/image";
import { faqHero } from "@/components/data/faq";

export default function HeroBarFAQ() {
  const { title, image, imageAlt } = faqHero;

  return (
    <section
      aria-labelledby="faq-hero-heading"
      className="flex w-full justify-center"
    >
      <div className="relative z-[3] w-full  drop-shadow-[0_0_190px_rgba(0,0,0,0.25)]">
        <div className="relative flex min-h-[222px] flex-col  border-[1.5px] border-accent-light overflow-hidden bg-white lg:block lg:h-[222px]">
          <div className="relative mx-auto h-[160px] w-full shrink-0 p-4 pb-0 lg:absolute lg:left-[6.74%] lg:top-[14px] lg:h-[194px] lg:w-[43.82%] lg:max-w-none lg:p-0">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              className="object-cover"
  
            />
          </div>

          <div
            className="mx-4 mb-4 flex min-h-[88px] flex-1 items-center justify-center px-6 py-4 lg:absolute lg:right-0 lg:top-[23.4%] lg:mx-0 lg:mb-0 lg:h-[118px] lg:w-[55.14%] lg:px-0"
            style={{ background: "var(--gradient-dark-metallic)" }}
          >
            <h1
              id="faq-hero-heading"
              className="font-heading text-[clamp(2rem,8vw,56px)] font-bold leading-[150%] text-white"
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
