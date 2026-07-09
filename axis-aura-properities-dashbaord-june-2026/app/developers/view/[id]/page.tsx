import DeveloperViewPage from "@/components/developers/DeveloperViewPage";

export default async function ViewDeveloperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DeveloperViewPage developerId={id} />;
}
