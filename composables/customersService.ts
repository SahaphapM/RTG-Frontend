import { useFetch } from "#app";
import type { Customer } from "~/types/customer";

export default function useCustomerService() {
  const config = useRuntimeConfig();

  // Fetch Customers
  const fetchCustomers = async (): Promise<Customer[]> => {
    try {
      const { data } = await useFetch<Customer[]>(
        `${config.public.apiBase}/customers`
      );
      return data.value || [];
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  };

  // Create Customer
  const createCustomer = async (
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const { data } = await useFetch<Customer>(
        `${config.public.apiBase}/customers`,
        {
          method: "POST",
          body: customer,
        }
      );
      return data.value;
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  // Update Customer
  const updateCustomer = async (id: number, customer: Partial<Customer>) => {
    try {
      await useFetch(`${config.public.apiBase}/customers/${id}`, {
        method: "PUT",
        body: customer,
      });
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  // Delete Customer
  const deleteCustomer = async (id: number) => {
    try {
      await useFetch(`${config.public.apiBase}/customers/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return { fetchCustomers, createCustomer, updateCustomer, deleteCustomer };
}
