import AnalyticsSection from "@/components/mainpage/AnalyticsSection";
import LineGraphSection from "@/components/mainpage/LineGraphSection";
import MapViewSection from "@/components/mainpage/MapViewSection";
import OverviewSection from "@/components/mainpage/OverviewSection";
import SessionByDevicesSection from "@/components/mainpage/SessionByDevicesSection";
import SessionTableSection from "@/components/mainpage/SessionTableSection";

export default function Home() {
  return (
    <div className=" flex w-full min-w-0 flex-col gap-6 p-8">
      <OverviewSection />
      <AnalyticsSection />
      <LineGraphSection />
      <SessionTableSection />
      <MapViewSection />
      <SessionByDevicesSection />
    </div>
  );
}
