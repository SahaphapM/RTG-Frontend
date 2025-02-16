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

  const createSubcontractor = async (subcontractor: Partial<Subcontractor>) => {
    try {
      console.log("subcontractor", subcontractor);
      const response = await useFetch<Subcontractor>(
        `${config.public.apiBase}/subcontractors`,
        {
          method: "POST",
          body: subcontractor,
        }
      );

      if (!response.error.value) {
        console.log("Subcontractor data", response.data.value);
        return response.data.value;
      } else {
        // แสดง error message ที่ละเอียดขึ้น
        console.error("Error response:", response.error.value);
        alert(
          `Failed to create subcontractor: ${
            response.error.value.data?.message || response.error.value
          }`
        );
      }
    } catch (error: any) {
      // ตรวจสอบและแสดงรายละเอียดของ error
      if (error.response) {
        console.error("Response error:", error.response.data);
        alert(`Error: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        console.error("Request error:", error.request);
        alert("Request failed. Please check your network.");
      } else {
        console.error("Error:", error.message);
        alert(`Unexpected error: ${error.message}`);
      }
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
