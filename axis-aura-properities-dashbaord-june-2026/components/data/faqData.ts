export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqQuestionLabels = [
  "1: First Question",
  "2: Second Question",
  "3: Third Question",
] as const;

export function getFaqQuestionLabel(index: number): string {
  const preset = faqQuestionLabels[index];
  if (preset) return preset;

  const ordinals = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
  ];
  const ordinal = ordinals[index] ?? `${index + 1}th`;
  return `${index + 1}: ${ordinal} Question`;
}

export function createInitialFaqItems(): FaqItem[] {
  return [
    {
      id: "faq-1",
      question: "",
      answer: "",
    },
  ];
}
