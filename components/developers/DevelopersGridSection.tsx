"use client";

import { useEffect, useState } from "react";
import type { DeveloperCardData } from "@/components/data/developers";
import DeveloperCard from "@/components/developers/DeveloperCard";

export default function DevelopersGridSection() {
  const [developers, setDevelopers] = useState<DeveloperCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDevelopers() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/developers", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load developers");
        }

        const data = (await response.json()) as { developers: DeveloperCardData[] };
        if (isMounted) {
          setDevelopers(data.developers);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load developers right now. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDevelopers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="developer-cards"
      aria-label="Developer partners"
      className="flex w-full justify-center px-6 py-12 lg:px-24"
    >
      <div className="w-full max-w-[1248px]">
        {isLoading ? (
          <p className="py-12 text-center font-sans text-lg text-black/50">
            Loading developers...
          </p>
        ) : error ? (
          <p className="py-12 text-center font-sans text-lg text-red-600">{error}</p>
        ) : developers.length === 0 ? (
          <p className="py-12 text-center font-sans text-lg text-black/50">
            No developers to show yet. Please check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {developers.map((developer) => (
              <DeveloperCard key={developer.id} developer={developer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
