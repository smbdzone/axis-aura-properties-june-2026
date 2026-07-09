import type { TrafficTypeSegment } from "@/components/data/trafficTypeData";

type PieChartProps = {
  segments: TrafficTypeSegment[];
};

const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 160;
const CENTER_R = 37;
const INNER_GAP = 44;
const SEGMENT_INNER_R = CENTER_R + INNER_GAP;

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleDeg: number,
) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
  };
}

function describeDonutSegment(
  startAngle: number,
  endAngle: number,
  outerR: number,
  innerR: number,
) {
  const startOuter = polarToCartesian(CX, CY, outerR, endAngle);
  const endOuter = polarToCartesian(CX, CY, outerR, startAngle);
  const startInner = polarToCartesian(CX, CY, innerR, endAngle);
  const endInner = polarToCartesian(CX, CY, innerR, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 1 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

export default function PieChart({ segments }: PieChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let currentAngle = 0;

  const arcs = segments.map((segment) => {
    const sweep = (segment.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweep;
    currentAngle = endAngle;

    return {
      ...segment,
      path: describeDonutSegment(startAngle, endAngle, OUTER_R, SEGMENT_INNER_R),
    };
  });

  return (
    <div className="flex min-h-[400px] w-full flex-wrap items-center justify-between gap-8 px-4 py-2 lg:flex-nowrap">
      <div className="mx-auto flex w-full max-w-[424px] flex-1 items-center justify-center">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-[400px] w-full max-w-[424px]"
          aria-label="Traffic type pie chart"
          role="img"
        >
          <defs>
            <linearGradient
              id="pie-center-gradient"
              gradientUnits="userSpaceOnUse"
              x1={CX - CENTER_R}
              y1={CY - CENTER_R}
              x2={CX + CENTER_R}
              y2={CY + CENTER_R}
            >
              <stop offset="23.09%" stopColor="#003049" />
              <stop offset="55.56%" stopColor="#004C73" />
              <stop offset="74.08%" stopColor="#003049" />
              <stop offset="99.39%" stopColor="#004C73" />
            </linearGradient>
          </defs>

          {arcs.map((arc) => (
            <path key={arc.label} d={arc.path} fill={arc.color} />
          ))}

          <circle
            cx={CX}
            cy={CY}
            r={CENTER_R}
            fill="url(#pie-center-gradient)"
            stroke="#669BBC"
            strokeWidth={1.5}
          />
        </svg>
      </div>

      <span
        className="hidden h-[274px] w-0 shrink-0 border-l-2 border-accent-light lg:block"
        aria-hidden="true"
      />

      <div className="mx-auto flex w-full max-w-[635px] flex-col gap-10 lg:mx-0">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2.5">
            <span
              className="size-[23px] shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span className="font-sans text-[32px] font-bold leading-[44px] text-primary">
              {segment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
