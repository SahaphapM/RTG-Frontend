<template>
  <div class="table-container">
    <!-- Table -->
    <table class="custom-table">
      <thead>
        <tr>
          <th @click="setSorting('id')" class="cursor-pointer w-20">
            <div class="flex items-center">
              ID <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th @click="setSorting('name')" class="cursor-pointer">
            <div class="flex items-center">
              Name <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th @click="setSorting('email')" class="cursor-pointer">
            <div class="flex items-center">
              Email <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th @click="setSorting('agentName')" class="cursor-pointer">
            <div class="flex items-center">
              Agent <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <!-- <th @click="setSorting('email')" class="cursor-pointer">
            <div class="flex items-center">
              Agent Email <SortDescIcon class="sort-icon" />
            </div>
          </th> -->
          <th @click="setSorting('agentContact')" class="cursor-pointer w-46">
            <div class="flex items-center">
              Agent Contact <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th class="text-center w-32">Actions</th>
        </tr>
      </thead>

      <tbody v-if="customerStore.isLoading">
        <tr v-for="n in 5" :key="n">
          <td v-for="i in 5" :key="i" class="py-4 px-6">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr
          v-for="customer in customerStore.customers"
          :key="customer.id"
          class="hover"
        >
          <td>{{ customer.id }}</td>
          <td class="ellipsis-cell">{{ customer.name || "-" }}</td>
          <td class="ellipsis-cell">{{ customer.email || "-" }}</td>
          <td class="ellipsis-cell">{{ customer.agentName || "-" }}</td>
          <!-- <td class="ellipsis-cell">{{ customer.agentEmail || "-" }}</td> -->
          <td class="ellipsis-cell">{{ customer.agentContact || "-" }}</td>

          <td class="text-center">
            <div class="justify-center flex gap-2">
              <button
                @click="$emit('edit', customer)"
                class="btn btn-warning btn-sm w-16"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', customer.id)"
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
      <button v-if="customerStore.query.page > 1" @click="goToFirstPage">
        <<
      </button>

      <button @click="prevPage" :disabled="customerStore.query.page === 1">
        <ChevronLeft />
      </button>

      <span>
        {{ customerStore.query.page }} /
        {{ customerStore.totalPages }}
      </span>

      <button
        @click="nextPage"
        :disabled="customerStore.query.page === customerStore.totalPages"
      >
        <ChevronRight />
      </button>
      <!-- Last Page Button (Hidden on Last Page) -->
      <button
        v-if="customerStore.query.page < customerStore.totalPages"
        @click="goToLastPage"
      >
        >>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, SortDescIcon } from "lucide-vue-next";
import { ref, watch, onMounted, nextTick } from "vue";
import { useCustomerStore } from "~/stores/customer";

const customerStore = useCustomerStore();

// Store the timeout ID
let debounceTimeout = ref<NodeJS.Timeout | null>(null);

// Watch for search or sorting changes and fetch data with a delay
watch(
  () => customerStore.query.search,
  () => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => {
      customerStore.getCustomers();
    }, 800);
  }
);

watch(
  () => [
    customerStore.query,
    customerStore.query.page,
    customerStore.query.sortBy,
    customerStore.query.order,
  ],
  async () => {
    await customerStore.getCustomers();
  }
);

// Sorting function
const setSorting = (field: string) => {
  customerStore.query.sortBy = field;
  customerStore.query.order =
    customerStore.query.order === "ASC" ? "DESC" : "ASC";
};

// ✅ Go to First Page
const goToFirstPage = () => {
  customerStore.query.page = 1;
  customerStore.getCustomers();
};

// ✅ Go to Last Page
const goToLastPage = () => {
  customerStore.query.page = customerStore.totalPages;
  customerStore.getCustomers();
};

// Pagination functions
const prevPage = () => {
  if (customerStore.query.page > 1) customerStore.query.page--;
};
const nextPage = () => {
  if (customerStore.query.page < customerStore.totalPages)
    customerStore.query.page++;
};

onMounted(async () => {
  nextTick(async () => {
    await customerStore.getCustomers();
    console.log("customerStore.customers", customerStore.customers);
  });
});
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
</style>
