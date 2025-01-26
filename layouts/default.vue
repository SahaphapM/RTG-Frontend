<template>
  <div class="flex flex-col min-h-screen">
    <!-- Sidebar with v-model -->

    <div class="transition-all duration-500" :class="isOpen ? 'ml-64' : 'ml-0'">
      <Navbar @toggle-sidebar="toggle" />
    </div>

    <Sidebar v-model:isOpen="isOpen" :update:isOpen="isOpen" />
    <!-- Toggle Button: Moves Smoothly with Sidebar -->
    <!-- <button
      @click="toggle"
      class="btn fixed top-4 transition-transform duration-500 ease-in-out z-50"
      :class="isOpen ? 'translate-x-48' : 'translate-x-4'"
    >
      ☰
    </button> -->

    <!-- Content Area -->
    <div
      class="flex-1 p-6 transition-all duration-300"
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
  console.log(isOpen.value);
  isOpen.value = !isOpen.value;
  console.log(isOpen.value);
};
</script>
