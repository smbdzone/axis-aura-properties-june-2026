import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DeveloperDetailHero from "@/components/developers/DeveloperDetailHero";
import DeveloperProjectsSection from "@/components/developers/DeveloperProjectsSection";
import NewsletterSection from "@/components/NewsletterSection";
import SectionDivider from "@/components/SectionDivider";
import type { DeveloperCardData } from "@/components/data/developers";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

type DeveloperPageProps = {
  params: Promise<{ id: string }>;
};

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveLogoUrl(url?: string) {
  if (!url) return "/Logo.svg";
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function getDeveloper(id: string): Promise<DeveloperCardData | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/developers/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;

    const developer = (await response.json()) as {
      _id: string;
      title: string;
      description?: string;
      logoUrl?: string;
      numberOfProjects?: number;
      projectsHandedOver?: number;
    };

    return {
      id: developer._id,
      name: developer.title,
      description: stripHtml(developer.description || ""),
      logo: resolveLogoUrl(developer.logoUrl),
      logoWidth: 291,
      logoHeight: 108,
      projects: `${developer.numberOfProjects ?? 0} Projects`,
      handedOver: `${developer.projectsHandedOver ?? 0} Projects Handed Over`,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: DeveloperPageProps): Promise<Metadata> {
  const { id } = await params;
  const developer = await getDeveloper(id);

  if (!developer) {
    return { title: "Developer Not Found | Axis Aura Real Estate" };
  }

  return {
    title: `${developer.name} | Axis Aura Real Estate`,
    description: developer.description,
  };
}

export default async function DeveloperDetailPage({ params }: DeveloperPageProps) {
  const { id } = await params;
  const developer = await getDeveloper(id);

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
