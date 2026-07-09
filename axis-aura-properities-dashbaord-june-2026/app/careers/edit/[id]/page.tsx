import CareersFormPage from "@/components/careers/CareersFormPage";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CareersFormPage jobId={id} />;
}
