<template>
  <div class="table-container">
    <!-- Table -->
    <table class="custom-table">
      <thead>
        <tr>
          <th @click="setSorting('id')" class="cursor-pointer">
            <div class="flex">ID. <SortDescIcon class="sort-icon" /></div>
          </th>
          <th @click="setSorting('name')" class="cursor-pointer">
            <div class="flex">Name <SortDescIcon class="sort-icon" /></div>
          </th>
          <th @click="setSorting('email')" class="cursor-pointer">
            <div class="flex">Email <SortDescIcon class="sort-icon" /></div>
          </th>
          <th>Position</th>
          <th>Role</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>

      <tbody v-if="userStore.isLoading">
        <tr v-for="n in 5" :key="n">
          <td v-for="i in 6" :key="i" class="py-4 px-6">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr
          v-for="user in userStore.users"
          :key="user.id"
          class="hover border-b border-gray-200"
        >
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.position }}</td>
          <td>
            <span class="badge bg-gray-200 text-gray-800 px-3 py-2">{{
              user.role
            }}</span>
          </td>
          <td class="text-center">
            <button
              @click="$emit('edit', user)"
              class="btn btn-warning btn-sm w-16"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', user.id)"
              class="btn btn-error btn-sm ml-2 w-16"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination Controls -->
    <div class="pagination">
      <button @click="prevPage" :disabled="userStore.query.page === 1">
        <ChevronLeft />
      </button>

      <span> {{ userStore.query.page }} / {{ userStore.totalPages }} </span>

      <button
        @click="nextPage"
        :disabled="userStore.query.page === userStore.totalPages"
      >
        <ChevronRight />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, SortDescIcon } from "lucide-vue-next";
import { defineProps, defineEmits } from "vue";
import useServiceUsers from "~/composables/usersService";
defineEmits(["edit", "delete"]);

const userStore = useUserStore();

// Store the timeout ID
let debounceTimeout = ref<NodeJS.Timeout | null>(null);

watch(
  () => userStore.query, // Watch only the search input
  (newValue) => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value); // Clear previous timeout

    debounceTimeout.value = setTimeout(() => {
      userStore.getUsers(); // Fetch users after 2s delay
    }, 200);
  },
  { deep: true }
);

// Sorting function
const setSorting = (field: string) => {
  userStore.query.sortBy = field;
  userStore.query.order = userStore.query.order === "ASC" ? "DESC" : "ASC";
  console.log("userStore.query", userStore.query.sortBy);
};

// Pagination functions
const prevPage = () => {
  if (userStore.query.page > 1) userStore.query.page--;
};

const nextPage = () => {
  if (userStore.query.page < userStore.totalPages) userStore.query.page++;
};

onMounted(async () => {
  nextTick(async () => {
    await userStore.getUsers();
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
.sort-icon {
  color: #5a5a5a;
  width: 15px;
  height: 15px;
  margin-top: 5px;
  margin-left: 4px;
}
</style>
