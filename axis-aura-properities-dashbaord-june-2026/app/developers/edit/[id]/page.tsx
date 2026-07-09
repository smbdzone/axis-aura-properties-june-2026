import DevelopersFormPage from "@/components/developers/DevelopersFormPage";

export default async function EditDeveloperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DevelopersFormPage developerId={id} />;
}
