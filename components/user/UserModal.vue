<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-50"
  >
    <!-- Modal Content -->
    <div
      class="bg-white p-6 rounded-lg w-[50%] shadow-lg scale-95 transition-transform duration-300 ease-in-out"
    >
      <h2 class="text-xl font-bold mb-4">
        {{ user ? "Edit User" : "Add User" }}
      </h2>

      <input
        v-model="form.name"
        type="text"
        placeholder="Name"
        class="input input-bordered w-full mb-2"
        required
      />
      <input
        v-model="form.contact"
        type="contact"
        placeholder="Contact"
        class="input input-bordered w-full mb-2"
      />
      <input
        v-model="form.email"
        type="email"
        placeholder="Email"
        class="input input-bordered w-full mb-2"
      />

      <div class="flex align-middle gap-2">
        <!-- If want to set new password -->
        <input
          :disabled="!setNewPassword && form.id !== undefined"
          v-model="form.password"
          type="text"
          placeholder="Password"
          class="input input-bordered w-full mb-2"
          required
        />
        <!-- Icon to enable set new password -->
        <button
          v-if="form.id !== undefined"
          @click="setNewPassword = !setNewPassword"
          class="btn w-32"
        >
          {{ setNewPassword ? "Cancel" : "New Password" }}
        </button>
      </div>
      <input
        v-model="form.position"
        type="text"
        placeholder="Position"
        class="input input-bordered w-full mb-2"
      />
      <select
        v-model="form.role"
        class="select select-bordered w-full mb-2"
        required
      >
        <option selected value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <div class="flex justify-end mt-4">
        <button
          @click="$emit('close')"
          type="button"
          class="btn text-white btn-error mr-2 px-8"
        >
          Cancel
        </button>
        <button
          @click="save"
          type="submit"
          class="btn text-white btn-success px-10"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import type { User } from "~/types/user";

const props = defineProps<{ user?: User | null }>();
const emit = defineEmits(["save", "close"]);

const form = ref<User>({
  name: "",
  position: "",
  contact: "",
  email: "",
  role: "user",
  password: "",
});

const setNewPassword = ref(false);

onMounted(() => {
  if (props.user) {
    form.value = { ...props.user };
  } else {
    form.value = {
      name: "",
      email: "",
      contact: "",
      position: "",
      role: "user",
      password: "",
    };
  }
});

// Save User
const save = () => {
  emit("save", form.value);
};
</script>
