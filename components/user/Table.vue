<template>
  <div
    class="overflow-x-auto bg-base-100 border border-gray-200 rounded-lg p-4"
  >
    <!-- Search Input -->
    <div class="flex justify-between mb-4">
      <input
        v-model="userStore.query.search"
        placeholder="Search Users..."
        class="input input-bordered w-64"
      />
    </div>

    <!-- Table -->
    <table class="table w-full">
      <thead>
        <tr class="bg-base-300 text-base-content text-lg">
          <th @click="setSorting('id')" class="cursor-pointer">ID</th>
          <th @click="setSorting('name')" class="cursor-pointer">Name</th>
          <th @click="setSorting('email')" class="cursor-pointer">Email</th>
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
            <button @click="$emit('edit', user)" class="btn btn-warning btn-sm">
              Edit
            </button>
            <button
              @click="$emit('delete', user.id)"
              class="btn btn-error btn-sm ml-2"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-4">
      <button
        @click="prevPage"
        :disabled="userStore.query.page === 1"
        class="btn btn-primary"
      >
        Previous
      </button>
      <span>Page {{ userStore.query.page }} of {{ userStore.totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="userStore.query.page === userStore.totalPages"
        class="btn btn-primary"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import useServiceUsers from "~/composables/usersService";
defineEmits(["edit", "delete"]);

const userStore = useUserStore();

// Store the timeout ID
let debounceTimeout = ref<NodeJS.Timeout | null>(null);

watch(
  () => userStore.query.search, // Watch only the search input
  (newValue) => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value); // Clear previous timeout

    debounceTimeout.value = setTimeout(() => {
      userStore.getUsers(); // Fetch users after 2s delay
    }, 500);
  }
);

// Sorting function
const setSorting = (field: string) => {
  userStore.query.sortBy = field;
  userStore.query.order = userStore.query.order === "ASC" ? "DESC" : "ASC";
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
