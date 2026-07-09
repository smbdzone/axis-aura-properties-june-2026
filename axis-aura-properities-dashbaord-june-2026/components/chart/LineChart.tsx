type LineChartProps = {
  data: number[];
  xLabels: string[];
  yLabels: string[];
};

const CHART_WIDTH = 1400;
const CHART_HEIGHT = 384;
const PADDING = { top: 16, right: 24, bottom: 36, left: 48 };

function getPoints(data: number[], minY: number, maxY: number) {
  const chartWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  return data.map((value, index) => {
    const x =
      PADDING.left +
      (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y =
      PADDING.top +
      chartHeight -
      ((value - minY) / (maxY - minY)) * chartHeight;

    return { x, y };
  });
}

export default function LineChart({ data, xLabels, yLabels }: LineChartProps) {
  const minY = 1;
  const maxY = 4;
  const points = getPoints(data, minY, maxY);
  const chartWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const baseY = PADDING.top + chartHeight;

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? PADDING.left} ${baseY} L ${points[0]?.x ?? PADDING.left} ${baseY} Z`;

  const gridCount = xLabels.length;

  return (
    <div className="relative h-[384px] w-full">
      <div className="absolute left-0 top-0 flex h-[calc(100%-36px)] w-10 flex-col justify-between pr-1 text-right font-[family-name:Helvetica,Arial,sans-serif] text-[17.5px] leading-[25px] text-black/60">
        {yLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="h-full w-full"
        aria-label="Traffic report line chart"
        role="img"
      >
        <defs>
          <linearGradient id="line-chart-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>

        {Array.from({ length: gridCount }).map((_, index) => {
          const x = PADDING.left + (index / Math.max(gridCount - 1, 1)) * chartWidth;

          return (
            <line
              key={`grid-${index}`}
              x1={x}
              y1={PADDING.top}
              x2={x}
              y2={baseY}
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1.6"
            />
          );
        })}

        <path d={areaPath} fill="url(#line-chart-area)" />
        <path
          d={linePath}
          fill="none"
          stroke="#333333"
          strokeOpacity="0.6"
          strokeWidth="2"
        />

        {points.map((point, index) => (
          <g key={`point-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="#669BBC"
              filter="drop-shadow(0px 5.6px 4.5px rgba(0,0,0,0.11))"
            />
            <circle cx={point.x} cy={point.y} r="5" fill="#669BBC" stroke="#FFFFFF" strokeWidth="4" />
          </g>
        ))}

        {xLabels.map((label, index) => {
          const x = PADDING.left + (index / Math.max(xLabels.length - 1, 1)) * chartWidth;

          return (
            <text
              key={`x-${label}`}
              x={x}
              y={CHART_HEIGHT - 8}
              textAnchor="middle"
              className="fill-black/60 font-[family-name:Helvetica,Arial,sans-serif] text-[19px]"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
