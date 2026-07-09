import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";

type StatsCardProps = {
  value: string | number;
  label: string;
  change?: string;
  trend?: "up" | "down" | "none";
  live?: boolean;
  className?: string;
};

export default function StatsCard({
  value,
  label,
  change,
  trend = "up",
  live = false,
  className = "",
}: StatsCardProps) {
  const TrendIcon = trend === "down" ? IoTrendingDown : IoTrendingUp;

  return (
    <article
      className={`relative isolate flex h-[140px] min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-2xl border-[1.5px] border-accent-light bg-primary p-4 ${className}`}
    >
      <span
        className="pointer-events-none absolute -left-[41px] -top-[37px] h-[267px] w-[41px] rotate-[-150deg] bg-accent-light/50 blur-[23px]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute left-[99px] -top-[114px] h-[353px] w-[36px] rotate-[-150deg] bg-accent-light/50 blur-[23px]"
        aria-hidden="true"
      />

      <div className="relative z-[1] flex h-full flex-col justify-between">
        <p className="font-sans text-4xl font-medium leading-[47px] text-white">
          {value}
        </p>

        <div className="relative flex items-end justify-between gap-3">
          <p className="min-w-0 font-sans text-base font-bold leading-[22px] text-white">
            {label}
          </p>

          {live && (
            <span className="absolute bottom-0 right-0 flex h-[22px] min-w-[44px] items-center justify-center rounded-[5px] bg-[#CF0003] px-2 font-[family-name:Helvetica,Arial,sans-serif] text-xs leading-4 text-[#FFFFF0]">
              Live
            </span>
          )}

          {!live && change && trend !== "none" && (
            <div className="flex shrink-0 items-center gap-1 text-white">
              <span className="font-sans text-xs font-medium leading-none">
                {change}
              </span>
              <TrendIcon size={18} aria-hidden />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
