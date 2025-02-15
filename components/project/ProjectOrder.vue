<template>
  <ItemSearchModal
    :isOpen="isSearchModalOpen"
    :items="availableItems"
    @close="isSearchModalOpen = false"
    @select-item="addItemToProject"
    @new-item="openNewItemModal"
  />

  <NewItemModal
    :isOpen="isNewItemModalOpen"
    @close="isNewItemModalOpen = false"
    @create-item="addNewItem"
  />
  <div class="mt-10">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-semibold">Project Order</h2>
      <div class="flex justify-end gap-2 mb-2">
        <button
          v-if="isEditing"
          @click="openSearchModal"
          class="btn btn-primary w-32"
        >
          Search
        </button>
        <button
          v-if="isEditing"
          @click="openNewItemModal"
          class="btn btn-primary w-32"
        >
          New Item
        </button>
      </div>
    </div>

    <table class="table w-full border border-gray-200">
      <thead>
        <tr class="bg-base-300 text-lg">
          <th>No.</th>
          <th>Name</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Value</th>
          <th v-if="isEditing">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in projectItems" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.item.name }}</td>
          <td>
            <input
              v-if="isEditing"
              v-model.number="item.price"
              class="input input-sm input-bordered w-24 text-center"
            />
            <span v-else>
              {{ item.price }}
            </span>
          </td>
          <td>
            <div class="flex items-center">
              <button
                @click="$emit('decrease-amount', index)"
                class="btn btn-sm"
                v-if="isEditing"
              >
                ➖
              </button>
              <span class="mx-2">{{ item.quantity }}</span>
              <button
                @click="$emit('increase-amount', index)"
                class="btn btn-sm"
                v-if="isEditing"
              >
                ➕
              </button>
            </div>
          </td>
          <td>
            {{
              ((item.price || item.item.price) * item.quantity).toLocaleString()
            }}
          </td>
          <td v-if="isEditing">
            <button
              @click="$emit('remove-item', index)"
              class="btn btn-error btn-sm"
            >
              <TrashIcon class="w-4 h-4" color="white" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end mt-4 font-semibold text-lg">
      <!-- <span>{{ `Item Qty :    ${totalAmount} ` }}</span> -->
      <span>{{
        `Total Value :    ${totalValue.toLocaleString()}   Baht`
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import useItemService from "~/composables/itemService";
import type { Item } from "~/types/item";
import type { ProjectItem } from "~/types/projectItem";
import NewItemModal from "./NewItemModal.vue";
import ItemSearchModal from "./ItemSearchModal.vue";
import { TrashIcon } from "lucide-vue-next";

const props = defineProps<{
  projectItems: ProjectItem[];
  isEditing: boolean;
}>();

const { createItem } = useItemService();
const { fetchItems } = useItemService();

const emit = defineEmits([
  "increase-amount",
  "decrease-amount",
  "add-item",
  "remove-item",
  "search-item",
  "select-item",
]);
const isSearchModalOpen = ref(false);
const isNewItemModalOpen = ref(false);

// Computed properties
const totalAmount = computed(() => {
  return props.projectItems.reduce((sum, item) => sum + item.quantity, 0);
});

const totalValue = computed(() => {
  return props.projectItems.reduce(
    (sum, item) => sum + (item.price || item.item.price) * item.quantity,
    0
  );
});

const availableItems = ref<Item[]>([]); // Load available items from API

const addItemToProject = (item: Item) => {
  emit("add-item", item);
  isSearchModalOpen.value = false;
};

const addNewItem = async (newItem: { name: string; price: number }) => {
  const createdItem = await createItem(newItem); // Assume API function exists
  if (!createdItem) return;
  availableItems.value.push(createdItem);
  addItemToProject(createdItem);
  isNewItemModalOpen.value = false;
};

const openNewItemModal = () => {
  isSearchModalOpen.value = false;
  isNewItemModalOpen.value = true;
};

const openSearchModal = () => {
  isSearchModalOpen.value = true;
};

onMounted(async () => {
  nextTick(async () => {
    availableItems.value = await fetchItems(); // Fetch available items from API
  });
});
</script>

<style scoped>
button {
  font-weight: 700;
}
</style>
