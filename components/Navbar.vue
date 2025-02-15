<template>
  <div class="navbar bg-base-100 shadow-md px-4">
    <!-- Left Section: Menu Toggle (Mobile) & Logo -->
    <div class="flex-1 gap-6">
      <button @click="$emit('toggle-sidebar')" class="btn btn-ghost">☰</button>
      <NuxtLink to="/" class="text-xl font-bold"></NuxtLink>
    </div>

    <!-- Middle Section: Nav Links (Desktop) -->
    <div class="hidden lg:flex space-x-4">
      <NuxtLink to="/" class="btn btn-ghost">Home</NuxtLink>
      <NuxtLink to="/about" class="btn btn-ghost">About</NuxtLink>
      <NuxtLink to="/services" class="btn btn-ghost">Services</NuxtLink>
      <NuxtLink to="/contact" class="btn btn-ghost">Contact</NuxtLink>
    </div>

    <!-- Right Section: Profile Dropdown -->
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <button class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img src="../public/image/ceoMavin.webp" alt="User Avatar" />
          </div>
        </button>
        <ul
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
        </ul>
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

defineEmits(["toggle-sidebar"]);

const logout = () => {
  console.log("Logging out...");
};
</script>
