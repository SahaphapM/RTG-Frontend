import { useFetch } from "#app";
import type { PaginationQuery, PaginationResponse } from "~/types/pagination";
import type { User } from "~/types/user";

export default function useServiceUsers() {
  const config = useRuntimeConfig();

  // Reactive state
  const users = ref<User[]>([]);
  const totalPages = ref(1);
  const totalUsers = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const API_URL = `${config.public.apiBase}/users`;

  // Fetch users function
  const fetchUsers = async (query: PaginationQuery) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<
        PaginationResponse<User>
      >(API_URL, {
        query: query,
      });
      if (fetchError.value) throw new Error(fetchError.value.message);

      users.value = data.value?.data || [];
      totalUsers.value = data.value?.total || 0;
      totalPages.value = data.value?.totalPages || 1;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch users.";
      console.error("Error fetching users:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  // Create User
  const createUser = async (
    newUser: Omit<User, "id" | "createdAt" | "updatedAt">
  ) => {
    const { data } = await useFetch<User>(`${config.public.apiBase}/users`, {
      method: "POST",
      body: newUser,
    });
    return data.value;
  };

  // Delete User
  const deleteUser = async (id: number) => {
    try {
      await useFetch(`${config.public.apiBase}/users/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return {
    users,
    totalUsers,
    totalPages,
    isLoading,
    error,
    fetchUsers,
    createUser,
    deleteUser,
  };
}
