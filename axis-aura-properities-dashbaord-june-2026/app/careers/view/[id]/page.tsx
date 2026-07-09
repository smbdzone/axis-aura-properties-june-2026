import CareerViewPage from "@/components/careers/CareerViewPage";

export default async function ViewJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CareerViewPage jobId={id} />;
}
