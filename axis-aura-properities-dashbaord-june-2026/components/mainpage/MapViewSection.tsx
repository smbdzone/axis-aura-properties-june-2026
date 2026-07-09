"use client";

import { useState } from "react";
import {
  mapViewPeriodFilters,
  mapViewUserFilters,
  topMapVisitorCountries,
  mapVisitorCountryCodes,
  type MapViewPeriodFilter,
  type MapViewUserFilter,
} from "@/components/data/mapViewData";
import CountryVisitorsPanel from "@/components/map/CountryVisitorsPanel";
import WorldMap from "@/components/map/WorldMap";
import FilterDropdown from "@/components/ui/FilterDropdown";

export default function MapViewSection() {
  const [selectedCode, setSelectedCode] = useState(topMapVisitorCountries[0].code);
  const [userFilter, setUserFilter] = useState<MapViewUserFilter>("Active User");
  const [periodFilter, setPeriodFilter] = useState<MapViewPeriodFilter>("Today");

  return (
    <section className="flex w-full min-w-0 flex-col gap-[30px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
          Map View
        </h2>

        <div className="flex flex-wrap items-center gap-[18px]">
          <FilterDropdown
            value={userFilter}
            options={mapViewUserFilters}
            onChange={setUserFilter}
          />
          <FilterDropdown
            value={periodFilter}
            options={mapViewPeriodFilters}
            onChange={setPeriodFilter}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="relative min-h-[400px] w-full min-w-0 flex-[3] overflow-hidden rounded-2xl border-[1.5px] border-accent-light bg-white">
          <WorldMap
            visitorCodes={mapVisitorCountryCodes}
            selectedCode={selectedCode}
            onCountrySelect={setSelectedCode}
          />
        </div>

        <CountryVisitorsPanel
          countries={topMapVisitorCountries}
          selectedCode={selectedCode}
          onSelect={setSelectedCode}
          className="min-w-0 flex-[2]"
        />
      </div>
    </section>
  );
}
