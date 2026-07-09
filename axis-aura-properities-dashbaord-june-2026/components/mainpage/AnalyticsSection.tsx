import StatsCard from "@/components/cards/StatsCard";
import { analyticsStats } from "@/components/data/analyticsStats";

export default function AnalyticsSection() {
  return (
    <section className="flex w-full flex-col gap-6">
      <h2 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
        Analytics
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-[21px]">
        {analyticsStats.map((stat) => (
          <StatsCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            change={stat.change}
            trend={stat.trend}
            live={stat.live}
          />
        ))}
      </div>
    </section>
  );
}
