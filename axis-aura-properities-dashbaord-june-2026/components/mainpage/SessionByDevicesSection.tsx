"use client";

import { useState } from "react";
import BarChart from "@/components/chart/BarChart";
import {
  deviceBarChartData,
  deviceBarChartMaxValue,
  deviceBarChartPeriodFilters,
  deviceBarChartYLabels,
  type DeviceBarChartPeriodFilter,
} from "@/components/data/deviceBarChartData";
import FilterDropdown from "@/components/ui/FilterDropdown";

export default function SessionByDevicesSection() {
  const [periodFilter, setPeriodFilter] =
    useState<DeviceBarChartPeriodFilter>("Today");

  return (
    <section className="flex w-full flex-col gap-4">
      <h2 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
        Session By Devices
      </h2>

      <div className="flex w-full flex-col gap-2.5 rounded-2xl border-[1.5px] border-accent-light bg-white px-[27px] py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-[1.5px] border-accent-light pb-4">
          <h3 className="font-sans text-[28px] font-medium leading-[37px] text-primary">
            Active Devices
          </h3>

          <FilterDropdown
            value={periodFilter}
            options={deviceBarChartPeriodFilters}
            onChange={setPeriodFilter}
          />
        </div>

        <BarChart
          data={deviceBarChartData}
          yLabels={deviceBarChartYLabels}
          maxValue={deviceBarChartMaxValue}
        />
      </div>
    </section>
  );
}
