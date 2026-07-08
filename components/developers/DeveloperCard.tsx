import Image from "next/image";
import Link from "next/link";
import type { DeveloperCardData } from "@/components/data/developers";

function CardBlurAccents() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 -top-16 h-[757px] w-20 rotate-[29.59deg] bg-accent-light/50 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-36 top-20 h-[573px] w-[88px] rotate-[29.96deg] bg-accent-light/50 blur-[50px]"
      />
    </>
  );
}

export default function DeveloperCard({ developer }: { developer: DeveloperCardData }) {
  const { id, name, description, logo, logoWidth, logoHeight, projects, handedOver } =
    developer;

  return (
    <Link
      href={`/developers/${id}`}
      className="group block w-full max-w-[400px] transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light"
      aria-label={`View ${name} projects`}
    >
      <article className="relative isolate flex h-[580px] w-full flex-col items-center gap-7 rounded-3xl border-[1.5px] border-accent-light bg-primary p-4 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl bg-primary"
        />
        <CardBlurAccents />

        <div className="relative z-10 flex h-[252px] w-full items-center justify-center rounded-2xl border-[1.5px] border-accent-light bg-white px-6">
          <Image
            src={logo}
            alt={`${name} logo`}
            width={logoWidth}
            height={logoHeight}
            className="h-auto max-h-[132px] w-auto max-w-[90%] object-contain"
          />
        </div>

        <div className="relative z-10 flex w-full flex-col gap-1 px-1">
          <h3 className="font-heading text-[32px] font-bold leading-[44px] text-accent-light">
            {name}
          </h3>
          <p className="line-clamp-4 font-sans text-[22px] leading-[120%] text-white/60">
            {description}
          </p>
        </div>

        <div className="relative z-10 flex w-full flex-col gap-2">
          <p className="flex min-h-[50px] items-center justify-center rounded-[11px] bg-white px-3 py-3 text-center font-heading text-base font-bold leading-[22px] text-primary">
            {projects}
          </p>
          <p className="flex min-h-[50px] items-center justify-center rounded-[11px] bg-white px-3 py-3 text-center font-heading text-base font-bold leading-[22px] text-primary">
            {handedOver}
          </p>
        </div>
      </article>
    </Link>
  );
}
