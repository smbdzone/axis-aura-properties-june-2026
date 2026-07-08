"use client";

import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import {
  PRIMARY_SHINE_SURFACE_CLASS,
  PrimaryShineLayers,
} from "@/components/ui/PrimaryShine";

type SearchMode = "developer" | "projects";

const inactiveTabClass =
  "relative z-10 flex h-9 items-center justify-center rounded-full border-2 border-transparent px-4 font-sans text-sm leading-normal text-white opacity-90 transition-all duration-200 hover:opacity-100 sm:h-10 sm:px-5 sm:text-base md:text-xl md:leading-7";

const activeTabClass = `${PRIMARY_SHINE_SURFACE_CLASS} flex h-9 items-center justify-center rounded-full border-2 border-white px-4 font-sans text-sm leading-normal text-white transition-all duration-200 sm:h-10 sm:px-5 sm:text-base md:text-xl md:leading-7`;

export default function HeroSearch() {
  const [mode, setMode] = useState<SearchMode>("projects");

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 drop-shadow-lg sm:gap-5">
      <div
        className={`${PRIMARY_SHINE_SURFACE_CLASS} inline-flex h-12 max-w-xs items-center gap-4 rounded-full p-1.5 pl-4 sm:h-14 sm:gap-6 sm:pl-6`}
        role="tablist"
        aria-label="Search type"
      >
        <PrimaryShineLayers accentSize="button" roundedClass="rounded-full" />
        <div className="relative z-10 flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "developer"}
            onClick={() => setMode("developer")}
            className={
              mode === "developer" ? activeTabClass : inactiveTabClass
            }
          >
            {mode === "developer" ? (
              <>
                <PrimaryShineLayers
                  accentSize="compact"
                  roundedClass="rounded-full"
                />
                <span className="relative z-10">Developer</span>
              </>
            ) : (
              "Developer"
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === "projects"}
            onClick={() => setMode("projects")}
            className={mode === "projects" ? activeTabClass : inactiveTabClass}
          >
            {mode === "projects" ? (
              <>
                <PrimaryShineLayers
                  accentSize="compact"
                  roundedClass="rounded-full"
                />
                <span className="relative z-10">Projects</span>
              </>
            ) : (
              "Projects"
            )}
          </button>
        </div>
      </div>

      <form
        className="flex h-11 w-full  items-center justify-between rounded-3xl border-2 border-accent-light bg-primary py-1 pl-4 pr-1 sm:h-12 sm:pl-6"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="hero-search" className="sr-only">
          Search by area
        </label>
        <input
          id="hero-search"
          type="search"
          placeholder="Search by area"
          className="min-w-0 flex-1 bg-transparent font-sans text-sm leading-normal text-white placeholder:text-white outline-none sm:text-base"
        />
        <button
          type="submit"
          aria-label="Search"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-accent-light bg-white transition-opacity hover:opacity-90 sm:size-10"
        >
          <LuSearch
            className="size-4 text-primary sm:size-5"
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  );
}
