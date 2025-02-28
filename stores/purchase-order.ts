import { defineStore } from "pinia";
import { ref } from "vue";
import usePurchaseOrderService from "~/composables/purchase-orderService";
import type { PaginationQuery } from "~/types/pagination";

export const usePurchaseOrderStore = defineStore("purchaseOrder", () => {
  const {
    purchaseOrders,
    totalPages,
    totalPurchaseOrders,
    isLoading,
    fetchPurchaseOrders,
    deletePurchaseOrder,
  } = usePurchaseOrderService();

  // Default pagination params
  const query = ref<PaginationQuery>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "number",
    order: "DESC",
  });

  // **Wrapper function to fetch purchaseOrders (calls fetchPurchaseOrders from composable)**
  const getPurchaseOrders = async () => {
    console.log("query", query.value);
    await fetchPurchaseOrders(query.value); // This will update the `purchaseOrders` state automatically
  };

  return {
    purchaseOrders,
    totalPurchaseOrders,
    totalPages,
    isLoading,
    getPurchaseOrders,
    deletePurchaseOrder,
    query,
  };
});
