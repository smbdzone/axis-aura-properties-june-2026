import type { MapVisitorCountry } from "@/components/data/mapViewData";

type CountryVisitorsPanelProps = {
  countries: MapVisitorCountry[];
  selectedCode: string;
  onSelect: (code: string) => void;
  className?: string;
};

function ProgressRow({
  country,
  active,
  onSelect,
}: {
  country: MapVisitorCountry;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between gap-4 text-left ${active ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
    >
      <span className="w-[90px] shrink-0 truncate font-[family-name:Helvetica,Arial,sans-serif] text-xs leading-4 text-[#333333]">
        {country.name}
      </span>

      <span className="relative h-1 min-w-0 flex-1 rounded border border-accent-light bg-white">
        <span
          className="absolute inset-y-0 left-0 rounded bg-[linear-gradient(125.03deg,#003049_23.09%,#004C73_55.56%,#003049_74.08%,#004C73_99.39%)] shadow-[4px_0_40px_rgba(0,0,0,0.1)]"
          style={{ width: `${country.percentage}%` }}
        />
      </span>

      <span className="w-8 shrink-0 text-right font-[family-name:Helvetica,Arial,sans-serif] text-xs leading-4 text-[#333333]">
        {country.percentage}%
      </span>
    </button>
  );
}

export default function CountryVisitorsPanel({
  countries,
  selectedCode,
  onSelect,
  className = "",
}: CountryVisitorsPanelProps) {
  const topCountries = [...countries]
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 10);

  return (
    <div
      className={`flex min-h-[400px] w-full flex-col rounded-2xl border-[1.5px] border-accent-light bg-white p-4 ${className}`}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <h3 className="shrink-0 font-sans text-2xl font-bold leading-[33px] text-black">
          Top 10 Countries
        </h3>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
          {topCountries.map((country) => (
            <ProgressRow
              key={country.code}
              country={country}
              active={country.code === selectedCode}
              onSelect={() => onSelect(country.code)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
