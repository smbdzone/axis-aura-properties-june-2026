"use client";

import { useState } from "react";
import LineChart from "@/components/chart/LineChart";
import PieChart from "@/components/chart/PieChart";
import {
  lineGraphPeriodTabs,
  lineGraphSectionTabs,
  lineGraphTodayData,
  lineGraphXLabels,
  lineGraphYLabels,
  type LineGraphPeriodTab,
  type LineGraphSectionTab,
} from "@/components/data/lineGraphData";
import { trafficTypeSegments } from "@/components/data/trafficTypeData";

function GlowTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`relative isolate flex h-[39px] items-center justify-center overflow-hidden rounded-lg px-6 py-1 font-sans text-2xl font-medium leading-[31px] ${active
          ? "bg-primary text-white"
          : "border-[1.5px] border-accent-light text-primary"
        }`}
    >
      {active && (
        <>
          <span
            className="pointer-events-none absolute -left-[167px] -top-[138px] h-[267px] w-[41px] rotate-[-150deg] bg-accent-light/50 blur-[23px]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -left-5 -top-[193px] h-[353px] w-[36px] rotate-[-150deg] bg-accent-light/50 blur-[23px]"
            aria-hidden="true"
          />
        </>
      )}
      <span className="relative z-[1]">{label}</span>
    </Tag>
  );
}

export default function LineGraphSection() {
  const [sectionTab, setSectionTab] = useState<LineGraphSectionTab>("Report");
  const [periodTab, setPeriodTab] = useState<LineGraphPeriodTab>("Today");

  const isReport = sectionTab === "Report";

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {lineGraphSectionTabs.map((tab) => (
          <GlowTab
            key={tab}
            label={tab}
            active={sectionTab === tab}
            onClick={() => setSectionTab(tab)}
          />
        ))}
      </div>

      <div className="flex w-full flex-col gap-4 rounded-2xl border-[1.5px] border-accent-light bg-white p-4">
        <div className="flex flex-col gap-2.5 border-b-[1.5px] border-accent-light pb-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-sans text-2xl font-bold leading-[33px] text-primary">
              {sectionTab}
            </h3>

            {isReport && (
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="size-2 rounded-full bg-primary" aria-hidden />
                    <span className="font-sans text-xl font-medium leading-[26px] text-primary">
                      Today
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="size-2 rounded-full bg-accent-light"
                      aria-hidden
                    />
                    <span className="font-sans text-xl font-medium leading-[26px] text-accent-light">
                      Yesterday
                    </span>
                  </div>
                </div>

                <span
                  className="hidden h-[26px] w-0 border-l-2 border-accent-light sm:block"
                  aria-hidden
                />

                <div className="flex flex-wrap items-center gap-3">
                  {lineGraphPeriodTabs.map((tab) => (
                    <GlowTab
                      key={tab}
                      label={tab}
                      active={periodTab === tab}
                      onClick={() => setPeriodTab(tab)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {isReport ? (
          <LineChart
            data={lineGraphTodayData}
            xLabels={lineGraphXLabels}
            yLabels={lineGraphYLabels}
          />
        ) : (
          <PieChart segments={trafficTypeSegments} />
        )}
      </div>
    </section>
  );
}
