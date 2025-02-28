<template>
  <div class="navbar bg-base-100 shadow-md px-4">
    <!-- Left Section: Menu Toggle (Mobile) & Logo -->
    <div class="flex-1 gap-6">
      <button @click="$emit('toggle-sidebar')" class="btn btn-ghost">☰</button>
      <NuxtLink to="/" class="text-xl font-bold"></NuxtLink>
    </div>

    <!-- Middle Section: Nav Links (Desktop) -->
    <div class="flex flex-col mx-4 leading-2">
      <span class="font-bold text-md">{{ authStore.user?.name }}</span>
      <div class="text-sm font-semibold">
        <div class="flex gap-x-1" v-if="authStore.user?.role === 'admin'">
          {{ "Admin" }}
        </div>
        <span class="text-sm" v-else>
          {{ authStore.user?.position || "Manager" }}
        </span>
      </div>
    </div>

    <!-- Right Section: Profile Dropdown -->
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <button class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img src="../public/image/user-icon-thumb.png" alt="User Avatar" />
          </div>
        </button>
        <!-- <ul
          tabindex="0"
          class="dropdown-content menu menu-sm bg-base-200 rounded-lg shadow-md mt-2 w-48"
        >
          <li>
            <NuxtLink to="/profile">
              <UserIcon class="w-4 h-4" /> Profile
            </NuxtLink>
          </li>
          <li>
            <button @click="logout">
              <LogOutIcon class="w-4 h-4 text-red-500" /> Logout
            </button>
          </li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import {
  MenuIcon,
  UserIcon,
  LogOutIcon,
  MenuSquareIcon,
} from "lucide-vue-next";

const authStore = useAuthStore();

const rolePosition = computed(() => {
  if (authStore.user?.role) {
  }
});

defineEmits(["toggle-sidebar"]);

const logout = () => {
  console.log("Logging out...");
};
</script>
