import { useFetch } from "#app";
import type { PaginationQuery, PaginationResponse } from "~/types/pagination";
import type { Customer } from "~/types/customer";

export default function useCustomerService() {
  const config = useRuntimeConfig();

  // Reactive state
  const customers = ref<Customer[]>([]);
  const totalPages = ref(1);
  const totalCustomers = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const API_URL = `${config.public.apiBase}/customers`;

  // Fetch customers with pagination
  const fetchCustomers = async (query: PaginationQuery) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<
        PaginationResponse<Customer>
      >(API_URL, {
        query: query,
      });

      if (fetchError.value) throw new Error(fetchError.value.message);

      customers.value = data.value?.data || [];
      totalCustomers.value = data.value?.total || 0;
      totalPages.value = data.value?.totalPages || 1;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch customers.";
      console.error("Error fetching customers:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch a single customer by ID
  const fetchCustomer = async (id: number): Promise<Customer> => {
    try {
      const { data } = await useFetch<Customer>(`${API_URL}/${id}`);
      return data.value || ({} as Customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      return {} as Customer;
    }
  };

  // Create a new customer
  const createCustomer = async (newCustomer: Partial<Customer>) => {
    try {
      const response = await useFetch<Customer>(API_URL, {
        method: "POST",
        body: newCustomer,
      });

      if (!response.error.value) {
        return response.data.value;
      } else {
        console.error("Error response:", response.error.value);
        alert(
          `Failed to create customer: ${
            response.error.value.data?.message || response.error.value
          }`
        );
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message);
      alert(`Unexpected error: ${error.message}`);
    }
  };

  // Update an existing customer
  const updateCustomer = async (
    id: number,
    updatedCustomer: Partial<Customer>
  ) => {
    try {
      const { data } = await useFetch<Customer>(`${API_URL}/${id}`, {
        method: "PATCH",
        body: updatedCustomer,
      });
      return data.value;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  // Delete a customer
  const deleteCustomer = async (id: number) => {
    try {
      await useFetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return {
    customers,
    totalCustomers,
    totalPages,
    isLoading,
    error,
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
