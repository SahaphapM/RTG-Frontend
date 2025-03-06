<template>
  <div class="table-container">
    <table class="custom-table">
      <thead>
        <tr>
          <th @click="setSorting('number')" class="sortable w-28">
            <div class="flex items-center">
              No. <SortDescIcon class="sort-icon" />
            </div>
          </th>

          <th @click="setSorting('name')" class="sortable">
            <div class="flex items-center">
              Name <SortDescIcon class="sort-icon" />
            </div>
          </th>

          <th>
            <div class="flex items-center">Subcontractor</div>
          </th>
          <th @click="setSorting('date')" class="sortable text-center w-32">
            <div class="flex justify-center items-center">
              Date <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th>
            <div class="flex justify-center items-center w-22">
              Delivery <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th @click="setSorting('total')" class="sortable w-32">
            <div class="flex justify-end items-center">
              Price <SortDescIcon class="sort-icon" />
            </div>
          </th>

          <th class="text-center w-32">Actions</th>
        </tr>
      </thead>

      <tbody v-if="isLoading">
        <tr v-for="n in 5" :key="n">
          <td v-for="i in 6" :key="i">
            <div class="loading-placeholder"></div>
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr
          v-for="purchaseOrder in purchaseOrders"
          :key="purchaseOrder.id!"
          class="hover-effect"
          @click="navigateToPurchaseOrder(purchaseOrder.id!)"
        >
          <td>{{ purchaseOrder.number }}</td>

          <td class="ellipsis-cell">{{ purchaseOrder.name }}</td>

          <td class="ellipsis-cell">
            {{ purchaseOrder.subcontractor?.name || "-" }}
          </td>
          <td class="text-center">{{ formatDate(purchaseOrder.date) }}</td>
          <td class="text-center">
            <div
              class="badge gap-2 badge-md font-medium text-white h-7 w-20"
              :class="
                purchaseOrder.shippedDate ? 'bg-success' : 'bg-neutral-400'
              "
            >
              {{ purchaseOrder.shippedDate ? "Shipped" : "Shipping" }}
            </div>
          </td>
          <td class="text-right">
            {{
              formatPrice(purchaseOrder.total) !== "0"
                ? formatPrice(purchaseOrder.total)
                : "-"
            }}
          </td>

          <td class="text-center">
            <div class="flex gap-2">
              <button
                @click.stop="navigateToPurchaseOrder(purchaseOrder.id!)"
                class="btn btn-warning btn-sm w-16"
              >
                Edit
              </button>
              <button
                @click.stop="$emit('delete', purchaseOrder.id)"
                class="btn btn-error btn-sm w-16"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="pagination">
      <!-- First Page Button (Hidden on First Page) -->
      <button v-if="purchaseOrderStore.query.page > 1" @click="goToFirstPage">
        <<
      </button>

      <button @click="prevPage" :disabled="purchaseOrderStore.query.page === 1">
        <ChevronLeft />
      </button>

      <span>
        {{ purchaseOrderStore.query.page }} /
        {{ purchaseOrderStore.totalPages }}
      </span>

      <button
        @click="nextPage"
        :disabled="
          purchaseOrderStore.query.page === purchaseOrderStore.totalPages
        "
      >
        <ChevronRight />
      </button>
      <!-- Last Page Button (Hidden on Last Page) -->
      <button
        v-if="purchaseOrderStore.query.page < purchaseOrderStore.totalPages"
        @click="goToLastPage"
      >
        >>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { ChevronLeft, ChevronRight, SortDescIcon } from "lucide-vue-next";
import type { PurchaseOrder } from "~/types/purchase-order";
import { usePurchaseOrderStore } from "~/stores/purchase-order";

const props = defineProps<{
  purchaseOrders: PurchaseOrder[];
  isLoading: boolean;
}>();
const emit = defineEmits(["edit", "delete"]);
const router = useRouter();
const purchaseOrderStore = usePurchaseOrderStore();

// Sorting
const setSorting = (field: string) => {
  purchaseOrderStore.query.sortBy = field;
  purchaseOrderStore.query.order =
    purchaseOrderStore.query.order === "ASC" ? "DESC" : "ASC";
  purchaseOrderStore.getPurchaseOrders();
};

// ✅ Go to First Page
const goToFirstPage = () => {
  purchaseOrderStore.query.page = 1;
  purchaseOrderStore.getPurchaseOrders();
};

// ✅ Go to Last Page
const goToLastPage = () => {
  purchaseOrderStore.query.page = purchaseOrderStore.totalPages;
  purchaseOrderStore.getPurchaseOrders();
};

// Pagination
const prevPage = () => {
  if (purchaseOrderStore.query.page > 1) purchaseOrderStore.query.page--;
};

const nextPage = () => {
  if (purchaseOrderStore.query.page < purchaseOrderStore.totalPages)
    purchaseOrderStore.query.page++;
};

// Navigation
const navigateToPurchaseOrder = (id: number) => {
  router.push(`/purchase-orders/${id}`);
};

// Helper Functions
const formatDate = (date: string) => new Date(date).toLocaleDateString();
const formatPrice = (price: number) =>
  price ? `${price.toLocaleString()}` : "-";

// Debounce search
let debounceTimeout = ref<NodeJS.Timeout | null>(null);

watch(
  () => purchaseOrderStore.query.search,
  () => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => {
      purchaseOrderStore.getPurchaseOrders();
    }, 800);
  }
);

watch(
  () => [
    purchaseOrderStore.query,
    purchaseOrderStore.query.page,
    purchaseOrderStore.query.sortBy,
  ],
  async () => {
    await purchaseOrderStore.getPurchaseOrders();
  }
);
</script>

<style scoped>
/* Container */
.table-container {
  overflow-x: auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Table */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

/* Table Header */
.custom-table thead tr {
  background: rgb(231, 231, 231);
  text-align: left;
  font-size: 15px;
  color: #1d1d1d;
}

.custom-table th {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

/* Table Body */
.custom-table td {
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

/* Alignments */
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}

/* Row Hover Effect */
.custom-table tbody tr:hover {
  background: #f9fafb;
  cursor: pointer;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 10px;
}

.pagination button {
  padding: 6px 10px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  background: rgb(207, 207, 207);
  color: #7c7c7c;
  border-radius: 4px;
}
.pagination button:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
}

/* Sorting Icon */
.sort-icon {
  color: #5a5a5a;
  width: 15px;
  height: 15px;
  margin-left: 6px;
}
/* Sortable Columns */
.sortable {
  cursor: pointer;
}
</style>
