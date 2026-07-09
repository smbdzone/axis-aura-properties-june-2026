"use client";

import worldMap from "@svg-maps/world";

type WorldMapLocation = {
  id: string;
  name: string;
  path: string;
};

type WorldMapProps = {
  visitorCodes: readonly string[];
  selectedCode: string;
  onCountrySelect: (code: string) => void;
};

function getCountryFill(
  code: string,
  visitorCodes: readonly string[],
  selectedCode: string,
) {
  if (code === selectedCode) return "#669BBC";
  if (visitorCodes.includes(code)) return "#004C73";
  return "#003049";
}

export default function WorldMap({
  visitorCodes,
  selectedCode,
  onCountrySelect,
}: WorldMapProps) {
  return (
    <div className="h-full w-full min-h-0 bg-white p-1">
      <svg
        viewBox={worldMap.viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        aria-label="World map"
        role="img"
      >
        {(worldMap.locations as WorldMapLocation[]).map((location) => {
          const code = location.id.toUpperCase();
          const fill = getCountryFill(code, visitorCodes, selectedCode);
          const isSelected = code === selectedCode;

          return (
            <path
              key={location.id}
              d={location.path}
              fill={fill}
              stroke="#669BBC"
              strokeWidth={0.6}
              className="cursor-pointer transition-[fill] duration-150"
              style={{ fill }}
              onMouseEnter={(event) => {
                if (!isSelected) {
                  event.currentTarget.style.fill = "#669BBC";
                }
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.fill = fill;
              }}
              onClick={() => onCountrySelect(code)}
            >
              <title>{location.name}</title>
            </path>
          );
        })}
      </svg>
    </div>
  );
}
