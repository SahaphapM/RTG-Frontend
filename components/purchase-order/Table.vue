<template>
  <div class="overflow-x-auto bg-base-100 shadow-lg rounded-lg">
    <table class="table w-full border border-gray-200">
      <thead>
        <tr class="bg-base-300 text-base-content text-lg">
          <th class="py-4 px-6">No.</th>
          <th class="py-4 px-6">Description</th>
          <th class="py-4 px-6">Subcontractor</th>
          <th class="py-4 px-6">Price</th>
          <th class="py-4 px-6">Date</th>
          <th class="py-4 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="purchaseOrder in purchaseOrders"
          :key="purchaseOrder.id"
          class="hover border-b border-gray-300 cursor-pointer"
          @click="navigateToPurchaseOrder(purchaseOrder.id)"
        >
          <td class="py-4 px-6">{{ purchaseOrder.number }}</td>
          <td class="py-4 px-6">{{ purchaseOrder.description }}</td>
          <td class="py-4 px-6">{{ purchaseOrder.subcontractor?.name }}</td>
          <td class="py-4 px-6">{{ purchaseOrder.total }}</td>
          <td class="py-4 px-6">{{ purchaseOrder.date }}</td>
          <td class="py-4 px-6 text-center">
            <button
              @click.stop="$emit('edit', purchaseOrder)"
              class="btn btn-warning btn-sm w-16 mr-2"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import type { PurchaseOrder } from "~/types/purchase-order";

const props = defineProps<{ purchaseOrders: PurchaseOrder[] }>();
const emit = defineEmits(["edit", "delete"]);
const router = useRouter();

const navigateToPurchaseOrder = (id: number) => {
  router.push(`/purchase-orders/${id}`);
};
</script>
