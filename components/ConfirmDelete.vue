<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
    >
      <div class="bg-white p-6 rounded-lg w-96 shadow-lg text-center">
        <h2 class="text-xl font-bold text-red-600">{{ title }}</h2>
        <p class="mt-2 text-gray-700">{{ message }}</p>
        <div class="mt-4 flex justify-center gap-4">
          <button @click="$emit('cancel')" class="btn btn-active px-8">
            {{ cancelText }}
          </button>
          <button @click="$emit('confirm')" class="btn btn-error">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps({
  isOpen: Boolean, // Show/hide modal
  title: String, // Modal title
  message: String, // Modal message
  confirmText: { type: String, default: "Delete" }, // Confirm button label
  cancelText: { type: String, default: "Cancel" }, // Cancel button label
});

defineEmits(["confirm", "cancel"]);
</script>

<!-- Fade Animation -->
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
