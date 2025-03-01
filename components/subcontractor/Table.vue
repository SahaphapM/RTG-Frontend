<template>
  <div class="table-container">
    <!-- Table -->
    <table class="custom-table">
      <thead>
        <tr>
          <th @click="setSorting('id')" class="cursor-pointer">
            <div class="flex items-center">
              ID <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th @click="setSorting('name')" class="cursor-pointer">
            <div class="flex items-center">
              Name <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th @click="setSorting('type')" class="cursor-pointer">
            <div class="flex items-center">
              Type <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th @click="setSorting('email')" class="cursor-pointer">
            <div class="flex items-center">
              Email <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th @click="setSorting('contact')" class="cursor-pointer">
            <div class="flex items-center">
              Contact <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th class="text-center" style="width: 120px">Actions</th>
          <!-- Fixed width for the Actions column -->
        </tr>
      </thead>

      <tbody v-if="subcontractorStore.isLoading">
        <tr v-for="n in 5" :key="n">
          <td v-for="i in 6" :key="i" class="py-4 px-6">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr
          v-for="subcontractor in subcontractorStore.subcontractors"
          :key="subcontractor.id"
          class="hover"
        >
          <td>{{ subcontractor.id }}</td>
          <td>{{ subcontractor.name }}</td>
          <td>{{ subcontractor.type }}</td>
          <td>{{ subcontractor.email }}</td>
          <td>{{ subcontractor.contact }}</td>
          <td class="text-center">
            <div class="flex justify-center gap-2">
              <button
                @click="$emit('edit', subcontractor)"
                class="btn btn-warning btn-sm w-16"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', subcontractor.id)"
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
      <button v-if="subcontractorStore.query.page > 1" @click="goToFirstPage">
        <<
      </button>

      <button @click="prevPage" :disabled="subcontractorStore.query.page === 1">
        <ChevronLeft />
      </button>

      <span>
        {{ subcontractorStore.query.page }} /
        {{ subcontractorStore.totalPages }}
      </span>

      <button
        @click="nextPage"
        :disabled="
          subcontractorStore.query.page === subcontractorStore.totalPages
        "
      >
        <ChevronRight />
      </button>
      <!-- Last Page Button (Hidden on Last Page) -->
      <button
        v-if="subcontractorStore.query.page < subcontractorStore.totalPages"
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
import { useSubcontractorStore } from "~/stores/subcontractor";

const subcontractorStore = useSubcontractorStore();

// Store the timeout ID
let debounceTimeout = ref<NodeJS.Timeout | null>(null);

// Watch for search or sorting changes and fetch data with a delay
watch(
  () => subcontractorStore.query.search,
  () => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => {
      subcontractorStore.getSubcontractors();
    }, 800);
  }
);

watch(
  () => [
    subcontractorStore.query,
    subcontractorStore.query.page,
    subcontractorStore.query.sortBy,
    subcontractorStore.query.order,
  ],
  async () => {
    await subcontractorStore.getSubcontractors();
  }
);

// Sorting function
const setSorting = (field: string) => {
  subcontractorStore.query.sortBy = field;
  subcontractorStore.query.order =
    subcontractorStore.query.order === "ASC" ? "DESC" : "ASC";
};
// ✅ Go to First Page
const goToFirstPage = () => {
  subcontractorStore.query.page = 1;
  subcontractorStore.getSubcontractors();
};

// ✅ Go to Last Page
const goToLastPage = () => {
  subcontractorStore.query.page = subcontractorStore.totalPages;
  subcontractorStore.getSubcontractors();
};

// Pagination functions
const prevPage = () => {
  if (subcontractorStore.query.page > 1) subcontractorStore.query.page--;
};
const nextPage = () => {
  if (subcontractorStore.query.page < subcontractorStore.totalPages)
    subcontractorStore.query.page++;
};

onMounted(async () => {
  nextTick(async () => {
    await subcontractorStore.getSubcontractors();
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
