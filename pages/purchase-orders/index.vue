<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">PurchaseOrder Management</h1>
      <NuxtLink to="/purchase-orders/new" class="btn btn-primary w-32"
        >Add New</NuxtLink
      >
    </div>

    <Table
      :purchaseOrders="purchaseOrderStore.purchaseOrders"
      :isLoading="purchaseOrderStore.isLoading"
      v-on:delete="confirmDeletePurchaseOrder"
    />

    <!-- Reusable Delete Confirmation Modal -->
    <ConfirmDelete
      v-if="isDeleteModalOpen"
      :isOpen="isDeleteModalOpen"
      title="Confirm Delete"
      message="Are you sure you want to delete this purchase order?"
      confirmText="Yes, Delete"
      cancelText="Cancel"
      @confirm="toDeletePurchaseOrder"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { PurchaseOrder } from "~/types/purchase-order";
import Table from "~/components/purchase-order/Table.vue";

const purchaseOrderStore = usePurchaseOrderStore();
const { deletePurchaseOrder } = purchaseOrderService();

const purchaseOrders = ref<PurchaseOrder[]>([]);
const isDeleteModalOpen = ref(false);
const selectedPurchaseOrder = ref<PurchaseOrder | null>(null);
const isModalOpen = ref(false);
const purchaseOrderToDelete = ref<number | null>(null);

onMounted(async () => {
  await nextTick(async () => {
    await purchaseOrderStore.getPurchaseOrders();
  });
});

// Handle delete action
const confirmDeletePurchaseOrder = async (id: number) => {
  purchaseOrderToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const toDeletePurchaseOrder = async () => {
  console.log("purchaseOrderToDelete.value", purchaseOrderToDelete.value);
  if (purchaseOrderToDelete.value) {
    await deletePurchaseOrder(purchaseOrderToDelete.value);
    isDeleteModalOpen.value = false;
    purchaseOrderToDelete.value = null;
    await purchaseOrderStore.getPurchaseOrders();
  }
};
</script>
