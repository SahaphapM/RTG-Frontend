<template>
  <div class="navbar bg-base-100 shadow-md px-4">
    <!-- Left Section: Menu Toggle (Mobile) & Logo -->
    <div class="flex-1 gap-6">
      <button @click="$emit('toggle-sidebar')" class="btn btn-ghost">☰</button>
      <NuxtLink to="/" class="text-xl font-bold"></NuxtLink>
    </div>

    <!-- Middle Section: Nav Links (Desktop) -->
    <div class="flex flex-col items-end mx-4 leading-2">
      <span class="font-semibold text-lg"> {{ user?.name }}</span>

      <span class="font-semibold text-sm"> {{ user?.position }}</span>
    </div>

    <!-- Right Section: Profile Dropdown -->

    <div class="flex flex-col">
      <button class="btn btn-ghost btn-circle avatar btn-md">
        <div class="w-10 rounded-full">
          <img src="../public/image/user-icon-thumb.png" alt="User Avatar" />
        </div>
      </button>
      <div class="text-xs font-bold" style="margin-top: -6px">
        {{ user?.role === "admin" ? "Admin" : "User" }}
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
