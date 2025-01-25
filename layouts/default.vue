<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <Sidebar :isOpen="isOpen" @toggle="toggleSidebar" />

    <!-- Content -->
    <div
      class="flex-1 p-6 transition-all duration-300"
      :class="isOpen ? 'ml-64' : 'ml-0 '"
    >
      <!-- เพิ่ม ml-64 เพื่อดันเนื้อหา -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/Sidebar.vue";
const isOpen = ref(true);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};
</script>
