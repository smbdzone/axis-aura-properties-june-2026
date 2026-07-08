type ShineSize = "card" | "button" | "compact" | "navbar";

const accentClassNames: Record<Exclude<ShineSize, "navbar">, { left: string; right: string }> = {
  card: {
    left: "pointer-events-none absolute -left-36 -top-16 h-[757px] w-20 rotate-[29.59deg] bg-accent-light/50 blur-[50px]",
    right:
      "pointer-events-none absolute left-36 top-20 h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]",
  },
  button: {
    left: "pointer-events-none absolute -left-16 -top-10 h-40 w-10 rotate-[29.59deg] bg-accent-light/50 blur-[40px]",
    right:
      "pointer-events-none absolute left-20 top-4 h-36 w-12 rotate-[29.96deg] bg-accent-light/50 blur-[40px]",
  },
  compact: {
    left: "pointer-events-none absolute -left-10 -top-8 h-32 w-6 rotate-[29.59deg] bg-accent-light/50 blur-[30px]",
    right:
      "pointer-events-none absolute left-12 top-2 h-28 w-7 rotate-[29.96deg] bg-accent-light/50 blur-[30px]",
  },
};

export const PRIMARY_SHINE_SURFACE_CLASS =
  "relative isolate overflow-hidden border-[1.5px] border-accent-light bg-primary shadow-[0_0_40px_rgba(0,0,0,0.25)]";

export function PrimaryShineBackdrop({
  className = "",
  variant = "solid",
}: {
  className?: string;
  variant?: "solid" | "navbar";
}) {
  const backgroundClass =
    variant === "navbar" ? "bg-primary/45 backdrop-blur-sm" : "bg-primary";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${backgroundClass} ${className}`.trim()}
    />
  );
}

export function PrimaryShineAccents({ size = "card" }: { size?: ShineSize }) {
  if (size === "navbar") {
    return (
      <>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-40 h-[500px] w-20 rotate-[29.59deg] bg-accent-light/40 blur-[50px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/3 -top-32 h-[420px] w-16 rotate-[29.96deg] bg-accent-light/35 blur-[50px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-1/4 -top-28 h-[380px] w-20 rotate-[29.59deg] bg-accent-light/40 blur-[50px]"
        />
      </>
    );
  }

  return (
    <>
      <div aria-hidden="true" className={accentClassNames[size].left} />
      <div aria-hidden="true" className={accentClassNames[size].right} />
    </>
  );
}

export function PrimaryShineLayers({
  accentSize = "button",
  roundedClass = "rounded-3xl",
  backdropVariant = "solid",
}: {
  accentSize?: ShineSize;
  roundedClass?: string;
  backdropVariant?: "solid" | "navbar";
}) {
  return (
    <>
      <PrimaryShineBackdrop className={roundedClass} variant={backdropVariant} />
      <PrimaryShineAccents size={accentSize} />
    </>
  );
}
