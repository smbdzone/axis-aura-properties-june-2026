import {
  mapApiPropertyToFormData,
  type PropertyFormData,
} from "@/components/data/propertyFormData";
import { ApiError } from "@/lib/api/client";
import { fetchPropertyById as fetchApiPropertyById } from "@/lib/api/properties";

export class PropertyNotFoundError extends Error {
  constructor(id: string) {
    super(`Property with id ${id} was not found`);
    this.name = "PropertyNotFoundError";
  }
}

export async function fetchPropertyById(id: string): Promise<PropertyFormData> {
  try {
    const property = await fetchApiPropertyById(id);
    return mapApiPropertyToFormData(property);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new PropertyNotFoundError(id);
    }
    throw error;
  }
}
