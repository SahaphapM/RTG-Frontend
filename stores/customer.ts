import { defineStore } from "pinia";
import { ref } from "vue";
import useCustomerService from "~/composables/customersService";
import type { Customer } from "~/types/customer";

export const useCustomerStore = defineStore("customer", () => {
  const { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } =
    useCustomerService();

  const customers = ref<Customer[]>([]);
  const isLoading = ref(false);

  // Fetch Customers
  const getCustomers = async () => {
    isLoading.value = true;
    try {
      customers.value = await fetchCustomers();
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    customers,
    isLoading,
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
});
