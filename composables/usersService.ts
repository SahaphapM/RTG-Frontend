import { useFetch } from "#app";
import type { User } from "~/types/user";

export default function useServiceUsers() {
  const config = useRuntimeConfig();

  // Fetch Users
  const fetchUsers = async (): Promise<User[]> => {
    try {
      const { data } = await useFetch<User[]>(`${config.public.apiBase}/users`);
      return data.value || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
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

  return { fetchUsers, createUser, deleteUser };
}
