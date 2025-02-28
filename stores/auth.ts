import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useFetch } from "#app";
import type { User } from "~/types/user";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);

  const router = useRouter();
  const URL = useRuntimeConfig().public.apiBase;

  // ✅ Login และให้ Backend จัดการ Cookie
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await useFetch(URL + "/auth/login", {
        method: "POST",
        body: { email, password },
        credentials: "include", // ✅ ให้ Browser ส่ง-รับ Cookie อัตโนมัติ
      });

      if (error.value) throw new Error(error.value.message);

      await getUser(); // ✅ ดึงข้อมูล User หลังจาก Login
    } catch (err: any) {
      console.error("Login error:", err.message);
    }
  };

  // ✅ Logout และให้ Backend ลบ Cookie
  const logout = async () => {
    await useFetch(URL + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    user.value = null;
    router.push("/");
  };

  // ✅ ดึงข้อมูล User จาก Cookie
  const getUser = async () => {
    const { data, error } = await useFetch<User>(URL + "/auth/me", {
      credentials: "include", // ✅ ให้ส่ง Cookie ไปกับ Request
    });

    if (!error.value) {
      user.value = data.value;
      console.log("data value : : :", user.value);

      if (user.value && router.currentRoute.value.path === "/") {
        router.push("/projects");
      }
    }
  };

  return { user, isAuthenticated, login, logout, getUser };
});
