"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={3500}
      toastOptions={{
        classNames: {
          toast:
            "font-[family-name:var(--font-sandena)] border-[1.5px] border-[#669BBC] shadow-lg",
          title: "font-[family-name:var(--font-sandena)] text-sm font-medium",
          description: "font-[family-name:var(--font-sandena)] text-sm",
        },
      }}
    />
  );
}
