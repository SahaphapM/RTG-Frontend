import { useFetch } from "#app";
import type { JobQuotation } from "~/types/job-quotation";

export default function useJobQuotationService() {
  const config = useRuntimeConfig();

  // Fetch JobQuotation
  const fetchJobQuotation = async (): Promise<JobQuotation[]> => {
    try {
      const { data } = await useFetch<JobQuotation[]>(
        `${config.public.apiBase}/job-quotations`
      );
      return data.value || [];
    } catch (error) {
      console.error("Error fetching jobQuotation:", error);
      return [];
    }
  };

  // Fetch JobQuotation
  const fetchByProjectId = async (
    projectId: number
  ): Promise<JobQuotation[]> => {
    try {
      const { data } = await useFetch<JobQuotation[]>(
        `${config.public.apiBase}/job-quotations/project/${projectId}`
      );
      return data.value || [];
    } catch (error) {
      console.error("Error fetching jobQuotation:", error);
      return [];
    }
  };

  // Create JobQuotation
  const createJobQuotation = async (
    projectId: number,
    jobQuotation: Omit<JobQuotation, "id">
  ) => {
    try {
      const { data } = await useFetch<JobQuotation>(
        `${config.public.apiBase}/job-quotations/${projectId}`,

        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: jobQuotation,
        }
      );
      console.log("data", data);
      return data.value;
    } catch (error) {
      console.error("Error creating jobQuotation:", error);
    }
  };

  // Update JobQuotation
  const updateJobQuotation = async (
    id: number,
    jobQuotation: Partial<JobQuotation>
  ) => {
    console.log("jobQuotation updated", jobQuotation);
    try {
      const { data } = await useFetch<JobQuotation>(
        `${config.public.apiBase}/job-quotations/${id}`,
        {
          method: "PUT",
          body: jobQuotation,
        }
      );
      return data.value;
    } catch (error) {
      console.error("Error updating jobQuotation:", error);
    }
  };

  // Delete JobQuotation
  const deleteJobQuotation = async (id: number) => {
    try {
      await useFetch(`${config.public.apiBase}/job-quotations/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting jobQuotation:", error);
    }
  };

  return {
    fetchJobQuotation,
    createJobQuotation,
    updateJobQuotation,
    deleteJobQuotation,
    fetchByProjectId,
  };
}
