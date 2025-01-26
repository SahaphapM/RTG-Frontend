import { defineStore } from "pinia";
import { ref } from "vue";
import useServiceUsers from "~/composables/usersService";
import type { User } from "~/types/user";

export const useUserStore = defineStore("user", () => {
  const { fetchUsers, deleteUser } = useServiceUsers();

  const users = ref<User[] | null>([]);
  const isloading = ref(false);

  const getUsers = async () => {
    isloading.value = true;
    try {
      users.value = await fetchUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      isloading.value = false;
    }
  };

  return { users, isloading, getUsers, deleteUser };
});
