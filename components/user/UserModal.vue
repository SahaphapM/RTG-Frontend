<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-50"
  >
    <!-- Modal Content -->
    <div
      class="bg-white p-6 rounded-lg w-96 shadow-lg scale-95 transition-transform duration-300 ease-in-out"
    >
      <h2 class="text-xl font-bold mb-4">
        {{ user ? "Edit User" : "Add User" }}
      </h2>

      <!-- Form -->
      <form @submit.prevent="save">
        <input
          v-model="form.name"
          type="text"
          placeholder="Name"
          class="input input-bordered w-full mb-2"
          required
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="input input-bordered w-full mb-2"
          required
        />
        <input
          v-model="form.position"
          type="text"
          placeholder="Position"
          class="input input-bordered w-full mb-2"
          required
        />
        <select
          v-model="form.role"
          class="select select-bordered w-full mb-2"
          required
        >
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>

        <div class="flex justify-end mt-4">
          <button
            @click="$emit('close')"
            type="button"
            class="btn btn-error mr-2 px-8"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-success px-10">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import type { User } from "~/types/user";

const props = defineProps<{ user?: User | null }>();
const emit = defineEmits(["save", "close"]);

const form = ref<User>({
  name: "",
  position: "",
  contact: "",
  email: "",
  role: "User",
});

// Watch for changes (Edit Mode)
watch(
  () => props.user,
  (user) => {
    if (user) {
      form.value = { ...user };
    } else {
      form.value = {
        name: "",
        email: "",
        contact: "",
        position: "",
        role: "User",
      };
    }
  },
  { immediate: true }
);

// Save User
const save = () => {
  emit("save", form.value);
};
</script>
