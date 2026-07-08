import { developersIntro } from "@/components/data/developers";

export default function DevelopersIntroSection() {
  const { title, description } = developersIntro;

  return (
    <section
      aria-labelledby="developers-intro-heading"
      className="flex w-full justify-center px-6 py-8 lg:px-24"
    >
      <div className="flex w-full max-w-[1248px] flex-col items-center gap-0 text-center">
        <h2
          id="developers-intro-heading"
          className="w-full font-heading text-[clamp(2rem,4vw,3rem)] font-medium uppercase leading-[63px] text-primary"
        >
          {title}
        </h2>

        <p className="max-w-[881px] font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium capitalize leading-[31px] text-black/60">
          {description}
        </p>
      </div>
    </section>
  );
}
