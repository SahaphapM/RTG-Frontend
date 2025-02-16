import { useFetch } from "#app";
import type { Subcontractor } from "~/types/subcontractor";

export default function useSubcontractorService() {
  const config = useRuntimeConfig();

  // Fetch Subcontractor
  const fetchSubcontractor = async (id: number): Promise<Subcontractor> => {
    try {
      const { data } = await useFetch<Subcontractor>(
        `${config.public.apiBase}/subcontractors/${id}`
      );
      return data.value || ({} as Subcontractor);
    } catch (error) {
      console.error("Error fetching subcontractor:", error);
      return {} as Subcontractor;
    }
  };

  // Fetch Subcontractors
  const fetchSubcontractors = async (): Promise<Subcontractor[]> => {
    try {
      const { data } = await useFetch<Subcontractor[]>(
        `${config.public.apiBase}/subcontractors`
      );
      console.log("subcontractors", data);
      return data.value || [];
    } catch (error) {
      console.error("Error fetching subcontractors:", error);
      return [];
    }
  };

  // Create Subcontractor
  const createSubcontractor = async (subcontractor: Partial<Subcontractor>) => {
    try {
      console.log("subcontractor", subcontractor);
      const { data } = await useFetch<Subcontractor>(
        `${config.public.apiBase}/subcontractors`,
        {
          method: "POST",
          body: subcontractor,
        }
      );
      console.log("Subcontractor data", data);
      return data.value;
    } catch (error) {
      console.error("Error creating subcontractor:", error);
    }
  };

  // Update Subcontractor
  const updateSubcontractor = async (
    id: number,
    subcontractor: Partial<Subcontractor>
  ) => {
    try {
      const { data } = await useFetch<Subcontractor>(
        `${config.public.apiBase}/subcontractors/${id}`,
        {
          method: "PATCH",
          body: subcontractor,
        }
      );
      return data.value;
    } catch (error) {
      console.error("Error updating subcontractor:", error);
    }
  };

  // Delete Subcontractor
  const deleteSubcontractor = async (id: number) => {
    try {
      await useFetch(`${config.public.apiBase}/subcontractors/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting subcontractor:", error);
    }
  };

  return {
    fetchSubcontractor,
    fetchSubcontractors,
    createSubcontractor,
    updateSubcontractor,
    deleteSubcontractor,
  };
}
