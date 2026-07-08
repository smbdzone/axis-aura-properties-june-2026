import { LuCheck } from "react-icons/lu";
import type { PropertyDetail } from "@/components/data/propertyDetails";
import {
  PRIMARY_SHINE_SURFACE_CLASS,
  PrimaryShineLayers,
} from "@/components/ui/PrimaryShine";

const benefits = [
  "No Commission",
  "Direct Scale",
  "Trusted & Simple",
] as const;

type PropertyPaymentPlanProps = {
  property: PropertyDetail;
};

export default function PropertyPaymentPlan({
  property,
}: PropertyPaymentPlanProps) {
  return (
    <section
      aria-labelledby="payment-plan-heading"
      className="flex w-full flex-col gap-8 px-6 py-12 lg:px-24"
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-6">
        <h2
          id="payment-plan-heading"
          className="w-full text-center font-heading text-[clamp(2rem,3vw,3rem)] font-bold leading-tight text-black"
        >
          Payment Plan
        </h2>

        <div className="flex w-full flex-wrap items-center justify-center gap-6">
          {property.paymentPlanSteps.map((step) => (
            <div
              key={`${step.percentage}-${step.label}`}
              className={`${PRIMARY_SHINE_SURFACE_CLASS} relative flex h-[120px] w-[170px] flex-col items-center justify-center rounded-3xl px-4`}
            >
              <PrimaryShineLayers accentSize="button" roundedClass="rounded-3xl" />
              <span className="relative z-10 font-heading text-4xl font-bold text-white">
                {step.percentage}
              </span>
              <span className="relative z-10 text-center font-heading text-base font-medium leading-4 text-white">
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-4">
        <h3 className="w-full text-center font-heading text-4xl font-bold text-black">
          Benefits with Us
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex size-[108px] flex-col items-center justify-center gap-4 rounded-full border border-primary p-3"
            >
              <LuCheck
                className="size-6 text-[#00D319]"
                strokeWidth={3}
                aria-hidden="true"
              />
              <span className="text-center font-heading text-[11.5px] font-medium leading-tight text-black">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
