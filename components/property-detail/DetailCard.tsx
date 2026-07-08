import type { ReactNode } from "react";

type DetailCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
  size?: "side" | "center";
};

function BlurAccents() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 -top-48 h-[757px] w-20 rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[117px] top-14 h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[569px] -top-20 h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />
    </>
  );
}

export default function DetailCard({
  title,
  children,
  className = "",
  size = "side",
}: DetailCardProps) {
  const isCenter = size === "center";

  return (
    <div
      className={[
        "relative isolate overflow-hidden rounded-3xl border border-accent-light",
        isCenter
          ? "w-full min-h-[302px] p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)] sm:p-8 lg:h-[368px] lg:min-w-0 lg:flex-1"
          : "w-full min-h-[280px] shrink-0 p-5 shadow-[0_0_24px_rgba(0,0,0,0.2)] sm:p-6 lg:h-[302px] lg:w-[334px]",
        className,
      ].join(" ")}
      style={{ background: "var(--gradient-dark-metallic)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl bg-primary"
      />
      <BlurAccents />
      <div className="relative z-10 flex h-full w-full min-w-0 flex-col items-center gap-3 lg:gap-4">
        <h3 className="w-full text-center font-heading text-xl font-bold leading-tight text-white sm:text-2xl sm:leading-[36px]">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}
