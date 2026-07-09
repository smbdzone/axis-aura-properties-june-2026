import DiscoverFormPage from "@/components/discover/DiscoverFormPage";

export default async function EditDiscoverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DiscoverFormPage discoverId={id} />;
}
