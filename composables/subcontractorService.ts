import { useFetch } from "#app";
import type { PaginationQuery, PaginationResponse } from "~/types/pagination";
import type { Subcontractor } from "~/types/subcontractor";

export default function useSubcontractorService() {
  const config = useRuntimeConfig();

  // Reactive state
  const subcontractors = ref<Subcontractor[]>([]);
  const totalPages = ref(1);
  const totalSubcontractors = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const API_URL = `${config.public.apiBase}/subcontractors`;

  // Fetch subcontractors with pagination
  const fetchSubcontractors = async (query: PaginationQuery) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<
        PaginationResponse<Subcontractor>
      >(API_URL, {
        query: query,
        credentials: "include", // Set to send with credentials
      });
      if (fetchError.value) throw new Error(fetchError.value.message);

      subcontractors.value = data.value?.data || [];
      totalSubcontractors.value = data.value?.total || 0;
      totalPages.value = data.value?.totalPages || 1;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch subcontractors.";
      console.error("Error fetching subcontractors:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch single subcontractor by ID
  const fetchSubcontractor = async (id: number): Promise<Subcontractor> => {
    try {
      const { data } = await useFetch<Subcontractor>(`${API_URL}/${id}`, {
        credentials: "include", // Set to send with credentials
      });
      return data.value || ({} as Subcontractor);
    } catch (error) {
      console.error("Error fetching subcontractor:", error);
      return {} as Subcontractor;
    }
  };

  // Create a new subcontractor
  const createSubcontractor = async (
    newSubcontractor: Partial<Subcontractor>
  ) => {
    try {
      const response = await useFetch<Subcontractor>(API_URL, {
        method: "POST",
        body: newSubcontractor,
        credentials: "include", // Set to send with credentials
      });

      if (!response.error.value) {
        console.log("Subcontractor created:", response.data.value);
        return response.data.value;
      } else {
        console.error("Error response:", response.error.value);
        alert(
          `Failed to create subcontractor: ${
            response.error.value.data?.message || response.error.value
          }`
        );
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message);
      alert(`Unexpected error: ${error.message}`);
    }
  };

  // Update an existing subcontractor
  const updateSubcontractor = async (
    id: number,
    updatedSubcontractor: Partial<Subcontractor>
  ) => {
    try {
      const { data } = await useFetch<Subcontractor>(`${API_URL}/${id}`, {
        method: "PATCH",
        body: updatedSubcontractor,
        credentials: "include", // Set to send with credentials
      });
      return data.value;
    } catch (error) {
      console.error("Error updating subcontractor:", error);
    }
  };

  // Delete a subcontractor
  const deleteSubcontractor = async (id: number) => {
    try {
      const response = await useFetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.error.value) {
      } else {
        throw new Error(
          "Subcontractor cannot be deleted as it is associated with an existing job quotation."
        );
      }
    } catch (error: any) {
      window.alert(
        "❌ Subcontractor cannot be deleted. It is linked to an existing job quotation."
      );
      console.error("Error deleting subcontractor:", error);
    }
  };

  return {
    subcontractors,
    totalSubcontractors,
    totalPages,
    isLoading,
    error,
    fetchSubcontractors,
    fetchSubcontractor,
    createSubcontractor,
    updateSubcontractor,
    deleteSubcontractor,
  };
}
