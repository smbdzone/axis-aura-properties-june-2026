import PropertyFormPage from "@/components/propertypage/PropertyFormPage";
import { createEmptyPropertyFormData } from "@/components/data/propertyFormData";

export default function AddPropertyRoute() {
  return (
    <PropertyFormPage mode="add" initialData={createEmptyPropertyFormData()} />
  );
}
