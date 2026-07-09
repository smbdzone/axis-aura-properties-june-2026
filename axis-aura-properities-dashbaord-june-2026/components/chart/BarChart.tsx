import type { DeviceBarDatum } from "@/components/data/deviceBarChartData";

type BarChartProps = {
  data: DeviceBarDatum[];
  yLabels: string[];
  maxValue: number;
};

const CHART_WIDTH = 1400;
const CHART_HEIGHT = 415;
const PADDING = { top: 34, right: 12, bottom: 26, left: 56 };
const BAR_WIDTH = 91;

export default function BarChart({ data, yLabels, maxValue }: BarChartProps) {
  const chartWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const baseY = PADDING.top + chartHeight;
  const slotWidth = chartWidth / data.length;

  return (
    <div className="relative h-[315px] w-full">
      <div className="absolute left-0 top-[34px] flex h-[228px] w-10 flex-col justify-between pr-1 text-right font-[family-name:Helvetica,Arial,sans-serif] text-[17.5px] leading-[25px] text-black/60">
        {yLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="h-full w-full"
        aria-label="Session by devices bar chart"
        role="img"
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = PADDING.left + index * slotWidth + (slotWidth - BAR_WIDTH) / 2;
          const y = baseY - barHeight;
          const radius = 8;

          const path = [
            `M ${x} ${baseY}`,
            `L ${x} ${y + radius}`,
            `Q ${x} ${y} ${x + radius} ${y}`,
            `L ${x + BAR_WIDTH - radius} ${y}`,
            `Q ${x + BAR_WIDTH} ${y} ${x + BAR_WIDTH} ${y + radius}`,
            `L ${x + BAR_WIDTH} ${baseY}`,
            "Z",
          ].join(" ");

          return <path key={item.label} d={path} fill={item.color} />;
        })}

        {data.map((item, index) => {
          const x = PADDING.left + index * slotWidth + slotWidth / 2;

          return (
            <text
              key={`label-${item.label}`}
              x={x}
              y={CHART_HEIGHT - 4}
              textAnchor="middle"
              className="fill-black/60 font-[family-name:Helvetica,Arial,sans-serif] text-[17.5px]"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
