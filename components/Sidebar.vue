<template>
  <div>
    <div
      :class="[
        'fixed top-0 left-0 w-64 h-screen shadow-xl p-4 transition-transform  duration-500 text-center  flex flex-col justify-between',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div>
        <img
          src="/image/Sidebar-logo.png"
          class="w-32 mx-auto mb-4"
          alt="image"
        />

        <ul class="menu w-full">
          <li v-for="item in filteredMenu" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="flex items-center font-medium p-3 rounded-lg transition duration-300 text-xl gap-4 mt-2"
              :class="{
                'bg-gray-200 ': $route.path === item.to,
              }"
            >
              <component :is="item.icon" class="w-6 h-6" />
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <!-- ✅ Logout Button at the Bottom -->
      <button
        @click="logout"
        class="flex font-medium items-center p-3 rounded-lg transition duration-300 text-xl gap-4 mt-4 hover:bg-red-700 hover:text-white text-black w-full"
      >
        <LogOutIcon class="w-6 h-6" />
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import {
  FolderIcon,
  ShoppingCartIcon,
  UsersIcon,
  BriefcaseIcon,
  UserIcon,
  BookText,
  LogOutIcon,
} from "lucide-vue-next";

// Use v-model for reactivity
const props = defineProps<{ isOpen: boolean }>();

// ✅ Get Auth Store
const authStore = useAuthStore();

const userRole = computed(() => authStore.user?.role); // ✅ Get user role

// Define menu items
const allMenuItems = [
  {
    to: "/projects",
    label: "Project",
    icon: FolderIcon,
    roles: ["admin", "user"],
  },
  {
    to: "/purchase-orders",
    label: "Purchase Order",
    icon: ShoppingCartIcon,
    roles: ["admin", "user"],
  },
  {
    to: "/certificates",
    label: "Certificate",
    icon: BookText,
    roles: ["admin", "user"],
  },
  {
    to: "/customers",
    label: "Customer",
    icon: UsersIcon,
    roles: ["admin", "user"],
  },
  {
    to: "/subcontractors",
    label: "Subcontractor",
    icon: BriefcaseIcon,
    roles: ["admin", "user"],
  },
  { to: "/users", label: "User", icon: UserIcon, roles: ["admin"] },
];

// ✅ Filter menu based on user role
const filteredMenu = computed(() => {
  return allMenuItems.filter((item) => item.roles.includes(userRole.value!));
});

const logout = authStore.logout;
</script>
