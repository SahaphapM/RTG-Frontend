<template>
  <ItemSearchModal
    :isOpen="isSearchModalOpen"
    :items="availableItems"
    @delete-item="toDeleteItem"
    @close="isSearchModalOpen = false"
    @select-item="addItemToProject"
    @new-item="openNewItemModal"
  />

  <NewItemModal
    :isOpen="isNewItemModalOpen"
    @close="isNewItemModalOpen = false"
    @create-item="addNewItem"
  />
  <div class="mt-2 mb-5">
    <div class="flex justify-between items-center">
      <h2 class="font-semibold">Project Order</h2>
      <div class="flex justify-end gap-4 mb-2">
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

    <!-- Table -->
    <div class="table-container">
      <table class="custom-table">
        <thead>
          <tr>
            <th class="font-semibold">No.</th>
            <th class="font-semibold">Name</th>
            <th class="font-semibold text-right">Price</th>
            <th class="w-[200px] font-semibold text-center">Qty</th>
            <th class="w-[100px] font-semibold text-right">Value</th>
            <td class="w-[10px]"></td>
            <th class="w-[100px] font-semibold" v-if="isEditing">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in projectItems"
            :key="index"
            class="text-left"
          >
            <td class="">{{ index + 1 }}</td>
            <td class="">{{ item.name }}</td>
            <td class="text-right">
              <input
                v-if="isEditing"
                type="number"
                :step="5000"
                v-model.number="item.price"
                class="input input-sm input-bordered w-30 text-right"
              />
              <span v-else>{{ item.price?.toLocaleString() }}</span>
            </td>
            <td class="">
              <div class="flex justify-center">
                <button
                  @click="$emit('decrease-amount', index)"
                  class="btn btn-sm rounded-lg"
                  v-if="isEditing"
                >
                  ➖
                </button>
                <span class="mx-2 my-auto">{{ item.quantity }}</span>
                <button
                  @click="$emit('increase-amount', index)"
                  class="btn btn-sm rounded-lg"
                  v-if="isEditing"
                >
                  ➕
                </button>
              </div>
            </td>
            <td class="text-right">
              {{ (item.price * item.quantity).toLocaleString() }}
            </td>
            <td>{{}}</td>
            <td v-if="isEditing" class="">
              <button
                @click="$emit('remove-item', index)"
                class="btn btn-error btn-sm rounded-lg"
              >
                <TrashIcon class="w-4 h-4" color="white" />
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="text-lg" style="background-color: rgb(231, 231, 231)">
            <td></td>
            <td></td>
            <td></td>
            <td class="font-semibold text-center">Total Value</td>
            <td class="font-semibold flex justify-center">
              <div>{{ totalValue.toLocaleString() }}</div>
            </td>
            <td v-if="isEditing" class="font-semibold">
              {{ isEditing ? "Baht" : "" }}
            </td>
            <td class="font-semibold text-left">
              {{ !isEditing ? "Baht" : "" }}
            </td>
          </tr>
        </tfoot>
      </table>
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

const { createItem, fetchItems, deleteItem } = useItemService();

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

const totalValue = computed(() => {
  return props.projectItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
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

const toDeleteItem = (item: Item) => {
  deleteItem(item.id);
  availableItems.value = availableItems.value.filter((i) => i.id !== item.id);
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
.table-container {
  overflow-x: auto;
  background: #ffffff;
  border-radius: 8px;
}
/* Table */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

/* Table Header */
.custom-table thead tr {
  background: rgb(231, 231, 231);

  text-align: left;
  font-size: 15px;
  color: #1d1d1d;
}

.custom-table th {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Table Body */
.custom-table td {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.custom-table tfoot tr td {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  background: rgb(243, 243, 243);
}
</style>
