import Image from "next/image";
import { newProjectHero } from "@/components/data/newProject";

export default function NewProjectHero() {
  const { image, imageAlt, title, description } = newProjectHero;

  return (
    <section
      aria-labelledby="new-project-hero-heading"
      className="relative min-h-[520px] w-full overflow-hidden max-[700px]:min-h-[480px] min-[701px]:h-[750px]"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

      <div className="absolute left-4 top-[130px] z-10 flex w-full max-w-[651px] flex-col gap-6 max-[700px]:left-1/2 max-[700px]:-translate-x-1/2 max-[700px]:items-center max-[700px]:px-2 max-[700px]:text-center min-[701px]:left-6 min-[701px]:top-[235px] min-[701px]:translate-x-0 min-[701px]:gap-8 lg:left-24">
        <div className="flex flex-col gap-4 max-[700px]:items-center">
          <h1
            id="new-project-hero-heading"
            className="font-heading text-[clamp(1.75rem,6vw,3.5rem)] font-bold leading-tight text-white min-[701px]:leading-[60px]"
          >
            {title}
          </h1>

          <p className="max-w-[585px] font-heading text-[clamp(1rem,3.5vw,1.5rem)] font-medium leading-[130%] text-white">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
