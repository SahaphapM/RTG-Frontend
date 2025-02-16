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
      @edit="editPurchaseOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { PurchaseOrder } from "~/types/purchase-order";
import Table from "~/components/purchase-order/Table.vue";

const purchaseOrderStore = usePurchaseOrderStore();
const isDeleteModalOpen = ref(false);
const purchaseOrderToDelete = ref<number | null>(null);

onMounted(async () => {
  await nextTick(async () => {
    await purchaseOrderStore.getPurchaseOrders();
  });
});

const editPurchaseOrder = (purchaseOrder: PurchaseOrder) => {
  navigateTo(`/purchase-orders/${purchaseOrder.id}`);
  purchaseOrderStore.isEditing = true;
};

const confirmDeletePurchaseOrder = (id: number) => {
  purchaseOrderToDelete.value = id;
  isDeleteModalOpen.value = true;
};
</script>
