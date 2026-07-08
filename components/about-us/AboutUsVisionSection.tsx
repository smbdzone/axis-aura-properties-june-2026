"use client";

import Image from "next/image";
import { useState } from "react";
import {
  aboutUsVisionSection,
  aboutUsVisionSlides,
} from "@/components/data/aboutUsVision";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useInView } from "@/components/ui/useInView";

const VISION_ARROW_LEFT = "/New%20folder/left.svg";
const VISION_ARROW_RIGHT = "/New%20folder/right.svg";

type SlideRole = "left" | "center" | "right";

const slideRoleClassName: Record<SlideRole, string> = {
  left: [
    "z-[1] w-[300px] cursor-pointer opacity-90 lg:w-[360px] xl:w-[400px]",
    "[transform:translate3d(-28px,40px,-130px)_rotateY(34deg)_scale(0.86)]",
    "lg:[transform:translate3d(-44px,40px,-150px)_rotateY(36deg)_scale(0.84)]",
    "hover:opacity-100",
    "hover:[transform:translate3d(-20px,36px,-90px)_rotateY(28deg)_scale(0.9)]",
    "active:[transform:translate3d(-24px,40px,-110px)_rotateY(32deg)_scale(0.87)]",
  ].join(" "),
  center: [
    "z-20 w-[420px] cursor-pointer lg:w-[500px] xl:w-[560px]",
    "[transform:translate3d(0,0,90px)_rotateY(0deg)_scale(1)]",
    "shadow-[0_20px_50px_rgba(0,48,73,0.2)]",
    "hover:[transform:translate3d(0,-6px,110px)_rotateY(0deg)_scale(1.02)]",
    "active:[transform:translate3d(0,-2px,95px)_rotateY(0deg)_scale(1)]",
  ].join(" "),
  right: [
    "z-[1] w-[300px] cursor-pointer opacity-90 lg:w-[360px] xl:w-[400px]",
    "[transform:translate3d(28px,40px,-130px)_rotateY(-34deg)_scale(0.86)]",
    "lg:[transform:translate3d(44px,40px,-150px)_rotateY(-36deg)_scale(0.84)]",
    "hover:opacity-100",
    "hover:[transform:translate3d(20px,36px,-90px)_rotateY(-28deg)_scale(0.9)]",
    "active:[transform:translate3d(24px,40px,-110px)_rotateY(-32deg)_scale(0.87)]",
  ].join(" "),
};

const scrollHiddenClassName: Record<SlideRole, string> = {
  left: "opacity-0 [transform:translate3d(-100px,80px,-220px)_rotateY(50deg)_scale(0.65)]",
  center: "opacity-0 [transform:translate3d(0,60px,-280px)_rotateY(0deg)_scale(0.7)]",
  right: "opacity-0 [transform:translate3d(100px,80px,-220px)_rotateY(-50deg)_scale(0.65)]",
};

const slideRevealDelayClassName: Record<SlideRole, string> = {
  left: "[transition-delay:0ms]",
  center: "[transition-delay:180ms]",
  right: "[transition-delay:360ms]",
};

const slideBaseClassName = [
  "relative aspect-[612/383] shrink-0 overflow-hidden rounded-3xl border border-accent-light",
  "transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "[transform-style:preserve-3d] [backface-visibility:hidden] will-change-transform",
  "appearance-none bg-transparent p-0 text-left",
].join(" ");

function VisionSlide({
  slide,
  role,
  priority = false,
  onClick,
  isRevealed,
}: {
  slide: (typeof aboutUsVisionSlides)[number];
  role: SlideRole;
  priority?: boolean;
  onClick?: () => void;
  isRevealed: boolean;
}) {
  const className = [
    slideBaseClassName,
    isRevealed ? slideRoleClassName[role] : scrollHiddenClassName[role],
    isRevealed ? slideRevealDelayClassName[role] : "[transition-delay:0ms]",
  ].join(" ");

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Show slide: ${slide.alt}`}
        className={className}
      >
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          className="pointer-events-none object-cover"
          sizes="(max-width: 1024px) 35vw, 560px"
          priority={priority}
        />
      </button>
    );
  }

  return (
    <div className={className}>
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 35vw, 560px"
        priority={priority}
      />
    </div>
  );
}

function VisionCarouselControls({
  onPrevious,
  onNext,
}: {
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex h-[57px] w-[125px] cursor-pointer items-center rounded-3xl border-[1.5px] border-accent-light bg-white shadow-[0_8px_24px_rgba(0,48,73,0.08)]">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous vision slide"
        className="flex h-full flex-1 cursor-pointer items-center justify-center p-2.5 transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        <Image
          src={VISION_ARROW_LEFT}
          alt=""
          width={28}
          height={38}
          className="pointer-events-none h-[37px] w-[26.5px]"
          aria-hidden="true"
        />
      </button>

      <span
        className="h-[33px] w-px shrink-0 bg-accent-light"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onNext}
        aria-label="Next vision slide"
        className="flex h-full flex-1 cursor-pointer items-center justify-center p-2.5 transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        <Image
          src={VISION_ARROW_RIGHT}
          alt=""
          width={28}
          height={38}
          className="pointer-events-none h-[37px] w-[26.5px]"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export default function AboutUsVisionSection() {
  const { title, description } = aboutUsVisionSection;
  const [activeIndex, setActiveIndex] = useState(0);
  const total = aboutUsVisionSlides.length;
  const { ref: carouselRef, isInView: isCarouselRevealed } = useInView({
    threshold: 0.25,
  });
  const { ref: mobileCarouselRef, isInView: isMobileCarouselRevealed } =
    useInView({ threshold: 0.25 });

  const goToPrevious = () => {
    setActiveIndex((index) => (index === 0 ? total - 1 : index - 1));
  };

  const goToNext = () => {
    setActiveIndex((index) => (index === total - 1 ? 0 : index + 1));
  };

  const leftSlide = aboutUsVisionSlides[(activeIndex - 1 + total) % total];
  const centerSlide = aboutUsVisionSlides[activeIndex];
  const rightSlide = aboutUsVisionSlides[(activeIndex + 1) % total];

  return (
    <section
      aria-labelledby="about-us-vision-heading"
      className="flex w-full justify-center px-6 py-12 lg:px-24 lg:py-16"
    >
      <div className="flex w-full max-w-[1248px] flex-col items-center gap-8 lg:gap-8">
        <div className="flex w-full flex-col items-center gap-8 text-center">
          <ScrollReveal
            as="h2"
            id="about-us-vision-heading"
            className="font-heading text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.375] text-primary"
          >
            {title}
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <p className="font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium leading-[1.5] text-black/60">
              {description}
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-6 w-full lg:mt-10">
          <div className="hidden flex-col items-center gap-10 lg:flex">
            <div
              ref={carouselRef}
              className="relative w-full overflow-hidden py-2 [perspective:1400px]"
            >
              <div className="flex w-full min-w-0 items-center justify-center gap-3 [transform-style:preserve-3d] lg:gap-4 xl:gap-5">
                <VisionSlide
                  slide={leftSlide}
                  role="left"
                  onClick={goToPrevious}
                  isRevealed={isCarouselRevealed}
                />
                <VisionSlide
                  slide={centerSlide}
                  role="center"
                  priority
                  onClick={goToNext}
                  isRevealed={isCarouselRevealed}
                />
                <VisionSlide
                  slide={rightSlide}
                  role="right"
                  onClick={goToNext}
                  isRevealed={isCarouselRevealed}
                />
              </div>
            </div>

            <ScrollReveal delay={500}>
              <VisionCarouselControls
                onPrevious={goToPrevious}
                onNext={goToNext}
              />
            </ScrollReveal>
          </div>

          <div ref={mobileCarouselRef} className="flex flex-col items-center gap-6 lg:hidden">
            <button
              type="button"
              onClick={goToNext}
              aria-label={`Show next slide: ${aboutUsVisionSlides[(activeIndex + 1) % total].alt}`}
              className={[
                "relative mx-auto aspect-[612/383] w-full max-w-[380px] cursor-pointer overflow-hidden rounded-3xl border border-accent-light",
                "transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
                isMobileCarouselRevealed
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-8 scale-95 opacity-0",
              ].join(" ")}
            >
              <Image
                src={aboutUsVisionSlides[activeIndex].src}
                alt={aboutUsVisionSlides[activeIndex].alt}
                fill
                className="pointer-events-none object-cover"
                sizes="100vw"
              />
            </button>

            <ScrollReveal delay={150}>
              <p className="font-sans text-sm text-black/50" aria-live="polite">
                {activeIndex + 1} / {total}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <VisionCarouselControls onPrevious={goToPrevious} onNext={goToNext} />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
