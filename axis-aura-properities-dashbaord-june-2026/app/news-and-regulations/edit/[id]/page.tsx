import NewsRegulationsFormPage from "@/components/newsregulations/NewsRegulationsFormPage";

export default async function EditNewsRegulationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewsRegulationsFormPage articleId={id} />;
}
