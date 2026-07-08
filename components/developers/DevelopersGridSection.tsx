import { developerCards } from "@/components/data/developers";
import DeveloperCard from "@/components/developers/DeveloperCard";

export default function DevelopersGridSection() {
  return (
    <section
      id="developer-cards"
      aria-label="Developer partners"
      className="flex w-full justify-center px-6 py-12 lg:px-24"
    >
      <div className="grid w-full max-w-[1248px] grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {developerCards.map((developer) => (
          <DeveloperCard key={developer.id} developer={developer} />
        ))}
      </div>
    </section>
  );
}
