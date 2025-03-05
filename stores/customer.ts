import { defineStore } from "pinia";
import { ref } from "vue";
import useCustomerService from "~/composables/customersService";
import type { PaginationQuery } from "~/types/pagination";

export const useCustomerStore = defineStore("customer", () => {
  const {
    customers,
    totalPages,
    totalCustomers,
    isLoading,
    fetchCustomers,
    deleteCustomer,
  } = useCustomerService();

  // Default pagination params
  const query = ref<PaginationQuery>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "id",
    order: "DESC",
  });

  // **Wrapper function to fetch customers (calls fetchCustomers from composable)**
  const getCustomers = async () => {
    console.log("query", query.value);
    await fetchCustomers(query.value); // This will update the `customers` state automatically
  };

  return {
    customers,
    totalCustomers,
    totalPages,
    isLoading,
    getCustomers,
    deleteCustomer,
    query,
  };
});
