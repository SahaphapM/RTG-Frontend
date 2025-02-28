import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && to.path !== "/") {
    return navigateTo("/"); // ✅ ถ้ายังไม่ล็อกอินให้ไปหน้า Login
  }
});
