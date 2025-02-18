import { defineStore } from "pinia";
import { ref } from "vue";
import useServiceUsers from "~/composables/usersService";
import type { PaginationQuery } from "~/types/pagination";
import type { User } from "~/types/user";

export const useUserStore = defineStore("user", () => {
  const { users, totalPages, totalUsers, isLoading, fetchUsers, deleteUser } =
    useServiceUsers();

  // Default pagination params
  const query = ref<PaginationQuery>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "name",
    order: "ASC",
  });

  // **Wrapper function to fetch users (calls fetchUsers from composable)**
  const getUsers = async () => {
    console.log("query", query.value);
    await fetchUsers(query.value); // This will update the `users` state automatically
  };

  return {
    users,
    totalUsers,
    totalPages,
    isLoading,
    getUsers,
    deleteUser,
    query,
  };
});
