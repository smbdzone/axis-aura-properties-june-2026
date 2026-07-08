import Image from "next/image";
import HeroSearch from "./HeroSearch";

export default function HeroSection() {
  return (
    <section className="relative min-h-[909px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-black" aria-hidden="true" />

      <Image
        src="/Image.svg"
        alt=""
        fill
        priority
        className="object-cover object-[center_-8%] scale-110"
        sizes="100vw"
      />

      <div
        className="absolute inset-0 bg-black/20"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[909px] max-w-[1440px] flex-col">
        <div className="flex flex-1 flex-col justify-end px-6 pb-16 pt-[124px] lg:px-24 lg:pb-[96px] lg:pt-[374px]">
          <div className="flex max-w-[967px] flex-col gap-6 rounded-[24px] p-4">
            <div className="flex flex-col gap-6">
              <div className="relative max-w-[859px]">
                <h1 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.75] text-white">
                  <span className="block">Find the Place</span>
                  <span className="-mt-3 block text-[clamp(2rem,4vw,3.625rem)] leading-[1.15]">
                    <span className="uppercase underline underline-offset-4">
                      Where Memories
                    </span>
                    <span className="normal-case"> Are Made.</span>
                  </span>
                </h1>
              </div>

              <p className="max-w-[935px] font-heading text-[clamp(1.25rem,2.5vw,2rem)] font-bold capitalize leading-10 text-white/90">
                Discover A Curated collection of premium properties in prime
                locations, backed by expert guidence at every step.
              </p>
            </div>

            <HeroSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
