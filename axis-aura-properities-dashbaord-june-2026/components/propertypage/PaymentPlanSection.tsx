"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import {
  createInitialPaymentSteps,
  MAX_PAYMENT_STEPS,
  paymentStepLabels,
  type PaymentStep,
} from "@/components/data/paymentPlanData";

function PaymentInputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="font-sans text-base font-medium leading-[21px] text-primary">
        {label}
      </label>
      <div className="flex h-[46px] items-center rounded-xl border-[1.5px] border-accent-light bg-white px-4 py-2.5">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent font-sans text-sm font-medium leading-[18px] text-primary placeholder:text-primary/60 focus:outline-none"
        />
      </div>
    </div>
  );
}

function PaymentStepRow({
  step,
  label,
  onChange,
  onDelete,
  canDelete,
}: {
  step: PaymentStep;
  label: string;
  onChange: (field: "paymentShare" | "releaseMilestone", value: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-sans text-xl font-medium leading-[26px] text-primary">{label}</h4>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-12">
        <div className="flex min-w-0 flex-1 flex-col gap-8 sm:flex-row">
          <PaymentInputField
            label="Payment Share"
            value={step.paymentShare}
            placeholder="e.g; 20%"
            onChange={(value) => onChange("paymentShare", value)}
          />
          <PaymentInputField
            label="Release Milestone"
            value={step.releaseMilestone}
            placeholder="e.g; On Booking"
            onChange={(value) => onChange("releaseMilestone", value)}
          />
        </div>

        <button
          type="button"
          aria-label={`Delete ${label}`}
          disabled={!canDelete}
          onClick={onDelete}
          className="relative isolate flex size-[46px] shrink-0 items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-metallic-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon icon="material-symbols:delete-rounded" width={24} height={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default function PaymentPlanSection({
  initialData = createInitialPaymentSteps(),
  onChange,
}: {
  initialData?: PaymentStep[];
  onChange?: (steps: PaymentStep[]) => void;
}) {
  const [steps, setSteps] = useState<PaymentStep[]>(initialData);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current?.(steps);
  }, [steps]);

  function updateStep(id: string, field: "paymentShare" | "releaseMilestone", value: string) {
    setSteps((current) =>
      current.map((step) => (step.id === id ? { ...step, [field]: value } : step)),
    );
  }

  function deleteStep(id: string) {
    setSteps((current) => {
      if (current.length <= 1) return current;
      return current
        .filter((step) => step.id !== id)
        .map((step, index) => ({ ...step, stepNumber: index + 1 }));
    });
  }

  function addStep() {
    setSteps((current) => {
      if (current.length >= MAX_PAYMENT_STEPS) return current;
      const nextNumber = current.length + 1;
      return [
        ...current,
        {
          id: `step-${Date.now()}`,
          stepNumber: nextNumber,
          paymentShare: "",
          releaseMilestone: "",
        },
      ];
    });
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-8">
      <div className="flex items-center gap-1.5">
        <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
          Payment Plan
        </h3>
        <span className="font-sans text-base font-medium leading-[21px] text-black/60">
          (Max 5 Step)
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {steps.map((step, index) => (
          <PaymentStepRow
            key={step.id}
            step={step}
            label={paymentStepLabels[index] ?? `${step.stepNumber}: Step`}
            onChange={(field, value) => updateStep(step.id, field, value)}
            onDelete={() => deleteStep(step.id)}
            canDelete={steps.length > 1}
          />
        ))}
      </div>

      {steps.length < MAX_PAYMENT_STEPS && (
        <button
          type="button"
          onClick={addStep}
          className="flex w-fit items-center gap-2 font-sans text-base font-medium leading-[21px] text-primary transition-opacity hover:opacity-80"
        >
          <span className="flex size-[46px] items-center justify-center rounded-xl border-[1.5px] border-accent-light bg-metallic-dark">
            <Icon icon="mdi:plus" width={24} height={24} className="text-white" />
          </span>
          Add Step
        </button>
      )}
    </div>
  );
}
