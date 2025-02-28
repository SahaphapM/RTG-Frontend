<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="flex items-center mb-6">
      <h1 class="text-2xl font-bold w-[50%]">User Management</h1>
      <div class="flex gap-4 w-[50%] justify-end">
        <!-- Search Input -->
        <div class="w-[70%] min-w-[150px]">
          <input
            v-model="userStore.query.search"
            placeholder="Search Users"
            class="input input-bordered w-full"
          />
        </div>
        <button @click="openAddUserModal" class="btn btn-primary w-32">
          Add New
        </button>
      </div>
    </div>

    <!-- User Table -->
    <Table @edit="editUser" @delete="confirmDeleteUser" @save="saveUser" />

    <!-- User Modal (Add/Edit) -->
    <UserModal
      v-if="isModalOpen"
      :user="selectedUser"
      @save="saveUser"
      @close="closeModal"
    />

    <!-- Reusable Delete Confirmation Modal -->
    <ConfirmDelete
      v-if="isDeleteModalOpen"
      :isOpen="isDeleteModalOpen"
      title="Confirm Delete"
      message="Are you sure you want to delete this user?"
      confirmText="Yes, Delete"
      cancelText="Cancel"
      @confirm="confirmDeleteUser"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import Table from "~/components/user/Table.vue";
import UserModal from "~/components/user/UserModal.vue";
import useServiceUsers from "~/composables/usersService";
import { ref, onMounted, nextTick } from "vue";
import type { User } from "~/types/user";
import user from "~/server/api/user";

const userStore = useUserStore();
const { fetchUsers, createUser } = useServiceUsers();

const isModalOpen = ref(false);
const selectedUser = ref<User | null>(null);
const isDeleteModalOpen = ref(false);
const userToDelete = ref<number | null>(null);

// Load Users on Page Load
onMounted(async () => {
  await nextTick(async () => {
    getUsers();
  });
});

// Fetch Users
const getUsers = async () => {
  await userStore.getUsers();
};

// Open Modal for Adding New User
const openAddUserModal = () => {
  selectedUser.value = null; // New user
  isModalOpen.value = true;
};

// Open Modal for Editing User
const editUser = (user: User) => {
  selectedUser.value = user;
  isModalOpen.value = true;
};

// Save (Add or Edit) User
const saveUser = async (userData: Omit<User, "id">) => {
  await createUser(userData);
  isModalOpen.value = false;
  getUsers();
};

// Open Delete Confirmation Modal
const confirmDeleteUser = (id: number) => {
  userToDelete.value = id;
  isDeleteModalOpen.value = true;
};

// Delete User
const deleteUser = async (id: number) => {
  if (userToDelete.value === id) {
    await userStore.deleteUser(id);
    isDeleteModalOpen.value = false;
    getUsers();
  }
};

// Close Modal
const closeModal = () => {
  isModalOpen.value = false;
};

definePageMeta({
  middleware: "auth-role",
});
</script>
