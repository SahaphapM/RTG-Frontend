import { defineStore } from "pinia";
import { ref } from "vue";
import usePurchaseOrderService from "~/composables/purchase-orderService";
import type { PurchaseOrder } from "~/types/purchase-order";
export const usePurchaseOrderStore = defineStore("purchaseOrder", () => {
  const { fetchPurchaseOrders } = usePurchaseOrderService();

  const isEditing = ref(false);
  const purchaseOrders = ref<PurchaseOrder[]>([]);
  const purchaseOrder = ref<PurchaseOrder | null>(null);
  const isLoading = ref(false);

  // Fetch PurchaseOrders
  const getPurchaseOrders = async () => {
    isLoading.value = true;
    try {
      purchaseOrders.value = await fetchPurchaseOrders();
    } catch (error) {
      console.error("Error fetching purchaseOrders:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    purchaseOrders,
    isLoading,
    getPurchaseOrders,
    isEditing,
    purchaseOrder,
  };
});
