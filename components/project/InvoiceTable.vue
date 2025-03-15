<template>
  <div>
    <!-- Add New Item Button -->
    <div class="flex justify-between items-end">
      <div class="font-semibold text-md">{{ lebel }} Items</div>
      <div class="flex gap-4">
        <button
          v-if="isEditing"
          @click="openSearchModal"
          class="btn btn-primary w-32 text-white"
        >
          Search
        </button>
        <button
          v-if="isEditing"
          @click="addItem()"
          class="btn btn-primary w-32 mb-2 text-white"
        >
          Add Item
        </button>
      </div>
    </div>

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

    <!-- Table -->
    <div class="table-container">
      <table v-if="isEditing || details.length" class="custom-table">
        <thead>
          <tr class="text-center">
            <th class="w-10 font-semibold">No.</th>
            <!-- <th class=" w-1/5">Name</th> -->
            <th class="font-semibold">Description</th>
            <th class="w-40 font-semibold text-center">QTY</th>
            <th class="w-52 font-semibold text-center">Unit Price</th>
            <th class="w-60 text-right font-semibold">Amount</th>
            <th class="w-28 font-semibold text-center" v-if="isEditing">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, index) in details" :key="index" class="">
            <td class="">{{ index + 1 }}</td>

            <td>
              <textarea
                v-model="detail.description"
                class="textarea textarea-bordered w-full h-[10px]"
                :disabled="!isEditing"
              ></textarea>
            </td>
            <td class="">
              <input
                v-model.number="detail.qty"
                type="number"
                :step="1"
                class="input input-bordered text-center w-full"
                min="1"
                :disabled="!isEditing"
              />
            </td>
            <td class="">
              <input
                type="number"
                :step="10000"
                v-model.number="detail.unitPrice"
                class="input input-bordered text-right w-full pr-8"
                min="0"
                :disabled="!isEditing"
              />
            </td>
            <td class="text-right">
              {{
                (
                  (detail.unitPrice || 0) * (detail.qty || 0) || ""
                ).toLocaleString()
              }}
            </td>
            <td class="text-center" v-if="isEditing">
              <button class="btn btn-error btn-sm" @click="removeRow(index)">
                <TrashIcon class="w-4 h-4" color="white" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from "lucide-vue-next";
import { defineProps, defineEmits } from "vue";
import ItemSearchModal from "./ItemSearchModal.vue";
import NewItemModal from "./NewItemModal.vue";
import type { Item } from "~/types/item";
import useItemService from "~/composables/itemService";

// Props to receive details
const props = defineProps(["details", "isEditing", "lebel"]);

// Emit event for updating details in parent
const emit = defineEmits(["update:details"]);
const { createItem, fetchItems, deleteItem } = useItemService();

const isSearchModalOpen = ref(false);
const isNewItemModalOpen = ref(false);

// Emit updates whenever a field changes
const updateDetails = () => {
  emit("update:details", props.details);
};

// Add a new row
const addItem = (item?: Item) => {
  props.details.push({
    description: item?.name ? item.name : "",
    qty: 1,
    unitPrice: item?.price ? item.price : 0,
  });
  updateDetails();
};

// Remove a row and emit update
const removeRow = (index: number) => {
  props.details.splice(index, 1);
  updateDetails();
};

const availableItems = ref<Item[]>([]); // Load available items from API

const addItemToProject = (item: Item) => {
  addItem(item);
  isSearchModalOpen.value = false;
};

const addNewItem = async (newItem: { name: string; price: number }) => {
  const createdItem = await createItem(newItem); // Assume API function exists
  if (!createdItem) return;
  availableItems.value.push(createdItem);
  addItemToProject(createdItem);
  isNewItemModalOpen.value = false;
};

// Watch for changes in details and emit update
watch(
  () => props.details,
  () => {
    // if (props.details.unitPrice === null) props.details.unitPrice = 0;
    // if (props.details.qty === null) props.details.qty = 1;
    // set the unitPrice and qty to 0 if they are null
    props.details.forEach((detail: any) => {
      if (detail.unitPrice === null || detail.unitPrice === "")
        detail.unitPrice = 0;
      if (detail.qty === null || detail.qty === "") detail.qty = 1;
    });

    updateDetails();
  },
  { deep: true }
);

// Watch for changes in isEditing and emit update
watch(
  () => props.isEditing === false,
  () => {
    if (props.details.length === 1) {
      if (
        props.details[0].description === "" &&
        props.details[0].unitPrice === 0 &&
        props.details[0].qty === 1
      ) {
        console.log("Removing row...", props.isEditing);
        removeRow(0);
      }
    }
  }
);

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
  availableItems.value = await fetchItems(); // Fetch available items from API
});
</script>

<style scoped>
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
</style>
