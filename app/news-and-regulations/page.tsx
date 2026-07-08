import type { Metadata } from "next";
import NewsCategoryBlogs from "@/components/news-and-regulations/NewsCategoryBlogs";
import NewsCommentsSection from "@/components/news-and-regulations/NewsCommentsSection";
import NewsRegulationsHero from "@/components/news-and-regulations/NewsRegulationsHero";


export const metadata: Metadata = {
  title: "News & Regulations | Suits & Sand Real Estate",
  description:
    "Stay updated with the latest real estate news, market insights, and regulatory updates in Dubai and the UAE.",
};

export default function NewsAndRegulationsPage() {
  return (
    <main className="flex flex-1 flex-col pt-[124px]">
      <NewsRegulationsHero />

      <section
        aria-labelledby="interest-rate-hikes-heading"
        className="flex w-full flex-col items-center justify-center gap-2.5 px-5 py-8 max-lg:gap-3 lg:px-24 lg:py-0"
      >
        <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center">
          <h2
            id="interest-rate-hikes-heading"
            className="w-full text-center font-heading text-[clamp(2rem,4vw,3rem)] font-bold capitalize leading-[150%] text-primary max-lg:leading-tight"
          >
            Interest rate hikes
          </h2>
          <p className="w-full text-center font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-medium leading-[150%] text-black/60 max-lg:mt-2 max-lg:leading-relaxed">
            In recent months, interest rate hikes have created ripples across the
            global real estate market. As central banks adjust rates to combat
            inflation and stabilize economies, borrowing costs inevitably rise,
            altering buyer and seller dynamics. Understanding these shifts is
            essential for anyone looking to buy or sell property in a vibrant
            market like Dubai.
          </p>
        </div>
      </section>

      <NewsCategoryBlogs />
      <NewsCommentsSection />
    </main>
  );
}
