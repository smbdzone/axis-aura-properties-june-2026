import Image from "next/image";
import { aboutUsSeoMessage } from "@/components/data/aboutUsSeoMessage";
import { PrimaryShineAccents } from "@/components/ui/PrimaryShine";

const titleBannerStyle = {
  background:
    "linear-gradient(132.49deg, rgba(0, 48, 73, 0.8) 26.63%, rgba(0, 76, 115, 0.8) 64.3%, rgba(0, 48, 73, 0.8) 85.78%, rgba(0, 76, 115, 0.8) 115.15%)",
  boxShadow:
    "3px 9px 20px rgba(13, 120, 201, 0.1), 12px 34px 36px rgba(13, 120, 201, 0.09), 27px 77px 49px rgba(13, 120, 201, 0.05), 49px 137px 58px rgba(13, 120, 201, 0.01)",
} as const;

/** Scaled from Figma 1344px frame → 1248px content width */
const IMAGE_WIDTH = 525;
const TITLE_LEFT = 350;
const BODY_LEFT = 451;

function CeoMessageTitle({ className = "" }: { className?: string }) {
  const { title } = aboutUsSeoMessage;

  return (
    <div className={`relative w-fit max-w-full ${className}`.trim()}>
      <h2
        id="about-us-seo-message-heading"
        className="relative z-10 whitespace-nowrap py-1 pl-12 pr-8 font-heading text-[clamp(2rem,4vw,4rem)] font-bold capitalize leading-[1.375] text-white sm:pl-14 sm:pr-10 lg:text-[64px] lg:leading-[88px]"
      >
        {title}
      </h2>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 border-[1.5px] border-accent-light [clip-path:polygon(36px_0,100%_0,100%_100%,0_100%)]"
        style={titleBannerStyle}
      />
    </div>
  );
}

function CeoMessageBody({ className = "" }: { className?: string }) {
  const { messages } = aboutUsSeoMessage;

  return (
    <div
      className={`flex flex-col gap-5 font-heading text-xl font-medium capitalize leading-[1.2] text-[#333333]/60 ${className}`.trim()}
    >
      {messages.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export default function AboutUsSeoMessageSection() {
  const { image, imageAlt } = aboutUsSeoMessage;

  return (
    <section
      aria-labelledby="about-us-seo-message-heading"
      className="relative isolate w-full overflow-hidden bg-primary shadow-[0_0_40px_rgba(0,0,0,0.25)]"
      style={{ background: "var(--gradient-dark-metallic)" }}
    >
      <PrimaryShineAccents size="card" />

      <div className="relative z-10 flex justify-center px-6 py-12 lg:px-24 lg:py-16">
        <div className="w-full max-w-[1248px]">
          <div className="overflow-visible rounded-tr-[32px] border-[1.5px] border-accent-light bg-white pb-8 pl-0 pr-8 pt-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            {/* Mobile */}
            <div className="flex flex-col gap-6 lg:hidden">
              <div className="relative w-full">
                <Image
                  src={image}
                  alt={imageAlt}
                  width={572}
                  height={564}
                  className="h-auto w-full max-w-[566px] object-contain object-left"
                  sizes="90vw"
                />
                <CeoMessageTitle className="absolute bottom-6 left-4 z-20 max-w-[calc(100%-2rem)]" />
              </div>

              <CeoMessageBody className="px-6" />
            </div>

            {/* Desktop — single coordinate system so title sits on image edge */}
            <div
              className="relative hidden overflow-visible lg:block"
              style={{ minHeight: 564 }}
            >
              <div
                className="absolute left-0 top-0"
                style={{ width: IMAGE_WIDTH, height: 564 }}
              >
                <Image
                  src={image}
                  alt={imageAlt}
                  width={572}
                  height={564}
                  className="h-full w-full object-contain object-left"
                  sizes={`${IMAGE_WIDTH}px`}
                  priority
                />
              </div>

              <div
                className="absolute z-30"
                style={{ left: TITLE_LEFT, top: 49 }}
              >
                <CeoMessageTitle className="min-w-[480px] xl:min-w-[578px]" />
              </div>

              <div
                className="absolute z-10 pr-2"
                style={{ left: BODY_LEFT, top: 156, maxWidth: 777 }}
              >
                <CeoMessageBody />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
