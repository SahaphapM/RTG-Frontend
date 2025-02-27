<template>
  <div>
    <!-- Mobile Toggle Button -->

    <!-- Sidebar -->
    <div
      :class="[
        'fixed top-0 left-0 w-64 h-screen shadow-xl p-4 transition-transform  duration-500 text-center flex flex-col items-center',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <img
        src="/image/Sidebar-logo.png"
        class="w-32 mx-auto mb-4"
        alt="image"
      />

      <ul class="menu w-full">
        <li v-for="item in menuItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center p-3 rounded-lg transition duration-300 text-xl gap-4 mt-2"
            :class="{
              'bg-base-300 ': $route.path === item.to,
            }"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import {
  HomeIcon,
  FolderIcon,
  ShoppingCartIcon,
  UsersIcon,
  BriefcaseIcon,
  UserIcon,
  BookText,
} from "lucide-vue-next";

// Use v-model for reactivity
const props = defineProps<{ isOpen: boolean }>();

// Sidebar menu items
const menuItems = [
  // { to: "/", label: "Home", icon: HomeIcon },
  { to: "/projects", label: "Project", icon: FolderIcon },
  { to: "/purchase-orders", label: "Purchase Order", icon: ShoppingCartIcon },
  { to: "/certificates", label: "Certificate", icon: BookText },
  { to: "/customers", label: "Customer", icon: UsersIcon },
  { to: "/subcontractors", label: "Subcontractor", icon: BriefcaseIcon },
  { to: "/users", label: "User", icon: UserIcon },
];
</script>
