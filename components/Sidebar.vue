<template>
  <div>
    <!-- ปุ่ม Toggle สำหรับมือถือ -->
    <button
      @click="toggle"
      class="btn btn-primary fixed top-4 left-4 z-50 transition-transform duration-300"
      :class="isOpen ? 'translate-x-52' : 'translate-x-0'"
    >
      ☰
    </button>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed top-0 left-0 w-64 h-screen bg-base-200 p-4 transition-transform shadow-lg text-center flex flex-col items-center',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <img src="/image/logo.webp" class="w-32 mx-auto mb-4" alt="image" />
      <ul class="menu w-full">
        <li v-for="item in menuItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-2 p-3 rounded-lg transition duration-300"
            :class="{
              'bg-primary text-white': $route.path === item.to,
              'hover:bg-gray-300': $route.path !== item.to,
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
import { ref } from "vue";
import {
  HomeIcon,
  FolderIcon,
  ShoppingCartIcon,
  UsersIcon,
  BriefcaseIcon,
  UserIcon,
  BookText,
} from "lucide-vue-next";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["toggle"]);

const toggle = () => {
  emit("toggle");
};

const menuItems = ref([
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/about", label: "Project", icon: FolderIcon },
  { to: "/purchase-order", label: "Purchase Order", icon: ShoppingCartIcon },
  { to: "/certificate", label: "Certificate", icon: BookText },
  { to: "/customer", label: "Customer", icon: UsersIcon },
  { to: "/subcontractor", label: "Subcontractor", icon: BriefcaseIcon },
  { to: "/user", label: "User", icon: UserIcon },
]);
</script>
