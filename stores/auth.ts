import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useFetch, useRouter, useRuntimeConfig } from "#app";
import type { User } from "~/types/user";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);

  const router = useRouter();
  const URL = useRuntimeConfig().public.apiBase;

  // ✅ Login and fetch user data
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await useFetch(URL + "/auth/login", {
        method: "POST",
        body: { email, password },
        credentials: "include",
      });

      if (error.value) throw new Error(error.value.message);

      await getUser(); // ✅ Fetch user after login
    } catch (err: any) {
      console.error("Login error:", err.message);
    }
  };

  // ✅ Logout and clear user session
  const logout = async () => {
    await useFetch(URL + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    user.value = null;
    router.push("/"); // ✅ Redirect to login page
  };

  // ✅ Fetch user details from `/auth/me`
  const getUser = async () => {
    try {
      const { data, error } = await useFetch<User>(URL + "/auth/me", {
        credentials: "include",
      });

      if (!error.value) {
        user.value = data.value;
      } else {
        user.value = null; // ✅ Ensure user is null if token is invalid
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // ✅ Check authentication before app starts
  const initAuth = async () => {
    await getUser();
  };

  return { user, isAuthenticated, login, logout, getUser, initAuth };
});
