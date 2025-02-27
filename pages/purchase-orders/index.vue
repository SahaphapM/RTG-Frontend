<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="flex items-center mb-6">
      <h1 class="text-2xl font-bold w-[50%]">PurchaseOrder Management</h1>
      <div class="flex gap-4 w-[50%] justify-end">
        <!-- Search Input -->
        <div class="w-[70%] min-w-[150px]">
          <input
            v-model="purchaseOrderStore.query.search"
            placeholder="Search PurchaseOrders"
            class="input input-bordered w-full"
          />
        </div>
        <!-- Action Buttons -->
        <div class="flex justify-end">
          <NuxtLink to="/purchase-orders/new" class="btn btn-primary w-32">
            Add New
          </NuxtLink>
        </div>
      </div>
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
const isDeleteModalOpen = ref(false);
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
  if (purchaseOrderToDelete.value) {
    await deletePurchaseOrder(purchaseOrderToDelete.value);
    isDeleteModalOpen.value = false;
    purchaseOrderToDelete.value = null;
    await purchaseOrderStore.getPurchaseOrders();
  }
};
</script>
