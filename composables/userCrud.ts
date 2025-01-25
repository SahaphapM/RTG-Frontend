import { useFetch } from "#app";
import type { User } from "~/type/user";

export default function useCrud() {
  const fetchUsers = async () => {
    const { data } = await useFetch("/api/users");
    return data.value;
  };

  const createUser = async (user: User) => {
    await useFetch("/api/users", {
      method: "POST",
      body: user,
    });
  };

  return { fetchUsers, createUser };
}
