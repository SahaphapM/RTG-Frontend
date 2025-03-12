<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
      <h2 class="text-xl font-bold mb-4">Search Item</h2>

      <input
        v-model="searchQuery"
        placeholder="Search items..."
        class="input input-bordered w-full mb-4"
      />

      <ul
        class="max-h-60 overflow-y-auto border rounded-md bg-white shadow-lg divide-y divide-gray-200"
      >
        <li
          v-for="item in filteredItems"
          :key="item.id"
          @click="selectItem(item)"
          class="p-3 hover:bg-blue-100 cursor-pointer flex justify-between items-center transition duration-200"
        >
          <span>{{ item.name }}</span>
          <span>
            <div class="flex gap-4">
              <div class="text-black">
                {{ item.price.toLocaleString() }} Bath
              </div>
              <!-- trash icon -->

              <button
                @click.stop="deleteItem(item)"
                class="btn text-white btn-error btn-xs"
              >
                <TrashIcon class="w-4 h-4" color="white" />
              </button>
            </div>
          </span>
        </li>
      </ul>

      <div class="flex justify-between mt-6">
        <button
          @click="$emit('close')"
          class="btn text-white btn-primary text-md font-bold w-32"
        >
          Cancel
        </button>
        <button
          @click="$emit('new-item')"
          class="btn text-white btn-primary text-md font-bold w-32"
        >
          New Item
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from "lucide-vue-next";
import { ref, defineProps, defineEmits, computed } from "vue";
import type { Item } from "~/types/item";

const props = defineProps<{ isOpen: boolean; items: Item[] }>();
const emit = defineEmits(["close", "select-item", "new-item", "delete-item"]);

const searchQuery = ref("");

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items;
  return props.items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectItem = (item: Item) => {
  searchQuery.value = "";
  emit("select-item", item);
};

const deleteItem = (item: Item) => {
  emit("delete-item", item);
};
</script>

<style scoped>
/* Optional: Make scrolling smoother */
.overflow-y-auto {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #ccc transparent; /* Firefox */
}

/* For Chrome, Edge, and Safari */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
</style>
