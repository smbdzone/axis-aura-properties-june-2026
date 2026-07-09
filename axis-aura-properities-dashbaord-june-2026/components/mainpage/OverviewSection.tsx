import StatsCard from "@/components/cards/StatsCard";
import { overviewStats } from "@/components/data/overviewStats";

export default function OverviewSection() {
  return (
    <section className="flex w-full flex-col gap-6">
      <h2 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
        Overview
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-[21px]">
        {overviewStats.map((stat) => (
          <StatsCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>  
    </section>
  );
}
