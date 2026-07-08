"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { useInView } from "@/components/ui/useInView";

type ScrollRevealProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const hiddenOffsetClassName = {
  up: "translate-y-10",
  down: "-translate-y-10",
  left: "-translate-x-10",
  right: "translate-x-10",
  none: "",
} as const;

export default function ScrollReveal<T extends ElementType = "div">({
  as,
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 700,
  ...props
}: ScrollRevealProps<T>) {
  const Component = as ?? "div";
  const { ref, isInView } = useInView();

  return (
    <Component
      ref={ref}
      className={[
        "transform-gpu transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]",
        isInView ? "translate-x-0 translate-y-0 opacity-100" : "opacity-0",
        isInView ? "" : hiddenOffsetClassName[direction],
        className,
      ].join(" ")}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
