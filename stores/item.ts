import { defineStore } from "pinia";
import { ref } from "vue";
import useItemService from "~/composables/itemService";
import type { Item } from "~/types/item";

export const useItemStore = defineStore("item", () => {
  const { fetchItems, createItem, updateItem, deleteItem } = useItemService();

  const items = ref<Item[]>([]);
  const isLoading = ref(false);

  // Fetch Items
  const getItems = async () => {
    isLoading.value = true;
    try {
      items.value = await fetchItems();
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    items,
    isLoading,

    getItems,
    createItem,
    updateItem,
    deleteItem,
  };
});
