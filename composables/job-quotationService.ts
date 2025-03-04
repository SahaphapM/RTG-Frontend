import { useFetch } from "#app";
import type { JobQuotation } from "~/types/job-quotation";
import type { Invoice } from "~/types/invoice";

export default function useJobQuotationService() {
  const config = useRuntimeConfig();

  // Fetch JobQuotation
  const fetchJobQuotations = async (): Promise<JobQuotation[]> => {
    try {
      const { data } = await useFetch<JobQuotation[]>(
        `${config.public.apiBase}/job-quotations`,
        { credentials: "include" }
      );
      return data.value || [];
    } catch (error: any) {
      console.error("Error fetching jobQuotation:", error.message);
      return [];
    }
  };

  // Fetch JobQuotation by id
  const fetchJobQuotation = async (id: number): Promise<JobQuotation> => {
    try {
      const { data } = await useFetch<JobQuotation>(
        `${config.public.apiBase}/job-quotations/${id}`,
        { credentials: "include" }
      );
      return data.value || ({} as JobQuotation);
    } catch (error: any) {
      console.error("Error fetching jobQuotation:", error.message);
      return {} as JobQuotation;
    }
  };

  // Fetch JobQuotation
  const fetchByProjectId = async (
    projectId: number
  ): Promise<JobQuotation[]> => {
    try {
      const { data } = await useFetch<JobQuotation[]>(
        `${config.public.apiBase}/job-quotations/project/${projectId}`,
        { credentials: "include" }
      );
      return data.value || [];
    } catch (error: any) {
      console.error("Error fetching jobQuotation:", error.message);
      return [];
    }
  };

  // Create JobQuotation
  const createJobQuotation = async (
    projectId: number,
    jobQuotation: Omit<JobQuotation, "id">
  ) => {
    try {
      console.log("createJobQuotation", jobQuotation);
      const { data } = await useFetch<JobQuotation>(
        `${config.public.apiBase}/job-quotations/${projectId}`,

        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: jobQuotation,
          credentials: "include",
        }
      );
      return data.value;
    } catch (error: any) {
      console.error("Error creating jobQuotation:", error.message);
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
          credentials: "include",
        }
      );
      return data.value;
    } catch (error: any) {
      console.error("Error updating jobQuotation:", error.message);
    }
  };

  // Delete JobQuotation
  const deleteJobQuotation = async (id: number) => {
    try {
      await useFetch(`${config.public.apiBase}/job-quotations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error: any) {
      console.error("Error deleting jobQuotation:", error.message);
    }
  };

  //////////// Invoice ///////////////

  const fetchInvoices = async (jobQuotationId: number): Promise<Invoice[]> => {
    try {
      const { data } = await useFetch<Invoice[]>(
        `${config.public.apiBase}/job-quotations/${jobQuotationId}/invoices`,
        { credentials: "include" }
      );
      console.log("data", data);
      return data.value || [];
    } catch (error: any) {
      console.error("Error fetching invoices:", error.message);
      return [];
    }
  };

  const createInvoice = async (
    jobQuotationId: number,
    invoice: Partial<Invoice>
  ) => {
    try {
      const { data, error } = await useFetch<Invoice>(
        `${config.public.apiBase}/job-quotations/${jobQuotationId}/invoices`,
        {
          method: "POST",
          body: invoice,
          credentials: "include",
        }
      );
      if (error.value) {
        console.error("Server responded with error:", error.value);
      }
      return data.value;
    } catch (error: any) {
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
          credentials: "include",
        }
      );
      return data.value;
    } catch (error: any) {
      console.error("Error updating invoice:", error.message);
    }
  };
  const deleteInvoice = async (invoiceId: number) => {
    try {
      await useFetch(
        `${config.public.apiBase}/job-quotations/invoices/${invoiceId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
    } catch (error: any) {
      console.error("Error deleting invoice:", error.message);
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
