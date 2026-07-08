import Image from "next/image";
import {
  aboutUsProvideItems,
  aboutUsProvideSection,
} from "@/components/data/aboutUsProvide";

function ProvideCard({
  icon,
  title,
  description,
}: (typeof aboutUsProvideItems)[number]) {
  return (
    <article className="flex h-full min-h-[300px] w-full rounded-3xl border-[1.5px] border-accent-light bg-white p-4 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
      <div className="flex h-full flex-col gap-6">
        <div className="flex h-[88px] shrink-0 items-center gap-3">
          <Image
            src={icon}
            alt=""
            width={88}
            height={88}
            className="size-[88px] shrink-0"
            aria-hidden="true"
          />
          <h3 className="gradient-dark-metallic-text min-w-0 flex-1 font-heading text-4xl font-bold leading-[1.2] tracking-[-0.04em]">
            {title}
          </h3>
        </div>

        <p className="font-heading text-xl font-medium leading-[1.3] text-black/60">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function AboutUsProvideSection() {
  const { title } = aboutUsProvideSection;

  return (
    <section
      aria-labelledby="about-us-provide-heading"
      className="flex w-full justify-center px-6 py-12 lg:px-24 lg:py-16"
    >
      <div className="flex w-full max-w-[1248px] flex-col items-center gap-8 lg:gap-8">
        <h2
          id="about-us-provide-heading"
          className="w-full text-center font-heading text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.5] text-primary"
        >
          {title}
        </h2>

        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-6">
          {aboutUsProvideItems.map((item) => (
            <ProvideCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
