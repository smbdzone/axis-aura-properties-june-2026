import NewsRegulationViewPage from "@/components/newsregulations/NewsRegulationViewPage";

export default async function ViewNewsRegulationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewsRegulationViewPage articleId={id} />;
}
