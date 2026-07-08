import type { Metadata } from "next";
import AboutUsClosingSection from "@/components/about-us/AboutUsClosingSection";
import AboutUsDevelopersSection from "@/components/about-us/AboutUsDevelopersSection";
import AboutUsProvideSection from "@/components/about-us/AboutUsProvideSection";
import AboutUsSection from "@/components/about-us/AboutUsSection";
import AboutUsSeoMessageSection from "@/components/about-us/AboutUsSeoMessageSection";
import AboutUsVisionSection from "@/components/about-us/AboutUsVisionSection";
import SectionDivider from "@/components/SectionDivider";


export const metadata: Metadata = {
  title: "About Us | Suits & Sand Real Estate",
  description:
    "Learn about Suits & Sand Real Estate — our mission, values, and commitment to premium property investment in Dubai.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AboutUsSection />
      <SectionDivider />
      <AboutUsDevelopersSection />
      <SectionDivider />
      <AboutUsVisionSection />
      <AboutUsProvideSection />
      <SectionDivider />
      <div className="mt-23">
      <AboutUsSeoMessageSection />
      </div>
      <AboutUsClosingSection />
    </main>
  );
}
