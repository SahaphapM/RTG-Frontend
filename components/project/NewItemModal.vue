<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h2 class="text-xl font-bold mb-4">Create New Item</h2>

      <input
        v-model="form.name"
        type="text"
        placeholder="Item Name"
        class="input input-bordered w-full mb-4"
        required
      />
      <input
        v-model="form.price"
        type="number"
        step="10000"
        placeholder="Price"
        class="input input-bordered w-full mb-4"
        required
      />

      <div class="flex justify-between mt-6">
        <button @click="$emit('close')" class="btn btn-primary w-32 text-white">
          Cancel
        </button>
        <button @click="createItem" class="btn btn-success text-white w-32">
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import type { Item } from "~/types/item";

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "create-item"]);

const form = ref({ name: "", price: 0 });

const createItem = () => {
  if (!form.value.name || form.value.price <= 0) return;
  emit("create-item", { ...form.value });
  form.value = { name: "", price: 0 };
};
</script>
