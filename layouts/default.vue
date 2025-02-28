<template>
  <div class="flex flex-col min-h-screen">
    <!-- Sidebar with v-model -->

    <div class="transition-all duration-500" :class="isOpen ? 'ml-64' : 'ml-0'">
      <Navbar @toggle-sidebar="toggle" />
    </div>

    <Sidebar v-model:isOpen="isOpen" :update:isOpen="isOpen" />

    <div
      class="flex-1 px-6 transition-all duration-300"
      :class="isOpen ? 'ml-64' : 'ml-8'"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/Sidebar.vue";
import { ref } from "vue";

const isOpen = ref(true);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>
