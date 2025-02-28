import { useFetch } from "#app";
import type { Item } from "~/types/item";
export default function useItemService() {
  const config = useRuntimeConfig();

  // Fetch Items
  const fetchItems = async (): Promise<Item[]> => {
    try {
      const { data } = await useFetch<Item[]>(
        `${config.public.apiBase}/items`,
        {
          credentials: "include",
        }
      );
      return data.value || [];
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  // Create Item
  const createItem = async (item: Partial<Item>) => {
    try {
      console.log("item", item);
      const { data, error } = await useFetch<Item>(
        `${config.public.apiBase}/items`,
        {
          credentials: "include",
          method: "POST",
          body: item,
        }
      );
      console.log("data", error);
      return data.value;
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  // Update Item
  const updateItem = async (id: number, item: Partial<Item>) => {
    try {
      await useFetch(`${config.public.apiBase}/items/${id}`, {
        method: "PUT",
        body: item,
        credentials: "include",
      });
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Delete Item
  const deleteItem = async (id: number) => {
    try {
      await useFetch(`${config.public.apiBase}/items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return { fetchItems, createItem, updateItem, deleteItem };
}
