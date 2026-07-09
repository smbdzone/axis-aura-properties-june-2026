"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import {
  createInitialFaqItems,
  getFaqQuestionLabel,
  type FaqItem,
} from "@/components/data/faqData";

function FaqInputField({
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

function FaqQuestionRow({
  item,
  label,
  onChange,
  onDelete,
  canDelete,
}: {
  item: FaqItem;
  label: string;
  onChange: (field: "question" | "answer", value: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-sans text-xl font-medium leading-[26px] text-primary">{label}</h4>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-end sm:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1 ">
          <FaqInputField
            label="Question"
            value={item.question}
            placeholder="Write Question"
            onChange={(value) => onChange("question", value)}
          />
          <FaqInputField
            label="Answer"
            value={item.answer}
            placeholder="Write Answer"
            onChange={(value) => onChange("answer", value)}
          />
        </div>

        <div className="flex shrink-0 items-end">
          <button
            type="button"
            aria-label={`Remove ${label}`}
            disabled={!canDelete}
            onClick={onDelete}
            className="relative isolate flex size-[46px] items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-accent-light bg-metallic-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon icon="mdi:minus" width={24} height={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection({
  initialData = createInitialFaqItems(),
  onChange,
}: {
  initialData?: FaqItem[];
  onChange?: (items: FaqItem[]) => void;
}) {
  const [items, setItems] = useState<FaqItem[]>(initialData);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current?.(items);
  }, [items]);

  function updateItem(id: string, field: "question" | "answer", value: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  function deleteQuestion(id: string) {
    setItems((current) => {
      if (current.length <= 1) return current;
      return current.filter((item) => item.id !== id);
    });
  }

  function addQuestion() {
    setItems((current) => [
      ...current,
      {
        id: `faq-${Date.now()}`,
        question: "",
        answer: "",
      },
    ]);
  }

  return (
    <div className="flex w-full  flex-col gap-6">
      <div className="flex flex-wrap items-center gap-1.5">
        <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
          FAQ&apos;s
        </h3>
        <span className="font-sans text-base font-medium leading-[21px] text-black/60">
          (Frequently Asked Questions)
        </span>
      </div>

      <div className="flex flex-col gap-8">
        {items.map((item, index) => (
          <FaqQuestionRow
            key={item.id}
            item={item}
            label={getFaqQuestionLabel(index)}
            onChange={(field, value) => updateItem(item.id, field, value)}
            onDelete={() => deleteQuestion(item.id)}
            canDelete={items.length > 1}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          aria-label="Add question"
          onClick={addQuestion}
          className="relative isolate flex size-[46px] items-center justify-center overflow-hidden rounded-full border-[1.5px] border-accent-light bg-metallic-dark"
        >
          <Icon icon="mdi:plus" width={24} height={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}
