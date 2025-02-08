import { useFetch } from "#app";
import type { JobQuotation } from "~/types/job-quotation";
import type { Payment } from "~/types/payment";

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

  //////////// Payment ///////////////

  const fetchPayments = async (jobQuotationId: number): Promise<Payment[]> => {
    try {
      const { data } = await useFetch<Payment[]>(
        `${config.public.apiBase}/job-quotations/${jobQuotationId}/payments`
      );
      return data.value || [];
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  };

  const createPayment = async (
    jobQuotationId: number,
    payment: Partial<Payment>
  ) => {
    try {
      const { data } = await useFetch<Payment>(
        `${config.public.apiBase}/job-quotations/${jobQuotationId}/payments`,
        {
          method: "POST",
          body: payment,
        }
      );
      return data.value;
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const updatePayment = async (payment: Partial<Payment>) => {
    try {
      const { data } = await useFetch<Payment>(
        `${config.public.apiBase}/job-quotations/payments/${payment.id}`,
        {
          method: "PUT",
          body: payment,
        }
      );
      return data.value;
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };
  const deletePayment = async (paymentId: number) => {
    try {
      await useFetch(
        `${config.public.apiBase}/job-quotations/payments/${paymentId}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  return {
    fetchJobQuotation,
    fetchJobQuotations,
    createJobQuotation,
    updateJobQuotation,
    deleteJobQuotation,
    fetchByProjectId,
    createPayment,
    updatePayment,
    deletePayment,
    fetchPayments,
  };
}
