<template>
  <div class="table-container">
    <table class="custom-table">
      <!-- Table Header -->
      <thead>
        <tr>
          <th @click="setSorting('number')" class="cursor-pointer">
            <div class="flex">No. <SortDescIcon class="sort-icon" /></div>
          </th>
          <th @click="setSorting('name')" class="cursor-pointer">
            <div class="flex">Name <SortDescIcon class="sort-icon" /></div>
          </th>
          <th>Customer</th>
          <th>Start Date</th>
          <!-- <th>End Date</th> -->
          <th @click="setSorting('totalProjectPrice')" class="cursor-pointer">
            <div class="flex justify-end text-right">
              Total Price
              <SortDescIcon class="sort-icon" />
            </div>
          </th>
          <th v-if="role === 'admin'" style="text-align: center; width: 120px">
            Actions
          </th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody>
        <tr
          v-for="project in projectStore.projects"
          :key="project.id"
          @click="role === 'admin' ? navigateToProject(project.id!) : null"
          :class="{
            'cursor-pointer': role === 'admin',
          }"
        >
          <td class="text-center">{{ project.number }}</td>
          <td>{{ project.name }}</td>
          <td class="truncate" :title="project.customer?.name">
            {{ project.customer?.name || "N/A" }}
          </td>
          <td class="text-center">{{ project.startDate }}</td>
          <!-- <td class="text-center">{{ project.endDate }}</td> -->
          <!-- <td>
            <div
              class="badge gap-2 badge-md font-medium text-white h-7 w-20"
              :class="purchaseOrder.shippedDate ? 'bg-success' : 'bg-error'"
            >
              {{ purchaseOrder.shippedDate ? "Shipped" : "Shipping" }}
            </div>
          </td> -->
          <td class="text-right">
            {{ project.totalProjectPrice!.toLocaleString() }}
          </td>
          <td v-if="role === 'admin'">
            <div class="action-buttons gap-2">
              <button
                @click.stop="$emit('edit', project)"
                class="btn btn-warning btn-sm w-16"
              >
                Edit
              </button>
              <button
                @click.stop="$emit('delete', project.id)"
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
      <button @click="prevPage" :disabled="projectStore.query.page === 1">
        <ChevronLeft />
      </button>

      <span>
        {{ projectStore.query.page }} / {{ projectStore.totalPages }}
      </span>

      <button
        @click="nextPage"
        :disabled="projectStore.query.page === projectStore.totalPages"
      >
        <ChevronRight />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  SortDescIcon,
  SquarePen,
  Trash2,
} from "lucide-vue-next";
import { defineEmits, onMounted, nextTick, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "~/stores/project";

const prop = defineProps<{ role: string }>();

const emit = defineEmits(["edit", "delete"]);
const router = useRouter();
const projectStore = useProjectStore();

const navigateToProject = (id: number) => {
  router.push(`/projects/${id}`);
};

// Debounce Search
let debounceTimeout = ref<NodeJS.Timeout | null>(null);

watch(
  () => projectStore.query.search,
  () => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => {
      projectStore.getProjects();
    }, 800);
  }
);

watch(
  () => [
    projectStore.query,
    projectStore.query.page,
    projectStore.query.sortBy,
    projectStore.query.order,
  ],
  async () => {
    await projectStore.getProjects();
  }
);

// Sorting function
const setSorting = (field: string) => {
  projectStore.query.sortBy = field;
  projectStore.query.order =
    projectStore.query.order === "ASC" ? "DESC" : "ASC";
};

// Pagination functions
const prevPage = () => {
  if (projectStore.query.page > 1) projectStore.query.page--;
};

const nextPage = () => {
  if (projectStore.query.page < projectStore.totalPages)
    projectStore.query.page++;
};

onMounted(async () => {
  nextTick(async () => {
    await projectStore.getProjects();
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
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

/* Alignments */
.text-center {
  text-align: left;
}
.text-right {
  text-align: right;
}
.truncate {
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Row Hover Effect */
.custom-table tbody tr:hover {
  background: #f9fafb;
}

/* Actions Column */
.action-buttons {
  text-align: center;
  display: flex;

  justify-content: center;
}

.action-buttons button {
  color: #252525;
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

.sort-icon {
  color: #5a5a5a;
  width: 15px;
  height: 15px;
  margin-top: 5px;
  margin-left: 4px;
}
</style>
