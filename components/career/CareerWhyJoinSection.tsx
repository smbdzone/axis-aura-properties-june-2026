import CareerJobApplyCard from "@/components/career/CareerJobApplyCard";
import { careerApplySection } from "@/components/data/careerApply";

export default function CareerWhyJoinSection() {
  const { title, description } = careerApplySection;

  return (
    <section
      id="apply"
      aria-labelledby="career-why-join-heading"
      className="flex w-full justify-center px-6 py-12 lg:px-24 lg:py-16"
    >
      <div className="flex w-full max-w-[1248px] flex-col items-center gap-8">
        <div className="flex w-full max-w-[1035px] flex-col items-center">
          <h2
            id="career-why-join-heading"
            className="w-full text-center font-heading text-[clamp(2rem,5vw,4rem)] font-bold capitalize leading-[1.15] text-primary lg:leading-[88px]"
          >
            {title}
          </h2>
          <p className="mt-2 w-full text-center font-sans text-[clamp(1rem,2vw,1.5rem)] font-normal leading-[1.5] text-black/60">
            {description}
          </p>
        </div>

        <CareerJobApplyCard />
      </div>
    </section>
  );
}
