<template>
  <div class="navbar bg-base-100 shadow-md px-4">
    <!-- Left Section: Menu Toggle (Mobile) & Logo -->
    <div class="flex-1 gap-6">
      <button @click="$emit('toggle-sidebar')" class="btn btn-ghost">☰</button>
      <NuxtLink to="/" class="text-xl font-bold"></NuxtLink>
    </div>

    <!-- Middle Section: Nav Links (Desktop) -->
    <div class="flex flex-col items-end mx-4 leading-2">
      <span class="font-semibold text-lg">{{ user?.name }}</span>
      <div class="text-sm font-semibold">
        {{ user?.role === "admin" ? "Admin" : "User" }}
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

const authStore = useAuthStore();

// watch for changes  in authStore.user
const user = computed(() => authStore.user);

defineEmits(["toggle-sidebar"]);
</script>
