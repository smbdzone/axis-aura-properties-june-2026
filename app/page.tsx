import DiscoverDubai from "@/components/DiscoverDubai";
import EnquiryModal from "@/components/EnquiryModal";
import HeroSection from "@/components/HeroSection";
import HotProjects from "@/components/HotProjects";
import LogoSlider from "@/components/LogoSlider";
import MostLuxury from "@/components/MostLuxury";
import NewsletterSection from "@/components/NewsletterSection";
import RealEstateNews from "@/components/RealEstateNews";
import RecentProperties from "@/components/RecentProperties";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <EnquiryModal />
      <HeroSection />
      <LogoSlider />
      <RecentProperties />
      <MostLuxury />
      <DiscoverDubai />
      <SectionDivider />
      <HotProjects />
      <RealEstateNews />
      <NewsletterSection />
    </main>
  );
}
