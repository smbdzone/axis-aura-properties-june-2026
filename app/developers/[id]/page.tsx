import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DeveloperDetailHero from "@/components/developers/DeveloperDetailHero";
import DeveloperProjectsSection from "@/components/developers/DeveloperProjectsSection";
import NewsletterSection from "@/components/NewsletterSection";
import SectionDivider from "@/components/SectionDivider";
import {
  getAllDeveloperIds,
  getDeveloperById,
} from "@/components/data/developers";

type DeveloperPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllDeveloperIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: DeveloperPageProps): Promise<Metadata> {
  const { id } = await params;
  const developer = getDeveloperById(id);

  if (!developer) {
    return { title: "Developer Not Found | Suits & Sand Real Estate" };
  }

  return {
    title: `${developer.name} | Suits & Sand Real Estate`,
    description: developer.description,
  };
}

export default async function DeveloperDetailPage({ params }: DeveloperPageProps) {
  const { id } = await params;
  const developer = getDeveloperById(id);

  if (!developer) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <DeveloperDetailHero developer={developer} />
      <DeveloperProjectsSection
        developerId={developer.id}
        developerName={developer.name}
      />
      <SectionDivider />
      <NewsletterSection />
    </main>
  );
}
