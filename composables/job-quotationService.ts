import { useFetch } from "#app";
import type { JobQuotation } from "~/types/job-quotation";
import type { Invoice } from "~/types/invoice";

export default function useJobQuotationService() {
  const config = useRuntimeConfig();

  // Fetch JobQuotation
  const fetchJobQuotations = async (): Promise<JobQuotation[]> => {
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

  // Fetch JobQuotation by id
  const fetchJobQuotation = async (id: number): Promise<JobQuotation> => {
    try {
      const { data } = await useFetch<JobQuotation>(
        `${config.public.apiBase}/job-quotations/${id}`
      );
      return data.value || ({} as JobQuotation);
    } catch (error) {
      console.error("Error fetching jobQuotation:", error);
      return {} as JobQuotation;
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
    try {
      console.log("updateJobQuotation", jobQuotation);
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

  //////////// Invoice ///////////////

  const fetchInvoices = async (jobQuotationId: number): Promise<Invoice[]> => {
    try {
      const { data } = await useFetch<Invoice[]>(
        `${config.public.apiBase}/job-quotations/${jobQuotationId}/invoices`
      );
      return data.value || [];
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }
  };

  const createInvoice = async (
    jobQuotationId: number,
    invoice: Partial<Invoice>
  ) => {
    try {
      const { data } = await useFetch<Invoice>(
        `${config.public.apiBase}/job-quotations/${jobQuotationId}/invoices`,
        {
          method: "POST",
          body: invoice,
        }
      );
      return data.value;
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const updateInvoice = async (invoice: Partial<Invoice>) => {
    try {
      const { data } = await useFetch<Invoice>(
        `${config.public.apiBase}/job-quotations/invoices/${invoice.id}`,
        {
          method: "PUT",
          body: invoice,
        }
      );
      return data.value;
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };
  const deleteInvoice = async (invoiceId: number) => {
    try {
      await useFetch(
        `${config.public.apiBase}/job-quotations/invoices/${invoiceId}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  return {
    fetchJobQuotation,
    fetchJobQuotations,
    createJobQuotation,
    updateJobQuotation,
    deleteJobQuotation,
    fetchByProjectId,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    fetchInvoices,
  };
}
