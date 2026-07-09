export const MAX_PAYMENT_STEPS = 5;

export type PaymentStep = {
  id: string;
  stepNumber: number;
  paymentShare: string;
  releaseMilestone: string;
};

export const paymentStepLabels = [
  "1: First Step",
  "2: Second Step",
  "3: Third Step",
  "4: Fourth Step",
  "5: Fifth Step",
] as const;

export function createInitialPaymentSteps(): PaymentStep[] {
  return [
    {
      id: "step-1",
      stepNumber: 1,
      paymentShare: "",
      releaseMilestone: "",
    },
  ];
}
